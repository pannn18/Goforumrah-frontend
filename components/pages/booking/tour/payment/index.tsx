import React, { useEffect, useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import BannerInfo from '@/components/pages/home/bannerInfo'
import TourBookingSummary from '../summary'
import { useRouter } from 'next/router'
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import LoadingOverlay from '@/components/loadingOverlay/index'
import StripePaymentElements from './stripe'
import { Stripe, loadStripe } from '@stripe/stripe-js'

interface IProps {
  // handleNextStep: () => void
  data: any
  resolvedUrl: string
  summaryData: any
}

const BookingPayment = ({ data, resolvedUrl, summaryData }: IProps) => {
  const objData = data[0] || [];

  const price = typeof objData?.total_price === 'string' ? parseInt(objData?.total_price) : objData?.total_price;

  const router = useRouter()
  const { idTourBooking } = router.query;

  const idTourBookingNumber = Number(idTourBooking);

  // console.log('price tour: ', price);
  // console.log('idTourBooking tour: ', idTourBookingNumber);

  // console.log('data tour: ', data);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(!price ? 'Unknown price' : null);

  // Start::Stripe logic
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);

  const initializeStripe = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) return;

    const [stripePromise, stripeClientSecret] = await Promise.all([
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: Math.round(price * 1), currency: 'usd', }), // Adjust amount and currency as needed
          });

          const data = await response.json();
          if (data.clientSecret) {
            resolve(data.clientSecret);
          } else {
            resolve(null)
            // Handle error scenario where client secret is not retrieved
          }
        } catch (error) {
          // Handle fetch error
          resolve(null)
          console.error(error);
        }
      })
    ]);

    if (!stripePromise || !stripeClientSecret) return setError('Failed to initialize stripe.')

    setStripePromise(stripePromise)
    setStripeClientSecret(stripeClientSecret as string)
  }
  // End::Stripe logic

  useEffect(() => {
    (async () => {
      setLoading(true)

      await initializeStripe()

      setLoading(false)
    })()
  }, []); // Trigger the fetch when the currentPage changes

  const calculateRemainingTime = () => {
    const createdAtTimestamp = new Date(objData.created_at || null).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceInSeconds = Math.floor((currentTime - createdAtTimestamp) / 1000);

    // Set a limit for the countdown (e.g., 24 hours)
    const maxCountdown = 24 * 60 * 60;

    return Math.max(maxCountdown - timeDifferenceInSeconds, 0);
  };

  // Create a state variable for the remaining time (in seconds)
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, []);

  function removeQueryParameters(url) {
    /// Use regex to remove specified query parameters and the leading "?"
    return url.replace(/(\?|&)id_plan=[^&]*/g, '').replace(/(\?|&)start_date=[^&]*/g, '').replace(/(\?|&)tickets=[^&]*/g, '').replace(/\?$/, '');
  }


  return (
    <>
      {loading && <LoadingOverlay />}
      {error && <LoadingOverlay title='An Error Occured' subtitle={error || 'Unknown error'} />}

      <TimerSection data={objData} />

      <div className="container">
        <div className="booking-hotel__wrapper">
          <div className="booking-hotel__inner">
            <BannerSection />
            {!!(stripePromise && stripeClientSecret) && (
              <StripePaymentElements
                tourBookingID={idTourBookingNumber}
                price={price}
                stripe={stripePromise}
                clientSecret={stripeClientSecret}
                currentURL={resolvedUrl}
                onError={(error) => setError(error)}
                onSuccess={() => router.replace(removeQueryParameters(resolvedUrl) + '/complete')}
              />
            )}
          </div>
          <TourBookingSummary data={summaryData} bookingData={objData} />
        </div>
      </div>
    </>
  )
}

const TimerSection = (props) => {
  const calculateRemainingTime = () => {
    const createdAtTimestamp = new Date(props.data.created_at).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceInSeconds = Math.floor((currentTime - createdAtTimestamp) / 1000);

    // Set a limit for the countdown (e.g., 24 hours)
    const maxCountdown = 24 * 60 * 60;

    return Math.max(maxCountdown - timeDifferenceInSeconds, 0);
  };

  // Create a state variable for the remaining time (in seconds)
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime);

  // Update the countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    // Clear the interval when the component unmounts
    return () => {
      clearInterval(timer);
    };
  }, []);


  return (
    <div className="booking-hotel__timer">
      <div className="container">
        <div className="booking-hotel__timer-wrapper">
          <p>Complete our payment in</p>
          <div className="booking-hotel__timer-countdown">
            <div className="booking-hotel__timer-number">{Math.floor(remainingTime / 3600).toString().padStart(2, '0')}</div>
            <p>:</p>
            <div className="booking-hotel__timer-number">{Math.floor((remainingTime % 3600) / 60).toString().padStart(2, '0')}</div>
            <p>:</p>
            <div className="booking-hotel__timer-number">{(remainingTime % 60).toString().padStart(2, '0')}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BannerSection = () => {
  const bannerInfo =
  {
    title: '',
    description: 'In response to Coronavirus (COVID-19), additional safety and sanitation measures are in effect at this property.',
    icon: Icons.FaceMask,
    linkText: 'Learn More',
    linkURL: '#'
  }

  return (
    <div className="">
      <BannerInfo {...bannerInfo} />
    </div>
  )
}


const PaymentSection = ({ dataPaymentUser, setDataPaymentUser }) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Update state with the new value based on input name
    setDataPaymentUser(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="booking-tour__card">
      <div className="booking-tour__card-row">
        <p className="booking-tour__card-title">Payment Details</p>
        <div className="booking-tour__card-icon">
          <SVGIcon src={Icons.PaymentMastercard} width={32} height={24} />
          <SVGIcon src={Icons.PaymentVisa} width={32} height={24} />
          <SVGIcon src={Icons.PaymentAmex} width={32} height={24} />
          <SVGIcon src={Icons.PaymentDci} width={32} height={24} />
          <SVGIcon src={Icons.PaymentJcb} width={32} height={24} />
          <SVGIcon src={Icons.PaymentDiscover} width={32} height={24} />
        </div>
      </div>
      <div className="booking-tour__payment">
        <div className="booking-tour__payment-block w-100">
          <label htmlFor="card_name">Cardholder's Name</label>
          <input value={dataPaymentUser?.card_name} onChange={handleInputChange} type="text" name="card_name" id="card_name" placeholder="Enter Cardholder name" />
        </div>
        <div className="booking-tour__payment-block w-100">
          <label htmlFor="card_number">Card number</label>
          <input value={dataPaymentUser?.card_number} onChange={handleInputChange} type="text" name="card_number" id="card_number" placeholder="0000 0000 0000 0000" />
        </div>
        <div className="booking-tour__payment-block w-100">
          <label htmlFor="card_type">Card Type</label>
          <select value={dataPaymentUser?.card_type} onChange={handleInputChange} name="card_type" id="card_type" placeholder="Select your card type">
            <option value="asia">Credit Card</option>
            <option value="europe">Debit Card</option>
            <option value="rusia">Regular Bank</option>
          </select>
        </div>
        <div className="booking-tour__payment-row w-100">
          <div className="booking-tour__payment-block w-100">
            <label htmlFor="expired_date">Expiry Date</label>
            <div className="booking-tour__payment-input">
              <input value={dataPaymentUser?.expired_date} onChange={handleInputChange} type="text" name="expired_date" id="expired_date" placeholder="MM / YY" />
              <SVGIcon className="booking-tour__payment-input--icon" src={Icons.Calendar} width={20} height={20} />
            </div>
          </div>
          <div className="booking-tour__payment-block w-100">
            <label htmlFor="cvv">CVV/CVC</label>
            <input value={dataPaymentUser?.cvv} type="number" name="cvv" id="cvv" placeholder="000" />
          </div>
        </div>

      </div>
    </div>
  )
}

// const FooterSection = (props: IProps) => {
//   const router = useRouter()
//   const { id_plan, tickets } = router.query

//   const foundPlan = props.data?.tour_plans?.find(plan => plan.id_tour_plan === Number(id_plan));
//   const totalPrice = parseFloat(foundPlan?.price) * Number(tickets);

//   return (
//     <div className="booking-tour__card">
//       <div className="booking-tour__footer">
//         <div className="booking-tour__footer-total">
//           <p>Total :</p>
//           <div className="booking-tour__footer-price">
//             <h5>$ {totalPrice}</h5>
//             <a href="#" className="booking-tour__footer-details">See pricing details</a>
//           </div>
//         </div>
//         <button onClick={props.handleNextStep} type="button" className="btn btn-lg btn-success">Complete Booking</button>
//       </div>
//     </div>
//   )
// }


export default BookingPayment
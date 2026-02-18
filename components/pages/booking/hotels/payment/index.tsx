import React, { useState, useEffect } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import HotelBookingSummary from '@/components/pages/booking/hotels/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import LoadingOverlay from '@/components/loadingOverlay/index'
import StripePaymentElements from './stripe'
import { Stripe, loadStripe } from '@stripe/stripe-js'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

interface IProps {
  data: any
  resolvedUrl: string
}
interface formProps {
  formData: {
    id_hotel_booking: number,
    card_name: string,
    card_number: string,
    card_type: string,
    expired_date: string,
    cvv: number,
  };
}
interface handleInputChangeProps {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
interface handleSelectChangeProps {
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface handleSubmitProps {
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const BookingPayment = ({ data, resolvedUrl }: IProps) => {
  const price = data?.hotel_layout?.price;
  const idHotelBooking = data?.id_hotel_booking;

  const router = useRouter()

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
            body: JSON.stringify({ amount: Math.round(price * 100), currency: 'usd', }), // Adjust amount and currency as needed
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

  return (
    <>
      {loading && <LoadingOverlay />}
      {error && <LoadingOverlay title='An Error Occured' subtitle={error || 'Unknown error'} />}

      <Countdown data={data} />

      <div className="container">
        <div className="booking-hotel__wrapper">
          <div className="booking-hotel__inner">
            <BannerSection />

            {!!(stripePromise && stripeClientSecret) && (
              <StripePaymentElements
                hotelBookingID={idHotelBooking}
                stripe={stripePromise}
                clientSecret={stripeClientSecret}
                price={price}
                currentURL={resolvedUrl}
                onError={(error) => setError(error)}
                onSuccess={() => router.replace(resolvedUrl + '/complete')}
              />
            )}
          </div>
          <HotelBookingSummary data={data} />
        </div>
      </div>
    </>
  )
}

const Countdown = (props) => {
  // console.log('Countdown : ', props.data);

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


export default BookingPayment
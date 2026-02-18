import React, { useState, useEffect } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import LoyaltyCheckoutSummary from '../summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import { callAPI } from '@/lib/axiosHelper'
import { RFHDate, RFHInput, RFHSelect } from '@/components/forms/fields'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingOverlay from '@/components/loadingOverlay/index'

interface IProps {
  handleNextStep?: () => void
  data?: any
  bookingDetailData?: any
  onDataPaymentSubmit?: (formData: any) => void;
}
interface formProps{
  formData: {
    id_car_booking: number,
    card_name: string,
    card_number: string,
    card_type: string,
    expired_date: string,
    cvv: number,
  };
}
interface handleInputChangeProps{
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
interface handleSelectChangeProps {
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface handleSubmitProps{
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const BookingPayment = (props: IProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data, bookingDetailData } = props  
  // Convert the array to an object using destructuring
  const [dataPaymentUser, setDataPaymentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // console.log('Booking Detail Data :', bookingDetailData);

  // console.log(queryParams)

  //Forms
  const [formData, setFormData] = useState({
    id_car_booking: null,
    card_name: "",
    card_number: "",
    card_type: "",
    expired_date: "",
    cvv: null,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Booking Payment Form Data Update : ', formData);
  };

  const handleInputCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Format the card number with spaces every 4 characters
    let formattedValue = numericValue.replace(/(\d{4})/g, '$1 ');
  

    if (numericValue.length >= 16) {
      // If 16 or more characters are entered, prevent further input but allow deletion
      formattedValue = formattedValue.slice(0, 19); // Truncate to 16 characters
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      card_number: formattedValue,
    }));

    // console.log('Booking Payment Form Data Update : ', formData);
  };

  
  const handleInputExpiredDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    if (numericValue.length >= 5) {
      event.target.value = numericValue.slice(0, 5);
    } else {
      // Format the input as "MM / YY"
      let formattedValue = numericValue;

      if (numericValue.length > 2) {
        // Add a space after the first 2 characters
        formattedValue = numericValue.slice(0, 2) + ' / ' + numericValue.slice(2);
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        expired_date: formattedValue,
      }));
    }

    // console.log('Booking Payment Form Data Update : ', formData);
  };
  
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Booking Payment Form Data Update : ', formData);
  };
  
  // Add a state for the checkbox
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Handle the checkbox change event
  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreementChecked(event.target.checked);
    // console.log('Update FormData : ', formData);
  };  

  
  const calculateRemainingTime = () => {
    const createdAtTimestamp = new Date().getTime();
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

  const fetchData = async () => {
    if(status !== 'authenticated') return
    try {
      const { status, data, ok, error } = await callAPI('/customer/payment/show', 'POST', { id_customer: session.user.id }, true);
      setDataPaymentUser(data)
      setFormData((prevFormData) => ({
        ...prevFormData,
        card_name: data.card_name,
        card_number: data.card_number,
        card_type: data.card_type,
        expired_date: data.expired_date,
        cvv: data.cvv,
      }));
      setLoading(false)
    } catch (error) {
      return {
        notFound: true,
      };
    }
  }

  useEffect(() => {
    if (dataPaymentUser) return
    fetchData();
  }, []); // Trigger the fetch when the currentPage changes
  // console.log('Booking Payment Form Data Update : ', formData);
  return (
    <>
      <div className="loyalty-checkout__timer">
        <div className="container">
          <div className="loyalty-checkout__timer-wrapper">
            <p>Complete our payment in</p>
            <div className="loyalty-checkout__timer-countdown">
            <div className="loyalty-checkout__timer-number">{Math.floor(remainingTime / 3600).toString().padStart(2, '0')}</div>
            <p>:</p>
            <div className="loyalty-checkout__timer-number">{Math.floor((remainingTime % 3600) / 60).toString().padStart(2, '0')}</div>
            <p>:</p>
            <div className="loyalty-checkout__timer-number">{(remainingTime % 60).toString().padStart(2, '0')}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="loyalty-checkout__wrapper">
          <form action="#" className="loyalty-checkout__inner">
            <PaymentSection handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} formData={formData} handleInputCardNumberChange={handleInputCardNumberChange} handleInputExpiredDate={handleInputExpiredDate}/>
            <AggreementSection agreementChecked={agreementChecked} handleAgreementChange={handleAgreementChange} />
            <FooterSection agreementChecked={agreementChecked} {...props} />
          </form>
          <LoyaltyCheckoutSummary />
        </div>
      </div>
    </>
  )
}

const PaymentSection = (props) => {
  return (
    <div className="loyalty-checkout__card">
      <div className="loyalty-checkout__card-row">
        <p className="loyalty-checkout__card-title">Payment Details</p>
        <div className="loyalty-checkout__card-icon">
          <SVGIcon src={Icons.PaymentMastercard} width={32} height={24} />
          <SVGIcon src={Icons.PaymentVisa} width={32} height={24} />
          <SVGIcon src={Icons.PaymentAmex} width={32} height={24} />
          <SVGIcon src={Icons.PaymentDci} width={32} height={24} />
          <SVGIcon src={Icons.PaymentJcb} width={32} height={24} />
          <SVGIcon src={Icons.PaymentDiscover} width={32} height={24} />
        </div>
      </div>
      <div className="loyalty-checkout__payment">
        <div className="loyalty-checkout__payment-block w-100">
          <label htmlFor="card_name_Payment">Cardholder's Name</label>
          <input type="text" name="card_name" id="card_name_Payment" placeholder="Enter Cardholder name" onChange={props.handleInputChange} value={props?.formData?.card_name}/>
        </div>
        <div className="loyalty-checkout__payment-block w-100">
          <label htmlFor="payment-cardNumber">Card number</label>
          <input type="text" name="payment-cardNumber" id="payment-cardNumber" placeholder="0000 0000 0000 0000" onInput={props.handleInputCardNumberChange} value={props?.formData?.card_number}/>
        </div>
        <div className="loyalty-checkout__payment-block w-100">
          <label htmlFor="card_type_Payment">Card Type</label>
          <select name="card_type" id="card_type_Payment" placeholder="Select your card type" onChange={props.handleSelectChange} defaultValue={'-'}>
            <option value="-" disabled>Select your card type</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Regular Bank">Regular Bank</option>
            <option value="Visa">Visa</option>
            <option value="Master Card">Master Card</option>
          </select>
        </div>
        <div className="loyalty-checkout__payment-row w-100">
          <div className="loyalty-checkout__payment-block w-100">
            <label htmlFor="expired_date_Payment">Expiry Date</label>
            <div className="loyalty-checkout__payment-input">
              <input type="text" name="expired_date" id="expired_date_Payment" placeholder="MM / YY" onChange={props.handleInputExpiredDate} value={props?.formData?.expired_date}/>
              <SVGIcon className="loyalty-checkout__payment-input--icon" src={Icons.Calendar} width={20} height={20} />
            </div>
          </div>
          <div className="loyalty-checkout__payment-block w-100">
            <label htmlFor="cvv_Payment">CVV/CVC</label>
            <input type="number" name="cvv" id="cvv_Payment" min={0} placeholder="000" onChange={props.handleInputChange} inputMode="none" value={props?.formData?.cvv}/>
          </div>
        </div>
      </div>
    </div>
  )
}

const AggreementSection = (props) => {
  return (
    <div className="loyalty-checkout__aggreement form-check">
      <input type="checkbox" name="privacy-policy-tos" className="form-check-input" checked={props.agreementChecked} onChange={props.handleAgreementChange}/>
      <p>By clicking the button below, you have agreed to our <a href="#" className="loyalty-checkout__aggreement-link">Privacy Policy</a> and <a href="#" className="loyalty-checkout__aggreement-link">Terms & Conditions.</a></p>
    </div>
  )
}

const FooterSection = (props) => {
  const { data, status } = useSession()
  // const objDataCarBooking = dataCarBooking[0] || []; // Default to an empty array if data is falsy
  // console.log('objDataCarBooking footer', objDataCarBooking)

  const isAuthenticated = status !== 'loading' && status === 'authenticated' && data.user.role === 'customer'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && data.user.role === 'customer')

  return (
    <div className="loyalty-checkout__card">
      <div className="loyalty-checkout__footer">
        <div className="loyalty-checkout__footer-total">
          <p>Total :</p>
          <div className="loyalty-checkout__footer-price">
            <h5>$ 199.00</h5>
            <a href="#" className="loyalty-checkout__footer-details">See pricing details</a>
          </div>
        </div>        
        {isAuthenticated && (
          <button
            onClick={() => {
              // Call the handleSubmit function from props
              props.handleNextStep();
            }} type="button" className={`btn btn-lg btn-success ${!props.agreementChecked ? 'disabled' : ''}`}
            disabled={!props.agreementChecked}>Complete Booking</button>
        )}
        {isNotAuthenticated && (
          <button type="button" className={`btn btn-lg btn-success ${!props.agreementChecked ? 'disabled' : ''}`}
            disabled={!props.agreementChecked} data-bs-toggle="modal" data-bs-target="#auth-modal">Complete Booking</button>
        )}
      </div>
    </div>
  )
}


export default BookingPayment
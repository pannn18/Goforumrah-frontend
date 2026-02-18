import React, { useState, useEffect, ChangeEvent } from 'react'
import { Icons, Images } from '@/types/enums'
import { callAPI } from '@/lib/axiosHelper'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import LoyaltyCheckoutSummary from '../summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import BookingPayment from '../../checkout/payment'
import { useRouter } from 'next/router'
import AuthModal from '@/components/modals/auth';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
import { getSession, useSession } from "next-auth/react"
import moment from 'moment'

interface IProps {
  handleNextStep?: () => void
  data?: any;
  onDataSubmit?: (formData: any) => void; // Add this prop for the callback function
}

interface formProps {
  formData: {
    id_hotel_booking: any;
    id_customer: number;
    id_hotel: number;
    id_hotel_layout: number;
    checkin: string;
    checkout: string;
    title: string;
    fullname: string;
    country: string;
    phone: string;
    email: string;
    guest_title: string;
    guest_fullname: string;
    special_request: string[];
    note: string;
  };
}
interface handleInputChangeProps {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
interface handleSelectChangeProps {
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface handlePhoneCodeChangeProps {
  handlePhoneCodeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
interface handlePhoneSelectAndInputProps {
  handlePhoneSelectAndInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
interface AggreementSectionProps {
  agreementChecked: boolean;
  handleAgreementChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
interface AggreementCheckedProps {
  agreementChecked: boolean;
}
interface handleSubmitProps {
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

interface selectedPhoneCodeProps {
  selectedPhoneCode: string
}

const BookingDetails = (props: IProps) => {
  const router = useRouter();
  const data = props;
  // console.log("data BookingDetails index : ", data)

  const dateCheckin = data.data?.check_in
  const dateCheckout = data.data?.check_out
  const timeCheckin = data.data?.hotel_policies?.checkin_from
  const timeCheckout = data.data?.hotel_policies?.checkout_to

  const id_hotel = data.data?.id_hotel
  const checkin = `${dateCheckin} ${timeCheckin}`
  const checkout = `${dateCheckout} ${timeCheckout}`

  const queryParams = `id=${id_hotel}&checkin=${checkin}&checkout=${checkout}`;
  // console.log(queryParams)

  const { data: session, status } = useSession()

  const id_customer = (status === 'authenticated' || session) ? Number(session.user.id) : null;
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  // console.log(status)


  //Forms
  const [formData, setFormData] = useState({
    id_hotel_booking: null,
    id_customer: session ? Number(session.user.id) : null,
    id_hotel: data?.data?.id_hotel,
    id_hotel_layout: data?.data?.hotel_layout?.id_hotel_layout,
    checkin: checkin,
    checkout: checkout,
    title: 'Mr',
    fullname: '',
    country: 'GB',
    phone: '+1 ',
    email: '',
    guest_title: 'Mr',
    guest_fullname: '',
    special_request: [],
    note: '',
  });

  // useEffect to update id_customer when session changes
  useEffect(() => {
    if (session && session.user.id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_customer: Number(session.user.id),
      }));
    }
  }, [session]);

  // console.log('formData Detail Booking : ', formData);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    // Check if required fields are empty
    if (
      formData.fullname.trim() === '' ||
      formData.phone.trim() === '+1 ' ||
      formData.email.trim() === '' ||
      formData.guest_fullname.trim() === ''
    ) {
      // Handle the case where required fields are empty
      // console.error('Please fill in all required fields.');
      setErrorBanner('Please fill in all required fields.');
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    console.log('Form: ', formData);


    const { status, data, ok, error } = await callAPI('/hotel-booking/store', 'POST', formData, true)
    // console.log(status, data, ok, error);
    if (ok) {
      // console.log("success api handle submit detail booking store   ", status, data, ok, error);
      // Redirect back to the booking details page with the query parameters
      router.push(`/booking/hotel/${id_hotel}/${data?.id_hotel_booking}`);
    } else {
      console.log("fail to handle submit post api detail booking store   ", status, data, ok, error);
      if (status === 400) {
        // Redirect back to the booking details page with the query parameters
        router.push(`/hotel/detail?${queryParams}`);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Detail Booking', formData);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Detail Booking', formData);
  };

  // Add a new state for the selected phone code
  const [selectedPhoneCode, setSelectedPhoneCode] = useState<string>('ID');

  // Handler for the phone code select
  const handlePhoneCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhoneCode(event.target.value);
  };

  const handlePhoneSelectAndInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Update the phone number and country code in formData
    setFormData((prevFormData) => {
      const phone = `${selectedPhoneCode} ${value}`.trim();
      return {
        ...prevFormData,
        phone: phone,
      };
    });
  };

  // Add a state for the checkbox
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Handle the checkbox change event
  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreementChecked(event.target.checked);
  };

  return (
    <div className="container">
      <div className='mt-3'>
        {errorBanner &&
          <>
            <div className='d-flex gap-3 booking-error-banner'>
              <SVGIcon src={Icons.CircleErrorLarge} width={40} height={40} />
              <p className='fs-xl'>{errorBanner}</p>
            </div>
          </>
        }
      </div>
      <div className="loyalty-checkout__wrapper">
        <form id="formBookingHotel" className="loyalty-checkout__inner">
          <ContactSection
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            formData={formData}
            handlePhoneCodeChange={handlePhoneCodeChange} // Pass the handler to the ContactSection
            handlePhoneSelectAndInput={handlePhoneSelectAndInput} // Pass the handler to the ContactSection
            selectedPhoneCode={selectedPhoneCode}
          />
          <AggreementSection agreementChecked={agreementChecked} handleAgreementChange={handleAgreementChange} />
          <FooterSection agreementChecked={agreementChecked} handleSubmit={handleSubmit} {...props} />
        </form>
        <LoyaltyCheckoutSummary />
        <AuthModal />
      </div>
    </div>
  )
}

const ContactSection = (props: formProps & handleInputChangeProps & handleSelectChangeProps & handlePhoneCodeChangeProps & handlePhoneSelectAndInputProps & selectedPhoneCodeProps) => {
  const session = useSession();
  const status = session.status;

  return (
    <div className="loyalty-checkout__card">
      <p className="loyalty-checkout__card-title">Contact Details</p>
      <div className="loyalty-checkout__contact ">
        <div className="loyalty-checkout__contact-row">
          <div className="loyalty-checkout__contact-block">
            <label htmlFor="contact-title">Title</label>
            <select name="title" id="contact-title" placeholder="Your title" onChange={props.handleSelectChange}>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="-">-</option>
            </select>
          </div>
          <div className="loyalty-checkout__contact-block w-100">
            <label htmlFor="fullnameBooking">Full name</label>
            <input type="text" name="fullname" id="fullnameBooking" placeholder="Enter your full name" onChange={props.handleInputChange} />
          </div>
        </div>
        <div className="loyalty-checkout__contact-block">
          <label htmlFor="countryBooking">Country/Region</label>
          <select name="country" id="countryBooking" placeholder="Select your country" onChange={props.handleSelectChange} defaultValue={"GB"}>
            {getCountries().map((country) => (
              <option key={country} value={country}>
                {countryLabels[country]}
              </option>
            ))}
          </select>
        </div>
        <div className="PhoneInput form-control-wrapper">
          <div className="loyalty-checkout__contact-block">
            <label htmlFor="phoneBooking">Phone Number</label>
            <div className={`form-control-field`}>
              <div className="PhoneInputCountry">
                <select
                  value={props.selectedPhoneCode}
                  onChange={props.handlePhoneCodeChange}
                  name="phone-code">
                  {getCountries().map((country) => (
                    <option key={country} value={country}>
                      {countryLabels[country]} +{getCountryCallingCode(country)}
                    </option>
                  ))}
                </select>
                <div className={`PhoneInputSelectedValue ${props.selectedPhoneCode ? 'HasValue' : ''}`}>+{getCountryCallingCode(props.selectedPhoneCode as CountryCode)}</div>
              </div>
              <PhoneInput
                international={true}
                country={props.selectedPhoneCode as CountryCode}
                onChange={() => props.handlePhoneSelectAndInput}
                placeholder="(888) 888-8888"
              />
            </div>
          </div>
        </div>
        <div className="loyalty-checkout__contact-block">
          <label htmlFor="emailBooking">Email Address</label>
          <input type="email" name="email" id="emailBooking" placeholder="Enter your email address" onChange={props.handleInputChange} />
        </div>
        {status === 'unauthenticated' && (
          <div className="loyalty-checkout__contact-banner">
            <div className="loyalty-checkout__contact-banner-icon">
              <SVGIcon src={Icons.Lamp} width={20} height={20} />
            </div>
            <p className="loyalty-checkout__contact-banner-text">Enjoy special discounts & other benefits! <a href="#" className="loyalty-checkout__contact-banner-link">Log in</a> or <a href="#" className="loyalty-checkout__contact-banner-link">register</a> now.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const AggreementSection = (props: AggreementSectionProps) => {
  return (
    <div className="loyalty-checkout__aggreement form-check">
      <input type="checkbox" name="privacy-policy-tos" className="form-check-input" checked={props.agreementChecked} onChange={props.handleAgreementChange}
      />
      <p>By clicking the button below, you have agreed to our <a href="#" className="loyalty-checkout__aggreement-link">Privacy Policy</a> and <a href="#" className="loyalty-checkout__aggreement-link">Terms & Conditions.</a></p>
    </div>
  )
}

const FooterSection = (props: IProps & AggreementCheckedProps & handleSubmitProps) => {
  // console.log("FooterSection props : ", props);
  const { data, status } = useSession()
  // console.log(data, status)

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
            onClick={(event) => {
              // Call the handleSubmit function from props
              // props.handleSubmit(event);

              // Check if the agreement checkbox is checked before proceeding to the next step
              if (props.agreementChecked) {
                // Call the handleNextStep function to proceed to the next step
                props.handleNextStep();
              }
            }} type="button" className={`btn btn-lg btn-success ${!props.agreementChecked ? 'disabled' : ''}`}
            disabled={!props.agreementChecked}>Continue to Payment</button>
        )}
        {isNotAuthenticated && (
          <button type="button" className={`btn btn-lg btn-success ${!props.agreementChecked ? 'disabled' : ''}`}
            disabled={!props.agreementChecked} data-bs-toggle="modal" data-bs-target="#auth-modal">Continue to Payment</button>
        )}
      </div>
    </div>
  )
}

export default BookingDetails
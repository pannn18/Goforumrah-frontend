import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import HotelBookingSummary from '@/components/pages/booking/hotels/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BookingHeader from '@/components/pages/booking/header'
import TourBookingSummary from '../summary'
import { useRouter } from 'next/router'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

interface IProps {
  handleNextStep?: () => void
  data?: any
  onDataSubmit?: (formData: any) => void; // Add this prop for the callback function
}

interface formProps {
  formData: {
    id_tour_package: number;
    id_tour_plan: number;
    id_customer: number;
    fullname: string;
    firstname: string;
    lastname: string;
    phone_number: string;
    email_address: string;
    region: string
    special_requirement: string
    start_date: string
    number_of_tickets: number
  };
}

interface handleInputChangeProps {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
interface handleTextareaChangeProps {
  handleTextareaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
interface handleCheckboxChangeProps {
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
interface handleSpecialRequestChangeProps {
  handleSpecialRequestChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
interface handleCheckboxGuestIdentityChangeProps {
  handleCheckboxGuestIdentityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  const router = useRouter()
  const data = props
  const { data: session, status } = useSession()
  const { idTour, id_plan, start_date, tickets } = router.query


  const [formData, setFormData] = useState({
    id_tour_package: Number(idTour),
    id_tour_plan: Number(id_plan),
    id_customer: session ? Number(session.user.id) : null,
    fullname: '',
    firstname: '',
    lastname: '',
    phone_number: '+1',
    email_address: '',
    contact_title: 'mr',
    region: 'ID',
    special_requirement: '',
    start_date: start_date.toString(),
    number_of_tickets: Number(tickets)
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const { status, data, ok, error } = await callAPI('/tour-package/booking', 'POST', formData, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit detail booking store   ", status, data, ok, error);
      // Call the callback function with the formData when the API call is successful
      router.push(`/booking/tour/${idTour}/${data?.id_tour_booking}?id_plan=${id_plan}&start_date=${start_date}&tickets=${tickets}`)
    } else {
      console.log("fail to handle submit post api detail booking store   ", status, data, ok, error);
      if (status === 400) {
        // Redirect back to the booking details page with the query parameters
        router.push(`/tour/${idTour}`);
      }
    }
  };

  // Handler for the phone code select
  const handlePhoneCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhoneCode(event.target.value);
  };

  // Add a new state for the selected phone code
  const [selectedPhoneCode, setSelectedPhoneCode] = useState<string>('ID');

  const handlePhoneSelectAndInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // Update the phone number and country code in formData
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        phone_number: value,
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
    <>
      <Layout>
        <main className="booking-tour">
          <div className="container">
            <div className="booking-tour__wrapper">
              <form action="#" className="booking-tour__inner">
                <BannerSection />
                <ContactSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  handlePhoneCodeChange={handlePhoneCodeChange} // Pass the handler to the ContactSection
                  handlePhoneSelectAndInput={handlePhoneSelectAndInput} // Pass the handler to the ContactSection
                  selectedPhoneCode={selectedPhoneCode}
                />
                <AdditionalSection formData={formData} handleInputChange={handleInputChange} />
                <GuestSection formData={formData} handleInputChange={handleInputChange} />
                {/** <CancellationPolicySection /> Temporarily hidden*/} 
                {/** <DigitalTicketSection />  Temporarily hidden*/}
                {/** <PaySection /> Temporarily hidden*/}
                <AggreementSection agreementChecked={agreementChecked} handleAgreementChange={handleAgreementChange} />
                <FooterSection agreementChecked={agreementChecked} handleSubmit={handleSubmit} {...props} />
              </form>
              <TourBookingSummary data={data.data} />
            </div>
          </div>
        </main>
        {/** <Footer /> */}
      </Layout>
    </>
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

const ContactSection = (props: formProps & handleInputChangeProps & handleSelectChangeProps & selectedPhoneCodeProps & handlePhoneCodeChangeProps & handlePhoneSelectAndInputProps) => {
  const { data, status } = useSession()
  const isAuthenticated = status !== 'loading' && status === 'authenticated'
  const isNotAuthenticated = status !== 'loading' && status === 'unauthenticated'
  return (
    <div className="booking-tour__card">
      <p className="booking-tour__card-title">Contact Details</p>
      <div className="booking-tour__contact ">
        <div className="booking-tour__contact-row">
          <div className="booking-tour__contact-block">
            <label htmlFor="contact_title">Title</label>
            <select name="contact_title" id="contact_title" placeholder="Your title"
              onChange={props.handleSelectChange}
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="-">-</option>
            </select>
          </div>
          <div className="booking-tour__contact-block w-100">
            <label htmlFor="fullname">Full name</label>
            <input type="text" name="fullname" id="fullname" placeholder="Enter your full name" onChange={props.handleInputChange} />
          </div>
        </div>
        <div className="booking-tour__contact-block">
          <label htmlFor="region">Country/Region</label>
          <select name="region" id="region" placeholder="Select your country" onChange={props.handleSelectChange} defaultValue={"GB"}>
            {getCountries().map((country) => (
              <option key={country} value={country}>
                {countryLabels[country]}
              </option>
            ))}
          </select>
        </div>

        <div className="PhoneInput form-control-wrapper">
          <div className="booking-hotel__contact-block">
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
                onChange={(value: string) => {
                  const event = { target: { value } } as React.ChangeEvent<HTMLInputElement>;
                  props.handlePhoneSelectAndInput(event);
                }}
                placeholder="(888) 888-8888"
              />
            </div>
          </div>
        </div>

        <div className="booking-tour__contact-block">
          <label htmlFor="email_address">Email Address</label>
          <input type="email" name="email_address" id="email_address" placeholder="Enter your email address" onChange={props.handleInputChange} />
        </div>
        {isNotAuthenticated && (
            <>
        <div className="booking-tour__contact-banner">
          <div className="booking-tour__contact-banner-icon"> 
            <SVGIcon src={Icons.Lamp} width={20} height={20} />
          </div>  
          <p className="booking-tour__contact-banner-text">Enjoy special discounts & other benefits! <a href="#" className="booking-tour__contact-banner-link">Log in</a> or <a href="#" className="booking-tour__contact-banner-link">register</a> now.</p>
        </div>
        </>
        )}
      </div>
    </div>
  )
}

const AdditionalSection = (props: formProps & handleInputChangeProps) => {
  return (
    <div className="booking-tour__card">
      <p className="booking-tour__card-title">Additional Details</p>
      <div className="booking-tour__guest">
        <div className="booking-tour__guest-row">
          <div className="booking-tour__guest-block w-100">
            <label htmlFor="special_requirement">Special Requirement</label>
            <input type="text" name="special_requirement" id="special_requirement" placeholder="Enter your special requirement" onChange={props.handleInputChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

const GuestSection = (props: formProps & handleInputChangeProps) => {
  return (
    <div className="booking-tour__card">
      <p className="booking-tour__card-title">Guest Details</p>
      <div className="booking-tour__guest">
        <div className="booking-tour__guest-row">
          <div className="booking-tour__guest-block w-50">
            <label htmlFor="firstname">First name</label>
            <input type="text" name="firstname" id="firstname" placeholder="Enter your full name" onChange={props.handleInputChange} />
          </div>
          <div className="booking-tour__guest-block w-50">
            <label htmlFor="lastname">Last name</label>
            <input type="text" name="lastname" id="lastname" placeholder="Enter your full name" onChange={props.handleInputChange} />
          </div>
        </div>
      </div>
    </div>
  )
}

const CancellationPolicySection = () => {
  return (
    <div className="booking-tour__card">
      <div className="booking-tour__card-header">
        <a className="booking-tour__card-header-toggle" data-bs-toggle="collapse" href="#SepecialRequestSection" role="button" aria-expanded="false" aria-controls="SepecialRequestSection">
          <p>Cancellation policy </p>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
        <div className="booking-tour__card-header-desc">You can cancel for free up to 24 hours before the listed start time</div>
      </div>
      <div className="booking-tour__special collapse" id="SepecialRequestSection">
        <div className="booking-tour__special-question">
          <p className="booking-tour__special-question-title">Do you have a smoking preference?</p>
          <div className="booking-tour__special-question-row">
            <div className="booking-tour__special-question-block form-check">
              <input type="radio" name="special-smoking" id="special-nosmoking" className="form-check-input" defaultChecked />
              <label htmlFor="special-nosmoking">Non-smoking</label>
            </div>
            <div className="booking-tour__special-question-block form-check">
              <input type="radio" name="special-smoking" id="special-smoking" className="form-check-input" />
              <label htmlFor="special-smoking">Smoking</label>
            </div>
          </div>
        </div>
        <div className="booking-tour__special-question">
          <p className="booking-tour__special-question-title">What bed configuration do you prefer?</p>
          <div className="booking-tour__special-question-row">
            <div className="booking-tour__special-question-block form-check">
              <input type="radio" name="special-bed" id="special-bedLarge" className="form-check-input" defaultChecked />
              <label htmlFor="special-bedLarge">I’d like a large bed</label>
            </div>
            <div className="booking-tour__special-question-block form-check">
              <input type="radio" name="special-bed" id="special-bedTwin" className="form-check-input" />
              <label htmlFor="special-bedTwin">I’d like a twin beds</label>
            </div>
          </div>
        </div>
        <div className="booking-tour__special-separator"></div>
        <a className="booking-tour__special-toggle" data-bs-toggle="collapse" href="#MoreRequestSection" role="button" aria-expanded="false" aria-controls="MoreRequestSection">
          Hide more requests
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
        <div className="booking-tour__special-inner collapse" id="MoreRequestSection">
          <div className="booking-tour__special-question">
            <p className="booking-tour__special-question-title">We'll make sure your property or host gets your request quickly.</p>
            <div className="booking-tour__special-question-row">
              <div className="booking-tour__special-question-block form-check">
                <input type="checkbox" name="more-request" id="more-high" className="form-check-input" defaultChecked />
                <label htmlFor="more-high">I’d like a room on high floor</label>
              </div>
              <div className="booking-tour__special-question-block form-check">
                <input type="checkbox" name="more-request" id="more-coat" className="form-check-input" />
                <label htmlFor="more-coat">I’d like to have a baby cot (additional charges may apply)</label>
              </div>
            </div>
            <div className="booking-tour__special-question-row">
              <div className="booking-tour__special-question-block form-check">
                <input type="checkbox" name="more-request" id="more-quiet" className="form-check-input" />
                <label htmlFor="more-quiet">I’d like a quiet room</label>
              </div>
              <div className="booking-tour__special-question-block form-check">
                <input type="checkbox" name="more-request" id="more-connecting" className="form-check-input" />
                <label htmlFor="more-connecting">I’d like connecting room</label>
              </div>
            </div>
          </div>
          <div className="booking-tour__special-question">
            <p className="booking-tour__special-question-title">Any personal requests? Let us know in English or Arabic</p>
            <textarea name="text-request" id="text-request" className="form-control" rows={5} placeholder="Write your request here.."></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

const DigitalTicketSection = () => {
  return (
    <div className="booking-tour__card">
      <div className="booking-tour__card-header">
        <a className="booking-tour__card-header-toggle" data-bs-toggle="collapse" href="#DigitalTicketSection" role="button" aria-expanded="false" aria-controls="DigitalTicketSection">
          <p>Digital ticket </p>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
        <div className="booking-tour__card-header-desc">Print tickets at home or show them on your phone at the venue</div>
      </div>
      <div className="booking-tour__additional collapse" id="DigitalTicketSection">
        <div className="booking-tour__additional-question">
          <p className="booking-tour__additional-question-title">Do you need additional transportation services for your trip?</p>
          <div className="booking-tour__additional-question-row">
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-transportation" id="transportation-need" className="form-check-input" defaultChecked />
              <label htmlFor="transportation-need">Yes, I do</label>
            </div>
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-transportation" id="transportation-noneed" className="form-check-input" />
              <label htmlFor="transportation-noneed">No, I do not</label>
            </div>
          </div>
        </div>
        <div className="booking-tour__additional-banner">
          <div className="booking-tour__additional-banner-icon">
            <SVGIcon src={Icons.Car} width={20} height={20} />
          </div>
          <p className="booking-tour__additional-banner-text">No transports booked</p>
          <a href="#" className="booking-tour__additional-banner-link">
            Book transport
            <SVGIcon src={Icons.ArrowRight} width={20} height={20} />
          </a>
        </div>
        <div className="booking-tour__additional-question">
          <p className="booking-tour__additional-question-title">Do you also want to book flights?</p>
          <div className="booking-tour__additional-question-row">
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-flight" id="flight-need" className="form-check-input" defaultChecked />
              <label htmlFor="flight-need">Yes, I do</label>
            </div>
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-flight" id="flight-noneed" className="form-check-input" />
              <label htmlFor="flight-noneed">No, I do not</label>
            </div>
          </div>
        </div>
        <div className="booking-tour__additional-banner">
          <div className="booking-tour__additional-banner-icon">
            <SVGIcon src={Icons.Flight} width={20} height={20} />
          </div>
          <p className="booking-tour__additional-banner-text">No flight booked</p>
          <a href="#" className="booking-tour__additional-banner-link">
            Book flight
            <SVGIcon src={Icons.ArrowRight} width={20} height={20} />
          </a>
        </div>
      </div>
    </div>
  )
}

const PaySection = () => {
  return (
    <div className="booking-tour__card">
      <div className="booking-tour__card-header">
        <a className="booking-tour__card-header-toggle" data-bs-toggle="collapse" href="#PaySection" role="button" aria-expanded="false" aria-controls="PaySection">
          <p>You'll pay in US Dollar (USD) </p>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
        <div className="booking-tour__card-header-desc">he total price was converted to show the approximate cost in your selected currency. You'll be charged in the attraction's currency (USD).</div>
      </div>
      <div className="booking-tour__additional collapse" id="PaySection">
        <div className="booking-tour__additional-question">
          <p className="booking-tour__additional-question-title">Do you need additional transportation services for your trip?</p>
          <div className="booking-tour__additional-question-row">
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-transportation" id="transportation-need" className="form-check-input" defaultChecked />
              <label htmlFor="transportation-need">Yes, I do</label>
            </div>
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-transportation" id="transportation-noneed" className="form-check-input" />
              <label htmlFor="transportation-noneed">No, I do not</label>
            </div>
          </div>
        </div>
        <div className="booking-tour__additional-banner">
          <div className="booking-tour__additional-banner-icon">
            <SVGIcon src={Icons.Car} width={20} height={20} />
          </div>
          <p className="booking-tour__additional-banner-text">No transports booked</p>
          <a href="#" className="booking-tour__additional-banner-link">
            Book transport
            <SVGIcon src={Icons.ArrowRight} width={20} height={20} />
          </a>
        </div>
        <div className="booking-tour__additional-question">
          <p className="booking-tour__additional-question-title">Do you also want to book flights?</p>
          <div className="booking-tour__additional-question-row">
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-flight" id="flight-need" className="form-check-input" defaultChecked />
              <label htmlFor="flight-need">Yes, I do</label>
            </div>
            <div className="booking-tour__additional-question-block form-check">
              <input type="radio" name="additional-flight" id="flight-noneed" className="form-check-input" />
              <label htmlFor="flight-noneed">No, I do not</label>
            </div>
          </div>
        </div>
        <div className="booking-tour__additional-banner">
          <div className="booking-tour__additional-banner-icon">
            <SVGIcon src={Icons.Flight} width={20} height={20} />
          </div>
          <p className="booking-tour__additional-banner-text">No flight booked</p>
          <a href="#" className="booking-tour__additional-banner-link">
            Book flight
            <SVGIcon src={Icons.ArrowRight} width={20} height={20} />
          </a>
        </div>
      </div>
    </div>
  )
}

const AggreementSection = (props: AggreementSectionProps) => {
  return (
    <div className="booking-tour__aggreement form-check">
      <input type="checkbox" className="form-check-input" checked={props.agreementChecked} onChange={props.handleAgreementChange} />
      <p>By clicking the button below, you have agreed to our <a href="#" className="booking-tour__aggreement-link">Privacy Policy</a> and <a href="#" className="booking-tour__aggreement-link">Terms & Conditions.</a></p>
    </div>
  )
}

const FooterSection = (props: IProps & AggreementCheckedProps & handleSubmitProps) => {
  const router = useRouter()
  const { id_plan, tickets } = router.query

  const foundPlan = props.data?.tour_plans?.find(plan => plan.id_tour_plan === Number(id_plan));
  const totalPrice = parseFloat(foundPlan?.price) * Number(tickets);

  const { data, status } = useSession()

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  const isAuthenticated = status !== 'loading' && status === 'authenticated' && data.user.role === 'customer'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && data.user.role === 'customer')

  return (
    <div className="booking-tour__card">
      <div className="booking-tour__footer">
        <div className="booking-tour__footer-total">
          <p>Total :</p>
          <div className="booking-tour__footer-price">
            <h5>{currencySymbol} {changePrice(totalPrice)}</h5>
            <a href="#" className="booking-tour__footer-details">See pricing details</a>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={(event) => {
              // Call the handleSubmit function from props
              props.handleSubmit(event);

              // Check if the agreement checkbox is checked before proceeding to the next step
              // if (props.agreementChecked) {
              //   // Call the handleNextStep function to proceed to the next step
              //   props.handleNextStep();
              // }
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
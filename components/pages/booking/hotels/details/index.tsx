import React, { useState, useEffect, ChangeEvent } from 'react'
import { Icons, Images } from '@/types/enums'
import { callAPI } from '@/lib/axiosHelper'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import HotelBookingSummary from '@/components/pages/booking/hotels/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import BookingPayment from '../payment'
import { useRouter } from 'next/router'
import AuthModal from '@/components/modals/auth';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
import { getSession, useSession } from "next-auth/react"
import moment from 'moment'
import { UseCurrencyConverter } from '@/components/convertCurrency'

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
  const router = useRouter();
  const data = props;
  // console.log("data BookingDetails index : ", data)

  //get adult and child from query
  const adult = router.query.adult
  const child = router.query.children

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
  const [specialReqSmoking, setSpecialReqSmoking] = useState("Non-smoking");
  const [specialReqBed, setSpecialReqBed] = useState("I’d like a large bed");
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
    adult_count: typeof adult === 'string' ? Number(adult) : adult,
    children_count: typeof child === 'string' ? Number(child) : child,
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

    console.log('form data : ', formData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Detail Booking', formData);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));

    // console.log('Detail Booking', formData);
  };

  const handleSpecialRequestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Check if the selected value is "Non-smoking" or "Smoking"
    if (name === "special-smoking" && (value === "Non-smoking" || value === "Smoking")) {
      // Filter out the opposite value from the special_request array
      const special_request = formData.special_request.filter(
        (item) => item !== "Non-smoking" && item !== "Smoking"
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        special_request: [...special_request, value],
      }));
    }

    // Check if the selected value is "I’d like a large bed" or "I’d like a twin beds"
    else if (name === "special-bed" && (value === "I’d like a large bed" || value === "I’d like a twin beds")) {
      // Filter out the opposite value from the special_request array
      const special_request = formData.special_request.filter(
        (item) => item !== "I’d like a large bed" && item !== "I’d like a twin beds"
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        special_request: [...special_request, value],
      }));
    }

    // Handle other special requests
    else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        special_request: prevFormData.special_request.includes(value)
          ? prevFormData.special_request.filter((item) => item !== value)
          : [...prevFormData.special_request, value],
      }));
    }

    // console.log('Detail Booking', formData);
  };

  // Add a new state for the selected phone code
  const [selectedPhoneCode, setSelectedPhoneCode] = useState<string>('ID');

  // Add a new state for the merged phone number
  const [mergedPhoneNumber, setMergedPhoneNumber] = useState<string>('');

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

  // Inside the GuestSection component
  const [guestIdentity, setGuestIdentity] = useState(false);

  const handleCheckboxGuestIdentityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    // setGuestIdentity(checked);
    // console.log(checked)

    // If the checkbox is checked, copy title and fullname from formData to guest_title and guest_fullname
    if (checked) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        guest_title: prevFormData.title,
        guest_fullname: prevFormData.fullname,
      }));
    } else {
      // If the checkbox is unchecked, reset guest_title and guest_fullname to empty strings
      setFormData((prevFormData) => ({
        ...prevFormData,
        guest_title: '',
        guest_fullname: '',
      }));
    }
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
      <div className="booking-hotel__wrapper">
        <form id="formBookingHotel" className="booking-hotel__inner">
          <BannerSection />
          <ContactSection
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            formData={formData}
            handlePhoneCodeChange={handlePhoneCodeChange} // Pass the handler to the ContactSection
            handlePhoneSelectAndInput={handlePhoneSelectAndInput} // Pass the handler to the ContactSection
            selectedPhoneCode={selectedPhoneCode}
          />
          <GuestSection handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleCheckboxGuestIdentityChange={handleCheckboxGuestIdentityChange} formData={formData} />
          <SpecialRequestSection handleTextareaChange={handleTextareaChange} handleSpecialRequestChange={handleSpecialRequestChange} formData={formData} />
          {/* <AdditionalServiceSection formData={formData} /> */}
          <AggreementSection agreementChecked={agreementChecked} handleAgreementChange={handleAgreementChange} />
          <FooterSection agreementChecked={agreementChecked} handleSubmit={handleSubmit} {...props} />
        </form>
        <HotelBookingSummary data={data.data} />
        <AuthModal />
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

const ContactSection = (props: formProps & handleInputChangeProps & handleSelectChangeProps & handlePhoneCodeChangeProps & handlePhoneSelectAndInputProps & selectedPhoneCodeProps) => {
  const session = useSession();
  const status = session.status;

  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Contact Details</p>
      <div className="booking-hotel__contact ">
        <div className="booking-hotel__contact-row">
          <div className="booking-hotel__contact-block">
            <label htmlFor="contact-title">Title</label>
            <select name="title" id="contact-title" placeholder="Your title" onChange={props.handleSelectChange}>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="-">-</option>
            </select>
          </div>
          <div className="booking-hotel__contact-block w-100">
            <label htmlFor="fullnameBooking">Full name</label>
            <input type="text" name="fullname" id="fullnameBooking" placeholder="Enter your full name" onChange={props.handleInputChange} />
          </div>
        </div>
        <div className="booking-hotel__contact-block">
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
                onChange={() => props.handlePhoneSelectAndInput}
                placeholder="(888) 888-8888"
              />
            </div>
          </div>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="emailBooking">Email Address</label>
          <input type="email" name="email" id="emailBooking" placeholder="Enter your email address" onChange={props.handleInputChange} />
        </div>
        {status === 'unauthenticated' && (
          <div className="booking-hotel__contact-banner">
            <div className="booking-hotel__contact-banner-icon">
              <SVGIcon src={Icons.Lamp} width={20} height={20} />
            </div>
            <p className="booking-hotel__contact-banner-text">Enjoy special discounts & other benefits! <a href="#" className="booking-hotel__contact-banner-link">Log in</a> or <a href="#" className="booking-hotel__contact-banner-link">register</a> now.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const GuestSection = (props: formProps & handleInputChangeProps & handleCheckboxGuestIdentityChangeProps & handleSelectChangeProps) => {

  // console.log(props)

  // Add the state for guestIdentity using useState
  const [guestIdentity, setGuestIdentity] = useState<boolean>(false);

  // Check if guestIdentity is true, if so, set guest_title and guest_fullname from formData, otherwise, use empty strings
  const guestTitle = guestIdentity ? props.formData.guest_title : '';
  const guestFullname = guestIdentity ? props.formData.guest_fullname : '';

  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Guest Details</p>
      <div className="booking-hotel__guest">
        <div className="booking-hotel__guest-toggle">
          <input
            type="checkbox"
            name="sameIdentityBooking"
            id="sameIdentityBooking"
            onChange={(event) => {
              props.handleCheckboxGuestIdentityChange(event); // Call the first function from props
              setGuestIdentity((prevGuestIdentity) => !prevGuestIdentity); // Toggle the guestIdentity state
              // console.log('Guest Identity : ', guestIdentity);
              // console.log(event);
            }}
            checked={guestIdentity}
          />
          <p>Same as contact details</p>
        </div>

        {guestIdentity ? (
          // Show the guest details from the formData if guestIdentity is true
          <div className="booking-hotel__guest-row">
            <div className="booking-hotel__guest-block">
              <label htmlFor="guest_title">Title</label>
              <select name="guest_title" id="guest_title" placeholder="Your title" value={guestTitle} onChange={props.handleSelectChange}>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="-">-</option>
              </select>
            </div>
            <div className="booking-hotel__guest-block w-100">
              <label htmlFor="guest_fullname">Full name</label>
              <input
                type="text"
                name="guest_fullname"
                id="guest_fullname"
                placeholder="Enter your full name"
                value={guestFullname}
              />
            </div>
          </div>
        ) : (
          // Show the input fields if guestIdentity is false
          <div className="booking-hotel__guest-row">
            <div className="booking-hotel__guest-block">
              <label htmlFor="guest_title">Title</label>
              <select name="guest_title" id="guest_title" placeholder="Your title" onChange={props.handleSelectChange} >
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="-">-</option>
              </select>
            </div>
            <div className="booking-hotel__guest-block w-100">
              <label htmlFor="guest_fullname">Full name</label>
              <input type="text" name="guest_fullname" id="guest_fullname" placeholder="Enter your full name" onChange={props.handleInputChange} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const SpecialRequestSection = (props: formProps & handleTextareaChangeProps & handleSpecialRequestChangeProps) => {
  const [moreRequest, setMoreRequest] = useState(false);

  const handleMoreRequestToggle = () => {
    setMoreRequest((prevMoreRequest) => !prevMoreRequest);
  };

  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__card-header">
        <a className="booking-hotel__card-header-toggle" data-bs-toggle="collapse" href="#SepecialRequestSection" role="button" aria-expanded="false" aria-controls="SepecialRequestSection">
          <p>Special Request <span className="booking-hotel__card-header-toggle--optional">(optional)</span></p>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
        <div className="booking-hotel__card-header-desc">Have any requests to make your stay more comfortable? Ask here! The requests are subject to availability and might cause additional charges.</div>
      </div>
      <div className="booking-hotel__special collapse" id="SepecialRequestSection">
        <div className="booking-hotel__special-question">
          <p className="booking-hotel__special-question-title">Do you have a smoking preference?</p>
          <div className="booking-hotel__special-question-row">
            <div className="booking-hotel__special-question-block form-check">
              <input type="radio" name="special-smoking" id="special-nosmoking" value="Non-smoking" className="form-check-input" onChange={props.handleSpecialRequestChange} />
              <label htmlFor="special-nosmoking">Non-smoking</label>
            </div>
            <div className="booking-hotel__special-question-block form-check">
              <input type="radio" name="special-smoking" id="special-smoking" value="Smoking" className="form-check-input" onChange={props.handleSpecialRequestChange} />
              <label htmlFor="special-smoking">Smoking</label>
            </div>
          </div>
        </div>
        <div className="booking-hotel__special-question">
          <p className="booking-hotel__special-question-title">What bed configuration do you prefer?</p>
          <div className="booking-hotel__special-question-row">
            <div className="booking-hotel__special-question-block form-check">
              <input type="radio" name="special-bed" id="special-bedLarge" value="I’d like a large bed" className="form-check-input" onChange={props.handleSpecialRequestChange} />
              <label htmlFor="special-bedLarge">I’d like a large bed</label>
            </div>
            <div className="booking-hotel__special-question-block form-check">
              <input type="radio" name="special-bed" id="special-bedTwin" value="I’d like a twin beds" className="form-check-input" onChange={props.handleSpecialRequestChange} />
              <label htmlFor="special-bedTwin">I’d like a twin beds</label>
            </div>
          </div>
        </div>


        <div className="booking-hotel__special-separator"></div>
        <a className="booking-hotel__special-toggle" data-bs-toggle="collapse" href="#MoreRequestSection" role="button" aria-expanded="false" aria-controls="MoreRequestSection" onClick={handleMoreRequestToggle}>
          {moreRequest ? 'Show' : 'Hide'} more requests
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
        <div className="booking-hotel__special-inner collapse" id="MoreRequestSection">
          <div className="booking-hotel__special-question">
            <p className="booking-hotel__special-question-title">We'll make sure your property or host gets your request quickly.</p>
            <div className="booking-hotel__special-question-row">
              <div className="booking-hotel__special-question-block form-check">
                <input type="checkbox" name="high-floor" id="more-high" value="I’d like a room on high floor" className="form-check-input" onChange={props.handleSpecialRequestChange} />
                <label htmlFor="more-high">I’d like a room on high floor</label>
              </div>
              <div className="booking-hotel__special-question-block form-check">
                <input type="checkbox" name="baby-cot" id="more-coat" value="I’d like to have a baby cot (additional charges may apply)" className="form-check-input" onChange={props.handleSpecialRequestChange} />
                <label htmlFor="more-coat">I’d like to have a baby cot (additional charges may apply)</label>
              </div>
            </div>
            <div className="booking-hotel__special-question-row">
              <div className="booking-hotel__special-question-block form-check">
                <input type="checkbox" name="quiet-room" id="more-quiet" value="I’d like a quiet room" className="form-check-input" onChange={props.handleSpecialRequestChange} />
                <label htmlFor="more-quiet">I’d like a quiet room</label>
              </div>
              <div className="booking-hotel__special-question-block form-check">
                <input type="checkbox" name="connecting-room" id="more-connecting" value="I’d like connecting room" className="form-check-input" onChange={props.handleSpecialRequestChange} />
                <label htmlFor="more-connecting">I’d like connecting room</label>
              </div>
            </div>
          </div>
          <div className="booking-hotel__special-question">
            <p className="booking-hotel__special-question-title">Any personal requests? Let us know in English or Arabic</p>
            <textarea name="note" id="note" className="form-control" rows={5} placeholder="Write your request here.." onChange={props.handleTextareaChange} ></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

const AdditionalServiceSection = (props: formProps) => {
  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__card-header">
        <a className="booking-hotel__card-header-toggle" data-bs-toggle="collapse" href="#AdditionalServiceSection" role="button" aria-expanded="false" aria-controls="AdditionalServiceSection">
          <p>Additional Request <span className="booking-hotel__card-header-toggle--optional">(optional)</span></p>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
      </div>
      <div className="booking-hotel__additional collapse" id="AdditionalServiceSection">
        <div className="booking-hotel__additional-question">
          <p className="booking-hotel__additional-question-title">Do you need additional transportation services for your trip?</p>
          <div className="booking-hotel__additional-question-row">
            <div className="booking-hotel__additional-question-block form-check">
              <input type="radio" name="additional-transportation" id="transportation-need" className="form-check-input" defaultChecked />
              <label htmlFor="transportation-need">Yes, I do</label>
            </div>
            <div className="booking-hotel__additional-question-block form-check">
              <input type="radio" name="additional-transportation" id="transportation-noneed" className="form-check-input" />
              <label htmlFor="transportation-noneed">No, I do not</label>
            </div>
          </div>
        </div>
        <div className="booking-hotel__additional-banner">
          <div className="booking-hotel__additional-banner-icon">
            <SVGIcon src={Icons.Car} width={20} height={20} />
          </div>
          <p className="booking-hotel__additional-banner-text">No transports booked</p>
          <a href="#" className="booking-hotel__additional-banner-link">
            Book transport
            <SVGIcon src={Icons.ArrowRight} width={20} height={20} />
          </a>
        </div>
        <div className="booking-hotel__additional-question">
          <p className="booking-hotel__additional-question-title">Do you also want to book flights?</p>
          <div className="booking-hotel__additional-question-row">
            <div className="booking-hotel__additional-question-block form-check">
              <input type="radio" name="additional-flight" id="flight-need" className="form-check-input" defaultChecked />
              <label htmlFor="flight-need">Yes, I do</label>
            </div>
            <div className="booking-hotel__additional-question-block form-check">
              <input type="radio" name="additional-flight" id="flight-noneed" className="form-check-input" />
              <label htmlFor="flight-noneed">No, I do not</label>
            </div>
          </div>
        </div>
        <div className="booking-hotel__additional-banner">
          <div className="booking-hotel__additional-banner-icon">
            <SVGIcon src={Icons.Flight} width={20} height={20} />
          </div>
          <p className="booking-hotel__additional-banner-text">No flight booked</p>
          <a href="#" className="booking-hotel__additional-banner-link">
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
    <div className="booking-hotel__aggreement form-check">
      <input type="checkbox" name="privacy-policy-tos" className="form-check-input" checked={props.agreementChecked} onChange={props.handleAgreementChange}
      />
      <p>By clicking the button below, you have agreed to our <a href="#" className="booking-hotel__aggreement-link">Privacy Policy</a> and <a href="#" className="booking-hotel__aggreement-link">Terms & Conditions.</a></p>
    </div>
  )
}

const FooterSection = (props: IProps & AggreementCheckedProps & handleSubmitProps) => {
  // console.log("FooterSection props : ", props);
  const { data, status } = useSession()
  // console.log(data, status)

  const isAuthenticated = status !== 'loading' && status === 'authenticated' && data.user.role === 'customer'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && data.user.role === 'customer')
  const { changePrice, currencySymbol } = UseCurrencyConverter();
  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__footer">
        <div className="booking-hotel__footer-total">
          <p>Total :</p>
          <div className="booking-hotel__footer-price">
            <h5>{currencySymbol} {changePrice(props.data.hotel_layout.price)}</h5>
            <a href="#" className="booking-hotel__footer-details">See pricing details</a>
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
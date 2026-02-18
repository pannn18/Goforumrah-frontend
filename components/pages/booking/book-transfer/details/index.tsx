import React, { useState, useEffect, ChangeEvent } from 'react'
import { Icons, Images } from '@/types/enums'
import { callAPI } from '@/lib/axiosHelper'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import BookingSummary from '@/components/pages/booking/book-transfer/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import { useRouter } from 'next/router'
import AuthModal from '@/components/modals/auth'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput, { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input/input'
import { RFHDate, RFHInput, RFHSelect } from '@/components/forms/fields'
import moment from 'moment'
import { getSession, useSession } from "next-auth/react"
import { UseCurrencyConverter } from '@/components/convertCurrency'

interface IProps {
  handleNextStep?: () => void
  data?: any
  bookingDetailData?: any
  onDataSubmit?: (formData: any) => void // Add this prop for the callback function
}
interface statusProps {
  status: string
}
interface formProps {
  formData: {
    id_customer: any
    id_car_business_fleet: number
    pickup_date_time: any
    dropoff_date_time: any
    title: string
    fullname: string
    country: string
    phone: string
    email: string
    passenger_title: string
    passenger_firstname: string
    passenger_lastname: string
    passenger_nationality: string
    passenger_datebirth: any
    insurance: number
    smoking: number
    personal_request: string
  }
}
interface handleInputChangeProps {
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
interface handleTextareaChangeProps {
  handleTextareaChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}
interface handleCheckboxChangeProps {
  handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
interface handleSpecialRequestChangeProps {
  handleSpecialRequestChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
interface handleSelectChangeProps {
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}
interface handlePhoneCodeChangeProps {
  handlePhoneCodeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}
interface handlePhoneSelectAndInputProps {
  handlePhoneSelectAndInput: (event: React.ChangeEvent<HTMLInputElement>) => void
}
interface handleCheckboxPassengerIdentityChangeProps {
  handleCheckboxPassengerIdentityChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
interface AggreementSectionProps {
  agreementChecked: boolean
  handleAgreementChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
interface AggreementCheckedProps {
  agreementChecked: boolean
}
interface handleSubmitProps {
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
interface selectedPhoneCodeProps {
  selectedPhoneCode: string
}


const BookingDetails = (props: IProps) => {
  const router = useRouter();
  const { data, bookingDetailData } = props
  // console.log("data BookingDetails index : ", data)
  const { data: session, status } = useSession()

  const { checkin, checkout } = router.query;
  const id_car_business_fleet = data?.id_car_business_fleet
  const queryParams = `id=${id_car_business_fleet}&checkin=${checkin}&checkout=${checkout}`;
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  // console.log(queryParams)

  //Forms
  const [formData, setFormData] = useState({
    id_customer: session?.user?.id ? Number(session?.user?.id) : null,
    id_car_business_fleet: id_car_business_fleet ? Number(id_car_business_fleet) : null,
    pickup_date_time: checkin,
    dropoff_date_time: checkout,
    title: "Mr",
    fullname: "",
    country: "GB",
    phone: "+1",
    email: "",
    passenger_title: "Mr",
    passenger_firstname: "",
    passenger_lastname: "",
    passenger_nationality: "GB",
    passenger_datebirth: "",
    insurance: 1,
    smoking: 0,
    personal_request: "",
  });

  // useEffect to update id_customer when session changes
  useEffect(() => {
    if (session && session.user.id) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_customer: Number(session.user.id),
      }));
    }
    if (data && data.id_car_business_fleet) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_car_business_fleet: Number(data.id_car_business_fleet),
      }));
    }
  }, [session, data]);

  // console.log('Update FormData : ', formData);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    console.log("formData : ", formData)
    // Check if required fields are empty
    if (
      formData.fullname.trim() === '' ||
      formData.phone.trim() === '+1 ' ||
      formData.email.trim() === '' ||
      formData.passenger_firstname.trim() === '' ||
      formData.passenger_nationality.trim() === '' ||
      formData.passenger_datebirth.trim() === ''
    ) {
      // Handle the case where required fields are empty
      // console.error('Please fill in all required fields.');
      setErrorBanner('Please fill in all required fields.');
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const { status, data, ok, error } = await callAPI('/car-business-booking/add-booking', 'POST', formData, true)
    // console.log(status, data, ok, error);
    if (ok) {
      // console.log("success api handle submit detail booking store   ", status, data, ok, error);
      // Redirect back to the booking details page with the query parameters
      router.push(`/booking/book-transfer/${data?.id_car_business_fleet}/${data?.id_car_booking}`);
    } else {
      // console.log("fail to handle submit post api detail booking store : ", status, data, ok, error);
      if (status === 400) {
        // Redirect back to the booking details page with the query parameters
        router.push(`/car/detail?${queryParams}`);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Update FormData : ', formData);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Update FormData : ', formData);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // console.log('Update FormData : ', formData);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: checked,
    }));

    // console.log('Update FormData : ', formData);
  };


  // Add a new state for the selected phone code
  const [selectedPhoneCode, setSelectedPhoneCode] = useState<string>('ID');

  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [phone, setPhone] = useState<string>()

  // Add a new state for the merged phone number
  const [mergedPhoneNumber, setMergedPhoneNumber] = useState<string>('');

  // Handler for the phone code select
  const handlePhoneCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhoneCode(event.target.value);
  };

  const handlePhoneSelectAndInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    // console.log('selectedPhoneCode : ', selectedPhoneCode);
    // console.log('value : ', value);
    // Update the phone number and country code in formData
    setFormData((prevFormData) => {
      const phone = `${selectedPhoneCode} ${value}`.trim();
      return {
        ...prevFormData,
        phone: phone,
      };
    });
    // console.log('selectedPhoneCode : ', selectedPhoneCode);
    // console.log('value : ', value);
    // console.log('Update FormData : ', formData);
  };

  // Inside the GuestSection component
  const [passengerIdentity, setPassengerIdentity] = useState(false);

  const handleCheckboxPassengerIdentityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setPassengerIdentity(checked);

    // If the checkbox is checked, copy title and fullname from formData to guest_title and guest_fullname
    if (checked) {
      setFormData((prevFormData) => {
        const fullNameParts = prevFormData.fullname.split(' ');
        let passenger_firstname = '';
        let passenger_lastname = '';

        if (fullNameParts.length === 1) {
          passenger_firstname = fullNameParts[0];
        } else if (fullNameParts.length === 2) {
          passenger_firstname = fullNameParts[0];
          passenger_lastname = fullNameParts[1];
        } else if (fullNameParts.length >= 3) {
          passenger_firstname = fullNameParts[0];
          passenger_lastname = fullNameParts.slice(1).join(' '); // Join the remaining parts as the last name
        }

        return {
          ...prevFormData,
          passenger_title: prevFormData.title,
          passenger_firstname: passenger_firstname,
          passenger_lastname: passenger_lastname,
        };
      });
    } else {
      // If the checkbox is unchecked, reset guest_title and guest_fullname to empty strings
      setFormData((prevFormData) => ({
        ...prevFormData,
        passenger_title: '',
        passenger_firstname: '',
        passenger_lastname: '',
      }));
    }
  };

  const handlePassengerDateBirthChange = (date) => {
    setFormData({
      ...formData,
      passenger_datebirth: moment(date).format('YYYY-MM-DD'), // Convert the date to the appropriate format
    });
  };


  const handleDateChange = (date, inputName) => {
    setFormData({
      ...formData,
      [inputName]: moment(date).format('YYYY-MM-DD'), // Convert the date to the appropriate format
    });
  };

  // Add a function to update formData.phone
  const updatePhone = (newPhone) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: newPhone,
    }));
  };

  // Add a state for the checkbox
  const [agreementChecked, setAgreementChecked] = useState(false);

  // Handle the checkbox change event
  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreementChecked(event.target.checked);
    // console.log('Update FormData : ', formData);
  };


  useEffect(() => {
    if (data === null) return
    setFormData((prevFormData) => ({
      ...prevFormData,
      id_customer: session?.user?.id ? Number(session?.user?.id) : null,
      id_car_business_fleet: id_car_business_fleet ? Number(id_car_business_fleet) : null,
      pickup_date_time: checkin,
      dropoff_date_time: checkout,
    }));
  }, [data, session?.user?.id, router.query]); // Trigger the fetch when the currentPage changes

  useEffect(() => {
    if (bookingDetailData) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        id_customer: bookingDetailData?.id_customer,
        id_car_business_fleet: bookingDetailData?.id_car_business_fleet,
        pickup_date_time: bookingDetailData?.pickup_date_time,
        dropoff_date_time: bookingDetailData?.dropoff_date_time,
        title: bookingDetailData?.title,
        fullname: bookingDetailData?.fullname,
        country: bookingDetailData?.country,
        phone: bookingDetailData?.phone,
        email: bookingDetailData?.email,
        passenger_title: bookingDetailData?.passenger_title,
        passenger_firstname: bookingDetailData?.passenger_firstname,
        passenger_lastname: bookingDetailData?.passenger_lastname,
        passenger_nationality: bookingDetailData?.passenger_nationality,
        passenger_datebirth: bookingDetailData?.passenger_datebirth,
        insurance: bookingDetailData?.insurance ?? 1,
        smoking: bookingDetailData?.smoking,
        personal_request: bookingDetailData?.personal_request,
      }));

      const mergedName = `${bookingDetailData.passenger_firstname} ${bookingDetailData.passenger_lastname}`.trim();

      if (bookingDetailData?.passenger_title === bookingDetailData?.title && mergedName === bookingDetailData?.fullname) {
        setPassengerIdentity(true);
      }

      // console.log("bookingDetailData : ", bookingDetailData);
      // console.log("formData from bookingDetailData : ", formData);
    }
  }, [bookingDetailData]); // Trigger the fetch when the currentPage changes

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
        <form action="#" className="booking-hotel__inner">
          <BannerSection />
          <ContactSection status={status} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} formData={formData} bookingDetailData={bookingDetailData} handlePhoneCodeChange={handlePhoneCodeChange} handlePhoneSelectAndInput={handlePhoneSelectAndInput} selectedPhoneCode={selectedPhoneCode} updatePhone={updatePhone} />
          <PassengerSection bookingDetailData={bookingDetailData} handleInputChange={handleInputChange} handleSelectChange={handleSelectChange} handleCheckboxPassengerIdentityChange={handleCheckboxPassengerIdentityChange} formData={formData} onDateChange={handleDateChange} />
          <SpecialRequestSection bookingDetailData={bookingDetailData} handleTextareaChange={handleTextareaChange} handleInputChange={handleInputChange} formData={formData} />
          <AggreementSection agreementChecked={agreementChecked} handleAgreementChange={handleAgreementChange} />
          <FooterSection agreementChecked={agreementChecked} handleSubmit={handleSubmit} {...props} />
        </form>
        <BookingSummary data={data} />
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

const ContactSection = (props) => {
  const [phoneCountry, setPhoneCountry] = useState<string>('US')
  const [phone, setPhone] = useState<string>()
  // console.log("phoneCountry : ", phoneCountry)
  // console.log("phone : ", phone)

  // Update the phone state whenever it changes
  const handlePhoneChange = (phone) => {
    setPhone(phone);
    props.updatePhone(phone);
  };

  useEffect(() => {
    if (props.bookingDetailData) {
      if (props.bookingDetailData.phone) {
        const phoneNumber = parsePhoneNumber(props.bookingDetailData.phone)
        if (phoneNumber) {
          setPhoneCountry(phoneNumber.country)
          setPhone(props.bookingDetailData.phone)
        }
      }
    }
  }, [props.bookingDetailData])

  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Contact Details</p>
      <div className="booking-hotel__contact ">
        <div className="booking-hotel__contact-row">
          <div className="booking-hotel__contact-block">
            <label htmlFor="contact-title">Title</label>
            <select name="title" id="contact-title" placeholder="Your title" onChange={props.handleSelectChange} defaultValue={props.bookingDetailData?.title}>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="-">-</option>
            </select>
          </div>
          <div className="booking-hotel__contact-block w-100">
            <label htmlFor="fullnameBooking">Full name</label>
            <input type="text" name="fullname" id="fullnameBooking" placeholder="Enter your full name" onChange={props.handleInputChange} value={props.bookingDetailData?.fullname} />
          </div>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="contact-country">Country/Region</label>
          <select name="country" id="countryBooking" placeholder="Select your country" onChange={props.handleSelectChange} value={props.bookingDetailData?.country} defaultValue={"GB"}>
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
                  value={phoneCountry}
                  onChange={event => setPhoneCountry(event.target.value || null)}
                  name="phone-code">
                  {getCountries().map((country) => (
                    <option key={country} value={country}>
                      {countryLabels[country]} +{getCountryCallingCode(country)}
                    </option>
                  ))}
                </select>
                <div className={`PhoneInputSelectedValue ${phoneCountry ? 'HasValue' : ''}`}>+{getCountryCallingCode(phoneCountry as CountryCode)}</div>
              </div>
              <PhoneInput international={true} country={phoneCountry as CountryCode} onChange={(phone) => handlePhoneChange(phone)} value={phone} placeholder="(888) 888-8888" />
            </div>
          </div>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="emailBooking">Email Address</label>
          <input type="email" name="email" id="emailBooking" placeholder="Enter your email address" onChange={props.handleInputChange} value={props.bookingDetailData?.email} />
        </div>
        {props?.status === 'unauthenticated' && (
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

const PassengerSection = (props) => {

  // Add the state for passengerIdentity using useState
  const [passengerIdentity, setPassengerIdentity] = useState<boolean>(false);
  // Check if passengerIdentity is true, if so, set passenger_title and passenger_firstname and lastname from formData, otherwise, use empty strings
  const passengerTitle = passengerIdentity ? props.formData.passenger_title : '';
  const passengerFirstName = passengerIdentity ? props.formData.passenger_firstname : '';
  const passengerLastName = passengerIdentity ? props.formData.passenger_lastname : '';

  const [passengerDateBirth, setPassengerDateBirth] = useState<Date>()
  const [passengerIssuedDate, setPassengerIssuedDate] = useState<Date>()
  const [passengerExpiredDate, setPassengerExpiredDate] = useState<Date>()

  // This function will be called when the passengerDateBirth changes

  // This function will be called when a date field changes
  const handleDateChange = (date, inputName) => {
    switch (inputName) {
      case 'passenger_datebirth':
        setPassengerDateBirth(new Date(date));
        break;
      case 'passenger_issued_date':
        setPassengerIssuedDate(new Date(date));
        break;
      case 'passenger_expiry_date':
        setPassengerExpiredDate(new Date(date));
        break;
      // Add cases for other date fields as needed
      default:
        break;
    }
    // Notify the parent component about the change
    if (props.onDateChange) {
      props.onDateChange(new Date(date), inputName);
    }
  };

  useEffect(() => {
    if (props.bookingDetailData) {
      const mergedName = `${props.bookingDetailData.passenger_firstname} ${props.bookingDetailData.passenger_lastname}`.trim(); if (props.bookingDetailData?.passenger_title === props.bookingDetailData?.title && mergedName === props.bookingDetailData?.fullname) {
        setPassengerIdentity(true);
      }

      props.bookingDetailData.passenger_datebirth && setPassengerDateBirth(moment(props.bookingDetailData.passenger_datebirth).toDate())
      props.bookingDetailData.passenger_issued_date && setPassengerIssuedDate(moment(props.bookingDetailData.passenger_issued_date).toDate())
      props.bookingDetailData.passenger_expiry_date && setPassengerExpiredDate(moment(props.bookingDetailData.passenger_expiry_date).toDate())
    }
  }, [props.bookingDetailData]);
  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Passenger Details</p>
      <div className="booking-hotel__guest">
        <div className="booking-hotel__guest-toggle">
          <input type="checkbox" name="sameIdentityBooking" id="sameIdentityBooking" onChange={(event) => {
            props.handleCheckboxPassengerIdentityChange(event); // Call the first function from props
            setPassengerIdentity((prevPassengerIdentity) => !prevPassengerIdentity); // Toggle the passengerIdentity state
          }} checked={passengerIdentity} />
          <p>Same as contact details</p>
        </div>

        {passengerIdentity ? (
          // Show the passenger details from the formData if passengerIdentity is true
          <div className="booking-hotel__guest-row">
            <div className="booking-hotel__guest-block">
              <label htmlFor="passenger-title">Title</label>
              <select name="passenger-title" id="passenger-title" placeholder="Your title" value={passengerTitle} onChange={props.handleSelectChange}>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="-">-</option>
              </select>
            </div>
            <div className="booking-hotel__guest-block w-100">
              <label htmlFor="passenger-first-name">First name</label>
              <input type="text" name="passenger_firstname" id="passenger-first-name" placeholder="Enter your first name" value={passengerFirstName} onChange={props.handleInputChange} />
            </div>
            <div className="booking-hotel__guest-block w-100">
              <label htmlFor="passenger-last-name">Last name</label>
              <input type="text" name="passenger_lastname" id="passenger-last-name" placeholder="Enter your last name" value={passengerLastName} onChange={props.handleInputChange} />
            </div>
          </div>
        ) : (
          // Show the input fields if guestIdentity is false
          <div className="booking-hotel__guest-row">
            <div className="booking-hotel__guest-block">
              <label htmlFor="passenger-title">Title</label>
              <select name="passenger-title" id="passenger-title" placeholder="Your title" onChange={props.handleSelectChange}>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="-">-</option>
              </select>
            </div>
            <div className="booking-hotel__guest-block w-100">
              <label htmlFor="passenger-first-name">First name</label>
              <input type="text" name="passenger_firstname" id="passenger-first-name" placeholder="Enter your first name" onChange={props.handleInputChange} />
            </div>
            <div className="booking-hotel__guest-block w-100">
              <label htmlFor="passenger-last-name">Last name</label>
              <input type="text" name="passenger_lastname" id="passenger-last-name" placeholder="Enter your last name" onChange={props.handleInputChange} />
            </div>
          </div>
        )}
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passengerNationality">Nationality</label>
            <select name="passenger_nationality" id="passengerNationality" placeholder="Select your country" onChange={props.handleSelectChange} value={props.bookingDetailData?.passenger_nationality} defaultValue={'GB'}>
              {getCountries().map((country) => (
                <option key={country} value={country}>
                  {countryLabels[country]}
                </option>
              ))}
            </select>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger_datebirth">Date of birth</label>
            <RFHDate date={passengerDateBirth} id='passenger_datebirth' name='passenger_datebirth' onDateChange={(date) => handleDateChange(date, 'passenger_datebirth')} type="text" placeholder="DD / MM / YY" />
          </div>
        </div>
      </div>
    </div>
  )
}

const SpecialRequestSection = (props) => {
  const [moreRequest, setMoreRequest] = useState(false);
  const [insurance, setInsurance] = useState(null);
  const [smoking, setSmoking] = useState(null);

  const handleMoreRequestToggle = () => {
    setMoreRequest((prevMoreRequest) => !prevMoreRequest);
  };



  useEffect(() => {
    if (props.bookingDetailData) {
      props.bookingDetailData.insurance && setInsurance(Number(props.bookingDetailData?.insurance))
      props.bookingDetailData.smoking && setSmoking(Number(props.bookingDetailData?.smoking))
    }
  }, [props.bookingDetailData]);


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
          <p className="booking-hotel__special-question-title">Are you sure you don't want Full Protection Insurance for $40? </p>
          <div className="booking-hotel__special-question-row">
            {props.bookingDetailData?.insurance === 1 || props.bookingDetailData?.insurance === null ? (
              <>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="insurance" id="insurance-1" className="form-check-input" value={1} onChange={props.handleInputChange} defaultChecked />
                  <label htmlFor="insurance-1">Yes</label>
                </div>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="insurance" id="insurance-0" className="form-check-input" value={0} onChange={props.handleInputChange} />
                  <label htmlFor="insurance-0">No</label>
                </div>
              </>
            ) : (
              <>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="insurance" id="insurance-1" className="form-check-input" value={1} onChange={props.handleInputChange} />
                  <label htmlFor="insurance-1">Yes</label>
                </div>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="insurance" id="insurance-0" className="form-check-input" value={0} onChange={props.handleInputChange} defaultChecked />
                  <label htmlFor="insurance-0">No</label>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="booking-hotel__special-question">
          <p className="booking-hotel__special-question-title">Do you have a smoking preference?</p>
          <div className="booking-hotel__special-question-row">
            {props.bookingDetailData?.smoking === 0 || props.bookingDetailData?.smoking === null ? (
              <>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="smoking" id="smoking" className="form-check-input" value={0} onChange={props.handleInputChange} defaultChecked />
                  <label htmlFor="smoking">Non-smoking</label>
                </div>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="smoking" id="smoking-1" className="form-check-input" value={1} onChange={props.handleInputChange} />
                  <label htmlFor="smoking-1">Smoking</label>
                </div>
              </>
            ) : (
              <>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="smoking" id="smoking" className="form-check-input" value={0} onChange={props.handleInputChange} />
                  <label htmlFor="smoking">Non-smoking</label>
                </div>
                <div className="booking-hotel__special-question-block form-check">
                  <input type="radio" name="smoking" id="smoking-1" className="form-check-input" value={1} onChange={props.handleInputChange} defaultChecked />
                  <label htmlFor="smoking-1">Smoking</label>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="booking-hotel__special-separator"></div>
        <a className="booking-hotel__special-toggle" data-bs-toggle="collapse" href="#MoreRequestSection" role="button" aria-expanded="false" aria-controls="MoreRequestSection" onClick={handleMoreRequestToggle}>
          {moreRequest ? 'Hide' : 'Show'} more requests
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
        <div className="booking-hotel__special-inner collapse" id="MoreRequestSection">
          <div className="booking-hotel__special-question">
            <p className="booking-hotel__special-question-title">Any personal requests? Let us know in English or Arabic</p>
            <textarea name="personal_request" id="personal_request" className="form-control" rows={5} placeholder="Write your request here.." onChange={props.handleTextareaChange} value={props.bookingDetailData?.personal_request}></textarea>
          </div>
        </div>
      </div>
    </div>
  )
}

const AggreementSection = (props: AggreementSectionProps) => {
  return (
    <div className="booking-hotel__aggreement form-check">
      <input type="checkbox" name="privacy-policy-tos" className="form-check-input" checked={props.agreementChecked} onChange={props.handleAgreementChange} />
      <p>By clicking the button below, you have agreed to our <a href="#" className="booking-hotel__aggreement-link">Privacy Policy</a> and <a href="#" className="booking-hotel__aggreement-link">Terms & Conditions.</a></p>
    </div>
  )
}

const FooterSection = (props) => {
  const { data: dataCarBooking } = props
  const { data, status } = useSession()

  const isAuthenticated = status !== 'loading' && status === 'authenticated' && data.user.role === 'customer'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && data.user.role === 'customer')
 const {currencySymbol, changePrice} = UseCurrencyConverter();
  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__footer">
        <div className="booking-hotel__footer-total">
          <p>Total :</p>
          <div className="booking-hotel__footer-price">
            <h5>{currencySymbol} {changePrice(String(dataCarBooking?.book_details?.total_price))}</h5>
            <a href="#" className="booking-hotel__footer-details">See pricing details</a>
          </div>
        </div>
        {isAuthenticated && (
          <button
            onClick={(event) => {
              // Call the handleSubmit function from props
              props.handleSubmit(event);
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
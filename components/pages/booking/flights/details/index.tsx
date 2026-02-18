import React, { useState, useEffect } from 'react'
import { Icons } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import BookingSummary from '@/components/pages/booking/flights/summary'
import { useFlightStore } from '@/lib/stores/flightStore'
import { UseCurrencyConverter } from '@/components/convertCurrency'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
import { useSession } from 'next-auth/react'
import AuthModal from '@/components/modals/auth'
import { useRouter } from 'next/router'

interface IProps {
  handleNextStep: () => void
}

interface FormData {
  // Contact Details
  title: string
  fullname: string
  country: string
  phone: string
  email: string
  
  // Passenger Details
  passenger_title: string
  passenger_firstname: string
  passenger_lastname: string
  passenger_nationality: string
  passenger_dob: string
  passenger_passport: string
  passenger_passport_issued: string
  passenger_passport_country: string
  passenger_passport_expiry: string
}

const BookingDetails = (props: IProps) => {
  const { data: session, status } = useSession()
  const { setPassengerData, selectedFlight } = useFlightStore()
  const router = useRouter()
  
  const [errorBanner, setErrorBanner] = useState<string | null>(null)
  const [agreementChecked, setAgreementChecked] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    title: 'Mr',
    fullname: '',
    country: 'GB',
    phone: '+1 ',
    email: '',
    passenger_title: 'Mr',
    passenger_firstname: '',
    passenger_lastname: '',
    passenger_nationality: 'GB',
    passenger_dob: '',
    passenger_passport: '',
    passenger_passport_issued: '',
    passenger_passport_country: 'GB',
    passenger_passport_expiry: '',
  })

  // Check if flight is selected
  useEffect(() => {
    if (!selectedFlight) {
      router.push('/flights')
    }
  }, [selectedFlight, router])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }))
  }

  const handleAgreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreementChecked(event.target.checked)
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()

    // Validate required fields
    if (
      formData.fullname.trim() === '' ||
      formData.phone.trim() === '+1 ' ||
      formData.email.trim() === '' ||
      formData.passenger_firstname.trim() === '' ||
      formData.passenger_lastname.trim() === '' ||
      formData.passenger_nationality.trim() === '' ||
      formData.passenger_dob.trim() === '' ||
      formData.passenger_passport.trim() === '' ||
      formData.passenger_passport_issued.trim() === '' ||
      formData.passenger_passport_country.trim() === '' ||
      formData.passenger_passport_expiry.trim() === ''
    ) {
      setErrorBanner('Please fill in all required fields.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Validate passport dates
    const issuedDate = new Date(formData.passenger_passport_issued)
    const expiryDate = new Date(formData.passenger_passport_expiry)
    const today = new Date()

    if (expiryDate <= today) {
      setErrorBanner('Passport has expired. Please enter a valid passport.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (issuedDate >= expiryDate) {
      setErrorBanner('Passport issued date must be before expiry date.')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Save passenger data to store
    setPassengerData({
      fullname: `${formData.passenger_firstname} ${formData.passenger_lastname}`,
      email: formData.email,
      phone: formData.phone,
      title: formData.passenger_title,
      nationality: formData.passenger_nationality,
      passportNumber: formData.passenger_passport,
      dateOfBirth: formData.passenger_dob,
      passportIssued: formData.passenger_passport_issued,
      passportCountry: formData.passenger_passport_country,
      passportExpiry: formData.passenger_passport_expiry,
    })

    console.log('✓ Passenger data saved to store')
    
    // Proceed to next step (payment)
    props.handleNextStep()
  }

  if (!selectedFlight) {
    return null
  }

  return (
    <div className="container">
      <div className='mt-3'>
        {errorBanner && (
          <div className='d-flex gap-3 booking-error-banner'>
            <SVGIcon src={Icons.CircleErrorLarge} width={40} height={40} />
            <p className='fs-xl'>{errorBanner}</p>
          </div>
        )}
      </div>
      <div className="booking-hotel__wrapper">
        <form className="booking-hotel__inner">
          <ContactSection 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          <PassengerSection 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          <AggreementSection 
            agreementChecked={agreementChecked}
            handleAgreementChange={handleAgreementChange}
          />
          <FooterSection 
            agreementChecked={agreementChecked}
            handleSubmit={handleSubmit}
            {...props}
          />
        </form>
        <BookingSummary />
        <AuthModal />
      </div>
    </div>
  )
}

interface ContactSectionProps {
  formData: FormData
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const ContactSection = (props: ContactSectionProps) => {
  const { data: session, status } = useSession()
  const [selectedPhoneCode, setSelectedPhoneCode] = useState<string>('GB')

  const handlePhoneCodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPhoneCode(event.target.value)
  }

  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Contact Details</p>
      <div className="booking-hotel__contact">
        <div className="booking-hotel__contact-row">
          <div className="booking-hotel__contact-block">
            <label htmlFor="contact-title">Title</label>
            <select 
              name="title" 
              id="contact-title" 
              value={props.formData.title}
              onChange={props.handleSelectChange}
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
          </div>
          <div className="booking-hotel__contact-block w-100">
            <label htmlFor="fullname">Full name</label>
            <input 
              type="text" 
              name="fullname" 
              id="fullname" 
              placeholder="Enter your full name" 
              value={props.formData.fullname}
              onChange={props.handleInputChange}
              required
            />
          </div>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="country">Country/Region</label>
          <select 
            name="country" 
            id="country" 
            value={props.formData.country}
            onChange={props.handleSelectChange}
          >
            {getCountries().map((country) => (
              <option key={country} value={country}>
                {countryLabels[country]}
              </option>
            ))}
          </select>
        </div>
        <div className="PhoneInput form-control-wrapper">
          <div className="booking-hotel__contact-block">
            <label htmlFor="phone">Phone Number</label>
            <div className="form-control-field">
              <div className="PhoneInputCountry">
                <select
                  value={selectedPhoneCode}
                  onChange={handlePhoneCodeChange}
                  name="phone-code"
                >
                  {getCountries().map((country) => (
                    <option key={country} value={country}>
                      {countryLabels[country]} +{getCountryCallingCode(country)}
                    </option>
                  ))}
                </select>
                <div className={`PhoneInputSelectedValue ${selectedPhoneCode ? 'HasValue' : ''}`}>
                  +{getCountryCallingCode(selectedPhoneCode as CountryCode)}
                </div>
              </div>
              <PhoneInput
                international={true}
                country={selectedPhoneCode as CountryCode}
                value={props.formData.phone}
                onChange={(value) => {
                  props.handleInputChange({
                    target: { name: 'phone', value: value || '' }
                  } as any)
                }}
                placeholder="(888) 888-8888"
              />
            </div>
          </div>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Enter your email address" 
            value={props.formData.email}
            onChange={props.handleInputChange}
            required
          />
        </div>
        {status === 'unauthenticated' && (
          <div className="booking-hotel__contact-banner">
            <div className="booking-hotel__contact-banner-icon">
              <SVGIcon src={Icons.Lamp} width={20} height={20} />
            </div>
            <p className="booking-hotel__contact-banner-text">
              Enjoy special discounts & other benefits! 
              <a href="#" className="booking-hotel__contact-banner-link" data-bs-toggle="modal" data-bs-target="#auth-modal"> Log in</a> or 
              <a href="#" className="booking-hotel__contact-banner-link" data-bs-toggle="modal" data-bs-target="#auth-modal"> register</a> now.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface PassengerSectionProps {
  formData: FormData
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleSelectChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const PassengerSection = (props: PassengerSectionProps) => {
  const [sameAsContact, setSameAsContact] = useState(false)

  const handleSameAsContactChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked
    setSameAsContact(checked)

    if (checked) {
      // Split fullname into first and last name
      const nameParts = props.formData.fullname.split(' ')
      const firstname = nameParts[0] || ''
      const lastname = nameParts.slice(1).join(' ') || ''

      // Copy contact details to passenger details
      props.handleInputChange({ target: { name: 'passenger_title', value: props.formData.title } } as any)
      props.handleInputChange({ target: { name: 'passenger_firstname', value: firstname } } as any)
      props.handleInputChange({ target: { name: 'passenger_lastname', value: lastname } } as any)
      props.handleSelectChange({ target: { name: 'passenger_nationality', value: props.formData.country } } as any)
    }
  }

  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Passenger Details</p>
      <div className="booking-hotel__guest">
        <div className="booking-hotel__guest-toggle">
          <input 
            type="checkbox" 
            name="same-contact" 
            id="same-contact"
            checked={sameAsContact}
            onChange={handleSameAsContactChange}
          />
          <p>Same as contact details</p>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block">
            <label htmlFor="passenger-title">Title</label>
            <select 
              name="passenger_title" 
              id="passenger-title"
              value={props.formData.passenger_title}
              onChange={props.handleSelectChange}
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-firstname">First name</label>
            <input 
              type="text" 
              name="passenger_firstname" 
              id="passenger-firstname" 
              placeholder="Enter first name"
              value={props.formData.passenger_firstname}
              onChange={props.handleInputChange}
              required
            />
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-lastname">Last name</label>
            <input 
              type="text" 
              name="passenger_lastname" 
              id="passenger-lastname" 
              placeholder="Enter last name"
              value={props.formData.passenger_lastname}
              onChange={props.handleInputChange}
              required
            />
          </div>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-nationality">Nationality</label>
            <select 
              name="passenger_nationality" 
              id="passenger-nationality"
              value={props.formData.passenger_nationality}
              onChange={props.handleSelectChange}
            >
              {getCountries().map((country) => (
                <option key={country} value={country}>
                  {countryLabels[country]}
                </option>
              ))}
            </select>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-dob">Date of birth</label>
            <input 
              type="date" 
              name="passenger_dob" 
              id="passenger-dob"
              value={props.formData.passenger_dob}
              onChange={props.handleInputChange}
              required
            />
          </div>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-passport">Passport No.</label>
            <input 
              type="text" 
              name="passenger_passport" 
              id="passenger-passport" 
              placeholder="Enter passport number"
              value={props.formData.passenger_passport}
              onChange={props.handleInputChange}
              required
            />
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-passport-issued">Issued date</label>
            <input 
              type="date" 
              name="passenger_passport_issued" 
              id="passenger-passport-issued"
              value={props.formData.passenger_passport_issued}
              onChange={props.handleInputChange}
              required
            />
          </div>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-passport-country">Issuing Country</label>
            <select 
              name="passenger_passport_country" 
              id="passenger-passport-country"
              value={props.formData.passenger_passport_country}
              onChange={props.handleSelectChange}
            >
              {getCountries().map((country) => (
                <option key={country} value={country}>
                  {countryLabels[country]}
                </option>
              ))}
            </select>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="passenger-passport-expiry">Expiry date</label>
            <input 
              type="date" 
              name="passenger_passport_expiry" 
              id="passenger-passport-expiry"
              value={props.formData.passenger_passport_expiry}
              onChange={props.handleInputChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface AggreementSectionProps {
  agreementChecked: boolean
  handleAgreementChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const AggreementSection = (props: AggreementSectionProps) => {
  return (
    <div className="booking-hotel__aggreement form-check">
      <input 
        type="checkbox" 
        className="form-check-input"
        checked={props.agreementChecked}
        onChange={props.handleAgreementChange}
      />
      <p>By clicking the button below, you have agreed to our <a href="#" className="booking-hotel__aggreement-link">Privacy Policy</a> and <a href="#" className="booking-hotel__aggreement-link">Terms & Conditions.</a></p>
    </div>
  )
}

interface FooterSectionProps extends IProps {
  agreementChecked: boolean
  handleSubmit: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const FooterSection = (props: FooterSectionProps) => {
  const { data: session, status } = useSession()
  const { selectedFlight } = useFlightStore()
  const { changePrice, currencySymbol } = UseCurrencyConverter()

  const isAuthenticated = status !== 'loading' && status === 'authenticated' && session?.user?.role === 'customer'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && session?.user?.role === 'customer')

  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__footer">
        <div className="booking-hotel__footer-total">
          <p>Total :</p>
          <div className="booking-hotel__footer-price">
            <h5>{currencySymbol} {selectedFlight ? changePrice(selectedFlight.price.amount) : '0.00'}</h5>
            {selectedFlight && selectedFlight.priceBreakdowns && selectedFlight.priceBreakdowns.length > 0 && (
              <a href="#" className="booking-hotel__footer-details">See pricing details</a>
            )}
          </div>
        </div>
        {isAuthenticated && (
          <button 
            onClick={props.handleSubmit}
            type="button" 
            className={`btn btn-lg btn-success ${!props.agreementChecked ? 'disabled' : ''}`}
            disabled={!props.agreementChecked}
          >
            Continue to Payment
          </button>
        )}
        {isNotAuthenticated && (
          <button 
            type="button" 
            className={`btn btn-lg btn-success ${!props.agreementChecked ? 'disabled' : ''}`}
            disabled={!props.agreementChecked}
            data-bs-toggle="modal" 
            data-bs-target="#auth-modal"
          >
            Continue to Payment
          </button>
        )}
      </div>
    </div>
  )
}

export default BookingDetails
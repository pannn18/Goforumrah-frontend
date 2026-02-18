import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { RFHInput } from "@/components/forms/fields"
import { useRouter } from "next/router"
import Link from 'next/link'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
import { Icons } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Layout from '@/components/layout'
import businessImage from '@/assets/images/business_login_img.jpg'
import Navbar from '@/components/layout/navbar'
import SVGIcon from '@/components/elements/icons'
import businessInfo from '@/assets/images/alert_info.svg'
import { callAPI } from '@/lib/axiosHelper'
import checkSoftIcon from '@/assets/images/icon_check_soft.svg'

type wizardStep = 'email' | 'contact' | 'password'

const wizardData: {
  [step: string]: {
    title: string
    description: string
  }
} = {
  'email': {
    title: 'Create your partner account',
    description: 'Create an account to list and manage your property.'
  },
  'contact': {
    title: 'Contact details',
    description: 'Create your partner account create an account to list and manage your property'
  },
  'password': {
    title: 'Create password',
    description: 'Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers.'
  },
}

const defaultPhoneCountry = 'US'

const Signup = () => {
  const fieldShapes = {
    email: yup.string().email('Wrong email format').required('Email address is required'),
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    phone: yup.string().required('Phone number is required'),
    password: yup.string().required('Password is required').matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})/,
      'Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers'
    ),
    confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
  }

  const schema = yup.object().shape(fieldShapes)

  const router = useRouter()

  const [activeStep, setActiveStep] = useState<wizardStep>('email')
  const [email, setEmail] = useState<string>('')
  const [isSignupSuccess, setIsSignupSuccess] = useState<boolean>(false)
  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [error, setError] = useState<string>()

  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  const handlePreviousStep = () => {
    const previousSteps = {
      'password': 'contact',
      'contact': 'email'
    }

    const previousStep = previousSteps[activeStep]
    previousStep && setActiveStep(previousStep)
  }

  // Submit handler
  const onSubmit = async (values) => {
    setError('')

    // Email Step Handler
    if (activeStep === 'email' && ((!isValid && !errors.email && !values.email) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['email'].includes(field)))

      if (!errors.email) setActiveStep('contact')

      return
    }

    // Contact Phone Handler
    if (activeStep === 'contact') {
      if (!phone?.length) return setFieldError('phone', { message: 'Phone number is required', type: 'required' })
      else clearErrors(['phone'])
    }

    // Contact Step Handler
    if (activeStep === 'contact' && ((!isValid && !errors.firstName && !values.firstName && !errors.lastName && !values.lastName) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['firstName', 'lastName'].includes(field)))

      setActiveStep('password')

      return
    }

    // Password Step Handler
    if (activeStep === 'password' && ((!isValid && !errors.password && !values.password && !errors.confirmPassword && !values.confirmPassword) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['password', 'confirmPassword'].includes(field)))

      const { email, firstName: firstname, lastName: lastname, password } = getValues()
      const payload = {
        email,
        username: firstname,
        firstname,
        lastname,
        password,
        phone,
        status: null,
        soft_delete: 0
      }

      const { ok, error } = await callAPI(`/car-business/store`, 'POST', payload)

      if (ok && !error) {
        setEmail(email)
        reset()
        setIsSignupSuccess(true)
      } else {
        setError(error || 'Unknown error')
      }

      return
    }
  }

  return (
    <Layout>
      <Navbar showHelp={true} hideAuthButtons={true} />
      {isSignupSuccess
        ? (
          <div className="signup-business signup-business__verify-box">
            <div className='container signup-business__container'>
              <div className='row'>
                <div className='col'>
                  <BlurPlaceholderImage className='signup-business__verify-icon' alt='image' src={checkSoftIcon} width={72} height={72} />
                  <h3 className='signup-business__verify-title'>Verify your email address</h3>
                  <p className='signup-business__verify-caption'>
                    We sent you an email with a verification link to <strong>{email}</strong>.
                    Please open your email and follow the link in the email we just sent.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="signup-business">
            <div className='container signup-business__container'>
              <div className='row h-100'>
                <div className='col-lg-6 col-lg-offset-6 col-md-12 signup-business__left'>
                  <div className='signup-business__left-content'>
                    {activeStep !== 'email' && (
                      <div className='signup-business__nav'>
                        <a onClick={handlePreviousStep} type="button" className='signup-business__nav-link'>
                          <SVGIcon src={Icons.ArrowLeft} width={24} height={24} className="signup-business__nav-image" />
                          Back
                        </a>
                      </div>
                    )}
                    <h1 className='signup-business__left-heading'>{wizardData[activeStep].title}</h1>
                    <p className='signup-business__left-subheading'>{wizardData[activeStep].description}</p>
                    <form className='signup-business__form' onSubmit={handleSubmit(onSubmit, onSubmit)}>
                      {activeStep === 'email' && (
                        <>
                          <label htmlFor="emailAddress" className="form-label goform-label signup-business__form-label">Email address</label>
                          <RFHInput register={register('email')} type="email" placeholder="Enter your email address" error={errors.email?.message.toString()} />
                        </>
                      )}

                      {activeStep === 'contact' && (
                        <>
                          <div className="form-group">
                            <label htmlFor="exampleFirstName" className="form-label goform-label signup-business__form-label">First name</label>
                            <RFHInput register={register('firstName')} type="text" placeholder="Enter your first name" error={errors.firstName?.message.toString()} />
                          </div>
                          <div className="form-group" style={{ marginTop: 24 }}>
                            <label htmlFor="exampleFirstName" className="form-label goform-label signup-business__form-label">Last name</label>
                            <RFHInput register={register('lastName')} type="text" placeholder="Enter your last name" error={errors.lastName?.message.toString()} />
                          </div>
                          <div className="form-group" style={{ marginTop: 24 }}>
                            <label className="form-label">Phone Number</label>
                            <div className="PhoneInput form-control-wrapper">
                              <div className={`form-control-field ${errors.phone ? 'form-control-field--error' : ''}`}>
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
                                  <div className={`PhoneInputSelectedValue ${phoneCountry ? 'HasValue' : ''}`}>+{getCountryCallingCode((phoneCountry || defaultPhoneCountry) as CountryCode)}</div>
                                </div>
                                <PhoneInput international={true} country={(phoneCountry || defaultPhoneCountry) as CountryCode} value={phone} onChange={setPhone} placeholder="(888) 888-8888" />
                              </div>
                              {errors.phone && (
                                <div className="form-control-message form-control-message--error">{errors.phone?.message.toString()}</div>
                              )}
                            </div>
                          </div>
                          <div className='goform-alert signup-business__form-alert' style={{ marginTop: 24 }}>
                            <BlurPlaceholderImage className='goform-alert-image signup-business__form-alert-image' alt='image' src={businessInfo} width={28} height={28} />
                            <p>We'll text a two-factor authentication code to this number when you sign in.</p>
                          </div>
                        </>
                      )}

                      {activeStep === 'password' && (
                        <>
                          <div className="form-group">
                            <label className="form-label goform-label signup-business__form-label">Password</label>
                            <RFHInput register={register('password')} type="password" placeholder="Enter your password" error={errors.password?.message.toString()} />
                          </div>
                          <div className="form-group" style={{ marginTop: 24 }}>
                            <label className="form-label goform-label signup-business__form-label">Confirm Password</label>
                            <RFHInput register={register('confirmPassword')} type="password" placeholder="Enter your confirm password" error={errors.confirmPassword?.message.toString()} />
                          </div>
                        </>
                      )}

                      {error && (
                        <div className="d-flex flex-column align-items-stretch text-center" style={{ marginTop: 24 }}>
                          <p className='text-danger-main'>
                            {error && error === 'Email or Username is already in use.'
                              ?
                              <>Email or Username is already in use, If you already have an account, <span className='d-block'>please proceed to the <Link href="/business/car/login" className='booking-hotel__aggreement-link'>login page</Link>.</span>
                              </>
                              : error}
                          </p>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="btn goform-button goform-button--fill-green signup-business__form-submit"
                        style={{ marginTop: 24 }}>
                        {activeStep === 'password' ? 'Create account' : 'Continue'}
                      </button>
                    </form>
                    {activeStep === 'email' && (
                      <Link href='/business/car/login' className='btn goform-button goform-button--outline-green signup-business__form-button'>Login</Link>
                    )}
                    <p className='signup-business__left-info'>By signing in or creating an account, you agree with our <a>Terms & conditions</a> and <a>Privacy statement</a></p>
                  </div>
                  <div className='signup-business__left-footer'>
                    <p>All rights reserved. Copyright 2024 – GoForUmrah.com™</p>
                  </div>
                </div>
              </div>
            </div>
            <BlurPlaceholderImage className='signup-business__image' alt='image' src={businessImage} width={2100} height={2460} />
          </div>
        )}
    </Layout>
  )
}

export default Signup
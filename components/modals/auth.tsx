import React, { useEffect, useRef, useState } from 'react'
import SVGIcon from '../elements/icons'
import { Icons } from '@/types/enums'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { signIn, useSession } from 'next-auth/react'
import { RFHInput } from '../forms/fields'
import { callAPI } from '@/lib/axiosHelper'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
import moment from 'moment'
import platform from 'platform'
import { useRouter } from 'next/router'

type wizardStep = 'email' | 'password' | 'forgot' | 'signupEmail' | 'signupPassword' | 'signinPhone' | 'signinPhoneCode'

const fieldShapes = {
  email: yup.string().email('Wrong email format').required('Email address is required'),
  password: yup.string().required('Password is required'),
  forgotEmail: yup.string().email('Wrong email format').required('Email address is required'),
  signinPhone: yup.string().required('Phone number is required'),
  signinPhoneCode: yup.string().required('Verification Code is required'),
  signupName: yup.string().required('Full name is required'),
  signupAgencyName: yup.string().required('Agency name is required'),
  signupEmail: yup.string().email('Wrong email format').required('Email address is required'),
  signupPhone: yup.string().required('Phone number is required'),
  signupPassword: yup.string().required('Password is required').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})/,
    'Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers'
  ),
  signupConfirmPassword: yup.string().oneOf([yup.ref('signupPassword'), null], 'Passwords must match')
}

const schema = yup.object().shape(fieldShapes)

const defaultPhoneCountry = 'US'

const AuthModal = () => {
  const router = useRouter()
  const [latLong, setLatLong] = useState<{ latitude: number, longitude: number } | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => setLatLong({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    )
  }, [])

  const [currentStep, setCurrentStep] = useState<wizardStep>('email')
  const [isTravelAgent, setIsTravelAgent] = useState<boolean>(false)
  const [isSigninSuccess, setIsSigninSuccess] = useState<boolean>(false)
  const [isForgotSuccess, setIsForgotSuccess] = useState<boolean>(false)
  const [isSignupSuccess, setIsSignupSuccess] = useState<boolean>(false)
  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [signinPhone, setSigninPhone] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [error, setError] = useState<string>()
  const [phoneCodeCountdown, setPhoneCodeCountdown] = useState<number>(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const intervalIDRef = React.useRef(null)

  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  const stopTimer = React.useCallback(() => {
    clearInterval(intervalIDRef.current)
    intervalIDRef.current = null
  }, [])

  const startTimer = React.useCallback(() => {
    let waitingTime = 300

    stopTimer()
    setPhoneCodeCountdown(waitingTime)

    intervalIDRef.current = setInterval(() => {
      let time = waitingTime--
      setPhoneCodeCountdown(time)

      if (time <= 0) stopTimer()
    }, 1000)
  }, [])

  React.useEffect(() => {
    return () => clearInterval(intervalIDRef.current) // to clean up on unmount
  }, [])

  const resendCode = async () => {
    setError('')
    clearErrors(Object.keys(fieldShapes))

    // return startTimer()
    if (!signinPhone?.length) return setFieldError('signinPhoneCode', { message: 'Phone number is required', type: 'required' })

    const payload = {
      phone: signinPhone
    }

    const { ok, error } = await callAPI(`/${isTravelAgent ? 'agent' : 'customer'}/phone-login-request`, 'POST', payload)

    if (ok && !error) {
      startTimer()
    } else {
      setFieldError('signinPhoneCode', { message: error || 'Unknown error' })
    }
  }

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onSubmit = async (values) => {
    setError('')

    // Check Email Handler
    if (currentStep === 'email' && ((!isValid && !errors.email && !values.email) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['email'].includes(field)))

      const { email } = getValues()
      const payload = {
        email
      }

      const { ok, status, error } = await callAPI(`/${isTravelAgent ? 'agent' : 'customer'}/check-account`, 'POST', payload)

      if (ok) {
        setCurrentStep('password')
      } else if (status == 400) {
        setValue('signupEmail', email)
        setCurrentStep('signupEmail')
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    // Signin email Handler
    if (currentStep === 'password' && ((!isValid && !errors.password && !values.password) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['password'].includes(field)))

      const { email, password } = getValues()
      const { error, ok, status } = await signIn('credentials', {
        role: isTravelAgent ? 'agent' : 'customer',
        email,
        password,
        useragent_info: platform?.ua || '',
        device_info: platform?.description || '',
        location_info: latLong?.latitude && latLong?.longitude ? `${latLong.latitude} ${latLong.longitude}` : '',
        redirect: false
      })

      if (ok && status == 200) {
        reset()
        setIsSigninSuccess(true)
        isTravelAgent && router.replace('/agent')
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    // Signin phone handler
    if (currentStep === 'signinPhone') {
      clearErrors(Object.keys(fieldShapes))

      if (!signinPhone?.length) return setFieldError('signinPhone', { message: 'Phone number is required', type: 'required' })

      // startTimer()
      // setCurrentStep('signinPhoneCode')
      // return
      const payload = {
        phone: signinPhone
      }

      const { ok, error } = await callAPI(`/${isTravelAgent ? 'agent' : 'customer'}/phone-login-request`, 'POST', payload)

      if (ok && !error) {
        startTimer()
        setCurrentStep('signinPhoneCode')
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    // Signin phone verification handler
    if (currentStep === 'signinPhoneCode' && ((!isValid && !errors.signinPhoneCode && !values.signinPhoneCode) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['signinPhoneCode'].includes(field)))

      const { signinPhoneCode } = getValues()

      const { error, ok, status } = await signIn('credentials', {
        type: 'phone',
        role: isTravelAgent ? 'agent' : 'customer',
        phone: signinPhone,
        code: signinPhoneCode,
        useragent_info: platform?.ua || '',
        device_info: platform?.description || '',
        location_info: latLong?.latitude && latLong?.longitude ? `${latLong.latitude} ${latLong.longitude}` : '',
        redirect: false
      })

      if (ok && status == 200) {
        reset()
        setIsSigninSuccess(true)
        isTravelAgent && router.replace('/agent')
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    // Signup First Step Handler
    if (currentStep === 'signupEmail') {
      clearErrors(Object.keys(fieldShapes).filter(field => !['signupName', 'signupAgencyName', 'signupEmail'].includes(field)))

      if (!phone?.length) return setFieldError('signupPhone', { message: 'Phone number is required', type: 'required' })

      if (isTravelAgent) {
        if ((!isValid && !errors.signupAgencyName && !values.signupAgencyName && !errors.signupEmail && !values.signupEmail) || (isValid)) {
          return setCurrentStep('signupPassword')
        }
      } else {
        if ((!isValid && !errors.signupName && !values.signupName && !errors.signupEmail && !values.signupEmail) || (isValid)) {
          return setCurrentStep('signupPassword')
        }
      }
    }

    // Signup Last Step Handler
    if (currentStep === 'signupPassword' && ((!isValid && !errors.signupPassword && !values.signupPassword && !errors.signupConfirmPassword && !values.signupConfirmPassword) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['signupPassword', 'signupConfirmPassword'].includes(field)))

      const { signupName: name, signupAgencyName: agencyName, signupEmail: email, signupPassword: password } = getValues()
      const payload = {
        type_login: 1,
        social_ids: null,
        agency_name: isTravelAgent ? agencyName : name,
        email,
        password,
        phone,
        status: null,
        soft_delete: 0
      }

      const { ok, error } = await callAPI(`/${isTravelAgent ? 'agent' : 'customer'}/store`, 'POST', payload)

      if (ok && !error) {
        reset()
        setIsSignupSuccess(true)
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    // Forgot Password Handler
    if (currentStep === 'forgot' && ((!isValid && !errors.forgotEmail && !values.forgotEmail) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['forgotEmail'].includes(field)))

      const { forgotEmail: email } = getValues()
      const payload = {
        email
      }

      const { ok, error } = await callAPI(`/${isTravelAgent ? 'agent' : 'customer'}/forgot-password/request`, 'POST', payload)

      if (ok && !error) {
        reset()
        setIsForgotSuccess(true)
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    return
  }

  // Modal event listener
  useEffect(() => {
    const modal = modalRef.current

    const onModalShow = () => {
      clearErrors(Object.keys(fieldShapes))
      setError('')
      setCurrentStep('email')
      setIsSigninSuccess(false)
      setIsSignupSuccess(false)
      setIsForgotSuccess(false)
    }

    const onModalHidden = () => {
      clearErrors(Object.keys(fieldShapes))
      setError('')
      setCurrentStep('email')
      setIsSigninSuccess(false)
      setIsSignupSuccess(false)
      setIsForgotSuccess(false)
    }

    modal.addEventListener('show.bs.modal', onModalShow)
    modal.addEventListener('hidden.bs.modal', onModalHidden)

    return () => {
      modal.removeEventListener('show.bs.modal', onModalShow)
      modal.removeEventListener('hidden.bs.modal', onModalHidden);
    }
  }, [])

  // Connect phone number to form field
  // useEffect(() => {
  //   setValue('signupPhone', phone)
  // }, [phone])


  return (
    <div ref={modalRef} className="modal login-modal create-account-modal fade" id="auth-modal" aria-hidden="true" tabIndex={-1}>
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <div className="flex-grow-1 text-center text-neutral-primary fs-lg fw-bold">
              {((currentStep === 'email' || currentStep === 'signinPhone') && (!isSigninSuccess && !isSignupSuccess && !isForgotSuccess)) && 'Sign in or create an account'}
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            {/* Sign in success modal */}
            {isSigninSuccess && (
              <div className="login-modal__success">
                <div className="login-modal__success-icon">
                  <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                </div>
                <div>
                  <h4 className="login-modal__title">Salam, Welcome to GoForUmrah.com!</h4>
                  <div className="login-modal__subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
                </div>
                <div className="align-self-stretch d-flex flex-column align-items-stretch">
                  <button type="button" data-bs-dismiss="modal" className="btn btn-success">Ok, Got it</button>
                </div>
              </div>
            )}

            {/* Sign up success modal */}
            {isSignupSuccess && (
              <div className="create-account-modal__success">
                <div className="create-account-modal__success-icon">
                  <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                </div>
                <div>
                  <h4 className="create-account-modal__title">Salam, <br />Welcome to GoForUmrah.com!</h4>
                  <div className="create-account-modal__subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
                </div>
                <div className="align-self-stretch d-flex flex-column align-items-stretch">
                  <button type="button" className="btn btn-success" data-bs-dismiss="modal">Ok, Got it</button>
                </div>
              </div>
            )}

            {/* Forgot password send link success modal */}
            {isForgotSuccess && (
              <div className="login-modal__success">
                <div className="login-modal__success-icon">
                  <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                </div>
                <div>
                  <h4 className="login-modal__title">Check your inbox</h4>
                  <div className="login-modal__subtitle">We've just emailed instructions and a reset password link to <span className="fw-bold">{(getValues())?.email}</span>. It might take a few minutes to arrive.</div>
                </div>
                <div className="align-self-stretch d-flex flex-column align-items-stretch">
                  <button type="button" onClick={() => {
                    setCurrentStep('email')
                    setIsSigninSuccess(false)
                    setIsSignupSuccess(false)
                    setIsForgotSuccess(false)
                  }} className="btn btn-outline-success">Back to sign-in</button>
                </div>
              </div>
            )}

            {/* Main form */}
            {(!isSigninSuccess && !isSignupSuccess && !isForgotSuccess) && (
              <form onSubmit={handleSubmit(onSubmit, onSubmit)}>
                <h4 className="login-modal__title">
                  {currentStep === 'email' && <>Welcome to <span className="text-green-01">GoForUmrah {isTravelAgent && 'Agent'}</span></>}
                  {currentStep === 'password' && 'Enter your password'}
                  {currentStep === 'signinPhone' && <>Welcome to <span className="text-green-01">GoForUmrah {isTravelAgent && 'Agent'}</span></>}
                  {currentStep === 'signinPhoneCode' && 'Verification code'}
                  {currentStep === 'forgot' && 'Forgotten your password?'}
                  {currentStep === 'signupEmail' && 'Create account'}
                  {currentStep === 'signupPassword' && 'Create password'}
                </h4>
                <div className="login-modal__subtitle">
                  {currentStep === 'email' && 'Enter your details to get sign in to your account'}
                  {currentStep === 'password' && <>Please enter your GoForUmrah.com password for <span className="fw-bold">{(getValues()).email}</span>.</>}
                  {currentStep === 'signinPhone' && 'Enter your details to get sign in to your account'}
                  {currentStep === 'signinPhoneCode' && 'If we recognize the phone number you enter, you\'ll receive a code via text message.'}
                  {currentStep === 'forgot' && 'No problem! We\'ll send you a link to reset it. Please enter the email address you use to sign in to GoForUmrah.com.'}
                  {currentStep === 'signupEmail' && `Fill in the following data to register${isTravelAgent && ' as a travel agent'}.`}
                  {currentStep === 'signupPassword' && 'Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers.'}
                </div>

                <div className="login-modal__form">
                  {currentStep === 'email' && (
                    <div>
                      <label className="form-label">Email Address</label>
                      <RFHInput register={register('email')} type="email" placeholder="Enter your email here" error={errors.email?.message.toString()} />
                    </div>
                  )}

                  {currentStep === 'password' && (
                    <div>
                      <label className="form-label">Password</label>
                      <RFHInput register={register('password')} type="password" placeholder="Enter your password" error={errors.password?.message.toString()} />
                    </div>
                  )}

                  {currentStep === 'signinPhone' && (
                    <div>
                      <label className="form-label">Phone Number</label>
                      <div className="PhoneInput form-control-wrapper">
                        <div className={`form-control-field ${errors.signinPhone ? 'form-control-field--error' : ''}`}>
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
                          <PhoneInput international={true} country={(phoneCountry || defaultPhoneCountry) as CountryCode} value={signinPhone} onChange={setSigninPhone} placeholder="(888) 888-8888" />
                        </div>
                        {errors.signinPhone && (
                          <div className="form-control-message form-control-message--error">{errors.signinPhone?.message.toString()}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 'signinPhoneCode' && (
                    <div>
                      <label className="form-label">Verification Code</label>
                      <RFHInput register={register('signinPhoneCode')} type="text" placeholder="Enter verification code" error={errors.signinPhoneCode?.message.toString()} />
                    </div>
                  )}

                  {currentStep === 'signupEmail' && (
                    <>
                      {isTravelAgent && (
                        <div>
                          <label className="form-label">Agency Name</label>
                          <RFHInput register={register('signupAgencyName')} type="text" placeholder="Enter your agency name" error={errors.signupAgencyName?.message.toString()} />
                        </div>
                      )}
                      {!isTravelAgent && (
                        <div>
                          <label className="form-label">Full Name</label>
                          <RFHInput register={register('signupName')} type="text" placeholder="Enter your full name" error={errors.signupName?.message.toString()} />
                        </div>
                      )}
                      <div>
                        <label className="form-label">Email Address</label>
                        <RFHInput register={register('signupEmail')} type="email" placeholder="Enter your email here" error={errors.signupEmail?.message.toString()} />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        <div className="PhoneInput form-control-wrapper">
                          <div className={`form-control-field ${errors.signupPhone ? 'form-control-field--error' : ''}`}>
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
                          {errors.signupPhone && (
                            <div className="form-control-message form-control-message--error">{errors.signupPhone?.message.toString()}</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 'signupPassword' && (
                    <>
                      <div>
                        <label className="form-label">Password</label>
                        <RFHInput register={register('signupPassword')} type="password" placeholder="Enter your password" error={errors.signupPassword?.message.toString()} />
                      </div>
                      <div>
                        <label className="form-label">Confirm Password</label>
                        <RFHInput register={register('signupConfirmPassword')} type="password" placeholder="Repeat your password" error={errors.signupConfirmPassword?.message.toString()} />
                      </div>
                    </>
                  )}

                  {currentStep === 'forgot' && (
                    <div>
                      <label className="form-label">Email Address</label>
                      <RFHInput register={register('forgotEmail')} type="email" placeholder="Enter your email address" error={errors.forgotEmail?.message.toString()} />
                    </div>
                  )}

                  {error && (
                    <div className="d-flex flex-column align-items-stretch text-danger-main text-center">
                      {error}
                    </div>
                  )}

                  <div className="d-flex flex-column align-items-stretch">
                    <button
                      type="submit"
                      className="btn btn-success">
                      {currentStep === 'email' && 'Continue with Email'}
                      {currentStep === 'password' && 'Log In'}
                      {currentStep === 'signinPhone' && 'Continue with Phone Number'}
                      {currentStep === 'signinPhoneCode' && 'Submit'}
                      {currentStep === 'signupEmail' && 'Continue'}
                      {currentStep === 'signupPassword' && 'Create Account'}
                      {currentStep === 'forgot' && 'Send reset link'}
                    </button>
                  </div>

                  {(currentStep === 'email' || currentStep === 'signinPhone') && (
                    <div className="login-modal__cta-link">
                      <a type="button" onClick={() => setIsTravelAgent(!isTravelAgent)} className="link link-green-01">I'm a {isTravelAgent ? 'Customer' : 'Travel Agency'}</a>
                    </div>
                  )}

                  {(currentStep === 'email' || currentStep === 'signinPhone' || currentStep === 'password') && (
                    <div className="login-modal__or-divider">or use one of these options</div>
                  )}

                  {(currentStep === 'email' || currentStep === 'signinPhone') && (
                    <div className="login-modal__login-options">
                      <button type="button" onClick={() => signIn(isTravelAgent ? 'googleForAgent' : 'googleForCustomer', { callbackUrl: isTravelAgent ? '/agent' : '' })} className="btn btn-outline-neutral-primary">
                        <SVGIcon src={Icons.GoogleColored} width={20} height={20} />
                        <span>Continue with Google</span>
                      </button>
                      <button type="button" onClick={() => signIn(isTravelAgent ? 'facebookForAgent' : 'facebookForCustomer', { callbackUrl: isTravelAgent ? '/agent' : '' })} className="btn btn-outline-neutral-primary">
                        <SVGIcon src={Icons.FacebookColored} width={20} height={20} />
                        <span>Continue with Facebook</span>
                      </button>
                      {currentStep === 'email' && (
                        <button onClick={() => setCurrentStep('signinPhone')} type="button" className="btn btn-outline-neutral-primary">
                          <SVGIcon src={Icons.Phone} width={20} height={20} />
                          <span>Continue with Phone Number</span>
                        </button>
                      )}
                      {currentStep === 'signinPhone' && (
                        <button onClick={() => setCurrentStep('email')} type="button" className="btn btn-outline-neutral-primary">
                          <SVGIcon src={Icons.Mail} width={20} height={20} />
                          <span>Continue with Email Address</span>
                        </button>
                      )}
                    </div>
                  )}

                  {currentStep === 'signinPhoneCode' && (
                    <>
                      {phoneCodeCountdown > 0 ? (
                        <div className="login-modal__cta-link login-modal__cta-link--info">Wait {moment.duration(phoneCodeCountdown, 'seconds').minutes()} minutes {moment.duration(phoneCodeCountdown, 'seconds').seconds()} seconds before requesting a new code</div>
                      ) : (
                        <div className="login-modal__cta-link">
                          <a type="button" onClick={async () => await resendCode()} className="link link-green-01">Request new code</a>
                        </div>
                      )}
                    </>
                  )}

                  {currentStep === 'password' && (
                    <>
                      <div className="login-modal__login-options">
                        <button type="button" className="btn btn-outline-success">Sign in with a verification link</button>
                      </div>
                      <div className="login-modal__cta-link">
                        <a type="button" onClick={() => setCurrentStep('forgot')} className="link link-green-01">Forgotten your password?</a>
                      </div>
                    </>
                  )}
                </div>
              </form>
            )}

            {(!isSigninSuccess && !isSignupSuccess && !isForgotSuccess) && (
              <div className="login-modal__footer">By signing in or creating an account, you agree with our <a href="#">Terms & conditions</a> and <a href="#">Privacy statement</a></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthModal
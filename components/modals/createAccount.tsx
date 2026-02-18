import React, { useEffect, useRef, useState } from 'react'
import SVGIcon from '../elements/icons'
import { Icons } from '@/types/enums'
import { getCsrfToken } from 'next-auth/react'
import { UseFormRegisterReturn, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { callAPI } from '@/lib/axiosHelper'
import { yupResolver } from '@hookform/resolvers/yup'
import { RFHInput } from '../forms/fields'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'

type wizardStep = 'email' | 'password'

const schema = yup.object().shape({
  name: yup.string().required('Agency name is required'),
  email: yup.string().email('Wrong email format').required('Email address is required'),
  phone: yup.string().required('Phone number is required'),
  password: yup.string().required('Password is required').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{10,})/,
    'Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers'
  ),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
})

const defaultPhoneCountry = 'US'

const CreateAccountModal = () => {
  const [currentStep, setCurrentStep] = useState<wizardStep>('email')
  const [isSignupSuccess, setIsSignupSuccess] = useState<boolean>(false)
  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [error, setError] = useState<string>()
  const modalRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, clearErrors } = useForm({ resolver: yupResolver(schema) })

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onSubmit = async (values) => {
    setError('')

    if (currentStep === 'email' && ((!isValid && !errors.name && !values.name && !errors.email && !values.email) || (isValid))) {
      clearErrors(['password', 'forgotEmail'])
      return setCurrentStep('password')
    }

    if (currentStep === 'password' && ((!isValid && !errors.password && !values.password && !errors.confirmPassword && !values.confirmPassword) || (isValid))) {
      clearErrors(['email', 'forgotEmail'])

      const { email, password, phone } = getValues()
      const payload = {
        type_login: 1,
        social_ids: null,
        email: email,
        password: password,
        phone: phone,
        status: null,
        soft_delete: 0
      }

      const { ok, error } = await callAPI('/customer/store', 'POST', payload)

      if (ok && !error) {
        reset()
        setIsSignupSuccess(true)
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
      setCurrentStep('email')
      setIsSignupSuccess(false)
    }

    const onModalHidden = () => {
      setCurrentStep('email')
      setIsSignupSuccess(false)
    }

    modal.addEventListener('show.bs.modal', onModalShow)
    modal.addEventListener('hidden.bs.modal', onModalHidden)

    return () => {
      modal.removeEventListener('show.bs.modal', onModalShow)
      modal.removeEventListener('hidden.bs.modal', onModalHidden);
    }
  }, [])

  return (
    <div ref={modalRef} className="modal create-account-modal fade" id="create-account-modal" aria-hidden="true" tabIndex={-1}>
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <div>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
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

            {/* Main form */}
            {!isSignupSuccess && (
              <form onSubmit={handleSubmit(onSubmit, onSubmit)}>
                <h4 className="create-account-modal__title">
                  {currentStep === 'email' && 'Create account'}
                  {currentStep === 'password' && 'Create password'}
                </h4>
                <div className="create-account-modal__subtitle">
                  {currentStep === 'email' && 'Fill in the following data to register as a travel agent.'}
                  {currentStep === 'password' && 'Use a minimum of 10 characters, including uppercase letters, lowercase letters and numbers.'}
                </div>

                <div className="create-account-modal__form">
                  {currentStep === 'email' && (
                    <>
                      <div>
                        <label className="form-label">Agency Name</label>
                        <RFHInput register={register('name')} type="text" placeholder="Enter your agency name" error={errors.name?.message.toString()} />
                      </div>
                      <div>
                        <label className="form-label">Email Address</label>
                        <RFHInput register={register('email')} type="email" placeholder="Enter your email here" error={errors.email?.message.toString()} />
                      </div>
                      <div>
                        <label className="form-label">Phone Number</label>
                        {/* <PhoneInputWithCountrySelect
                          placeholder="(888) 888-8888"
                          value={phone}

                          onChange={setPhone} /> */}
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
                            <PhoneInput international={true} country={(phoneCountry || defaultPhoneCountry) as CountryCode} value={phone} onChange={setPhone} register={register('phone')} placeholder="(888) 888-8888" />
                          </div>
                          {errors.phone && (
                            <div className="form-control-message form-control-message--error">{errors.phone?.message.toString()}</div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {currentStep === 'password' && (
                    <>
                      <div>
                        <label className="form-label">Password</label>
                        <RFHInput register={register('password')} type="password" placeholder="Enter your password" error={errors.password?.message.toString()} />
                      </div>
                      <div>
                        <label className="form-label">Confirm Password</label>
                        <RFHInput register={register('confirmPassword')} type="password" placeholder="Repeat your password" error={errors.confirmPassword?.message.toString()} />
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="d-flex flex-column align-items-stretch text-danger-main text-center">
                      {error}
                    </div>
                  )}

                  <div className="d-flex flex-column align-items-stretch">
                    <button type="submit" className="btn btn-success">
                      {currentStep === 'email' && 'Continue'}
                      {currentStep === 'password' && 'Create Account'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {!isSignupSuccess && (
              <div className="create-account-modal__footer">By signing in or creating an account, you agree with our <a href="#">Terms & conditions</a> and <a href="#">Privacy statement</a></div>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}

export default CreateAccountModal
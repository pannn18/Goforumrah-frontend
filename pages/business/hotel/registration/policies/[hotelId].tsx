import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm, useWatch } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ISO6391 from 'iso-639-1'

import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import LayoutForm from '@/components/pages/business/hotel/registration/layout'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { RFHInput, RFHSelect, RFHSelectAndInput } from '@/components/forms/fields'
import alertInfo from '@/assets/images/alert_info.svg'
import { Icons } from '@/types/enums'
import { callAPI } from '@/lib/axiosHelper'
import { getCountries } from 'react-phone-number-input'
import countryLabels from 'react-phone-number-input/locale/en.json'

interface IProps {
}

const Policies = (props: IProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hotelId = router.query.hotelId

  const times = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']

  const fieldShapes = {
    cancellation: yup.string().required('Cancellation day is required'),
    checkinFrom: yup.string().required('Check-in from time is required'),
    checkinTo: yup.string().required('Check-in to time is required'),
    checkoutFrom: yup.string().required('Check-out from time is required'),
    checkoutTo: yup.string().required('Check-out to time is required'),
  }

  const schema = yup.object().shape(fieldShapes)

  const [protectAgaints, setProtectAgaints] = useState<boolean>(false)
  const [children, setChildren] = useState<boolean>(false)
  const [pets, setPets] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { register, control, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (values) => {
    setError('')

    if (Object.keys(errors).length) return

    const {
      cancellation: cancellation_day,
      checkinFrom: checkin_from,
      checkinTo: checkin_to,
      checkoutFrom: checkout_from,
      checkoutTo: checkout_to,
    } = getValues()

    const payload = {
      id_hotel: hotelId,
      cancellation_day: parseFloat(cancellation_day),
      checkin_from,
      checkin_to,
      checkout_from,
      checkout_to,
      protect_against: protectAgaints ? 1 : 0,
      children: children ? 1 : 0,
      pets: pets ? 1 : 0,
    }

    setLoading(true)

    const { ok, error } = await callAPI('/hotel-policies/store', 'POST', payload, true)

    if (ok) {
      router.push(`/business/hotel/registration/payment/${hotelId}`)
    } else {
      setError(error || 'Unknown error')
    }

    setLoading(false)
  }

  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <div className='hotel-registration'>
        <div className='hotel-registration__step'>
          <div className='container hotel-registration__step-container'>
            <div className='row'>
              <div className='col'>
                <ul className="hotel-registration__step-list">
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--visited">
                    <span className='hotel-registration__step-number hotel-registration__step-number--visited'>1</span> Basic info
                  </li>
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--visited">
                    <span className='hotel-registration__step-number hotel-registration__step-number--visited'>2</span> Layout
                  </li>
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--visited">
                    <span className='hotel-registration__step-number hotel-registration__step-number--visited'>3</span> Facilities
                  </li>
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--visited">
                    <span className='hotel-registration__step-number hotel-registration__step-number--visited'>4</span> Amenities
                  </li>
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--visited">
                    <span className='hotel-registration__step-number hotel-registration__step-number--visited'>5</span> Photos
                  </li>
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--active">
                    <span className='hotel-registration__step-number hotel-registration__step-number--active'>6</span> Policies
                  </li>
                  <li className="hotel-registration__step-list-item">
                    <span className='hotel-registration__step-number'>7</span> Payment
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div className='hotel-registration__content-container'>
                <div className='hotel-registration__content-title'>
                  <h3 className='hotel-registration__content-title-heading'>Policies</h3>
                  <p className='hotel-registration__content-title-caption'>
                    Specify some basic policies. Do you allow children or pets? How flexible are you with cancellations?
                  </p>
                </div>

                <div className='goform-alert hotel-registration__content-alert'>
                  <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                  <p>After you complete registration you'll be able to make changes to your listing before it goes live</p>
                </div>

                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Cancellation</p>
                    <div className='goform-group'>
                      <label htmlFor="propertyName" className="form-label goform-label">How many days in advance can guests cancel free of charge?</label>
                      <RFHSelect
                        register={register('cancellation')}
                        onChange={(e) => setValue('cancellation', e.target.value, { shouldValidate: true })}
                        error={errors.cancellation?.message.toString()}
                      >
                        <option value={''}>Day of arrival</option>
                        <option value={0.25}>6 Hours before check-In</option>
                        <option value={1}>1 Day before check-In</option>
                        <option value={2}>2 Day before check-In</option>
                        <option value={4}>3 Day before check-In</option>
                        <option value={7}>7 Day before check-In</option>
                        <option value={14}>14 Day before check-In</option>
                      </RFHSelect>
                    </div>
                  </div>

                  <div className='hotel-registration__content-form hotel-registration__content-form--row'>
                    <div className='hotel-registration__content-form-col hotel-registration__poli-left-col'>
                      <p className='hotel-registration__poli-form-title'>Protect Against Accidental Bookings</p>
                      <p className='hotel-registration__content-form-caption'>
                        To save you time handling accidental bookings, we automatically waive cancellation fees for guests who cancel within
                        the first 24 hours of a booking being made. You can change this period of time later in your property management
                        platform.
                      </p>
                    </div>
                    <div className='hotel-registration__content-form-col'>
                      <div className='goform-switches hotel-registration__poli-switch'>
                        <input
                          checked={protectAgaints}
                          onChange={(e) => setProtectAgaints(e.target.checked)}
                          className='goform-switches__check' type="checkbox" id="protect-againts-checkbox" />
                        <label htmlFor="protect-againts-checkbox">
                          <span></span>
                          <span></span>
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        {/* <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked /> */}
                      </div>
                    </div>
                  </div>

                  <div className='hotel-registration__content-slice row'>
                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                      <div className='hotel-registration__content-form'>
                        <p className='hotel-registration__content-form-title'>Check In</p>
                        <div className='goform-group'>
                          <label className="form-label goform-label">From :</label>
                          <RFHSelect
                            register={register('checkinFrom')}
                            onChange={(e) => setValue('checkinFrom', e.target.value, { shouldValidate: true })}
                            error={errors.checkinFrom?.message.toString()}
                          >
                            {times.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </RFHSelect>
                        </div>
                        <div className='goform-group'>
                          <label className="form-label goform-label">To :</label>
                          <RFHSelect
                            register={register('checkinTo')}
                            onChange={(e) => setValue('checkinTo', e.target.value, { shouldValidate: true })}
                            error={errors.checkinTo?.message.toString()}
                          >
                            {times.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </RFHSelect>
                        </div>
                      </div>
                    </div>
                    <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                      <div className='hotel-registration__content-form'>
                        <p className='hotel-registration__content-form-title'>Check Out</p>
                        <div className='goform-group'>
                          <label className="form-label goform-label">From :</label>
                          <RFHSelect
                            register={register('checkoutFrom')}
                            onChange={(e) => setValue('checkoutFrom', e.target.value, { shouldValidate: true })}
                            error={errors.checkoutFrom?.message.toString()}
                          >
                            {times.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </RFHSelect>
                        </div>
                        <div className='goform-group'>
                          <label className="form-label goform-label">To :</label>
                          <RFHSelect
                            register={register('checkoutTo')}
                            onChange={(e) => setValue('checkoutTo', e.target.value, { shouldValidate: true })}
                            error={errors.checkoutTo?.message.toString()}
                          >
                            {times.map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </RFHSelect>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title hotel-registration__poli-child-title'>Children</p>
                    <div className='goform-group row'>
                      <div className='col-xl-6 col-xl-offset-6 col-lg-6 col-md-12'>
                        <label htmlFor="contactName" className="form-label goform-label goform-label--text-bold hotel-registration__poli-child-label">
                          Can you accommodate children? (You can specify the ages and prices later)
                        </label>
                        <div className="form-check form-check-inline">
                          <input
                            checked={children}
                            onChange={(e) => e.target.checked && setChildren(true)}
                            className="form-check-input" type="radio" name="children-option" id="children-option-yes" />
                          <label className="form-check-label" htmlFor="children-option-yes">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            checked={!children}
                            onChange={(e) => e.target.checked && setChildren(false)}
                            className="form-check-input" type="radio" name="children-option" id="children-option-no" />
                          <label className="form-check-label" htmlFor="children-option-no">No</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title hotel-registration__poli-child-title'>Pets</p>
                    <div className='goform-group row'>
                      <div className='col-xl-6 col-xl-offset-6 col-lg-6 col-md-12'>
                        <label htmlFor="contactName" className="form-label goform-label goform-label--text-bold hotel-registration__poli-child-label">
                          Do you allow pets?
                        </label>
                        <div className="form-check form-check-inline">
                          <input
                            checked={pets}
                            onChange={(e) => e.target.checked && setPets(true)}
                            className="form-check-input" type="radio" name="pets-option" id="pets-option-yes" />
                          <label className="form-check-label" htmlFor="pets-option-yes">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            checked={!pets}
                            onChange={(e) => e.target.checked && setPets(false)}
                            className="form-check-input" type="radio" name="pets-option" id="pets-option-no" />
                          <label className="form-check-label" htmlFor="pets-option-no">No</label>
                        </div>
                      </div>
                    </div>
                    <div className='goform-alert hotel-registration__content-alert'>
                      <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                      <p>Some guests like to travel with their furry friends. Indicate if you allow pets and if any charges apply.</p>
                    </div>
                  </div>
                  {error && (
                    <div className="d-flex flex-column align-items-center text-center text-danger-main">
                      {error}
                    </div>
                  )}
                  <div className='hotel-registration__button-list hotel-registration__button-list--draft justify-content-end'>
                    <div className='hotel-registration__button-list-group'>
                      <button
                        disabled={loading}
                        onClick={() => router.replace(router.asPath)}
                        type="button" className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item'>Cancel</button>
                      <button
                        disabled={loading}
                        type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item'>{loading ? 'Please wait...' : 'Continue'}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Policies
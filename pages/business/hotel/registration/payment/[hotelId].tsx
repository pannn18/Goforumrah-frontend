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

import payment1 from '@/assets/images/hotel_payment_image_1.svg'
import payment2 from '@/assets/images/hotel_payment_image_2.svg'
import payment3 from '@/assets/images/hotel_payment_image_3.svg'
import payment4 from '@/assets/images/hotel_payment_image_4.svg'
import payment5 from '@/assets/images/hotel_payment_image_5.svg'
import payment6 from '@/assets/images/hotel_payment_image_6.svg'
import payment7 from '@/assets/images/hotel_payment_image_7.svg'
import payment8 from '@/assets/images/hotel_payment_image_8.svg'
import useFetch from '@/hooks/useFetch'

interface IProps {
}

const Payment = (props: IProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hotelId = router.query.hotelId

  const { ok: isHotelOK, data: hotelData, error: hotelError, loading: hotelLoading } = useFetch('/hotel/detailForAdmin', 'POST', { id_hotel: hotelId }, true)

  const payments: { name: string, image: any }[] = [{
    name: 'American Express',
    image: payment1
  }, {
    name: 'Visa',
    image: payment2
  }, {
    name: 'Euro/Mastercard',
    image: payment3
  }, {
    name: 'Dinners club',
    image: payment4
  }, {
    name: 'JCB',
    image: payment5
  }, {
    name: 'Maestro',
    image: payment6
  }, {
    name: 'Discover',
    image: payment7
  }, {
    name: 'Union credit card',
    image: payment8
  },]

  const fieldShapes = {
    name: yup.string().required('Commission name is required'),
    paymentAddress: yup.string().notRequired(),
  }

  const schema = yup.object().shape(fieldShapes)

  const [payment, setPayment] = useState<string>(payments[0].name)
  const [sameAddress, setSameAddress] = useState<boolean>(true)
  const [aggreement1, setAggreement1] = useState<boolean>(false)
  const [aggreement2, setAggreement2] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { register, control, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (values) => {
    setError('')

    const {
      name: commision_name,
      paymentAddress: payment_address
    } = getValues()

    if (Object.keys(errors).length) return
    if (!payment) return setError('Guest payment option is required')
    if (!sameAddress && !payment_address) return setError('Commission payment address is required')
    if (!aggreement1 || !aggreement2) return setError('Please check the terms and agreements')

    const payload = {
      id_hotel: hotelId,
      payments: payment,
      commision_name,
      payment_address: sameAddress ? hotelData?.street_address : payment_address
    }

    setLoading(true)

    const { ok, error } = await callAPI('/hotel-payments/store', 'POST', payload, true)

    if (ok) {
      router.push(`/business/hotel/registration/complete`)
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
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--visited">
                    <span className='hotel-registration__step-number hotel-registration__step-number--visited'>6</span> Policies
                  </li>
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--active">
                    <span className='hotel-registration__step-number hotel-registration__step-number--active'>7</span> Payment
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
                  <h3 className='hotel-registration__content-title-heading'>Payments</h3>
                  <p className='hotel-registration__content-title-caption'>
                    Specify the payment types you accept, tax details, and other options like additional charges.
                  </p>
                </div>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Guest Payment Option</p>
                    <div className='goform-group row'>
                      {payments.map(({ name, image }, index) => (
                        <div key={`payment-${index}`} className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                          <div className="form-check goform-selection hotel-registration__payment-checkbox">
                            <input
                              checked={payment === name}
                              onChange={(e) => e.target.checked && setPayment(name)}
                              type="checkbox" id={`payment-${index}`} className="form-check-input goform-selection__input" />
                            <label htmlFor={`payment-${index}`} className='goform-selection__label hotel-registration__payment-checkbox-label'>
                              <BlurPlaceholderImage className='hotel-registration__payment-option-image' alt='image' src={image} width={56} height={32} />
                              <p className='hotel-registration__payment-option-font'>{name}</p>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Commission Payment</p>
                    <div className="hotel-registration__content-comm-payment">
                      <p className='hotel-registration__content-comm-payment__left'>At the beginning of each month, we'll send you an invoice for all complete bookings in the previous month.
                      </p>
                      <p className='hotel-registration__content-comm-payment__right'>Commission presentage 15%</p>
                    </div>
                    <div className='goform-group'>
                      <label className="form-label goform-label hotel-registration__payment-comm-label">What name should be placed on the invoice (e.g. legal/company name)?</label>
                      <RFHInput register={register('name')} type="text" placeholder="Enter your name" error={errors.name?.message.toString()} />
                    </div>
                    <div className='col-md-12'>
                      <label htmlFor="contactName" className="form-label goform-label goform-label--text-bold hotel-registration__poli-child-label">
                        Does this recipient have the same address as your property?
                      </label>
                      <div className="form-check form-check-inline">
                        <input
                          checked={sameAddress}
                          onChange={(e) => e.target.checked && setSameAddress(true)}
                          className="form-check-input" type="radio" name="same-address-option" id="same-address-option-yes" />
                        <label className="form-check-label" htmlFor="same-address-option-yes">Yes</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          checked={!sameAddress}
                          onChange={(e) => e.target.checked && setSameAddress(false)}
                          className="form-check-input" type="radio" name="same-address-option" id="same-address-option-no" />
                        <label className="form-check-label" htmlFor="same-address-option-no">No</label>
                      </div>
                      <div style={{ marginTop: 12, display: sameAddress ? 'none' : 'block' }}>
                        <RFHInput register={register('paymentAddress')} type="text" placeholder="Enter your payment address" error={errors.paymentAddress?.message.toString()} />
                      </div>
                    </div>
                  </div>
                  <div className="form-check goform-selection hotel-registration__payment-checkbox">
                    <input
                      checked={aggreement1}
                      onChange={(e) => setAggreement1(e.target.checked)}
                      type="checkbox" id='terms1' className="form-check-input goform-selection__input goform-selection__input-terms" />
                    <label htmlFor="terms1" className='hotel-registration__payment-terms'>
                      <p>I certify that this is a legitimate accommodation business with all necessary licenses and permits, which can be shown upon first request. Booking.com B.V. reserves the right to verify and investigate any details provided in this registration.</p>
                    </label>
                  </div>
                  <div className="form-check goform-selection hotel-registration__payment-checkbox">
                    <input
                      checked={aggreement2}
                      onChange={(e) => setAggreement2(e.target.checked)}
                      type="checkbox" id='terms2' className="form-check-input goform-selection__input goform-selection__input-terms" />
                    <label htmlFor="terms2" className='hotel-registration__payment-terms'>
                      <p>I have read, accepted, and agreed to the <b>General Delivery Terms</b> and <b>Privacy Statement.</b>
                        Booking.com enables accommodations and guests to communicate through Booking.com, which receives and processes communications in accordance with the Booking.com Privacy Statement and General Delivery Terms.</p>
                    </label>
                  </div>
                  {error && (
                    <div className="d-flex flex-column align-items-stretch text-danger-main">
                      {error}
                    </div>
                  )}
                  <div className='hotel-registration__button-list hotel-registration__button-list--draft justify-content-end'>
                    <div className='hotel-registration__button-list-group'>
                      <button
                        disabled={loading}
                        type="submit" className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item'>{loading ? 'Please wait...' : 'Complete and open later'}</button>
                      <button
                        disabled={loading}
                        type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item'>{loading ? 'Please wait...' : 'Complete and open for booking'}</button>
                    </div>
                  </div>
                  {/* <div className='hotel-registration__button-list hotel-registration__button-list--payment'>
                    <div className='hotel-registration__button-list-group'>
                      <button className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item hotel-registration__button-list-item'>Complete and open later</button>
                      <Link href={"/business/hotel/dashboard"} className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item'>Complete and open for booking</Link>
                    </div>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Payment
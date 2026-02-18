import React, { useState } from 'react'
import { BlurPlaceholderImage } from '@/components/elements/images'
import categoryBack from '@/assets/images/arrow_left_green.svg'
import hotelImage from '@/assets/images/hotel_category.png'
import Link from 'next/link'
import alertInfo from '@/assets/images/alert_info.svg'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import SVGIcon from '@/components/elements/icons'
import { Icons } from '@/types/enums'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/router'

import { RFHInput, RFHSelect, RFHSelectAndInput, RFHTextarea } from '@/components/forms/fields'
import PhoneInput, { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'

interface IProps {
}

const BasicInfo = ({ }: IProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const categoryId = router.query.categoryId

  const fieldShapes = {
    propertyName: yup.string().required('Property name is required'),
    description: yup.string().required('Description is required'),
    starRating: yup.string().required('Star rating is required'),
    contactName: yup.string().required('Contact name is required'),
    phone: yup.string().required('Phone number is required'),
    alternativePhone: yup.string().notRequired(),
    isMultipleOrPartOfProperty: yup.string().required('Selecting the option field is required'),
    streetAddress: yup.string().required('Street address is required'),
    streetAddress2: yup.string().notRequired(),
    country: yup.string().required('Country/Region is required'),
    city: yup.string().required('City is required'),
    zipcode: yup.string().required('Zipcode is required'),
  }

  const schema = yup.object().shape(fieldShapes)

  const defaultPhoneCountry = 'US'

  const [loading, setLoading] = useState<boolean>(false)

  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [alternativePhoneCountry, setAlternativePhoneCountry] = useState<string>()
  const [alternativePhone, setAlternativePhone] = useState<string>()
  const [error, setError] = useState<string>()
  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (values) => {
    setError('')

    clearErrors(['phone'])
    if (!phone?.length) return setFieldError('phone', { message: 'Phone number is required', type: 'required' })

    if (Object.keys(errors).length) return

    const {
      propertyName: property_name,
      description,
      starRating: star_rating,
      contactName: contact_name,
      isMultipleOrPartOfProperty,
      streetAddress: street_address,
      streetAddress2: street_address2,
      country,
      city,
      zipcode: postcode
    } = getValues()

    const payload = {
      id_hotel_business: session?.user?.id,
      id_hotel_category: categoryId,
      type_hotel: 1,
      property_name,
      star_rating,
      contact_name,
      phone,
      alternative_phone: alternativePhone || null,
      multiple_hotel: isMultipleOrPartOfProperty === 'yes' ? 1 : 0,
      street_address,
      street_address2,
      country: countryLabels[country],
      city,
      postcode
    }

    setLoading(true)

    const { ok, data, status, error } = await callAPI('/hotel/store', 'POST', payload, true)

    if (ok && data.id_hotel) {
      router.push(`/business/hotel/registration/layout/${data.id_hotel}`)
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
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--active">
                    <span className='hotel-registration__step-number hotel-registration__step-number--active'>1</span> Basic info
                  </li>
                  <li className="hotel-registration__step-list-item">
                    <span className='hotel-registration__step-number'>2</span> Layout
                  </li>
                  <li className="hotel-registration__step-list-item">
                    <span className='hotel-registration__step-number'>3</span> Facilities
                  </li>
                  <li className="hotel-registration__step-list-item">
                    <span className='hotel-registration__step-number'>4</span> Amenities
                  </li>
                  <li className="hotel-registration__step-list-item">
                    <span className='hotel-registration__step-number'>5</span> Photos
                  </li>
                  <li className="hotel-registration__step-list-item">
                    <span className='hotel-registration__step-number'>6</span> Policies
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
                  <h3 className='hotel-registration__content-title-heading'>Welcome {session?.user?.name} !</h3>
                  <p className='hotel-registration__content-title-caption'>Start by telling us your property's name, contact details, and address.</p>
                </div>
                <div className='goform-alert hotel-registration__content-alert'>
                  <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                  <p>After you complete registration you'll be able to make changes to your listing before it goes live</p>
                </div>
                <form onSubmit={handleSubmit(onFormSubmit, onFormSubmit)}>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Property Name</p>
                    <div className='goform-group'>
                      <label htmlFor="propertyName" className="form-label goform-label">Property Name</label>
                      <RFHInput register={register('propertyName')} type="text" placeholder="Enter your property name" error={errors.propertyName?.message.toString()} />
                      <p className='form-text goform-input-help'>Guests will see this name when they search for a place to stay.</p>
                    </div>
                    <div className='goform-group'>
                      <label htmlFor="propertyName" className="form-label goform-label">Description</label>
                      <RFHTextarea register={register('description')} rows={6} placeholder="Type your tagline here" error={errors.description?.message.toString()} />
                    </div>
                    <div className='goform-group'>
                      <label htmlFor="propertyName" className="form-label goform-label">Star Rating</label>
                      <RFHSelect
                        register={register('starRating')}
                        onChange={(e) => setValue('starRating', e.target.value, { shouldValidate: true })}
                        error={errors.starRating?.message.toString()}
                      >
                        <option value={''}>N/A</option>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </RFHSelect>
                    </div>
                  </div>

                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Contact Details</p>
                    <div className='goform-group'>
                      <label htmlFor="contactName" className="form-label goform-label">Contact Name</label>
                      <RFHInput register={register('contactName')} type="text" placeholder="Enter your contact name" error={errors.contactName?.message.toString()} />
                      <p className='form-text goform-input-help'>Contact number (so we can assist with your registration when needed)</p>
                    </div>
                    <div className='goform-group row'>
                      <div className='col-xl-6 col-lg-6'>
                        <label htmlFor="phoneNumber" className="form-label goform-label">Phone Number</label>
                        <div className="PhoneInput form-control-wrapper">
                          <div className={`form-control-field w-100 ${errors.phone ? 'form-control-field--error' : ''}`}>
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
                      <div className='col-xl-6 col-lg-6'>
                        <label htmlFor="phoneNumber2" className="form-label goform-label">Alternative Phone Number <span className='goform-label__caption'>(optional)</span></label>
                        <div className="PhoneInput form-control-wrapper">
                          <div className={`form-control-field w-100 ${errors.alternativePhone ? 'form-control-field--error' : ''}`}>
                            <div className="PhoneInputCountry">
                              <select
                                value={alternativePhoneCountry}
                                onChange={event => setAlternativePhoneCountry(event.target.value || null)}
                                name="phone-code">
                                {getCountries().map((country) => (
                                  <option key={country} value={country}>
                                    {countryLabels[country]} +{getCountryCallingCode(country)}
                                  </option>
                                ))}
                              </select>
                              <div className={`PhoneInputSelectedValue ${alternativePhoneCountry ? 'HasValue' : ''}`}>+{getCountryCallingCode((alternativePhoneCountry || defaultPhoneCountry) as CountryCode)}</div>
                            </div>
                            <PhoneInput international={true} country={(alternativePhoneCountry || defaultPhoneCountry) as CountryCode} value={alternativePhone} onChange={setAlternativePhone} placeholder="(888) 888-8888" />
                          </div>
                          {errors.alternativePhone && (
                            <div className="form-control-message form-control-message--error">{errors.alternativePhone?.message.toString()}</div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='goform-group row'>
                      <div className='col-xl-6 col-xl-offset-6 col-lg-6'>
                        <label htmlFor="contactName" className="form-label goform-label goform-label--text-bold">Do you own multiple hotels, or are you part of a property management company or group?</label>
                        <div className="form-check form-check-inline">
                          <input type="radio" {...register('isMultipleOrPartOfProperty')} value="yes" className="form-check-input" id="hotelregRadio1" />
                          <label className="form-check-label" htmlFor="hotelregRadio1">Yes</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input type="radio" {...register('isMultipleOrPartOfProperty')} value="no" className="form-check-input" id="hotelregRadio2" />
                          <label className="form-check-label" htmlFor="hotelregRadio2">No</label>
                        </div>
                        {errors.isMultipleOrPartOfProperty && (
                          <div className="form-control-message form-control-message--error">{errors.isMultipleOrPartOfProperty?.message.toString()}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Property Location</p>
                    <div className='goform-group'>
                      <label htmlFor="streetAddress" className="form-label goform-label">Street Address</label>
                      <RFHInput register={register('streetAddress')} type="text" placeholder="Enter street address" error={errors.streetAddress?.message.toString()} />
                    </div>
                    <div className='goform-group'>
                      <label htmlFor="streetAddress" className="form-label goform-label">Street Address 2 <span className='goform-label__caption'>(optional)</span></label>
                      <RFHInput register={register('streetAddress2')} type="text" placeholder="Enter street address 2" error={errors.streetAddress2?.message.toString()} />
                    </div>
                    <div className='goform-group'>
                      <label htmlFor="streetAddress" className="form-label goform-label">Country/Region</label>
                      <RFHSelect
                        register={register('country')}
                        onChange={(e) => setValue('country', e.target.value, { shouldValidate: true })}
                        error={errors.country?.message.toString()}
                      >
                        <option value={''}>---</option>
                        {getCountries().map((country) => (
                          <option key={country} value={country}>
                            {countryLabels[country]}
                          </option>
                        ))}
                      </RFHSelect>
                    </div>
                    <div className='goform-group row'>
                      <div className='col-xl-6 col-lg-6'>
                        <label htmlFor="city" className="form-label goform-label">City</label>
                        <RFHInput register={register('city')} type="text" placeholder="E.g district 12" error={errors.city?.message.toString()} />
                      </div>
                      <div className='col-xl-6 col-lg-6'>
                        <label htmlFor="zipcode" className="form-label goform-label">Zipcode</label>
                        <RFHInput register={register('zipcode')} type="text" placeholder="XXXXXXXX" error={errors.zipcode?.message.toString()} />
                      </div>
                    </div>
                    {error && (
                      <div className="d-flex flex-column align-items-stretch text-danger-main">
                        {error}
                      </div>
                    )}
                  </div>
                  <div className='hotel-registration__button-list'>
                    <button
                      onClick={() => router.back()}
                      type='button' className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item'>Cancel</button>
                    <button disabled={loading} type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item'>{loading ? 'Please wait...' : 'Continue'}</button>
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

export default BasicInfo
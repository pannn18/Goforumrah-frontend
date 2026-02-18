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

const Facilities = (props: IProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hotelId = router.query.hotelId

  const fieldShapes = {
    parking: yup.string().required('Available parking is required'),
    breakfast: yup.string().required('Available breakfast is required'),
    breakfastPrice: yup.string().notRequired(),
  }

  const schema = yup.object().shape(fieldShapes)

  const [languages, setLanguages] = useState<string[]>(['English'])
  const [facilities, setFacilities] = useState([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { register, control, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  const breakfast = useWatch({ control, name: 'breakfast' })

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (values) => {
    setError('')

    if (Object.keys(errors).length) return

    const {
      parking,
      breakfast,
      breakfastPrice
    } = getValues()

    const payload = {
      id_hotel: hotelId,
      parking,
      breakfast,
      ...(breakfast === 'Yes' ? { breakfast_price: parseFloat(breakfastPrice) } : {}),
      languages,
      facilities
    }

    setLoading(true)

    const { ok, error } = await callAPI('/hotel-facilities/store', 'POST', payload, true)

    if (ok) {
      router.push(`/business/hotel/registration/amenities/${hotelId}`)
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
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--active">
                    <span className='hotel-registration__step-number hotel-registration__step-number--active'>3</span> Facilities
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
                  <h3 className='hotel-registration__content-title-heading'>Facilities & Services</h3>
                  <p className='hotel-registration__content-title-caption'>Now let us know some general details about your property like facilities available, internet, parking, and the languages you speak</p>
                </div>
                <div className='goform-alert hotel-registration__content-alert'>
                  <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                  <p>After you complete registration you'll be able to make changes to your listing before it goes live</p>
                </div>
                <form onSubmit={handleSubmit(onFormSubmit)}>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Parking</p>
                    <div className='goform-alert hotel-registration__content-alert'>
                      <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                      <p>This information is especially important for those traveling to your property by car.</p>
                    </div>
                    <div className='goform-group'>
                      <label htmlFor="propertyName" className="form-label goform-label">Available Parking</label>
                      <RFHSelect
                        register={register('parking')}
                        onChange={(e) => setValue('parking', e.target.value, { shouldValidate: true })}
                        error={errors.parking?.message.toString()}
                      >
                        <option value={''}>---</option>
                        <option value={'No'}>No</option>
                        <option value={'Yes, Paid'}>Yes, Paid</option>
                        <option value={'Yes, Free'}>Yes, Free</option>
                      </RFHSelect>
                    </div>
                  </div>

                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Breakfast</p>
                    <div className='goform-group'>
                      <label htmlFor="propertyName" className="form-label goform-label">Available Breakfast</label>
                      <RFHSelect
                        register={register('breakfast')}
                        onChange={(e) => setValue('breakfast', e.target.value, { shouldValidate: true })}
                        error={errors.breakfast?.message.toString()}
                      >
                        <option value={''}>---</option>
                        <option value={'Yes'}>Yes</option>
                        <option value={'No'}>No</option>
                      </RFHSelect>
                    </div>
                    <div className='goform-group' style={{ display: breakfast === 'Yes' ? 'block' : 'none' }}>
                      <label className="form-label goform-label">Breakfast Price</label>
                      <RFHSelectAndInput
                        selectOptions={[{ value: '$', label: '$' }]}
                        selectValue={'$'} selectOnChange={(e) => { }} register={register('breakfastPrice')} type="number" min={0} placeholder="00" error={errors.breakfastPrice?.message.toString()} />
                    </div>
                  </div>


                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Languages Spoken</p>
                    {languages.map((value, index) => (
                      <div key={`language-option-${index}`} className='goform-group row'>
                        <label htmlFor="propertyName" className="form-label goform-label">Languages</label>
                        <div className='goform-group row align-items-center hotel-registration__facilities-lang'>
                          <div className='col hotel-registration__facilities-lang-field'>
                            <RFHSelect
                              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setLanguages(languages.map((language, languageIndex) => languageIndex === index ? e.target.value : language))
                              }}
                              value={value}
                            >
                              {ISO6391.getAllNames().map((lang) => (
                                <option key={lang} value={lang} selected={value === lang}>
                                  {lang}
                                </option>
                              ))}
                            </RFHSelect>
                          </div>
                          <div className='col hotel-registration__facilities-lang-colbutton'>
                            {index !== languages.length - 1 ? (
                              <div
                                onClick={() => setLanguages(languages.filter((_, i) => i !== index))}
                                style={{ cursor: 'pointer' }}>
                                <SVGIcon src={Icons.Trash} width={22} height={22} color='#CA3232' />
                              </div>
                            ) : (
                              <button
                                onClick={() => setLanguages([...languages, 'English'])}
                                type="button" className='button goform-button goform-button--outline-green hotel-registration__facilities-lang-button'>+ Add another language</button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Facilities That Are Popular With Guests</p>
                    <div className='goform-alert hotel-registration__content-alert'>
                      <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                      <p>Guests look for these facilities the most when they’re searching for properties.</p>
                    </div>
                    <div className='goform-group row'>
                      {['Free wifi', 'Non smoking room', 'Restaurant', 'Airport suffle', 'Room service', 'Family room', 'Bar', 'Spa', '24 - Front desk', 'Hot tub/Jacuzzi', 'Sauna', 'Air conditioning', 'Fitness center', 'Waterpark', 'Garden', 'Terrace'].map((facility, index) => (
                        <div key={`facility-option-${index}`} className='col-xl-4 col-lg-4 col-md-6 col-sm-6'>
                          <div className="form-check goform-selection hotel-registration__facilities-checkbox">
                            <input
                              checked={facilities.includes(facility)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (!facilities.includes(facility)) setFacilities([...facilities, facility])
                                } else {
                                  setFacilities(facilities.filter(value => value !== facility))
                                }
                              }}
                              type="checkbox" id={`facility-option-${index}`} className="form-check-input goform-selection__input" />
                            <label htmlFor={`facility-option-${index}`} className='goform-selection__label hotel-registration__facilities-checkbox-label'>{facility}</label>
                          </div>
                        </div>
                      ))}
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

export default Facilities
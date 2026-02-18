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
import useFetch from '@/hooks/useFetch'

interface IProps {
}

const Amenities = (props: IProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hotelId = router.query.hotelId

  const { ok: isLayoutOK, data: layoutData, error: layoutError, loading: layoutLoading } = useFetch('/hotel-layout/show', 'POST', { id_hotel: hotelId }, true)

  const [extraBed, setExtraBed] = useState<boolean>(false)
  const [amenities, setAmenities] = useState<{ [name: string]: { all: boolean, layouts: number[] } }>({})
  const [layouts, setLayouts] = useState<number[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (layoutData && !!layoutData?.length) setLayouts(layoutData.map((layout) => layout?.id_hotel_layout).filter((value) => value))
  }, [layoutData])


  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')

    const payload = {
      id_hotel: hotelId,
      extra_bed: extraBed ? 1 : 0,
      amenities: Object.keys(amenities).map((key) => ({
        amenities_name: key,
        id_hotel_layout: amenities[key].all ? layouts : amenities[key].layouts
      }))
    }

    setLoading(true)

    const { ok, error } = await callAPI('/hotel-amenities/store', 'POST', payload, true)

    if (ok) {
      router.push(`/business/hotel/registration/photos/${hotelId}`)
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
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--active">
                    <span className='hotel-registration__step-number hotel-registration__step-number--active'>4</span> Amenities
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
                  <h3 className='hotel-registration__content-title-heading'>Amenities</h3>
                  <p className='hotel-registration__content-title-caption'>You're almost done! We just need a few more details about the extra bed options you provide, plus any amenities or specific features and services available.</p>
                </div>
                <div className='goform-alert hotel-registration__content-alert'>
                  <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                  <p>After you complete registration you'll be able to make changes to your listing before it goes live</p>
                </div>
                <form onSubmit={onFormSubmit}>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Extra Bed Option</p>
                    <div className='goform-alert hotel-registration__content-alert'>
                      <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                      <p>These are the options for beds that can be added upon request.</p>
                    </div>
                    <label htmlFor="propertyName" className="form-label goform-label">Can you provide extra beds?</label>
                    <div className='goform-group'>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="extra-bed-option" id="extra-bed-yes" checked={extraBed} onChange={(e) => e.target.checked && setExtraBed(true)} />
                        <label className="form-check-label" htmlFor="extra-bed-yes">Yes</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="extra-bed-option" id="extra-bed-no" checked={!extraBed} onChange={(e) => e.target.checked && setExtraBed(false)} />
                        <label className="form-check-label" htmlFor="extra-bed-no">No</label>
                      </div>
                    </div>
                  </div>

                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Amenities</p>
                    <div className='hotel-registration__content-inner'>
                      <p className='hotel-registration__content-inner-title'>Most requested by Guest</p>
                      {['Air conditioning', 'Bathub', 'Spa tub', 'Flat-screen TV', 'Electric kattle', 'Balcony', 'View', 'Terrace'].map((amenity, index) => (
                        <div key={`amenity-${index}`} className='hotel-registration__content-inside'>
                          {Object.keys(amenities).includes(amenity) ? (
                            <>
                              <div className='hotel-registration__content-inside-header'>
                                <div className="form-check form-check-inline">
                                  <input
                                    checked={Object.keys(amenities).includes(amenity)} onChange={(e) => {
                                      if (e.target.checked) setAmenities({ ...amenities, [amenity]: { all: true, layouts } })
                                      else {
                                        const updatedAmenities = amenities
                                        delete updatedAmenities[amenity]
                                        setAmenities({ ...updatedAmenities })
                                      }
                                    }}
                                    className="form-check-input" type="checkbox" name={`amenity-${index}`} id={`amenity-${index}`} />
                                  <label className="form-check-label" htmlFor={`amenity-${index}`}>{amenity}</label>
                                </div>
                              </div>
                              <div className="form-check hotel-registration__amenities-radio">
                                <input
                                  checked={amenities[amenity].all}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const updatedAmenities = amenities
                                      updatedAmenities[amenity].all = true
                                      updatedAmenities[amenity].layouts = layouts
                                      setAmenities({ ...updatedAmenities })
                                    }
                                  }}
                                  className="form-check-input" type="radio" name={`amenity-${index}-all-true`} id={`amenity-${index}-all-true`} />
                                <label className="form-check-label" htmlFor={`amenity-${index}-all-true`}>All room</label>
                              </div>
                              <div className="form-check hotel-registration__amenities-radio">
                                <input
                                  checked={!amenities[amenity].all}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      const updatedAmenities = amenities
                                      updatedAmenities[amenity].all = false
                                      updatedAmenities[amenity].layouts = []
                                      setAmenities({ ...updatedAmenities })
                                    }
                                  }}
                                  className="form-check-input" type="radio" name={`amenity-${index}-all-false`} id={`amenity-${index}-all-false`} />
                                <label className="form-check-label" htmlFor={`amenity-${index}-all-false`}>Some room</label>
                              </div>
                              {!amenities[amenity]?.all && (
                                <>
                                  <p className='hotel-registration__amenities-radio-help'>Select where this amenity is available.</p>
                                  {(layoutData && !!layoutData?.length) && layoutData.map((layout, layoutIndex) => (
                                    <div key={`layout-option-${index}-${layoutIndex}`} className="form-check hotel-registration__amenities-radio">
                                      <input
                                        checked={amenities[amenity].layouts.includes(layout?.id_hotel_layout)}
                                        onChange={(e) => {
                                          const updatedAmenities = amenities
                                          if (e.target.checked) updatedAmenities[amenity].layouts = !updatedAmenities[amenity].layouts.includes(layout?.id_hotel_layout) ? [...updatedAmenities[amenity].layouts, layout?.id_hotel_layout] : updatedAmenities[amenity].layouts
                                          else updatedAmenities[amenity].layouts = updatedAmenities[amenity].layouts.filter((value) => value !== layout?.id_hotel_layout)
                                          setAmenities({ ...updatedAmenities })
                                        }}
                                        className="form-check-input" type="checkbox" name={`layout-option-${index}`} id={`layout-option-${index}-${layoutIndex}`} />
                                      <label className="form-check-label" htmlFor={`layout-option-${index}-${layoutIndex}`}>{layout?.room_type}</label>
                                    </div>
                                  ))}
                                </>
                              )}
                            </>
                          ) : (
                            <div className="form-check form-check-inline">
                              <input
                                checked={Object.keys(amenities).includes(amenity)} onChange={(e) => {
                                  if (e.target.checked) setAmenities({ ...amenities, [amenity]: { all: true, layouts } })
                                  else {
                                    const updatedAmenities = amenities
                                    delete updatedAmenities[amenity]
                                    setAmenities({ ...updatedAmenities })
                                  }
                                }}
                                className="form-check-input" type="checkbox" name={`amenity-${index}`} id={`amenity-${index}`} />
                              <label className="form-check-label" htmlFor={`amenity-${index}`}>{amenity}</label>
                            </div>
                          )}
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
                        className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item'>Back</button>
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

export default Amenities
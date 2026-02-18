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
import CustomDropzone from '@/components/dropzone'

interface IProps {
}

const Photos = (props: IProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hotelId = router.query.hotelId

  const [images, setImages] = useState<{ name: string, url: string }[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')

    const payload = {
      id_hotel: hotelId,
      photos: images.map(({ url }) => url)
    }

    setLoading(true)

    const { ok, error } = await callAPI('/hotel-photo/store', 'POST', payload, true)

    if (ok) {
      router.push(`/business/hotel/registration/policies/${hotelId}`)
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
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--active">
                    <span className='hotel-registration__step-number hotel-registration__step-number--active'>5</span> Photos
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
                  <h3 className='hotel-registration__content-title-heading'>Property Photos</h3>
                  <p className='hotel-registration__content-title-caption'>
                    Great photos invite guests to get the full experience of your property, so upload some high-resolution photos that
                    represent all your property has to offer. We'll display these photos on your property's page on the Booking.com website.
                  </p>
                </div>

                <div className='goform-alert hotel-registration__content-alert'>
                  <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                  <p>After you complete registration you'll be able to make changes to your listing before it goes live</p>
                </div>

                <form onSubmit={onFormSubmit}>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title'>Photo Gallery</p>
                    <div style={{ marginBottom: 24 }}>
                      <CustomDropzone
                        images={images}
                        setImages={setImages}
                      />
                    </div>
                    <div className='goform-tips'>
                      <div className='goform-tips__icon'>
                        <SVGIcon src={Icons.Lamp} width={24} height={24} />
                      </div>
                      <div className='goform-tips__text'>
                        <h6 className='goform-tips__text-title'>Tips</h6>
                        <p className='goform-tips__text-caption'>Guests love photos! Here are some tips to help you take great photos of your property</p>
                      </div>
                      <a href='#' className='goform-tips__text-link'>See tips</a>
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

export default Photos
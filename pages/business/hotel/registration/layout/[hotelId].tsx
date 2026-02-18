import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import LayoutForm from '@/components/pages/business/hotel/registration/layout'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { RFHInput, RFHSelect, RFHSelectAndInput } from '@/components/forms/fields'
import alertInfo from '@/assets/images/alert_info.svg'
import { Icons } from '@/types/enums'
import { callAPI } from '@/lib/axiosHelper'

interface IProps {
}

interface LayoutData {
  roomName?: string
  roomType?: string
  roomNumber?: number
  smokingPolicy?: string
  maxGuest?: number
  roomSize?: number
  price?: number
  beds?: { type: string, amount: number }[]
  roomSizeType?: string
  priceType?: string
}

const LayoutPricing = (props: IProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hotelId = router.query.hotelId

  const [layouts, setLayouts] = useState<LayoutData[]>([])
  const [activeEditing, setActiveEditing] = useState<number>(-1)
  const [confirm, setConfirm] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const addEmptyLayout: () => number = () => {
    const newLayoutIndex = layouts.length
    const newLayouts = [
      ...layouts,
      {
        roomName: '',
        roomType: '',
        roomNumber: null,
        smokingPolicy: '',
        maxGuest: null,
        roomSize: null,
        price: null,
        beds: [{ type: '', amount: 1 }],
        roomSizeType: '',
        priceType: '',
      }
    ]

    setLayouts(newLayouts)

    return newLayoutIndex
  }

  useEffect(() => {
    if (!layouts.length) {
      const newAddedLayoutIndex = addEmptyLayout()
      setActiveEditing(newAddedLayoutIndex)
      setConfirm(false)
    }
  }, [layouts])

  const onSubmitLayouts = async () => {
    setError('')

    if (!layouts.length) return

    setLoading(true)

    let isError = ''

    for (let layout of layouts) {
      const payload = {
        id_hotel: hotelId,
        room_type: layout?.roomType,
        number_of_room: layout?.roomNumber,
        smoking_policy: layout?.smokingPolicy,
        guest_count: layout?.maxGuest,
        room_size: `${layout?.roomSize || 0} Square per meter`,
        price: layout?.price
      }

      const { ok, data, error } = await callAPI('/hotel-layout/store', 'POST', payload, true)

      if (ok && data?.id_hotel_layout) {
        for (let bed of layout?.beds) {
          const payload = {
            id_hotel_layout: data.id_hotel_layout,
            bed_type: bed.type,
            amount: bed.amount
          }
          const { ok, error } = await callAPI('/hotel-layout/bed/store', 'POST', payload, true)

          if (!ok) {
            isError = error || 'Unknown error'
          }
        }
      }

      if (!ok) {
        isError = error || 'Unknown error'
      }
    }

    setLoading(false)

    if (!isError) router.push(`/business/hotel/registration/facilities/${hotelId}`)
    else setError(isError)
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
                  <li className="hotel-registration__step-list-item hotel-registration__step-list-item--active">
                    <span className='hotel-registration__step-number hotel-registration__step-number--active'>2</span> Layout
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
              {confirm ? (
                <div className='hotel-registration__content-container'>
                  <div className='hotel-registration__content-title'>
                    <h3 className='hotel-registration__content-title-heading'>Layout & Pricing</h3>
                    <p className='hotel-registration__content-title-caption'>Tell us about your first room. After entering all the necessary info, you can fill in the details of your other rooms.</p>
                  </div>
                  <div className='hotel-registration__content-form'>
                    <p className='hotel-registration__content-form-title hotel-registration__layout-title'>Summary</p>
                    {layouts.map(({ roomName, roomNumber }, index) => (
                      <div key={`hotel-layout-${index}`} className='goform-group hotel-registration__layout-item'>
                        <div className='hotel-registration__layout-item-content hotel-registration__layout-item-content--first'>
                          <label htmlFor="propertyName" className="form-label goform-label hotel-registration__layout-item-label">Room name</label>
                          <p className='hotel-registration__layout-item-data'>{roomName}</p>
                        </div>
                        <div className='hotel-registration__layout-item-content hotel-registration__layout-item-content--middle'>
                          <label htmlFor="propertyName" className="form-label goform-label hotel-registration__layout-item-label">Number of type</label>
                          <p className='hotel-registration__layout-item-data'>{roomNumber}</p>
                        </div>
                        <div className='hotel-registration__layout-item-content hotel-registration__layout-item-content--last'>
                          <button
                            onClick={() => {
                              setActiveEditing(index)
                              setConfirm(false)
                            }}
                            type="button" className='button goform-button goform-button--outline-green hotel-registration__layout-item-button'>Edit</button>
                          <button
                            onClick={() => setLayouts(layout => layout.filter((_, layoutIndex) => layoutIndex !== index))}
                            type="button" className='button goform-button goform-button--outline-red hotel-registration__layout-item-button'>
                            <SVGIcon src={Icons.Trash} width={22} height={22} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {error && (
                    <div className="d-flex flex-column align-items-center text-center text-danger-main">
                      {error}
                    </div>
                  )}
                  <div className='hotel-registration__button-list hotel-registration__button-list--draft'>
                    <div
                      onClick={() => {
                        const newAddedLayoutIndex = addEmptyLayout()
                        setActiveEditing(newAddedLayoutIndex)
                        setConfirm(false)
                      }}
                      className='hotel-registration__button-draft' style={{ cursor: 'pointer' }}>Add another room</div>
                    <div className='hotel-registration__button-list-group'>
                      <button
                        onClick={() => {
                          setConfirm(false)
                        }}
                        disabled={loading}
                        className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item'>Cancel</button>
                      <button
                        onClick={onSubmitLayouts}
                        disabled={loading}
                        className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item'>{loading ? 'Please wait...' : 'Continue'}</button>
                    </div>
                  </div>
                </div>
              ) : (activeEditing > -1 && (
                <div className='hotel-registration__content-container'>
                  <div className='hotel-registration__content-title'>
                    <h3 className='hotel-registration__content-title-heading'>Layout & Pricing</h3>
                    <p className='hotel-registration__content-title-caption'>Tell us about your first room. After entering all the necessary info, you can fill in the details of your other rooms.</p>
                  </div>
                  <div className='goform-alert hotel-registration__content-alert'>
                    <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                    <p>After you complete registration you'll be able to make changes to your listing before it goes live</p>
                  </div>
                  <LayoutForm
                    data={layouts[activeEditing]}
                    onCancel={() => {
                      if (layouts.length > 1) {
                        setLayouts(layout => layout.filter((_, layoutIndex) => layoutIndex !== activeEditing))
                        setConfirm(true)
                      } else {
                        router.replace(router.asPath)
                      }
                    }}
                    onActiveLayoutUpdate={(updatedLayout) => {
                      setLayouts(layouts.map((layout, index) => index === activeEditing ? updatedLayout : layout))
                      setConfirm(true)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LayoutPricing
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import LayoutForm from '@/components/pages/business/hotel/registration/layout'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import alertInfo from '@/assets/images/alert_info.svg'
import { Icons } from '@/types/enums'
import { callAPI } from '@/lib/axiosHelper'
import CustomDropzone from '@/components/dropzone'
import useFetch from '@/hooks/useFetch'

const HeaderAllocation = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link href={"/business/hotel/property"}>
            <SVGIcon src={Icons.ArrowLeft} width={24} height={24} color='#1CB78D'/>
          </Link>
          <h4 className='car-dashboard__content-title-heading'>Edit Room</h4>
        </div>
      </div>
    </header>
  )
}

const Photos = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const hotelId = router.query.hotelId

  const { ok: isLayoutOK, data: layoutData, error: layoutError, loading: layoutLoading } = useFetch('/hotel-layout/show', 'POST', { id_hotel: hotelId }, true)

  const [extraBed, setExtraBed] = useState<boolean>(false)
  const [amenities, setAmenities] = useState<{ [name: string]: { all: boolean, layouts: number[] } }>({})
  const [layouts, setLayouts] = useState<number[]>([])

  const [images, setImages] = useState<{ name: string, url: string }[]>([])

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()


    const payload = {
      photos: images.map(({ url }) => url)
    }

  }

  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <div className='hotel-registration'>
        <HeaderAllocation />
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div className='hotel-registration__content-container'>

                <form onSubmit={onFormSubmit}>
                  <div className='hotel-registration__content-form'>
                    <div className="admin-property-business__form-header">
                      <p className='admin-property-business__content-form-title admin-property-business__content-form-title--image'>Image</p>
                      <div className="admin-property-business__content-btn">
                        <button type='button' className="admin-property-business__photo-btn admin-property-business__photo-btn--danger">Remove</button>
                        <button type='button' className="admin-property-business__photo-btn admin-property-business__photo-btn--success">Add Photos</button>
                      </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      <CustomDropzone
                        images={images}
                        setImages={setImages}
                      />
                    </div>
                  </div>
                </form>

                <div className="hotel-registration__content-form">
                  <p className='admin-property-business__content-form-title'>Room Type</p>
                  <div className="admin-property-business__form-wrapper">
                    <div className="admin-property-business__form-content-wrapper">
                      <label htmlFor="streetAddress" className="form-label goform-label">Country/Region</label>
                      <select name="country" id="" className='w-100 admin-property-business__content-form-select'>
                        <option value="">Standard Room</option>
                        <option value="">King Room</option>
                        <option value="">Queen Room</option>
                      </select>
                    </div>
                    <div className="admin-property-business__form-content-wrapper">
                      <label htmlFor="streetAddress" className="form-label goform-label">Room Name</label>
                      <input type="text" placeholder='Double Or Twin Room' name='roomName' className='form-control'/>
                    </div>
                    <div className="admin-property-business__content-separator"></div>
                    <div className="admin-property-business__form-wrapper row d-flex align-items-center">
                      <div className="admin-property-business__content-form-wrapper">
                        <div className="admin-property-business__form-content-wrapper w-100">
                          <label htmlFor="streetAddress" className="form-label goform-label">Bed type</label>
                          <select name="country" id="" className='w-100 admin-property-business__content-form-select'>
                            <option value="">Standard Room</option>
                            <option value="">Double Room</option>
                            <option value="">Triple Room</option>
                          </select>
                        </div>
                        <div className="admin-property-business__form-content-wrapper w-100">
                          <label htmlFor="streetAddress" className="form-label goform-label">Number of bed</label>
                          <select name="country" id="" className='w-100 admin-property-business__content-form-select'>
                            <option value="">1</option>
                            <option value="">2</option>
                            <option value="">3</option>
                          </select>
                        </div>
                      </div>
                      <button type='button' className='admin-property-business__form-btn'>
                        <SVGIcon src={Icons.Plus} width={16} height={16} color='#1CB78D'/>
                        Add Bed
                      </button>
                    </div>
                    <div className="admin-property-business__content-separator"></div>
                    <div className="admin-property-business__form-content-wrapper">
                      <label htmlFor="streetAddress" className="form-label goform-label">Guest Number</label>
                      <select name="country" id="" className='w-100 admin-property-business__content-form-select'>
                        <option value="">1</option>
                        <option value="">2</option>
                        <option value="">3</option>
                      </select>
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

                <div className='row'>
                  <div className='col-12'>
                    <div className='hotel-dashboard__button-list'>
                      <button type='button' className='button goform-button goform-button--outline-green hotel-dashboard__button-list-item' data-bs-toggle="modal" data-bs-target="#AddValidation">Cancel</button>
                      <button type='button' className='button goform-button goform-button--fill-green hotel-dashboard__button-list-item' data-bs-toggle="modal" data-bs-target="#SaveValidation">Continue</button>
                    </div>
                  </div>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalSaveValidation />
      <ModalAddValidation />
    </Layout>
  )
}

const ModalSaveValidation = () => {
  return (
    <div  className="modal fade" id="SaveValidation" tabIndex={-1} aria-labelledby="SaveValidationLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-reservation__modal">
        <div className="modal-content admin-reservation__modal-content">
          <div className="admin-reservation__modal-wrapper">
            <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
              <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
            </div>
            <div className="company-detail__popup-contents">
              <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Are you sure want to edit this room ?</h3>
              <p className="company-detail__content-caption--popup">If you agree, the room will be update immediately</p>
            </div>
          </div>
          <div className='company-detail__button-list-group row'>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'>Yes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ModalAddValidation = () => {
  return (
    <div  className="modal fade" id="AddValidation" tabIndex={-1} aria-labelledby="AddValidationLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-reservation__modal">
        <div className="modal-content admin-reservation__modal-content">
          <div className="admin-reservation__modal-wrapper">
            <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
              <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
            </div>
            <div className="company-detail__popup-contents">
              <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Are you sure want to add this room ?</h3>
              <p className="company-detail__content-caption--popup">If you agree, the room will be added immediately</p>
            </div>
          </div>
          <div className='company-detail__button-list-group row'>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'>Yes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Photos
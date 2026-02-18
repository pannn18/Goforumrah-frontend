import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/business/car/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconCheck from 'assets/images/icon_check_soft.svg'
import { useSession } from 'next-auth/react';
import { callAPI } from '@/lib/axiosHelper';
import { useRouter } from 'next/router';
import LoadingOverlay from '@/components/loadingOverlay';

export default function ReviewLocation() {
  return (
    <Layout>
      <div className="add-location">
        <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
        <HeaderLocation />
        <div className="container">
          <div className='add-location__content-container'>
            <ContentReview />
          </div>
        </div>
      </div>
      <Popup />
      <Popupp />
    </Layout>
  )
};

const HeaderLocation = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link href={"/business/car/location"} className='car-dashboard__content-header car-dashboard__content-header--link'>
            <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
            <h4 className='car-dashboard__content-title-heading'>Review Location</h4>
          </Link>
        </div>
      </div>
    </header>
  )
}

const ContentReview = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)
  const [formData, setFormData] = useState<any>({
    "id_car_business": id_car_business,
    "location_name": "",
    "address_line": "",
    "city": "",
    "region": "",
    "postcode": "",
    "lat": "",
    "long": ""
  })

  const [loading, setLoading] = useState<boolean>(true)
  const [submiting, setSubmiting] = useState<boolean>(false)

  useEffect(() => {
    if (!id_car_business) return

    // get location
    const getLocation = async () => {
      const { data, error, ok } = await callAPI('/car-business/location/show', 'POST', { id_car_business: id_car_business }, true)
      if (error) {
        console.log(error);
      }
      if (ok) {
        setFormData(data)
        setLoading(false)
      }

    }

    getLocation()
  }, [id_car_business])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSubmiting(true)

    const { data, error, ok } = await callAPI('/car-business/location/store', 'POST', formData, true)
    if (error) {
      console.log(error);
    }
    if (ok) {
      console.log('Success', data);
      router.push(`/business/car/location`)
    }
  }

  if (loading) {
    return <LoadingOverlay />
  }



  return (
    <div className="row ">
      <div className="company-detail__content-form col-xl-9 col-lg-9 col-md-9 col-sm-12">
        <div className='goform-group row'>
          <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
            <label htmlFor="location_name" className="form-label goform-label">Location name</label>
            <input
              type="text"
              placeholder='Enter your location'
              className="form-control goform-input"
              aria-describedby="locationNameHelp"
              id="location_name"
              name="location_name"
              value={formData.location_name}
              onChange={handleChange}
            />
          </div>
          <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
            <label htmlFor="address_line" className="form-label goform-label">Address line</label>
            <input
              type="text"
              placeholder='Ex : Corniche Street, Al Shatie District' className="form-control goform-input" aria-describedby="addressLineHelp"
              id="address_line"
              name='address_line'
              value={formData.address_line}
              onChange={handleChange}
            />
          </div>
          <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
            <label htmlFor="city" className="form-label goform-label">City</label>
            <input
              type="text"
              placeholder='Enter your city' className="form-control goform-input" aria-describedby="cityHelp"
              id="city"
              name='city'
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
            <label htmlFor="Passcode" className="form-label goform-label">Postcode</label>
            <input
              type="text"
              placeholder='Enter the number' className="form-control goform-input" aria-describedby="postcodeHelp"
              id="postcode"
              name='postcode'
              value={formData.postcode}
              onChange={handleChange}
            />
          </div>
          <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
            <label htmlFor="region" className="form-label goform-label">Region</label>
            <input
              type="text"
              placeholder='Enter your region' className="form-control goform-input" aria-describedby="regionHelp"
              id="region"
              name='region'
              value={formData.region}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="add-location__map">
          <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d475323.9790895042!2d39.2111492!3d21.450123!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01fb1137e59%3A0xe059579737b118db!2sJeddah%20Arab%20Saudi!5e0!3m2!1sid!2sid!4v1686900578131!5m2!1sid!2sid" width="787" height="285" loading="lazy"></iframe>
        </div>
      </div>
      <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
        <div className='add-location__button-list-group'>

          <button type='button' disabled={submiting} onClick={handleSubmit} className='btn btn-success btn-md w-100'>Submit Change</button>

          {/* <a href={"#"}>
            <button type='button' className='btn btn-outline-success btn-md w-100'>Save Change as Draft</button>
          </a>
          <a data-bs-toggle="modal" data-bs-target="#downloadModal">
            <button type='button' className='add-location__button-delete btn btn-outline-danger btn-md w-100'>Delete Location</button>
          </a> */}
        </div>
      </div>
    </div>
  )
}

const Popup = () => {
  return (
    <div className="company-detail__popup" id='popup'>
      <div className="company-detail__popup-form">
        <div className="company-detail__popup-form-content">
          <SVGIcon src={Icons.CircleCancel} width={72} height={72} color="#FFF9F9" className='goform-close' />
          <div className="company-detail__popup-content">
            <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Delete this location</h3>
            <p className="company-detail__content-caption--popup">As soon as you hit ‘Delete’ it will dissapear from marketplace and from your account</p>
          </div>
        </div>
        <div className='company-detail__button-list-group row'>
          <a href={"#"} className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
            <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
          </a>
          <Link href={"#"} className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
            <button type='button' className='button goform-button goform-button--fill-red goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'>Delete</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Popupp = () => {
  return (
    <div className="modal fade" id="downloadModal" tabIndex={-1} aria-labelledby="reviewLabel" aria-hidden="true">
      <div className="modal-dialog add-location__modal">
        <div className="modal-content add-location__modal-body">
          <div className="add-location__popup-form-content">
            <SVGIcon src={Icons.CircleCancel} width={72} height={72} color="#FFF9F9" className='goform-close' />
            <div className="add-location__popup-content">
              <h3 className="add-location__popup-form-title ">Delete this location</h3>
              <p className="company-detail__content-caption--popup">As soon as you hit ‘Delete’ it will dissapear from marketplace and from your account</p>
            </div>
          </div>
          <div className='company-detail__button-list-group row'>
            <a href={"#"} className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item' data-bs-dismiss="modal">Cancel</button>
            </a>
            <Link href={"#"} className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' className='button goform-button goform-button--fill-red goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'>Delete</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
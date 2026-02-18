import Layout from '@/components/layout'
import React from 'react'
import { useState } from "react"
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Link from 'next/link';
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconInfo from 'assets/images/alert_info.svg'
import iconPlus from 'assets/images/icon_plus.svg'
import iconCheck from 'assets/images/icon_check_soft.svg'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import { useRouter } from 'next/router'
import { useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapComponent = ({ onMapClick }) => {
  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const defaultCenter = {
    lat: 21.450123, // Latitude default Jeddah
    lng: 39.2111492, // Longitude default Jeddah
  };

  const handleMapClick = useCallback(
    (event) => {
      onMapClick({
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      });
    },
    [onMapClick]
  );

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDV_nYMl0gl8P2lFU9Majxz-4rcSLdfx3s"
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={mapStyles}
        center={defaultCenter}
        zoom={13}
        onClick={handleMapClick}
      >
        {/* Marker akan ditampilkan saat pengguna mengklik di peta */}
        {/* <Marker position={{ lat: yourLat, lng: yourLng }} /> */}
      </GoogleMap>
    </LoadScript>
  );
};

interface ToggleSwitchProps {
  id: string;
  label: string;
}

const AddLocation = () => {
  const router = useRouter()

  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

  const [formData, setFormData] = useState({
    id_car_business: id_car_business,
    location_name: '',
    address_line: '',
    city: '',
    region: '',
    postcode: '',
    lat: '',
    long: ''
  })

  const [workingTimeMon, setWorkingTimeMon] = useState({
    id_car_business: id_car_business,
    day_name: "Monday",
    status: "0",
    from: "",
    to: ""
  })
  const [workingTimeTue, setWorkingTimeTue] = useState({
    id_car_business: id_car_business,
    day_name: "Tuesday",
    status: "0",
    from: "",
    to: ""
  })
  const [workingTimeWed, setWorkingTimeWed] = useState({
    id_car_business: id_car_business,
    day_name: "Wednesday",
    status: "0",
    from: "",
    to: ""
  })
  const [workingTimeThu, setWorkingTimeThu] = useState({
    id_car_business: id_car_business,
    day_name: "Thursday",
    status: "0",
    from: "",
    to: ""
  })
  const [workingTimeFri, setWorkingTimeFri] = useState({
    id_car_business: id_car_business,
    day_name: "Friday",
    status: "0",
    from: "",
    to: ""
  })
  const [workingTimeSat, setWorkingTimeSat] = useState({
    id_car_business: id_car_business,
    day_name: "Saturday",
    status: "0",
    from: "",
    to: ""
  })
  const [workingTimeSun, setWorkingTimeSun] = useState({
    id_car_business: id_car_business,
    day_name: "Sunday",
    status: "0",
    from: "",
    to: ""
  })

  const [errorMessage, setErrorMessage] = useState({
    locationValidation: '',
    addressValidation: '',
    cityValidation: '',
    passcodeValidation: '',
    regionValidation: '',
  })

  const toggleSwitchMon = () => {
    setIsCheckedMon(!isCheckedMon);
    setWorkingTimeMon((prevData) => ({
      ...prevData,
      status: isCheckedMon ? '0' : '1'
    }))
  };
  const toggleSwitchTue = () => {
    setIsCheckedTue(!isCheckedTue);
    setWorkingTimeTue((prevData) => ({
      ...prevData,
      status: isCheckedTue ? '0' : '1'
    }))
  };
  const toggleSwitchWed = () => {
    setIsCheckedWed(!isCheckedWed);
    setWorkingTimeWed((prevData) => ({
      ...prevData,
      status: isCheckedWed ? '0' : '1'
    }))
  };
  const toggleSwitchThu = () => {
    setIsCheckedThu(!isCheckedThu);
    setWorkingTimeThu((prevData) => ({
      ...prevData,
      status: isCheckedThu ? '0' : '1'
    }))
  };
  const toggleSwitchFri = () => {
    setIsCheckedFri(!isCheckedFri);
    setWorkingTimeFri((prevData) => ({
      ...prevData,
      status: isCheckedFri ? '0' : '1'
    }))
  };
  const toggleSwitchSat = () => {
    setIsCheckedSat(!isCheckedSat);
    setWorkingTimeSat((prevData) => ({
      ...prevData,
      status: isCheckedSat ? '0' : '1'
    }))
  };
  const toggleSwitchSun = () => {
    setIsCheckedSun(!isCheckedSun);
    setWorkingTimeSun((prevData) => ({
      ...prevData,
      status: isCheckedSun ? '0' : '1'
    }))
  };

  const [isCheckedMon, setIsCheckedMon] = useState(false);
  const [isCheckedTue, setIsCheckedTue] = useState(false);
  const [isCheckedWed, setIsCheckedWed] = useState(false);
  const [isCheckedThu, setIsCheckedThu] = useState(false);
  const [isCheckedFri, setIsCheckedFri] = useState(false);
  const [isCheckedSat, setIsCheckedSat] = useState(false);
  const [isCheckedSun, setIsCheckedSun] = useState(false);

  let hasError = false

  const onSubmit = async (e) => {
    e.preventDefault()

    console.log('Form Data : ', formData);

    if (formData.location_name === '') {
      errorMessage.locationValidation = 'Location name is required';
      hasError = true
    } else {
      errorMessage.locationValidation = '';
    }

    if (formData.address_line === '') {
      errorMessage.addressValidation = 'Address line is required';
      hasError = true
    } else {
      errorMessage.addressValidation = '';
    }

    if (formData.city === '') {
      errorMessage.cityValidation = 'City is required';
      hasError = true
    } else {
      errorMessage.cityValidation = '';
    }

    if (formData.postcode === '') {
      errorMessage.passcodeValidation = 'Passcode is required';
      hasError = true
    } else {
      errorMessage.passcodeValidation = '';
    }

    if (formData.region === '') {
      errorMessage.regionValidation = 'Region is required';
      hasError = true
    } else {
      errorMessage.regionValidation = '';
    }

    setErrorMessage({
      locationValidation: errorMessage.locationValidation,
      addressValidation: errorMessage.addressValidation,
      cityValidation: errorMessage.cityValidation,
      passcodeValidation: errorMessage.passcodeValidation,
      regionValidation: errorMessage.regionValidation
    })

    if (!hasError) {
      hasError = false
    }

    if (!hasError) {
      const { ok, error } = await callAPI('/car-business/location/store', 'POST', formData, true)

      if (ok) {
        console.log('Success');

        // Store Working Time
        const { ok: okMon, error: errorMon } = await callAPI('/car-business/working-time/store', 'POST', workingTimeMon, true)
        const { ok: okTue, error: errorTue } = await callAPI('/car-business/working-time/store', 'POST', workingTimeTue, true)
        const { ok: okWed, error: errorWed } = await callAPI('/car-business/working-time/store', 'POST', workingTimeWed, true)
        const { ok: okThu, error: errorThu } = await callAPI('/car-business/working-time/store', 'POST', workingTimeThu, true)
        const { ok: okFri, error: errorFri } = await callAPI('/car-business/working-time/store', 'POST', workingTimeFri, true)
        const { ok: okSat, error: errorSat } = await callAPI('/car-business/working-time/store', 'POST', workingTimeSat, true)
        const { ok: okSun, error: errorSun } = await callAPI('/car-business/working-time/store', 'POST', workingTimeSun, true)

        router.push(`/business/car/registration`)
      } else {
        console.log(error);

      }
    }
  }

  const handleMapClick = (location) => {
    setFormData((prevData) => ({
      ...prevData,
      lat: location.lat,
      long: location.lng
    }))
  };

  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <header>
        <div className="car-dashboard__header">
          <Link href={"./"}>
            <div className="container car-dashboard__content-header">
              <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
              <h4 className='car-dashboard__content-title-heading'>Add your location</h4>
            </div>
          </Link>
        </div>
      </header>
      <form onSubmit={onSubmit}>
        <div className="add-location">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className='add-location__content-container'>
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                      <div className="goform-alert__box">
                        <BlurPlaceholderImage className='' alt='image' src={iconInfo} width={28} height={28} />
                        <div className="add-location__content-flag-form">
                          <p className="add-location__content-title add-location__content-title--alert-info">This is important</p>
                          <div className="add-location__content-flag-desc">
                            <p className='add-location__content-caption'>
                              This is where you can tell us about your 1 location(s). Top tip - when you choose a name for each location, use the name your customers are likely to use when searching for cars in your area.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="company-detail__content-form col-xl-8 col-lg-8 col-md-12 col-sm-12">
                      <h4 className='mb-5'>Your Location</h4>
                      <div className='goform-group row'>
                        <div className='col-xl-5 col-lg-5 col-md-5 col-sm-5 company-detail__content-label'>
                          <label htmlFor="location_name" className="form-label goform-label">Location name</label>
                          <input type="text" placeholder='Jeddah' className="form-control goform-input goform-input--active" id="location_name" aria-describedby="locationNameHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                location_name: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.locationValidation = 'Location name is required'
                              } else {
                                errorMessage.locationValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.locationValidation}
                          </div>
                        </div>
                        <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7"></div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
                          <label htmlFor="address_line" className="form-label goform-label">Address line</label>
                          <input type="text" placeholder='Corniche Street, Al Shatie District' className="form-control goform-input goform-input--active" id="address_line" aria-describedby="addressLineHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                address_line: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.addressValidation = 'Address line is required'
                              } else {
                                errorMessage.addressValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.addressValidation}
                          </div>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
                          <label htmlFor="city" className="form-label goform-label">City</label>
                          <input type="text" placeholder='Jeddah' className="form-control goform-input goform-input--active" id="city" aria-describedby="cityHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                city: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.cityValidation = 'City is required'
                              } else {
                                errorMessage.cityValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.cityValidation}
                          </div>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
                          <label htmlFor="postcode" className="form-label goform-label">Passcode</label>
                          <input type="text" placeholder='23415' className="form-control goform-input goform-input--active" id="postcode" aria-describedby="passcodeHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                postcode: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.passcodeValidation = 'Passcode is required'
                              } else {
                                errorMessage.passcodeValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.passcodeValidation}
                          </div>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 company-detail__content-label'>
                          <label htmlFor="region" className="form-label goform-label">Region</label>
                          <input type="text" placeholder='Jeddah' className="form-control goform-input goform-input--active" id="region" aria-describedby="cityHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                region: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.regionValidation = 'Region is required'
                              } else {
                                errorMessage.regionValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.regionValidation}
                          </div>
                        </div>
                      </div>
                      <div className="add-location__map">
                        <MapComponent onMapClick={handleMapClick} />
                        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d475323.9790895042!2d39.2111492!3d21.450123!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3d01fb1137e59%3A0xe059579737b118db!2sJeddah%20Arab%20Saudi!5e0!3m2!1sid!2sid!4v1686900578131!5m2!1sid!2sid" width="787" height="285" loading="lazy"></iframe> */}
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12"></div>
                    <div className="add-location__content-form add-location__content-form--time col-xl-8 col-lg-8 col-md-12 col-sm-12 ">
                      <p className="add-location__content-title">Working time</p>
                      <div className="add-location__content-time">
                        <div className="add-location__content-time--left">
                          <p className="add-location__content-title add-location__content-title--time">Monday</p>
                          <div className="add-location__content-radio">
                            <div className="add-location__toggle" onClick={toggleSwitchMon} style={{ backgroundColor: isCheckedMon ? '#1CB78D' : '#D9E0E4', }}>
                              <div className={`add-location__toggle-switch ${isCheckedMon ? 'add-location__toggle-on' : ''}`}></div>
                              <div style={{ transform: isCheckedMon ? 'translateX(-20px)' : 'translateX(0px)' }} className="add-location__toggle-content">
                                {isCheckedMon ? '✔' : '✕'}
                              </div>
                              <label htmlFor="monday"></label>
                            </div>
                            <p className='add-location__radio-status'>{isCheckedMon ? 'Open' : 'Closed'}</p>
                          </div>
                        </div>
                        <div className="add-location__time-input">
                          <div className="add-location__content-label--wrapper">
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedMon} type="text" placeholder='from' className="form-control goform-input" id="workingTimeFrom" aria-describedby="workingTimeFromHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeMon((prevData) => ({
                                    ...prevData,
                                    from: newValue,
                                  }))
                                }}
                              />
                            </div>
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedMon} type="text" placeholder='to' className="form-control goform-input" id="workingTimeTo" aria-describedby="workingTimeToHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeMon((prevData) => ({
                                    ...prevData,
                                    to: newValue,
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-location__content-time">
                        <div className="add-location__content-time--left">
                          <p className="add-location__content-title add-location__content-title--time">Tuesday</p>
                          <div className="add-location__content-radio">
                            <div className="add-location__toggle" onClick={toggleSwitchTue} style={{ backgroundColor: isCheckedTue ? '#1CB78D' : '#D9E0E4', }}>
                              <div className={`add-location__toggle-switch ${isCheckedTue ? 'add-location__toggle-on' : ''}`}></div>
                              <div style={{ transform: isCheckedTue ? 'translateX(-20px)' : 'translateX(0px)' }} className="add-location__toggle-content">
                                {isCheckedTue ? '✔' : '✕'}
                              </div>
                              <label htmlFor="tuesday"></label>
                            </div>
                            <p className='add-location__radio-status'>{isCheckedTue ? 'Open' : 'Closed'}</p>
                          </div>
                        </div>
                        <div className="add-location__time-input">
                          <div className="add-location__content-label--wrapper">
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedTue} type="text" placeholder='from' className="form-control goform-input" id="workingTimeFrom" aria-describedby="workingTimeFromHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeTue((prevData) => ({
                                    ...prevData,
                                    from: newValue,
                                  }))
                                }}
                              />
                            </div>
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedTue} type="text" placeholder='to' className="form-control goform-input" id="workingTimeTo" aria-describedby="workingTimeToHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeTue((prevData) => ({
                                    ...prevData,
                                    to: newValue,
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-location__content-time">
                        <div className="add-location__content-time--left">
                          <p className="add-location__content-title add-location__content-title--time">Wednesday</p>
                          <div className="add-location__content-radio">
                            <div className="add-location__toggle" onClick={toggleSwitchWed} style={{ backgroundColor: isCheckedWed ? '#1CB78D' : '#D9E0E4', }}>
                              <div className={`add-location__toggle-switch ${isCheckedWed ? 'add-location__toggle-on' : ''}`}></div>
                              <div style={{ transform: isCheckedWed ? 'translateX(-20px)' : 'translateX(0px)' }} className="add-location__toggle-content">
                                {isCheckedWed ? '✔' : '✕'}
                              </div>
                              <label htmlFor="wednesday"></label>
                            </div>
                            <p className='add-location__radio-status'>{isCheckedWed ? 'Open' : 'Closed'}</p>
                          </div>
                        </div>
                        <div className="add-location__time-input">
                          <div className="add-location__content-label--wrapper">
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedWed} type="text" placeholder='from' className="form-control goform-input" id="workingTimeFrom" aria-describedby="workingTimeFromHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeWed((prevData) => ({
                                    ...prevData,
                                    from: newValue,
                                  }))
                                }}
                              />
                            </div>
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedWed} type="text" placeholder='to' className="form-control goform-input" id="workingTimeTo" aria-describedby="workingTimeToHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeWed((prevData) => ({
                                    ...prevData,
                                    to: newValue,
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-location__content-time">
                        <div className="add-location__content-time--left">
                          <p className="add-location__content-title add-location__content-title--time">Thursday</p>
                          <div className="add-location__content-radio">
                            <div className="add-location__toggle" onClick={toggleSwitchThu} style={{ backgroundColor: isCheckedThu ? '#1CB78D' : '#D9E0E4', }}>
                              <div className={`add-location__toggle-switch ${isCheckedThu ? 'add-location__toggle-on' : ''}`}></div>
                              <div style={{ transform: isCheckedThu ? 'translateX(-20px)' : 'translateX(0px)' }} className="add-location__toggle-content">
                                {isCheckedThu ? '✔' : '✕'}
                              </div>
                              <label htmlFor="thunesday"></label>
                            </div>
                            <p className='add-location__radio-status'>{isCheckedThu ? 'Open' : 'Closed'}</p>
                          </div>
                        </div>
                        <div className="add-location__time-input">
                          <div className="add-location__content-label--wrapper">
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedThu} type="text" placeholder='from' className="form-control goform-input" id="workingTimeFrom" aria-describedby="workingTimeFromHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeThu((prevData) => ({
                                    ...prevData,
                                    from: newValue,
                                  }))
                                }}
                              />
                            </div>
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedThu} type="text" placeholder='to' className="form-control goform-input" id="workingTimeTo" aria-describedby="workingTimeToHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeThu((prevData) => ({
                                    ...prevData,
                                    to: newValue,
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-location__content-time">
                        <div className="add-location__content-time--left">
                          <p className="add-location__content-title add-location__content-title--time">Friday</p>
                          <div className="add-location__content-radio">
                            <div className="add-location__toggle" onClick={toggleSwitchFri} style={{ backgroundColor: isCheckedFri ? '#1CB78D' : '#D9E0E4', }}>
                              <div className={`add-location__toggle-switch ${isCheckedFri ? 'add-location__toggle-on' : ''}`}></div>
                              <div style={{ transform: isCheckedFri ? 'translateX(-20px)' : 'translateX(0px)' }} className="add-location__toggle-content">
                                {isCheckedFri ? '✔' : '✕'}
                              </div>
                              <label htmlFor="Frinesday"></label>
                            </div>
                            <p className='add-location__radio-status'>{isCheckedFri ? 'Open' : 'Closed'}</p>
                          </div>
                        </div>
                        <div className="add-location__time-input">
                          <div className="add-location__content-label--wrapper">
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedFri} type="text" placeholder='from' className="form-control goform-input" id="workingTimeFrom" aria-describedby="workingTimeFromHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeFri((prevData) => ({
                                    ...prevData,
                                    from: newValue,
                                  }))
                                }}
                              />
                            </div>
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedFri} type="text" placeholder='to' className="form-control goform-input" id="workingTimeTo" aria-describedby="workingTimeToHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeFri((prevData) => ({
                                    ...prevData,
                                    to: newValue,
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-location__content-time">
                        <div className="add-location__content-time--left">
                          <p className="add-location__content-title add-location__content-title--time">Saturday</p>
                          <div className="add-location__content-radio">
                            <div className="add-location__toggle" onClick={toggleSwitchSat} style={{ backgroundColor: isCheckedSat ? '#1CB78D' : '#D9E0E4', }}>
                              <div className={`add-location__toggle-switch ${isCheckedSat ? 'add-location__toggle-on' : ''}`}></div>
                              <div style={{ transform: isCheckedSat ? 'translateX(-20px)' : 'translateX(0px)' }} className="add-location__toggle-content">
                                {isCheckedSat ? '✔' : '✕'}
                              </div>
                              <label htmlFor="Satnesday"></label>
                            </div>
                            <p className='add-location__radio-status'>{isCheckedSat ? 'Open' : 'Closed'}</p>
                          </div>
                        </div>
                        <div className="add-location__time-input">
                          <div className="add-location__content-label--wrapper">
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedSat} type="text" placeholder='from' className="form-control goform-input" id="workingTimeFrom" aria-describedby="workingTimeFromHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeSat((prevData) => ({
                                    ...prevData,
                                    from: newValue,
                                  }))
                                }}
                              />
                            </div>
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedSat} type="text" placeholder='to' className="form-control goform-input" id="workingTimeTo" aria-describedby="workingTimeToHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeSat((prevData) => ({
                                    ...prevData,
                                    to: newValue,
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="add-location__content-time">
                        <div className="add-location__content-time--left">
                          <p className="add-location__content-title add-location__content-title--time">Sunday</p>
                          <div className="add-location__content-radio">
                            <div className="add-location__toggle" onClick={toggleSwitchSun} style={{ backgroundColor: isCheckedSun ? '#1CB78D' : '#D9E0E4', }}>
                              <div className={`add-location__toggle-switch ${isCheckedSun ? 'add-location__toggle-on' : ''}`}></div>
                              <div style={{ transform: isCheckedSun ? 'translateX(-20px)' : 'translateX(0px)' }} className="add-location__toggle-content">
                                {isCheckedSun ? '✔' : '✕'}
                              </div>
                              <label htmlFor="Sunnesday"></label>
                            </div>
                            <p className='add-location__radio-status'>{isCheckedSun ? 'Open' : 'Closed'}</p>
                          </div>
                        </div>
                        <div className="add-location__time-input">
                          <div className="add-location__content-label--wrapper">
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedSun} type="text" placeholder='from' className="form-control goform-input" id="workingTimeFrom" aria-describedby="workingTimeFromHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeSun((prevData) => ({
                                    ...prevData,
                                    from: newValue,
                                  }))
                                }}
                              />
                            </div>
                            <div className='add-location__content-label--time'>
                              <input disabled={!isCheckedSun} type="text" placeholder='to' className="form-control goform-input" id="workingTimeTo" aria-describedby="workingTimeToHelp"
                                onChange={(e) => {
                                  const newValue = e.target.value
                                  setWorkingTimeSun((prevData) => ({
                                    ...prevData,
                                    to: newValue,
                                  }))
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12"></div>
                    <div className='add-location__button-list add-location__button-list--payment col-xl-8 col-lg-8 col-md-8 col-sm-12'>
                      <div className='add-location__button-list-group'>
                        <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#postModal">Complete registration</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="postModal" tabIndex={-1} aria-labelledby="postLabel" aria-hidden="true">
              <div className="modal-dialog admin-blog__modal">
                <div className="modal-content admin-blog__modal-body">
                  <div className="admin-blog__modal-content">
                    <div className="admin-blog__modal-image">
                      <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                    </div>
                    <div className="admin-blog__modal-text">
                      <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Mark this step as complete?</h3>
                      <p className="company-detail__content-caption--popup">Once marked as complete you will not be able to update the information until your registration is complete and your account is live.</p>
                    </div>
                  </div>
                  <div className="admin-blog__modal-footer">
                    <button type="button" className="btn btn-outline-secondary admin-blog__modal-button" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" className="btn btn-success admin-blog__modal-button" data-bs-dismiss="modal">Yes, Complete step</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </form>
    </Layout>
  )
}

export default AddLocation
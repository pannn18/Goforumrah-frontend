/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconInfo from 'assets/images/alert_info.svg'
import iconCheck from 'assets/images/icon_check_soft.svg'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import countryLabels from 'react-phone-number-input/locale/en.json'
import ISO6391 from 'iso-639-1'

const companyDetails = () => {
  const router = useRouter()

  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

  const [currencies, setCurrencies] = useState([]);
  let hasError = false
  const [formData, setFormData] = useState({
    id_car_business: id_car_business,
    company_name: "",
    trading_as: "",
    country: "",
    currency: "",
    language: "",
    vat_number: "",
    registration_number: ""
  })

  useEffect(() => {
    // Get currency from API
    fetch('https://openexchangerates.org/api/currencies.json')
      .then(response => response.json())
      .then(data => {
        // Change currency object to array
        const currencyArray = Object.entries(data).map(([currency, country]) => ({
          currency,
          country,
        }));
        setCurrencies(currencyArray);
      })
      .catch(error => console.error(error));
  }, []);

  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }
    if (e.target.value === 'false') {
      boolean = false
    }

    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: boolean ?? e.target.value,
    }))
  }

  const [errorMessage, setErrorMessage] = useState({
    companyValidation: '',
    tradingValidation: '',
    vatValidation: '',
    companyRegValidation: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    console.log('Form Data : ', formData);

    // Set error data when field is empty
    if (formData.company_name === '') {
      errorMessage.companyValidation = 'Company name is required';
      hasError = true
    } else {
      errorMessage.companyValidation = '';
    }

    if (formData.trading_as === '') {
      errorMessage.tradingValidation = 'Trading as is required';
      hasError = true
    } else {
      errorMessage.tradingValidation = '';
    }

    if (formData.vat_number === '') {
      errorMessage.vatValidation = 'VAT number is required';
      hasError = true
    } else {
      errorMessage.vatValidation = '';
    }

    if (formData.registration_number === '') {
      errorMessage.companyRegValidation = 'Register number is required';
      hasError = true
    } else {
      errorMessage.companyRegValidation = '';
    }

    setErrorMessage({
      companyValidation: errorMessage.companyValidation,
      tradingValidation: errorMessage.tradingValidation,
      vatValidation: errorMessage.vatValidation,
      companyRegValidation: errorMessage.companyRegValidation
    })

    if (!hasError) {
      hasError = false
    }

    if (!hasError) {
      const { ok, error } = await callAPI('/car-business/details/store', 'POST', formData, true)
      if (ok) {
        console.log('Success');
        router.push('/business/car/registration')
      } else {
        console.log(error);
      }
    }
  }

  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <header>
        <div className="car-dashboard__header">
          <Link href={"./"}>
            <div className="container car-dashboard__content-header">
              <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
              <h4 className='car-dashboard__content-title-heading'>Add your Company details</h4>
            </div>
          </Link>
        </div>
      </header>

      <div className="company-detail">
        <form onSubmit={onSubmit}>
          <div className="container">
            <div className="row">
              <div className="col">
                <div className='company-detail__content-container'>
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                      <div className="goform-alert_box company-detail_content-alert">
                        <BlurPlaceholderImage className='' alt='image' src={iconInfo} width={28} height={28} />
                        <div className="company-detail__content-flag-form">
                          <p className="company-detail_content-title company-detail_content-title--alert-info">This is important</p>
                          <div className="company-detail__content-flag-desc">
                            <p className='company-detail__content-caption'>
                              We check all our suppliers are reputable businesses. Details you give us here will be used for us to verify your identity and, later, be used to populate documents we send you (or prepare on your behalf so you can send us).
                            </p>
                            <p className='company-detail__content-caption'>
                              Please, make sure it is completed correctly and fully. Once completed you will NOT be able to change this information.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="company-detail__content-form col-xl-8 col-lg-8 col-md-12 col-sm-12">
                      <p className="company-detail__content-title">Company Details</p>
                      <div className='goform-group row'>
                        <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12 company-detail__content-label'>
                          <label htmlFor="company_name" className="form-label goform-label">Company name</label>
                          <input type="text" placeholder='Enter your company name' className="form-control goform-input" id="company_name" aria-describedby="companyNameHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                company_name: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.companyValidation = 'Company name is required'
                              } else {
                                errorMessage.companyValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.companyValidation}
                          </div>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12 company-detail__content-label'>
                          <label htmlFor="trading_as" className="form-label goform-label">Trading as :</label>
                          <input type="text" placeholder='Enter the name' className="form-control goform-input" id="trading_as" aria-describedby="tradingAs"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                trading_as: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.tradingValidation = 'Trading as is required'
                              } else {
                                errorMessage.tradingValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.tradingValidation}
                          </div>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                          <label htmlFor="country" className="form-label goform-label">Country :</label>
                          <select name="country" className="form-select goform-select" id="country" placeholder="Select your country" onChange={onMutate}>
                            {getCountries().map((country) => (
                              <option key={country} value={country}>
                                {countryLabels[country]}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                          <label htmlFor="currency" className="form-label goform-label">Currency</label>
                          <select onChange={onMutate} className="form-select goform-select" id='currency' aria-label="star rating select">
                            {currencies.map((currencyData, index) => (
                              <option key={index} value={currencyData.country}>
                                {`${currencyData.currency} (${currencyData.country})`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 company-detail__content-label'>
                          <label htmlFor="language" className="form-label goform-label">Language</label>
                          <select onChange={onMutate} className="form-select goform-select" id="language" aria-label="star rating select">
                            {ISO6391.getAllNames().map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 company-detail__content-label'>
                          <label htmlFor="vat_number" className="form-label goform-label">VAT Number</label>
                          <input type="text" placeholder='Enter the number' className="form-control goform-input" id="vat_number" aria-describedby="vatNumberHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                vat_number: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.vatValidation = 'VAT Number is required'
                              } else {
                                errorMessage.vatValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.vatValidation}
                          </div>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 company-detail__content-label'>
                          <label htmlFor="registration_number" className="form-label goform-label">Company Registration Number</label>
                          <input type="text" placeholder='Enter your company name' className="form-control goform-input" id="registration_number" aria-describedby="companyRegistrationNumberHelp"
                            onChange={(e) => {
                              const newValue = e.target.value
                              setFormData((prevData) => ({
                                ...prevData,
                                registration_number: newValue,
                              }))
                              if (!newValue.trim()) {
                                errorMessage.companyRegValidation = 'Company registration number is required'
                              } else {
                                errorMessage.companyRegValidation = ''
                              }
                            }}
                          />
                          <div className="form-control-message form-control-message--error">
                            {errorMessage.companyRegValidation}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12"></div>
                    <div className='company-detail_button-list company-detail_button-list--payment col-xl-8 col-lg-8 col-md-12 col-sm-12'>
                      <div className='company-detail__button-list-group'>
                        {/* <a href={"#popup"} role="button" aria-expanded="false" aria-controls="popup">
                          <button type='button' className='button goform-button goform-button--fill-green goform-button--large-text'>Complete registration</button>
                        </a> */}
                        <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#postModal">Complete registration</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="company-detail__popup" id='popup'>
            <div className="company-detail__popup-form">
              <div className="company-detail__popup-form-content">
                <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                <div className="company-detail__popup-content">
                  <h3 className="company-detail_content-title-heading company-detail_content-title-heading--popup">Mark this step as complete?</h3>
                  <p className="company-detail__content-caption--popup">Once marked as complete you will not be able to update the information until your registration is complete and your account is live.</p>
                </div>
              </div>
              <div className='company-detail__button-list-group row'>
                <a href={"#"} className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                  <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Save & Close</button>
                </a>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                  <button type='submit' className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item '>Yes, Complete step</button>
                </div>
              </div>
            </div>
          </div> */}

          <div className="modal fade" id="postModal" tabIndex={-1} aria-labelledby="postLabel" aria-hidden="true">
            <div className="modal-dialog admin-blog__modal">
              <div className="modal-content admin-blog__modal-body">
                <div className="admin-blog__modal-content">
                  <div className="admin-blog__modal-image">
                    <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                  </div>
                  <div className="admin-blog__modal-text">
                    <h3 className="company-detail_content-title-heading company-detail_content-title-heading--popup">Mark this step as complete?</h3>
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

        </form>
      </div>

    </Layout>
  )
}

export default companyDetails
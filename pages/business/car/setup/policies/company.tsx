import Layout from '@/components/layout'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router';
import ReactDOM from 'react-dom';
import Navbar from '@/components/layout/navbar'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import PhoneInput, { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import { useSession } from 'next-auth/react';
import { callAPI } from '@/lib/axiosHelper';
import ISO6391 from 'iso-639-1'
import LoadingOverlay from '@/components/loadingOverlay';

export default function CarCompany() {

  const router = useRouter();
  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

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

  let hasError = false

  const [errorMessage, setErrorMessage] = useState({
    companyValidation: '',
    tradingValidation: '',
    vatValidation: '',
    companyRegValidation: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    console.log('Form Data : ', formData)

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
        router.push('/business/car/setup/policies')
      } else {
        console.log(error);
      }
    }
  }

  return (
    <Layout>
      <div className="business-profile">
        <Navbar showHelp={false} hideAuthButtons={true} />
        <div className="container">
          <CompanyForm
            onSubmit={onSubmit}
            formData={formData}
            id_car_business={id_car_business}
            setFormData={setFormData}
            errorMessage={errorMessage}
          />
        </div>
      </div>
    </Layout>
  )
};


const CompanyForm = ({ onSubmit, id_car_business, formData, setFormData, errorMessage }) => {
  const router = useRouter();
  const [companyOk, setCompanyOk] = useState(false)
  const [companyLoading, setCompanyLoading] = useState(true)

  useEffect(() => {
    if (!id_car_business) return

    const fetchCompanyData = async () => {
      const { status, data, ok, error } = await callAPI('/car-business/details/show', 'POST', { "id_car_business": id_car_business }, true);
      if (ok && data) {
        setFormData(() => ({
          id_car_business: id_car_business,
          company_name: data.company_name,
          trading_as: data.trading_as,
          country: data.country,
          currency: data.currency,
          language: data.language,
          vat_number: data.vat_number,
          registration_number: data.registration_number
        }))
      }
      setCompanyLoading(false)
      setCompanyOk(ok)
    }

    fetchCompanyData()
  }, [id_car_business])

  const onChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))

    // Set if onChange field empty, return error message
    if (id === 'company_name') {
      if (value === '') {
        errorMessage.companyValidation = 'Company name is required';
      } else {
        errorMessage.companyValidation = '';
      }
    } else if (id === 'trading_as') {
      if (value === '') {
        errorMessage.tradingValidation = 'Trading as is required';
      } else {
        errorMessage.tradingValidation = '';
      }
    } else if (id === 'vat_number') {
      if (value === '') {
        errorMessage.vatValidation = 'VAT number is required';
      } else {
        errorMessage.vatValidation = '';
      }
    } else if (id === 'registration_number') {
      if (value === '') {
        errorMessage.companyRegValidation = 'Register number is required';
      } else {
        errorMessage.companyRegValidation = '';
      }
    }
  }

  if (companyLoading) {
    return <LoadingOverlay />
  }

  if (companyOk) {
    return (
      <div>
        <form onSubmit={onSubmit}>
          <section className='business-profile__header'>
            <div className='container'>
              <div className='business-profile__header-inner'>
                <button onClick={() => router.back()} className='business-profile__header-back'>
                  <SVGIcon src={Icons.ArrowLeft} height={24} width={24} />
                  <h4>Company Details</h4>
                </button>
                <button type='submit' className='btn btn-sm btn-success'>Save</button>
              </div>
            </div>
          </section>

          <div className='company'>
            <div className='company__tab-content'>
              <div className='company__row'>
                <div className="company__block">
                  <label htmlFor="company_name">Company name</label>
                  <input type="text" name="company_name" id="company_name" placeholder='Enter your company name'
                    value={formData.company_name}
                    onChange={onChange}
                  />
                  <div className="form-control-message form-control-message--error">
                    {errorMessage.companyValidation}
                  </div>
                </div>
                <div className="company__block">
                  <label htmlFor="trading_as">Trading as :</label>
                  <input type="text" name="trading_as" id="trading_as" placeholder='Enter the trading as'
                    value={formData.trading_as}
                    onChange={onChange}
                  />
                  <div className="form-control-message form-control-message--error">
                    {errorMessage.tradingValidation}
                  </div>
                </div>
              </div>
              <div className='company__row'>
                <div className="company__block">
                  <label htmlFor="country">Country :</label>
                  <select name="country" className="form-select goform-select" id="country" placeholder="Select your country"
                    value={formData.country}
                    onChange={onChange}
                  >
                    {getCountries().map((country) => (
                      <option key={country} value={country}>
                        {countryLabels[country]}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="company__block">
                  <label htmlFor="language">Language :</label>
                  <select className="form-select goform-select" id="language" aria-label="star rating select"
                    value={formData.language}
                    onChange={onChange}
                  >
                    {ISO6391.getAllNames().map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='company__row'>
                <div className="company__block">
                  <label htmlFor="vat_number">VAT Number</label>
                  <input type="text" name="vat_number" id="vat_number" placeholder='Enter the VAT number'
                    value={formData.vat_number}
                    onChange={onChange}
                  />
                  <div className="form-control-message form-control-message--error">
                    {errorMessage.vatValidation}
                  </div>
                </div>
                <div className="company__block">
                  <label htmlFor="registration_number">Company Registration Number</label>
                  <input type="text" name="registration_number" id="registration_number" placeholder='Enter the registration number'
                    value={formData.registration_number}
                    onChange={onChange}
                  />
                  <div className="form-control-message form-control-message--error">
                    {errorMessage.companyRegValidation}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    )
  }
}


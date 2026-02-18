/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import iconCheck from 'assets/images/icon_check_soft.svg'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconInfo from 'assets/images/alert_info.svg'
import carImage from 'assets/images/car_details_image_2.png'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'

const gettingPricing = () => {

  const router = useRouter()
  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

  const [carData, setCarData] = useState(null)
  const [carLoading, setCarLoading] = useState(true)
  const [carOk, setCarOk] = useState(null)

  // Initialization for (price - tax 5%)
  const [priceTag, setPriceTag] = useState([])

  const [formData, setFormData] = useState({
    id_car_business_fleet: "",
    price: ""
  })

  const [carForms, setCarForms] = useState([formData]);

  const [carError, setCarError] = useState({
    priceValidation: '',
  })

  let hasError = false
  const [errorMessage, setErrorMessage] = useState([]);

  useEffect(() => {
    if (!id_car_business) return
    if (carData) return

    const fetchCarData = async () => {
      const { status, data, ok, error } = await callAPI('/car-business/fleet/show', 'POST', { "id_car_business": id_car_business }, true);
      if (ok) {
        setCarData(data)
        const newData = data.map((car) => ({
          id_car_business_fleet: car.id_car_business_fleet,
          price: ""
        }))
        setCarForms(newData)
      }
      setCarOk(ok)
      setCarLoading(false)
    }

    fetchCarData()
  }, [id_car_business])

  const onMutate = (e, index, fieldName, id_car_business_fleet) => {
    const { value } = e.target

    setCarForms((prevCarForms) => {
      const updatedCarForms = [...prevCarForms]
      updatedCarForms[index] = {
        ...updatedCarForms[index],
        id_car_business_fleet: id_car_business_fleet,
        [fieldName]: value
      }
      return updatedCarForms;
    })

    setErrorMessage((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = { ...updatedErrors[index], [`${fieldName}Validation`]: '' };
      return updatedErrors;
    });

    // Set price - tax 5%
    setPriceTag((prevPrice) => {
      const updatedPrice = [...prevPrice]
      updatedPrice[index] = (parseFloat(value) * 0.95).toFixed(2)
      return updatedPrice
    })

  }

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Car Forms : ', carForms);

    const newErrorMessage = [];

    for (let i = 0; i < carForms.length; i++) {
      if (carForms[i].price === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], priceValidation: 'Price is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], priceValidation: '' };
      }

      // Set the error messages for this form
      setErrorMessage((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[i] = newErrorMessage[i];
        return updatedErrors;
      });
    }

    if (!hasError) {
      hasError = false
    }

    if (!hasError) {
      for (let i = 0; i < carForms.length; i++) {
        try {
          const { ok, error } = await callAPI('/car-business/allocate-fleet', 'POST', carForms[i], true)
          if (ok) {
            console.log('Success');
          }
        } catch (error) {
          console.log(error);
        }
      }
      router.push('/business/car/setup');
    }
  }

  console.log('CarData : ', carData);

  if (carOk) {
    return (
      <Layout>
        <Navbar showHelp={false} hideAuthButtons={true} />
        <header>
          <div className="car-dashboard__header">
            <div className="container car-dashboard__content-header">
              <Link href={"/business/car/setup/"}>
                <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
              </Link>
              <h4 className='car-dashboard__content-title-heading'>Getting your pricing</h4>
            </div>
          </div>
        </header>
        <div className='car-finishing'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <div className='car-finishing__content-container'>
                  <form onSubmit={onSubmit}>
                    <div className="row">
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                        <div className="goform-alert__box company-detail__content-alert">
                          <BlurPlaceholderImage className='' alt='image' src={iconInfo} width={28} height={28} />
                          <div className="company-detail__content-flag-form">
                            <div className="company-detail__content-flag-desc">
                              <p className='company-detail__content-caption'>
                                Here you can set the number of vehicles that you allocate to display on the website page
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="car-finishing__content-form col-xl-8 col-lg-8 col-md-8 col-sm-12">
                        <p className="company-detail__content-title">Decide which vehicle you want to allocate</p>
                        <div className="goform-group">

                          {carData.map((car, index) => (
                            <div key={index} className="car-finishing__fleet row">
                              <div className="car-finishing__fleet-content col-xl-5 col-lg-6 col-md-5 col-sm-5">
                                <BlurPlaceholderImage className='car-finishing__fleet-img' alt='image' src={carImage} width={48} height={48} />
                                <div className="car-finishing__fleet-text">
                                  <p className="car-finishing__content-caption car-finishing__content-caption--bold">{car.car_brand}</p>
                                  <div className="car-finishing__fleet-info">
                                    <div className="car-finishing__fleet-info--left">
                                      <p className='car-finishing__fleet-caption'>{car.edition}</p>
                                      <div className="car-finishing__fleet-elipse"></div>
                                    </div>
                                    <p className="car-finishing__fleet-caption">{car.transmission}</p>
                                  </div>
                                </div>
                              </div>
                              <div className='col-xl-7 col-lg-6 col-md-7 col-sm-7 row car-finishing__pricing-wrapper'>
                                <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
                                  <label htmlFor="OnlinePricePerDay" className="form-label goform-label">Online Price per day</label>
                                  <div className="input-group goform-dropdown-phone">
                                    <div className="goform-dollar" aria-expanded="false">$</div>
                                    <input type="text" placeholder='00.00' className="form-control" aria-label="OnlinePricePerDay" name='price' id='price'
                                      onChange={(e) => {
                                        onMutate(e, index, "price", car.id_car_business_fleet)
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="col-xl-6 col-lg-12 col-md-12 col-sm-12">
                                  <label htmlFor="OnlinePricePerDay" className="form-label goform-label">What we pay you</label>
                                  <div className="car-finishing__pricing-content">
                                    <div className="car-finishing__pricing-text">$</div>
                                    <div className="car-finishing__pricing-text">{priceTag[index] ? priceTag[index] : '00.00'}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="form-control-message form-control-message--error">
                                {errorMessage[index]?.priceValidation}
                              </div>
                            </div>
                          ))}

                        </div>
                      </div>
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-0"></div>
                      <div className='col-xl-8 col-lg-8 col-md-8 col-sm-12 hotel-registration__button-list hotel-registration__button-list--payment'>
                        <div className='hotel-registration__button-list-group'>
                          <Link href={'/business/car/setup'} className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item hotel-registration__button-list-item'>Cancel</Link>
                          <button type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item'>Complete</button>
                        </div>
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
}

export default gettingPricing
/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconInfo from 'assets/images/alert_info.svg'
import carImage from 'assets/images/car_details_image_2.png'
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from '@/components/loadingOverlay'

const allocateFleet = () => {

  const router = useRouter()
  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

  const [carData, setCarData] = useState(null)
  const [carLoading, setCarLoading] = useState(true)
  const [carOk, setCarOk] = useState(null)

  const [formData, setFormData] = useState({
    id_car_business_fleet: '',
    total_car: ''
  })

  const [carForms, setCarForms] = useState([formData]);
  let hasError = false

  const [carError, setCarError] = useState({
    total_carValidation: '',
  })

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
          total_car: ""
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
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Car Forms : ', carForms);

    const newErrorMessage = [];

    for (let i = 0; i < carForms.length; i++) {
      if (carForms[i].total_car === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], total_carValidation: 'Total car is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], total_carValidation: '' };
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

  if (carLoading) {
    return <LoadingOverlay />
  }

  if (carOk) {

    console.log('Car Data : ', carData);

    return (
      <Layout>
        <Navbar showHelp={false} hideAuthButtons={true} />
        <header>
          <div className="car-dashboard__header">
            <div className="container car-dashboard__content-header">
              <Link href={"/business/car/setup"} className='car-dashboard__content-header car-dashboard__content-header--link'>
                <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
                <h4 className='car-dashboard__content-title-heading'>Getting your pricing</h4>
              </Link>
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
                                      <div className="car-finishing__fleet-elipse--tablet"></div>
                                      <p className='car-finishing__fleet-caption'>{car.edition}</p>
                                      <div className="car-finishing__fleet-elipse"></div>
                                    </div>
                                    <div className="car-finishing__fleet-info--right">
                                      <div className="car-finishing__fleet-elipse--tablet"></div>
                                      <p className='car-finishing__fleet-caption'>{car.transmission}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className='car-finishing__content-label  col-xl-7 col-lg-6 col-md-7 col-sm-7'>
                                <label htmlFor="total_car" className="form-label goform-label">Total Car</label>
                                <input type="text" placeholder='Total car' className="form-control goform-input" id="total_car" aria-describedby="total_carHelp"
                                  onChange={(e) => {
                                    onMutate(e, index, "total_car", car.id_car_business_fleet)
                                  }}
                                />
                              </div>
                              <div className="form-control-message form-control-message--error">
                                {errorMessage[index]?.total_carValidation}
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

export default allocateFleet
/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import iconCheckSoft from 'assets/images/icon_check_soft.svg'
import iconCheck from 'assets/images/icon_check_circle.svg'
import iconCompany from 'assets/images/icon_company-detail.svg'
import iconMap from 'assets/images/icon_map_pin.svg'
import iconCar from 'assets/images/icon_car.svg'
import iconRight from 'assets/images/icon_right.svg'
import Link from "next/link"
import useFetch from '@/hooks/useFetch'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from '@/components/loadingOverlay'


const carDashboard = () => {

  const router = useRouter()
  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

  const [companyData, setCompanyData] = useState(null)
  const [companyOk, setCompanyOk] = useState(false)
  const [companyLoading, setCompanyLoading] = useState(true)

  const [locationData, setLocationData] = useState(null)
  const [locationOk, setLocationOk] = useState(false)
  const [locationLoading, setLocationLoading] = useState(true)

  const [fleetData, setFleetData] = useState(null)
  const [fleetOk, setFleetOk] = useState(false)
  const [fleetLoading, setFleetLoading] = useState(true)

  useEffect(() => {
    if (!id_car_business) return
    if (companyData) return
    if (locationData) return
    if (fleetData) return

    const fetchCompanyData = async () => {
      const { status, data, ok, error } = await callAPI('/car-business/details/show', 'POST', { "id_car_business": id_car_business }, true);
      if (ok) {
        setCompanyData(data)
        setCompanyOk(ok)
      }
      setCompanyLoading(false)
    }

    const fetchLocationData = async () => {
      const { status, data, ok, error } = await callAPI('/car-business/location/show', 'POST', { "id_car_business": id_car_business }, true);
      if (ok) {
        setLocationData(data)
        setLocationOk(ok)
      }
      setLocationLoading(false)
    }

    const fetchFleetData = async () => {
      const { status, data, ok, error } = await callAPI('/car-business/fleet/show', 'POST', { "id_car_business": id_car_business }, true);
      if (ok) {
        setFleetData(data)
        setFleetOk(ok)
      }
      setFleetLoading(false)
    }

    fetchCompanyData()
    fetchLocationData()
    fetchFleetData()

  }, [id_car_business])

  useEffect(() => {
    // Check if all data is available and route if true
    if (companyOk && locationOk && fleetOk) {
      router.push('/business/car/setup')
    }
  }, [companyOk, locationOk, fleetOk, router])

  if (companyLoading || locationLoading || fleetLoading) {
    return <LoadingOverlay />
  }

  console.log('Company', companyData);
  console.log('Location', locationData);
  console.log('Fleet', fleetData);

  if (companyOk && locationOk && fleetOk) {
    return (
      <Layout>
        <Navbar showHelp={false} hideAuthButtons={true} />
        <div className='car-dashboard'>
          <div className='container'>
            <div className='row'>
              <div className='col'>
                <div className='car-dashboard__content-container'>
                  <form>
                    <div className='car-dashboard__content-form car-dashboard__content-form--column-center'>
                      <BlurPlaceholderImage className='' alt='image' src={iconCheckSoft} width={72} height={72} />
                      <h3 className="car-dashboard__content-title-heading">
                        Where you control your prices, allocation and reservation
                      </h3>
                      <p className='car-dashboard__content-title-caption'>Hello. It’s great that you’re here. This is your Dashboard where all the action takes place</p>
                      <p className='car-dashboard__content-title-caption'>Right now through, let’s get you set up. Follow the prompt on the right and you’re on your way to being live on <a className='car-dashboard__content-link' href="#">GoForUmrah.com</a></p>
                    </div>
                    <div className='car-dashboard__content-form car-dashboard__content-form--column'>
                      <h3 className='car-dashboard__content-title-heading'>First let’s sort the basics</h3>
                      <div className="car-dashboard__step-card row">
                        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12'>
                          {/* Check if company data is available make disable */}
                          {!companyData
                            ? <Link href={"/business/car/registration/company"}>
                              <div className="car-dashboard__step-card--page">
                                <div className="car-dashboard__step-card--left">
                                  <BlurPlaceholderImage className='' alt='image' src={iconCompany} width={40} height={40} />
                                  <p className='car-dashboard__step-card--title'>Add Company Details</p>
                                </div>
                                <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                              </div>
                            </Link>
                            : <div className="car-dashboard__step-card--page">
                              <div className="car-dashboard__step-card--left">
                                <BlurPlaceholderImage className="" alt="image" src={iconCheck} width={40} height={40} />
                                <p className="car-dashboard__step-card--title">Add Company Details</p>
                              </div>
                              <BlurPlaceholderImage className="car-dashboard__step-card--link" alt="image" src={iconRight} width={24} height={24} />
                            </div>
                          }
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12'>
                          {/* Check if location data is available make disable */}
                          {!locationData
                            ? <Link href={"/business/car/registration/location"}>
                              <div className="car-dashboard__step-card--page">
                                <div className="car-dashboard__step-card--left">
                                  <BlurPlaceholderImage className='' alt='image' src={iconMap} width={40} height={40} />
                                  <p className='car-dashboard__step-card--title'>Add location</p>
                                </div>
                                <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                              </div>
                            </Link>
                            : <div className="car-dashboard__step-card--page">
                              <div className="car-dashboard__step-card--left">
                                <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={40} height={40} />
                                <p className='car-dashboard__step-card--title'>Add location</p>
                              </div>
                              <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                            </div>
                          }
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12'>
                          {/* Check if fleet data is available make disable */}
                          {!fleetData
                            ? <Link href={"/business/car/registration/fleet"}>
                              <div className="car-dashboard__step-card--page">
                                <div className="car-dashboard__step-card--left">
                                  <BlurPlaceholderImage className='' alt='image' src={iconCar} width={40} height={40} />
                                  <p className='car-dashboard__step-card--title'>Add fleet</p>
                                </div>
                                <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                              </div>
                            </Link>
                            : <div className="car-dashboard__step-card--page">
                              <div className="car-dashboard__step-card--left">
                                <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={40} height={40} />
                                <p className='car-dashboard__step-card--title'>Add fleet</p>
                              </div>
                              <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                            </div>
                          }
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

export default carDashboard

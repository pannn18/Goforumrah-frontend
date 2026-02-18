import Layout from '@/components/layout'
import React from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import iconCompany from 'assets/images/icon_company-detail.svg'
import iconRight from 'assets/images/icon_right.svg'
import Link from 'next/link';
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconUpload from 'assets/images/icon_upload.svg'


const setPolicies = () => {
  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <header>
        <div className="car-dashboard__header">
          <div className="container car-dashboard__content-header">
            <Link href={"/business/car/setup"}>
              <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
            </Link>
            <h4 className='car-dashboard__content-title-heading'>Set your policies</h4>
          </div>
        </div>
      </header>
      <div className='car-finishing'>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div className='car-dashboard__content-container'>
                <form>
                  <div className='car-dashboard__content-form car-dashboard__content-form--column'>
                    <div className="car-dashboard__step-card row">
                      <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                        <Link href={'policies/company'} className="car-dashboard__step-card--page">
                          <div className="car-dashboard__step-card--left">
                            <BlurPlaceholderImage className='' alt='image' src={iconUpload} width={40} height={40} />
                            <p className='car-dashboard__step-card--title'>Company Details</p>
                          </div>
                          <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                        </Link>
                      </div>
                      <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                        <Link href={'policies/insurance'} className="car-dashboard__step-card--page">
                          <div className="car-dashboard__step-card--left">
                            <BlurPlaceholderImage className='' alt='image' src={iconCompany} width={40} height={40} />
                            <p className='car-dashboard__step-card--title'>Insurance Document</p>
                          </div>
                          <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                        </Link>
                      </div>
                      <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                        <Link href={'policies/individual-identification'} className="car-dashboard__step-card--page">
                          <div className="car-dashboard__step-card--left">
                            <BlurPlaceholderImage className='' alt='image' src={iconCompany} width={40} height={40} />
                            <p className='car-dashboard__step-card--title'>Individual Identification Document</p>
                          </div>
                          <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                        </Link>
                      </div>
                      <div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
                        <Link href={'policies/company-identification'} className="car-dashboard__step-card--page">
                          <div className="car-dashboard__step-card--left">
                            <BlurPlaceholderImage className='' alt='image' src={iconCompany} width={40} height={40} />
                            <p className='car-dashboard__step-card--title'>Company Identification Details</p>
                          </div>
                          <BlurPlaceholderImage className='car-dashboard__step-card--link' alt='image' src={iconRight} width={24} height={24} />
                        </Link>
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

export default setPolicies

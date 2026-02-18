import Layout from '@/components/layout'
import React from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import iconCheck from 'assets/images/icon_check_soft.svg'
import iconBuild from 'assets/images/icon_build.svg'
import iconScale from 'assets/images/icon_scale.svg'
import iconRight from 'assets/images/arrow-circle-right.svg'
import Link from 'next/link';

const carFinishing = () => {
  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <div className='car-finishing'>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div className='car-finishing__content-container'>
                <form>
                  <div className='car-finishing__content-form car-finishing__content-form--column-center'>
                    <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                    <h3 className="car-finishing__content-title-heading">Congratulation !</h3>
                    <p className='car-finishing__content-caption car-finishing__content-caption--center'>Your registration has been received. Right now, let's get ready. Follow the instructions on the right and you're on your way to going live on GoForUmrah.com</p>
                  </div>
                  <div className="car-finishing__banner">
                    <div className="car-finishing__content-banner">
                      <div className="car-finishing__banner-content">
                        <BlurPlaceholderImage className='' alt='image' src={iconBuild} width={56} height={56} />
                        <div className="car-finishing__content-text--banner">
                          <h5 className="car-finishing__content-title">Allocate you fleet</h5>
                          <p className="car-finishing__content-caption">Decide how many cars you want to allocate in this website</p>
                        </div>
                      </div>
                      <button className='add-fleet__button-car'>
                        <Link href={'/business/car/setup/fleet'} className="car-finishing__button-caption">Setup Allocate</Link>
                        <BlurPlaceholderImage className='' alt='image' src={iconRight} width={24} height={24} />
                      </button>
                    </div>
                  </div>
                  <div className="car-finishing__banner">
                    <div className="car-finishing__content-banner">
                      <div className="car-finishing__banner-content">
                        <BlurPlaceholderImage className='' alt='image' src={iconBuild} width={56} height={56} />
                        <div className="car-finishing__content-text--banner">
                          <h5 className="car-finishing__content-title">Getting your pricing</h5>
                          <p className="car-finishing__content-caption">Now you can set you pricing - this is might be adding length of keep discount or adding seasonal price</p>
                        </div>
                      </div>
                      <button className='add-fleet__button-car'>
                        <Link href={'/business/car/setup/pricing'} className="car-finishing__button-caption">Setup pricing</Link>
                        <BlurPlaceholderImage className='' alt='image' src={iconRight} width={24} height={24} />
                      </button>
                    </div>
                  </div>
                  <div className="car-finishing__banner">
                    <div className="car-finishing__content-banner">
                      <div className="car-finishing__banner-content">
                        <BlurPlaceholderImage className='' alt='image' src={iconScale} width={56} height={56} />
                        <div className="car-finishing__content-text--banner">
                          <h5 className="car-finishing__content-title">Set your policies</h5>
                          <p className="car-finishing__content-caption">Please upload all document supporting your registration. Below you can see the status of each document</p>
                        </div>
                      </div>
                      <button className='add-fleet__button-car'>
                        <Link href={'/business/car/setup/policies'} className="car-finishing__button-caption">Upload document</Link>
                        <BlurPlaceholderImage className='' alt='image' src={iconRight} width={24} height={24} />
                      </button>
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

export default carFinishing
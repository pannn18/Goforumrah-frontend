import Layout from '@/components/layout'
import React from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import hotelImage from '@/assets/images/icon_hotel.svg'
import Link from 'next/link'

const Empty = () => {
  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <div className="hotel-dashboard hotel-dashboard--vertical-center">
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div className='hotel-dashboard__empty-box'>
                <BlurPlaceholderImage className='hotel-dashboard__empty-icon' alt='image' src={hotelImage} width={200} height={200} />
                <h3 className='hotel-dashboard__empty-title'>No hotels have been entered</h3>
                <p className='hotel-dashboard__empty-caption'>
                  There are still no properties listed, you can enter them below and share your properties
                </p>
                <Link href="/business/hotel/registration" className="btn goform-button goform-button--fill-green hotel-dashboard__empty-button">List your property</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Empty

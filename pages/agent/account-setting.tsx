import React from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'

const AccountSetting = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <div className="account-setting">
        <HotelTopNav />
        <div className="container">
          <div className="hotel-details__header">            
            <div className="hotel-details__content">
              <SettingContent />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const HotelTopNav = () => {
  return (
    <div className="account-setting__nav">
      <div className="container">
        <h3>Account Setting</h3>
        <div className="account-setting__nav-menu">
          <button className="account-setting__nav-item active">General</button>
          <button className="account-setting__nav-item">Notification</button>
          <button className="account-setting__nav-item">Users</button>
        </div>
      </div>
    </div>
  )
}

const SettingContent = () => {
  return(
    <div className="account-setting__content row">
      <div className="account-setting__content-form">
        <div className="account-setting__content-wrapper">
          <div className="account-setting__content-text">
            <p className="account-setting__title-caption-bold">Your Markup</p>
            <p>We will mark up our price by this percent for informational purpose or for you to show to clients without revealing the orginal price. turn off this feature if you want to not use this feature</p>
          </div>
          <div className='company-detail__content-label'>
            <label htmlFor="VATNumber" className="form-label goform-label">Percentage</label>
            <input type="text" placeholder='0' className="form-select goform-select goform-select--acc-setting" id="vatNumber" aria-describedby="vatNumberHelp"/>
          </div>
        </div>
        <div className="add-location__content-radio">
          <div className="add-location__radio-button">
            <div className='goform-switches hotel-registration__poli-switch'>
              <input className='goform-switches__check' type="checkbox" id="checkone" />
              <label htmlFor="checkone">
                <span></span>
                <span></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="account-setting__content-form">
        <div className="account-setting__content-wrapper--emails">
          <div className="account-setting__content-text">
            <p className="account-setting__title-caption-bold">Transaction emails</p>
            <p>Turn on automatic invoice generation and e-mailing after creating order</p>
          </div>
          <div className='company-detail__content-label'>
            <label htmlFor="VATNumber" className="form-label goform-label">Email Address</label>
            <input type="text" placeholder='Enter your email address' className="form-control form-control--acc goform-input" id="vatNumber" aria-describedby="vatNumberHelp"/>
          </div>
        </div>
        <div className="add-location__content-radio">
          <div className="add-location__radio-button">
            <div className='goform-switches hotel-registration__poli-switch'>
              <input className='goform-switches__check' type="checkbox" id="checktwo" />
              <label htmlFor="checktwo">
                <span></span>
                <span></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSetting
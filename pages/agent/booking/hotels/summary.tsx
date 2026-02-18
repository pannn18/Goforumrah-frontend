import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'

const HotelBookingSummary = () => {
  return (
    <div className="booking-hotel__summary">
      <div className="booking-hotel__summary-title">Booking Details</div>
      <div className="booking-hotel__summary-preview">
        <BlurPlaceholderImage className="booking-hotel__summary-preview-image" src={Images.Placeholder} alt="Choosed Hotel" width={92} height={92} />
        <div className="booking-hotel__summary-preview-content">
          <div className="booking-hotel__summary-preview-content-title">Pullman ZamZam Makkah </div>
          <div className="booking-hotel__summary-preview-content-desc">1x Twin Room (Standard)</div>
          <div className="booking-hotel__summary-preview-content-box">
            <div className="booking-hotel__summary-preview-content-box">
              <SVGIcon src={Icons.Moon} width={16} height={16} />
              <div>2 nights</div>
            </div>
            <div className="booking-hotel__summary-preview-content-dot"></div>
            <div className="booking-hotel__summary-preview-content-box">
              <SVGIcon src={Icons.Users} width={16} height={16} />
              <div>2 guest</div>
            </div>
          </div>
        </div>
      </div>
      <div className="booking-hotel__summary-separator"></div>
      <div className="booking-hotel__summary-time">
        <div className="booking-hotel__summary-time-type">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} />
          Check-in Time :
        </div>
        <div className="booking-hotel__summary-time-date">Thu, 29 Sept 2022</div>
      </div>
      <div className="booking-hotel__summary-time">
        <div className="booking-hotel__summary-time-type">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} />
          Check-out Time :
        </div>
        <div className="booking-hotel__summary-time-date">Thu, 1 Oct 2022</div>
      </div>
      <div className="booking-hotel__summary-separator"></div>
      <div className="booking-hotel__summary-total">
        <div className="booking-hotel__summary-total-title">Total</div>
        <div className="booking-hotel__summary-total-price">
          <div className="booking-hotel__summary-total-price--text">$ 2,350.00</div>
          <a href="#" className="booking-hotel__summary-total-price--link">See pricing details</a>
        </div>
      </div>
    </div>
  )
}

export default HotelBookingSummary
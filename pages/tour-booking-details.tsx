import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Link from 'next/link'

const TourDetailBookingSummary = () => {
  return (
    <div className="tour-booking-details__summary">
      <div className="tour-booking-details__summary-title">Booking Details</div>
       <div className="tour-booking-details__ticket-block">
            <label className="tour-booking-details__ticket-block" htmlFor="tour-package">Choose Package</label>
            <select name="tour-plan" id="tour-plan" placeholder="Select your plan">
              <option value="asia">Plan A</option>
              <option value="europe">Plan B</option>
              <option value="rusia">Plan C</option>
            </select>
          </div>
          <div className="tour-booking-details__ticket-block">
            <label htmlFor="payment-expiryDate">Expiry Date</label>
            <div className="tour-booking-details__payment-input">
              <input type="text" name="payment-expiryDate" id="payment-expiryDate" placeholder="MM / DD / YYYY" />
              <SVGIcon className="tour-booking-details__payment-input--icon" src={Icons.Calendar} width={20} height={20} />
            </div>
          </div>
          <div className="tour-booking-details__ticket-block">
            <label htmlFor="contact-ticket">How many ticket ?</label>
            <div className="tour-booking-details__ticket-wrapper">
              <div className="tour-booking-details__ticket-adult">Adult (Age 1-80)</div>
              <div className="tour-booking-details__ticket-amount">
                <Link href="#" className="tour-booking-details__ticket-amount-btn-gray">
                  <SVGIcon src={Icons.Minus} width={16} height={16} />
                </Link>
                <div className="tour-booking-details__ticket-amount">1</div>
                <Link href="#" className="tour-booking-details__ticket-amount-btn-green">
                  <SVGIcon src={Icons.Plus} width={16} height={16} />
                </Link>
              </div>
            </div>
          </div>
          <div className="tour-booking-details__summary-separator"></div>
          <div className="tour-booking-details__summary-total">
            <div className="tour-booking-details__summary-total-title">Total</div>
            <div className="tour-booking-details__summary-total-price">
            <div className="tour-booking-details__summary-total-price--text">$ 305.00</div>
          </div>
          </div>
          <Link href="/booking/tour-package" className="btn btn-success tour-booking-details__summary-button">Book</Link>
    </div>
  )
}



export default TourDetailBookingSummary
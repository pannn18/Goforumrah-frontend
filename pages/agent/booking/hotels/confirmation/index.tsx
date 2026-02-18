import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'

const BookingConfirmation = () => {
  return (
    <div className="container">
      <div className="booking-hotel__complete">
        <div className="booking-hotel__complete-top">
          <div className="booking-hotel__complete-top-header">
            <div className="booking-hotel__complete-top-image">
              <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="booking-hotel__complete-top-title">
              <p className="booking-hotel__complete-top-title--name">Thanks, John!</p>
              <h4>Your booking is confirmed.</h4>
            </div>
          </div>
          <div className="booking-hotel__complete-top-buttons">
            <button className="btn btn-lg btn-outline-success">Contact Hotel</button>
            <button className="btn btn-lg btn-success">
              <SVGIcon src={Icons.Printer} width={20} height={20} />
              Contact Hotel</button>
          </div>
        </div>        
      </div>
    </div>
  )
}



export default BookingConfirmation
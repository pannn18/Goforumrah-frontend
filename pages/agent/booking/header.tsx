import React, { useState } from 'react'
import { Icons } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'

interface IProps {
  current: 'details' | 'payment' | 'confirmation'
  handlePreviousStep: () => void
}

const BookingHeader = (props: IProps) => {
  return (
    <div className="booking-hotel__header">
      <div className="container">
        <div className="booking-hotel__header-wrapper">
          <a href="#" className="booking-hotel__header-title">
            <div className="booking-hotel__header-title-button">
              <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
            </div>
            <h4>Complete your booking</h4>
          </a>
          <div className="booking-hotel__header-stepper">
            <div className={`booking-hotel__header-stepper-item ${props.current === 'details' ? 'current' : 'done'}`}>
              <div className="booking-hotel__header-stepper-number">1</div>
              Booking Details
            </div>
            <div className={`booking-hotel__header-stepper-item ${props.current === 'payment' ? 'current' : (props.current === 'confirmation' ? 'done' : '')}`}>
              <div className="booking-hotel__header-stepper-number">2</div>
              Payment Details
            </div>
            <div className={`booking-hotel__header-stepper-item ${props.current === 'confirmation' ? 'current' : ''}`}>
              <div className="booking-hotel__header-stepper-number">3</div>
              Completed
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingHeader
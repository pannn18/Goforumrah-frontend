import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import HotelBookingSummary from '@/pages/agent/booking/hotels/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'

interface IProps {
  handleNextStep: () => void
}

const BookingPayment = (props: IProps) => {
  return (
    <>
      <TimerSection />
      <div className="container">
        <div className="booking-hotel__wrapper">
          <form action="#" className="booking-hotel__inner">
            <BannerSection />
            <PaymentOptionSection />
            <PaymentDetailsSection />
            <FooterSection {...props} />
          </form>
          <HotelBookingSummary />
        </div>
      </div>
    </>
  )
}

const TimerSection = () => {
  return (
    <div className="booking-hotel__timer">
      <div className="container">
        <div className="booking-hotel__timer-wrapper">
          <p>Complete our payment in</p>
          <div className="booking-hotel__timer-countdown">
            <div className="booking-hotel__timer-number">00</div>
            <p>:</p>
            <div className="booking-hotel__timer-number">30</div>
            <p>:</p>
            <div className="booking-hotel__timer-number">59</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BannerSection = () => {
  const bannerInfo =
  {
    title: 'Important information',
    description: 'Learn the rules for the country you want to travel to or visit',
    icon: Icons.Info,
    linkText: 'Learn More',
    linkURL: '#'
  }

  return (
    <div className="">
      <BannerInfo {...bannerInfo} />
    </div>
  )
}

const PaymentOptionSection = () => {
  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__card-row">
        <p className="booking-hotel__card-title">Payment Options</p>        
      </div>
      <div className="booking-hotel__payment">
        <div className="booking-hotel__payment-row">
          <label htmlFor="option-1" className="booking-hotel__payment-option form-check">
            <input type="radio" name="payment-option" id="option-1" className='form-check-input' />
            <SVGIcon src={Icons.PaymentMastercard} width={56} height={32} />          
            <div>
              <p className="booking-hotel__payment-option-card">1234 **** **** ****</p>
              <p className="booking-hotel__payment-option-owner">Agent Company</p>
            </div>
          </label>
          <label htmlFor="option-2" className="booking-hotel__payment-option form-check">
            <input type="radio" name="payment-option" id="option-2" className='form-check-input' />
            <SVGIcon src={Icons.PaymentVisa} width={56} height={32} />
            <div>
              <p className="booking-hotel__payment-option-card">1234 **** **** ****</p>
              <p className="booking-hotel__payment-option-owner">Agent Company</p>
            </div>
          </label>
        </div>                
      </div>
    </div>
  )
}

const PaymentDetailsSection = () => {
  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__card-row">
        <p className="booking-hotel__card-title">Booking Details</p>        
      </div>
      <div className="booking-hotel__payment-details">
        <div className="booking-hotel__payment-details-header">
          <div className="booking-hotel__payment-details-header-col">
            <p className="booking-hotel__payment-details-header-name">Sheraton Makkah Jabal Al Kaaba Hotel</p>
            <div className="booking-hotel__payment-details-header-location">
              <SVGIcon src={Icons.MapPin} width={20} height={20} />          
              <p>Hotel in Ayjad, Makkah</p>
            </div>
          </div>
          <p className="booking-hotel__payment-details-header-price">$ 350.00</p>
        </div>
        <div className="booking-hotel__payment-details-facilities">
          <div className="booking-hotel__payment-details-facilities-box">
            <SVGIcon src={Icons.Moon} width={20} height={20} />          
            <p>2 nights</p>
          </div>
          <div className="booking-hotel__payment-details-facilities-dots"></div>
          <div className="booking-hotel__payment-details-facilities-box">
            <SVGIcon src={Icons.Users} width={20} height={20} />          
            <p>2 guest</p>
          </div>
          <div className="booking-hotel__payment-details-facilities-dots"></div>
          <div className="booking-hotel__payment-details-facilities-box">
            <SVGIcon src={Icons.Bed} width={20} height={20} />          
            <p>1x Twin Room (Standard)</p>
          </div>
        </div>
        <div className="booking-hotel__payment-details-guest">
          <p className="booking-hotel__payment-details-guest-label">Guest name :</p>
          <p className="booking-hotel__payment-details-guest-name">Mr. John Doe</p>
        </div>
      </div>
    </div>
  )
}

const FooterSection = (props: IProps) => {
  return (
    <div className="booking-hotel__card">
      <div className="booking-hotel__footer">
        <div className="booking-hotel__footer-total">
          <p>Total :</p>
          <div className="booking-hotel__footer-price">
            <h5>$ 2,350.00</h5>
            <a href="#" className="booking-hotel__footer-details">See pricing details</a>
          </div>
        </div>
        <button onClick={props.handleNextStep} type="button" className="btn btn-lg btn-success">Complete Booking</button>
      </div>
    </div>
  )
}


export default BookingPayment
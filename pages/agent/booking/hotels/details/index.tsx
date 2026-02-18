import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import HotelBookingSummary from '@/pages/agent/booking/hotels/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'

interface IProps {
  handleNextStep: () => void
}

const BookingDetails = (props: IProps) => {

  return (
    <div className="container">
      <div className="booking-hotel__wrapper">
        <form action="#" className="booking-hotel__inner">
          <BannerSection />
          <ContactSection />
          <GuestSection />          
          <AggreementSection />
          <FooterSection {...props} />
        </form>
        <HotelBookingSummary />
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

const ContactSection = () => {
  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Contact Details</p>
      <div className="booking-hotel__contact ">
        <div className="booking-hotel__contact-row">
          <div className="booking-hotel__contact-block">
            <label htmlFor="contact-title">Title</label>
            <select name="contact-title" id="contact-title" placeholder="Your title">
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>
          </div>
          <div className="booking-hotel__contact-block w-100">
            <label htmlFor="contact-name">Full name</label>
            <input type="text" name="contact-name" id="contact-name" placeholder="Enter your full name" />
          </div>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="contact-country">Country/Region</label>
          <select name="contact-title" id="contact-title" placeholder="Select your country">
            <option value="asia">Asia</option>
            <option value="europe">Europe</option>
            <option value="rusia">Rusia</option>
          </select>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="contact-phone">Phone Number</label>
          <div className="booking-hotel__contact-combobox">
            <select name="contact-title" id="contact-title" placeholder="Select your country" defaultValue="us">
              <option value="id">+62</option>
              <option value="us">+1</option>
              <option value="arab">+966</option>
            </select>
            <div className="booking-hotel__contact-combobox-separator"></div>
            <input type="number" name="contact-phone" id="contact-phone" placeholder="(888) 888-8888" />
          </div>
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="contact-email">Email Address</label>
          <input type="email" name="contact-email" id="contact-email" placeholder="Enter your email address" />
        </div>
        <div className="booking-hotel__contact-block">
          <label htmlFor="contact-email">Add Note</label>
          <textarea name="note" id="contact-note" cols={30} rows={6} placeholder="Type your taglines here.."></textarea>
        </div>        
      </div>
    </div>
  )
}

const GuestSection = () => {
  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">Guest Details</p>
      <div className="booking-hotel__guest">
        <div className="booking-hotel__guest-toggle">
          <input type="checkbox" name="same-contact" id="same-contact" />
          <p>Same as contact details</p>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block">
            <label htmlFor="guest-title">Title</label>
            <select name="guest-title" id="guest-title" placeholder="Your title">
              <option value="owner">Owner</option>
              <option value="manager">Manager</option>
              <option value="member">Member</option>
            </select>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label htmlFor="guest-name">Full name</label>
            <input type="text" name="guest-name" id="guest-name" placeholder="Enter your full name" />
          </div>
        </div>
      </div>
    </div>
  )
}

const AggreementSection = () => {
  return (
    <div className="booking-hotel__aggreement form-check">
      <input type="checkbox" className="form-check-input" />
      <p>By clicking the button below, you have agreed to our <a href="#" className="booking-hotel__aggreement-link">Privacy Policy</a> and <a href="#" className="booking-hotel__aggreement-link">Terms & Conditions.</a></p>
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
        <button onClick={props.handleNextStep} type="button" className="btn btn-lg btn-success">Continue</button>
      </div>
    </div>
  )
}

export default BookingDetails
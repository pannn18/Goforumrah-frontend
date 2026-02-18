import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import UserLayout from '@/components/user/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import Link from 'next/link'

const BookingCarDetails = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu='booking'>
        <div className="search-hotel">
          <div className="cancelation__list">
            <Utterance />
            <Payment />
            <FlightDetail />
            <FlightHelp />
          </div>
        </div>
      </UserLayout>
      <Footer />
    </Layout>
  )
}

const Utterance = () => {
  return (
    <div className="cancelation__card cancelation__card--row">
      <div className="cancelation__utterance ">
        <div className="cancelation__utterance-icon">
          <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
        </div>
        <div className="cancelation__utterance-subtitile">
          <p className="cancelation__utterance-subtitile">Thanks Michael</p>
          <h4>Your booking in Mercedez-Benz E-Class Estate is Completed </h4>
        </div>
      </div>
    </div>
  )
}

const Payment = () => {
  return (
    <div className="cancelation__card">
      <div className="cancelation__payment">
        <div className="cancelation__payment-flight">
          <div className="cancelation__payment-flight-destination">
            <h4>Mercedez-Benz E-Class Estate</h4>
          </div>
          <p className="cancelation__payment-flight">Order ID : 123456789</p>
        </div>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__payment-total">
          <p className="cancelation__payment-total-text">Total payment</p>
          <h5>$ 305.000</h5>
        </div>
        <Link className="cancelation__payment-link" href="#">Show More</Link>
      </div>
    </div>
  )
}

const FlightDetail = () => {
  return (
    <div className="cancelation__card">
      <p className="cancelation__card-title">Booking details</p>
      <div className="cancelation__car">
        <div className="cancelation__car-summary">
          <BlurPlaceholderImage className="cancelation__car-summary-image" src={Images.Placeholder} alt="Hotel Preview" width={120} height={100} />
          <div className="cancelation__car-summary-text">
            <p className="cancelation__car-summary-name">Mercedez-Benz E-Class Estate</p>
            <div className="cancelation__car-summary-brand">
              <BlurPlaceholderImage className="cancelation__car-summary-brand--image" src={Images.Placeholder} alt="Hotel Preview" width={24} height={24} />
              <p>Green Motion Rental</p>
            </div>
          </div>
          <div className="cancelation__car-summary-confirmation">
            <p className="cancelation__car-summary-id">ID confirm :</p>
            <p className="cancelation__car-summary-number">5167623623</p>
          </div>
        </div>
        <div className="cancelation__car-date">
          <div className="cancelation__car-regis">
            <div className="cancelation__car-regis-imagery">
              <SVGIcon src={Icons.MapPinOutline} className="" width={20} height={20} />
            </div>
            <div>
              <p className="cancelation__car-regis-title">Pickup</p>
              <div className="cancelation__car-regis-content">
                <p className="cancelation__car-regis-date">Sept 28, 2022</p>
                <p className="cancelation__car-regis-time">(06:00)</p>
              </div>
              <p className="cancelation__car-regis-desc">King Abdulaziz International Airport - <br />Jeddah</p>
            </div>
          </div>
          <div className="cancelation__car-regis">
            <div className="cancelation__car-regis-imagery">
              <SVGIcon src={Icons.MapPinOutline} className="" width={20} height={20} />
            </div>
            <div>
              <p className="cancelation__car-regis-title">Dropoff</p>
              <div className="cancelation__car-regis-content">
                <p className="cancelation__car-regis-date">Sept 29, 2022</p>
                <p className="cancelation__car-regis-time">(10:00)</p>
              </div>
              <p className="cancelation__car-regis-desc">King Abdulaziz International Airport - <br />Jeddah</p>
            </div>
          </div>
        </div>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__car-detail">
          <div className="cancelation__car-detail-item">
            <p className="cancelation__car-detail-title">Driver name</p>
            <div className="cancelation__car-detail-content">
              <SVGIcon src={Icons.User} className="" width={20} height={20} />
              <p>Mr. Michael</p>
            </div>
          </div>
          <div className="cancelation__car-detail-item">
            <p className="cancelation__car-detail-title">Duration</p>
            <div className="cancelation__car-detail-content">
              <SVGIcon src={Icons.Sun} className="" width={20} height={20} />
              <p>1 day</p>
            </div>
          </div>
          <div className="cancelation__car-detail-item">
            <p className="cancelation__car-detail-title">Car Specs</p>
            <div className="cancelation__car-detail-content">
              <SVGIcon src={Icons.Car} className="" width={20} height={20} />
              <p>4 door, 5 Seats</p>
            </div>
          </div>
        </div>
        <div className="cancelation__car-facility">
          <p className="cancelation__car-facility">Fasilities</p>
          <div className="cancelation__car-facility-list">
            <div className="cancelation__car-facility-item">
              <SVGIcon src={Icons.Automatic} width={20} height={20} />
              <p>Automatic</p>
            </div>
            <div className="cancelation__car-facility-item">
              <SVGIcon src={Icons.Suitcase} width={20} height={20} />
              <p>4 Small Bags</p>
            </div>
            <div className="cancelation__car-facility-item">
              <SVGIcon src={Icons.GasPump} width={20} height={20} />
              <p>Like for like</p>
            </div>
            <div className="cancelation__car-facility-item">
              <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
              <p>Air Conditioning</p>
            </div>
            <button className="cancelation__car-facility-button btn btn-lg btn-outline-success text-neutral-primary">See more fasilities</button>
          </div>
        </div>
        <div className="cancelation__car-location">
          <p className="cancelation__car-location-title">Location</p>
          <div className="cancelation__car-location-detail">
            <div className="cancelation__car-location-text">
              <p className="cancelation__car-location-name">King Abdulaziz International Airport - Jeddah</p>
              <div className="cancelation__car-location-pin">
                <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                <p>318, Federal circle, JFK Airport, USA 11432</p>
              </div>
            </div>
            <button className="btn btn-lg btn-outline-success text-neutral-primary">Show in maps</button>
          </div>
        </div>
      </div>
      <div className="cancelation__flight">
        <div className="cancelation__flight-information">
          <p className="cancelation__flight-header">Additional Information</p>
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>
      </div>
    </div>
  )
}

const FlightHelp = () => {
  return (
    <div className="cancelation__flight border-0">
      <p className="cancelation__card-title">Need a help ?</p>
      <div className="cancelation__flight-help">
        <Link href="#" className="cancelation__flight-help-card">
          <SVGIcon src={Icons.Help} className="cancelation__flight-help-icon" width={24} height={24} />
          <div className="cancelation__flight-help-text">
            <p className="cancelation__flight-help-title">Help center</p>
            <p className="cancelation__flight-help-subtitle">Find solutions to your problems easily</p>
          </div>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-help-arrow" width={24} height={24} />
        </Link>
        <Link href="#" className="cancelation__flight-help-card">
          <SVGIcon src={Icons.Help} className="cancelation__flight-help-icon" width={24} height={24} />
          <div className="cancelation__flight-help-text">
            <p className="cancelation__flight-help-title">Call Customer care</p>
            <p className="cancelation__flight-help-subtitle">We will always be there for you always</p>
          </div>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-help-arrow" width={24} height={24} />
        </Link>
      </div>
    </div>
  )
}

export default BookingCarDetails
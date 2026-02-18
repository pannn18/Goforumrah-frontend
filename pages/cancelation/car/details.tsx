import React from 'react'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import sheratonHotel from '@/assets/images/hotel_details_imagery_1.png'
import locationMapImage from '@/assets/images/sidemenu_maps.png'


export default function Home() {
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <main className="search-hotel">
          <BookingHeader />
          <div className="container">
            <BreadCrumb />
            <div className="search-hotel__wrapper">
              <MenuBar />
              <div className="cancelation__list">
                <Utterance />
                <TicketCombo />       
                <Payment />       
                <FlightDetail />       
                <FlightManage />
                <FlightHelp />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </Layout>
    </>
  )
}

const BookingHeader = () => {
  return (
    <div className="booking-hotel__header">
      <div className="container">
        <div className="booking-hotel__header-wrapper">
          <Link href="/" className="booking-hotel__header-title">
            <div className="booking-hotel__header-title-button">
              <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
            </div>
            <h4>Complete your booking</h4>
          </Link>
        </div>
      </div>
    </div>
  )
}

const BreadCrumb = () => {
  return (
    <div className="cancelation__breadcrumb">
      <Link className="cancelation__breadcrumb--link" href="#">My Booking</Link>
      <p>/</p>      
      <p className="cancelation__breadcrumb--current">Mercedez-Benz E-Class Estate</p>
    </div>
  )
}

const MenuBar = () => {
  return (
    <div className="manage__menu">
      <div className="manage__menu-profile">
        <div className="manage__menu-avatar">
          <SVGIcon src={Icons.User} width={20} height={20} />
        </div>
        <div className="manage__menu-text">
          <p className="manage__menu-text-name">Abdurrahman</p>
          <p className="manage__menu-text-email">Abdurrahman@gmail.com</p>
        </div>
      </div>
      <div className="manage__menu-list">
        <Link href="#" className="manage__menu-item">
          <SVGIcon src={Icons.User} width={20} height={20} />
          <p>My account</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item active">
          <SVGIcon src={Icons.Box} width={20} height={20} />
          <p>My booking</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon src={Icons.StarOutline} width={20} height={20} />
          <p>My review</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon src={Icons.Setting} width={20} height={20} />
          <p>Account setting</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon src={Icons.Help} width={20} height={20} />
          <p>My review</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon src={Icons.Logout} width={20} height={20} />
          <p>Logout</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
      </div>
    </div>
  )
}

const Utterance = () => {
  return(
    <div className="cancelation__card cancelation__card--row">
      <div className="cancelation__utterance ">  
        <div className="cancelation__utterance-icon">
          <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
        </div>  
        <div className="cancelation__utterance-subtitile">
          <p className="cancelation__utterance-subtitile">Thanks Michael</p>
          <h4>Your booking in Mercedez-Benz E-Class Estate is confirmed  </h4>
        </div>
      </div>
      <div className="cancelation__utterance-action">        
        <button className="btn btn-lg btn-success">
          <SVGIcon src={Icons.Printer} width={20} height={20} />
          Print Confirmation
        </button>
        <button className="btn btn-lg btn-outline-success">
          <SVGIcon src={Icons.Download} width={20} height={20} />
          Save File
        </button>
      </div>
    </div>
  )
}

const TicketCombo = () => {
  return(
    <div className="cancelation__card">
      <p className="cancelation__card-title">Ticket combo</p>
      <div className="cancelation__ticket ">  
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Hotel} width={24} height={24} />        
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Book a hotel</p>
          <h4 className="cancelation__ticket-desc">Get a discount of up to 10% for ordering now</h4>
        </div>
        <button className="btn btn-lg btn-outline-success">Book Now</button>
      </div>      
      <div className="cancelation__ticket ">  
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Flight} width={24} height={24} />        
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Book a flight</p>
          <h4 className="cancelation__ticket-desc">Compare a thausands of flight , all with no hidden fees</h4>
        </div>
        <button className="btn btn-lg btn-outline-success">Book Now</button>
      </div>      
    </div>
  )
}

const Payment = () => {
  return(
    <div className="cancelation__card">
      <div className="cancelation__payment">
        <div className="cancelation__payment-flight">
          <div className="cancelation__payment-flight-destination">
            <h4>Mercedez-Benz E-Class Estate</h4>            
          </div>
          <p className="cancelation__payment-flight">Order ID : 123456789</p>
        </div>
        <hr className="cancelation__card-separator"/>
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
  return(
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
                <p className="cancelation__car-regis-time">(06:00) - (21:00)</p>
              </div>
              <p className="cancelation__car-regis-desc">King Abdulaziz International Airport - Jeddah</p>
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
                <p className="cancelation__car-regis-time">(06:00) - (21:00)</p>
              </div>
              <p className="cancelation__car-regis-desc">King Abdulaziz International Airport - Jeddah</p>
            </div>
          </div>
        </div>
        <hr className="cancelation__card-separator"/>
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

const FlightManage = () => {
  return (
    <div className="cancelation__flight">
      <p className="cancelation__card-title">Manage your Booking</p>
      <div>
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.User} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Edit guest details</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.Pencil} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Change your room</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.SandClock} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Reschedule</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.Door} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Change your room</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>            
        <Link href="/cancelation/car/reason/" className="cancelation__flight-manage cancelation__flight-manage--cancel">
          <SVGIcon src={Icons.Cancel} width={24} height={24} />
          <p>Cancel booking</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
      </div>
    </div>
  )
}

const FlightHelp = () => {
  return (
    <div className="cancelation__flight">
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
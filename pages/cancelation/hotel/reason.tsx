import React from 'react'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import ManageCardList from '@/components/pages/manage/manageCard'
import airlineEmiratesAirways from '@/assets/images/airline_partner_emirates.png'


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
                <Reason />                
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
      <Link className="cancelation__breadcrumb--link" href="#">Sheraton Makkah Jabal Al Kaaba Hotel</Link>
      <p>/</p>      
      <p className="cancelation__breadcrumb--current">Cancel</p>
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

const Reason = () => {
  return(
    <>
      <form action="#" className="cancelation__card cancelation__reason">
        <div className="cancelation__card-header">
          <h5>Reason for cancelling</h5>
          <p className="cancelation__card-subtitle">We can find alternative solution if you need to make changes to your booking</p>
        </div>
        <div>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonFlight">
            <p className="form-check-label">Airlines changing flight schedules</p>
            <input type="radio" name="cancelReason" id="cancelReasonFlight" className="form-check-input cancelation__reason-input" defaultChecked />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonVirus">
            <p className="form-check-label">Due to the Corona virus pandemic</p>
            <input type="radio" name="cancelReason" id="cancelReasonVirus" className="form-check-input cancelation__reason-input" />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonAccidental">
            <p className="form-check-label">Accidentally placed an order</p>
            <input type="radio" name="cancelReason" id="cancelReasonAccidental" className="form-check-input cancelation__reason-input" />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonDate">
            <p className="form-check-label">Wrong date</p>
            <input type="radio" name="cancelReason" id="cancelReasonDate" className="form-check-input cancelation__reason-input" />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonPersonal">
            <p className="form-check-label">Personal reasons</p>
            <input type="radio" name="cancelReason" id="cancelReasonPersonal" className="form-check-input cancelation__reason-input" />
          </label>
        </div>
        <div className="cancelation__card-footer">
          <button className="btn btn-lg btn-outline-success">Keep this booking</button>
          <Link href="/cancelation/hotel/confirm/" className="btn btn-lg btn-success">Continue</Link>
        </div>
      </form>
    </>
  )
}

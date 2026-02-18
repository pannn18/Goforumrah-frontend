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
      <Link className="cancelation__breadcrumb--link" href="#">Cancel booking</Link>
      <p>/</p>      
      <p className="cancelation__breadcrumb--current">Terms & condition</p>
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
        <p className="cancelation__card-title">Refund terms and conditions</p>
        <div className="cancelation__terms">
          <Link className="cancelation__terms-header" data-bs-toggle="collapse" href="#termsAndCondition" role="button" aria-expanded="false" aria-controls="termsAndCondition">
            <p>Airline terms and conditions</p>
            <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
          </Link>
          <div className="cancelation__terms-content collapse show" id="termsAndCondition">
            <div className="cancelation__terms-logo">
              <BlurPlaceholderImage  src={airlineEmiratesAirways} alt="Flight Logo" width={62} height={42} />
            </div>
            <p className="cancelation__terms-text">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>          
        </div>
        <div className="cancelation__terms">
          <Link className="cancelation__terms-header" data-bs-toggle="collapse" href="#termsSecurity" role="button" aria-expanded="false" aria-controls="termsSecurity">
            <p>Security</p>
            <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
          </Link>
          <div className="cancelation__terms-content collapse show" id="termsSecurity">            
            <p className="cancelation__terms-text">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
            </p>
          </div>          
        </div>
        <div className="form-check">
          <input type="checkbox" id="agreeTermsCondition" className="form-check-input" />
          <label htmlFor="agreeTermsCondition" className="form-check-label">Yes, I agree to the terms and conditions</label>
        </div>
        <div className="cancelation__card-footer">
          <Link href="/cancelation/flight/confirm/" className="btn btn-lg btn-success">Continue</Link>
        </div>
      </form>
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import ManageCardList from '@/components/pages/manage/manageCard'
import sheratonHotel from '@/assets/images/hotel_details_imagery_1.png'
import { useRouter } from 'next/router'


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
                <Confirm />                
              </div>
            </div>
          </div>
        </main>
        <ConfirmModal/>
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
      <Link className="cancelation__breadcrumb--link" href="#">Terms & condition</Link>
      <p>/</p>      
      <p className="cancelation__breadcrumb--current">Confirm cancellation</p>
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

const Confirm = () => {
  return(
    <>
      <form action="#" className="cancelation__card cancelation__reason">
        <div className="cancelation__card-header">
          <h5>Confirm cancellation</h5>
          <p className="cancelation__card-subtitle">You are about to cancel your entire booking . Please review the details belom before cancelling</p>
        </div>
        <div className="cancelation__confirm-preview">
          <p className="cancelation__confirm-title">Hotel preview</p>
          <div className="cancelation__confirm-wrapper">
            <div className="cancelation__confirm-preview-image cancelation__confirm-preview-image--hotel">
              <BlurPlaceholderImage  src={sheratonHotel} alt="Flight Logo" width={92} height={92} />
            </div>
            <div className="cancelation__confirm-preview-text">
              <p className="cancelation__confirm-preview-name">Sheraton Makkah Jabal Al Kaaba Hotel</p>
              <p className="cancelation__confirm-preview-detail">1x Twin Room (Standard)</p>
              <div className="cancelation__confirm-preview-information">
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Sun} width={20} height={20} />
                  <p>1 Day</p>
                </div>
                <div className="cancelation__confirm-preview-dot"></div>
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p>2 guest</p>
                </div>
              </div>
            </div>
            <button className="cancelation__confirm-preview-button">Free cancellation</button>            
          </div>
        </div>
        <div className="cancelation__confirm-bill cancelation__confirm-bill--text">
          <p>Your booking</p>
          <p>$ 1127.00</p>
        </div>
        <div className="cancelation__confirm-bill cancelation__confirm-bill--text">
          <p>Cancellation fee</p>
          <p>$ 0</p>
        </div>
        <div className="cancelation__confirm-bill cancelation__confirm-bill--bold">
          <p>You will be charged</p>
          <p>$ 0</p>
        </div>
        <div className="cancelation__card-footer">
          <button type='button' className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Continue</button>
        </div>
      </form>
    </>
  )
}
const ConfirmModal = () => {
  const router = useRouter()

  return(
    <>
      <div className="modal fade" id="confirmationModal" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal">
          <div className="modal-content cancelation__modal-body">
            <div className="cancelation__modal-content">
              <div className="cancelation__modal-image">
                <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
              </div>
              <div className="cancelation__modal-text">
                <h3>Do you want to proceed with the cancellation ?</h3>
                <p className="cancelation__modal-desc">Once a request has been submitted, you cannot change or add it again</p>
              </div>
            </div>
            <div className="cancelation__modal-footer">
              <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
              <a type='button' onClick={() => router.push('/cancelation/hotel/done/')} className="btn btn-lg btn-success cancelation__modal-button" data-bs-dismiss="modal">Request to cancel</a>
            </div>            
          </div>
        </div>
      </div>
    </>
  )
}

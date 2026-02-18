import React from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ManageCardList from '@/components/pages/manage/manageCard'
import SVGIcon from '@/components/elements/icons'


export default function Home() {
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <main className="search-hotel">
          <BookingHeader />
          <div className="container">
            <div className="search-hotel__wrapper">
              <MenuBar />
              <div className="search-hotel__content">
                <div className="search-hotel__content-header">
                  <div className="search-hotel__content-header-title">Showing 500+ best accomodation with best deals</div>
                  <div className="custom-dropdown">
                    <div className="custom-dropdown-toggle">
                      <div>Sort by: Recommended</div>
                      <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                    </div>
                  </div>
                </div>
                <ManageList />
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
        <Link href="/manage-booking" className="manage__menu-item active">
          <SVGIcon src={Icons.Box} width={20} height={20} />
          <p>My booking</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon src={Icons.StarOutline} width={20} height={20} />
          <p>My review</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="/manage-account" className="manage__menu-item">
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

const ManageList = () => {
  const manages = [
    { type: Services.Flights, image: Images.Placeholder, orderId: '123456789', name: { from: 'Jakarta', to: 'Jeddah' }, status: 'check-in', tenant: 'Emirates airlines', desc: { date: 'Sun, 27 Oct 2022', time: '16.30', people: '1 Adult' }, linkURL: '#' },
    { type: Services.Hotel, image: Images.Placeholder, orderId: '123456789', name: { name: 'Sheraton Makkah Jabal Al Kaaba' }, status: 'confirm', location: 'Hotel in Ayjad, Makkah', desc: { date: 'Sun, 27 Oct 2022', people: '2 Guest', duration: '2 Guest' }, linkURL: '#', id_booking: 44 },
    { type: Services.BookTransfer, image: Images.Placeholder, orderId: '123456789', name: { name: 'Mercedez-Benz E-Class Estate' }, status: 'check-in', tenant: 'Green Motion Rental', desc: { date: 'Sun, 27 Oct 2022', vehicle: '1 Car', duration: '1 day' }, linkURL: '#' }
  ]

  return (
    <div className="search-hotel__content-list">
      {manages.map((manages, index) => (
        <ManageCardList {...manages} key={index} />
      ))}
    </div>
  )
}
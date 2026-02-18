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
        <Navbar showCurrency={true} loggedIn={true} />
        <main className="search-hotel">
          <Account />
          <div className="container">
            <div className="search-hotel__wrapper">
              <MenuBar />
              <div className="search-hotel__content">
                
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

const Account = () => {
  return (
    <div className="booking-hotel__header">
      <div className="container">
        <div className="booking-hotel__header-wrapper">
          <Link href="/" className="booking-hotel__header-title">
            <div className="booking-hotel__header-title-button">
              <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
            </div>
            <h4>Back</h4>
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
          <SVGIcon className="manage__menu-item--icon" src={Icons.User} width={20} height={20} />
          <p>My account</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="/manage-booking" className="manage__menu-item ">
          <SVGIcon className="manage__menu-item--icon" src={Icons.Box} width={20} height={20} />
          <p>My booking</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon className="manage__menu-item--icon" src={Icons.StarOutline} width={20} height={20} />
          <p>My review</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="/manage-account" className="manage__menu-item active">
          <SVGIcon className="manage__menu-item--icon" src={Icons.Setting} width={20} height={20} />
          <p>Account setting</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon className="manage__menu-item--icon" src={Icons.Help} width={20} height={20} />
          <p>My review</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage__menu-item">
          <SVGIcon className="manage__menu-item--icon" src={Icons.Logout} width={20} height={20} />
          <p>Logout</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
      </div>
    </div>
  )
}

const ManageList = () => {  

  return (
    <div className="manage-account__wrapper">
      <Link href="/account/personal" className="manage-account__box">
        <SVGIcon src={Icons.User} className="manage-account__box-icon" width={32} height={32} />
        <div className="manage-account__box-text">
          <p className="manage-account__box-title">Personal details</p>
          <p className="manage-account__box-desc">Update your info and find out how it’s used</p>
        </div>
      </Link>
      <Link href="/account/payment" className="manage-account__box">
        <SVGIcon src={Icons.Receipt} className="manage-account__box-icon" width={32} height={32} />
        <div className="manage-account__box-text">
          <p className="manage-account__box-title">Payment details</p>
          <p className="manage-account__box-desc">Securely add or remove payment method</p>
        </div>
      </Link>
      <Link href="/account/security" className="manage-account__box">
        <SVGIcon src={Icons.ShieldCheck} className="manage-account__box-icon" width={32} height={32} />
        <div className="manage-account__box-text">
          <p className="manage-account__box-title">Security settings</p>
          <p className="manage-account__box-desc">Make your account more securely </p>
        </div>
      </Link>
      <Link href="/account/email" className="manage-account__box">
        <SVGIcon src={Icons.Mail} className="manage-account__box-icon" width={32} height={32} />
        <div className="manage-account__box-text">
          <p className="manage-account__box-title">Email notifications</p>
          <p className="manage-account__box-desc">Set what your email will receive</p>
        </div>
      </Link>
    </div>
  )
}
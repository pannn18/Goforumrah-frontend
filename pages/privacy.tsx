import React, { useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { CareerPageSearchBar } from '@/components/pages/home/searchBar'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ArticleCard from '@/components/cards/articleCard'
import headerCoverCareer from '@/assets/images/hero_career_cover.png'


const Career = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />

      <main className="privacy-policy">
        <div className="container">
          <PrivacyPolicyBreadcrumb />
          <PrivacyPolicy />
        </div>
      </main>

      <Footer />
    </Layout>
  )
}

const PrivacyPolicy = () => {
  return (
    <div className='privacy'>
      <div className='privacy__header'>
        <div className='privacy__header-text'>
          <h1>Privacy Statement</h1>
          <span>December 18, 2022 06:00 AM</span>
        </div>
        <button type='button' className='btn btn-success'>Print / Save</button>
      </div>
      <p className='privacy__explanation'>
        First things first – your privacy is important to us. That might be the kind of thing all these notices say, but we mean it. You place your trust in us by using Goforumrah.com services and we value that trust. That means we’re committed to protecting and safeguarding your personal data. We act in our customers’ best interest and we are transparent about the processing of your personal data.
        This document (‘this Privacy Statement’ or ‘our Privacy Statement’) describes how we use and process your personal data, provided in a readable and transparent manner. It also tells you what rights you can exercise in relation to your personal data and how you can contact us. Please also read our Cookie Statement, which tells you how Goforumrah.com uses cookies and other similar tracking technologies.
        If you’ve used us before, you know that Goforumrah.com offers online travel-related services through our own websites and mobile apps, as well as other online platforms such as partners’ websites and social media. We’d like to point out that all the information you are about to read, generally applies to not one, not two, but all of these platforms.
        In fact, this single privacy statement applies to any kind of customer information we collect through all of the above platforms or by any other means connected to these platforms (such as when you contact our customer service team by email).
        If you are one of our business partners, make sure to also check out our Privacy Statement for Business Partners to understand how personal data is further processed as part of the business relationship.
        We might amend this Privacy Statement from time to time, so we recommend you visit this page occasionally to make sure you know where you stand. If we make any updates to this Privacy Statement that will impact you significantly, we’ll notify you about the changes before any new activities begin.
      </p>
      <div className='privacy__box'>
        <h4>Terms we use in this Privacy Statement</h4>
        <p>
          'Trip' means the various different travel products and services that can be ordered, acquired, purchased, bought, paid, rented, provided, reserved, combined, or consummated by you from the Trip Provider.

          'Trip Provider' means the provider of accommodation (e.g. hotel, motel, apartment, bed & breakfast, landlord), attractions (e.g. (theme) parks, museums, sightseeing tours), transportation provider (e.g. car rentals, cruises, rail, airport rides, coach tours, transfers), tour operators, travel insurances and any other travel or related product or service as from time to time available for Trip Reservation on the platform.

          'Trip Service' means the online purchase, order, (facilitated) payment or reservation service as offered or enabled by Goforumrah.com in respect of various products and services as from time to time made available by Trip Providers on the platform.

          'Trip Reservation' means the order, purchase, payment, booking or reservation of a Trip.
        </p>
      </div>
      <div className='privacy__box'>
        <h4>What kind of personal data does Goforumrah.com collect?</h4>
        <p>
          We can’t help you book the perfect Trip without information, so when you use our services there are certain things we ask for. This is typically routine information – your name, preferred contact details, the names of the people travelling with you and your payment information. You might also decide to submit additional information related to your upcoming Trip (for example, your anticipated arrival time).
          In addition to this, we also collect information from the computer, phone, tablet or other device you use to access our services. This includes the IP address, the browser you’re using and your language settings. There are also situations in which we receive information about you from others or when we automatically collect other information.
          This is the general overview but if you’d like to know more about the information we collect, we go into more detail below.
        </p>
      </div>
      <div className='privacy__box'>
        <h4>Why does Goforumrah.com collect and use your personal data?</h4>
        <p>
          The main reason we ask you for personal details is to help you organise your online Trip Reservations and ensure you get the best service possible.
          We also use your personal data to contact you about the latest deals, special offers and other products or services we think you might be interested in. There are other uses, too. If you’d like to find out what they are, read on for a more detailed explanation.
        </p>
      </div>
    </div>
  )
}

const PrivacyPolicyBreadcrumb = () => {
  return (
    <section className='privacy__breadcrumb'>
      <div className='container'>
        <div className="privacy__breadcrumb-inner">
          <Link className="privacy__breadcrumb--link" href="/">Home</Link>
          <p>/</p>
          <p className="privacy__breadcrumb--current">Privacy  & Cookies</p>
        </div>
      </div>
    </section>
  )
}

export default Career
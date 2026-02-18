import React from 'react'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import carMarcedesBenz from '@/assets/images/search_transfer_car_image.png'

export default function Home() {
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <main className="search-hotel">
          <BookingHeader />
          <div className="container">
            <div className="search-hotel__wrapper">
              <div className="cancelation__list">                
                <Done />
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
            <h4>Back</h4>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Done = () => {
  return(
    <>
      <div className="cancelation__confirmation">
        <div className="cancelation__confirmation-top">
          <div className="cancelation__confirmation-top-header">
            <div className="cancelation__confirmation-top-image">
              <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="cancelation__confirmation-top-title">
              <div className="cancelation__confirmation-top-tag">Free cancellation</div>
              <h4>Your Car Cancellation was successful</h4>
              <p className="cancelation__confirmation-top-title--name">For information regarding refunds, we will immediately inform you via your email</p>
            </div>
          </div>
          <div className="cancelation__confirmation-top-buttons">
            <Link href="/search/book-transfer/" className="btn btn-lg btn-outline-success">              
              <span>Find another car</span>
            </Link>
            <button className="btn btn-lg btn-success">
              <span>Back to home</span>
            </button>
          </div>
        </div>
        <div className="cancelation__confirmation-separator"></div>        
        <div className="cancelation__confirmation-wrapper">
          <div className="cancelation__confirmation-preview-image cancelation__confirmation-preview-image--hotel">
            <BlurPlaceholderImage  src={carMarcedesBenz} alt="Car Image Preview" width={128} height={100} />
          </div>
          <div className="cancelation__confirmation-preview-text">
            <p className="cancelation__confirmation-preview-name">Mercedez-Benz E-Class Estate</p>
            <div className="cancelation__confirmation-preview-brand">
                <BlurPlaceholderImage className="cancelation__confirmation-preview-logo" src={Images.Placeholder} alt="Car Brand" width={24} height={24} />
                <p className="cancelation__confirmation-preview-detail">Green Motion Rental</p>
              </div>            
            <div className="cancelation__confirmation-preview-information">
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Sun} width={20} height={20} />
                <p>1 Day</p>
              </div>
              <div className="cancelation__confirmation-preview-dot"></div>
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Car} width={20} height={20} />
                <p>4 door, 5 seat</p>
              </div>
            </div>
          </div>
        </div>
        <div className="cancelation__confirmation-separator"></div>
        <div className="cancelation__confirmation-details">
          <div className="cancelation__confirmation-content">
            <div className="cancelation__confirmation-content__info">
              <div className="cancelation__confirmation-content__info-rows">
                <SVGIcon className="cancelation__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="cancelation__confirmation-content__info-text">
                  We’ve sent your confirmation email to
                  <span className="cancelation__confirmation-content__info-text--highlighted"> johnmaulana@gmail.com.</span>
                  <Link href="#" className="cancelation__confirmation-content__info-text--link"> Change email</Link>
                </div>
              </div>
              <div className="cancelation__confirmation-content__info-rows">
                <SVGIcon className="cancelation__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="cancelation__confirmation-content__info-text">
                  <span className="cancelation__confirmation-content__info-text--highlighted">Your booking was succesfully cancelled -</span> You don’t have to do anything else!
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

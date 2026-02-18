import React from 'react'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import airlineEmiratesAirways from '@/assets/images/airline_partner_emirates.png'
import airlineQatarAirways from '@/assets/images/airline_partner_qatar_airways.png'

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

const Confirm = () => {
  return(
    <>
      <form action="#" className="cancelation__card cancelation__reason">
        <div className="cancelation__card-header">
          <h5>Confirm cancellation</h5>
          <p className="cancelation__card-subtitle">You are about to cancel your entire booking . Please review the details belom before cancelling</p>
        </div>
        <div className="cancelation__confirm-preview">
          <p className="cancelation__confirm-title">Flight Preview</p>
          <div className="cancelation__confirm-wrapper">
            <div className="cancelation__confirm-preview-image">
              <BlurPlaceholderImage  src={airlineEmiratesAirways} alt="Flight Logo" width={76} height={54} />
            </div>
            <div className="cancelation__confirm-preview-text">
              <p className="cancelation__confirm-preview-name">Jakarta to Jeddah</p>
              <p className="cancelation__confirm-preview-detail">4 Transit</p>
              <div className="cancelation__confirm-preview-information">
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Sun} width={20} height={20} />
                  <p>2 Day 16 hours</p>
                </div>
                <div className="cancelation__confirm-preview-dot"></div>
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p>1 Adult</p>
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
          <button className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Continue</button>
        </div>
      </form>
    </>
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
              <h4>Your Flight Cancellation was successful</h4>
              <p className="cancelation__confirmation-top-title--name">For information regarding refunds, we will immediately inform you via your email</p>
            </div>
          </div>
          <div className="cancelation__confirmation-top-buttons">
            <Link href="/search/flights/" className="btn btn-lg btn-outline-success">              
              <span>Find another flight</span>
            </Link>
            <button className="btn btn-lg btn-success">
              <span>Back to home</span>
            </button>
          </div>
        </div>
        <div className="cancelation__confirmation-separator"></div>        
        <div className="cancelation__confirmation-item">
          <div className="cancelation__confirmation-item-brand">
            <BlurPlaceholderImage src={airlineEmiratesAirways} alt="Qatar Airways" width={104} height={56} />
          </div>
          <div>
            <h5 className="cancelation__confirmation-item-title">Jakarta (JKTC) - Jeddah (JED)</h5>
            <div className="cancelation__confirmation-item-details">
              <div>Fri, 10 Oct 22</div>
              <div className="cancelation__confirmation-item-details-bullet" />
              <div>14:50</div>
            </div>
          </div>
        </div>     
        <div className="cancelation__confirmation-item">
          <div className="cancelation__confirmation-item-brand">
            <BlurPlaceholderImage src={airlineEmiratesAirways} alt="Qatar Airways" width={104} height={56} />
          </div>
          <div>
            <h5 className="cancelation__confirmation-item-title">Jeddah (JED) - Jakarta (JKTC) </h5>
            <div className="cancelation__confirmation-item-details">
              <div>Fri, 12 Oct 22</div>
              <div className="cancelation__confirmation-item-details-bullet" />
              <div>14:50</div>
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

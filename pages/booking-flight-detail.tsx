import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import UserLayout from '@/components/user/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import airlineEmiratesAirways from '@/assets/images/airline_partner_emirates.png'
import Link from 'next/link'

const BookingFlightDetails = () => {


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
          <h4>Your booking in Jakarta to Jeddah is confirmed</h4>
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
            <h4>Jakarta</h4>
            <div className="cancelation__payment-flight-icon">
              <SVGIcon src={Icons.AirplaneLineMedium} width={165} height={8} />
              <SVGIcon src={Icons.Airplane} width={16} height={16} />
            </div>
            <h4>Jeddah</h4>
          </div>
          <p className="cancelation__payment-flight">Order ID : 123456789</p>
        </div>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__payment-total">
          <p className="cancelation__payment-total-text">Total payment</p>
          <h5>$ 120.000</h5>
        </div>
        <Link className="cancelation__payment-link" href="#">Show More</Link>
      </div>
    </div>
  )
}

const FlightDetail = () => {
  return (
    <div className="cancelation__card">
      <p className="cancelation__card-title">Flight details</p>
      <div className="cancelation__flight">
        <Link className="cancelation__flight-header " data-bs-toggle="collapse" href="#cancelationFlight" role="button" aria-expanded="false" aria-controls="cancelationFlight">
          <p>Multiple airlines</p>
          <SVGIcon src={Icons.ArrowDown} className="" width={20} height={20} />
        </Link>
        <div className="cancelation__flight-summary">
          <div className="cancelation__flight-summary-logo">
            <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={69} height={48} />
          </div>
          <div className="cancelation__flight-summary-content">
            <div className="cancelation__flight-summary-schedule">
              <h4>16.30</h4>
              <p className="cancelation__flight-summaryschedule--sub">SUB</p>
            </div>
            <div className="cancelation__flight-summary-duration">
              <p className='cancelation__flight-summary-duration--text'>2 Days 12 Hours</p>
              <div className='cancelation__flight-summary-duration--icon'>
                <SVGIcon src={Icons.AirplaneLineLong} width={347} height={8} />
                <SVGIcon src={Icons.Airplane} width={16} height={16} />
              </div>
              <p className='cancelation__flight-summary-duration--text'>2 Transit</p>
            </div>
            <div className="cancelation__flight-summaryschedule">
              <h4>17.30</h4>
              <p className="cancelation__flight-summaryschedule--sub">JED</p>
            </div>
          </div>
        </div>
        <hr className="cancelation__card-separator" />
        <ul className="cancelation__flight-inner cancelation__flight-inner--order" id="cancelationFlight">
          <li className="cancelation__flight-details">
            <div className="cancelation__flight-details--order">
              <div className="cancelation__flight-details-title--order">
                <p className="cancelation__flight-details-title--time">17:10</p>
                <p className="cancelation__flight-details-title--date">5 Oct</p>
              </div>
              <div className="cancelation__flight-details-content--order">
                <div className="cancelation__flight-details-airport">
                  <p className="cancelation__flight-details-airport--name">Soekarno Hatta (CGK)</p>
                  <p className="cancelation__flight-details-airport--terminal">Terminal 3 International</p>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__flight-details-amenities">
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                    <p>Baggage: 35 kg, without cabin</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                    <p>Meals</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                    <p>Free Wifi</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">3+</div>
                </div>
              </div>
            </div>
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">GA-980</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </li>
          <li className="cancelation__flight-details">
            <div className="cancelation__flight-details--order">
              <div className="cancelation__flight-details-title--order">
                <p className="cancelation__flight-details-title--time">22:55</p>
                <p className="cancelation__flight-details-title--date">5 Oct</p>
              </div>
              <div className="cancelation__flight-details-content--order cancelation__flight-details-content--order-layover">
                <div className="cancelation__flight-details-airport">
                  <p className="cancelation__flight-details-airport--name">Abu Dhabi International Apt (AUH)</p>
                  <p className="cancelation__flight-details-airport--terminal">Terminal 1 </p>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__flight-details-amenities">
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                    <p>Baggage: 35 kg, without cabin</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                    <p>Meals</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                    <p>Free Wifi</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">3+</div>
                </div>
                <div className="cancelation__flight-details-amenities--layover">
                  <SVGIcon src={Icons.CircleTime} width={20} height={20} color='#9E9E9E'/>
                  <p>Layover 6h 25m</p>
                </div>
              </div>
            </div>
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">EY-475</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </li>
          <li className="cancelation__flight-details">
            <div className="cancelation__flight-details--order">
              <div className="cancelation__flight-details-title--order">
                <p className="cancelation__flight-details-title--time">01:30</p>
                <p className="cancelation__flight-details-title--date">6 Oct</p>
              </div>
              <div className="cancelation__flight-details-content--order">
                <div className="cancelation__flight-details-airport">
                  <p className="cancelation__flight-details-airport--name">Abu Dhabi International Apt (AUH)</p>
                  <p className="cancelation__flight-details-airport--terminal">Terminal 3 </p>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__flight-details-amenities">
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                    <p>Baggage: 35 kg, without cabin</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                    <p>Meals</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                    <p>Free Wifi</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">3+</div>
                </div>
              </div>
            </div>
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">EY-475</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </li>
          <li className="cancelation__flight-details">
            <div className="cancelation__flight-details--order">
              <div className="cancelation__flight-details-title--order">
                <p className="cancelation__flight-details-title--time">01:30</p>
                <p className="cancelation__flight-details-title--date">6 Oct</p>
              </div>
              <div className="cancelation__flight-details-content--order cancelation__flight-details-content--order-last">
                <div className="cancelation__flight-details-airport">
                  <p className="cancelation__flight-details-airport--name">Jeddah (JED)</p>
                  <p className="cancelation__flight-details-airport--terminal">Terminal 1 </p>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__flight-details-amenities">
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                    <p>Baggage: 35 kg, without cabin</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                    <p>Meals</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">
                    <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                    <p>Free Wifi</p>
                  </div>
                  <div className="cancelation__flight-details-amenities--item">3+</div>
                </div>
              </div>
            </div>
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">EY-475</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div className="cancelation__flight">
        <p className="cancelation__flight-header">Passenger</p>
        <Link className="cancelation__flight-passenger-header" data-bs-toggle="collapse" href="#cancelationPassenger" role="button" aria-expanded="false" aria-controls="cancelationPassenger">
          <div className="cancelation__flight-passenger-desc">
            <p className="cancelation__flight-passenger-desc--number">1.</p>
            <div className="cancelation__flight-passenger-desc--icon">
              <SVGIcon src={Icons.User} width={20} height={20} />
            </div>
            <p className="cancelation__flight-passenger-desc--name">Mr  Jonathan</p>
            <button className="btn btn-sm btn-outline-info cancelation__flight-passenger-desc--button">Adult</button>
          </div>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </Link>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__flight-passenger-detail" id="cancelationPassenger">
          <div className="cancelation__flight-passenger-benefit">
            <SVGIcon src={Icons.Suitcase} width={20} height={20} />
            <div className="cancelation__flight-passenger-benefit--text">
              <p>Baggage : 35 kg</p>
              <p className="cancelation__flight-passenger-benefit--desc"> Without cabin</p>
            </div>
          </div>
          <div className="cancelation__flight-passenger-benefit">
            <SVGIcon src={Icons.Protection} width={20} height={20} />
            <div className="cancelation__flight-passenger-benefit--text">
              <p>Extra protection</p>
            </div>
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


export default BookingFlightDetails
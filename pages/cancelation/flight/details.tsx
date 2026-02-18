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
      <p className="cancelation__breadcrumb--current">Sheraton Makkah Jabal Al Kaaba Hotel</p>
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
          <h4>Your booking in Jakarta to Jeddah is confirmed</h4>
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
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Car} width={24} height={24} />        
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Rent a car</p>
          <h4 className="cancelation__ticket-desc">Get a discount of up to 10% for ordering now</h4>
        </div>
        <button className="btn btn-lg btn-outline-success">Book Now</button>
      </div>      
      <div className="cancelation__ticket ">  
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Hotel} width={24} height={24} />        
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Book a hotel</p>
          <h4 className="cancelation__ticket-desc">Book your hotel and enjoy your trip, get 15% discount on booking now</h4>
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
            <h4>Jakarta</h4>
            <div className="cancelation__payment-flight-icon">
              <SVGIcon src={Icons.AirplaneLineMedium} width={165} height={8} />              
              <SVGIcon src={Icons.Airplane} width={16} height={16} />
            </div>
            <h4>Jeddah</h4>
          </div>
          <p className="cancelation__payment-flight">Order ID : 123456789</p>
        </div>
        <hr className="cancelation__card-separator"/>
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
  return(
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
        <hr className="cancelation__card-separator"/>
        <div className="cancelation__flight-inner" id="cancelationFlight">
          <div className="cancelation__flight-details">
            <div className="cancelation__flight-details-title">
              <p className="cancelation__flight-details-title--time">17:10</p>
              <p className="cancelation__flight-details-title--date">5 Oct</p>
            </div>
            <div className="cancelation__flight-details-content">
              <div className="cancelation__flight-details-airport">
                <p className="cancelation__flight-details-airport--name">Soekarno Hatta (CGK)</p>
                <p className="cancelation__flight-details-airport--terminal">Terminal 3 International</p>
              </div>
              <hr className="cancelation__card-separator"/>
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
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />            
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">GA-980</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </div>
          <div className="cancelation__flight-details">
            <div className="cancelation__flight-details-title">
              <p className="cancelation__flight-details-title--time">22:55</p>
              <p className="cancelation__flight-details-title--date">5 Oct</p>
            </div>
            <div className="cancelation__flight-details-content">
              <div className="cancelation__flight-details-airport">
                <p className="cancelation__flight-details-airport--name">Abu Dhabi International Apt (AUH)</p>
                <p className="cancelation__flight-details-airport--terminal">Terminal 1 </p>
              </div>
              <hr className="cancelation__card-separator"/>
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
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />            
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">EY-475</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </div>
          <div className="cancelation__flight-details-layover">
            <SVGIcon src={Icons.CircleTime} width={20} height={20} />
            <p>Layover 6h 25m</p>
          </div>
          <div className="cancelation__flight-details">
            <div className="cancelation__flight-details-title">
              <p className="cancelation__flight-details-title--time">01:30</p>
              <p className="cancelation__flight-details-title--date">6 Oct</p>
            </div>
            <div className="cancelation__flight-details-content">
              <div className="cancelation__flight-details-airport">
                <p className="cancelation__flight-details-airport--name">Abu Dhabi International Apt (AUH)</p>
                <p className="cancelation__flight-details-airport--terminal">Terminal 3 </p>
              </div>
              <hr className="cancelation__card-separator"/>
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
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />            
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">EY-475</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </div>
          <div className="cancelation__flight-details">
            <div className="cancelation__flight-details-title">
              <p className="cancelation__flight-details-title--time">01:30</p>
              <p className="cancelation__flight-details-title--date">6 Oct</p>
            </div>
            <div className="cancelation__flight-details-content">
              <div className="cancelation__flight-details-airport">
                <p className="cancelation__flight-details-airport--name">Jeddah (JED)</p>
                <p className="cancelation__flight-details-airport--terminal">Terminal 1 </p>
              </div>
              <hr className="cancelation__card-separator"/>
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
            <div className="cancelation__flight-details-plane">
              <div className="cancelation__flight-details-logo">
                <BlurPlaceholderImage className="" src={airlineEmiratesAirways} alt="Flight Logo" width={35} height={24} />            
              </div>
              <div>
                <p className="cancelation__flight-details-plane--type">EY-475</p>
                <p className="cancelation__flight-details-plane--class">Economy</p>
              </div>
            </div>
          </div>
        </div>
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
            <button className="btn btn-sm btn-outline-info cancelation__flight-passenger-desc--button">Book Now</button>
          </div>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </Link>
        <hr className="cancelation__card-separator"/>
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
        <Link href="/cancelation/flight/reason/" className="cancelation__flight-manage cancelation__flight-manage--cancel">
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
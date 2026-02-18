import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import carImagery1 from '@/assets/images/car_details_image_1.png'
import carImagery2 from '@/assets/images/car_details_image_2.png'


const CarDetails = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <div className="hotel-details">
        <CarTopNav />
        <div className="container">
          <div className="hotel-details__header">
            <CarBreadCrumb/>            
            <div className="hotel-details__content">
              <CarDetailBrand />
              <CarDetailsImagery />
              <CarDetailsSummary />              
              <CarDetailsPassengerReview />
              <CarDetailsMoreInformation />
              <CarDetailSimilar />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

const CarTopNav = () =>
{
  return(
    <div className="container hotel-details__nav">
      <button className="hotel-details__nav-item active">Details</button>      
      <button className="hotel-details__nav-item">Reviews</button>
      <button className="hotel-details__nav-item">Important Info</button>
    </div>    
  )
}

const CarBreadCrumb = () => {
  return (
    <div className="hotel-details__header-breadcrumb">
      <Link className="hotel-details__header-breadcrumb--link" href="#">Home</Link>
      <p>/</p>
      <Link className="hotel-details__header-breadcrumb--link" href="#">Search Car</Link>
      <p>/</p>
      <p className="hotel-details__header-breadcrumb--current">Mercedez-Benz E-Class Estate</p>
    </div>
  )
}

const CarDetailBrand = () => {
  return(
    <div>
      <div className="hotel-details__brand">
        <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__brand-logo" alt="Trending City" width={60} height={60} />
        <div className="hotel-details__brand-content">
          <h5>Green Motion Rental</h5>
          <div className="hotel-details__brand-rating">
            <SVGIcon src={Icons.Star} width={20} height={20} color="#EECA32" />
            <div className="hotel-details__brand-chips">4.9</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CarDetailsImagery = () =>{
  return(
    <div className="hotel-details__imagery">
      <BlurPlaceholderImage src={carImagery1} alt="Trending City" width={644} height={468} />
      <div className="hotel-details__imagery-src">
        <BlurPlaceholderImage src={carImagery2} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={carImagery2} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={carImagery2} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={carImagery2} alt="Trending City" width={230} height={230} />
      </div>
    </div>
  )
}

const CarDetailsSummary = () =>{
  return(
    <div className="hotel-details__summary">
      <div className="hotel-details__summary-main">
        <div className="hotel-details__summary-item">
          <h3>Mercedez-Benz E-Class Estate</h3>
          <div className="hotel-details__summary-left-stars">
              <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
              <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
              <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
              <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
              <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
          </div>
          <div className="hotel-details__summary-left-location">
            <div className="hotel-details__summary-left-details">
              <SVGIcon src={Icons.Users} width={20} height={20} className="" />
              <p>4 passengers</p>
            </div>
            <div className="hotel-details__summary-left-location--dots"></div>
            <div className="hotel-details__summary-left-details">
              <SVGIcon src={Icons.Users} width={20} height={20} className="" />
              <p>2 baggages</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__summary-item">
          <div className="hotel-details__summary-benefit">
            <SVGIcon src={Icons.MapPinOutline} width={24} height={24} color="#616161" />
            <div className="mb-1">
              <p className="hotel-details__summary-benefit-title">King Abdulaziz International Airport</p>
              <p className="hotel-details__summary-benefit-subtitle">Free Shuttle Bus</p>
            </div>
          </div>
          <div className="hotel-details__summary-benefit">
            <SVGIcon src={Icons.Help} width={24} height={24} color="#616161" />
            <div className="mb-1">
              <p className="hotel-details__summary-benefit-title">Helpful counter staff</p>
              <p className="hotel-details__summary-benefit-subtitle">97% of recent passengers rated our staff 5-star in communication.</p>
            </div>
          </div>
          <div className="hotel-details__summary-benefit">
            <SVGIcon src={Icons.Car} width={24} height={24} color="#616161" />
            <div className="mb-1">
              <p className="hotel-details__summary-benefit-title">Great Driver Communication</p>
              <p className="hotel-details__summary-benefit-subtitle">97% of recent passengers rated our drivers 5-star in communication.</p>
            </div>
          </div>
          
        </div>
        <div className="hotel-details__summary-item">
          <p className="hotel-details__summary-item-title">Facilities</p>
          <div className="hotel-details__desc-facilities">
          <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
            <SVGIcon src={Icons.Seats} width={20} height={20} />
            <p>4 Seats</p>
          </div>          
          <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
            <SVGIcon src={Icons.Door} width={20} height={20} />
            <p>4 Doors</p>
          </div>          
          <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
            <SVGIcon src={Icons.Compas} width={20} height={20} />
            <p>Manual</p>
          </div>          
          <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
            <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
            <p>Air Conditioning</p>
          </div>          
          <button className="hotel-details__desc-facilities-more btn btn-lg btn-outline-success text-neutral-primary">See more fasilities</button>
        </div>
          
        </div>
        <div className="hotel-details__summary-item hotel-details__summary-item--row">          
          <div className="hotel-details__summary-item hotel-details__summary-item--borderless">
            <p className="hotel-details__summary-item-title">Included</p>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Free cancellation up to 48 hours before pick-up</p>
            </div>          
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Theft Protection with $1,336 excess</p>
            </div>          
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Collision Damage Waiver with $1,336 deductible</p>
            </div>                              
          </div>
          <div className="hotel-details__summary-item hotel-details__summary-item--borderless">
            <p className="hotel-details__summary-item-title">Not Included</p>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Entrance ticket to tourist attraction</p>
            </div>          
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Overtime</p>
            </div>          
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Entrance ticket to tourist attraction</p>
            </div>                              
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Usage’s outside the main lease zone</p>
            </div>                              
          </div>
          
        </div>

      </div>
      <div className="hotel-details__sidecontent">
        <div className="hotel-details__sidecontent-details">
          <p className="hotel-details__sidecontent-details-title">Starts from</p>
          <div className="hotel-details__sidecontent-booking">
            <BlurPlaceholderImage className="hotel-details__sidecontent-booking-image" src={Images.Placeholder} alt="Booking Details Preview" width={71} height={38} />
            <div className="hotel-details__sidecontent-booking-desc">
              <p className="hotel-details__sidecontent-booking-tag">Pick-up</p>
              <p className="hotel-details__sidecontent-booking-name">King Abdulaziz International Airport - Jeddah</p>
              <div className="hotel-details__sidecontent-booking-date">
                <p>Fri, 05 Oct 22</p>
                <div className="hotel-details__sidecontent-booking-date--dots"></div>
                <p>10:00</p>
              </div>
            </div>
          </div>
          <div className="hotel-details__sidecontent-details-separator"></div>
          <div className="hotel-details__sidecontent-booking">
            <BlurPlaceholderImage className="hotel-details__sidecontent-booking-image" src={Images.Placeholder} alt="Booking Details Preview" width={71} height={38} />
            <div className="hotel-details__sidecontent-booking-desc">
              <p className="hotel-details__sidecontent-booking-tag">Drop - off</p>
              <p className="hotel-details__sidecontent-booking-name">Makkah Station - Mekkah</p>
              <div className="hotel-details__sidecontent-booking-date">
                <p>Mon, 8 Oct 22</p>
                <div className="hotel-details__sidecontent-booking-date--dots"></div>
                <p>02:40</p>
              </div>
            </div>
          </div>
          <div className="hotel-details__sidecontent-details-separator"></div>
          <div className="hotel-details__sidecontent-price">
            <p className="hotel-details__sidecontent-price-title">Total</p>
            <div className="hotel-details__sidecontent-price-column">
              <h5>$ 305.00</h5>
              <Link href="#" className="hotel-details__sidecontent-price-link">See pricing details</Link>
            </div>
          </div>
          <button className="btn btn-success">Book</button>
        </div>
        <div className="hotel-details__sidecontent-flag">
          <SVGIcon src={Icons.Warning} width={28} height={28} color="#475BCA" />
          <div className="hotel-details__sidecontent-flag-content">
            <p className="hotel-details__sidecontent-flag-header">This car is costing you just $34.28 – a fantastic deal…</p>
            <p className="hotel-details__sidecontent-flag-text">At that time of year, the average small car at London Luton Airport costs $114.58!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const CarDetailsPassengerReview = () =>{  
  return(
    <div className="hotel-details__guest">
      <h4>Passengers Reviews</h4>
      <div className="hotel-details__guest-header">
        <div className="hotel-details__guest-header-rating">
          <div className="hotel-details__guest-header-chips">4.9</div>
          <p className="hotel-details__guest-header-overall">Good</p>
          <div className="hotel-details__guest-header-dots"></div>
          <p>255 reviews</p>          
        </div>
        <select className="hotel-details__guest-header-filter" name="filterSort" id="filterSort">
          <option value="highestRating">Sort : Highest Rating</option>
          <option value="newestRating">Sort : Newest Rating</option>
          <option value="popularRating">Sort : Popular Rating</option>
        </select>
      </div>
      <div className="hotel-details__guest-wrapper"> 
        <div className="hotel-details__guest-summary"> 
          <div className="hotel-details__guest-summary-item"> 
            <p>Value for money </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{width: "92%"}}></div>
              </div>
              <p>4,6</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item"> 
            <p>Condition</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{width: "96%"}}></div>
              </div>
              <p>4,8</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item"> 
            <p>Cleanliness</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{width: "98%"}}></div>
              </div>
              <p>4,9</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item"> 
            <p>Facilities</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{width: "90%"}}></div>
              </div>
              <p>4,5</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item"> 
            <p>Comfort </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{width: "88%"}}></div>
              </div>
              <p>4,6</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item"> 
            <p>Staff </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{width: "98%"}}></div>
              </div>
              <p>4,9</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__guest-content">
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />              
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Jerome Bell</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />              
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Marvin McKinney</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />              
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Darlene Robertson</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />              
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Cameron Williamson</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />              
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Arlene McCoy</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-pagination">
            <div className="pagination">
              <button type="button" className="pagination__button pagination__button--arrow">
                <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
              </button>
              <button type="button" className="pagination__button active">1</button>
              <button type="button" className="pagination__button">2</button>
              <button type="button" className="pagination__button">3</button>
              <button type="button" className="pagination__button">...</button>
              <button type="button" className="pagination__button">12</button>
              <button type="button" className="pagination__button pagination__button--arrow">
                <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
              </button>
            </div>
          </div>
        </div>        
      </div>
    </div>
  )
}

const CarDetailsMoreInformation = () =>{  
  return(
    <div className="hotel-details__information">
      <h4>Important Information</h4>
      <div className="hotel-details__information-wrapper">              
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Requirements</p>
          <div className="hotel-details__information-content-details">            
            <div className="hotel-details__information-content-desc">
              <div>
                <p className="mb-2">When you pick the car up, you'll need:</p>
                <ul className="hotel-details__information-content-list">
                  <li>Passport or national ID card</li>
                  <li>Driving licence</li>
                  <li>Credit or debit card</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Security Deposit</p>
          <div className="hotel-details__information-content-details">            
            <div className="hotel-details__information-content-desc">              
              <ul>
                <li>At pick-up, the main driver will leave a refundable security deposit of <b>US$ 300.00</b> on their credit or debit card.</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Damage Excess</p>
          <div className="hotel-details__information-content-details">            
            <div className="hotel-details__information-content-desc">
              <div>                
                <ul className="hotel-details__information-content-list">
                  <li>If the car’s bodywork was damaged during your rental, you wouldn't pay anything at all towards repairs.</li>
                  <li>
                    This cover is only valid if you stick to the terms of the rental agreement. It doesn't cover other parts of 
                    the car (e.g. windows, wheels, interior or undercarriage), or charges (e.g. for towing or off-road time), 
                    or anything in the car (e.g. child seats, GPS devices or personal belongings).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Fuel Policy</p>
          <div className="hotel-details__information-content-details">            
            <div className="hotel-details__information-content-desc">              
              <ul>
                <li>
                  When you pick your car up, the fuel tank will be full or partly full. 
                  You will leave a deposit to cover the cost of the fuel: the counter staff 
                  will block this money on your credit card. Just before you return your car, 
                  please replace the fuel you’ve used.
                </li>
              </ul>
            </div>
          </div>
        </div>   
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Mileage</p>
          <div className="hotel-details__information-content-details">            
            <div className="hotel-details__information-content-desc">              
              <ul>
                <li>Your rental includes unlimited free kilometre.</li>
              </ul>
            </div>
          </div>
        </div>   
        <Link href="#" className="hotel-details__information-link">Show more information</Link>
      </div>
    </div>
  )
}

const CarDetailSimilar = () => {  
  return (
    <div className="hotel-details__similar">
      <h4>Similar Car</h4>
      <div className="hotel-details__similar-list">
        <div className="hotel-details__similar-card">
          <BlurPlaceholderImage className="hotel-details__similar-card-image" src={Images.Placeholder} alt="Similar Car" width={265} height={169} />
          <div className="hotel-details__similar-card-content">
            <div className="hotel-details__similar-card-text">
              <p className="hotel-details__similar-card-title">Mercedez-Benz E-Class Estate</p>
              <div className="hotel-details__similar-card-location">
                <SVGIcon src={Icons.MapPin} className="hotel-details__similar-card-location--icon" width={20} height={20} />
                <p>Hotel in Ayjad, Makkah</p>
              </div>
              <div className="hotel-details__similar-card-price">
                <p className="hotel-details__similar-card-price--total">$ 350.00</p>
                <p className="hotel-details__similar-card-price--range">/ Day</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__similar-card">
          <BlurPlaceholderImage className="hotel-details__similar-card-image" src={Images.Placeholder} alt="Similar Car" width={265} height={169} />
          <div className="hotel-details__similar-card-content">
            <div className="hotel-details__similar-card-text">
              <p className="hotel-details__similar-card-title">Mercedez-Benz E-Class Estate</p>
              <div className="hotel-details__similar-card-location">
                <SVGIcon src={Icons.MapPin} className="hotel-details__similar-card-location--icon" width={20} height={20} />
                <p>Hotel in Ayjad, Makkah</p>
              </div>
              <div className="hotel-details__similar-card-price">
                <p className="hotel-details__similar-card-price--total">$ 350.00</p>
                <p className="hotel-details__similar-card-price--range">/ Day</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__similar-card">
          <BlurPlaceholderImage className="hotel-details__similar-card-image" src={Images.Placeholder} alt="Similar Car" width={265} height={169} />
          <div className="hotel-details__similar-card-content">
            <div className="hotel-details__similar-card-text">
              <p className="hotel-details__similar-card-title">Mercedez-Benz E-Class Estate</p>
              <div className="hotel-details__similar-card-location">
                <SVGIcon src={Icons.MapPin} className="hotel-details__similar-card-location--icon" width={20} height={20} />
                <p>Hotel in Ayjad, Makkah</p>
              </div>
              <div className="hotel-details__similar-card-price">
                <p className="hotel-details__similar-card-price--total">$ 350.00</p>
                <p className="hotel-details__similar-card-price--range">/ Night</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__similar-card">
          <BlurPlaceholderImage className="hotel-details__similar-card-image" src={Images.Placeholder} alt="Similar Car" width={265} height={169} />
          <div className="hotel-details__similar-card-content">
            <div className="hotel-details__similar-card-text">
              <p className="hotel-details__similar-card-title">Mercedez-Benz E-Class Estate</p>
              <div className="hotel-details__similar-card-location">
                <SVGIcon src={Icons.MapPin} className="hotel-details__similar-card-location--icon" width={20} height={20} />
                <p>Hotel in Ayjad, Makkah</p>
              </div>
              <div className="hotel-details__similar-card-price">
                <p className="hotel-details__similar-card-price--total">$ 350.00</p>
                <p className="hotel-details__similar-card-price--range">/ Night</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails
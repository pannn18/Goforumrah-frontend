import React from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BannerInfo from '@/components/pages/home/bannerInfo'
import { HotelSearchBar } from '@/components/pages/home/searchBar'
import hotelImagery1 from '@/assets/images/hotel_details_imagery_1.png'
import hotelImagery2 from '@/assets/images/hotel_details_imagery_2.png'
import hotelImagery3 from '@/assets/images/hotel_details_imagery_3.png'
import hotelImagery4 from '@/assets/images/hotel_details_imagery_4.png'
import hotelImagery5 from '@/assets/images/hotel_details_imagery_5.png'
import reviewerProfile1 from '@/assets/images/reviewer_profile_1.png'
import reviewerProfile2 from '@/assets/images/reviewer_profile_2.png'
import reviewerProfile3 from '@/assets/images/reviewer_profile_3.png'
import TourBookingSummary from '@/components/pages/booking/tour/summary'
import HotelBookingSummary from '@/components/pages/booking/book-transfer/summary'
import TourDetailBookingSummary from './tour-booking-details'



const TourDetails = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <main className="tour-details">
        <TourTopNav />
        <div className="container">
          <div className="tour-details__header">
            <TourBreadCrumb />
            <TourDetailsImagery />
            <TourDetailsSummary />
            <div className="search-tour-package__sidemenu-separator"></div>
            <div className="tour-details__content">
              <div className="tour-details__inner">
              <TourDetailsDescription />
              <TourDetailsReviews />
              <TourDetailsPlan />
              <div className="search-tour-package__sidemenu-separator"></div>
              <div className="tour-details__tours-plan">
              <TourDetailsPlanA />
              <TourDetailsPlanB />
              <TourDetailsPlanC />
              </div>
              <div className="search-tour-package__sidemenu-separator"></div>
              <TourDetailsFacility />
              <div className="search-tour-package__sidemenu-separator"></div>
              <TourDetailsGuestReview />
              <TourDetailsMoreInformation />
              </div>
            <TourDetailBookingSummary />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  )
}

const TourTopNav = () => {
  return (
    <div className="container tour-details__nav">
      <button className="tour-details__nav-item active">Overview</button>
      <button className="tour-details__nav-item">Location</button>
      <button className="tour-details__nav-item">Room</button>
      <button className="tour-details__nav-item">Facilities</button>
      <button className="tour-details__nav-item">Reviews</button>
      <button className="tour-details__nav-item">More Information</button>
    </div>
  )
}

const TourBreadCrumb = () => {
  return (
    <div className="tour-details__header-breadcrumb">
      <Link className="tour-details__header-breadcrumb--link" href="#">Home</Link>
      <p>/</p>
      <Link className="tour-details__header-breadcrumb--link" href="#">Riyadh, Saudi Arabia</Link>
      <p>/</p>
      <p className="tour-details__header-breadcrumb--current">Saudi Arabia Explore Riyadh, Al Ula and Jeddah</p>
    </div>
  )
}

const TourDetailsImagery = () => {
  return (
    <div className="tour-details__imagery">
      <BlurPlaceholderImage src={hotelImagery1} alt="Trending City" width={644} height={468} />
      <div className="tour-details__imagery-src">
        <BlurPlaceholderImage src={hotelImagery2} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={hotelImagery3} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={hotelImagery4} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={hotelImagery5} alt="Trending City" width={230} height={230} />
      </div>
    </div>
  )
}

const TourDetailsSummary = () => {
  return (
    <div className="tour-details__summary">
      <div className="tour-details__summary-left">
        <h3>Saudi Arabia Explore Riyadh, Al Ula and Jeddah</h3>
        <div className="tour-details__summary-left-stars">
          <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
        </div>
        <div className="tour-details__summary-left-location">
          <SVGIcon src={Icons.MapPin} width={24} height={24} className="" />
          <p>Riyadh, Saudi Arabia</p>
        </div>
      </div>

    </div>
      
  )
}

const TourDetailsDescription = () => {
  return (
    <div className="tour-details__desc">
      <div className="tour-details__desc-left">
        <p className="tour-details__desc-left-title">Description</p>
        <p className="tour-details__desc-left-description">
        8 Days 7 Nights Riyadh, Edge of the world, Al Ula, Madain Saleh & Jeddah. 
        </p>
      </div>
      
    </div>
  )
}

const TourDetailsReviews = () => {
  return (
    <div className="tour-details__reviews">
      <div className="tour-details__reviews-header">
        <p className="">Reviews</p>
        <div className="tour-details__reviews-header-overall">
          <div className="tour-details__reviews-header-chips">4.9</div>
          <p className="">Good</p>
        </div>
      </div>
      <div className="tour-details__reviews-row">
        <div className="tour-details__reviews-review">
          <BlurPlaceholderImage src={reviewerProfile1} alt="reviewer profile" width={48} height={48} />
          <div className="tour-details__reviews-review-column">
            <div className="tour-details__reviews-review-content">
              <div className="tour-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="tour-details__reviews-review-customer">
              <p>Cody Fisher</p>
              <div className="tour-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tour-details__reviews-review">
          <BlurPlaceholderImage src={reviewerProfile2} alt="reviewer profile" width={48} height={48} />
          <div className="tour-details__reviews-review-column">
            <div className="tour-details__reviews-review-content">
              <div className="tour-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="tour-details__reviews-review-customer">
              <p>Robert Fox</p>
              <div className="tour-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
        <div className="tour-details__reviews-review-content--button-wrap">
          <a href="#" className="tour-details__reviews-review-content--button">
              See More Review
            </a>
        </div>
      </div>
    </div>
  )
}

const TourDetailsPlan = () => {
  return (

    <div className="tour-details__detail-plan">
      <h4>Detail Plan</h4>
      <div className="tour-details__detail-plan-wrapper">
          <div className="tour-details__detail-plan-content-wrapper">
            <div className="tour-details__detail-plan-content">
            <div className="tour-details__detail-plan-content-line-left"></div>
              <div className="tour-details__detail-plan-content-title-wrapper">
                <p className="tour-details__detail-plan-content-title">Day 1</p>
                <div className="tour-details__detail-plan-content-desc">Arrival to riyadh</div>
              </div>
              <div className="tour-details__detail-plan-content-item-wrapper">
                <div className="tour-details__detail-plan-content-item">
                  <p className="tour-details__detail-plan-content-item-desc">
                  Your tour leader/driver will be waiting you. They will be holding a sign of SaudiArabiaTours , You do not need to look for them – they will be waiting for you and will find you.<br></br>
                  From the moment your tour starts, your tour leader will give you full attention. Once in the car, He will talk to you about all the things on the way as well as other aspects of your tour that will interest you.<br></br><br></br>
                  You will be transferred by an A/C car to your hotel. Overnight in Riyadh.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="tour-details__detail-plan-content-wrapper">
            <div className="tour-details__detail-plan-content">
              <div className="tour-details__detail-plan-content-line-left"></div>
              <div className="tour-details__detail-plan-content-title-wrapper">
                <p className="tour-details__detail-plan-content-title">Day 2</p>
                <div className="tour-details__detail-plan-content-desc">Riyadh Historical Tour</div>
              </div>
              <div className="tour-details__detail-plan-content-item-wrapper">
                <div className="tour-details__detail-plan-content-item">
                  <p className="tour-details__detail-plan-content-item-desc">
                  Your tour leader/driver will be waiting you. They will be holding a sign of SaudiArabiaTours , You do not need to look for them – they will be waiting for you and will find you.<br></br>
                  From the moment your tour starts, your tour leader will give you full attention. Once in the car, He will talk to you about all the things on the way as well as other aspects of your tour that will interest you.<br></br><br></br>
                  You will be transferred by an A/C car to your hotel. Overnight in Riyadh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        <Link href="#" className="tour-details__detail-plan-link">Show more plan</Link>
      </div>
    </div>
  )
}

const TourDetailsPlanA = () => {
  return (
    <div className="tour-details__card-wrapper">
      <div className="tour-details__card-heading-wrapper">
        <h4>Tour Plan</h4>
        <a className="tour-details__card collapsed" data-bs-toggle="collapse" href="#TourDetailsPlanA" role="button" aria-expanded="false" aria-controls="TourDetailsPlanA">
          <div className="tour-details__card-header-wrapper">
            <div>Plan A</div>&nbsp;
            <div className="tour-details__card-header-desc">(Ultimate Luxury)</div>
          </div>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
      </div>
      <div className="tour-details__special collapse" id="TourDetailsPlanA">
        <div className="tour-details__special-location">
          <div className="tour-details__special-location-title">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <p className="tour-details__special-location-desc">Riyadh</p>
          </div>
          <div className="tour-details__special-location-row">
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-left">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Sharaza Riyadh</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Rosh Rayhan by Rotana</li>
                </ul>
              </div>
            </div>
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-right">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Four Point by Sheraton Riyadh Khaldia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="tour-details__special-location">
          <div className="tour-details__special-location-title">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <p className="tour-details__special-location-desc">Jeddah</p>
          </div>
          <div className="tour-details__special-location-row">
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-left">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Prime Hotel - Jeddah, Al Hamra</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Radisson Blu Hotel, Jeddah Al Salam</li>
                </ul>
              </div>
            </div>
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-right">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Sheraton Jeddah Hotel </li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Movenpick Hotel Tahlia Jeddah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
          <div className="tour-details__special-location-footer">
              <div className="tour-details__special-location-summary-desc">Total</div>
              <div className="tour-details__special-location-summary-price">$ 305.00</div>
          </div>
      </div>
    </div>
  )
}

const TourDetailsPlanB = () => {
  return (
    <div className="tour-details__card-wrapper">
      <div className="tour-details__card-heading-wrapper">
        <a className="tour-details__card collapsed" data-bs-toggle="collapse" href="#TourDetailsPlanB" role="button" aria-expanded="false" aria-controls="TourDetailsPlanB">
          <div className="tour-details__card-header-wrapper">
            <div>Plan B</div>&nbsp;
            <div className="tour-details__card-header-desc">(Luxury)</div>
          </div>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
      </div>
      <div className="tour-details__special collapse" id="TourDetailsPlanB">
        <div className="tour-details__special-location">
          <div className="tour-details__special-location-title">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <p className="tour-details__special-location-desc">Riyadh</p>
          </div>
          <div className="tour-details__special-location-row">
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-left">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Sharaza Riyadh</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Rosh Rayhan by Rotana</li>
                </ul>
              </div>
            </div>
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-right">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Four Point by Sheraton Riyadh Khaldia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="tour-details__special-location">
          <div className="tour-details__special-location-title">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <p className="tour-details__special-location-desc">Jeddah</p>
          </div>
          <div className="tour-details__special-location-row">
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-left">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Prime Hotel - Jeddah, Al Hamra</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Radisson Blu Hotel, Jeddah Al Salam</li>
                </ul>
              </div>
            </div>
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-right">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Sheraton Jeddah Hotel </li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Movenpick Hotel Tahlia Jeddah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
          <div className="tour-details__special-location-footer">
              <div className="tour-details__special-location-summary-desc">Total</div>
              <div className="tour-details__special-location-summary-price">$ 305.00</div>
          </div>
      </div>
    </div>
  )
}

const TourDetailsPlanC = () => {
  return (
    <div className="tour-details__card-wrapper">
      <div className="tour-details__card-heading-wrapper">
        <a className="tour-details__card collapsed" data-bs-toggle="collapse" href="#TourDetailsPlanC" role="button" aria-expanded="false" aria-controls="TourDetailsPlanC">
          <div className="tour-details__card-header-wrapper">
            <div>Plan C</div>&nbsp;
            <div className="tour-details__card-header-desc">(5 Stars)</div>
          </div>
          <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
        </a>
      </div>
      <div className="tour-details__special collapse" id="TourDetailsPlanC">
        <div className="tour-details__special-location">
          <div className="tour-details__special-location-title">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <p className="tour-details__special-location-desc">Riyadh</p>
          </div>
          <div className="tour-details__special-location-row">
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-left">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Sharaza Riyadh</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Rosh Rayhan by Rotana</li>
                </ul>
              </div>
            </div>
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-right">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Four Point by Sheraton Riyadh Khaldia</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="tour-details__special-location">
          <div className="tour-details__special-location-title">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <p className="tour-details__special-location-desc">Jeddah</p>
          </div>
          <div className="tour-details__special-location-row">
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-left">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Prime Hotel - Jeddah, Al Hamra</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Radisson Blu Hotel, Jeddah Al Salam</li>
                </ul>
              </div>
            </div>
            <div className="tour-details__special-location-block">
              <div className="tour-details__special-location-block-right">
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Sheraton Jeddah Hotel </li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Movenpick Hotel Tahlia Jeddah</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
          <div className="tour-details__special-location-footer">
              <div className="tour-details__special-location-summary-desc">Total</div>
              <div className="tour-details__special-location-summary-price">$ 305.00</div>
          </div>
      </div>
    </div>
  )
}


const TourDetailsFacility = () => {
  return (
    <div className="tour-details__facility">
      <h4>Facilities</h4>
      <div className="tour-details__facility-wrapper">
          <div className="tour-details__facility-content-wrapper">
            <div className="tour-details__facility-content">
              <p className="tour-details__facility-content-title">Included</p>
              <div className="tour-details__facility-content-item-wrapper">
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">3 Nights hotel accommodation in Riyadh on bed and breakfast basis.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">3 Nights hotel accommodation in Riyadh on bed and breakfast basis.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">1 Nights hotel accommodation in Jeddah on bed and breakfast basis.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">All your tours and excursions are with an A/C vehicle.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">The service of meet and assist at all your destinations.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">English speaking tour leader/driver.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">All your visits include entrance fees.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">Our prices include all taxes and services.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="tour-details__facility-content-wrapper">
            <div className="tour-details__facility-content">
              <p className="tour-details__facility-content-title">Not Included</p>
              <div className="tour-details__facility-content-item-wrapper">
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc"> Visa Entry for Saudi Arabia. (We can provide you with your visa upon arrival at your request). </p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">International Flights.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">Domestic flights</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">Tipping.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">Any Optional tours.</p>
                </div>
                <div className="tour-details__facility-content-item">
                  <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                  <p className="tour-details__facility-content-item-desc">Drinks during meals.</p>
                </div>
              </div>
            </div>
          </div>
          
      </div>
    </div>
  )
}

const TourDetailsGuestReview = () => {
  return (
    <div className="tour-details__guest">
      <h4>Guest Reviews</h4>
      <div className="tour-details__guest-header">
        <div className="tour-details__guest-header-rating">
          <div className="tour-details__guest-header-chips">4.9</div>
          <p className="tour-details__guest-header-overall">Good</p>
          <div className="tour-details__guest-header-dots"></div>
          <p>255 reviews</p>
        </div>
        <select className="tour-details__guest-header-filter" name="filterSort" id="filterSort">
          <option value="highestRating">Sort : Highest Rating</option>
          <option value="newestRating">Sort : Newest Rating</option>
          <option value="popularRating">Sort : Popular Rating</option>
        </select>
      </div>
      <div className="tour-details__guest-wrapper">
        <div className="tour-details__guest-content">
          <div className="tour-details__guest-review">
            <div className="tour-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="tour-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="tour-details__guest-review-guest--bio">
                <p className="tour-details__guest-review-guest--name">Jerome Bell</p>
                <div className="tour-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="tour-details__guest-review-content">
              <div className="tour-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="tour-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="tour-details__guest-review">
            <div className="tour-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="tour-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="tour-details__guest-review-guest--bio">
                <p className="tour-details__guest-review-guest--name">Jerome Bell</p>
                <div className="tour-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="tour-details__guest-review-content">
              <div className="tour-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="tour-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="tour-details__guest-review">
            <div className="tour-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="tour-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="tour-details__guest-review-guest--bio">
                <p className="tour-details__guest-review-guest--name">Jerome Bell</p>
                <div className="tour-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="tour-details__guest-review-content">
              <div className="tour-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="tour-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="tour-details__guest-review">
            <div className="tour-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="tour-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="tour-details__guest-review-guest--bio">
                <p className="tour-details__guest-review-guest--name">Jerome Bell</p>
                <div className="tour-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="tour-details__guest-review-content">
              <div className="tour-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="tour-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="tour-details__guest-review">
            <div className="tour-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="tour-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="tour-details__guest-review-guest--bio">
                <p className="tour-details__guest-review-guest--name">Jerome Bell</p>
                <div className="tour-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="tour-details__guest-review-content">
              <div className="tour-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="tour-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="tour-details__guest-pagination">
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

const TourDetailsMoreInformation = () => {
  return (
    <div className="tour-details__information">
      <h4>More Information</h4>
      <div className="tour-details__information-wrapper">
        <div className="tour-details__information-content-wrapper">
        <div className="tour-details__information-content">
          <p className="tour-details__information-content-title">Travel Insurance – from AIG</p>
          <div className="tour-details__information-content-details">
            <div className="tour-details__information-content-item">
              <p>Secure your trip and give yourself greater peace of mind with the Travel Insurance program proposed by AIG for you. For more info visit www.aig.com<br></br>
              One week 50$ per person<br></br>
              More than one week 75 $ per person.
              </p>
            </div>
          </div>
        </div>
        <div className="tour-details__information-content">
          <p className="tour-details__information-content-title">Saudi Sim Card</p>
          <div className="tour-details__information-content-details">
            <div className="tour-details__information-content-desc">
              <p>If you plan to get a Saudi sim card we would advise you to get it at the airport when you arrive. as it will be much easier to buy it from the airport other than anywhere else as they request more documents if you decide to buy it later from anywhere else.</p>
            </div>
          </div>
        </div>
        </div>
        <Link href="#" className="tour-details__information-link">Show more information</Link>
      </div>
    </div>
  )
}

const BannerSection = () => {
  const bannerInfo =
  {
    title: '',
    description: 'Enjoy special discounts & other benefits! Log in or register now.',
    icon: Icons.Lamp,
    linkText: 'Login or register now',
    linkURL: '#'
  }

  return (
    <div className="">
      <BannerInfo {...bannerInfo} />
    </div>
  )
}

export default TourDetails
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
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import hotelImagery1 from '@/assets/images/hotel_details_imagery_1.png'
import hotelImagery2 from '@/assets/images/hotel_details_imagery_2.png'
import hotelImagery3 from '@/assets/images/hotel_details_imagery_3.png'
import hotelImagery4 from '@/assets/images/hotel_details_imagery_4.png'
import hotelImagery5 from '@/assets/images/hotel_details_imagery_5.png'
import reviewerProfile1 from '@/assets/images/reviewer_profile_1.png'
import reviewerProfile2 from '@/assets/images/reviewer_profile_2.png'
import reviewerProfile3 from '@/assets/images/reviewer_profile_3.png'


const HotelDetails = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <div className="hotel-details">
        <HotelTopNav />
        <div className="container">
          <div className="hotel-details__header">
            <HotelBreadCrumb />
            <div className="hotel-details__header-filter">
              <HotelSearchBar useVariant={true} />
            </div>
            <div className="hotel-details__content">
              <HotelDetailsImagery />
              <HotelDetailsSummary />
              <HotelDetailsDescription />
              <HotelDetailsReviews />
              <HotelDetailsLocation />
              <HotelDetailsRoom />
              <HotelDetailsFacility />
              <HotelDetailsGuestReview />
              <HotelDetailsMoreInformation />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

const HotelTopNav = () => {
  return (
    <div className="container hotel-details__nav">
      <button className="hotel-details__nav-item active">Overview</button>
      <button className="hotel-details__nav-item">Location</button>
      <button className="hotel-details__nav-item">Room</button>
      <button className="hotel-details__nav-item">Facilities</button>
      <button className="hotel-details__nav-item">Reviews</button>
      <button className="hotel-details__nav-item">More Information</button>
    </div>
  )
}

const HotelBreadCrumb = () => {
  return (
    <div className="hotel-details__header-breadcrumb">
      <Link className="hotel-details__header-breadcrumb--link" href="#">Home</Link>
      <p>/</p>
      <Link className="hotel-details__header-breadcrumb--link" href="#">Search Hotel</Link>
      <p>/</p>
      <p className="hotel-details__header-breadcrumb--current">Sheraton Makkah Jabal Al Kaaba Hotel</p>
    </div>
  )
}

const HotelDetailsImagery = () => {
  return (
    <div className="hotel-details__imagery">
      <BlurPlaceholderImage src={hotelImagery1} alt="Trending City" width={644} height={468} />
      <div className="hotel-details__imagery-src">
        <BlurPlaceholderImage src={hotelImagery2} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={hotelImagery3} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={hotelImagery4} alt="Trending City" width={230} height={230} />
        <BlurPlaceholderImage src={hotelImagery5} alt="Trending City" width={230} height={230} />
      </div>
    </div>
  )
}

const HotelDetailsSummary = () => {
  return (
    <div className="hotel-details__summary">
      <div className="hotel-details__summary-left">
        <h3>Sheraton Makkah Jabal Al Kaaba Hotel</h3>
        <div className="hotel-details__summary-left-stars">
          <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
          <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
        </div>
        <div className="hotel-details__summary-left-location">
          <SVGIcon src={Icons.MapPin} width={24} height={24} className="" />
          <p>Abraj Al Bait Complex, King Abdel Aziz Endowment, Mecca, Saudi Arabia</p>
        </div>
      </div>
      <div className="hotel-details__summary-right">
        <div className="hotel-details__summary-right-price">
          <p>Starts from</p>
          <div className="hotel-details__summary-right-total">
            <h4>$ 350.00</h4>
            <p className="hotel-details__summary-right-total--range">/night</p>
          </div>
          <button className="btn btn-success">See Rooms</button>
        </div>
      </div>
    </div>
  )
}

const HotelDetailsDescription = () => {
  return (
    <div className="hotel-details__desc">
      <div className="hotel-details__desc-left">
        <p className="hotel-details__desc-left-title">Description</p>
        <p className="hotel-details__desc-left-description">
          Ideally located in the prime touristic area of Ajyad, ZamZam Pullman Makkah Hotel promises a relaxing and wonderful visit.
          Featuring a complete list of amenities, guests will find their stay at the property a comfortable one. 24-hour room service,
          free ... <span className="hotel-details__desc-left-description--button">Read more</span>
        </p>
      </div>
      <div className="hotel-details__desc-right">
        <p className="hotel-details__desc-right-title">Facilities</p>
        <div className="hotel-details__desc-facilities">
          <div className="hotel-details__desc-facilities-item">
            <SVGIcon src={Icons.CircleTime} width={20} height={20} />
            <p>24-hour Front Desk</p>
          </div>
          <div className="hotel-details__desc-facilities-item">
            <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
            <p>Free Breakfast</p>
          </div>
          <div className="hotel-details__desc-facilities-item">
            <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />
            <p>Free Wifi</p>
          </div>
          <button className="hotel-details__desc-facilities-more btn btn-lg btn-outline-success text-neutral-primary">See more fasilities</button>
        </div>
      </div>
    </div>
  )
}

const HotelDetailsReviews = () => {
  return (
    <div className="hotel-details__reviews">
      <div className="hotel-details__reviews-header">
        <p className="">Reviews</p>
        <div className="hotel-details__reviews-header-overall">
          <div className="hotel-details__reviews-header-chips">4.9</div>
          <p className="">Good</p>
        </div>
      </div>
      <div className="hotel-details__reviews-row">
        <div className="hotel-details__reviews-review">
          <BlurPlaceholderImage src={reviewerProfile1} alt="reviewer profile" width={48} height={48} />
          <div className="hotel-details__reviews-review-column">
            <div className="hotel-details__reviews-review-content">
              <div className="hotel-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="hotel-details__reviews-review-customer">
              <p>Cody Fisher</p>
              <div className="hotel-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__reviews-review">
          <BlurPlaceholderImage src={reviewerProfile2} alt="reviewer profile" width={48} height={48} />
          <div className="hotel-details__reviews-review-column">
            <div className="hotel-details__reviews-review-content">
              <div className="hotel-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="hotel-details__reviews-review-customer">
              <p>Robert Fox</p>
              <div className="hotel-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__reviews-review">
          <BlurPlaceholderImage src={reviewerProfile3} alt="reviewer profile" width={48} height={48} />
          <div className="hotel-details__reviews-review-column">
            <div className="hotel-details__reviews-review-content">
              <div className="hotel-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="hotel-details__reviews-review-customer">
              <p>Ronald Richards</p>
              <div className="hotel-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HotelDetailsLocation = () => {
  return (
    <div className="hotel-details__location">
      <h4>Location</h4>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237685.0692940347!2d39.70646057504093!3d21.43595714304669!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c21b4ced818775%3A0x98ab2469cf70c9ce!2sMekkah%20Arab%20Saudi!5e0!3m2!1sid!2sid!4v1679911288419!5m2!1sid!2sid" width="1200" height="330" loading="lazy"></iframe>
      <div className="hotel-details__location-details">
        <div className="hotel-details__location-details-header">
          <p className="hotel-details__location-details-name">Mecca, Makkah Province, Saudi Arabia</p>
          <div className="hotel-details__location-details-specific">
            <SVGIcon src={Icons.MapPin} width={24} height={24} className="hotel-details__location-details-specific--pin" />
            <p>Abraj Al Bait Complex, King Abdel Aziz Endowment</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const HotelDetailsRoom = () => {
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="hotel-details__room">
      <h4>Room</h4>
      <div className="hotel-details__room-wrapper">
        <BannerSection />
        <div className="hotel-details__room-item">
          <div className="hotel-details__room-item-preview">
            <Slider {...settings} className='hotel-details__slider-wrapper'>
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
            </Slider>
            <div className="hotel-details__room-item-preview-title">
              <h5>Standard Room</h5>
            </div>
          </div>
          <div className="hotel-details__room-item-list">
            <div className="hotel-details__room-detail">
              <div className="hotel-details__room-detail-content">
                <div className="hotel-details__room-detail-title">
                  <p>Double or Twin Room</p>
                  <div className="hotel-details__room-detail-facilities">
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesDimension} width={20} height={20} />
                      <p>30m2</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
                      <p>Breakfast 2 pax</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />
                      <p>Free Wifi</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-details__room-detail-content--separator"></div>
                <div className="hotel-details__room-detail-specification">
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Bed} width={20} height={20} />
                    <p>2 single beds</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.FacilitiesMoney} width={20} height={20} />
                    <p>Extra low price! (non-refundable)</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Users} width={20} height={20} />
                    <p>2 guests</p>
                  </div>
                </div>
              </div>
              <div className="hotel-details__room-detail-split">
                <div className="hotel-details__room-detail-split__price">
                  <h5>$ 350.00</h5>
                  <p className="hotel-details__room-detail-split__price-type">/ night</p>
                </div>
                <div className="hotel-details__room-detail-split__action">
                  <Link href='/booking/hotel/' className="btn btn-success">Book this Room</Link>
                  <Link href="#" className="hotel-details__room-detail-split__action-link">See room details</Link>
                </div>
              </div>
            </div>
            <div className="hotel-details__room-detail">
              <div className="hotel-details__room-detail-content">
                <div className="hotel-details__room-detail-title">
                  <p>Double or Twin Room, 4 Single Size Beds, City View</p>
                  <div className="hotel-details__room-detail-facilities">
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesDimension} width={20} height={20} />
                      <p>30m2</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
                      <p>Breakfast 2 pax</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />
                      <p>Free Wifi</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-details__room-detail-content--separator"></div>
                <div className="hotel-details__room-detail-specification">
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Bed} width={20} height={20} />
                    <p>2 single beds</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.FacilitiesMoney} width={20} height={20} />
                    <p>Extra low price! (non-refundable)</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Users} width={20} height={20} />
                    <p>2 guests</p>
                  </div>
                </div>
              </div>
              <div className="hotel-details__room-detail-split">
                <div className="hotel-details__room-detail-split__price">
                  <h5>$ 350.00</h5>
                  <p className="hotel-details__room-detail-split__price-type">/ night</p>
                </div>
                <div className="hotel-details__room-detail-split__action">
                  <button className="btn btn-success">Book this Room</button>
                  <Link href="#" className="hotel-details__room-detail-split__action-link">See room details</Link>
                </div>
              </div>
            </div>
            <Link href="#" className="hotel-details__room-item-link">
              Show more room
              <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
            </Link>
          </div>
        </div>
        <div className="hotel-details__room-item">
          <div className="hotel-details__room-item-preview">
            <Slider {...settings} className='hotel-details__slider-wrapper'>
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
                <BlurPlaceholderImage src={hotelImagery2} className="hotel-details__room-item-preview-image" alt="reviewer profile" width={265} height={265} />
            </Slider>
            <div className="hotel-details__room-item-preview-title">
              <h5>Standard Room</h5>
            </div>
          </div>
          <div className="hotel-details__room-item-list">
            <div className="hotel-details__room-detail">
              <div className="hotel-details__room-detail-content">
                <div className="hotel-details__room-detail-title">
                  <p>Double or Twin Room</p>
                  <div className="hotel-details__room-detail-facilities">
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesDimension} width={20} height={20} />
                      <p>30m2</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
                      <p>Breakfast 2 pax</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />
                      <p>Free Wifi</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-details__room-detail-content--separator"></div>
                <div className="hotel-details__room-detail-specification">
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Bed} width={20} height={20} />
                    <p>2 single beds</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.FacilitiesMoney} width={20} height={20} />
                    <p>Extra low price! (non-refundable)</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Users} width={20} height={20} />
                    <p>2 guests</p>
                  </div>
                </div>
              </div>
              <div className="hotel-details__room-detail-split">
                <div className="hotel-details__room-detail-split__price">
                  <h5>$ 350.00</h5>
                  <p className="hotel-details__room-detail-split__price-type">/ night</p>
                </div>
                <div className="hotel-details__room-detail-split__action">
                  <button className="btn btn-success">Book this Room</button>
                  <Link href="#" className="hotel-details__room-detail-split__action-link">See room details</Link>
                </div>
              </div>
            </div>
            <div className="hotel-details__room-detail">
              <div className="hotel-details__room-detail-content">
                <div className="hotel-details__room-detail-title">
                  <p>Double or Twin Room, 4 Single Size Beds, City View</p>
                  <div className="hotel-details__room-detail-facilities">
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesDimension} width={20} height={20} />
                      <p>30m2</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
                      <p>Breakfast 2 pax</p>
                    </div>
                    <div className="hotel-details__room-detail-facilities__dots"></div>
                    <div className="hotel-details__room-detail-facilities__item">
                      <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />
                      <p>Free Wifi</p>
                    </div>
                  </div>
                </div>
                <div className="hotel-details__room-detail-content--separator"></div>
                <div className="hotel-details__room-detail-specification">
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Bed} width={20} height={20} />
                    <p>2 single beds</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.FacilitiesMoney} width={20} height={20} />
                    <p>Extra low price! (non-refundable)</p>
                  </div>
                  <div className="hotel-details__room-detail-facilities__item">
                    <SVGIcon src={Icons.Users} width={20} height={20} />
                    <p>2 guests</p>
                  </div>
                </div>
              </div>
              <div className="hotel-details__room-detail-split">
                <div className="hotel-details__room-detail-split__price">
                  <h5>$ 350.00</h5>
                  <p className="hotel-details__room-detail-split__price-type">/ night</p>
                </div>
                <div className="hotel-details__room-detail-split__action">
                  <button className="btn btn-success">Book this Room</button>
                  <Link href="#" className="hotel-details__room-detail-split__action-link">See room details</Link>
                </div>
              </div>
            </div>
            <Link href="#" className="hotel-details__room-item-link">
              Show more room
              <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const HotelDetailsFacility = () => {
  return (
    <div className="hotel-details__facility">
      <h4>Amenities and Facilities</h4>
      <div className="hotel-details__facility-wrapper">
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Most Popular Amenities</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--column hotel-details__facility-content-list--border">
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #1</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #2</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #3</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #4</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #1</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #2</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #3</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #4</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #1</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #2</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #3</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <SVGIcon src={Icons.Bed} width={20} height={20} />
              <p>Facility #4</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Public Facilities</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Air Conditioning</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Public WiFi</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Elevator/Lift</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Restaurant</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>ATM/Banking</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Designated smoking areas</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Hotel Services</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Safe-deposit box at front desk</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Luggage Storage</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Tours</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Wake-up service</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>24-hour Front Desk</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Laundry Service/Dry Cleaning</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Hotel Safe</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Concierge Services</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Doorman</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Currency Exchange</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>First Aid Kit</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Other Facilities</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row">
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Bar/Lounge</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Closet</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Car hire</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Parking onsite</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Carpeted Floors</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>Smoking Area</p>
            </div>
            <div className="hotel-details__facility-content-item">
              <div className="hotel-details__facility-content-item--dots"></div>
              <p>24-hour Security</p>
            </div>
          </div>
        </div>
        <Link href="#" className="hotel-details__facility-link">Show more facilities</Link>
      </div>
    </div>
  )
}

const HotelDetailsGuestReview = () => {
  return (
    <div className="hotel-details__guest">
      <h4>Guest Reviews</h4>
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
            <p>Location</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "92%" }}></div>
              </div>
              <p>4,6</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Staff</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "96%" }}></div>
              </div>
              <p>4,8</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Cleanliness</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "98%" }}></div>
              </div>
              <p>4,9</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Comfort</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "90%" }}></div>
              </div>
              <p>4,5</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Value for money </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "88%" }}></div>
              </div>
              <p>4,6</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Facilities </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "98%" }}></div>
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

const HotelDetailsMoreInformation = () => {
  return (
    <div className="hotel-details__information">
      <h4>Guest Reviews</h4>
      <div className="hotel-details__information-wrapper">
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Check - in/out Time</p>
          <div className="hotel-details__information-content-details">
            <div className="hotel-details__information-content-clock">
              <div className="hotel-details__information-content-item">
                <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                <p>Check-in Time : </p>
                <p className="hotel-details__information-content-item--time">2 PM</p>
              </div>
              <div className="hotel-details__information-content-item">
                <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                <p>Check-out Time : </p>
                <p className="hotel-details__information-content-item--time">4 PM</p>
              </div>
            </div>
            <div className="hotel-details__information-content-item">
              <SVGIcon src={Icons.Warning} width={20} height={20} />
              <p>Guests are required to show a photo identification and credit card upon check-in</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Policy</p>
          <div className="hotel-details__information-content-details">
            <div className="hotel-details__information-content-desc">
              <div><div className="hotel-details__information-content-desc--dots"></div></div>
              <p>Guests are required to show a photo identification and credit card upon check-in</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">Policy</p>
          <div className="hotel-details__information-content-details">
            <div className="hotel-details__information-content-desc">
              <div>
                <div className="hotel-details__information-content-desc--dots"></div>
              </div>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__information-content">
          <p className="hotel-details__information-content-title">FAQs</p>
          <div className="hotel-details__information-content-details">
            <a className="hotel-details__information-content-desc collapsed" data-bs-toggle="collapse" href="#informationFAQ1" role="button" aria-expanded="false" aria-controls="informationFAQ1">
              <div><div className="hotel-details__information-content-desc--dots"></div></div>
              <p>What is the address of ZamZam Pullman Makkah Hotel?</p>
              <SVGIcon src={Icons.Plus} className="hotel-details__information-content-desc--icon" width={20} height={20} />
            </a>
            <div className="hotel-details__information-content-desc collapse" id="informationFAQ1">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <a className="hotel-details__information-content-desc collapsed" data-bs-toggle="collapse" href="#informationFAQ2" role="button" aria-expanded="false" aria-controls="informationFAQ2">
              <div><div className="hotel-details__information-content-desc--dots"></div></div>
              <p>What are the standard check-in & check-out times of ZamZam Pullman Makkah Hotel?</p>
              <SVGIcon src={Icons.Plus} className="hotel-details__information-content-desc--icon" width={20} height={20} />
            </a>
            <div className="hotel-details__information-content-desc collapse" id="informationFAQ2">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
            <a className="hotel-details__information-content-desc collapsed" data-bs-toggle="collapse" href="#informationFAQ3" role="button" aria-expanded="false" aria-controls="informationFAQ3">
              <div><div className="hotel-details__information-content-desc--dots"></div></div>
              <p>What are the facilities available in ZamZam Pullman Makkah Hotel?</p>
              <SVGIcon src={Icons.Plus} className="hotel-details__information-content-desc--icon" width={20} height={20} />
            </a>
            <div className="hotel-details__information-content-desc collapse" id="informationFAQ3">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
        <Link href="#" className="hotel-details__information-link">Show more information</Link>
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

export default HotelDetails
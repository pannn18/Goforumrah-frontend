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
import businessPartnershipImage from '@/assets/images/business_partnernship_img.png'
import businessPartnershipImage2 from '@/assets/images/business_partnernship_img-2.png'
import businessPartnershipAudienceImage from '@/assets/images/business_partnernship_audience.png'
import businessPartnershipAudienceImage2 from '@/assets/images/business_partnernship_audience2.svg'
import businessPartnershipAudienceFooter from '@/assets/images/business_partnernship_footer.png'


const Partnership = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <PartnershipHero />
      <PartnershipTabs />
      <PartnershipAudiences />
      <PartnershipBenefits />
      <PartnershipSteps />
      <PartnershipFAQ />
      <PartnershipFooter />
      <Footer />
    </Layout>
  )
}

const PartnershipHero = () => {
  return (
    <div className="partnership">
      <div className='container partnership__container'>
        <div className='row h-100'>
          <div className='col-lg-6 col-lg-offset-6 col-md-12 partnership__left'>
            <div className='partnership__left-content'>
              <div className="partnership__left-content-wrapper">
                <h1 className='partnership__left-heading'>List your hotel and accommodations at <span className='partnership__left-heading--green'>GoForUmrah.com</span></h1>
                <p className='partnership__left-subheading'>GoForUmrah.com provides all the features without charging you anything, and your business can operate it on a small or large scale.</p>
              </div>
              <button className="partnership__left-btn btn btn-success btn-lg">Sign up for free</button>
            </div>
          </div>
        </div>
      </div>
      <BlurPlaceholderImage className='partnership__image' alt='image' src={businessPartnershipImage} width={660} height={675} />
    </div>
  )
}

const PartnershipBenefits = () => {
  return (
    <div className="partnership-benefits__content-wrapper">
      <div className="partnership-benefits__content-tabs">
        <div className="container">
          <div className="partnership-benefits__about">
            <h3>Why you need to choose us ?</h3>
            <div className="partnership-benefits__about-content">
              <div className="partnership-benefits__about-content-left">
                <div className="partnership-benefits__about-content-right-icon">
                  <SVGIcon src={Icons.RegistrationProcess} width={80} height={80} />
                </div>
                <div className="partnership-benefits__about-content-left-wrapper">
                  <h4>Simple and quick registration process</h4>
                  <p>Create an extranet account, fill in your accommodation details, and our team will contact you. Then, your accommodation is ready to be activated on tiket.com. It's that simple!</p>
                </div>
              </div>
              <div className="partnership-benefits__about-content-right">
                <div className="partnership-benefits__about-content-right-item">
                  <div className="partnership-benefits__about-content-right-icon">
                    <SVGIcon src={Icons.ManageReservation} width={64} height={64} />
                  </div>
                  <div className="partnership-benefits__about-content-right-info">
                    <h5>Manage reservations</h5>
                    <p>Easily find how many reservations and check-ins are made daily on your accommodation.</p>
                  </div>
                </div>
                <div className="partnership-benefits__about-content-right-item">
                  <div className="partnership-benefits__about-content-right-icon">
                    <SVGIcon src={Icons.ManageReservation} width={64} height={64} />
                  </div>
                  <div className="partnership-benefits__about-content-right-info">
                    <h5>Monitored admin</h5>
                    <p>difficulties will always be there, if you find them you can immediately tell us</p>
                  </div>
                </div>
                <div className="partnership-benefits__about-content-right-item">
                  <div className="partnership-benefits__about-content-right-icon">
                    <SVGIcon src={Icons.ManageReservation} width={64} height={64} />
                  </div>
                  <div className="partnership-benefits__about-content-right-info">
                    <h5>Manage rates and allotments</h5>
                    <p>Set allotment for each room type, manage room availability, manage rate plan, set cancellation policy and set meal plan effortlessly.</p>
                  </div>
                </div>
                <div className="partnership-benefits__about-content-right-item">
                  <div className="partnership-benefits__about-content-right-icon">
                    <SVGIcon src={Icons.ManageReservation} width={64} height={64} />
                  </div>
                  <div className="partnership-benefits__about-content-right-info">
                    <h5>Reservation payment</h5>
                    <p>Monitor the payment status for each transaction easily. Our advanced system guarantees secure transactions </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

const PartnershipTabs = () => {

  const tabs = {
    'About Us': [
      {
        TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.', TextLeftTwo: 'For now we have the 4 best business services for you', TextFlight: 'We are partnering with more than 90 domestic & international airlines.', TextHotel: 'We have more than 2 millions domestic & international hotel partners.', TextCar: 'We have more than 175 partners across 90 different cities.', TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
      },
    ],
    'Attract Audience': [
      {
        TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.', TextLeftTwo: 'For now we have the 4 best business services for you', TextFlight: 'We are partnering with more than 90 domestic & international airlines.', TextHotel: 'We have more than 2 millions domestic & international hotel partners.', TextCar: 'We have more than 175 partners across 90 different cities.', TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
      },
    ],
    'Why GoForUmrah ?': [
      {
        TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.', TextLeftTwo: 'For now we have the 4 best business services for you', TextFlight: 'We are partnering with more than 90 domestic & international airlines.', TextHotel: 'We have more than 2 millions domestic & international hotel partners.', TextCar: 'We have more than 175 partners across 90 different cities.', TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
      },
    ],
    'Start partnership': [
      {
        TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.', TextLeftTwo: 'For now we have the 4 best business services for you', TextFlight: 'We are partnering with more than 90 domestic & international airlines.', TextHotel: 'We have more than 2 millions domestic & international hotel partners.', TextCar: 'We have more than 175 partners across 90 different cities.', TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
      },
    ],
    'FAQ': [
      {
        TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.', TextLeftTwo: 'For now we have the 4 best business services for you', TextFlight: 'We are partnering with more than 90 domestic & international airlines.', TextHotel: 'We have more than 2 millions domestic & international hotel partners.', TextCar: 'We have more than 175 partners across 90 different cities.', TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
      },
    ],
  }

  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])

  return (
    <div className="partnership__content-wrapper">
      <div className="partnership__content-header">
        <div className="partnership__content-header-split">
          <div className="partnership__content-header-tab-menu">
            {Object.keys(tabs).map((tab, index) => (
              <a
                href={`#${tab}`}
                key={index}
                className={`btn partnership__btn ${tab === selectedTab ? 'active' : ''}`}
                onClick={() => setSelectedTab(tab)}>
                {tab}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="partnership__content-tabs" id={'About Us'}>
        {selectedTab === 'About Us' && tabs[selectedTab].map((aboutUs, index) => (
          <div key={index} className="container">
            <div className="partnership__about">
              <div className="partnership__about-content">
                <div className="partnership__about-content-left">
                  <div className="partnership__about-content-left-wrapper">
                    <div className="partnership__about-content-left-label">About Us</div>
                    <h3>Who Are We ?</h3>
                    <p>{aboutUs.TextLeftOne}<br></br>{aboutUs.TextLeftTwo}</p>
                  </div>
                </div>
                <div className="partnership__about-content-right">
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Flight} width={28} height={28} />
                    </div>
                    <h5>Flight</h5>
                    <p>{aboutUs.TextFlight}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Hotel} width={28} height={28} />
                    </div>
                    <h5>Hotel</h5>
                    <p>{aboutUs.TextHotel}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Car} width={28} height={28} />
                    </div>
                    <h5>Car</h5>
                    <p>{aboutUs.TextCar}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.SunHorizon} width={28} height={28} />
                    </div>
                    <h5>Tour</h5>
                    <p>{aboutUs.TextTour}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {selectedTab === 'Attract Audience' && tabs[selectedTab].map((aboutUs, index) => (
          <div key={index} className="container" id={'Attract Audience'}>
            <div className="partnership__about">
              <div className="partnership__about-content">
                <div className="partnership__about-content-left">
                  <div className="partnership__about-content-left-wrapper">
                    <div className="partnership__about-content-left-label">About Us</div>
                    <h3>Who Are We ?</h3>
                    <p>{aboutUs.TextLeftOne}<br></br>{aboutUs.TextLeftTwo}</p>
                  </div>
                </div>
                <div className="partnership__about-content-right">
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Hotel} width={28} height={28} />
                    </div>
                    <h5>Hotel</h5>
                    <p>{aboutUs.TextHotel}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Flight} width={28} height={28} />
                    </div>
                    <h5>Flight</h5>
                    <p>{aboutUs.TextFlight}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Car} width={28} height={28} />
                    </div>
                    <h5>Car</h5>
                    <p>{aboutUs.TextCar}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.SunHorizon} width={28} height={28} />
                    </div>
                    <h5>Tour</h5>
                    <p>{aboutUs.TextTour}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {selectedTab === 'Why GoForUmrah ?' && tabs[selectedTab].map((aboutUs, index) => (
          <div key={index} className="container" id={'Why GoForUmrah ?'}>
            <div className="partnership__about">
              <div className="partnership__about-content">
                <div className="partnership__about-content-left">
                  <div className="partnership__about-content-left-wrapper">
                    <div className="partnership__about-content-left-label">About Us</div>
                    <h3>Who Are We ?</h3>
                    <p>{aboutUs.TextLeftOne}<br></br>{aboutUs.TextLeftTwo}</p>
                  </div>
                </div>
                <div className="partnership__about-content-right">
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Flight} width={28} height={28} />
                    </div>
                    <h5>Flight</h5>
                    <p>{aboutUs.TextFlight}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Car} width={28} height={28} />
                    </div>
                    <h5>Car</h5>
                    <p>{aboutUs.TextCar}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Hotel} width={28} height={28} />
                    </div>
                    <h5>Hotel</h5>
                    <p>{aboutUs.TextHotel}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.SunHorizon} width={28} height={28} />
                    </div>
                    <h5>Tour</h5>
                    <p>{aboutUs.TextTour}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {selectedTab === 'Start partnership' && tabs[selectedTab].map((aboutUs, index) => (
          <div key={index} className="container" id={'Start partnership'}>
            <div className="partnership__about">
              <div className="partnership__about-content">
                <div className="partnership__about-content-left">
                  <div className="partnership__about-content-left-wrapper">
                    <div className="partnership__about-content-left-label">About Us</div>
                    <h3>Who Are We ?</h3>
                    <p>{aboutUs.TextLeftOne}<br></br>{aboutUs.TextLeftTwo}</p>
                  </div>
                </div>
                <div className="partnership__about-content-right">
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Flight} width={28} height={28} />
                    </div>
                    <h5>Flight</h5>
                    <p>{aboutUs.TextFlight}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Hotel} width={28} height={28} />
                    </div>
                    <h5>Hotel</h5>
                    <p>{aboutUs.TextHotel}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Car} width={28} height={28} />
                    </div>
                    <h5>Car</h5>
                    <p>{aboutUs.TextCar}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.SunHorizon} width={28} height={28} />
                    </div>
                    <h5>Tour</h5>
                    <p>{aboutUs.TextTour}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {selectedTab === 'FAQ' && tabs[selectedTab].map((aboutUs, index) => (
          <div key={index} className="container" id={'FAQ'}>
            <div className="partnership__about">
              <div className="partnership__about-content">
                <div className="partnership__about-content-left">
                  <div className="partnership__about-content-left-wrapper">
                    <div className="partnership__about-content-left-label">About Us</div>
                    <h3>Who Are We ?</h3>
                    <p>{aboutUs.TextLeftOne}<br></br>{aboutUs.TextLeftTwo}</p>
                  </div>
                </div>
                <div className="partnership__about-content-right">
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.SunHorizon} width={28} height={28} />
                    </div>
                    <h5>Tour</h5>
                    <p>{aboutUs.TextTour}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Flight} width={28} height={28} />
                    </div>
                    <h5>Flight</h5>
                    <p>{aboutUs.TextFlight}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Hotel} width={28} height={28} />
                    </div>
                    <h5>Hotel</h5>
                    <p>{aboutUs.TextHotel}</p>
                  </div>
                  <div className="partnership__about-content-right-item">
                    <div className="partnership__about-content-right-icon">
                      <SVGIcon src={Icons.Car} width={28} height={28} />
                    </div>
                    <h5>Car</h5>
                    <p>{aboutUs.TextCar}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}


      </div>

    </div>

  )
}

const PartnershipAudiences = () => {
  return (
    <div className="partnership-audiences">
      <div className='container partnership-audiences__container'>
        <div className='row h-100'>
          <div className='col-lg-6 col-lg-offset-6 col-md-12 partnership-audiences__left'>
            <div className='partnership-audiences__left-content'>
              <div className="partnership-audiences__left-content-wrapper">
                <h3 className='partnership-audiences__left-heading'>Attact More Audiences</h3>
                <p className='partnership-audiences__left-subheading'>Highlight your products/services on GoForUmrah.com and take your brand exposure to the next level by reaching our best & loyal users</p>
                <div className="partnership-audiences__left-requirement">
                  <SVGIcon src={Icons.CheckRoundedGreen} width={24} height={24} />
                  <p>Increase sales probability</p>
                </div>
                <div className="partnership-audiences__left-requirement">
                  <SVGIcon src={Icons.CheckRoundedGreen} width={24} height={24} />
                  <p>Exposure to wider audience through brand name & logo placement</p>
                </div>
                <div className="partnership-audiences__left-requirement">
                  <SVGIcon src={Icons.CheckRoundedGreen} width={24} height={24} />
                  <p>Reach high quality audience</p>
                </div>
              </div>
              <button className="partnership-audiences__left-btn btn btn-success btn-md">Join us now</button>
            </div>
          </div>
          <div className="partnership-audiences__image-wrapper">
            <BlurPlaceholderImage className='partnership-audiences__image' alt='image' src={businessPartnershipAudienceImage2} width={455} height={633} />
          </div>
        </div>
      </div>
    </div>
  )
}

const PartnershipSteps = () => {
  return (
    <div className="partnership-steps">
      <div className="container partnership-steps__container">
        <div className="partnership-steps__content">
          <h3 className='partnership-steps__content-title'>Start a Partnership in easy steps</h3>
          <div className="partnership-steps__content-item-container">
            <div className="partnership-steps__content-item-wrapper">
              <div className="partnership-steps__content-item">
                <div className="partnership-steps__content-number">
                  <h5 className="partnership-steps__content-number">1</h5>
                </div>
                <div className="partnership-steps__content-card">
                  <div className="partnership-steps__content-card-icon">
                    <SVGIcon src={Icons.HeartFull} width={28} height={28} />
                  </div>
                  <div className="partnership-steps__content-card-info">
                    <h5>Express your interest</h5>
                    <p>Reach us through one of our partnership PICs</p>
                  </div>
                </div>
              </div>
              <div className="partnership-steps__content-item">
                <div className="partnership-steps__content-number">
                  <h5 className="partnership-steps__content-number">2</h5>
                </div>
                <div className="partnership-steps__content-card">
                  <div className="partnership-steps__content-card-icon">
                    <SVGIcon src={Icons.PhoneFull} width={28} height={28} />
                  </div>
                  <div className="partnership-steps__content-card-info">
                    <h5>Let’s discuss</h5>
                    <p>Explore & then decide on the partnership scheme that best suit your needs.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="partnership-steps__content-item-wrapper">
              <div className="partnership-steps__content-item">
                <div className="partnership-steps__content-number">
                  <h5 className="partnership-steps__content-number">3</h5>
                </div>
                <div className="partnership-steps__content-card">
                  <div className="partnership-steps__content-card-icon">
                    <SVGIcon src={Icons.SettingFull} width={28} height={28} />
                  </div>
                  <div className="partnership-steps__content-card-info">
                    <h5>Set up the program</h5>
                    <p>Finalize the partnership agreement, so we can begin setting up the program.</p>
                  </div>
                </div>
              </div>
              <div className="partnership-steps__content-item">
                <div className="partnership-steps__content-number">
                  <h5 className="partnership-steps__content-number">4</h5>
                </div>
                <div className="partnership-steps__content-card">
                  <div className="partnership-steps__content-card-icon">
                    <SVGIcon src={Icons.CheckRoundedGreen} width={28} height={28} />
                  </div>
                  <div className="partnership-steps__content-card-info">
                    <h5>Program is now live!</h5>
                    <p>Time to let the magic of our partnership happen.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


const PartnershipFAQ = () => {
  return (
    <div className="partnership-faq">
      <div className="container partnership-faq__container">
        <div className="partnership-faq__content">
          <h3 className='partnership-faq__content-title'>Frequently Asked Question</h3>
          <div className="partnership-faq__content-item-wrapper">
            <div className="partnership-faq__card-wrapper">
              <div className="partnership-faq__card-heading-wrapper">
                <a className="partnership-faq__card collapsed" data-bs-toggle="collapse" href="#FAQ1" role="button" aria-expanded="false" aria-controls="FAQ1">
                  <div className="partnership-faq__card-header-wrapper">
                    <h5>Do I have to pay a registration fee?</h5>
                  </div>
                  <SVGIcon src={Icons.Plus} width={20} height={20} />
                </a>
              </div>
              <div className="partnership-faq__special collapse" id="FAQ1">
                <div className="partnership-faq__card-row">
                  <p>Registration is free and you can do so easily.</p>
                </div>
              </div>
            </div>
            <div className="partnership-faq__card-wrapper">
              <div className="partnership-faq__card-heading-wrapper">
                <a className="partnership-faq__card collapsed" data-bs-toggle="collapse" href="#FAQ2" role="button" aria-expanded="false" aria-controls="FAQ2">
                  <div className="partnership-faq__card-header-wrapper">
                    <h5>GoForUmrah.com Partnership with Hotels</h5>
                  </div>
                  <SVGIcon src={Icons.Plus} width={20} height={20} />
                </a>
              </div>
              <div className="partnership-faq__special collapse" id="FAQ2">
                <div className="partnership-faq__card-row">
                  <p>Registration is free and you can do so easily.</p>
                </div>
              </div>
            </div>
            <div className="partnership-faq__card-wrapper">
              <div className="partnership-faq__card-heading-wrapper">
                <a className="partnership-faq__card collapsed" data-bs-toggle="collapse" href="#FAQ3" role="button" aria-expanded="false" aria-controls="FAQ3">
                  <div className="partnership-faq__card-header-wrapper">
                    <h5>What information is needed to describe my property?</h5>
                  </div>
                  <SVGIcon src={Icons.Plus} width={20} height={20} />
                </a>
              </div>
              <div className="partnership-faq__special collapse" id="FAQ3">
                <div className="partnership-faq__card-row">
                  <p>Registration is free and you can do so easily.</p>
                </div>
              </div>
            </div>
            <div className="partnership-faq__card-wrapper">
              <div className="partnership-faq__card-heading-wrapper">
                <a className="partnership-faq__card collapsed" data-bs-toggle="collapse" href="#FAQ4" role="button" aria-expanded="false" aria-controls="FAQ4">
                  <div className="partnership-faq__card-header-wrapper">
                    <h5>When will my property go live on GoForUmrah.com</h5>
                  </div>
                  <SVGIcon src={Icons.Plus} width={20} height={20} />
                </a>
              </div>
              <div className="partnership-faq__special collapse" id="FAQ4">
                <div className="partnership-faq__card-row">
                  <p>Registration is free and you can do so easily.</p>
                </div>
              </div>
            </div>


          </div>
          <div className="partnership-faq__content-link">
            <a href="#" className="partnership-faq__content-link">Read More</a>
            <SVGIcon src={Icons.ArrowCircleRight} width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  )
}


const PartnershipFooter = () => {
  return (
    <div className="partnership-footer">
      <div className="container partnership-footer__container">
        <div className="partnership-footer__content">
          <div className='partnership-footer__card'>
            <div className="partnership-footer__card-left">
              <div className="partnership-footer__card-left-header">
                <h1>Join Us Now!</h1>
                <p>Connect your properties with millions of GoForUmrah.com loyal customers across the globe. With all the features that we provide, you can grow together with us and elevate your business.</p>
              </div>
              <button className="partnership__left-btn btn btn-success btn-lg">Sign up for free</button>
            </div>
            <div className="partnership-footer__card-right">
              <div className="partnership-footer__image">
                <BlurPlaceholderImage alt='image' src={businessPartnershipAudienceFooter} width={538} height={378} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default Partnership
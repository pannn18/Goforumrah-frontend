import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { StaticImageData } from 'next/image'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import headerCoverLoyalty from '@/assets/images/header_cover_loyalty.png'
import loyaltyCardStandard from '@/assets/images/loyalty_card_standard.png'
import loyaltyCardPlus from '@/assets/images/loyalty_card_plus.png'
import loyaltyCardPrestige from '@/assets/images/loyalty_card_prestige.png'
import loyaltyDiscoverImage1 from '@/assets/images/loyalty_discover_image_1.png'
import loyaltyDiscoverImage2 from '@/assets/images/loyalty_discover_image_2.png'
import loyaltyDiscoverImage3 from '@/assets/images/loyalty_discover_image_3.png'
import loyaltyDiscoverImage4 from '@/assets/images/loyalty_discover_image_4.png'
import loyaltyDiscoverImage5 from '@/assets/images/loyalty_discover_image_5.png'
import loyaltyDiscoverImage6 from '@/assets/images/loyalty_discover_image_6.png'
import bannerHeroloyalty from '@/assets/images/Banner Image - goforumrah.com.jpg'
import { getCsrfToken } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import useFetch from '@/hooks/useFetch'


const Home = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <main className="loyalty">
        <header className={`loyalty__header`}>
          <div className="loyalty__header-bg">
            <BlurPlaceholderImage src={headerCoverLoyalty} alt={'Join Our Loyalty Program'} />
            <div className="loyalty__header-bg-overlay-shadow" />
          </div>
          <div className="container">
            <div className="loyalty__header-content">
              <h1 className="heading">Platinus Pass Loyalty Program</h1>
              <p className="subheading">Search low prices on hotels, homes and much more...</p>
            </div>
          </div>
        </header>

        <PlansSection />
        <DiscoverSection />
      </main>
      <Footer />
    </Layout>
  )
}

const PlansSection = () => {
  const router = useRouter()
  return(
    <section className='loyalty__plans'>
      <div className='loyalty__plans--heading'>
        <div className='container'>
          <div className='loyalty__plans-heading'>
            <h3 className='loyalty__plans-heading--title'>Membership Plans</h3>
            <p className='loyalty__plans-heading--subtitle'>Book flights to a destination popular with travelers from Indonesia</p>
          </div>
        </div>
      </div>
      <div className='loyalty__plans--content'>
        <div className='container'>
          <div className='loyalty__plans-cards'>
            <div className='loyalty__card'>
              <div className='loyalty__card-image'>
                <BlurPlaceholderImage src={loyaltyCardStandard} alt={'Loyalty Card Standard'} width={311} height={200} />
              </div>
              <div className='loyalty__card-body'>
                <div className='loyalty__card-price'>
                  <h3 className='loyalty__card-price--amount'>$ 99</h3>
                  <p className='loyalty__card-price--period'>/Annual</p>
                </div>
                <p className='loyalty__card-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <button className='btn btn-lg btn-success' onClick={() => {router.push('/loyalty/checkout')}}>Get Started</button>
              </div>
              <div className='loyalty__card-footer'>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Airport Lounges</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Mobile App</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Airport Service</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Membership</p>
                </div>
              </div>
            </div>
            <div className='loyalty__card loyalty__card--highlight'>
              <div className='loyalty__card-image'>
                <BlurPlaceholderImage src={loyaltyCardPlus} alt={'Loyalty Card Plus'} width={311} height={200} />
              </div>
              <div className='loyalty__card-body loyalty__card-body--highlight'>
                <div className='loyalty__card-header'>
                  <div className='loyalty__card-price'>
                    <h3 className='loyalty__card-price--amount'>$ 199</h3>
                    <p className='loyalty__card-price--period'>/Annual</p>
                  </div>
                  <span className='loyalty__card-chips'>Best Offer</span>
                </div>
                <p className='loyalty__card-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <button className='btn btn-lg btn-success' onClick={() => {router.push('/loyalty/checkout')}}>Get Started</button>
              </div>
              <div className='loyalty__card-footer'>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Airport Lounges</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Points</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Airmiles</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Early Bird Offers</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>10% Discount</p>
                </div>
              </div>
            </div>
            <div className='loyalty__card'>
              <div className='loyalty__card-image'>
                <BlurPlaceholderImage src={loyaltyCardPrestige} alt={'Loyalty Card Prestige'} width={311} height={200} />
              </div>
              <div className='loyalty__card-body'>
                <div className='loyalty__card-price'>
                  <h3 className='loyalty__card-price--amount'>$ 499</h3>
                  <p className='loyalty__card-price--period'>/Annual</p>
                </div>
                <p className='loyalty__card-description'>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <button className='btn btn-lg btn-success' onClick={() => {router.push('/loyalty/checkout')}}>Get Started</button>
              </div>
              <div className='loyalty__card-footer'>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Airport Lounges</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Hotel Longes</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Complementary  Room Night</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>25% Discount</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Metal Card Premium Card</p>
                </div>
                <div className='loyalty__card-benefit'>
                  <SVGIcon src={Icons.Check} width={24} height={24} />
                  <p>Health Insurance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const DiscoverSection = () => {
  return(
    <section className='loyalty__discover'>
      <div className='container'>
        <div className='loyalty__discover-wrapper'>
          <div className='loyalty__discover-heading'>
            <h3>Discover our range of lounges and other in-airport benefits</h3>
            <p>Escape into a place that's perfect for business and vacations. Our lounges are quiet, connected spaces to relax or work in, with pre-flight bites, drinks and other added perks that help you refresh and revive.</p>
          </div>
          <div className='loyalty__discover-content'>
            <div className='loyalty__box'>
              <div className='loyalty__box-image'>
                <BlurPlaceholderImage src={loyaltyDiscoverImage1} alt={'Discover Thumbnail'} width={347} height={200} />
              </div>
              <div className='loyalty__box-content'>
                <p className='loyalty__box-content-title'>A Lounge for Wherever Your Travel Takes You</p>
                <p className='loyalty__box-content-desc'>With a true global spread of lounges, we really do help you make the most of your membership. With 1,300 airport experiences in over 600 cities and 148 countries and more lounges being added every month, we look forward to helping you get even more out of your membership.</p>
              </div>
            </div>
            <div className='loyalty__box'>
              <div className='loyalty__box-image'>
                <BlurPlaceholderImage src={loyaltyDiscoverImage2} alt={'Discover Thumbnail'} width={347} height={200} />
              </div>
              <div className='loyalty__box-content'>
                <p className='loyalty__box-content-title'>Tranquillity, Service, Space, Comfort</p>
                <p className='loyalty__box-content-desc'>Sit down, stretch out, enjoy a pre-flight bite and a drink from the selection available, including free alcohol at most lounges.</p>
              </div>
            </div>
            <div className='loyalty__box'>
              <div className='loyalty__box-image'>
                <BlurPlaceholderImage src={loyaltyDiscoverImage3} alt={'Discover Thumbnail'} width={347} height={200} />
              </div>
              <div className='loyalty__box-content'>
                <p className='loyalty__box-content-title'>Keep Connected When Travelling</p>
                <p className='loyalty__box-content-desc'>With free Wi-Fi in most lounges you'll never be out of touch with friends, family and colleagues. And you can ensure your devices are all powered up before boarding by charging them in the lounge.</p>
              </div>
            </div>
            <div className='loyalty__box'>
              <div className='loyalty__box-image'>
                <BlurPlaceholderImage src={loyaltyDiscoverImage4} alt={'Discover Thumbnail'} width={347} height={200} />
              </div>
              <div className='loyalty__box-content'>
                <p className='loyalty__box-content-title'>An Enriched Mobile Experience</p>
                <p className='loyalty__box-content-desc'>Download the Priority Pass app to access your Digital Membership Card*, airport maps, and a host of other digital features to enrich your airport experience.</p>
              </div>
            </div>
            
            <div className='loyalty__box'>
              <div className='loyalty__box-image'>
                <BlurPlaceholderImage src={loyaltyDiscoverImage5} alt={'Discover Thumbnail'} width={347} height={200} />
              </div>
              <div className='loyalty__box-content'>
                <p className='loyalty__box-content-title'>Premium Service and Support</p>
                <p className='loyalty__box-content-desc'>Our Membership Services team has expert, multilingual advisors who are dedicated to helping you get the most out of your Priority Pass membership.</p>
              </div>
            </div>
            <div className='loyalty__box'>
              <div className='loyalty__box-image'>
                <BlurPlaceholderImage src={loyaltyDiscoverImage6} alt={'Discover Thumbnail'} width={347} height={200} />
              </div>
              <div className='loyalty__box-content'>
                <p className='loyalty__box-content-title'>Discover All of Your Membership Benefits</p>
                <p className='loyalty__box-content-desc'>Whether you are an occasional traveller or a frequent flyer, your benefits don’t stop at the airport. We offer more than just lounges, to explore your other benefits, from complimentary fitness memberships, to online duty free shopping or car rentals worldwide, click find out more.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home
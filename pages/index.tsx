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
import Header from '@/components/pages/home/header'
import BannerInfo from '@/components/pages/home/bannerInfo'
import PlanTripCategory from '@/components/pages/home/planTrip'
import ArticleCard from '@/components/cards/articleCard'
import HotelCard from '@/components/cards/hotelCard'
import DestinationCard from '@/components/cards/destinationCard'
import TourCard from '@/components/cards/tourCard'
import headerCoverHotel from '@/assets/images/home_header_cover_hotelx8.png'
import headerCoverFlights from '@/assets/images/home_header_cover_flights.png'
import headerCoverCarRental from '@/assets/images/home_header_cover_car_rental.png'
import headerCoverTourPackage from '@/assets/images/home_header_cover_tour_package.png'
import airlinePartner1 from '@/assets/images/airline_partner_emirates.png'
import airlinePartner2 from '@/assets/images/airline_partner_ia.png'
import airlinePartner3 from '@/assets/images/airline_partner_etihad.png'
import airlinePartner4 from '@/assets/images/airline_partner_qatar_airways.png'
import airlinePartner5 from '@/assets/images/airline_partner_flydubai.png'
import airlinePartner6 from '@/assets/images/airline_partner_garuda.png'
import airlinePartner7 from '@/assets/images/airline_partner_malaysia_airlines.png'
import airlinePartner8 from '@/assets/images/airline_partner_singapore_airlines.png'
import carBrand1 from '@/assets/images/car_brand_toyota.png'
import carBrand2 from '@/assets/images/car_brand_nissan.png'
import carBrand3 from '@/assets/images/car_brand_honda.png'
import carBrand4 from '@/assets/images/car_brand_bmw.png'
import planTrip1 from '@/assets/images/plan_trip_al_hawiyah.png'
import planTrip2 from '@/assets/images/plan_trip_al_huda.png'
import planTrip3 from '@/assets/images/plan_trip_al_juranah.png'
import planTrip4 from '@/assets/images/plan_trip_makkah.png'
import planTrip5 from '@/assets/images/plan_trip_masturah.png'
import planTrip6 from '@/assets/images/plan_trip_rabigh.png'
import featuredHotelimg1 from '@/assets/images/featured_hotel_golden_dune.png'
import featuredHotelimg2 from '@/assets/images/featured_hotel_karim.png'
import featuredHotelimg3 from '@/assets/images/featured_hotel_aloft.png'
import featuredHotelimg4 from '@/assets/images/featured_hotel_aloft_2.png'
import featuredBlog1 from '@/assets/images/featured_blog_1.png'
import featuredBlog2 from '@/assets/images/featured_blog_2.png'
import featuredBlog3 from '@/assets/images/featured_blog_3.png'
import trendingCities1 from '@/assets/images/trending_cities_1.png'
import trendingCities2 from '@/assets/images/trending_cities_2.png'
import trendingCities3 from '@/assets/images/trending_cities_3.png'
import popularDestination1 from '@/assets/images/popular_destinations_1.png'
import popularDestination2 from '@/assets/images/popular_destinations_2.png'
import popularDestination3 from '@/assets/images/popular_destinations_3.png'
import popularDestination4 from '@/assets/images/popular_destinations_4.png'
import popularTour1 from '@/assets/images/popular_tour_package_1.png'
import popularTour2 from '@/assets/images/popular_tour_package_2.png'
import popularTour3 from '@/assets/images/popular_tour_package_3.png'
import popularTour4 from '@/assets/images/popular_tour_package_4.png'
import placeholder from '@/assets/images/placeholder.svg'
import bannerHeroHomepage from '@/assets/images/Banner Image - goforumrah.com.jpg'
import { getCsrfToken } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import useFetch from '@/hooks/useFetch'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"


interface IProps {
  query: {
    search?: Services
  }
}

const header: {
  [service: string]: {
    title: string
    description?: string
    cover: StaticImageData
  }
} = {
  [Services.Hotel]: {
    title: 'Find your next stay',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverHotel,

  },
  [Services.Flights]: {
    title: 'Find the best flight',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverFlights
  },
  [Services.BookTransfer]: {
    title: 'Find your best ride',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverCarRental
  },
  [Services.TourPackage]: {
    title: 'Find your best Destination',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverTourPackage
  },
  [Services.Skyscanner]: {
    title: 'Find the best flight',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverFlights
  },
}

const Home = (props: IProps) => {
  const router = useRouter()
  const { query } = props
  const { search } = query

  const isSearchForService = Object.values(Services).includes(search)
  const [service, setService] = useState<Services>(isSearchForService ? search : Services.Hotel)
  const handleServiceChange = (selected: Services) => setService(selected)
  useEffect(() => {
    router.push({ pathname: '/', query: (service !== Services.Hotel && { search: service }) })
  }, [service])

  return (
    <Layout>
      <Navbar showCurrency={true} />

      <main className="homepage">
        <Header
          title={header[service].title}
          description={header[service]?.description}
          coverImage={(<BlurPlaceholderImage src={bannerHeroHomepage} alt={header[service].title} />)}
          service={service}
          onServiceChange={handleServiceChange} />

        <BannerSection service={service} />

        <PlanTripSection service={service} />

        <TrendingCitiesSection service={service} />
        <AirlinePartnerSection service={service} />

        <PopularCarBrandsSection service={service} />
        <PopularDestinationsSection service={service} />

        <PopularTourPackage service={service} />

        <HotelRecommendationSection service={service} />

        <InspirationTripSection />
      </main>

      <Footer />
    </Layout>
  )
}

Home.getInitialProps = ({ query }) => {
  return {
    query
  }
}


const BannerSection = (props: { service: Services }) => {
  const bannerInfo: {
    [service: string]: {
      title: string
      description: string
      icon: string
      linkText: string
      linkURL: string
    }
  } = {
    [Services.Hotel]: {
      title: 'Keep calm with health protocol',
      description: 'Get the advice you need. Check the latest COVID-19 restrictions before you travel.',
      icon: Icons.FaceMask,
      linkText: 'Learn More',
      linkURL: '#'
    },
    [Services.BookTransfer]: {
      title: 'Clean cars. Flexible bookings. Socially distant rental counters.',
      description: 'We’re working with our partners to keep you safe and in the driving seat.',
      icon: Icons.Car,
      linkText: 'Learn More',
      linkURL: '#'
    }
  }

  const hasBannerInfoSection = Object.keys(bannerInfo).includes(props.service)

  return hasBannerInfoSection && (
    <section>
      <div className="container">
        <BannerInfo {...bannerInfo[props.service]} />
      </div>
    </section>
  )
}

const PlanTripSection = (props: { service: Services }) => {
  const hasPlanTripSection = [Services.Hotel, Services.TourPackage].includes(props.service)

  const { error, ok, data, loading } = useFetch('/homepage/perfect-trip', 'GET')

  return hasPlanTripSection && (
    <>
      {(data && !loading) && (
        <section>
          <div className="container">
            <div className="section-heading">
              <h3 className="section-heading__title">Plan your perfect trip</h3>
              <div className="section-heading__description">Search Flights, Hotels & Car Hire to our most popular destinations.</div>
            </div>
            <div className="homepage__plan-trip row row-cols-2 row-cols-sm-3 row-cols-lg-6 justify-content-center gx-4 gy-4">
              {data.map(({ icon, city, accommodations }, index) => (
                <div className="col" key={`plan-trip-${index}`}>
                  <PlanTripCategory image={icon} title={city} description={`${accommodations || 0} accommodations`} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const TrendingCitiesSection = (props: { service: Services }) => {
  const hasTrendingCitiesSection = [Services.Flights].includes(props.service)

  return hasTrendingCitiesSection && (
    <section>
      <div className="container">
        <div className="section-heading">
          <h3 className="section-heading__title">Trending cities</h3>
          <div className="section-heading__description">Book flights to a destination popular with travelers from Indonesia</div>
        </div>
        <div className="homepage__trending-cities row row-cols-1 row-cols-md-3 g-4">
          <div className="col">
            <div className="card-trending-city">
              <div className="card-trending-city__bg-image">
                <BlurPlaceholderImage src={trendingCities1} alt="Trending City" width={450} height={250} />
              </div>
              <div className="card-trending-city__bg-overlay" />
              <div className="card-trending-city__details">
                <h5 className="card-trending-city__title">Madinah</h5>
                <div className="card-trending-city__description">
                  <SVGIcon src={Icons.Flight} width={24} height={24} />
                  <div>Flights from Jakarta</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card-trending-city">
              <div className="card-trending-city__bg-image">
                <BlurPlaceholderImage src={trendingCities2} alt="Trending City" width={450} height={250} />
              </div>
              <div className="card-trending-city__bg-overlay" />
              <div className="card-trending-city__details">
                <h5 className="card-trending-city__title">Makkah</h5>
                <div className="card-trending-city__description">
                  <SVGIcon src={Icons.Flight} width={24} height={24} />
                  <div>Flights from Jakarta</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card-trending-city">
              <div className="card-trending-city__bg-image">
                <BlurPlaceholderImage src={trendingCities3} alt="Trending City" width={450} height={250} />
              </div>
              <div className="card-trending-city__bg-overlay" />
              <div className="card-trending-city__details">
                <h5 className="card-trending-city__title">Jeddah</h5>
                <div className="card-trending-city__description">
                  <SVGIcon src={Icons.Flight} width={24} height={24} />
                  <div>Flights from Jakarta</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const AirlinePartnerSection = (props: { service: Services }) => {
  const hasAirlinePartnerSection = [Services.Flights].includes(props.service)

  const [airlines, setAirlines] = useState<{ id_airline_partners, name_partner, icon }[]>([])
  const { error, ok, data, loading } = useFetch('/homepage/airline-partners', 'GET')

  useEffect(() => {
    if (!loading && data && ok) {
      setAirlines(data)
    }
  }, [loading, data, ok])

  return hasAirlinePartnerSection && (
    <>
      {(airlines?.length && !loading) && (
        <section>
          <div className="container">
            <div className="section-heading">
              <h3 className="section-heading__title">Our airline partners</h3>
              <div className="section-heading__description">With various partner airlines, we are ready to fly you anywhere.</div>
            </div>
            <div className="row row-cols-2 row-cols-sm-4 g-4">
              {airlines.map(({ id_airline_partners, name_partner, icon }, index) => (
                <div className="col" key={`airline-${id_airline_partners}`}>
                  <div className="card-brand">
                    <BlurPlaceholderImage src={icon} alt={name_partner} width={80} height={56} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const PopularCarBrandsSection = (props: { service: Services }) => {
  const hasPopularCarBrandsSection = [Services.BookTransfer].includes(props.service)

  const [brands, setBrands] = useState<{ id_car_brands, name_brand, icon }[]>([])
  const { error, ok, data, loading } = useFetch('/homepage/car-brands', 'GET')

  useEffect(() => {
    if (!loading && data && ok) {
      setBrands(data)
    }
  }, [loading, data, ok])

  return hasPopularCarBrandsSection && (
    <>
      {(brands?.length && !loading) && (
        <section>
          <div className="container">
            <div className="section-heading">
              <h3 className="section-heading__title">Popular car hire brands</h3>
              <div className="section-heading__description">With various partner airlines, we are ready to fly you anywhere.</div>
            </div>
            <div className="row row-cols-2 row-cols-sm-4 g-4">
              {brands.map(({ id_car_brands, name_brand, icon }, index) => (
                <div className="col" key={`car-brand-${id_car_brands}`}>
                  <div className="card-brand">
                    <BlurPlaceholderImage src={icon} alt={name_brand} width={78} height={56} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const PopularDestinationsSection = (props: { service: Services }) => {
  const { changePrice, currencySymbol } = UseCurrencyConverter();
  const hasPopularDestinationsSection = [Services.BookTransfer].includes(props.service)
  const destinations = [
    { image: popularDestination1, title: 'Makkah', price: { amount: `${currencySymbol}${changePrice(50.00)}`, description: 'day' }, linkURL: '/tour-details' },
    { image: popularDestination2, title: 'Madinah', price: { amount: `${currencySymbol}${changePrice(56.00)}`, description: 'day' }, linkURL: '/tour-details' },
    { image: popularDestination3, title: 'Jeddah', price: { amount: `${currencySymbol}${changePrice(72.00)}`, description: 'day' }, linkURL: '/tour-details' },
    { image: popularDestination4, title: 'Riyadh', price: { amount: `${currencySymbol}${changePrice(72.00)}`, description: 'day' }, linkURL: '/tour-details' },
  ]

  return hasPopularDestinationsSection && (
    <section>
      <div className="container">
        <div className="section-heading">
          <h3 className="section-heading__title">Popular destinations for book transfers</h3>
          <div className="section-heading__description">Know your destination like your own city.</div>
        </div>
        <div className="row row-cols-2 row-cols-md-4 g-4">
          {destinations.map((destination, index) => (
            <div key={index} className="col">
              <DestinationCard {...destination} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PopularTourPackage = (props: { service: Services }) => {
  const hasPopularTourPackage = [Services.TourPackage].includes(props.service)

  const [items, setItems] = useState<{
    id_tour_package: number
    package_name: string
    address: string
    description: string
    total_day: string
    price: string
    rating: number
    tour_photos: string
  }[]>([])
  const { error, ok, data, loading } = useFetch('/tour-package/show-all', 'POST', { recomended: 1 })

  useEffect(() => {
    if (!loading && data && ok) {
      setItems(data)
    }
  }, [loading, data, ok])

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  return hasPopularTourPackage && (
    <>
      {(items?.length && !loading) && (
        <section>
          <div className="container">
            <div className="section-heading">
              <h3 className="section-heading__title">Popular Tour Package</h3>
              <div className="section-heading__description">With various partner airlines, we are ready to fly you anywhere.</div>
            </div>
            <div className="homepage__tours row row-cols-2 row-cols-md-3 row-cols-lg-4 g-4 ">
              {items.map((item, index) => (
                <div key={index} className="col">
                  <div className="tour-card">
                    <div className="tour-card__image">
                      <BlurPlaceholderImage src={item.tour_photos || placeholder} alt={item.package_name} width={512} height={512} />
                    </div>
                    <div className="tour-card__details">
                      <div>
                        <div className="tour-card__location fs-lg">
                          <SVGIcon className="tour-card__location-icon" src={Icons.MapPin} width={24} height={24} />
                          <div className="tour-card__location-name">{item.address}</div>
                        </div>
                        <Link href={`/tour/${item.id_tour_package}`} className="stretched-link">
                          <h5 className="tour-card__title">{item.package_name}</h5>
                        </Link>
                      </div>
                      <div className="tour-card__bottom-content">
                        <div className="tour-card__duration">
                          <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                          <div>{item.total_day} {parseFloat(item.total_day || '0') > 1 ? 'days' : 'day'}</div>
                        </div>
                        <div className="tour-card__price">
                          <div>Start from </div>
                          <div className="fs-xl fw-bold">{currencySymbol} {changePrice(item.price)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

const HotelRecommendationSection = (props: { service: Services }) => {
  const hasHotelRecommendationSection = [Services.Hotel, Services.Flights].includes(props.service)
  const [tabs, setTabs] = useState<{ [city: string]: [{ id_hotel, property_name, star_rating, street_address, street_address2, hotel_photo, price_per_night }] }>({})
  const [selectedTab, setSelectedTab] = useState<string>()
  const { error, ok, data, loading } = useFetch('/homepage/featured-hotels', 'GET')
  
  const { changePrice, currencySymbol } = UseCurrencyConverter();

  useEffect(() => {
    if (!loading && data && ok) {
      const tabs = {}

      data.length && data.map(({ city, hotels }) => {
        tabs[city] = hotels
      })

      setTabs(tabs)
      setSelectedTab(Object.keys(tabs)[0])
    }
  }, [loading, data, ok])

  return hasHotelRecommendationSection && (
    <>
      {(Object.keys(tabs)?.length && !loading) && (
        <section>
          <div className="container">
            <div className="section-heading">
              <h3 className="section-heading__title">Featured hotels recommended for you</h3>
              <div className="section-heading__description section-heading__description--mt-lg align-self-stretch">
                <div className="homepage__hotels-tabs-menu">
                  {Object.keys(tabs).map((tab, index) => (
                    <button
                      key={index}
                      className={`btn ${tab === selectedTab ? 'active' : ''}`}
                      onClick={() => setSelectedTab(tab)}>
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="homepage__hotels row row-cols-2 row-cols-md-4 g-4">
              {tabs[selectedTab].length
  ? tabs[selectedTab]
      .filter((_, index) => index < 4)
      .map((hotel) => {
        console.log("FEATURED HOTEL OBJECT:", hotel)
        console.log("RAW price_per_night:", hotel.price_per_night, "type:", typeof hotel.price_per_night)
        console.log("changePrice(price_per_night):", changePrice(hotel.price_per_night))

        return (
          <div key={`featured-hotel-${hotel.id_hotel}`} className="col">
            <HotelCard
              title={hotel.property_name}
              image={hotel.hotel_photo}
              location={hotel.street_address}
              price={{
                amount: `${currencySymbol} ${changePrice(hotel.price_per_night)}`,
                description: "night",
              }}
              linkURL={`/hotel/detail?id=${hotel.id_hotel}`}
            />
          </div>
        )
      })
  : (
    <div style={{ width: '100%', margin: 'auto', textAlign: 'center' }}>
      We're sorry, but we couldn't find any featured hotels on {selectedTab}. It seems that there are no hotels currently available.
    </div>
  )
}

            </div>
          </div>
        </section>
      )}
    </>
  )
}

const InspirationTripSection = () => {
  const [blogs, setBlogs] = useState<{ id_blog, id_blog_category, title, title_icon, datetime, content, featured, soft_delete, created_at, updated_at }[]>([])
  const { error, ok, data, loading } = useFetch('/homepage/blogs', 'GET')

  useEffect(() => {
    if (!loading && data && ok) {
      setBlogs(data)
    }
  }, [loading, data, ok])

  return (
    <>
      {(blogs?.length && !loading) && (
        <section>
          <div className="container">
            <div className="section-heading">
              <h3 className="section-heading__title">Get inspiration for your next trip</h3>
              <div className="section-heading__description">Know your destination like your own city.</div>
            </div>
            <div className="homepage__inspiration-trip row gx-4 gy-7 gy-lg-5">
              {blogs.filter((_, index) => index < 3).map(({ id_blog, title, title_icon, content }, index) => (
                <div className={`${index % 3 === 0 ? 'col col-lg-6' : 'col col-lg-3'}`} key={`featured-blog-${id_blog}`}>
                  <ArticleCard
                    image={title_icon}
                    title={title}
                    description={content}
                    linkURL={`/blog/detail?id=${id_blog}`} />
                </div>
              ))}
            </div>
            <div className="homepage__inspiration-trip-cta">
              <Link href="/blog" className="link-green-01">
                <div>Read all blogs</div>
                <SVGIcon src={Icons.ArrowCircleRight} width={24} height={24} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default Home
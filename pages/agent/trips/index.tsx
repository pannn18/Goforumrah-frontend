import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { StaticImageData } from 'next/image'
import { Icons, Images, AgentServices } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import AgentNavbar from "@/components/layout/agentNavbar"
import Footer from '@/components/layout/footer'
import Header from '@/components/pages/agent/header'
import BannerInfo from '@/components/pages/home/bannerInfo'
import headerCoverHotel from '@/assets/images/home_header_cover_hotelx8.png'
import headerCoverFlights from '@/assets/images/home_header_cover_flights.png'
import headerCoverCarRental from '@/assets/images/home_header_cover_car_rental.png'
import headerCoverTourPackage from '@/assets/images/home_header_cover_tour_package.png'

interface IProps {
  query: {
    search?: AgentServices
  }
}

const header: {
  [service: string]: {
    title: string
    description?: string
    cover: StaticImageData
  }
} = {
  [AgentServices.Hotel]: {
    title: 'Finding your trips',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverHotel,

  },
  [AgentServices.Flights]: {
    title: 'Find the best flight',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverFlights
  },
  [AgentServices.BookTransfer]: {
    title: 'Find your best ride',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverCarRental
  },
  [AgentServices.TourPackage]: {
    title: 'Find your best Destination',
    description: 'Search low prices on hotels, homes and much more...',
    cover: headerCoverTourPackage
  }
}

const Home = (props: IProps) => {
  const router = useRouter()
  const { query } = props
  const { search } = query

  const isSearchForService = Object.values(AgentServices).includes(search)
  const [service, setService] = useState<AgentServices>(isSearchForService ? search : AgentServices.Hotel)
  const handleServiceChange = (selected: AgentServices) => setService(selected)
  useEffect(() => {
    router.push({ pathname: '/agent/trips', query: (service !== AgentServices.Hotel && { search: service }) })
  }, [service])

  // console.log([service]);

  return (
    <Layout>
      <AgentNavbar />
      <main className="agent">
        <Header
          title={header[service].title}
          description={header[service]?.description}
          coverImage={(<BlurPlaceholderImage src={header[service].cover} alt={header[service].title} />)}
          service={service}
          onServiceChange={handleServiceChange} />

        <BannerSection service={service} />
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


const BannerSection = (props: { service: AgentServices }) => {
  const bannerInfo: {
    [service: string]: {
      title: string
      description: string
      icon: string
      linkText: string
      linkURL: string
    }
  } = {
    [AgentServices.Hotel]: {
      title: 'Keep calm with health protocol',
      description: 'Get the advice you need. Check the latest COVID-19 restrictions before you travel.',
      icon: Icons.FaceMask,
      linkText: 'Learn More',
      linkURL: '#'
    },
    [AgentServices.Flights]: {
      title: 'Select your preferred seat.',
      description: "Don't miss out on your next adventure. Book now and soar the skies!",
      icon: Icons.Flight,
      linkText: 'Learn More',
      linkURL: '#'
    },
    [AgentServices.TourPackage]: {
      title: 'Discover the world with our all-inclusive tour packages.',
      description: 'Explore iconic destinations, savor local cuisine, and create unforgettable memories. Your adventure starts here, book now!',
      icon: Icons.SunHorizon,
      linkText: 'Learn More',
      linkURL: '#'
    },
    [AgentServices.BookTransfer]: {
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

export default Home
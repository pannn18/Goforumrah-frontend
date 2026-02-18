import React, { use } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { callAPI } from '@/lib/axiosHelper'
import { Services } from '@/types/enums'
import { getEnumAsArray } from '@/lib/enumsHelper'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BookingHotel from '@/components/pages/booking/hotels'
import BookingFlights from '@/components/pages/booking/flights'
import BookingBookTransfer from '@/components/pages/booking/book-transfer'
import BookingTourPackage from '@/components/pages/booking/tour'
import { getSession, useSession } from "next-auth/react"
import LoadingOverlay from '@/components/loadingOverlay/index'

import BookingDetails from '@/components/pages/booking/tour/details'
import BookingHeader from '@/components/pages/booking/header'


interface IProps {
  data: any;
}

const Booking = (props: IProps) => {
  const router = useRouter();
  const service = Services.TourPackage
  const session = useSession();

  //Retrive Data from API
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const { idTour, id_plan, start_date, tickets } = router.query;

  // if (session.status === "unauthenticated") {
  //   router.push(`/booking/tour?id=${id}&id_plan=${id_plan}&start_date=${start_date}&tickets=${tickets}&status=unauthenticated`);
  // }

  useEffect(() => {
    const fetchDataTour = async () => {
      const isStartDateValid = moment(start_date, 'YYYY-MM-DD', true).isValid()

      if (!isStartDateValid) {
        return {
          notFound: true,
        };
      }

      try {
        const { status, data, ok, error } = await callAPI(`/tour-package/tour-details`, 'POST', { "id_tour_package": idTour })
        if (ok && data) {
          setData(data)
        }
        setLoading(false)
      } catch (error) {
        setError(error)
        setLoading(false)
      }
    }

    if (service === Services.TourPackage) {
      fetchDataTour();
    } else {
      setLoading(false);
    }
  }, [router.query])

  if (loading) {
    return <LoadingOverlay />
  }

  if (error) {
    return {
      notFound: true,
    }
  }

  const handlePreviousStep = () => {
    router.push(`/tour/${idTour}?date=${start_date}`)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <Layout>
      <Navbar showCurrency={true} selectedServiceTab={service} />
      <main className="booking-hotel booking-flight">
        <BookingHeader current={'details'} handlePreviousStep={handlePreviousStep} />
        <BookingDetails data={data} />
      </main>
      <Footer />
    </Layout>
  )
}

export default Booking
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
import BookingHeader from '@/components/pages/booking/header'
import BookingPayment from '@/components/pages/booking/hotels/payment'
import BookingConfirmation from '@/components/pages/booking/hotels/confirmation'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'

// Retrieve Data from APIs
export async function getServerSideProps(context) {  
  const idHotel = context.params?.idHotel;
  const idHotelBooking = context.params?.idHotelBooking;

  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session?.user) {
    // Redirect to the specified URL
    return {
      redirect: {
        destination: `/hotel/detail?id=${idHotel}&status=unauthenticated`,
        permanent: false,
      },
    };
  }

  const resolvedUrl = context?.resolvedUrl || '/'

  const { status, data, ok, error } = await callAPI('/hotel-booking/detail', 'POST', { id_hotel_booking: idHotelBooking }, true, session.user.accessToken)
  
  if (ok) {            
    if(data.status === 0){
      return {
        redirect: {
          destination: `/booking/hotel/${data?.id_hotel}/${data?.id_hotel_booking}`,
          permanent: false,
        },
      };
    }else{
      return {
        props: {
          data,
          idHotelBooking,
        },
      };
    }
  } else {
    return {
      notFound: true,
    };
  }
}

interface IProps {
  idHotelBooking: any
  data: any
}
const Booking = (props: IProps) => {
  const router = useRouter();
  const service = Services.Hotel
  const session = useSession();

  const { data, idHotelBooking } = props;               
  
  const handlePreviousStep = () => {
    router.back();
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <>
      <Layout>
        <Navbar showCurrency={true} selectedServiceTab={service} />
          <main className="booking-hotel booking-flight">
            <BookingHeader current={'confirmation'} handlePreviousStep={handlePreviousStep} />
            <BookingConfirmation data={data} />
          </main>
        <Footer />
      </Layout>
    </>
  )
}

export default Booking
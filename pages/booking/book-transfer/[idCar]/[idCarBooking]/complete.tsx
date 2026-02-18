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
import BookingCar from '@/components/pages/booking/book-transfer'
import { getSession, useSession } from "next-auth/react"
import BookingHeader from '@/components/pages/booking/header'
import BookingDetails from '@/components/pages/booking/book-transfer/details'
import BookingConfirmation from '@/components/pages/booking/book-transfer/confirmation'
import BookingPayment from '@/components/pages/booking/book-transfer/payment'
import LoadingOverlay from '@/components/loadingOverlay/index'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'

// Retrieve Data from APIs
export async function getServerSideProps(context) {
  const idCarBooking = context.params?.idCarBooking;
  const idCar = context.params?.idCar;

  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session?.user) {
    // Redirect to the specified URL
    return {
      redirect: {
        destination: `/car/detail?id=${idCar}&status=unauthenticated`,
        permanent: false,
      },
    };
  }

  const { status, data, ok, error } = await callAPI('/car-business-booking/show-booking', 'POST', {id_car_booking: idCarBooking}, true, session.user.accessToken);
  // console.log(status, data, ok, error);
  
  if (ok) {
    return {
      props: {
        idCarBooking,
        data,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}

interface IProps {
  idCarBooking: any
  data: any
}
const Booking = (props: IProps) => {
  const router = useRouter();
  const service = Services.BookTransfer
  const session = useSession();

  const { idCarBooking, data } = props;

  // if(data?.[0]?.status === 0){
  //   router.push(`/booking/book-transfer/${data?.[0]?.id_car_business_fleet}/${data?.[0]?.id_car_booking}`);
  // }

  if (session.status === "unauthenticated") {
    router.push(`/car/detail?id=${idCarBooking}&checkin=${data?.pickup_date_time}&checkout=${data?.dropoff_date_time}&status=unauthenticated`);
  }

  const handlePreviousStep = () => {
    router.back();
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  // console.log("data fetched on booking payment car : ", data)

  return (
    <Layout>
      <Navbar showCurrency={true} selectedServiceTab={service}/>
      <main className="booking-hotel">
        <BookingHeader current={'confirmation'} handlePreviousStep={handlePreviousStep} />
        <BookingConfirmation data={data} />
      </main>
      <Footer />
    </Layout>
  )
}

export default Booking
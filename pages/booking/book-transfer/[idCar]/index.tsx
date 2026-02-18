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
  const idCar = context.params?.idCar;
  const { checkin, checkout } = context.query || {};

  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session?.user) {
    // Redirect to the specified URL
    return {
      redirect: {
        destination: `/car/detail?id=${idCar}${checkin ? `&checkin=${checkin}` : ''}${checkout ? `&checkout=${checkout}` : ''}&status=unauthenticated`,
        permanent: false,
      },
    };
  }

  if(checkin === undefined || checkout === undefined) {
    return {
      redirect: {
        destination: `/car/detail?id=${idCar}${!session?.user ? `&status=unauthenticated` : ''}`,
        permanent: false,
      },
    };
  }

  const payload = {
    id_car_business_fleet: idCar,
    pickup_date_time: checkin,
    dropoff_date_time: checkout,
  };

  const { status, data, ok, error } = await callAPI("/car-business-booking/car-details", "POST", payload, true, session.user.accessToken);
  console.log(status, data, ok, error);

  
  if (ok) {
    return {
      props: {
        idCar,
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
  data: any
  idCar: any
}

const Booking = (props: IProps) => {
  const router = useRouter();
  const service = Services.BookTransfer
  const session = useSession();

  const { data, idCar } = props;
  const { checkin, checkout} = router.query;

  if (session.status === "unauthenticated") {
    router.push(`/car/detail?id=${idCar}&checkin=${checkin}&checkout=${checkout}&status=unauthenticated`);
  }

  const handlePreviousStep = () => {
    router.back();
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  console.log("data fetched on booking payment car : ", data)

  return (
    <Layout>
      <Navbar showCurrency={true} selectedServiceTab={service}/>
      <main className="booking-hotel">
        <BookingHeader current={'details'} handlePreviousStep={handlePreviousStep} />
        <BookingDetails data={data} />
      </main>
      <Footer />
    </Layout>
  )
}

export default Booking
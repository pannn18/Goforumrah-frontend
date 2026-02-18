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
import BookingDetails from '@/components/pages/booking/hotels/details'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'


// Retrieve Data from APIs
export async function getServerSideProps(context) {
  const id_hotel = context.params?.idHotel;
  const {
    id_hotel_layout: id_hotel_layout,
    checkin: check_in,
    checkout: check_out,
  } = context.query || {};

  const session = await getServerSession(context.req, context.res, authOptions)
  if (!session?.user) {
    // Redirect to the specified URL
    return {
      redirect: {
        destination: `/hotel/detail?id=${id_hotel}${check_in ? `&checkin=${check_in}` : ''}${check_out ? `&checkout=${check_out}` : ''}&status=unauthenticated`,
        permanent: false,
      },
    };
  }

  if(check_in === undefined || check_out === undefined) {
    return {
      redirect: {
        destination: `/hotel/detail?id=${id_hotel}${!session?.user ? `&status=unauthenticated` : ''}`,
        permanent: false,
      },
    };
  }

  const isCheckinValid = moment(check_in, "YYYY-MM-DD", true).isValid();
  const isCheckoutValid = moment(check_out, "YYYY-MM-DD", true).isValid();

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const defaultCheckin = tomorrow.toISOString().split("T")[0];
  const defaultCheckout = dayAfterTomorrow.toISOString().split("T")[0];

  const checkin = isCheckinValid ? check_in : defaultCheckin;
  const checkout = isCheckoutValid ? check_out : defaultCheckout;

  const payload = {
    id_hotel,
    id_hotel_layout,
    check_in: checkin,
    check_out: checkout,
  };
  const payloadSelectedRoom = {
    id_hotel,
    id_hotel_layout,
    check_in: checkin,
    check_out: checkout,
  };

  const { status, data, ok, error } = await callAPI("/hotel/detail", "POST", payload);
  const { status : statusSelectedRoom, data : dataSelectedRoom, ok : okSelectedRoom, error : errorSelectedRoom } = await callAPI("/hotel/selected-layout", "POST", payloadSelectedRoom);
  // console.log(status, data, ok, error);

  if (ok && okSelectedRoom) {
    return {
      props: {
        data: {
          ...data,
          ...dataSelectedRoom,
          check_in: checkin,
          check_out: checkout,
        },
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
}
const Booking = (props: IProps) => {
  const router = useRouter();
  const service = Services.Hotel
  const session = useSession();

  const { data } = props
  const { id, checkin, checkout } = router.query;
  // console.log("Router Query : ", id, checkin, checkout);

  if (session.status === "unauthenticated") {
    router.push(`/hotel/detail?id=${id}&checkin=${checkin}&checkout=${checkout}&status=unauthenticated`);
  }

  const handlePreviousStep = () => {
    router.push(`/hotel/detail?id=${data.id_hotel}`)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <Layout>
      <Navbar showCurrency={true} selectedServiceTab={service} />
        <main className="booking-hotel booking-flight">
          <BookingHeader current={'payment'} handlePreviousStep={handlePreviousStep} />
          <BookingDetails data={data}/>
        </main>
      <Footer />
    </Layout>
  )
}

export default Booking
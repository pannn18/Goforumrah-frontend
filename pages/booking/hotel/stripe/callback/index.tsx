import LoadingOverlay from '@/components/loadingOverlay'
import { callAPI } from '@/lib/axiosHelper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export const getServerSideProps: GetServerSideProps<{
  hotelID: number
  hotelBookingID: number
  paymentIntent: string
  redirectStatus: string
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) return { notFound: true }

  const paymentIntent = (context.query?.payment_intent || '') as string
  const redirectStatus = (context.query?.redirect_status || '') as string

  if (!paymentIntent || !redirectStatus) return { notFound: true }

  const { ok, data, status, error } = await callAPI('/hotel-booking/detail', 'POST', { payment_intent: paymentIntent }, true, session.user.accessToken)

  if (ok) {
    if ([2, 3, 4].includes(data?.status)) return { notFound: true }

    if (data?.id_hotel_booking && data?.id_hotel) {
      return {
        props: {
          hotelID: data.id_hotel,
          hotelBookingID: data.id_hotel_booking,
          paymentIntent,
          redirectStatus
        }
      }
    }
  }

  return {
    notFound: true,
  }
}


export default function Page({
  hotelID,
  hotelBookingID,
  paymentIntent,
  redirectStatus
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    (async () => {
      const payload = {
        id_hotel_booking: hotelBookingID
      }

      if (redirectStatus === 'succeeded') {
        const { ok } = await callAPI('/hotel-booking/confirm', 'POST', payload, true)

        if (!ok) {
          return setError('Stripe succeeded but failed to update booking status on our server');
        }

        router.replace(`/booking/hotel/${hotelID}/${hotelBookingID}/complete`)
      } else if (redirectStatus === 'processing') {
        // Processing the order
      } else {
        const { ok } = await callAPI('/hotel-booking/cancel', 'POST', payload, true)

        if (!ok) {
          return setError('Stripe canceled but failed to update booking status on our server');
        }

        router.replace(`/`)
      }
    })()
  }, [])


  return (
    <LoadingOverlay title={error ? 'An Error Occured' : ''} subtitle={error || ''} />
  )
}
import LoadingOverlay from '@/components/loadingOverlay'
import { callAPI } from '@/lib/axiosHelper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export const getServerSideProps: GetServerSideProps<{
  idCar: number
  idCarBooking: number
  paymentIntent: string
  redirectStatus: string
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) return { notFound: true }

  const paymentIntent = (context.query?.payment_intent || '') as string
  const redirectStatus = (context.query?.redirect_status || '') as string

  if (!paymentIntent || !redirectStatus) return { notFound: true }

  const { ok, data, status, error } = await callAPI('/car-business-booking/show-booking', 'POST', { payment_intent: paymentIntent }, true, session.user.accessToken)

  if (ok) {
    if ([2, 3, 4].includes(data?.status)) return { notFound: true }

    if (data?.id_car_booking && data?.id_car_business_fleet) {
      return {
        props: {
          idCar: data.id_car_business_fleet,
          idCarBooking: data.id_car_booking,
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
  idCar,
  idCarBooking,
  paymentIntent,
  redirectStatus
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [error, setError] = useState<string>('')

  useEffect(() => {
    (async () => {
      const payload = {
        id_car_booking: idCarBooking
      }

      if (redirectStatus === 'succeeded') {
        const { ok } = await callAPI('/car-business-booking/confirm', 'POST', { id_car_booking: idCarBooking }, true)

        if (!ok) {
          return setError('Stripe succeeded but failed to update booking status on our server 1');
        }

        router.replace(`/booking/book-transfer/${idCar}/${idCarBooking}/complete`)
      } else if (redirectStatus === 'processing') {
        // Processing the order
      } else {
        const { ok } = await callAPI('/car-business-booking/cancel', 'POST', payload, true)

        if (!ok) {
          return setError('Stripe canceled but failed to update booking status on our server 2');
        }

        router.replace(`/`)
      }
    })()
  }, [])


  return (
    <LoadingOverlay title={error ? 'An Error Occured' : ''} subtitle={error || ''} />
  )
}
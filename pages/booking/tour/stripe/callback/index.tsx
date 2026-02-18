import LoadingOverlay from '@/components/loadingOverlay'
import { callAPI } from '@/lib/axiosHelper'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export const getServerSideProps: GetServerSideProps<{
    tourID: number
    tourBookingID: number
    paymentIntent: string
    redirectStatus: string
}> = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user) return { notFound: true }

    const paymentIntent = (context.query?.payment_intent || '') as string
    const redirectStatus = (context.query?.redirect_status || '') as string

    if (!paymentIntent || !redirectStatus) return { notFound: true }

    const { ok, data, status, error } = await callAPI('/tour-package/show-booking', 'POST', { payment_intent: paymentIntent }, true, session.user.accessToken)

    if (ok) {
        if ([2, 3, 4].includes(data?.status)) return { notFound: true }

        if (data?.id_tour_booking && data?.id_tour_package) {
            return {
                props: {
                    tourID: data.id_tour_package,
                    tourBookingID: data.id_tour_booking,
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
    tourID,
    tourBookingID,
    paymentIntent,
    redirectStatus
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [error, setError] = useState<string>('')

    useEffect(() => {
        (async () => {
            const payload = {
                id_tour_booking: tourBookingID
            }

            const payloadCancel = {
                id_tour_booking: tourBookingID,
                status: 4
            }

            if (redirectStatus === 'succeeded') {
                const { ok, data, status, error } = await callAPI('/tour-package/mark-as-completed', 'POST', payload, true)

                if (!ok) {
                    return setError('Stripe succeeded but failed to update booking status on our server 1')
                }

                router.replace(`/booking/tour/${tourID}/${tourBookingID}/complete`)
            } else if (redirectStatus === 'processing') {

            } else {
                const { ok } = await callAPI('/tour-package/update-status-booking', 'POST', payloadCancel, true)

                if (!ok) {
                    return setError('Stripe canceled but failed to update booking status on our server 2')
                }

                router.replace(`/`)
            }
            
        })()
    }, []) 
}
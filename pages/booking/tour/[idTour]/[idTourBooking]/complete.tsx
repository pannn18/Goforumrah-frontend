import React from "react";
import { useRouter } from "next/router";
import { callAPI } from "@/lib/axiosHelper";
import { Services } from "@/types/enums";

import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'

import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'

import { useSession } from "next-auth/react";
import BookingHeader from '@/components/pages/booking/header'

import BookingConfirmation from '@/components/pages/booking/tour/confirmation'


// Retrieve Data from APIs
export async function getServerSideProps(context) {
    const id_tour_package = context.params?.idTour;
    const id_tour_booking = context.params?.idTourBooking;

    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user) {
        // redirect to specified url
        return {
            redirect: {
                destination: `/tour/${id_tour_package}&status=unauthenticated`,
                permanent: false,
            }
        }
    }


    const resolvedUrl = context?.resolvedUrl || '/'

    const { status, data, ok, error } = await callAPI('/tour-package/tour-details', 'POST', { id_tour_package: id_tour_package }, true, session.user.accessToken)

    const { status: statusSummary, data: bookingData, ok: okSummary, error: errorSummary } = await callAPI('/tour-package/show-booking', 'POST', { id_tour_booking: id_tour_booking }, true, session.user.accessToken)
    

    console.log('data tour: ', data);

    if (ok) {
        // if (data.status !== 0) {
        //     return {
        //         redirect: {
        //             destination: `/booking/tour/${id_tour_package}/${id_tour_booking}/complete`,
        //             permanent: false,
        //         },
        //     };
        // } else {
        //     return {
        //         props: {
        //             data,
        //             id_tour_booking,
        //             resolvedUrl
        //         },
        //     };
        // }

        return {
            props: {
                data,
                bookingData,
                id_tour_booking,
                resolvedUrl
            },
        };
    } else {
        return {
            notFound: true,
        };
    }
}

interface IProps {
    data: any;
    id_tour_booking: any;
    bookingData: any;
}

const Booking = (props: IProps) => {
    const router = useRouter();
    const service = Services.TourPackage
    const session = useSession();

    const { data, id_tour_booking } = props;

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
                    <BookingConfirmation data={data} bookingDetailData={props.bookingData}/>
                </main>
                <Footer />
            </Layout>
        </>
    )
}

export default Booking

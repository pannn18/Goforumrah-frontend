import React from "react";
import { useRouter } from "next/router";
import { callAPI } from "@/lib/axiosHelper";
import { Services } from "@/types/enums";

import Layout from "@/components/layout";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { useSession } from "next-auth/react";
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'

import BookingHeader from '@/components/pages/booking/header'
import BookingPayment from '@/components/pages/booking/tour/payment'

// Retrieve Data from APIs
export async function getServerSideProps(context) {
    const id_tour_package = context.params?.idTour;
    const id_tour_booking = context.params?.idTourBooking;

    const session = await getServerSession(context.req, context.res, authOptions)
    if (!session?.user) {
        // Redirect to specified url
        return {
            redirect: {
                destination: `/tour/${id_tour_package}`,
                permanent: false,
            }
        }
    }

    const resolvedUrl = context?.resolvedUrl || '/'

    const { status, data, ok, error } = await callAPI('/tour-package/show-booking', 'POST', { id_tour_booking: id_tour_booking }, true, session.user.accessToken)

    const { status: statusSummary, data: summaryData, ok: okSummary, error: errorSummary } = await callAPI('/tour-package/tour-details', 'POST',  { "id_tour_package": id_tour_package }, true, session.user.accessToken)

    // console.log('data summary: ', summaryData)
    // console.log('status summary: ', statusSummary)
    // console.log('ok summary: ', okSummary);

    // console.log('data tour: ', data);
    // console.log('status tour: ', status);
    // console.log('ok tour: ', ok);
    // console.log('error tour: ', error);

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
                summaryData,
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
    summaryData: any;
    id_tour_booking: string;
    resolvedUrl: string;
}

const Booking = (props: IProps) => {
    const router = useRouter();
    const service = Services.TourPackage
    const session = useSession();

    const { data, id_tour_booking } = props;

    if (session.status === "unauthenticated") {
        router.push(`/tour/${data?.id_tour_package}?status=unauthenticated`);
    }

    const handlePreviousStep = () => {
        router.back();
        window.scrollTo({ top: 0, behavior: 'auto' })
    }

    return (
        <>
            <Layout>
                <Navbar showCurrency={true} selectedServiceTab={service} />
                <main className="booking-hotel booking-flight">
                    <BookingHeader current={'payment'} handlePreviousStep={handlePreviousStep} />
                    <BookingPayment data={data} resolvedUrl={props.resolvedUrl} summaryData={props.summaryData} />
                </main>
                <Footer />
            </Layout>
        </>
    )

}

export default Booking;
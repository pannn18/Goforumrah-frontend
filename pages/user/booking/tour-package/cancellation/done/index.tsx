import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import sheratonHotel from '@/assets/images/hotel_details_imagery_1.png'
import LoadingOverlay from '@/components/loadingOverlay'
interface personalAndTourDataProps {
  personalAndTourData: any;
}

export default function Home() {

  const { data: session, status } = useSession()
  const router = useRouter()
  const id_tour_booking = router.query.id_booking ?? null;
  const idTourBooking = id_tour_booking;
  const id_customer = session?.user.id;
  const bookingStatus = ['Payment Needed', 'Credit Card Not Verified', 'Confirmed', 'Rejected', 'Cancelled']
  console.log("id_tour_booking : ", id_tour_booking)
  console.log("id_customer : ", id_customer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [tourData, setTourData] = useState(null);
  const [tourLoading, setTourLoading] = useState(true);
  const [tourError, setTourError] = useState(null);

  // Define a state to hold the merged data
  const [personalAndTourData, setPersonalAndTourData] = useState(null);

  useEffect(() => {
    if (!id_customer || !id_tour_booking) return

    // Check if personalData or tourData is already available
    if (personalData || tourData) return;


    const fetchPersonalData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/customer/personal/show', 'POST', { id_customer: id_customer }, true);
        setPersonalData(data);
        setPersonalLoading(false);
      } catch (error) {
        setPersonalError(error);
        setPersonalLoading(false);
      }
    };

    const fetchTourData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/tour-package/show-booking', 'POST', { id_tour_booking: id_tour_booking }, true);
        setTourData(data);
        // setHotelPoliciesData(data);
        console.log('tour layout : ', data);
        setTourLoading(false);
      } catch (error) {
        setTourError(error);
        setTourLoading(false);
      }
    };

    fetchPersonalData();
    fetchTourData();
  }, [id_customer, id_tour_booking]);

  // Combine personalData and hotelData when both are available
  useEffect(() => {
    // Check if personalAndHotelData is already available
    if (personalAndTourData) return;

    if (personalData && tourData) {
      const mergedData = {
        personalData: personalData,
        tourData: tourData,
        id_tour_booking: id_tour_booking
      };
      setPersonalAndTourData(mergedData);
    }
  }, [personalData, tourData]);

  if (personalLoading || tourLoading) {
    return <LoadingOverlay />
  }

  if (personalError || tourError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("data : ", personalAndTourData)
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <main className="search-hotel">
          <BookingHeader />
          <div className="container">
            <div className="search-hotel__wrapper">
              <div className="cancelation__list">
                <Done personalAndTourData={personalAndTourData} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </Layout>
    </>
  )
}

const BookingHeader = () => {
  return (
    <div className="booking-hotel__header">
      <div className="container">
        <div className="booking-hotel__header-wrapper">
          <Link href="/" className="booking-hotel__header-title">
            <div className="booking-hotel__header-title-button">
              <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
            </div>
            <h4>Back</h4>
          </Link>
        </div>
      </div>
    </div>
  )
}

const Done = (props: personalAndTourDataProps) => {
  const personalData = props.personalAndTourData?.personalData;
  const tourData = props.personalAndTourData?.tourData;
  console.log("personalData : ", personalData)
  console.log("tourData : ", tourData)
  return (
    <>
      <div className="cancelation__confirmation">
        <div className="cancelation__confirmation-top">
          <div className="cancelation__confirmation-top-header">
            <div className="cancelation__confirmation-top-image">
              <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="cancelation__confirmation-top-title">
              <div className="cancelation__confirmation-top-tag">Free cancellation</div>
              <h4>Your Tour Cancellation was successful</h4>
              <p className="cancelation__confirmation-top-title--name">For information regarding refunds, we will immediately inform you via your email</p>
            </div>
          </div>
          <div className="cancelation__confirmation-top-buttons">
            <Link href="/search/tour-package" className="btn btn-lg btn-outline-success">
              <span>Find another tour</span>
            </Link>
            <Link href={"/"} className="btn btn-lg btn-success">
              <span>Back to home</span>
            </Link>
          </div>
        </div>
        <div className="cancelation__confirmation-separator"></div>
        <div className="cancelation__confirmation-wrapper">
          <div className="cancelation__confirmation-preview-image cancelation__confirmation-preview-image--hotel">
          <img src={tourData?.[0]?.photos?.[0]?.photo || sheratonHotel} alt="Tour Logo" width={92} height={92} />
          </div>
          <div className="cancelation__confirmation-preview-text">
            <p className="cancelation__confirmation-preview-name">{tourData?.[0]?.tour_package?.package_name}</p>
            <p className="cancelation__confirmation-preview-detail">{tourData?.[0]?.tour_layout?.room_type}</p>
            <div className="cancelation__confirmation-preview-information">
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Sun} width={20} height={20} />
                <p>{tourData?.[0]?.tour_plan?.total_day} Day</p>
              </div>
              <div className="cancelation__confirmation-preview-dot"></div>
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Users} width={20} height={20} />
                <p>{tourData?.[0]?.number_of_tickets} Tickets</p>
              </div>
            </div>
          </div>
        </div>
        <div className="cancelation__confirmation-separator"></div>
        <div className="cancelation__confirmation-details">
          <div className="cancelation__confirmation-content">
            <div className="cancelation__confirmation-content__info">
              <div className="cancelation__confirmation-content__info-rows">
                <SVGIcon className="cancelation__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="cancelation__confirmation-content__info-text">
                  We’ve sent your confirmation email to
                  <span className="cancelation__confirmation-content__info-text--highlighted"> {personalData?.email}.</span>
                  <Link href="/user/account/personal" className="cancelation__confirmation-content__info-text--link"> Change email</Link>
                </div>
              </div>
              <div className="cancelation__confirmation-content__info-rows">
                <SVGIcon className="cancelation__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="cancelation__confirmation-content__info-text">
                  <span className="cancelation__confirmation-content__info-text--highlighted">Your booking was succesfully cancelled -</span> You don’t have to do anything else!
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

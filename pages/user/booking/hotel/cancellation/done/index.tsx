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
interface personalAndHotelDataProps {
  personalAndHotelData: any;
}

export default function Home() {

  const { data: session, status } = useSession()
  const router = useRouter()
  const id_hotel_booking = router.query.id_booking ?? null;
  const idHotelBooking = id_hotel_booking;
  const id_customer = session?.user.id;
  const bookingStatus = ['Payment Needed', 'Credit Card Not Verified', 'Confirmed', 'Rejected', 'Cancelled']
  console.log("id_hotel_booking : ", id_hotel_booking)
  console.log("id_customer : ", id_customer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);

  // Define a state to hold the merged data
  const [personalAndHotelData, setPersonalAndHotelData] = useState(null);

  useEffect(() => {
    if (!id_customer || !id_hotel_booking) return

    // Check if personalData or hotelData is already available
    if (personalData || hotelData) return;

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

    const fetchHotelData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/hotel-booking/detail', 'POST', { id_hotel_booking: id_hotel_booking }, true);
        setHotelData(data);
        setHotelLoading(false);
      } catch (error) {
        setHotelError(error);
        setHotelLoading(false);
      }
    };

    fetchPersonalData();
    fetchHotelData();
  }, [id_customer, id_hotel_booking]);

  // Combine personalData and hotelData when both are available
  useEffect(() => {
    // Check if personalAndHotelData is already available
    if (personalAndHotelData) return;

    if (personalData && hotelData) {
      const mergedData = {
        personalData: personalData,
        hotelData: hotelData,
        id_hotel_booking: id_hotel_booking
      };
      setPersonalAndHotelData(mergedData);
    }
  }, [personalData, hotelData]);

  if (personalLoading || hotelLoading) {
    return <LoadingOverlay />;
  }

  if (personalError || hotelError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("data : ", personalAndHotelData)
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <main className="search-hotel">
          <BookingHeader />
          <div className="container">
            <div className="search-hotel__wrapper">
              <div className="cancelation__list">
                <Done personalAndHotelData={personalAndHotelData} />
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

const Done = (props: personalAndHotelDataProps) => {
  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;
  console.log("personalData : ", personalData)
  console.log("hotelData : ", hotelData)
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
              <h4>Your Hotel Cancellation was successful</h4>
              <p className="cancelation__confirmation-top-title--name">For information regarding refunds, we will immediately inform you via your email</p>
            </div>
          </div>
          <div className="cancelation__confirmation-top-buttons">
            <Link href="/search/hotel/" className="btn btn-lg btn-outline-success">
              <span>Find another hotel</span>
            </Link>
            <Link href={"/"} className="btn btn-lg btn-success">
              <span>Back to home</span>
            </Link>
          </div>
        </div>
        <div className="cancelation__confirmation-separator"></div>
        <div className="cancelation__confirmation-wrapper">
          <div className="cancelation__confirmation-preview-image cancelation__confirmation-preview-image--hotel">
            <BlurPlaceholderImage src={hotelData?.hotel?.hotel_photo[0]?.photo || sheratonHotel} alt="Flight Logo" width={92} height={92} />
          </div>
          <div className="cancelation__confirmation-preview-text">
            <p className="cancelation__confirmation-preview-name">{hotelData?.hotel?.property_name}</p>
            <p className="cancelation__confirmation-preview-detail">{hotelData?.hotel_layout?.room_type}</p>
            <div className="cancelation__confirmation-preview-information">
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Sun} width={20} height={20} />
                <p>{Math.ceil(Number(new Date(hotelData?.checkout)) - Number(new Date(hotelData?.checkin))) / (1000 * 60 * 60 * 24)} Day</p>
              </div>
              <div className="cancelation__confirmation-preview-dot"></div>
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Users} width={20} height={20} />
                <p>{hotelData?.hotel_layout?.guest_count} guest</p>
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

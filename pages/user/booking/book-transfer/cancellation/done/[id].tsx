
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
import carMarcedesBenz from '@/assets/images/search_transfer_car_image.png'
import LoadingOverlay from '@/components/loadingOverlay'

interface personalAndCarDataProps {
  personalAndCarData: any;
}

const Home = (props) => {
  const router = useRouter()
  const { data: session, status } = useSession()

  const idCarBooking = props.id;
  const idCustomer = session?.user.id;
  console.log("idCarBooking : ", idCarBooking)
  console.log("idCustomer : ", idCustomer)

  console.log("idCarBooking : ", idCarBooking)
  console.log("idCustomer : ", idCustomer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [carData, setCarData] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState(null);
  const [reasonCancellation, setReasonCancellation] = useState(null);

  // Define a state to hold the merged data
  const [personalAndCarData, setPersonalAndCarData] = useState(null);


  useEffect(() => {
    if (!idCustomer || !idCarBooking) return

    // Check if personalData or carData is already available
    if (personalData || carData) return;

    const fetchPersonalData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/customer/personal/show', 'POST', { id_customer: idCustomer }, true);
        setPersonalData(data);
        setPersonalLoading(false);
      } catch (error) {
        setPersonalError(error);
        setPersonalLoading(false);
      }
    };

    const fetchCarData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/car-business-booking/show-booking', 'POST', { id_car_booking: idCarBooking, id_customer: idCustomer }, true);
        setCarData(data);
        setCarLoading(false);
      } catch (error) {
        setCarError(error);
        setCarLoading(false);
      }
    };

    fetchPersonalData();
    fetchCarData();
  }, [idCustomer, idCarBooking, session]);

  // Combine personalData and carData when both are available
  useEffect(() => {
    // Check if personalAndCarData is already available
    if (personalAndCarData) return;

    if (personalData && carData) {
      const mergedData = {
        personalData: personalData,
        carData: carData,
        idCarBooking: idCarBooking
      };
      setPersonalAndCarData(mergedData);
    }
  }, [personalData, carData]);

  if (personalLoading || carLoading) {
    return <LoadingOverlay />
  }

  if (personalError || carError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("data : ", personalAndCarData)
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <main className="search-hotel">
          <BookingHeader />
          <div className="container">
            <div className="search-hotel__wrapper">
              <div className="cancelation__list">
                <Done personalAndCarData={personalAndCarData} />
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

const Done = (props: personalAndCarDataProps) => {
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
              <h4>Your Car Cancellation was successful</h4>
              <p className="cancelation__confirmation-top-title--name">For information regarding refunds, we will immediately inform you via your email</p>
            </div>
          </div>
          <div className="cancelation__confirmation-top-buttons">
            <Link href="/search/book-transfer/" className="btn btn-lg btn-outline-success">
              <span>Find another car</span>
            </Link>
            <button className="btn btn-lg btn-success">
              <span>Back to home</span>
            </button>
          </div>
        </div>
        <div className="cancelation__confirmation-separator"></div>
        <div className="cancelation__confirmation-wrapper">
          <div className="cancelation__confirmation-preview-image cancelation__confirmation-preview-image--hotel">
            <BlurPlaceholderImage src={carMarcedesBenz} alt="Car Image Preview" width={128} height={100} />
          </div>
          <div className="cancelation__confirmation-preview-text">
            <p className="cancelation__confirmation-preview-name">{props?.personalAndCarData?.carData[0]?.car_brand} {props?.personalAndCarData?.carData[0]?.edition}</p>
            <div className="cancelation__confirmation-preview-brand">
              <BlurPlaceholderImage className="cancelation__confirmation-preview-logo" src={Images.Placeholder} alt="Car Brand" width={24} height={24} />
              <p className="cancelation__confirmation-preview-detail">Green Motion Rental</p>
            </div>
            <div className="cancelation__confirmation-preview-information">
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Sun} width={20} height={20} />
                <p>{props?.personalAndCarData?.carData[0]?.total_day_for_rent} Day</p>
              </div>
              <div className="cancelation__confirmation-preview-dot"></div>
              <div className="cancelation__confirmation-preview-information">
                <SVGIcon src={Icons.Car} width={20} height={20} />
                <p>4 door, {props?.personalAndCarData?.carData[0]?.quantity} seat</p>
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
                  <span className="cancelation__confirmation-content__info-text--highlighted"> {props?.personalAndCarData?.carData?.email}.</span>
                  <Link href="#" className="cancelation__confirmation-content__info-text--link"> Change email</Link>
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

export async function getServerSideProps(context) {
  const { params } = context;
  const id = params.id;

  // Fetch data based on the id here
  // For example, you can fetch data from a database

  return {
    props: {
      id,
      // Add other data fetched based on the id
    },
  };
}


export default Home
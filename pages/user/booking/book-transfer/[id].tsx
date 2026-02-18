import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { callAPI } from '@/lib/axiosHelper'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import UserLayout from '@/components/user/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import Link from 'next/link'
import sheratonHotel from '@/assets/images/hotel_details_imagery_1.png'
import locationMapImage from '@/assets/images/sidemenu_maps.png'
import { useSession } from 'next-auth/react'
import LoadingOverlay from '@/components/loadingOverlay'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

const BookingCarDetails = (props) => {
  const { changePrice, currencySymbol } = UseCurrencyConverter();
  const [isStatusCompleted, setIsStatusCompleted] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()
  const idCarBooking = props?.id;
  const idCustomer = session?.user.id;
  const bookingStatus = ['Payment Needed', 'Waiting Credit Card Verification', 'Confirmed', 'Rejected', 'Cancelled']
  console.log("idCarBooking : ", idCarBooking)
  console.log("idCustomer : ", idCustomer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [carData, setCarData] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState(null);

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
        if (data?.status === 2) {
          setIsStatusCompleted(true);
        }
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

  function formatDate(inputDate) {
    // Parse the input date string
    const parsedDate = new Date(inputDate);

    // Create an array of month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Create an array of day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get the day, month, year, and day of the week
    const day = dayNames[parsedDate.getDay()];
    const date = parsedDate.getDate();
    const month = monthNames[parsedDate.getMonth()];
    const year = parsedDate.getFullYear() % 100; // Get the last two digits of the year

    // Format the date in the desired format
    const formattedDate = `${day}, ${date} ${month} ${year}`;

    return formattedDate;
  }

  function formatTime(inputDateTime) {
    // Parse the input date and time string
    const parsedDateTime = new Date(inputDateTime);

    // Get hours and minutes
    const hours = parsedDateTime.getHours().toString().padStart(2, '0');
    const minutes = parsedDateTime.getMinutes().toString().padStart(2, '0');

    // Format the time in the desired format
    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
  }

  console.log("data : ", personalAndCarData)
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu='booking'>
        <div className="search-hotel">
          <div className="cancelation__list">
            <Utterance isStatusCompleted={isStatusCompleted} personalAndCarData={personalAndCarData} />
            {!isStatusCompleted && <TicketCombo />}

            <div className="cancelation__card">
              <div className="cancelation__payment">
                <div className="cancelation__payment-flight">
                  <div className="cancelation__payment-flight-destination">
                    <h4>{personalAndCarData?.carData[0]?.car_brand} {personalAndCarData?.carData[0]?.edition}</h4>
                  </div>
                  <p className="cancelation__payment-flight">Order ID : {idCarBooking}</p>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__payment-total">
                  <p className="cancelation__payment-total-text">Total payment</p>
                  <h5>{currencySymbol} {changePrice(personalAndCarData?.carData[0]?.total_price)}</h5>
                </div>
                <Link className="cancelation__payment-link" href="#">Show More</Link>
              </div>
            </div>

            <div className="cancelation__card">
              <p className="cancelation__card-title">Booking details</p>
              <div className="cancelation__car">
                <div className="cancelation__car-summary">
                  <img className="cancelation__car-summary-image" src={ personalAndCarData?.carData[0]?.photo || Images.Placeholder } alt="" width={120} height={100} />
                  <div className="cancelation__car-summary-text">
                    <p className="cancelation__car-summary-name">
                      {personalAndCarData?.carData[0]?.car_brand} {personalAndCarData?.carData[0]?.edition}
                    </p>
                    <div className="cancelation__car-summary-brand">
                      <img className="cancelation__car-summary-brand--image" src={ personalAndCarData?.carData[0]?.car_company?.profile_icon || Images.Placeholder} alt="" width={24} height={24} />
                      <p>{personalAndCarData?.carData[0]?.car_company?.name}</p>
                    </div>
                  </div>
                  <div className="cancelation__car-summary-confirmation">
                    <p className="cancelation__car-summary-id">ID confirm :</p>
                    <p className="cancelation__car-summary-number">{idCarBooking}</p>
                  </div>
                </div>
                <div className="cancelation__car-date">
                  <div className="cancelation__car-regis">
                    <div className="cancelation__car-regis-imagery">
                      <SVGIcon src={Icons.MapPinOutline} className="" width={20} height={20} />
                    </div>
                    <div>
                      <p className="cancelation__car-regis-title">Pickup</p>
                      <div className="cancelation__car-regis-content">
                        <p className="cancelation__car-regis-date">{formatDate(personalAndCarData?.carData[0]?.pickup_date_time)}</p>
                        <p className="cancelation__car-regis-time">({formatTime(personalAndCarData?.carData[0]?.pickup_date_time)})</p>
                      </div>
                      <p className="cancelation__car-regis-desc">{personalAndCarData?.carData[0]?.pickup}</p>
                    </div>
                  </div>
                  <div className="cancelation__car-regis">
                    <div className="cancelation__car-regis-imagery">
                      <SVGIcon src={Icons.MapPinOutline} className="" width={20} height={20} />
                    </div>
                    <div>
                      <p className="cancelation__car-regis-title">Dropoff</p>
                      <div className="cancelation__car-regis-content">
                        <p className="cancelation__car-regis-date">{formatDate(personalAndCarData?.carData[0]?.dropoff_date_time)}</p>
                        <p className="cancelation__car-regis-time">({formatTime(personalAndCarData?.carData[0]?.dropoff_date_time)})</p>
                      </div>
                      <p className="cancelation__car-regis-desc">
                        {personalAndCarData?.carData[0]?.dropoff}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__car-detail">
                  <div className="cancelation__car-detail-item">
                    <p className="cancelation__car-detail-title">Driver name</p>
                    <div className="cancelation__car-detail-content">
                      <SVGIcon src={Icons.User} className="" width={20} height={20} />
                      <p>Mr. Michael</p>
                    </div>
                  </div>
                  <div className="cancelation__car-detail-item">
                    <p className="cancelation__car-detail-title">Duration</p>
                    <div className="cancelation__car-detail-content">
                      <SVGIcon src={Icons.Sun} className="" width={20} height={20} />
                      <p>{personalAndCarData?.carData[0]?.total_day_for_rent} day</p>
                    </div>
                  </div>
                  <div className="cancelation__car-detail-item">
                    <p className="cancelation__car-detail-title">Car Specs</p>
                    <div className="cancelation__car-detail-content">
                      <SVGIcon src={Icons.Car} className="" width={20} height={20} />
                      <p>4 door, {personalAndCarData?.carData[0]?.quantity} Seats</p>
                    </div>
                  </div>
                </div>
                <div className="cancelation__car-facility">
                  <p className="cancelation__car-facility">Fasilities</p>
                  <div className="cancelation__car-facility-list">
                    <div className="cancelation__car-facility-item">
                      <SVGIcon src={Icons.Automatic} width={20} height={20} />
                      <p>{personalAndCarData?.carData[0]?.transmission}</p>
                    </div>
                    <div className="cancelation__car-facility-item">
                      <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                      <p>4 Small Bags</p>
                    </div>
                    <div className="cancelation__car-facility-item">
                      <SVGIcon src={Icons.GasPump} width={20} height={20} />
                      <p>{personalAndCarData?.carData[0]?.fuel_type}</p>
                    </div>
                    <div className="cancelation__car-facility-item">
                      <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
                      <p>Air Conditioning</p>
                    </div>
                    <button className="cancelation__car-facility-button btn btn-lg btn-outline-success text-neutral-primary">See more fasilities</button>
                  </div>
                </div>
                <div className="cancelation__car-location">
                  <p className="cancelation__car-location-title">Location</p>
                  <div className="cancelation__car-location-detail">
                    <div className="cancelation__car-location-text">
                      <p className="cancelation__car-location-name">{personalAndCarData?.carData[0]?.pickup}</p>
                      <div className="cancelation__car-location-pin">
                        <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                        <p>{personalAndCarData?.carData[0]?.pickup}</p>
                      </div>
                    </div>
                    <button className="btn btn-lg btn-outline-success text-neutral-primary">Show in maps</button>
                  </div>
                </div>
              </div>
              <div className="cancelation__flight">
                <div className="cancelation__flight-information">
                  <p className="cancelation__flight-header">Additional Information</p>
                  <p>{personalAndCarData?.carData[0]?.personal_request}</p>
                </div>
              </div>
            </div>
            <div className="cancelation__flight border-0">
              <p className="cancelation__card-title">Manage your Booking</p>
              <div>
                <Link href={`/user/booking/book-transfer/cancellation/${idCarBooking}`} className="cancelation__flight-manage cancelation__flight-manage--cancel">
                  <SVGIcon src={Icons.Cancel} width={24} height={24} />
                  <p>Cancel booking</p>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
                </Link>
                <Link href="#" className="cancelation__flight-manage">
                  <SVGIcon src={Icons.User} className="cancelation__flight-manage-icon" width={24} height={24} />
                  <p>Edit Passenger Details</p>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
                </Link>
                <Link href="#" className="cancelation__flight-manage">
                  <SVGIcon src={Icons.Pencil} className="cancelation__flight-manage-icon" width={24} height={24} />
                  <p>Change Car</p>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
                </Link>
                <Link href="#" className="cancelation__flight-manage">
                  <SVGIcon src={Icons.SandClock} className="cancelation__flight-manage-icon" width={24} height={24} />
                  <p>Reschedule</p>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
                </Link>
              </div>
            </div>
            <div className="cancelation__flight border-0">
              <p className="cancelation__card-title">Need a help ?</p>
              <div className="cancelation__flight-help">
                <Link href="/contact-us" target='_blank' className="cancelation__flight-help-card">
                  <SVGIcon src={Icons.Help} className="cancelation__flight-help-icon" width={24} height={24} />
                  <div className="cancelation__flight-help-text">
                    <p className="cancelation__flight-help-title">Help center</p>
                    <p className="cancelation__flight-help-subtitle">Find solutions to your problems easily</p>
                  </div>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-help-arrow" width={24} height={24} />
                </Link>
                <Link href="/contact-us" target='_blank' className="cancelation__flight-help-card">
                  <SVGIcon src={Icons.Help} className="cancelation__flight-help-icon" width={24} height={24} />
                  <div className="cancelation__flight-help-text">
                    <p className="cancelation__flight-help-title">Call Customer care</p>
                    <p className="cancelation__flight-help-subtitle">We will always be there for you always</p>
                  </div>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-help-arrow" width={24} height={24} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </UserLayout>
      <Footer />
    </Layout>
  )
}

interface UtteranceProps {
  isStatusCompleted?: boolean
}

const Utterance = (props) => {

  const carData = props?.personalAndCarData?.carData[0];
  
  const statusReservationValue = ['Need to fill out the payment form', 'Waiting Payment Verification', 'Confirmed', 'Rejected by admin', 'Cancelled', 'Checked In', 'Checked Out', 'Completed'];

  const statusIndex = carData?.reservation_status == 1 ? 5 : carData?.reservation_status == 2 ? 6 : carData?.status || 0; // Default to 0 if status is not available
  const statusMessage = statusReservationValue[statusIndex];

  return (
    <div className="cancelation__card cancelation__card--row">
      <div className="cancelation__utterance ">
        <div className="cancelation__utterance-icon">
          <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
        </div>
        <div className="cancelation__utterance-subtitile">
          <p className="cancelation__utterance-subtitile">Thanks {props?.personalAndCarData?.carData[0]?.fullname}</p>
          <h4>Your booking in {props?.personalAndCarData?.carData[0]?.pickup} to {props?.personalAndCarData?.carData[0]?.dropoff}  is {statusMessage}  </h4>
        </div>
      </div>
      {!props.isStatusCompleted && (
        <div className="cancelation__utterance-action">
          <button className="btn btn-lg btn-success">
            <SVGIcon src={Icons.Printer} width={20} height={20} />
            Print Confirmation
          </button>
          <button className="btn btn-lg btn-outline-success">
            <SVGIcon src={Icons.Download} width={20} height={20} />
            Save File
          </button>
        </div>
      )}
    </div>
  )
}

const TicketCombo = () => {
  return (
    <div className="cancelation__card">
      <p className="cancelation__card-title">Ticket combo</p>
      <div className="cancelation__ticket ">
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Hotel} width={24} height={24} />
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Book a hotel</p>
          <h4 className="cancelation__ticket-desc">Get a discount of up to 10% for ordering now</h4>
        </div>
        <button className="btn btn-lg btn-outline-success">Book Now</button>
      </div>
      <div className="cancelation__ticket ">
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Flight} width={24} height={24} />
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Book a flight</p>
          <h4 className="cancelation__ticket-desc">Compare a thausands of flight , all with no hidden fees</h4>
        </div>
        <button className="btn btn-lg btn-outline-success">Book Now</button>
      </div>
    </div>
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


export default BookingCarDetails
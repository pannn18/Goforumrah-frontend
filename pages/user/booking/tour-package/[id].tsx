import React, { useState, useEffect, useRef } from 'react'
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
import { useReactToPrint } from 'react-to-print';
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import Image from 'next/image';
import LoadingOverlay from '@/components/loadingOverlay'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

interface personalAndTourDataProps {
  personalAndTourData: any;
}
interface idTourBookingProps {
  idTourBooking: any;
}



const BookingHotelDetails = (props) => {
  // console.log(props)
  const [isStatusCompleted, setIsStatusCompleted] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query;
  const id_tour_booking = props.id ?? id;
  const idTourBooking = id_tour_booking;
  const id_customer = session?.user.id;
  const bookingStatus = ["Payment Needed", "Credit Card Not Verified", "Confirmed", "Rejected", "Cancelled", "Check In", "Check Out"];
  console.log("id_hotel_booking : ", id_tour_booking)
  console.log("id_customer : ", id_customer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [tourData, setTourData] = useState(null);
  const [tourLoading, setTourLoading] = useState(true);
  const [tourError, setTourError] = useState(null);
  const [tourPoliciesData, settourPoliciesData] = useState(null);

  // Define a state to hold the merged data
  const [personalAndTourData, setPersonalAndTourData] = useState(null);
  // console.log("PERSONAL HOTEL DATA : ", personalAndtourData)

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

        if (data[0]?.status !== 5 && data[0]?.status !== 2 ) {
          setIsStatusCompleted(true);
        }
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
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu='booking'>
        <div className="search-hotel">
          <div className="cancelation__list">
            {personalAndTourData && (
              <>
                <Utterance
                  personalAndTourData={personalAndTourData}
                  isStatusCompleted={isStatusCompleted}
                  tourPoliciesData={tourPoliciesData} />
                {/* {!isStatusCompleted && <TicketCombo />} */}
                <Payment personalAndTourData={personalAndTourData} />
                <TourDetail personalAndTourData={personalAndTourData} />
              </>
            )}
             <TourManage idTourBooking={id_tour_booking} personalAndTourData={personalAndTourData} />
            <TourHelp />
          </div>
        </div>
      </UserLayout>
      <Footer />
    </Layout>
  )
}

interface UtteranceProps {
  isStatusCompleted?: boolean;
  tourPoliciesData: any;
}

const Utterance = (props: UtteranceProps & personalAndTourDataProps) => {

  console.log(props);

  const personalData = props.personalAndTourData?.personalData;
  const tourData = props.personalAndTourData?.tourData;

  const statusReservationValue = ['Need to fill out the payment form', 'Waiting Payment Verification', 'Confirmed', 'Rejected by admin', 'Cancelled', 'Completed', 'Checked In', 'Checked Out'];

  const statusIndex = tourData[0]?.status || 0; // Default to 0 if status is not available
  const statusMessage = statusReservationValue[statusIndex];

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: `${props?.bookingDetailData?.fullname}-${props?.bookingDetailData?.id_tour_booking}-${props?.data?.property_name} [${props?.data?.id_tour}]`,
  });

  const starRating = tourData?.tour?.star_rating
  // console.log(starRating)

  let stars = [];
  if (starRating >= 1) {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />);
  } else {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />);
  }
  if (starRating >= 2) {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />);
  } else {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />);
  }
  if (starRating >= 3) {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />);
  } else {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />);
  }
  if (starRating >= 4) {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />);
  } else {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />);
  }
  if (starRating >= 5) {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />);
  } else {
    stars.push(<SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />);
  }

  return (
    <div className="cancelation__card cancelation__card--row">
      {/* Booking Invoice */}
      <div className='booking-hotel__invoice-container' id='bookingHotelInvoice' ref={componentRef}>
        <main className='booking-hotel__invoice'>
          <Image className='d-flex justify-content-center w-100' src={logoTextDark} alt="Logo" width={300} />
          <div className="booking-hotel__invoice-wrapper--top">
            <div className='booking-hotel__invoice-top-header'>
              <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--booking'>
                <span className='booking-hotel__invoice-top-header-label'>Booking ID</span>
                <div className="booking-hotel__invoice-top-header-value">{tourData[0]?.id_tour_booking}</div>
              </div>
              <div className="booking-hotel__confirmation-separator"></div>

            </div>
            <div className="booking-hotel__invoice-top-header">
              <div className="booking-hotel__invoice-top-header">
                <h4 className='booking-hotel__invoice-top-header--title'>
                  {tourData[0]?.tour_package?.package_name}
                </h4>
                {/* <div className="booking-hotel__invoice-top-header-star">
                  {stars}
                </div> */}
              </div>
              <span className='booking-hotel__invoice-top-header-address'>
                <SVGIcon src={Icons.MapPin} width={24} height={24} />
                {tourData[0]?.tour_package?.address}
              </span>
              <div className="booking-hotel__invoice-top-header-checkin">
                <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                  <span className='booking-hotel__invoice-top-header-checkin'>Check-in</span>
                  <div className="booking-hotel__invoice-top-header-checkin booking-hotel__invoice-top-header-checkin--date">
                    {new Date(tourData[0]?.start_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                  <span>Check-out</span>
                  <div className="booking-hotel__invoice-top-header-checkin booking-hotel__invoice-top-header-checkin--date">
                    {new Date(tourData[0]?.end_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="booking-hotel__invoice-wrapper">
            <div className="booking-hotel__invoice-header">
              <h4 className='booking-hotel__invoice-header-title'><i>Booking Details</i></h4>
            </div>
            <div className="booking-hotel__invoice-wrapper">
              <table className='booking-hotel__invoice-booking'>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Guest Name</th>
                    <th>Email</th>
                    <th>Plan Name</th>
                    <th>Number of Ticket</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{personalData?.guest_title} {personalData?.fullname}</td>
                    <td>{personalData?.email}</td>
                    <td>{tourData[0]?.tour_plan?.plan_name}</td>
                    <td>{tourData[0]?.number_of_tickets}</td>
                    <td>{tourData[0]?.total_price}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <footer className="booking-hotel__invoice-footer">
          <div className="booking-hotel__invoice-footer-top">
            <div className="booking-hotel__invoice-footer-item">
              <span className='booking-hotel__invoice-footer-title'> FOR ANY QUESTIONS, VISIT GOFORUMARAH HELP CENTER :</span>
              <div className="booking-hotel__invoice-footer-link">
                <SVGIcon src={Icons.Help} width={24} height={24} />
                <Link href={'https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us'}>
                  https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us
                </Link>
              </div>
            </div>
            <div className="booking-hotel__invoice-footer-item">
              <span className='booking-hotel__invoice-footer-title'>  CUSTOMER SERVICE (ID)</span>
              <div className="booking-hotel__invoice-footer-link">
                <SVGIcon src={Icons.Phone} width={24} height={24} />
                <span>+91 1234567890</span>
              </div>
            </div>
            <div className="booking-hotel__invoice-footer-item">
              <span className='booking-hotel__invoice-footer-title'>  BOOKING ID </span>
              <div className="booking-hotel__invoice-footer-link">
                <SVGIcon src={Icons.BookingComplete} width={24} height={24} />
                {tourData?.id_tour_booking}
              </div>
            </div>
          </div>
          <div className="booking-hotel__invoice-footer-bottom">
            <p>
              Terms and Conditions apply. Please refer to &nbsp;
              <Link href={'https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us'}>
                https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us
              </Link>
            </p>
          </div>
        </footer>

      </div>
      {/* Booking Invoice */}
      <div className="cancelation__utterance ">
        <div className="cancelation__utterance-icon">
          <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
        </div>
        <div className="cancelation__utterance-subtitile">
          <p className="cancelation__utterance-subtitile">Thanks {personalData?.fullname}</p>
          <h4>Your booking tour in {tourData[0]?.tour_package?.package_name} is {statusMessage}</h4>
        </div>
      </div>
      {!props.isStatusCompleted && (
        <div className="cancelation__utterance-action">
          <button className="btn btn-lg btn-success" onClick={handlePrint}>
            <SVGIcon src={Icons.Printer} width={20} height={20} />
            Print Confirmation
          </button>
          <button className="btn btn-lg btn-outline-success" onClick={handlePrint}>
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
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Car} width={24} height={24} />
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Rent a car</p>
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

const Payment = (props: personalAndTourDataProps) => {
  const { changePrice, currencySymbol } = UseCurrencyConverter();
  const personalData = props.personalAndTourData?.personalData;
  const tourData = props.personalAndTourData?.tourData;
  return (
    <div className="cancelation__card">
      <div className="cancelation__payment">
        <div className="cancelation__payment-flight">
          <div className="cancelation__payment-flight-destination">
            <h4>{tourData[0]?.tour_package?.package_name}</h4>
          </div>
          <p className="cancelation__payment-flight">Order ID : {tourData[0]?.id_tour_booking}</p>
        </div>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__payment-total">
          <p className="cancelation__payment-total-text">Total payment</p>
          <h5>{currencySymbol} {changePrice(tourData[0]?.total_price)}</h5>
        </div>
        {/* This content is unavailable For a moment */}
        {/* <Link className="cancelation__payment-link" href="#">Show More</Link> */}
      </div>
    </div>
  )
}

const TourDetail = (props: personalAndTourDataProps) => {
  const personalData = props.personalAndTourData?.personalData;
  const tourData = props.personalAndTourData?.tourData;

  const formatStayDuration = (checkin, checkout) => {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
  
    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
  
    const isCheckoutAfterNoon = checkoutDate.getHours() >= 12;
    const isCheckinBeforeNoon = checkinDate.getHours() < 12;
  
    const days = nights + (isCheckinBeforeNoon ? 1 : 0);
  
    if (days === 1 && isCheckoutAfterNoon) {
      return '1 day 1 night';
    } else if (days === 1 && !isCheckoutAfterNoon) {
      return '1 night';
    } else if (nights === 1 && isCheckinBeforeNoon) {
      return '1 day';
    } else {
      return `${days} days ${nights} nights`;
    }
  };  
  
  return (
    <div className="cancelation__card">
      <p className="cancelation__card-title">Booking details</p>
      <div className="cancelation__tour">
        <div className="cancelation__tour-summary">
          <BlurPlaceholderImage src={tourData[0]?.photos[0]?.photo ?? Images.Placeholder} className="cancelation__tour-summary-image" alt="tour Preview" width={120} height={100} />
          <div className="cancelation__tour-summary-text">
            <p className="cancelation__tour-summary-name">{tourData[0]?.tour_package?.package_name}</p>
            <p className="cancelation__tour-summary-desc">{tourData[0]?.tour_plan?.plan_name}</p>
          </div>
          <div className="cancelation__tour-summary-confirmation">
            {/* <p className="cancelation__tour-summary-id">ID confirm :</p> */}
            {/* <p className="cancelation__tour-summary-number">{tourData?.payment?.id_tour_booking_payment}</p> */}
          </div>
        </div>
        <div className="cancelation__tour-date">
          <div className="cancelation__tour-regis">
            <div className="cancelation__tour-regis-imagery">
              <SVGIcon src={Icons.Calendar} className="" width={20} height={20} />
            </div>
            <div>
              <p className="cancelation__tour-regis-title">Start Date</p>
              <div className="cancelation__tour-regis-content">
                <p className="cancelation__tour-regis-date">{new Date(tourData[0]?.start_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {/* <p className="cancelation__tour-regis-time">(06:00) - (21:00)</p> */}
              </div>
            </div>
          </div>
          <div className="cancelation__tour-regis">
            <div className="cancelation__tour-regis-imagery">
              <SVGIcon src={Icons.Calendar} className="" width={20} height={20} />
            </div>
            <div>
              <p className="cancelation__tour-regis-title">End Date</p>
              <div className="cancelation__tour-regis-content">
                <p className="cancelation__tour-regis-date">{new Date(tourData[0]?.end_date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {/* <p className="cancelation__tour-regis-time">(06:00) - (21:00)</p> */}
              </div>
            </div>
          </div>
        </div>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__tour-detail">
          <div className="cancelation__tour-detail-item">
            <p className="cancelation__tour-detail-title">Guest details</p>
            <div className="cancelation__tour-detail-content">
              <SVGIcon src={Icons.User} className="" width={20} height={20} />
              <p>{tourData[0]?.fullname}</p>
            </div>
          </div>
          <div className="cancelation__tour-detail-item">
            <p className="cancelation__tour-detail-title">Duration</p>
            <div className="cancelation__tour-detail-content">
              <SVGIcon src={Icons.Sun} className="" width={20} height={20} />
              <p>{formatStayDuration(tourData[0]?.start_date, tourData[0]?.end_date)}</p>
            </div>
          </div>
          <div className="cancelation__tour-detail-item">
            <p className="cancelation__tour-detail-title">Tickets</p>
            <div className="cancelation__tour-detail-content">
              <SVGIcon src={Icons.Users} className="" width={20} height={20} />
              <p>{tourData[0]?.number_of_tickets} Tickets</p>
            </div>
          </div>
        </div>
        <div className="cancelation__car-location">
                  <p className="cancelation__car-location-title">Location</p>
                  <div className="cancelation__car-location-detail">
                    <div className="cancelation__car-location-text">
                      <p className="cancelation__car-location-name">{tourData[0]?.tour_package?.city}</p>
                      <div className="cancelation__car-location-pin">
                        <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                        <p>{tourData[0]?.tour_package?.address}</p>
                      </div>
                    </div>
                    <button className="btn btn-lg btn-outline-success text-neutral-primary">Show in maps</button>
                  </div>
                </div>
      </div>
      <div className="cancelation__flight">
        <div className="cancelation__flight-information">
          <p className="cancelation__flight-header">Special Requirement</p>
          <p>{tourData[0]?.special_requirement}</p>
        </div>
      </div>
    </div>
  )
}

const TourManage = (props: idTourBookingProps & personalAndTourDataProps) => {
  const personalData = props.personalAndTourData?.personalData;
  const tourData = props.personalAndTourData?.tourData;

  return (
    <>
   {tourData?.[0]?.status !== 1 && tourData?.[0]?.status !== 2 && tourData?.[0]?.status !== 3 && tourData?.[0]?.status !== 4 && tourData?.[0]?.status !== 5 && (
    <div className="cancelation__flight border-0">
      <p className="cancelation__card-title">Manage your Booking</p>
      <div>
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.User} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Edit guest details</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
          <>
          <Link href="#" className="cancelation__flight-manage">
            <SVGIcon src={Icons.Pencil} className="cancelation__flight-manage-icon" width={24} height={24} />
            <p>Change your plan</p>
            <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
          </Link>
          <Link href="#" className="cancelation__flight-manage">
            <SVGIcon src={Icons.SandClock} className="cancelation__flight-manage-icon" width={24} height={24} />
            <p>Reschedule</p>
            <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
          </Link>
          <Link href={`/user/booking/tour-package/cancellation?id_booking=${props?.idTourBooking}`} className="cancelation__flight-manage cancelation__flight-manage--cancel">
            <SVGIcon src={Icons.Cancel} width={24} height={24} />
            <p>Cancel booking</p>
            <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
          </Link>
          </>          
      </div>
    </div>
    )}
    </>
  )
}

const TourHelp = () => {
  return (
    <div className="cancelation__flight border-0">
      <p className="cancelation__card-title">Need a help ?</p>
      <div className="cancelation__flight-help">
        <Link href="/contact-us" target="_blank" className="cancelation__flight-help-card">
          <SVGIcon src={Icons.Help} className="cancelation__flight-help-icon" width={24} height={24} />
          <div className="cancelation__flight-help-text">
            <p className="cancelation__flight-help-title">Help center</p>
            <p className="cancelation__flight-help-subtitle">Find solutions to your problems easily</p>
          </div>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-help-arrow" width={24} height={24} />
        </Link>
        <Link href="/contact-us" target="_blank" className="cancelation__flight-help-card">
          <SVGIcon src={Icons.Help} className="cancelation__flight-help-icon" width={24} height={24} />
          <div className="cancelation__flight-help-text">
            <p className="cancelation__flight-help-title">Call Customer care</p>
            <p className="cancelation__flight-help-subtitle">We will always be there for you always</p>
          </div>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-help-arrow" width={24} height={24} />
        </Link>
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

export default BookingHotelDetails
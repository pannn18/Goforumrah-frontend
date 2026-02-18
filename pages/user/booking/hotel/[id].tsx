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

interface HotelRoomProps {
  data: any;
}

interface personalAndHotelDataProps {
  personalAndHotelData: any;
}
interface idHotelBookingProps {
  idHotelBooking: any;
}



const BookingHotelDetails = (props) => {
  // console.log(props)
  const [isStatusCompleted, setIsStatusCompleted] = useState(false)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { id } = router.query;
  const id_hotel_booking = props.id ?? id;
  const idHotelBooking = id_hotel_booking;
  const id_customer = session?.user.id;
  const bookingStatus = ["Payment Needed", "Credit Card Not Verified", "Confirmed", "Rejected", "Cancelled", "Check In", "Check Out"];
  console.log("id_hotel_booking : ", id_hotel_booking)
  console.log("id_customer : ", id_customer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);
  const [hotelPoliciesData, setHotelPoliciesData] = useState(null);

  // Define a state to hold the merged data
  const [personalAndHotelData, setPersonalAndHotelData] = useState(null);
  // console.log("PERSONAL HOTEL DATA : ", personalAndHotelData)

  useEffect(() => {
    if (!id_customer || !id_hotel_booking) return

    // Check if personalData or hotelData is already available
    if (personalData || hotelData) return;

    const fetchPoliciesData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/hotel-booking/policies', 'POST', { id_hotel_booking: id_hotel_booking }, true);
        console.log()
      } catch (error) {
        setPersonalError(error)
        setPersonalLoading(false)
      }
    }

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
        // setHotelPoliciesData(data);
        console.log('hotel layout : ', data?.hotel_layout);

        if (data?.status >= 2) {
          setIsStatusCompleted(true);
        }
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
    return <LoadingOverlay />
  }

  if (personalError || hotelError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("data : ", personalAndHotelData)
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu='booking'>
        <div className="search-hotel">
          <div className="cancelation__list">
            {personalAndHotelData && (
              <>
                <Utterance
                  personalAndHotelData={personalAndHotelData}
                  isStatusCompleted={isStatusCompleted}
                  hotelPoliciesData={hotelPoliciesData} />
                {/* {!isStatusCompleted && <TicketCombo />} */}
                <Payment personalAndHotelData={personalAndHotelData} />
                <HotelDetail personalAndHotelData={personalAndHotelData} />
              </>
            )}
            {!isStatusCompleted && <HotelManage idHotelBooking={id_hotel_booking} personalAndHotelData={personalAndHotelData} />}
            <HotelHelp />
          </div>
        </div>
      </UserLayout>
      <Footer />
    </Layout>
  )
}

interface UtteranceProps {
  isStatusCompleted?: boolean;
  hotelPoliciesData: any;
}

const Utterance = (props: UtteranceProps & personalAndHotelDataProps) => {

  console.log(props);

  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;

  const statusReservationValue = ['Need to fill out the payment form', 'Waiting Payment Verification', 'Confirmed', 'Rejected by admin', 'Cancelled', 'Checked In', 'Checked Out', 'Completed'];

  const statusIndex = hotelData?.reservation_status == 1 ? 5 : hotelData?.reservation_status == 2 ? 6 : hotelData?.status || 0; // Default to 0 if status is not available
  const statusMessage = statusReservationValue[statusIndex];

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    // documentTitle: `${props?.bookingDetailData?.fullname}-${props?.bookingDetailData?.id_hotel_booking}-${props?.data?.property_name} [${props?.data?.id_hotel}]`,
  });

  const starRating = hotelData?.hotel?.star_rating
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
                <div className="booking-hotel__invoice-top-header-value">{hotelData?.id_hotel_booking}</div>
              </div>
              <div className="booking-hotel__confirmation-separator"></div>
              <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--hotel'>
                <span className='booking-hotel__invoice-top-header-label'>Hotel ID</span>
                {/* <div className='booking-hotel__invoice-top-header-value'>{props.data.id_hotel}</div> */}
                <div className="booking-hotel__invoice-top-header-value">{hotelData?.id_hotel}</div>

              </div>
            </div>
            <div className="booking-hotel__invoice-top-header">
              <div className="booking-hotel__invoice-top-header">
                <h4 className='booking-hotel__invoice-top-header--title'>
                  {hotelData?.hotel?.property_name}
                </h4>
                <div className="booking-hotel__invoice-top-header-star">
                  {stars}
                </div>
              </div>
              <span className='booking-hotel__invoice-top-header-address'>
                <SVGIcon src={Icons.MapPin} width={24} height={24} />
                {hotelData?.hotel?.street_address}
              </span>
              <div className="booking-hotel__invoice-top-header-checkin">
                <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                  <span className='booking-hotel__invoice-top-header-checkin'>Check-in</span>
                  <div className="booking-hotel__invoice-top-header-checkin booking-hotel__invoice-top-header-checkin--date">
                    {new Date(hotelData?.checkin).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                  <span>Check-out</span>
                  <div className="booking-hotel__invoice-top-header-checkin booking-hotel__invoice-top-header-checkin--date">
                    {new Date(hotelData?.checkout).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
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
                    <th>Room Name</th>
                    <th>Guets Per Room</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>{personalData?.guest_title} {personalData?.fullname}</td>
                    <td>{personalData?.email}</td>
                    <td>{hotelData?.hotel_layout?.room_name}</td>
                    <td>{hotelData?.hotel_layout?.guest_count}</td>
                    <td>{hotelData?.price_amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="booking-hotel__invoice-wrapper--includes">
            <div className='booking-hotel__invoice-top-header'>
              <div className="booking-hotel__invoice-header">
                <h4 className='booking-hotel__invoice-header-title'><i>Facilities</i></h4>
              </div>
              {hotelData?.hotel_facilities ? (
                Object.entries(hotelData?.hotel_facilities)
                  .filter(([key, value]) => key !== 'breakfast_price') // Filter breakfast_price
                  .map(([key, value], index) => (
                    <div key={index}>
                      {typeof value === 'string' && key !== 'breakfast_price' ? (
                        <ul>
                          <li style={{ fontSize: '16px', fontWeight: '500' }}>
                            {key === 'breakfast' ? `${value} (${hotelData?.hotel_facilities?.breakfast_price})` : value}
                          </li>
                        </ul>
                      ) : (
                        <h6>No facilities</h6>
                      )}
                    </div>
                  ))
              ) : (
                <h4>-</h4>
              )}
            </div>
            {/* <div className='booking-hotel__invoice-top-header'>
              <div className="booking-hotel__invoice-header">
                <h4 className='booking-hotel__invoice-header-title'><i>Hotel Cancellation Policies</i></h4>
              </div>
              <h4 className='booking-hotel__invoice-top-header-title'><i>Hotel Cancellation Policies</i></h4>
              <div className="booking-hotel__invoice-includes-wrapper">

              </div>
            </div> */}
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
                {hotelData?.id_hotel_booking}
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
          <h4>Your booking in {hotelData?.hotel?.property_name} is {statusMessage}</h4>
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

const Payment = (props: personalAndHotelDataProps) => {
  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  return (
    <div className="cancelation__card">
      <div className="cancelation__payment">
        <div className="cancelation__payment-flight">
          <div className="cancelation__payment-flight-destination">
            <h4>{hotelData?.hotel?.property_name}</h4>
          </div>
          <p className="cancelation__payment-flight">Order ID : {hotelData?.id_hotel_booking}</p>
        </div>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__payment-total">
          <p className="cancelation__payment-total-text">Total payment</p>
          <h5>{currencySymbol} {changePrice(hotelData?.hotel_layout.price)}</h5>
        </div>
        {/* This content is unavailable For a moment */}
        {/* <Link className="cancelation__payment-link" href="#">Show More</Link> */}
      </div>
    </div>
  )
}

const HotelDetail = (props: personalAndHotelDataProps) => {
  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;

  const totalGuestCount = (adultCount, childrenCount) => {
    return adultCount + childrenCount;
  }

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
      <div className="cancelation__hotel">
        <div className="cancelation__hotel-summary">
          {hotelData?.hotel?.hotel_photo.length > 0 ? (
            hotelData?.hotel?.hotel_photo.slice(0, 1).map((photo, index) => (
              <BlurPlaceholderImage key={index} src={`${photo?.photo}`} className="cancelation__hotel-summary-image" alt="Hotel Preview" width={120} height={100} />
            ))
          ) : (
            <BlurPlaceholderImage className="cancelation__hotel-summary-image" src={sheratonHotel} alt="Hotel Preview" width={120} height={100} />
          )}
          <div className="cancelation__hotel-summary-text">
            <p className="cancelation__hotel-summary-name">{hotelData?.hotel?.property_name}</p>
            <p className="cancelation__hotel-summary-desc">{hotelData?.hotel_layout?.room_type}</p>
          </div>
          <div className="cancelation__hotel-summary-confirmation">
            <p className="cancelation__hotel-summary-id">ID confirm :</p>
            <p className="cancelation__hotel-summary-number">{hotelData?.payment?.id_hotel_booking_payment}</p>
          </div>
        </div>
        <div className="cancelation__hotel-date">
          <div className="cancelation__hotel-regis">
            <div className="cancelation__hotel-regis-imagery">
              <SVGIcon src={Icons.Calendar} className="" width={20} height={20} />
            </div>
            <div>
              <p className="cancelation__hotel-regis-title">Check-in</p>
              <div className="cancelation__hotel-regis-content">
                <p className="cancelation__hotel-regis-date">{new Date(hotelData?.checkin).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {/* <p className="cancelation__hotel-regis-time">(06:00) - (21:00)</p> */}
              </div>
            </div>
          </div>
          <div className="cancelation__hotel-regis">
            <div className="cancelation__hotel-regis-imagery">
              <SVGIcon src={Icons.Calendar} className="" width={20} height={20} />
            </div>
            <div>
              <p className="cancelation__hotel-regis-title">Check-out</p>
              <div className="cancelation__hotel-regis-content">
                <p className="cancelation__hotel-regis-date">{new Date(hotelData?.checkout).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                {/* <p className="cancelation__hotel-regis-time">(06:00) - (21:00)</p> */}
              </div>
            </div>
          </div>
        </div>
        <hr className="cancelation__card-separator" />
        <div className="cancelation__hotel-detail">
          <div className="cancelation__hotel-detail-item">
            <p className="cancelation__hotel-detail-title">Guest details</p>
            <div className="cancelation__hotel-detail-content">
              <SVGIcon src={Icons.User} className="" width={20} height={20} />
              <p>{hotelData?.guest_title} {hotelData?.guest_fullname}</p>
            </div>
          </div>
          <div className="cancelation__hotel-detail-item">
            <p className="cancelation__hotel-detail-title">Duration</p>
            <div className="cancelation__hotel-detail-content">
              <SVGIcon src={Icons.Sun} className="" width={20} height={20} />
              <p>{formatStayDuration(hotelData?.checkin, hotelData?.checkout)}</p>
            </div>
          </div>
          <div className="cancelation__hotel-detail-item">
            <p className="cancelation__hotel-detail-title">Room</p>
            <div className="cancelation__hotel-detail-content">
              <SVGIcon src={Icons.Calendar} className="" width={20} height={20} />
              <p>{hotelData?.hotel_layout?.number_of_room} Room</p>
            </div>
          </div>
          <div className="cancelation__hotel-detail-item">
            <p className="cancelation__hotel-detail-title">Guest</p>
            <div className="cancelation__hotel-detail-content">
              <SVGIcon src={Icons.Users} className="" width={20} height={20} />
              <p>{totalGuestCount(hotelData?.adult_count, hotelData?.children_count)} guest ({hotelData?.adult_count} Adult {
                hotelData?.children_count > 0 ? `, ${hotelData?.children_count} Children` : ''
              })</p>
            </div>
          </div>
        </div>
        <div className="cancelation__hotel-location">
          <p className="cancelation__hotel-location-title">Location</p>
          <div className="cancelation__hotel-location-detail">
            <div className="cancelation__hotel-location-map">
              <BlurPlaceholderImage src={locationMapImage} alt="Trending City" width={240} height={117} />
              <div className="cancelation__hotel-location-overlay"></div>
              <Link href={`https://www.google.com/maps?q=${hotelData?.hotel?.street_address}`} target='_blank' className="cancelation__hotel-location-button btn btn-sm btn-success">
                <SVGIcon src={Icons.Upload} width={20} height={20} />
                Show Map
              </Link>
            </div>
            <div className="cancelation__hotel-location-text">
              <p className="cancelation__hotel-location-name">{hotelData?.hotel?.city}, {hotelData?.hotel?.country}</p>
              <div className="cancelation__hotel-location-pin">
                <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                <p>{hotelData?.hotel?.street_address}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="cancelation__hotel-facility">
          <p className="cancelation__hotel-facility">Facility</p>
          <div className="cancelation__hotel-facility-list">
            {hotelData?.hotel_amenities.slice(0, 4).map((amenity, index) => (
              <div className="cancelation__hotel-facility-item" key={index}>
                {/* You might need an appropriate icon based on the amenity */}
                <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                <p>{amenity.amenities_name}</p>
              </div>
            ))}
            {hotelData?.hotel_amenities.length > 4 && (
              <button className="cancelation__hotel-facility-button btn btn-lg btn-outline-success">See more facilities</button>
            )}
          </div>
        </div>
      </div>
      <div className="cancelation__flight">
        <div className="cancelation__flight-information">
          <p className="cancelation__flight-header">Additional Information</p>
          <p>{hotelData?.note}</p>
        </div>
      </div>
    </div>
  )
}

const HotelManage = (props: idHotelBookingProps & personalAndHotelDataProps) => {
  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;

  return (
    /* confirmation from Mas Fahmi, managing bookings is left for now*/
    <div className="cancelation__flight border-0">
      <p className="cancelation__card-title">Manage your Booking</p>
      <div>
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.User} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Edit guest details</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
        {hotelData?.reservation_status !== 1 && hotelData?.reservation_status !== 2 && (
          <>
          <Link href="#" className="cancelation__flight-manage">
            <SVGIcon src={Icons.Pencil} className="cancelation__flight-manage-icon" width={24} height={24} />
            <p>Change your room</p>
            <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
          </Link>
          <Link href="#" className="cancelation__flight-manage">
            <SVGIcon src={Icons.SandClock} className="cancelation__flight-manage-icon" width={24} height={24} />
            <p>Reschedule</p>
            <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
          </Link>
          <Link href={`/user/booking/hotel/cancellation?id_booking=${props?.idHotelBooking}`} className="cancelation__flight-manage cancelation__flight-manage--cancel">
            <SVGIcon src={Icons.Cancel} width={24} height={24} />
            <p>Cancel booking</p>
            <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
          </Link>
          </>          
        )}
      </div>
    </div>
  )
}

const HotelHelp = () => {
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
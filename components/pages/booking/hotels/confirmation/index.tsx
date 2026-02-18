import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Link from 'next/link'
import Image from 'next/image';
import logoText from '@/assets/images/logo_text.svg';
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import { useReactToPrint } from 'react-to-print';

interface IProps {
  data: any;
  bookingDetailData?: any;
  bookingPaymentData?: any;
}
const BookingConfirmation = (props:  IProps) => {
  const data = props;
  // console.log("data BookingConfrimation / Completed index : ", data)

  const pageStyle = `
    @page {
        size: A3;
    }

    @media all {
        .pagebreak {
          display: none;
        }
      }

    @media print {

    .pagebreak {
      page-break-before: always;
    }

    @supports (-webkit-print-color-adjust: exact) {
      body {
        -webkit-print-color-adjust: exact;
      }
    }
  }
  `;

  // Handle print
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${data?.data?.fullname}-${data?.data?.id_hotel_booking}-${data?.data?.property_name} [${data?.data?.id_hotel}]`,
    pageStyle
  });

  const paymentRef = useRef();
  const handlePaymentPrint = useReactToPrint({
    content: () => paymentRef.current,
    documentTitle: `${data?.data?.fullname}-${data?.data?.id_hotel_booking}-${data?.data?.property_name} [${data?.data?.id_hotel}]`,
    pageStyle
  });

  // console.log(facilitiesObj)
  
  // console.log(Object.keys(props.data.hotel_policies))
  // console.log(Object.keys(props.data.hotel_policies).forEach((key) => {
  //   console.log(key + ": " + props.data.hotel_policies[key]);
  // }))
  // console.log(props.data.hotel_policies.cancellation_day);
  
  const facilitiesObj = data?.data?.hotel_facilities;

  const starRating = data?.data?.hotel?.star_rating;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const starColor = starRating >= i ? "#EECA32" : "#D9E0E4";
    stars.push(<SVGIcon key={i} src={Icons.Star} width={24} height={24} color={starColor} />);
  }

  const countGuest = (adultCount, childrenCount) => {
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
    <>
      <div className="container" >

        {/* <button className="btn btn-lg btn-success" onClick={handlePrint}>
          <SVGIcon src={Icons.Printer} width={20} height={20} />
          Print</button> */}
        <div className="booking-hotel__confirmation">
          <div className="booking-hotel__confirmation-top">
            <div className="booking-hotel__confirmation-top-header">
              <div className="booking-hotel__confirmation-top-image">
                <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
              </div>
              <div className="booking-hotel__confirmation-top-title">
                <p className="booking-hotel__confirmation-top-title--name">Thanks, {data?.data?.fullname}!</p>
                <h4>Your booking is confirmed.</h4>
              </div>
            </div>
            <div className="booking-hotel__confirmation-top-buttons">
              <Link href={'/contact-us'} className="btn btn-lg btn-outline-success" target="_blank">Contact Us</Link>
              <button className="btn btn-lg btn-success" onClick={handlePrint}>
                <SVGIcon src={Icons.Printer} width={20} height={20} />
                Print</button>
            </div>

            {/* Booking Invoice */}
            <div className='booking-hotel__invoice-container' id='bookingHotelInvoice' ref={componentRef}>
              <main className='booking-hotel__invoice'>
                <Image className='d-flex justify-content-center w-100' src={logoTextDark} alt="Logo" width={300} />
                <div className="booking-hotel__invoice-wrapper--top">
                  <div className='booking-hotel__invoice-top-header'>
                    <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--booking'>
                      <span className='booking-hotel__invoice-top-header-label'>Booking ID</span>
                      <div className='booking-hotel__invoice-top-header-value'>{data?.data?.id_hotel_booking}</div>
                    </div>
                    <div className="booking-hotel__confirmation-separator"></div>
                    <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--hotel'>
                      <span className='booking-hotel__invoice-top-header-label'>Hotel ID</span>
                      <div className='booking-hotel__invoice-top-header-value'>{data?.data?.id_hotel}</div>
                    </div>
                  </div>
                  <div className="booking-hotel__invoice-top-header">
                    <div className="booking-hotel__invoice-top-header">
                      <h4 className='booking-hotel__invoice-top-header--title'>
                        {data?.data?.hotel?.property_name}
                      </h4>
                      <div className="booking-hotel__invoice-top-header-star">
                        {stars}
                      </div>
                    </div>
                    <span className='booking-hotel__invoice-top-header-address'>
                      <SVGIcon src={Icons.MapPin} width={24} height={24} />
                      {data?.data?.street_address}
                    </span>
                    <div className="booking-hotel__invoice-top-header-checkin">
                      <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                        <span className='booking-hotel__invoice-top-header-checkin'>Check-in</span>
                        <span className='booking-hotel__invoice-top-header-checkin booking-hotel__invoice-top-header-checkin--date'>{new Date(data?.data?.checkin).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                        <span>Check-out</span>
                        <span className='booking-hotel__invoice-top-header-checkin--date'>{new Date(data?.data?.checkout).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
                          <td className='booking-hotel__invoice-booking-important'>{data?.data?.fullname}</td>
                          <td>{data?.data?.email}</td>
                          <td className='booking-hotel__invoice-booking-important'>{data?.data?.hotel_layout?.room_type}</td>
                          <td>{data?.data?.hotel_layout?.guest_count}</td>
                          <td>${data?.data?.price_amount}</td>
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
                    {/* <h4 className='booking-hotel__invoice-top-header-title'><i>Facilities</i></h4> */}
                    {data?.data?.hotel?.hotel_facilities ? (
                      Object.entries(data?.data?.hotel?.hotel_facilities)
                        .filter(([key, value]) => key !== 'breakfast_price') // Filter breakfast_price
                        .map(([key, value], index) => (
                          <div key={index}>
                            {typeof value === 'string' && key !== 'breakfast_price' ? (
                              <ul>
                                <li style={{ fontSize: '16px', fontWeight: '500' }}>
                                  {key === 'breakfast' ? `${value} (${data?.data?.hotel?.hotel_facilities?.breakfast_price})` : value}
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
                  <div className='booking-hotel__invoice-top-header'>
                    <div className="booking-hotel__invoice-header">
                      <h4 className='booking-hotel__invoice-header-title'><i>Hotel Cancellation Policies</i></h4>
                    </div>
                    {/* <h4 className='booking-hotel__invoice-top-header-title'><i>Hotel Cancellation Policies</i></h4> */}
                    <div className="booking-hotel__invoice-includes-wrapper">
                      {data?.data?.hotel_policies ? (
                        <>
                          <div>
                            <ul>
                              <li style={{ fontSize: '16px', fontWeight: '500' }}>Cancelation Day : {data?.data?.hotel_policies?.cancellation_day} Days</li>
                            </ul>
                          </div>
                          <div>
                            <ul>
                              <li style={{ fontSize: '16px', fontWeight: '500' }}>Check in from : {data?.data?.hotel_policies?.checkin_from}</li>
                            </ul>
                          </div>
                          <div>
                            <ul>
                              <li style={{ fontSize: '16px', fontWeight: '500' }}>Check in to : {data?.data?.hotel_policies?.checkin_to}</li>
                            </ul>
                          </div>
                          <div>
                            <ul>
                              <li style={{ fontSize: '16px', fontWeight: '500' }}>Check out from : {data?.data?.hotel_policies?.checkout_from} </li>
                            </ul>
                          </div>
                          <div>
                            <ul>
                              <li style={{ fontSize: '16px', fontWeight: '500' }}>Check out to : {data?.data?.hotel_policies?.checkout_to} </li>
                            </ul>
                          </div>
                          <div>
                            {data?.data.hotel_policies.children !== undefined && (
                              <ul>
                                <li style={{ fontSize: '16px', fontWeight: '500' }}>
                                  Children are allowed (Max {data?.data.hotel_policies.children} child)
                                </li>
                              </ul>
                            )}
                            {data?.data.hotel_policies.pets !== undefined && (
                              <ul>
                                <li style={{ fontSize: '16px', fontWeight: '500' }}>
                                  Pets are allowed (Max {data?.data.hotel_policies.pets} pet)
                                </li>
                              </ul>
                            )}
                          </div>
                        </>
                      ) : (
                        <h4>-</h4>
                      )}
                    </div>
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
                      {data?.data?.id_hotel_booking}
                    </div>
                  </div>
                </div>
                {/* <div className="booking-hotel__invoice-footer-bottom">
                  <p>
                    Terms and Conditions apply. Please refer to &nbsp;
                    <Link href={'https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us'}>
                      https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us
                    </Link>
                  </p>
                </div> */}
              </footer>

            </div>
            {/* Booking Invoice */}

            {/* Booking Payment Invoice */}
            <div className='booking-hotel__invoice-container' id='bookingHotelPaymentInvoice' ref={paymentRef}>
              <main className='booking-hotel__invoice'>
                <Image className='d-flex justify-content-center w-100 booking-hotel__invoice-image--keep-visible' src={logoTextDark} alt="Logo" width={300} />
                <div className="booking-hotel__invoice-wrapper--top">
                  <div className='booking-hotel__invoice-top-header'>
                    <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--booking'>
                      <span className='booking-hotel__invoice-top-header-label'>Booking ID</span>
                      <div className='booking-hotel__invoice-top-header-value'>{data?.data?.id_hotel_booking}</div>
                    </div>
                    <div className="booking-hotel__confirmation-separator"></div>
                    <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--hotel'>
                      <span className='booking-hotel__invoice-top-header-label'>Hotel ID</span>
                      <div className='booking-hotel__invoice-top-header-value'>{data?.data.id_hotel}</div>
                    </div>
                  </div>
                  <div className="booking-hotel__invoice-top-header">
                    <div className="booking-hotel__invoice-top-header">
                      <h4 className='booking-hotel__invoice-top-header--title'>
                        {data?.data.property_name}
                      </h4>
                      <div className="booking-hotel__invoice-top-header-star">
                        {stars}
                      </div>
                    </div>
                    <span className='booking-hotel__invoice-top-header-address'>
                      <SVGIcon src={Icons.MapPin} width={24} height={24} />
                      {data?.data.street_address}
                    </span>
                    <div className="booking-hotel__invoice-top-header-checkin">
                      <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                        <span className='booking-hotel__invoice-top-header-checkin'>Check-in</span>
                        <span className='booking-hotel__invoice-top-header-checkin booking-hotel__invoice-top-header-checkin--date'>{new Date(data?.data.checkin).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                        <span>Check-out</span>
                        <span className='booking-hotel__invoice-top-header-checkin--date'>{new Date(data?.data.checkout).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="booking-hotel__invoice-wrapper">
                  <div className="booking-hotel__invoice-header">
                    <h4 className='booking-hotel__invoice-header-title'><i>Payment Details</i></h4>
                  </div>
                  <div className="booking-hotel__invoice-wrapper">
                    <table className='booking-hotel__invoice-booking'>
                      <thead>
                        <tr>
                          <th>Card Name</th>
                          <th>Card Number</th>
                          <th>Card Type</th>
                          <th>CVV</th>
                          <th>Expired Date</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className='booking-hotel__invoice-booking-important'>{props?.data?.card_name}</td>
                          <td>{props?.data?.card_number}</td>
                          <td className='booking-hotel__invoice-booking-important'>{props?.data?.card_type}</td>
                          <td>{props?.data?.cvv}</td>
                          <td>{props?.data?.expired_date}</td>
                          <td>${data?.data?.price_amount}</td>
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
                      {data?.data?.id_hotel_booking}
                    </div>
                  </div>
                </div>
                {/* <div className="booking-hotel__invoice-footer-bottom">
                  <p>
                    Terms and Conditions apply. Please refer to &nbsp;
                    <Link href={'https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us'}>
                      https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us
                    </Link>
                  </p>
                </div> */}
              </footer>

            </div>
            {/* Booking Payment Invoice */}
          </div>
          <div className="booking-hotel__confirmation-separator"></div>
          <div className="booking-hotel__confirmation-details">
            <div className="booking-hotel__confirmation-content" id="bookingHotelConfirmation">
              <div className="booking-hotel__confirmation-content__title">
                <h5>{data?.data?.hotel?.property_name} </h5>
                <div className="booking-hotel__confirmation-content__title-location">
                  <SVGIcon src={Icons.MapPin} width={24} height={24} />
                  <p className="booking-hotel__confirmation-content__title-location">Hotel in {data?.data?.hotel?.city}, {data?.data?.hotel?.country}</p>
                </div>
                <div className="booking-hotel__confirmation-content__title-rating">
                  {stars}
                </div>
              </div>
              <div className="booking-hotel__confirmation-content__details">
                <p>{data?.data?.hotel_layout?.room_type}</p>
                <div className="booking-hotel__confirmation-content__details-row">
                  <div className="booking-hotel__confirmation-content__details-row">
                    <SVGIcon src={Icons.Moon} width={20} height={20} />
                    <p>{formatStayDuration(data?.data.checkin, data?.data.checkout)}</p>
                  </div>
                  <div className="booking-hotel__confirmation-content__details-dot"></div>
                  <div className="booking-hotel__confirmation-content__details-row">
                    <SVGIcon src={Icons.Users} width={20} height={20} />
                    <p>
                      {countGuest(data?.data?.adult_count, data?.data?.children_count)} people ( {data?.data?.adult_count} Adult {data?.data?.children_count > 0 && (
                        <span>& {data?.data?.children_count} Children</span>
                      )})
                      </p>
                  </div>
                </div>
                <div className="booking-hotel__confirmation-content__details-schedule">
                  <div className="booking-hotel__confirmation-content__details-schedule-type">
                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                    <p>Check-in Time : </p>
                  </div>
                  <p>{`${new Date(data?.data.checkin).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} ${new Date(data?.data.checkin).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}</p>
                </div>
                <div className="booking-hotel__confirmation-content__details-schedule">
                  <div className="booking-hotel__confirmation-content__details-schedule-type">
                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                    <p>Check-out Time : </p>
                  </div>
                  <p>{`${new Date(data?.data.checkout).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} ${new Date(data?.data.checkout).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`}</p>
                </div>
                <div className="booking-hotel__confirmation-separator"></div>
              </div>
              <div className="booking-hotel__confirmation-content__info">
                <div className="booking-hotel__confirmation-content__info-rows">
                  <SVGIcon className="booking-hotel__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                  <div className="booking-hotel__confirmation-content__info-text">
                    We’ve sent your confirmation email to
                    <span className="booking-hotel__confirmation-content__info-text--highlighted"> {data?.data?.email}.</span>
                    {/* <a href="#" className="booking-hotel__confirmation-content__info-text--link"> Change email</a> */}
                  </div>
                </div>
                <div className="booking-hotel__confirmation-content__info-rows">
                  <SVGIcon className="booking-hotel__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                  <div className="booking-hotel__confirmation-content__info-text">
                    You can <span className="booking-hotel__confirmation-content__info-text--highlighted">modify or cancel</span> your booking until check-in.
                  </div>
                </div>
                <div className="booking-hotel__confirmation-content__info-rows">
                  <SVGIcon className="booking-hotel__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                  <div className="booking-hotel__confirmation-content__info-text">
                    Your payment will be handled by
                    <span className="booking-hotel__confirmation-content__info-text--handler"> {data?.data.property_name}.</span>
                    <a href="#" className="booking-hotel__confirmation-content__info-text--link" onClick={handlePaymentPrint}> Click here </a>
                    for the  payment details.
                  </div>
                </div>
              </div>
            </div>
            {data?.data?.hotel?.hotel_photo?.length > 0 ? (
              data?.data?.hotel?.hotel_photo.slice(0, 1).map((photo, index) => (
                <img key={index} src={photo.photo} className="booking-hotel__confirmation-image" alt="Hotel Preview" width={400} height={400} />
              ))
            ) : (
              <img className="booking-hotel__confirmation-image" src={Images.Placeholder} alt="Hotel Preview" width={400} height={400} />
            )}
          </div>

        </div>
      </div>

    </>
  )
}

// const BookingHotelInvoce = forwardRef((props, ref) => {
//   const componentRef = useRef();

//   return (
//     <div className='booking-hotel__invoice' id='bookingHotelInvoice' ref={componentRef}>
//       <Image className='d-flex justify-content-center w-100' src={logoTextDark} alt="Logo" width={300} />
//       <div className="booking-hotel__invoice-wrapper">
//         <div className="booking-hotel__invoice-header">
//           <h4 className='booking-hotel__invoice-header-title'>Payment Details</h4>
//         </div>
//         <div className="booking-hotel__invoice-wrapper--payment">
//           <span>Card Type : Visa</span>
//           <span>Card Number : 1234 5678</span>
//           <span>CVV : 113</span>
//           <span>Expired Date : 09 / 2027</span>
//         </div>
//       </div>
//       <div className="booking-hotel__invoice-wrapper">
//         <div className="booking-hotel__invoice-header">
//           <h4 className='booking-hotel__invoice-header-title'>Customer Details</h4>
//         </div>
//         <div className="booking-hotel__invoice-wrapper">
//           <div className="booking-hotel__invoice-wrapper">
//             <span>Full Name : Visa</span>
//             <span>Email : 1234 5678</span>
//             <span>Phone : +1</span>
//             <span>Title : Owner</span>
//           </div>
//         </div>
//       </div>
//       <div className="booking-hotel__invoice-wrapper">
//         <div className="booking-hotel__invoice-header">
//           <h4 className='booking-hotel__invoice-header-title'>Hotel Details</h4>
//         </div>
//         <div className="booking-hotel__invoice-wrapper">
//           <div className="booking-hotel__invoice-wrapper">
//             <span>Full Name : Visa</span>
//             <span>Email : 1234 5678</span>
//             <span>Phone : +1</span>
//             <span>Title : Owner</span>
//           </div>
//         </div>
//       </div>
//       <div className="booking-hotel__invoice-wrapper">
//         <div className="booking-hotel__invoice-header">
//           <h4 className='booking-hotel__invoice-header-title'>Booking Details</h4>
//         </div>
//         <div className="booking-hotel__invoice-wrapper">
//           <table>
//             <tr>
//               <th>No</th>
//               <th>Guest Name</th>
//               <th>Email</th>
//               <th>Hotel Name</th>
//               <th>Qty</th>
//               <th>Price / 1 Unit</th>
//               <th>Total</th>
//             </tr>
//             <tr>
//               <td>1</td>
//               <td>Laksamana AryaPutra</td>
//               <td>laksamana.arya1412@gmail.com</td>
//               <td>Savana Hotel</td>
//               <td>1</td>
//               <td>$120.98</td>
//               <td>$120.98</td>
//             </tr>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// })



export default BookingConfirmation
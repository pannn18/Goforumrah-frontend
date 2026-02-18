import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import carConfirmationPreview from '@/assets/images/car_details_image_1.png'
import kingAbdulazizAirport from '@/assets/images/king_abdulaziz_international_airport.png'

interface IProps {
  data: any;
  bookingDetailData?: any;
  bookingPaymentData?: any;
}
const BookingConfirmation = (props) => {
  const { data, bookingDetailData, bookingPaymentData } = props
  // Convert the array to an object using destructuring
  const objData = data[0] || []; // Default to an empty array if data is falsy
  console.log('Booking Confrimation Page - Data : ', objData);
  // console.log('Booking Confrimation Page - Detail : ', bookingDetailData);
  // console.log('Booking Confrimation Page - Payment : ', bookingPaymentData);
  
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

  return (
    <div className="container">
      <div className="booking-hotel__confirmation">
        <div className="booking-hotel__confirmation-top">
          <div className="booking-hotel__confirmation-top-header">
            <div className="booking-hotel__confirmation-top-image">
              <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="booking-hotel__confirmation-top-title">
              <p className="booking-hotel__confirmation-top-title--name">Thanks, {bookingDetailData?.fullname || objData?.fullname}!</p>
              <h4>Your booking is confirmed.</h4>
            </div>
          </div>
          <div className="booking-hotel__confirmation-top-buttons">
            <button className="btn btn-lg btn-outline-success">Contact Book Transfer</button>
            <button className="btn btn-lg btn-success">
              <SVGIcon src={Icons.Printer} width={20} height={20} />
              Print Confirmation  
            </button>
          </div>
        </div>
        <div className="booking-hotel__confirmation-separator"></div>
        <div className="booking-hotel__confirmation-details">
          <img className="booking-hotel__confirmation-image" src={objData?.photo || carConfirmationPreview} alt="Hotel Preview" width={600} height={465} />
          <div className="booking-hotel__confirmation-content">
            <div className="booking-hotel__confirmation-content__title">
              <h5>{data?.car_brand || objData?.car_brand} {data?.edition || objData?.edition}</h5>
              <div className="booking-hotel__confirmation-content__title-brand">
                <img src={ objData?.car_company?.profile_icon || Images.Placeholder} className="booking-hotel__confirmation-content__title-brand-image" alt="Trending City" width={24} height={24} />                
                <p>{objData?.car_company?.name || data?.car_company?.name}</p>
              </div>
              <div className="booking-hotel__confirmation-content__details-row">
                <div className="booking-hotel__confirmation-content__details-row">
                  <SVGIcon src={Icons.User} width={20} height={20} />
                  <p>{objData?.car_facilities.find(facility => facility.name_facility === "Seat")?.amount} passengers</p>
                </div>
                <div className="booking-hotel__confirmation-content__details-dot"></div>
                <div className="booking-hotel__confirmation-content__details-row">
                  <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                  <p>Baggages {objData?.car_facilities.find(facility => facility.name_facility === "Baggage")?.amount === "yes" ? 'Available' : 'Not Available'}</p>
                </div>
              </div>              
            </div>
            <div className="booking-hotel__confirmation-separator"></div>
            <div className="booking-hotel__confirmation-preview">
              <div className="booking-hotel__confirmation-preview__booking">
                <BlurPlaceholderImage className="booking-hotel__confirmation-preview__booking-image" src={kingAbdulazizAirport} alt="Booking Details Preview" width={71} height={38} />
                <div className="booking-hotel__confirmation-preview__booking-desc">
                  <p className="booking-hotel__confirmation-preview__booking-tag">Pick-up</p>
                  <p className="booking-hotel__confirmation-preview__booking-name">{data?.book_details?.pickup || objData?.pickup}</p>
                  <div className="booking-hotel__confirmation-preview__booking-date">                    
                    <p>{formatDate(data?.book_details?.pickup_date_time || objData?.pickup_date_time)}</p>
                    <div className="booking-hotel__confirmation-preview__booking-date--dots"></div>
                    <p>{formatTime(data?.book_details?.pickup_date_time || objData?.pickup_date_time)}</p>
                  </div>
                </div>
              </div>              
              <div className="booking-hotel__confirmation-preview__booking">
                <BlurPlaceholderImage className="booking-hotel__confirmation-preview__booking-image" src={kingAbdulazizAirport} alt="Booking Details Preview" width={71} height={38} />
                <div className="booking-hotel__confirmation-preview__booking-desc">
                  <p className="booking-hotel__confirmation-preview__booking-tag">Drop - off</p>
                  <p className="booking-hotel__confirmation-preview__booking-name">{data?.book_details?.dropoff || objData?.dropoff}</p>
                  <div className="booking-hotel__confirmation-preview__booking-date">       
                    <p>{formatDate(data?.book_details?.dropoff_date_time || objData?.dropoff_date_time)}</p>
                    <div className="booking-hotel__confirmation-preview__booking-date--dots"></div>
                    <p>{formatTime(data?.book_details?.dropoff_date_time || objData?.dropoff_date_time)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="booking-hotel__confirmation-separator"></div>
            <div className="booking-hotel__confirmation-content__info">
              <div className="booking-hotel__confirmation-content__info-rows">
                <SVGIcon className="booking-hotel__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="booking-hotel__confirmation-content__info-text">
                  We’ve sent your confirmation email to
                  <span className="booking-hotel__confirmation-content__info-text--highlighted"> {bookingDetailData?.email || objData?.email}.</span>
                  <a href="#" className="booking-hotel__confirmation-content__info-text--link"> Change email</a>
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
                  <span className="booking-hotel__confirmation-content__info-text--handler"> {objData?.car_company?.name || data?.car_company?.name}.</span>
                  <a href="#" className="booking-hotel__confirmation-content__info-text--link"> Click here </a>
                  for the  payment details.
                </div>
              </div>
            </div>
          </div>          
        </div>

      </div>
    </div>
  )
}



export default BookingConfirmation
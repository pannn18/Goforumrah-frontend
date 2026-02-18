import React, { useState , useEffect} from 'react'
import { Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Link from 'next/link'
import kingAbdulazizAirport from '@/assets/images/king_abdulaziz_international_airport.png'
import { UseCurrencyConverter } from "@/components/convertCurrency"

interface IProps {
  data?: any
}

const CarBookingSummary = (props : IProps) => {
  const { data } = props
  // console.log("CarBookingSummary : ", data)
  
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

  const { changePrice, currencySymbol } = UseCurrencyConverter();  
  return (
    <div className="booking-transfer__summary-details">
      <p className="booking-transfer__summary-details-title">Starts from</p>
      <div className="booking-transfer__summary-booking">
        <BlurPlaceholderImage className="booking-transfer__summary-booking-image" src={kingAbdulazizAirport} alt="Booking Details Preview" width={71} height={38} />
        <div className="booking-transfer__summary-booking-desc">
          <p className="booking-transfer__summary-booking-tag">Pick-up</p>
          <p className="booking-transfer__summary-booking-name">{data?.book_details?.pickup || data?.pickup}</p>
          <div className="booking-transfer__summary-booking-date">
            <p>{formatDate(data?.book_details?.pickup_date_time || data?.pickup_date_time)}</p>
            <div className="booking-transfer__summary-booking-date--dots"></div>
            <p>{formatTime(data?.book_details?.pickup_date_time || data?.pickup_date_time)}</p>
          </div>
        </div>
      </div>
      <div className="booking-transfer__summary-details-separator"></div>
      <div className="booking-transfer__summary-booking">
        <BlurPlaceholderImage className="booking-transfer__summary-booking-image" src={kingAbdulazizAirport} alt="Booking Details Preview" width={71} height={38} />
        <div className="booking-transfer__summary-booking-desc">
          <p className="booking-transfer__summary-booking-tag">Drop - off</p>
          <p className="booking-transfer__summary-booking-name">{data?.book_details?.dropoff || data?.dropoff}</p>
          <div className="booking-transfer__summary-booking-date">
            <p>{formatDate(data?.book_details?.dropoff_date_time || data?.dropoff_date_time)}</p>
            <div className="booking-transfer__summary-booking-date--dots"></div>
            <p>{formatTime(data?.book_details?.dropoff_date_time || data?.dropoff_date_time)}</p>
          </div>
        </div>
      </div>
      <div className="booking-transfer__summary-details-separator"></div>
      <div className="booking-transfer__summary-price">
        <p className="booking-transfer__summary-price-title">Total</p>
        <div className="booking-transfer__summary-price-column">
          <h5>{currencySymbol} {changePrice(String(data?.book_details?.total_price || data?.total_price))}</h5>
          <Link href="#" className="booking-transfer__summary-price-link">See pricing details</Link>
        </div>
      </div>      
    </div>
  )
}

export default CarBookingSummary
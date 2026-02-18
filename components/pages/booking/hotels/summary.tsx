import React, { useState, useEffect } from 'react'
import { Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { HotelPassenger } from '@/types/types';
import { UseCurrencyConverter } from "@/components/convertCurrency"

interface HotelBookingSummaryProps {
  data: any;
}

const HotelBookingSummary = (props: HotelBookingSummaryProps) => {
  const { data } = props;
  console.log("HotelBookingSummary : ", data);
  const [passenger, setPassenger] = useState(null)
  useEffect(() => {
    if (passenger) return
    // Load saved passenger
    const savedPassenger = localStorage.getItem('search-hotel-passenger')
    let initialPassenger: HotelPassenger = JSON.parse(savedPassenger)
    setPassenger(initialPassenger)
  }, [])

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  return (
    <div className="booking-hotel__summary">
      <div className="booking-hotel__summary-title">Booking Details</div>
      <div className="booking-hotel__summary-preview">
        {!!(data?.hotel_photo?.length || data?.hotel?.hotel_photo?.length) ? (
          <img
            src={
              data.hotel_photo?.[0]?.photo ||
              data.hotel?.hotel_photo?.[0]?.photo
            }
            alt="Uploaded"
            className="booking-hotel__summary-preview-image"
            style={{ width: '104px', height: '104px' }}
          />
        ) : (
          <BlurPlaceholderImage
            className="booking-hotel__summary-preview-image"
            src={Images.Placeholder}
            alt="Choosed Hotel"
            width={92}
            height={92}
          />
        )}
        <div className="booking-hotel__summary-preview-content">
          <div className="booking-hotel__summary-preview-content-title">{data?.property_name || data?.hotel?.property_name}</div>
          <div className="booking-hotel__summary-preview-content-desc">{data?.hotel_layout?.room_type}</div>
          <div className="booking-hotel__summary-preview-content-box">
            <div className="booking-hotel__summary-preview-content-box">
              <SVGIcon src={Icons.Moon} width={16} height={16} />
              <div>{Math.ceil(Number(new Date(data?.check_out || data?.checkout)) - Number(new Date(data?.check_in || data?.checkin))) / (1000 * 60 * 60 * 24)} nights</div>
            </div>
            <div className="booking-hotel__summary-preview-content-dot"></div>
            <div className="booking-hotel__summary-preview-content-box">
              <SVGIcon src={Icons.Users} width={16} height={16} />
              <div>{passenger?.adult} guest</div>
            </div>
          </div>
          {passenger?.children > 0 && (
            <div className="booking-hotel__summary-preview-content-box">
              <div className="booking-hotel__summary-preview-content-box">
                <SVGIcon src={Icons.Users} width={16} height={16} />
                <div>{passenger?.children} child</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="booking-hotel__summary-separator"></div>
      <div className="booking-hotel__summary-time">
        <div className="booking-hotel__summary-time-type">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} />
          Check-in Time :
        </div>
        <div className="booking-hotel__summary-time-date">{new Date(data?.check_in || data?.checkin).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
      </div>
      <div className="booking-hotel__summary-time">
        <div className="booking-hotel__summary-time-type">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} />
          Check-out Time :
        </div>
        <div className="booking-hotel__summary-time-date">{new Date(data?.check_out || data?.checkout).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</div>
      </div>
      <div className="booking-hotel__summary-separator"></div>
      <div className="booking-hotel__summary-total">
        <div className="booking-hotel__summary-total-title">Total</div>
        <div className="booking-hotel__summary-total-price">
          <div className="booking-hotel__summary-total-price--text">{currencySymbol} {changePrice(data?.hotel_layout?.price)}</div>
          <a href="#" className="booking-hotel__summary-total-price--link">See pricing details</a>
        </div>
      </div>
    </div>
  )
}

export default HotelBookingSummary
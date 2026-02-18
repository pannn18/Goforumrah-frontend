import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { useRouter } from 'next/router'
import moment from 'moment'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"


interface PropsTourBookingSummary {
  data: any
  bookingData?: any
}

const TourBookingSummary = (props: PropsTourBookingSummary) => {
  const router = useRouter()
  const { data, bookingData } = props
  const { id_plan, start_date, tickets } = router.query

  // console.log('summary data: ', data);
  // console.log('booking data: ', bookingData);

  const formattedDate = moment(start_date).format('ddd, DD MMM YY');
  const foundPlan = data?.tour_plans?.find(plan => plan.id_tour_plan === Number(id_plan));
  const totalPrice = parseFloat(foundPlan?.price) * Number(tickets);

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  return (
    <div className="booking-tour__summary">
      <div className="booking-tour__summary-title">Booking Details</div>
      <div className="booking-tour__summary-preview">
        <BlurPlaceholderImage className="booking-tour__summary-preview-image" src={
          data?.tour_photos[0]?.photo 
        } alt="Choosed Hotel" width={92} height={92} />
        <div className="booking-tour__summary-preview-content">
          <div className="booking-tour__summary-preview-content-title">{data?.package_name}</div>
          <div className="booking-tour__summary-preview-content-time">
            <div className="booking-tour__summary-preview-content-date">
              {formattedDate}
            </div>
            <div className="booking-tour__summary-preview-content-date">
              {/* 10:00 */}
            </div>
          </div>
          <div className="booking-tour__summary-preview-content-desc">{tickets} X Plan {foundPlan?.type_plan}</div>
        </div>
      </div>
      <div className="booking-tour__summary-separator"></div>
      <div className="booking-tour__summary-type">
        <div className="booking-tour__summary-type-people">
          <SVGIcon src={Icons.User} width={20} height={20} />
          Adult (Age 1-80)
        </div>
        <div className="booking-tour__summary-type-desc">{tickets} x Adult</div>
      </div>
      <div className="booking-tour__summary-separator"></div>
      <div className="booking-tour__summary-total">
        <div className="booking-tour__summary-total-title">Total</div>
        <div className="booking-tour__summary-total-price">
          <div className="booking-tour__summary-total-price--text">{currencySymbol} {changePrice(totalPrice)}</div>
          <a href="#" className="booking-tour__summary-total-price--link">See pricing details</a>
        </div>
      </div>
    </div>
  )
}



export default TourBookingSummary
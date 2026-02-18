import React, { useRef, useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import moment from 'moment'
import Link from "next/link"
import { useReactToPrint } from 'react-to-print'


interface IProps {
  data: any
  bookingDetailData?: any
}

const BookingConfirmation = (props: IProps) => {

  const { data, bookingDetailData } = props

  //Convert the array to an object using destructuring
  const objBookingData = bookingDetailData[0] || []; // Default to an empty array if data is falsy
  console.log(objBookingData)

  const date = moment(objBookingData?.start_date).format('ddd, DD MMM YYYY')
  console.log(date);

  const foundPlan = data?.tour_plans?.find(plan => plan.id_tour_plan === objBookingData?.id_tour_plan);
  
  const typePlan = foundPlan?.type_plan


  // Handle print
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${data?.package_name}-[${data?.id_tour_package}-${typePlan}]-Booking Detail`,
    pageStyle: `
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
  }`
  });


  return (
    <div className="container">
      <div className="booking-tour__confirmation">
        <div className="booking-tour__confirmation-top">
          <div className="booking-tour__confirmation-top-header">
            <div className="booking-tour__confirmation-top-image">
              <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="booking-tour__confirmation-top-title">
              <p className="booking-tour__confirmation-top-title--name">Thanks, {objBookingData?.fullname}!</p>
              <h4>Your booking is confirmed.</h4>
            </div>
          </div>
          <div className="booking-tour__confirmation-top-buttons">
            <Link className="btn btn-lg btn-outline-success" href={`/user/booking/tour-package/${objBookingData?.id_tour_booking}`}>See detail order</Link>
            <button className="btn btn-lg btn-success" onClick={handlePrint}>
              <SVGIcon src={Icons.Printer} width={20} height={20} />
              Print Confirmation</button>
          </div>
        </div>
        <div className="booking-tour__confirmation-separator"></div>
        <div className="booking-tour__confirmation-details" ref={componentRef}>
          <div className="booking-tour__confirmation-content">
            <div className="booking-tour__confirmation-content__title">
              <h5>{data?.package_name}</h5>
              <div className="booking-tour__confirmation-content__title-location">
                <div className="booking-tour__confirmation-content__title-pin">
                  <SVGIcon src={Icons.MapPin} width={24} height={24} />
                </div>
                <p className="booking-tour__confirmation-content__title-location">{data?.address}</p>
              </div>
              <div className="booking-tour__confirmation-content__title-rating">
                {Array.from({ length: data?.rating }, (_, index) => (
                  <SVGIcon key={index} src={Icons.Star} width={24} height={24} />
                ))}
              </div>
            </div>
            <div className="booking-tour__confirmation-content__details">
              <p>{objBookingData?.number_of_tickets} X Plan {typePlan}</p>
              <div className="booking-tour__confirmation-content__details-schedule">
                <div className="booking-tour__confirmation-content__details-schedule-type">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p>Adult (1-80) </p>
                </div>
                <p>{objBookingData?.number_of_tickets}X Adult </p>
              </div>
              <div className="booking-tour__confirmation-content__details-schedule">
                <div className="booking-tour__confirmation-content__details-schedule-type">
                  <SVGIcon src={Icons.Calendar} width={20} height={20} />
                  <p>Date </p>
                </div>
                <p>{date}</p>
              </div>
              <div className="booking-tour__confirmation-separator"></div>
            </div>
            <div className="booking-tour__confirmation-content__info">
              <div className="booking-tour__confirmation-content__info-rows">
                <SVGIcon className="booking-tour__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="booking-tour__confirmation-content__info-text">
                  We’ve sent your confirmation email to
                  <span className="booking-tour__confirmation-content__info-text--highlighted"> {bookingDetailData?.email_address}</span>
                  <a href="#" className="booking-tour__confirmation-content__info-text--link"> Change email</a>
                </div>
              </div>
              <div className="booking-tour__confirmation-content__info-rows">
                <SVGIcon className="booking-tour__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="booking-tour__confirmation-content__info-text">
                  You can <span className="booking-tour__confirmation-content__info-text--highlighted">modify or cancel</span> your booking until check-in.
                </div>
              </div>
            </div>
          </div>
          <img className="booking-tour__confirmation-image" src={data?.tour_photos[0]?.photo || Images.Placeholder} alt="Hotel Preview" width={400} height={400} />
        </div>

      </div>
    </div>
  )
}



export default BookingConfirmation
import React, { Fragment, useState, useRef, useEffect } from 'react'
import { Icons, Images, Services } from '@/types/enums'
import Image from 'next/image';
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import BookingSummary from '@/components/pages/booking/flights/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import BookingHeader from '@/components/pages/booking/header'
import airlineQatarAirways from '@/assets/images/airline_partner_qatar_airways.png'
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import { callAPI, callMystiflyAPI, callBookingAPI } from '@/lib/axiosHelper'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import moment from 'moment'
import Link from 'next/link'
import { useReactToPrint } from 'react-to-print';
import { Data } from '@react-google-maps/api'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"


export const getServerSideProps: GetServerSideProps<{
  tripDetails: any
  airports: any
  uniqueID: string
}> = async (context) => {
  const uniqueID = context.params?.uniqueID

  const { ok, data: tripDetails, status, error } = await callMystiflyAPI({
    url: 'https://restapidemo.myfarebox.com/api/tripdetails/' + uniqueID,
    method: 'GET',
  }, (context.req.headers.host.includes('localhost') || context.req.headers.host.includes('127.0.0.1') ? 'http://' : 'https://') + context.req.headers.host)

  if (ok && tripDetails?.Data?.TripDetailsResult && tripDetails?.Success) {
    const { ok: airportsOK, data: airports } = await callBookingAPI({
      url: 'https://booking-com15.p.rapidapi.com/api/v1/flights/getFlightDetails',
      method: 'GET'
    }, (context.req.headers.host.includes('localhost') || context.req.headers.host.includes('127.0.0.1') ? 'http://' : 'https://') + context.req.headers.host)

    if (airports?.places) {
      return {
        props: {
          tripDetails: tripDetails.Data.TripDetailsResult,
          airports: airports.places,
          uniqueID: uniqueID as string
        },
      }
    }
  }

  return {
    notFound: true,
  }
}

export default function Page({
  tripDetails,
  airports,
  uniqueID
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data: session, status } = useSession()
  const { changePrice, currencySymbol } = UseCurrencyConverter();

  useEffect(() => {

    const fetchPersonalUser = async () => {

      const payload = {
        id_customer: session?.user?.id
      }

      const { data, ok, error } = await callAPI('/customer/personal/show', 'POST', payload, true)

      try {
        if (data) {
          setUserPersonal(data)
        } else {
          console.log('Data personal not found!')
        }
      } catch (err) {
        console.log(err.message)
      }

    }

    fetchPersonalUser()

  }, [session?.user?.id])

  // console.log(itineraries)
  // console.log(session?.user)
  // console.log(session)


  // console.log(airports)
  // console.log(itineraries)

  const [userPersonal, setUserPersonal] = useState<any>([]);
  console.log(userPersonal)

  const ETicketRef = useRef();
  const handleETicketPrint = useReactToPrint({
    content: () => ETicketRef.current,
    documentTitle: `${userPersonal?.title} ${userPersonal?.fullname}-${uniqueID}`,
  });

  const itineraries = tripDetails?.TravelItinerary?.Itineraries.length ? tripDetails?.TravelItinerary?.Itineraries[0]?.ItineraryInfo?.ReservationItems : []
  const itinerariesNoReturn = itineraries.filter(itinerary => !itinerary?.IsReturn)
  const itinerariesNoReturnDuration = itinerariesNoReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)
  const itinerariesReturn = itineraries.filter(itinerary => itinerary?.IsReturn)
  const itinerariesReturnDuration = itinerariesReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)

  const origin = itinerariesNoReturn?.length ? itinerariesNoReturn[0] : null
  const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin?.DepartureAirportLocationCode)
  const originName = airports?.[originKey]?.name

  const destination = itinerariesNoReturn?.length ? itinerariesNoReturn[itinerariesNoReturn.length - 1] : null
  const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination?.ArrivalAirportLocationCode)
  const destinationName = airports?.[destinationKey]?.name

  const returnOrigin = itinerariesReturn?.length ? itinerariesReturn[0] : null
  const returnOriginKey = Object.keys(airports || {}).find(key => airports[key]?.iata === returnOrigin?.DepartureAirportLocationCode)
  const returnOriginName = airports?.[returnOriginKey]?.name

  const returnDestination = itinerariesReturn?.length ? itinerariesReturn[itinerariesReturn.length - 1] : null
  const returnDestinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === returnDestination?.ArrivalAirportLocationCode)
  const returnDestinationName = airports?.[returnDestinationKey]?.name

  const fareBreakdowns = tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns?.length ? tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0] : {}
  const passengers = tripDetails?.TravelItinerary?.PassengerInfos?.length ? tripDetails?.TravelItinerary?.PassengerInfos : []

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <main className="booking-hotel">
        <BookingHeader current={'confirmation'} handlePreviousStep={() => { }} />
        <div className="container">
          <div className="booking-hotel__confirmation">
            <div className="booking-hotel__confirmation-top">
              <div className="booking-hotel__confirmation-top-header">
                <div className="booking-hotel__confirmation-top-image">
                  <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                </div>
                <div className="booking-hotel__confirmation-top-title">
                  {(session?.user && status === 'authenticated') && (
                    <p className="booking-hotel__confirmation-top-title--name">Thanks, {userPersonal?.title} {userPersonal?.fullname}!</p>
                  )}
                  <h4>Your booking is confirmed.</h4>
                </div>
              </div>
              <div className="booking-hotel__confirmation-top-buttons">
                <button className="btn btn-lg btn-success" onClick={handleETicketPrint}>
                  <SVGIcon src={Icons.Printer} width={20} height={20} />
                  <span>Download E-Ticket</span>
                </button>
              </div>
              {/* E TICKET */}
              <div className='booking-hotel__invoice-container' id='bookingHotelPaymentInvoice' ref={ETicketRef}>
                <main className='booking-hotel__invoice'>
                  <Image className='d-flex justify-content-center w-100 booking-hotel__invoice-image--keep-visible' src={logoTextDark} alt="Logo" width={300} />
                  <div className="booking-hotel__invoice-wrapper--top">
                    <div className='booking-hotel__invoice-top-header'>
                      <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--booking'>
                        <span className='booking-hotel__invoice-top-header-label'>Order ID</span>
                        <div className='booking-hotel__invoice-top-header-value'>
                          {uniqueID}
                        </div>
                      </div>
                      <div className="booking-hotel__confirmation-separator"></div>
                      <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--hotel'>
                        <span className='booking-hotel__invoice-top-header-label'>Booking Code (PNR)</span>
                        <div className='booking-hotel__invoice-top-header-value'>
                          {destination?.AirlinePNR}
                        </div>
                      </div>
                    </div>
                    <div className="cancelation__flight-summary--eTicket">
                      <div className="cancelation__flight-summary-logo--eTicket">
                        <BlurPlaceholderImage className="" src={Images.Placeholder} alt="Flight Logo" width={69} height={48} />
                      </div>
                      <div className="cancelation__flight-summary-content--eTicket">
                        <div className="cancelation__flight-summary-schedule--eTicket">
                          <p className="cancelation__flight-summaryschedule-sub">{moment(origin?.DepartureDateTime).format('D MMM YY')}</p>
                          <h4>{moment(origin?.DepartureDateTime).format('HH:mm')}</h4>
                          <p className="cancelation__flight-summaryschedule-sub">{origin?.DepartureAirportLocationCode}</p>
                        </div>
                        <div className="cancelation__flight-summary-duration--eTicket">
                          <p className='cancelation__flight-summary-duration--eTicket-text'>{Math.floor(itinerariesNoReturnDuration / 60)}h {moment.duration(itinerariesNoReturnDuration, 'minutes').minutes()}m</p>
                          <div className='cancelation__flight-summary-duration--eTicket-icon'>
                            <SVGIcon src={Icons.AirplaneLineLong} width={347} height={8} />
                            <SVGIcon src={Icons.Airplane} width={16} height={16} />
                          </div>
                          <p className='cancelation__flight-summary-duration--eTicket-text'>{itinerariesNoReturn?.length > 1 ? `${itinerariesNoReturn?.length - 1} Transit` : 'Direct'}</p>
                        </div>
                        <div className="cancelation__flight-summary-schedule--eTicket">
                          <p className="cancelation__flight-summaryschedule-sub">{moment(origin?.ArrivalDateTime).format('D MMM YY')}</p>
                          <h4>{moment(destination?.ArrivalDateTime).format('HH:mm')}</h4>
                          <p className="cancelation__flight-summaryschedule-sub">{destination?.ArrivalAirportLocationCode}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="booking-hotel__invoice-wrapper">
                    <div className="booking-hotel__invoice-header">
                      <h4 className='booking-hotel__invoice-header-title'><i>Passenger Details</i></h4>
                    </div>
                    {!!passengers.length && (
                      <Fragment>
                        <div>
                          {passengers.map((passenger, index) => (
                            <div className="booking-hotel__invoice-wrapper" key={index}>
                              <table className='booking-hotel__invoice-booking'>
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Passport Number</th>
                                    <th>Cabin</th>
                                    <th>Baggage</th>
                                    {/* <th>Total</th> */}
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr key={index}>
                                    <td className='booking-hotel__invoice-booking-important'>
                                      {passenger?.Passenger?.PaxName?.PassengerTitle} {passenger?.Passenger?.PaxName?.PassengerFirstName} {passenger?.Passenger?.PaxName?.PassengerLastName}
                                    </td>
                                    <td>
                                      {passenger?.Passenger?.EmailAddress}
                                    </td>
                                    <td className='booking-hotel__invoice-booking-important'>
                                      {passenger?.Passenger?.PhoneNumber}
                                    </td>
                                    <td>
                                      {passenger?.Passenger?.PassportNumber}
                                    </td>
                                    <td>{destination?.CabinClassType}</td>
                                    <td>
                                      <p>{fareBreakdowns?.CabinBaggageInfo[index]}</p>
                                    </td>
                                    {/* <td>{tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount} {tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode}</td> */}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ))}
                        </div>
                        <div className="booking-hotel__confirmation-separator"></div>
                        <p className='d-flex justify-content-end booking-hotel__invoice-booking-important fs-6'>Total : {currencySymbol} {changePrice(tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount)} 
                        {/* {tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode} */}
                        </p>
                      </Fragment>
                    )}

                  </div>
                </main>
                <footer className="booking-hotel__invoice-footer">
                  <div className="booking-hotel__invoice-footer-top">
                    <div className="booking-hotel__invoice-footer-item">
                      <span className='booking-hotel__invoice-footer-title'> FOR ANY QUESTIONS, VISIT GOFORUMARAH HELP CENTER :</span>
                      <div className="booking-hotel__invoice-footer-link">
                        <SVGIcon src={Icons.Help} width={24} height={24} />
                        <Link href={'https://goforumrah.com/contact-us'}>
                          https://goforumrah.com/contact-us                            </Link>
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
                      <span className='booking-hotel__invoice-footer-title'>  ORDER ID </span>
                      <div className="booking-hotel__invoice-footer-link">
                        <SVGIcon src={Icons.BookingComplete} width={24} height={24} />
                        {uniqueID}
                      </div>
                    </div>
                  </div>
                </footer>
                {/* E TICKET */}
              </div>
              {/* E TICKET */}
            </div>
            <div className="booking-hotel__confirmation-separator"></div>
            {!!itineraries?.length && itineraries.map((itinerary, index) => {
              const origin = itinerary?.DepartureAirportLocationCode
              const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin)
              const originName = airports?.[originKey]?.name

              const destination = itinerary?.ArrivalAirportLocationCode
              const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination)
              const destinationName = airports?.[destinationKey]?.name

              return (
                <Fragment key={`flight-details-${index}`}>
                  <div className="booking-flight__confirmation-item">
                    <div className="booking-flight__confirmation-item-brand">
                      <BlurPlaceholderImage src={Images.Placeholder} alt="Qatar Airways" width={160} height={48} />
                    </div>
                    <div>
                      <h5 className="booking-flight__confirmation-item-title">{[`${originName} ${origin && `(${origin})`}`, `${destinationName} ${destination && `(${destination})`}`].join(' - ')}</h5>
                      <div className="booking-flight__confirmation-item-details">
                        <div>{moment(itinerary?.DepartureDateTime).format('ddd, DD MMM YY')}</div>
                        <div className="booking-flight__confirmation-item-details-bullet" />
                        <div>{moment(itinerary?.DepartureDateTime).format('HH:mm')}</div>
                      </div>
                      {itinerary?.IsReturn && (
                        <div className="booking-flight__summary-item-cta">
                          <div className="link link-green-01">Return Flight</div>
                        </div>
                      )}
                    </div>
                  </div>
                </Fragment>
              )
            })}
            <div className="booking-hotel__confirmation-separator"></div>
            <div className="booking-hotel__confirmation-details">
              <div className="booking-hotel__confirmation-content">
                <div className="booking-hotel__confirmation-content__info">
                  <div className="booking-hotel__confirmation-content__info-rows">
                    <SVGIcon className="booking-hotel__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                    <div className="booking-hotel__confirmation-content__info-text">
                      You can <span className="booking-hotel__confirmation-content__info-text--highlighted">modify or cancel</span> your booking until check-in.
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </Layout>
  )
}
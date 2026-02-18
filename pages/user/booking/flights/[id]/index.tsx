import React, { useState, useEffect, Fragment, useRef } from 'react'
import { useRouter } from 'next/router'
import { Icons, Images } from '@/types/enums'
import Image from 'next/image';
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import Layout from '@/components/layout'
import UserLayout from '@/components/user/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import airlineEmiratesAirways from '@/assets/images/airline_partner_emirates.png'
import Link from 'next/link'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { callAPI, callMystiflyAPI, callSkyscannerAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import airlines from "@/lib/db/airlines.json"

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"



export const getServerSideProps: GetServerSideProps<{
  tripDetails: any
  airports: any
  uniqueID: string
}> = async (context) => {
  const uniqueID = context.params?.id

  const { ok, data: tripDetails, status, error } = await callMystiflyAPI({
    url: 'https://restapidemo.myfarebox.com/api/tripdetails/' + uniqueID,
    method: 'GET',
  }, (context.req.headers.host.includes('localhost') || context.req.headers.host.includes('127.0.0.1') ? 'http://' : 'https://') + context.req.headers.host)

  if (ok && tripDetails?.Data?.TripDetailsResult && tripDetails?.Success) {
    const { ok: airportsOK, data: airports } = await callSkyscannerAPI({
      url: 'https://partners.api.skyscanner.net/apiservices/v3/geo/hierarchy/flights/en-US',
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
  const MYSTIFLY_PASSENGERS = {
    'ADT': 'Adult',
    'CHD': 'Children',
    'INF': 'Baby'
  }

  const router = useRouter()
  const { data: session, status } = useSession()
  const { changePrice, currencySymbol } = UseCurrencyConverter();

  const [isStatusCompleted, setIsStatusCompleted] = useState(true)

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

  const isBeforeDeparture = moment(origin?.DepartureDateTime).isBefore()
  const cancelAllowed = (fareBreakdowns?.AirRefundCharges?.[isBeforeDeparture ? 'IsRefundableBeforeDeparture' : 'IsRefundableAfterDeparture'] || '').toLowerCase() === 'yes'

  const foundAirline = (airlines as any[]).find((airline: any) => airline.code === itineraries?.[0]?.MarketingAirlineCode)

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


  const [userPersonal, setUserPersonal] = useState<any>([])
  // console.log(userPersonal)

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

  const ETicketRef = useRef<HTMLDivElement | null>(null);
  const handleETicketPrint = useReactToPrint({
    content: () => ETicketRef.current,
    documentTitle: `${userPersonal?.title}. ${userPersonal?.fullname}-${uniqueID}-${destination?.AirlinePNR}`,
    pageStyle
  });

  const handleETicketSave = async () => {
    const componentRef = ETicketRef.current;

    if (!componentRef) {
      console.error('ETicketRef is not defined');
      return;
    }

    // Set the ETicket to visible 
    componentRef.style.display = 'block';
    componentRef.style.opacity = '1';
    componentRef.style.pointerEvents = 'visible';


    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(componentRef);

      // Set the ETicket to unvisible  
      componentRef.style.display = 'none';
      componentRef.style.opacity = '0';
      componentRef.style.opacity = 'none';

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a3',
      });

      const contentHeight = (canvas.height * 297) / canvas.width;
      // console.log('canvas height : ', canvas.height)
      // console.log('canvas width : ', canvas.width)
      // console.log('content height : ', contentHeight)

      pdf.addImage(imgData, 'PNG', 0, 0, 297, contentHeight);

      // save file
      pdf.save(`${userPersonal?.title}. ${userPersonal?.fullname}-${uniqueID}-${destination?.AirlinePNR}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error.message);
    }
  };


  // console.log(tripDetails)
  // console.log(destination)
  // console.log(fareBreakdowns)

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout
        activeMenu='booking'
        breadcrumb={[
          { text: 'My Booking', url: '/user', category: 'flight' },
          { text: `${originName} to ${destinationName}` },
        ]}
      >
        <div className="search-hotel">
          <div className="cancelation__list">
            {/* Utterance */}
            <div className="cancelation__card cancelation__card--row">
              <div className="cancelation__utterance ">
                <div className="cancelation__utterance-icon">
                  <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                </div>
                <div className="cancelation__utterance-subtitile">
                  {(session?.user && status === 'authenticated') && (
                    <p className="cancelation__utterance-subtitile">Thanks, {userPersonal?.title}. {userPersonal?.fullname}!</p>
                  )}
                  <h4>Your booking in {originName} to {destinationName} is {tripDetails?.TravelItinerary?.BookingStatus ? tripDetails?.TravelItinerary?.BookingStatus.toLowerCase() : 'confirmed'}</h4>
                </div>
              </div>
              {isStatusCompleted && (
                <>
                  <div className="cancelation__utterance-action">
                    <button className="btn btn-lg btn-success" onClick={handleETicketPrint}>
                      <SVGIcon src={Icons.Printer} width={20} height={20} />
                      Print Confirmation
                    </button>
                    <button className="btn btn-lg btn-outline-success" onClick={handleETicketSave}>
                      <SVGIcon src={Icons.Download} width={20} height={20} />
                      Save File
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
                            <p className='d-flex justify-content-end booking-hotel__invoice-booking-important fs-6'>Total : {tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount} {tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode}</p>
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
                </>
              )}
            </div>

            {!isStatusCompleted && <TicketCombo />}

            {/* Payment */}
            <div className="cancelation__card">
              <div className="cancelation__payment">
                <div className="cancelation__payment-flight">
                  <div className="cancelation__payment-flight-destination">
                    <h4>{originName}</h4>
                    <div className="cancelation__payment-flight-icon">
                      <SVGIcon src={Icons.AirplaneLineMedium} width={165} height={8} />
                      <SVGIcon src={Icons.Airplane} width={16} height={16} />
                    </div>
                    <h4>{destinationName}</h4>
                  </div>
                  <p className="cancelation__payment-flight">Order ID : {uniqueID}</p>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__payment-total">
                  <p className="cancelation__payment-total-text">Total payment</p>
                  <h5>{currencySymbol} {changePrice(tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount)} 
                  {/* {tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode} */}
                  </h5>
                </div>
              </div>
            </div>

            {/* FlightDetail */}
            <div className="cancelation__card">
              <p className="cancelation__card-title">Flight details</p>
              <div className="cancelation__flight">
                <a className="cancelation__flight-header" data-bs-toggle="collapse" href="#departure-flight-details" role="button" aria-expanded="true" aria-controls="departure-flight-details">
                  <p>Flight to {destinationName} {destination?.ArrivalAirportLocationCode ? `(${destination?.ArrivalAirportLocationCode})` : ''}</p>
                  <SVGIcon src={Icons.ArrowDown} className="" width={20} height={20} />
                </a>
                <div className="cancelation__flight-summary">
                  <div className="cancelation__flight-summary-logo">
                    <BlurPlaceholderImage className="" src={foundAirline?.image || Images.Placeholder} alt="Flight Logo" width={69} height={48} />
                  </div>
                  <div className="cancelation__flight-summary-content">
                    <div className="cancelation__flight-summary-schedule">
                      <h4>{moment(origin?.DepartureDateTime).format('HH:mm')}</h4>
                      <p className="cancelation__flight-summaryschedule--sub">{origin?.DepartureAirportLocationCode}</p>
                    </div>
                    <div className="cancelation__flight-summary-duration">
                      <p className='cancelation__flight-summary-duration--text'>{Math.floor(itinerariesNoReturnDuration / 60)}h {moment.duration(itinerariesNoReturnDuration, 'minutes').minutes()}m</p>
                      <div className='cancelation__flight-summary-duration--icon'>
                        <SVGIcon src={Icons.AirplaneLineLong} width={347} height={8} />
                        <SVGIcon src={Icons.Airplane} width={16} height={16} />
                      </div>
                      <p className='cancelation__flight-summary-duration--text'>{itinerariesNoReturn?.length > 1 ? `${itinerariesNoReturn?.length - 1} Transit` : 'Direct'}</p>
                    </div>
                    <div className="cancelation__flight-summary-schedule">
                      <h4>{moment(destination?.ArrivalDateTime).format('HH:mm')}</h4>
                      <p className="cancelation__flight-summaryschedule--sub">{destination?.ArrivalAirportLocationCode}</p>
                    </div>
                  </div>
                </div>
                <hr className="cancelation__card-separator" />
                <div className="cancelation__flight-inner collapse show" id="departure-flight-details">
                  {itinerariesNoReturn.map((itinerary, index) => {
                    const origin = itinerary?.DepartureAirportLocationCode
                    const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin)
                    const originName = airports?.[originKey]?.name

                    const destination = itinerary?.ArrivalAirportLocationCode
                    const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination)
                    const destinationName = airports?.[destinationKey]?.name

                    return (
                      <Fragment key={`departure-flight-details-${index}`}>
                        <div className="cancelation__flight-details cancelation__flight-details--solid-line">
                          <div className="cancelation__flight-details-title">
                            <p className="cancelation__flight-details-title--time">{moment(itinerary?.DepartureDateTime).format('HH:mm')}</p>
                            <p className="cancelation__flight-details-title--date">{moment(itinerary?.DepartureDateTime).format('D MMM YY')}</p>
                          </div>
                          <div className="cancelation__flight-details-content-right">
                            <div className="cancelation__flight-details-content">
                              <div className="cancelation__flight-details-airport">
                                <p className="cancelation__flight-details-airport--name">{originName} ({origin})</p>
                                {itinerary?.DepartureTerminal && (
                                  <p className="cancelation__flight-details-airport--terminal">Departure Terminal {itinerary?.DepartureTerminal}</p>
                                )}
                              </div>
                              <hr className="cancelation__card-separator" />
                            </div>
                            <div className="cancelation__flight-details-plane">
                              <div className="cancelation__flight-details-logo">
                                <BlurPlaceholderImage className="" src={foundAirline?.image || Images.Placeholder} alt="Flight Logo" width={35} height={24} />
                              </div>
                              <div>
                                <p className="cancelation__flight-details-plane--type">{itinerary?.MarketingAirlineCode || itinerary?.OperatingAirlineCode}-{itinerary?.FlightNumber}</p>
                                <p className="cancelation__flight-details-plane--class">{itinerary?.CabinClassType}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cancelation__flight-details">
                          <div className="cancelation__flight-details-title">
                            <p className="cancelation__flight-details-title--time">{moment(itinerary?.ArrivalDateTime).format('HH:mm')}</p>
                            <p className="cancelation__flight-details-title--date">{moment(itinerary?.ArrivalDateTime).format('D MMM YY')}</p>
                          </div>
                          <div className="cancelation__flight-details-content">
                            <div className="cancelation__flight-details-airport">
                              <p className="cancelation__flight-details-airport--name">{destinationName} ({destination})</p>
                              {itinerary?.ArrivalTerminal && (
                                <p className="cancelation__flight-details-airport--terminal">Arrival Terminal {itinerary?.ArrivalTerminal}</p>
                              )}
                            </div>
                            <hr className="cancelation__card-separator" />
                            <div className="cancelation__flight-details-amenities">
                              {(!!fareBreakdowns?.BaggageInfo?.length && fareBreakdowns?.BaggageInfo[index]) && (
                                <div className="cancelation__flight-details-amenities--item">
                                  <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                                  <p>{[`Baggage: ${fareBreakdowns?.BaggageInfo[index]}`, ...(!!fareBreakdowns?.CabinBaggageInfo?.length && fareBreakdowns?.CabinBaggageInfo[index] ? [`Cabin: ${fareBreakdowns?.CabinBaggageInfo[index]}`] : [])].join(', ')}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    )
                  })}
                </div>
              </div>
              {!!itinerariesReturn?.length && (
                <div className="cancelation__flight">
                  <a className="cancelation__flight-header" data-bs-toggle="collapse" href="#return-flight-details" role="button" aria-expanded="true" aria-controls="return-flight-details">
                    <p>Flight return to {returnDestinationName} {returnDestination?.ArrivalAirportLocationCode ? `(${returnDestination?.ArrivalAirportLocationCode})` : ''}</p>
                    <SVGIcon src={Icons.ArrowDown} className="" width={20} height={20} />
                  </a>
                  <div className="cancelation__flight-summary">
                    <div className="cancelation__flight-summary-logo">
                      <BlurPlaceholderImage className="" src={foundAirline?.image || Images.Placeholder} alt="Flight Logo" width={69} height={48} />
                    </div>
                    <div className="cancelation__flight-summary-content">
                      <div className="cancelation__flight-summary-schedule">
                        <h4>{moment(returnOrigin?.DepartureDateTime).format('HH:mm')}</h4>
                        <p className="cancelation__flight-summaryschedule--sub">{returnOrigin?.DepartureAirportLocationCode}</p>
                      </div>
                      <div className="cancelation__flight-summary-duration">
                        <p className='cancelation__flight-summary-duration--text'>{Math.floor(itinerariesReturnDuration / 60)}h {moment.duration(itinerariesReturnDuration, 'minutes').minutes()}m</p>
                        <div className='cancelation__flight-summary-duration--icon'>
                          <SVGIcon src={Icons.AirplaneLineLong} width={347} height={8} />
                          <SVGIcon src={Icons.Airplane} width={16} height={16} />
                        </div>
                        <p className='cancelation__flight-summary-duration--text'>{itinerariesReturn?.length > 1 ? `${itinerariesReturn?.length - 1} Transit` : 'Direct'}</p>
                      </div>
                      <div className="cancelation__flight-summaryschedule">
                        <h4>{moment(returnDestination?.ArrivalDateTime).format('HH:mm')}</h4>
                        <p className="cancelation__flight-summaryschedule--sub">{returnDestination?.ArrivalAirportLocationCode}</p>
                      </div>
                    </div>
                  </div>
                  <hr className="cancelation__card-separator" />
                  <div className="cancelation__flight-inner collapse show" id="return-flight-details">
                    {itinerariesReturn.map((itinerary, index) => {
                      const origin = itinerary?.DepartureAirportLocationCode
                      const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin)
                      const originName = airports?.[originKey]?.name

                      const destination = itinerary?.ArrivalAirportLocationCode
                      const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination)
                      const destinationName = airports?.[destinationKey]?.name

                      return (
                        <Fragment key={`departure-flight-details-${index}`}>
                          <div className="cancelation__flight-details cancelation__flight-details--solid-line">
                            <div className="cancelation__flight-details-title">
                              <p className="cancelation__flight-details-title--time">{moment(itinerary?.DepartureDateTime).format('HH:mm')}</p>
                              <p className="cancelation__flight-details-title--date">{moment(itinerary?.DepartureDateTime).format('D MMM YY')}</p>
                            </div>
                            <div className="cancelation__flight-details-content-right">
                              <div className="cancelation__flight-details-content">
                                <div className="cancelation__flight-details-airport">
                                  <p className="cancelation__flight-details-airport--name">{originName} ({origin})</p>
                                  {itinerary?.DepartureTerminal && (
                                    <p className="cancelation__flight-details-airport--terminal">Departure Terminal {itinerary?.DepartureTerminal}</p>
                                  )}
                                </div>
                                <hr className="cancelation__card-separator" />
                              </div>
                              <div className="cancelation__flight-details-plane">
                                <div className="cancelation__flight-details-logo">
                                  <BlurPlaceholderImage className="" src={foundAirline?.image || Images.Placeholder} alt="Flight Logo" width={35} height={24} />
                                </div>
                                <div>
                                  <p className="cancelation__flight-details-plane--type">{itinerary?.MarketingAirlineCode || itinerary?.OperatingAirlineCode}-{itinerary?.FlightNumber}</p>
                                  <p className="cancelation__flight-details-plane--class">{itinerary?.CabinClassType}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="cancelation__flight-details">
                            <div className="cancelation__flight-details-title">
                              <p className="cancelation__flight-details-title--time">{moment(itinerary?.ArrivalDateTime).format('HH:mm')}</p>
                              <p className="cancelation__flight-details-title--date">{moment(itinerary?.ArrivalDateTime).format('D MMM YY')}</p>
                            </div>
                            <div className="cancelation__flight-details-content">
                              <div className="cancelation__flight-details-airport">
                                <p className="cancelation__flight-details-airport--name">{destinationName} ({destination})</p>
                                {itinerary?.ArrivalTerminal && (
                                  <p className="cancelation__flight-details-airport--terminal">Arrival Terminal {itinerary?.ArrivalTerminal}</p>
                                )}
                              </div>
                              <hr className="cancelation__card-separator" />
                              <div className="cancelation__flight-details-amenities">
                                {(!!fareBreakdowns?.BaggageInfo?.length && fareBreakdowns?.BaggageInfo[index]) && (
                                  <div className="cancelation__flight-details-amenities--item">
                                    <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                                    <p>{[`Baggage: ${fareBreakdowns?.BaggageInfo[index]}`, ...(!!fareBreakdowns?.CabinBaggageInfo?.length && fareBreakdowns?.CabinBaggageInfo[index] ? [`Cabin: ${fareBreakdowns?.CabinBaggageInfo[index]}`] : [])].join(', ')}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Fragment>
                      )
                    })}
                  </div>
                </div>
              )}
              <div className="cancelation__flight">
                <p className="cancelation__flight-header">Passenger</p>
                {!!passengers.length && passengers.map((passenger, index) => (
                  <div key={`passenger-detail-${index}`} className="cancelation__flight-passenger-header">
                    <div className="cancelation__flight-passenger-desc">
                      <p className="cancelation__flight-passenger-desc--number">{index + 1}.</p>
                      <div className="cancelation__flight-passenger-desc--icon">
                        <SVGIcon src={Icons.User} width={20} height={20} />
                      </div>
                      <p className="cancelation__flight-passenger-desc--name">{Object.keys(passenger?.Passenger?.PaxName || {}).map((key) => passenger?.Passenger?.PaxName?.[key]).join(' ')}</p>
                      {MYSTIFLY_PASSENGERS[passenger?.Passenger?.PassengerType] && (
                        <div className="btn btn-sm btn-outline-info cancelation__flight-passenger-desc--button">{MYSTIFLY_PASSENGERS[passenger?.Passenger?.PassengerType]}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* {!isStatusCompleted && <FlightManage />} */}

            {/* FlightManage */}
            <div className="cancelation__flight border-0">
              <p className="cancelation__card-title">Manage your Booking</p>
              <div>
                {/* TODO: Disabled due to no design */}
                {/* <Link href="#" className="cancelation__flight-manage">
                  <SVGIcon src={Icons.User} className="cancelation__flight-manage-icon" width={24} height={24} />
                  <p>Edit guest details</p>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
                </Link> */}
                {/* <Link href="#" className="cancelation__flight-manage">
                  <SVGIcon src={Icons.SandClock} className="cancelation__flight-manage-icon" width={24} height={24} />
                  <p>Reschedule</p>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
                </Link> */}
                <Link href={cancelAllowed ? `/user/booking/flights/${uniqueID}/cancel` : `/user/booking/flights/${uniqueID}`} className="cancelation__flight-manage cancelation__flight-manage--cancel">
                  <SVGIcon src={Icons.Cancel} width={24} height={24} />
                  <p>Cancel booking {!cancelAllowed && '(Not allowed)'}</p>
                  <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
                </Link>
              </div>
            </div>
            <FlightHelp />
          </div>
        </div>
      </UserLayout>
      <Footer />
    </Layout>
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
        <SVGIcon className="cancelation__ticket-icon" src={Icons.Hotel} width={24} height={24} />
        <div className="cancelation__ticket-text">
          <p className="cancelation__ticket-name">Book a hotel</p>
          <h4 className="cancelation__ticket-desc">Book your hotel and enjoy your trip, get 15% discount on booking now</h4>
        </div>
        <button className="btn btn-lg btn-outline-success">Book Now</button>
      </div>
    </div>
  )
}

const FlightManage = () => {
  return (
    <div className="cancelation__flight border-0">
      <p className="cancelation__card-title">Manage your Booking</p>
      <div>
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.User} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Edit guest details</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
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
        <Link href="#" className="cancelation__flight-manage">
          <SVGIcon src={Icons.Door} className="cancelation__flight-manage-icon" width={24} height={24} />
          <p>Change your room</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
        <Link href="/cancelation/flight/reason" className="cancelation__flight-manage cancelation__flight-manage--cancel">
          <SVGIcon src={Icons.Cancel} width={24} height={24} />
          <p>Cancel booking</p>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-manage-arrow" width={24} height={24} />
        </Link>
      </div>
    </div>
  )
}

const FlightHelp = () => {
  return (
    <div className="cancelation__flight border-0">
      <p className="cancelation__card-title">Need a help ?</p>
      <div className="cancelation__flight-help">
        <Link href="#" className="cancelation__flight-help-card">
          <SVGIcon src={Icons.Help} className="cancelation__flight-help-icon" width={24} height={24} />
          <div className="cancelation__flight-help-text">
            <p className="cancelation__flight-help-title">Help center</p>
            <p className="cancelation__flight-help-subtitle">Find solutions to your problems easily</p>
          </div>
          <SVGIcon src={Icons.ArrowRight} className="cancelation__flight-help-arrow" width={24} height={24} />
        </Link>
        <Link href="#" className="cancelation__flight-help-card">
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
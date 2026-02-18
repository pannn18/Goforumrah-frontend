import React, { Fragment, useState } from 'react'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import BookingSummary from '@/components/pages/booking/flights/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import BookingHeader from '@/components/pages/booking/header'
import airlineQatarAirways from '@/assets/images/airline_partner_qatar_airways.png'
import { callMystiflyAPI, callSkyscannerAPI } from '@/lib/axiosHelper'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useSession } from 'next-auth/react'
import moment from 'moment'
import Link from 'next/link'

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
  const itineraries = tripDetails?.TravelItinerary?.Itineraries.length ? tripDetails?.TravelItinerary?.Itineraries[0]?.ItineraryInfo?.ReservationItems : []
  const itinerariesNoReturn = itineraries.filter(itinerary => !itinerary?.IsReturn)
  const itinerariesNoReturnDuration = itinerariesNoReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)
  const itinerariesReturn = itineraries.filter(itinerary => itinerary?.IsReturn)
  const itinerariesReturnDuration = itinerariesReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)
  const totalDuration = parseInt(itinerariesNoReturnDuration || '0') + parseInt(itinerariesReturnDuration || '0')

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

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <main className="search-hotel">
        <div className="booking-hotel__header">
          <div className="container">
            <div className="booking-hotel__header-wrapper">
              <Link href="/user" className="booking-hotel__header-title">
                <div className="booking-hotel__header-title-button">
                  <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                </div>
                <h4>Back</h4>
              </Link>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="search-hotel__wrapper">
            <div className="cancelation__list">
              <div className="cancelation__confirmation">
                <div className="cancelation__confirmation-top">
                  <div className="cancelation__confirmation-top-header">
                    <div className="cancelation__confirmation-top-image">
                      <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                    </div>
                    <div className="cancelation__confirmation-top-title">
                      {(isBeforeDeparture ? fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesBeforeDeparture?.[0]?.Charges : fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesAfterDeparture) == 0 && (
                        <div className="cancelation__confirmation-top-tag">Free cancellation</div>
                      )}
                      <h4>Your Flight Cancellation was successful</h4>
                      <p className="cancelation__confirmation-top-title--name">For information regarding refunds, we will immediately inform you via your email</p>
                    </div>
                  </div>
                  <div className="cancelation__confirmation-top-buttons">
                    <Link href={'/?search=flights'} className="btn btn-lg btn-outline-success">
                      <span>Find another flight</span>
                    </Link>
                    <Link href={'/'} className="btn btn-lg btn-success">
                      <span>Back to home</span>
                    </Link>
                  </div>
                </div>
                <div className="cancelation__confirmation-separator"></div>
                <div className="cancelation__confirmation-item">
                  <div className="cancelation__confirmation-item-brand">
                    <BlurPlaceholderImage src={Images.Placeholder} alt="Qatar Airways" width={104} height={56} />
                  </div>
                  <div>
                    <h5 className="cancelation__confirmation-item-title">{originName} ({origin?.DepartureAirportLocationCode}) - {destinationName} ({destination?.ArrivalAirportLocationCode})</h5>
                    <div className="cancelation__confirmation-item-details">
                      <div>{moment(origin?.DepartureDateTime).format('ddd, DD MMM YY')}</div>
                      <div className="cancelation__confirmation-item-details-bullet" />
                      <div>{moment(origin?.DepartureDateTime).format('HH:mm')}</div>
                    </div>
                  </div>
                </div>
                {!!itinerariesReturn?.length && (
                  <div className="cancelation__confirmation-item">
                    <div className="cancelation__confirmation-item-brand">
                      <BlurPlaceholderImage src={Images.Placeholder} alt="Qatar Airways" width={104} height={56} />
                    </div>
                    <div>
                      <h5 className="cancelation__confirmation-item-title">{returnOriginName} ({returnOrigin?.DepartureAirportLocationCode}) - {returnDestinationName} ({returnDestination?.ArrivalAirportLocationCode})</h5>
                      <div className="cancelation__confirmation-item-details">
                        <div>{moment(returnOrigin?.DepartureDateTime).format('ddd, DD MMM YY')}</div>
                        <div className="cancelation__confirmation-item-details-bullet" />
                        <div>{moment(returnOrigin?.DepartureDateTime).format('HH:mm')}</div>
                        <div className="cancelation__confirmation-item-details-bullet" />
                        <div>Return</div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="cancelation__confirmation-separator"></div>
                <div className="cancelation__confirmation-details">
                  <div className="cancelation__confirmation-content">
                    <div className="cancelation__confirmation-content__info">
                      <div className="cancelation__confirmation-content__info-rows">
                        <SVGIcon className="cancelation__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                        <div className="cancelation__confirmation-content__info-text">
                          <span className="cancelation__confirmation-content__info-text--highlighted">Your booking was succesfully cancelled -</span> You don’t have to do anything else!
                        </div>
                      </div>
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
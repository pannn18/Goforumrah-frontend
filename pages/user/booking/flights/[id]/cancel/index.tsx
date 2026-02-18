import React, { useState } from 'react'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import UserLayout from '@/components/user/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import ManageCardList from '@/components/pages/manage/manageCard'
import airlineEmiratesAirways from '@/assets/images/airline_partner_emirates.png'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { callMystiflyAPI, callSkyscannerAPI } from '@/lib/axiosHelper'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import moment from 'moment'

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
  const router = useRouter()
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

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

  const fareBreakdowns = tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns?.length ? tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0] : {}
  const passengers = tripDetails?.TravelItinerary?.PassengerInfos?.length ? tripDetails?.TravelItinerary?.PassengerInfos : []

  const reasonOptions = [
    'Airlines changing flight schedules',
    'Due to the Corona virus pandemic',
    'Accidentally placed an order',
    'Wrong date',
    'Personal reasons',
  ]
  const [reason, setReason] = useState<string>(reasonOptions[0])

  const [confirmStep, setConfirmStep] = useState<boolean>(false)

  const isBeforeDeparture = moment(origin?.DepartureDateTime).isBefore()
  const cancelAllowed = (fareBreakdowns?.AirRefundCharges?.[isBeforeDeparture ? 'IsRefundableBeforeDeparture' : 'IsRefundableAfterDeparture'] || '').toLowerCase() === 'yes'

  const handleCancel = async () => {
    setError('')

    const payload = {
      UniqueID: uniqueID,
      Target: 'Test'
    }

    setLoading(true)

    const { ok, data: response, status, error } = await callMystiflyAPI({
      url: 'https://restapidemo.myfarebox.com/api/v1/booking/cancel',
      method: 'POST',
      data: payload
    })

    setLoading(false)

    if (ok && response?.Success) {
      router.push(router.asPath + '/complete')
    } else {
      setError(response?.Message || error || 'Unknown error')
    }
  }

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout
        activeMenu='booking'
        breadcrumb={[
          { text: 'My Booking', url: '/user', category: 'flight' },
          { text: `${originName} to ${destinationName}`, url: '/user/booking/flights/' + uniqueID },
          { text: 'Cancel booking', ...(confirmStep ? { url: 'javascript:void(0)' } : {}) },
          ...(confirmStep ? [{ text: 'Confirm cancellation' }] : [])
        ]}
      >
        {cancelAllowed ? (confirmStep ? (
          <>
            <div className="cancelation__card cancelation__reason">
              <div className="cancelation__card-header">
                <h5>Confirm cancellation</h5>
                <p className="cancelation__card-subtitle">You are about to cancel your entire booking. Please review the details belom before cancelling</p>
              </div>
              <div className="cancelation__confirm-preview">
                <p className="cancelation__confirm-title">Flight Preview</p>
                <div className="cancelation__confirm-wrapper">
                  <div className="cancelation__confirm-preview-image">
                    <BlurPlaceholderImage src={airlineEmiratesAirways} alt="Flight Logo" width={76} height={54} />
                  </div>
                  <div className="cancelation__confirm-preview-text">
                    <p className="cancelation__confirm-preview-name">{originName} to {destinationName} {itinerariesReturn?.length ? `(Return)` : '(One Way)'}</p>
                    <p className="cancelation__confirm-preview-detail">{itineraries?.length > 1 ? `${itineraries.length - 1} Transit` : 'Direct'}</p>
                    <div className="cancelation__confirm-preview-information">
                      <div className="cancelation__confirm-preview-information">
                        <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                        <p>{Math.floor(totalDuration / 60)}h {moment.duration(totalDuration, 'minutes').minutes()}m</p>
                      </div>
                      <div className="cancelation__confirm-preview-dot"></div>
                      <div className="cancelation__confirm-preview-information">
                        <SVGIcon src={Icons.Users} width={20} height={20} />
                        <p>{passengers.length} passenger</p>
                      </div>
                    </div>
                  </div>
                  {(isBeforeDeparture ? fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesBeforeDeparture?.[0]?.Charges : fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesAfterDeparture) == 0 && (
                    <button className="cancelation__confirm-preview-button">Free cancellation</button>
                  )}
                </div>
              </div>
              <div className="cancelation__confirm-bill cancelation__confirm-bill--text">
                <p>Your booking</p>
                <p>{tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount} {tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode}</p>
              </div>
              <div className="cancelation__confirm-bill cancelation__confirm-bill--text">
                <p>Cancellation fee</p>
                <p>{isBeforeDeparture ? `${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesBeforeDeparture?.[0]?.Charges} ${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.Currency}` : `${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesAfterDeparture} ${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.Currency}`}</p>
              </div>
              <div className="cancelation__confirm-bill cancelation__confirm-bill--bold">
                <p>You will be charged</p>
                <p>{isBeforeDeparture ? `${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesBeforeDeparture?.[0]?.Charges} ${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.Currency}` : `${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.ChargesAfterDeparture} ${fareBreakdowns?.AirRefundCharges?.RefundCharges?.[0]?.Currency}`}</p>
              </div>
              <div className="cancelation__card-footer">
                <button type='button' className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Continue</button>
              </div>
            </div>

            <div className="modal fade" id="confirmationModal" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
              <div className="modal-dialog cancelation__modal">
                <div className="modal-content cancelation__modal-body">
                  <div className="cancelation__modal-content">
                    <div className="cancelation__modal-image">
                      <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
                    </div>
                    <div className="cancelation__modal-text">
                      <h3>Do you want to proceed with the cancellation ?</h3>
                      <p className="cancelation__modal-desc">Once a request has been submitted, you cannot change or add it again</p>
                    </div>
                    {error && (
                      <div className="d-flex flex-column align-items-center text-center text-danger-main">
                        {error}
                      </div>
                    )}
                  </div>
                  <div className="cancelation__modal-footer">
                    <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
                    <button disabled={loading} type='button' onClick={handleCancel} className="btn btn-lg btn-success cancelation__modal-button">{loading ? 'Please wait...' : 'Request to cancel'}</button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="cancelation__list">
            <div className="cancelation__card cancelation__reason">
              <div className="cancelation__card-header">
                <h5>Reason for cancelling</h5>
                <p className="cancelation__card-subtitle">We can find alternative solution if you need to make changes to your booking</p>
              </div>
              <div>
                {reasonOptions.map((value, index) => (
                  <label key={`reason-option-${index}`} className="cancelation__reason-option form-check" htmlFor={`reason-option-${index}`}>
                    <p className="form-check-label">{value}</p>
                    <input type="radio" name="cancelReason" id={`reason-option-${index}`} className="form-check-input cancelation__reason-input" checked={value === reason} onChange={(e) => e.target.checked && setReason(value)} />
                  </label>
                ))}
              </div>
              <div className="cancelation__card-footer">
                <Link href={'/user/booking/flights/' + uniqueID} className="btn btn-lg btn-outline-success">Keep this booking</Link>
                <button onClick={() => setConfirmStep(true)} type="button" className="btn btn-lg btn-success">Continue</button>
              </div>
            </div>
          </div>
        )) : (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-center" style={{ minHeight: 'calc(100vh - 80px)' }}>Sorry, we couldn't find it.</div>
        )}
      </UserLayout>
      <Footer />
    </Layout>
  )
}
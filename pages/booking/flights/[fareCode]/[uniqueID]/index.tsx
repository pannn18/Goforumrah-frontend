import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import BookingSummary from '@/components/pages/booking/flights/summary'
import BannerInfo from '@/components/pages/home/bannerInfo'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import BookingHeader from '@/components/pages/booking/header'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { callAPI, callMystiflyAPI, callBookingAPI } from '@/lib/axiosHelper'
import moment from 'moment'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { useFlightStore } from '@/lib/stores/flightStore'

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

const calculateDuration = eventTime => moment.duration(Math.max(eventTime - (Math.floor(Date.now() / 1000)), 0), 'seconds')

export default function Page({
  tripDetails,
  airports,
  uniqueID
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { data: session } = useSession()
  const { changePrice, currencySymbol } = UseCurrencyConverter()
  
  // ✅ Use flight store
  const { createFlightBooking, saveFlightPayment } = useFlightStore()

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const itineraries = tripDetails?.TravelItinerary?.Itineraries.length ? tripDetails?.TravelItinerary?.Itineraries[0]?.ItineraryInfo?.ReservationItems : []
  const [tktTimeLimit, setTktTimeLimit] = useState(tripDetails?.TravelItinerary?.TicketingTimeLimit || null)
  const eventTime = parseInt(moment(tktTimeLimit).isValid() ? moment(tktTimeLimit).format('X') : '0')
  const [duration, setDuration] = useState(calculateDuration(eventTime))
  const timerRef = useRef<NodeJS.Timer | null>(null)
  const timerCallback = useCallback(() => {
    setDuration(calculateDuration(eventTime))
  }, [eventTime])

  useEffect(() => {
    if (duration.asSeconds() > 0) {
      timerRef.current = setInterval(timerCallback, 1000)
    }

    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // ============================================
      // STEP 1: Order Ticket dari Mystifly
      // ============================================
      const mystiflyPayload = {
        UniqueID: uniqueID,
        Target: process.env.NODE_ENV === 'production' ? 'Production' : 'Test'
      }

      console.log('🎫 Step 1: Ordering ticket from Mystifly...')
      const { ok: mystiflyOk, data: mystiflyResponse, error: mystiflyError } = await callMystiflyAPI({
        url: 'https://restapidemo.myfarebox.com/api/v1/orderticket',
        method: 'POST',
        data: mystiflyPayload
      })

      if (!mystiflyOk || !mystiflyResponse?.Success || !mystiflyResponse?.Data?.UniqueID) {
        throw new Error(mystiflyResponse?.Message || mystiflyError || 'Failed to order ticket from Mystifly')
      }

      const mystiflyUniqueID = mystiflyResponse.Data.UniqueID
      console.log('✓ Mystifly ticket ordered:', mystiflyUniqueID)

      // ============================================
      // STEP 2: Create Flight Booking di Backend
      // ============================================
      console.log('📝 Step 2: Creating flight booking...')

      // Get flight info dari tripDetails
      const firstItinerary = itineraries[0]
      const totalPrice = tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount || 0
      const currency = tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode || 'USD'

      const bookingPayload = {
        id_customer: session?.user?.id,
        mfref: mystiflyUniqueID,
        airline_name: firstItinerary?.MarketingAirlineCode || 'Unknown',
        flight_number: firstItinerary?.FlightNumber || 'N/A',
        origin: firstItinerary?.DepartureAirportLocationCode || '',
        destination: firstItinerary?.ArrivalAirportLocationCode || '',
        departure_time: firstItinerary?.DepartureDateTime ? moment(firstItinerary.DepartureDateTime).format('YYYY-MM-DD HH:mm:ss') : null,
        arrival_time: firstItinerary?.ArrivalDateTime ? moment(firstItinerary.ArrivalDateTime).format('YYYY-MM-DD HH:mm:ss') : null,
        total_price: totalPrice,
        currency: currency,
        contact_fullname: session?.user?.name || '',
        contact_email: session?.user?.email || '',
        contact_phone: '', // TODO: Get from form if needed
        // passengers: [] // TODO: Add passengers if backend expects it
      }

      const bookingResult = await createFlightBooking(bookingPayload)

      if (!bookingResult.success) {
        throw new Error(bookingResult.message || 'Failed to create booking')
      }

      const bookingId = bookingResult.data?.id_flight_booking
      console.log('✓ Flight booking created:', bookingId)

      // ============================================
      // STEP 3: Process Payment
      // ============================================
      console.log('💳 Step 3: Processing payment...')

      const paymentPayload = {
        id_flight_booking: bookingId,
        amount: totalPrice,
        payment_method: 'credit_card', // TODO: Get from card_type if needed
        transaction_id: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }

      const paymentResult = await saveFlightPayment(paymentPayload)

      if (!paymentResult.success) {
        throw new Error(paymentResult.message || 'Payment failed')
      }

      console.log('✓ Payment successful!')
      console.log('🎫 Ticket Number:', paymentResult.data?.ticket_number)

      // ============================================
      // STEP 4: Redirect to Complete Page
      // ============================================
      router.push(router.asPath + '/complete')

    } catch (err: any) {
      console.error('❌ Booking error:', err)
      setError(err.message || 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const [paymentData, setPaymentData] = useState({
    "card_name": "",
    "card_number": "",
    "card_type": "",
    "expired_date": "",
    "cvv": ""
  })
  const id_customer = session?.user?.id

  useEffect(() => {
    const getDataPayment = async () => {
      try {
        const { data, error, ok } = await callAPI('/customer/payment/show', 'POST', { id_customer: id_customer }, true)
        if (error) {
          console.log(error)
        }
        if (ok && data) {
          setPaymentData(data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    if (id_customer) {
      getDataPayment()
    }
  }, [id_customer])

  const { card_name, card_number, card_type, expired_date, cvv } = paymentData

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setPaymentData({
      ...paymentData,
      [name]: value
    })
  }

  return (
    <Layout>
      <Navbar showCurrency={true} />
      {!(duration.asSeconds() > 0) ? (
        <div className="w-100 h-100 d-flex align-items-center justify-content-center text-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
          Sorry, we couldn't find it. The payment has been expired.
        </div>
      ) : (
        <main className="booking-hotel">
          <BookingHeader current={'payment'} handlePreviousStep={() => { }} />
          {timerRef.current && (
            <CountdownSection duration={duration} />
          )}
          <div className="container">
            <div className="booking-hotel__wrapper">
              <form onSubmit={onSubmit} className="booking-hotel__inner">
                <div className="booking-hotel__card">
                  <div className="booking-hotel__card-row">
                    <p className="booking-hotel__card-title">Payment Details</p>
                    <div className="booking-hotel__card-icon">
                      <SVGIcon src={Icons.PaymentMastercard} width={32} height={24} />
                      <SVGIcon src={Icons.PaymentVisa} width={32} height={24} />
                      <SVGIcon src={Icons.PaymentAmex} width={32} height={24} />
                      <SVGIcon src={Icons.PaymentDci} width={32} height={24} />
                      <SVGIcon src={Icons.PaymentJcb} width={32} height={24} />
                      <SVGIcon src={Icons.PaymentDiscover} width={32} height={24} />
                    </div>
                  </div>
                  <div className="booking-hotel__payment">
                    <div className="booking-hotel__payment-block w-100">
                      <label htmlFor="payment-cardHolder">Cardholder's Name</label>
                      <input type="text" value={card_name} onChange={handleInputChange} name="card_name" id="payment-cardHolder" placeholder="Enter Cardholder name" />
                    </div>
                    <div className="booking-hotel__payment-block w-100">
                      <label htmlFor="payment-cardNumber">Card number</label>
                      <input type="text" value={card_number} onChange={handleInputChange} name="card_number" id="payment-cardNumber" placeholder="0000 0000 0000 0000" />
                    </div>
                    <div className="booking-hotel__payment-block w-100">
                      <label htmlFor="payment-cardType">Payment Type</label>
                      <select name="card_type" onChange={handleInputChange} id="payment-cardType" placeholder="Select your card type">
                        <option value="Credit Card" selected={card_type === 'Credit Card'}>Credit Card</option>
                        <option value="Debit Card" selected={card_type === 'Debit Card'}>Debit Card</option>
                        <option value="Regular Bank" selected={card_type === 'Regular Bank'}>Regular Bank</option>
                      </select>
                    </div>
                    <div className="booking-hotel__payment-row w-100">
                      <div className="booking-hotel__payment-block w-100">
                        <label htmlFor="payment-expiryDate">Expiry Date</label>
                        <div className="booking-hotel__payment-input">
                          <input type="text" value={expired_date} onChange={handleInputChange} name="expired_date" id="payment-expiryDate" placeholder="MM / YY" />
                          <SVGIcon className="booking-hotel__payment-input--icon" src={Icons.Calendar} width={20} height={20} />
                        </div>
                      </div>
                      <div className="booking-hotel__payment-block w-100">
                        <label htmlFor="payment-cvv">CVV/CVC</label>
                        <input type="number" value={cvv} onChange={handleInputChange} name="cvv" id="payment-cvv" placeholder="000" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="booking-hotel__aggreement form-check">
                  <input type="checkbox" className="form-check-input" />
                  <p>By clicking the button below, you have agreed to our <a href="#" className="booking-hotel__aggreement-link">Privacy Policy</a> and <a href="#" className="booking-hotel__aggreement-link">Terms & Conditions.</a></p>
                </div>

                {error && (
                  <div className="d-flex flex-column align-items-center text-center text-danger-main">
                    {error}
                  </div>
                )}

                <div className="booking-hotel__card">
                  <div className="booking-hotel__footer">
                    <div className="booking-hotel__footer-total">
                      <p>Total :</p>
                      <div className="booking-hotel__footer-price">
                        <h5>{currencySymbol} {changePrice(tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount)}</h5>
                      </div>
                    </div>
                    <button disabled={loading} type="submit" className="btn btn-lg btn-success">
                      {loading ? 'Please wait...' : 'Complete Booking'}
                    </button>
                  </div>
                </div>
              </form>

              <div className="booking-hotel__summary" style={{ flex: 'none', width: 360, whiteSpace: 'normal' }}>
                <div className="booking-hotel__summary-title">Flight Details</div>
                {!!itineraries?.length && itineraries.map((itinerary, index) => {
                  const origin = itinerary?.DepartureAirportLocationCode
                  const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin)
                  const originName = airports?.[originKey]?.name

                  const destination = itinerary?.ArrivalAirportLocationCode
                  const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination)
                  const destinationName = airports?.[destinationKey]?.name

                  return (
                    <Fragment key={`flight-details-${index}`}>
                      {index !== 0 && (
                        <div className="booking-hotel__summary-separator" />
                      )}
                      <div className="booking-flight__summary-item">
                        <div className="booking-flight__summary-item-brand" style={{ flex: 'none' }}>
                          <BlurPlaceholderImage src={Images.Placeholder} alt="Qatar Airways" width={160} height={48} />
                        </div>
                        <div>
                          <div className="booking-flight__summary-item-title">{[`${originName} ${origin && `(${origin})`}`, `${destinationName} ${destination && `(${destination})`}`].join(' - ')}</div>
                          <div className="booking-flight__summary-item-details">
                            <div>{moment(itinerary?.DepartureDateTime).format('ddd, DD MMM YY')}</div>
                            <div className="booking-flight__summary-item-details-bullet" />
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
                <div className="booking-hotel__summary-separator"></div>
                <div className="booking-hotel__summary-total">
                  <div className="booking-hotel__summary-total-title">Total</div>
                  <div className="booking-hotel__summary-total-price">
                    <div className="booking-hotel__summary-total-price--text">
                      {currencySymbol} {changePrice(tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </Layout>
  )
}

const CountdownSection = ({ duration }: { duration: moment.Duration }) => {
  return (
    <div className="booking-hotel__timer">
      <div className="container">
        <div className="booking-hotel__timer-wrapper">
          <p>Complete your payment in</p>
          <div className="booking-hotel__timer-countdown">
            <div className="booking-hotel__timer-number">{('0' + duration.hours()).slice(-2)}</div>
            <p>:</p>
            <div className="booking-hotel__timer-number">{('0' + duration.minutes()).slice(-2)}</div>
            <p>:</p>
            <div className="booking-hotel__timer-number">{('0' + duration.seconds()).slice(-2)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
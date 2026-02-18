import React, { use } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { callAPI, callMystiflyAPI, callSkyscannerAPI } from '@/lib/axiosHelper'
import { Icons, Images, Services } from '@/types/enums'
import { getEnumAsArray } from '@/lib/enumsHelper'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BookingHotel from '@/components/pages/booking/hotels'
import BookingFlights from '@/components/pages/booking/flights'
import BookingBookTransfer from '@/components/pages/booking/book-transfer'
import BookingTourPackage from '@/components/pages/booking/tour'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import BookingHeader from '@/components/pages/booking/header'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import { DateRange, Calendar, Range } from 'react-date-range';

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { RFHInput, RFHSelect, RFHSelectAndInput, RFHTextarea } from '@/components/forms/fields'
import PhoneInput, { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import DropdownMenu from '@/components/elements/dropdownMenu'
import { useSession } from 'next-auth/react'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

/**
 * ⚠️ LEGACY ROUTE - For backward compatibility only
 * 
 * This route is DEPRECATED. Use /booking/flights (without fareCode parameter) instead.
 * 
 * New flow:
 * - Search → Store flight data → Navigate to /booking/flights
 * - No token in URL, data comes from Zustand store
 * 
 * This route remains for:
 * - Old Mystifly bookings
 * - Legacy URL shares
 * - Backward compatibility
 */

// SSR for Mystifly only (legacy)
export const getServerSideProps: GetServerSideProps<{
  data: any
}> = async (context) => {
  const fareCode = context.params?.fareCode

  console.log('[getServerSideProps] fareCode received:', fareCode)

  // Check if this is a booking-com15 token or Mystifly fare code
  const isBookingComToken = fareCode && (fareCode.length > 100 || fareCode.includes('_'))

  console.log('[getServerSideProps] isBookingComToken:', isBookingComToken)

  // For Booking.com tokens, return empty props - data will be fetched client-side
  if (isBookingComToken) {
    return {
      props: {
        data: null,
        isBookingCom: true
      },
    }
  }

  // Handle Mystifly API (legacy) - keep SSR for this
  const payload = {
    FareSourceCode: fareCode,
    Target: process.env.NODE_ENV === 'production' ? 'Production' : 'Test'
  }

  const { ok, data: flights, status, error } = await callMystiflyAPI({
    url: 'https://restapidemo.myfarebox.com/api/v1/revalidate/flight',
    method: 'POST',
    data: payload
  }, (context.req.headers.host.includes('localhost') || context.req.headers.host.includes('127.0.0.1') ? 'http://' : 'https://') + context.req.headers.host)

  if (ok && flights?.Data && flights?.Success) {
    if (flights.Data?.PricedItineraries?.length) {
      const { ok: airportsOK, data: airports } = await callSkyscannerAPI({
        url: 'https://partners.api.skyscanner.net/apiservices/v3/geo/hierarchy/flights/en-US',
        method: 'GET'
      }, (context.req.headers.host.includes('localhost') || context.req.headers.host.includes('127.0.0.1') ? 'http://' : 'https://') + context.req.headers.host)

      if (airports?.places) {
        return {
          props: {
            data: {
              flights: flights.Data.PricedItineraries[0],
              airports: airports.places,
              isBookingCom: false
            }
          },
        }
      }
    }
  }

  return {
    notFound: true,
  }
}

export default function Page({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { changePrice, currencySymbol } = UseCurrencyConverter();

  // ========================================
  // ALL HOOKS MUST BE HERE - BEFORE ANY EARLY RETURN
  // ========================================

  // Client-side state for Booking.com flights
  const [bookingComData, setBookingComData] = useState<any>(null)
  const [bookingComLoading, setBookingComLoading] = useState<boolean>(false)
  const [bookingComError, setBookingComError] = useState<string | null>(null)

  const MYSTIFLY_PASSENGERS = {
    'ADT': 'Adult',
    'CHD': 'Children',
    'INF': 'Baby'
  }

  const newFareSourceCode = data?.flights?.AirItineraryPricingInfo?.FareSourceCode

  const firstLeg = data?.flights?.OriginDestinationOptions?.length ? data?.flights?.OriginDestinationOptions[0] : null
  const secondLeg = data?.flights?.OriginDestinationOptions?.length > 1 ? data?.flights?.OriginDestinationOptions[1] : null

  const firstLegOrigin = firstLeg?.FlightSegments?.length ? firstLeg?.FlightSegments[0] : null
  const firstLegDestination = firstLeg?.FlightSegments?.length ? firstLeg?.FlightSegments[firstLeg?.FlightSegments.length - 1] : null
  const secondLegOrigin = secondLeg ? (secondLeg?.FlightSegments?.length ? secondLeg?.FlightSegments[0] : null) : null
  const secondLegDestination = secondLeg ? (secondLeg?.FlightSegments?.length ? secondLeg?.FlightSegments[secondLeg?.FlightSegments.length - 1] : null) : null

  const firstLegOriginKey = Object.keys(data?.airports || {}).find(key => data?.airports[key]?.iata === firstLegOrigin?.DepartureAirportLocationCode)
  const firstLegDestinationKey = Object.keys(data?.airports || {}).find(key => data?.airports[key]?.iata === firstLegDestination?.ArrivalAirportLocationCode)
  const secondLegOriginKey = Object.keys(data?.airports || {}).find(key => data?.airports[key]?.iata === secondLegOrigin?.DepartureAirportLocationCode)
  const secondLegDestinationKey = Object.keys(data?.airports || {}).find(key => data?.airports[key]?.iata === secondLegDestination?.ArrivalAirportLocationCode)

  const firstLegOriginName = data?.airports?.[firstLegOriginKey]?.name
  const firstLegDestinationName = data?.airports?.[firstLegDestinationKey]?.name
  const secondLegOriginName = data?.airports?.[secondLegOriginKey]?.name
  const secondLegDestinationName = data?.airports?.[secondLegDestinationKey]?.name

  const passengerPerFare = (data?.flights?.AirItineraryPricingInfo?.PTC_FareBreakdowns || []).map((fare) => (fare?.PassengerTypeQuantity?.Code && fare?.PassengerTypeQuantity?.Quantity) && ({ ...fare.PassengerTypeQuantity })).filter(value => value)
  let formattedPassenger: string[] = []
  passengerPerFare.map((value, index) => Array.from({ length: value.Quantity || 0 }, (_, number) => {
    formattedPassenger = [...formattedPassenger, value.Code]
  }))

  const [passengerForm, setPassengerForm] = useState<{
    passengerCode: string
    sectionTitle: string
    title: string
    firstName: string
    lastName: string
    nationality: string
    birth: Date | null
    passport: string
    issuedDate: Date | null
    issuedCountry: string
    expiryDate: Date | null
  }[]>(formattedPassenger.map((passengerCode) => ({
    passengerCode: passengerCode,
    sectionTitle: '',
    title: '',
    firstName: '',
    lastName: '',
    nationality: '',
    birth: null,
    passport: '',
    issuedDate: null,
    issuedCountry: '',
    expiryDate: null
  })))

  const fieldShapes = {
    title: yup.string().notRequired(),
    fullName: yup.string().required('Full name is required'),
    country: yup.string().required('Country/Region is required'),
    phone: yup.string().required('Phone number is required'),
    email: yup.string().email().required('Email address is required'),
    postcode: yup.string().required('Postcode is required'),
  }

  const schema = yup.object().shape(fieldShapes)

  const defaultPhoneCountry = 'US'

  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  const [agreement, setAgreement] = useState<boolean>(false)
  const [tktTimeLimit, setTktTimeLimit] = useState<string>()

  useEffect(() => {
    if (tktTimeLimit) {
      localStorage.setItem('tktTimeLimit', tktTimeLimit)
    }
  }, [tktTimeLimit])

  // Fetch Booking.com flight details on client side (Solution 1)
  useEffect(() => {
    const fareCode = router.query.fareCode as string

    // Check if this is a Booking.com token
    const isBookingComToken = fareCode && (fareCode.length > 100 || fareCode.includes('_'))

    if (isBookingComToken && fareCode) {
      const fetchFlightDetails = async () => {
        setBookingComLoading(true)
        setBookingComError(null)

        try {
          // Decode the token if it's URL-encoded
          const decodedToken = decodeURIComponent(fareCode)

          console.log('[Client] Fetching flight details with token:', decodedToken.substring(0, 50) + '...')

          const response = await fetch(`/api/v1/flights/getFlightDetails?token=${encodeURIComponent(decodedToken)}&currency_code=AED`)

          const result = await response.json()

          console.log('[Client] Response:', { status: response.status, ok: response.ok, result })

          if (response.ok && result?.status === true && result?.data) {
            // Check for errors in the response (e.g., expired token)
            if (result.data.error) {
              const errorCode = result.data.error.code

              if (errorCode === 'SEARCH_GETFLIGHTDETAILS_EXPIRED') {
                setBookingComError('This flight session has expired. Please search again.')
                // Optionally redirect back to search
                setTimeout(() => {
                  router.push('/search?expired=true')
                }, 3000)
              } else {
                setBookingComError(result.data.error.message || 'Failed to load flight details')
              }
            } else {
              // Success!
              setBookingComData(result.data)
            }
          } else {
            // API returned an error
            const errorMessage = result?.error || result?.message || 'Failed to load flight details'
            setBookingComError(errorMessage)
          }
        } catch (error: any) {
          console.error('[Client] Exception:', error)
          setBookingComError(error.message || 'An unexpected error occurred')
        } finally {
          setBookingComLoading(false)
        }
      }

      fetchFlightDetails()
    }
  }, [router.query.fareCode])

  // ========================================
  // NOW SAFE TO DO CONDITIONAL RENDERING
  // ========================================

  // Combine data from SSR (Mystifly) or client-side (Booking.com)
  const flights = bookingComData || data?.flights
  const airports = data?.airports
  const isBookingCom = data?.isBookingCom || !!bookingComData

  // Show loading state
  if (bookingComLoading) {
    return (
      <Layout>
        <Navbar showCurrency={true} />
        <main className="booking-hotel">
          <BookingHeader current={'details'} handlePreviousStep={() => { }} />
          <div className="container">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p>Loading flight details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </Layout>
    )
  }

  // Show error state
  if (bookingComError) {
    return (
      <Layout>
        <Navbar showCurrency={true} />
        <main className="booking-hotel">
          <BookingHeader current={'details'} handlePreviousStep={() => { }} />
          <div className="container">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <p className="text-danger">{bookingComError}</p>
              <button
                className="btn btn-primary"
                onClick={() => router.push('/search')}
              >
                Search Flights
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </Layout>
    )
  }

  // Show not found if no data
  if (!flights) {
    return (
      <Layout>
        <Navbar showCurrency={true} />
        <main className="booking-hotel">
          <div className="container">
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <h2>Flight Not Found</h2>
              <p>This flight may no longer be available.</p>
              <button
                className="btn btn-primary"
                onClick={() => router.push('/search')}
              >
                Search Flights
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </Layout>
    )
  }

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (values) => {
    setError('')

    clearErrors(['phone'])
    if (!phone?.length) return setFieldError('phone', { message: 'Phone number is required', type: 'required' })

    if (!(!errors.title && !errors.fullName && !errors.country && !errors.phone && !errors.email && !errors.postcode)) return

    let isError = null

    passengerForm.map(({ passengerCode, sectionTitle, title, firstName, lastName, nationality, birth, passport, issuedDate, issuedCountry, expiryDate }) => {
      if (!firstName || !lastName || !nationality || !birth || !passport || !issuedDate || !issuedCountry || !expiryDate) isError = 'Please fill out all fields'
    })

    if (isError) return setError(isError)

    if (!agreement) return setError('Please check the agreement to our Privacy Policy and Terms & Conditions')

    const {
      title,
      fullName,
      country,
      email,
      postcode,
    } = getValues()

    const passengers = passengerForm.map(({ passengerCode, sectionTitle, title, firstName, lastName, nationality, birth, passport, issuedDate, issuedCountry, expiryDate }) => ({
      PassengerType: passengerCode,
      Gender: title || 'U',
      PassengerName: {
        PassengerTitle: title === 'M' ? 'MR' : (title === 'F' ? 'MRS' : ''),
        PassengerFirstName: firstName.toUpperCase(),
        PassengerLastName: lastName.toUpperCase()
      },
      DateOfBirth: moment(birth).toISOString(),
      Passport: {
        PassportNumber: passport,
        ExpiryDate: moment(expiryDate).toISOString(),
        Country: issuedCountry.toUpperCase()
      },
      PassengerNationality: nationality.toUpperCase(),
    }))

    const payload = {
      FareSourceCode: newFareSourceCode,
      TravelerInfo: {
        AirTravelers: passengers,
        PhoneNumber: phone,
        Email: email,
        PostCode: postcode
      },
      Target: process.env.NODE_ENV === 'production' ? 'Production' : 'Test',
    }

    setLoading(true)

    const { ok, data: response, status, error } = await callMystiflyAPI({
      url: 'https://restapidemo.myfarebox.com/api/v1/book/flight',
      method: 'POST',
      data: payload
    })

    setLoading(false)

    console.log({ ok, response, status, error });


    if (ok && response?.Data && response?.Data?.UniqueID && response?.Success) {
      if (response?.Data?.TktTimeLimit) setTktTimeLimit(response.Data.TktTimeLimit)
      router.push(router.asPath + '/' + response.Data.UniqueID)
    } else {
      setError(response?.Message || error || 'Unknown error')
    }
  }

  const isAuthenticated = status !== 'loading' && status === 'authenticated' && session.user.role === 'customer'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && session.user.role === 'customer')

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <main className="booking-hotel">
        <BookingHeader current={'details'} handlePreviousStep={() => { }} />
        <div className="container">
          <div className="booking-hotel__wrapper">
            <form className="booking-hotel__inner" onSubmit={handleSubmit(onFormSubmit, onFormSubmit)}>
              <div className="booking-hotel__card">
                <p className="booking-hotel__card-title">Contact Details</p>
                <div className="booking-hotel__contact ">
                  <div className="booking-hotel__contact-row">
                    <div className="booking-hotel__contact-block w-25">
                      <label>Title</label>
                      <RFHSelect
                        register={register('starRating')}
                        onChange={(e) => setValue('starRating', e.target.value, { shouldValidate: true })}
                        error={errors.starRating?.message.toString()}
                      >
                        <option value={''}>-</option>
                        <option value='Mr'>Mr</option>
                        <option value='Mrs'>Mrs</option>
                      </RFHSelect>
                    </div>
                    <div className="booking-hotel__contact-block w-100">
                      <label>Full name</label>
                      <RFHInput register={register('fullName')} type="text" placeholder="Enter your full name" error={errors.fullName?.message.toString()} />
                    </div>
                  </div>
                  <div className="booking-hotel__contact-block">
                    <label>Country/Region</label>
                    <RFHSelect
                      register={register('country')}
                      onChange={(e) => setValue('country', e.target.value, { shouldValidate: true })}
                      error={errors.country?.message.toString()}
                    >
                      <option value={''}>---</option>
                      {getCountries().map((country) => (
                        <option key={country} value={country}>
                          {countryLabels[country]}
                        </option>
                      ))}
                    </RFHSelect>
                  </div>
                  <div className="booking-hotel__contact-block">
                    <label>Phone Number</label>
                    <div className="PhoneInput form-control-wrapper">
                      <div className={`form-control-field w-100 ${errors.phone ? 'form-control-field--error' : ''}`}>
                        <div className="PhoneInputCountry">
                          <select
                            value={phoneCountry}
                            onChange={event => setPhoneCountry(event.target.value || null)}
                            name="phone-code">
                            {getCountries().map((country) => (
                              <option key={country} value={country}>
                                {countryLabels[country]} +{getCountryCallingCode(country)}
                              </option>
                            ))}
                          </select>
                          <div className={`PhoneInputSelectedValue ${phoneCountry ? 'HasValue' : ''}`}>+{getCountryCallingCode((phoneCountry || defaultPhoneCountry) as CountryCode)}</div>
                        </div>
                        <PhoneInput international={true} country={(phoneCountry || defaultPhoneCountry) as CountryCode} value={phone} onChange={setPhone} placeholder="(888) 888-8888" />
                      </div>
                      {errors.phone && (
                        <div className="form-control-message form-control-message--error">{errors.phone?.message.toString()}</div>
                      )}
                    </div>
                  </div>
                  <div className="booking-hotel__contact-block">
                    <label>Email Address</label>
                    <RFHInput register={register('email')} type="text" placeholder="Enter your email address" error={errors.email?.message.toString()} />
                  </div>
                  <div className="booking-hotel__contact-block">
                    <label>Post Code</label>
                    <RFHInput register={register('postcode')} type="text" placeholder="Enter your postcode" error={errors.postcode?.message.toString()} />
                  </div>
                  {!(session?.user && status === 'authenticated') && (
                    <div className="booking-hotel__contact-banner">
                      <div className="booking-hotel__contact-banner-icon">
                        <SVGIcon src={Icons.Lamp} width={20} height={20} />
                      </div>
                      <p className="booking-hotel__contact-banner-text">Enjoy special discounts & other benefits! <a type="button" data-bs-toggle="modal" data-bs-target="#auth-modal" className="booking-hotel__contact-banner-link">Log in</a> or <a type="button" data-bs-toggle="modal" data-bs-target="#auth-modal" className="booking-hotel__contact-banner-link">register</a> now.</p>
                    </div>
                  )}
                </div>
              </div>

              {!!passengerForm.length && passengerForm.map(({ passengerCode, title, firstName, lastName, nationality, birth, passport, issuedDate, issuedCountry, expiryDate }, index) => (
                <PassengerDetailsForm
                  key={`passenger-detail-${index}`}
                  sectionTitle={`Passenger ${index + 1} ${MYSTIFLY_PASSENGERS[passengerCode] ? `(${MYSTIFLY_PASSENGERS[passengerCode]})` : ''}`}
                  title={title}
                  firstName={firstName}
                  lastName={lastName}
                  nationality={nationality}
                  birth={birth}
                  passport={passport}
                  issuedDate={issuedDate}
                  issuedCountry={issuedCountry}
                  expiryDate={expiryDate}
                  onChange={(item) => setPassengerForm(passengerForm.map((value, passengerIndex) => index === passengerIndex ? ({ ...value, ...item }) : value))}
                />
              ))}

              <div className="booking-hotel__aggreement form-check">
                <input type="checkbox" className="form-check-input" checked={agreement} onChange={(e) => setAgreement(e.target.checked)} />
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
                      <h5>{currencySymbol} {changePrice(data?.flights?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.Amount)} 
                        {/* {data?.flights?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.CurrencyCode} */}
                      </h5>
                    </div>
                  </div>
                  {isAuthenticated && (
                    <button disabled={loading} type="submit" className="btn btn-lg btn-success">{loading ? 'Please wait...' : 'Continue to Payment'}</button>
                  )}
                  {isNotAuthenticated && (
                    <button disabled={loading} type="submit" className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#auth-modal">{loading ? 'Please wait...' : 'Continue to Payment'}</button>
                  )}
                </div>
              </div>
            </form>
            <div className="booking-hotel__summary" style={{ flex: 'none', width: 360, whiteSpace: 'normal' }}>
              <div className="booking-hotel__summary-title">Flight Details</div>
              <div className="booking-flight__summary-item">
                <div className="booking-flight__summary-item-brand" style={{ flex: 'none' }}>
                  <BlurPlaceholderImage src={Images.Placeholder} alt="Qatar Airways" width={160} height={48} />
                </div>
                <div>
                  <div className="booking-flight__summary-item-title">{[`${firstLegOriginName} ${firstLegOrigin?.DepartureAirportLocationCode && `(${firstLegOrigin.DepartureAirportLocationCode})`}`, `${firstLegDestinationName} ${firstLegDestination?.ArrivalAirportLocationCode && `(${firstLegDestination.ArrivalAirportLocationCode})`}`].join(' - ')}</div>
                  <div className="booking-flight__summary-item-details">
                    <div>{moment(firstLegOrigin?.DepartureDateTime).format('ddd, DD MMM YY')}</div>
                    <div className="booking-flight__summary-item-details-bullet" />
                    <div>{moment(firstLegOrigin?.DepartureDateTime).format('HH:mm')}</div>
                  </div>
                </div>
              </div>
              {secondLeg && (
                <>
                  <div className="booking-hotel__summary-separator"></div>
                  <div className="booking-flight__summary-item">
                    <div className="booking-flight__summary-item-brand" style={{ flex: 'none' }}>
                      <BlurPlaceholderImage src={Images.Placeholder} alt="Qatar Airways" width={160} height={48} />
                    </div>
                    <div>
                      <div className="booking-flight__summary-item-title">{[`${secondLegOriginName} ${secondLegOrigin?.DepartureAirportLocationCode && `(${secondLegOrigin.DepartureAirportLocationCode})`}`, `${secondLegDestinationName} ${secondLegDestination?.ArrivalAirportLocationCode && `(${secondLegDestination.ArrivalAirportLocationCode})`}`].join(' - ')}</div>
                      <div className="booking-flight__summary-item-details">
                        <div>{moment(secondLegOrigin?.DepartureDateTime).format('ddd, DD MMM YY')}</div>
                        <div className="booking-flight__summary-item-details-bullet" />
                        <div>{moment(secondLegOrigin?.DepartureDateTime).format('HH:mm')}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="booking-hotel__summary-separator"></div>
              <div className="booking-hotel__summary-total">
                <div className="booking-hotel__summary-total-title">Total</div>
                <div className="booking-hotel__summary-total-price">
                  <div className="booking-hotel__summary-total-price--text">{currencySymbol} {changePrice(data?.flights?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.Amount)} 
                  {/* {data?.flights?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.CurrencyCode} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  )
}


interface PassengerDetailsFormProps {
  sectionTitle: string
  title: string
  firstName: string
  lastName: string
  nationality: string
  birth: Date
  passport: string
  issuedDate: Date
  issuedCountry: string
  expiryDate: Date
  onChange: (item: { [key: string]: any }) => void
}

const PassengerDetailsForm = ({ sectionTitle, title, firstName, lastName, nationality, birth, passport, issuedDate, issuedCountry, expiryDate, onChange }: PassengerDetailsFormProps) => {
  const [showBirthDropdown, setShowBirthDropdown] = useState<boolean>(false)
  const [showIssuedDateDropdown, setShowIssuedDateDropdown] = useState<boolean>(false)
  const [showExpiryDateDropdown, setShowExpiryDateDropdown] = useState<boolean>(false)

  return (
    <div className="booking-hotel__card">
      <p className="booking-hotel__card-title">{sectionTitle}</p>
      <div className="booking-hotel__guest">
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-25">
            <label>Title</label>
            <RFHSelect
              value={title}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                onChange({ title: e.target.value })
              }}
            >
              <option value={''} >-</option>
              <option value='M'>Mr</option>
              <option value='F'>Mrs</option>
            </RFHSelect>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label>First name</label>
            <RFHInput
              value={firstName.toUpperCase()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange({ firstName: e.target.value })
              }}
              type="text" placeholder="Enter your first name" error={''} />
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label>Last name</label>
            <RFHInput
              value={lastName.toUpperCase()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange({ lastName: e.target.value })
              }}
              type="text" placeholder="Enter your last name" error={''} />
          </div>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-100">
            <label>Nationality</label>
            <RFHSelect
              value={nationality}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                onChange({ nationality: e.target.value })
              }}
            >
              <option value={''}>---</option>
              {getCountries().map((country) => (
                <option key={country} value={country}>
                  {countryLabels[country]}
                </option>
              ))}
            </RFHSelect>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label>Date of birth</label>
            <div className={`custom-dropdown`}>
              <RFHInput
                value={birth ? moment(birth).format('DD / MM / YYYY') : ''}
                readOnly={true}
                onClick={() => setShowBirthDropdown(true)}
                style={{ cursor: 'pointer' }}
                type="text" placeholder="DD / MM / YYYY" error={''} />
              <DropdownMenu show={showBirthDropdown} setShow={setShowBirthDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
                <Calendar
                  months={1}
                  direction="horizontal"
                  date={birth}
                  onChange={date => onChange({ birth: date })}
                />
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-100">
            <label>Passport No.</label>
            <RFHInput
              value={passport}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange({ passport: e.target.value })
              }}
              type="text" placeholder="Enter your passport number" error={''} />
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label>Issued date</label>
            <div className={`custom-dropdown`}>
              <RFHInput
                value={issuedDate ? moment(issuedDate).format('DD / MM / YYYY') : ''}
                readOnly={true}
                onClick={() => setShowIssuedDateDropdown(true)}
                style={{ cursor: 'pointer' }}
                type="text" placeholder="DD / MM / YYYY" error={''} />
              <DropdownMenu show={showIssuedDateDropdown} setShow={setShowIssuedDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
                <Calendar
                  months={1}
                  direction="horizontal"
                  date={issuedDate}
                  onChange={date => onChange({ issuedDate: date })}
                />
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="booking-hotel__guest-row">
          <div className="booking-hotel__guest-block w-100">
            <label>Issueing Country</label>
            <RFHSelect
              value={issuedCountry}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                onChange({ issuedCountry: e.target.value })
              }}
            >
              <option value={''}>---</option>
              {getCountries().map((country) => (
                <option key={country} value={country}>
                  {countryLabels[country]}
                </option>
              ))}
            </RFHSelect>
          </div>
          <div className="booking-hotel__guest-block w-100">
            <label>Expiry date</label>
            <div className={`custom-dropdown`}>
              <RFHInput
                value={expiryDate ? moment(expiryDate).format('DD / MM / YYYY') : ''}
                readOnly={true}
                onClick={() => setShowExpiryDateDropdown(true)}
                style={{ cursor: 'pointer' }}
                type="text" placeholder="DD / MM / YYYY" error={''} />
              <DropdownMenu show={showExpiryDateDropdown} setShow={setShowExpiryDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
                <Calendar
                  months={1}
                  direction="horizontal"
                  date={expiryDate}
                  onChange={date => onChange({ expiryDate: date })}
                />
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
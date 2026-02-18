import React, { useRef } from 'react'
import { Icons } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { useReactToPrint } from 'react-to-print'
import { useFlightStore } from '@/lib/stores/flightStore'
import moment from 'moment'
import Link from 'next/link'
import Image from 'next/image'
import logoTextDark from '@/assets/images/logo_text_dark.svg'
import { BlurPlaceholderImage } from '@/components/elements/images'

// Airport IATA code to city name mapping
const airportToCityMap: { [key: string]: string } = {
  // Indonesia
  'CGK': 'Jakarta', 'SUB': 'Surabaya', 'DPS': 'Denpasar', 'JED': 'Jeddah',
  'UPG': 'Makassar', 'KNO': 'Medan', 'BTH': 'Batam', 'PLM': 'Palembang',
  'BDO': 'Bandung', 'SRG': 'Semarang', 'SOC': 'Solo', 'YIA': 'Yogyakarta',
  'MLG': 'Malang', 'BPN': 'Balikpapan', 'PKU': 'Pekanbaru', 'PDG': 'Padang',
  'TKG': 'Bandar Lampung', 'BDJ': 'Banjarmasin', 'AMQ': 'Ambon', 'MDC': 'Manado',
  // International
  'SIN': 'Singapore', 'KUL': 'Kuala Lumpur', 'BKK': 'Bangkok', 'HKG': 'Hong Kong',
  'TPE': 'Taipei', 'ICN': 'Seoul', 'NRT': 'Tokyo', 'HND': 'Tokyo',
  'PEK': 'Beijing', 'PVG': 'Shanghai', 'SYD': 'Sydney', 'MEL': 'Melbourne',
  'DXB': 'Dubai', 'DOH': 'Doha', 'JFK': 'New York', 'LAX': 'Los Angeles',
  'LHR': 'London', 'CDG': 'Paris', 'FRA': 'Frankfurt', 'AMS': 'Amsterdam',
}

const getCityName = (iataCode: string): string => {
  return airportToCityMap[iataCode] || iataCode
}

const BookingConfirmation = () => {
  const { selectedFlight, passengerData, bookingDetails } = useFlightStore()

  const pageStyle = `
    @page { size: A3; }
    @media all { .pagebreak { display: none; } }
    @media print {
      .pagebreak { page-break-before: always; }
      @supports (-webkit-print-color-adjust: exact) {
        body { -webkit-print-color-adjust: exact; }
      }
    }
  `

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${passengerData?.fullname || 'Passenger'}-${bookingDetails?.bookingId || 'Booking'}-Flight-Ticket`,
    pageStyle: pageStyle
  })

  // ✅ Redirect jika tidak ada flight data
  if (!selectedFlight) {
    return (
      <div className="container">
        <div className="booking-hotel__confirmation">
          <div className="text-center py-5">
            <h3>No booking information found</h3>
            <p className="text-muted">Please search for flights first.</p>
            <Link href="/flights" className="btn btn-primary mt-3">
              Search Flights
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { firstLeg, secondLeg } = selectedFlight

  return (
    <div className="container">
      <div className="booking-hotel__confirmation">
        {/* ========== HEADER SUCCESS ========== */}
        <div className="booking-hotel__confirmation-top">
          <div className="booking-hotel__confirmation-top-header">
            <div className="booking-hotel__confirmation-top-image">
              <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="booking-hotel__confirmation-top-title">
              <p className="booking-hotel__confirmation-top-title--name">
                Thanks{passengerData?.fullname ? `, ${passengerData.fullname}` : ''}!
              </p>
              <h4>Your booking is confirmed.</h4>
            </div>
          </div>
          <div className="booking-hotel__confirmation-top-buttons">
            <button className="btn btn-lg btn-success" onClick={handlePrint}>
              <SVGIcon src={Icons.Printer} width={20} height={20} />
              <span>Download E-Ticket</span>
            </button>
          </div>

          {/* ========== INVOICE UNTUK PRINT - HIDDEN DI UI ========== */}
          <div className='booking-hotel__invoice-container' id='bookingFlightInvoice' ref={componentRef}>
            <main className='booking-hotel__invoice'>
              <Image className='d-flex justify-content-center w-100' src={logoTextDark} alt="Logo" width={300} />
              
              <div className="booking-hotel__invoice-wrapper--top">
                <div className='booking-hotel__invoice-top-header'>
                  <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--booking'>
                    <span className='booking-hotel__invoice-top-header-label'>Booking ID</span>
                    <div className='booking-hotel__invoice-top-header-value'>
                      {bookingDetails?.bookingId || `FL-${Date.now()}`}
                    </div>
                  </div>
                  <div className="booking-hotel__confirmation-separator"></div>
                  <div className='booking-hotel__invoice-top-header booking-hotel__invoice-top-header--hotel'>
                    <span className='booking-hotel__invoice-top-header-label'>PNR</span>
                    <div className='booking-hotel__invoice-top-header-value'>
                      {bookingDetails?.pnr || 'XXXXXX'}
                    </div>
                  </div>
                </div>

                <div className="booking-hotel__invoice-top-header">
                  <div className="booking-hotel__invoice-top-header">
                    <h4 className='booking-hotel__invoice-top-header--title'>
                      Flight Booking - {getCityName(firstLeg.segments[0].originIata)} to {getCityName(firstLeg.segments[firstLeg.segments.length - 1].destinationIata)}
                    </h4>
                  </div>
                  <span className='booking-hotel__invoice-top-header-address'>
                    <SVGIcon src={Icons.MapPin} width={24} height={24} />
                    {getCityName(firstLeg.segments[0].originIata)} → {getCityName(firstLeg.segments[firstLeg.segments.length - 1].destinationIata)}
                  </span>
                  <div className="booking-hotel__invoice-top-header-checkin">
                    <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                      <span className='booking-hotel__invoice-top-header-checkin'>Departure</span>
                      <span className='booking-hotel__invoice-top-header-checkin booking-hotel__invoice-top-header-checkin--date'>
                        {moment(firstLeg.departureDateTime).format('ddd, DD MMM YYYY')}
                      </span>
                    </div>
                    {secondLeg && (
                      <div className='booking-hotel__invoice-top-header-checkin--wrap'>
                        <span>Return</span>
                        <span className='booking-hotel__invoice-top-header-checkin--date'>
                          {moment(secondLeg.departureDateTime).format('ddd, DD MMM YYYY')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Flight Details Table */}
              <div className="booking-hotel__invoice-wrapper">
                <div className="booking-hotel__invoice-header">
                  <h4 className='booking-hotel__invoice-header-title'><i>Flight Details</i></h4>
                </div>
                <div className="booking-hotel__invoice-wrapper">
                  <table className='booking-hotel__invoice-booking'>
                    <thead>
                      <tr>
                        <th>Flight</th>
                        <th>Airline</th>
                        <th>Route</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className='booking-hotel__invoice-booking-important'>Departure</td>
                        <td>{firstLeg.carriers?.[0]?.name || 'Airline'}</td>
                        <td className='booking-hotel__invoice-booking-important'>
                          {getCityName(firstLeg.segments[0].originIata)} ({firstLeg.segments[0].originIata}) → {getCityName(firstLeg.segments[firstLeg.segments.length - 1].destinationIata)} ({firstLeg.segments[firstLeg.segments.length - 1].destinationIata})
                        </td>
                        <td>{moment(firstLeg.departureDateTime).format('DD MMM YY, HH:mm')}</td>
                        <td>{moment(firstLeg.arrivalDateTime).format('DD MMM YY, HH:mm')}</td>
                        <td>{firstLeg.durationInMinutes} min</td>
                      </tr>
                      {secondLeg && (
                        <tr>
                          <td className='booking-hotel__invoice-booking-important'>Return</td>
                          <td>{secondLeg.carriers?.[0]?.name || 'Airline'}</td>
                          <td className='booking-hotel__invoice-booking-important'>
                            {getCityName(secondLeg.segments[0].originIata)} ({secondLeg.segments[0].originIata}) → {getCityName(secondLeg.segments[secondLeg.segments.length - 1].destinationIata)} ({secondLeg.segments[secondLeg.segments.length - 1].destinationIata})
                          </td>
                          <td>{moment(secondLeg.departureDateTime).format('DD MMM YY, HH:mm')}</td>
                          <td>{moment(secondLeg.arrivalDateTime).format('DD MMM YY, HH:mm')}</td>
                          <td>{secondLeg.durationInMinutes} min</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Passenger Details Table */}
              <div className="booking-hotel__invoice-wrapper">
                <div className="booking-hotel__invoice-header">
                  <h4 className='booking-hotel__invoice-header-title'><i>Passenger Details</i></h4>
                </div>
                <div className="booking-hotel__invoice-wrapper">
                  <table className='booking-hotel__invoice-booking'>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>Passenger Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td className='booking-hotel__invoice-booking-important'>
                          {passengerData?.fullname || 'Passenger Name'}
                        </td>
                        <td>{passengerData?.email || 'email@example.com'}</td>
                        <td>{passengerData?.phone || '+62 XXX-XXXX-XXXX'}</td>
                        <td>{selectedFlight.price.unit} {bookingDetails?.totalPrice || selectedFlight.price.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Baggage & Important Info */}
              <div className="booking-hotel__invoice-wrapper--includes">
                <div className='booking-hotel__invoice-top-header'>
                  <div className="booking-hotel__invoice-header">
                    <h4 className='booking-hotel__invoice-header-title'><i>Baggage & Services</i></h4>
                  </div>
                  <div className="booking-hotel__invoice-includes-wrapper">
                    <div><ul><li style={{ fontSize: '16px', fontWeight: '500' }}>Cabin Baggage: {firstLeg.baggage?.cabin || '7 kg'}</li></ul></div>
                    <div><ul><li style={{ fontSize: '16px', fontWeight: '500' }}>Check-in Baggage: {firstLeg.baggage?.checkin || '20 kg'}</li></ul></div>
                  </div>
                </div>
                
                <div className='booking-hotel__invoice-top-header'>
                  <div className="booking-hotel__invoice-header">
                    <h4 className='booking-hotel__invoice-header-title'><i>Important Information</i></h4>
                  </div>
                  <div className="booking-hotel__invoice-includes-wrapper">
                    <div><ul><li style={{ fontSize: '16px', fontWeight: '500' }}>Check-in opens: 3 hours before departure</li></ul></div>
                    <div><ul><li style={{ fontSize: '16px', fontWeight: '500' }}>Web check-in: Available 24 hours before departure</li></ul></div>
                    <div><ul><li style={{ fontSize: '16px', fontWeight: '500' }}>Arrival time: At least 2 hours before departure</li></ul></div>
                    <div><ul><li style={{ fontSize: '16px', fontWeight: '500' }}>Required: Valid ID/Passport for boarding</li></ul></div>
                  </div>
                </div>
              </div>
            </main>

            {/* Footer */}
            <footer className="booking-hotel__invoice-footer">
              <div className="booking-hotel__invoice-footer-top">
                <div className="booking-hotel__invoice-footer-item">
                  <span className='booking-hotel__invoice-footer-title'>FOR ANY QUESTIONS, VISIT GOFORUMARAH HELP CENTER:</span>
                  <div className="booking-hotel__invoice-footer-link">
                    <SVGIcon src={Icons.Help} width={24} height={24} />
                    <Link href={'https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us'}>
                      https://goforumara-git-dev-illiyinstudio.vercel.app/contact-us
                    </Link>
                  </div>
                </div>
                <div className="booking-hotel__invoice-footer-item">
                  <span className='booking-hotel__invoice-footer-title'>CUSTOMER SERVICE (ID)</span>
                  <div className="booking-hotel__invoice-footer-link">
                    <SVGIcon src={Icons.Phone} width={24} height={24} />
                    <span>+91 1234567890</span>
                  </div>
                </div>
                <div className="booking-hotel__invoice-footer-item">
                  <span className='booking-hotel__invoice-footer-title'>BOOKING ID</span>
                  <div className="booking-hotel__invoice-footer-link">
                    <SVGIcon src={Icons.BookingComplete} width={24} height={24} />
                    {bookingDetails?.bookingId || `FL-${Date.now()}`}
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>

        {/* ========== UI VISIBLE - FLIGHT CARDS ========== */}
        <div className="booking-hotel__confirmation-separator"></div>
        
        <div className="booking-flight__confirmation-item">
          <div className="booking-flight__confirmation-item-brand">
            {firstLeg.carriers?.[0]?.imageUrl ? (
              <BlurPlaceholderImage 
                src={firstLeg.carriers[0].imageUrl} 
                alt={firstLeg.carriers[0].name} 
                width={160} 
                height={48} 
              />
            ) : (
              <div style={{ width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {firstLeg.carriers?.[0]?.name || 'Airline'}
              </div>
            )}
          </div>
          <div>
            <h5 className="booking-flight__confirmation-item-title">
              {getCityName(firstLeg.segments[0].originIata)} ({firstLeg.segments[0].originIata}) - {getCityName(firstLeg.segments[firstLeg.segments.length - 1].destinationIata)} ({firstLeg.segments[firstLeg.segments.length - 1].destinationIata})
            </h5>
            <div className="booking-flight__confirmation-item-details">
              <div>{moment(firstLeg.departureDateTime).format('ddd, DD MMM YY')}</div>
              <div className="booking-flight__confirmation-item-details-bullet" />
              <div>{moment(firstLeg.departureDateTime).format('HH:mm')}</div>
            </div>
          </div>
        </div>
        
        {secondLeg && (
          <div className="booking-flight__confirmation-item">
            <div className="booking-flight__confirmation-item-brand">
              {secondLeg.carriers?.[0]?.imageUrl ? (
                <BlurPlaceholderImage 
                  src={secondLeg.carriers[0].imageUrl} 
                  alt={secondLeg.carriers[0].name} 
                  width={160} 
                  height={48} 
                />
              ) : (
                <div style={{ width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {secondLeg.carriers?.[0]?.name || 'Airline'}
                </div>
              )}
            </div>
            <div>
              <h5 className="booking-flight__confirmation-item-title">
                {getCityName(secondLeg.segments[0].originIata)} ({secondLeg.segments[0].originIata}) - {getCityName(secondLeg.segments[secondLeg.segments.length - 1].destinationIata)} ({secondLeg.segments[secondLeg.segments.length - 1].destinationIata})
              </h5>
              <div className="booking-flight__confirmation-item-details">
                <div>{moment(secondLeg.departureDateTime).format('ddd, DD MMM YY')}</div>
                <div className="booking-flight__confirmation-item-details-bullet" />
                <div>{moment(secondLeg.departureDateTime).format('HH:mm')}</div>
              </div>
            </div>
          </div>
        )}
        
        <div className="booking-hotel__confirmation-separator"></div>
        
        <div className="booking-hotel__confirmation-details">
          <div className="booking-hotel__confirmation-content">
            <div className="booking-hotel__confirmation-content__info">
              <div className="booking-hotel__confirmation-content__info-rows">
                <SVGIcon className="booking-hotel__confirmation-content__info-icon" src={Icons.Check} width={20} height={20} />
                <div className="booking-hotel__confirmation-content__info-text">
                  We've sent your confirmation email to
                  <span className="booking-hotel__confirmation-content__info-text--highlighted"> {passengerData?.email || 'your email address'}.</span>
                </div>
              </div>
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
  )
}

export default BookingConfirmation
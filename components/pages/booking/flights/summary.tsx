import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { useFlightStore } from '@/lib/stores/flightStore'
import { UseCurrencyConverter } from '@/components/convertCurrency'
import moment from 'moment'

// Airport IATA code to city name mapping
const airportToCityMap: { [key: string]: string } = {
  // Indonesia
  'CGK': 'Jakarta',
  'SUB': 'Surabaya',
  'DPS': 'Denpasar',
  'JED': 'Jeddah',
  'UPG': 'Makassar',
  'KNO': 'Medan',
  'BTH': 'Batam',
  'PLM': 'Palembang',
  'BDO': 'Bandung',
  'SRG': 'Semarang',
  'SOC': 'Solo',
  'YIA': 'Yogyakarta',
  'MLG': 'Malang',
  'BPN': 'Balikpapan',
  'PKU': 'Pekanbaru',
  'PDG': 'Padang',
  'TKG': 'Bandar Lampung',
  'BDJ': 'Banjarmasin',
  'AMQ': 'Ambon',
  'MDC': 'Manado',
  
  // International
  'SIN': 'Singapore',
  'KUL': 'Kuala Lumpur',
  'BKK': 'Bangkok',
  'HKG': 'Hong Kong',
  'TPE': 'Taipei',
  'ICN': 'Seoul',
  'NRT': 'Tokyo',
  'HND': 'Tokyo',
  'PEK': 'Beijing',
  'PVG': 'Shanghai',
  'SYD': 'Sydney',
  'MEL': 'Melbourne',
  'DXB': 'Dubai',
  'DOH': 'Doha',
  'JFK': 'New York',
  'LAX': 'Los Angeles',
  'LHR': 'London',
  'CDG': 'Paris',
  'FRA': 'Frankfurt',
  'AMS': 'Amsterdam',
  // Add more as needed
}

// Function to get city name from IATA code
const getCityName = (iataCode: string): string => {
  return airportToCityMap[iataCode] || iataCode
}

const FlightBookingSummary = () => {
  const { selectedFlight } = useFlightStore()
  const { changePrice, currencySymbol } = UseCurrencyConverter()

  if (!selectedFlight) {
    return (
      <div className="booking-hotel__summary">
        <div className="booking-hotel__summary-title">Flight Details</div>
        <p>No flight selected</p>
      </div>
    )
  }

  const { firstLeg, secondLeg, price } = selectedFlight

  return (
    <div className="booking-hotel__summary">
      <div className="booking-hotel__summary-title">Flight Details</div>
      
      {/* First Leg (Outbound) */}
      <div className="booking-flight__summary-item">
        <div className="booking-flight__summary-item-brand">
          {firstLeg.carriers && firstLeg.carriers.length > 0 && firstLeg.carriers[0].imageUrl ? (
            <img 
              src={firstLeg.carriers[0].imageUrl} 
              alt={firstLeg.carriers[0].name} 
              width={160} 
              height={48}
              style={{ objectFit: 'contain' }}
            />
          ) : (
            <div style={{ width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {firstLeg.carriers && firstLeg.carriers.length > 0 ? firstLeg.carriers[0].name : 'Airline'}
            </div>
          )}
        </div>
        <div>
          <div className="booking-flight__summary-item-title">
            {getCityName(firstLeg.segments[0].originIata)} ({firstLeg.segments[0].originIata}) - {getCityName(firstLeg.segments[firstLeg.segments.length - 1].destinationIata)} ({firstLeg.segments[firstLeg.segments.length - 1].destinationIata})
          </div>
          <div className="booking-flight__summary-item-details">
            <div>{moment(firstLeg.departureDateTime).format('ddd, DD MMM YY')}</div>
            <div className="booking-flight__summary-item-details-bullet" />
            <div>{moment(firstLeg.departureDateTime).format('HH:mm')}</div>
          </div>
          <div className="booking-flight__summary-item-details">
            <div>Duration: {Math.floor(firstLeg.durationInMinutes / 60)}h {firstLeg.durationInMinutes % 60}m</div>
            <div className="booking-flight__summary-item-details-bullet" />
            <div>{firstLeg.stopCount === 0 ? 'Direct' : `${firstLeg.stopCount} stop(s)`}</div>
          </div>
        </div>
      </div>

      {/* Second Leg (Return) if exists */}
      {secondLeg && (
        <>
          <div className="booking-hotel__summary-separator"></div>
          <div className="booking-flight__summary-item">
            <div className="booking-flight__summary-item-brand">
              {secondLeg.carriers && secondLeg.carriers.length > 0 && secondLeg.carriers[0].imageUrl ? (
                <img 
                  src={secondLeg.carriers[0].imageUrl} 
                  alt={secondLeg.carriers[0].name} 
                  width={160} 
                  height={48}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <div style={{ width: 160, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {secondLeg.carriers && secondLeg.carriers.length > 0 ? secondLeg.carriers[0].name : 'Airline'}
                </div>
              )}
            </div>
            <div>
              <div className="booking-flight__summary-item-title">
                {getCityName(secondLeg.segments[0].originIata)} ({secondLeg.segments[0].originIata}) - {getCityName(secondLeg.segments[secondLeg.segments.length - 1].destinationIata)} ({secondLeg.segments[secondLeg.segments.length - 1].destinationIata})
              </div>
              <div className="booking-flight__summary-item-details">
                <div>{moment(secondLeg.departureDateTime).format('ddd, DD MMM YY')}</div>
                <div className="booking-flight__summary-item-details-bullet" />
                <div>{moment(secondLeg.departureDateTime).format('HH:mm')}</div>
              </div>
              <div className="booking-flight__summary-item-details">
                <div>Duration: {Math.floor(secondLeg.durationInMinutes / 60)}h {secondLeg.durationInMinutes % 60}m</div>
                <div className="booking-flight__summary-item-details-bullet" />
                <div>{secondLeg.stopCount === 0 ? 'Direct' : `${secondLeg.stopCount} stop(s)`}</div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="booking-hotel__summary-separator"></div>
      <div className="booking-hotel__summary-total">
        <div className="booking-hotel__summary-total-title">Total</div>
        <div className="booking-hotel__summary-total-price">
          <div className="booking-hotel__summary-total-price--text">
            {currencySymbol} {changePrice(price.amount)}
          </div>
          {selectedFlight.priceBreakdowns && selectedFlight.priceBreakdowns.length > 0 && (
            <a href="#" className="booking-hotel__summary-total-price--link">See pricing details</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default FlightBookingSummary
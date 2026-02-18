// Example: Cara menggunakan callBookingAPI untuk search flights

import { callBookingAPI } from '@/lib/axiosHelper'

// Interface untuk parameter search flights
interface SearchFlightsParams {
  fromId: string // e.g., "BOM.AIRPORT"
  toId: string // e.g., "DEL.AIRPORT"
  departDate: string // e.g., "2024-12-25"
  returnDate?: string // Optional untuk round trip
  stops?: 'none' | '0' | '1' | '2' // Default: 'none' (none, 0=non-stop, 1=one-stop, 2=two-stop)
  pageNo?: number // Default: 1
  adults?: number // Default: 1
  children?: string // e.g., "0,17" (ages separated by comma, URL encoded)
  sort?: 'BEST' | 'CHEAPEST' | 'FASTEST' // Default: 'BEST'
  cabinClass?: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST' // Default: 'ECONOMY'
  currency_code?: string // e.g., "AED", "USD"
}

// Interface untuk location search
interface FlightLocation {
  id: string
  name: string
  city?: string
  country?: string
  iataCode?: string
  type?: 'AIRPORT' | 'CITY'
}

/**
 * Function untuk mencari lokasi bandara menggunakan Booking.com API
 * Ini digunakan untuk autocomplete pada search bar
 */
export const searchFlightLocations = async (query: string) => {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      query: query
    })

    // Pass only the path, not the full URL (callBookingAPI will prepend the host)
    const url = `/api/v1/flights/searchDestination?${params.toString()}`

    const response = await callBookingAPI({
      method: 'GET',
      url: url
    })

    return response
  } catch (error) {
    console.error('Error searching flight locations:', error)
    throw error
  }
}

/**
 * Function untuk search flights menggunakan Booking.com API
 */
export const searchFlights = async (params: SearchFlightsParams) => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams({
      fromId: params.fromId,
      toId: params.toId,
      departDate: params.departDate,
      ...(params.returnDate && { returnDate: params.returnDate }),
      stops: params.stops || 'none',
      pageNo: String(params.pageNo || 1),
      adults: String(params.adults || 1),
      sort: params.sort || 'BEST',
      cabinClass: params.cabinClass || 'ECONOMY',
      currency_code: params.currency_code || 'AED'
    })

    // Only add children parameter if provided
    if (params.children) {
      queryParams.append('children', params.children)
    }

    // Pass only the path, not the full URL (callBookingAPI will prepend the host)
    const url = `/api/v1/flights/searchFlights?${queryParams.toString()}`

    const response = await callBookingAPI({
      method: 'GET',
      url: url
    })

    return response
  } catch (error) {
    console.error('Error searching flights:', error)
    throw error
  }
}

// ===== CONTOH PENGGUNAAN =====

// 1. Penggunaan di Component dengan async/await
/*
export const ExampleComponent = () => {
  const handleSearchFlights = async () => {
    const result = await searchFlights({
      fromId: 'BOM.AIRPORT',
      toId: 'DEL.AIRPORT',
      departDate: '2026-01-22',
      returnDate: '2026-01-31', // Optional for round-trip
      stops: 'none', // Options: 'none', '0', '1', '2'
      pageNo: 1,
      adults: 1,
      children: '0,17', // Optional: children ages separated by comma
      sort: 'BEST',
      cabinClass: 'ECONOMY',
      currency_code: 'AED'
    })

    if (result.ok) {
      console.log('Flight results:', result.data)
      // result.data akan berisi:
      // - data: flight details
      // - aggregation: filter aggregations
      // - stops: available stops with prices
      // - airlines: available airlines with prices
      // - departureIntervals: time intervals
      // - flightTimes: departure & arrival times
    } else {
      console.error('Error:', result.error)
    }
  }

  return (
    <button onClick={handleSearchFlights}>
      Search Flights
    </button>
  )
}
*/

// 2. Penggunaan di API Route (Server-side)
export const searchFlightsServerSide = async (req, res) => {
  const { fromId, toId, departDate, returnDate } = req.query

  const result = await searchFlights({
    fromId: fromId as string,
    toId: toId as string,
    departDate: departDate as string,
    returnDate: returnDate as string, // Optional for round-trip
    stops: 'none', // Options: 'none', '0', '1', '2'
    pageNo: 1,
    adults: 1,
    cabinClass: 'ECONOMY',
    currency_code: 'AED'
  })

  if (result.ok) {
    return res.status(200).json(result.data)
  } else {
    return res.status(result.status).json({ error: result.error })
  }
}

// 3. Penggunaan dengan getServerSideProps
export async function getServerSideProps(context) {
  const result = await searchFlights({
    fromId: 'BOM.AIRPORT',
    toId: 'DEL.AIRPORT',
    departDate: '2026-01-22',
    returnDate: '2026-01-31', // Optional for round-trip
    stops: 'none', // Options: 'none', '0', '1', '2'
    pageNo: 1,
    adults: 1,
    cabinClass: 'ECONOMY',
    currency_code: 'AED'
  })

  return {
    props: {
      flights: result.ok ? result.data : null,
      error: result.error || null
    }
  }
}

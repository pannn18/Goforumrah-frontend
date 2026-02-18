import { NextApiRequest, NextApiResponse } from 'next'
import { callBookingAPI } from '@/lib/axiosHelper'

/**
 * Search Flights API Endpoint
 * Proxy to Booking.com Flight Search API
 *
 * Query Parameters:
 * - fromId (required): From/Departure location Id (e.g., "BOM.AIRPORT")
 * - toId (required): To/Arrival location Id (e.g., "DEL.AIRPORT")
 * - departDate (required): Departure date in YYYY-MM-DD format
 * - returnDate (optional): Return date in YYYY-MM-DD format
 * - adults (optional): Number of adult passengers (default: 1)
 * - children (optional): Children ages separated by comma (e.g., "0,17")
 * - stops (optional): Filter by stops - 'none', '0', '1', '2' (default: 'none')
 * - cabinClass (optional): 'ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST'
 * - currency_code (optional): Currency code (e.g., 'AED', 'USD')
 * - pageNo (optional): Page number for pagination (default: 1)
 * - sort (optional): Sort order - 'BEST', 'CHEAPEST', 'FASTEST' (default: 'BEST')
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET requests are accepted' })
  }

  try {
    // Extract query parameters
    const {
      fromId,
      toId,
      departDate,
      returnDate,
      adults,
      children,
      stops,
      cabinClass,
      currency_code,
      pageNo,
      sort
    } = req.query

    // Validate required parameters
    if (!fromId || typeof fromId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid required parameter: fromId' })
    }
    if (!toId || typeof toId !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid required parameter: toId' })
    }
    if (!departDate || typeof departDate !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid required parameter: departDate' })
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(departDate as string)) {
      return res.status(400).json({ error: 'Invalid date format for departDate. Use YYYY-MM-DD' })
    }
    if (returnDate && !dateRegex.test(returnDate as string)) {
      return res.status(400).json({ error: 'Invalid date format for returnDate. Use YYYY-MM-DD' })
    }

    // Build the query parameters object
    const params: Record<string, string> = {
      fromId,
      toId,
      departDate,
      adults: (adults as string) || '1',
      stops: (stops as string) || 'none',
      cabinClass: (cabinClass as string) || 'ECONOMY',
      currency_code: (currency_code as string) || 'AED',
      pageNo: (pageNo as string) || '1',
      sort: (sort as string) || 'BEST'
    }

    // Add optional parameters
    if (returnDate) params.returnDate = returnDate as string
    if (children) params.children = children as string

    // Build query string
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    // Call Booking.com API through the proxy
    const apiUrl = `/api/v1/flights/searchFlights?${queryString}`

    console.log('[searchFlights] Calling API:', apiUrl)
    console.log('[searchFlights] Full URL will be:', `https://${process.env.RAPIDAPI_HOST}/api/v1/flights/searchFlights?${queryString}`)

    const response = await callBookingAPI({
      method: 'GET',
      url: '/api/v1/flights/searchFlights',
      params
    })

    console.log('[searchFlights] Response status:', response.status, 'ok:', response.ok)

    if (response.ok) {
      res.status(200).json(response.data)
    } else {
      const statusCode = response.status || 500
      res.status(statusCode).json({
        error: response.error,
        status: false
      })
    }
  } catch (error: any) {
    console.error('[searchFlights] Unexpected error:', {
      message: error.message,
      stack: error.stack
    })

    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      status: false
    })
  }
}

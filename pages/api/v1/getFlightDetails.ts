import { NextApiRequest, NextApiResponse } from 'next'
import { callBookingAPI } from '@/lib/axiosHelper'

/**
 * Get Flight Details API Endpoint
 * Proxy to Booking.com Flight Details API
 *
 * Query Parameters:
 * - token (required): Flight token from search results
 * - currency_code (optional): Currency code (default: 'AED')
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed', message: 'Only GET and POST requests are accepted' })
  }

  try {
    // Extract token from either query or body
    const token = req.method === 'GET' ? req.query.token : req.body?.token
    const currency_code = req.method === 'GET' ? req.query.currency_code : req.body?.currency_code

    console.log('[getFlightDetails] Request received:', {
      method: req.method,
      hasToken: !!token,
      tokenLength: token?.length,
      currency: currency_code
    })

    // Validate required parameters
    if (!token || typeof token !== 'string') {
      console.error('[getFlightDetails] Invalid token:', { token, type: typeof token })
      return res.status(400).json({ 
        error: 'Missing or invalid required parameter: token',
        status: false,
        debug: {
          method: req.method,
          query: req.query,
          body: req.body
        }
      })
    }

    console.log('[getFlightDetails] Token received (first 50):', token.substring(0, 50) + '...')
    console.log('[getFlightDetails] Token full:', token)
    console.log('[getFlightDetails] Currency code:', currency_code || 'AED')

    // Build the query parameters - token MUST be in query params for GET request
    const params: Record<string, string> = {
      token: token,
      currency_code: (currency_code as string) || 'AED'
    }

    // Build query string - ensure proper ordering
    const queryString = Object.entries(params)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&')

    // Method: GET with token as query parameter (Booking.com API expects this)
    const apiUrl = `/api/v1/flights/getFlightDetails?${queryString}`

    console.log('[getFlightDetails] Calling API with GET method')
    console.log('[getFlightDetails] API URL:', apiUrl)
    console.log('[getFlightDetails] Full URL:', `https://${process.env.RAPIDAPI_HOST}${apiUrl}`)
    console.log('[getFlightDetails] Query params:', params)

    const response = await callBookingAPI({
      method: 'GET',
      url: apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('[getFlightDetails] Response received:', {
      status: response.status,
      ok: response.ok,
      hasData: !!response.data,
      error: response.error
    })
    console.log('[getFlightDetails] Response data:', JSON.stringify(response.data).substring(0, 500))

    if (response.ok) {
      console.log('[getFlightDetails] SUCCESS - Returning flight data')
      res.status(200).json(response.data)
    } else {
      console.error('[getFlightDetails] API Error:', response.error)
      console.error('[getFlightDetails] Error details:', {
        status: response.status,
        data: response.data,
        error: response.error
      })
      const statusCode = response.status || 500
      res.status(statusCode).json({
        error: response.error,
        message: 'Failed to fetch flight details',
        status: false,
        debug: {
          apiUrl,
          fullUrl: `https://${process.env.RAPIDAPI_HOST}${apiUrl}`,
          responseStatus: response.status,
          responseData: response.data
        }
      })
    }
  } catch (error: any) {
    console.error('[getFlightDetails] Unexpected error:', {
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
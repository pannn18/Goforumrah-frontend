import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

/**
 * Test endpoint to directly call Booking.com API (RapidAPI)
 * Clean, secure, production-ready
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  const token = req.query.token as string
  const currency_code = (req.query.currency_code as string) || 'AED'

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query param: token'
    })
  }

  const host = process.env.RAPIDAPI_HOST
  const key = process.env.RAPIDAPI_KEY

  if (!host || !key) {
    return res.status(500).json({
      success: false,
      message: 'RapidAPI env not configured'
    })
  }

  const url = `https://${host}/api/v1/flights/getFlightDetails`

  console.log('[booking-test] Request →', {
    url,
    tokenPrefix: token.slice(0, 20),
    currency_code
  })

  try {
    const response = await axios.get(url, {
      params: {
        token,
        currency_code
      },
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host
      },
      timeout: 15000
    })

    console.log('[booking-test] SUCCESS', {
      status: response.status
    })

    return res.status(200).json({
      success: true,
      status: response.status,
      data: response.data
    })
  } catch (error: any) {
    const isAxios = !!error.isAxiosError

    console.error('[booking-test] ERROR', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    })

    return res.status(error.response?.status || 500).json({
      success: false,
      message: isAxios
        ? 'Failed to fetch data from Booking API'
        : 'Unexpected server error',
      status: error.response?.status,
      data: error.response?.data,
      code: error.code
    })
  }
}
import axios, { AxiosRequestConfig } from "axios"
import https from "https"

export default async function handler(req, res) {
  const { method, query, body } = req

  // Decode the URL parameter (it was encoded in callBookingAPI to avoid query string parsing issues)
  const url = decodeURIComponent(query.url as string)

  // Construct full URL by prepending the API host
  const fullUrl = `https://${process.env.RAPIDAPI_HOST}${url}`

  console.log('[api/booking] ===== REQUEST START =====')
  console.log('[api/booking] Method:', method)
  console.log('[api/booking] URL param:', url)
  console.log('[api/booking] Full URL:', fullUrl)
  console.log('[api/booking] Body:', JSON.stringify(body))
  console.log('[api/booking] Has RAPIDAPI_HOST:', !!process.env.RAPIDAPI_HOST)
  console.log('[api/booking] Has RAPIDAPI_KEY:', !!process.env.RAPIDAPI_KEY)
  
  const config: AxiosRequestConfig = {
    method,
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': process.env.RAPIDAPI_HOST,
      'x-rapidapi-key': process.env.RAPIDAPI_KEY
    },
    // Disable SSL certificate validation for development
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  }

  if (body) config.data = body

  try {
    console.log('[api/booking] Sending request to RapidAPI...')
    const response = await axios(config)
    console.log('[api/booking] SUCCESS - Status:', response.status)
    console.log('[api/booking] Response data:', JSON.stringify(response.data).substring(0, 500))
    console.log('[api/booking] ===== REQUEST END =====')
    res.status(200).json(response.data)
  } catch (error) {
    console.error('[api/booking] ===== ERROR =====')
    console.error('[api/booking] Error message:', error.message)
    console.error('[api/booking] Error code:', error.code)
    console.error('[api/booking] Error stack:', error.stack)
    console.error('[api/booking] Response status:', error.response?.status)
    console.error('[api/booking] Response data:', JSON.stringify(error.response?.data))
    console.error('[api/booking] Response headers:', JSON.stringify(error.response?.headers))
    console.error('[api/booking] Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    console.error('[api/booking] ===== ERROR END =====')

    const statusCode = error.response?.status || 500
    const errorData = error.response?.data || {
      error: 'Internal server error',
      message: error.message,
      details: error.code,
      url: fullUrl
    }

    res.status(statusCode).json(errorData)
  }
}

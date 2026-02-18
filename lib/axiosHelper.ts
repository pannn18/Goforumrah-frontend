import axios, { AxiosHeaders, AxiosRequestConfig } from "axios"
import https from "https";
import http from "http";
import { getSession, signOut } from "next-auth/react";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

const httpAgent = new http.Agent({})

const BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN

const AXIOS_CONFIG = {
  httpsAgent
}

type CallAPIReturn = {
  status: number
  data: any
  ok: boolean
  error: string
}

export const callAPI = async (url: string, method: string, data?: any, authorized?: boolean, accessToken?: string, contentType?: string, config?: AxiosRequestConfig): Promise<CallAPIReturn> => {
  if (!url || !method) return

  const authorization = authorized && await getSession()

  return await axios({
    ...AXIOS_CONFIG,
    headers: {
      'Content-Type': contentType || 'application/json',
      'Authorization': accessToken || (authorization && authorization?.user?.accessToken)
    },
    url: BASE_URL + url,
    method,
    data,
    ...config
  }).then((response) => {
    const { data: { data, errors, error, status_code }, status } = response

    if (errors || error) throw { status: status_code || status, message: errors || error }

    return {
      status,
      data,
      ok: true,
      error: null
    }
  }).catch((error) => {
    if (error?.response?.data?.status_code == 401 && (error?.response?.data?.error == 'tokenNotFound' || error?.response?.data?.error == 'tokenExpired' || error?.response?.data?.error == 'tokenInvalid')) {
      error.status = 'Unauthorized'
      signOut()
    }

    return {
      status: error.status || 'Unknown status',
      data: null,
      ok: false,
      error: typeof error === 'string' ? error || 'Unknown error' : (error?.message.toString() || error?.response?.data?.detail.toString() || error?.response.toString() || error?.status.toString() || 'Unknown error')
    }
  })
}

export const callFlightHistoryAPI = async (
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: any,
  authorized?: boolean,
  accessToken?: string
): Promise<CallAPIReturn> => {
  if (!endpoint || !method) return

  const authorization = authorized && await getSession()
  const token = accessToken || (authorization && authorization?.user?.accessToken)

  if (authorized && !token) {
    return {
      status: 401,
      data: null,
      ok: false,
      error: 'No access token. Please login again.'
    }
  }

  return await axios({
    ...AXIOS_CONFIG,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? token : undefined
    },
    url: BASE_URL + endpoint,
    method,
    data
  }).then((response) => {
    const { data: responseData, status } = response

    if (responseData.errors || responseData.error) {
      throw { 
        status: responseData.status_code || status, 
        message: responseData.errors || responseData.error 
      }
    }

    return {
      status,
      data: responseData.data || responseData,
      ok: true,
      error: null
    }
  }).catch((error) => {
    console.error('[callFlightHistoryAPI] status:', error?.response?.status)
    console.error('[callFlightHistoryAPI] data:', JSON.stringify(error?.response?.data))

    return {
      status: error?.response?.status || error?.status || 'Unknown status',
      data: null,
      ok: false,
      error: typeof error === 'string' 
        ? error 
        : (error?.message || error?.response?.data?.message || error?.response?.data?.detail || 'Unknown error')
    }
  })
}

export const callSkyscannerAPI = async (config: AxiosRequestConfig, origin?: string): Promise<CallAPIReturn> => {
  if (!config) return

  const encodedUrl = encodeURIComponent(config.url)

  return await axios({
    ...config,
    url: (origin || '') + `/api/skyscanner?url=${encodedUrl}`
  }).then((response) => {
    const { data, status } = response

    return {
      status,
      data,
      ok: true,
      error: null
    }
  }).catch((error) => {
    return {
      status: error.status || 'Unknown status',
      data: null,
      ok: false,
      error: typeof error === 'string' ? error || 'Unknown error' : (error?.message.toString() || error?.response?.data?.detail.toString() || error?.response.toString() || error?.status.toString() || 'Unknown error')
    }
  })
}

export const callMystiflyAPI = async (config: AxiosRequestConfig, origin?: string): Promise<CallAPIReturn> => {
  if (!config) return

  const encodedUrl = encodeURIComponent(config.url)

  return await axios({
    ...config,
    url: (origin || '') + `/api/mystifly?url=${encodedUrl}`
  }).then((response) => {
    const { data, status } = response

    return {
      status,
      data,
      ok: true,
      error: null
    }
  }).catch((error) => {
    return {
      status: error.status || 'Unknown status',
      data: null,
      ok: false,
      error: typeof error === 'string' ? error || 'Unknown error' : (error?.message.toString() || error?.response?.data?.detail.toString() || error?.response.toString() || error?.status.toString() || 'Unknown error')
    }
  })
}

export const callBookingAPI = async (
  config: AxiosRequestConfig,
  origin = process.env.NEXT_PUBLIC_APP_URL
): Promise<CallAPIReturn> => {
  if (!config) return

  const encodedUrl = encodeURIComponent(config.url)

  return await axios({
    ...config,
    url: (origin || '') + `/api/booking?url=${encodedUrl}`
  }).then((response) => {
    const { data, status } = response

    if (data && data.status === false) {
      return {
        status,
        data,
        ok: false,
        error: data.message || 'API returned an error'
      }
    }

    if (data && data.data && data.data.error) {
      return {
        status,
        data,
        ok: false,
        error: data.data.error.message || data.data.error.code || 'API returned an error in data'
      }
    }

    return {
      status,
      data,
      ok: true,
      error: null
    }
  }).catch((error) => {
    console.error('[callBookingAPI] Error:', error.message)

    let errorMessage = 'Unknown error'

    if (typeof error === 'string') {
      errorMessage = error
    } else if (error?.message) {
      errorMessage = error.message.toString()
    } else if (error?.response?.data?.detail) {
      errorMessage = String(error.response.data.detail)
    } else if (error?.response?.data?.message) {
      errorMessage = String(error.response.data.message)
    } else if (error?.response) {
      errorMessage = String(error.response)
    } else if (error?.status) {
      errorMessage = String(error.status)
    }

    return {
      status: error?.response?.status || error?.status || 'Unknown status',
      data: error?.response?.data || null,
      ok: false,
      error: errorMessage
    }
  })
}
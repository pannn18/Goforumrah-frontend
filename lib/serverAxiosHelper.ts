/** Import packages */
import axios, { AxiosHeaders } from "axios"
import https from "https"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"

/** Create an HTTPS agent to disable verify the first certificate */
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})

/** Our contants */
const BASE_URL = process.env.NEXT_PUBLIC_API_DOMAIN
const AXIOS_CONFIG = {
  httpsAgent
}


/** ---------------------------------------- */

/**
 * Axios helper to make API call easier
 */

type CallAPIReturn = {
  status: number | string
  data: any
  ok: boolean
  error: string | null
}

export const callAPIFromServer = async (url: string, method: string, data?: any, authorized?: boolean): Promise<CallAPIReturn> => {
  const authorization = authorized && await getServerSession(authOptions)

  return await axios({
    ...AXIOS_CONFIG,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authorization && authorization?.user?.accessToken
    },
    url: BASE_URL + url,
    method,
    data
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
    if (error?.response?.data?.status_code == 401 && ['tokenNotFound', 'tokenExpired', 'tokenInvalid'].includes(error?.response?.data?.error)) {
      error.status = 'Unauthorized'
    }

    return {
      status: error.status || 'Unknown status',
      data: null,
      ok: false,
      error: typeof error === 'string' ? error || 'Unknown error' : (error?.message.toString() || error?.response?.data?.detail.toString() || error?.response.toString() || error?.status.toString() || 'Unknown error')
    }
  })
}
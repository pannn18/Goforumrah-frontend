import axios, { AxiosRequestConfig } from "axios"

export default async function handler(req, res) {
  const { method, query, body, headers } = req
  const url = query.url
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + process.env.MYSTIFLY_API_KEY
    }
  }

  if (body) config.data = body

  try {
    const response = await axios(config)
    res.status(200).json(response.data)
  } catch (error) {
    console.error(error)
    const { response } = error
    res.status(response?.status || 500).json(response?.data)
  }
}
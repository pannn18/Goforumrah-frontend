import { useState, useEffect } from 'react'
import { callAPI } from '@/lib/axiosHelper'

const useFetch = (url: string, method: string, payload?: any, authorized?: boolean): { loading: boolean, data: any, ok: boolean, error: string } => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [ok, setOK] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

      ; (async () => {
        try {
          setLoading(true)

          const { status, data, ok, error } = await callAPI(url, method, payload, authorized)

          if (error) throw error

          if (!signal.aborted) {
            setData(data)
            setOK(true)
          }
        } catch (error) {
          if (!signal.aborted) {
            setError(typeof error === 'string' ? error || 'Unknown error' : (error?.message.toString() || error?.response.toString() || error?.status.toString() || 'Unknown error'))
            setOK(false)
          }
        } finally {
          if (!signal.aborted) {
            setLoading(false)
          }
        }
      })()

    return () => {
      abortController.abort()
    }
  }, [])

  return { error, ok, data, loading }
}

export default useFetch
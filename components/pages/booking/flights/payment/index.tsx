import React, { useState, useEffect } from 'react'
import { Icons } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import BookingSummary from '@/components/pages/booking/flights/summary'
import { useFlightStore } from '@/lib/stores/flightStore'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import LoadingOverlay from '@/components/loadingOverlay/index'
import StripePaymentElements from './stripe'
import { Stripe, loadStripe } from '@stripe/stripe-js'

interface PassengerData {
  fullname: string
  email: string
  phone: string
  title: string
  nationality: string
  passportNumber: string
  dateOfBirth: string
  passportIssued?: string
  passportCountry?: string
  passportExpiry?: string
}

interface IProps {
  handleNextStep?: () => void
  passengerData: PassengerData | null
  selectedFlight: any
}

const BookingPayment = ({ handleNextStep, passengerData, selectedFlight }: IProps) => {
  const router = useRouter()
  const { data: session, status } = useSession()

  const price = selectedFlight?.price?.amount || 0

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(!price ? 'Unknown price' : null)
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null)
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)

  // ONLY initialize Stripe - NO booking creation here
  useEffect(() => {
    const initStripe = async () => {
      if (status === 'loading') return

      if (status === 'unauthenticated') {
        router.push('/login?callbackUrl=/booking/flights')
        return
      }

      if (!selectedFlight || !session) {
        setError('Missing flight or session data')
        setLoading(false)
        return
      }

      if (!passengerData) {
        setError('Passenger data missing. Please go back and fill in details.')
        setLoading(false)
        return
      }

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        setError('Stripe configuration missing')
        setLoading(false)
        return
      }

      setLoading(true)

      try {
        console.log('[STRIPE] Initializing Stripe...')

        const [stripe, clientSecret] = await Promise.all([
          loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
          fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: Math.round(price * 100),
              currency: selectedFlight?.price?.unit?.toLowerCase() || 'idr'
            }),
          }).then(res => res.json()).then(data => data.clientSecret)
        ])

        if (!stripe || !clientSecret) {
          setError('Failed to initialize payment')
          setLoading(false)
          return
        }

        console.log('[SUCCESS] Stripe initialized')
        setStripePromise(stripe)
        setStripeClientSecret(clientSecret)
        setLoading(false)
      } catch (err: any) {
        console.error('[ERROR] Stripe initialization error:', err)
        setError('Failed to initialize payment')
        setLoading(false)
      }
    }

    initStripe()
  }, [status, session, selectedFlight, passengerData])

  if (status === 'loading' || loading) return <LoadingOverlay />

  if (error && !stripePromise) {
    return (
      <div className="container mt-3">
        <div className='d-flex gap-3 booking-error-banner'>
          <SVGIcon src={Icons.CircleErrorLarge} width={40} height={40} />
          <p className='fs-xl'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <TimerSection createdAt={new Date().toISOString()} />
      <div className="container">
        <div className="booking-hotel__wrapper">
          <div className="booking-hotel__inner">
            {!!(stripePromise && stripeClientSecret) && (
              <StripePaymentElements
                stripe={stripePromise}
                clientSecret={stripeClientSecret}
                price={price}
                passengerData={passengerData}
                selectedFlight={selectedFlight}
                onError={(error) => setError(error)}
                onSuccess={() => {
                  if (handleNextStep) handleNextStep()
                }}
              />
            )}
          </div>
          <BookingSummary />
        </div>
      </div>
    </>
  )
}

const TimerSection = ({ createdAt }: { createdAt: string }) => {
  const MAX_TIME = 30 * 60

  const calculateRemainingTime = () => {
    const createdTime = new Date(createdAt).getTime()
    const now = new Date().getTime()
    const diff = Math.floor((now - createdTime) / 1000)
    return Math.max(MAX_TIME - diff, 0)
  }

  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => Math.max(prev - 1, 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="booking-hotel__timer">
      <div className="container">
        <div className="booking-hotel__timer-wrapper">
          <p>Complete your payment in</p>
          <div className="booking-hotel__timer-countdown">
            <div className="booking-hotel__timer-number">
              {Math.floor(remainingTime / 3600).toString().padStart(2, '0')}
            </div>
            <p>:</p>
            <div className="booking-hotel__timer-number">
              {Math.floor((remainingTime % 3600) / 60).toString().padStart(2, '0')}
            </div>
            <p>:</p>
            <div className="booking-hotel__timer-number">
              {(remainingTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPayment
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

interface IProps {
  handleNextStep?: () => void
}

const BookingPayment = ({ handleNextStep }: IProps) => {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const { 
    selectedFlight, 
    passengerData, 
    createFlightBooking,
    setBookingDetails 
  } = useFlightStore()

  const price = selectedFlight?.price?.amount || 0

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(!price ? 'Unknown price' : null)
  
  // Stripe states
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null)
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null)
  const [flightBookingId, setFlightBookingId] = useState<number | null>(null)

  // Initialize Stripe
  const initializeStripe = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError('Stripe configuration missing')
      return
    }

    try {
      const [stripe, clientSecret] = await Promise.all([
        loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            amount: Math.round(price * 100), 
            currency: selectedFlight?.price?.unit?.toLowerCase() || 'idr'
          }),
        }).then(res => res.json()).then(data => data.clientSecret)
      ])

      if (!stripe || !clientSecret) {
        setError('Failed to initialize payment')
        return
      }

      setStripePromise(stripe)
      setStripeClientSecret(clientSecret)
    } catch (err) {
      console.error('❌ Stripe initialization error:', err)
      setError('Failed to initialize payment')
    }
  }
  

  // Create flight booking on mount
  useEffect(() => {
    const createBooking = async () => {
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

      setLoading(true)

      try {
        // Create flight booking first
        const firstSegment = selectedFlight.firstLeg?.segments?.[0]
        const lastSegment = selectedFlight.firstLeg?.segments?.[selectedFlight.firstLeg.segments.length - 1]

        const bookingPayload = {
          id_customer: session?.user?.id,
          mfref: selectedFlight.fareSourceCode || selectedFlight.id,
          airline_name: selectedFlight.firstLeg?.carriers?.[0]?.name || 'Unknown',
          flight_number: firstSegment?.airline?.flightNumber || 'N/A',
          origin: firstSegment?.originIata || '',
          destination: lastSegment?.destinationIata || '',
          departure_time: selectedFlight.firstLeg?.departureDateTime || null,
          arrival_time: selectedFlight.firstLeg?.arrivalDateTime || null,
          total_price: selectedFlight.price.amount,
          currency: selectedFlight.price.unit,
          contact_fullname: passengerData.fullname,
          contact_email: passengerData.email,
          contact_phone: passengerData.phone,
          passengers: [
            {
              title: passengerData.title || 'Mr',
              firstname: passengerData.fullname?.split(' ')[0] || '',
              lastname: passengerData.fullname?.split(' ').slice(1).join(' ') || '',
              identity_number: passengerData.passportNumber || '',
              nationality: passengerData.nationality || 'ID',
              date_of_birth: passengerData.dateOfBirth || '',
              passport_expiry: passengerData.passportExpiry || '',
              passenger_type: 'adult'
            }
          ]
        }

        console.log('📝 Creating flight booking:', bookingPayload)

        const bookingResult = await createFlightBooking(bookingPayload)

        if (!bookingResult.success) {
          throw new Error(bookingResult.message || 'Failed to create booking')
        }

        const bookingId = bookingResult.data?.id_flight_booking
        console.log('✓ Flight booking created:', bookingId)
        
        setFlightBookingId(bookingId)

        // Initialize Stripe after booking is created
        await initializeStripe()

      } catch (err: any) {
        console.error('❌ Booking creation error:', err)
        setError(err.message || 'Failed to create booking')
      } finally {
        setLoading(false)
      }
    }

    createBooking()
  }, [status, session, selectedFlight, passengerData])

  if (status === 'loading' || loading) {
    return <LoadingOverlay />
  }

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
            {!!(stripePromise && stripeClientSecret && flightBookingId) && (
              <StripePaymentElements
                flightBookingID={flightBookingId}
                stripe={stripePromise}
                clientSecret={stripeClientSecret}
                price={price}
                onError={(error) => setError(error)}
                onSuccess={() => {
                  // Navigate to confirmation
                  if (handleNextStep) {
                    handleNextStep()
                  }
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

// Timer Section
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
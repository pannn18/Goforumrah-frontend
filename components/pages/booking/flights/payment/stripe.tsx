import React, { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Stripe, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'
import { UseCurrencyConverter } from '@/components/convertCurrency'
import { useFlightStore } from '@/lib/stores/flightStore'
import { callFlightHistoryAPI } from '@/lib/axiosHelper'

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

interface StripePaymentProps {
  stripe: Stripe
  clientSecret: string
  price: number
  passengerData: PassengerData | null
  selectedFlight: any
  onError: (error: string) => void
  onSuccess: () => void
}

export default function StripePaymentElements(props: StripePaymentProps) {
  const { stripe, clientSecret } = props

  const options: StripeElementsOptions = {
    clientSecret,
  }

  return (
    <Elements stripe={stripe} options={options}>
      <CheckoutForm {...props} />
    </Elements>
  )
}

const CheckoutForm: React.FC<StripePaymentProps> = ({ 
  price, 
  passengerData, 
  selectedFlight, 
  onError, 
  onSuccess 
}) => {
  const options: StripePaymentElementOptions = {
    fields: {
      billingDetails: {
        name: 'auto'
      }
    },
  }

  const { data: session } = useSession()
  const stripe = useStripe()
  const elements = useElements()
  const [origin, setOrigin] = useState('')
  const [loading, setLoading] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const { createFlightBooking, saveFlightPayment, setBookingDetails } = useFlightStore()

  React.useEffect(() => {
    setOrigin(window.location.origin || '')
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!agreedToTerms) {
      onError('Please agree to the Privacy Policy and Terms & Conditions')
      return
    }

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      console.log('[PAYMENT] Processing payment...')

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: origin + '/booking/flight/stripe/callback',
          payment_method_data: {
            billing_details: {
              name: session?.user?.name || '',
            }
          }
        },
        redirect: 'if_required'
      })

      if (result.error) {
        onError(result.error.message || 'Payment failed')
        setLoading(false)
        return
      }

      console.log('[SUCCESS] Payment confirmed:', result.paymentIntent.id)

      if (result.paymentIntent.status === 'succeeded') {
        console.log('[CREATE] Creating flight booking AFTER payment success...')

        // 1. CREATE BOOKING (after payment success)
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
          contact_fullname: passengerData?.fullname,
          contact_email: passengerData?.email,
          contact_phone: passengerData?.phone,
          passengers: [
            {
              title: passengerData?.title || 'Mr',
              firstname: passengerData?.fullname?.split(' ')[0] || '',
              lastname: passengerData?.fullname?.split(' ').slice(1).join(' ') || '',
              identity_number: passengerData?.passportNumber || '',
              nationality: passengerData?.nationality || 'ID',
              date_of_birth: passengerData?.dateOfBirth || '',
              passport_expiry: passengerData?.passportExpiry || '',
              passenger_type: 'adult'
            }
          ]
        }

        console.log('[PAYLOAD] Booking payload:', bookingPayload)

        const bookingResult = await createFlightBooking(bookingPayload)
        console.log('[DEBUG] Full booking result:', JSON.stringify(bookingResult, null, 2))

        if (!bookingResult.success) {
          console.error('[ERROR] Booking creation failed:', bookingResult.message)
          onError('Payment succeeded but failed to create booking')
          setLoading(false)
          return
        }

        const bookingId = bookingResult.data?.passengers?.[0]?.id_flight_booking

        console.log('[DEBUG] Full booking result:', bookingResult)
        console.log('[DEBUG] Booking data:', bookingResult.data)
        console.log('[DEBUG] Booking ID:', bookingId)

        if (!bookingId) {
          console.error('[ERROR] No booking ID returned!')
          onError('Failed to get booking ID')
          setLoading(false)
          return
        }

        console.log('[SUCCESS] Booking created with ID:', bookingId)

        // 2. SAVE PAYMENT
        const paymentPayload = {
          id_flight_booking: bookingId,
          amount: price,
          payment_method: 'stripe',
          transaction_id: result.paymentIntent.id
        }

        const paymentResult = await saveFlightPayment(paymentPayload)

        if (!paymentResult.success) {
          console.error('[ERROR] Payment save failed:', paymentResult.message)
          onError('Booking created but failed to save payment')
          setLoading(false)
          return
        }

        console.log('[SUCCESS] Payment saved:', paymentResult.data)

        // 3. CONFIRM BOOKING → status jadi 'confirmed'
        const { ok: confirmOk, data: confirmData } = await callFlightHistoryAPI(
          '/flight-booking/confirm',
          'POST',
          { id_flight_booking: bookingId },
          true
        )

        if (!confirmOk) {
          console.error('[ERROR] Booking confirmation failed:', confirmData)
          // Tidak block user, booking & payment sudah tersimpan
        } else {
          console.log('[SUCCESS] Booking confirmed:', confirmData)
        }

        // 4. SET BOOKING DETAILS for confirmation page
        setBookingDetails({
          bookingId: `FL-${bookingId}`,
          pnr: confirmData?.booking_reference || paymentResult.data?.ticket_number || result.paymentIntent.id.substring(0, 6).toUpperCase(),
          totalPrice: price,
          status: 'confirmed',
          paymentMethod: 'stripe',
          paymentReference: result.paymentIntent.id,
          createdAt: new Date().toISOString(),
          flightNumber: firstSegment?.airline?.flightNumber || 'N/A',
          airline: selectedFlight.firstLeg?.carriers?.[0]?.name || 'Unknown',
          origin: firstSegment?.originIata || '',
          destination: lastSegment?.destinationIata || '',
          departureTime: selectedFlight.firstLeg?.departureDateTime || '',
          arrivalTime: selectedFlight.firstLeg?.arrivalDateTime || ''
        })

        console.log('[COMPLETE] Booking flow completed successfully')

        onSuccess()
      } else if (result.paymentIntent.status === 'processing') {
        onError('Payment is processing. Please wait...')
        setLoading(false)
      } else {
        onError('Payment was not completed')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('[ERROR] Payment error:', err)
      onError(err.message || 'An error occurred during payment')
      setLoading(false)
    }
  }

  const { changePrice, currencySymbol } = UseCurrencyConverter()

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <div className="booking-hotel__card">
        <div className="booking-hotel__card-row">
          <p className="booking-hotel__card-title">Payment Details</p>
        </div>
        <div className="booking-hotel__payment" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <PaymentElement options={options} />
        </div>
      </div>

      <div className="booking-hotel__aggreement form-check">
        <input
          type="checkbox"
          className="form-check-input"
          checked={agreedToTerms}
          onChange={(e) => setAgreedToTerms(e.target.checked)}
        />
        <p>
          By clicking the button below, you have agreed to our{' '}
          <a href="#" className="booking-hotel__aggreement-link">Privacy Policy</a> and{' '}
          <a href="#" className="booking-hotel__aggreement-link">Terms & Conditions.</a>
        </p>
      </div>

      <div className="booking-hotel__card">
        <div className="booking-hotel__footer">
          <div className="booking-hotel__footer-total">
            <p>Total :</p>
            <div className="booking-hotel__footer-price">
              <h5>{currencySymbol} {changePrice(String(price))}</h5>
              {selectedFlight && selectedFlight.priceBreakdowns && selectedFlight.priceBreakdowns.length > 0 && (
                <a href="#" className="booking-hotel__footer-details">See pricing details</a>
              )}
            </div>
          </div>
          <button
            disabled={!stripe || loading || !agreedToTerms}
            type="submit"
            className="btn btn-lg btn-success"
          >
            {loading ? 'Processing...' : 'Complete Booking'}
          </button>
        </div>
      </div>
    </form>
  )
}
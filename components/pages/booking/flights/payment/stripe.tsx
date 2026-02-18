import React, { useState } from 'react'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Stripe, StripeElementsOptions, StripePaymentElementOptions } from '@stripe/stripe-js'
import { useSession } from 'next-auth/react'
import { UseCurrencyConverter } from '@/components/convertCurrency'
import { useFlightStore } from '@/lib/stores/flightStore'

interface Props {
  flightBookingID: number
  stripe: Stripe
  clientSecret: string
  price: number
  onError: (error: string) => void
  onSuccess: () => void
}

export default function StripePaymentElements(props: Props) {
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

const CheckoutForm = ({ flightBookingID, price, onError, onSuccess }: Props) => {
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
  const { setBookingDetails, selectedFlight } = useFlightStore()

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
      console.log('🔄 Processing payment...')
      
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

      console.log('✓ Payment intent created:', result.paymentIntent.id)

      if (result.paymentIntent.status === 'succeeded') {
        console.log('✅ Payment succeeded!')

        // Extract flight info from selectedFlight
        const firstLeg = selectedFlight?.firstLeg
        const airline = firstLeg?.carriers?.[0]?.name || firstLeg?.segments?.[0]?.airline?.name || 'Unknown Airline'
        const flightNumber = firstLeg?.segments?.[0]?.airline?.flightNumber || 'N/A'
        const origin = firstLeg?.segments?.[0]?.originIata || 'N/A'
        const destination = firstLeg?.segments?.[firstLeg.segments.length - 1]?.destinationIata || 'N/A'
        const departureTime = firstLeg?.departureDateTime || ''
        const arrivalTime = firstLeg?.arrivalDateTime || ''

        // Save complete booking details to Zustand
        setBookingDetails({
          bookingId: `FL-${flightBookingID}`,
          pnr: result.paymentIntent.id.substring(0, 6).toUpperCase(), // Use first 6 chars as PNR
          totalPrice: price,
          status: 'confirmed',
          paymentMethod: 'stripe',
          paymentReference: result.paymentIntent.id,
          createdAt: new Date().toISOString(),
          // Flight info
          flightNumber,
          airline,
          origin,
          destination,
          departureTime,
          arrivalTime
        })

        console.log('✅ Booking details saved to store')
        
        onSuccess()
        
      } else if (result.paymentIntent.status === 'processing') {
        onError('Payment is processing. Please wait...')
        setLoading(false)
      } else {
        onError('Payment was not completed')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('❌ Payment error:', err)
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
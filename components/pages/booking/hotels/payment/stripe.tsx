import React, { useEffect, useState } from 'react';
import { Elements, PaymentElement, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Stripe, StripeElementsOptions, StripePaymentElementOptions, loadStripe } from '@stripe/stripe-js';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images } from '@/types/enums'
import { useSession } from 'next-auth/react';
import { callAPI } from '@/lib/axiosHelper';
import { UseCurrencyConverter } from '@/components/convertCurrency';

interface Props {
  hotelBookingID: string | number
  stripe: Stripe
  clientSecret: string
  price: number
  currentURL: string
  onError: (error: string) => void
  onSuccess: () => void
}

export default function StripePaymentElements(props: Props) {
  const { stripe, clientSecret } = props

  const options: StripeElementsOptions = {
    // passing the client secret obtained from the server
    clientSecret,
  };

  return (
    <>
      <Elements
        stripe={stripe}
        options={options}
      >
        <CheckoutForm {...props} />
      </Elements>
    </>
  )
};

const CheckoutForm = ({ hotelBookingID, price, currentURL, onError, onSuccess }: Props) => {
  const options: StripePaymentElementOptions = {
    fields: {
      billingDetails: {
        name: 'auto'
      }
    },
  }

  const { data: session } = useSession()
  const stripe = useStripe();
  const elements = useElements();
  const [origin, setOrigin] = useState('');
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin || '')
  }, [])

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true)

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: origin + '/booking/hotel/stripe/callback',
        payment_method_data: {
          billing_details: {
            name: session?.user?.name || '',
          }
        }
      },
      redirect: 'if_required'
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      onError(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.

      const { ok } = await callAPI('/hotel-booking/payment', 'POST', { id_hotel_booking: hotelBookingID, payment_intent: result.paymentIntent.id }, true)

      if (ok) {
        if (result.paymentIntent.status === 'succeeded') {
          const payload = {
            id_hotel_booking: hotelBookingID
          }

          const { ok } = await callAPI('/hotel-booking/confirm', 'POST', payload, true)

          if (!ok) {
            onError('Stripe succeeded but failed to update booking status on our server');
          }
        } else if (result.paymentIntent.status === 'processing') {
          // Processing the order
        } else {
          const payload = {
            id_hotel_booking: hotelBookingID
          }

          const { ok } = await callAPI('/hotel-booking/cancel', 'POST', payload, true)

          if (!ok) {
            onError('Stripe canceled but failed to update booking status on our server');
          }
        }

        onSuccess()
      } else {
        onError('Failed to update booking status on our server');
      }
    }

    setLoading(false)
  };

  const { changePrice, currencySymbol } = UseCurrencyConverter();

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
      <div className="booking-hotel__card">
        <div className="booking-hotel__footer">
          <div className="booking-hotel__footer-total">
            <p>Total :</p>
            <div className="booking-hotel__footer-price">
              <h5>{currencySymbol}
                {changePrice(String(price))}</h5>
              <a href="#" className="booking-hotel__footer-details">See pricing details</a>
            </div>
          </div>
          <button
            disabled={!stripe || !!loading}
            type="submit"
            className="btn btn-lg btn-success">{loading ? 'Please wait...' : 'Complete Booking'}</button>
        </div>
      </div>
    </form>
  )
};
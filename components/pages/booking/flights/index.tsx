import React, { useState, useEffect } from 'react'
import BookingHeader from '@/components/pages/booking/header'
import BookingDetails from '@/components/pages/booking/flights/details'
import BookingConfirmation from '@/components/pages/booking/flights/confirmation'
import BookingPayment from '@/components/pages/booking/flights/payment'
import { useRouter } from 'next/router'

type WizardStep = 'details' | 'payment' | 'confirmation'

const BookingFlights = () => {
  const [activeStep, setActiveStep] = useState<WizardStep>('details')
  const router = useRouter()

  const handleNextStep = () => {
    if (activeStep === 'details') {
      setActiveStep('payment')
    } else if (activeStep === 'payment') {
      setActiveStep('confirmation')
    }
    
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handlePreviousStep = () => {
    if (activeStep === 'confirmation') {
      setActiveStep('payment')
    } else if (activeStep === 'payment') {
      setActiveStep('details')
    } else if (activeStep === 'details') {
      // Go back to flight search/selection
      router.push('/flights')
    }
    
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeStep])

  return (
    <main className="booking-hotel booking-flight">
      <BookingHeader current={activeStep} handlePreviousStep={handlePreviousStep} />
      {activeStep === 'details' && <BookingDetails handleNextStep={handleNextStep} />}
      {activeStep === 'payment' && <BookingPayment handleNextStep={handleNextStep} />}
      {activeStep === 'confirmation' && <BookingConfirmation />}
    </main>
  )
}

export default BookingFlights
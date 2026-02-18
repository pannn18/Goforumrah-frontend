import React, { useState } from 'react'
import BookingHeader from '@/pages/agent/booking/header'
import BookingDetails from '@/pages/agent/booking/hotels/details'
import BookingConfirmation from '@/pages/agent/booking/hotels/confirmation'
import BookingPayment from '@/pages/agent/booking/hotels/payment'

type WizardStep = 'details' | 'payment' | 'confirmation'

const BookingHotel = () => {
  const [activeStep, setActiveStep] = useState<WizardStep>('details')

  const handleNextStep = () => {
    const nextSteps = {
      'details': 'payment',
      'payment': 'confirmation'
    }

    const nextStep = nextSteps[activeStep]

    if (!nextStep) return

    setActiveStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handlePreviousStep = () => {
    const previousSteps = {
      'confirmation': 'payment',
      'payment': 'details'
    }

    const previousStep = previousSteps[activeStep]

    if (!previousStep) return

    setActiveStep(previousStep)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <main className="booking-hotel booking-hotel-agent">
      <BookingHeader current={activeStep} handlePreviousStep={handlePreviousStep} />
      {activeStep === 'details' && <BookingDetails handleNextStep={handleNextStep} />}
      {activeStep === 'payment' && <BookingPayment handleNextStep={handleNextStep} />}
      {activeStep === 'confirmation' && <BookingConfirmation />}
    </main>
  )
}

export default BookingHotel
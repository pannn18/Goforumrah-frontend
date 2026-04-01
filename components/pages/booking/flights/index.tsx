import React, { useState, useEffect } from 'react'
import BookingHeader from '@/components/pages/booking/header'
import BookingDetails from '@/components/pages/booking/flights/details'
import BookingConfirmation from '@/components/pages/booking/flights/confirmation'
import BookingPayment from '@/components/pages/booking/flights/payment'
import { useRouter } from 'next/router'
import { useFlightStore } from '@/lib/stores/flightStore'

type WizardStep = 'details' | 'payment' | 'confirmation'

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

const BookingFlights = () => {
  const [activeStep, setActiveStep] = useState<WizardStep>('details')
  const [passengerData, setPassengerData] = useState<PassengerData | null>(null)
  const router = useRouter()
  const { selectedFlight } = useFlightStore()

  const handleNextStep = (data?: PassengerData) => {
    if (activeStep === 'details') {
      if (data) setPassengerData(data)
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
      router.push('/flights')
    }
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeStep])

  return (
    <main className="booking-hotel booking-flight">
      <BookingHeader current={activeStep} handlePreviousStep={handlePreviousStep} />
      {activeStep === 'details' && (
        <BookingDetails handleNextStep={handleNextStep} />
      )}
      {activeStep === 'payment' && (
        <BookingPayment 
          handleNextStep={handleNextStep} 
          passengerData={passengerData}
          selectedFlight={selectedFlight}
        />
      )}
      {activeStep === 'confirmation' && <BookingConfirmation />}
    </main>
  )
}

export default BookingFlights
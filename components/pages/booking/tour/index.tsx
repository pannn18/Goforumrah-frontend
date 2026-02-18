import React, { useState } from 'react'
import { getEnumAsArray } from '@/lib/enumsHelper'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BookingHeader from '@/components/pages/booking/header'
import BookingDetails from '@/components/pages/booking/tour/details'
import BookingConfirmation from '@/components/pages/booking/tour/confirmation'
import BookingPayment from '@/components/pages/booking/tour/payment'
import { useRouter } from 'next/router'

type WizardStep = 'details' | 'payment' | 'confirmation'

interface TourProps {
  data: any;
}
const BookingTourPackage = (props: TourProps) => {
  const [activeStep, setActiveStep] = useState<WizardStep>('details')
  const { data } = props
  const [bookingDetailData, setBookingDetailData] = useState<any>(null); // State to store booking data
  const [bookingPaymentData, setBookingPaymentData] = useState<any>(null); // State to store booking data

  const router = useRouter()

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

    if (!previousStep) {
      if (activeStep === 'details') {
        router.push(`/tour/${data.id_tour_package}`)
      }
      return
    }

    setActiveStep(previousStep)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleDataSubmit = (formData: any) => {
    // This function is called when the child component (BookingDetails) submits the data
    // You can handle the data here or pass it to the next step (BookingPayment) as needed
    console.log('Form data submitted from BookingDetails : ', formData);

    // Set the bookingData state to the received formData
    setBookingDetailData(formData);

    // Move to the next step (BookingPayment)
    setActiveStep('payment');
  };

  return (
    <main className="booking-hotel booking-flight">
      <BookingHeader current={activeStep} handlePreviousStep={handlePreviousStep} />
      {activeStep === 'details' && <BookingDetails handleNextStep={handleNextStep} data={data} onDataSubmit={handleDataSubmit} />}
      {/* {activeStep === 'payment' && <BookingPayment handleNextStep={handleNextStep} data={data} />} */}
      {activeStep === 'confirmation' && <BookingConfirmation data={data} bookingDetailData={bookingDetailData} />}
    </main>
  )
}

export default BookingTourPackage
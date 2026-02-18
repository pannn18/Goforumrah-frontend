import React, { useState, useEffect } from 'react'
import { getEnumAsArray } from '@/lib/enumsHelper'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BookingHeader from '@/components/pages/booking/header'
import BookingDetails from '../checkout/details'
import BookingConfirmation from '../checkout/confirmation'
import BookingPayment from '../checkout/payment'
import { useRouter } from 'next/router'

type WizardStep = 'details' | 'payment' | 'confirmation'

interface HotelRoomProps {
  data: any;
}
const BookingHotel = (props: HotelRoomProps) => {
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
        router.push(`/loyalty`)
      }
      return
    }

    setActiveStep(previousStep)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }



  const handleDataSubmit = (formData: any) => {
    // This function is called when the child component (BookingDetails) submits the data
    // You can handle the data here or pass it to the next step (BookingPayment) as needed
    // console.log('Form data submitted from BookingDetails : ', formData);

    // Set the bookingData state to the received formData
    setBookingDetailData(formData);

    // Move to the next step (BookingPayment)
    setActiveStep('payment');
  };



  const handleDataPaymentSubmit = (formData: any) => {
    // This function is called when the child component (BookingDetails) submits the data
    // You can handle the data here or pass it to the next step (BookingPayment) as needed
    // console.log('Form data submitted from BookingPayment : ', formData);

    // Set the bookingData state to the received formData
    setBookingPaymentData(formData);

    // Move to the next step (BookingPayment)
    setActiveStep('confirmation');
  };

  // Add an effect to scroll to the top whenever activeStep changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeStep]); // This effect will trigger whenever activeStep changes


  // console.log(data)
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <main className="loyalty-checkout">
        {activeStep !== 'confirmation' && 
          <BookingHeader current={activeStep} handlePreviousStep={handlePreviousStep} />
        }
        {activeStep === 'details' && <BookingDetails handleNextStep={handleNextStep} onDataSubmit={handleDataSubmit} />}
        {activeStep === 'payment' && <BookingPayment handleNextStep={handleNextStep} data={data} bookingDetailData={bookingDetailData} onDataPaymentSubmit={handleDataPaymentSubmit} />}
        {activeStep === 'confirmation' && <BookingConfirmation data={data} bookingDetailData={bookingDetailData} bookingPaymentData={bookingPaymentData} />}
      </main>
    </Layout>
  )
}

export default BookingHotel
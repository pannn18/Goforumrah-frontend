import React, { useState, useEffect } from 'react'
import { callAPI } from '@/lib/axiosHelper'
import { useRouter } from 'next/router'
import BookingHeader from '@/components/pages/booking/header'
import BookingDetails from '@/components/pages/booking/book-transfer/details'
import BookingConfirmation from '@/components/pages/booking/book-transfer/confirmation'
import BookingPayment from '@/components/pages/booking/book-transfer/payment'

type WizardStep = 'details' | 'payment' | 'confirmation'

interface BookingCarProps {
  data: any;
}

const BookingCar = (props: BookingCarProps) => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<WizardStep>('details')
  const { data } = props
  const [bookingDetailData, setBookingDetailData] = useState<any>(null); // State to store booking data
  const [bookingPaymentData, setBookingPaymentData] = useState<any>(null); // State to store payment data

  const [fetchedData, setFetchedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id : id_car_business_fleet, checkin, checkout} = router.query;
  console.log("id_car_business_fleet : ", id_car_business_fleet);
  console.log("checkin : ", checkin);
  console.log("checkout : ", checkout);

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
  

  const handleDataSubmit = (formData: any) => {
    // This function is called when the child component (BookingDetails) submits the data
    // You can handle the data here or pass it to the next step (BookingPayment) as needed
    console.log('Form data submitted from BookingDetails : ', formData);

    // Set the bookingData state to the received formData
    setBookingDetailData(formData);

    // Move to the next step (BookingPayment)
    setActiveStep('payment');
  };

  const handleDataPaymentSubmit = (formData: any) => {
    // This function is called when the child component (BookingDetails) submits the data
    // You can handle the data here or pass it to the next step (BookingPayment) as needed
    console.log('Form data submitted from BookingPayment : ', formData);

    // Set the bookingData state to the received formData
    setBookingPaymentData(formData);

    // Move to the next step (BookingPayment)
    setActiveStep('confirmation');
  };

  // Add an effect to scroll to the top whenever activeStep changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [activeStep]); // This effect will trigger whenever activeStep changes


  const handlePreviousStep = () => {
    const previousSteps = {
      'confirmation': 'payment',
      'payment': 'details'
    }

    const previousStep = previousSteps[activeStep]

    // if (!previousStep) {
    //   if (activeStep === 'details') {
    //     router.push(`/car/detail?id=${data.id_hotel}`)
    //   }
    //   return
    // }

    setActiveStep(previousStep)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  

  useEffect(() => {
    if(fetchedData) return
    const fetchData = async () => {
      const payload = {
        id_car_business_fleet: id_car_business_fleet,
        pickup_date_time: checkin,
        dropoff_date_time: checkout,
      };
      try {
        const { status, data, ok, error } = await callAPI('/car-business-booking/car-details', 'POST', payload, true);
        console.log(status, data, ok, error);
        setFetchedData(data)
        setLoading(false)
      } catch (error) {
        return {
          notFound: true,
        };
      }
    }

    fetchData();
  }, [id_car_business_fleet, checkin, checkout]); // Trigger the fetch when the currentPage changes

  console.log("Components Pages Booking Book Transfer", fetchedData)

  return (
    <main className="booking-hotel">
      <BookingHeader current={activeStep} handlePreviousStep={handlePreviousStep} />
      {activeStep === 'details' && <BookingDetails handleNextStep={handleNextStep} data={fetchedData} onDataSubmit={handleDataSubmit} bookingDetailData={bookingDetailData}  />}
      {activeStep === 'payment' && <BookingPayment handleNextStep={handleNextStep} data={fetchedData} bookingDetailData={bookingDetailData} onDataPaymentSubmit={handleDataPaymentSubmit} />}
      {activeStep === 'confirmation' && <BookingConfirmation data={fetchedData} bookingDetailData={bookingDetailData} bookingPaymentData={bookingPaymentData}/>}
    </main>
  )
}

export default BookingCar
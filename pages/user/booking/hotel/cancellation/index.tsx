import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import Link from 'next/link'
import { Icons, Images } from '@/types/enums'
import Layout from '@/components/layout'
import UserLayout from '@/components/user/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import ManageCardList from '@/components/pages/manage/manageCard'
import airlineEmiratesAirways from '@/assets/images/airline_partner_emirates.png'
import sheratonHotel from '@/assets/images/hotel_details_imagery_1.png'
import LoadingOverlay from "@/components/loadingOverlay"

type WizardStep = 'reason' | 'confirm'
interface IProps {
  handleNextStep: () => void
  personalAndHotelData: any
}
interface ReasonProps {
  handleNextStep: () => void
  personalAndHotelData: any
  onReasonCancellationChange: (selectedReason: string) => void // Add this line
}
interface ConfirmModalProps {
  personalAndHotelData: any
  reasonCancellation: string
}

export default function Home() {
  const [activeStep, setActiveStep] = useState<WizardStep>('reason')
  const { data: session, status } = useSession()
  const router = useRouter()
  const id_hotel_booking = router.query?.id_booking;
  const id_customer = session?.user.id;
  console.log("id_hotel_booking : ", id_hotel_booking)
  console.log("id_customer : ", id_customer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);
  const [reasonCancellation, setReasonCancellation] = useState(null);

  // Define a state to hold the merged data
  const [personalAndHotelData, setPersonalAndHotelData] = useState(null);

  useEffect(() => {
    if (!id_customer || !id_hotel_booking) return;

    // Check if personalData or hotelData is already available
    if (personalData || hotelData) return;

    const fetchPersonalData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/customer/personal/show', 'POST', { id_customer: id_customer }, true);
        setPersonalData(data);
        setPersonalLoading(false);
      } catch (error) {
        setPersonalError(error);
        setPersonalLoading(false);
      }
    };

    const fetchHotelData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/hotel-booking/detail', 'POST', { id_hotel_booking: id_hotel_booking }, true);
        setHotelData(data);
        setHotelLoading(false);
      } catch (error) {
        setHotelError(error);
        setHotelLoading(false);
      }
    };

    fetchPersonalData();
    fetchHotelData();
  }, [id_customer, id_hotel_booking]);

  // Combine personalData and hotelData when both are available
  useEffect(() => {
    // Check if personalAndHotelData is already available
    if (personalAndHotelData) return;

    if (personalData && hotelData) {
      const mergedData = {
        personalData: personalData,
        hotelData: hotelData
      };
      setPersonalAndHotelData(mergedData);
    }
  }, [personalData, hotelData]);

  if (personalLoading || hotelLoading) {
    return <LoadingOverlay />;
  }

  if (personalError || hotelError) {
    return <div>Error Fetching Data</div>;
  }

  const handleNextStep = () => {
    const nextSteps = {
      'reason': 'confirm'
    }

    const nextStep = nextSteps[activeStep]

    if (!nextStep) return

    setActiveStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handlePreviousStep = () => {
    const previousSteps = {
      'confirm': 'reason'
    }

    const previousStep = previousSteps[activeStep]

    if (!previousStep) return

    setActiveStep(previousStep)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const handleReasonCancellationChange = (selectedReason) => {
    setReasonCancellation(selectedReason);
    console.log("reasonCancellation : ", selectedReason)
  };

  const reasonBreadcrumb = [
    { text: 'My Booking', url: '/user', category: 'hotel' },
    { text: personalAndHotelData?.hotelData?.hotel?.property_name, url: `/user/booking/hotel/${personalAndHotelData?.hotelData?.id_hotel_booking}` },
    { text: 'Cancel booking' },
  ];

  const confirmBreadcrumb = [
    { text: 'My Booking', url: '/user', category: 'hotel' },
    { text: personalAndHotelData?.hotelData?.hotel?.property_name, url: `/user/booking/hotel/${personalAndHotelData?.hotelData?.id_hotel_booking}` },
    { text: 'Cancel booking', url: '/user' },
    { text: 'Confirm Cancellation' },
  ];

  const breadcrumbArray = activeStep === 'reason' ? reasonBreadcrumb : confirmBreadcrumb;

  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <UserLayout activeMenu='booking' header={{ title: 'Cancel Booking', url: '/user' }} breadcrumb={breadcrumbArray}>
          <div className="search-hotel__wrapper">
            <div className="cancelation__list">
              {activeStep === 'reason' && <Reason personalAndHotelData={personalAndHotelData} handleNextStep={handleNextStep} onReasonCancellationChange={handleReasonCancellationChange} />}
              {activeStep === 'confirm' && <Confirm personalAndHotelData={personalAndHotelData} handleNextStep={handleNextStep} />}
            </div>
          </div>
        </UserLayout>
        <Footer />
        {activeStep === 'confirm' && <ConfirmModal personalAndHotelData={personalAndHotelData} reasonCancellation={reasonCancellation} />}
      </Layout>
    </>
  )
}

const Reason = (props: ReasonProps) => {
  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;
  const [selectedReason, setSelectedReason] = useState(null);

  const handleReasonChange = (event) => {
    const selectedReason = event.target.value;
    setSelectedReason(selectedReason);
    props.onReasonCancellationChange(selectedReason); // Call the callback function
  };

  return (
    <>
      <form action="#" className="cancelation__card cancelation__reason">
        <div className="cancelation__card-header">
          <h5>Reason for cancelling</h5>
          <p className="cancelation__card-subtitle">We can find alternative solution if you need to make changes to your booking</p>
        </div>
        <div>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonFlight">
            <p className="form-check-label--reason">Airlines changing flight schedules</p>
            <input type="radio" name="cancelReason" id="cancelReasonFlight" className="form-check-input cancelation__reason-input" value={"Airlines changing flight schedules"}
              checked={selectedReason === "Airlines changing flight schedules"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonVirus">
            <p className="form-check-label--reason">Due to the Corona virus pandemic</p>
            <input type="radio" name="cancelReason" id="cancelReasonVirus" className="form-check-input cancelation__reason-input" value={"Due to the Corona virus pandemic"}
              checked={selectedReason === "Due to the Corona virus pandemic"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonAccidental">
            <p className="form-check-label--reason">Accidentally placed an order</p>
            <input type="radio" name="cancelReason" id="cancelReasonAccidental" className="form-check-input cancelation__reason-input" value={"Accidentally placed an order"}
              checked={selectedReason === "Accidentally placed an order"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonDate">
            <p className="form-check-label--reason">Wrong date</p>
            <input type="radio" name="cancelReason" id="cancelReasonDate" className="form-check-input cancelation__reason-input" value={"Wrong date"}
              checked={selectedReason === "Wrong date"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonPersonal">
            <p className="form-check-label--reason">Personal reasons</p>
            <input type="radio" name="cancelReason" id="cancelReasonPersonal" className="form-check-input cancelation__reason-input" value={"Personal reasons"}
              checked={selectedReason === "Personal reasons"}
              onChange={handleReasonChange} />
          </label>
        </div>
        <div className="cancelation__card-footer">
          <Link href={`/user/booking/hotel/${hotelData?.id_hotel_booking}`} className="btn btn-lg btn-outline-success">Keep this booking</Link>
          <button onClick={props.handleNextStep} className="btn btn-lg btn-success">Continue</button>
        </div>
      </form>
    </>
  )
}

const Confirm = (props: IProps) => {
  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;
  return (
    <>
      <form action="#" className="cancelation__card cancelation__reason">
        <div className="cancelation__card-header">
          <h5>Confirm cancellation</h5>
          <p className="cancelation__card-subtitle">You are about to cancel your entire booking . Please review the details belom before cancelling</p>
        </div>
        <div className="cancelation__confirm-preview">
          <p className="cancelation__confirm-title">Hotel preview</p>
          <div className="cancelation__confirm-wrapper">
            <div className="cancelation__confirm-preview-image cancelation__confirm-preview-image--hotel">
              <BlurPlaceholderImage src={hotelData?.hotel?.hotel_photo[0]?.photo} alt="Flight Logo" width={92} height={92} />
            </div>
            <div className="cancelation__confirm-preview-text">
              <p className="cancelation__confirm-preview-name">{hotelData?.hotel?.property_name}</p>
              <p className="cancelation__confirm-preview-detail">{hotelData?.hotel_layout?.room_type}</p>
              <div className="cancelation__confirm-preview-information">
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Sun} width={20} height={20} />
                  <p>{Math.ceil(Number(new Date(hotelData?.checkout)) - Number(new Date(hotelData?.checkin))) / (1000 * 60 * 60 * 24)} Day</p>
                </div>
                <div className="cancelation__confirm-preview-dot"></div>
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p>{hotelData?.hotel_layout?.guest_count} guest</p>
                </div>
              </div>
            </div>
            <button className="cancelation__confirm-preview-button">Free cancellation</button>
          </div>
        </div>
        <div className="cancelation__confirm-bill cancelation__confirm-bill--text">
          <p>Your booking</p>
          <p>$ {hotelData?.hotel_layout?.price}</p>
        </div>
        <div className="cancelation__confirm-bill cancelation__confirm-bill--text">
          <p>Cancellation fee</p>
          <p>$ 0</p>
        </div>
        <div className="cancelation__confirm-bill cancelation__confirm-bill--bold">
          <p>You will be charged</p>
          <p>$ 0</p>
        </div>
        <div className="cancelation__card-footer">
          <button type='button' className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Continue</button>
        </div>
      </form>
    </>
  )
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const router = useRouter(); // Initialize useRouter
  const personalData = props.personalAndHotelData?.personalData;
  const hotelData = props.personalAndHotelData?.hotelData;
  const reasonCancellation = props.reasonCancellation;

  console.log("personalData : ", personalData)
  console.log("hotelData : ", hotelData)
  console.log("reasonCancellation : ", reasonCancellation)

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const payload = {
      id_hotel_booking: hotelData?.id_hotel_booking,
      note: reasonCancellation
    }

    console.log("payload : ", payload)

    const { status, data, ok, error } = await callAPI('/hotel-booking/cancel', 'POST', payload, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit detail booking store   ", status, data, ok, error);
      router.push(`/user/booking/hotel/cancellation/done?id_booking=${hotelData?.id_hotel_booking}`);
    } else {
      console.log("fail to handle submit post api detail booking store   ", status, data, ok, error);
    }
  };
  return (
    <>
      <div className="modal fade" id="confirmationModal" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal">
          <div className="modal-content cancelation__modal-body">
            <div className="cancelation__modal-content">
              <div className="cancelation__modal-image">
                <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
              </div>
              <div className="cancelation__modal-text">
                <h3>Do you want to proceed with the cancellation ?</h3>
                <p className="cancelation__modal-desc">Once a request has been submitted, you cannot change or add it again</p>
              </div>
            </div>
            <div className="cancelation__modal-footer">
              <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
              <button className="btn btn-lg btn-success cancelation__modal-button" data-bs-dismiss="modal" onClick={handleSubmit}>Request to cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
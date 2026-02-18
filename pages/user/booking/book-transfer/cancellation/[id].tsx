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
import carMarcedesBenz from '@/assets/images/search_transfer_car_image.png'
import LoadingOverlay from '@/components/loadingOverlay'

type WizardStep = 'reason' | 'confirm'
interface IProps {
  handleNextStep: () => void
  personalAndCarData: any
}
interface ReasonProps {
  handleNextStep: () => void
  personalAndCarData: any
  onReasonCancellationChange: (selectedReason: string) => void // Add this line
}
interface ConfirmModalProps {
  personalAndCarData: any
  reasonCancellation: string
}

const Home = (props) => {
  const [activeStep, setActiveStep] = useState<WizardStep>('reason')
  const router = useRouter()
  const { data: session, status } = useSession()
  const idCarBooking = props.id;
  const idCustomer = session?.user.id;
  console.log("idCarBooking : ", idCarBooking)
  console.log("idCustomer : ", idCustomer)

  //Retrive Data from API
  const [personalData, setPersonalData] = useState(null);
  const [personalLoading, setPersonalLoading] = useState(true);
  const [personalError, setPersonalError] = useState(null);
  const [carData, setCarData] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState(null);
  const [reasonCancellation, setReasonCancellation] = useState(null);

  // Define a state to hold the merged data
  const [personalAndCarData, setPersonalAndCarData] = useState(null);


  useEffect(() => {
    if (!idCustomer || !idCarBooking) return

    // Check if personalData or carData is already available
    if (personalData || carData) return;

    const fetchPersonalData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/customer/personal/show', 'POST', { id_customer: idCustomer }, true);
        setPersonalData(data);
        setPersonalLoading(false);
      } catch (error) {
        setPersonalError(error);
        setPersonalLoading(false);
      }
    };

    const fetchCarData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/car-business-booking/show-booking', 'POST', { id_car_booking: idCarBooking, id_customer: idCustomer }, true);
        setCarData(data);
        setCarLoading(false);
      } catch (error) {
        setCarError(error);
        setCarLoading(false);
      }
    };

    fetchPersonalData();
    fetchCarData();
  }, [idCustomer, idCarBooking, session]);

  // Combine personalData and carData when both are available
  useEffect(() => {
    // Check if personalAndCarData is already available
    if (personalAndCarData) return;

    if (personalData && carData) {
      const mergedData = {
        personalData: personalData,
        carData: carData,
        idCarBooking: idCarBooking
      };
      setPersonalAndCarData(mergedData);
    }
  }, [personalData, carData]);

  if (personalLoading || carLoading) {
    return <LoadingOverlay />
  }

  if (personalError || carError) {
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
    { text: 'My Booking', url: '/user', category: 'car' },
    { text: `${personalAndCarData?.carData[0]?.car_brand} ${personalAndCarData?.carData[0]?.edition}`, url: `/user/booking/book-transfer/${idCarBooking}` },
    { text: 'Cancel booking' },
  ];

  const confirmBreadcrumb = [
    { text: 'My Booking', url: '/user', category: 'car' },
    { text: `${personalAndCarData?.carData[0]?.car_brand} ${personalAndCarData?.carData[0]?.edition}`, url: `/user/booking/hotel/${personalAndCarData?.carData?.id_hotel_booking}` },
    { text: 'Cancel booking', url: '/user' },
    { text: 'Confirm Cancellation' },
  ];

  const breadcrumbArray = activeStep === 'reason' ? reasonBreadcrumb : confirmBreadcrumb;

  console.log("personalAndCarData : ", personalAndCarData)
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <UserLayout activeMenu='booking' header={{ title: 'Cancel Booking', url: '/user' }} breadcrumb={breadcrumbArray}>
          <div className="search-hotel__wrapper">
            <div className="cancelation__list">
              {activeStep === 'reason' && <Reason personalAndCarData={personalAndCarData} handleNextStep={handleNextStep} onReasonCancellationChange={handleReasonCancellationChange} idCarBooking={idCarBooking} />}
              {activeStep === 'confirm' && <Confirm personalAndCarData={personalAndCarData} handleNextStep={handleNextStep} idCarBooking={idCarBooking} />}
            </div>
          </div>
        </UserLayout>
        <Footer />
        {activeStep === 'confirm' && <ConfirmModal personalAndCarData={personalAndCarData} reasonCancellation={reasonCancellation} idCarBooking={idCarBooking} />}
      </Layout>
    </>
  )
}

const Reason = (props) => {
  const personalData = props.personalAndCarData?.personalData;
  const carData = props.personalAndCarData?.carData;
  const [selectedReason, setSelectedReason] = useState(null);

  const handleReasonChange = (event) => {
    const selectedReason = event.target.value;
    setSelectedReason(selectedReason);
    props.onReasonCancellationChange(selectedReason); // Call the callback function
  };

  return (
    <>
      <div className="cancelation__card cancelation__reason">
        <div className="cancelation__card-header">
          <h5>Reason for cancelling</h5>
          <p className="cancelation__card-subtitle">We can find alternative solution if you need to make changes to your booking</p>
        </div>
        <div>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonFlight">
            <p className="form-check-label">Changing the rental schedule</p>
            <input type="radio" name="cancelReason" id="cancelReasonFlight" className="form-check-input cancelation__reason-input" defaultChecked value={"Changing the rental schedule"}
              checked={selectedReason === "Changing the rental schedule"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonVirus">
            <p className="form-check-label">Want to change to a bigger car</p>
            <input type="radio" name="cancelReason" id="cancelReasonVirus" className="form-check-input cancelation__reason-input" value={"Want to change to a bigger car"}
              checked={selectedReason === "Want to change to a bigger car"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonAccidental">
            <p className="form-check-label">Accidentally placed an order</p>
            <input type="radio" name="cancelReason" id="cancelReasonAccidental" className="form-check-input cancelation__reason-input" value={"Accidentally placed an order"}
              checked={selectedReason === "Accidentally placed an order"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonDate">
            <p className="form-check-label">Wrong date</p>
            <input type="radio" name="cancelReason" id="cancelReasonDate" className="form-check-input cancelation__reason-input" value={"Wrong date"}
              checked={selectedReason === "Wrong date"}
              onChange={handleReasonChange} />
          </label>
          <label className="cancelation__reason-option form-check" htmlFor="cancelReasonPersonal">
            <p className="form-check-label">Personal reasons</p>
            <input type="radio" name="cancelReason" id="cancelReasonPersonal" className="form-check-input cancelation__reason-input" value={"Personal reasons"}
              checked={selectedReason === "Personal reasons"}
              onChange={handleReasonChange} />
          </label>
        </div>
        <div className="cancelation__card-footer">
          <Link href={`/user/booking/book-transfer/${props?.idCarBooking}`} className="btn btn-lg btn-outline-success">Keep this booking</Link>
          <button onClick={props.handleNextStep} className="btn btn-lg btn-success">Continue</button>
        </div>
      </div>
    </>
  )
}



const Confirm = (props) => {
  const personalData = props.personalAndCarData?.personalData;
  const carData = props.personalAndCarData?.carData;
  return (
    <>
      <div className="cancelation__card cancelation__reason">
        <div className="cancelation__card-header">
          <h5>Confirm cancellation</h5>
          <p className="cancelation__card-subtitle">You are about to cancel your entire booking . Please review the details belom before cancelling</p>
        </div>
        <div className="cancelation__confirm-preview">
          <p className="cancelation__confirm-title">Car preview</p>
          <div className="cancelation__confirm-wrapper">
            <div className="cancelation__confirm-preview-image cancelation__confirm-preview-image--hotel">
              <BlurPlaceholderImage src={carMarcedesBenz} alt="Flight Logo" width={128} height={100} />
            </div>
            <div className="cancelation__confirm-preview-text">
              <p className="cancelation__confirm-preview-name">{props.personalAndCarData?.carData[0]?.car_brand} {props.personalAndCarData?.carData[0]?.edition}</p>
              <div className="cancelation__confirm-preview-brand">
                <BlurPlaceholderImage className="cancelation__confirm-preview-logo" src={Images.Placeholder} alt="Car Brand" width={24} height={24} />
                <p className="cancelation__confirm-preview-detail">Green Motion Rental</p>
              </div>
              <div className="cancelation__confirm-preview-information">
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Sun} width={20} height={20} />
                  <p>{props.personalAndCarData?.carData[0]?.total_day_for_rent} Day</p>
                </div>
                <div className="cancelation__confirm-preview-dot"></div>
                <div className="cancelation__confirm-preview-information">
                  <SVGIcon src={Icons.Car} width={20} height={20} />
                  <p>4 door, {props.personalAndCarData?.carData[0]?.quantity} seat</p>
                </div>
              </div>
            </div>
            <button className="cancelation__confirm-preview-button">Free cancellation</button>
          </div>
        </div>
        <div className="cancelation__confirm-bill cancelation__confirm-bill--text">
          <p>Your booking</p>
          <p>$ {props.personalAndCarData?.carData[0]?.price}</p>
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
          <button className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#confirmationModal">Continue</button>
        </div>
      </div>
    </>
  )
}
const ConfirmModal = (props) => {
  const router = useRouter(); // Initialize useRouter
  const personalData = props.personalAndCarData?.personalData;
  const carData = props.personalAndCarData?.carData;
  const reasonCancellation = props.reasonCancellation;

  console.log("personalData : ", personalData)
  console.log("carData : ", carData)
  console.log("reasonCancellation : ", reasonCancellation)

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const payload = {
      id_car_booking: props?.idCarBooking,
      note: reasonCancellation
    }

    console.log("payload : ", payload)

    const { status, data, ok, error } = await callAPI('/car-business-booking/cancel', 'POST', payload, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit cancel booking store   ", status, data, ok, error);
      router.push(`/user/booking/book-transfer/cancellation/done/${props?.idCarBooking}`);
    } else {
      console.log("fail to handle submit post api cancel booking store   ", status, data, ok, error);
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



export async function getServerSideProps(context) {
  const { params } = context;
  const id = params.id;

  // Fetch data based on the id here
  // For example, you can fetch data from a database

  return {
    props: {
      id,
      // Add other data fetched based on the id
    },
  };
}


export default Home
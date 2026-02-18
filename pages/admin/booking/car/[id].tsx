import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { callAPI } from '@/lib/axiosHelper'
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from '@/components/elements/images'
import iconCheck from 'assets/images/icon_check_soft.svg'
import iconSuspended from 'assets/images/icon_suspended_soft.svg'
import iconCancel from 'assets/images/icon_cancel_soft.svg'
import LoadingOverlay from "@/components/loadingOverlay"

const BookingCarDetails = (props) => {

  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);

  const router = useRouter()
  const { id } = router.query;
  const id_car_booking = props.id ?? id;

  //Retrive Data from API
  const [carData, setCarData] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState(null);

  useEffect(() => {
    if (!id_car_booking) return

    // Check if personalData or hotelData is already available
    if (carData) return;

    const fetchCarData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-car-booking/booking-details', 'POST', { id_car_booking: id_car_booking }, true);
        setCarData(data);
        data?.booking_details?.status === 6 && setIsComplete(true);
        data?.booking_details?.status === 5 && setIsSuspended(true);
        data?.booking_details?.status === 4 && setIsCanceled(true);
        setCarLoading(false);
      } catch (error) {
        setCarError(error);
        setCarLoading(false);
      }
    };

    fetchCarData();
  }, [id_car_booking]);


  if (carLoading) {
    return <LoadingOverlay />;
  }

  if (carError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("data : ", carData)

  return (
    <Layout>
      <AdminLayout pageTitle="Booking Details" enableBack={true}>
        <div className="container admin-booking-car-details__container">
          {isComplete && <BannerComplete />}
          {isSuspended && <BannerSuspended />}
          {isCanceled && <BannerCanceled />}
          <div className="admin-booking-car-details">
            <MainSection carData={carData} />
            <CarAdditionalDetailsSummary carData={carData} isComplete={isComplete} isSuspended={isSuspended} isCanceled={isCanceled} />
          </div>
        </div>
      </AdminLayout>
      <PopupComplete carData={carData} handleComplete={() => { setIsComplete(true); setIsSuspended(false); setIsCanceled(false); }} />
      <PopupSuspend carData={carData} handleSuspended={() => { setIsSuspended(true); setIsComplete(false); setIsCanceled(false); }} />
      <PopupCancel carData={carData} handleCanceled={() => { setIsCanceled(true); setIsSuspended(false); setIsComplete(false); }} />
      <PopupNote carData={carData} />
    </Layout>


  )
}

const MainSection = (props) => {
  const { carData } = props
  function formatDate(inputDate) {
    // Parse the input date string
    const parsedDate = new Date(inputDate);

    // Create an array of month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    // Create an array of day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Get the day, month, year, and day of the week
    const day = dayNames[parsedDate.getDay()];
    const date = parsedDate.getDate();
    const month = monthNames[parsedDate.getMonth()];
    const year = parsedDate.getFullYear() % 100; // Get the last two digits of the year

    // Format the date in the desired format
    const formattedDate = `${day}, ${date} ${month} ${year}`;

    return formattedDate;
  }

  function formatTime(inputDateTime) {
    // Parse the input date and time string
    const parsedDateTime = new Date(inputDateTime);

    // Get hours and minutes
    const hours = parsedDateTime.getHours().toString().padStart(2, '0');
    const minutes = parsedDateTime.getMinutes().toString().padStart(2, '0');

    // Format the time in the desired format
    const formattedTime = `${hours}:${minutes}`;

    return formattedTime;
  }
  return (
    <div className="admin-booking-car-details__content-wrapper">
      <div className="admin-booking-car-details__content">
        <div className="admin-booking-car-details__content-top">
          <img className="admin-booking-car-details__content-top-image" src={carData.booking_details.photo ? carData.booking_details.photo : Images.Placeholder} alt="Review Image" width={191} height={160} />
          <div className="admin-booking-car-details__content-top-wrapper">
            <div className="admin-booking-car-details__content-top-header">
              <div className="admin-booking-car-details__content-top-header-value">
                <p className="admin-booking-car-details__content-top-header-value--number">#{carData?.booking_details?.id_car_booking}</p>
                <h5 className="admin-booking-car-details__content-top-header-value--name">{carData?.booking_details?.car_brand} {carData?.booking_details?.model} {carData?.booking_details?.edition}</h5>
                <p className="admin-booking-car-details__content-top-header-value--type">Twin Room (Standard)</p>
              </div>
            </div>
            <div className="admin-booking-car-details__content-top-desc">
              <div className="admin-booking-car-details__content-top-desc-item">
                <p className="admin-booking-car-details__content-top-desc-item">Duration</p>
                <div className="admin-booking-car-details__content-top-desc-info">
                  <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                  <p className="admin-booking-car-details__content-top-desc-info">{carData?.booking_details?.total_day_for_rent} day</p>
                </div>
              </div>
              <div className="admin-booking-car-details__content-top-desc-item">
                <p className="admin-booking-car-details__content-top-desc-item">Car Specs</p>
                <div className="admin-booking-car-details__content-top-desc-info">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p className="admin-booking-car-details__content-top-desc-info">{carData?.booking_details?.quantity} Guest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-booking-car-details__separator"></div>
        <div className="admin-booking-car-details__content-date">
          <div className="admin-booking-car-details__content-date-item">
            <div className="admin-booking-car-details__content-date-icon">
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
            </div>
            <div className="admin-booking-car-details__content-date-value">
              <p>Pickup</p>
              <div className="admin-booking-car-details__content-date-value-wrapper">
                <div className="admin-booking-car-details__content-date-value-detail">
                  <p className="admin-booking-car-details__content-date-value-detail--date">{formatDate(carData?.booking_details?.pickup_date_time)}</p>
                  <p className="admin-booking-car-details__content-date-value-detail--time">({formatTime(carData?.booking_details?.pickup_date_time)})</p>
                </div>
                <p className="admin-booking-car-details__content-date-value-detail--location">{carData?.booking_details?.pickup}</p>
              </div>
            </div>
          </div>
          <div className="admin-booking-car-details__content-date-item">
            <div className="admin-booking-car-details__content-date-icon">
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
            </div>
            <div className="admin-booking-car-details__content-date-value">
              <p>Dropoff</p>
              <div className="admin-booking-car-details__content-date-value-detail">
                <p className="admin-booking-car-details__content-date-value-detail--date">{formatDate(carData?.booking_details?.dropoff_date_time)}</p>
                <p className="admin-booking-car-details__content-date-value-detail--time">({formatTime(carData?.booking_details?.dropoff_date_time)})</p>
              </div>
              <p className="admin-booking-car-details__content-date-value-detail--location">{carData?.booking_details?.dropoff}</p>
            </div>
          </div>
        </div>
        <div className="admin-booking-car-details__separator"></div>
        <div className="admin-booking-car-details__content-location">
          <p className="admin-booking-car-details__content-top-desc-item">Location</p>
          <div className="admin-booking-car-details__content-location-wrap">
            <div className="admin-booking-car-details__content-location-item">
              <p className="admin-booking-car-details__content-date-value-detail--date">{carData?.booking_details?.location_name}</p>
              <div className="admin-booking-car-details__content-location-desc">
                <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                <p>{carData?.booking_details?.address_line}</p>
              </div>
            </div>
            <a className="admin-booking-car-details__content-location-action-btn btn btn-sm btn-outline-success">
              <SVGIcon src={Icons.MapPin} width={18} height={18} />
              Show Map
            </a>
          </div>
        </div>
        <div className="admin-booking-car-details__content-information">
          <p className="admin-booking-car-details__content-information-value">Additional Information</p>
          <p>{carData?.booking_details?.note}</p>
        </div>
      </div>
      <div className="admin-booking-car-details__content-bottom">
        <h5>Detail Payment</h5>
        <div className="admin-booking-car-details__separator"></div>
        <div className="admin-booking-car-details__content-bottom-total">
          <p className="admin-booking-car-details__content-bottom-total-desc">Total Payment</p>
          <h5>$ {carData?.booking_details?.total_price}</h5>
        </div>
        <a className="admin-booking-car-details__content-bottom-link">Show More</a>
      </div>
    </div>
  )
}

const CarAdditionalDetailsSummary = ({ carData, isComplete, isSuspended, isCanceled }: { carData: any, isComplete: boolean, isSuspended: boolean, isCanceled: boolean }) => {

  return (
    <div className="admin-booking-car-details__summary">
      {(!isComplete && !isSuspended && !isCanceled) && (
        <div className="admin-booking-car-details__summary-action">
          <button type="button" className="admin-booking-hotel-details__summary-action btn btn-md btn-success" data-bs-toggle="modal" data-bs-target="#popUpComplete">
            <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
            Complete
          </button>
          <button type="button" className="admin-booking-hotel-details__summary-action btn btn-md btn-warning" data-bs-toggle="modal" data-bs-target="#popUpSuspend">
            <SVGIcon src={Icons.Disabled} width={20} height={20} />
            Pending
          </button>
          <button type="button" className="admin-booking-hotel-details__summary-action btn btn-md btn-danger" data-bs-toggle="modal" data-bs-target="#popUpCancel">
            <SVGIcon src={Icons.Cancel} width={20} height={20} />
            Cancel
          </button>
        </div>
      )}
      <div className="admin-booking-car-details__summary-box">
        <div className="admin-booking-car-details__summary-row">
          <h5>Customer</h5>
          <a className="admin-booking-car-details__summary-row-link">See details</a>
        </div>
        <div className="admin-booking-car-details__summary-content">
          <div className="admin-booking-car-details__summary-content-rounded">
            <BlurPlaceholderImage className="img" src={carData?.customer?.profile_photo ? carData?.customer?.profile_photo : Images.Placeholder} alt="" width={64} height={64} />
          </div>
          <div className="admin-booking-car-details__summary-content-wrapper">
            <p className="admin-booking-car-details__summary-content-desc admin-booking-car-details__summary-content-desc--value">{carData?.customer?.fullname}</p>
            <p className="admin-booking-car-details__summary-content-desc">{carData?.customer?.email}</p>
            <p className="admin-booking-car-details__summary-content-desc">{carData?.customer?.phone}</p>
          </div>
        </div>
      </div>
      <div className="admin-booking-car-details__summary-box">
        <div className="admin-booking-car-details__summary-row">
          <h5>Business Car</h5>
          <a className="admin-booking-car-details__summary-row-link">See details</a>
        </div>
        <div className="admin-booking-car-details__summary-content">
          <div className="admin-booking-car-details__summary-content-rounded">
            <BlurPlaceholderImage className="img" src={carData?.car_business?.profile_icon ? carData?.car_business?.profile_icon : Images.Placeholder} alt="" width={64} height={64} />
          </div>
          <div className="admin-booking-car-details__summary-content-wrapper">
            <p className="admin-booking-car-details__summary-content-desc admin-booking-car-details__summary-content-desc--value">{carData?.car_business?.company_name}</p>
            <p className="admin-booking-car-details__summary-content-desc">{carData?.car_business?.email}</p>
            <p className="admin-booking-car-details__summary-content-desc">{carData?.car_business?.phone}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const PopupComplete = ({ carData, handleComplete }: { carData: any, handleComplete: () => void }) => {

  const [formData, setFormData] = useState({
    "id_car_booking": carData?.booking_details?.id_car_booking,
    "status": 6,
    "note": "",
    "soft_deleted": 0
  });

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/admin-car-booking/update-status', 'POST', formData, true)
    if (ok) {
      console.log("success api handle submit update status completed ", status, data, ok, error);
      handleComplete();
    } else {
      console.log("fail to handle submit post api update status completed ", status, data, ok, error);
    }
  };

  return (
    <>
      <div className="modal fade" id="popUpComplete" tabIndex={-1} aria-labelledby="popUpCompleteLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal admin-customer__modal-block">
          <div className="modal-content admin-customer__add-modal-content">
            <div className="admin-booking-hotel__popup-form">
              <div className="admin-booking-hotel__popup-form-content">
                <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                <div className="admin-booking-hotel__popup-contents">
                  <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">Complete this Booking ?</h3>
                  <p className="admin-booking-hotel__content-caption--popup">You want to mark this booking that the customer has checked-in</p>
                </div>
              </div>
              <div className="admin-booking-hotel__popup-footer">
                <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item' data-bs-dismiss="modal">Cancel</button>
                <button type='button' onClick={handleSubmit} className='btn btn-md btn-success' data-bs-dismiss="modal">Yes, Complete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const PopupSuspend = ({ carData, handleSuspended }: { carData: any, handleSuspended: () => void }) => {

  const [formData, setFormData] = useState({
    "id_car_booking": carData?.booking_details?.id_car_booking,
    "status": 5,
    "note": "",
    "soft_deleted": 0
  });

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      note: event.target.value // Update the 'note' property in formData
    });
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/admin-car-booking/update-status', 'POST', formData, true)
    if (ok) {
      console.log("success api handle submit update status completed ", status, data, ok, error);
      handleSuspended();
    } else {
      console.log("fail to handle submit post api update status completed ", status, data, ok, error);
    }
  };

  return (
    <div className="modal fade" id="popUpSuspend" tabIndex={-1} aria-labelledby="popUpSuspendLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content">
          <div className="admin-booking-hotel__popup-form">
            <div className="admin-booking-hotel__popup-form-content">
              <BlurPlaceholderImage className='' alt='image' src={iconSuspended} width={72} height={72} />
              <div className="admin-booking-hotel__popup-contents">
                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">Suspend this Booking ?</h3>
                <p className="admin-booking-hotel__content-caption--popup">Please give a reason before to continue suspend this booking</p>
              </div>
              <textarea name="#" id="#" cols={10} rows={4} placeholder="Give me a reason" value={formData.note} onChange={handleTextAreaChange}></textarea>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item' data-bs-dismiss="modal">Cancel</button>
              <button type='button' onClick={handleSubmit} className='btn btn-md btn-success' data-bs-dismiss="modal">Yes, Suspend</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PopupNote = (props) => {
  const { carData } = props;
  return (
    <div className="modal fade" id="popUpNote" tabIndex={-1} aria-labelledby="popUpNoteLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content admin-booking-hotel__popup-form-note__wrapper">
          <div className="admin-booking-hotel__popup-form admin-booking-hotel__popup-form-note">
            <div className="admin-booking-hotel__popup-form-note-header">
              <h5>Note</h5>
              <textarea name="#" id="#" cols={10} rows={4} disabled={true}>{carData?.booking_details?.admin_note}</textarea>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button className='btn btn-sm btn-success' data-bs-dismiss="modal">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PopupCancel = ({ carData, handleCanceled }: { carData: any, handleCanceled: () => void }) => {

  const [formData, setFormData] = useState({
    "id_car_booking": carData?.booking_details?.id_car_booking,
    "status": 4,
    "note": "",
    "soft_deleted": 0
  });

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/admin-car-booking/update-status', 'POST', formData, true)
    if (ok) {
      console.log("success api handle submit update status completed ", status, data, ok, error);
      handleCanceled();
    } else {
      console.log("fail to handle submit post api update status completed ", status, data, ok, error);
    }
  };

  return (
    <div className="modal fade" id="popUpCancel" tabIndex={-1} aria-labelledby="popUpCancelLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content">
          <div className="admin-booking-hotel__popup-form">
            <div className="admin-booking-hotel__popup-form-content">
              <BlurPlaceholderImage className='' alt='image' src={iconCancel} width={72} height={72} />
              <div className="admin-booking-hotel__popup-contents">
                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">Cancel this Booking ?</h3>
                <p className="admin-booking-hotel__content-caption--popup">Booking that have been cancelled cannot be returned again</p>
              </div>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item' data-bs-dismiss="modal">Cancel</button>
              <button onClick={handleSubmit} type='button' className='btn btn-md btn-success' data-bs-dismiss="modal">Yes, Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const BannerComplete = () => {
  return (
    <div className="admin-booking-car__content-banner admin-booking-car__content-banner--complete">
      <div className="admin-booking-car__content-banner-icon admin-booking-car__content-banner-icon--complete">
        <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
      </div>
      <p className="admin-booking-car__content-banner-desc">The booking has been completed</p>
    </div>
  )
}

const BannerCanceled = () => {
  return (
    <div className="admin-booking-car__content-banner admin-booking-car__content-banner--canceled">
      <div className="admin-booking-car__content-banner-icon admin-booking-car__content-banner-icon--canceled">
        <SVGIcon src={Icons.CircleCancelWhite} width={24} height={24} />
      </div>
      <p className="admin-booking-car__content-banner-desc">The booking has been cancelled</p>
    </div>
  )
}


const BannerSuspended = () => {
  return (
    <div className="admin-booking-car__content-banner admin-booking-car__content-banner--suspended">
      <div className="admin-booking-car__content-banner-icon admin-booking-car__content-banner-icon--suspended">
        <SVGIcon src={Icons.Disabled} width={24} height={24} />
      </div>
      <div className="admin-booking-car__content-banner-wrapper">
        <p className="admin-booking-car__content-banner-desc">Booking has been suspended</p>
        <p className="admin-booking-car__content-banner-subdesc">You can reactivate it by pressing the “set active” button</p>
      </div>
      <button type="button" data-bs-toggle="modal" data-bs-target="#popUpNote" className="admin-booking-hotel__content-banner-action btn btn-md btn-outline-success">View Note</button>
      <button type="button" data-bs-toggle="modal" data-bs-target="#popUpComplete" className="admin-booking-hotel__content-banner-action btn btn-md btn-success">
        <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
        Set Active
      </button>
    </div>
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

export default BookingCarDetails
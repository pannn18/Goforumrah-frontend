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

const BookingTourDetails = (props) => {

  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);

  const router = useRouter()
  const { id } = router.query;
  const id_tour_booking = props.id ?? id;

  //Retrive Data from API
  const [tourData, setTourData] = useState(null);
  const [tourLoading, setTourLoading] = useState(true);
  const [tourError, setTourError] = useState(null);

  const [customerData, setCustomerData] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [customerError, setCustomerError] = useState(null);

  useEffect(() => {
    if (!id_tour_booking) return

    // Check if personalData or hotelData is already available
    if (tourData) return;

    const fetchTourData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/tour-package/show-booking', 'POST', { id_tour_booking: id_tour_booking}, true);
        setTourData(data);
        data[0]?.status === 5 && setIsComplete(true);
        data[0]?.status === 3 && setIsSuspended(true);
        data[0]?.status === 4 && setIsCanceled(true);
        setTourLoading(false);
        // console.log(tourData)
      } catch (error) {
        setTourError(error);
        setTourLoading(false);
      }
    };

    fetchTourData();
  }, [id_tour_booking]);

  useEffect(() => {
    // Fetch customerData if tourData is available
    if (tourData) {
      const id_customer = tourData[0]?.id_customer; // Assuming id_customer is available in tourData

      // Check if id_customer is available and customerData is not already fetched
      if (id_customer && !customerData) {
        const fetchCustomerData = async () => {
          try {
            const customerResponse = await callAPI('/customer/personal/show', 'POST', { id_customer }, true);
            setCustomerData(customerResponse.data);
            setCustomerLoading(false);
          } catch (error) {
            setCustomerError(error);
            setCustomerLoading(false);
          }
        };

        fetchCustomerData();
      }
    }
  }, [tourData]);


  if (tourLoading) {
    return <LoadingOverlay />;
  }

  if (tourError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("tourData : ", tourData);
  console.log("customerData : ", customerData);

  return (
    <Layout>
      <AdminLayout pageTitle="Booking Details" enableBack={true}>
        <div className="container admin-booking-tour-details__container">
          {isComplete && <BannerComplete />}
          {isSuspended && <BannerSuspended />}
          {isCanceled && <BannerCanceled />}
          <div className="admin-booking-tour-details">
            <MainSection tourData={tourData} />
            <TourAdditionalDetailsSummary tourData={tourData} customerData={customerData} isComplete={isComplete} isSuspended={isSuspended} isCanceled={isCanceled} />
          </div>
        </div>
      </AdminLayout>
      <PopupComplete tourData={tourData} handleComplete={() => { setIsComplete(true); setIsSuspended(false); setIsCanceled(false); }} />
      <PopupSuspend tourData={tourData} handleSuspended={() => { setIsSuspended(true); setIsComplete(false); setIsCanceled(false); }} />
      <PopupCancel tourData={tourData} handleCanceled={() => { setIsCanceled(true); setIsSuspended(false); setIsComplete(false); }} />
      <PopupNote tourData={tourData} />
    </Layout>


  )
}

const MainSection = (props) => {
  const { tourData } = props
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
    <div className="admin-booking-tour-details__content-wrapper">
      <div className="admin-booking-tour-details__content">
        <div className="admin-booking-tour-details__content-top">
          <img className="admin-booking-tour-details__content-top-image" src={tourData[0]?.photos[0]?.photo||Images.Placeholder} alt="Review Image" width={191} height={160} />
          <div className="admin-booking-tour-details__content-top-wrapper">
            <div className="admin-booking-tour-details__content-top-header">
              <div className="admin-booking-tour-details__content-top-header-value">
                <p className="admin-booking-tour-details__content-top-header-value--number"># {tourData[0]?.id_tour_booking}</p>
                <h5 className="admin-booking-tour-details__content-top-header-value--name">{tourData[0]?.tour_package?.package_name}</h5>
                <p className="admin-booking-tour-details__content-top-header-value--type">{tourData[0]?.tour_plan?.type_plan}</p>
              </div>
            </div>
            <div className="admin-booking-tour-details__content-top-desc">
              <div className="admin-booking-tour-details__content-top-desc-item">
                <p className="admin-booking-tour-details__content-top-desc-item">Duration</p>
                <div className="admin-booking-tour-details__content-top-desc-info">
                  <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                  <p className="admin-booking-tour-details__content-top-desc-info">{tourData[0]?.tour_plan?.total_day} day</p>
                </div>
              </div>
              <div className="admin-booking-tour-details__content-top-desc-item">
                <p className="admin-booking-tour-details__content-top-desc-item">Tickets</p>
                <div className="admin-booking-tour-details__content-top-desc-info">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p className="admin-booking-tour-details__content-top-desc-info">{tourData[0]?.number_of_tickets} Tickets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-booking-tour-details__separator"></div>
        <div className="admin-booking-tour-details__content-date">
          <div className="admin-booking-tour-details__content-date-item">
            <div className="admin-booking-tour-details__content-date-icon">
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
            </div>
            <div className="admin-booking-tour-details__content-date-value">
              <p>Start Date</p>
              <div className="admin-booking-tour-details__content-date-value-wrapper">
                <div className="admin-booking-tour-details__content-date-value-detail">
                  <p className="admin-booking-tour-details__content-date-value-detail--date">{formatDate(tourData[0]?.start_date)}</p>
                </div>
                <p className="admin-booking-tour-details__content-date-value-detail--location">{tourData?.booking_details?.pickup}</p>
              </div>
            </div>
          </div>
          <div className="admin-booking-tour-details__content-date-item">
            <div className="admin-booking-tour-details__content-date-icon">
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
            </div>
            <div className="admin-booking-tour-details__content-date-value">
              <p>End Date</p>
              <div className="admin-booking-tour-details__content-date-value-detail">
                <p className="admin-booking-tour-details__content-date-value-detail--date">{formatDate(tourData[0]?.end_date)}</p>
              </div>
              <p className="admin-booking-tour-details__content-date-value-detail--location">{tourData?.booking_details?.dropoff}</p>
            </div>
          </div>
        </div>
        <div className="admin-booking-tour-details__separator"></div>
        <div className="admin-booking-tour-details__content-location">
          <p className="admin-booking-tour-details__content-top-desc-item">Location</p>
          <div className="admin-booking-tour-details__content-location-wrap">
            <div className="admin-booking-tour-details__content-location-item">
              <p className="admin-booking-tour-details__content-date-value-detail--date">{tourData[0]?.tour_package.city}</p>
              <div className="admin-booking-tour-details__content-location-desc">
                <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                <p>{tourData[0]?.tour_package.address}</p>
              </div>
            </div>
            <a className="admin-booking-tour-details__content-location-action-btn btn btn-sm btn-outline-success">
              <SVGIcon src={Icons.MapPin} width={18} height={18} />
              Show Map
            </a>
          </div>
        </div>
        <div className="admin-booking-tour-details__content-information">
          <p className="admin-booking-tour-details__content-information-value">Special Requirement </p>
          <p>{tourData[0]?.special_requirement}</p>
        </div>
      </div>
      <div className="admin-booking-tour-details__content-bottom">
        <h5>Detail Payment</h5>
        <div className="admin-booking-tour-details__separator"></div>
        <div className="admin-booking-tour-details__content-bottom-total">
          <p className="admin-booking-tour-details__content-bottom-total-desc">Total Payment</p>
          <h5>$ {tourData[0]?.total_price}</h5>
        </div>
        <a className="admin-booking-tour-details__content-bottom-link">Show More</a>
      </div>
    </div>
  )
}

const TourAdditionalDetailsSummary = ({ tourData,customerData, isComplete, isSuspended, isCanceled }: { tourData: any, customerData: any, isComplete: boolean, isSuspended: boolean, isCanceled: boolean }) => {

  return (
    <div className="admin-booking-tour-details__summary">
      {(!isComplete && !isSuspended && !isCanceled) && (
        <div className="admin-booking-tour-details__summary-action">
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
      <div className="admin-booking-tour-details__summary-box">
        <div className="admin-booking-tour-details__summary-row">
          <h5>Customer</h5>
          <a className="admin-booking-tour-details__summary-row-link">See details</a>
        </div>
        <div className="admin-booking-tour-details__summary-content">
          <div className="admin-booking-tour-details__summary-content-rounded">
            <img className="img" src={customerData?.profile_photo ?? Images.Placeholder} alt="" width={64} height={64} />
          </div>
          <div className="admin-booking-tour-details__summary-content-wrapper">
            <p className="admin-booking-tour-details__summary-content-desc admin-booking-tour-details__summary-content-desc--value">{customerData?.fullname ?? 'Customer Name'}</p>
            <p className="admin-booking-tour-details__summary-content-desc">{customerData?.email ?? 'Customer email'}</p>
            <p className="admin-booking-tour-details__summary-content-desc">{customerData?.phone ?? 'Customer Phone'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const PopupComplete = ({ tourData, handleComplete }: { tourData: any, handleComplete: () => void }) => {

  const [formData, setFormData] = useState({
    "id_tour_booking": tourData[0]?.id_tour_booking,
    "status": 5
  });

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/tour-package/update-status-booking', 'POST', formData, true)
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

const PopupSuspend = ({ tourData, handleSuspended }: { tourData: any, handleSuspended: () => void }) => {

  const [formData, setFormData] = useState({
    "id_tour_booking": tourData[0]?.id_tour_booking,
    "status": 3,
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
    const { status, data, ok, error } = await callAPI('/tour-package/update-status-booking', 'POST', formData, true)
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
  const { tourData } = props;
  return (
    <div className="modal fade" id="popUpNote" tabIndex={-1} aria-labelledby="popUpNoteLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content admin-booking-hotel__popup-form-note__wrapper">
          <div className="admin-booking-hotel__popup-form admin-booking-hotel__popup-form-note">
            <div className="admin-booking-hotel__popup-form-note-header">
              <h5>Note</h5>
              <textarea name="#" id="#" cols={10} rows={4} disabled={true}>{tourData?.booking_details?.admin_note}</textarea>
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

const PopupCancel = ({ tourData, handleCanceled }: { tourData: any, handleCanceled: () => void }) => {

  const [formData, setFormData] = useState({
    "id_tour_booking": tourData[0]?.id_tour_booking,
    "status": 4,
  });

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/tour-package/update-status-booking', 'POST', formData, true)
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
    <div className="admin-booking-tour__content-banner admin-booking-tour__content-banner--complete">
      <div className="admin-booking-tour__content-banner-icon admin-booking-tour__content-banner-icon--complete">
        <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
      </div>
      <p className="admin-booking-tour__content-banner-desc">The booking has been completed</p>
    </div>
  )
}

const BannerCanceled = () => {
  return (
    <div className="admin-booking-tour__content-banner admin-booking-tour__content-banner--canceled">
      <div className="admin-booking-tour__content-banner-icon admin-booking-tour__content-banner-icon--canceled">
        <SVGIcon src={Icons.CircleCancelWhite} width={24} height={24} />
      </div>
      <p className="admin-booking-tour__content-banner-desc">The booking has been cancelled</p>
    </div>
  )
}


const BannerSuspended = () => {
  return (
    <div className="admin-booking-tour__content-banner admin-booking-tour__content-banner--suspended">
      <div className="admin-booking-tour__content-banner-icon admin-booking-tour__content-banner-icon--suspended">
        <SVGIcon src={Icons.Disabled} width={24} height={24} />
      </div>
      <div className="admin-booking-tour__content-banner-wrapper">
        <p className="admin-booking-tour__content-banner-desc">Booking has been rejected</p>
        <p className="admin-booking-tour__content-banner-subdesc">You can reactivate it by pressing the “set active” button</p>
      </div>
      <button type="button" data-bs-toggle="modal" data-bs-target="#popUpNote" className="admin-booking-hotel__content-banner-action btn btn-md btn-outline-success">View Note</button>
      <button type="button" data-bs-toggle="modal" data-bs-target="#popUpComplete" className="admin-booking-hotel__content-banner-action btn btn-md btn-success">
        <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
        Set Active
      </button>
    </div>
  )
}


// export async function getServerSideProps(context) {
//   const { params } = context;
//   const id = params.id;

//   // Fetch data based on the id here
//   // For example, you can fetch data from a database

//   return {
//     props: {
//       id,
//       // Add other data fetched based on the id
//     },
//   };
// }

export default BookingTourDetails
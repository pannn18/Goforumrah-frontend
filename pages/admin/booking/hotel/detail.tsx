import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import { useEffect, useState } from "react";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { Icons, Images } from "@/types/enums";
import Link from "next/link";
import { BlurPlaceholderImage } from "@/components/elements/images";
import iconCheck from "assets/images/icon_check_soft.svg";
import iconSuspended from "assets/images/icon_suspended_soft.svg";
import iconCancel from "assets/images/icon_cancel_soft.svg";
import { callAPI } from "@/lib/axiosHelper";
import { useRouter } from "next/router";
import moment from "moment";
import { string } from "yup";
import LoadingOverlay from "@/components/loadingOverlay";

export default function BookingHotelDetails() {
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [isSuspended, setIsSuspended] = useState<boolean>(false);
  const [isCanceled, setIsCanceled] = useState<boolean>(false);
  const [isSetActive, setIsActive] = useState<boolean>(false);

  const [bookingDetail, setBookingDetail] = useState<any>({
    booking_details: {},
    booking_customer: {},
    hotel_business: {},
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const id_booking = router.query.id;

  useEffect(() => {
    const getDataDetail = async () => {
      try {
        // Call API to get booking details
        const bookingDetailsResponse = await callAPI(
          `/admin-hotel-booking/show`,
          "POST",
          { id_hotel_booking: id_booking },
          true
        );

        if (bookingDetailsResponse.error) {
          console.error(bookingDetailsResponse.error);
          return;
        }

        if (bookingDetailsResponse.ok && bookingDetailsResponse.data) {
          const data = bookingDetailsResponse.data;
          setBookingDetail(data);

          // Update status based on booking details
          if (data.booking_details.status === 6) {
            setIsComplete(true);
          } else if (data.booking_details.status === 5) {
            setIsSuspended(true);
          } else if (data.booking_details.status === 4) {
            setIsCanceled(true);
          }

          // Call API to get reservation status
          const reservationStatusResponse = await callAPI(
            `/hotel-booking/detail`, 
            "POST",
            { id_hotel_booking: id_booking },
            true
          );

          if (reservationStatusResponse.ok && reservationStatusResponse.data) {
            const reservationStatus = reservationStatusResponse.data.reservation_status;

            if (reservationStatus === 2) {
              setIsComplete(true);
            }
          }
        }
      } catch (error) {
        console.error("Error Fetching Data", error);
      } finally {
        setIsLoading(false); 
      }
    };

    if (id_booking) {
      getDataDetail();
    }
  }, [id_booking]);


  const { booking_details, booking_customer, hotel_business } = bookingDetail;
  const { id_hotel_booking } = booking_details;

  const handleChangeStatus = async (status, note) => {
    const { ok, error, data } = await callAPI(
      `/admin-hotel-booking/update-status`,
      "POST",
      { id_hotel_booking: id_hotel_booking, status: status, note: note },
      true
    );
    if (error) {
      console.log(error);
    }
    if (ok) {
      console.log(data);
    }
  };

  console.log("booking_details : ", booking_details);

  return (
    <Layout>
      <AdminLayout pageTitle="Booking Details" enableBack={true}>
        <div className="container admin-booking-hotel-details__container">
          {isComplete && <BannerComplete />}
          {isSuspended && <BannerSuspended />}
          {isCanceled && <BannerCanceled />}
          <div className="admin-booking-hotel-details">
            <HotelBookingDetails bookingDetails={booking_details} />
            <BookingHotelDetailsSummary
              isComplete={isComplete}
              isSuspended={isSuspended}
              isCanceled={isCanceled}
              bookingCustomer={booking_customer}
              hotelBusiness={hotel_business}
            />
          </div>
        </div>
      </AdminLayout>
      <PopupComplete
        handleComplete={() => {
          handleChangeStatus(6, null);
          setIsComplete(true);
          setIsSuspended(false);
          setIsCanceled(false);
        }}
      />
      <PopupSuspend
        handleSuspended={(note) => {
          handleChangeStatus(5, note);
          setIsSuspended(true);
          setIsComplete(false);
          setIsCanceled(false);
        }}
      />
      <PopupCancel
        handleCanceled={() => {
          handleChangeStatus(4, null);
          setIsCanceled(true);
          setIsSuspended(false);
          setIsComplete(false);
        }}
      />
      <PopupNote note={booking_details?.note} />
      {isLoading && (               
       <LoadingOverlay />
                          
       )}
    </Layout>
  );
}

const HotelBookingDetails = (props) => {
  const bookingDetails = props.bookingDetails;

  const {
    id_hotel_booking,
    id_customer,
    id_hotel_business,
    hotel_name,
    profile_icon,
    checkin,
    checkout,
    street_address,
    note,
    price_amount,
    room_number,
    hotel_photo,
  } = bookingDetails;

  console.log("bookingDetails on component : ", bookingDetails);

  const originalCheckin = checkin;
  const dateCheckinObj = moment(originalCheckin);
  const dateCheckin = dateCheckinObj.format("MMM D, YYYY");
  const timeCheckin = dateCheckinObj.format("HH:mm");

  const originalCheckout = checkout;
  const dateCheckoutObj = moment(originalCheckout);
  const dateCheckout = dateCheckoutObj.format("MMM D, YYYY");
  const timeCheckout = dateCheckoutObj.format("HH:mm");

  const duration = moment(checkout).diff(moment(checkin), "days");
  const formatStayDuration = (checkin, checkout) => {
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
  
    const nights = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));
  
    const isCheckoutAfterNoon = checkoutDate.getHours() >= 12;
    const isCheckinBeforeNoon = checkinDate.getHours() < 12;
  
    const days = nights + (isCheckinBeforeNoon ? 1 : 0);
  
    if (days === 1 && isCheckoutAfterNoon) {
      return '1 day 1 night';
    } else if (days === 1 && !isCheckoutAfterNoon) {
      return '1 night';
    } else if (nights === 1 && isCheckinBeforeNoon) {
      return '1 day';
    } else {
      return `${days} days ${nights} nights`;
    }
  };  
  console.log("bookingDetails:", bookingDetails);

  return (
    <div className="admin-booking-hotel-details__content-wrapper">
      <div className="admin-booking-hotel-details__content">
        <div className="admin-booking-hotel-details__content-top">
          <img className="admin-booking-hotel-details__content-top-image" src={bookingDetails?.hotel_photo?.[0]?.photo} alt="Review Image" width={191} height={160} />
          <div className="admin-booking-hotel-details__content-top-wrapper">
            <div className="admin-booking-hotel-details__content-top-header">
              <div className="admin-booking-hotel-details__content-top-header-value">
                <p className="admin-booking-hotel-details__content-top-header-value--number">
                  #{id_hotel_booking}
                </p>
                <h5 className="admin-booking-hotel-details__content-top-header-value--name">
                  {hotel_name}
                </h5>
                {/* <p className="admin-booking-hotel-details__content-top-header-value--type">
                  <span style={{ color: "red" }}>Room Type</span>
                </p> */}
              </div>
              <button
                type="button"
                className="admin-booking-hotel-details__content-top-header btn btn-sm btn-outline-success"
                data-bs-toggle="modal"
                data-bs-target="#popUpNote"
              >
                View Note
              </button>
            </div>
            <div className="admin-booking-hotel-details__content-top-desc">
              <div className="admin-booking-hotel-details__content-top-desc-item">
                <p className="admin-booking-hotel-details__content-top-desc-item">
                  Duration
                </p>
                <div className="admin-booking-hotel-details__content-top-desc-info">
                  <SVGIcon src={Icons.Sun} width={20} height={20} />
                  <p className="admin-booking-hotel-details__content-top-desc-info">
                    {formatStayDuration(checkin, checkout)}
                  </p>
                </div>
              </div>
              {/* For room number. waiting backend flow */}
              {/* <div className="admin-booking-hotel-details__content-top-desc-item">
                <p className="admin-booking-hotel-details__content-top-desc-item">
                  Room
                </p>
                <div className="admin-booking-hotel-details__content-top-desc-info">
                  <SVGIcon src={Icons.Calendar} width={20} height={20} />
                  <p className="admin-booking-hotel-details__content-top-desc-info">
                    Room {room_number}
                  </p>
                </div>
              </div> */}

              {/* <div className="admin-booking-hotel-details__content-top-desc-item">
                <p className="admin-booking-hotel-details__content-top-desc-item">
                  Guest
                </p>
                <div className="admin-booking-hotel-details__content-top-desc-info">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p className="admin-booking-hotel-details__content-top-desc-info">
                    <span style={{ color: "red" }}>2 Guest</span>
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="admin-booking-hotel-details__separator"></div>
        <div className="admin-booking-hotel-details__content-date">
          <div className="admin-booking-hotel-details__content-date-item">
            <div className="admin-booking-hotel-details__content-date-icon">
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
            </div>
            <div className="admin-booking-hotel-details__content-date-value">
              <p>Check-in</p>
              <div className="admin-booking-hotel-details__content-date-value-detail">
                <p className="admin-booking-hotel-details__content-date-value-detail--date">
                  {dateCheckin}
                </p>
                <p className="admin-booking-hotel-details__content-date-value-detail--time">
                  ({timeCheckin})
                </p>
              </div>
            </div>
          </div>
          <div className="admin-booking-hotel-details__content-date-item">
            <div className="admin-booking-hotel-details__content-date-icon">
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
            </div>
            <div className="admin-booking-hotel-details__content-date-value">
              <p>Check-out</p>
              <div className="admin-booking-hotel-details__content-date-value-detail">
                <p className="admin-booking-hotel-details__content-date-value-detail--date">
                  {dateCheckout}
                </p>
                <p className="admin-booking-hotel-details__content-date-value-detail--time">
                  ({timeCheckout})
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-booking-hotel-details__separator"></div>
        <div className="admin-booking-hotel-details__content-location">
          <p className="admin-booking-hotel-details__content-top-desc-item">
            Location
          </p>
          <div className="admin-booking-hotel-details__content-location-wrap">
            <div className="admin-booking-hotel-details__content-location-item">
              <p className="admin-booking-hotel-details__content-date-value-detail--date">
                {street_address}
              </p>
              {/* <div className="admin-booking-hotel-details__content-location-desc">
                <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                <span style={{ color: "red" }}>
                  <p>318, Federal circle, JFK Airport, USA 11432</p>
                </span>
              </div> */}
            </div>
            <a href={`https://maps.google.com/?q=${hotel_name} ${street_address}`} className="admin-booking-hotel-details__content-location-btn btn btn-sm btn-success" target="_blank" rel="noreferrer">
              Open in Google Map
            </a>
          </div>
        </div>
        {/* <div className="admin-booking-hotel-details__content-information">
          <span style={{ color: "red" }}>
            <p className="admin-booking-hotel-details__content-information-value">
              Additional Information
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </span>
        </div> */}
      </div>
      <div className="admin-booking-hotel-details__content-bottom">
        <h5>Detail Payment</h5>
        <div className="admin-booking-hotel-details__separator"></div>
        <div className="admin-booking-hotel-details__content-bottom-total">
          <p className="admin-booking-hotel-details__content-bottom-total-desc">
            Total Payment
          </p>
          <h5>$ {price_amount}</h5>
        </div>
        {/* <a className="admin-booking-hotel-details__content-bottom-link">
          Show More
        </a> */}
      </div>
    </div>
  );
};

const BookingHotelDetailsSummary = ({
  isComplete,
  isSuspended,
  isCanceled,
  bookingCustomer,
  hotelBusiness,
}: {
  isComplete: boolean;
  isSuspended: boolean;
  isCanceled: boolean;
  bookingCustomer: {
    profile_photo: string;
    fullname: string;
    email: string;
    phone: string;
  };
  hotelBusiness: {
    username: string;
    email: string;
    phone: string;
  };
}) => {
  const { profile_photo, fullname, email, phone } = bookingCustomer;
  const {
    username: hotelUsername,
    email: hotelEmail,
    phone: hotelPhone,
  } = hotelBusiness;

  return (
    <div className="admin-booking-hotel-details__summary">
      {!isComplete && !isSuspended && !isCanceled && (
        <div className="admin-booking-hotel-details__summary-action">
          <button
            type="button"
            className="admin-booking-hotel-details__summary-action btn btn-md btn-success"
            data-bs-toggle="modal"
            data-bs-target="#popUpComplete"
          >
            <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
            Complete
          </button>
          <button
            type="button"
            className="admin-booking-hotel-details__summary-action btn btn-md btn-warning"
            data-bs-toggle="modal"
            data-bs-target="#popUpSuspend"
          >
            <SVGIcon src={Icons.Disabled} width={20} height={20} />
            Pending
          </button>
          <button
            type="button"
            className="admin-booking-hotel-details__summary-action btn btn-md btn-danger"
            data-bs-toggle="modal"
            data-bs-target="#popUpCancel"
          >
            <SVGIcon src={Icons.Cancel} width={20} height={20} />
            Cancel
          </button>
        </div>
      )}
      <div className="admin-booking-hotel-details__summary-box">
        <div className="admin-booking-hotel-details__summary-row">
          <h5>Customer</h5>
          <a className="admin-booking-hotel-details__summary-row-link">
            See details
          </a>
        </div>
        <div className="admin-booking-hotel-details__summary-content">
          <div className="admin-booking-hotel-details__summary-content-rounded">
            {profile_photo ? (
              <img src={profile_photo} alt="Profile" className="img" height={64} width={64} />
            ) : (
              <SVGIcon src={Icons.User} height={40} width={40} className="admin-booking-hotel-details__summary-content-rounded-content admin-booking-hotel-details__summary-content-rounded--icon" />
            )}
          </div>
          <div className="admin-booking-hotel-details__summary-content-wrapper">
            <p className="admin-booking-hotel-details__summary-content-desc admin-booking-hotel-details__summary-content-desc--value">
              {fullname}
            </p>
            <p className="admin-booking-hotel-details__summary-content-desc">
              {email}
            </p>
            <p className="admin-booking-hotel-details__summary-content-desc">
              {phone}
            </p>
          </div>
        </div>
      </div>
      <div className="admin-booking-hotel-details__summary-box">
        <div className="admin-booking-hotel-details__summary-row">
          <h5>Business Hotel</h5>
          <a className="admin-booking-hotel-details__summary-row-link">
            See details
          </a>
        </div>
        <div className="admin-booking-hotel-details__summary-content">
          <div className="admin-booking-hotel-details__summary-content-rounded">
            <SVGIcon src={Icons.User} height={40} width={40} className="admin-booking-hotel-details__summary-content-rounded-content admin-booking-hotel-details__summary-content-rounded--icon" />
          </div>
          <div className="admin-booking-hotel-details__summary-content-wrapper">
            <p className="admin-booking-hotel-details__summary-content-desc admin-booking-hotel-details__summary-content-desc--value">
              {hotelUsername}
            </p>
            <p className="admin-booking-hotel-details__summary-content-desc">
              {hotelEmail}
            </p>
            <p className="admin-booking-hotel-details__summary-content-desc">
              {hotelPhone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopupComplete = ({ handleComplete }: { handleComplete: () => void }) => {
  return (
    <>
      <div
        className="modal fade"
        id="popUpComplete"
        tabIndex={-1}
        aria-labelledby="popUpCompleteLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog cancelation__modal admin-customer__modal-block">
          <div className="modal-content admin-customer__add-modal-content">
            <div className="admin-booking-hotel__popup-form">
              <div className="admin-booking-hotel__popup-form-content">
                <BlurPlaceholderImage
                  className=""
                  alt="image"
                  src={iconCheck}
                  width={72}
                  height={72}
                />
                <div className="admin-booking-hotel__popup-contents">
                  <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">
                    Complete this Booking ?
                  </h3>
                  <p className="admin-booking-hotel__content-caption--popup">
                    You want to mark this booking that the customer has
                    checked-in
                  </p>
                </div>
              </div>
              <div className="admin-booking-hotel__popup-footer">
                <button
                  type="button"
                  className="button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  className="btn btn-md btn-success"
                  data-bs-dismiss="modal"
                >
                  Yes, Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PopupSuspend = ({
  handleSuspended,
}: {
  handleSuspended: (note: string) => void;
}) => {
  const [note, setNote] = useState("");

  const handleNoteChange = (e) => {
    const noteValue = e.target.value;
    setNote(noteValue);
  };

  return (
    <div
      className="modal fade"
      id="popUpSuspend"
      tabIndex={-1}
      aria-labelledby="popUpSuspendLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content">
          <div className="admin-booking-hotel__popup-form">
            <div className="admin-booking-hotel__popup-form-content">
              <BlurPlaceholderImage
                className=""
                alt="image"
                src={iconSuspended}
                width={72}
                height={72}
              />
              <div className="admin-booking-hotel__popup-contents">
                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">
                  Suspend this Booking ?
                </h3>
                <p className="admin-booking-hotel__content-caption--popup">
                  Please give a reason before to continue suspend this booking
                </p>
              </div>
              <textarea
                name="note"
                id="note"
                cols={10}
                rows={4}
                // value={note}
                onChange={(e) => handleNoteChange(e)}
                placeholder="Give me a reason"
              ></textarea>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button
                type="button"
                className="button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSuspended(note)}
                className="btn btn-md btn-success"
                data-bs-dismiss="modal"
              >
                Yes, Suspend
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopupNote = ({ note }: { note: string }) => {
  return (
    <div
      className="modal fade"
      id="popUpNote"
      tabIndex={-1}
      aria-labelledby="popUpNoteLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content admin-booking-hotel__popup-form-note__wrapper">
          <div className="admin-booking-hotel__popup-form admin-booking-hotel__popup-form-note">
            <div className="admin-booking-hotel__popup-form-note-header">
              <h5>Note</h5>
              <textarea
                name="#"
                id="#"
                cols={10}
                rows={4}
                value={note}
              ></textarea>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button
                className="btn btn-sm btn-success"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PopupCancel = ({ handleCanceled }: { handleCanceled: () => void }) => {
  return (
    <div
      className="modal fade"
      id="popUpCancel"
      tabIndex={-1}
      aria-labelledby="popUpCancelLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-customer__modal-block">
        <div className="modal-content admin-customer__add-modal-content">
          <div className="admin-booking-hotel__popup-form">
            <div className="admin-booking-hotel__popup-form-content">
              <BlurPlaceholderImage
                className=""
                alt="image"
                src={iconCancel}
                width={72}
                height={72}
              />
              <div className="admin-booking-hotel__popup-contents">
                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">
                  Cancel this Booking ?
                </h3>
                <p className="admin-booking-hotel__content-caption--popup">
                  Booking that have been cancelled cannot be returned again
                </p>
              </div>
            </div>
            <div className="admin-booking-hotel__popup-footer">
              <button
                type="button"
                className="button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                onClick={handleCanceled}
                type="button"
                className="btn btn-md btn-success"
                data-bs-dismiss="modal"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerComplete = () => {
  return (
    <div className="admin-booking-hotel__content-banner admin-booking-hotel__content-banner--complete">
      <div className="admin-booking-hotel__content-banner-icon admin-booking-hotel__content-banner-icon--complete">
        <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
      </div>
      <p className="admin-booking-hotel__content-banner-desc">
        The booking has been completed
      </p>
    </div>
  );
};

const BannerCanceled = () => {
  return (
    <div className="admin-booking-hotel__content-banner admin-booking-hotel__content-banner--canceled">
      <div className="admin-booking-hotel__content-banner-icon admin-booking-hotel__content-banner-icon--canceled">
        <SVGIcon src={Icons.CircleCancelWhite} width={24} height={24} />
      </div>
      <p className="admin-booking-hotel__content-banner-desc">
        The booking has been cancelled
      </p>
    </div>
  );
};

const BannerSuspended = () => {
  return (
    <div className="admin-booking-hotel__content-banner admin-booking-hotel__content-banner--suspended">
      <div className="admin-booking-hotel__content-banner-icon admin-booking-hotel__content-banner-icon--suspended">
        <SVGIcon src={Icons.Disabled} width={24} height={24} />
      </div>
      <div className="admin-booking-hotel__content-banner-wrapper">
        <p className="admin-booking-hotel__content-banner-desc">
          Booking has been suspended
        </p>
        <p className="admin-booking-hotel__content-banner-subdesc">
          You can reactivate it by pressing the “set active” button
        </p>
      </div>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#popUpNote"
        className="admin-booking-hotel__content-banner-action btn btn-md btn-outline-success"
      >
        View Note
      </button>
      <button
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#popUpComplete"
        className="admin-booking-hotel__content-banner-action btn btn-md btn-success"
      >
        <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
        Set Active
      </button>
    </div>
  );
};

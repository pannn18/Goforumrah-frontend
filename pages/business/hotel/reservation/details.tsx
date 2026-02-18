import React, { use, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { callAPI } from '@/lib/axiosHelper'
import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import iconCheck from 'assets/images/icon_check_soft.svg'
import { getSession, useSession } from 'next-auth/react'
import LoadingOverlay from '@/components/loadingOverlay'
import { useReactToPrint } from 'react-to-print'

const ReservationDetails = ({ propertyHotel }) => {
  const router = useRouter();

  const [propertyHotelData, setPropertyHotelData] = useState(null);

  //Retrive Data from API
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusReservation, setStatusReservation] = useState(null);
  const statusReservationValue = ['Need Confirmation', 'Check-In', 'Check-Out', 'No-Show'];
  const { idBooking } = router.query;
  console.log(idBooking);

  useEffect(() => {
    if (propertyHotel) {
      // Assuming propertyHotel is an array
      const lastIndex = propertyHotel.length - 1;
      console.log(lastIndex)
      if (lastIndex >= 0) {
        setPropertyHotelData(propertyHotel[lastIndex]);
        // sethotelBusinessID(propertyHotel[lastIndex]?.id_hotel)
      }
    }
  }, [propertyHotel]);


  // Check if idBooking is available
  useEffect(() => {
    if (!idBooking) {
      router.back();
    }
  }, [idBooking]);

  //Function Date & TIme
  const formatDateToCustomString = (dateString) => {
    const date = new Date(dateString);
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayOfWeek}, ${month} ${day}, ${year}`;
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  //Fetching Apis
  const fetchDataDetailBooking = async () => {
    const payload = {
      id_hotel_booking: idBooking,
    }

    try {
      const { status, data, ok, error } = await callAPI('/hotel-business-reservation/detail', 'POST', payload, true)
      // Check if the API response status is in the valid status list, otherwise set a default status
      // Convert numeric status to its corresponding value from statusReservationValue
      const validStatus = statusReservationValue[data?.reservation_status] || statusReservationValue[0];

      setStatusReservation(validStatus); // Set the reservation_status
      console.log("Data Detail Hotel Booking Business reservation_status : ", data?.reservation_status);
      console.log("Data Detail Hotel Booking Business reservation_status : ", validStatus);
      setData(data);
      setLoading(false);
      setError(null);
      console.log("Data Detail Hotel Booking Business : ", data);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.log("Error : ", error);
    }
  };

  useEffect(() => {
    fetchDataDetailBooking();
  }, [router]);

  useEffect(() => {
    if (data === null) {
      const refetchInterval = setInterval(() => {
        console.log("Refetching data...");
        fetchDataDetailBooking();
      }, 3000); // Adjust the interval as needed

      return () => clearInterval(refetchInterval);
    }
  }, [data]);



  // Handle Export
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${propertyHotelData?.property_name}-[${propertyHotelData?.id_hotel}]-Reservation List`,
    pageStyle: `
    @page {
        size: A3;
    }

    @media all {
        .pagebreak {
          display: none;
        }
      }

    @media print {

    .pagebreak {
      page-break-before: always;
    }

    @supports (-webkit-print-color-adjust: exact) {
      body {
        -webkit-print-color-adjust: exact;
      }
    }
  }`
  });

  if (loading) {
    return <LoadingOverlay />
  }

  if (error) {
    return {
      notFound: true,
    }
  }

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

  // console.log("statusReservation : ", statusReservation);

  return (
    <Layout>
      <InnerLayout propertyHotel={propertyHotelData}>
        <div className="admin-reservation">
          <div className="container">
            <div className="admin-latest-business__top-header">
              <div className="admin-latest-business__top-header-wrapper">
                <h4 className="admin-latest-business__top-header-title">Reservation</h4>
              </div>
              <button type="button" onClick={handlePrint} className="btn btn-md btn-outline-success"> Export <SVGIcon src={Icons.Download} width={18} height={18} /> </button>
            </div>
            {statusReservation === 'Check-In' || statusReservation === 'Check-Out' || statusReservation === 'No-Show' ? (
              <div className={`admin-reservation__notification ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'admin-reservation__notification--success' : 'admin-reservation__notification--danger'}`}>
                <div className="admin-reservation__notification-wrapper">
                  <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
                    {statusReservation === 'Check-In' ? (
                      <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
                        <SVGIcon src={Icons.CheckRoundedGreen} width={24} height={24} />
                      </div>
                    ) : statusReservation === 'Check-Out' ? (
                      <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
                        <SVGIcon src={Icons.CheckRoundedGreen} width={24} height={24} />
                      </div>
                    ) : (
                      <div className="admin-reservation__notification-icon admin-reservation__notification-icon--danger">
                        <SVGIcon src={Icons.CircleCancel} width={24} height={24} />
                      </div>
                    )}
                  </div>
                  <p className="admin-reservation__notification-caption">
                    {statusReservation === 'Check-In' ? (
                      <p className='admin-reservation__notification-caption'>The guest has checked-in</p>
                    ) : statusReservation === 'Check-Out' ? (
                      <p className='admin-reservation__notification-caption'>The guest has checked-out</p>
                    ) : (
                      <p className='admin-reservation__notification-caption admin-reservation__notification--danger'>Reservation No Show</p>
                    )}
                  </p>
                </div>
              </div>
            ) : null}
            <div className='admin-reservation__content-container'>
              <div className="admin-reservation__form row">
                <div className="company-detail__content-form admin-reservation__content-form" ref={componentRef}>
                  <div className="admin-reservation__guest">
                    <div className="admin-reservation__profile">
                      <p className="admin-reservation__title-content">Guest name</p>
                      <div className="admin-reservation__profile-content">
                        <div className="admin-reservation__profile-person">
                          <BlurPlaceholderImage className="manage-review__modal-desc-image" src={data?.profile_photo || Images.Placeholder} alt="Review Image" width={40} height={40} />
                          <h4 className="admin-reservation__title-content--bold">{data?.guest_fullname}</h4>
                        </div>
                        <div className="admin-reservation__profile-region">
                          {/* <SVGIcon src={Icons.countryFlagIndonesia} width={20} height={20} /> */}
                          <p className="admin-reservation__caption-content--black">{data?.country}</p>
                        </div>
                      </div>
                    </div>
                    <div className="admin-reservation__booking-number">
                      <p className="admin-reservation__title-content">Booking number :</p>
                      <p className="admin-reservation__booking-id">#{data?.id_hotel_booking}</p>
                    </div>
                  </div>
                  <div className="admin-reservation__date">
                    <div className="admin-reservation__date-check">
                      <div className="admin-reservation__date-icon">
                        <SVGIcon src={Icons.CalendarGray} width={20} height={20} className="" />
                      </div>
                      <div className="admin-reservation__date-wrapper">
                        <div className="admin-reservation__title-content">Check-in</div>
                        <div className="admin-reservation__date-content">
                          <p className="admin-reservation__title-semibold">{data?.checkin ? formatDateToCustomString(data?.checkin) : ''}</p>
                          <p className="admin-reservation__caption-time">
                            {data?.checkin_from ? `(${formatTime(data?.checkin_from)})` : ''}
                            {data?.checkin_to ? ` - (${formatTime(data?.checkin_to)})` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="admin-reservation__date-check">
                      <div className="admin-reservation__date-icon">
                        <SVGIcon src={Icons.CalendarGray} width={20} height={20} className="" />
                      </div>
                      <div className="admin-reservation__date-wrapper">
                        <div className="admin-reservation__title-content">Check-out</div>
                        <div className="admin-reservation__date-content">
                          <p className="admin-reservation__title-semibold">{data?.checkout ? formatDateToCustomString(data?.checkout) : ''}</p>
                          <p className="admin-reservation__caption-time">
                            {data?.checkout_from ? `(${formatTime(data?.checkout_from)})` : ''}
                            {data?.checkout_to ? ` - (${formatTime(data?.checkout_to)})` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="admin-reservation__content-wrapper">
                    <div className="admin-reservation__content row">
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Duration</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Sun} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">{formatStayDuration(data?.checkin, data?.checkout)}</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Room</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Calendar} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">1 Room</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Guest</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Users} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">{data?.children_count + data?.adult_count} guest</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Received</div>
                        <div className="admin-reservation__info-content">
                          <p className="admin-reservation__title-semibold">{formatDateToCustomString(data?.reservation_book_date)}</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Preffered language</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Globe} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">{data?.languages ?? 'English'}</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Mail/Contact</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Mail} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">{data?.email}</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Channel</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Mail} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">goforumrah.com</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Commissionable amount</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Mail} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">$ {data?.commisionable_amount}</p>
                        </div>
                      </div>
                      <div className="admin-reservation__content-card">
                        <div className="admin-reservation__title-content">Commission</div>
                        <div className="admin-reservation__info-content">
                          <SVGIcon src={Icons.Mail} width={20} height={20} />
                          <p className="admin-reservation__title-semibold">$ {data?.commision}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="admin-reservation__info">
                    <div className="admin-reservation__info-title">
                      <p className="admin-reservation__title-semibold">Additional information</p>
                    </div>
                    <div className="admin-reservation__info-content--information">
                      {data?.special_request?.length === 0 ? (
                        <span>There are no special requests from customer</span>
                      ) : (
                        <>
                          {data?.special_request.map((item, index) => (
                            <p key={index} className='admin-reservation__info-content--paragraph'>
                              <SVGIcon src={Icons.CheckRoundedGreen} width={20} height={20} />
                              {item.guest_request},
                            </p>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="company-detail__content-form admin-reservation__form-right">
                  <div className="admin-reservation__form-button">
                    <div className={`admin-reservation__form-reservation ${statusReservation === 'Check-In' ? null : 'checked-in'}`}>
                      <p className="admin-reservation__title-bold">Update this reservation</p>
                      <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? null : 'd-none'} ${statusReservation === 'Check-Out' ? 'admin-reservation__button-reservation--out' : null}`} data-bs-toggle="modal" data-bs-target="#CheckOutModal" disabled={statusReservation === 'Check-Out'}> Mark as Check-out </button>
                      <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'} data-bs-toggle="modal" data-bs-target="#CheckInModal"> Mark as Check-in </button>
                      <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'} data-bs-toggle="modal" data-bs-target="#NoShowModal">Mark as no-show</button>
                      {/* <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'}>Change reservation date & price</button>
                      <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'}>Report guest misconduct</button> */}
                      <button onClick={handlePrint} type="button" className=" btn btn-md btn-outline-success admin-reservation__button-reservation">Print this page</button>
                    </div>
                    {statusReservation === 'Check-In' ? null : <div className="separator"></div>}
                    <div className={`admin-reservation__form-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null}`}>
                      <p className="admin-reservation__title-bold">Payment</p>
                      <button type="button" className={`btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'}>Mark credit card as invalid</button>
                      <button type="button" className={`btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'}>View credit card details</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-reservation__form row">
                <div className="company-detail__content-form admin-reservation__content-form">
                  <div className="admin-reservation__info-title admin-reservation__info-title--summary">
                    <h5 className="">{data?.room_type}</h5>
                    <h5 className="">$ {data?.price_amount}</h5>
                  </div>
                </div>
                {statusReservation === 'Check-In' || statusReservation === 'No-Show' || statusReservation === 'Check-Out' ? null : (
                  <div className='goform-tips--mini goform-tips__properties admin-reservation__form-right'>
                    <div className='goform-tips__icon goform-tips__icon-property'>
                      <SVGIcon src={Icons.Info} width={24} height={24} />
                    </div>
                    <div className="goform-tips__text">
                      <p className='admin-reservation__caption-title'>Guest didn’t show up ?</p>
                    </div>
                    <button type="button" className="admin-reservation__button-info--green">See tips</button>
                  </div>
                )}
              </div>
              <div className="">
              </div>
            </div>
          </div>
        </div>
        <PopupCheckIn idHotelBooking={idBooking ?? null} onStatusUpdate={(newStatus) => setStatusReservation(newStatus)} statusReservation={statusReservation} />
        <PopupCheckOut idHotelBooking={idBooking ?? null} onStatusUpdate={(newStatus) => setStatusReservation(newStatus)} statusReservation={statusReservation} />
        <PopupNoShow idHotelBooking={idBooking ?? null} room_type={data && data.room_type} onStatusUpdate={(newStatus) => setStatusReservation(newStatus)} statusReservation={statusReservation} />
      </InnerLayout>
    </Layout>
  )
}


const PopupCheckIn = ({ idHotelBooking, onStatusUpdate, statusReservation }) => {
  // console.log("Pop Up Check In : ", idHotelBooking);

  //Forms
  const [formData, setFormData] = useState({
    id_hotel_booking: idHotelBooking ?? null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { status, data, ok, error } = await callAPI('/hotel-business-reservation/mark-as-checkin', 'POST', formData, true);

      if (ok) {
        // console.log("Success: Booking marked as checked-in");
        // Update the status
        onStatusUpdate('Check-In');
        // console.log("Current Status:", statusReservation); // Log the current status prop value
      } else {
        console.log("Error: Failed to mark booking as checked-in");
        // Handle the error condition if the API call was not successful
      }
    } catch (error) {
      console.log("API Error: ", error);
      // Handle API error
    }
  };


  return (
    <div className="modal fade" id="CheckInModal" tabIndex={-1} aria-labelledby="CheckInModalLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-reservation__modal">
        <div className="modal-content admin-reservation__modal-content">
          <div className="admin-reservation__modal-wrapper">
            <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
              <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
            </div>
            <div className="company-detail__popup-contents">
              <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Mark as Check-In ?</h3>
              <p className="company-detail__content-caption--popup">You want to mark this booking that the customer has checked-in</p>
            </div>
          </div>
          <div className='company-detail__button-list-group row'>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form' onClick={handleSubmit}>Yes, Mark as Check-In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


const PopupCheckOut = ({ idHotelBooking, onStatusUpdate, statusReservation }) => {
  // console.log("Pop Up Check Out : ", idHotelBooking);

  //Forms
  const [formData, setFormData] = useState({
    id_hotel_booking: idHotelBooking ?? null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { status, data, ok, error } = await callAPI('/hotel-business-reservation/mark-as-checkout-v2', 'POST', formData, true);

      if (ok) {
        // console.log("Success: Booking marked as checked-out");
        // Update the status
        onStatusUpdate('Check-Out');
        // console.log("Current Status:", statusReservation); // Log the current status prop value
      } else {
        console.log("Error: Failed to mark booking as checked-out");
        // Handle the error condition if the API call was not successful
      }
    } catch (error) {
      console.log("API Error: ", error);
      // Handle API error
    }
  };


  return (
    <div className="modal fade" id="CheckOutModal" tabIndex={-1} aria-labelledby="CheckOutModalLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-reservation__modal">
        <div className="modal-content admin-reservation__modal-content">
          <div className="admin-reservation__modal-wrapper">
            <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
              <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
            </div>
            <div className="company-detail__popup-contents">
              <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Mark as Check-Out ?</h3>
              <p className="company-detail__content-caption--popup">You want to mark this booking that the customer has checked-out</p>
            </div>
          </div>
          <div className='company-detail__button-list-group row'>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form' onClick={handleSubmit}>Yes, Mark as Check-Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PopupNoShow = ({ idHotelBooking, room_type, onStatusUpdate, statusReservation }) => {
  // console.log("Pop Up No Show : ", idHotelBooking, "  ", room_type);

  //Forms
  const [formData, setFormData] = useState({
    id_hotel_booking: idHotelBooking ?? null,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { status, data, ok, error } = await callAPI('/hotel-business-reservation/mark-as-noshow', 'POST', formData, true);

      if (ok) {
        // console.log("Success: Booking marked as no-show");
        // Update the status
        onStatusUpdate('No-Show');
        // console.log("Current Status:", statusReservation); // Log the current status prop value
      } else {
        console.log("Error: Failed to mark booking as no-show");
        // Handle the error condition if the API call was not successful
      }
    } catch (error) {
      console.log("API Error: ", error);
      // Handle API error
    }
  };
  return (
    <div className="modal fade" id="NoShowModal" tabIndex={-1} aria-labelledby="NoShowModalLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-reservation__modal admin-reservation__modal--noshow">
        <div className="modal-content admin-reservation__modal-content-noshow">
          <div className="company-detail__popup-header">
            <h4 className="company-detail__content-title-heading">Mark No-Show</h4>
            <SVGIcon src={Icons.Cancel} width={20} height={20} className="" color="#616161" />
          </div>
          <div className="company-detail__popup-content-form">
            <p className="company-detail__caption-popup">{room_type}</p>
            <p className="company-detail__caption-popup--semibold">Do you want to waive the no-show fee for this reservation</p>
            <div className="company-detail__popup-radio">
              <div className="form-check">
                <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio1" defaultValue="yes" />
                <label className="form-check-label" htmlFor="acRadio1">Yes</label>
              </div>
              <div className="form-check">
                <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio2" defaultValue="no" />
                <label className="form-check-label" htmlFor="acRadio2">No</label>
              </div>
            </div>
          </div>
          <div className='company-detail__button-list-group company-detail__button-list-group--no-show row'>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
            </div>
            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--fill-red goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form' onClick={handleSubmit}>Yes, Mark as no-show</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  const { ok, data } = await callAPI('/hotel/list-property', 'POST', { id_hotel_business: session?.user?.id }, true)
  // console.log("Data propertyHotel: ", ok, data);
  if (ok && data?.length) {
    return {
      props: {
        propertyHotel: data
      }
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/business/hotel/empty',
      },
    }
  }
}

export default ReservationDetails
import React, { useEffect, useState } from 'react'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ManageCardList from '@/components/pages/manage/manageReview'
import UserLayout from '@/components/user/layout'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { StaticImageData } from "next/image"
import { BlurPlaceholderImage } from "@/components/elements/images"
import ReviewStar from '@/assets/images/review-star.svg'
import CheckCircle from '@/assets/images/icon_check_circle.svg'
import { fetchData } from 'next-auth/client/_utils'
import LoadingOverlay from '@/components/loadingOverlay'

const Pages = () => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState<boolean>(true)
  const [hotelBookings, setHotelBookings] = useState<any[]>([])
  const [carBookings, setCarBookings] = useState<any[]>([])
  const [tourBookings, setTourBookings] = useState<any[]>([])
  const bookingStatus = ['Payment Needed', 'Credit Card Not Verified', 'Confirmed', 'Rejected', 'Cancelled']
  const [review, setReview] = useState(null)

  const fetchReviewData = async () => {

    setLoading(true)

    if (!(status === 'authenticated') || !session) return

    await Promise.all([
      new Promise(async (resolve, reject) => {
        try {
          const { ok, data, error } = await callAPI('/hotel-booking/show', 'POST', { id_customer: session.user.id, sort: 1, checkout: 1 }, true)

          if (ok && data) {
            // const updatedData = await Promise.all(data.hotel.map(async (item) => {
            //   return ({ ...item })
            // }))
            setHotelBookings(data)
          }

          resolve(true)
        } catch (error) {
          reject(error)
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const { ok, data, error } = await callAPI('/car-business-booking/show-booking', 'POST', { id_customer: session.user.id, sort: 1, completed: 1 }, true)

          if (ok && data) {
            setCarBookings(data)
          }

          // TODO: Add an error exception when the data isn't retrieved or error occurred
          // console.error(error)

          resolve(true)
        } catch (error) {
          reject(error)
        }
      }),
      new Promise(async (resolve, reject) => {
        try {
          const { ok, data, error } = await callAPI('/tour-package/show-booking', 'POST', { id_customer: session.user.id, sort: 'DESC' }, true)

          if (ok && data) {
            //get only data with status 5 / completed using filter
            const updatedData = data.filter((item) => item.status === 5)
            setTourBookings(updatedData)
          }

          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
    ])
    setLoading(false)
  }

  useEffect(() => {
    fetchReviewData()
  }, [status])

  console.log(hotelBookings);
  const [typeBooking, setTypeBooking] = useState<any | null>(null); // State to store selected booking
  const [idBooking, setIdBooking] = useState<any | null>(null); // State to store selected booking
  const [idCustomer, setIdCustomer] = useState<any | null>(null); // State to store selected booking
  const [nameBooking, setNameBooking] = useState<any | null>(null); // State to store selected booking
  const [imageBooking, setImageBooking] = useState<any | null>(null); // State to store selected booking

  const handleReviewButtonClick = (typeBooking: any, bookingId: any, customerId: any, nameBooking: any, imageBooking: any) => {
    setTypeBooking(typeBooking)
    setIdBooking(bookingId);
    setIdCustomer(customerId);
    setNameBooking(nameBooking);
    setImageBooking(imageBooking);
  };

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu='review' header={{ title: 'Back', url: '/' }}>
        {loading ? (
          <LoadingOverlay />
        ) : (!hotelBookings.length ? (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-center">You don't have any active booking.</div>
        ) : (
          <div className="manage-review__content">
            <div className="manage-review__content-header">
              <h5 className="manage-review__content-header-title">Rate your trips</h5>
              <div className="manage-review__content-header-subtitle">Share with other travelers what you liked most about the places.</div>
            </div>
            <ManageReview
              hotelData={hotelBookings}
              carData={carBookings}
              tourData={tourBookings}
              onReviewButtonClick={handleReviewButtonClick}
            />
          </div>
        ))}
      </UserLayout>
      <ReviewModal1 />
      <ReviewModal2
        typeBooking={typeBooking}
        idBooking={idBooking}
        idCustomer={idCustomer}
        nameBooking={nameBooking}
        imageBooking={imageBooking}
        onActionForm={fetchReviewData}
      />
      <ReviewModal3
        typeBooking={typeBooking}
        idBooking={idBooking}
        idCustomer={idCustomer}
        nameBooking={nameBooking}
        imageBooking={imageBooking}
        onActionForm={fetchReviewData}
      />
      <ReviewModalConfirmation />
      <Footer />
    </Layout>
  )
}

interface ManageReviewProps {
  hotelData?: any;
  carData?: any;
  tourData?: any;
  onReviewButtonClick: (typeBooking: any, idBooking: any, idCustomer: any, nameBooking: any, imageBooking: any) => void; // Callback function
}
const ManageReview = (props: ManageReviewProps) => {
  const { data: session } = useSession()
  const bookingStatus = ['Payment Needed', 'Credit Card Not Verified', 'Confirmed', 'Rejected', 'Cancelled']

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

  function calculateDuration(pickupDate, dropoffDate) {
    const durationInMillis = Number(new Date(dropoffDate)) - Number(new Date(pickupDate));
    const days = Math.floor(durationInMillis / (1000 * 60 * 60 * 24));
    const hours = Math.floor((durationInMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = durationInMillis < (1000 * 60) ? Math.ceil(durationInMillis / (1000 * 60)) : 0;

    return (days ? `${days} day${days > 1 ? 's' : ''}` : (hours ? `${hours} hour${hours > 1 ? 's' : ''}` : `${minutes} minute`));
  }

  const managesHotel = props.hotelData.map(data => ({
    type: Services.Hotel,
    image: data.hotel?.hotel_photo[0]?.photo || Images.Placeholder,
    name: data.hotel.property_name,
    status: bookingStatus[data?.status],
    location: data.hotel.street_address,
    desc: {
      date: data.checkin, people: data.hotel_layout.guest_count,
      duration: `${Math.ceil(Number(new Date(data?.checkout)) - Number(new Date(data?.checkin))) / (1000 * 60 * 60 * 24)} Day`
    },
    linkURL: '#',
    id_booking: data.id_hotel_booking,
    id_customer: session.user.id,
    hotel_review: data.hotel_review
  }));

  const managesCar = props.carData.map(data => ({
    type: Services.BookTransfer,
    image: data.photo,
    name: data.car_brand + ' ' + data.model,
    status: bookingStatus[data?.status],
    location: data?.pickup + ' to ' + data?.dropoff,
    desc: {
      date: formatDate(data?.pickup_date_time), people: data?.quantity,
      duration: `${Math.ceil(Number(new Date(data?.dropoff_date_time)) - Number(new Date(data?.pickup_date_time))) / (1000 * 60 * 60 * 24)} Day`
    },
    linkURL: '#',
    id_booking: data?.id_car_booking,
    id_customer: session.user.id,
    hotel_review: data?.car_review
  }));

  const managesTour = props.tourData.map(data => ({
    type: Services.TourPackage,
    image: data?.photos[0]?.photo,
    name: data?.tour_package?.package_name,
    status: bookingStatus[data?.status],
    location: data?.tour_package?.address,
    desc: {
      date: formatDate(data?.start_date), people: data?.number_of_tickets,
      duration: `${Math.ceil(Number(new Date(data?.end_date)) - Number(new Date(data?.start_date))) / (1000 * 60 * 60 * 24)} Day`
    },
    linkURL: '#',
    id_booking: data?.id_tour_booking,
    id_customer: session.user.id,
    hotel_review: data?.tour_review
  }));



  // Combine all bookings into a unified array
  const allBookings = [
    ...props.hotelData.map((item) => ({
      created_at: item?.created_at,
      type: Services.Hotel,
      image: item?.hotel?.hotel_photo[0]?.photo || Images.Placeholder,
      name: item?.hotel.property_name,
      status: bookingStatus[item?.status],
      location: item?.hotel.street_address,
      desc: {
        date: formatDate(item?.checkin),
        people: item?.hotel_layout.guest_count,
        duration: calculateDuration(item?.checkin, item?.checkout)
      },
      linkURL: '#',
      id_booking: item?.id_hotel_booking,
      id_customer: session.user.id,
      hotel_review: item?.hotel_review
    })),
    ...props.carData.map((item) => ({
      created_at: item?.created_at,
      type: Services.BookTransfer,
      image: item?.photo,
      name: item?.car_brand + ' ' + item?.model,
      status: bookingStatus[item?.status],
      location: item?.pickup + ' to ' + item?.dropoff,
      desc: {
        date: formatDate(item?.pickup_date_time),
        people: item?.quantity,
        duration: calculateDuration(item?.pickup_date_time, item?.dropoff_date_time)
      },
      linkURL: '#',
      id_booking: item?.id_car_booking,
      id_customer: session.user.id,
      car_review: item?.car_review
    })),
    ...props.tourData.map((item) => ({
      created_at: item?.created_at,
      type: Services.TourPackage,
      image: item?.photos[0]?.photo,
      name: item?.tour_package?.package_name,
      status: bookingStatus[item?.status],
      location: item?.tour_package?.address,
      desc: {
        date: formatDate(item?.start_date),
        people: item?.number_of_tickets,
        duration: calculateDuration(item?.start_date, item?.end_date)
      },
      linkURL: '#',
      id_booking: item?.id_tour_booking,
      id_customer: session.user.id,
      tour_review: item?.tour_review
    }))
  ];

  // Sort the combined array by unified created_at and selectedSort
  allBookings.sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);

    // Use selectedSort instead of sortOrder
    return (1) * (dateB.getTime() - dateA.getTime());
  });

  // console.log("ManageReview : ", props.hotelData)
  // console.log("managesHotel ManageReview : ", managesHotel)
  // console.log("managesCar ManageReview : ", managesCar)

  // console.log("props.hotelData ManageReview : ", props.hotelData)
  // console.log("props.carData ManageReview : ", props.carData)
  // console.log("props.tourData ManageReview : ", props.tourData)
  // console.log("allBookings ManageReview : ", allBookings)


  const [idHotelBooking, setIdHotelBooking] = useState<any | null>(null); // State to store selected booking
  const [idCustomer, setIdCustomer] = useState<any | null>(null); // State to store selected booking


  const starRating = managesHotel?.hotel_review?.star || managesCar?.car_review?.star || managesTour?.tour_review?.star || 0;

  const stars = [];
  for (let i = 0; i < 5; i++) {
    const starColor = i < starRating ? "#EECA32" : "#D9E0E4";
    stars.push(<SVGIcon key={i} src={Icons.Star} width={24} height={24} color={starColor} />);
  }

  return (
    <div className="manage-review__content-list">
      <>
        {allBookings.map((booking, index) => (
          (booking.type === Services.Hotel && (
            <div key={index} className="manage-review__card">
              <img className="manage-review__card-image" src={booking.image} alt="Booking Image" width={220} height={220} />
              <div className="manage-review__card-content">
                <div className="manage-review__card-title">
                  <h5 className="manage-review__card-title-name">{booking.name}</h5>
                </div>
                <div className="manage-review__card-desc">
                  <div className="manage-review__card-desc-content">
                    <div className="manage-review__card-desc-description">
                      <div className="manage-review__card-desc-location">
                        <SVGIcon className="manage-review__card-desc-location--icon" src={Icons.MapPinOutline} width={24} height={24} />
                        <p>{booking.location}</p>
                      </div>
                      <div className="manage-review__card-desc-detail">
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.Calendar} width={20} height={20} />
                          <p>{booking.desc.date}</p>
                        </div>
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.User} width={20} height={20} />
                          <p>{booking.desc.people}</p>
                        </div>
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.Sun} width={20} height={20} />
                          <p>{booking.desc.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="manage-review__buttons-wrapper">
                      <div className="manage-review__buttons">
                        {booking.hotel_review == null
                          ? <button
                            type="button"
                            className="manage-review__buttons btn btn-lg btn-outline-success"
                            data-bs-toggle="modal"
                            data-bs-target="#reviewModal2"
                            onClick={(e) => {
                              e.preventDefault();
                              props.onReviewButtonClick(
                                booking.type,
                                booking.id_booking,
                                booking.id_customer,
                                booking.name,
                                booking.image
                              );
                            }}
                          >Write Review</button>
                          : <div style={{ display: 'flex' }}>
                            {Array.from({ length: Math.max(booking.hotel_review.star, 5) }, (_, index) => (
                              <SVGIcon key={index} src={Icons.Star} width={24} height={24} color={index < booking.hotel_review.star ? "#EECA32" : "#D9E0E4"} />
                            ))}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) ||
          (booking.type === Services.BookTransfer && (
            <div key={index} className="manage-review__card">
              <img className="manage-review__card-image" src={booking.image} alt="Booking Image" width={220} height={220} />
              <div className="manage-review__card-content">
                <div className="manage-review__card-title">
                  <h5 className="manage-review__card-title-name">{booking.name}</h5>
                </div>
                <div className="manage-review__card-desc">
                  <div className="manage-review__card-desc-content">
                    <div className="manage-review__card-desc-description">
                      <div className="manage-review__card-desc-location">
                        <SVGIcon className="manage-review__card-desc-location--icon" src={Icons.MapPinOutline} width={24} height={24} />
                        <p>{booking.location}</p>
                      </div>
                      <div className="manage-review__card-desc-detail">
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.Calendar} width={20} height={20} />
                          <p>{booking.desc.date}</p>
                        </div>
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.User} width={20} height={20} />
                          <p>{booking.desc.people}</p>
                        </div>
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.Sun} width={20} height={20} />
                          <p>{booking.desc.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="manage-review__buttons-wrapper">
                      <div className="manage-review__buttons">
                        {booking?.car_review == null
                          ? <button
                            type="button"
                            className="manage-review__buttons btn btn-lg btn-outline-success"
                            data-bs-toggle="modal"
                            data-bs-target="#reviewModal2"
                            onClick={(e) => {
                              e.preventDefault();
                              props.onReviewButtonClick(
                                booking?.type,
                                booking?.id_booking,
                                booking?.id_customer,
                                booking?.name,
                                booking?.image
                              );
                            }}
                          >Write Review</button>
                          : <div style={{ display: 'flex' }}>
                            {Array.from({ length: Math.max(booking?.car_review.star, 5) }, (_, index) => (
                              <SVGIcon key={index} src={Icons.Star} width={24} height={24} color={index < booking?.car_review.star ? "#EECA32" : "#D9E0E4"} />
                            ))}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) ||
          (booking.type === Services.TourPackage && (
            <div key={index} className="manage-review__card">
              <img className="manage-review__card-image" src={booking.image} alt="Booking Image" width={220} height={220} />
              <div className="manage-review__card-content">
                <div className="manage-review__card-title">
                  <h5 className="manage-review__card-title-name">{booking.name}</h5>
                </div>
                <div className="manage-review__card-desc">
                  <div className="manage-review__card-desc-content">
                    <div className="manage-review__card-desc-description">
                      <div className="manage-review__card-desc-location">
                        <SVGIcon className="manage-review__card-desc-location--icon" src={Icons.MapPinOutline} width={24} height={24} />
                        <p>{booking.location}</p>
                      </div>
                      <div className="manage-review__card-desc-detail">
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.Calendar} width={20} height={20} />
                          <p>{booking.desc.date}</p>
                        </div>
                        <div className="manage-review__card-desc-item">
                          {booking.desc.people > 1 ? <SVGIcon src={Icons.Users} width={20} height={20} /> : <SVGIcon src={Icons.User} width={20} height={20} />}
                          <p>{booking.desc.people}</p>
                        </div>
                        <div className="manage-review__card-desc-item">
                          <SVGIcon src={Icons.Sun} width={20} height={20} />
                          <p>{booking.desc.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="manage-review__buttons-wrapper">
                      <div className="manage-review__buttons">
                        {booking?.tour_review == null
                          ? <button
                            type="button"
                            className="manage-review__buttons btn btn-lg btn-outline-success"
                            data-bs-toggle="modal"
                            data-bs-target="#reviewModal3"
                            onClick={(e) => {
                              e.preventDefault();
                              props.onReviewButtonClick(
                                booking?.type,
                                booking?.id_booking,
                                booking?.id_customer,
                                booking?.name,
                                booking?.image
                              );
                            }}
                          >Write Review</button>
                          : <div style={{ display: 'flex' }}>
                            {Array.from({ length: Math.max(booking?.tour_review?.star, 5) }, (_, index) => (
                              <SVGIcon key={index} src={Icons.Star} width={24} height={24} color={index < booking?.tour_review?.star ? " #EECA32" : "#D9E0E4"} />
                            ))}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ))}
      </>
    </div>
  )
}

const ReviewModal1 = () => {
  const router = useRouter()
  return (
    <>
      <div className="modal fade" id="reviewModal1" tabIndex={-1} aria-labelledby="reviewLabel" aria-hidden="true">
        <div className="modal-dialog manage-review__modal">
          <div className="modal-content manage-review__modal-body">
            <div className="manage-review__modal-header">
              <div>
                <h5 className="">Rate your reviews</h5>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="manage-review__modal-desc">
              <BlurPlaceholderImage className="manage-review__modal-desc-image" src={Images.Placeholder} alt="Review Image" width={120} height={120} />
              <div className="manage-review__modal-review-detail">
                <div className="manage-review__modal-review-title">
                  <h4>Sheraton Makkah Jabal Al Kaaba</h4>
                </div>
                <div className="manage-review__modal-review-star">
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface ReviewModal2Props {
  typeBooking?: any;
  idBooking?: number;
  idCustomer?: number;
  nameBooking?: string;
  imageBooking?: string;
  onActionForm?: any;
}
const ReviewModal2 = (props: ReviewModal2Props) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  console.log('ReviewModal2 : ', props);

  //For Text Description
  const [reviewDescription, setReviewDescription] = useState<string | null>(null);

  //For Review Star
  const [hoverStarOverall, setHoverStarOverall] = useState<number | null>(null);
  const [activeStarOverall, setActiveStarOverall] = useState<number | null>(null);

  const [hoverStarStaff, setHoverStarStaff] = useState<number | null>(null);
  const [activeStarStaff, setActiveStarStaff] = useState<number | null>(null);

  const [hoverStarFacilities, setHoverStarFacilities] = useState<number | null>(null);
  const [activeStarFacilities, setActiveStarFacilities] = useState<number | null>(null);

  const [hoverStarClean, setHoverStarClean] = useState<number | null>(null);
  const [activeStarClean, setActiveStarClean] = useState<number | null>(null);

  const [hoverStarComfort, setHoverStarComfort] = useState<number | null>(null);
  const [activeStarComfort, setActiveStarComfort] = useState<number | null>(null);

  const [hoverStarMoney, setHoverStarMoney] = useState<number | null>(null);
  const [activeStarMoney, setActiveStarMoney] = useState<number | null>(null);

  const [hoverStarLocation, setHoverStarLocation] = useState<number | null>(null);
  const [activeStarLocation, setActiveStarLocation] = useState<number | null>(null);

  const [hoverStarCondition, setHoverStarCondition] = useState<number | null>(null);
  const [activeStarCondition, setActiveStarCondition] = useState<number | null>(null);


  const handleStarHover = (starNumber: number | null, category: string) => {
    if (starNumber !== null) {
      switch (category) {
        case 'ReviewStarOverall':
          setHoverStarOverall(starNumber);
          break;
        case 'ReviewStarStaff':
          setHoverStarStaff(starNumber);
          break;
        case 'ReviewStarFacilities':
          setHoverStarFacilities(starNumber);
          break;
        case 'ReviewStarClean':
          setHoverStarClean(starNumber);
          break;
        case 'ReviewStarComfort':
          setHoverStarComfort(starNumber);
          break;
        case 'ReviewStarMoney':
          setHoverStarMoney(starNumber);
          break;
        case 'ReviewStarLocation':
          setHoverStarLocation(starNumber);
          break;
        case 'ReviewStarCondition':
          setHoverStarCondition(starNumber);
          break;
        default:
          break;
      }
    } else {
      switch (category) {
        case 'ReviewStarOverall':
          setHoverStarOverall(null);
          break;
        case 'ReviewStarStaff':
          setHoverStarStaff(null);
          break;
        case 'ReviewStarFacilities':
          setHoverStarFacilities(null);
          break;
        case 'ReviewStarClean':
          setHoverStarClean(null);
          break;
        case 'ReviewStarComfort':
          setHoverStarComfort(starNumber);
          break;
        case 'ReviewStarMoney':
          setHoverStarMoney(starNumber);
          break;
        case 'ReviewStarLocation':
          setHoverStarLocation(starNumber);
          break;
        case 'ReviewStarCondition':
          setHoverStarCondition(starNumber);
          break;
        default:
          break;
      }
    }
  };

  const handleStarClick = (starNumber: number, category: string) => {
    switch (category) {
      case 'ReviewStarOverall':
        setActiveStarOverall(starNumber);
        break;
      case 'ReviewStarStaff':
        setActiveStarStaff(starNumber);
        break;
      case 'ReviewStarFacilities':
        setActiveStarFacilities(starNumber);
        break;
      case 'ReviewStarClean':
        setActiveStarClean(starNumber);
        break;
      case 'ReviewStarComfort':
        setActiveStarComfort(starNumber);
        break;
      case 'ReviewStarMoney':
        setActiveStarMoney(starNumber);
        break;
      case 'ReviewStarLocation':
        setActiveStarLocation(starNumber);
        break;
      case 'ReviewStarCondition':
        setActiveStarCondition(starNumber);
        break;
      default:
        break;
    }
  };

  //for Handle Submit to Submit to Apis Review
  //Forms
  const [formData, setFormData] = useState({
    "id_hotel_review": null,
    "id_customer": props.idCustomer,
    "id_hotel_booking": props.idBooking,
    "star": activeStarOverall,
    "staff": activeStarStaff,
    "facilities": activeStarFacilities,
    "clean": activeStarClean,
    "comfortable": activeStarComfort,
    "money": activeStarMoney,
    "location": activeStarLocation,
    "description": reviewDescription
  });

  //for Handle Submit to Submit to Apis Review
  //Forms
  const [formDataCar, setFormDataCar] = useState({
    "id_car_review": null,
    "id_customer": props.idCustomer,
    "id_car_booking": props.idBooking,
    "star": activeStarOverall,
    "staff": activeStarStaff,
    "facilities": activeStarFacilities,
    "clean": activeStarClean,
    "comfortable": activeStarComfort,
    "money": activeStarMoney,
    "condition": activeStarCondition,
    "description": reviewDescription
  });

  useEffect(() => {
    if (props.typeBooking === "hotel") {
      setFormData({
        "id_hotel_review": null,
        "id_customer": props.idCustomer,
        "id_hotel_booking": props.idBooking,
        "star": activeStarOverall,
        "staff": activeStarStaff,
        "facilities": activeStarFacilities,
        "clean": activeStarClean,
        "comfortable": activeStarComfort,
        "money": activeStarMoney,
        "location": activeStarLocation,
        "description": reviewDescription
      });
    }

    if (props.typeBooking === "book-transfer") {
      setFormDataCar({
        "id_car_review": null,
        "id_customer": props.idCustomer,
        "id_car_booking": props.idBooking,
        "star": activeStarOverall,
        "staff": activeStarStaff,
        "facilities": activeStarFacilities,
        "clean": activeStarClean,
        "comfortable": activeStarComfort,
        "money": activeStarMoney,
        "condition": activeStarCondition,
        "description": reviewDescription
      });
    }

    console.log('Updated Form Data : ', formData);
  }, [props.idCustomer, props.idBooking, activeStarOverall, activeStarStaff, activeStarFacilities, activeStarClean, activeStarComfort, activeStarMoney, activeStarLocation, activeStarCondition, reviewDescription]);



  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (props.typeBooking === "hotel") {
      console.log("formdata  : ", formData);
      event.preventDefault();

      const { status, data, ok, error } = await callAPI('/hotel-review/store', 'POST', formData, true)
      if (ok) {
        console.log("success api handle submit review hotel store   ", status, data, ok, error);
        props.onActionForm()
      } else {
        console.log("fail to handle submit post api review hotel store   ", status, data, ok, error);
      }
    } else if (props.typeBooking === "book-transfer") {
      console.log("formdata  : ", formData);
      event.preventDefault();

      const { status, data, ok, error } = await callAPI('/car-review/store', 'POST', formDataCar, true)
      if (ok) {
        console.log("success api handle submit review book-transfer store   ", status, data, ok, error);
        props.onActionForm()
      } else {
        console.log("fail to handle submit post api review book-transfer store   ", status, data, ok, error);
      }
    } else {
      return
    }
  };

  // Reset activeStar and hoverStar states to null when the modal is closed and reopened
  useEffect(() => {
    const resetStars = () => {
      setActiveStarOverall(null);
      setHoverStarOverall(null);
      setActiveStarStaff(null);
      setHoverStarStaff(null);
      setActiveStarFacilities(null);
      setHoverStarFacilities(null);
      setActiveStarClean(null);
      setHoverStarClean(null);
      setActiveStarComfort(null);
      setHoverStarComfort(null);
      setActiveStarMoney(null);
      setHoverStarMoney(null);
      setActiveStarLocation(null);
      setHoverStarLocation(null);
      setActiveStarCondition(null);
      setHoverStarCondition(null);
      setReviewDescription('');
    };

    const modalElement = document.getElementById('reviewModal2');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', resetStars);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('show.bs.modal', resetStars);
      }
    };
  }, []);


  return (
    <>
      <div className="modal fade" id="reviewModal2" tabIndex={-1} aria-labelledby="reviewLabel" aria-hidden="true">
        <div className="modal-dialog manage-review__modal">
          <div className="modal-content manage-review__modal-body">
            <div className="manage-review__modal-header">
              <div>
                <h5 className="">Rate your reviews</h5>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="manage-review__modal-desc-question">
              <img className="manage-review__modal-desc-question-image" src={props.imageBooking || Images.Placeholder} alt="Review Image" width={120} height={120} />
              <div className="manage-review__modal-review-detail">
                <div className="manage-review__modal-review-title">
                  <h4>{props.nameBooking}</h4>
                </div>
                <div className="manage-review__modal-review-star">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <div
                      className={`modalContentReviewRatingItem
                        ${hoverStarOverall !== null && starNumber <= hoverStarOverall && 'activeHovered'}
                        ${activeStarOverall !== null && starNumber <= activeStarOverall && 'activeChecked'}`}
                      key={starNumber}
                    >
                      <input
                        type="checkbox"
                        id={`ReviewStarOverall${starNumber}`}
                        name="ReviewStarOverall"
                        value={`ReviewStarOverall${starNumber}`}
                        className="modalContentReviewRatingItemCheck"
                      />
                      <label
                        htmlFor={`ReviewStarOverall${starNumber}`}
                        className="modalContentReviewRatingItemCheckLabel"
                        onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarOverall')}
                        onMouseLeave={() => handleStarHover(null, 'ReviewStarOverall')}
                        onClick={() => handleStarClick(starNumber, 'ReviewStarOverall')}
                      >
                        <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="manage-review__modal-review-question-wrapper">
              <div className="manage-review__modal-review-question">
                <span className="manage-review__modal-review-question-title">
                  How Were The Staff ?
                </span>
                <div className="manage-review__modal-review-star">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <div
                      className={`modalContentReviewRatingItem
                        ${hoverStarStaff !== null && starNumber <= hoverStarStaff && 'activeHovered'}
                        ${activeStarStaff !== null && starNumber <= activeStarStaff && 'activeChecked'}`}
                      key={starNumber}
                    >
                      <input
                        type="checkbox"
                        id={`ReviewStarStaff${starNumber}`}
                        name="ReviewStarStaff"
                        value={`ReviewStarStaff${starNumber}`}
                        className="modalContentReviewRatingItemCheck"
                      />
                      <label
                        htmlFor={`ReviewStarStaff${starNumber}`}
                        className="modalContentReviewRatingItemCheckLabel"
                        onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarStaff')}
                        onMouseLeave={() => handleStarHover(null, 'ReviewStarStaff')}
                        onClick={() => handleStarClick(starNumber, 'ReviewStarStaff')}
                      >
                        <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="manage-review__modal-review-question">
                <span className="manage-review__modal-review-question-title">
                  How Were The Facilities ?
                </span>
                <div className="manage-review__modal-review-star">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <div
                      className={`modalContentReviewRatingItem
                        ${hoverStarFacilities !== null && starNumber <= hoverStarFacilities && 'activeHovered'}
                        ${activeStarFacilities !== null && starNumber <= activeStarFacilities && 'activeChecked'}`}
                      key={starNumber}
                    >
                      <input
                        type="checkbox"
                        id={`ReviewStarFacilities${starNumber}`}
                        name="ReviewStarFacilities"
                        value={`ReviewStarFacilities${starNumber}`}
                        className="modalContentReviewRatingItemCheck"
                      />
                      <label
                        htmlFor={`ReviewStarFacilities${starNumber}`}
                        className="modalContentReviewRatingItemCheckLabel"
                        onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarFacilities')}
                        onMouseLeave={() => handleStarHover(null, 'ReviewStarFacilities')}
                        onClick={() => handleStarClick(starNumber, 'ReviewStarFacilities')}
                      >
                        <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="manage-review__modal-review-question">
                <span className="manage-review__modal-review-question-title">
                  Was it clean ?
                </span>
                <div className="manage-review__modal-review-star">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <div
                      className={`modalContentReviewRatingItem
                        ${hoverStarClean !== null && starNumber <= hoverStarClean && 'activeHovered'}
                        ${activeStarClean !== null && starNumber <= activeStarClean && 'activeChecked'}`}
                      key={starNumber}
                    >
                      <input
                        type="checkbox"
                        id={`ReviewStarClean${starNumber}`}
                        name="ReviewStarClean"
                        value={`ReviewStarClean${starNumber}`}
                        className="modalContentReviewRatingItemCheck"
                      />
                      <label
                        htmlFor={`ReviewStarClean${starNumber}`}
                        className="modalContentReviewRatingItemCheckLabel"
                        onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarClean')}
                        onMouseLeave={() => handleStarHover(null, 'ReviewStarClean')}
                        onClick={() => handleStarClick(starNumber, 'ReviewStarClean')}
                      >
                        <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="manage-review__modal-review-question">
                <span className="manage-review__modal-review-question-title">
                  Was it comfortable ?
                </span>
                <div className="manage-review__modal-review-star">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <div
                      className={`modalContentReviewRatingItem
                        ${hoverStarComfort !== null && starNumber <= hoverStarComfort && 'activeHovered'}
                        ${activeStarComfort !== null && starNumber <= activeStarComfort && 'activeChecked'}`}
                      key={starNumber}
                    >
                      <input
                        type="checkbox"
                        id={`ReviewStarComfort${starNumber}`}
                        name="ReviewStarComfort"
                        value={`ReviewStarComfort${starNumber}`}
                        className="modalContentReviewRatingItemCheck"
                      />
                      <label
                        htmlFor={`ReviewStarComfort${starNumber}`}
                        className="modalContentReviewRatingItemCheckLabel"
                        onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarComfort')}
                        onMouseLeave={() => handleStarHover(null, 'ReviewStarComfort')}
                        onClick={() => handleStarClick(starNumber, 'ReviewStarComfort')}
                      >
                        <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="manage-review__modal-review-question">
                <span className="manage-review__modal-review-question-title">
                  Was it good value for money ?
                </span>
                <div className="manage-review__modal-review-star">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <div
                      className={`modalContentReviewRatingItem
                        ${hoverStarMoney !== null && starNumber <= hoverStarMoney && 'activeHovered'}
                        ${activeStarMoney !== null && starNumber <= activeStarMoney && 'activeChecked'}`}
                      key={starNumber}
                    >
                      <input
                        type="checkbox"
                        id={`ReviewStarMoney${starNumber}`}
                        name="ReviewStarMoney"
                        value={`ReviewStarMoney${starNumber}`}
                        className="modalContentReviewRatingItemCheck"
                      />
                      <label
                        htmlFor={`ReviewStarMoney${starNumber}`}
                        className="modalContentReviewRatingItemCheckLabel"
                        onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarMoney')}
                        onMouseLeave={() => handleStarHover(null, 'ReviewStarMoney')}
                        onClick={() => handleStarClick(starNumber, 'ReviewStarMoney')}
                      >
                        <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              {props.typeBooking === "hotel" ? (
                <>
                  <div className="manage-review__modal-review-question">
                    <span className="manage-review__modal-review-question-title">
                      How was the location ?
                    </span>
                    <div className="manage-review__modal-review-star">
                      {[1, 2, 3, 4, 5].map((starNumber) => (
                        <div
                          className={`modalContentReviewRatingItem
                            ${hoverStarLocation !== null && starNumber <= hoverStarLocation && 'activeHovered'}
                            ${activeStarLocation !== null && starNumber <= activeStarLocation && 'activeChecked'}`}
                          key={starNumber}
                        >
                          <input
                            type="checkbox"
                            id={`ReviewStarLocation${starNumber}`}
                            name="ReviewStarLocation"
                            value={`ReviewStarLocation${starNumber}`}
                            className="modalContentReviewRatingItemCheck"
                          />
                          <label
                            htmlFor={`ReviewStarLocation${starNumber}`}
                            className="modalContentReviewRatingItemCheckLabel"
                            onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarLocation')}
                            onMouseLeave={() => handleStarHover(null, 'ReviewStarLocation')}
                            onClick={() => handleStarClick(starNumber, 'ReviewStarLocation')}
                          >
                            <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : props.typeBooking === "book-transfer" ? (
                <>
                  <div className="manage-review__modal-review-question">
                    <span className="manage-review__modal-review-question-title">
                      How was the condition ?
                    </span>
                    <div className="manage-review__modal-review-star">
                      {[1, 2, 3, 4, 5].map((starNumber) => (
                        <div
                          className={`modalContentReviewRatingItem
                            ${hoverStarCondition !== null && starNumber <= hoverStarCondition && 'activeHovered'}
                            ${activeStarCondition !== null && starNumber <= activeStarCondition && 'activeChecked'}`}
                          key={starNumber}
                        >
                          <input
                            type="checkbox"
                            id={`ReviewStarCondition${starNumber}`}
                            name="ReviewStarCondition"
                            value={`ReviewStarCondition${starNumber}`}
                            className="modalContentReviewRatingItemCheck"
                          />
                          <label
                            htmlFor={`ReviewStarCondition${starNumber}`}
                            className="modalContentReviewRatingItemCheckLabel"
                            onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarCondition')}
                            onMouseLeave={() => handleStarHover(null, 'ReviewStarCondition')}
                            onClick={() => handleStarClick(starNumber, 'ReviewStarCondition')}
                          >
                            <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
              <div className="manage-review__modal-review-question">
                <span className="manage-review__modal-review-question-title">
                  Tell us a litte more
                </span>
                <div className="manage-review__modal-review-form">
                  <textarea className="manage-review__modal-review-form-desc" name="ReviewDescription" placeholder="Type your taglines here.." rows={6} onChange={(e) => setReviewDescription(e.target.value)} value={reviewDescription}></textarea>
                </div>
              </div>
            </div>
            <div className="manage-review__modal-footer">
              <div className="manage-review__buttons">
                <button type="button" className="manage-review__buttons btn btn-lg btn-outline-success" data-bs-toggle="modal" data-bs-target="#reviewModal2" > Cancel</button>
              </div>
              <div className="manage-review__buttons">
                <button type="button" className="manage-review__buttons btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#reviewModalConfirmation"
                  onClick={handleSubmit} // Attach the onClick event handler here
                > Save </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface ReviewModal3Props {
  typeBooking?: any;
  idBooking?: number;
  idCustomer?: number;
  nameBooking?: string;
  imageBooking?: string;
  onActionForm?: any;
}

const ReviewModal3 = (props: ReviewModal3Props) => {
  console.log('ReviewModal3 : ', props);

  //For Text Description
  const [reviewDescription, setReviewDescription] = useState<string | null>(null);

  //For Review Star
  const [hoverStarOverall, setHoverStarOverall] = useState<number | null>(null);
  const [activeStarOverall, setActiveStarOverall] = useState<number | null>(null);


  const handleStarHover = (starNumber: number | null, category: string) => {
    if (starNumber !== null) {
      switch (category) {
        case 'ReviewStarOverall':
          setHoverStarOverall(starNumber);
          break;
        default:
          break;
      }
    } else {
      switch (category) {
        case 'ReviewStarOverall':
          setHoverStarOverall(null);
          break;
        default:
          break;
      }
    }
  };

  const handleStarClick = (starNumber: number, category: string) => {
    switch (category) {
      case 'ReviewStarOverall':
        setActiveStarOverall(starNumber);
        break;
      default:
        break;
    }
  };

  //for Handle Submit to Submit to Apis Review
  //Forms
  const [formDataTour, setFormDataTour] = useState({
    "id_tour_booking": props.idBooking,
    "id_customer": props.idCustomer,
    "star": activeStarOverall,
    "description": reviewDescription
  });

  useEffect(() => {
    if (props.typeBooking === "tour-package") {
      setFormDataTour({
        "id_tour_booking": props.idBooking,
        "id_customer": props.idCustomer,
        "star": activeStarOverall,
        "description": reviewDescription
      })
    }

    console.log('Updated Form Data Tour : ', formDataTour);
  }, [props.idCustomer, props.idBooking, activeStarOverall, reviewDescription]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

    if (props.typeBooking === "tour-package") {
      console.log("formdata  : ", formDataTour);
      event.preventDefault();

      const { status, data, ok, error } = await callAPI('/tour-package/customer-review', 'POST', formDataTour, true)
      if (ok) {
        console.log("success api handle submit review tour store   ", status, data, ok, error);
        props.onActionForm()
      } else {
        console.log("fail to handle submit post api review tour store   ", status, data, ok, error);
      }
    } else {
      return
    }

  }

  // Reset activeStar and hoverStar states to null when the modal is closed and reopened
  useEffect(() => {
    const resetStars = () => {
      setActiveStarOverall(null);
      setHoverStarOverall(null);
      setReviewDescription('');
    };

    const modalElement = document.getElementById('reviewModal3');
    if (modalElement) {
      modalElement.addEventListener('show.bs.modal', resetStars);
    }

    return () => {
      if (modalElement) {
        modalElement.removeEventListener('show.bs.modal', resetStars);
      }
    };
  }, []);

  return (
    <>
      <div className="modal fade" id="reviewModal3" tabIndex={-1} aria-labelledby="reviewLabel" aria-hidden="true">
        <div className="modal-dialog manage-review__modal">
          <div className="modal-content manage-review__modal-body">
            <div className="manage-review__modal-header">
              <div>
                <h5 className="">Rate your reviews</h5>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="manage-review__modal-desc-question">
              <img className="manage-review__modal-desc-question-image" src={props.imageBooking || Images.Placeholder} alt="Review Image" width={120} height={120} />
              <div className="manage-review__modal-review-detail">
                <div className="manage-review__modal-review-title">
                  <h4>{props.nameBooking}</h4>
                </div>
                <div className="manage-review__modal-review-star">
                  {[1, 2, 3, 4, 5].map((starNumber) => (
                    <div
                      className={`modalContentReviewRatingItem
                        ${hoverStarOverall !== null && starNumber <= hoverStarOverall && 'activeHovered'}
                        ${activeStarOverall !== null && starNumber <= activeStarOverall && 'activeChecked'}`}
                      key={starNumber}
                    >
                      <input
                        type="checkbox"
                        id={`ReviewStarOverall${starNumber}`}
                        name="ReviewStarOverall"
                        value={`ReviewStarOverall${starNumber}`}
                        className="modalContentReviewRatingItemCheck"
                      />
                      <label
                        htmlFor={`ReviewStarOverall${starNumber}`}
                        className="modalContentReviewRatingItemCheckLabel"
                        onMouseEnter={() => handleStarHover(starNumber, 'ReviewStarOverall')}
                        onMouseLeave={() => handleStarHover(null, 'ReviewStarOverall')}
                        onClick={() => handleStarClick(starNumber, 'ReviewStarOverall')}
                      >
                        <SVGIcon className="modalContentReviewRatingItemCheckLabelIcon" src={Icons.StarOutline} width={24} height={24} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="manage-review__modal-review-question-wrapper">
              <div className="manage-review__modal-review-question">
                <span className="manage-review__modal-review-question-title">
                  Tell us about your experience
                </span>
                <div className="manage-review__modal-review-form">
                  <textarea className="manage-review__modal-review-form-desc" name="ReviewDescription" placeholder="Type your taglines here.." rows={6} onChange={(e) => setReviewDescription(e.target.value)} value={reviewDescription}></textarea>
                </div>
              </div>
            </div>

            <div className="manage-review__modal-footer">
              <div className="manage-review__buttons">
                <button type="button" className="manage-review__buttons btn btn-lg btn-outline-success" data-bs-toggle="modal" data-bs-target="#reviewModal3" > Cancel</button>
              </div>
              <div className="manage-review__buttons">
                <button type="button" className="manage-review__buttons btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#reviewModalConfirmation"
                  onClick={handleSubmit} // Attach the onClick event handler here
                > Save </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

}

const ReviewModalConfirmation = () => {
  const router = useRouter()

  return (
    <>
      <div className="modal fade" id="reviewModalConfirmation" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog manage-review__modal-complete">
          <div className="modal-content manage-review__modal-complete-body">
            <div className="manage-review__modal-complete-header">
              <div>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="manage-review__modal-complete-content">
              <div className="manage-review__modal-complete-image">
                <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
              </div>
              <div className="manage-review__modal-complete-text">
                <h4>Thank for your sharing</h4>
                <p className="manage-review__modal-complete-desc">
                  We’ve just sent your review to our moderation team . They’ll check that it follows our guideline and let you know as soon as they add to the site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Pages
import React, { useEffect, useRef, useState } from 'react'
import { callAPI } from '@/lib/axiosHelper'
import { useRouter } from 'next/router'
import moment from 'moment'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { useSession } from 'next-auth/react'

import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import carImagery1 from '@/assets/images/car_details_image_1.png'
import carImagery2 from '@/assets/images/car_details_image_2.png'
import kingAbdulazizAirport from '@/assets/images/king_abdulaziz_international_airport.png'
import LoadingOverlay from '@/components/loadingOverlay'
import { UseCurrencyConverter } from '@/components/convertCurrency'
import DropdownMenu from '@/components/elements/dropdownMenu'


interface DetailProps {
  data: any
}
const CarDetails = (props: DetailProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: id_car_business_fleet, checkin, checkout, status: statusQuery } = router.query;
  console.log("id_car_business_fleet : ", id_car_business_fleet);
  console.log("checkin : ", checkin);
  console.log("checkout : ", checkout);
  const { data } = props;

  console.log("Session : ", session);
  const [buttonReady, setButtonReady] = useState(false);

  useEffect(() => {
    // Check if the button is ready
    const button = document.getElementById("auth-login-button");
    if (button) {
      setButtonReady(true);
    }
  }, []);

  useEffect(() => {
    // When the statusQuery changes and the button is ready, open the modal
    if (statusQuery === "unauthenticated" && buttonReady) {
      setTimeout(() => {
        const button = document.getElementById("auth-login-button");
        if (button) {
          button.click();
        }
      }, 0); // Delay execution to ensure the button is in the DOM
    }
  }, [statusQuery, buttonReady]);


  const handleBookClick = () => {
    if (session?.user) {
      // User is logged in, proceed with booking
      router.push(`/booking/book-transfer/${id_car_business_fleet}?checkin=${checkin}&checkout=${checkout}`);
    } else {
      setTimeout(() => {
        const button = document.getElementById("auth-login-button");
        if (button) {
          button.click();
        }
      }, 0); // Delay execution to ensure the button is in the DOM
    }
  };

  console.log("data : ", data);
  return (
    <Layout>
      <Navbar showCurrency={true} />
      <div className="hotel-details car-details">
        <CarTopNav />
        <div className="container">
          <div className="hotel-details__header">
            <CarBreadCrumb data={data} />
            <div className="hotel-details__content">
              <CarDetailBrand data={data} />
              <CarDetailsImagery data={data} />
              <CarDetailsSummary data={data} id_car_business_fleet={id_car_business_fleet} checkin={checkin} checkout={checkout} handleBookClick={handleBookClick} />
              <CarDetailsPassengerReview />
              {/* <CarDetailsMoreInformation /> */}
              <CarDetailSimilar data={data} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  )
}

const CarTopNav = () => {
  return (
    <div className="container hotel-details__nav">
      <a href="#Details" className="hotel-details__nav-item active">Details</a>
      <a href='#Reviews' className="hotel-details__nav-item">Reviews</a>
      {/* <a href='#ImportantInfo' className="hotel-details__nav-item">Important Info</a> */}
    </div>
  )
}

const CarBreadCrumb = (data: any) => {
  return (
    <div className="hotel-details__header-breadcrumb">
      <Link className="hotel-details__header-breadcrumb--link" href="/">Home</Link>
      <p>/</p>
      <Link className="hotel-details__header-breadcrumb--link" href="#" onClick={() => window.history.back()}>Search Car</Link>
      <p>/</p>
      <p className="hotel-details__header-breadcrumb--current">{data?.data?.car_brand} {data?.data?.model} {data?.data?.edition}</p>
    </div>
  )
}

const CarDetailBrand = (props) => {
  const { data } = props;
  console.log("Car Detail Brand : ", data)
  return (
    <div id='#Details'>
      <div className="hotel-details__brand">
        <img src={data?.car_company?.profile_icon ? data?.car_company?.profile_icon : Images.Placeholder} className="hotel-details__brand-logo" alt="Trending City" width={60} height={60} />
        <div className="hotel-details__brand-content">
          <h5>{data?.car_company?.name}</h5>
          <div className="hotel-details__brand-rating">
            <SVGIcon src={Icons.Star} width={20} height={20} color="#EECA32" />
            <div className="hotel-details__brand-chips">{data?.car_company?.rating?.toFixed(1)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CarDetailsImagery = ({ data }) => {
  const firstPhoto = data.photos?.[0]?.photo;
  const restPhotos = data.photos.slice(1, 5);
  return (
    <div className="hotel-details__imagery hotel-details__imagery-featured">
      <img src={firstPhoto || carImagery1} alt="Car Photo" width={644} height={468} />
      <div className="hotel-details__imagery-src">
        {!!restPhotos.length ? (
          restPhotos.map((photo, index) => (
            <img key={index} src={photo.photo || carImagery2} alt="Car Photo" width={230} height={230} />
          ))
        ) : (
          <>
            <img
              src={Images.Placeholder}
              alt="Car Photo"
              width={270}
              height={230}
            />
            <img
              src={Images.Placeholder}
              alt="Car Photo"
              width={270}
              height={230}
            />
            <img
              src={Images.Placeholder}
              alt="Car Photo"
              width={270}
              height={230}
            />
            <img
              src={Images.Placeholder}
              alt="Car Photo"
              width={270}
              height={230}
            />
          </>
        )}
      </div>
    </div>
  )
}

const CarDetailsSummary = ({ data, id_car_business_fleet, checkin, checkout, handleBookClick }) => {

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
  const [showAllFacilities, setShowAllFacilities] = useState(false);

  // Function to get the facility object based on name_facility
  const getFacilityObject = (nameFacility) => {
    return data?.car_facilities.find(facility => facility.name_facility === nameFacility);
  };

  // Mapping between facility names and their corresponding icons
  const facilityIcons = {
    'Seat': Icons.Seats,
    'Doors': Icons.Door,
    'Transmission': Icons.Compas,
    'Air Condition': Icons.AirConditioner,
    'Baggage': Icons.Car,
    'Baby Seat': Icons.Seats,
    'Wifi': Icons.FacilitiesWifi,
    'Child Seat': Icons.Seats,
    // Add more mappings as needed
  };

  // Function to render a facility item
  const renderFacilityItem = (nameFacility) => {
    const facility = getFacilityObject(nameFacility);
    const icon = facilityIcons[nameFacility] || Icons.Car; // Use a default icon if not found

    if (nameFacility === 'Seat' || nameFacility === 'Doors') {
      // Customize rendering for 'Seat' and 'Doors'
      return (
        <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
          <SVGIcon src={icon} width={20} height={20} />
          <p>{facility?.amount} {nameFacility}</p>
        </div>
      );
    } if (nameFacility === 'Transmission') {
      // Customize rendering for 'Seat' and 'Doors'
      return (
        <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
          <SVGIcon src={icon} width={20} height={20} />
          <p>{facility?.amount}</p>
        </div>
      );
    } else {
      // Default rendering for other facilities
      return (
        facility?.amount === 'yes' && (
          <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
            <SVGIcon src={icon} width={20} height={20} />
            <p>{nameFacility}</p>
          </div>
        )
      );
    }
  };
  const { changePrice, currencySymbol } = UseCurrencyConverter();
  return (
    <div className="hotel-details__summary">
      <div className="hotel-details__summary-main">
        <div className="hotel-details__summary-item">
          <h3>{data?.car_brand} {data?.model} {data?.edition}</h3>
          <div className="hotel-details__summary-left-stars">
            <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
            <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
            <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
            <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
            <SVGIcon src={Icons.Star} width={32} height={32} color="#EECA32" />
          </div>
          <div className="hotel-details__summary-left-location">
            <div className="hotel-details__summary-left-details">
              <SVGIcon src={Icons.Users} width={20} height={20} className="" />
              <p>{data?.quantity ?? 0} passengers</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__summary-item">
          <div className="hotel-details__summary-benefit">
            <SVGIcon src={Icons.MapPinOutline} width={24} height={24} color="#616161" />
            <div className="mb-1">
              <p className="hotel-details__summary-benefit-title">{data?.book_details?.pickup}</p>
              <p className="hotel-details__summary-benefit-subtitle">{data?.city}</p>
            </div>
          </div>
          <div className="hotel-details__summary-benefit">
            <SVGIcon src={Icons.Help} width={24} height={24} color="#616161" />
            <div className="mb-1">
              <p className="hotel-details__summary-benefit-title">Helpful counter staff</p>
              <p className="hotel-details__summary-benefit-subtitle">97% of recent passengers rated our staff 5-star in communication.</p>
            </div>
          </div>
          <div className="hotel-details__summary-benefit">
            <SVGIcon src={Icons.Car} width={24} height={24} color="#616161" />
            <div className="mb-1">
              <p className="hotel-details__summary-benefit-title">Great Driver Communication</p>
              <p className="hotel-details__summary-benefit-subtitle">97% of recent passengers rated our drivers 5-star in communication.</p>
            </div>
          </div>

        </div>
        <div className="hotel-details__summary-item">
          <p className="hotel-details__summary-item-title">Facilities</p>
          <div className="hotel-details__desc-facilities car-facilities">
            {showAllFacilities ?
              data?.car_facilities.map(({ name_facility }) => renderFacilityItem(name_facility)) : ['Seat', 'Doors', 'Transmission', 'Air Condition'].map(nameFacility =>
                renderFacilityItem(nameFacility)
              )}
            {data?.car_facilities.length > 4 && (
              <button
                onClick={() => setShowAllFacilities(!showAllFacilities)}
                className="hotel-details__desc-facilities-more btn btn-lg btn-outline-success text-neutral-primary"
              >
                {showAllFacilities ? 'See less facilities' : 'See more facilities'}
              </button>
            )}
          </div>
          {/* <div className="hotel-details__desc-facilities">            
            {getFacilityObject("Seat")?.status === 1 && (
              <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
                <SVGIcon src={Icons.Seats} width={20} height={20} />
                <p>{getFacilityObject("Seat")?.amount} Seats</p>
              </div>   
            )}                   
            {getFacilityObject("Doors")?.status === 1 && (    
              <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
                <SVGIcon src={Icons.Door} width={20} height={20} />
                <p>{getFacilityObject("Doors")?.amount} Doors</p>
              </div>      
            )}                     
            {getFacilityObject("Transmission")?.status === 1 && (    
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.Compas} width={20} height={20} />
              <p>{getFacilityObject("Transmission")?.amount}</p>
            </div>     
            )}                   
            {getFacilityObject("Air Condition")?.status === 1 && (    
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
              <p>Air Conditioning</p>
            </div>     
            )}                       
            {getFacilityObject("Baggage")?.status === 1 && (    
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
              <p>Baggage</p>
            </div>     
            )}                        
            {getFacilityObject("Baby Seat")?.status === 1 && (    
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
              <p>Baby Seat</p>
            </div>     
            )}                         
            {getFacilityObject("Wifi")?.status === 1 && (    
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
              <p>Wifi</p>
            </div>     
            )}                         
            {getFacilityObject("Child Seat")?.status === 1 && (    
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
              <p>Child Seat</p>
            </div>     
            )}  
            <button className="hotel-details__desc-facilities-more btn btn-lg btn-outline-success text-neutral-primary">See more fasilities</button>
          </div> */}
        </div>

        <div className="hotel-details__summary-item hotel-details__summary-item--row">
          <div className="hotel-details__summary-item hotel-details__summary-item--borderless">
            <p className="hotel-details__summary-item-title">Included</p>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Free cancellation up to 48 hours before pick-up</p>
            </div>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Theft Protection with $1,336 excess</p>
            </div>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Collision Damage Waiver with $1,336 deductible</p>
            </div>
          </div>
          <div className="hotel-details__summary-item hotel-details__summary-item--borderless">
            <p className="hotel-details__summary-item-title">Not Included</p>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Entrance ticket to tourist attraction</p>
            </div>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Overtime</p>
            </div>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Entrance ticket to tourist attraction</p>
            </div>
            <div className="hotel-details__summary-disclaimer">
              <SVGIcon className="hotel-details__summary-disclaimer-icon" src={Icons.Check} width={20} height={20} />
              <p>Usage’s outside the main lease zone</p>
            </div>
          </div>

        </div>

      </div>
      <div className="hotel-details__sidecontent">
        <div className="hotel-details__sidecontent-details">
          <p className="hotel-details__sidecontent-details-title">Starts from</p>
          <div className="hotel-details__sidecontent-booking">
            <BlurPlaceholderImage className="hotel-details__sidecontent-booking-image" src={kingAbdulazizAirport} alt="Booking Details Preview" width={71} height={38} />
            <div className="hotel-details__sidecontent-booking-desc">
              <p className="hotel-details__sidecontent-booking-tag">Pick-up</p>
              <p className="hotel-details__sidecontent-booking-name">{data?.book_details?.pickup}</p>
              <div className="hotel-details__sidecontent-booking-date">
                <p>{formatDate(data?.book_details?.pickup_date_time)}</p>
                <div className="hotel-details__sidecontent-booking-date--dots"></div>
                <p>{formatTime(data?.book_details?.pickup_date_time)}</p>
              </div>
            </div>
          </div>
          <div className="hotel-details__sidecontent-details-separator"></div>
          <div className="hotel-details__sidecontent-booking">
            <BlurPlaceholderImage className="hotel-details__sidecontent-booking-image" src={kingAbdulazizAirport} alt="Booking Details Preview" width={71} height={38} />
            <div className="hotel-details__sidecontent-booking-desc">
              <p className="hotel-details__sidecontent-booking-tag">Drop - off</p>
              <p className="hotel-details__sidecontent-booking-name">{data?.book_details?.dropoff}</p>
              <div className="hotel-details__sidecontent-booking-date">
                <p>{formatDate(data?.book_details?.dropoff_date_time)}</p>
                <div className="hotel-details__sidecontent-booking-date--dots"></div>
                <p>{formatTime(data?.book_details?.dropoff_date_time)}</p>
              </div>
            </div>
          </div>
          <div className="hotel-details__sidecontent-details-separator"></div>
          <div className="hotel-details__sidecontent-price">
            <p>Price</p>
            <div className="hotel-details__sidecontent-price-column">
              <p>{currencySymbol} {changePrice(String( data?.price))} /day</p>
            </div>
          </div>
          <div className="hotel-details__sidecontent-price">
            <p className="hotel-details__sidecontent-price-title">Total Price</p>
            <div className="hotel-details__sidecontent-price-column">
              <h5>{currencySymbol} {changePrice(String( data?.book_details?.total_price))}</h5>
            </div>
          </div>
          <button className="btn btn-success" onClick={handleBookClick}>Book</button>
        </div>
        <div className="hotel-details__sidecontent-flag">
          <SVGIcon src={Icons.Warning} width={28} height={28} color="#475BCA" />
          <div className="hotel-details__sidecontent-flag-content">
            <p className="hotel-details__sidecontent-flag-header">This car is costing you just {data?.book_details?.total_price} – a fantastic deal…</p>
            <p className="hotel-details__sidecontent-flag-text">At that time of year, the average small car at London Luton Airport costs ${data?.book_details?.total_price * 2.5}!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const CarDetailsPassengerReview = () => {
  const router = useRouter();
  const { id: id_car_business_fleet } = router.query;

  const [loading, setLoading] = useState(false);
  const [rateData, setRateData] = useState<any>({});
  const [passengersReview, setPassengersReview] = useState<any>([]);

  const [displayFilter, setDisplayFilter] = useState("Highest Rating");
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false);
  const [filter, setFilter] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  function calculateFillWidth(fillValue) {
    return `${(fillValue / 5) * 100}%`;
  }

  // Handle for filter
  const handleFilter = (value) => {
    if (value !== filter) {
      setFilter(Number(value));

      if (value === 1) setDisplayFilter("Highest Rating");
      if (value === 2) setDisplayFilter("Lowest Rating");
    }

    setShowReviewDropdown(false);
  };

  const getReviewData = async () => {
    setLoading(true)

    const payload = {
      id_car_business_fleet: id_car_business_fleet,
      filter: filter,
    }

    try {
      const { data, ok, error } = await callAPI('/car-business-booking/passengers-reviews', 'POST', payload, true);

      if (ok) {
        setRateData(data.passengers_rate);
        setPassengersReview(data.passengers_reviews);
        // console.log('Passengers Review : ', passengersReview);
        // console.log('Passengers Rate : ', rateData);
      }

      setLoading(false);
    } catch (error) {
      console.log('error when get data from API : ', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getReviewData();
  }, [filter]);

  if (loading) {
    return <LoadingOverlay />
  }

  return (
    <div id="Reviews" className="hotel-details__guest">
      <h4>Passengers Reviews</h4>
      <div className="hotel-details__guest-header">
        <div className="hotel-details__guest-header-rating">
          <div className="hotel-details__guest-header-chips">
            {
              rateData?.overall !== null
                ? rateData?.overall?.toFixed(1)
                : "N/A"
            }
          </div>
          <p className="hotel-details__guest-header-overall">
            {
              rateData?.overall >= 4.5 ? "Excellent" :
                rateData?.overall >= 4.0 ? "Very Good" :
                  rateData?.overall >= 3.5 ? "Good" :
                    rateData?.overall >= 3.0 ? "Fair" :
                      rateData?.overall >= 2.5 ? "Poor" :
                        rateData?.overall >= 2.0 ? "Very Poor" :
                          rateData?.overall >= 1.5 ? "Terrible" :
                            rateData?.overall >= 1.0 ? "Horrible" :
                              rateData?.overall == 0.0 ? "N/A" : "N/A"
            }
          </p>
          <div className="hotel-details__guest-header-dots"></div>
          <p>{passengersReview?.length} reviews</p>
        </div>
        <div className="custom-dropdown">
          <div
            onClick={() => setShowReviewDropdown(true)}
            className="custom-dropdown-toggle"
          >
            <div style={{ whiteSpace: "nowrap" }}>Sort: {displayFilter}</div>
            <SVGIcon
              src={Icons.ArrowDown}
              width={16}
              height={16}
              className="dropdown-toggle-arrow"
            />
          </div>
          <DropdownMenu
            show={showReviewDropdown}
            setShow={setShowReviewDropdown}
            className="admin-partner__header-dropdown-menu"
            style={{ marginTop: 8, width: 180 }}
          >
            <div className="custom-dropdown-menu__options">
              <Link
                href={"#Reviews"}
                className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                onClick={() => handleFilter(1)}
              >
                Highest Rating
              </Link>
              <Link
                href={"#Reviews"}
                className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                onClick={() => handleFilter(2)}
              >
                Lowest Rating
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </div>
      <div className="hotel-details__guest-wrapper">
        <div className="hotel-details__guest-summary">
          <div className="hotel-details__guest-summary-item">
            <p>Value for money </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{
                  width:
                    rateData?.money !== null ?
                      calculateFillWidth(
                        rateData?.money?.toFixed(1)
                      )
                      : "0%"
                }}></div>
              </div>
              <p>
                {rateData?.money !== null
                  ? rateData?.money?.toFixed(1)
                  : "N/A"
                }
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Condition</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{
                  width:
                    rateData?.condition !== null ?
                      calculateFillWidth(
                        rateData?.condition?.toFixed(1)
                      )
                      : "0%"
                }}></div>
              </div>
              <p>
                {rateData?.condition !== null
                  ? rateData?.condition?.toFixed(1)
                  : "N/A"
                }
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Cleanliness</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{
                  width:
                    rateData?.clean !== null ?
                      calculateFillWidth(
                        rateData?.clean?.toFixed(1)
                      )
                      : "0%"
                }}></div>
              </div>
              <p>
                {rateData?.clean !== null
                  ? rateData?.clean?.toFixed(1)
                  : "N/A"
                }
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Facilities</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{
                  width:
                    rateData?.facilities !== null ?
                      calculateFillWidth(
                        rateData?.facilities?.toFixed(1)
                      )
                      : "0%"
                }}></div>
              </div>
              <p>
                {rateData?.facilities !== null
                  ? rateData?.facilities?.toFixed(1)
                  : "N/A"
                }
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Comfort</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{
                  width:
                    rateData?.comfortable !== null ?
                      calculateFillWidth(
                        rateData?.comfortable?.toFixed(1)
                      )
                      : "0%"
                }}></div>
              </div>
              <p>
                {rateData?.comfortable !== null
                  ? rateData?.comfortable?.toFixed(1)
                  : "N/A"
                }
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Staff </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{
                  width:
                    rateData?.staff !== null ?
                      calculateFillWidth(
                        rateData?.staff?.toFixed(1)
                      )
                      : "0%"
                }}></div>
              </div>
              <p>
                {rateData?.staff !== null
                  ? rateData?.staff?.toFixed(1)
                  : "N/A"
                }
              </p>
            </div>
          </div>
        </div>
        <div className="hotel-details__guest-content">
          {passengersReview?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((review, index) => (
            <div key={index} className="hotel-details__guest-review">
              <div className="hotel-details__guest-review-guest">
                <BlurPlaceholderImage src={review.photo} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
                <div className="hotel-details__guest-review-guest--bio">
                  <p className="hotel-details__guest-review-guest--name">{review?.name}</p>
                  <div className="hotel-details__guest-review-guest--location">
                    <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                    <p>{review?.city}, {review?.country}</p>
                  </div>
                </div>
              </div>
              <div className="hotel-details__guest-review-content">
                <div className="hotel-details__guest-review-content--chips">{review?.star}/5</div>
                {review?.description !== null
                  ? <p>“{review?.description}”</p>
                  : <p>“No description”</p>
                }
              </div>
            </div>
          ))}

          <div className="hotel-details__guest-pagination">
            <div className="pagination">
              {passengersReview?.length ? (
                <>
                  <button
                    type='button'
                    className={`pagination__button pagination__button--arrow ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                  >
                    <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                  </button>

                  {Array.from({
                    length: Math.ceil(passengersReview?.length / itemsPerPage),
                  }).map((_, index) => {

                    if (index < Math.ceil(passengersReview?.length / itemsPerPage)) {
                      if (
                        index === 0 ||
                        index === currentPage - 1 ||
                        index === currentPage ||
                        index === currentPage + 1 ||
                        index === Math.ceil(passengersReview?.length / itemsPerPage) - 1
                      ) {
                        return (
                          <button
                            key={index + 1}
                            type='button'
                            className={`pagination__button ${currentPage === index + 1 ? "active" : ""
                              }`}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </button>
                        )
                      } else if (
                        index === currentPage + 2 ||
                        index === currentPage - 2
                      ) {
                        return (
                          <button
                            disabled
                            key={`ellipsis-${index}`}
                            type='button'
                            className="pagination__button"

                          >
                            ...
                          </button>
                        )
                      }
                    }
                    return null;
                  })}

                  <button
                    type='button'
                    className={`pagination__button pagination__button--arrow ${currentPage === Math.ceil(passengersReview?.length / itemsPerPage) ? "disabled" : ""}`}
                    onClick={() =>
                      setCurrentPage(
                        currentPage <
                          Math.ceil(passengersReview?.length / itemsPerPage)
                          ? currentPage + 1
                          : Math.ceil(passengersReview?.length / itemsPerPage)
                      )
                    }
                    disabled={currentPage === Math.ceil(passengersReview?.length / itemsPerPage)}
                  >
                    <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                  </button>
                </>
              ) : (
                <>
                  <p>There are no reviews on this car</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// const CarDetailsMoreInformation = () =>{  
//   return(
//     <div className="hotel-details__information">
//       <h4>Important Information</h4>
//       <div className="hotel-details__information-wrapper">              
//         <div className="hotel-details__information-content">
//           <p className="hotel-details__information-content-title">Requirements</p>
//           <div className="hotel-details__information-content-details">            
//             <div className="hotel-details__information-content-desc">
//               <div>
//                 <p className="mb-2">When you pick the car up, you'll need:</p>
//                 <ul className="hotel-details__information-content-list">
//                   <li>Passport or national ID card</li>
//                   <li>Driving licence</li>
//                   <li>Credit or debit card</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="hotel-details__information-content">
//           <p className="hotel-details__information-content-title">Security Deposit</p>
//           <div className="hotel-details__information-content-details">            
//             <div className="hotel-details__information-content-desc">              
//               <ul>
//                 <li>At pick-up, the main driver will leave a refundable security deposit of <b>US$ 300.00</b> on their credit or debit card.</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         <div className="hotel-details__information-content">
//           <p className="hotel-details__information-content-title">Damage Excess</p>
//           <div className="hotel-details__information-content-details">            
//             <div className="hotel-details__information-content-desc">
//               <div>                
//                 <ul className="hotel-details__information-content-list">
//                   <li>If the car’s bodywork was damaged during your rental, you wouldn't pay anything at all towards repairs.</li>
//                   <li>
//                     This cover is only valid if you stick to the terms of the rental agreement. It doesn't cover other parts of 
//                     the car (e.g. windows, wheels, interior or undercarriage), or charges (e.g. for towing or off-road time), 
//                     or anything in the car (e.g. child seats, GPS devices or personal belongings).
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="hotel-details__information-content">
//           <p className="hotel-details__information-content-title">Fuel Policy</p>
//           <div className="hotel-details__information-content-details">            
//             <div className="hotel-details__information-content-desc">              
//               <ul>
//                 <li>
//                   When you pick your car up, the fuel tank will be full or partly full. 
//                   You will leave a deposit to cover the cost of the fuel: the counter staff 
//                   will block this money on your credit card. Just before you return your car, 
//                   please replace the fuel you’ve used.
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>   
//         <div className="hotel-details__information-content">
//           <p className="hotel-details__information-content-title">Mileage</p>
//           <div className="hotel-details__information-content-details">            
//             <div className="hotel-details__information-content-desc">              
//               <ul>
//                 <li>Your rental includes unlimited free kilometre.</li>
//               </ul>
//             </div>
//           </div>
//         </div>   
//         <Link href="#" className="hotel-details__information-link">Show more information</Link>
//       </div>
//     </div>
//   )
// }

const CarDetailSimilar = (data: any) => {
  console.log("CarDetailSimilar ", data);
  const { changePrice, currencySymbol } = UseCurrencyConverter();
  return (
    <div className="hotel-details__similar">
      <h4>Similar Car</h4>
      <div className="hotel-details__similar-list">
        {data?.data?.related_car.slice(0, 4).map((related_car, index) => (
          <div key={index} className="hotel-details__similar-card">
            <img className="hotel-details__similar-card-image" src={related_car?.photo?.photo || Images.Placeholder} alt="Similar Car" width={265} height={169} />
            <div className="hotel-details__similar-card-content">
              <div className="hotel-details__similar-card-text">
                <p className="hotel-details__similar-card-title">{related_car?.car_brand} {related_car?.model} {related_car?.edition}</p>
                <div className="hotel-details__similar-card-location">
                  <SVGIcon src={Icons.MapPin} className="hotel-details__similar-card-location--icon" width={20} height={20} />
                  <p>{related_car?.address_line}</p>
                </div>
                <div className="hotel-details__similar-card-price">
                  <p className="hotel-details__similar-card-price--total">{currencySymbol} {changePrice(String(related_car?.price || 0))}</p>
                  <p className="hotel-details__similar-card-price--range">/ Day</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Retrieve Data from APIs
export async function getServerSideProps(context) {
  const { id: id_car_business_fleet, checkin: check_in, checkout: check_out } = context.query || {};

  const isCheckinValid = moment(check_in, 'YYYY-MM-DD HH:mm', true).isValid();
  const isCheckoutValid = moment(check_out, 'YYYY-MM-DD HH:mm', true).isValid();

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  // Set the time part to the desired time (e.g., 12:00)
  tomorrow.setHours(0, 0, 0, 0);
  dayAfterTomorrow.setHours(0, 0, 0, 0);

  const defaultCheckin = formatDate(tomorrow);
  const defaultCheckout = formatDate(dayAfterTomorrow);

  const checkin = isCheckinValid ? check_in : defaultCheckin;
  const checkout = isCheckoutValid ? check_out : defaultCheckout;

  const payload = {
    id_car_business_fleet,
    pickup_date_time: checkin,
    dropoff_date_time: checkout
  };

  console.log("payload for car detail : ", payload);

  const { status, data, ok, error } = await callAPI('/car-business-booking/car-details', 'POST', payload);
  console.log("Result Fetch : ", status, data, ok, error);

  if (ok) {
    return {
      props: {
        data: {
          ...data,
          check_in: checkin,
          check_out: checkout,
        },
      },
    };
  } else {
    return {
      // props: {},
      notFound: true,
    };
  }
}

export default CarDetails
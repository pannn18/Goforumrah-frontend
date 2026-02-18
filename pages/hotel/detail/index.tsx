import React, { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { callAPI } from "@/lib/axiosHelper";
import { useRouter } from "next/router";
import moment from "moment";
import Link from "next/link";
import { Icons, Images, Services } from "@/types/enums";
import { useSession } from "next-auth/react";

import Image from "next/image";
import SVGIcon from "@/components/elements/icons";
import Layout from "@/components/layout";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BannerInfo from "@/components/pages/home/bannerInfo";
import { HotelSearchBar } from "@/components/pages/home/searchBar";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import hotelImagery1 from "@/assets/images/hotel_details_imagery_1.png";
import hotelImagery2 from "@/assets/images/hotel_details_imagery_2.png";
import hotelImagery3 from "@/assets/images/hotel_details_imagery_3.png";
import hotelImagery4 from "@/assets/images/hotel_details_imagery_4.png";
import hotelImagery5 from "@/assets/images/hotel_details_imagery_5.png";
import reviewerProfile1 from "@/assets/images/reviewer_profile_1.png";
import reviewerProfile2 from "@/assets/images/reviewer_profile_2.png";
import reviewerProfile3 from "@/assets/images/reviewer_profile_3.png";
import defaultProfileImage from '@/assets/images/default_profile_64x64.png'
import logoText from "@/assets/images/logo_text.svg";
import logoTextDark from "@/assets/images/logo_text_dark.svg";
import { UseCurrencyConverter } from "@/components/convertCurrency";

interface DetailProps {
  hotel: any;
}

const HotelDetails = (props: DetailProps) => {
  const router = useRouter();
  const { id, checkin, checkout, status, search } = router.query;
  const { hotel } = props;
  const { hotel_layout } = hotel;
  console.log("hotel detail : ", hotel);

  const [buttonReady, setButtonReady] = useState(false);
  const [fromHomepage, setFromHomepage] = useState(true);

  useEffect(() => {
    if (search) {
      setFromHomepage(false);
    }
  }, []);

  useEffect(() => {
    // Check if the button is ready
    const button = document.getElementById("auth-login-button");
    if (button) {
      setButtonReady(true);
    }
  }, []);

  useEffect(() => {
    // When the status changes and the button is ready, open the modal
    if (status === "unauthenticated" && buttonReady) {
      setTimeout(() => {
        const button = document.getElementById("auth-login-button");
        if (button) {
          button.click();
        }
      }, 0); // Delay execution to ensure the button is in the DOM
    }
  }, [status, buttonReady]);

  const overviewRef = useRef(null);
  const locationRef = useRef(null);
  const roomRef = useRef(null);
  const facilitiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const moreInformationRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <div className="hotel-details">
        <HotelTopNav
          scrollToOverview={() => scrollToSection(overviewRef)}
          scrollToLocation={() => scrollToSection(locationRef)}
          scrollToRoom={() => scrollToSection(roomRef)}
          scrollToFacilities={() => scrollToSection(facilitiesRef)}
          scrollToReviews={() => scrollToSection(reviewsRef)}
          scrollToMoreInformation={() => scrollToSection(moreInformationRef)}
        />
        <div className="container">
          <div className="hotel-details__header">
            {!fromHomepage && (
              <>
                <HotelBreadCrumb name={hotel.property_name} />
                <div className="hotel-details__header-filter">
                  <HotelSearchBar useVariant={true} search={search as string} />
                </div>
              </>
            )}
            <div className="hotel-details__content">
              <HotelDetailsImagery hotel_photo={hotel.hotel_photo} />
              <div ref={overviewRef}>
                <HotelDetailsSummary
                  name={hotel.property_name}
                  street_address={hotel.street_address}
                  price={hotel.price}
                  star_rating={hotel.star_rating}
                />
              </div>
              <HotelDetailsDescription
                hotel_facilities={hotel.hotel_facilities}
                description={hotel.description}
              />
              <HotelDetailsReviews
                hotel_review={hotel.hotel_review}
                hotel_review_star_average={hotel.hotel_review_star_average}
              />
              <div ref={locationRef}>
                <HotelDetailsLocation
                  hotel_name={hotel.property_name}
                  country={hotel.country}
                  city={hotel.city}
                  street_address={hotel.street_address}
                />
              </div>
              <div ref={roomRef}>
                <HotelDetailsRoom
                  id_hotel={hotel.id_hotel}
                  checkin={hotel.check_in}
                  checkout={hotel.check_out}
                  hotel_layout={hotel.hotel_layout}
                  hotel_amenities={hotel.hotel_amenities}
                />
              </div>
              <div ref={facilitiesRef}>
                <HotelDetailsFacility
                  hotel_facilities={hotel.hotel_facilities}
                  hotel_amenities={hotel.hotel_amenities}
                />
              </div>
              <div ref={reviewsRef}>
                <HotelDetailsGuestReview
                  hotel_review={hotel.hotel_review}
                  hotel_review_star_average={hotel.hotel_review_star_average}
                  hotel_review_location={hotel.hotel_review_location}
                  hotel_review_staff={hotel.hotel_review_staff}
                  hotel_review_facilities={hotel.hotel_review_facilities}
                  hotel_review_clean={hotel.hotel_review_clean}
                  hotel_review_comfortable={hotel.hotel_review_comfortable}
                  hotel_review_money={hotel.hotel_review_money}
                />
              </div>
              <div ref={moreInformationRef}>
                <HotelDetailsMoreInformation
                  hotel_policies={hotel.hotel_policies}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </Layout>
  );
};

const HotelTopNav = (props) => {
  return (
    <div className="container hotel-details__nav">
      <button
        className="hotel-details__nav-item"
        onClick={props.scrollToOverview}
      >
        Overview
      </button>
      <button
        className="hotel-details__nav-item"
        onClick={props.scrollToLocation}
      >
        Location
      </button>
      <button className="hotel-details__nav-item" onClick={props.scrollToRoom}>
        Room
      </button>
      <button
        className="hotel-details__nav-item"
        onClick={props.scrollToFacilities}
      >
        Facilities
      </button>
      <button
        className="hotel-details__nav-item"
        onClick={props.scrollToReviews}
      >
        Reviews
      </button>
      <button
        className="hotel-details__nav-item"
        onClick={props.scrollToMoreInformation}
      >
        More Information
      </button>
    </div>
  );
};

interface HotelBreadCrumbProps {
  name: string;
}
const HotelBreadCrumb = (props: HotelBreadCrumbProps) => {
  return (
    <div className="hotel-details__header-breadcrumb">
      <Link className="hotel-details__header-breadcrumb--link" href="/">
        Home
      </Link>
      <p>/</p>
      <Link
        className="hotel-details__header-breadcrumb--link"
        href="/search/hotel"
      >
        Search Hotel
      </Link>
      <p>/</p>
      <p className="hotel-details__header-breadcrumb--current">{props.name}</p>
    </div>
  );
};

interface HotelDetailsImageryProps {
  hotel_photo: {
    photo: string;
  }[];
}
const HotelDetailsImagery: React.FC<HotelDetailsImageryProps> = (props) => {
  const { hotel_photo } = props;
  const firstPhoto = hotel_photo[0]?.photo;
  const restPhotos = hotel_photo.slice(1, 5);

  const handleImageError = (target: HTMLImageElement) => {
    if (target.src !== Images.Placeholder) {
      target.src = Images.Placeholder;
    }
  };

  return (
    <div className="hotel-details__imagery">
      <img
        className="hotel-details__imagery-featured"
        src={firstPhoto?.toString() ?? hotelImagery1.toString()}
        alt=""
        width={644}
        height={468}
        onLoad={(e) => {
          const target = e.target as HTMLImageElement;
          if (target.naturalWidth === 0) {
            handleImageError(target);
          }
        }}
        onError={(e) => {
          console.error(`Error loading image: ${firstPhoto}`);
          const target = e.target as HTMLImageElement;
          handleImageError(target);
        }}
        onErrorCapture={(e) => {
          console.error(`Error loading image: ${firstPhoto}`);
          const target = e.target as HTMLImageElement;
          handleImageError(target);
        }}
      />
      <div className="hotel-details__imagery-src">
        {!!restPhotos.length ? (
          restPhotos.map((photo, index) => (
            <img
              key={index}
              src={photo?.photo}
              alt=""
              width={270}
              height={230}
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.naturalWidth === 0) {
                  handleImageError(target);
                }
              }}
              onError={(e) => {
                console.error(`Error loading image: ${photo?.photo}`);
                const target = e.target as HTMLImageElement;
                handleImageError(target);
              }}
              onErrorCapture={(e) => {
                console.error(`Error loading image: ${photo?.photo}`);
                const target = e.target as HTMLImageElement;
                handleImageError(target);
              }}
            />
          ))
        ) : (
          // Render placeholder images if no additional photos
          <>
            <img src={Images.Placeholder} alt="" width={270} height={230} />
            <img src={Images.Placeholder} alt="" width={270} height={230} />
            <img src={Images.Placeholder} alt="" width={270} height={230} />
            <img src={Images.Placeholder} alt="" width={270} height={230} />
          </>
        )}
      </div>
    </div>
  );
};

interface HotelDetailsSummaryProps {
  name: string;
  street_address: string;
  price: number;
  star_rating: number;
}
const HotelDetailsSummary = (props: HotelDetailsSummaryProps) => {
  const starRating = Math.round(props.star_rating);

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  let stars = [];
  if (starRating >= 1) {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
    );
  } else {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />
    );
  }
  if (starRating >= 2) {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
    );
  } else {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />
    );
  }
  if (starRating >= 3) {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
    );
  } else {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />
    );
  }
  if (starRating >= 4) {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
    );
  } else {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />
    );
  }
  if (starRating >= 5) {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
    );
  } else {
    stars.push(
      <SVGIcon src={Icons.Star} width={24} height={24} color="#D9E0E4" />
    );
  }

  return (
    <div className="hotel-details__summary">
      <div className="hotel-details__summary-left">
        <h3>{props.name}</h3>
        <div className="hotel-details__summary-left-stars">{stars}</div>
        <div className="hotel-details__summary-left-location">
          <SVGIcon src={Icons.MapPin} width={24} height={24} className="" />
          <p>{props.street_address}</p>
        </div>
      </div>
      <div className="hotel-details__summary-right">
        <div className="hotel-details__summary-right-price">
          <p>Starts from</p>
          <div className="hotel-details__summary-right-total">
            <h4>{currencySymbol} {changePrice(String(props.price))}</h4>
            <p className="hotel-details__summary-right-total--range">/night</p>
          </div>
        </div>
        <a href="#Rooms" className="btn btn-success hotel-details__summary-right-button">See Rooms</a>
      </div>
    </div>
  );
};

interface HotelDetailsDescriptionProps {
  description: string;
  hotel_facilities: {
    parking: string;
    breakfast: string;
    breakfast_price: number;
    languages: string;
    facilities: string;
  };
}
const HotelDetailsDescription = (props: HotelDetailsDescriptionProps) => {
  const [showMore, setShowMore] = useState(false);

  const { hotel_facilities } = props;
  const facilitiesArray = hotel_facilities?.facilities.split(",").slice(0, 3);
  // console.log(facilitiesArray);
  const { description } = props;

  const renderFacilities = () => {
    return facilitiesArray?.slice(0, 3).map((facility, index) => (
      <div key={index} className="hotel-details__desc-facilities-item">
        {/* !!! Waiting All Facility Icon Ready !!!*/}

        {/* {facility === "Free Parking" && <SVGIcon src={Icons.CircleTime} width={20} height={20} />}
        {facility === "Restaurant" && <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />}
        {facility === "Free Wifi" && <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />}
        {facility === "Swimming Pool" && <SVGIcon src={Icons.AirConditioner} width={20} height={20} />}
        {facility === "Ac" && <SVGIcon src={Icons.AirConditioner} width={20} height={20} />}
        {facility === "Airport Suffle" && <SVGIcon src={Icons.Car} width={20} height={20} />}
        {facility === "Spa" && <SVGIcon src={Icons.FacilitiesDimension} width={20} height={20} />} */}

        <p>{facility}</p>
      </div>
    ));
  };

  const excerpt = description
    ? `${description.split(" ").slice(0, 30).join(" ")} ... `
    : "";
  const displayedDescription = showMore ? description : excerpt;

  const handleReadMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="hotel-details__desc">
      <div className="hotel-details__desc-left">
        <p className="hotel-details__desc-left-title">Description</p>
        <p className="hotel-details__desc-left-description">
          {description
            ? displayedDescription
            : "There is no description about this hotel"}
          {description && (
            <span
              onClick={handleReadMore}
              className="hotel-details__desc-left-description--button"
            >
              {showMore ? "Read Less" : "Read More"}
            </span>
          )}
        </p>

        {/* <p className="hotel-details__desc-left-description">
          Ideally located in the prime touristic area of Ajyad, ZamZam Pullman Makkah Hotel promises a relaxing and wonderful visit.
          Featuring a complete list of amenities, guests will find their stay at the property a comfortable one. 24-hour room service,
          free ... <span className="hotel-details__desc-left-description--button">Read more</span>
        </p> */}
      </div>
      <div className="hotel-details__desc-right">
        <p className="hotel-details__desc-right-title">Facilities</p>
        <div className="hotel-details__desc-facilities-wrapper">
          <div className="hotel-details__desc-facilities">
            {/* {facilitiesArray?.map((facility, index) => (
              <div key={index} className="hotel-details__desc-facilities-item">
                {index === 0 && (
                  <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                )}
                {index === 1 && (
                  <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
                )}
                {index === 2 && (
                  <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />
                )}
                <p>{facility}</p>
              </div>
            ))} */}
            {renderFacilities()}
          </div>
          <a
            href="#AmenitiesFacilities"
            className="hotel-details__desc-facilities-more btn btn-lg btn-outline-success"
          >
            See more facilities
          </a>
        </div>
      </div>
    </div>
  );
};

interface HotelDetailsReviewsProps {
  hotel_review: any;
  hotel_review_star_average: number;
}
const HotelDetailsReviews = (props: HotelDetailsReviewsProps) => {
  // console.log("props.hotel_review", props.hotel_review);
  return (
    <div className="hotel-details__reviews">
      <div className="hotel-details__reviews-header">
        <p className="">Reviews</p>
        <div className="hotel-details__reviews-header-overall">
          <div className="hotel-details__reviews-header-chips">
            {" "}
            {props?.hotel_review_star_average !== null &&
              props?.hotel_review_star_average !== null
              ? props?.hotel_review_star_average.toFixed(1)
              : "N/A"}
          </div>
          <p className="hotel-details__reviews-header-name">
            {props?.hotel_review_star_average >= 4.8
              ? "Excellent"
              : props?.hotel_review_star_average >= 3.5
                ? "Good"
                : "Normal"}
          </p>
        </div>
      </div>
      <div className="hotel-details__reviews-wrapper">
        {props.hotel_review.slice(0, 3).map((hotel_review, index) => (
          <div key={index} className="hotel-details__reviews-review">
            <img src={Images.Placeholder} alt="reviewer profile" width={48} height={48} />
            <div className="hotel-details__reviews-review-column">
              <div className="hotel-details__reviews-review-content">
                <div className="hotel-details__reviews-review-content--chips">
                  {hotel_review.star}/5
                </div>
                <p>{hotel_review.description}</p>
              </div>
              <div className="hotel-details__reviews-review-customer">
                <p>{hotel_review.customer.customer_personal.fullname}</p>
                <div className="hotel-details__reviews-review-customer--location">
                  <SVGIcon
                    src={Icons.countryFlagIndonesia}
                    width={16}
                    height={16}
                  />
                  <p>
                    {hotel_review.customer.customer_personal.city},{" "}
                    {hotel_review.customer.customer_personal.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {/* <div className="hotel-details__reviews-review">
          <img src={reviewerProfile1} alt="reviewer profile" width={48} height={48} />
          <div className="hotel-details__reviews-review-column">
            <div className="hotel-details__reviews-review-content">
              <div className="hotel-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="hotel-details__reviews-review-customer">
              <p>Cody Fisher</p>
              <div className="hotel-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__reviews-review">
          <img src={reviewerProfile2} alt="reviewer profile" width={48} height={48} />
          <div className="hotel-details__reviews-review-column">
            <div className="hotel-details__reviews-review-content">
              <div className="hotel-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="hotel-details__reviews-review-customer">
              <p>Robert Fox</p>
              <div className="hotel-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hotel-details__reviews-review">
          <img src={reviewerProfile3} alt="reviewer profile" width={48} height={48} />
          <div className="hotel-details__reviews-review-column">
            <div className="hotel-details__reviews-review-content">
              <div className="hotel-details__reviews-review-content--chips">4.5/5</div>
              <p>“I liked the treatment of all the employees, especially Sister Lina, Salwa, Rival, and employee Hassan.”</p>
            </div>
            <div className="hotel-details__reviews-review-customer">
              <p>Ronald Richards</p>
              <div className="hotel-details__reviews-review-customer--location">
                <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                <p>Jakarta, Indonesia</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

// Start Of : HotelDetailsLocation
interface HotelDetailsLocationProps {
  hotel_name: string;
  country: string;
  street_address: string;
  city: string;
}
const HotelDetailsLocation = (props: HotelDetailsLocationProps) => {
  return (
    <div className="hotel-details__location">
      <h4>Location</h4>
      <iframe
        src={`https://www.google.com/maps?q=${props.hotel_name}&output=embed`}
        height="330"
        loading="lazy"
      ></iframe>
      <div className="hotel-details__location-details">
        <div className="hotel-details__location-details-header">
          <p className="hotel-details__location-details-name">
            {props.city}, {props.country}
          </p>
          <div className="hotel-details__location-details-specific">
            <SVGIcon
              src={Icons.MapPin}
              width={24}
              height={24}
              className="hotel-details__location-details-specific--pin"
            />
            <p>
              {props.hotel_name} {props.street_address}
            </p>
          </div>
        </div>
        <Link
          href={`https://www.google.com/maps?q=${props.hotel_name}`}
          className="btn btn-success btn-md w-100 hotel-details__location-button"
          target="_blank"
        >
          Open In Google Maps
        </Link>
      </div>
    </div>
  );
};
// End Of : HotelDetailsLocation

// Start Of : HotelDetailsRoom
interface HotelDetailsRoomProps {
  id_hotel: number;
  checkin: string;
  checkout: string;
  hotel_amenities: { amenities_name: string }[];
  hotel_layout: {
    id_hotel_layout: number;
    room_type: string;
    smoking_policy: string;
    guest_count: number;
    hotel_layout_photo: { photo: any }[];
    room_size: string;
    price: number;
    number_of_room: number;
    bed_layout: { bed_type: string; amount: number }[];
    available_room: number;
    booking_ready: boolean;
  }[];
}
const HotelDetailsRoom = (props: HotelDetailsRoomProps) => {
  const [showMoreRooms, setShowMoreRooms] = useState(2);
  const { data: session, status } = useSession();
  // get adult and children from router query
  const router = useRouter();
  const { adult, children } = router.query;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  return (
    <div className="hotel-details__room" id="Rooms">
      <h4>Room</h4>
      <div className="hotel-details__room-wrapper">
        {!(status === "authenticated" || session) && <BannerSection />}
        {!!props.hotel_layout.length &&
          props.hotel_layout.map((hotel_layout, index) => (
            <div key={index} className="hotel-details__room-item">
              <div className="hotel-details__room-item-preview">
                {!!hotel_layout.hotel_layout_photo.length ? (
                  <Slider
                    {...settings}
                    className="hotel-details__slider-wrapper"
                  >
                    {hotel_layout.hotel_layout_photo
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 5)
                      .map(
                        (layout_photo, index) => (
                          <img
                            key={index}
                            src={layout_photo.photo}
                            className="hotel-details__room-item-preview-image"
                            alt={`reviewer_profile_${index}`}
                            width={265}
                            height={265}
                          />
                        )
                      )}
                  </Slider>
                ) : (
                  <img
                    src={Images.Placeholder}
                    className="hotel-details__room-item-preview-image"
                    alt={`reviewer_profile_${index}`}
                    width={265}
                    height={265}
                  />
                )}
                <div className="hotel-details__room-item-preview-title">
                  <h5>{hotel_layout.room_type}</h5>
                </div>
              </div>
              <div className="hotel-details__room-item-list">
                {[
                  ...Array(
                    hotel_layout.available_room > 0
                      ? hotel_layout.available_room
                      : ""
                  ),
                ]
                  .slice(0, showMoreRooms)
                  .map((_, index) => (
                    <div key={index} className="hotel-details__room-detail">
                      <div className="hotel-details__room-detail-content">
                        <div className="hotel-details__room-detail-title">
                          <p>{hotel_layout.room_type}</p>
                          <div className="hotel-details__room-detail-facilities">
                            <div className="hotel-details__room-detail-facilities__dots"></div>
                            <div className="hotel-details__room-detail-facilities__item">
                              {/* <SVGIcon src={Icons.FacilitiesDimension} width={20} height={20} /> */}
                              <p>{hotel_layout.room_size}</p>
                            </div>
                            {props.hotel_amenities.map(
                              (hotel_amenities, index) => (
                                <>
                                  <div className="hotel-details__room-detail-facilities__dots"></div>
                                  <div
                                    key={index}
                                    className="hotel-details__room-detail-facilities__item"
                                  >
                                    <p>{hotel_amenities.amenities_name}</p>
                                  </div>
                                </>
                              )
                            )}
                          </div>
                        </div>
                        <div className="hotel-details__room-detail-content--separator"></div>
                        <div className="hotel-details__room-detail-specification">
                          {hotel_layout.bed_layout.map((bed_layout, index) => (
                            <>
                              <div
                                key={index}
                                className="hotel-details__room-detail-facilities__item"
                              >
                                <SVGIcon
                                  src={Icons.Bed}
                                  width={20}
                                  height={20}
                                />
                                <p>
                                  {bed_layout.amount} {bed_layout.bed_type}
                                </p>
                              </div>
                            </>
                          ))}
                          <div className="hotel-details__room-detail-facilities__item">
                            <SVGIcon src={Icons.Users} width={20} height={20} />
                            <p>{hotel_layout.guest_count} guests</p>
                          </div>
                        </div>
                        <div className="hotel-details__room-detail-content--separator"></div>
                      </div>
                      <div className="hotel-details__room-detail-split">
                        <div className="hotel-details__room-detail-split__price">
                          <h5>{currencySymbol} {changePrice(String(hotel_layout.price))}</h5>
                          <p className="hotel-details__room-detail-split__price-type">
                            / night
                          </p>
                        </div>
                        <div className="hotel-details__room-detail-split__action">
                          {hotel_layout.available_room > 0 ? (
                            <Link
                              href={`/booking/hotel/${props.id_hotel}?checkin=${props.checkin}&checkout=${props.checkout}&id_hotel_layout=${hotel_layout.id_hotel_layout}&adult=${adult}&children=${children}`}
                              className="btn btn-success hotel-details__room-detail-split__action-btn"
                            >
                              Book this Room
                            </Link>
                          ) : (
                            <button className="btn btn-success" disabled>
                              Room Unavailable
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {hotel_layout.available_room > 2 && (
                  <>
                    {showMoreRooms === 2 ? (
                      <span
                        onClick={() =>
                          setShowMoreRooms(hotel_layout.available_room)
                        }
                        className="hotel-details__room-item-link"
                      >
                        Show more room
                        <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
                      </span>
                    ) : (
                      <span
                        onClick={() => setShowMoreRooms(2)}
                        className="hotel-details__room-item-link"
                      >
                        Show less room
                        <span style={{ transform: "rotate(180deg)" }}>
                          <SVGIcon
                            src={Icons.ArrowDown}
                            width={20}
                            height={20}
                          />
                        </span>
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
// End Of : HotelDetailsRoom

// Start Of : HotelDetailsFacility
interface HotelDetailsFacilityProps {
  hotel_amenities: { amenities_name: string }[];
  hotel_facilities: {
    parking: string;
    breakfast: string;
    breakfast_price: number;
    languages: string;
    facilities: string;
  };
}
const HotelDetailsFacility = (props: HotelDetailsFacilityProps) => {
  return (
    <div className="hotel-details__facility" id="AmenitiesFacilities">
      <h4>Amenities and Facilities</h4>
      <div className="hotel-details__facility-wrapper">
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Amenities</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            {props.hotel_amenities.map((hotel_amenities, index) => (
              <div key={index} className="hotel-details__facility-content-item">
                <div className="hotel-details__facility-content-item--dots"></div>
                <p>{hotel_amenities.amenities_name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Facilities</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            {props?.hotel_facilities?.facilities
              ?.split(",")
              .map((facility, index) => (
                <div
                  key={index}
                  className="hotel-details__facility-content-item"
                >
                  <div className="hotel-details__facility-content-item--dots"></div>
                  <p>{facility}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Languages</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            {props?.hotel_facilities?.languages
              ?.split(",")
              .map((languages, index) => (
                <div
                  key={index}
                  className="hotel-details__facility-content-item"
                >
                  <div className="hotel-details__facility-content-item--dots"></div>
                  <p>{languages}</p>
                </div>
              ))}
          </div>
        </div>
        {/* <Link href="#" className="hotel-details__facility-link">Show more facilities</Link> */}
      </div>
    </div>
  );
};
// End Of : HotelDetailsFacility

interface HotelDetailsGuestReviewProps {
  hotel_review: any;
  hotel_review_star_average: number;
  hotel_review_location: number;
  hotel_review_staff: number;
  hotel_review_facilities: number;
  hotel_review_clean: number;
  hotel_review_comfortable: number;
  hotel_review_money: number;
}
const HotelDetailsGuestReview = (props: HotelDetailsGuestReviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("highestRating");
  const itemsPerPage = 3;

  // console.log(Math.ceil(props.hotel_review.length / itemsPerPage))

  function calculateFillWidth(fillValue) {
    return `${(fillValue / 5) * 100}%`;
  }

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const getSortedReviews = () => {
    let sortedReviews = [...props.hotel_review];

    switch (sortOption) {
      case "highestRating":
        sortedReviews.sort((a, b) => b.star - a.star);
        break;
      case "newestRating":
        sortedReviews;
        break;
      case "popularRating":
        sortedReviews = sortedReviews.filter((review) => review.star >= 4);
        sortedReviews.sort((a, b) => b.star - a.star);
        break;
      default:
        break;
    }

    return sortedReviews;
  };

  const sortedReviews = getSortedReviews();

  // console.log("sortedReviews", sortedReviews)

  return (
    <div className="hotel-details__guest">
      <h4>Guest Reviews</h4>
      <div className="hotel-details__guest-header">
        <div className="hotel-details__guest-header-rating">
          <div className="hotel-details__guest-header-chips">
            {props?.hotel_review_star_average !== null
              ? props?.hotel_review_star_average.toFixed(1)
              : "N/A"}
          </div>
          <p className="hotel-details__guest-header-overall">Excellent</p>
          <div className="hotel-details__guest-header-dots"></div>
          <p>{props?.hotel_review?.length} reviews</p>
        </div>
        <select
          className="hotel-details__guest-header-filter"
          name="filterSort"
          id="filterSort"
          value={sortOption}
          onChange={handleSortChange}
        >
          <option value="highestRating">Sort : Highest Rating</option>
          <option value="newestRating">Sort : Newest Rating</option>
          <option value="popularRating">Sort : Popular Rating</option>
        </select>
      </div>
      <div className="hotel-details__guest-wrapper">
        <div className="hotel-details__guest-summary">
          <div className="hotel-details__guest-summary-item">
            <p>Location</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div
                  className="hotel-details__guest-summary-bar--filler"
                  style={{
                    width:
                      props?.hotel_review_location !== null
                        ? calculateFillWidth(
                          props?.hotel_review_location.toFixed(1)
                        )
                        : "0%",
                  }}
                ></div>
              </div>
              <p>
                {props?.hotel_review_location !== null
                  ? props?.hotel_review_location.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Staff</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div
                  className="hotel-details__guest-summary-bar--filler"
                  style={{
                    width:
                      props?.hotel_review_staff !== null
                        ? calculateFillWidth(
                          props?.hotel_review_staff.toFixed(1)
                        )
                        : "0%",
                  }}
                ></div>
              </div>
              <p>
                {props?.hotel_review_staff !== null
                  ? props?.hotel_review_staff.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Cleanliness</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div
                  className="hotel-details__guest-summary-bar--filler"
                  style={{
                    width:
                      props?.hotel_review_clean !== null
                        ? calculateFillWidth(
                          props?.hotel_review_clean.toFixed(1)
                        )
                        : "0%",
                  }}
                ></div>
              </div>
              <p>
                {props?.hotel_review_clean !== null
                  ? props?.hotel_review_clean.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Comfort</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div
                  className="hotel-details__guest-summary-bar--filler"
                  style={{
                    width:
                      props?.hotel_review_comfortable !== null
                        ? calculateFillWidth(
                          props?.hotel_review_comfortable.toFixed(1)
                        )
                        : "0%",
                  }}
                ></div>
              </div>
              <p>
                {props?.hotel_review_comfortable !== null
                  ? props?.hotel_review_comfortable.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Value for money </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div
                  className="hotel-details__guest-summary-bar--filler"
                  style={{
                    width:
                      props?.hotel_review_money !== null
                        ? calculateFillWidth(
                          props?.hotel_review_money.toFixed(1)
                        )
                        : "0%",
                  }}
                ></div>
              </div>
              <p>
                {props?.hotel_review_money !== null
                  ? props?.hotel_review_money.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Facilities </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div
                  className="hotel-details__guest-summary-bar--filler"
                  style={{
                    width:
                      props?.hotel_review_facilities !== null
                        ? calculateFillWidth(
                          props?.hotel_review_facilities.toFixed(1)
                        )
                        : "0%",
                  }}
                ></div>
              </div>
              <p>
                {props?.hotel_review_facilities !== null
                  ? props?.hotel_review_facilities.toFixed(1)
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
        <div className="hotel-details__guest-content">
          {sortedReviews
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((hotel_review, index) => (
              <div className="hotel-details__guest-review" key={index}>
                <div className="hotel-details__guest-review-guest">
                  <img
                    src={Images.Placeholder}
                    className="hotel-details__guest-review-guest--profile"
                    alt="Guest Profile"
                    width={48}
                    height={48}
                  />
                  <div className="hotel-details__guest-review-guest--bio">
                    <p className="hotel-details__guest-review-guest--name">
                      {hotel_review.customer.customer_personal.fullname}
                    </p>
                    <div className="hotel-details__guest-review-guest--location">
                      <SVGIcon
                        src={Icons.countryFlagIndonesia}
                        width={16}
                        height={16}
                      />
                      <p>
                        {hotel_review.customer.customer_personal.city},{" "}
                        {hotel_review.customer.customer_personal.country}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="hotel-details__guest-review-content">
                  <div className="hotel-details__guest-review-content--chips">
                    {hotel_review.star}/5
                  </div>
                  <p>“{hotel_review.description}“</p>
                </div>
              </div>
            ))}

          <div className="hotel-details__guest-pagination">
            <div className="hotel-details__guest-pagination">
              <div className="pagination">
                {props.hotel_review.length ? (
                  <>
                    <button
                      type="button"
                      className="pagination__button pagination__button--arrow"
                      onClick={() =>
                        setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                      }
                      disabled={currentPage === 1}
                    >
                      <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                    </button>

                    {Array.from({
                      length: Math.ceil(
                        props.hotel_review.length / itemsPerPage
                      ),
                    }).map((_, index) => {
                      // console.log(index);
                      if (
                        index <
                        Math.ceil(props.hotel_review.length / itemsPerPage)
                      ) {
                        if (
                          index === 0 ||
                          index === currentPage - 1 ||
                          index === currentPage ||
                          index === currentPage + 1 ||
                          index ===
                          Math.ceil(
                            props.hotel_review.length / itemsPerPage
                          ) -
                          1
                        ) {
                          return (
                            <button
                              key={index + 1}
                              type="button"
                              className={`pagination__button ${currentPage === index + 1 ? "active" : ""
                                }`}
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          );
                        } else if (
                          index === currentPage + 2 ||
                          index === currentPage - 2
                        ) {
                          return (
                            <button
                              disabled
                              key={`ellipsis-${index}`}
                              type="button"
                              className="pagination__button"
                            >
                              ...
                            </button>
                          );
                        }
                      }
                      return null;
                    })}

                    <button
                      type="button"
                      className="pagination__button pagination__button--arrow"
                      onClick={() =>
                        setCurrentPage(
                          currentPage <
                            Math.ceil(props.hotel_review.length / itemsPerPage)
                            ? currentPage + 1
                            : Math.ceil(
                              props.hotel_review.length / itemsPerPage
                            )
                        )
                      }
                      disabled={
                        currentPage ===
                        Math.ceil(props.hotel_review.length / itemsPerPage)
                      }
                    >
                      <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                    </button>
                  </>
                ) : (
                  <>
                    <p>There are no reviews on this hotel</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Start Of : HotelDetailsMoreInformation
interface HotelDetailsMoreInformationProps {
  hotel_policies: {
    cancellation_day: number;
    protect_against: number;
    checkin_from: string;
    checkin_to: string;
    checkout_from: string;
    checkout_to: string;
    children: number;
    pets: number;
  };
}
const HotelDetailsMoreInformation = (
  props: HotelDetailsMoreInformationProps
) => {
  return (
    <>
      <div className="hotel-details__information">
        <h4>Policies</h4>
        <div className="hotel-details__information-wrapper">
          <div className="hotel-details__information-content">
            <p className="hotel-details__information-content-title">
              Check - in/out Time
            </p>
            <div className="hotel-details__information-content-details">
              <div className="hotel-details__information-content-clock">
                <div className="hotel-details__information-content-item">
                  <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                  <p>Check-in Time : </p>
                  <p className="hotel-details__information-content-item--time">
                    {props?.hotel_policies?.checkin_from}
                  </p>
                </div>
                <div className="hotel-details__information-content-item">
                  <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                  <p>Check-out Time : </p>
                  <p className="hotel-details__information-content-item--time">
                    {props?.hotel_policies?.checkout_to}
                  </p>
                </div>
              </div>
              <div className="hotel-details__information-content-item">
                <SVGIcon src={Icons.Warning} width={20} height={20} />
                <p>
                  Guests are required to show a photo identification and credit
                  card upon check-in
                </p>
              </div>
            </div>
          </div>
          <div className="hotel-details__information-content">
            <p className="hotel-details__information-content-title">
              Cancellation Day
            </p>
            <div className="hotel-details__information-content-details">
              <div className="hotel-details__information-content-desc">
                <p>{props?.hotel_policies?.cancellation_day} Day</p>
              </div>
            </div>
          </div>
          {!(props?.hotel_policies?.children === 0) && (
            <div className="hotel-details__information-content">
              <p className="hotel-details__information-content-title">
                Children
              </p>
              <div className="hotel-details__information-content-details">
                <div className="hotel-details__information-content-desc">
                  <SVGIcon
                    src={Icons.CheckRoundedGreen}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
          )}
          {!(props?.hotel_policies?.pets === 0) && (
            <div className="hotel-details__information-content">
              <p className="hotel-details__information-content-title">Pets</p>
              <div className="hotel-details__information-content-details">
                <div className="hotel-details__information-content-desc">
                  <SVGIcon
                    src={Icons.CheckRoundedGreen}
                    width={20}
                    height={20}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
// End Of : HotelDetailsMoreInformation

const BannerSection = () => {
  const { data: session, status } = useSession();
  const [buttonReady, setButtonReady] = useState(false);

  const handleButtonClick = () => {
    // Check if the button is ready
    const button = document.getElementById("auth-login-button");
    if (button) {
      setButtonReady(true);
    }
    if (status === "unauthenticated") {
      button.click();
    }
  };
  return (
    <div className="">
      <div className="homepage__banner">
        <div className="col-auto">
          <div className="icon">
            <SVGIcon src={Icons.Lamp} width={24} height={24} />
          </div>
        </div>
        <div className="col">
          <div className="details">
            <div className="fs-xl fw-bold text-neutral-primary"></div>
            <div className="fs-lg">
              Enjoy special discounts & other benefits! Log in or register now.
            </div>
          </div>
        </div>
        <div className="col-auto">
          <Link
            href={"#"}
            className="link-green-01 fs-lg"
            onClick={(e) => {
              e.preventDefault();
              handleButtonClick();
            }}
          >
            Login or register now
          </Link>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id: id_hotel, checkin: check_in, checkout: check_out } = context.query || {};

  const isCheckinValid = moment(check_in, 'YYYY-MM-DD', true).isValid();
  const isCheckoutValid = moment(check_out, 'YYYY-MM-DD', true).isValid();

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  let dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  const defaultCheckin = tomorrow.toISOString().split('T')[0];
  const defaultCheckout = dayAfterTomorrow.toISOString().split('T')[0];

  const checkin = isCheckinValid ? check_in : defaultCheckin;
  const checkout = isCheckoutValid ? check_out : defaultCheckout;

  const payload = {
    id_hotel,
    check_in: checkin,
    check_out: checkout,
  };

  const { status, data, ok, error } = await callAPI('/hotel/detail', 'POST', payload);

  if (ok) {
    validateImageUrls(data.hotel_photo);
    validateImageUrlsInLayout(data.hotel_layout);

    return {
      props: {
        hotel: {
          ...data,
          check_in: checkin,
          check_out: checkout,
        },
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
}

function validateImageUrls(photos) {
  if (!photos || !Array.isArray(photos)) {
    return;
  }

  photos.forEach((photo, index) => {
    if (photo && !checkImageStatus(photo.photo)) {
      console.log(`Image at index ${index} is not valid. Replacing with placeholder.`);
      photo.photo = Images.Placeholder;
    } else {
      console.log(`Image at index ${photo.photo} is valid.`);
    }
  });
}

function validateImageUrlsInLayout(layouts) {
  if (!layouts || !Array.isArray(layouts)) {
    return;
  }

  layouts.forEach((layout) => {
    if (layout?.hotel_layout_photo) {
      validateImageUrls(layout.hotel_layout_photo);
    }
  });
}

export async function checkImageStatus(imageUrl) {
  try {
    const response = await axios.head(imageUrl);
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);

    if (response.status >= 200 && response.status < 300 && response.headers['content-type'].includes('image') && response.headers['content-length'] > 0) {
      return true; // Image is valid
    } else {
      return false; // Image is not valid
    }
  } catch (error) {
    return false;
  }
}

export default HotelDetails;

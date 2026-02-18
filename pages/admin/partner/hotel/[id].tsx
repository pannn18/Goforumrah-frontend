import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { callAPI } from '@/lib/axiosHelper'
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { Images } from "@/types/enums"
import profilePlaceholder from '@/assets/images/default_profile_64x64.png'
import hotelImagery1 from '@/assets/images/hotel_details_imagery_1.png'
import hotelImagery2 from '@/assets/images/hotel_details_imagery_2.png'
import hotelImagery3 from '@/assets/images/hotel_details_imagery_3.png'
import hotelImagery4 from '@/assets/images/hotel_details_imagery_4.png'
import hotelImagery5 from '@/assets/images/hotel_details_imagery_5.png'
import BannerInfo from '@/components/pages/home/bannerInfo'
import placeholder from '@/public/images/placeholder.svg'
import { useSession } from 'next-auth/react'
import DropdownMenu from "@/components/elements/dropdownMenu"
import LoadingOverlay from "@/components/loadingOverlay"

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend, ScriptableContext } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface HotelDataProps {
  hotelData?: any;
  hotel?: any;
  monthly_overview?: any;
  handleFeaturedStatus?: any;
}

const PartnerHotelDetail = (props) => {
  const [isStatusApprove, setisStatusApprove] = useState(true)
  const router = useRouter()
  const { id } = router.query;
  const id_hotel = props.id ?? id;

  //Retrive Data from API
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);


  useEffect(() => {
    if (!id_hotel) return

    // Check if personalData or hotelData is already available
    if (hotelData) return;

    const fetchHotelData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-hotel-business/hotel-details', 'POST', { id_hotel: id_hotel }, true);
        setHotelData(data);
        setHotelLoading(false);
      } catch (error) {
        setHotelError(error);
        setHotelLoading(false);
      }
    };

    fetchHotelData();
  }, [id_hotel]);

  const handleFeaturedStatus = async (id_hotel: number, featured_status: number) => {
    try {
      const response = await callAPI('/hotel/store', 'POST', { id_hotel: id_hotel, featured_status: featured_status }, true);
      if (response.status === 200) {
        console.log("Success Message :", response.data);
        console.log('Updated data', hotelData.data)
        router.reload();
      }
    } catch (error) {
      setHotelError(error);
      setHotelLoading(false);
    }
  }


  if (hotelLoading) {
    return <LoadingOverlay />;
  }

  if (hotelError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("data : ", hotelData)

  return (
    <Layout>
      <AdminLayout pageTitle="Hotel Details" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <PartnerHotelDetailContent
              hotelData={hotelData}
              handleFeaturedStatus={handleFeaturedStatus}
            />
          </div>
        </div>
      </AdminLayout>
      <ConfirmModal />
    </Layout>
  )
}

const PartnerHotelDetailContent = (props: HotelDataProps) => {
  const tabs = {
    'Overview': '',
    'Location': '',
    'Room': '',
    'Facilities': '',
    'Reviews': '',
    'More Information': '',
  }
  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])
  const hotelStatus = ['Need Review', 'Active', 'Not Active', 'Declined'];
  const hotel = props.hotelData?.hotel;
  const allData = props;
  const monthly_overview = props.hotelData.monthly_overview;

  return (
    <div className="admin-partner__detail-content">
      <div className="admin-partner__detail-split">
        <div className="admin-partner__detail-hotel">
          <img src={hotel.hotel_photo[0]?.photo || placeholder} className="admin-partner__detail-hotel__image" alt="Trending City" width={200} height={193} />
          <div className="admin-partner__detail-hotel__content">
            <div className="admin-partner__detail-hotel__row admin-partner__detail-hotel__content-code">
              <p className="admin-partner__detail-hotel__content-code--text">#{hotel?.id_hotel}</p>
              <div className="admin-partner__detail-hotel__content-code--divider"></div>
              <p className="admin-partner__detail-hotel__content-code--text">
                Since {hotel.created_at && new Date(hotel.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/(\d+)(st|nd|rd|th)/, '$1')}
              </p>
            </div>
            <h5 className="admin-partner__detail-hotel__name">{hotel?.property_name}</h5>
            <div className="admin-partner__detail-hotel__row">
              <div className="admin-partner__detail-hotel__col">
                <p className="admin-partner__detail-hotel__content-label">Status</p>
                <div className={`admin-partner__detail-content__header-chips admin-partner__detail-content__header-chips--review`}>{hotelStatus[hotel?.status]}</div>
              </div>
              <div className="admin-partner__detail-hotel__col">
                <p className="admin-partner__detail-hotel__content-label">Star Rating</p>
                <div className="admin-partner__detail-hotel__content-inner">
                  <SVGIcon src={Icons.Star} width={16} height={16} className="" color="#EECA32" />
                  <p className="admin-partner__detail-hotel__content-text">{hotel?.star_rating}</p>
                </div>
              </div>
              <div className="admin-partner__detail-hotel__col">
                <p className="admin-partner__detail-hotel__content-label">Last active</p>
                <div className="admin-partner__detail-hotel__content-inner">
                  <SVGIcon src={Icons.CircleTime} width={16} height={16} className="admin-partner__detail-hotel__content-text" />
                  <p className="admin-partner__detail-hotel__content-text">{hotel?.last_active}</p>
                </div>
              </div>
            </div>
            <div className="admin-partner__detail-hotel__row">
              <Link href={`/admin/partner/hotel/edit?id_hotel=${hotel.id_hotel}`} className="btn btn-sm btn-success admin-partner__detail-hotel__content-buttons">Edit</Link>
              <Link href={`/hotel/detail?id=${hotel.id_hotel}`} className="btn btn-sm btn-outline-success admin-partner__detail-hotel__content-buttons">Preview</Link>
            </div>
          </div>
        </div>
        <div className="admin-partner__header-tab-menu admin-partner__detail-content__tab">
          {Object.keys(tabs).map((tab, index) => (
            <button
              key={index}
              className={`btn ${tab === selectedTab ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab)}>
              {tab}
            </button>
          ))}
        </div>
        {(selectedTab === 'Overview') && (
          <div className="admin-partner__detail-content__tab-content">
            <HotelDetailsDescription hotelData={hotel} />
          </div>
        )}
        {(selectedTab === 'Location') && (
          <div className="admin-partner__detail-content__tab-content">
            <HotelDetailsLocation hotelData={hotel} />
          </div>
        )}
        {(selectedTab === 'Room') && (
          <div className="admin-partner__detail-content__tab-content">
            <HotelDetailsRoom hotelData={hotel} />
          </div>
        )}
        {(selectedTab === 'Facilities') && (
          <div className="admin-partner__detail-content__tab-content">
            <HotelDetailsFacility hotelData={hotel} />
          </div>
        )}
        {(selectedTab === 'Reviews') && (
          <div className="admin-partner__detail-content__tab-content">
            <HotelDetailsGuestReview hotelData={hotel} />
          </div>
        )}
        {(selectedTab === 'More Information') && (
          <div className="admin-partner__detail-content__tab-content">
          </div>
        )}
      </div>
      <div className="admin-partner__detail-split admin-partner__detail-split--right">
        <div className="admin-partner__detail-hotel__action">
          <Link href="#" className="admin-partner__detail-hotel__action-button btn btn-md btn-warning admin-partner__detail-hotel__content-buttons">
            <SVGIcon src={Icons.Disabled} width={20} height={20} />
            Suspend
          </Link>
          <Link href="#" className="admin-partner__detail-hotel__action-button btn btn-md btn-danger admin-partner__detail-hotel__content-buttons">
            <SVGIcon src={Icons.Trash} width={20} height={20} />
            Delete
          </Link>
        </div>
        <div className="admin-partner__detail-hotel__action">
          {hotel?.featured_status === 0 && (
            <button className="admin-partner__detail-hotel__action-button btn btn-md btn-outline-success admin-partner__detail-hotel__content-buttons"
              data-bs-toggle="modal" data-bs-target="#featuredModal"
            >
              <SVGIcon src={Icons.CheckRounded} width={20} height={20} />
              Make Featured
            </button>
          )}
          {hotel?.featured_status === 1 && (
            <button className="admin-partner__detail-hotel__action-button btn btn-md btn-outline-danger admin-partner__detail-hotel__content-buttons"
              data-bs-toggle="modal" data-bs-target="#unfeaturedModal"
            >
              <SVGIcon src={Icons.Disabled} width={20} height={20} />
              Make Unfeatured
            </button>
          )}
        </div>
        <div className="admin-partner__detail-hotel__monthly">
          <h5 className="admin-partner__detail-hotel__monthly-title">Monthly Overview</h5>
          <div className="admin-partner__detail-hotel__monthly-grid">
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">Transaction</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{monthly_overview?.transaction}</p>
                <SVGIcon src={Icons.Money} className="admin-partner__detail-hotel__monthly-box-icon" width={20} height={20} />
              </div>
            </div>
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">New Booking</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{monthly_overview?.new_booking}</p>
                <SVGIcon src={Icons.Plus} className="admin-partner__detail-hotel__monthly-box-icon" width={20} height={20} />
              </div>
            </div>
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">Complete Booking</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{monthly_overview?.completed_booking}</p>
                <SVGIcon src={Icons.BookingComplete} className="admin-partner__detail-hotel__monthly-box-icon" width={20} height={20} />
              </div>
            </div>
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">Cancelled Booking</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{monthly_overview?.cancelled_booking}</p>
                <SVGIcon src={Icons.BookingCancel} className="admin-partner__detail-hotel__monthly-box-icon admin-partner__detail-hotel__monthly-box-icon--cancel " width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
        <div className="admin-partner__detail-hotel__owner">
          <div className="admin-partner__detail-hotel__owner-header">
            <h5 className="admin-partner__detail-hotel__owner-header-title">Owner</h5>
            <Link href="#" className="admin-partner__detail-hotel__owner-header-link">See Details</Link>
          </div>
          <div className="admin-partner__detail-hotel__owner-content">
            <img src={profilePlaceholder.src} className="admin-partner__detail-hotel__owner-photo" alt="Profile Picture" width={64} height={64} />
            <div className="admin-partner__detail-hotel__owner-detail">
              <p className="admin-partner__detail-hotel__owner-detail--name">{hotel?.hotel_business?.firstname} {hotel?.hotel_business?.lastname}</p>
              <p className="admin-partner__detail-hotel__owner-detail--other">{hotel?.hotel_business?.email}</p>
              <p className="admin-partner__detail-hotel__owner-detail--other">{hotel?.hotel_business?.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal UnFeatured */}
      <div className="modal fade" id="unfeaturedModal" tabIndex={-1} aria-labelledby="unfeaturedModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal">
          <div className="modal-content cancelation__modal-body">
            <div className="cancelation__modal-content">
              <div className="cancelation__modal-image">
                <SVGIcon src={Icons.Warning} width={48} height={48} />
              </div>
              <div className="cancelation__modal-text">
                <h3>You really want to make this hotel unfeatured ?</h3>
                <p className="cancelation__modal-desc">Unfeatured Hotel will not display in featured city page</p>
              </div>
            </div>
            <div className="cancelation__modal-footer">
              <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
              <button data-bs-dismiss="modal" className="btn btn-lg goform-button--fill-red cancelation__modal-button" onClick={() => {props.handleFeaturedStatus(hotel?.id_hotel, 0)}}>Make Unfeatured</button>
            </div>
          </div>
        </div>
      </div>
      {/* End Modal Unfeatured*/}

      {/* Modal UnFeatured */}
      <div className="modal fade" id="featuredModal" tabIndex={-1} aria-labelledby="featuredModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal">
          <div className="modal-content cancelation__modal-body">
            <div className="cancelation__modal-content">
              <div className="cancelation__modal-image--green">
                <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
              </div>
              <div className="cancelation__modal-text">
                <h3>This hotel will set to featured</h3>
                <p className="cancelation__modal-desc">Featured hotel will displayed in featured city pages</p>
              </div>
            </div>
            <div className="cancelation__modal-footer">
              <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
              <button data-bs-dismiss="modal" className="btn btn-lg goform-button--fill-green cancelation__modal-button" onClick={() => {props.handleFeaturedStatus(hotel?.id_hotel, 1)}}>Make Featured</button>
            </div>
          </div>
        </div>
      </div>
      {/* End Modal Unfeatured*/}
      
    </div>
  )
}

const HotelDetailsDescription = (props: HotelDataProps) => {
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState(2); // Default filter: this month
  const hotel = props?.hotelData;
  const id_hotel = hotel?.id_hotel;

  //Retrive Data from API
  const [overviewRevenue, setOverviewRevenue] = useState(null);
  const [overviewRevenueLoading, setOverviewRevenueLoading] = useState(true);
  const [overviewRevenueError, setOverviewRevenueError] = useState(null);

  const options = {
    elements: {
      bar: {
        borderRadius: 30,
        borderSkipped: false,
        barPercentage: 0.1
      }
    },
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          stepSize: 100
        }
      }
    },
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: false },
    }
  };

  // Initial labels and data for the chart
  const [chartData, setChartData] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Earnings",
        data: [180, 350, 340, 240, 100, 250, 50, 290, 310, 190, 110, 290],
        backgroundColor: "#1CB78D",
        barThickness: 6,
      },
      {
        label: "Booking",
        data: [100, 310, 240, 140, 370, 120, 220, 350, 160, 180, 330, 70],
        backgroundColor: "#8DDBC6",
        barThickness: 6,
      },
    ],
  });

  const payload = {
    id_hotel: id_hotel,
    filter: selectedFilter //filter (1 = this week, 2 = this month, 3 = this year) default = 2.
  };


  useEffect(() => {
    if (!id_hotel) return
    // Check if personalData or OverviewRevenue is already available
    if (overviewRevenue) return;

    const fetchOverviewRevenue = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-hotel-business/overview-revenue', 'POST', payload, true);

        // Update chart data based on fetched data
        const updatedChartData = {
          labels: data.map((item) => item.label), // Update labels based on fetched data
          datasets: [
            {
              label: "Earnings",
              data: data.map((item) => item.revenue), // Update data based on fetched data
              backgroundColor: "#1CB78D",
              barThickness: 6,
            },
            {
              label: "Booking",
              data: data.map((item) => item.total_booking), // Update data based on fetched data
              backgroundColor: "#8DDBC6",
              barThickness: 6,
            },
          ],
        };

        setChartData(updatedChartData);
        setOverviewRevenue(data);
        setOverviewRevenueLoading(false);
      } catch (error) {
        setOverviewRevenueError(error);
        setOverviewRevenueLoading(false);
      }
    };

    fetchOverviewRevenue();
  }, [id_hotel]);


  if (overviewRevenueLoading) {
    return <LoadingOverlay />;
  }

  if (overviewRevenueError) {
    return <div>Error Fetching Data</div>;
  }


  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);

    // Refetch data with the new filter value
    const newPayload = {
      id_hotel: id_hotel,
      filter: filterValue,
    };

    const fetchOverviewRevenue = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-hotel-business/overview-revenue', 'POST', newPayload, true);

        // Update chart data based on fetched data
        const updatedChartData = {
          labels: data.map((item) => item.label), // Update labels based on fetched data
          datasets: [
            {
              label: "Earnings",
              data: data.map((item) => item.revenue), // Update data based on fetched data
              backgroundColor: "#1CB78D",
              barThickness: 6,
            },
            {
              label: "Booking",
              data: data.map((item) => item.total_booking), // Update data based on fetched data
              backgroundColor: "#8DDBC6",
              barThickness: 6,
            },
          ],
        };

        setChartData(updatedChartData);
        setOverviewRevenue(data);
        setOverviewRevenueLoading(false);
      } catch (error) {
        setOverviewRevenueError(error);
        setOverviewRevenueLoading(false);
      }
    };

    fetchOverviewRevenue();
  };

  console.log("chartData", chartData)
  console.log("overviewRevenue", overviewRevenue)
  return (
    <div className="hotel-details__information admin-partner__detail-content__inner">
      <div className="hotel-details__information-header">
        <h4>Total Revenue</h4>
        <div className="custom-dropdown">
          <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
            <SVGIcon src={Icons.Filter} width={20} height={20} />
            <div style={{ whiteSpace: "nowrap" }}>
              {selectedFilter === 1
                ? 'This Week'
                : selectedFilter === 2
                  ? 'This Month'
                  : 'This Year'}
            </div>
            <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
          </div>
          <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-partner__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
            <div className="custom-dropdown-menu__options">
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly" onClick={() => handleFilterChange(1)}>
                This Week
              </Link>
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly" onClick={() => handleFilterChange(2)}>
                This Month
              </Link>
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly" onClick={() => handleFilterChange(3)}>
                This Year
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </div>
      <Bar options={options} data={chartData} />
    </div>
  )
}

const HotelDetailsRoom = (props: HotelDataProps) => {
  const hotel = props?.hotelData;
  const hotel_amenities = props.hotelData?.hotel_amenities;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className="hotel-details__room">
      <h4>Room</h4>
      <div className="hotel-details__room-wrapper">
        {hotel?.hotel_layout?.map((hotel_layout, index) => (
          <div key={index} className="hotel-details__room-item">
            <div className="hotel-details__room-item-preview">
              <Slider {...settings} className='hotel-details__slider-wrapper'>
                {hotel_layout.hotel_layout_photo.length > 0
                  ? hotel_layout?.hotel_layout_photo
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5)
                    .map((hotel_layout_photo, index) => (
                      <img key={index} src={hotel_layout_photo?.photo} className="hotel-details__room-item-preview-image" alt="hotel room image" width={265} height={265} />
                    ))
                  : <img src={Images.Placeholder} className="hotel-details__room-item-preview-image" alt="hotel room image" width={265} height={265} />
                }
              </Slider>
              <div className="hotel-details__room-item-preview-title">
                <h5>Standard Room</h5>
              </div>
            </div>
            <div className="hotel-details__room-item-list">
              {[...Array(hotel_layout.available_room > 0 ? hotel_layout.available_room : "")].map((_, index) => (
                <div key={index} className="hotel-details__room-detail">
                  <div className="hotel-details__room-detail-content">
                    <div className="hotel-details__room-detail-title">
                      <p>{hotel_layout.room_type}</p>
                      <div className="hotel-details__room-detail-facilities">
                        <div className="hotel-details__room-detail-facilities__item">
                          <SVGIcon src={Icons.FacilitiesDimension} width={20} height={20} />
                          <p>{hotel_layout.room_size}</p>
                        </div>
                        {hotel_amenities.map((hotel_amenities, index) => (
                          <>
                            <div className="hotel-details__room-detail-facilities__dots"></div>
                            <div key={index} className="hotel-details__room-detail-facilities__item">
                              <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
                              <p>{hotel_amenities.amenities_name}</p>
                            </div>
                          </>
                        ))}
                      </div>
                    </div>
                    <div className="hotel-details__room-detail-content--separator"></div>
                    <div className="hotel-details__room-detail-specification">
                      {hotel_layout?.bed_layout?.map((bed_layout, index) => (
                        <>
                          <div key={index} className="hotel-details__room-detail-facilities__item">
                            <SVGIcon src={Icons.Bed} width={20} height={20} />
                            <p>{bed_layout.amount} {bed_layout.bed_type}</p>
                          </div>
                        </>
                      ))}
                      <div className="hotel-details__room-detail-facilities__item">
                        <SVGIcon src={Icons.Users} width={20} height={20} />
                        <p>{hotel_layout.guest_count} guests</p>
                      </div>
                    </div>
                    <div className="hotel-details__room-detail-content--separator"></div>
                    <div className="hotel-details__room-detail-content-price">
                      <div className="hotel-details__room-detail-content-price__price">
                        <h5>$ {hotel_layout?.price}</h5>
                        <p className="hotel-details__room-detail-content-price__price-type">/ night</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const HotelDetailsLocation = (props: HotelDataProps) => {
  const hotel = props?.hotelData;
  console.log("hotel detail location : ", hotel);
  return (
    <div className="hotel-details__location">
      <h4>Location</h4>
      <iframe src={`https://www.google.com/maps?q=${hotel?.property_name}&output=embed`} height="330" loading="lazy"></iframe>
      <div className="hotel-details__location-details">
        <div className="hotel-details__location-details-header">
          <p className="hotel-details__location-details-name">{hotel?.city}, {hotel?.country}</p>
          <div className="hotel-details__location-details-specific">
            <SVGIcon src={Icons.MapPin} width={24} height={24} className="hotel-details__location-details-specific--pin" />
            <p>{hotel?.street_address}</p>
          </div>
        </div>
        <Link href={`https://www.google.com/maps?q=${hotel?.property_name}`} target="_blank" className="btn btn-sm btn-success admin-partner__detail-hotel__content-buttons">Open in Google maps</Link>
      </div>
    </div>
  )
}

const HotelDetailsFacility = (props: HotelDataProps) => {
  const hotel = props?.hotelData;
  console.log("hotel detail facility : ", hotel);
  return (
    <div className="hotel-details__facility admin-partner__hotel-details">
      <h4>Amenities and Facilities</h4>
      <div className="hotel-details__facility-wrapper">
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Amenities</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            {hotel?.hotel_amenities.map((hotel_amenities, index) => (
              <div key={index} className="hotel-details__facility-content-item">
                <SVGIcon src={Icons.Bed} width={20} height={20} />
                <p>{hotel_amenities.amenities_name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Facilities</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            {hotel?.hotel_facilities?.facilities.split(',').map((facility, index) => (
              <div key={index} className="hotel-details__facility-content-item">
                <div className="hotel-details__facility-content-item--dots"></div>
                <p>{facility}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hotel-details__facility-content">
          <p className="hotel-details__facility-content-title">Languages</p>
          <div className="hotel-details__facility-content-list hotel-details__facility-content-list--row hotel-details__facility-content-list--border">
            {hotel?.hotel_facilities?.languages.split(',').map((languages, index) => (
              <div key={index} className="hotel-details__facility-content-item">
                <div className="hotel-details__facility-content-item--dots"></div>
                <p>{languages}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const HotelDetailsGuestReview = (props: HotelDataProps) => {
  const hotel = props?.hotelData;
  function calculateFillWidth(fillValue) {
    return `${(fillValue / 5) * 100}%`;
  }
  return (
    <div className="hotel-details__guest">
      <h4>Guest Reviews</h4>
      <div className="hotel-details__guest-header">
        <div className="hotel-details__guest-header-rating">
          <div className="hotel-details__guest-header-chips">
            {hotel?.hotel_review_star_average !== undefined ? hotel?.hotel_review_star_average?.toFixed(1) : 'N/A'}
          </div>
          <p className="hotel-details__guest-header-overall">
            {hotel?.hotel_review_star_average >= 4.8
              ? "Excellent"
              : hotel?.hotel_review_star_average >= 3.5
                ? "Good"
                : "Normal"
            }
          </p>
          <div className="hotel-details__guest-header-dots"></div>
          <p>{hotel?.hotel_review?.length} reviews</p>
        </div>
        <select className="hotel-details__guest-header-filter" name="filterSort" id="filterSort">
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
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: hotel?.hotel_review_star_average !== undefined ? hotel?.hotel_review_star_average?.toFixed(1) : '0%' }}></div>
              </div>
              <p>{hotel?.hotel_review_staff !== undefined ? hotel?.hotel_review_staff?.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Staff</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: hotel?.hotel_review_star_average !== undefined ? hotel?.hotel_review_star_average?.toFixed(1) : '0%' }}></div>
              </div>
              <p>{hotel?.hotel_review_staff !== undefined ? hotel?.hotel_review_staff?.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Cleanliness</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: hotel?.hotel_review_clean !== undefined ? hotel?.hotel_review_clean?.toFixed(1) : '0%' }}></div>
              </div>
              <p>{hotel?.hotel_review_clean !== undefined ? hotel?.hotel_review_clean?.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Comfort</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: hotel?.hotel_review_comfortable !== undefined ? hotel?.hotel_review_comfortable?.toFixed(1) : '0%' }}></div>
              </div>
              <p>{hotel?.hotel_review_comfortable !== undefined ? hotel?.hotel_review_comfortable?.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Value for money </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: hotel?.hotel_review_money !== undefined ? hotel?.hotel_review_money?.toFixed(1) : '0%' }}></div>
              </div>
              <p>{hotel?.hotel_review_money !== undefined ? hotel?.hotel_review_money?.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Facilities </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: hotel?.hotel_review_facilities !== undefined ? hotel?.hotel_review_facilities?.toFixed(1) : '0%' }}></div>
              </div>
              <p>{hotel?.hotel_review_facilities !== undefined ? hotel?.hotel_review_facilities?.toFixed(1) : 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__guest-content">
          {hotel?.hotel_review.slice(0, 3).map((hotel_review, index) => (
            <div className="hotel-details__guest-review" key={index}>
              <div className="hotel-details__guest-review-guest">
                <img src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
                <div className="hotel-details__guest-review-guest--bio">
                  <p className="hotel-details__guest-review-guest--name">{hotel_review?.customer?.customer_personal?.fullname}</p>
                  <div className="hotel-details__guest-review-guest--location">
                    <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                    <p>{hotel_review?.customer?.customer_personal?.city}, {hotel_review?.customer?.customer_personal?.country}</p>
                  </div>
                </div>
              </div>
              <div className="hotel-details__guest-review-content">
                <div className="hotel-details__guest-review-content--chips">{hotel_review?.star}/5</div>
                <p>“{hotel_review?.description}“</p>
                <button className="hotel-details__guest-review-content--reaction">
                  <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                  Is this review helpful?
                </button>
              </div>
            </div>
          ))}
          <div className={`hotel-details__guest-pagination ${!hotel?.hotel_review?.length && 'd-none'}`}>
            <div className="pagination">
              <button type="button" className="pagination__button pagination__button--arrow">
                <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
              </button>
              <button type="button" className="pagination__button active">1</button>
              <button type="button" className="pagination__button">2</button>
              <button type="button" className="pagination__button">3</button>
              <button type="button" className="pagination__button">...</button>
              <button type="button" className="pagination__button">12</button>
              <button type="button" className="pagination__button pagination__button--arrow">
                <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ConfirmModal = () => {
  const router = useRouter()

  return (
    <>
      <div className="modal fade" id="confirmationModal" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog admin-partner__modal">
          <div className="modal-content admin-partner__modal-body">
            <div className="admin-partner__modal-content">
              <div className="admin-partner__modal-image">
                <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
              </div>
              <div className="admin-partner__modal-text">
                <h3>Approve Items</h3>
                <p className="admin-partner__modal-desc">Do you really want to agree to this item? Changes made cannot be changed again</p>
              </div>
            </div>
            <div className="admin-partner__modal-footer">
              <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-primary admin-partner__modal-button">Cancel</button>
              <a type='button' onClick={() => router.push('/admin-partner/hotel/done/')} className="btn btn-lg btn-success admin-partner__modal-button" data-bs-dismiss="modal">Request a refund</a>
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

export default PartnerHotelDetail
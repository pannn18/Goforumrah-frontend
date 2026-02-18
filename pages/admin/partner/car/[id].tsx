import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { callAPI } from '@/lib/axiosHelper'
import SVGIcon from "@/components/elements/icons"
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import DropdownMenu from "@/components/elements/dropdownMenu"
import profilePlaceholder from '@/assets/images/default_profile_64x64.png'
import hotelImagery1 from '@/assets/images/hotel_details_imagery_1.png'
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend, ScriptableContext } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import placeholder from '@/public/images/placeholder.svg'
import { useSession } from 'next-auth/react'
import LoadingOverlay from "@/components/loadingOverlay"

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend);

const PartnerCarDetail = (props) => {
  const router = useRouter()
  const { id } = router.query;
  const id_car_business = props.id ?? id;

  //Retrive Data from API
  const [carData, setCarData] = useState(null);
  const [carLoading, setCarLoading] = useState(true);
  const [carError, setCarError] = useState(null);

  useEffect(() => {
    if (!id_car_business) return

    // Check if personalData or hotelData is already available
    if (carData) return;

    const fetchCarData = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-car-business/car-details', 'POST', { id_car_business: id_car_business }, true);
        setCarData(data);
        setCarLoading(false);
      } catch (error) {
        setCarError(error);
        setCarLoading(false);
      }
    };

    fetchCarData();
  }, [id_car_business]);


  if (carLoading) {
    return <LoadingOverlay />
  }

  if (carError) {
    return <div>Error Fetching Data</div>;
  }

  // console.log("data : ", carData)

  return (
    <Layout>
      <AdminLayout enableBack={true} pageTitle="Car Details">
        <div className="admin-partner__detail">
          <div className="container">
            <PartnerCarDetailContent data={carData} />
          </div>
        </div>
      </AdminLayout>
      <ConfirmModal />
    </Layout>
  )
}

interface CarProps {
  data?: any
}

const PartnerCarDetailContent = (props: CarProps) => {
  const tabs = {
    'Overview': '',
    // 'Details': '',
    'Reviews': '',
  }
  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])
  const data = props.data

  return (
    <div className="admin-partner__detail-content">
      <div className="admin-partner__detail-split admin-partner__detail-split--main">
        <div className="admin-partner__detail-hotel">
          <BlurPlaceholderImage src={data?.car?.company_detail?.profile_icon ? data?.car?.company_detail?.profile_icon : placeholder} className="admin-partner__detail-hotel__image" alt="Trending City" width={200} height={193} />
          <div className="admin-partner__detail-hotel__content">
            <div className="admin-partner__detail-hotel__row admin-partner__detail-hotel__content-code">
              <p className="admin-partner__detail-hotel__content-code--text">{ }</p>
              <div className="admin-partner__detail-hotel__content-code--divider"></div>
              <p className="admin-partner__detail-hotel__content-code--text">Since {data?.car?.company_detail?.created_at && new Date(data?.car?.company_detail?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).replace(/(\d+)(st|nd|rd|th)/, '$1')}</p>
            </div>
            <h5 className="admin-partner__detail-hotel__name">{data?.car?.company_detail?.company_name ? data?.car?.company_detail?.company_name : 'Loading...'}</h5>
            <div className="admin-partner__detail-hotel__row">
              <div className="admin-partner__detail-hotel__col">
                <p className="admin-partner__detail-hotel__content-label">Status</p>
                {data?.car?.status === 1 && (
                  <div className="admin-partner__detail-content__header-chips admin-partner__detail-content__header-chips--active">Active</div>
                )}
                {data?.car?.status === 0 && (
                  <div className="admin-partner__detail-content__header-chips admin-partner__detail-content__header-chips--review">Waiting Review</div>
                )}
                {data?.car?.status === 2 && (
                  <div className="admin-partner__detail-content__header-chips admin-partner__detail-content__header-chips--inactive">Not Active</div>
                )}
                {data?.car?.status === 3 && (
                  <div className="admin-partner__detail-content__header-chips admin-partner__detail-content__header-chips--declined">Declined</div>
                )}
              </div>
              <div className="admin-partner__detail-hotel__col">
                <p className="admin-partner__detail-hotel__content-label">Star Rating</p>
                <div className="admin-partner__detail-hotel__content-inner">
                  <SVGIcon src={Icons.Star} width={16} height={16} className="admin-partner__detail-hotel__content-star" />
                  <p className="admin-partner__detail-hotel__content-text">5</p>
                </div>
              </div>
              <div className="admin-partner__detail-hotel__col">
                <p className="admin-partner__detail-hotel__content-label">Last active</p>
                <div className="admin-partner__detail-hotel__content-inner">
                  <SVGIcon src={Icons.CircleTime} width={16} height={16} className="admin-partner__detail-hotel__content-text" />
                  <p className="admin-partner__detail-hotel__content-text">{data?.car?.last_active ? data?.car?.last_active : 'Loading...'}</p>
                </div>
              </div>
            </div>
            <div className="admin-partner__detail-hotel__row">
              <Link href={`/admin/partner/car/edit?id=${data?.car?.id_car_business}`} className="btn btn-sm btn-success admin-partner__detail-hotel__content-buttons">Edit</Link>
              <Link href="/car-details" className="btn btn-sm btn-outline-success admin-partner__detail-hotel__content-buttons">Preview</Link>
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
            <CarDetailsOverview carData={data} />
            <CarBookingOverview carData={data} />
          </div>
        )}
        {(selectedTab === 'Details') && (
          <div className="admin-partner__detail-content__tab-content">
            <CarDetailsDescription />
          </div>
        )}
        {(selectedTab === 'Reviews') && (
          <div className="admin-partner__detail-content__tab-content">
            <CarDetailsGuestReview />
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
        <div className="admin-partner__detail-hotel__monthly">
          <h5 className="admin-partner__detail-hotel__monthly-title">Monthly Overview</h5>
          <div className="admin-partner__detail-hotel__monthly-grid">
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">Transaction</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{data?.monthly_overview?.transaction}</p>
                <SVGIcon src={Icons.Money} className="admin-partner__detail-hotel__monthly-box-icon" width={20} height={20} />
              </div>
            </div>
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">New Booking</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{data?.monthly_overview?.new_booking}</p>
                <SVGIcon src={Icons.Plus} className="admin-partner__detail-hotel__monthly-box-icon" width={20} height={20} />
              </div>
            </div>
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">Complete Booking</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{data?.monthly_overview?.completed_booking}</p>
                <SVGIcon src={Icons.BookingComplete} className="admin-partner__detail-hotel__monthly-box-icon" width={20} height={20} />
              </div>
            </div>
            <div className="admin-partner__detail-hotel__monthly-box">
              <p className="admin-partner__detail-hotel__monthly-box-label">Cancelled Booking</p>
              <div className="admin-partner__detail-hotel__monthly-box-content">
                <p>{data?.monthly_overview?.cancelled_booking}</p>
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
            <BlurPlaceholderImage src={profilePlaceholder} className="admin-partner__detail-hotel__owner-photo" alt="Profile Picture" width={64} height={64} />
            <div className="admin-partner__detail-hotel__owner-detail">
              <p className="admin-partner__detail-hotel__owner-detail--name">John Doe</p>
              <p className="admin-partner__detail-hotel__owner-detail--other">Johndoe@gmail.com</p>
              <p className="admin-partner__detail-hotel__owner-detail--other">+1 888 888 888</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CarDetailsOverview = (props) => {
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState(2); // Default filter: this month
  const {carData} = props
  // console.log("carData CarDetailsOverview :", carData)
  const id_car_business = carData?.car?.id_car_business

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
        barThickness: 6
      },
      {
        label: "Booking",
        data: [100, 310, 240, 140, 370, 120, 220, 350, 160, 180, 330, 70],
        backgroundColor: "#8DDBC6",
        barThickness: 6
      }
    ],
  });

  const payload = {
    id_car_business: id_car_business,
    filter: selectedFilter //filter (1 = this week, 2 = this month, 3 = this year) default = 2.
  };

  useEffect(() => {
    if (!id_car_business) return
    // Check if personalData or OverviewRevenue is already available
    if (overviewRevenue) return;

    const fetchOverviewRevenue = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-car-business/overview-revenue', 'POST', payload, true);

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
  }, [id_car_business]);


  if (overviewRevenueLoading) {
    return <LoadingOverlay />;
  }

  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);

    // Refetch data with the new filter value
    const newPayload = {
      id_car_business: id_car_business,
      filter: filterValue,
    };

    const fetchOverviewRevenue = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-car-business/overview-revenue', 'POST', newPayload, true);

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

  return (
    <div className="hotel-details__information admin-partner__detail-content__inner">
      <div className="hotel-details__information-header">
        <h4>More Information</h4>
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
      {overviewRevenueError ? (
        <div>Error Fetching Data</div>
      ) : (
        <Bar options={options} data={chartData} />
      )}
    </div>
  )
}

const CarBookingOverview = (props) => {
  const [selectedFilter, setSelectedFilter] = useState(2); // Default filter: this month
  const {carData} = props
  const id_car_business = carData?.car?.id_car_business

  //Retrive Data from API
  const [overviewBooking, setOverviewBooking] = useState(null);
  const [overviewBookingLoading, setOverviewBookingLoading] = useState(true);
  const [overviewBookingError, setOverviewBookingError] = useState(null);

  const booking = [
    { id: '01', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
    { id: '02', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
    { id: '03', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
    { id: '04', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
    { id: '05', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
    { id: '06', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
    { id: '07', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
    { id: '08', type: 'Mercedez-Benz E-Class Estate', pickupDate: 'Fri, 05 Oct 22', pickupLocation: 'King Abdulaziz International Airport - Jeddah', dropoffDate: 'Mon, 8 Oct 22', dropoffLocation: 'Makkah Station - Mekkah', status: '0', linkURL: '#' },
  ]
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)

  const payload = {
    id_car_business: id_car_business,
    filter: selectedFilter //filter (1 = this week, 2 = this month, 3 = this year) default = 2.
  };
  
  const handleFilterChange = (filterValue) => {
    setSelectedFilter(filterValue);
  };

  const fetchOverviewBooking = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/admin-car-business/overview-booking', 'POST', payload, true);
      setOverviewBooking(data);
      setOverviewBookingLoading(false);
    } catch (error) {
      setOverviewBookingError(error);
      setOverviewBookingLoading(false);
    }
  };

  useEffect(() => {
    if (!id_car_business) return

    fetchOverviewBooking();
  }, [id_car_business, selectedFilter]);

  // console.log("overviewBooking : ", overviewBooking, " selectedFilter : ", selectedFilter);
  return (
    <div className="admin-partner__detail-content__inner">
      <div className="admin-partner__detail-content__inner-head">
        <div className="admin-partner__detail-content__inner-head--left">
          <h5>Booking Overview</h5>
        </div>
        <div className="custom-dropdown">
          <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
            <SVGIcon src={Icons.Filter} width={20} height={20} />
            <div style={{ whiteSpace: "nowrap" }}>{selectedFilter === 1 ? 'This Week' : selectedFilter === 2 ? 'This Month' : 'This Year'}</div>
            <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
          </div>
          <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-partner__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
            <div className="custom-dropdown-menu__options">
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly" onClick={(e) => {
                e.preventDefault();
                handleFilterChange(1)
                }}>
                This Week
              </Link>
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly" onClick={(e) => {
                e.preventDefault();
                handleFilterChange(2)
                }}>
                This Month
              </Link>
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly" onClick={(e) => {
                e.preventDefault();
                handleFilterChange(3)
                }}>
                This Year
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </div>
      <div className="admin-partner__content">
        {overviewBookingLoading ? (
          <p>Loading ...</p>
        ) : (
          <table className="admin-partner__table">
            <thead>
              <tr className="admin-partner__table-list">
                <th>No.</th>
                <th>Car Type</th>
                <th>Pick-up</th>
                <th>Drop-off</th>
                <th className="admin-partner__table-list--center">Status</th>
              </tr>
            </thead>
            <tbody>
              { overviewBooking.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-partner__table-list--empty">
                    No data
                  </td>
                </tr>
              ) : overviewBooking.map((booking, index) => (
                <tr className="admin-partner__table-list" key="index">
                  <td>{index + 1}</td>
                  <td className="admin-partner__table-list--truncate">{booking?.car_brand} {booking?.model} {booking?.edition}</td>
                  <td className="admin-partner__table-list--truncate">
                    <div className="admin-partner__table-list--col">
                      <p>{booking?.pickup}</p>
                      <p className="admin-partner__table-list--col-desc">{booking?.pickup_date_time}</p>
                    </div>
                  </td>
                  <td className="admin-partner__table-list--truncate">
                    <div>
                      <p>{booking?.dropoff}</p>
                      <p className="admin-partner__table-list--col-desc">{booking?.dropoff_date_time}</p>
                    </div>
                  </td>
                  <td>
                    {booking?.status === 0 ? (
                      <div className="admin-partner__table-status admin-partner__table-status--waiting">Waiting Payment</div>                      
                    ) : booking?.status === 1 ? (
                      <div className="admin-partner__table-status admin-partner__table-status--waiting">Waiting Credit Card Verification</div>                      
                    ) : booking?.status === 2 ? (
                      <div className="admin-partner__table-status admin-partner__table-status--paid">Confrimed</div>                      
                    ) : booking?.status === 2 ? (
                      <div className="admin-partner__table-status admin-partner__table-status--paid">Confrimed</div>                      
                    ) : booking?.status === 2 && booking?.dropoff_date_time <= new Date() ? (
                      <div className="admin-partner__table-status admin-partner__table-status--paid">Completed</div>                      
                    ) : (
                      <div className="admin-partner__table-status admin-partner__table-status--completed">undifined</div>
                    )}
                  </td>
                </tr>
              ))}
              {/* {booking.map((car, index) => (
                <BookingList {...car} key={index} />
              ))} */}
            </tbody>
          </table>          
        )}
      </div>
    </div>
  )
}

const CarDetailsDescription = () => {
  return (
    <div className="hotel-details__summary" style={{ paddingTop: "0" }}>
      <div className="hotel-details__summary-main">
        <div className="hotel-details__summary-item">
          <h3>Mercedez-Benz E-Class Estate</h3>
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
              <p>4 passengers</p>
            </div>
            <div className="hotel-details__summary-left-location--dots"></div>
            <div className="hotel-details__summary-left-details">
              <SVGIcon src={Icons.Users} width={20} height={20} className="" />
              <p>2 baggages</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__summary-item">
          <div className="hotel-details__summary-benefit">
            <SVGIcon src={Icons.MapPinOutline} width={24} height={24} color="#616161" />
            <div className="mb-1">
              <p className="hotel-details__summary-benefit-title">King Abdulaziz International Airport</p>
              <p className="hotel-details__summary-benefit-subtitle">Free Shuttle Bus</p>
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
          <div className="hotel-details__desc-facilities">
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.Seats} width={20} height={20} />
              <p>4 Seats</p>
            </div>
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.Door} width={20} height={20} />
              <p>4 Doors</p>
            </div>
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.Compas} width={20} height={20} />
              <p>Manual</p>
            </div>
            <div className="hotel-details__desc-facilities-item hotel-details__desc-facilities-item--grow">
              <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
              <p>Air Conditioning</p>
            </div>
            <button className="hotel-details__desc-facilities-more btn btn-lg btn-outline-success text-neutral-primary">See more fasilities</button>
          </div>

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
    </div>
  )
}

const CarDetailsGuestReview = () => {
  return (
    <div className="hotel-details__guest">
      <h4>Passengers Reviews</h4>
      <div className="hotel-details__guest-header">
        <div className="hotel-details__guest-header-rating">
          <div className="hotel-details__guest-header-chips">4.9</div>
          <p className="hotel-details__guest-header-overall">Good</p>
          <div className="hotel-details__guest-header-dots"></div>
          <p>255 reviews</p>
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
            <p>Value for money </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "92%" }}></div>
              </div>
              <p>4,6</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Condition</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "96%" }}></div>
              </div>
              <p>4,8</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Cleanliness</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "98%" }}></div>
              </div>
              <p>4,9</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Facilities</p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "90%" }}></div>
              </div>
              <p>4,5</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Comfort </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "88%" }}></div>
              </div>
              <p>4,6</p>
            </div>
          </div>
          <div className="hotel-details__guest-summary-item">
            <p>Staff </p>
            <div className="hotel-details__guest-summary-rate">
              <div className="hotel-details__guest-summary-bar">
                <div className="hotel-details__guest-summary-bar--filler" style={{ width: "98%" }}></div>
              </div>
              <p>4,9</p>
            </div>
          </div>
        </div>
        <div className="hotel-details__guest-content">
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Jerome Bell</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Marvin McKinney</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Darlene Robertson</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Cameron Williamson</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-review">
            <div className="hotel-details__guest-review-guest">
              <BlurPlaceholderImage src={Images.Placeholder} className="hotel-details__guest-review-guest--profile" alt="Guest Profile" width={48} height={48} />
              <div className="hotel-details__guest-review-guest--bio">
                <p className="hotel-details__guest-review-guest--name">Arlene McCoy</p>
                <div className="hotel-details__guest-review-guest--location">
                  <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} />
                  <p>Jakarta, Indonesia</p>
                </div>
              </div>
            </div>
            <div className="hotel-details__guest-review-content">
              <div className="hotel-details__guest-review-content--chips">4.5/5</div>
              <p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. “</p>
              <button className="hotel-details__guest-review-content--reaction">
                <SVGIcon src={Icons.ThumbsUp} width={16} height={16} />
                Is this review helpful?
              </button>
            </div>
          </div>
          <div className="hotel-details__guest-pagination">
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

interface BookingListProps {
  id: string,
  type: string,
  pickupDate: string,
  pickupLocation: string,
  dropoffDate: string,
  dropoffLocation: string,
  status: string,
  linkURL: string,
}
const BookingList = (props: BookingListProps) => {
  const { id, type, pickupDate, pickupLocation, dropoffDate, dropoffLocation, status, linkURL } = props
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  return (
    <tr className="admin-partner__table-list">
      <td>{id}</td>
      <td className="admin-partner__table-list--truncate">{type}</td>
      <td className="admin-partner__table-list--truncate">
        <div className="admin-partner__table-list--col">
          <p>{pickupLocation}</p>
          <p className="admin-partner__table-list--col-desc">{pickupDate}</p>
        </div>
      </td>
      <td className="admin-partner__table-list--truncate">
        <div>
          <p>{dropoffLocation}</p>
          <p className="admin-partner__table-list--col-desc">{dropoffDate}</p>
        </div>
      </td>
      <td>
        <div className="admin-partner__table-status admin-partner__table-status--ongoing">Ongoing</div>
      </td>
      <td>
        <div className="custom-dropdown">
          <div onClick={() => setShowActionDropdown(true)} className="custom-dropdown-toggle admin-partner__table-dropdown">
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu show={showActionDropdown} setShow={setShowActionDropdown} className="admin-partner__header-dropdown-menu" style={{ marginTop: 8, marginLeft: -110, width: 155 }}>
            <div className="custom-dropdown-menu__options">
              <Link href={`/admin/partner/car/details?status=${status}`} className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-partner__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Eye} width={20} height={20} className="" />
                  <p>See Details</p>
                </div>
              </Link>
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-partner__dropdown-menu-option-delete">
                  <SVGIcon src={Icons.Trash} width={20} height={20} className="" />
                  <p>Delete</p>
                </div>
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </td>
    </tr>
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

export default PartnerCarDetail
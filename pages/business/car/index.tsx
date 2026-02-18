import Layout from '@/components/layout'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom';
import Navbar from '@/components/business/car/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import DropdownMenu from "@/components/elements/dropdownMenu"
import { useState } from "react"
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { Chart as ChartJS, ScriptableContext, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from "chart.js";
import { Chart, Line } from "react-chartjs-2"
import { useSession } from 'next-auth/react';
import { callAPI } from '@/lib/axiosHelper';
import moment from 'moment';
import LoadingOverlay from '@/components/loadingOverlay';

export default function DashboardUser() {

  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)

  const [loading, setLoading] = useState(true)
  const [dataOverview, setDataOverview] = useState({
    "new_reservation": false,
    "overview": [],
    "total_car": 0,
    "total_rented": 0,
    "available_car": 0,
    "reservation_today": 0,
    "reservation_tomorrow": 0,
    "customer_feedback": null
  })
  const [company, setCompany] = useState<any>(null)

  useEffect(() => {
    if (!id_car_business) return

    const getData = async () => {
      try {
        // Get data for overview
        const { data, error, ok } = await callAPI('/car-business-dashboard/overview', 'POST', { id_car_business: id_car_business }, true)
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setDataOverview(data)
        }


        // Get data for header company
        const { data: company, error: companyError, ok: companyOk } = await callAPI('/car-business/details/show', 'POST', { id_car_business: id_car_business }, true)
        if (companyError) {
          console.log(companyError);
        }
        if (companyOk) {
          setCompany(company)
        }

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }

    }

    getData()

  }, [id_car_business])

  if (loading) {
    return <LoadingOverlay />
  }


  return (
    <Layout>
      <div className="car-dashboard">
        <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
        <div className="container">
          <div className='car-dashboard__content-container'>
            <NotificationDashboard new_reservation={dataOverview.new_reservation} />
            <CarDashboardUser
              total_car={dataOverview.total_car}
              available_car={dataOverview.available_car}
              reservation_today={dataOverview.reservation_today}
              reservation_tomorrow={dataOverview.reservation_tomorrow}
              overview={getChartData(dataOverview.overview)}

              company={company}
            />
            <DashboardTable />
          </div>
        </div>
      </div>
    </Layout>
  )
};

interface NotificationDashboardProps {
  new_reservation: boolean
}
const NotificationDashboard: React.FC<NotificationDashboardProps> = (props: NotificationDashboardProps) => {

  const [showNotification, setShowNotification] = useState(props.new_reservation);

  const handleClose = () => {
    setShowNotification(false);
  };

  return (
    <>
      {showNotification && (
        <div className="notification"
          style={showNotification ?
            {
              border: '1px solid #C2C8ED',
              padding: '1.875rem 1.5rem',
              backgroundColor: '#F8F8FD',
              borderRadius: '12px',
              marginBottom: '1.25rem'
            } : {}}>
          <div className="car-dashboard__notification-content">
            <div className="car-dashboard__notification-content--left">
              <SVGIcon src={Icons.InfoBlue} width={48} height={48} color="#475BCA" />
              <div className="car-dashboard__notification-text">
                <p className="car-dashboard__notification-title">New Reservation</p>
                <p className="car-dashboard__notification-caption">You have a new booking, please check it to know more details</p>
              </div>
            </div>
            <button onClick={handleClose} className='car-dashboard__notification-btn'>
              <SVGIcon src={Icons.CloseIcon} width={11} height={11} color="#1B1B1BF5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

interface CarDashboardUserProps {
  total_car: number;
  available_car: number;
  reservation_today: number;
  reservation_tomorrow: number;
  overview: any;

  company: any;
}

const CarDashboardUser = (props: CarDashboardUserProps) => {
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)
  const [feedback, setFeedback] = useState(null)

  const getReviewData = async () => {
    const payload = {
      id_car_business: id_car_business,
    }
    try {
      const { ok, error, data } = await callAPI('/car-business-dashboard/customer-feedback', 'POST', payload, true)
      if (error) {
        console.log(error);
      }
      if (ok) {
        setFeedback(data)
      }
    } catch (error) {
      console.log('Error Fetch Data');
    }
  }

  useEffect(() => {
    if (!id_car_business || feedback) return

    getReviewData()
  }, [feedback, id_car_business])

  const totalStarReview =
    feedback?.car_review_rating?.one_star +
    feedback?.car_review_rating?.two_star +
    feedback?.car_review_rating?.three_star +
    feedback?.car_review_rating?.four_star +
    feedback?.car_review_rating?.five_star

  return (
    <Layout>
      <form >
        <div className="car-dashboard__content-form">
          <div className="car-dashboard__content-user">
            <div className="car-dashboard__user-title">
              <SVGIcon src={Icons.DashoardUserIcon} width={48} height={48} />
              <div className="car-dashboard__content-text">
                <h4 className="car-dashboard__title-caption">{props.company?.company_name}</h4>
                <p className="car-dashboard__content-caption">#{props.company?.id_car_business}</p>
              </div>
            </div>
            {/* <button className="goform-live">
              <p className="car-dashboard__content-button">See Live</p>
              <SVGIcon src={Icons.ArrowCircleRight} width={20} height={20} color="#1CB78D" />
            </button> */}
          </div>
        </div>
        <div className="car-dashboard__content-form">
          <div className="car-dashboard__content row">
            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12">
              <div className="car-dashboard__content-statistic">
                <div className="car-dashboard__statistic-wrapper">

                  <div className="car-dashboard__content-progress">
                    <div className="car-dashboard__progress-title">
                      <p className="car-dashboard__content-caption-title">Available Car</p>
                    </div>
                    <div className="car-dashboard__progress-wrapper">
                      <div className="car-dashboard__progress-card">
                        <div className="car-dashboard__reservation-content">
                          <p className="car-dashboard__caption-reservation">Available Car</p>
                          <h5 className="car-dashboard__reservation-status">{props.available_car}</h5>
                        </div>
                      </div>
                      <div className="car-dashboard__progress-card">
                        <div className="car-dashboard__reservation-content">
                          <p className="car-dashboard__caption-reservation">Total Car</p>
                          <h5 className="car-dashboard__reservation-status">{props.total_car}</h5>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="car-dashboard__content-progress">
                    <div className="car-dashboard__progress-title">
                      <p className="car-dashboard__content-caption-title">Reservation Status</p>

                    </div>
                    <div className="car-dashboard__progress-wrapper">
                      <div className="car-dashboard__progress-card">
                        <div className="car-dashboard__reservation-content">
                          <p className="car-dashboard__caption-reservation">Today</p>
                          <h5 className="car-dashboard__reservation-status">{props.reservation_today}</h5>
                        </div>
                      </div>
                      <div className="car-dashboard__progress-card">
                        <div className="car-dashboard__reservation-content">
                          <p className="car-dashboard__caption-reservation">Tomorow</p>
                          <h5 className="car-dashboard__reservation-status">{props.reservation_tomorrow}</h5>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <div className="car-dashboard__chart-wrapper">
                  <h5>Order Overview</h5>
                  <div style={{ height: 278 }}>
                    <Line options={options} data={props.overview} height={278} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
              <div className="car-dashboard__feedback">
                <p className="car-dashboard__user-title">Customer Feedback</p>
                <div className="car-dashboard__feedback-card">
                  <div className="car-dashboard__card-content">
                    <div className="car-dashboard__feedback-card--left">
                      <div className="car-dashboard__content-wrapper">
                        <SVGIcon src={Icons.Star} width={24} height={24} color="#EECA32" />
                        <div className="car-dashboard__feedback-rating">
                          <h5 className="car-dashboard__rating-active">{feedback?.car_review_rating?.star_average || 0}</h5>
                          <p className='car-dashboard__rating-default'>/5.0</p>
                        </div>
                      </div>
                      <p className="car-dashboard__user-caption">Base on {totalStarReview || 0} Customer review</p>
                    </div>
                    <Link href={"/business/car/customer-feedback"} className="goform-live goform-live--borderless">
                      <p className="car-dashboard__content-button car-dashboard__content-button--green">See all</p>
                      <SVGIcon src={Icons.ArrowCircleRight} width={20} height={20} color="#1CB78D" className='car-dashboard__svg-button' />
                    </Link>
                  </div>
                </div>
                <p className="car-dashboard__user-title">Quick Menu</p>
                <div className="car-dashboard__card-menu">
                  <div className="car-dashboard__card-content">
                    <div className="car-dashboard__card-menu--left">
                      <SVGIcon src={Icons.UserThree} width={20} height={20} color="#1CB78D" />
                      <p className="car-dashboard__card-menu-title">All Reservation</p>
                    </div>
                    <Link href={"/business/car/reservation"} className="goform-live goform-live--borderless">
                      <p className="car-dashboard__content-button car-dashboard__content-button--green">See all</p>
                      <SVGIcon src={Icons.ArrowCircleRight} width={20} height={20} color="#1CB78D" className='car-dashboard__svg-button' />
                    </Link>
                  </div>
                </div>
                <div className="car-dashboard__card-menu">
                  <div className="car-dashboard__card-content">
                    <div className="car-dashboard__card-menu--left">
                      <SVGIcon src={Icons.Car} width={20} height={20} color="#1CB78D" />
                      <p className="car-dashboard__card-menu-title">My Fleet</p>
                    </div>
                    <Link href='/business/car/my-fleet' className="goform-live goform-live--borderless">
                      <p className="car-dashboard__content-button car-dashboard__content-button--green">See all</p>
                      <SVGIcon src={Icons.ArrowCircleRight} width={20} height={20} color="#1CB78D" className='car-dashboard__svg-button' />
                    </Link>
                  </div>
                </div>
                <div className="car-dashboard__card-menu">
                  <div className="car-dashboard__card-content">
                    <div className="car-dashboard__card-menu--left">
                      <SVGIcon src={Icons.MapPin} width={20} height={20} color="#1CB78D" />
                      <p className="car-dashboard__card-menu-title">Location Management</p>
                    </div>
                    <Link href={"/business/car/location"} className="goform-live goform-live--borderless">
                      <p className="car-dashboard__content-button car-dashboard__content-button--green">See all</p>
                      <SVGIcon src={Icons.ArrowCircleRight} width={20} height={20} color="#1CB78D" className='car-dashboard__svg-button' />
                    </Link>
                  </div>
                </div>
                <div className="car-dashboard__card-menu">
                  <div className="car-dashboard__card-content">
                    <div className="car-dashboard__card-menu--left">
                      <SVGIcon src={Icons.ChartPie} width={20} height={20} color="#1CB78D" />
                      <p className="car-dashboard__card-menu-title">Allocation</p>
                    </div>
                    <Link href={"/business/car/allocation"} className="goform-live goform-live--borderless">
                      <p className="car-dashboard__content-button car-dashboard__content-button--green">See all</p>
                      <SVGIcon src={Icons.ArrowCircleRight} width={20} height={20} color="#1CB78D" className='car-dashboard__svg-button' />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Layout>
  )
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);
export const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      ticks: { stepSize: 100 }
    }
  },
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: false },
  }
};


const getChartData = (overviewData: any[]) => {

  return {
    labels: overviewData.map(item => item.month),
    datasets: [
      {
        fill: true,
        label: "Sales",
        // data: [350, 150, 320, 240, 100, 250, 50, 290, 310, 190, 110, 290],
        data: overviewData.map(item => item.reservation),
        borderColor: '#1CB78D',
        borderWidth: 1,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0.21, "rgba(28, 183, 141, 0.4)");
          gradient.addColorStop(0.84, "rgba(28, 183, 141, 0)");
          return gradient;
        },
        pointBackgroundColor: '#1CB78D',
        pointBorderWidth: 2,
        pointBorderColor: '#FFFFFF',
        pointRadius: 8,
        pointHoverRadius: 10
      },
    ],
  }
}



const DashboardTable = () => {
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)

  const [dataRecentOrder, setDataRecentOrder] = useState([])
  const [loading, setLoading] = useState(false);

  // Sort
  const [sort, setSort] = useState('DESC')

  // Filter
  const [filter, setFilter] = useState<string>(null)
  const [displayFilter, setDisplayFilter] = useState<string>('All Times')

  // Search
  const [search, setSearch] = useState<string>('')
  const [searchResult, setSearchResult] = useState([])

  useEffect(() => {
    if (!id_car_business) return
    setLoading(true)

    const payload = {
      id_car_business: id_car_business,
      sort: sort,
      date_range: filter
    }

    const getRecentOrder = async () => {
      try {
        const { data, error, ok } = await callAPI('/car-business-dashboard/recent-order', 'POST', payload, true)
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setDataRecentOrder(data)
          setSearchResult(data)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }

    }

    getRecentOrder()

  }, [id_car_business, sort, filter])

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleFilterToggle = () => {
    setShowFilterDropdown(!showFilterDropdown);
    setShowSortDropdown(false);
  };

  const handleSortToggle = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFilterDropdown(false);
  };

  const handleSort = (sort) => {
    setSort(sort)
    setShowSortDropdown(false)
  }

  const handleFilter = (filter) => {
    setFilter(filter)
    setShowFilterDropdown(false)
  }

  const handleSearch = (e) => {
    const search = e.target.value
    setSearch(search)

    const searchResult = dataRecentOrder.filter(item =>
      item.fullname.toLowerCase().includes(search.toLowerCase())
    )

    setSearchResult(searchResult)
  }

  return (
    <div className="dashboard__data">
      <h5 className="car-dashboard__content-title">Recent Order</h5>
      <div className="car-dashboard__content-wrappers">
        <div className="admin-customer__header-search">
          <input type="text" value={search} onChange={handleSearch} className="form-control car-dashboard__input-search" placeholder="Search" />
          <SVGIcon src={Icons.Search} width={20} height={20} />
        </div>
        <div className="car-dashboard__content-filter">
          <div className="custom-dropdown">
            <div onClick={handleFilterToggle} className="custom-dropdown-toggle">
              <SVGIcon src={Icons.Filter} width={20} height={20} />
              <div style={{ whiteSpace: "nowrap" }}>{displayFilter}</div>
              <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
            </div>
            {showFilterDropdown && (
              <div className="admin-customer__header-dropdown-menu" style={{ marginTop: 8, position: 'absolute', top: '100%', left: '0', zIndex: '1', backgroundColor: '#ffffff', padding: '0.5rem', border: '1px solid #C2C8ED', borderRadius: '12px' }}>
                <div className="custom-dropdown-menu__options">
                  <Link
                    href={'#'}
                    onClick={() => {
                      handleFilter(null)
                      setDisplayFilter('All Times')
                    }}
                    className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                  >
                    All Times
                  </Link>
                  <Link
                    href={'#'}
                    onClick={() => {
                      handleFilter('today')
                      setDisplayFilter('Today')
                    }}
                    className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                  >
                    Today
                  </Link>
                  <Link
                    href={'#'}
                    onClick={() => {
                      handleFilter('weekly')
                      setDisplayFilter('This Week')
                    }}
                    className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                  >
                    This Week
                  </Link>
                  <Link
                    href={'#'}
                    onClick={() => {
                      handleFilter('monthly')
                      setDisplayFilter('This Month')
                    }}
                    className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                  >
                    This Month
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="custom-dropdown">
            <div onClick={handleSortToggle} className="custom-dropdown-toggle">
              <SVGIcon src={Icons.Filter} width={20} height={20} />
              <div style={{ whiteSpace: "nowrap" }}>{(sort === 'DESC') ? ('Newest') : ('Oldest')}</div>
              <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
            </div>
            {showSortDropdown && (
              <div className="admin-customer__header-dropdown-menu" style={{ marginTop: 8, position: 'absolute', top: '100%', left: '0', zIndex: '1', backgroundColor: '#ffffff', padding: '0.5rem', border: '1px solid #C2C8ED', borderRadius: '12px' }}>
                <div className="custom-dropdown-menu__options">
                  <Link href="#" onClick={() => handleSort('DESC')} className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    Newest
                  </Link>
                  <Link href="#" onClick={() => handleSort('ASC')} className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    Oldest
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="table-responsive">
        <table className="dashboard__data-table table">
          <thead>
            <tr className="dashboard__data-list">
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Car</th>
              <th>Rent</th>
              <th>Return</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="dashboard__data-list">
                <td className='text-center' colSpan={7}>Loading...</td>
              </tr>
            ) : (
              searchResult.map((item, index) => (
                <DataList {...item} key={index} />
              ))
            )}

          </tbody>
        </table>

        {!loading && searchResult.length === 0 &&
          <p className='text-center w-100'>Data not found</p>
        }
      </div>
    </div>
  )
}

interface PropsDataList {
  id_car_booking: number;
  id_customer: number;
  created_at: string;
  fullname: string;
  car_brand: string;
  pickup_date_time: string;
  dropoff_date_time: string;
}

const DataList = (props: PropsDataList) => {
  const { id_car_booking, id_customer, created_at, fullname, car_brand, pickup_date_time, dropoff_date_time } = props

  return (
    <tr className="dashboard__data-list">
      <td>{id_car_booking}</td>
      <td>{moment(created_at).format("DD/MMM/YYYY")}</td>
      <td>{fullname}</td>
      <td>{car_brand}</td>
      <td>
        {moment(pickup_date_time).format("ddd, MMM DD, YYYY")}
        <br />
        {moment(pickup_date_time).format("LT")}
      </td>
      <td>
        {moment(dropoff_date_time).format("ddd, MMM DD, YYYY")}
        <br />
        {moment(dropoff_date_time).format("LT")}
      </td>
      <td><Link href={`/business/car/reservation/details?id_car_booking=${id_car_booking}&id_customer=${id_customer}`} className="dashboard__data-link">See Details</Link></td>
    </tr>
  )

}


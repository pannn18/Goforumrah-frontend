import Layout from "@/components/layout"
import Navbar from "@/components/layout/navbar"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect, useRef, Fragment } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import DropdownMenu from "@/components/elements/dropdownMenu"
import { Images } from "@/types/enums"
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend, ScriptableContext } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import countryLabels from 'react-phone-number-input/locale/en.json'
import { CountryCode } from 'libphonenumber-js/types'
import PhoneInput from 'react-phone-number-input/input'
import { callAPI } from "@/lib/axiosHelper"
import LoadingOverlay from "@/components/loadingOverlay"
import iconCancel from "assets/images/icon_cancel_soft.svg";
import iconCheck from 'assets/images/icon_check_soft.svg'



ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Filler, Legend);

interface AdminAgentDetailContentProps {
  personal: any;
  salesOverview: any;
}

interface MonthlyAgentOverviewProps {
  personal: any;
  monthlyOverview: any;
}

interface BookingAgentTableProps {
  bookingData: any;
}

export default function AdminCustomerDetail() {

  const router = useRouter()
  const { id } = router.query
  // console.log(id)

  const [agentSpecificData, setAgentSpecificData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDataAgentDetails = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-agent/agent-details', 'POST', { id_agent: id }, true)
        if (ok) {
          // console.log(data)
          setIsLoading(false);
          setAgentSpecificData(data);
        } else {
          console.error('Failed to fetch agent details:', error);
        }
      } catch (err) {
        console.error('Error:', err.message);
      }
    }

    fetchDataAgentDetails();
  }, [id]);

  const handleChangeStatus = async (status, note) => {
    const { ok, error, data } = await callAPI('/admin-agent/update-status', 'POST', { id_agent: id, status: status, note: note }, true)
    if (ok) {
      console.log(data)
    } else if (error) {
      console.log(error)
    }
    window.location.reload()
  }

  const handleSoftDelete = async (soft_delete) => {
    const { ok, error, data } = await callAPI('/admin-agent/update-status', 'POST', { id_agent: id, soft_delete: soft_delete }, true)
    if (ok) {
      console.log(data)
    } else if (error) {
      console.log(error)
    }
    router.push('/admin/agent');
  }

  const bookingAgent = agentSpecificData?.booking_data
  const personalAgent = agentSpecificData?.personal_info
  const monthlyAgentOverview = agentSpecificData?.monthly_overview
  const salesAgentOverview = agentSpecificData?.sales_overview
  console.log(agentSpecificData)

  return (
    <Layout>
      <AdminLayout pageTitle="Agent Details" enableBack={true}>
        {isLoading ? (
          <LoadingOverlay />
        ) : (
          <div className="admin-agent">
            <div className="container">
              <div className="admin-agent__details-wrapper row">
                <div className="admin-agent__detail col-xl-8">
                  <div className="admin-agent__detail-wrapper">
                    <AdminCustomerDetailContent personal={personalAgent} salesOverview={salesAgentOverview} />
                    <DashboardTable bookingData={bookingAgent} />
                  </div>
                </div>
                <div className="admin-agent__content-wrapper col-xl-4">
                  <MonthlyOverview monthlyOverview={monthlyAgentOverview} personal={personalAgent} />
                </div>
              </div>
            </div>
            <EditModal />
            <BlockModal
              handleSuspended={() => {
                handleChangeStatus(2, null);
              }}
            />
            <DeleteModal
              handleDeleted={() => {
                handleSoftDelete(1);
              }}
            />
            <ActiveModal
              handleActivated={() => {
                handleChangeStatus(1, null)
              }}
            />
          </div>
        )}

      </AdminLayout>
    </Layout >
  )
}

export const options = {
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
export const earningOptions = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      grid: { display: false }
    },
    y: {
      ticks: { stepSize: 2500 }
    }
  },
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: true },
  }
};

const getChartData = (salesAgentOverview) => {
  return {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        fill: true,
        label: "Sales",
        data: [
          salesAgentOverview?.January,
          salesAgentOverview?.February,
          salesAgentOverview?.March,
          salesAgentOverview?.April,
          salesAgentOverview?.May,
          salesAgentOverview?.June,
          salesAgentOverview?.July,
          salesAgentOverview?.August,
          salesAgentOverview?.September,
          salesAgentOverview?.October,
          salesAgentOverview?.November,
          salesAgentOverview?.December
        ],
        borderColor: 'rgba(28, 183, 141, 0.4)',
        borderWidth: 1,
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0.21, "rgba(28, 183, 141, 0.4)");
          gradient.addColorStop(0.42, "rgba(28, 183, 141, 0.3)");
          gradient.addColorStop(0.63, "rgba(28, 183, 141, 0.2)");
          gradient.addColorStop(0.84, "rgba(28, 183, 141, 0.1)");
          gradient.addColorStop(1, "rgba(28, 183, 141, 0)");
          return gradient;
        },
        pointBackgroundColor: '#1CB78D',
        pointBorderWidth: 2,
        pointBorderColor: '#FFFFFF',
        pointRadius: 4,
        pointHoverRadius: 5
      },
    ],
  }
}

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const AdminCustomerDetailContent = (props: AdminAgentDetailContentProps) => {

  const { personal, salesOverview } = props
  console.log(props)

  function formatJoinedDate(inputDate: string | undefined): string {

    if (!inputDate) {
      return '';
    }

    const date = new Date(inputDate);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  // Format Last Active
  const formatLastActive = (lastActive: string) => {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();

    if (isNaN(lastActiveDate.getTime()) || isNaN(now.getTime())) {
      return 'Invalid date';
    }

    const differenceInYears: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

    if (differenceInYears > 0) {
      return `${differenceInYears} ${differenceInYears === 1 ? 'Year' : 'Years'} ago`;
    }

    const differenceInDays: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

    if (differenceInDays > 0) {
      return `${differenceInDays} ${differenceInDays === 1 ? 'Day' : 'Days'} ago`;
    }

    const differenceInHours: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));

    if (differenceInHours > 0) {
      return `${differenceInHours} ${differenceInHours === 1 ? 'Hour' : 'Hours'} ago`;
    }

    const differenceInMinutes: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
    return `${differenceInMinutes} ${differenceInMinutes === 1 ? 'Minute' : 'Minutes'} ago`;
  };

  return (
    <div className="admin-agent__detail-content">
      <div className="admin-agent__detail-content__header">
        <BlurPlaceholderImage className="admin-agent__detail-image" src={Images.Placeholder} alt="Review Image" width={154} height={154} />
        <div className="admin-agent__detail-content__header-right">
          <div className="admin-agent__detail-content__info">
            <div className="admin-agent__detail-content__id-wrapper">
              <div className="admin-agent__detail-content-wrapper">
                <p className="admin-agent__detail-content__info-id">#{personal?.id_customer}</p>
                <h5>{personal?.fullname}</h5>
                <p className="admin-agent__detail-content__info-gmail">{personal?.email}</p>
              </div>
              <button type="button" className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item admin-agent__action-button-edit' data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
            </div>
            <div className="admin-agent__detail-content__info-profile">
              <div className="admin-agent__detail-info-wrapper">
                <div className="admin-agent__detail-content__info-profile-details">
                  <div className="admin-agent__detail-content__info-profile-wrapper--column">
                    <p className="">Status</p>
                    {(personal?.status === 0) && (
                      <div className="admin-partner__table-status admin-partner__table-status--waiting mx-0">
                        Need Review
                      </div>
                    )}
                    {(personal?.status === 1) && (
                      <div className="admin-partner__table-status admin-partner__table-status--paid mx-0">
                        Active
                      </div>
                    )}
                    {(personal?.status === 2) && (
                      <div className="admin-partner__table-status admin-partner__table-status--ongoing mx-0">
                        Suspended
                      </div>
                    )}
                    {(personal?.soft_delete === 1) && (
                      <div className="admin-partner__table-status admin-partner__table-status--danger mx-0">
                        Declined
                      </div>
                    )}
                  </div>
                  <div className="admin-agent__detail-content__info-profile-wrapper--column">
                    <p className="">Joined Since</p>
                    <div className="admin-agent__detail-content__info-profile-time">
                      <SVGIcon src={Icons.Calendar} className="admin-agent__detail-header-back--icon" width={16} height={16} color="#1B1B1B" />
                      <p className="admin-agent__detail-content__info-profile-date">
                        {formatJoinedDate(personal?.joined)}
                      </p>
                    </div>
                  </div>
                  <div className="admin-agent__detail-content__info-profile-wrapper--column">
                    <p className="">Last Active</p>
                    <div className="admin-agent__detail-content__info-profile-time">
                      <SVGIcon src={Icons.CircleTime} className="admin-agent__detail-header-back--icon" width={16} height={16} color="#1B1B1B" />
                      <p className="admin-agent__detail-content__info-profile-date">
                        {formatLastActive(personal?.last_active)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="admin-agent__overview">
        <div className="admin-agent__overview-header">
          <h5 className="dashboard__overview-header-title">Sales Overview</h5>
          <button className="btn btn-sm admin-agent__btn-more">
            <SVGIcon src={Icons.More} width={16} height={16} />
          </button>
        </div>
        <div style={{ height: 278 }}>
          <Line options={earningOptions} data={getChartData(salesOverview)} height={200} />
        </div>
      </div>
    </div>
  )
}

const DashboardTable = (props: BookingAgentTableProps) => {

  const { bookingData } = props
  const [displayedData, setDisplayedData] = useState<number>(10);
  const [showAllData, setShowAllData] = useState<boolean>(false);

  function formatCheckInDate(inputDate: string | undefined): string {

    if (!inputDate) {
      return '';
    }

    const date = new Date(inputDate);
    const day = date.getDate();
    const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
    const year = date.getFullYear();

    return `${day} / ${month} / ${year}`;
  }

  const handleLoadMore = () => {
    const newDisplayedData = displayedData + 10;
    setDisplayedData(Math.min(newDisplayedData, bookingData.length));
    setShowAllData(newDisplayedData >= bookingData.length);
  };

  const handleShowLess = () => {
    setDisplayedData(10);
    setShowAllData(false);
  };

  return (
    <div className="admin-agent__data">
      <div className="table-responsive">
        <table className="admin-agent__data-table">
          <thead>
            <tr className="admin-agent__data-list">
              <th>No.</th>
              <th>Booking Name</th>
              <th>Booking Type</th>
              <th>Date</th>
              <th className="admin-agent__data-list--center">Status</th>
              <th className="admin-agent__data-list--center">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookingData?.length > 0 ? (
              bookingData.slice(0, displayedData).map((booking, index) => {
                const { fullname, booking_type, checkin, status } = booking;
                return (
                  <tr key={index} className="admin-agent__data-list">
                    <td>{index < 9 ? 0 + (index + 1) : index + 1}</td>
                    <td>
                      <div className="admin-customer__table-name">
                        {fullname}
                      </div>
                    </td>
                    <td>{booking_type}</td>
                    <td>
                      <div className="admin-agent__table-list--icon">
                        <SVGIcon src={Icons.Calendar} width={20} height={20} className="" />
                        {formatCheckInDate(checkin)}
                      </div>
                    </td>
                    <td>
                      {/* Status From API*/}
                      {(status === 0) && (
                        <div className="admin-agent__data-status admin-agent__data-status--waiting">Waiting</div>
                      )}
                      {(status === 1) && (
                        <div className="admin-agent__data-status admin-agent__data-status--ongoing">Ongoing</div>
                      )}
                      {(status === 2) && (
                        <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--paid">Confirmed</div>
                      )}
                      {(status === 3) && (
                        <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--canceled">Rejected</div>
                      )}
                      {(status === 4) && (
                        <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--canceled">Cancelled</div>
                      )}
                      {(status === 5) && (
                        <div className="admin-agent__data-status admin-agent__data-status--waiting">Suspended</div>
                      )}
                      {(status === 6) && (
                        <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--paid">Completed</div>
                      )}
                    </td>
                    <td>
                      <div className="admin-agent__data-list--center">
                        <Link href="#" className="dashboard__data-link">Details</Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="admin-agent__table-list">
                <td colSpan={6} className="text-center">
                  Regrettably, there is no booking data available at this time                </td>
              </tr>
            )
            }
            <tr>
              {bookingData.length >= displayedData && (
                <td colSpan={6} className="admin-agent__data-list--center">
                  {showAllData ? (
                    <a type="button"
                      className="hotel-details__desc-left-description--button mt-4"
                      onClick={handleShowLess}>
                      Show Less
                    </a>
                  ) : (
                    <a type="button"
                      className="hotel-details__desc-left-description--button mt-4"
                      onClick={handleLoadMore}
                    >
                      Show More
                    </a>
                  )}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const MonthlyOverview = (props: MonthlyAgentOverviewProps) => {

  const { monthlyOverview, personal } = props
  const { status } = personal

  const formatCurrency = (value) => {
    if (value === undefined || value === null) {
      return '';
    }

    // Format USD
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);

    return formattedValue;
  };

  return (
    <div className="admin-agent__monthly">
      <div className="admin-agent__monthly-action">
        {status === 1 ? (
          <Fragment>
            <button type="button"
              className={`admin-agent__action-button admin-agent__action-button--suspend`}
              data-bs-toggle="modal"
              data-bs-target="#blockModal"
            // className={`admin-agent__action-button admin-agent__action-button--suspend ${status === 0 && 'disabled' }`}
            // disabled={status === 0}
            >
              <SVGIcon src={Icons.Disabled} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#FFFFFF" />
              <p>Suspend</p>
            </button>
            <button type="button" className="admin-agent__action-button admin-agent__action-button--danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
              <SVGIcon src={Icons.Trash} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#FFFFFF" />
              <p>Delete</p>
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <button type="button" data-bs-toggle="modal" data-bs-target="#popUpComplete" className="admin-agent__action-button admin-agent__action-button--success">
              <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
              Set Active
            </button>
            <button type="button" className="admin-agent__action-button admin-agent__action-button--danger" data-bs-toggle="modal" data-bs-target="#deleteModal">
              <SVGIcon src={Icons.Trash} className="admin-agent__detail-header-back--icon" width={20} height={20} color="#FFFFFF" />
              <p>Delete</p>
            </button>
          </Fragment>
        )}
      </div>
      <div className="admin-agent__calculate">
        <h5>Monthly Overview</h5>
        <div className="admin-agent__calculate-content">
          <div className="dashboard__calculate-box">
            <p className="dashboard__calculate-title">Transaction</p>
            <div className="dashboard__calculate-box-content">
              <p>{formatCurrency(monthlyOverview?.transaction)}</p>
              <SVGIcon className="dashboard__calculate-box-icon" src={Icons.Money} width={24} height={24} />
            </div>
          </div>
          <div className="dashboard__calculate-box">
            <p className="dashboard__calculate-title">Total Booking</p>
            <div className="dashboard__calculate-box-content">
              <p>{monthlyOverview?.total_booking}</p>
              <SVGIcon className="dashboard__calculate-box-icon" src={Icons.Book} width={24} height={24} />
            </div>
          </div>
          <div className="dashboard__calculate-box">
            <p className="dashboard__calculate-title">Complete Booking</p>
            <div className="dashboard__calculate-box-content">
              <p>{monthlyOverview?.complete_booking}</p>
              <SVGIcon className="dashboard__calculate-box-icon" src={Icons.BookingComplete} width={24} height={24} />
            </div>
          </div>
          <div className="dashboard__calculate-box">
            <p className="dashboard__calculate-title">Cancelled Booking</p>
            <div className="dashboard__calculate-box-content">
              <p>{monthlyOverview?.canceled_booking}</p>
              <SVGIcon className="dashboard__calculate-box-icon" src={Icons.BookingCompleted} width={24} height={24} color="#CA3232" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EditModal = () => {

  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [error, setError] = useState<string>()

  const defaultPhoneCountry = 'US'

  return (
    <>
      <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal admin-agent__modal-edit">
          <div className="modal-content admin-agent__add-modal-content">
            <div className="admin-agent__modal-edit-wrapper">
              <h5>Customer Details</h5>
              <div className="admin-agent__modal-edit-form">
                <div className="admin-partner__popup-edit-label">
                  <label className="admin-partner__popup-edit-caption">Full Name</label>
                  <input type="text" placeholder='John Doe' className="form-control goform-input admin-partner__popup-edit-input" id="category" aria-describedby="categoryHelp" />
                </div>
                <div className="admin-partner__popup-edit-label">
                  <label className="admin-partner__popup-edit-caption">Email/address</label>
                  <input type="text" placeholder='Johndoe@gmail.com' className="form-control goform-input admin-partner__popup-edit-input" id="category" aria-describedby="categoryHelp" />
                </div>
                <div className="admin-partner__popup-edit-label admin-partner__popup-edit-label--dropdown">
                  <label htmlFor="gender" className="admin-partner__popup-edit-caption">Gender</label>
                  <select className="form-select goform-select admin-partner__popup-edit-dropdown admin-partner__popup-edit-input" aria-label="star rating select">
                    <option className="" value={0}>Male</option>
                    <option value={1}>Male</option>
                    <option value={2}>Female</option>
                  </select>
                </div>
                {/* <div className="admin-partner__popup-edit-label">
                  <label htmlFor="phoneNumber" className="admin-partner__popup-edit-caption">Phone Number</label>
                  <div className="input-group goform-dropdown-phone admin-partner__popup-edit-input">
                    <button className="btn btn-outline-secondary dropdown-toggle admin-partner__popup-edit-input" type="button" data-bs-toggle="dropdown" aria-expanded="false">+966</button>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="#">+974</a></li>
                      <li><a className="dropdown-item" href="#">+971</a></li>
                    </ul>
                    <input type="text" placeholder='000 0000' className="form-control admin-partner__popup-edit-input" aria-label="Phone Number" />
                  </div>
                </div> */}
                <div className="admin-partner__popup-edit-label admin-partner__popup-edit-label--dropdown">
                  <label className="admin-partner__popup-edit-caption">Phone Number</label>
                  <div className="PhoneInput form-control-wrapper">
                    <div className={`form-control-field`}>
                      <div className="PhoneInputCountry">
                        <select
                          value={phoneCountry}
                          onChange={event => setPhoneCountry(event.target.value || null)}
                          name="phone-code">
                          {getCountries().map((country) => (
                            <option key={country} value={country}>
                              {countryLabels[country]} +{getCountryCallingCode(country)}
                            </option>
                          ))}
                        </select>
                        <div className={`PhoneInputSelectedValue ${phoneCountry ? 'HasValue' : ''}`}>+{getCountryCallingCode((phoneCountry || defaultPhoneCountry) as CountryCode)}</div>
                      </div>
                      <PhoneInput international={true} country={(phoneCountry || defaultPhoneCountry) as CountryCode} value={phone} onChange={setPhone} placeholder="(888) 888-8888" />
                    </div>
                  </div>
                </div>
                <div className="admin-partner__popup-edit-label admin-partner__popup-edit-label--dropdown">
                  <label htmlFor="gender" className="admin-partner__popup-edit-caption">Nationality</label>
                  <select className="form-select goform-select admin-partner__popup-edit-dropdown admin-partner__popup-edit-input" aria-label="star rating select">
                    <option className="" value={0}>Saudi arabia</option>
                    <option value={1}>Saudi arabia</option>
                    <option value={2}>Saudi arabia</option>
                  </select>
                </div>
                <div className='admin-partner__popup-edit-label'>
                  <label htmlFor="smookingPolicy" className="admin-partner__popup-edit-caption">Date Of Birth</label>
                  <input type="text" placeholder='09 / 12 / 2022' className="admin-partner__popup-edit-input form-control goform-select goform-select--date-birth" id="dateOfBirth" aria-describedby="dateOfBirthHelp" />
                </div>
                <div className='admin-agent__popup-edit-input admin-agent__popup-edit-addres'>
                  <label htmlFor="address" className="admin-partner__popup-edit-caption">Address</label>
                  <input type="text" placeholder='Your street name and house / apartement number' className="form-control goform-input" id="address" aria-describedby="addressHelp" />
                </div>
              </div>
              <div className="admin-agent__modal-edit-action">
                <div className="admin-agent__popup-button-bar">
                  <button data-bs-dismiss="modal" type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--outline-green">
                    Cancel
                  </button>
                  <button data-bs-dismiss="modal" type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--fill-green">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const BlockModal = ({ handleSuspended }: { handleSuspended: (status: number, note: string) => void }) => {
  const [note, setNote] = useState("");
  const handleNoteChange = (e) => {
    const noteValue = e.target.value;
    setNote(noteValue);
  };

  const handleButtonClick = (status: number) => {
    handleSuspended(status, note);
  };

  return (
    <>
      <div className="modal fade" id="blockModal" tabIndex={-1} aria-labelledby="blockModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal admin-agent__modal-block">
          <div className="modal-content admin-agent__add-modal-content">
            <div className="admin-agent__modal-block-wrapper">
              <div className="admin-agent__modal-block-content">
                <div className="admin-agent__modal-block-image">
                  <SVGIcon src={Icons.Disabled} width={48} height={48} color="#EECA32" />
                </div>
                <div className="admin-agent__modal-block-caption">
                  <h3>Block this Customer ?</h3>
                  <p className="admin-agent__modal-block-paragraph">Please give a reason before to continue suspend this customer</p>
                </div>
                <div className='admin-agent__modal-block-input w-100'>
                  <input type="text"
                    placeholder='Give a reason'
                    className="form-control goform-input goform-input--modal-block"
                    id="directionLocation"
                    aria-describedby="directionLocationHelp"
                    onChange={(e) => handleNoteChange(e)}
                  />
                </div>
              </div>
              <div className="admin-agent__modal-edit-action">
                <div className="admin-agent__popup-button-bar">
                  <button data-bs-dismiss="modal" type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--outline-green">
                    Cancel
                  </button>
                  <button data-bs-dismiss="modal" type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--fill-green"
                    onClick={() => handleButtonClick(2)}
                  >
                    Yes, Suspend
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const DeleteModal = ({ handleDeleted }: { handleDeleted: (soft_delete: number) => void }) => {

  const handleButtonClick = (soft_delete: number) => {
    handleDeleted(soft_delete);
  };

  return (
    <div
      className="modal fade"
      id="deleteModal"
      tabIndex={-1}
      aria-labelledby="deleteModalLabel"
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
                  Delete this Customer ?
                </h3>
                <p className="admin-booking-hotel__content-caption--popup">
                  Are you sure you want to delete this customer? This action cannot be undone.
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
                className="btn btn-md btn-success"
                data-bs-dismiss="modal"
                onClick={() => handleButtonClick(1)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const ActiveModal = ({ handleActivated }: { handleActivated: (status: number) => void }) => {
  return (
    <>
      <div className="modal fade" id="popUpComplete" tabIndex={-1} aria-labelledby="popUpCompleteLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal admin-customer__modal-block">
          <div className="modal-content admin-customer__add-modal-content">
            <div className="admin-booking-hotel__popup-form">
              <div className="admin-booking-hotel__popup-form-content">
                <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                <div className="admin-booking-hotel__popup-contents">
                  <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">Reactive this agent ?</h3>
                  <p className="admin-booking-hotel__content-caption--popup">Mark this activity to indicate the user agent is reactivated.</p>
                </div>
              </div>
              <div className="admin-booking-hotel__popup-footer">
                <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item' data-bs-dismiss="modal">Cancel</button>
                <button type='button'
                  className='btn btn-md btn-success'
                  data-bs-dismiss="modal"
                  onClick={() => handleActivated(1)}
                >
                  Yes, Reactive</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
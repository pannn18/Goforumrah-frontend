import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import { useEffect, useState } from "react";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { Icons } from "@/types/enums";
import Link from "next/link";
import { callAPI } from "@/lib/axiosHelper";
import moment from "moment";
import LoadingOverlay from "@/components/loadingOverlay";

export default function BookingHotel() {
  const [tabs, setTabs] = useState({
    'All': [],
    "Ongoing": [],
    "Complete": [],
    "Cancelled": []
  })

  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0]);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(4);
  const [displayFilter, setDisplayFilter] = useState("This Year");

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState({});
  const itemsPerPage = 10

  useEffect(() => {
    fetchData(currentPage)
  }, [currentPage, filter, search])

  const fetchData = async (page) => {
    const payloadAll = {
      search: search,
      status: null,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };

    const payloadOngoing = {
      search: search,
      status: 1,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    const payloadComplete = {
      search: search,
      status: 6,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    const payloadCancelled = {
      search: search,
      status: 4,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    try {
      // Fetch data for all tabs using Promise.all
      const [dataAll, dataOngoing, dataComplete, dataCancelled] = await Promise.all([
        callAPI(`/admin-car-booking/data?page=${page}`, 'POST', payloadAll, true),
        callAPI(`/admin-car-booking/data?page=${page}`, 'POST', payloadOngoing, true),
        callAPI(`/admin-car-booking/data?page=${page}`, 'POST', payloadComplete, true),
        callAPI(`/admin-car-booking/data?page=${page}`, 'POST', payloadCancelled, true)
      ]);

      const updatedTabs = {
        'All': formatCarData(dataAll.data.data),
        "Ongoing": formatCarData(dataOngoing.data.data),
        "Complete": formatCarData(dataComplete.data.data),
        "Cancelled": formatCarData(dataCancelled.data.data)
      }

      // Calculate total pages for each tab and set them in state
      const totalCount = dataAll.data.total;
      const totalPagesAll = Math.ceil(totalCount / itemsPerPage);
      const totalPagesOngoing = Math.ceil(dataOngoing.data.total / itemsPerPage);
      const totalPagesComplete = Math.ceil(dataComplete.data.total / itemsPerPage);
      const totalPagesCancelled = Math.ceil(dataCancelled.data.total / itemsPerPage);

      // Set total pages in the state for each tab
      setTotalPages({
        'All': totalPagesAll,
        "Ongoing": totalPagesOngoing,
        "Complete": totalPagesComplete,
        "Cancelled": totalPagesCancelled
      });

      setTabs(updatedTabs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }

  };

  const formatCarData = (carData) => {
    return carData.map((car, index) => ({
      number: (currentPage - 1) * itemsPerPage + index + 1,
      id_car_booking: car.id_car_booking,
      fullname: car.fullname,
      car_brand: car.car_brand,
      model: car.model,
      edition: car.edition,
      pickup: car.pickup,
      pickup_date_time: car.pickup_date_time,
      dropoff: car.dropoff,
      dropoff_date_time: car.dropoff_date_time,
      status: car.status
    }));
  };

  const handleFilter = (value) => {
    if (value !== filter) {
      setFilter(Number(value));

      if (value === 1) setDisplayFilter("Today");
      if (value === 2) setDisplayFilter("This Week");
      if (value === 3) setDisplayFilter("This Month");
      if (value === 4) setDisplayFilter("This Year");
    }

    setShowFilterDropdown(false);
  };

  return (
    <Layout>
      <AdminLayout>
        <div className="container">
          <div className="admin-booking-car">
            <BookingSummary />
            <div className="admin-booking-car__wrapper">
              <div className="admin-booking-car__header">
                <div className="admin-booking-car__header-split">
                  <div className="admin-booking-car__header-tab-menu">
                    {Object.keys(tabs).map((tab, index) => (
                      <button
                        key={index}
                        className={`btn ${tab === selectedTab ? "active" : ""}`}
                        onClick={() => { setSelectedTab(tab), setCurrentPage(1) }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="admin-booking-car__header-separator"></div>
                  <div className="admin-header__search">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <SVGIcon src={Icons.Search} width={20} height={20} />
                  </div>
                </div>
                <div className="custom-dropdown">
                  <div
                    onClick={() => setShowFilterDropdown(true)}
                    className="custom-dropdown-toggle"
                  >
                    <SVGIcon src={Icons.Filter} width={20} height={20} />
                    <div style={{ whiteSpace: "nowrap" }}>{displayFilter}</div>
                    <SVGIcon
                      src={Icons.ArrowDown}
                      width={16}
                      height={16}
                      className="dropdown-toggle-arrow"
                    />
                  </div>
                  <DropdownMenu
                    show={showFilterDropdown}
                    setShow={setShowFilterDropdown}
                    className="admin-booking-car__header-dropdown-menu"
                    style={{ marginTop: 8, width: 180 }}
                  >
                    <div className="custom-dropdown-menu__options">
                      <Link
                        href={"#"}
                        onClick={() => handleFilter(1)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        Today
                      </Link>
                      <Link
                        href={"#"}
                        onClick={() => handleFilter(2)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Week
                      </Link>
                      <Link
                        href={"#"}
                        onClick={() => handleFilter(3)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Month
                      </Link>
                      <Link
                        href={"#"}
                        onClick={() => handleFilter(4)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Year
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
              </div>
              <div className="admin-booking-car__content">
                <table className="admin-booking-car__table">
                  <thead>
                    <tr className="admin-booking-car__table-list">
                      <th>No</th>
                      <th>Name</th>
                      <th>Car Type</th>
                      <th>Pick Up</th>
                      <th>Drop Off</th>
                      <th>Date </th>
                      <th className="admin-booking-car__table-list--center">
                        Status
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading && (
                      <tr>
                        <td>
                          <LoadingOverlay />
                        </td>
                      </tr>
                    )}
                    {!loading &&
                      tabs[selectedTab].length === 0 && (
                        <tr>
                          <td colSpan={9} className="text-center">
                            Data not found
                          </td>
                        </tr>
                      )}
                    {!loading &&
                      tabs[selectedTab].length > 0 &&
                      tabs[selectedTab].map((car, index) => (
                        <PartnerList {...car} index={index}
                          key={`table-row-index-${index}`} />
                      ))}
                  </tbody>
                </table>
              </div>
              <div className="admin-booking-car__pagination">
                {!loading &&
                  tabs[selectedTab].length > 0 &&
                  <div className="pagination">
                    <button
                      type="button"
                      className="pagination__button pagination__button--arrow"
                      onClick={() => { setCurrentPage(currentPage - 1), setLoading(true) }}
                      disabled={currentPage === 1}
                    >
                      <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                    </button>
                    {Array.from({ length: totalPages[selectedTab] || 1 }, (_, i) => i + 1).map((number) => {
                      const isCloseToCurrent = number >= currentPage - 2 && number <= currentPage + 2
                      const hasMoreOnLeft = number !== 1 && number === currentPage - 3
                      const hasMoreOnRight = number !== totalPages && number === currentPage + 3
                      const isFirst = number === 1
                      const isLast = number === totalPages

                      const isVisible = isCloseToCurrent || hasMoreOnLeft || hasMoreOnRight || isFirst || isLast

                      return isVisible && (
                        <button key={number} onClick={() => !(hasMoreOnLeft || hasMoreOnRight) && (setLoading(true), setCurrentPage(number))} type="button" className={`pagination__button ${number === currentPage ? 'active' : ''}`} style={{ cursor: hasMoreOnLeft || hasMoreOnRight ? 'default' : 'pointer' }}>{(hasMoreOnLeft || hasMoreOnRight) ? '...' : number}</button>
                      )
                    })}
                    <button
                      type="button"
                      className="pagination__button pagination__button--arrow"
                      onClick={() => { setCurrentPage(currentPage + 1), setLoading(true) }}
                      disabled={currentPage === totalPages[selectedTab]}
                    >
                      <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  );
}

const BookingSummary = () => {
  const [dataSummary, setDataSummary] = useState(null);

  useEffect(() => {
    if (dataSummary) return;
    const getData = async () => {
      const { ok, error, data } = await callAPI(
        `/admin-car-booking/summary`,
        "GET",
        {},
        true
      );
      if (error) {
        console.log(error);
      }
      if (ok && data) {
        setDataSummary(data);
      }
    };

    getData();
  }, [dataSummary]);

  return (
    <div className="admin-booking-car__summary">
      <div className="admin-booking-car__summary-box">
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-header-text">Revenue</p>
          <SVGIcon src={Icons.Money} width={20} height={20} className="admin-booking-car__summary-header-icon" />
        </div>
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-content-value">
            $ {dataSummary?.total_revenue}
          </p>
          <div className={`admin-booking-car__summary-content-recap admin-booking-car__summary-content-recap${dataSummary?.percentage_total_revenue >= 0 ? "--success" : "--unsuccessfull"}`}>
            <p className="admin-booking-car__summary-content-recap--text">
              {dataSummary?.percentage_total_revenue ? parseFloat(dataSummary?.percentage_total_revenue.toFixed(2)) : 0}%
            </p>
            <SVGIcon src={dataSummary?.percentage_total_revenue >= 0 ? Icons.TrendUp : Icons.TrendDown} width={20} height={20} className={`${dataSummary?.percentage_total_revenue >= 0 ? "admin-booking-car__summary-header-icon" : "summary-header-icon--unsuccessfull"}`} />
          </div>
        </div>
      </div>
      <div className="admin-booking-car__summary-box">
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-header-text">
            Total Booking
          </p>
          <SVGIcon src={Icons.Book} width={20} height={20} className="admin-booking-car__summary-header-icon" />
        </div>
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-content-value">
            {dataSummary?.total_booking}
          </p>
          <div className={`admin-booking-car__summary-content-recap admin-booking-car__summary-content-recap${dataSummary?.percentage_total_booking >= 0 ? "--success" : "--unsuccessfull"}`}>
            <p className="admin-booking-car__summary-content-recap--text">
              {dataSummary?.percentage_total_booking ? parseFloat(dataSummary?.percentage_total_booking.toFixed(2)) : 0}%
            </p>
            <SVGIcon src={dataSummary?.percentage_total_booking >= 0 ? Icons.TrendUp : Icons.TrendDown} width={20} height={20} className={`${dataSummary?.percentage_total_booking >= 0 ? "admin-booking-car__summary-header-icon" : "summary-header-icon--unsuccessfull"}`} />
          </div>
        </div>
      </div>
      <div className="admin-booking-car__summary-box">
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-header-text">
            Booking Cancelled
          </p>
          <SVGIcon src={Icons.BookingCancel} width={20} height={20} className="admin-booking-car__summary-header-icon" />
        </div>
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-content-value">
            {dataSummary?.booking_canceled}
          </p>
          <div className={`admin-booking-car__summary-content-recap admin-booking-car__summary-content-recap${dataSummary?.percentage_booking_canceled >= 0 ? "--success" : "--unsuccessfull"}`}>
            <p className="admin-booking-car__summary-content-recap--text">
              {dataSummary?.percentage_booking_canceled ? parseFloat(dataSummary?.percentage_booking_canceled.toFixed(2)) : 0}%
            </p>
            <SVGIcon src={dataSummary?.percentage_booking_canceled >= 0 ? Icons.TrendUp : Icons.TrendDown} width={20} height={20} className={`${dataSummary?.percentage_booking_canceled >= 0 ? "admin-booking-car__summary-header-icon" : "summary-header-icon--unsuccessfull"}`} />
          </div>
        </div>
      </div>
      <div className="admin-booking-car__summary-box">
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-header-text">
            Booking Complete
          </p>
          <SVGIcon src={Icons.BookingComplete} width={20} height={20} className="admin-booking-car__summary-header-icon" />
        </div>
        <div className="admin-booking-car__summary-row">
          <p className="admin-booking-car__summary-content-value">
            {dataSummary?.booking_complete}
          </p>
          <div className={`admin-booking-car__summary-content-recap admin-booking-car__summary-content-recap${dataSummary?.percentage_booking_complete >= 0 ? "--success" : "--unsuccessfull"}`}>
            <p className="admin-booking-car__summary-content-recap--text">
              {dataSummary?.percentage_booking_complete ? parseFloat(dataSummary?.percentage_booking_complete.toFixed(2)) : 0}%
            </p>
            <SVGIcon src={dataSummary?.percentage_booking_complete >= 0 ? Icons.TrendUp : Icons.TrendDown} width={20} height={20} className={`${dataSummary?.percentage_booking_complete >= 0 ? "admin-booking-car__summary-header-icon" : "summary-header-icon--unsuccessfull"}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PartnerListProps {
  number: number
  id_car_booking: number;
  fullname: string;
  car_brand: string;
  model: string;
  edition: string;
  pickup: string;
  pickup_date_time: string;
  dropoff: string;
  dropoff_date_time: string;
  created_at: string;
  status: number;
}
const PartnerList = (props: PartnerListProps & { index: number }) => {
  const {
    number,
    id_car_booking,
    fullname,
    car_brand,
    model,
    edition,
    pickup,
    pickup_date_time,
    dropoff,
    dropoff_date_time,
    created_at,
    status,
    index,
  } = props;
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);

  function formatDate(date) {
    return moment(date).format("ddd, DD MMM YY");
  }

  function date(date) {
    return moment(date).format("DD / MM / YY");
  }

  return (
    <tr className="admin-booking-car__table-list">
      <td>{number}</td>
      <td className="text-start">{fullname}</td>
      <td>{car_brand} {model} {edition}</td>
      <td className="text-start">
        <div className="admin-booking-car__table-list--pickup">
          <p>{pickup}</p>
          <p className="admin-booking-car__table-list--date">
            {formatDate(pickup_date_time)}
          </p>
        </div>
      </td>
      <td className="text-start">
        <div className="admin-booking-car__table-list--pickup">
          <p>{dropoff}</p>
          <p className="admin-booking-car__table-list--date">
            {formatDate(dropoff_date_time)}
          </p>
        </div>
      </td>
      <td>
        <div className="admin-booking-car__table-list--icon">
          <SVGIcon src={Icons.Calendar} width={20} height={20} className="" />
          {date(pickup_date_time)}
        </div>
      </td>
      <td>
        {status === 0 && (
          <div className="admin-booking-car__table-status admin-booking-car__table-status--waiting">
            Waiting for payment
          </div>
        )}
        {status === 1 && (
          <div className="admin-booking-car__table-status admin-booking-car__table-status--ongoing">
            Ongoing
          </div>
        )}
        {status === 2 && (
          <div className="admin-booking-car__table-status admin-booking-car__table-status--ongoing">
            Confirmed
          </div>
        )}
        {status === 3 && (
          <div className="admin-booking-car__table-status admin-booking-car__table-status--canceled">
            Rejected
          </div>
        )}
        {status === 4 && (
          <div className="admin-booking-car__table-status admin-booking-car__table-status--canceled">
            Canceled
          </div>
        )}
        {status === 5 && (
          <div className="admin-booking-car__table-status admin-booking-car__table-status--waiting">
            Suspended
          </div>
        )}
        {status === 6 && (
          <div className="admin-booking-car__table-status admin-booking-car__table-status--paid">
            Complete
          </div>
        )}
      </td>
      <td>
        <div className="custom-dropdown">
          <div
            onClick={() => setShowActionDropdown(true)}
            className="custom-dropdown-toggle admin-booking-car__table-dropdown"
          >
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu
            show={showActionDropdown}
            setShow={setShowActionDropdown}
            className="admin-booking-car__header-dropdown-menu"
            style={{ marginTop: 8, marginLeft: -110, width: 155 }}
          >
            <div className="custom-dropdown-menu__options">
              <Link
                href={`/admin/booking/car/${id_car_booking}`}
                className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                <div className="admin-booking-car__dropdown-menu-option-details">
                  <SVGIcon
                    src={Icons.Eye}
                    width={20}
                    height={20}
                    className=""
                  />
                  <p>See Details</p>
                </div>
              </Link>
              <Link
                href="#"
                className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                <div className="admin-booking-car__dropdown-menu-option-delete">
                  <SVGIcon
                    src={Icons.Trash}
                    width={20}
                    height={20}
                    className=""
                  />
                  <p>Delete</p>
                </div>
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};

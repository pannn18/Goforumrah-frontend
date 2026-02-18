import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import { useEffect, useState } from "react";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { Icons } from "@/types/enums";
import Link from "next/link";
import useFetch from "@/hooks/useFetch";
import moment from "moment";
import LoadingOverlay from "@/components/loadingOverlay";
import { callAPI } from "@/lib/axiosHelper";

interface HotelBookingItem {
  number: number;
  id_hotel_booking: number;
  id_hotel: number;
  customer_name: string;
  hotel_name: string;
  room_type: string;
  street_address: string;
  checkin: string;
  status: number;
  reservation_status: number;
  total_room: number;
}


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
      status: null,
      search: search,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };

    const payloadOngoing = {
      status: 1,
      search: search,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    const payloadComplete = {
      status: 6,
      search: search,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    const payloadCancelled = {
      status: 4,
      search: search,
      filter: filter,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    try {
      // Fetch data for all tabs using Promise.all
      const [dataAll, dataOngoing, dataComplete, dataCancelled] = await Promise.all([
        callAPI(`/admin-hotel-booking/data?page=${page}`, 'POST', payloadAll, true),
        callAPI(`/admin-hotel-booking/data?page=${page}`, 'POST', payloadOngoing, true),
        callAPI(`/admin-hotel-booking/data?page=${page}`, 'POST', payloadComplete, true),
        callAPI(`/admin-hotel-booking/data?page=${page}`, 'POST', payloadCancelled, true)
      ]);
      console.log(`dataAll: `, dataAll.data.data)

      const updatedTabs = {
        'All': formatHotelData(dataAll.data.data),
        "Ongoing": formatHotelData(dataOngoing.data.data),
        "Complete": formatHotelData(dataComplete.data.data),
        "Cancelled": formatHotelData(dataCancelled.data.data)
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
  const formatHotelData = (hotelData) => {
    return hotelData.map((hotel, index) => ({
      number: (currentPage - 1) * itemsPerPage + index + 1,
      id_hotel_booking: hotel.id_hotel_booking,
      customer_name: hotel.customer_name,
      hotel_name: hotel.hotel_name,
      room_type: hotel.room_type,
      street_address: hotel.street_address,
      checkin: hotel.checkin,
      total_room: hotel.total_room,
      status: hotel.status,
      reservation_status: hotel.reservation_status,
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
      <AdminLayout pageTitle="Hotel Booking">
        <div className="container">
          <div className="admin-booking-hotel">
            <BookingSummary />
            <div className="admin-booking-hotel__wrapper">
              <div className="admin-booking-hotel__header">
                <div className="admin-booking-hotel__header-split">
                  <div className="admin-booking-hotel__header-tab-menu">
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
                  {/* <div className="admin-booking-hotel__header-separator"></div> */}
                </div>
                <div className="admin-header-wrapper d-flex gap-4">
                  <div className="admin-header__search">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Search"
                    />
                    <SVGIcon src={Icons.Search} width={20} height={20} />
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
              </div>
              <div className="admin-booking-hotel__content">
                <div className="table-responsive">
                  <table className="admin-booking-hotel__table w-100">
                    <thead>
                      <tr className="admin-booking-hotel__table-list">
                        <th>No.</th>
                        <th>Customer Name</th>
                        <th>Hotel name</th>
                        <th>Room type</th>
                        <th>Location</th>
                        <th>Date </th>
                        <th className="admin-booking-hotel__table-list--center">
                          Total Room
                        </th>
                        <th className="admin-booking-hotel__table-list--center">
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
                        tabs[selectedTab].map((hotel, index) => (
                          <PartnerList {...hotel} index={index}
                            key={`table-row-index-${index}`} />
                        ))}
                    </tbody>

                  </table>
                </div>
              </div>
              <div className="admin-booking-hotel__pagination">
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
  const { ok, loading, data, error } = useFetch(
    "/admin-hotel-booking/summary",
    "GET",
    null,
    true
  );

  return (
    <div className="admin-booking-hotel__summary">
      <div className="admin-booking-hotel__summary-box">
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-header-text">
            {loading ? "Loading..." : "Revenue"}
          </p>
          <SVGIcon
            src={Icons.Money}
            width={20}
            height={20}
            className="admin-booking-hotel__summary-header-icon"
          />
        </div>
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-content-value">
            {loading ? "-" : `$ ${data?.total_revenue || 0}`}
          </p>
          {!loading && (
            <div
              className={`admin-booking-hotel__summary-content-recap ${data?.percentage_total_revenue > 0
                ? "admin-booking-hotel__summary-content-recap--success"
                : data?.percentage_total_revenue < 0
                  ? "admin-booking-hotel__summary-content-recap--unsuccessfull"
                  : ""
                }`}
            >
              <p className="admin-booking-hotel__summary-content-recap--text">
                {data?.percentage_total_revenue
                  ? (parseFloat(data?.percentage_total_revenue) || 0).toFixed(2)
                  : 0}
                %
              </p>
              {data?.percentage_total_revenue > 0 && (
                <SVGIcon
                  src={Icons.TrendUp}
                  width={20}
                  height={20}
                  className="admin-booking-hotel__summary-header-icon"
                />
              )}
              {data?.percentage_total_revenue < 0 && (
                <SVGIcon
                  src={Icons.TrendDown}
                  width={20}
                  height={20}
                  className="summary-header-icon--unsuccessfull"
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="admin-booking-hotel__summary-box">
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-header-text">
            {loading ? "Loading..." : "Total Booking"}
          </p>
          <SVGIcon
            src={Icons.Book}
            width={20}
            height={20}
            className="admin-booking-hotel__summary-header-icon"
          />
        </div>
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-content-value">
            {loading ? "-" : `${data?.total_booking || 0}`}
          </p>
          {!loading && (
            <div
              className={`admin-booking-hotel__summary-content-recap ${data?.percentage_total_booking > 0
                ? "admin-booking-hotel__summary-content-recap--success"
                : data?.percentage_total_booking < 0
                  ? "admin-booking-hotel__summary-content-recap--unsuccessfull"
                  : ""
                }`}
            >
              <p className="admin-booking-hotel__summary-content-recap--text">
                {data?.percentage_total_booking
                  ? (parseFloat(data?.percentage_total_booking) || 0).toFixed(2)
                  : 0}
                %
              </p>
              {data?.percentage_total_booking > 0 && (
                <SVGIcon
                  src={Icons.TrendUp}
                  width={20}
                  height={20}
                  className="admin-booking-hotel__summary-header-icon"
                />
              )}
              {data?.percentage_total_booking < 0 && (
                <SVGIcon
                  src={Icons.TrendDown}
                  width={20}
                  height={20}
                  className="summary-header-icon--unsuccessfull"
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="admin-booking-hotel__summary-box">
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-header-text">
            {loading ? "Loading..." : "Booking Cancelled"}
          </p>
          <SVGIcon
            src={Icons.BookingCancel}
            width={20}
            height={20}
            className="admin-booking-hotel__summary-header-icon"
          />
        </div>
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-content-value">
            {loading ? "-" : `${data?.booking_canceled || 0}`}
          </p>
          {!loading && (
            <div
              className={`admin-booking-hotel__summary-content-recap ${data?.percentage_booking_canceled > 0
                ? "admin-booking-hotel__summary-content-recap--success"
                : data?.percentage_booking_canceled < 0
                  ? "admin-booking-hotel__summary-content-recap--unsuccessfull"
                  : ""
                }`}
            >
              <p className="admin-booking-hotel__summary-content-recap--text">
                {data?.percentage_booking_canceled
                  ? (
                    parseFloat(data?.percentage_booking_canceled) || 0
                  ).toFixed(2)
                  : 0}
                %
              </p>
              {data?.percentage_booking_canceled > 0 && (
                <SVGIcon
                  src={Icons.TrendUp}
                  width={20}
                  height={20}
                  className="admin-booking-hotel__summary-header-icon"
                />
              )}
              {data?.percentage_booking_canceled < 0 && (
                <SVGIcon
                  src={Icons.TrendDown}
                  width={20}
                  height={20}
                  className="summary-header-icon--unsuccessfull"
                />
              )}
            </div>
          )}
        </div>
      </div>
      <div className="admin-booking-hotel__summary-box">
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-header-text">
            {loading ? "Loading..." : "Booking Complete"}
          </p>
          <SVGIcon
            src={Icons.BookingComplete}
            width={20}
            height={20}
            className="admin-booking-hotel__summary-header-icon"
          />
        </div>
        <div className="admin-booking-hotel__summary-row">
          <p className="admin-booking-hotel__summary-content-value">
            {loading ? "-" : `${data?.booking_complete || 0}`}
          </p>
          {!loading && (
            <div
              className={`admin-booking-hotel__summary-content-recap ${data?.percentage_booking_complete > 0
                ? "admin-booking-hotel__summary-content-recap--success"
                : data?.percentage_booking_complete < 0
                  ? "admin-booking-hotel__summary-content-recap--unsuccessfull"
                  : ""
                }`}
            >
              <p className="admin-booking-hotel__summary-content-recap--text">
                {data?.percentage_booking_complete
                  ? (
                    parseFloat(data?.percentage_booking_complete) || 0
                  ).toFixed(2)
                  : 0}
                %
              </p>
              {data?.percentage_booking_complete > 0 && (
                <SVGIcon
                  src={Icons.TrendUp}
                  width={20}
                  height={20}
                  className="admin-booking-hotel__summary-header-icon"
                />
              )}
              {data?.percentage_booking_complete < 0 && (
                <SVGIcon
                  src={Icons.TrendDown}
                  width={20}
                  height={20}
                  className="summary-header-icon--unsuccessfull"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PartnerList = (props: HotelBookingItem) => {
  const {
    number,
    id_hotel_booking,
    customer_name,
    hotel_name,
    room_type,
    street_address,
    checkin,
    total_room,
    status,
    reservation_status,
  } = props;
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);

  return (
    <tr
      className="admin-booking-hotel__table-list"
    >
      <td>{number}</td>
      <td>{customer_name}</td>
      <td>{hotel_name}</td>
      <td>{room_type}</td>
      <td>
        <div className="admin-booking-hotel__table-list--icon">
          <SVGIcon
            src={Icons.MapPinOutline}
            width={20}
            height={20}
            className=""
          />
          {street_address}
        </div>
      </td>
      <td>
        <div className="admin-booking-hotel__table-list--icon">
          <SVGIcon src={Icons.Calendar} width={20} height={20} className="" />
          {moment(checkin).isValid()
            ? moment(checkin).format("DD / MM / YY")
            : "-"}
        </div>
      </td>
      <td>
        <div className="admin-booking-hotel__table-list--icon admin-booking-hotel__table-list--room">
          <SVGIcon src={Icons.Door} width={20} height={20} className="" />
          {total_room}
        </div>
      </td>
      <td>
        {status === 0 && reservation_status !== 2 && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--waiting">
            Waiting for Payment
          </div>
        )}
        {status === 1 && reservation_status !== 2 && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--ongoing">
            Ongoing
          </div>
        )}
        {status === 2 && reservation_status !== 2 && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--ongoing">
            Confirmed
          </div>
        )}
        {status === 3 && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--canceled">
            Rejected
          </div>
        )}
        {status === 4 && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--canceled">
            Canceled
          </div>
        )}
        {status === 5 && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--waiting">
            Suspended
          </div>
        )}
        { (status === 6 || reservation_status === 2) && (
           <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--paid">
            Complete
          </div>
        )}
      </td>
      <td>
        <div className="custom-dropdown">
          <div
            onClick={() => setShowActionDropdown(true)}
            className="custom-dropdown-toggle admin-booking-hotel__table-dropdown"
          >
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu
            show={showActionDropdown}
            setShow={setShowActionDropdown}
            className="admin-booking-hotel__header-dropdown-menu"
            style={{ marginTop: 8, marginLeft: -110, width: 155 }}
          >
            <div className="custom-dropdown-menu__options">
              <Link
                href={`/admin/booking/hotel/detail?id=${id_hotel_booking}`}
                className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                <div className="admin-booking-hotel__dropdown-menu-option-details">
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
                className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                <div className="admin-booking-hotel__dropdown-menu-option-delete">
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

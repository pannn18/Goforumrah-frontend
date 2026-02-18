import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import { useState, useEffect } from "react";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { Icons } from "@/types/enums";
import Link from "next/link";
import { callAPI } from "@/lib/axiosHelper";
import LoadingOverlay from "@/components/loadingOverlay";
import moment from "moment";

export default function PartnerHotel() {
  const [tabs, setTabs] = useState({
    "All": [],
    "On Going": [],
    "Completed": [],
    "Canceled": []
  });

  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0]);
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(4);
  const [displayFilter, setDisplayFilter] = useState("This Year");

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState({});
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;


  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, filter, search]);

  const fetchData = async (page) => {
    const payloadAll = {
      booking_status: null,
      filter: filter,
      search: search,
      show_per_page: itemsPerPage,
    };

    const payloadOnGoing = {
      booking_status: 1,
      filter: filter,
      search: search,
      show_per_page: itemsPerPage,
    };

    const payloadCompleted = {
      booking_status: 2,
      filter: filter,
      search: search,
      show_per_page: itemsPerPage,
    };

    const payloadCanceled = {
      booking_status: 3,
      filter: filter,
      search: search,
      show_per_page: itemsPerPage,
    };

    try {
      // Fetch data for all table using Promise all
      const [dataAll, dataOnGoing, dataCompleted, dataCanceled] =
        await Promise.all([
          callAPI(
            `/admin-tour-package/show-all?page=${page}`,
            "POST",
            payloadAll,
            true
          ),
          callAPI(
            `/admin-tour-package/show-all?page=${page}`,
            "POST",
            payloadOnGoing,
            true
          ),
          callAPI(
            `/admin-tour-package/show-all?page=${page}`,
            "POST",
            payloadCompleted,
            true
          ),
          callAPI(
            `/admin-tour-package/show-all?page=${page}`,
            "POST",
            payloadCanceled,
            true
          ),
        ]);

      console.log(`dataAll: `, dataAll.data.data)
      console.log(`dataOnGoing: `, dataOnGoing.data.data)

      const updatedTabs = {
        "All": dataAll.data.data,
        "On Going": dataOnGoing.data.data,
        "Completed": dataCompleted.data.data,
        "Canceled": dataCanceled.data.data,
      };

      // Calculate total pages for each tab and set them in state
      const totalCount = dataAll.data.total;
      const totalPagesAll = Math.ceil(totalCount / itemsPerPage);
      const totalPagesOnGoing = Math.ceil(
        dataOnGoing.data.total / itemsPerPage
      );
      const totalPagesCompleted = Math.ceil(
        dataCompleted.data.total / itemsPerPage
      );
      const totalPagesCanceled = Math.ceil(
        dataCanceled.data.total / itemsPerPage
      );

      // set total pages in the state for each table
      setTotalPages({
        "All": totalPagesAll,
        "On Going": totalPagesOnGoing,
        "Completed": totalPagesCompleted,
        "Canceled": totalPagesCanceled,
      });

      setTabs(updatedTabs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    setLoading(false);
  };



  // Handle for filter
  const handleFilter = (value) => {
    if (value !== filter) {
      setFilter(Number(value));

      if (value === 1) setDisplayFilter("Today");
      if (value === 2) setDisplayFilter("This Week");
      if (value === 3) setDisplayFilter("This Month");
      if (value === 4) setDisplayFilter("This Year");
    }

    setShowReviewDropdown(false);
  };

  return (
    <Layout>
      <AdminLayout>
        <div className="container">
          <div className="admin-partner">
            <PartnerSummary />
            <div className="admin-partner__wrapper">
              <div className="admin-partner__header">
                <div className="admin-partner__header-split">
                  <div className="admin-partner__header-tab-menu">
                    {Object.keys(tabs).map((tab, index) => (
                      <button
                        key={index}
                        className={`btn ${tab === selectedTab ? "active" : ""}`}
                        onClick={() => {
                          setSelectedTab(tab), setCurrentPage(1);
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="admin-partner__header-separator"></div>
                  <div className="admin-customer__header-search">
                    <input
                      type="text"
                      className="form-control car-dashboard__input-search"
                      placeholder="Search"
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <SVGIcon src={Icons.Search} width={20} height={20} />
                  </div>
                </div>
                <div className="custom-dropdown">
                  <div
                    onClick={() => setShowReviewDropdown(true)}
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
                    show={showReviewDropdown}
                    setShow={setShowReviewDropdown}
                    className="admin-partner__header-dropdown-menu"
                    style={{ marginTop: 8, width: 180 }}
                  >
                    <div className="custom-dropdown-menu__options">
                      <Link
                        href={"#"}
                        className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                        onClick={() => handleFilter(1)}
                      >
                        Today
                      </Link>
                      <Link
                        href={"#"}
                        className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                        onClick={() => handleFilter(2)}
                      >
                        This Week
                      </Link>
                      <Link
                        href={"#"}
                        className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                        onClick={() => handleFilter(3)}
                      >
                        This Month
                      </Link>
                      <Link
                        href={"#"}
                        className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                        onClick={() => handleFilter(4)}
                      >
                        This Year
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
              </div>
              <div className="admin-partner__content">
                <div className="table-responsive w-100">
                  <table className="admin-partner__table w-100">
                    <thead>
                      <tr className="admin-partner__table-list">
                        <th>No.</th>
                        <th>Name</th>
                        <th>Tour Package</th>
                        <th>Country</th>
                        <th>Quantity</th>
                        <th className="admin-booking__table-list--center">
                          Package Type
                        </th>
                        <th>Date </th>
                        <th className="admin-partner__table-list--center">
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
                      {!loading && tabs[selectedTab].length === 0 && (
                        <tr>
                          <td colSpan={8} className="text-center">
                            No data found
                          </td>
                        </tr>
                      )}
                      {!loading &&
                        tabs[selectedTab].length > 0 &&
                        tabs[selectedTab].map((tourItem, index) => (
                          <PartnerList
                            {...tourItem}
                            no={startIndex + index + 1}
                            key={index}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-booking-tour__pagination">
                  {!loading &&
                    tabs[selectedTab].length > 0 &&
                    <div className="pagination">
                      <button
                        type="button"
                        className={`pagination__button pagination__button--arrow${currentPage === 2 ? ' disabled' : ''}}`}
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
                        className={`pagination__button pagination__button--arrow${currentPage === totalPages[selectedTab] ? 'disabled' : ''}`}
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
        </div>
      </AdminLayout>
    </Layout>
  );
}

const PartnerSummary = () => {
  return (
    <div className="admin-booking__summary">
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">Revenue</p>
          <SVGIcon
            src={Icons.Money}
            width={20}
            height={20}
            className="admin-partner__summary-header-icon"
          />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">$ 100</p>
          <div className="admin-partner__summary-content-recap admin-partner__summary-content-recap--success">
            <p className="admin-partner__summary-content-recap--text">20%</p>
            <SVGIcon
              src={Icons.TrendUp}
              width={20}
              height={20}
              className="admin-partner__summary-header-icon"
            />
          </div>
        </div>
      </div>
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">Total Booking</p>
          <SVGIcon
            src={Icons.Book}
            width={20}
            height={20}
            className="admin-partner__summary-header-icon"
          />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">200</p>
          <div className="admin-partner__summary-content-recap admin-partner__summary-content-recap--danger">
            <p className="admin-partner__summary-content-recap--text">20%</p>
            <SVGIcon
              src={Icons.TrendDown}
              width={20}
              height={20}
              color="#CA3232"
              className="admin-partner__summary-header-icon"
            />
          </div>
        </div>
      </div>
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">
            Booking Cancelled
          </p>
          <SVGIcon
            src={Icons.BookingCancelled}
            width={20}
            height={20}
            className="admin-partner__summary-header-icon"
          />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">200</p>
          <div className="admin-partner__summary-content-recap admin-partner__summary-content-recap--danger">
            <p className="admin-partner__summary-content-recap--text">20%</p>
            <SVGIcon
              src={Icons.TrendDown}
              width={20}
              height={20}
              color="#CA3232"
              className="admin-partner__summary-header-icon"
            />
          </div>
        </div>
      </div>
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">Booking Complete</p>
          <SVGIcon
            src={Icons.BookingCompleted}
            width={20}
            height={20}
            className="admin-partner__summary-header-icon"
          />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">200</p>
          <div className="admin-partner__summary-content-recap admin-partner__summary-content-recap--danger">
            <p className="admin-partner__summary-content-recap--text">20%</p>
            <SVGIcon
              src={Icons.TrendDown}
              width={20}
              height={20}
              color="#CA3232"
              className="admin-partner__summary-header-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PartnerListProps {
  id_tour_booking: string;
  fullname: string;
  package_name: string;
  address: string;
  total_day: string;
  type_plan: string;
  start_date: string;
  status: number;
  linkURL: string;
  no: number;
}
const PartnerList = (props: PartnerListProps) => {
  const {
    id_tour_booking,
    fullname,
    package_name,
    address,
    total_day,
    type_plan,
    start_date,
    status,
    no,
    linkURL,
  } = props;
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);

  return (
    <tr className="admin-partner__table-list">
      <td>{no}</td>
      <td>{fullname}</td>
      <td>{package_name}</td>
      <td>
        <div className="admin-partner__table-list--icon">
          <SVGIcon
            src={Icons.MapPinOutline}
            width={20}
            height={20}
            className=""
          />
          {address}
        </div>
      </td>
      <td>
        <div className="admin-booking__table-list--center">{total_day}</div>
      </td>
      <td>
        <div className="admin-booking__table-list--center">{type_plan}</div>
      </td>
      <td>
        <div className="admin-partner__table-list--icon">
          <SVGIcon src={Icons.Calendar} width={20} height={20} className="" />
          {moment(start_date).isValid()
            ? moment(start_date).format("DD/MM/YY")
            : "-"}
        </div>
      </td>
      <td>
        {status === 0 && (
          <div className="admin-partner__table-status admin-partner__table-status--ongoing">
            NeedPayment
          </div>
        )}
        {status === 1 && (
          <div className="admin-partner__table-status admin-partner__table-status--waiting">
            WaitingVerification
          </div>
        )}
        {status === 2 && (
          <div className="admin-partner__table-status admin-partner__table-status--ongoing">
            Confirmed
          </div>
        )}
        {status === 3 && (
          <div className="admin-partner__table-status admin-partner__table-status--waiting">
            Rejected
          </div>
        )}
        {status === 4 && (
          <div className="admin-partner__table-status admin-partner__table-status--canceled">
            Canceled
          </div>
        )}
        {status === 5 && (
          <div className="admin-partner__table-status admin-partner__table-status--paid">
            Completed
          </div>
        )}
      </td>
      <td>
        <div className="custom-dropdown">
          <div
            onClick={() => setShowActionDropdown(true)}
            className="custom-dropdown-toggle admin-partner__table-dropdown"
          >
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu
            show={showActionDropdown}
            setShow={setShowActionDropdown}
            className="admin-partner__header-dropdown-menu"
            style={{ marginTop: 8, marginLeft: -80, width: 180 }}
          >
            <div className="custom-dropdown-menu__options">
              <Link
                href={`/admin/booking/tour-booking/detail/?id=${id_tour_booking}`}
                className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                View Details
              </Link>
              <Link
                href="#"
                className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                Edit
              </Link>
              <Link
                href="#"
                className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                Delete
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};

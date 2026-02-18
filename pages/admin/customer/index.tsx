import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import Link from "next/link";
import { callAPI } from "@/lib/axiosHelper";
import useFetch from "@/hooks/useFetch";
import { BlurPlaceholderImage } from "@/components/elements/images";
import { Icons, Images } from "@/types/enums";
import LoadingOverlay from "@/components/loadingOverlay";

export default function Customer() {
  const [customer, setCustomer] = useState<any>([]);
  const [search, setSearch] = useState<string>("");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [displayFilter, setDisplayFilter] = useState("This Year");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(4);

  // Pagination Settings
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = Math.min(startIndex + itemsPerPage, filteredCustomer.length);
  const visibleCustomer = customer;
  console.log(visibleCustomer);

  // Handle for filter
  const handleFilterChange = (value) => {
    if (value !== filter) {
      setFilter(Number(value));

      if (value === 1) setDisplayFilter("Today");
      if (value === 2) setDisplayFilter("This Week");
      if (value === 3) setDisplayFilter("This Month");
      if (value === 4) setDisplayFilter("This Year");
    }
    setLoading(true);
    setCurrentPage(1);
    setShowFilterDropdown(false);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, filter, search]);

  const fetchData = async (page) => {
    const payloadAll = {
      filter: filter,
      search: search,
      show_per_page: itemsPerPage,
    };

    try {
      // Fetch data for all table
      const [dataAll] = await Promise.all([
        callAPI(`/admin-customer/list?page=${page}`, "POST", payloadAll, true),
      ]);

      const updatedTabs = dataAll.data.data;
      console.log(dataAll);

      const totalCount = dataAll.data.total;
      const totalPagesAll = Math.ceil(totalCount / itemsPerPage);

      setTotalPages(totalPagesAll);

      setCustomer(updatedTabs);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
    setLoading(false);
  };  

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setLoading(false);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <AdminLayout pageTitle="Customer">
        <div className="container">
          <div className="admin-customer">
            <CustomerSummary />
            <div className="admin-customer__wrapper">
              <div className="admin-customer__header">
                <div className="admin-partner__header-search admin-customer__header-search">
                  <input
                    type="text"
                    className="form-control admin-customer__search-input"
                    placeholder="Search"
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <SVGIcon src={Icons.Search} width={20} height={20} />
                </div>
                <div className="custom-dropdown">
                  <div
                    onClick={() => setShowFilterDropdown(true)}
                    className="custom-dropdown-toggle"
                  >
                    <SVGIcon
                      src={Icons.Filter}
                      width={20}
                      height={20}
                      color="#1B1B1B"
                    />
                    <div style={{ whiteSpace: "nowrap" }}>{displayFilter}</div>
                    <SVGIcon
                      src={Icons.ArrowDown}
                      width={16}
                      height={16}
                      className="dropdown-toggle-arrow"
                      color="#1B1B1B"
                    />
                  </div>
                  <DropdownMenu
                    show={showFilterDropdown}
                    setShow={setShowFilterDropdown}
                    className="admin-customer__header-dropdown-menu"
                    style={{ marginTop: 8, width: 180 }}
                  >
                    <div className="custom-dropdown-menu__options">
                      <Link
                        href="#"
                        onClick={() => handleFilterChange(1)}
                        className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        Today
                      </Link>
                      <Link
                        href="#"
                        onClick={() => handleFilterChange(2)}
                        className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Week
                      </Link>
                      <Link
                        href="#"
                        onClick={() => handleFilterChange(3)}
                        className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Month
                      </Link>
                      <Link
                        href="#"
                        onClick={() => handleFilterChange(4)}
                        className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Year
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
              </div>
              <div className="admin-customer__content">
                <div className="">
                  <table className="admin-customer__table">
                    <thead>
                      <tr className="admin-customer__table-list">
                        <th>No.</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Number phone</th>
                        <th className="admin-customer__table-header-center">
                          Status
                        </th>
                        <th>Last Active</th>
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
                      {visibleCustomer?.length ? (
                        visibleCustomer?.map((customer, index) => (
                          <CustomerList
                            {...customer}
                            index={startIndex + index + 1}
                            key={index}
                          />
                        ))
                      ) : (
                        <tr className="admin-customer__table-list">
                          <td colSpan={9} className="text-center">
                            Sorry, No Customer found. Try a different search
                            term or check your filter better results.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="hotel-details__guest-pagination">
                  <div className="pagination">
                    <button
                      type="button"
                      className={`pagination__button pagination__button--arrow${
                        currentPage > 1 ? "" : "disabled"
                      }`}
                      onClick={() => {
                        setCurrentPage(currentPage - 1);
                        setLoading(true);
                      }}
                      disabled={currentPage === 1}
                    >
                      <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                    </button>

                    {Array.from(
                      { length: totalPages || 1 },
                      (_, i) => i + 1
                    ).map((number) => {
                      const isCloseToCurrent =
                        number >= currentPage - 2 && number <= currentPage + 2;
                      const hasMoreOnLeft =
                        number !== 1 && number === currentPage - 3;
                      const hasMoreOnRight =
                        number !== totalPages && number === currentPage + 3;
                      const isFirst = number === 1;
                      const isLast = number === totalPages;

                      const isVisible =
                        isCloseToCurrent ||
                        hasMoreOnLeft ||
                        hasMoreOnRight ||
                        isFirst ||
                        isLast;

                      return (
                        isVisible && (
                          <button
                            key={number}
                            onClick={() =>
                              !(hasMoreOnLeft || hasMoreOnRight) &&
                              (setLoading(true), setCurrentPage(number))
                            }
                            type="button"
                            className={`pagination__button ${
                              number === currentPage ? "active" : ""
                            }`}
                            style={{
                              cursor:
                                hasMoreOnLeft || hasMoreOnRight
                                  ? "default"
                                  : "pointer",
                            }}
                          >
                            {hasMoreOnLeft || hasMoreOnRight ? "..." : number}
                          </button>
                        )
                      );
                    })}

                    <button
                      type="button"
                      className={`pagination__button pagination__button--arrow${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                      onClick={() => {
                        setCurrentPage(currentPage + 1);
                        setLoading(true);
                      }}
                      disabled={currentPage === totalPages}
                    >
                      <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  );
}

const CustomerSummary = () => {
  // Update the API URL for hotel booking summary
  const {
    ok: customerOk,
    loading: customerLoading,
    data: customerData,
    error: customerError,
  } = useFetch("/admin-customer/statistic", "GET", null, true);
  // Add a new useFetch for hotel booking summary
  const {
    ok: bookingOk,
    loading: bookingLoading,
    data: bookingData,
    error: bookingError,
  } = useFetch(
    "/admin-hotel-booking/summary", // New API URL for hotel booking summary
    "GET",
    null,
    true
  );

  return (
    <div className="admin-customer__summary">
      <div className="admin-customer__summary-box">
        <div className="admin-customer__summary-row">
          <p className="admin-customer__summary-header-text">
            {customerLoading ? "Loading..." : "Total Customer"}
          </p>
          <SVGIcon
            src={Icons.Hotel}
            width={20}
            height={20}
            className="admin-customer__summary-header-icon"
          />
        </div>
        <div className="admin-customer__summary-row">
          <p className="admin-customer__summary-content-value">
            {customerLoading
              ? "-"
              : `${customerData?.listed_customer || 0} Customer`}
          </p>
          <div className="admin-customer__summary-content-recap admin-customer__summary-content-recap--success">
            <p className="admin-customer__summary-content-recap--text">
              {customerData?.listed_customer_percentage
                ? (
                    parseFloat(customerData?.listed_customer_percentage) || 0
                  ).toFixed(2)
                : 0}
              %
            </p>
            <SVGIcon
              src={Icons.TrendUp}
              width={20}
              height={20}
              className="admin-customer__summary-header-icon"
            />
          </div>
        </div>
      </div>
      <div className="admin-customer__summary-box">
        <div className="admin-customer__summary-row">
          <p className="admin-customer__summary-header-text">
            {bookingLoading ? "Loading..." : "Revenue"}
          </p>
          <SVGIcon
            src={Icons.Money}
            width={20}
            height={20}
            className="admin-customer__summary-header-icon"
          />
        </div>
        <div className="admin-customer__summary-row">
          <p className="admin-customer__summary-content-value">
            {bookingLoading ? "-" : `$ ${bookingData?.total_revenue || 0}`}
          </p>
          <div className="admin-customer__summary-content-recap admin-customer__summary-content-recap--success">
            <p className="admin-customer__summary-content-recap--text">
              {bookingData?.percentage_total_revenue
                ? (
                    parseFloat(bookingData?.percentage_total_revenue) || 0
                  ).toFixed(2)
                : 0}
              %
            </p>
            <SVGIcon
              src={Icons.TrendUp}
              width={20}
              height={20}
              className="admin-customer__summary-header-icon"
            />
          </div>
        </div>
      </div>
      <div className="admin-customer__summary-box">
        <div className="admin-customer__summary-row">
          <p className="admin-customer__summary-header-text">
            {customerLoading ? "Loading..." : "Total Booking"}
          </p>
          <SVGIcon
            src={Icons.ChartBar}
            width={20}
            height={20}
            className="admin-customer__summary-header-icon"
          />
        </div>
        <div className="admin-customer__summary-row">
          <p className="admin-customer__summary-content-value">
            {bookingLoading ? "-" : `${bookingData?.total_booking || 0}`}{" "}
            Transaction
          </p>
          <div className="admin-customer__summary-content-recap admin-customer__summary-content-recap--success">
            <p className="admin-customer__summary-content-recap--text">
              {bookingData?.percentage_total_booking
                ? (
                    parseFloat(bookingData?.percentage_total_booking) || 0
                  ).toFixed(2)
                : 0}
              %
            </p>
            <SVGIcon
              src={Icons.TrendUp}
              width={20}
              height={20}
              className="admin-customer__summary-header-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// interface CustomerListProps {
//   id: string,
//   name: string,
//   phone: string,
//   email: string,
//   location: string,
//   lastActive: string,
//   status: string,
// }
interface CustomerListProps {
  id_customer: number;
  status: number;
  customer_personal: {
    fullname?: string;
    email?: string;
    phone?: string;
    country?: string;
    profile_photo?: string;
  };
  last_active: string;
  soft_delete: number;
}
const CustomerList = (props: CustomerListProps & { index: number }) => {
  const {
    index,
    id_customer,
    customer_personal,
    last_active,
    soft_delete,
    status,
  } = props;
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);

  return (
    <tr className="admin-customer__table-list">
      <td>{index < 10 ? `0${index}` : index}</td>
      <td>
        <div className="admin-customer__table-name">
          {customer_personal?.fullname || "NULLNAME"}
        </div>
      </td>
      <td>{customer_personal?.email || "NULLEMAIL"}</td>
      <td>
        <div className="admin-customer__table-list--icon">
          {customer_personal?.country || "NULLLOCATION"}
        </div>
      </td>
      <td>{customer_personal?.phone || "NULLPHONE"}</td>
      <td>
        {status === 0 && (
          <div className="admin-partner__table-status admin-partner__table-status--waiting mx-0">
            Need Review
          </div>
        )}
        {status === 1 && (
          <div className="admin-partner__table-status admin-partner__table-status--paid mx-0">
            Active
          </div>
        )}
        {status === 2 && (
          <div className="admin-partner__table-status admin-partner__table-status--ongoing mx-0">
            Suspended
          </div>
        )}
      </td>
      <td>
        <div className="admin-customer__table-list--icon">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} className="" />
          {last_active}
        </div>
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
                href={`/admin/customer/details?id=${id_customer}`}
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
              <div className="admin-customer__dropdown-separator"></div>
              <Link
                href="#"
                className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                <div className="admin-booking-hotel__dropdown-menu-option-details">
                  <SVGIcon
                    src={Icons.Disabled}
                    width={20}
                    height={20}
                    className=""
                    color="#1B1B1B"
                  />
                  <p>Suspend</p>
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

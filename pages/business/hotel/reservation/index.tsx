import React, { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { callAPI } from "@/lib/axiosHelper";
import InnerLayout from "@/components/business/hotel/layout";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { BlurPlaceholderImage } from "@/components/elements/images";
import { Icons, Images } from "@/types/enums";
import Link from "next/link";
import moment from "moment";
import { DateRange, Calendar, Range } from "react-date-range";
import { getSession, useSession } from "next-auth/react";
import LoadingOverlay from "@/components/loadingOverlay";
import { useReactToPrint } from 'react-to-print';


export default function Reservation({ propertyHotel }) {
  const [propertyHotelData, setPropertyHotelData] = useState(null);

  // Handle print
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${propertyHotelData?.property_name}-[${propertyHotelData?.id_hotel}]-Reservation List`,
    pageStyle: `
    @page {
        size: A3;
    }

    @media all {
        .pagebreak {
          display: none;
        }
      }

    @media print {

    .pagebreak {
      page-break-before: always;
    }

    @supports (-webkit-print-color-adjust: exact) {
      body {
        -webkit-print-color-adjust: exact;
      }
    }
  }`
  });


  const router = useRouter();
  // Retrive Data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [hotelBusinessID, sethotelBusinessID] = useState(null);


  const [showDateInDropdown, setShowDateInDropdown] = useState<boolean>(false);
  const [showDateOutDropdown, setShowDateOutDropdown] =
    useState<boolean>(false);
  const [dateIn, setDateIn] = useState<Date>(null);
  const [dateOut, setDateOut] = useState<Date>(null);

  // For payload
  const [type, setType] = useState(null);
  const [dateInPayload, setDateInPayload] = useState(null);
  const [dateOutPayload, setDateOutPayload] = useState(null);
  const [search, setSearch] = useState("");

  const [dataReservation, setDataReservation] = useState(null);

  //For Function Formating Data
  // Helper function to format date to 'dd Month'
  function formatDate(inputDate: string): string {
    const dateObj = new Date(inputDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are 0-indexed
    const year = dateObj.getFullYear() % 100; // Getting last two digits of the year

    return `${month}/${day}/${year}`;
  }

  const firstData = propertyHotel[0];
  const id_hotel = firstData?.id_hotel;

  useEffect(() => {
    if (propertyHotel) {
      // Assuming propertyHotel is an array
      const lastIndex = propertyHotel.length - 1;
      // console.log(lastIndex);
      if (lastIndex >= 0) {
        setPropertyHotelData(propertyHotel[lastIndex]);
        // sethotelBusinessID(propertyHotel[lastIndex]?.id_hotel)
      }
    }
  }, [propertyHotel]);

  useEffect(() => {
    const fetchDataDeparture = async () => {
      const payload = {
        id_hotel: id_hotel,
        reservation_type: type,
        date_from: dateInPayload,
        date_to: dateOutPayload,
        search: search,
        sort: 'desc'
      };

      try {
        // Requires a user_id reference for the endpoint below
        const { status, data, ok, error } = await callAPI(
          "/hotel-business-reservation/show",
          "POST",
          payload,
          true
        );
        if (data) {
          // Update the tabs object with the fetched data
          const updatedData = {
            reservation: data.map((item) => ({
              idBooking: item?.id_hotel_booking,
              photo: item?.profile_photo,
              Guest: item?.guest_fullname,
              type: item?.room_type,
              hotelName: "Sheraton Hotel",
              bookingNumber: `#${item?.id_hotel_booking}`,
              booked: formatDate(item?.reservation_book_date),
              checkIn: formatDate(item?.checkin),
              checkOut: formatDate(item?.checkout),
              price: `$ ${item?.price_amount}`,
              status: item?.status,
            })),
          };
          setDataReservation(updatedData.reservation);
        }
        setLoading(false);
      } catch (error) {
        setError(error);
        console.log(error);
        setLoading(false);
      }
    };
    fetchDataDeparture();
  }, [dateInPayload, dateOutPayload, id_hotel, search, type]);

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return {
      notFound: true,
    };
  }

  const submitFilter = async (e) => {
    e.preventDefault();
    const selectedType = e.target.type.value;
    if (selectedType === "All Reservation") {
      setType(null);
    } else {
      setType(selectedType);
    }

    const search = e.target.search.value;
    setSearch(search);

    setDateInPayload(dateIn);
    setDateOutPayload(dateOut);
  };


  return (
    <Layout>
      <InnerLayout propertyHotel={propertyHotelData}>
        <div className="container">
          <div className="admin-latest-business__top-header">
            <div className="admin-latest-business__top-header-wrapper">
              <h4 className="admin-latest-business__top-header-title">
                Reservation
              </h4>
            </div>
            <button type="button" className="btn btn-md btn-outline-success"
              onClick={handlePrint}
            >
              Export
              <SVGIcon
                src={Icons.Download}
                width={18}
                height={18}
              />
            </button>
          </div>

          <form onSubmit={submitFilter}>
            <div className="admin-booking">
              <div className="admin-booking__header admin-booking__header--reservation">
                <div className="admin-business__dropdown-reservation">
                  <p className="admin-business__content-desc">Type</p>
                  <select
                    className="form-select"
                    defaultValue={null}
                    name="type"
                    aria-label="Type Reservation"
                  >
                    <option value={null}>All Reservation</option>
                    <option value={1}>Departure</option>
                    <option value={2}>Arrival</option>
                    <option value={3}>Stay-over</option>
                  </select>
                </div>

                <div
                  className="goform-group admin-reservation__datepicker"
                  style={{ margin: 0, width: "100%", maxWidth: 160 }}
                >
                  <label
                    htmlFor="checkIn"
                    className="admin-reservation__datepicker-label"
                  >
                    Check-in
                  </label>
                  <div
                    className={`search-bar__item admin-reservation__item ${showDateInDropdown ? "search-bar__item--active" : ""
                      }`}
                  >
                    <div
                      onClick={() => setShowDateInDropdown(true)}
                      className={`search-bar__field admin-reservation__field ${dateIn ? "has-value" : ""
                        }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        {dateIn ? moment(dateIn).format("ddd, MMM DD") : "Date"}
                      </div>
                      <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    </div>
                    <DropdownMenu
                      show={showDateInDropdown}
                      setShow={setShowDateInDropdown}
                      style={{ marginTop: 36, overflow: "hidden" }}
                    >
                      <Calendar
                        months={1}
                        direction="horizontal"
                        date={dateIn}
                        onChange={(dateIn) => setDateIn(dateIn)}
                      />
                    </DropdownMenu>
                  </div>
                </div>

                <div
                  className="goform-group admin-reservation__datepicker"
                  style={{ margin: 0, width: "100%", maxWidth: 160 }}
                >
                  <label
                    htmlFor="checkIn"
                    className="admin-reservation__datepicker-label"
                  >
                    Check-out
                  </label>
                  <div
                    className={`search-bar__item admin-reservation__item ${showDateOutDropdown ? "search-bar__item--active" : ""
                      }`}
                  >
                    <div
                      onClick={() => setShowDateOutDropdown(true)}
                      className={`search-bar__field admin-reservation__field ${dateOut ? "has-value" : ""
                        }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        {dateOut
                          ? moment(dateOut).format("ddd, MMM DD")
                          : "Date"}
                      </div>
                      <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    </div>
                    <DropdownMenu
                      show={showDateOutDropdown}
                      setShow={setShowDateOutDropdown}
                      style={{ marginTop: 36, overflow: "hidden" }}
                    >
                      <Calendar
                        months={1}
                        direction="horizontal"
                        date={dateOut}
                        onChange={(dateOut) => setDateOut(dateOut)}
                      />
                    </DropdownMenu>
                  </div>
                </div>
                <div className="company-detail__content-label--reservation-input">
                  <label
                    htmlFor="search"
                    className="admin-business__content-desc"
                  >
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Guest name or something"
                    className="goform-search form-control goform-input"
                    name="search"
                    id="search"
                    aria-describedby="searchHelp"
                  />
                </div>
                <div className="company-detail__button-reservation">
                  <button
                    type="submit"
                    className="button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--save"
                  >
                    Show
                  </button>
                </div>
              </div>
              <div className="admin-booking__content">
                <div className="table-responsive">
                  <table className="admin-booking__table admin-booking__table--reservation" ref={componentRef}>
                    <thead>
                      <tr className="admin-booking__table-list">
                        <th>Guest Name</th>
                        <th>Booked on</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th className="admin-booking__table-list--center">
                          Status
                        </th>
                        <th>Price </th>
                        <th className="admin-booking__table-list--center">
                          Booking number
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {!dataReservation || !dataReservation?.length && <tr><td className="text-center" colSpan={7}>Data not found</td></tr>}
                      {dataReservation && dataReservation.map((hotel, index) => (
                        <tr key={index} className="admin-booking__table-list">
                          <td>
                            <div className="admin-reservation__guest-profile">
                              <BlurPlaceholderImage
                                className="admin-reservation__blur-image"
                                src={hotel.photo || Images.Placeholder}
                                alt="Review Image"
                                width={20}
                                height={20}
                              />
                              {hotel.Guest}
                            </div>
                          </td>
                          <td>
                            <div className="admin-booking__table-list--icon">
                              <SVGIcon
                                src={Icons.Calendar}
                                width={20}
                                height={20}
                                className=""
                              />
                              {hotel.booked}
                            </div>
                          </td>
                          <td>
                            <div className="admin-booking__table-list--icon">
                              <SVGIcon
                                src={Icons.Calendar}
                                width={20}
                                height={20}
                                className=""
                              />
                              {hotel.checkIn}
                            </div>
                          </td>
                          <td>
                            <div className="admin-booking__table-list--icon">
                              <SVGIcon
                                src={Icons.Calendar}
                                width={20}
                                height={20}
                                className=""
                              />
                              {hotel.checkOut}
                            </div>
                          </td>
                          <td>
                            {hotel.status.toString() === "0" && (
                              <div className="admin-booking__table-status admin-booking__table-status--waiting">
                                Need to fill out the Payment Form
                              </div>
                            )}
                            {hotel.status.toString() === "1" && (
                              <div className="admin-booking__table-status admin-booking__table-status--waiting">
                                Waiting Payment Verification
                              </div>
                            )}
                            {hotel.status.toString() === "2" && (
                              <div className="admin-booking__table-status admin-booking__table-status--paid">
                                Confirmed
                              </div>
                            )}
                            {hotel.status.toString() === "3" && (
                              <div className="admin-booking__table-status admin-booking__table-status--canceled">
                                Rejected
                              </div>
                            )}
                            {hotel.status.toString() === "4" && (
                              <div className="admin-booking__table-status admin-booking__table-status--canceled">
                                Canceled
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="">
                              <b>{hotel.price}</b>
                            </div>
                          </td>
                          <td>
                            <Link
                              href={`/business/hotel/reservation/details?idBooking=${hotel.idBooking}`}
                              className="admin-booking__table-list--booking"
                            >
                              {hotel.bookingNumber}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </div>
      </InnerLayout>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const id_hotel_business = session?.user?.id
  const { ok, data } = await callAPI(
    "/hotel/list-property",
    "POST",
    { id_hotel_business },
    true
  );

  if (ok && data?.length) {
    return {
      props: {
        propertyHotel: data,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/business/hotel/empty",
      },
    };
  }
};

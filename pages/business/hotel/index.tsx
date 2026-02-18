import React, { useEffect } from "react"
import { useRouter } from 'next/router'
import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import { getSession } from "next-auth/react"
import { callAPI } from "@/lib/axiosHelper"
import moment from "moment"
import LoadingOverlay from "@/components/loadingOverlay"

export default function Dashboard({ propertyHotel }) {

  const [propertyHotelData, setPropertyHotelData] = useState(null);

  const router = useRouter();
  // Retrive Data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookingStatus = ['Payment Needed', 'Credit Card Not Verified', 'Confirmed', 'Rejected', 'Cancelled'];

  //For Tabs
  const [tabs, setTabs] = useState({
    'Departure': [
      { CustomerId: '#12029283', night: '1 Nights', CustomerName: 'Guy Hawkins', room: '5 Bedroom', date: '31 October', arrivalDate: '7 Des 2021 - 8 Des 2021', arrivalDesc: 'Arrival : 1:00 PM - 1:00 PM', price: '$100.00', status: 'Payment Needed', statusNumber: '0', customerPhoto: Images.Placeholder },
    ],
    'Arrival': [
      { CustomerId: '#12029283', night: '1 Nights', CustomerName: 'Guy Hawkins', room: '5 Bedroom', buttonCheck: "Check-in", price: '$100.00', roomNumber: 'Room : 302', roomType: 'Deluxe Room Super', statusNumber: '0', customerPhoto: Images.Placeholder },
    ],
    'StayOver': [
      { CustomerId: '#12029283', night: '1 Nights', CustomerName: 'Guy Hawkins', room: '5 Bedroom', buttonCheck: "Check-out", date: '31 October', roomNumber: 'Room : 302', roomType: 'Deluxe Room Super', price: '$100.00', status: 'Confirmed', statusNumber: '0', customerPhoto: Images.Placeholder },
    ],
  });
  const [latestBooking, setLatestBooking] = useState({
    'data': [
      { CustomerId: '#12029283', CustomerName: 'Guy Hawkins', night: '1 Nights', room: '5 Bedroom', checkin: '8 Dec 2021', checkout: '9 Dec 2021', status: 'Confirmed', statusNumber: '0', customerPhoto: Images.Placeholder },
    ]
  });
  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)

  //For Function Formating Data
  // Helper function to format date to 'dd Month'
  const formatDateMonth = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    return `${day} ${month}`;
  };

  // Helper function to format date range to 'dd Mon yyyy'
  const formatDateString = (startDate) => {
    const date = new Date(startDate);
    const formattedDate = `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    return formattedDate;
  };

  const formatDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const formattedStart = `${start.getDate()} ${start.toLocaleString('default', { month: 'short' })} ${start.getFullYear()}`;
    const formattedEnd = `${end.getDate()} ${end.toLocaleString('default', { month: 'short' })} ${end.getFullYear()}`;
    return `${formattedStart} - ${formattedEnd}`;
  };

  // Helper function to format time to 'h:mm AM/PM'
  const formatArrivalTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    const formattedTime = time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return formattedTime;
  };

  const [departureDataLength, setDepartureDataLength] = useState()
  const [arrivalDataLength, setArrivalDataLength] = useState()
  const [stayoverDataLength, setStayoverDataLength] = useState()
  const [filteredData, setFilteredData] = useState('All Times')

  const lastIndex = propertyHotel.length - 1;
  const dataHotel = propertyHotel[lastIndex];
  const id_hotel = dataHotel?.id_hotel;

  const [currentPage, setCurrentPage] = useState(1)
  const [postPerPage] = useState(10)
  const indexOfLastPost = currentPage * postPerPage
  const indexOfFirstPost = indexOfLastPost - postPerPage

  useEffect(() => {
    if (propertyHotel) {
      // Assuming propertyHotel is an array
      const lastIndex = propertyHotel.length - 1;
      if (lastIndex >= 0) {
        setPropertyHotelData(propertyHotel[lastIndex]);
      }
    }
  }, [propertyHotel]);

  useEffect(() => {
    const fetchDataDeparture = async () => {
      const payload = {
        id_hotel: id_hotel,
        reservation_type: null,
        date_from: null,
        date_to: null,
        search: null
      }

      try {
        const fetchData = async () => {
          try {
            let filterStartDate, filterEndDate;

            if (filteredData === "This Week") {
              filterStartDate = moment().startOf('week').format('YYYY-MM-DD');
              filterEndDate = moment().endOf('week').format('YYYY-MM-DD');
            } else if (filteredData === "This Month") {
              filterStartDate = moment().startOf('month').format('YYYY-MM-DD');
              filterEndDate = moment().endOf('month').format('YYYY-MM-DD');
            } else if (filteredData === "This Year") {
              filterStartDate = moment().startOf('year').format('YYYY-MM-DD');
              filterEndDate = moment().endOf('year').format('YYYY-MM-DD');
            } else if (filteredData === "All Times") {
              // Set the date range for "All Times" from January 1, 1970, to the end of next year
              filterStartDate = moment('1970-01-01').format('YYYY-MM-DD');
              filterEndDate = moment().endOf('year').add(1, 'year').format('YYYY-MM-DD');
            } else {
              filterStartDate = moment().format('YYYY-MM-DD')
              filterEndDate = moment().format('YYYY-MM-DD')
            }

            const { status: statusDeparture, data: dataDeparture, ok: okDeparture, error: errorDeparture } = await callAPI('/hotel-business-reservation/show', 'POST', { 'id_hotel': id_hotel, 'reservation_type': 1, 'date_from': filterStartDate, 'date_to': filterEndDate, limit: 9999999, sort: "desc" }, true)
            const { status: statusArrival, data: dataArrival, ok: okArrival, error: errorArrival } = await callAPI('/hotel-business-reservation/show', 'POST', { 'id_hotel': id_hotel, 'reservation_type': 2, 'date_from': filterStartDate, 'date_to': filterEndDate, limit: 9999999, sort: "desc" }, true)
            const { status: statusStayover, data: dataStayover, ok: okStayover, error: errorStayover } = await callAPI('/hotel-business-reservation/show', 'POST', { 'id_hotel': id_hotel, 'reservation_type': 3, 'date_from': filterStartDate, 'date_to': filterEndDate, limit: 9999999, sort: "desc" }, true)
            const { status: statusLatest, data: dataLatest, ok: okLatest, error: errorLatest } = await callAPI('/hotel-business-reservation/show', 'POST', { 'id_hotel': id_hotel, 'reservation_type': null, 'date_from': filterStartDate, 'date_to': filterEndDate, limit: 5, sort: "desc" }, true)

            if (dataDeparture && dataArrival && dataStayover) {
              setDepartureDataLength(dataDeparture.length)   // set departure data length
              setArrivalDataLength(dataArrival.length)   // set departure data length
              setStayoverDataLength(dataStayover.length)   // set departure data length
              // Update the tabs object with the fetched data

              const updatedTabs = {
                'Departure': dataDeparture.map(item => ({
                  CustomerId: `${item?.id_hotel_booking}`,
                  night: `${Math.round((Number(new Date(item?.checkout)) - Number(new Date(item?.checkin))) / (1000 * 60 * 60 * 24))} Nights`,
                  CustomerName: item?.guest_fullname ? item?.guest_fullname : item?.fullname,
                  room: item?.room_type,
                  date: formatDateMonth(item?.reservation_book_date),
                  arrivalDate: formatDateRange(item?.checkin, item?.checkout),
                  arrivalDesc: `Arrival : ${formatArrivalTime(item?.arrival_checkin)} - ${formatArrivalTime(item?.arrival_checkout)}`,
                  price: `$${item?.price_amount}`,
                  status: bookingStatus[item?.status] || 'Unknown',
                  statusNumber: item?.status,
                  customerPhoto: item?.profile_photo
                })),
                'Arrival': dataArrival.map(item => ({
                  CustomerId: `${item?.id_hotel_booking}`,
                  night: `${Math.round((Number(new Date(item?.checkout)) - Number(new Date(item?.checkin))) / (1000 * 60 * 60 * 24))} Nights`,
                  CustomerName: item?.guest_fullname ? item?.guest_fullname : item?.fullname,
                  room: item?.room_type,
                  roomType: item?.room_type,
                  date: formatDateMonth(item?.reservation_book_date),
                  arrivalDate: formatDateRange(item?.checkin, item?.checkout),
                  arrivalDesc: `Arrival : ${formatArrivalTime(item?.arrival_checkin)} - ${formatArrivalTime(item?.arrival_checkout)}`,
                  price: `$${item?.price_amount}`,
                  status: bookingStatus[item?.status] || 'Unknown',
                  buttonCheck: "Check-in",
                  statusNumber: item?.status,
                  customerPhoto: item?.profile_photo
                })),
                'StayOver': dataStayover.map(item => ({
                  CustomerId: `${item?.id_hotel_booking}`,
                  night: `${Math.round((Number(new Date(item?.checkout)) - Number(new Date(item?.checkin))) / (1000 * 60 * 60 * 24))} Nights`,
                  CustomerName: item?.guest_fullname ? item?.guest_fullname : item?.fullname,
                  room: item?.room_type,
                  roomType: item?.room_type,
                  date: formatDateMonth(item?.reservation_book_date),
                  arrivalDate: formatDateRange(item?.checkin, item?.checkout),
                  arrivalDesc: `Arrival : ${formatArrivalTime(item?.arrival_checkin)} - ${formatArrivalTime(item?.arrival_checkout)}`,
                  price: `$${item?.price_amount}`,
                  status: bookingStatus[item?.status] || 'Unknown',
                  buttonCheck: "Check-out",
                  statusNumber: item?.status,
                  customerPhoto: item?.profile_photo
                })),
              };

              const updatedLatestBooking = {
                'data': dataLatest.map(item => ({
                  CustomerId: item?.id_hotel_booking,
                  CustomerName: item?.guest_fullname ? item?.guest_fullname : item?.fullname,
                  night: `${Math.round((Number(new Date(item?.checkout)) - Number(new Date(item?.checkin))) / (1000 * 60 * 60 * 24))} Nights`,
                  room: item?.room_type,
                  checkin: formatDateString(item?.checkin),
                  checkout: formatDateString(item?.checkout),
                  status: bookingStatus[item?.status] || 'Unknown',
                  statusNumber: item?.status,
                  customerPhoto: item?.profile_photo
                }))
                  .slice(0, 5)
              };

              setTabs(updatedTabs); // Set the updated tabs object
              setLatestBooking(updatedLatestBooking); // Set the updated latest booking object
            };
            setLoading(false);
          } catch (error) {
            setError(error);
            setLoading(false);
            console.log(error)
          }
        };
        fetchData();
      } catch (error) {
        setError(error);
        setLoading(false);
        console.log(error);
      }
    };
    fetchDataDeparture();
  }, ([filteredData]));

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab]);

  const currentFilteredBlogs = tabs[selectedTab].slice(indexOfFirstPost, indexOfLastPost)

  if (loading) {
    return <LoadingOverlay />
  }

  if (error) {
    return {
      notFound: true,
    }
  }

  return (
    <Layout>
      <InnerLayout propertyHotel={propertyHotelData}>
        <div className="container container-dashboard">
          <div className="admin-business__top-header">
            <div className="admin-business__top-header-wrapper">
              <h4 className="admin-business__top-header-title">Reservation Overview</h4>
              <div className="admin-business__top-header-toggle">
                <div className="custom-dropdown">
                  <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
                    <div style={{ whiteSpace: "nowrap" }}>{filteredData}</div>
                    <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                  </div>
                  <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-business__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                    <div className="custom-dropdown-menu__options">
                      <Link onClick={() => setFilteredData('Today')} href="#" className="admin-business__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Today
                      </Link>
                      <Link onClick={() => setFilteredData('This Week')} href="#" className="admin-business__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        This Week
                      </Link>
                      <Link onClick={() => setFilteredData('This Month')} href="#" className="admin-business__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        This Month
                      </Link>
                      <Link onClick={() => setFilteredData('This Year')} href="#" className="admin-business__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        This Year
                      </Link>
                      <Link onClick={() => setFilteredData('All Times')} href="#" className="admin-business__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        All Times
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
                <Link href='/business/hotel/reservation' className="btn btn-md btn-outline-success">
                  See all reservation
                </Link>
              </div>
            </div>
          </div>
          <div className="admin-business">
            <div className="admin-business__content-header">
              <div className="admin-business__content-header-split">
                <div className="admin-business__content-header-tab-menu">
                  {Object.keys(tabs).map((tab, index) => (
                    <button
                      key={index}
                      className={`btn admin-business ${tab === selectedTab ? 'active' : ''}`}
                      onClick={() => setSelectedTab(tab)}>
                      {tab}
                      <span className={`data-new-total ${tab === 'Departure' ? 'visible' : 'hidden'}`}>
                        {tab === 'Departure' ? departureDataLength : undefined}
                      </span>
                      <span className={`data-new-total ${tab === 'Arrival' ? 'visible' : 'hidden'}`}>
                        {tab === 'Arrival' ? arrivalDataLength : undefined}
                      </span>
                      <span className={`data-new-total ${tab === 'StayOver' ? 'visible' : 'hidden'}`}>
                        {tab === 'StayOver' ? stayoverDataLength : undefined}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {selectedTab === 'Departure' && currentFilteredBlogs.length > 0 ? (
              currentFilteredBlogs.map((departure, index) => (
                <div key={index} className="admin-business__departure">
                  <div className="admin-business__departure-img">
                    <img className="manage-review__modal-desc-image" src={departure.customerPhoto ? departure.customerPhoto : Images.Placeholder} alt="" width={48} height={48} />
                  </div>
                  <div className="admin-business__departure-customer--wrapper">
                    <h5 className="admin-business__departure-customer--name">{departure.CustomerName}</h5>
                    <div className="admin-business__departure-desc--wrapper">
                      <p className="admin-business__departure-desc--id">#{departure.CustomerId}</p>
                      <div className="admin-business__departure-desc--night">
                        <SVGIcon src={Icons.Moon} width={20} height={20} />
                        <p className="admin-business__departure-desc--night">{departure.night}</p>
                      </div>
                      <div className="admin-business__departure-desc--room">
                        <SVGIcon src={Icons.Door} width={20} height={20} />
                        <p className="admin-business__departure-desc--room">{departure.room}</p>
                      </div>
                    </div>
                  </div>
                  <div className="admin-business__departure-date">
                    <p className="admin-business__departure-date">{departure.date}</p>
                  </div>
                  <div className="admin-business__departure-arrival">
                    <div className="admin-business__departure-arrival--wrapper">
                      <SVGIcon src={Icons.Calendar} width={20} height={20} />
                      <p className="admin-business__departure-arrival--date">{departure.arrivalDate}</p>
                    </div>
                    <div className="admin-business__departure-arrival--desc">
                      <p className="admin-business__departure-arrival--desc">{departure.arrivalDesc}</p>
                    </div>
                  </div>
                  <div className="admin-business__departure-price">
                    <p className="admin-business__departure-price">{departure.price}</p>
                  </div>
                  <div className="admin-business__departure-link">
                    <Link href={`/business/hotel/reservation/details?idBooking=${departure.CustomerId}`} className="admin-business__departure-link">Detail Order</Link>
                  </div>
                </div>
              ))
            ) : selectedTab === 'Arrival' && currentFilteredBlogs.length > 0 ? (
              currentFilteredBlogs.map((arrival, index) => (
                <div key={index} className="admin-business__arrival">
                  <div className="admin-business__arrival-header--wrapper">
                    <div className="admin-business__arrival-img">
                      <img className="manage-review__modal-desc-image" src={arrival.customerPhoto ? arrival.customerPhoto : Images.Placeholder} alt="" width={48} height={48} />
                    </div>
                    <div className="admin-business__arrival-customer--wrapper">
                      <h5 className="admin-business__arrival-customer--name">{arrival.CustomerName}</h5>
                      <div className="admin-business__arrival-desc--wrapper">
                        <p className="admin-business__arrival-desc--id">#{arrival.CustomerId}</p>
                        <div className="admin-business__arrival-desc--night">
                          <SVGIcon src={Icons.Moon} width={20} height={20} />
                          <p className="admin-business__arrival-desc--night">{arrival.night}</p>
                        </div>
                        <div className="admin-business__arrival-desc--room">
                          <SVGIcon src={Icons.Door} width={20} height={20} />
                          <p className="admin-business__arrival-desc--room">{arrival.room}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="admin-business__arrival-room">
                    <p className="admin-business__arrival-room--name">{arrival.roomType}</p>
                  </div>
                  <div className="admin-business__arrival-price">
                    <p className="admin-business__arrival-price">{arrival.price}</p>
                  </div>
                  <Link href={`/business/hotel/reservation/details?idBooking=${arrival.CustomerId}`} className="admin-business__arrival-button admin-business__arrival-button--checkin ">
                    <p className="admin-business__arrival-button-caption">{arrival.buttonCheck}</p>
                    <SVGIcon src={Icons.Check} width={28} height={28} color="#FFFFFF" />
                  </Link>
                </div>
              ))
            ) : selectedTab === 'StayOver' && currentFilteredBlogs.length > 0 ? (
              currentFilteredBlogs.map((stayover, index) => (
                <div key={index} className="admin-business__departure">
                  <div className="admin-business__departure-img">
                    <img className="manage-review__modal-desc-image" src={stayover.customerPhoto ? stayover.customerPhoto : Images.Placeholder} alt="" width={48} height={48} />
                  </div>
                  <div className="admin-business__departure-customer--wrapper">
                    <h5 className="admin-business__departure-customer--name">{stayover.CustomerName}</h5>
                    <div className="admin-business__departure-desc--wrapper">
                      <p className="admin-business__departure-desc--id">#{stayover.CustomerId}</p>
                      <div className="admin-business__departure-desc--night">
                        <SVGIcon src={Icons.Moon} width={20} height={20} />
                        <p className="admin-business__departure-desc--night">{stayover.night}</p>
                      </div>
                      <div className="admin-business__departure-desc--room">
                        <SVGIcon src={Icons.Door} width={20} height={20} />
                        <p className="admin-business__departure-desc--room">{stayover.room}</p>
                      </div>
                    </div>
                  </div>
                  <div className="admin-business__arrival-room">
                    <p className="admin-business__arrival-room--name">{stayover.roomType}</p>
                  </div>
                  <div className="admin-business__departure-price">
                    <p className="admin-business__departure-price">{stayover.price}</p>
                  </div>
                  <Link href={`/business/hotel/reservation/details?idBooking=${stayover.CustomerId}`} className="admin-business__arrival-button admin-business__arrival-button--checkout">
                    <p className="admin-business__arrival-button-caption">{stayover.buttonCheck}</p>
                    <SVGIcon src={Icons.Check} width={28} height={28} color="#FFFFFF" />
                  </Link>
                </div>
              ))
            ) : (
              <div style={{ width: '100%', margin: 'auto', textAlign: 'center' }}>
                There's still no reservation on {selectedTab}. It seems that there are no reservations currently available.
              </div>
            )}

            {!!tabs[selectedTab].length
              ? <Pagination data={tabs[selectedTab]} currentPage={currentPage} postPerPage={postPerPage} setCurrentPage={setCurrentPage} />
              : ''
            }
          </div>
        </div>

        <div className="container container-latest">
          <div className="admin-latest-business__top-header">
            <div className="admin-latest-business__top-header-wrapper">
              <h4 className="admin-latest-business__top-header-title">Latest Booking</h4>
            </div>
            <Link href='/business/hotel/reservation' className="btn btn-md btn-outline-success">
              See all reservation
            </Link>
          </div>
          <div className="admin-latest-business">
            {latestBooking['data'].map((data, index) => (
              <div className="admin-latest-business__content" key={index}>
                <div className="admin-latest-business__content-img">
                  <img className="manage-review__modal-desc-image" src={data.customerPhoto ? data.customerPhoto : Images.Placeholder} alt="" width={48} height={48} />
                </div>
                <div className="admin-latest-business__content-customer-wrapper">
                  <h5 className="admin-latest-business__content-customer-name">{data.CustomerName}</h5>
                  <div className="admin-latest-business__content-desc-wrapper">
                    <div className="admin-latest-business__content-desc-night">
                      <SVGIcon src={Icons.Moon} width={20} height={20} />
                      <p className="admin-latest-business__content-desc-night">{data.night}</p>
                    </div>
                    <div className="admin-latest-business__content-desc-room">
                      <SVGIcon src={Icons.Door} width={20} height={20} />
                      <p className="admin-latest-business__content-desc-room">{data.room}</p>
                    </div>
                  </div>
                </div>
                <div className="admin-latest-business__content-arrival">
                  <div className="admin-latest-business__content-arrival-desc">
                    <p className="admin-latest-business__content-arrival-desc">Check-in</p>
                  </div>
                  <div className="admin-latest-business__content-arrival-wrapper">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p className="admin-latest-business__content-arrival-date">{data.checkin}</p>
                  </div>
                </div>
                <div className="admin-latest-business__content-arrival">
                  <div className="admin-latest-business__content-arrival-desc">
                    <p className="admin-latest-business__content-arrival-desc">Check-Out</p>
                  </div>
                  <div className="admin-latest-business__content-arrival-wrapper">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p className="admin-latest-business__content-arrival-date">{data.checkout}</p>
                  </div>
                </div>
                <div className="admin-latest-business__content-status-wrapper">
                  <p className="admin-latest-business__content-status-wrapper">Status</p>
                  <div>
                    {data.status === 'Confirmed' ? (
                      <div className="admin-latest-business__content-status admin-latest-business__content-status--confirmed">
                        {data.status}
                      </div>
                    ) : data.status === 'Cancelled' ? (
                      <div className="admin-latest-business__content-status admin-latest-business__content-status--canceled">
                        {data.status}
                      </div>
                    ) : data.status === 'Rejected' ? (
                      <div className="admin-latest-business__content-status admin-latest-business__content-status--rejected">
                        {data.status}
                      </div>
                    ) : data.status === 'Payment Needed' ? (
                      <div className="admin-latest-business__content-status admin-latest-business__content-status--info">
                        {data.status}
                      </div>
                    ) : <div className="admin-latest-business__content-status admin-latest-business__content-status--waiting">
                      {data.status}
                    </div>}
                  </div>
                </div>
                <div className="admin-latest-business__content-link">
                  <Link href={`/business/hotel/reservation/details?idBooking=${data.CustomerId}`} className="admin-latest-business__content-link">See Reservation</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </InnerLayout>
    </Layout>
  )
}

const Pagination = ({ currentPage, setCurrentPage, data, postPerPage }) => {

  const pageCounts = Math.ceil(data.length / postPerPage)

  return (
    <nav aria-label="Page navigation example">
      <div className="search-transfer__pagination">
        <div className="pagination">
          <button type="button"
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(90deg)', cursor: currentPage === 1 ? 'default' : 'pointer' }}>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </button>
          {Array.from({ length: pageCounts }, (_, i) => i + 1).map((number) => {
            const isCloseToCurrent = number >= currentPage - 2 && number <= currentPage + 2
            const hasMoreOnLeft = number !== 1 && number === currentPage - 3
            const hasMoreOnRight = number !== pageCounts && number === currentPage + 3
            const isFirst = number === 1
            const isLast = number === pageCounts

            const isVisible = isCloseToCurrent || hasMoreOnLeft || hasMoreOnRight || isFirst || isLast

            return isVisible && (
              <button key={number} onClick={() => !(hasMoreOnLeft || hasMoreOnRight) && setCurrentPage(number)} type="button" className={`pagination__button ${number === currentPage ? 'active' : ''}`} style={{ cursor: hasMoreOnLeft || hasMoreOnRight ? 'default' : 'pointer' }}>{(hasMoreOnLeft || hasMoreOnRight) ? '...' : number}</button>
            )
          })}
          <button type="button" onClick={() => currentPage < pageCounts && setCurrentPage(currentPage + 1)} className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(-90deg)', cursor: currentPage === pageCounts ? 'default' : 'pointer' }}>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </button>
        </div>
      </div>
    </nav>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  const { ok, data } = await callAPI('/hotel/list-property', 'POST', { id_hotel_business: session?.user?.id }, true)

  if (ok && data?.length) {
    return {
      props: {
        propertyHotel: data
      }
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/business/hotel/empty',
      },
    }
  }
}
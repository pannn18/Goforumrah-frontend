import Layout from '@/components/layout'
import React, { useEffect, useRef } from 'react'
import Navbar from '@/components/business/car/navbar'
import CustomFullCalendar from '@/components/fullcalendar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useState } from "react"
import carImage from 'assets/images/car_details_image_2.png'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import moment from 'moment'
import LoadingOverlay from '@/components/loadingOverlay'
import { useReactToPrint } from 'react-to-print'

export default function LocationManagement() {
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)
  const [dataEvents, setDataEvents] = useState([])
  const [currentMonth, setCurrentMonth] = useState('');
  const [dateSelect, setDateSelect] = useState(null)
  const [dataNotPickup, setDataNotPickup] = useState({
    id_car_booking: null,
    reservation_status: null,
    note: null
  })
  const [loading, setLoading] = useState(true)

  const handleDatesSet = (arg) => {
    const viewTitle = arg.view.title;
    const formattedDate = moment(`${viewTitle}-01`, 'MMM YYYY-DD').format('YYYY-MM-DD');
    setCurrentMonth(formattedDate);
  }


  useEffect(() => {
    if (!id_car_business) return

    const getDataCalender = async () => {
      try {
        const { data, ok, error } = await callAPI(
          '/car-business-dashboard/calendar', 'POST', { id_car_business: id_car_business, date: currentMonth }, true
        )
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setDataEvents(data)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }

    }

    getDataCalender()

  }, [currentMonth, id_car_business])


  const dataEvent = dataEvents.filter(item => item.reservation > 0)
    .map(item => ({
      title: String(item.reservation), // Mengubah reservation menjadi string
      date: item.date,
      className: 'fc-custom-event-counter'
    }));

  const handleSelect = (start) => {
    const date = moment(start).format('YYYY-MM-DD')
    setDateSelect(date)
  }

  const handleNotPickup = (reservation) => {
    setDataNotPickup(reservation)
  }

  if (loading) {
    return <LoadingOverlay />
  }

  return (
    <Layout>
      <div className="sticky-top">
        <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
        <HeaderReservation />
      </div>
      <div className="add-location">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className='add-location__content-container'>
                <div className="car-dashboard__content-form">
                  <CustomFullCalendar events={dataEvent} handleDatesSet={handleDatesSet} handleSelect={handleSelect} />
                </div>
                <ReservationContent dateSelect={dateSelect} handleNotPickup={handleNotPickup} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Popup id_car_booking={dataNotPickup.id_car_booking} reservation_status={dataNotPickup.reservation_status} note={dataNotPickup.note} />
      {/* <Popup data={dataNotPickup}/> */}
    </Layout>
  )
};

const HeaderReservation = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link href={"/business/car"} className='car-dashboard__content-header car-dashboard__content-header--link'>
            <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
            <h4 className='car-dashboard__content-title-heading'>All Reservation</h4>
          </Link>
        </div>
      </div>
    </header>
  )
}

const ReservationContent = ({ dateSelect, handleNotPickup }) => {

  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedDate, setSelectedDate] = useState('')
  const [dataReservation, setDataReservation] = useState([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!id_car_business) return
    if (!dateSelect) return
    setLoading(true)

    const getDataReservation = async () => {
      try {
        const { data, ok, error } = await callAPI('/car-business-dashboard/list-booking-calendar', 'POST', { id_car_business: id_car_business, date: dateSelect }, true)
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setDataReservation(data)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }

    }
    getDataReservation()

    const dateFormatted = moment(dateSelect, 'YYYY-MM-DD').format('DD MMM YYYY')
    setSelectedDate(dateFormatted)

  }, [dateSelect, id_car_business])


  const handleFilterToggle = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  // Handle download
  const componentRef = useRef();
  const handleDownload = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Car Booking Detail',
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

  return (
    <div className="car-reservation__content">
      <div className="car-reservation__content-wrapper">
        <div className="car-reservation__content-header">
          <div className="car-reservation__date">
            <div className="car-reservation__date-caption">
              <p>Selected Date:</p>
              <SVGIcon src={Icons.Calendar} width={20} height={20} color="#1B1B1BF5" className='car-dashboard__svg-button' />
              <span>{selectedDate}</span>
            </div>
            <div className="car-reservation__date-order">{dataReservation.length} Order</div>
          </div>
        </div>
      </div>

      <div className="car-reservation__content-wrapper">

        {loading ? (
          <div className="text-center">
            Loading...
          </div>
        ) : (
          dataReservation.map((reservation, index) => (
            <div className="car-dashboard__content-form" key={index} ref={componentRef}>
              <div className="car-reservation__car-list">
                <div className="car-reservation__car-header">
                  <div className="car-reservation__car-profile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="5" fill="white" stroke="#1CB78D" stroke-width="4" />
                    </svg>
                    <p className="car-reservation__caption-bold">{reservation?.fullname}</p>
                    <p className='car-reservation__caption-id--large'>{reservation?.id_car_booking}</p>
                  </div>
                  <div className="car-reservation__info">
                    {reservation?.reservation_status >= 3 &&
                      <a onClick={() => handleNotPickup(reservation)} data-bs-toggle="modal" data-bs-target="#downloadModal">
                        <button type="button" className="car-reservation__top-header-btn btn btn-md car-reservation__info-danger">
                          Car wasn’t picked up
                        </button>
                      </a>
                    }

                    {/* <p className="car-reservation__info-danger">Car wasn’t picked up</p> */}

                    <a >
                      <button type="button" onClick={handleDownload} className="car-reservation__top-header-btn btn btn-md btn-outline-success">
                        Download
                        <SVGIcon src={Icons.Download} width={18} height={18} color='#1CB78D' />
                      </button>
                    </a>
                  </div>
                </div>
                <div className="car-reservation__car-list-content">
                  <BlurPlaceholderImage className='' alt='image' src={carImage} width={104} height={104} />
                  <div className="car-reservation__content-list">
                    <div className="car-reservation__car-list-wrapper">
                      <p className="car-reservation__caption-id">Car name</p>
                      <p className="car-reservation__caption-content">{reservation?.car_brand}</p>
                      <div className="car-reservation__car-list-wrapper--row">
                        <div className="car-reservation__car-list-desc">
                          <SVGIcon src={Icons.Seats} width={16} height={16} color='' />
                          <div className="car-reservation__caption-id--small">4 Seats</div>
                        </div>
                        <div className="car-reservation__ellipse"></div>
                        <div className="car-reservation__car-list-desc">
                          <SVGIcon src={Icons.Door} width={16} height={16} color='' />
                          <div className="car-reservation__caption-id--small">4 Doors</div>
                        </div>
                        <div className="car-reservation__ellipse"></div>
                        <div className="car-reservation__car-list-desc">
                          <SVGIcon src={Icons.Compas} width={16} height={16} color='' />
                          <div className="car-reservation__caption-id--small">{reservation?.transmission}</div>
                        </div>
                        <Link href={`/business/car/reservation/details?id_car_booking=${reservation?.id_car_booking}&id_customer=${reservation?.id_customer}`} className="dashboard__data-link">See More</Link>
                      </div>
                    </div>
                    <div className="car-reservation__car-list-wrapper car-reservation__car-list-wrapper--var">
                      <p className="car-reservation__caption-id">Pick-up</p>
                      <p className="car-reservation__caption-content">{reservation?.pickup}</p>
                      <div className="car-reservation__car-list-wrapper--row">
                        <div className="car-reservation__car-list-desc">
                          <div className="car-reservation__caption-id--small">{reservation?.pickup_date_time}</div>
                        </div>
                        {/* <div className="car-reservation__ellipse"></div>
                        <div className="car-reservation__car-list-desc">
                          <div className="car-reservation__caption-id--small">10:00</div>
                        </div> */}
                      </div>
                    </div>
                    <div className="car-reservation__car-list-wrapper car-reservation__car-list-wrapper--var">
                      <p className="car-reservation__caption-id">Drop - off</p>
                      <p className="car-reservation__caption-content">{reservation?.dropoff}</p>
                      <div className="car-reservation__car-list-wrapper--row">
                        <div className="car-reservation__car-list-desc">
                          <div className="car-reservation__caption-id--small">{reservation?.dropoff_date_time}</div>
                        </div>
                        {/* <div className="car-reservation__ellipse"></div>
                        <div className="car-reservation__car-list-desc">
                          <div className="car-reservation__caption-id--small">02:40</div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        {!loading && dataReservation?.length === 0 &&
          <div className="text-center">
            Data not found
          </div>
        }


      </div>
    </div>
  )
}

const Popup = ({ id_car_booking, reservation_status, note }) => {

  const [idBooking, setIdBooking] = useState(0)
  const [explanation, setExplanation] = useState('')
  const [selectedOption, setSelectedOption] = useState(0)

  useEffect(() => {
    if (id_car_booking && reservation_status && note) {
      setIdBooking(id_car_booking)
      setExplanation(note)
      setSelectedOption(reservation_status)
    }
  }, [id_car_booking, note, reservation_status])

  const handleExplanation = (e) => {
    setExplanation(e.target.value)
  }

  const handleNotPickup = async () => {
    const payload = {
      id_car_booking: idBooking,
      reservation_status: selectedOption,
      note: explanation
    }

    const { ok, error, status } = await callAPI('/car-business-dashboard/not-pickup', 'POST', payload, true)
    if (error) {
      console.log(error);
    }
    if (ok) {
      alert('success')
    }
  }
  return (


    <div className="modal fade" id="downloadModal" tabIndex={-1} aria-labelledby="reviewLabel" aria-hidden="true">
      <div className="modal-dialog car-reservation__modal">
        <div className="modal-content car-reservation__modal-body">
          <div className="car-reservation__modal-header">
            <div>
              <h4 className="">Car wasn’t pickup</h4>
            </div>
            <button type="button" className="car-reservation__popup-btn btn-close" data-bs-dismiss="modal">
              <SVGIcon src={Icons.Cancel} width={21} height={21} color="#616161" className='car-dashboard__svg-button' />
            </button>
          </div>
          <div className="car-reservation__popup-content">
            <div className="car-reservation__radio-list">
              <div className="car-reservation__popup-radio form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="acRadioOptions"
                  id="acRadio1"
                  onChange={() => setSelectedOption(3)}
                  checked={selectedOption === 3}
                />
                <label className="car-reservation__popup-wrapper" htmlFor='acRadio1'>
                  <p className="car-reservation__caption-bold">No show</p>
                  <p>The customer didn’t arrive to pick up their car</p>
                </label>

              </div>
              <div className="car-reservation__popup-radio form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="acRadioOptions"
                  id="acRadio2"
                  onChange={() => setSelectedOption(4)}
                  checked={selectedOption === 4}
                />
                <label className="car-reservation__popup-wrapper" htmlFor='acRadio2'>
                  <p className="car-reservation__caption-bold">Fleet Fail</p>
                  <p>We didn’t have a car for the customercar</p>
                </label>
              </div>

              <div className="car-reservation__popup-radio form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="acRadioOptions"
                  id="acRadio3"
                  onChange={() => setSelectedOption(5)}
                  checked={selectedOption === 5}
                />
                <label className="car-reservation__popup-wrapper" htmlFor='acRadio3'>
                  <p className="car-reservation__caption-bold">Other</p>
                </label>
              </div>
            </div>
            <div className="add-location__content-label">
              <label htmlFor="smookingPolicy" className="form-label goform-label">Please explain</label>
              <input
                type="text"
                placeholder='---'
                className="form-control goform-input goform-input__desc"
                id="directionLocation"
                aria-describedby="directionLocationHelp"
                value={explanation}
                onChange={handleExplanation}
              />
            </div>
          </div>
          <div className='company-detail__button-list-group row'>
            <Link href={"#"} onClick={() => (
              setSelectedOption(reservation_status),
              setExplanation(note)
            )}
              className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item' data-bs-dismiss="modal">Cancel</button>
            </Link>
            <Link
              href={'/business/car/reservation'}
              className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
              <button onClick={handleNotPickup} type='button' className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form' data-bs-dismiss="modal">Confirm</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
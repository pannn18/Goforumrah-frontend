import Layout from '@/components/layout'
import React, { useRef, useEffect } from 'react';
import Navbar from '@/components/business/car/navbar'
import CustomFullCalendar from '@/components/fullcalendar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useState } from "react"
import carImage from 'assets/images/car_details_image_2.png'
import DropdownMenu from "@/components/elements/dropdownMenu"
import { DateRange, Calendar, Range } from 'react-date-range';
import moment from 'moment';
import { current } from '@reduxjs/toolkit';
import { useSession } from 'next-auth/react';
import LoadingOverlay from '@/components/loadingOverlay';
import { callAPI } from '@/lib/axiosHelper';


export default function AllAllocation() {
  return (
    <Layout>
      <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
      <HeaderAllocation />
      <div className="add-location">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className='add-location__content-container'>
                <ContentReservation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
};

const HeaderAllocation = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link href={"/business/car"} className='car-dashboard__content-header car-dashboard__content-header--link'>
            <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
            <h4 className='car-dashboard__content-title-heading'>Allocation</h4>
          </Link>
        </div>
      </div>
    </header>
  )
}

const ContentReservation = () => {
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)

  //Retrive Data from API
  const [carAllocationData, setCarAllocationData] = useState(null);
  const [carAllocationLoading, setCarAllocationLoading] = useState(true);
  const [carAllocationError, setCarAllocationError] = useState(null);
  const [carAllocationFleetID, setCarAllocationFleetID] = useState(null);

  // Handle date, month change
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortenedMoths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  // Current day in a month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());
  const [formattedDate, setFormattedDate] = useState(`${year}-${String(month + 1).padStart(2, '0')}-01`);

  const daysInMonth = getDaysInMonth(year, month);

  // Handle month change
  let newMonthBefore = month - 1;
  let newMonthAfter = month + 1;

  if (newMonthAfter > 11) {
    newMonthAfter = 0;
  } else if (newMonthBefore < 0) {
    newMonthBefore = 11;
  }

  const handleNextMonth = () => {
    // Increment the month
    const newMonth = month + 1;

    // Check if we need to increment the year
    const newYear = newMonth > 11 ? year + 1 : year;

    // Calculate the new month index (0-11)
    const newMonthIndex = newMonth % 12;

    // Update the state variables
    setMonth(newMonthIndex);
    setYear(newYear);
  };

  const handlePreviousMonth = () => {
    // Decrement the month
    const newMonth = month - 1;

    // Check if we need to decrement the year
    const newYear = newMonth < 0 ? year - 1 : year;

    // Calculate the new month index (0-11)
    const newMonthIndex = newMonth < 0 ? 11 : newMonth;

    // Update the state variables
    setMonth(newMonthIndex);
    setYear(newYear);

  };

  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const handleSortToggle = () => {
    setShowSortDropdown(!showSortDropdown);
  };

  const fetchCarAllocation = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/car-business-allocation/show', 'POST', { id_car_business: id_car_business, date: formattedDate }, true);
      setCarAllocationData(data);
      setCarAllocationLoading(false);
    } catch (error) {
      setCarAllocationError(error);
      setCarAllocationLoading(false);
    }
  };

  useEffect(() => {
    if (!id_car_business) return
    // Check if carAllocationData already available
    fetchCarAllocation();
  }, [id_car_business, formattedDate]);

  const [isBooked, setIsBooked] = useState(false)
  if (carAllocationLoading) {
    return <LoadingOverlay />;
  }

  if (carAllocationError) {
    return <div>Error Fetching Data</div>;
  }
  return (
    <div className="allocation-car__content">
      {/* <div className="allocation-car__content-form">
        <div className="allocation-car__content-allocation">
          <div className="allocation-car__content-date">
            <div className="allocation-car__content-label">
              <p className="allocation-car__caption--semibold">Start date</p>
              <div className="custom-dropdown">
                <div onClick={() => setShowDateDropdown(true)} className="custom-dropdown-toggle custom-dropdown-toggle--reservation">
                  <div style={{ whiteSpace: 'nowrap' }}>{departureOnly ? moment(departureOnly).format('ddd, MMM DD') : formatedDay}</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
                <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 16, overflow: 'hidden' }}>
                  <Calendar
                    months={1}
                    direction="horizontal"
                    date={departureOnly}
                    onChange={date => setDepartureOnly(date)}
                  />
                </DropdownMenu>
              </div>
            </div>
            <div className="allocation-car__check form-check form-check-inline">
              <input className="form-check-input" type="checkbox" name="allroomCheckOptions" id="allroomCheck" />
              <label className="form-check-label allocation-car__check-label" htmlFor="allroomCheck">Hide inactive vehicles</label>
            </div>
          </div>
          <Link href={"/business/book-transfer/discount-setting"}>
            <button type="button" className="btn btn-sm btn-outline-success allocation-car__btn">
              Discount setting
            </button>
          </Link>
        </div>
      </div> */}
      <div className="allocation-car__content-form allocation-car__content-form--top">
        <div className="allocation-car__content-location ">
          <div className="custom-dropdown">
            <div onClick={handleSortToggle} className="custom-dropdown-toggle custom-dropdown-toggle--reservation">
              <div style={{ whiteSpace: "nowrap" }}>All Location</div>
              <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
            </div>
            {showSortDropdown && (
              <div className="admin-customer__header-dropdown-menu" style={{ marginTop: 8, position: 'absolute', top: '100%', left: '0', zIndex: '1', backgroundColor: '#ffffff', padding: '0.5rem', border: '1px solid #C2C8ED', borderRadius: '12px' }}>
                <div className="custom-dropdown-menu__options">
                  <Link href="#" className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    Today
                  </Link>
                  <Link href="#" className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    This Week
                  </Link>
                  <Link href="#" className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    This Month
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="allocation-car__check form-check form-check-inline">
            <input className="form-check-input" type="checkbox" name="allroomCheckOptions" id="allroomCheck2" />
            <label className="form-check-label allocation-car__check-label" htmlFor="allroomCheck2">Hide inactive vehicles</label>
          </div>
        </div>

        {/* Calender */}
        <div className="allocation-car__calendar w-75">
          <div className="allocation-car__calendar-header">
            <button type='button' className="allocation-car__button-month" onClick={handlePreviousMonth}>
              <SVGIcon src={Icons.ArrowLeft} width={20} height={20} className="dropdown-toggle-arrow" color='#1CB78D' />
              <p className="allocation-car__date-button-caption">{months[newMonthBefore]}</p>
            </button>
            <p className="allocation-car__date-title">{months[month]} {year}</p>
            <button type='button' className="allocation-car__button-month" onClick={handleNextMonth}>
              <p className="allocation-car__date-button-caption">{months[newMonthAfter]}</p>
              <SVGIcon src={Icons.ArrowRight} width={20} height={20} className="dropdown-toggle-arrow" color='#1CB78D' />
            </button>
          </div>
          <div id="list-container" className="scroll-container overflow-auto allocation-car__list-group"
          >
            {/* This is still dummy data, change to dynamic when ready to fetch data*/}
            {Array.from({ length: daysInMonth }, (_, index) => {
              const dayOfMonth = index + 1;
              const dayIndex = (index + new Date(year, month, 1).getDay()) % 7;
              // console.log(dayIndex)
              // console.log(length)
              return (
                <li key={index} className="allocation-car__list-wrapper">
                  <ul id="list" className="scrollable-content allocation-car__list-group list-group list-group-horizontal position-relative">
                    <li className="allocation-car__list-wrapper">
                      <p className="allocation-car__list-caption">{days[dayIndex]}</p>
                      <div className={`allocation-car__list-date${isBooked ? ' booked' : ''}`}>
                        <p>{dayOfMonth}</p>
                      </div>
                    </li>
                  </ul>
                </li>
              );
            })}
          </div>
        </div>
        {/* End Calender */}

      </div>
      <div className="allocation-car__content-form allocation-car__content-form--car">

        {/* Show List Allocation */}
        {carAllocationData?.map((item, index) => (

          <div key={index} className="allocation-car__car-list">
            <div className="allocation-car__car-list-wrapper col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <BlurPlaceholderImage className='allocation-car__image-car' alt='image' src={carImage} width={56} height={56} />
              <div className="allocation-car__content-wrapper">
                <p className="allocation-car__car-caption-title">{item?.car_brand} {item?.model} {item?.edition}</p>
                <a data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" >
                  <button type='button' className='allocation-car__button-edit car-dashboard__content-button car-dashboard__content-button--green' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight"
                    onClick={() => { setCarAllocationFleetID(item?.id_car_business_fleet); }}
                  >
                    Edit
                  </button>
                </a>
              </div>
            </div>
            <div id="list-container" className="scroll-container allocation-car__list-group w-75"
            >
              <ul id="list" className="scrollable-content allocation-car__list-group list-group list-group-horizontal position-relative">

                {item?.allocation.map((item, index) => (
                  <li key={index} className="allocation-car__list-content">
                    <p className="allocation-car__list-content-caption">{item?.total_car ? item?.total_car : 0}</p>
                  </li>
                ))}

              </ul>
            </div>
          </div>
        ))}

        {/* End Show List Allocation */}

      </div>

      <SidebarOffcanvas carAllocationFleetID={carAllocationFleetID} formattedDate={formattedDate} fetchCarAllocation={fetchCarAllocation} />
    </div>
  )

}

const SidebarOffcanvas = ({ carAllocationFleetID, formattedDate, fetchCarAllocation }) => {

  const [carAllocationFleetDetail, setCarAllocationFleetDetail] = useState(null);
  const [formData, setFormData] = useState({
    "id_car_business_fleet": null,
    "total_car": null,
    "status_available": null,
    "start_date": null,
    "end_date": null,
    "price": null,
    "soft_delete": 0
  });

  const fetchCarAllocationFleet = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/car-business-allocation/show-for-edit', 'POST', { id_car_business_fleet: carAllocationFleetID, date: formattedDate }, true);
      setCarAllocationFleetDetail(data);
      setFormData({
        ...formData,
        id_car_business_fleet: carAllocationFleetID,
        total_car: data?.allocation_edit?.total_car,
        status_available: data?.allocation_edit?.status_available,
        start_date: data?.allocation_edit?.start_date,
        end_date: data?.allocation_edit?.end_date,
        price: data?.allocation_edit?.price,
        soft_delete: 0
      })
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!carAllocationFleetID) return
    // Check if carAllocationData already available
    fetchCarAllocationFleet();
  }, [carAllocationFleetID]);


  const handleStartDateChange = (date) => {
    const formattedDate = formatDate(date);
    setFormData((prevData) => ({ ...prevData, start_date: formattedDate }));
  };

  const handleEndDateChange = (date) => {
    const formattedDate = formatDate(date);
    setFormData((prevData) => ({ ...prevData, end_date: formattedDate }));
  };

  const handleTotalCarChange = (event) => {
    setFormData((prevData) => ({ ...prevData, total_car: event.target.value }));
  };

  const handlePriceChange = (event) => {
    setFormData((prevData) => ({ ...prevData, price: event.target.value }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSaveChanges = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    try {
      console.log("formData : ", formData);
      const { status, data, ok, error } = await callAPI('/car-business-allocation/store', 'POST', formData, true);
      console.log(status, data, ok, error);
      if (ok) {
        console.log("Success API handle submit admin partner car allocation store ", status, data, ok, error);
        // Call onActionForm to refetch carFleetData data and scroll to the top
        fetchCarAllocation();
      } else {
        console.log("Fail to handle submit post API admin partner car allocation store   ", status, data, ok, error);
      }
      // Reset formData
      setFormData({
        "id_car_business_fleet": null,
        "total_car": null,
        "status_available": null,
        "start_date": null,
        "end_date": null,
        "price": null,
        "soft_delete": 0
      });
    } catch (error) {
      console.error("Error while saving changes:", error);
    }
  };

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [showEndDateDropdown, setShowEndDateDropdown] = useState<boolean>(false)


  // Handle date, month change
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortenedMoths = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDay();
  const date = currentDate.getDate();
  const formatedDay = days[day] + ', ' + shortenedMoths[month] + ' ' + date;

  return (
    <>
      {/* <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Toggle right offcanvas</button> */}

      <div className="allocation-car__offcanvas offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
        <div className="allocation-car__offcanvas offcanvas-header">
          <h4 id="offcanvasRightLabel">Amend your allocation</h4>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="allocation-car__offcanvas offcanvas-body">
          <div className="allocation-car__sidebar-content">
            <div className="allocation-car__sidebar-car">
              <div className="allocation-car__car-info">
                <BlurPlaceholderImage className='allocation-car__image-car' alt='image' src={carImage} width={56} height={56} />
                <p className="allocation-car__sidebar-car-title">{carAllocationFleetDetail?.car_brand} {carAllocationFleetDetail?.model} {carAllocationFleetDetail?.edition}</p>
              </div>
              <button className='allocation-car__close-button'><SVGIcon src={Icons.Trash} width={24} height={24} color='#CA3232' /></button>
            </div>
            <div className="allocation-car__sidebar-dropdown">
              <div className="allocation-car__content-label">
                <p className="allocation-car__caption--semibold">Start date</p>
                <div className="custom-dropdown">
                  <div onClick={() => setShowDateDropdown(true)} className="custom-dropdown-toggle custom-dropdown-toggle--reservation">
                    <div style={{ whiteSpace: 'nowrap' }}>{formData?.start_date ? moment(formData?.start_date).format('ddd, MMM DD') : formatedDay}</div>
                    <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                  </div>
                  <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 16, overflow: 'hidden' }}>
                    <Calendar
                      months={1}
                      direction="horizontal"
                      date={new Date(formData?.start_date)}
                      onChange={handleStartDateChange}
                    />
                  </DropdownMenu>
                </div>
              </div>
              <div className="allocation-car__content-label">
                <p className="allocation-car__caption--semibold">End date</p>
                <div className="custom-dropdown">
                  <div onClick={() => setShowEndDateDropdown(true)} className="custom-dropdown-toggle custom-dropdown-toggle--reservation">
                    <div style={{ whiteSpace: 'nowrap' }}>{formData?.end_date ? moment(formData?.end_date).format('ddd, MMM DD') : formatedDay}</div>
                    <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                  </div>
                  <DropdownMenu show={showEndDateDropdown} setShow={setShowEndDateDropdown} style={{ marginTop: 16, marginRight: 64, overflow: 'hidden' }}>
                    <Calendar
                      months={1}
                      direction="horizontal"
                      date={new Date(formData?.end_date)}
                      onChange={handleEndDateChange}
                    />
                  </DropdownMenu>
                </div>

              </div>
            </div>
            <div className="allocation-car__sidebar-radio">
              <p className="allocation-car__sidebar-caption">Set allocation</p>
              <input
                type="number"
                placeholder='0'
                className="form-control goform-input"
                aria-describedby="totalCarHelp"
                id="total_car"
                value={formData?.total_car || ''} onChange={handleTotalCarChange}
              />
            </div>
            <div className="allocation-car__sidebar-radio">
              <p className="allocation-car__sidebar-caption">Set Pricing</p>
              <div className='goform-group allocation-car__sidebar-input'>
                <div className="input-group goform-dropdown-phone">
                  <div className="goform-dollar" aria-expanded="false">$</div>
                  <input type="text" placeholder='00.00' className="form-control" aria-label="OnlinePricePerDay"
                    value={formData?.price || ''} onChange={handlePriceChange}
                  />
                </div>
              </div>

            </div>
            <div className='allocation-car__sidebar-button'>
              <button type='button' className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'
                data-bs-dismiss="offcanvas" aria-label="Close"
                onClick={handleSaveChanges}
              >Update</button>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
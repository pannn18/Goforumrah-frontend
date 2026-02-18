import React, { useState, useEffect } from "react"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import carImagery1 from '@/assets/images/car_details_image_2.png'
import DropdownMenu from "@/components/elements/dropdownMenu"
import { DateRange, Calendar, Range } from 'react-date-range';
import moment from 'moment';
import { current } from '@reduxjs/toolkit';
import { useRouter } from "next/router"
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from "@/components/loadingOverlay"


export default function PartnerCarAllocation() {
  const router = useRouter()
  const { id: id_car_business } = router.query;

  //Retrive Data from API
  const [carAllocationData, setCarAllocationData] = useState(null);
  const [carAllocationLoading, setCarAllocationLoading] = useState(true);
  const [carAllocationError, setCarAllocationError] = useState(null);
  const [carAllocationFleetID, setCarAllocationFleetID] = useState(null);
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
  const [daysAndDates, setDaysAndDates] = useState(generateDaysAndDates(month));
  const [year, setYear] = useState(currentDate.getFullYear());
  const [formatedDay, setFormatedDay] = useState(days[currentDate.getDay()] + ', ' + shortenedMoths[currentDate.getMonth()] + ' ' + currentDate.getDate());
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
    setDaysAndDates(generateDaysAndDates(newMonthIndex));
    setMonth(newMonthIndex);
    setYear(newYear);

    // Update the formatedDay and formattedDate
    const newFormatedDay = days[new Date(newYear, newMonthIndex, 1).getDay()] + ', ' + shortenedMoths[newMonthIndex] + ' ' + newYear;
    const newFormattedDate = `${newYear}-${String(newMonthIndex + 1).padStart(2, '0')}-01`;
    setFormatedDay(newFormatedDay);
    setFormattedDate(newFormattedDate);
  };

  const handlePreviousMonth = () => {
    // Decrement the month
    const newMonth = month - 1;

    // Check if we need to decrement the year
    const newYear = newMonth < 0 ? year - 1 : year;

    // Calculate the new month index (0-11)
    const newMonthIndex = newMonth < 0 ? 11 : newMonth;

    // Update the state variables
    setDaysAndDates(generateDaysAndDates(newMonthIndex));
    setMonth(newMonthIndex);
    setYear(newYear);

    // Update the formatedDay and formattedDate
    const newFormatedDay = days[new Date(newYear, newMonthIndex, 1).getDay()] + ', ' + shortenedMoths[newMonthIndex] + ' ' + newYear;
    const newFormattedDate = `${newYear}-${String(newMonthIndex + 1).padStart(2, '0')}-01`;
    setFormatedDay(newFormatedDay);
    setFormattedDate(newFormattedDate);
  };

  function generateDaysAndDates(month) {
    const daysInMonth = new Date(new Date().getFullYear(), month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, day) => {
      const date = new Date(new Date().getFullYear(), month, day + 1);
      return { day: day + 1, date };
    });
  }
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [showEndDateDropdown, setShowEndDateDropdown] = useState<boolean>(false)

  const [departureOnly, setDepartureOnly] = useState<Date>(null)
  const [departureEndOnly, setDepartureEndOnly] = useState<Date>(null)

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showDateStartDropdown, setShowDateStartDropdown] = useState(false);
  const [showDateEndDropdown, setShowDateEndDropdown] = useState(false);

  const handleFilterToggle = () => {
    setShowFilterDropdown(!showFilterDropdown);
    setShowSortDropdown(false); // Menutup dropdown sort saat dropdown filter diklik
    setShowDateStartDropdown(false); // Menutup dropdown sort saat dropdown filter diklik
    setShowDateEndDropdown(false); // Menutup dropdown sort saat dropdown filter diklik
  };

  const handleSortToggle = () => {
    setShowSortDropdown(!showSortDropdown);
    setShowFilterDropdown(false); // Menutup dropdown filter saat dropdown sort diklik
    setShowDateStartDropdown(false); // Menutup dropdown filter saat dropdown sort diklik
    setShowDateEndDropdown(false); // Menutup dropdown filter saat dropdown sort diklik
  };

  const handleStartToggle = () => {
    setShowDateStartDropdown(!showDateStartDropdown);
    setShowFilterDropdown(false); // Menutup dropdown filter saat dropdown sort diklik
    setShowSortDropdown(false);
    setShowDateEndDropdown(false);
  };

  const handleEndToggle = () => {
    setShowDateEndDropdown(!showDateEndDropdown);
    setShowFilterDropdown(false); // Menutup dropdown filter saat dropdown sort diklik
    setShowSortDropdown(false); // Menutup dropdown filter saat dropdown sort diklik
    setShowDateStartDropdown(false); // Menutup dropdown filter saat dropdown sort diklik
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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

  useEffect(() => {
    if (!id_car_business) return
    // Check if carAllocationData already available
    fetchCarAllocation();
  }, [id_car_business, formattedDate]);

  useEffect(() => {
    if (!carAllocationFleetID) return
    // Check if carAllocationData already available
    fetchCarAllocationFleet();
  }, [carAllocationFleetID]);

  if (carAllocationLoading) {
    return <LoadingOverlay />;
  }

  if (carAllocationError) {
    return <div>Error Fetching Data</div>;
  }

  console.log("carAllocationData : ", carAllocationData)
  console.log("formData : ", formData)
  return (
    <Layout>
      <AdminLayout pageTitle="Allocation" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <div className="admin-partner__car-edit">
              <div className="admin-partner__allocation admin-partner__allocation-option">
                <div className="admin-partner__allocation-option__left">
                  <div className="admin-partner__allocation-option__left-select">
                    <label htmlFor="allocationLocation">Select location:</label>
                    <select name="allocationLocation" id="allocationLocation">
                      <option value="all">All Location</option>
                      <option value="region1">Region 1</option>
                      <option value="region2">Region 2</option>
                    </select>
                  </div>
                  <div className="admin-partner__allocation-option__left-checkbox form-check">
                    <input type="checkbox" name="hideInactiveVehicle" id="hideInactiveVehicle" className="form-check-input" defaultChecked />
                    <label htmlFor="hideInactiveVehicle">Hide inactive vehicles</label>
                  </div>
                </div>
                <div className="admin-partner__allocation-option__calendar">
                  <div className="admin-partner__allocation-option__calendar-navigation">
                    <button className="admin-partner__allocation-option__calendar-button" onClick={handlePreviousMonth}>
                      <SVGIcon src={Icons.ArrowLeft} className="admin-partner__detail-header-back--icon" width={20} height={20} />
                      {months[newMonthBefore]}
                    </button>
                    <p className="admin-partner__allocation-option__calendar-title">{months[month]} {year}</p>
                    <button className="admin-partner__allocation-option__calendar-button" onClick={handleNextMonth}>
                      {months[newMonthAfter]}
                      <SVGIcon src={Icons.ArrowRight} className="admin-partner__detail-header-back--icon" width={20} height={20} />
                    </button>
                  </div>
                  <div className="admin-partner__allocation-option__scroll">
                    <div className="admin-partner__allocation-option__list">
                      {daysAndDates.map((item, index) => (
                        <div className="admin-partner__allocation-option__list-item" key={index}>
                          <p className="admin-partner__allocation-option__list-item--label">{item.day}</p>
                          <p className="admin-partner__allocation-option__list-item--date">{item.date.getDate()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-partner__allocation admin-partner__allocation-list">
                {carAllocationData?.map((item, index) => (
                  <div key={index} className="admin-partner__allocation-list__car">
                    <div className="admin-partner__allocation-list__car-info">
                      <BlurPlaceholderImage src={carImagery1} className="admin-partner__allocation-list__car-image" alt="Trending City" width={56} height={56} />
                      <div className="admin-partner__allocation-list__car-detail">
                        <p className="admin-partner__allocation-list__car-merk">{item?.car_brand} {item?.model} {item?.edition}</p>
                        <div>
                          <button type='button' className='allocation-car__button-edit car-dashboard__content-button car-dashboard__content-button--green' data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight" onClick={() => { setCarAllocationFleetID(item?.id_car_business_fleet); console.log("Clicked! Fleet ID:", item?.id_car_business_fleet); }}>
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="admin-partner__allocation-list__car-scroll">
                      <div className="admin-partner__allocation-list__car-operating">
                        {item?.allocation.map((item, index) => (
                          <p key={index} className="admin-partner__allocation-list__car-amount">{item?.total_car ? item?.total_car : 0}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                <Link href={`/admin/partner/car/${id_car_business}`} className="btn btn-lg btn-outline-success">Cancel</Link>
                <Link href={`/admin/partner/car/${id_car_business}`} className="btn btn-lg btn-success">Save</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Edit : Offcanvas */}
        <div className="allocation-car__offcanvas offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
          <div className="allocation-car__offcanvas offcanvas-header">
            <h4 id="offcanvasRightLabel">Amend your allocation</h4>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="allocation-car__offcanvas offcanvas-body">
            <div className="allocation-car__sidebar-content">
              <div className="allocation-car__sidebar-car">
                <div className="allocation-car__car-info">
                  <BlurPlaceholderImage className='allocation-car__image-car' alt='image' src={carImagery1} width={56} height={56} />
                  <p className="allocation-car__sidebar-car-title">{carAllocationFleetDetail?.car_brand} {carAllocationFleetDetail?.model} {carAllocationFleetDetail?.edition}</p>
                </div>
                {/* <button className='allocation-car__close-button'><SVGIcon src={Icons.Trash} width={24} height={24} color='#CA3232' /></button> */}
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
                      <Calendar months={1} direction="horizontal" date={new Date(formData?.start_date)} onChange={handleStartDateChange} />
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
                      <Calendar months={1} direction="horizontal" date={new Date(formData?.end_date)} onChange={handleEndDateChange} />
                    </DropdownMenu>
                  </div>
                  {/* <div className="custom-dropdown">
                    <div onClick={handleEndToggle} className="custom-dropdown-toggle custom-dropdown-toggle--reservation">
                      <div style={{ whiteSpace: "nowrap" }}>20 Nov 2022</div>
                      <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                    </div>
                    
                    {showDateEndDropdown && (
                      <div className="admin-customer__header-dropdown-menu" style={{ marginTop: 8, position: 'absolute', top: '100%', left: '0', zIndex: '1', backgroundColor: '#ffffff', padding: '0.5rem', border: '1px solid #C2C8ED', borderRadius: '12px' }}>
                        <div className="custom-dropdown-menu__options">
                          <Link href="#" className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                            24 Nov 2022
                          </Link>
                          <Link href="#" className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                            25 Nov 2022
                          </Link>
                          <Link href="#" className="admin-customer__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                            26 Nov 2022
                          </Link>
                        </div>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>
              <div className="allocation-car__sidebar-radio">
                <p className="allocation-car__sidebar-caption">Set allocation</p>
                <input type="number" placeholder='0' className="form-control goform-input" id="total_car" aria-describedby="totalCarHelp" value={formData?.total_car || ''} onChange={handleTotalCarChange} />

                {/* <div className="form-check hotel-registration__amenities-radio">
                  <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio1" defaultValue="new" />
                  <label className="form-check-label" htmlFor="acRadio1">New Allocation</label>
                </div>
                <div className='goform-group allocation-car__sidebar-input'>
                  <input type="text" placeholder='0' className="form-control goform-input" id="Name" aria-describedby="NameHelp" />
                </div>
                <div className="form-check hotel-registration__amenities-radio">
                  <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio2" defaultValue="inc" />
                  <label className="form-check-label" htmlFor="acRadio2">Increase allocation</label>
                </div>
                <div className="form-check hotel-registration__amenities-radio">
                  <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio3" defaultValue="dec" />
                  <label className="form-check-label" htmlFor="acRadio3">Decrease Allocation</label>
                </div> */}
              </div>
              <div className="allocation-car__sidebar-radio">
                <p className="allocation-car__sidebar-caption">Set Pricing</p>
                {/* <div className="form-check hotel-registration__amenities-radio">
                  <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio4" defaultValue="new" />
                  <label className="form-check-label" htmlFor="acRadio4">New Price</label>
                </div> */}
                <div className='goform-group allocation-car__sidebar-input'>
                  <div className="input-group goform-dropdown-phone">
                    <div className="goform-dollar" aria-expanded="false">$</div>
                    <input type="text" placeholder='00.00' className="form-control" aria-label="price" value={formData?.price || ''} onChange={handlePriceChange} />
                  </div>
                </div>
                {/* <div className="form-check hotel-registration__amenities-radio">
                  <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio5" defaultValue="inc" />
                  <label className="form-check-label" htmlFor="acRadio5">Increase allocation</label>
                </div>
                <div className="form-check hotel-registration__amenities-radio">
                  <input className="form-check-input" type="radio" name="acRadioOptions" id="acRadio6" defaultValue="dec" />
                  <label className="form-check-label" htmlFor="acRadio6">Decrease Allocation</label>
                </div> */}
              </div>
              <div className='allocation-car__sidebar-button'>
                <button type='button' className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form' data-bs-dismiss="offcanvas" aria-label="Close" onClick={handleSaveChanges}>Update</button>
              </div>
            </div>
          </div>
        </div>
        {/* End Sidebar Edit */}

      </AdminLayout>
    </Layout>
  )
}

const SidebarOffcanvas = () => {
  return (
    <>
      {/* <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Toggle right offcanvas</button> */}

    </>

  )
}
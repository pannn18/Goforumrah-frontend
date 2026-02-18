import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { StaticImageData } from "next/image"
import useFetch from "@/hooks/useFetch"
import { Images } from "@/types/enums"
import { format } from 'date-fns';
import moment from "moment"
import { callAPI } from "@/lib/axiosHelper"
import React, { useRef } from "react";
import axios from 'axios';
import { number } from "yup"
import LoadingOverlay from "@/components/loadingOverlay"



export default function PartnerHotel() {

  // Proggres Bar 

  const [showExportDropdown, setShowExportDropdown] = useState<boolean>(false)
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);
  const [proggresBar, setProggresBar] = useState<number>(0);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const handleFile = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    const formdata = new FormData();
    formdata.append('file', selectedFile);

    axios.post('/admin/partner/hotel', formdata, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: event => {
        // console.log(event.loaded)
        // console.log(event.total)
        const progress = (event.loaded / event.total) * 100;
        setProggresBar(Math.floor(progress))
      }
    }).then(res => console.log("SUCCESS!", res))
      .catch(err => console.log("ERROR!", err))
  }

  const handleExportShow = () => {
    setShowExportDropdown((prevCondition) => {
      return !prevCondition;
    });
  }

  // Proggres Bar


  const router = useRouter();
  // Retrive Data from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hotelStatus = ['Need Review', 'Active', 'Not Active', 'Declined'];

  //For Tabs
  const [tabs, setTabs] = useState({
    'All': [],
    'Need Review': [],
    'Active': [],
    'Not Active': [],
    'Declined': []
  });

  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  const [dataHotel, setDataHotel] = useState(null);
  const [filterPage, setfilterPage] = useState(4); // 1 = today, 2 = this week, 3 = this Month, 4 = this year
  const filterString = ['Today', 'This Week', 'This Month', 'This Year'];
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState({});
  const itemsPerPage = 10; // Number of items per page


  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, filterPage, search]); // Trigger the fetch when the currentPage changes

  const fetchData = async (page) => {
    const payloadAll = {
      status: null,
      filter: filterPage,
      search: search,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };
    const payloadNeedReview = {
      status: 0,
      filter: filterPage,
      search: search,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };
    const payloadActive = {
      status: 1,
      filter: filterPage,
      search: search,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };
    const payloadNotActive = {
      status: 2,
      filter: filterPage,
      search: search,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };
    const payloadDeclined = {
      status: 3,
      filter: filterPage,
      search: search,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };

    try {
      // Fetch data for all tabs using Promise.all
      const [dataAll, dataNeedReview, dataActive, dataNotActive, dataDeclined] = await Promise.all([
        callAPI(`/admin-hotel-business/hotel-partner?page=${page}`, 'POST', payloadAll, true),
        callAPI(`/admin-hotel-business/hotel-partner?page=${page}`, 'POST', payloadNeedReview, true),
        callAPI(`/admin-hotel-business/hotel-partner?page=${page}`, 'POST', payloadActive, true),
        callAPI(`/admin-hotel-business/hotel-partner?page=${page}`, 'POST', payloadNotActive, true),
        callAPI(`/admin-hotel-business/hotel-partner?page=${page}`, 'POST', payloadDeclined, true),
      ]);

      setDataHotel(dataAll.data);
      // Process data for each tab
      const updatedTabs = {
        'All': formatHotelData(dataAll.data.data),
        'Need Review': formatHotelData(dataNeedReview.data.data),
        'Active': formatHotelData(dataActive.data.data),
        'Not Active': formatHotelData(dataNotActive.data.data),
        'Declined': formatHotelData(dataDeclined.data.data),
      };

      const totalCount = dataAll.data.total;
      const totalPagesAll = Math.ceil(totalCount / itemsPerPage);
      const totalPagesNeedReview = Math.ceil(dataNeedReview.data.total / itemsPerPage);
      const totalPagesActive = Math.ceil(dataActive.data.total / itemsPerPage);
      const totalPagesNotActive = Math.ceil(dataNotActive.data.total / itemsPerPage);
      const totalPagesDecline = Math.ceil(dataDeclined.data.total / itemsPerPage);

      // Set total pages in the state for each tab
      setTotalPages({
        'All': totalPagesAll,
        "Need Review": totalPagesNeedReview,
        "Active": totalPagesActive,
        "Not Active": totalPagesNotActive,
        "Declined": totalPagesDecline
      });

      setTabs(updatedTabs);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      console.log(error);
    }
  };

  const formatHotelData = (hotelData) => {
    return hotelData.map((hotel, index) => ({
      number: (currentPage - 1) * itemsPerPage + index + 1,
      id: hotel.id_hotel,
      businessName: hotel.property_name,
      ownerName: `${hotel?.hotel_business?.firstname} ${hotel?.hotel_business?.lastname}`,
      location: `${hotel.city}, ${hotel.country}`,
      type: 'Hotel',
      status: hotel.status,
      lastActive: hotel.last_active,
      visible: true,
      linkURL: '/admin/partner/hotel'
    }));
  };


  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return {
      notFound: true,
    }
  }


  return (

    <Layout>
      <AdminLayout pageTitle="Hotel Partner">
        <div className="container">
          <div className="admin-partner">
            <PartnerSummary />
            <div className="admin-partner__wrapper">
              <div className="admin-partner__table-option">
                <label className="admin-partner__table-option-details" data-bs-toggle="modal" data-bs-target="#export-modal">
                  <SVGIcon src={Icons.File} width={20} height={20} className="" />
                  <p>Import</p>

                </label>
              </div>

              <div className="admin-partner__header">
                <div className="admin-partner__header-split">
                  <div className="admin-partner__header-tab-menu">
                    {Object.keys(tabs).map((tab, index) => (
                      <button
                        key={index}
                        className={`btn ${tab === selectedTab ? 'active' : ''}`}
                        onClick={() => setSelectedTab(tab)}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="admin-partner__header-separator"></div>
                  <div className="admin-partner__header-search">
                    <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                    <SVGIcon src={Icons.Search} width={20} height={20} />
                  </div>
                </div>
                <div className="custom-dropdown">
                  <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
                    <SVGIcon src={Icons.Filter} width={20} height={20} />
                    <div style={{ whiteSpace: "nowrap" }}>{filterString[filterPage - 1]}</div>
                    <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                  </div>
                  <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-partner__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                    <div className="custom-dropdown-menu__options">
                      <Link href="#" onClick={() => setfilterPage(1)} className="admin-partner__dropdown-menu-option custom-dropdown-menu__option">
                        Today
                      </Link>
                      <Link href="#" onClick={() => setfilterPage(2)} className="admin-partner__dropdown-menu-option custom-dropdown-menu__option">
                        This Week
                      </Link>
                      <Link href="#" onClick={() => setfilterPage(3)} className="admin-partner__dropdown-menu-option custom-dropdown-menu__option">
                        This Month
                      </Link>
                      <Link href="#" onClick={() => setfilterPage(4)} className="admin-partner__dropdown-menu-option custom-dropdown-menu__option">
                        This Year
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
              </div>
              <div className="admin-partner__content">
                <table className="admin-partner__table">
                  <thead>
                    <tr className="admin-partner__table-list">
                      <th>No.</th>
                      <th>Business Name</th>
                      <th>Owner Name</th>
                      <th>Location</th>
                      <th>Type</th>
                      <th className="admin-partner__table-list--center">Status</th>
                      <th>Last Active</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tabs[selectedTab].length > 0 ? (
                        tabs[selectedTab].map((hotel, index) => (
                          <PartnerList {...hotel} key={index} />
                        ))
                      ) : (
                        <tr className="admin-partner__table-list">
                          <td colSpan={8} className="text-center">
                            There is no data
                          </td>
                        </tr>
                      )
                    }

                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <nav aria-label="Page navigation example">
            <div className="search-transfer__pagination">
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
          </nav>
        </div>
        <ExportModal />
      </AdminLayout >
    </Layout >

  )
}

const ExportModal = () => {
  const modalRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const [proggresBar, setProggresBar] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setError('')
      setLoading(false)
      setProggresBar(0)
      setFile(selectedFile);
    }
  };

  // Modal event listener
  useEffect(() => {
    const modal = modalRef.current

    const onModalShow = () => {
      setError('')
      setLoading(false)
      setProggresBar(0)
      setFile(null)
      formRef.current && formRef.current.reset()
    }

    const onModalHidden = () => {
      setError('')
      setLoading(false)
      setProggresBar(0)
      setFile(null)
      formRef.current && formRef.current.reset()
    }

    modal.addEventListener('show.bs.modal', onModalShow)
    modal.addEventListener('hidden.bs.modal', onModalHidden)

    return () => {
      modal.removeEventListener('show.bs.modal', onModalShow)
      modal.removeEventListener('hidden.bs.modal', onModalHidden);
    }
  }, [modalRef])

  const onCancel = () => {
    setError('')
    setLoading(false)
    setProggresBar(0)
    setFile(null)
    formRef.current && formRef.current.reset()
  }

  const onSubmit = async () => {
    if (file) {
      setError('')
      setLoading(true)
      setProggresBar(0)

      const formdata = new FormData();
      formdata.append('file', file);

      const { status, data, ok, error } = await callAPI('/hotel/import', 'POST', formdata, true, '', 'multipart/form-data', { onUploadProgress: (e) => setProggresBar(Math.floor((e.loaded / e.total) * 100)) })

      setError(error)
      setLoading(false)
      setFile(null)
      formRef.current && formRef.current.reset()
    }
  }

  return (
    <div ref={modalRef} className="modal fade admin-partner__modal--export" id="export-modal" tabIndex={-1} aria-labelledby="exportModalLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal admin-partner__modal-block">
        <div className="modal-content admin-partner__add-modal-content">
          <div className="admin-partner__modal-block-wrapper">
            <form ref={formRef} className="admin-partner__modal-block-content">
              <div className="admin-partner__modal-block-image">
                {error ? (
                  <p>{error || 'Failed, Try Again'}</p>
                ) : (
                  <div>
                    {!!file ? (
                      <p>{file.name}</p>
                    ) : (
                      <SVGIcon src={Icons.File} width={48} height={48} color="#1cb78d" />
                    )}
                  </div>
                )}
              </div>
              <div className="admin-partner__modal-block-caption text-center">
                <h3>
                  {(loading) ? "Uploading your file..." : (proggresBar > 99 ? (!error ? "Upload Successfully" : "Upload Error") : "Upload your file here")}
                </h3>
              </div>
              <div className="admin-partner__modal-progress">
                <div className="progress" style={{ height: "16px", borderRadius: "16px", width: "100%" }}>
                  <div className="progress-bar progress-bar-stripped progress-bar-animated"
                    role="proggresbar" aria-label="proggresbar" aria-valuenow={proggresBar}
                    aria-valuemin={0} aria-valuemax={100} style={{ width: `${proggresBar}%`, backgroundColor: "#1cb78d" }}
                  >
                  </div>
                </div>
                <h6>{`${proggresBar}%`}</h6>
              </div>
              <label htmlFor="ImportData" className="admin-partner__upload-area" style={{ display: loading ? 'none' : 'flex' }}>
                <div className="admin-booking-hotel__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Upload} width={20} height={20} className="" />
                  <p className="text-black">
                    Browse File
                  </p>
                </div>
                <input type="file" id="ImportData" onChange={handleFile} hidden accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
              </label>
            </form>
            <div className="admin-partner__modal-edit-action">
              <div className="admin-partner__popup-button-bar">
                <button data-bs-dismiss="modal" onClick={onCancel} type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--outline-green">
                  Cancel
                </button>
                <button disabled={loading} onClick={onSubmit} type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--fill-green">
                  {loading ? 'Please wait...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

const PartnerSummary = () => {
  const [partnerData, setPartnerData] = useState(null);

  useEffect(() => {
    // Check if personalData or hotelData is already available
    if (partnerData) return;
    const fetchStatistic = async () => {
      const { status, data, ok, error } = await callAPI('/admin-hotel-business/hotel-partner-statistic', 'GET', null, true);
      setPartnerData(data);
    };

    fetchStatistic();
  }, []);

  return (
    <div className="admin-partner__summary">
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">Listed Partner</p>
          <SVGIcon src={Icons.Hotel} width={20} height={20} className="admin-partner__summary-header-icon" />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">{partnerData?.listed_partner}</p>
          <div className="admin-partner__summary-content-recap admin-partner__summary-content-recap--success">
            <p className="admin-partner__summary-content-recap--text">{partnerData?.listed_partner_percentage}%</p>
            <SVGIcon src={Icons.TrendUp} width={20} height={20} className="admin-partner__summary-header-icon" />
          </div>
        </div>
      </div>
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">New Partner</p>
          <SVGIcon src={Icons.UserPlus} width={20} height={20} className="admin-partner__summary-header-icon" />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">{partnerData?.new_partner}</p>
          <div className="admin-partner__summary-content-recap admin-partner__summary-content-recap--success">
            <p className="admin-partner__summary-content-recap--text">{partnerData?.new_partner_percentage}%</p>
            <SVGIcon src={Icons.TrendUp} width={20} height={20} className="admin-partner__summary-header-icon" />
          </div>
        </div>
      </div>
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">Active Partner</p>
          <SVGIcon src={Icons.UserFocus} width={20} height={20} className="admin-partner__summary-header-icon" />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">{partnerData?.active_partner}</p>
          <div className="admin-partner__summary-content-recap admin-partner__summary-content-recap--success">
            <p className="admin-partner__summary-content-recap--text">{partnerData?.active_partner_percentage}%</p>
            <SVGIcon src={Icons.TrendUp} width={20} height={20} className="admin-partner__summary-header-icon" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface PartnerListProps {
  number: number,
  id: string,
  businessName: string,
  ownerName: string,
  location: string,
  lastActive: string,
  type: string,
  status: number,
  visible: boolean,
  linkURL: string,
}
const PartnerList = (props: PartnerListProps) => {
  const { number, id, businessName, ownerName, location, type, status, visible, lastActive, linkURL } = props
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  return (
    <tr className="admin-partner__table-list" style={{ display: visible ? 'table-row' : 'none' }}>
      <td>{number}</td>
      <td>{businessName}</td>
      <td>{ownerName}</td>
      <td>
        <div className="admin-partner__table-list--icon">
          <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="" />
          {location}
        </div>
      </td>
      <td>{type}</td>
      <td>
        {(status === 0) && (
          <div className="admin-partner__table-status admin-partner__table-status--waiting">Need Review</div>
        )}
        {(status === 1) && (
          <div className="admin-partner__table-status admin-partner__table-status--paid">Active</div>
        )}
        {(status === 2) && (
          <div className="admin-partner__table-status admin-partner__table-status--ongoing">Not Active</div>
        )}
        {(status === 3) && (
          <div className="admin-partner__table-status admin-partner__table-status--canceled">Declined</div>
        )}
      </td>
      <td>
        <div className="admin-partner__table-list--icon">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} className="" />
          {lastActive}
        </div>
      </td>
      <td>
        <div className="custom-dropdown">
          <div onClick={() => setShowActionDropdown(true)} className="custom-dropdown-toggle admin-partner__table-dropdown">
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu show={showActionDropdown} setShow={setShowActionDropdown} className="admin-booking-hotel__header-dropdown-menu" style={{ marginTop: 8, marginLeft: -110, width: 155 }}>
            <div className="custom-dropdown-menu__options">
              <Link href={`/admin/partner/hotel/${id}`} className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-hotel__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Eye} width={20} height={20} className="" />
                  <p>See Details</p>
                </div>
              </Link>
              <div className="admin-customer__dropdown-separator"></div>
              <Link href="#" className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-hotel__dropdown-menu-option-delete">
                  <SVGIcon src={Icons.Trash} width={20} height={20} className="" />
                  <p>Delete</p>
                </div>
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}
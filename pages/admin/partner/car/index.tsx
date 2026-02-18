import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import { useEffect, useRef, useState } from "react";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { Icons } from "@/types/enums";
import Link from "next/link";
import axios from "axios";
import { callAPI } from "@/lib/axiosHelper";
import LoadingOverlay from "@/components/loadingOverlay";

export default function PartnerCar() {
  // const tabs = {
  //   "All": null,
  //   "Need Review": 0,
  //   "Verified": 1,
  //   "Active": 2,
  //   "Not Active": 3,
  // };

  const [tabs, setTabs] = useState({
    'All': [],
    "Need Review": [],
    "Verified": [],
    "Active": [],
    "Not Active": []
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
      filter: filter,
      search: search,
      soft_delete: null,
      sort: 'DESC',
      show_per_page: itemsPerPage
    };

    const payloadNeedReview = {
      status: 0,
      filter: filter,
      search: search,
      soft_delete: null,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    const payloadVerified = {
      status: 1,
      filter: filter,
      search: search,
      soft_delete: null,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    const payloadActive = {
      status: null,
      filter: filter,
      search: search,
      soft_delete: 0,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    const payloadNotActive = {
      status: null,
      filter: filter,
      search: search,
      soft_delete: 1,
      sort: 'DESC',
      show_per_page: itemsPerPage
    }

    try {
      // Fetch data for all tabs using Promise.all
      const [dataAll, dataNeedReview, dataVerified, dataActive, dataNotActive] = await Promise.all([
        callAPI(`/admin-car-business/car-partner?page=${page}`, 'POST', payloadAll, true),
        callAPI(`/admin-car-business/car-partner?page=${page}`, 'POST', payloadNeedReview, true),
        callAPI(`/admin-car-business/car-partner?page=${page}`, 'POST', payloadVerified, true),
        callAPI(`/admin-car-business/car-partner?page=${page}`, 'POST', payloadActive, true),
        callAPI(`/admin-car-business/car-partner?page=${page}`, 'POST', payloadNotActive, true)
      ]);

      const updatedTabs = {
        'All': formatCarData(dataAll.data.data),
        "Need Review": formatCarData(dataNeedReview.data.data),
        "Verified": formatCarData(dataVerified.data.data),
        "Active": formatCarData(dataActive.data.data),
        "Not Active": formatCarData(dataNotActive.data.data)
      }

      // Calculate total pages for each tab and set them in state
      const totalCount = dataAll.data.total;
      const totalPagesAll = Math.ceil(totalCount / itemsPerPage);
      const totalPagesNeedReview = Math.ceil(dataNeedReview.data.total / itemsPerPage);
      const totalPagesVerified = Math.ceil(dataVerified.data.total / itemsPerPage);
      const totalPagesActive = Math.ceil(dataActive.data.total / itemsPerPage);
      const totalPagesNotActive = Math.ceil(dataNotActive.data.total / itemsPerPage);

      // Set total pages in the state for each tab
      setTotalPages({
        'All': totalPagesAll,
        "Need Review": totalPagesNeedReview,
        "Verified": totalPagesVerified,
        "Active": totalPagesActive,
        "Not Active": totalPagesNotActive
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
      id_car_business: car.id_car_business,
      company_detail: car.company_detail,
      firstname: car.firstname,
      car_location: car.car_location,
      car_fleet: car.car_fleet,
      status: car.status,
      soft_delete: car.soft_delete,
      last_active: car.last_active,
    }));
  };



  // Progress Bar
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

    axios.post('/admin/partner/car', formdata, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: event => {
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
  // Progress Bar

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
          <div className="admin-partner">
            <PartnerSummary />
            <div className="admin-partner__wrapper">
              <div className="custom-dropdown">
                <div
                  onClick={handleExportShow}
                  className="custom-dropdown-toggle admin-partner__table-dropdown--hotel"
                >
                  <SVGIcon
                    src={Icons.More}
                    width={20}
                    height={20}
                    className=""
                  />
                </div>
                <DropdownMenu
                  show={showExportDropdown}
                  setShow={setShowExportDropdown}
                  className="admin-booking-hotel__header-dropdown-menu custom-dropdown-menu__partner-hotel"
                  style={{ marginTop: 5, marginLeft: -110, width: 155 }}
                >
                  <div className="custom-dropdown-menu__options">
                    <label
                      className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      data-bs-toggle="modal"
                      data-bs-target="#export-modal"
                    >
                      <div className="admin-booking-hotel__dropdown-menu-option-details">
                        <SVGIcon
                          src={Icons.File}
                          width={20}
                          height={20}
                          className=""
                        />
                        <p>Import</p>
                      </div>
                    </label>
                  </div>
                </DropdownMenu>
              </div>
              <div className="admin-partner__header">
                <div className="admin-partner__header-split">
                  <div className="admin-partner__header-tab-menu">
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
                  <div className="admin-partner__header-separator"></div>
                  <div className="admin-partner__header-search">
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
              <div className="admin-partner__content">
                <div className="table-responsive">
                  <table className="admin-partner__table w-100">
                    <thead>
                      <tr className="admin-partner__table-list">
                        <th>No</th>
                        <th>Business Name</th>
                        <th>Owner Name</th>
                        <th>Location</th>
                        <th>Fleet</th>
                        <th className="admin-partner__table-list--center">
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
                      {!loading &&
                        tabs[selectedTab].length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center">
                              Data not found
                            </td>
                          </tr>
                        )}
                      {!loading &&
                        tabs[selectedTab].length > 0 &&
                        tabs[selectedTab].map((car, index) => (
                          <PartnerList {...car} key={index} />
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
        </div>
        <ExportModal />
      </AdminLayout>
    </Layout>
  );
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

      const { status, data, ok, error } = await callAPI('/admin-car-business/import', 'POST', formdata, true, '', 'multipart/form-data', { onUploadProgress: (e) => setProggresBar(Math.floor((e.loaded / e.total) * 100)) })

      setError(error)
      setLoading(false)
      setFile(null)
      formRef.current && formRef.current.reset()
    }
  }

  return (
    <div
      ref={modalRef}
      className="modal fade admin-partner__modal--export"
      id="export-modal"
      tabIndex={-1}
      aria-labelledby="exportModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-partner__modal-block">
        <div className="modal-content admin-partner__add-modal-content">
          <div className="admin-partner__modal-block-wrapper">
            <div className="admin-partner__modal-block-content">
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
                <div
                  className="progress"
                  style={{
                    height: "16px",
                    borderRadius: "16px",
                    width: "100%",
                  }}
                >
                  <div
                    className="progress-bar progress-bar-stripped progress-bar-animated"
                    role="proggresbar"
                    aria-label="proggresbar"
                    aria-valuenow={proggresBar}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{
                      width: `${proggresBar}%`,
                      backgroundColor: "#1cb78d",
                    }}
                  ></div>
                </div>
                <h6>{`${proggresBar}%`}</h6>
              </div>
              <label
                htmlFor="ImportData"
                className="admin-partner__upload-area"
                style={{ display: loading ? 'none' : 'flex' }}
              >
                <div className="admin-booking-hotel__dropdown-menu-option-details">
                  <SVGIcon
                    src={Icons.Upload}
                    width={20}
                    height={20}
                    className=""
                  />
                  <p className="text-black">Browse File</p>
                </div>
                <input
                  type="file"
                  id="ImportData"
                  onChange={handleFile}
                  hidden
                />
              </label>
            </div>
            <div className="admin-partner__modal-edit-action">
              <div className="admin-partner__popup-button-bar">
                <button
                  data-bs-dismiss="modal"
                  type="button"
                  className="admin-partner__room-btn--popup btn btn-md goform-button--outline-green"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  onClick={onSubmit}
                  // data-bs-dismiss="modal"
                  type="button"
                  className="admin-partner__room-btn--popup btn btn-md goform-button--fill-green"
                >
                  {loading ? 'Please wait...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnerSummary = () => {
  const [dataSummary, setDataSummary] = useState(null);

  useEffect(() => {
    const getDataSummary = async () => {
      const { data, error, ok } = await callAPI(
        "/admin-car-business/car-partner-statistic",
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

    if (!dataSummary) {
      getDataSummary();
    }
  }, [dataSummary]);

  return (
    <div className="admin-partner__summary">
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">Listed Partner</p>
          <SVGIcon
            src={Icons.Car}
            width={20}
            height={20}
            className="admin-partner__summary-header-icon"
          />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">
            {dataSummary ? dataSummary.listed_partner : "0"}
          </p>
          <div
            className={`admin-partner__summary-content-recap admin-partner__summary-content-recap${dataSummary?.listed_partner_percentage >= 0
              ? "--success"
              : "--unsuccessfull"
              }`}
          >
            <p className="admin-partner__summary-content-recap--text">
              {dataSummary ? `${dataSummary.listed_partner_percentage}%` : "0%"}
            </p>
            <SVGIcon
              src={
                dataSummary?.listed_partner_percentage >= 0
                  ? Icons.TrendUp
                  : Icons.TrendDown
              }
              width={20}
              height={20}
              className={`${dataSummary?.listed_partner_percentage >= 0
                ? "admin-booking-car__summary-header-icon"
                : "summary-header-icon--unsuccessfull"
                }`}
            />
          </div>
        </div>
      </div>
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">New Partner</p>
          <SVGIcon
            src={Icons.UserPlus}
            width={20}
            height={20}
            className="admin-partner__summary-header-icon"
          />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">
            {dataSummary ? dataSummary.new_partner : "0"}
          </p>
          <div
            className={`admin-partner__summary-content-recap admin-partner__summary-content-recap${dataSummary?.new_partner_percentage >= 0
              ? "--success"
              : "--unsuccessfull"
              }`}
          >
            <p className="admin-partner__summary-content-recap--text">
              {dataSummary ? `${dataSummary.new_partner_percentage}%` : "0%"}
            </p>
            <SVGIcon
              src={
                dataSummary?.new_partner_percentage >= 0
                  ? Icons.TrendUp
                  : Icons.TrendDown
              }
              width={20}
              height={20}
              className={`${dataSummary?.new_partner_percentage >= 0
                ? "admin-booking-car__summary-header-icon"
                : "summary-header-icon--unsuccessfull"
                }`}
            />
          </div>
        </div>
      </div>
      <div className="admin-partner__summary-box">
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-header-text">Active Partner</p>
          <SVGIcon
            src={Icons.UserFocus}
            width={20}
            height={20}
            className="admin-partner__summary-header-icon"
          />
        </div>
        <div className="admin-partner__summary-row">
          <p className="admin-partner__summary-content-value">
            {dataSummary ? dataSummary.active_partner : "0"}
          </p>
          <div
            className={`admin-partner__summary-content-recap admin-partner__summary-content-recap${dataSummary?.active_partner_percentage >= 0
              ? "--success"
              : "--unsuccessfull"
              }`}
          >
            <p className="admin-partner__summary-content-recap--text">
              {dataSummary ? `${dataSummary.active_partner_percentage}%` : "0%"}
            </p>
            <SVGIcon
              src={
                dataSummary?.active_partner_percentage >= 0
                  ? Icons.TrendUp
                  : Icons.TrendDown
              }
              width={20}
              height={20}
              className={`${dataSummary?.active_partner_percentage >= 0
                ? "admin-booking-car__summary-header-icon"
                : "summary-header-icon--unsuccessfull"
                }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PartnerListProps {
  number: number;
  id_car_business: number;
  company_detail: any;
  firstname: string;
  car_location: any;
  car_fleet: any;
  last_active: string;
  status: number;
  soft_delete: number;
  linkURL: string;
}
const PartnerList = (props: PartnerListProps) => {
  const {
    number,
    id_car_business,
    company_detail,
    firstname,
    car_location,
    car_fleet,
    status,
    soft_delete,
    last_active,
  } = props;
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);

  const businessName = company_detail?.company_name;
  const location = car_location?.region;
  const fleet = car_fleet?.length;
  return (
    <tr className="admin-partner__table-list">
      <td>{number}</td>
      <td>{businessName}</td>
      <td>{firstname}</td>
      <td>
        <div className="admin-partner__table-list--icon">
          <SVGIcon
            src={Icons.MapPinOutline}
            width={20}
            height={20}
            className=""
          />
          {location}
        </div>
      </td>
      <td>{fleet}</td>
      <td>
        {status === 0 && (
          <div className="my-1 admin-partner__table-status admin-partner__table-status--waiting">
            Need Review
          </div>
        )}
        {status === 1 && (
          <div className="my-1 admin-partner__table-status admin-partner__table-status--ongoing">
            Verified
          </div>
        )}
        {soft_delete === 0 && (
          <div className="my-1 admin-partner__table-status admin-partner__table-status--paid">
            Active
          </div>
        )}
        {soft_delete === 1 && (
          <div className="my-1 admin-partner__table-status admin-partner__table-status--canceled">
            Not Active
          </div>
        )}
      </td>
      <td>
        <div className="admin-partner__table-list--icon">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} className="" />
          {last_active}
        </div>
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
            style={{ marginTop: 8, marginLeft: -110, width: 155 }}
          >
            <div className="custom-dropdown-menu__options">
              <Link
                href={`/admin/partner/car/${id_car_business}`}
                className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                <div className="admin-partner__dropdown-menu-option-details">
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
                className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
              >
                <div className="admin-partner__dropdown-menu-option-delete">
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

import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useRef, useState } from "react";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { Icons } from "@/types/enums";
import Link from "next/link";
import airlines from '@/lib/db/airlines.json'
import axios from "axios";
import { callAPI } from "@/lib/axiosHelper";
import LoadingOverlay from "@/components/loadingOverlay";

interface Airline {
  code: string;
  name: string;
  image: string;
}

export default function PartnerFlight() {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 10; // Jumlah item per halaman
  const [endIndex, setEndIndex] = useState(startIndex + itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCounts, setPageCount] = useState(0)

  const [dataShow, setDataShow] = useState<Airline[]>([]);
  const [search, setSearch] = useState('')

  const allData: Airline[] = Array.isArray(airlines) ? airlines : [];


  useEffect(() => {
    setStartIndex(0)
    setEndIndex(10)
    setCurrentPage(1)
  }, [search])

  useEffect(() => {
    const filterData = allData.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) || item.code.toLowerCase().includes(search.toLowerCase())
    )

    setDataShow(filterData.slice(startIndex, endIndex));
    setPageCount(Math.ceil(filterData.length / itemsPerPage))
  }, [search, startIndex, endIndex]);




  return (
    <Layout>
      <AdminLayout>
        <div className="container">
          <div className="admin-partner">
            {/* <PartnerSummary /> */}
            <div className="admin-partner__wrapper">
              {/* <div className="custom-dropdown">
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
              </div> */}
              <div className="admin-partner__header">
                <div className="admin-partner__header-split">
                  {/* Tabs here */}
                  {/* <div className="admin-partner__header-tab-menu">
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
                  <div className="admin-partner__header-separator"></div> */}
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
                {/* Filter */}
                {/* <div className="custom-dropdown">
                  <div
                    onClick={() => setShowFilterDropdown(true)}
                    className="custom-dropdown-toggle"
                  >
                    <SVGIcon src={Icons.Filter} width={20} height={20} />
                    <div style={{ whiteSpace: "nowrap" }}>Filter</div>
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
                        // onClick={() => handleFilter(1)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        Today
                      </Link>
                      <Link
                        href={"#"}
                        // onClick={() => handleFilter(2)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Week
                      </Link>
                      <Link
                        href={"#"}
                        // onClick={() => handleFilter(3)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Month
                      </Link>
                      <Link
                        href={"#"}
                        // onClick={() => handleFilter(4)}
                        className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                      >
                        This Year
                      </Link>
                    </div>
                  </DropdownMenu>
                </div> */}
              </div>
              <div className="admin-partner__content">
                <div className="table-responsive">
                  <table className="admin-partner__table w-100">
                    <thead>
                      <tr className="admin-partner__table-list">
                        <th>No</th>
                        <th>Image</th>
                        <th>Code</th>
                        <th>Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        !dataShow.length ? (
                          <tr>
                            <td colSpan={4}>
                              <div className="text-center">Sorry, there aren't any airlines that match your filter.</div>
                            </td>
                          </tr>
                        ) : (
                          dataShow.map((item, index) => (
                            <PartnerList {...item} no={(currentPage - 1) * itemsPerPage + index + 1} key={index} />
                          ))
                        )
                      }
                      {/* {loading && (
                        <tr>
                          <td>
                            <LoadingOverlay />
                          </td>
                        </tr>
                      )} */}
                      {/* {!loading &&
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
                          <PartnerList {...car} no={index + 1} key={index} />
                        ))} */}
                    </tbody>
                  </table>
                </div>
                <div className="admin-booking-car__pagination">

                  <div className="pagination">
                    <button type="button"
                      onClick={() => { currentPage > 1 && setCurrentPage(currentPage - 1), setStartIndex(startIndex - itemsPerPage), setEndIndex(endIndex - itemsPerPage) }}
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
                        <button key={number}
                          onClick={() => {
                            !(hasMoreOnLeft || hasMoreOnRight) && setCurrentPage(number)
                            setStartIndex(number * itemsPerPage - itemsPerPage)
                            setEndIndex(number * itemsPerPage)
                          }}
                          type="button" className={`pagination__button ${number === currentPage ? 'active' : ''}`} style={{ cursor: hasMoreOnLeft || hasMoreOnRight ? 'default' : 'pointer' }}>{(hasMoreOnLeft || hasMoreOnRight) ? '...' : number}</button>
                      )
                    })}
                    <button type="button" onClick={() => { currentPage < pageCounts && setCurrentPage(currentPage + 1), setStartIndex(startIndex + itemsPerPage), setEndIndex(endIndex + itemsPerPage) }} className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(-90deg)', cursor: currentPage === pageCounts ? 'default' : 'pointer' }}>
                      <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Layout >
  )
}

interface PartnerListProps {
  no: number;
  code: string;
  image: string;
  name: string;
}
const PartnerList = (props: PartnerListProps) => {
  const { no, code, name, image } = props;

  return (
    <tr className="admin-partner__table-list">
      <td>{no}</td>
      <td><img src={image} alt="image" width={20} height={20} /></td>
      <td>{code}</td>
      <td>{name}</td>

    </tr>
  );
};
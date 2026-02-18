import Layout from "@/components/layout"
import AgentNavbar from "@/components/layout/agentNavbar"
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { useRouter } from "next/router"


export default function PartnerHotel() {
  const tabs = {
    'All': [
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
    ],
    'Upcoming': [
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '0', padiOn: '20/02/23', linkURL: 'details?status=' },
    ],
    'Active': [
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '1', padiOn: '20/02/23', linkURL: 'details?status=' },
    ],
    'Completed': [
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '2', padiOn: '20/02/23', linkURL: 'details?status=' },
    ],
    'Unpaid': [
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '3', padiOn: '20/02/23', linkURL: 'details?status=' },
    ],
    'Cancelled': [
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
      { id: '1122334455', name: 'Eleanor Pena', hotel: 'Sheraton Makkah Jabal Al Kaaba Hotel', price: '100.00', checkin: '25 Oct 2023', checkout: '27 Oct 2023', status: '4', padiOn: '20/02/23', linkURL: 'details?status=' },
    ],
  }
  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false)

  const menus = {
    'hotel': '',
    'flight': '',
    'car': '',
    'tour': '',
  }
  const [selectedMenu, setSelectedMenu] = useState<string>(Object.keys(menus)[0])

  return (
    <Layout>
      <AgentNavbar />
      <div className="agent-report__header">
        <div className="container">
          <div className="agent-report__header-wrapper">
            <h3 className="agent-report__header-title">Report</h3>
            <div className="agent-report__header-split">
              <div className="agent-report__menu">
                <button
                  className={`btn ${'hotel' === selectedMenu ? 'active' : ''}`}
                  onClick={() => setSelectedMenu('hotel')}>
                  Hotel
                  <SVGIcon src={Icons.Hotel} width={20} height={20} className="" />
                </button>
                <button
                  className={`btn ${'flight' === selectedMenu ? 'active' : ''}`}
                  onClick={() => setSelectedMenu('flight')}>
                  Flight
                  <SVGIcon src={Icons.Flight} width={20} height={20} className="" />
                </button>
                <button
                  className={`btn ${'car' === selectedMenu ? 'active' : ''}`}
                  onClick={() => setSelectedMenu('car')}>
                  Book Transfer
                  <SVGIcon src={Icons.Car} width={20} height={20} className="" />
                </button>
                <button
                  className={`btn ${'tour' === selectedMenu ? 'active' : ''}`}
                  onClick={() => setSelectedMenu('tour')}>
                  Tour Package
                  <SVGIcon src={Icons.SunHorizon} width={20} height={20} className="" />
                </button>

              </div>
              <label htmlFor="export" className="btn btn-sm btn-success">
                Export
                <SVGIcon src={Icons.Upload} width={18} height={18} className="" />
              </label>
              <input type="file" id="export" hidden />
            </div>
            <div className="agent-report__menu tabs">
              {Object.keys(tabs).map((tab, index) => (
                <button
                  key={index}
                  className={`btn ${tab === selectedTab ? 'active' : ''}`}
                  onClick={() => setSelectedTab(tab)}>
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="agent-dashboard">
        <div className="container">
          <div className="agent-dashboard__wrapper">

            <div className="admin-partner__wrapper">
              <div className="admin-partner__header">
                <div className="admin-partner__header-split">
                  <div className="admin-header__search">
                    <input name="text" className="form-control" placeholder="Search" />
                    <SVGIcon src={Icons.Search} width={20} height={20} />
                  </div>
                  <div className="admin-partner__header-separator"></div>
                  <div className="custom-dropdown">
                    <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
                      <SVGIcon src={Icons.Filter} width={20} height={20} />
                      <div style={{ whiteSpace: "nowrap" }}>Filter</div>
                      <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                    </div>
                    <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-partner__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                      <div className="custom-dropdown-menu__options">
                        <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                          Today
                        </Link>
                        <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                          This Week
                        </Link>
                        <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                          This Month
                        </Link>
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="custom-dropdown">
                  <div onClick={() => setShowSortDropdown(true)} className="custom-dropdown-toggle">
                    <SVGIcon src={Icons.Filter} width={20} height={20} />
                    <div style={{ whiteSpace: "nowrap" }}>Sort</div>
                    <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                  </div>
                  <DropdownMenu show={showSortDropdown} setShow={setShowSortDropdown} className="admin-partner__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                    <div className="custom-dropdown-menu__options">
                      <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Status
                      </Link>
                      <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Price
                      </Link>
                      <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        checkin
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
              </div>
              <div className="admin-partner__content">
                <table className="agent-report__table">
                  <thead>
                    <tr className="agent-report__table-list">
                      <th>ID Booking</th>
                      <th>Guest Name</th>
                      <th>Hotel</th>
                      <th>Price</th>
                      <th>Check-in</th>
                      <th>Check-out</th>
                      <th className="agent-report__table-list--center">Status</th>
                      <th>Paid on</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabs[selectedTab].map((hotel, index) => (
                      <PartnerList {...hotel} key={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

const AgentHeader = () => {
  return (
    <div className="agent-report__header">
      <h3>Report</h3>
      <div className="agent-report__menu">

      </div>
    </div>
  )
}

interface PartnerListProps {
  id: string,
  name: string,
  hotel: string,
  price: string,
  checkin: string,
  checkout: string,
  status: string,
  padiOn: string,
  linkURL: string,
}
const PartnerList = (props: PartnerListProps) => {
  const { id, name, hotel, price, checkin, checkout, status, padiOn, linkURL } = props
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)
  const router = useRouter()
  const handleRowClick = (link) => {
    router.push(`/agent/report/${link}${status}`);
  }

  return (
    <tr className="agent-report__table-list" onClick={() => handleRowClick(linkURL)} >
      <td>{id}</td>
      <td>{name}</td>
      <td>{hotel}</td>
      <td>
        <div>
          $ {price}
        </div>
      </td>
      <td>
        <div>
          {checkin}
        </div>
      </td>
      <td>
        <div>
          {checkout}
        </div>
      </td>
      <td>
        {(status === '0') && (
          <div className="agent-report__table-status agent-report__table-status--upcoming">Upcoming</div>
        )}
        {(status === '1') && (
          <div className="agent-report__table-status agent-report__table-status--active">Active</div>
        )}
        {(status === '2') && (
          <div className="agent-report__table-status agent-report__table-status--completed">Completed</div>
        )}
        {(status === '3') && (
          <div className="agent-report__table-status agent-report__table-status--unpaid">Unpaid</div>
        )}
        {(status === '4') && (
          <div className="agent-report__table-status agent-report__table-status--cancelled">Cancelled</div>
        )}
      </td>
      <td>
        {padiOn}
      </td>
    </tr>
  )
}
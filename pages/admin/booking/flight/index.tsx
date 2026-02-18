import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Images } from "@/types/enums"
import { useSession } from "next-auth/react"
import { callAPI, callMystiflyAPI, callSkyscannerAPI } from "@/lib/axiosHelper"
import moment from "moment"
import LoadingOverlay from "@/components/loadingOverlay"
import airlines from '@/lib/db/airlines.json'


export default function BookingHotel() {
  const { data: session, status } = useSession()

  const itemsPerPage = 10

  const [statusOptions, setStatusOptions] = useState<string[]>([])
  const [selectedTab, setSelectedTab] = useState<string>('All')
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)

  const [search, setSearch] = useState<string>('')

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<any[]>([])
  const [mystiflyBookingIDs, setMystiflyBookingIDs] = useState<{ name: string, MFRef: string, idCustomer: number }[]>([])

  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    setLoading(true)

    if (!(status === 'authenticated') || !session) return

    (async () => {
      const { ok, data, error } = await callAPI('/flight-booking/show', 'POST', { sort: 1 }, true)

      if (ok && data) {
        setMystiflyBookingIDs(data.map(item => ({ name: item?.fullname, MFRef: item?.mfref, idCustomer: item?.id_customer })).filter(value => value))
      }
    })()
  }, [status])


  useEffect(() => {
    setLoading(true)

    if (!(status === 'authenticated') || !session) return
    if (!mystiflyBookingIDs.length) return

    (async () => {
      await Promise.all([
        new Promise(async (resolve, reject) => {
          try {

            const { ok: airportsOK, data: airportsData } = await callSkyscannerAPI({
              url: 'https://partners.api.skyscanner.net/apiservices/v3/geo/hierarchy/flights/en-US',
              method: 'GET'
            })

            const airports = airportsData?.places

            const bookings = await Promise.all(mystiflyBookingIDs.map(async ({ name, MFRef, idCustomer }) => {
              const { ok, data, status, error } = await callMystiflyAPI({
                url: 'https://restapidemo.myfarebox.com/api/TripDetails/' + MFRef,
                method: 'GET'
              })

              if (ok && data?.Data) {
                const itineraries = data?.Data?.TripDetailsResult?.TravelItinerary?.Itineraries.length ? data?.Data?.TripDetailsResult?.TravelItinerary?.Itineraries[0]?.ItineraryInfo?.ReservationItems : []
                const itinerariesNoReturn = itineraries.filter(itinerary => !itinerary?.IsReturn)
                const itinerariesNoReturnDuration = itinerariesNoReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)
                const itinerariesReturn = itineraries.filter(itinerary => itinerary?.IsReturn)
                const itinerariesReturnDuration = itinerariesReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)

                const origin = itinerariesNoReturn?.length ? itinerariesNoReturn[0] : null
                const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin?.DepartureAirportLocationCode)
                const originName = airports?.[originKey]?.name
                const originDepartureDate = origin?.DepartureDateTime ? moment(origin?.DepartureDateTime).format('ddd, DD MMM YY') : null

                const destination = itinerariesNoReturn?.length ? itinerariesNoReturn[itinerariesNoReturn.length - 1] : null
                const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination?.ArrivalAirportLocationCode)
                const destinationName = airports?.[destinationKey]?.name

                const returnOrigin = itinerariesReturn?.length ? itinerariesReturn[0] : null
                const returnOriginKey = Object.keys(airports || {}).find(key => airports[key]?.iata === returnOrigin?.DepartureAirportLocationCode)
                const returnOriginName = airports?.[returnOriginKey]?.name
                const returnOriginDepartureDate = returnOrigin?.DepartureDateTime ? moment(returnOrigin?.DepartureDateTime).format('ddd, DD MMM YY') : null

                const returnDestination = itinerariesReturn?.length ? itinerariesReturn[itinerariesReturn.length - 1] : null
                const returnDestinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === returnDestination?.ArrivalAirportLocationCode)
                const returnDestinationName = airports?.[returnDestinationKey]?.name

                const bookingDate = data?.Data?.TripDetailsResult?.BookingCreatedOn ? moment(data?.Data?.TripDetailsResult?.BookingCreatedOn).format('DD / MM / YY') : null

                return { name, idCustomer, MFRef, origin, originKey: origin?.DepartureAirportLocationCode, originName, originDepartureDate, destination, destinationName, returnOrigin, returnOriginKey: returnOrigin?.DepartureAirportLocationCode, returnOriginName, returnOriginDepartureDate, returnDestination, returnDestinationName, bookingDate, ...data.Data }
              } else {
                return null
              }
            }).filter((value) => value))

            setData(bookings)
            setDataShow(bookings.slice(0, 10))

            resolve(true)
          } catch (error) {
            reject(error)
          }
        }),
      ])

      setLoading(false)
    })()
  }, [status, mystiflyBookingIDs])

  useEffect(() => {
    if (!data.length) return
    console.log(data);


    setStatusOptions(data.map(item => item?.TripDetailsResult?.TravelItinerary?.BookingStatus).filter((value) => value !== undefined).filter((value, index, array) => array.indexOf(value) === index))
  }, [data])

  const filteredData = data.filter((item) => item !== null).filter(item => {
    const isFilteredTabs = !!(selectedTab === 'All' ? true : (item?.TripDetailsResult?.TravelItinerary?.BookingStatus === selectedTab))

    const isSearch = search ? (item?.name?.toLowerCase().includes(search.toLowerCase()) || item?.originName?.toLowerCase().includes(search.toLowerCase()) || item?.originKey?.toLowerCase().includes(search.toLowerCase()) || item?.returnOriginName?.toLowerCase().includes(search.toLowerCase()) || item?.returnOriginKey?.toLowerCase().includes(search.toLowerCase())) : true

    return isFilteredTabs && isSearch
  })


  const [dataShow, setDataShow] = useState<any[]>([])
  console.log('dataShow', dataShow);
  const pageCounts = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    const data = filteredData.slice(0, 10)

    setDataShow(data)
  }, [search])

  console.log("show", dataShow);



  return (
    <Layout>
      <AdminLayout>
        <div className="container">
          <div className="admin-booking-flight">
            {/* <BookingSummary /> */}
            <div className="admin-booking-flight__wrapper">
              <div className="admin-booking-flight__header">
                <div className="admin-booking-flight__header-split">
                  <div className="admin-booking-flight__header-tab-menu">
                    <button
                      className={`btn ${selectedTab === 'All' ? 'active' : ''}`}
                      onClick={() => setSelectedTab('All')}>
                      All
                    </button>
                    {!!statusOptions.length && statusOptions.map((tab, index) => (
                      <button
                        key={index}
                        className={`btn ${tab === selectedTab ? 'active' : ''}`}
                        onClick={() => setSelectedTab(tab)}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="admin-booking-flight__header-separator"></div>
                  <div className="admin-header__search">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className="form-control" placeholder="Search" />
                    <SVGIcon src={Icons.Search} width={20} height={20} />
                  </div>
                </div>
                {/* <div className="custom-dropdown">
                  <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
                    <SVGIcon src={Icons.Filter} width={20} height={20} />
                    <div style={{ whiteSpace: "nowrap" }}>This Month</div>
                    <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                  </div>
                  <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-booking-flight__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                    <div className="custom-dropdown-menu__options">
                      <Link href="#" className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Today
                      </Link>
                      <Link href="#" className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        This Week
                      </Link>
                      <Link href="#" className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        This Month
                      </Link>
                    </div>
                  </DropdownMenu>
                </div> */}
              </div>
              <div className="admin-booking-flight__content">
                {loading ? (
                  <LoadingOverlay />
                ) : (!dataShow.length ? (
                  <div className="text-center">Sorry, there aren't any flights data.</div>
                ) : (
                  <table className="admin-booking-flight__table">
                    <thead>
                      <tr className="admin-booking-flight__table-list">
                        <th>No.</th>
                        <th>Name</th>
                        <th>Airline</th>
                        <th>Departure</th>
                        <th>Return</th>
                        <th>Date </th>
                        <th className="admin-booking-flight__table-list--center">Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataShow.map((item, index) => {
                        const foundAirline = (airlines as any[]).find(
                          (airline: any) =>
                            airline.code ===
                            item?.TripDetailsResult?.TravelItinerary?.Itineraries?.[0]?.ItineraryInfo
                              ?.ReservationItems?.[0]?.MarketingAirlineCode
                        );

                        return (
                          <PartnerList
                            key={index}
                            id={(index + 1).toString()}
                            customerName={item?.name}
                            airline={foundAirline}
                            departure={`${item?.originName} ${item?.originKey ? `(${item?.originKey})` : ''}`}
                            departureDate={item?.originDepartureDate}
                            returnFrom={item?.returnOrigin ? `${item?.returnOriginName} ${item?.returnOriginKey ? `(${item?.returnOriginKey})` : ''}` : '-'}
                            returnDate={item?.returnOrigin ? item?.returnOriginDepartureDate : '-'}
                            date={item?.bookingDate || '-'}
                            total={`${item?.TripDetailsResult?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount} ${item?.TripDetailsResult?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode}`}
                            status={item?.TripDetailsResult?.TravelItinerary?.BookingStatus}
                            linkURL={`/admin/booking/flight/${item?.MFRef}/?idCustomer=${item?.idCustomer}`}
                          />
                        )
                      })}
                    </tbody>
                  </table>
                ))}
              </div>
              {(!loading && !!filteredData.length) && (
                <div className="admin-booking-flight__pagination">
                  <div className="pagination">
                    <button type="button" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(90deg)', cursor: currentPage === 1 ? 'default' : 'pointer' }}>
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
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </Layout >
  )
}

const BookingSummary = () => {
  return (
    <div className="admin-booking-flight__summary">
      <div className="admin-booking-flight__summary-box">
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-header-text">Revenue</p>
          <SVGIcon src={Icons.Money} width={20} height={20} className="admin-booking-flight__summary-header-icon" />
        </div>
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-content-value">100 Partner</p>
          <div className="admin-booking-flight__summary-content-recap admin-booking-flight__summary-content-recap--success">
            <p className="admin-booking-flight__summary-content-recap--text">20%</p>
            <SVGIcon src={Icons.TrendUp} width={20} height={20} className="admin-booking-flight__summary-header-icon" />
          </div>
        </div>
      </div>
      <div className="admin-booking-flight__summary-box">
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-header-text">Total Booking</p>
          <SVGIcon src={Icons.Book} width={20} height={20} className="admin-booking-flight__summary-header-icon" />
        </div>
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-content-value">$ 100</p>
          <div className="admin-booking-flight__summary-content-recap admin-booking-flight__summary-content-recap--unsuccessfull">
            <p className="admin-booking-flight__summary-content-recap--text">20%</p>
            <SVGIcon src={Icons.TrendDown} width={20} height={20} className="summary-header-icon--unsuccessfull" />
          </div>
        </div>
      </div>
      <div className="admin-booking-flight__summary-box">
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-header-text">Booking Cancelled</p>
          <SVGIcon src={Icons.BookingCancel} width={20} height={20} className="admin-booking-flight__summary-header-icon" />
        </div>
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-content-value">200 Transaction</p>
          <div className="admin-booking-flight__summary-content-recap admin-booking-flight__summary-content-recap--unsuccessfull">
            <p className="admin-booking-flight__summary-content-recap--text">20%</p>
            <SVGIcon src={Icons.TrendDown} width={20} height={20} className="summary-header-icon--unsuccessfull" />
          </div>
        </div>
      </div>
      <div className="admin-booking-flight__summary-box">
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-header-text">Booking Complete</p>
          <SVGIcon src={Icons.BookingComplete} width={20} height={20} className="admin-booking-flight__summary-header-icon" />
        </div>
        <div className="admin-booking-flight__summary-row">
          <p className="admin-booking-flight__summary-content-value">200 Transaction</p>
          <div className="admin-booking-flight__summary-content-recap admin-booking-flight__summary-content-recap--unsuccessfull">
            <p className="admin-booking-flight__summary-content-recap--text">20%</p>
            <SVGIcon src={Icons.TrendDown} width={20} height={20} className="summary-header-icon--unsuccessfull" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface PartnerListProps {
  id: string,
  customerName: string,
  airline: {
    image: string,
    name: string
  },
  departure: string,
  departureDate: string,
  returnFrom: string,
  returnDate: string,
  date: string,
  total: string,
  status: string,
  linkURL: string,
}
const PartnerList = (props: PartnerListProps) => {
  const { id, customerName, airline, departure, departureDate, returnFrom, returnDate, date, status, linkURL } = props
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  return (
    <tr className="admin-booking-flight__table-list">
      <td>{id}</td>
      <td>
        <div className="admin-booking-flight__table-list--airline">
          {customerName}
        </div>
      </td>
      <td>
        <div className="admin-booking-flight__table-list--airline">
          <img className="admin-booking-flight__table-list--icon" src={airline?.image || Images.Placeholder} alt="Review Image" width={20} height={20} />
          {airline?.name}
        </div>
      </td>
      <td>
        <div className="admin-booking-flight__table-list--return">
          <p>{departure}</p>
          <p>{departureDate}</p>
        </div>
      </td>
      <td>
        <div className="admin-booking-flight__table-list--return">
          <p>{returnFrom}</p>
          <p>{returnDate}</p>
        </div>
      </td>
      <td>
        <div className="admin-booking-flight__table-list--icon">
          <SVGIcon src={Icons.Calendar} width={20} height={20} className="" />
          {date}
        </div>
      </td>
      <td>
        <div className="admin-booking-flight__table-status admin-booking-flight__table-status--ongoing">{status}</div>
      </td>
      <td>
        <div className="custom-dropdown">
          <div onClick={() => setShowActionDropdown(true)} className="custom-dropdown-toggle admin-booking-flight__table-dropdown">
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu show={showActionDropdown} setShow={setShowActionDropdown} className="admin-booking-flight__header-dropdown-menu" style={{ marginTop: 8, marginLeft: -110, width: 155 }}>
            <div className="custom-dropdown-menu__options">
              <Link href={linkURL} className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-flight__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Eye} width={20} height={20} className="" />
                  <p>See Details</p>
                </div>
              </Link>
              <Link href="#" className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-flight__dropdown-menu-option-delete">
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
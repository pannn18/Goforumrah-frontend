import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import { useEffect, useRef, useState } from "react"
import OpenAndCloseRoomCalendar from "@/components/fullcalendar/openAndCloseRoom"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import moment from "moment"
import { callAPI } from "@/lib/axiosHelper"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"

export const getServerSideProps: GetServerSideProps<{
  id: number
  data: any
}> = async (context) => {
  const id = parseInt(context.params?.id as string)

  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) return { notFound: true }

  const { ok, data, status, error } = await callAPI('/hotel-layout/show-v3', 'POST', { id_hotel_layout: id }, true, session.user.accessToken)

  if (ok && data) {
    return {
      props: {
        id,
        data
      }
    }
  }

  return { notFound: true }
}

export default function Page({
  id,
  data: layoutData
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showMonthDropdown, setShowMonthDropdown] = useState<boolean>(false)

  const prevButtonRef = useRef<HTMLAnchorElement>(null)
  const nextButtonRef = useRef<HTMLAnchorElement>(null)

  const [currentMonth, setCurrentMonth] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<[Date, Date] | null>(null)
  const [data, setData] = useState<{
    status_available: 1 | 0,
    to_left_sell: number,
    price: number,
    date: string,
    date_number: number
  }[]>([])

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [totalRoom, setTotalRoom] = useState<number>(1)
  const [statusAvailable, setStatusAvailable] = useState<boolean>(true)
  const [defaultPrice, setDefaultPrice] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)
  const [nonRefundable, setNonRefundable] = useState<boolean>(false)
  const [minimumStay, setMinimumStay] = useState<number>(1)

  const onSave = async () => {
    setError('')

    if (!selectedDate?.length) return

    setLoading(true)

    const { ok, data, error } = await callAPI('/hotel-availability/store', 'POST', {
      id_hotel_layout: id,
      total_room: totalRoom,
      status_available: statusAvailable ? 1 : 0,
      start_date: moment(selectedDate[0]).format('YYYY-MM-DD'),
      end_date: moment(selectedDate[1]).format('YYYY-MM-DD'),
      price: price,
      non_refundable: nonRefundable ? 1 : 0,
      minimum_stay: minimumStay,
    }, true)

    setLoading(false)

    if (ok) {
      loadCurrentMonthData()
    } else {
      setError(error || 'Unknown error')
    }
  }

  const loadCurrentMonthData = async () => {
    setData([])

    const { ok, data, error } = await callAPI('/hotel-availability/show', 'POST', {
      id_hotel_layout: id,
      date: currentMonth
    }, true)

    if (ok && data?.availability) {
      setData(data.availability)
      setDefaultPrice(data?.price || 0)
    }
  }


  useEffect(() => {
    if (currentMonth) loadCurrentMonthData()
  }, [currentMonth])

  useEffect(() => {
    if (defaultPrice > 0 && price === 0) setPrice(defaultPrice)
  }, [defaultPrice])

  useEffect(() => {
    if (!selectedDate?.length) return

    const isSelectedOnlyOne = moment(selectedDate[0]).isSame(selectedDate[1])

    if (isSelectedOnlyOne) {
      const dataOnThatDate = data.find(({ date }) => moment(selectedDate[0]).isSame(date))
      if (!dataOnThatDate) return

      const { to_left_sell, status_available, price } = dataOnThatDate

      setTotalRoom(to_left_sell)
      setStatusAvailable(status_available === 1)
      setPrice(price)
    } else {
      setTotalRoom(1)
      setStatusAvailable(true)
      setPrice(defaultPrice)
      setNonRefundable(false)
      setMinimumStay(1)
    }
  }, [selectedDate])


  useEffect(() => {
    const handleClick = () => {
      const prevButton = document.querySelector('.fc-toolbar-chunk .fc-prev-button.fc-button') as HTMLElement

      if (prevButton) {
        prevButton.click()
      }
    }

    if (prevButtonRef && prevButtonRef.current) {
      prevButtonRef.current?.addEventListener('click', handleClick, false)
      return function cleanup() {
        prevButtonRef.current?.removeEventListener("click", handleClick, false)
      }
    }
  }, [prevButtonRef, showMonthDropdown])

  useEffect(() => {
    const handleClick = () => {
      const nextButton = document.querySelector('.fc-toolbar-chunk .fc-next-button.fc-button') as HTMLElement

      if (nextButton) {
        nextButton.click()
      }
    }

    if (nextButtonRef && nextButtonRef.current) {
      nextButtonRef.current?.addEventListener('click', handleClick, false)

      return function cleanup() {
        nextButtonRef.current?.removeEventListener("click", handleClick, false)
      }
    }
  }, [nextButtonRef, showMonthDropdown])

  return (
    <Layout>
      <InnerLayout>
        <div className="admin-rate-availability__top">
          <div className="admin-rate-availability__top-header">
            <h4>Calendar</h4>
            <div className="custom-dropdown">
              <div onClick={() => setShowMonthDropdown(true)} className="custom-dropdown-toggle">
                <div style={{ whiteSpace: "nowrap" }}>{moment(currentMonth).format('MMMM YYYY')}</div>
                <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
              </div>
              <DropdownMenu show={showMonthDropdown} setShow={setShowMonthDropdown} className="admin-guestreview-business__dropdown-menu-option" style={{ marginTop: 8, width: 194 }}>
                <div className="admin-guestreview-business__guest-rating-dropdown custom-dropdown-menu__options">
                  <a
                    ref={prevButtonRef}
                    type="button" className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    {moment(currentMonth).subtract(1, 'months').format('MMMM YYYY')}
                  </a>
                  <Link href={''} type="button" className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    {moment(currentMonth).format('MMMM YYYY')}
                    <SVGIcon src={Icons.Check} width={16} height={16} className="admin-guestreview-business__dropdown dropdown-toggle-arrow" />
                  </Link>
                  <a
                    ref={nextButtonRef}
                    type="button" className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                    {moment(currentMonth).add(1, 'months').format('MMMM YYYY')}
                  </a>
                </div>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <h6 className="admin-rate-availability__custom-text mt-3 text-neutral-secondary fw-semibold">{layoutData?.room_type ? `${layoutData?.room_type} ${layoutData?.number_of_room ? `(Room Number: ${layoutData?.number_of_room})` : ''}` : ''}</h6>
        <div className="container container-rate-availability my-5">
          <div className="row">
            <div className="col">
              <OpenAndCloseRoomCalendar
                eventSources={[
                  {
                    events: [
                      ...data.map(({ status_available, to_left_sell, price, date, date_number }) => ({
                        title: '',
                        date: date,
                        className: status_available === 1 ? 'fc-custom-event-status' : 'fc-custom-event-status closed'
                      })),
                      ...data.map(({ status_available, to_left_sell, price, date, date_number }) => status_available === 1 && ({
                        title: `${to_left_sell} left to sell`,
                        date: date,
                        className: 'fc-custom-event-status-left'
                      })).filter(value => value)
                    ]
                  }
                ]}
                select={({ start, end, view }) => {
                  setSelectedDate([moment(start).toDate(), moment(end).subtract(1, 'days').toDate()])
                }}
                datesSet={({ start, end, view }) => {
                  setCurrentMonth(moment(view.currentStart).format('YYYY-MM-[01]'))
                }}
              />
            </div>
          </div>
          <div className="col-xl-4 admin-rate-availability__summary">
            <div className="admin-rate-availability__summary-date">
              <p className="admin-rate-availability__summary-date-desc">Selected Date</p>
              <div className="tour-booking-details__ticket-block">
                <label htmlFor="payment-expiryDate">Start Date</label>
                <div className="tour-booking-details__payment-input">
                  <input type="text" name="payment-expiryDate" id="payment-expiryDate" placeholder="DD - MM - YYYY" value={selectedDate?.length ? moment(selectedDate[0]).format('DD - MM - YYYY') : ''} readOnly />
                  <SVGIcon className="tour-booking-details__payment-input--icon" src={Icons.Calendar} width={20} height={20} />
                </div>
              </div>
              <div className="tour-booking-details__ticket-block">
                <label htmlFor="payment-expiryDate">End Date</label>
                <div className="tour-booking-details__payment-input">
                  <input type="text" name="payment-expiryDate" id="payment-expiryDate" placeholder="DD - MM - YYYY" value={selectedDate?.length ? moment(selectedDate[1]).format('DD - MM - YYYY') : ''} readOnly />
                  <SVGIcon className="tour-booking-details__payment-input--icon" src={Icons.Calendar} width={20} height={20} />
                </div>
              </div>
            </div>
            <div className="admin-rate-availability__summary-room">
              <div className="admin-rate-availability__summary-room-desc">
                <p className="admin-rate-availability__summary-room-desc--title">Room to Sell</p>
                <p className="admin-rate-availability__summary-room-desc--subtitle">Update the number of rooms to sell this room type</p>
              </div>
              <div className="admin-rate-availability__summary-room-input">
                <div className="tour-booking-details__ticket-block">
                  <div className="tour-booking-details__payment-input">
                    <input
                      value={totalRoom}
                      onChange={(e) => {
                        setTotalRoom(parseInt(e.target.value))
                      }}
                      type="number" name="payment-expiryDate" id="payment-expiryDate" placeholder="1" min={1} />
                  </div>
                </div>
                <p className="admin-rate-availability__summary-room-input--label">Room</p>
              </div>
            </div>
            <div className="admin-rate-availability__summary-status">
              <p className="admin-rate-availability__summary-status-desc">Room Status</p>
              <div className="admin-rate-availability__summary-status-form">
                <div className="admin-rate-availability__summary-status-form--check">
                  <div className="search-tour-package__sidemenu-filter-item form-check">
                    <input
                      checked={statusAvailable}
                      onChange={(e) => e.target.checked && setStatusAvailable(true)}
                      type="radio" id="filter-room-status-open" name="filterSort" className="form-check-input" />
                    <label htmlFor="filter-room-status-open" className="form-check-label">Open</label>
                  </div>
                  <div className="search-tour-package__sidemenu-filter-item form-check">
                    <input
                      checked={!statusAvailable}
                      onChange={(e) => e.target.checked && setStatusAvailable(false)}
                      type="radio" id="filter-room-status-closed" name="filterSort" className="form-check-input" />
                    <label htmlFor="filter-room-status-closed" className="form-check-label">Closed</label>
                  </div>
                </div>
                <div className="admin-rate-availability__summary-status-price">
                  <div className="admin-rate-availability__summary-status-price--form">
                    <div className="admin-rate-availability__summary-status-price--icon-wrap">
                      <div className="admin-rate-availability__summary-status-price--icon">
                        <p className="admin-rate-availability__summary-status-price--icon">$</p>
                      </div>
                      <div className="search-bar__separator"></div>
                    </div>
                    <div className="admin-rate-availability__summary-status-price--input">
                      <input
                        value={price || ''}
                        onChange={(e) => {
                          setPrice(parseFloat(e.target.value))
                        }}
                        type="number" name="payment-expiryDate" id="payment-expiryDate" placeholder="0" />
                    </div>
                  </div>
                </div>
                <div className="search-tour-package__sidemenu-filter-item form-check">
                  <input
                    checked={nonRefundable}
                    onChange={(e) => setNonRefundable(e.target.checked)}
                    type="checkbox" id="filterInputAll" className="form-check-input" />
                  <label htmlFor="filterInputAll" className="form-check-label">Non-Refundable</label>
                </div>
              </div>
              <div className="admin-rate-availability__summary-status-dropdown">
                <label htmlFor="payment-expiryDate">Minimal lenght of stay (Night)</label>
                <div className="admin-rate-availability__summary-room-input">
                  <div className="tour-booking-details__ticket-block w-100">
                    <div className="tour-booking-details__payment-input">
                      <input
                        value={minimumStay}
                        onChange={(e) => {
                          setMinimumStay(parseInt(e.target.value))
                        }}
                        type="number" name="payment-expiryDate" id="payment-expiryDate" placeholder="1 Night" min={1} />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="d-flex flex-column align-items-stretch text-danger-main text-center">
                  {error}
                </div>
              )}

              <div className="admin-rate-availability__summary-footer">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setError('')
                    setTotalRoom(1)
                    setStatusAvailable(true)
                    setPrice(0)
                    setNonRefundable(false)
                    setMinimumStay(1)
                  }}
                  className="btn btn-md btn-outline-success w-100">Cancel</button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={onSave}
                  className="btn btn-md btn-success text-white w-100">{!loading ? 'Save' : 'Please wait...'}</button>
              </div>
              {!!selectedDate?.length && (
                <p className="admin-rate-availability__summary-footer-desc">Change will be made to the following date : {moment(selectedDate[0]).isSame(selectedDate[1]) ? moment(selectedDate[0]).format('D MMMM') : `${moment(selectedDate[0]).format('D MMMM')} - ${moment(selectedDate[1]).format('D MMMM')}`}</p>
              )}
            </div>
          </div>
        </div>
      </InnerLayout>
    </Layout>
  )
}
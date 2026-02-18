import React, { useEffect, useState } from 'react'
import { CabinClasses, Icons } from '@/types/enums'
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { DateRange, Calendar, Range } from 'react-date-range';
import moment from 'moment';
import Link from 'next/link';
import { getEnumAsArray } from '@/lib/enumsHelper';
import { callAPI, callSkyscannerAPI, callBookingAPI } from '@/lib/axiosHelper';
import { searchFlightLocations } from '@/lib/searchFlightsHelper';
import { useRouter } from 'next/router';
import { getName } from 'country-list';
import { FlightSearchList, HotelPassenger } from '@/types/types';
import useFetch from '@/hooks/useFetch';

interface FlightPassenger {
  adult: number
  children: number
  baby: number
  class: CabinClasses
}

interface TourPackagePassenger {
  people: number
}

interface HotelSearchBarProps {
  homepage?: boolean
  useVariant?: boolean
  search?: string
  onSearchChange?: () => void
}
const getFlightLabel = (item: any) => {
  const cityName =
    item?.cityName ||
    item?.name ||
    item?.airportInformation?.cityName ||
    item?.airportName ||
    '';

  const code =
    item?.iataCode ||
    item?.code ||
    item?.airportInformation?.iataCode ||
    item?.iata ||
    item?.skyId ||        // kadang booking pakai ini
    item?.id ||           // last fallback
    '';

  // kalau code kosong, jangan tampilkan "(undefined)"
  return code ? `${cityName} (${code})` : cityName;
};


// Start:: Home Page Search Bar & Each Service Header Search Bar
export const HotelSearchBar = (props: HotelSearchBarProps) => {
  const { useVariant, homepage, onSearchChange } = props
  const router = useRouter()
  const [search, setSearch] = useState<string>(props.search || '')
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false)
  const [locations, setLocations] = useState<any[]>([])

  const today = new Date()
  const tomorrow = moment(today).add(1, 'day').toDate();

  const handleClickLocationOption = (search: string) => {
    setSearch(search)
    setShowSearchDropdown(false)
  }

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: today,
    endDate: tomorrow,
    // endDate: moment().add(1, 'day').toDate(),
    key: 'selection',
  })
  const isDateRangeHasChanged = dateRange.startDate.getTime() !== dateRange.endDate.getTime()

  const [showPassengerDropdown, setShowPassengerDropdown] = useState<boolean>(false)
  const [passengerHasChanged, setPassengerHasChanged] = useState<boolean>(false)
  const [passenger, setPassenger] = useState<HotelPassenger>({ adult: 1, children: 0, room: 1 })
  const handleUpdatePassenger = (passenger: HotelPassenger) => {
    setPassenger(passenger)
    setPassengerHasChanged(true)
  }

  useEffect(() => {
    // Load saved date
    const savedDateRange = localStorage.getItem('search-hotel-date')
    let initialDateRange: Range = JSON.parse(savedDateRange)

    if (initialDateRange) {
      const startDateInLocal = new Date(initialDateRange.startDate)
      const today = new Date()
      if (startDateInLocal.getTime() < today.getTime()) {
        initialDateRange.startDate = moment(today).startOf('day').toDate()
      } else {
        initialDateRange.startDate = moment(initialDateRange.startDate).startOf('day').toDate()
      }
      initialDateRange.endDate = new Date(initialDateRange.endDate)
      setDateRange(initialDateRange)
    }

    // Load saved passenger
    const savedPassenger = localStorage.getItem('search-hotel-passenger')
    let initialPassenger: HotelPassenger = JSON.parse(savedPassenger)

    if (!initialPassenger) {
      // If no saved passenger data, set default values and save to local storage
      initialPassenger = { adult: 1, children: 0, room: 1 };
      localStorage.setItem('search-hotel-passenger', JSON.stringify(initialPassenger));
    }

    setPassenger(initialPassenger)
    setPassengerHasChanged(true)

  }, [])

  useEffect(() => {
    if (dateRange.startDate.getTime() !== dateRange.endDate.getTime()) {
      localStorage.setItem('search-hotel-date', JSON.stringify(dateRange))
    }
  }, [dateRange])

  useEffect(() => {
    if (passengerHasChanged) {
      localStorage.setItem('search-hotel-passenger', JSON.stringify(passenger))
    }
  }, [passenger, passengerHasChanged])

  useEffect(() => {
    setSearch(props.search || '')
  }, [props.search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setLocations([])

      const payload = {
        search: search,
        limit: 5
      }

      const { ok, data } = await callAPI('/cities/autocomplete', 'POST', payload)

      if (ok && data) {
        setLocations(data)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  const handleDateChange = (newDateRange: Range) => {
    // Checking jika the new check-out date is before the check-in date
    if (newDateRange.endDate.getTime() < newDateRange.startDate.getTime()) {
      console.error("Check-out date cannot be before the check-in date");
      return;
    }
    // Jika check-out date valid, update state
    setDateRange(newDateRange);
  };

  return (
    <div className={`search-bar ${useVariant ? 'search-bar--variant' : ''} ${homepage ? 'search-bar--homepage' : ''}`}>
      <div className={`search-bar__item search-bar__item--grow ${showSearchDropdown ? 'search-bar__item--active' : ''}`}>
        {useVariant && (
          <div className="search-bar__item-title">Destination</div>
        )}
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field ${search ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`}>
            <SVGIcon src={Icons.Hotel} width={20} height={20} />
            <input
              type="text"
              value={search || ''}
              onChange={(e) => setSearch(e.currentTarget.value || '')}
              onFocus={() => setShowSearchDropdown(true)}
              onClick={() => setShowSearchDropdown(true)}
              className="search-bar__input"
              placeholder="Where are you going?" />
          </div>
        </div>
        <DropdownMenu show={showSearchDropdown} setShow={setShowSearchDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, maxWidth: 396 }}>
          {search ? (
            <div className="custom-dropdown-menu__options">
              {!!locations.length && locations.map((location, index) => (
                <div key={`search-hotel-${index}`} onClick={() => { handleClickLocationOption(location?.name) }} className="custom-dropdown-menu__option">
                  <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                  <div>
                    <div className="custom-dropdown-menu__option-title">{location?.name}</div>
                    <div className="custom-dropdown-menu__option-description">{getName(location?.country || '') || ''}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="custom-dropdown-menu__header">
                <div className="custom-dropdown-menu__title">Popular Destination</div>
              </div>
              <div className="custom-dropdown-menu__options">
                <div onClick={() => { handleClickLocationOption('Makkah') }} className="custom-dropdown-menu__option">
                  <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                  <div>
                    <div className="custom-dropdown-menu__option-title">Makkah</div>
                    <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                  </div>
                </div>
                <div onClick={() => { handleClickLocationOption('Madinah') }} className="custom-dropdown-menu__option">
                  <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                  <div>
                    <div className="custom-dropdown-menu__option-title">Madinah</div>
                    <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
        {useVariant && (
          <div className="search-bar__date-split">
            <div>
              <div className="search-bar__item-title">Check In</div>
              <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`} style={{ cursor: 'pointer' }}>
                <SVGIcon src={Icons.Calendar} width={20} height={20} />
                <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('MMM DD') : 'Check in'}</div>
              </div>
            </div>
            <div className="search-bar__date-night-indicator">
              <div>
                <SVGIcon src={Icons.SunHorizon} width={16} height={16} />
                <div>{isDateRangeHasChanged ? moment(dateRange.endDate).diff(moment(dateRange.startDate), 'days') : '-'}</div>
              </div>
              <div>Night</div>
            </div>
            <div>
              <div className="search-bar__item-title">Check Out</div>
              <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`} style={{ cursor: 'pointer' }}>
                <SVGIcon src={Icons.Calendar} width={20} height={20} />
                <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('MMM DD') : 'Check in'}</div>
              </div>
            </div>
          </div>
        )}

        {!useVariant && (
          <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`} style={{ cursor: 'pointer' }}>
            <SVGIcon src={Icons.Calendar} width={20} height={20} />
            <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('ddd, MMM DD') : 'Check in'}</div>
            <div>-</div>
            <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('ddd, MMM DD') : 'Check out'}</div>
          </div>
        )}

        <DropdownMenu className="search-bar__date-range--homepage" show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
          <DateRange
            months={2}
            direction="horizontal"
            ranges={[dateRange]}
            minDate={moment().toDate()}
            onChange={(item) => handleDateChange(item.selection)}
          />
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      <div className={`search-bar__item ${showPassengerDropdown ? 'search-bar__item--active' : ''}`}>
        {useVariant && (
          <div className="search-bar__item-title">Room & Guest</div>
        )}
        <div onClick={() => setShowPassengerDropdown(true)} className={`search-bar__field ${passengerHasChanged ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Users} width={20} height={20} />
          <div>{passenger.adult} adult</div>
          <div className="search-bar__field-bullet" />
          <div>{passenger.children} children</div>
          <div className="search-bar__field-bullet" />
          <div>{passenger.room} room</div>
        </div>
        <DropdownMenu show={showPassengerDropdown} setShow={setShowPassengerDropdown} className="search-bar__passenger-dropdown" style={{ marginTop: 36 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Passenger</div>
          </div>
          <div className="custom-dropdown-menu__options">
            <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
              <div className="search-bar__passenger-option">
                <div className="search-bar__passenger-option-type">Adult</div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, adult: passenger.adult - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.adult <= 1}>
                    <SVGIcon src={Icons.Minus} width={20} height={20} />
                  </button>
                </div>
                <div className="search-bar__passenger-option-value">{passenger.adult}</div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, adult: passenger.adult + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.adult >= 99}>
                    <SVGIcon src={Icons.Plus} width={20} height={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
              <div className="search-bar__passenger-option">
                <div className="search-bar__passenger-option-type">Children</div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, children: passenger.children - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.children <= 0}>
                    <SVGIcon src={Icons.Minus} width={20} height={20} />
                  </button>
                </div>
                <div className="search-bar__passenger-option-value">{passenger.children}</div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, children: passenger.children + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.children >= 99}>
                    <SVGIcon src={Icons.Plus} width={20} height={20} />
                  </button>
                </div>
              </div>
            </div>
            <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
              <div className="search-bar__passenger-option">
                <div className="search-bar__passenger-option-type">Rooms</div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, room: passenger.room - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.room <= 1}>
                    <SVGIcon src={Icons.Minus} width={20} height={20} />
                  </button>
                </div>
                <div className="search-bar__passenger-option-value">{passenger.room}</div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, room: passenger.room + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.room >= 99}>
                    <SVGIcon src={Icons.Plus} width={20} height={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__item">
        <button onClick={() => {
          onSearchChange && onSearchChange()
          search && router.push({
            pathname: '/search/hotel',
            query: { search }
          })
        }} className="btn btn-success rounded-pill search-bar__search-button">
          <p className="search-bar__search-button--text">{useVariant ? 'Change Search' : 'Search Hotel'}</p>
          <SVGIcon src={Icons.Search} width={20} height={20} className="search-bar__search-button--icon" />
        </button>
      </div>
    </div>
  )
}


interface FlightSearchBarProps {
  homepage?: boolean
  useVariant?: boolean
  from?: string
  to?: string
  onSearchChange?: () => void
}

export const FlightSearchBar = (props: FlightSearchBarProps) => {
  const MYSTIFLY_CABIN_CLASSES = {
    [CabinClasses.Economy]: 'Y',
    [CabinClasses.PremiumEconomy]: 'S',
    [CabinClasses.Business]: 'C',
    [CabinClasses.First]: 'F'
  }

  const { useVariant, homepage, onSearchChange } = props
  const router = useRouter()

  const [isOneWay, setIsOneWay] = useState<boolean>(false)

  const [showFlightFromDropdown, setShowFlightFromDropdown] = useState<boolean>(false)
  const [flightFromSearch, setFlightFromSearch] = useState<string>('')
  const [flightFrom, setFlightFrom] = useState<FlightSearchList | null>(null)
  const [flightFromList, setFlightFromList] = useState<FlightSearchList[]>([])
  const handleClickFlightFromOption = (item: FlightSearchList) => {
  setFlightFrom(item)
  setFlightFromSearch(getFlightLabel(item))
  setShowFlightFromDropdown(false)
}

  const [showFlightToDropdown, setShowFlightToDropdown] = useState<boolean>(false)
  const [flightToSearch, setFlightToSearch] = useState<string>('')
  const [flightTo, setFlightTo] = useState<FlightSearchList | null>(null)
  const [flightToList, setFlightToList] = useState<FlightSearchList[]>([])
  const handleClickFlightToOption = (item: FlightSearchList) => {
  setFlightTo(item)
  setFlightToSearch(getFlightLabel(item))
  setShowFlightToDropdown(false)
}

  // Effect to restore displayed text when dropdown closes
  useEffect(() => {
  if (!showFlightFromDropdown && flightFrom) {
    setFlightFromSearch(getFlightLabel(flightFrom))
  }
}, [showFlightFromDropdown, flightFrom])

  useEffect(() => {
  if (!showFlightToDropdown && flightTo) {
    setFlightToSearch(getFlightLabel(flightTo))
  }
}, [showFlightToDropdown, flightTo])

  const [showPassengerDropdown, setShowPassengerDropdown] = useState<boolean>(false)
  const [passengerHasChanged, setPassengerHasChanged] = useState<boolean>(false)
  const [passenger, setPassenger] = useState<FlightPassenger>({ adult: 1, children: 0, baby: 0, class: CabinClasses.Economy })
  const handleUpdatePassenger = (passenger: FlightPassenger) => {
    setPassenger(passenger)
    setPassengerHasChanged(true)
  }

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })
  const isDateRangeHasChanged = dateRange.startDate.getTime() !== dateRange.endDate.getTime()

  const [departureDate, setDepartureDate] = useState<Date | null>(null)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setFlightFromList([])

      // Use Booking.com API for location search
      const response = await callBookingAPI({
        method: 'GET',
        url: `/api/v1/flights/searchDestination?query=${encodeURIComponent(flightFromSearch)}`
      })

      console.log('[FlightFrom] API Response:', response)

      if (response.ok && response.data) {
        // Handle different response formats from Booking.com
        let locations: any[] = []

        // Try to extract array from different possible response structures
        if (Array.isArray(response.data)) {
          locations = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          locations = response.data.data
        } else if (response.data?.places && Array.isArray(response.data.places)) {
          locations = response.data.places
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          locations = response.data.results
        }

        console.log('[FlightFrom] Extracted locations:', locations)

        // Only set if we got an array
        if (Array.isArray(locations)) {
          setFlightFromList(locations as FlightSearchList[])
        } else {
          console.warn('[FlightFrom] Response data is not in expected format:', response.data)
        }
      } else {
        console.error('[FlightFrom] API Error:', response.error)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [flightFromSearch])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setFlightToList([])

      // Use Booking.com API for location search
      const response = await callBookingAPI({
        method: 'GET',
        url: `/api/v1/flights/searchDestination?query=${encodeURIComponent(flightToSearch)}`
      })

      console.log('[FlightTo] API Response:', response)

      if (response.ok && response.data) {
        // Handle different response formats from Booking.com
        let locations: any[] = []

        // Try to extract array from different possible response structures
        if (Array.isArray(response.data)) {
          locations = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          locations = response.data.data
        } else if (response.data?.places && Array.isArray(response.data.places)) {
          locations = response.data.places
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          locations = response.data.results
        }

        console.log('[FlightTo] Extracted locations:', locations)

        // Only set if we got an array
        if (Array.isArray(locations)) {
          setFlightToList(locations as FlightSearchList[])
        } else {
          console.warn('[FlightTo] Response data is not in expected format:', response.data)
        }
      } else {
        console.error('[FlightTo] API Error:', response.error)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [flightToSearch])


  useEffect(() => {
    // Load saved date
    const savedDateRange = localStorage.getItem('search-flights-roundtrip-date')
    let initialDateRange: Range = JSON.parse(savedDateRange)

    if (initialDateRange) {
      const startDateInLocal = new Date(initialDateRange.startDate)
      const today = new Date()
      if (startDateInLocal.getTime() < today.getTime()) {
        initialDateRange.startDate = today
      } else {
        initialDateRange.startDate = new Date(initialDateRange.startDate)
      }
      initialDateRange.endDate = new Date(initialDateRange.endDate)
      setDateRange(initialDateRange)
    }

    const savedDepartureDate = localStorage.getItem('search-flights-departure-date')
    let initialDepartureDate = savedDepartureDate

    if (initialDepartureDate) {
      setDepartureDate(new Date(initialDepartureDate))
    }

    const savedIsOneWay = localStorage.getItem('search-flights-isoneway')
    let initialIsOneWay = JSON.parse(savedIsOneWay)

    setIsOneWay(initialIsOneWay)
  }, [])

  useEffect(() => {
    if (dateRange.startDate.getTime() !== dateRange.endDate.getTime()) {
      localStorage.setItem('search-flights-roundtrip-date', JSON.stringify(dateRange))
    }
  }, [dateRange])

  useEffect(() => {
    if (departureDate) {
      localStorage.setItem('search-flights-departure-date', departureDate.toString())
    }
  }, [departureDate])


  const handleSearch = () => {

    onSearchChange && onSearchChange()

    if (!(((isOneWay && departureDate) || (!isOneWay && isDateRangeHasChanged)) && flightFrom && flightTo)) return

    // Handle both Skyscanner and Booking.com location formats
    // Use 'code' for Booking.com (IATA code like 'DEL') or 'iataCode' for Skyscanner
    const origin = flightFrom.code || flightFrom.iataCode || flightFrom?.airportInformation?.iataCode || flightFrom.id
    const destination = flightTo.code || flightTo.iataCode || flightTo?.airportInformation?.iataCode || flightTo.id

    console.log('[FlightSearch] Origin:', origin, 'Destination:', destination)
    console.log('[FlightSearch] Flight from:', flightFrom, 'Flight to:', flightTo)
    console.log('[FlightSearch] Is One Way:', isOneWay)

    const queryParams = {
    origin,
    destination,
    tripType: isOneWay ? 'oneway' : 'return', // TAMBAHKAN INI
    ...(isOneWay ? {
      dyear: departureDate.getFullYear(),
      dmonth: departureDate.getMonth() + 1,
      dday: departureDate.getDate()
    } : {
      dyear: dateRange.startDate.getFullYear(),
      dmonth: dateRange.startDate.getMonth() + 1,
      dday: dateRange.startDate.getDate(),
      ryear: dateRange.endDate.getFullYear(),
      rmonth: dateRange.endDate.getMonth() + 1,
      rday: dateRange.endDate.getDate()
    }),
    adt: passenger.adult,
    chd: passenger.children,
    inf: passenger.baby,
    cabin: MYSTIFLY_CABIN_CLASSES[passenger.class],
  }

  console.log('[FlightSearch] Query Params:', queryParams) // DEBUG

  router.push({
    pathname: '/search/flights',
    query: queryParams
  })
}

  return (
    <div className={`search-bar ${homepage ? 'search-bar--homepage' : ''}`}>
      <div className="search-bar__radio-fields">
        <div className="form-check">
          <input checked={!isOneWay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsOneWay(!e.currentTarget.checked)
            localStorage.setItem('search-skyscanner-isoneway', JSON.stringify(!e.currentTarget.checked))
          }} className="form-check-input" type="radio" name="flight-search-type" id="flight-search-round-trip" />
          <label className="form-check-label" htmlFor="flight-search-round-trip">
            Round-trip
          </label>
        </div>
        <div className="form-check">
          <input checked={isOneWay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsOneWay(e.currentTarget.checked)
            localStorage.setItem('search-skyscanner-isoneway', JSON.stringify(e.currentTarget.checked))
          }} className="form-check-input" type="radio" name="flight-search-type" id="flight-search-one-way" />
          <label className="form-check-label" htmlFor="flight-search-one-way">
            One-way
          </label>
        </div>
      </div>
      <div className={`search-bar__item search-bar__item--grow ${showFlightFromDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field  ${flightFromSearch ? 'has-value' : ''}`}>
            <SVGIcon src={Icons.AirplaneTakeOff} width={20} height={20} />
            <input
              type="text"
              value={flightFromSearch}
              onChange={(e) => setFlightFromSearch(e.currentTarget.value)}
              onFocus={() => setShowFlightFromDropdown(true)}
              onClick={() => setShowFlightFromDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowFlightFromDropdown(false)
                }, 200)
              }}
              className="search-bar__input"
              placeholder="Where from?" />
          </div>
        </div>
        <DropdownMenu show={showFlightFromDropdown} setShow={setShowFlightFromDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__options">
            {flightFromList.map((item) => (
              <div key={item.id || item.entityId || item.code} onClick={() => { handleClickFlightFromOption(item) }} className="custom-dropdown-menu__option">
                <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                <div>
                  <div className="custom-dropdown-menu__option-title">
                    {[item.cityName || item.name, item.countryName].filter(value => value).join(', ')}
                  </div>
                  <div className="custom-dropdown-menu__option-description">
                    {[
                      item.iataCode || item.code || item?.airportInformation?.iataCode,
                      item.type === 'PLACE_TYPE_CITY' ? `All Airports in ${item.cityName}` : item.name,
                      item.type === 'AIRPORT' && item.cityName ? `${item.cityName}` : null
                    ].filter(value => value).join(' - ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenu>
      </div>
      <div style={{ marginInline: 10, flex: 'none', alignSelf: 'center' }}>
        <SVGIcon src={isOneWay ? Icons.ArrowRight : Icons.ArrowLeftRight} width={20} height={20} color="#9E9E9E" />
      </div>
      <div className={`search-bar__item search-bar__item--grow ${showFlightToDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field ${flightTo ? 'has-value' : ''}`}>
            <SVGIcon src={Icons.AirplaneLanding} width={20} height={20} />
            <input
              type="text"
              value={flightToSearch}
              onChange={(e) => setFlightToSearch(e.currentTarget.value)}
              onFocus={() => setShowFlightToDropdown(true)}
              onClick={() => setShowFlightToDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowFlightToDropdown(false)
                }, 200)
              }}
              className="search-bar__input"
              placeholder="Where to?" />
          </div>
        </div>
        <DropdownMenu show={showFlightToDropdown} setShow={setShowFlightToDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__options">
            {flightToList.map((item) => (
              <div key={item.id || item.entityId || item.code} onClick={() => { handleClickFlightToOption(item) }} className="custom-dropdown-menu__option">
                <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                <div>
                  <div className="custom-dropdown-menu__option-title">
                    {[item.cityName || item.name, item.countryName].filter(value => value).join(', ')}
                  </div>
                  <div className="custom-dropdown-menu__option-description">
                    {[
                      item.iataCode || item.code || item?.airportInformation?.iataCode,
                      item.type === 'PLACE_TYPE_CITY' ? `All Airports in ${item.cityName}` : item.name,
                      item.type === 'AIRPORT' && item.cityName ? `${item.cityName}` : null
                    ].filter(value => value).join(' - ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      {!isOneWay && (
        <>
          <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('ddd, MMM DD') : 'Departure'}</div>
            </div>
            <DropdownMenu className="search-bar__date-range--homepage" show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
              <DateRange
                months={2}
                direction="horizontal"
                ranges={[dateRange]}
                minDate={moment().toDate()}
                onChange={item => setDateRange(item.selection)}
              />
            </DropdownMenu>
          </div>
          <div className="search-bar__separator"></div>
          <div className="search-bar__item">
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('ddd, MMM DD') : 'Return'}</div>
            </div>
          </div>
          <div className="search-bar__separator"></div>
        </>
      )}

      {isOneWay && (
        <>
          <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${departureDate ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{departureDate ? moment(departureDate).format('ddd, MMM DD') : 'Departure'}</div>
            </div>
            <DropdownMenu className="search-bar__date-range--homepage" show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
              <Calendar
                months={1}
                direction="horizontal"
                date={departureDate}
                minDate={moment().toDate()}
                onChange={date => setDepartureDate(date)}
              />
            </DropdownMenu>
          </div>
          <div className="search-bar__separator"></div>
        </>
      )}
      <div className={`search-bar__item ${showPassengerDropdown ? 'search-bar__item--active' : ''}`}>
        <div onClick={() => setShowPassengerDropdown(true)} className={`search-bar__field ${passengerHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Users} width={20} height={20} />
          <div>{passenger.adult} adult</div>
          <div className="search-bar__field-bullet" />
          {passenger.children > 0 && (
            <>
              <div>{passenger.children} children</div>
              <div className="search-bar__field-bullet" />
            </>
          )}
          {passenger.baby > 0 && (
            <>
              <div>{passenger.baby} baby</div>
              <div className="search-bar__field-bullet" />
            </>
          )}
          <div>{passenger.class}</div>
        </div>

        <DropdownMenu show={showPassengerDropdown} setShow={setShowPassengerDropdown} className="search-bar__passenger-dropdown search-bar__passenger-dropdown--flex" style={{ marginTop: 36, width: 578 }}>
          <div className="search-bar__passenger-dropdown-column">
            <div className="custom-dropdown-menu__header">
              <div className="custom-dropdown-menu__title">Passenger</div>
            </div>
            <div className="custom-dropdown-menu__options">
              <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="search-bar__passenger-option">
                  <div className="search-bar__passenger-option-type">
                    <div>Adult</div>
                    <div className="search-bar__passenger-option-type-small">Age 12+</div>
                  </div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, adult: passenger.adult - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.adult <= 1}>
                      <SVGIcon src={Icons.Minus} width={20} height={20} />
                    </button>
                  </div>
                  <div className="search-bar__passenger-option-value">{passenger.adult}</div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, adult: passenger.adult + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.adult >= 8}>
                      <SVGIcon src={Icons.Plus} width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="search-bar__passenger-option">
                  <div className="search-bar__passenger-option-type">
                    <div>Children</div>
                    <div className="search-bar__passenger-option-type-small">Age 0 - 12</div>
                  </div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, children: passenger.children - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.children <= 0}>
                      <SVGIcon src={Icons.Minus} width={20} height={20} />
                    </button>
                  </div>
                  <div className="search-bar__passenger-option-value">{passenger.children}</div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, children: passenger.children + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.children >= 8}>
                      <SVGIcon src={Icons.Plus} width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="search-bar__passenger-option">
                  <div className="search-bar__passenger-option-type">
                    <div>Baby</div>
                    <div className="search-bar__passenger-option-type-small">Under 2 y.o</div>
                  </div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, baby: passenger.baby - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.baby <= 0}>
                      <SVGIcon src={Icons.Minus} width={20} height={20} />
                    </button>
                  </div>
                  <div className="search-bar__passenger-option-value">{passenger.baby}</div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, baby: passenger.baby + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.baby >= 8}>
                      <SVGIcon src={Icons.Plus} width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="search-bar__passenger-dropdown-column">
            <div className="custom-dropdown-menu__header">
              <div className="custom-dropdown-menu__title">Cabin Class</div>
            </div>
            <div className="custom-dropdown-menu__options">
              {getEnumAsArray(CabinClasses).map((item, index) => (
                <div onClick={() => handleUpdatePassenger({ ...passenger, class: CabinClasses[item] })} key={index} className="custom-dropdown-menu__option">
                  <div className={`search-bar__passenger-option ${passenger.class === CabinClasses[item] ? 'search-bar__passenger-option--checked' : ''}`}>
                    <div className="search-bar__passenger-option-type">{CabinClasses[item]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__item">
        <button onClick={handleSearch} type="button" className="btn btn-success rounded-pill search-bar__search-button">Search Flight</button>
      </div>
    </div>
  )
}


interface BookTransferSearchBarProps {
  homepage?: boolean
  useVariant?: boolean
  pickupSearch?: string
  dropOffSearch?: string
  onSearchChange?: () => void
}

export const BookTransferSearchBar = (props: BookTransferSearchBarProps) => {
  const times = ['00:00', '00:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00', '04:30', '05:00', '05:30', '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30']

  const { useVariant, homepage, onSearchChange } = props
  const router = useRouter()

  const [isDifferentLocation, setIsDifferentLocation] = useState<boolean>(false)

  const [pickupSearch, setPickupSearch] = useState<string>(props.pickupSearch || '')
  const [showPickupLocationDropdown, setShowPickupLocationDropdown] = useState<boolean>(false)
  const [pickupLocation, setPickupLocation] = useState<any[]>([])
  const handleClickPickupLocationOption = (pickupLocation: string) => {
    setPickupSearch(pickupLocation)
    setShowPickupLocationDropdown(false)
  }

  const [showPickupTimeDropdown, setShowPickupTimeDropdown] = useState<boolean>(false)
  const [pickupTime, setPickupTime] = useState<string>('')


  const handleClickPickupTimeOption = (pickupTime: string) => {
    // Check if the dates are the same
    const isSameDate = moment(dateRange.startDate).isSame(dateRange.endDate, 'day');
    console.log('Pickup', pickupTime);


    if (isSameDate) {
      // Check if pickup time is strictly earlier than drop-off time
      const pickupTimeMoment = moment(pickupTime, 'HH:mm');
      const dropOffTimeMoment = moment(dropOffTime, 'HH:mm');

      if (!dropOffTime || pickupTimeMoment.isBefore(dropOffTimeMoment) && !pickupTimeMoment.isSame(dropOffTimeMoment)) {

        setPickupTime(pickupTime);
        setShowPickupTimeDropdown(false);
      } else {

        console.error('Invalid pickup time');
        // alert('Pickup time should not be the same as or later than dropoff')

      }
    } else {

      setPickupTime(pickupTime);
      setShowPickupTimeDropdown(false);
    }
  };


  const [dropOffSearch, setDropOffSearch] = useState<string>(props.dropOffSearch || '')
  const [showDropOffLocationDropdown, setShowDropOffLocationDropdown] = useState<boolean>(false)
  const [dropOffLocation, setDropOffLocation] = useState<any[]>([])
  const handleClickDropOffLocationOption = (dropOffLocation: string) => {
    setDropOffSearch(dropOffLocation)
    setShowDropOffLocationDropdown(false)
  }

  const [showDropOffTimeDropdown, setShowDropOffTimeDropdown] = useState<boolean>(false)
  const [dropOffTime, setDropOffTime] = useState<string>('')

  const handleClickDropOffTimeOption = (dropOffTime: string) => {

    const isSameDate = moment(dateRange.startDate).isSame(dateRange.endDate, 'day');

    if (isSameDate) {

      const pickupTimeMoment = moment(pickupTime, 'HH:mm');
      const dropOffTimeMoment = moment(dropOffTime, 'HH:mm');

      if (pickupTimeMoment.isSameOrAfter(dropOffTimeMoment)) {

        // alert('Drop-off time must be later than pickup time');

      } else {

        setDropOffTime(dropOffTime);
        setShowDropOffTimeDropdown(false);
      }
    } else {
      // If dates are different,  set the drop-off time
      setDropOffTime(dropOffTime);
      setShowDropOffTimeDropdown(false);
    }
  };
  const [isComponentMounted, setIsComponentMounted] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })


  const isDateRangeHasChanged = dateRange.startDate.getTime() <= dateRange.endDate.getTime()
  const handleDateChange = (newDateRange: Range) => {
    if (newDateRange.startDate.getTime() === dateRange.endDate.getTime()) {
      // If the date has changed, set pickup and drop-off times to default values
      setPickupTime('00:00');
      setDropOffTime('23:30');
    }
    console.log('New Date Range:', newDateRange);
    // Update the date range
    setDateRange(newDateRange);
  };
  useEffect(() => {
    // Load saved date
    const savedDateRange = localStorage.getItem('search-book-transfer-date');
    let initialDateRange: Range;

    if (savedDateRange) {
      initialDateRange = JSON.parse(savedDateRange);

      const startDateInLocal = new Date(initialDateRange.startDate);
      const endDateInLocal = new Date(initialDateRange.endDate);
      const today = new Date();

      // Adjust start date if it's less than today
      initialDateRange.startDate = startDateInLocal.getTime() < today.getTime() ? today : startDateInLocal;

      // Adjust end date if it's less than today
      initialDateRange.endDate = endDateInLocal.getTime() < today.getTime() ? today : endDateInLocal;
    }

    if (!savedDateRange) {
      localStorage.setItem('search-book-transfer-date', JSON.stringify(dateRange));
    }

    setDateRange(initialDateRange);
    setIsComponentMounted(true);
  }, []);


  useEffect(() => {
    if (isComponentMounted && dateRange.startDate.getTime() <= dateRange.endDate.getTime()) {
      localStorage.setItem('search-book-transfer-date', JSON.stringify(dateRange));
    }
  }, [isComponentMounted, dateRange]);


  useEffect(() => {

    const savedPickupTime = localStorage.getItem('search-book-transfer-pickup-time')
    let initialPickupTime = savedPickupTime

    if (initialPickupTime) {
      setPickupTime(initialPickupTime)
    }

    const savedDropOffTime = localStorage.getItem('search-book-transfer-dropoff-time')
    let initialDropOffTime = savedDropOffTime

    if (initialDropOffTime) {
      setDropOffTime(initialDropOffTime)
    }
  }, [])

  useEffect(() => {
    if (pickupTime) {
      localStorage.setItem('search-book-transfer-pickup-time', pickupTime)
    }
  }, [pickupTime])

  useEffect(() => {
    if (dropOffTime) {
      localStorage.setItem('search-book-transfer-dropoff-time', dropOffTime)
    }
  }, [dropOffTime])

  useEffect(() => {
    setPickupSearch(props.pickupSearch)
  }, [props.pickupSearch])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setPickupLocation([])

      const payload = {
        search: pickupSearch,
        limit: 5
      }

      const { ok, data } = await callAPI('/cities/autocomplete', 'POST', payload)

      if (ok && data) {
        setPickupLocation(data)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [pickupSearch])

  useEffect(() => {
    setDropOffSearch(props.dropOffSearch)
  }, [props.dropOffSearch])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setDropOffLocation([])

      const payload = {
        search: dropOffSearch,
        limit: 5
      }

      const { ok, data } = await callAPI('/cities/autocomplete', 'POST', payload)

      if (ok && data) {
        setDropOffLocation(data)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [dropOffSearch])

  return (
    <div className={`search-bar ${useVariant ? 'search-bar--variant search-bar--single' : ''} ${homepage ? 'search-bar--homepage' : ''}`}>
      {useVariant ? (
        <div>
          <div className="search-bar__date-split">
            <div className={`search-bar__item ${showPickupLocationDropdown ? 'search-bar__item--active' : ''} ${showDateDropdown ? 'search-bar__item--active' : ''} ${showPickupTimeDropdown ? 'search-bar__item--active' : ''}`}>
              <div className="search-bar__item-title">Pick-up</div>
              <div className="search-bar__item-content">
                <div className={`search-bar__field--text`}>
                  <div className={`search-bar__field ${pickupLocation ? 'has-value' : ''} search-bar__field--variant search-bar__field--transfer`}>
                    <SVGIcon src={Icons.Car} width={20} height={20} />
                    <input
                      type="text"
                      value={pickupSearch}
                      onChange={(e) => setPickupSearch(e.currentTarget.value)}
                      onFocus={() => setShowPickupLocationDropdown(true)}
                      onClick={() => setShowPickupLocationDropdown(true)}
                      className="search-bar__input"
                      placeholder="Pick-up location" />
                  </div>
                </div>
                <DropdownMenu show={showPickupLocationDropdown} setShow={setShowPickupLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
                  {pickupSearch ? (
                    <div className="custom-dropdown-menu__options">
                      {!!pickupLocation.length && pickupLocation.map((location, index) => (
                        <div key={`search-pickup-${index}`} onClick={() => { handleClickPickupLocationOption(location?.name) }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">{location?.name}</div>
                            <div className="custom-dropdown-menu__option-description">{getName(location?.country || '') || ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="custom-dropdown-menu__header">
                        <div className="custom-dropdown-menu__title">Popular Destination</div>
                      </div>
                      <div className="custom-dropdown-menu__options">
                        <div onClick={() => { handleClickPickupLocationOption('Jeddah') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Jeddah</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                        <div onClick={() => { handleClickPickupLocationOption('Madinah') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Madinah</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                        <div onClick={() => { handleClickPickupLocationOption('Riyadh') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Riyadh</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </DropdownMenu>
                <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''} search-bar__field--variant search-bar__field--transfer`} style={{ cursor: 'pointer', marginLeft: 8 }}>
                  <SVGIcon src={Icons.Calendar} width={20} height={20} />
                  <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('MMM DD') : 'Pick-up Date'}</div>
                </div>
                <div className="custom-dropdown">
                  <div onClick={() => setShowPickupTimeDropdown(true)} className={`search-bar__field ${pickupTime ? 'has-value' : ''} search-bar__field--variant search-bar__field--transfer`} style={{ cursor: 'pointer', marginLeft: 8 }}>
                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                    <div>{pickupTime || 'Pick-up Time'}</div>
                  </div>
                  <DropdownMenu show={showPickupTimeDropdown} setShow={setShowPickupTimeDropdown} style={{ marginTop: 36 }}>
                    <div className="custom-dropdown-menu__options">
                      {times.map((value, index) => (
                        <div key={index} onClick={() => { handleClickPickupTimeOption(value) }} className="custom-dropdown-menu__option">
                          <div className="custom-dropdown-menu__option-title">{value}</div>
                        </div>
                      ))}
                    </div>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            <div className="search-bar__date-icon">
              <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
            </div>
            <div className={`search-bar__item ${showDropOffLocationDropdown ? 'search-bar__item--active' : ''} ${showDateDropdown ? 'search-bar__item--active' : ''} ${showDropOffTimeDropdown ? 'search-bar__item--active' : ''}`}>
              <div className="search-bar__item-title">Drop-off</div>
              <div className="search-bar__item-content">
                <div className={`search-bar__field--text`}>
                  <div className={`search-bar__field ${dropOffLocation ? 'has-value' : ''} search-bar__field--variant search-bar__field--transfer`}>
                    <SVGIcon src={Icons.Car} width={20} height={20} />
                    <input
                      type="text"
                      value={dropOffSearch}
                      onChange={(e) => setDropOffSearch(e.currentTarget.value)}
                      onFocus={() => setShowDropOffLocationDropdown(true)}
                      onClick={() => setShowDropOffLocationDropdown(true)}
                      className="search-bar__input"
                      placeholder="Drop-off location?" />
                  </div>
                </div>
                <DropdownMenu show={showDropOffLocationDropdown} setShow={setShowDropOffLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
                  {dropOffSearch ? (
                    <div className="custom-dropdown-menu__options">
                      {!!dropOffLocation.length && dropOffLocation.map((location, index) => (
                        <div key={`search-dropoff-${index}`} onClick={() => { handleClickDropOffLocationOption(location?.name) }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">{location?.name}</div>
                            <div className="custom-dropdown-menu__option-description">{getName(location?.country || '') || ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="custom-dropdown-menu__header">
                        <div className="custom-dropdown-menu__title">Popular Destination</div>
                      </div>
                      <div className="custom-dropdown-menu__options">
                        <div onClick={() => { handleClickDropOffLocationOption('Jeddah') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Jeddah</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                        <div onClick={() => { handleClickDropOffLocationOption('Madinah') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Madinah</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                        <div onClick={() => { handleClickDropOffLocationOption('Riyadh') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Riyadh</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </DropdownMenu>
                <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''} search-bar__field--variant`} style={{ cursor: 'pointer' }}>
                  <SVGIcon src={Icons.Calendar} width={20} height={20} />
                  <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('MMM DD') : 'Drop-off'}</div>
                </div>
                <div className="custom-dropdown">
                  <div onClick={() => setShowDropOffTimeDropdown(true)} className={`search-bar__field ${dropOffTime ? 'has-value' : ''} search-bar__field--variant search-bar__field--transfer`} style={{ cursor: 'pointer', marginLeft: 8 }}>
                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                    <div>{dropOffTime || 'Drop-off Time'}</div>
                  </div>
                  <DropdownMenu show={showDropOffTimeDropdown} setShow={setShowDropOffTimeDropdown} style={{ marginTop: 36 }}>
                    <div className="custom-dropdown-menu__options">
                      {times.map((value, index) => (
                        <div key={index} onClick={() => { handleClickDropOffTimeOption(value) }} className="custom-dropdown-menu__option">
                          <div className="custom-dropdown-menu__option-title">{value}</div>
                        </div>
                      ))}
                    </div>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu className='search-bar__date-range--homepage' show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
            <DateRange
              months={2}
              direction="horizontal"
              ranges={[dateRange]}
              minDate={moment().toDate()}
              onChange={item => handleDateChange(item.selection)}//pp
            />
          </DropdownMenu>
        </div>
      ) : (
        <>
          <div className="search-bar__radio-fields">
            <div className="form-check">
              <input checked={!isDifferentLocation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsDifferentLocation(!e.currentTarget.checked)} className="form-check-input" type="radio" name="book-transfer-type" id="book-transfer-same-location" />
              <label className="form-check-label" htmlFor="book-transfer-same-location">
                Return to same location
              </label>
            </div>
            <div className="form-check">
              <input checked={isDifferentLocation} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsDifferentLocation(e.currentTarget.checked)} className="form-check-input" type="radio" name="book-transfer-type" id="book-transfer-different-location" />
              <label className="form-check-label" htmlFor="book-transfer-different-location">
                Return to different location
              </label>
            </div>
          </div>
          <div className={`search-bar__item search-bar__item--grow ${showPickupLocationDropdown ? 'search-bar__item--active' : ''}`}>
            <div className={`search-bar__field--text`}>
              <div className={`search-bar__field ${pickupLocation ? 'has-value' : ''}`}>
                <SVGIcon src={Icons.Car} width={20} height={20} />
                <input
                  type="text"
                  value={pickupSearch}
                  onChange={(e) => setPickupSearch(e.currentTarget.value)}
                  onFocus={() => setShowPickupLocationDropdown(true)}
                  onClick={() => setShowPickupLocationDropdown(true)}
                  className="search-bar__input"
                  placeholder="Your pick-up location?" />
              </div>
            </div>
            <DropdownMenu show={showPickupLocationDropdown} setShow={setShowPickupLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
              {pickupSearch ? (
                <div className="custom-dropdown-menu__options">
                  {!!pickupLocation.length && pickupLocation.map((location, index) => (
                    <div key={`search-pickup-${index}`} onClick={() => { handleClickPickupLocationOption(location?.name) }} className="custom-dropdown-menu__option">
                      <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                      <div>
                        <div className="custom-dropdown-menu__option-title">{location?.name}</div>
                        <div className="custom-dropdown-menu__option-description">{getName(location?.country || '') || ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="custom-dropdown-menu__header">
                    <div className="custom-dropdown-menu__title">Popular Destination</div>
                  </div>
                  <div className="custom-dropdown-menu__options">
                    <div onClick={() => { handleClickPickupLocationOption('Jeddah') }} className="custom-dropdown-menu__option">
                      <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                      <div>
                        <div className="custom-dropdown-menu__option-title">Jeddah</div>
                        <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                      </div>
                    </div>
                    <div onClick={() => { handleClickPickupLocationOption('Madinah') }} className="custom-dropdown-menu__option">
                      <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                      <div>
                        <div className="custom-dropdown-menu__option-title">Madinah</div>
                        <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                      </div>
                    </div>
                    <div onClick={() => { handleClickPickupLocationOption('Riyadh') }} className="custom-dropdown-menu__option">
                      <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                      <div>
                        <div className="custom-dropdown-menu__option-title">Riyadh</div>
                        <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DropdownMenu>
          </div>
          {isDifferentLocation && (
            <>
              <div className="search-bar__separator"></div>
              <div className={`search-bar__item  ${showDropOffLocationDropdown ? 'search-bar__item--active' : ''}`}>
                <div className={`search-bar__field--text`}>
                  <div className={`search-bar__field ${dropOffLocation ? 'has-value' : ''}`}>
                    <SVGIcon src={Icons.Car} width={20} height={20} />
                    <input
                      type="text"
                      value={dropOffSearch}
                      onChange={(e) => setDropOffSearch(e.currentTarget.value)}
                      onFocus={() => setShowDropOffLocationDropdown(true)}
                      onClick={() => setShowDropOffLocationDropdown(true)}
                      className="search-bar__input"
                      placeholder="Your drop-off location?" />
                  </div>
                </div>
                <DropdownMenu show={showDropOffLocationDropdown} setShow={setShowDropOffLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
                  {dropOffSearch ? (
                    <div className="custom-dropdown-menu__options">
                      {!!dropOffLocation.length && dropOffLocation.map((location, index) => (
                        <div key={`search-dropoff-${index}`} onClick={() => { handleClickDropOffLocationOption(location?.name) }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">{location?.name}</div>
                            <div className="custom-dropdown-menu__option-description">{getName(location?.country || '') || ''}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="custom-dropdown-menu__header">
                        <div className="custom-dropdown-menu__title">Popular Destination</div>
                      </div>
                      <div className="custom-dropdown-menu__options">
                        <div onClick={() => { handleClickDropOffLocationOption('Jeddah') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Jeddah</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                        <div onClick={() => { handleClickDropOffLocationOption('Madinah') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Madinah</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                        <div onClick={() => { handleClickDropOffLocationOption('Riyadh') }} className="custom-dropdown-menu__option">
                          <SVGIcon src={Icons.Car} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                          <div>
                            <div className="custom-dropdown-menu__option-title">Riyadh</div>
                            <div className="custom-dropdown-menu__option-description">Saudi Arabia</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </DropdownMenu>
              </div>
            </>
          )}
          <div className="search-bar__separator"></div>
          <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('ddd, MMM DD') : 'Pick-up Date'}</div>
            </div>
            <DropdownMenu className='search-bar__date-range--homepage' show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
              <DateRange
                months={2}
                direction="horizontal"
                ranges={[dateRange]}
                minDate={moment().toDate()}
                onChange={item => handleDateChange(item.selection)}
              />
            </DropdownMenu>
          </div>
          <div className="search-bar__separator"></div>
          <div className={`search-bar__item ${showPickupTimeDropdown ? 'search-bar__item--active' : ''}`}>
            <div onClick={() => setShowPickupTimeDropdown(true)} className={`search-bar__field ${pickupTime ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.CircleTime} width={20} height={20} />
              <div>{pickupTime || 'Pick-up Time'}</div>
            </div>
            <DropdownMenu show={showPickupTimeDropdown} setShow={setShowPickupTimeDropdown} style={{ marginTop: 36 }}>
              <div className="custom-dropdown-menu__options">
                {times.map((value, index) => (
                  <div key={index} onClick={() => { handleClickPickupTimeOption(value) }} className="custom-dropdown-menu__option"
                    style={{
                      backgroundColor: dropOffTime && moment(value, 'HH:mm').isSameOrAfter(moment(dropOffTime, 'HH:mm')) && moment(dateRange.startDate).isSame(dateRange.endDate, 'day') ? '#eee' : 'white',
                      cursor: dropOffTime && moment(value, 'HH:mm').isSameOrAfter(moment(dropOffTime, 'HH:mm')) && moment(dateRange.startDate).isSame(dateRange.endDate, 'day') ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <div className="custom-dropdown-menu__option-title">{value}</div>
                  </div>
                ))}
              </div>
            </DropdownMenu>
          </div>
          <div className="search-bar__separator"></div>
          <div className="search-bar__item">
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('ddd, MMM DD') : 'Drop-off Date'}</div>
            </div>
          </div>
          <div className="search-bar__separator"></div>
          <div className={`search-bar__item ${showDropOffTimeDropdown ? 'search-bar__item--active' : ''}`}>
            <div onClick={() => setShowDropOffTimeDropdown(true)} className={`search-bar__field ${dropOffTime ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.CircleTime} width={20} height={20} />
              <div>{dropOffTime || 'Drop-off Time'}</div>
            </div>
            <DropdownMenu show={showDropOffTimeDropdown} setShow={setShowDropOffTimeDropdown} style={{ marginTop: 36 }}>
              <div className="custom-dropdown-menu__options">
                {times.map((value, index) => (
                  <div key={index} onClick={() => { handleClickDropOffTimeOption(value) }} className="custom-dropdown-menu__option"
                    style={{
                      backgroundColor: pickupTime && moment(value, 'HH:mm').isSameOrBefore(moment(pickupTime, 'HH:mm')) && moment(dateRange.startDate).isSame(dateRange.endDate, 'day') ? '#eee' : 'white',
                      cursor: pickupTime && moment(value, 'HH:mm').isSameOrBefore(moment(pickupTime, 'HH:mm')) && moment(dateRange.startDate).isSame(dateRange.endDate, 'day') ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <div className="custom-dropdown-menu__option-title">{value}</div>
                  </div>
                ))}
              </div>
            </DropdownMenu>
          </div>
        </>
      )}
      <div className="search-bar__item">
        <button onClick={() => {
          onSearchChange && onSearchChange()
            ; (pickupSearch && dateRange && pickupTime && dropOffTime && ((isDifferentLocation && dropOffSearch) || (!isDifferentLocation))) && router.push({
              pathname: '/search/book-transfer',
              query: { pickup: pickupSearch, dropoff: useVariant ? dropOffSearch : (isDifferentLocation ? dropOffSearch : pickupSearch) }
            })
        }} className="btn btn-success rounded-pill search-bar__search-button">{useVariant ? 'Change Search' : 'Search Car'}</button>
      </div>
    </div>
  )
}

interface TourPackageSearchBarProps {
  homepage?: boolean
  useVariant?: boolean
  destination?: string
  date?: string
  onSearchChange?: () => void
}

export const TourPackageSearchBar = (props: TourPackageSearchBarProps) => {
  const { useVariant, homepage, onSearchChange } = props
  const router = useRouter()

  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false)
  const [location, setLocation] = useState<string>(props.destination || '')
  const handleClickLocationOption = (location: string) => {
    setLocation(location)
    setShowLocationDropdown(false)
  }

  useEffect(() => {
    setLocation(props.destination || '')
  }, [props.destination])

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [date, setDate] = useState<Date>(moment(props.date).toDate() || null)

  useEffect(() => {
    setDate(moment(props.date).toDate() || null)
  }, [props.date])


  return (
    <div className={`search-bar ${useVariant ? 'search-bar--variant search-bar--single' : ''} ${homepage ? 'search-bar--homepage' : ''}`}>
      <div className={`search-bar__item search-bar__item--grow ${showLocationDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field ${location ? 'has-value' : ''}`}>
            <SVGIcon src={Icons.Hotel} width={20} height={20} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.currentTarget.value)}
              onFocus={() => setShowLocationDropdown(true)}
              onClick={() => setShowLocationDropdown(true)}
              className="search-bar__input"
              placeholder="Where are you going?" />
          </div>
        </div>
        <DropdownMenu show={showLocationDropdown} setShow={setShowLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Popular Destination</div>
          </div>
          <div className="custom-dropdown-menu__options">
            <div onClick={() => { handleClickLocationOption('Makkah') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Makkah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Makkah</div>
              </div>
            </div>
            <div onClick={() => { handleClickLocationOption('Madinah') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Madinah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Madinah</div>
              </div>
            </div>
            <div onClick={() => { handleClickLocationOption('Riyadh') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Riyadh, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Riyadh</div>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>

      {/* For Date */}
      <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
        <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${date ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Calendar} width={20} height={20} />
          <div>{date ? moment(date).format('ddd, MMM DD') : 'Date'}</div>
        </div>
        <DropdownMenu className='search-bar__date-range--homepage' show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
          <Calendar
            months={1}
            direction="horizontal"
            date={date}
            minDate={moment().toDate()}
            onChange={date => setDate(date)}
          />
        </DropdownMenu>
      </div>
      {/* End Date */}


      <div className="search-bar__item">
        <button
          disabled={!location || !date}
          onClick={() => {
            onSearchChange && onSearchChange()
              ; (location && date && router.push({
                pathname: '/search/tour-package',
                query: { location: location, date: moment(date).format('YYYY-MM-DD') }
              }))
          }}
          className="btn btn-success rounded-pill search-bar__search-button"
        >
          {useVariant ? 'Change Search' : 'Search Tour'}
        </button></div>
    </div >
  )
}


interface SkyscannerSearchBarProps {
  homepage?: boolean
  useVariant?: boolean
  from?: string
  to?: string
  onSearchChange?: () => void
}

export const SkyscannerSearchBar = (props: SkyscannerSearchBarProps) => {
  const { useVariant, homepage, onSearchChange } = props
  const router = useRouter()

  const [isOneWay, setIsOneWay] = useState<boolean>(false)

  const [showFlightFromDropdown, setShowFlightFromDropdown] = useState<boolean>(false)
  const [flightFromSearch, setFlightFromSearch] = useState<string>('')
  const [flightFrom, setFlightFrom] = useState<FlightSearchList | null>(null)
  const [flightFromList, setFlightFromList] = useState<FlightSearchList[]>([])
  const handleClickFlightFromOption = (flightFrom: FlightSearchList) => {
    setFlightFrom(flightFrom)
    // Handle both Skyscanner and Booking.com formats
    const cityName = flightFrom.cityName || flightFrom.name
    const code = flightFrom.iataCode || flightFrom.code || flightFrom?.airportInformation?.iataCode
    setFlightFromSearch(`${cityName} (${code})`)
    setShowFlightFromDropdown(false)
  }

  const [showFlightToDropdown, setShowFlightToDropdown] = useState<boolean>(false)
  const [flightToSearch, setFlightToSearch] = useState<string>('')
  const [flightTo, setFlightTo] = useState<FlightSearchList | null>(null)
  const [flightToList, setFlightToList] = useState<FlightSearchList[]>([])
  const handleClickFlightToOption = (flightTo: FlightSearchList) => {
    setFlightTo(flightTo)
    // Handle both Skyscanner and Booking.com formats
    const cityName = flightTo.cityName || flightTo.name
    const code = flightTo.iataCode || flightTo.code || flightTo?.airportInformation?.iataCode
    setFlightToSearch(`${cityName} (${code})`)
    setShowFlightToDropdown(false)
  }

  // Effect to restore displayed text when dropdown closes
  useEffect(() => {
    if (!showFlightFromDropdown && flightFrom) {
      setFlightFromSearch(`${flightFrom.cityName || flightFrom.name} (${flightFrom.iataCode || flightFrom?.airportInformation?.iataCode})`)
    }
  }, [showFlightFromDropdown])

  useEffect(() => {
    if (!showFlightToDropdown && flightTo) {
      setFlightToSearch(`${flightTo.cityName || flightTo.name} (${flightTo.iataCode || flightTo?.airportInformation?.iataCode})`)
    }
  }, [showFlightToDropdown])

  const [showPassengerDropdown, setShowPassengerDropdown] = useState<boolean>(false)
  const [passengerHasChanged, setPassengerHasChanged] = useState<boolean>(false)
  const [passenger, setPassenger] = useState<FlightPassenger>({ adult: 1, children: 0, baby: 0, class: CabinClasses.Economy })
  const handleUpdatePassenger = (passenger: FlightPassenger) => {
    setPassenger(passenger)
    setPassengerHasChanged(true)
  }

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })
  const isDateRangeHasChanged = dateRange.startDate.getTime() !== dateRange.endDate.getTime()

  const [departureDate, setDepartureDate] = useState<Date | null>(null)

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setFlightFromList([])

      // Use Booking.com API for location search
      const response = await callBookingAPI({
        method: 'GET',
        url: `/api/v1/flights/searchDestination?query=${encodeURIComponent(flightFromSearch)}`
      })

      console.log('[FlightFrom] API Response:', response)

      if (response.ok && response.data) {
        // Handle different response formats from Booking.com
        let locations: any[] = []

        // Try to extract array from different possible response structures
        if (Array.isArray(response.data)) {
          locations = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          locations = response.data.data
        } else if (response.data?.places && Array.isArray(response.data.places)) {
          locations = response.data.places
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          locations = response.data.results
        }

        console.log('[FlightFrom] Extracted locations:', locations)

        // Only set if we got an array
        if (Array.isArray(locations)) {
          setFlightFromList(locations as FlightSearchList[])
        } else {
          console.warn('[FlightFrom] Response data is not in expected format:', response.data)
        }
      } else {
        console.error('[FlightFrom] API Error:', response.error)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [flightFromSearch])

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      setFlightToList([])

      // Use Booking.com API for location search
      const response = await callBookingAPI({
        method: 'GET',
        url: `/api/v1/flights/searchDestination?query=${encodeURIComponent(flightToSearch)}`
      })

      console.log('[FlightTo] API Response:', response)

      if (response.ok && response.data) {
        // Handle different response formats from Booking.com
        let locations: any[] = []

        // Try to extract array from different possible response structures
        if (Array.isArray(response.data)) {
          locations = response.data
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          locations = response.data.data
        } else if (response.data?.places && Array.isArray(response.data.places)) {
          locations = response.data.places
        } else if (response.data?.results && Array.isArray(response.data.results)) {
          locations = response.data.results
        }

        console.log('[FlightTo] Extracted locations:', locations)

        // Only set if we got an array
        if (Array.isArray(locations)) {
          setFlightToList(locations as FlightSearchList[])
        } else {
          console.warn('[FlightTo] Response data is not in expected format:', response.data)
        }
      } else {
        console.error('[FlightTo] API Error:', response.error)
      }
    }, 1000)

    return () => clearTimeout(delayDebounceFn)
  }, [flightToSearch])


  useEffect(() => {
    // Load saved date
    const savedDateRange = localStorage.getItem('search-skyscanner-roundtrip-date')
    let initialDateRange: Range = JSON.parse(savedDateRange)

    if (initialDateRange) {
      const startDateInLocal = new Date(initialDateRange.startDate)
      const today = new Date()

      if (startDateInLocal.getTime() < today.getTime()) {
        initialDateRange.startDate = today
      } else {
        initialDateRange.startDate = new Date(initialDateRange.startDate)
      }
      initialDateRange.endDate = new Date(initialDateRange.endDate)
      setDateRange(initialDateRange)
    }

    const savedDepartureDate = localStorage.getItem('search-skyscanner-departure-date')
    let initialDepartureDate = savedDepartureDate

    if (initialDepartureDate) {
      const departureDateInLocal = new Date(initialDepartureDate)
      const today = new Date()
      if (departureDateInLocal.getTime() < today.getTime()) {
        setDepartureDate(new Date())
      } else {
        setDepartureDate(new Date(initialDepartureDate))
      }
    }

    const savedIsOneWay = localStorage.getItem('search-skyscanner-isoneway')
    let initialIsOneWay = JSON.parse(savedIsOneWay)

    setIsOneWay(initialIsOneWay)
  }, [])

  useEffect(() => {
    if (dateRange.startDate.getTime() !== dateRange.endDate.getTime()) {
      localStorage.setItem('search-skyscanner-roundtrip-date', JSON.stringify(dateRange))
    }
  }, [dateRange])

  useEffect(() => {
    if (departureDate) {
      localStorage.setItem('search-skyscanner-departure-date', departureDate.toString())
    }
  }, [departureDate])


  const handleSearch = () => {

    onSearchChange && onSearchChange()

    if (!(((isOneWay && departureDate) || (!isOneWay && isDateRangeHasChanged)) && flightFrom && flightTo)) return

    router.push({
      pathname: '/search/skyscanner',
      query: {
        origin: flightFrom.iataCode || flightFrom?.airportInformation?.iataCode,
        destination: flightTo.iataCode || flightTo?.airportInformation?.iataCode,
        ...(isOneWay ? {
          dyear: departureDate.getFullYear(),
          dmonth: departureDate.getMonth() + 1,
          dday: departureDate.getDate()
        } : {
          dyear: dateRange.startDate.getFullYear(),
          dmonth: dateRange.startDate.getMonth() + 1,
          dday: dateRange.startDate.getDate(),
          ryear: dateRange.endDate.getFullYear(),
          rmonth: dateRange.endDate.getMonth() + 1,
          rday: dateRange.endDate.getDate()
        }),
        adults: passenger.adult,
        // TODO: Integrate children passenger feature, currently skipped
        // childrens: 0,
        cabinclass: 'CABIN_CLASS_' + passenger.class.replace(/\s/g, '_').toUpperCase(),
      }
    })
  }

  return (
    <div className={`search-bar ${homepage ? 'search-bar--homepage' : ''}`}>
      <div className="search-bar__radio-fields">
        <div className="form-check">
          <input checked={!isOneWay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsOneWay(!e.currentTarget.checked)
            localStorage.setItem('search-skyscanner-isoneway', JSON.stringify(!e.currentTarget.checked))
          }} className="form-check-input" type="radio" name="flight-search-type" id="flight-search-round-trip" />
          <label className="form-check-label" htmlFor="flight-search-round-trip">
            Round-trip
          </label>
        </div>
        <div className="form-check">
          <input checked={isOneWay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setIsOneWay(e.currentTarget.checked)
            localStorage.setItem('search-skyscanner-isoneway', JSON.stringify(e.currentTarget.checked))
          }} className="form-check-input" type="radio" name="flight-search-type" id="flight-search-one-way" />
          <label className="form-check-label" htmlFor="flight-search-one-way">
            One-way
          </label>
        </div>
      </div>
      <div className={`search-bar__item search-bar__item--grow ${showFlightFromDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field ${flightFromSearch ? 'has-value' : ''}`}>
            <SVGIcon src={Icons.AirplaneTakeOff} width={20} height={20} />
            <input
              type="text"
              value={flightFromSearch}
              onChange={(e) => setFlightFromSearch(e.currentTarget.value)}
              onFocus={() => setShowFlightFromDropdown(true)}
              onClick={() => setShowFlightFromDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowFlightFromDropdown(false)
                }, 200)
              }}
              className="search-bar__input"
              placeholder="Where from?" />
          </div>
        </div>
        <DropdownMenu show={showFlightFromDropdown} setShow={setShowFlightFromDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__options">
            {flightFromList.map((item) => (
              <div key={item.id || item.entityId || item.code} onClick={() => { handleClickFlightFromOption(item) }} className="custom-dropdown-menu__option">
                <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                <div>
                  <div className="custom-dropdown-menu__option-title">
                    {[item.cityName || item.name, item.countryName].filter(value => value).join(', ')}
                  </div>
                  <div className="custom-dropdown-menu__option-description">
                    {[
                      item.iataCode || item.code || item?.airportInformation?.iataCode,
                      item.type === 'PLACE_TYPE_CITY' ? `All Airports in ${item.cityName}` : item.name,
                      item.type === 'AIRPORT' && item.cityName ? `${item.cityName}` : null
                    ].filter(value => value).join(' - ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenu>
      </div>
      <div style={{ marginInline: -16, flex: 'none', alignSelf: 'center' }}>
        <SVGIcon src={isOneWay ? Icons.ArrowRight : Icons.ArrowLeftRight} width={20} height={20} color="#9E9E9E" />
      </div>
      <div className={`search-bar__item search-bar__item--grow ${showFlightToDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field ${flightTo ? 'has-value' : ''}`}>
            <SVGIcon src={Icons.AirplaneLanding} width={20} height={20} />
            <input
              type="text"
              value={flightToSearch}
              onChange={(e) => setFlightToSearch(e.currentTarget.value)}
              onFocus={() => setShowFlightToDropdown(true)}
              onClick={() => setShowFlightToDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  setShowFlightToDropdown(false)
                }, 200)
              }}
              className="search-bar__input"
              placeholder="Where to?" />
          </div>
        </div>
        <DropdownMenu show={showFlightToDropdown} setShow={setShowFlightToDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__options">
            {flightToList.map((item) => (
              <div key={item.id || item.entityId || item.code} onClick={() => { handleClickFlightToOption(item) }} className="custom-dropdown-menu__option">
                <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                <div>
                  <div className="custom-dropdown-menu__option-title">
                    {[item.cityName || item.name, item.countryName].filter(value => value).join(', ')}
                  </div>
                  <div className="custom-dropdown-menu__option-description">
                    {[
                      item.iataCode || item.code || item?.airportInformation?.iataCode,
                      item.type === 'PLACE_TYPE_CITY' ? `All Airports in ${item.cityName}` : item.name,
                      item.type === 'AIRPORT' && item.cityName ? `${item.cityName}` : null
                    ].filter(value => value).join(' - ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      {!isOneWay && (
        <>
          <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('ddd, MMM DD') : 'Departure'}</div>
            </div>
            <DropdownMenu className='search-bar__date-range--homepage' show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
              <DateRange
                months={2}
                direction="horizontal"
                ranges={[dateRange]}
                minDate={moment().toDate()}
                onChange={item => setDateRange(item.selection)}
              />
            </DropdownMenu>
          </div>
          <div className="search-bar__separator"></div>
          <div className="search-bar__item">
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('ddd, MMM DD') : 'Return'}</div>
            </div>
          </div>
          <div className="search-bar__separator"></div>
        </>
      )}

      {isOneWay && (
        <>
          <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${departureDate ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{departureDate ? moment(departureDate).format('ddd, MMM DD') : 'Departure'}</div>
            </div>
            <DropdownMenu className='search-bar__date-range--homepage' show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
              <Calendar
                months={1}
                direction="horizontal"
                date={departureDate}
                minDate={moment().toDate()}
                onChange={date => setDepartureDate(date)}
              />
            </DropdownMenu>
          </div>
          <div className="search-bar__separator"></div>
        </>
      )}
      <div className={`search-bar__item ${showPassengerDropdown ? 'search-bar__item--active' : ''}`}>
        <div onClick={() => setShowPassengerDropdown(true)} className={`search-bar__field ${passengerHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Users} width={20} height={20} />
          <div>{passenger.adult} adult</div>
          <div className="search-bar__field-bullet" />
          {passenger.children > 0 && (
            <>
              <div>{passenger.children} children</div>
              <div className="search-bar__field-bullet" />
            </>
          )}
          {passenger.baby > 0 && (
            <>
              <div>{passenger.baby} baby</div>
              <div className="search-bar__field-bullet" />
            </>
          )}
          <div>{passenger.class}</div>
        </div>

        <DropdownMenu show={showPassengerDropdown} setShow={setShowPassengerDropdown} className="search-bar__passenger-dropdown search-bar__passenger-dropdown--flex" style={{ marginTop: 36, width: 578 }}>
          <div className="search-bar__passenger-dropdown-column">
            <div className="custom-dropdown-menu__header">
              <div className="custom-dropdown-menu__title">Passenger</div>
            </div>
            <div className="custom-dropdown-menu__options">
              <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="search-bar__passenger-option">
                  <div className="search-bar__passenger-option-type">
                    <div>Adult</div>
                    <div className="search-bar__passenger-option-type-small">Age 16+</div>
                  </div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, adult: passenger.adult - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.adult <= 1}>
                      <SVGIcon src={Icons.Minus} width={20} height={20} />
                    </button>
                  </div>
                  <div className="search-bar__passenger-option-value">{passenger.adult}</div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, adult: passenger.adult + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.adult >= 8}>
                      <SVGIcon src={Icons.Plus} width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="search-bar__passenger-option">
                  <div className="search-bar__passenger-option-type">
                    <div>Children</div>
                    <div className="search-bar__passenger-option-type-small">Age 0 - 15</div>
                  </div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, children: passenger.children - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.children <= 0}>
                      <SVGIcon src={Icons.Minus} width={20} height={20} />
                    </button>
                  </div>
                  <div className="search-bar__passenger-option-value">{passenger.children}</div>
                  <div>
                    <button onClick={() => handleUpdatePassenger({ ...passenger, children: passenger.children + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.children >= 8}>
                      <SVGIcon src={Icons.Plus} width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="search-bar__passenger-dropdown-column">
            <div className="custom-dropdown-menu__header">
              <div className="custom-dropdown-menu__title">Cabin Class</div>
            </div>
            <div className="custom-dropdown-menu__options">
              {getEnumAsArray(CabinClasses).map((item, index) => (
                <div onClick={() => handleUpdatePassenger({ ...passenger, class: CabinClasses[item] })} key={index} className="custom-dropdown-menu__option">
                  <div className={`search-bar__passenger-option ${passenger.class === CabinClasses[item] ? 'search-bar__passenger-option--checked' : ''}`}>
                    <div className="search-bar__passenger-option-type">{CabinClasses[item]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__item">
        <button onClick={handleSearch} type="button" className="btn btn-success rounded-pill search-bar__search-button">Search Flight</button>
      </div>
    </div>
  )
}
// End:: Home Page Search Bar & Each Service Header Search Bar


export const CarSearchBar = () => {
  const [showPickUpDropdown, setShowPickUpDropdown] = useState<boolean>(false)
  const [showDropOffDropdown, setShowDropOffDropdown] = useState<boolean>(false)
  const [pickUp, setPickUp] = useState<string>('')
  const [dropOff, setDropOff] = useState<string>('')
  const handleClickPickUpOption = (pickUp: string) => {
    setPickUp(pickUp)
    setShowPickUpDropdown(false)
  }
  const handleClickDropOffOption = (dropOff: string) => {
    setDropOff(dropOff)
    setShowDropOffDropdown(false)
  }

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    // endDate: moment().add(1, 'day').toDate(),
    key: 'selection',
  })
  const isDateRangeHasChanged = dateRange.startDate.getTime() !== dateRange.endDate.getTime()


  return (
    <div className={`search-bar search-bar--variant search-bar--single`}>
      <div>
        <div className="search-bar__date-split">
          <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''} ${showPickUpDropdown ? 'search-bar__item--active' : ''}`}>
            <div className="search-bar__item-title">Check In</div>
            <div className="search-bar__item-content">
              <div className={`search-bar__field--text`}>
                <div className={`search-bar__field ${pickUp ? 'has-value' : ''} search-bar__field--variant search-bar__field--transfer`}>
                  <SVGIcon src={Icons.Hotel} width={20} height={20} />
                  <input
                    type="text"
                    value={pickUp}
                    onChange={(e) => setPickUp(e.currentTarget.value)}
                    onFocus={() => setShowPickUpDropdown(true)}
                    onClick={() => setShowPickUpDropdown(true)}
                    className="search-bar__input"
                    placeholder="Pick-up" />
                </div>
              </div>
              <DropdownMenu show={showPickUpDropdown} setShow={setShowPickUpDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36 }}>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Popular Destination</div>
                </div>
                <div className="custom-dropdown-menu__options">
                  <div onClick={() => { handleClickPickUpOption('Jeddah') }} className="custom-dropdown-menu__option">
                    <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                    <div>
                      <div className="custom-dropdown-menu__option-title">Jeddah</div>
                      <div className="custom-dropdown-menu__option-description">Jeddah, Saudi Arabia</div>
                    </div>
                  </div>
                  <div onClick={() => { handleClickPickUpOption('Madinah') }} className="custom-dropdown-menu__option">
                    <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                    <div>
                      <div className="custom-dropdown-menu__option-title">Madinah</div>
                      <div className="custom-dropdown-menu__option-description">Madinah, Saudi Arabia</div>
                    </div>
                  </div>
                  <div onClick={() => { handleClickPickUpOption('Riyadh') }} className="custom-dropdown-menu__option">
                    <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                    <div>
                      <div className="custom-dropdown-menu__option-title">Riyadh</div>
                      <div className="custom-dropdown-menu__option-description">Riyadh, Saudi Arabia</div>
                    </div>
                  </div>
                </div>
              </DropdownMenu>

              <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''} search-bar__field--variant`} style={{ cursor: 'pointer' }}>
                <SVGIcon src={Icons.Calendar} width={20} height={20} />
                <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('MMM DD') : 'Check in'}</div>
              </div>
            </div>
          </div>
          <div className="search-bar__date-icon">
            <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
          </div>
          <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''} ${showDropOffDropdown ? 'search-bar__item--active' : ''}`}>
            <div className="search-bar__item-title">Check Out</div>
            <div className="search-bar__item-content">
              <div className={`search-bar__field--text`}>
                <div className={`search-bar__field ${dropOff ? 'has-value' : ''} search-bar__field--variant search-bar__field--transfer`}>
                  <SVGIcon src={Icons.Hotel} width={20} height={20} />
                  <input
                    type="text"
                    value={dropOff}
                    onChange={(e) => setDropOff(e.currentTarget.value)}
                    onFocus={() => setShowDropOffDropdown(true)}
                    onClick={() => setShowDropOffDropdown(true)}
                    className="search-bar__input"
                    placeholder="Pick-up" />
                </div>
              </div>
              <DropdownMenu show={showDropOffDropdown} setShow={setShowDropOffDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36 }}>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Popular Destination</div>
                </div>
                <div className="custom-dropdown-menu__options">
                  <div onClick={() => { handleClickDropOffOption('Jeddah') }} className="custom-dropdown-menu__option">
                    <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                    <div>
                      <div className="custom-dropdown-menu__option-title">Jeddah</div>
                      <div className="custom-dropdown-menu__option-description">Jeddah, Saudi Arabia</div>
                    </div>
                  </div>
                  <div onClick={() => { handleClickDropOffOption('Madinah') }} className="custom-dropdown-menu__option">
                    <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                    <div>
                      <div className="custom-dropdown-menu__option-title">Madinah</div>
                      <div className="custom-dropdown-menu__option-description">Madinah, Saudi Arabia</div>
                    </div>
                  </div>
                  <div onClick={() => { handleClickDropOffOption('Riyadh') }} className="custom-dropdown-menu__option">
                    <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                    <div>
                      <div className="custom-dropdown-menu__option-title">Riyadh</div>
                      <div className="custom-dropdown-menu__option-description">Riyadh, Saudi Arabia</div>
                    </div>
                  </div>
                </div>
              </DropdownMenu>
              <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''} search-bar__field--variant`} style={{ cursor: 'pointer' }}>
                <SVGIcon src={Icons.Calendar} width={20} height={20} />
                <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('MMM DD') : 'Check in'}</div>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
          <DateRange
            months={2}
            direction="horizontal"
            ranges={[dateRange]}
            minDate={moment().toDate()}
            onChange={item => setDateRange(item.selection)}
          />
        </DropdownMenu>
      </div>
      <div className="search-bar__item">
        <button className="btn btn-success rounded-pill search-bar__search-button">Change Search</button>
      </div>
    </div>
  )
}

export const BBlogPageSearchBar = () => {
  return (
    <div className="search-bar">
      <div className="search-bar__item search-bar__item--grow">
        <div className="search-bar__field">
          <SVGIcon src={Icons.Search} width={20} height={20} />
          <div>Search your articles</div>
        </div>
      </div>
      <div className="search-bar__separator"></div>
      <div className="search-bar__item">
        <div className="search-bar__field">
          <SVGIcon src={Icons.Filter} width={20} height={20} />
          <div>Filter</div>
        </div>
      </div>
      <div className="search-bar__item">
        <button className="btn btn-success rounded-pill search-bar__search-button">Search Article</button>
      </div>
    </div>
  )
}

export const BlogPageSearchBar = ({ search: initialSearch, filter: initialFilter }) => {
  const [filter, setFilter] = useState(null)
  const [search, setSearch] = useState(initialSearch || '')
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false)
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)
  const [selectedFilter, setSelectedFilter] = useState(initialFilter || '')
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  const getAutocompleteOptions = async (inputValue) => {
    const { data, ok, error } = await callAPI('/blog/show', 'POST');
    if (ok) {
      const filteredOptions = data.map(blog => blog.title)
        .filter(option => option.toLowerCase().includes(inputValue.toLowerCase()));
      setAutocompleteOptions(filteredOptions);
    } else {
      console.error('Error fetching blog titles:', error);
    }
  };

  const getFilterData = async () => {
    const { data, ok, error } = await callAPI('/blog-category/show', 'POST');
    if (ok) {
      setFilter(data || [])
    }
  }


  useEffect(() => {
    getFilterData()
  }, [])

  useEffect(() => {
    getAutocompleteOptions(search);
  }, [search]);


  const handleClickPickupTimeOption = (selectedFilter) => {
    setSelectedFilter(selectedFilter)
    setShowFilterDropdown(false)
  }
  const handleClickLocationOption = (search: string) => {
    setSearch(search)
    setShowSearchDropdown(false)
  }

  const handleChange = (value) => {
    setShowSearchDropdown(true)
    setSearch(value)
    getAutocompleteOptions(value);
  }

  return (
    <div className="search-bar search-bar--homepage">
      <div className={`search-bar__item search-bar__item--grow ${showSearchDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field ${search ? 'has-value' : ''} `}>
            <SVGIcon src={Icons.Search} width={20} height={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleChange(e.target.value)}
              className="search-bar__input"
              placeholder="Search your articles" />
          </div>
        </div>
        <DropdownMenu show={showSearchDropdown} setShow={setShowSearchDropdown} className="search-bar__location-dropdown--blog" style={{ marginTop: 24, width: 396 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Popular Blog</div>
          </div>
          <div className="custom-dropdown-menu__options">
            {autocompleteOptions.map((option, index) => (
              <div key={index} onClick={() => handleClickLocationOption(option)} className="custom-dropdown-menu__option">
                <SVGIcon src={Icons.Search} width={16} height={16} />
                <div className="custom-dropdown-menu__option-title">{option}</div>
              </div>
            ))}
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      <div className={`search-bar__item ${showFilterDropdown ? 'search-bar__item--active' : ''}`}>

        <div onClick={() => setShowFilterDropdown(true)} className={`search-bar__field ${selectedFilter ? 'has-value' : ''} `} style={{ cursor: 'pointer', marginLeft: 8 }}>
          <SVGIcon src={Icons.Filter} width={20} height={20} />
          <div>{selectedFilter || 'Filter'}</div>
        </div>
        <DropdownMenu show={showFilterDropdown} setShow={setShowFilterDropdown} style={{ marginTop: 36 }}>
          <div className="custom-dropdown-menu__options">
            {filter && filter.map((value, index) => (
              <div key={index} onClick={() => { handleClickPickupTimeOption(value.name) }} className="custom-dropdown-menu__option">
                <SVGIcon src={Icons.Filter} width={16} height={16} />
                <div className="custom-dropdown-menu__option-title">{value.name}</div>
              </div>
            ))}
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__item">
        <Link href={`/blog/result?search=${search}&filter=${selectedFilter}`} className="btn btn-success rounded-pill search-bar__search-button">Search Blogs</Link>
      </div>
    </div>
  )
}

export const CareerPageSearchBar = () => {
  const jobLocation = ['Dubai, UAE', 'Istanbul, Turkey', 'Singapore, Singapore', 'Mumbai, India', 'Sydney, Australia', 'London, UK', 'Amsterdam, Netherland']
  const [search, setSearch] = useState<string>('')
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false)
  const [showJobLocationDropdown, setShowJobLocationDropdown] = useState<boolean>(false)
  const [pickupTime, setPickupTime] = useState<string>('')
  const handleClickPickupTimeOption = (pickupTime: string) => {
    setPickupTime(pickupTime)
    setShowJobLocationDropdown(false)
  }
  const handleClickLocationOption = (search: string) => {
    setSearch(search)
    setShowSearchDropdown(false)
  }
  return (
    <div className="search-bar search-bar--homepage">
      <div className={`search-bar__item search-bar__item--grow ${showSearchDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field--text`}>
          <div className={`search-bar__field ${search ? 'has-value' : ''} `}>
            <SVGIcon src={Icons.Search} width={20} height={20} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              onFocus={() => setShowSearchDropdown(true)}
              onClick={() => setShowSearchDropdown(true)}
              className="search-bar__input"
              placeholder="Search for jobs by title or keyboard" />
          </div>
        </div>
        <DropdownMenu show={showSearchDropdown} setShow={setShowSearchDropdown} className="search-bar__location-dropdown" style={{ marginTop: 24, width: 396 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Popular Jobs</div>
          </div>
          <div className="custom-dropdown-menu__options">
            <div onClick={() => { handleClickLocationOption('Software Engineer') }} className="custom-dropdown-menu__option">
              <div>
                <div className="custom-dropdown-menu__option-title">Software Engineer</div>
                <div className="custom-dropdown-menu__option-description">Microsoft - Technology</div>
              </div>
            </div>
            <div onClick={() => { handleClickLocationOption('Customer Support') }} className="custom-dropdown-menu__option">
              <div>
                <div className="custom-dropdown-menu__option-title">Customer Support</div>
                <div className="custom-dropdown-menu__option-description">Netflix - Entertainment</div>
              </div>
            </div>
            <div onClick={() => { handleClickLocationOption('Sales Associate') }} className="custom-dropdown-menu__option">
              <div>
                <div className="custom-dropdown-menu__option-title">Sales Associate</div>
                <div className="custom-dropdown-menu__option-description">Coca-Cola - Beverage</div>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      <div className={`search-bar__item ${showJobLocationDropdown ? 'search-bar__item--active' : ''}`}>
        <div onClick={() => setShowJobLocationDropdown(true)} className={`search-bar__field ${pickupTime ? 'has-value' : ''} `} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
          <div>{pickupTime || 'Location'}</div>
        </div>
        <DropdownMenu show={showJobLocationDropdown} setShow={setShowJobLocationDropdown} style={{ marginTop: 36 }}>
          <div className="custom-dropdown-menu__options">
            {jobLocation.map((value, index) => (
              <div key={index} onClick={() => { handleClickPickupTimeOption(value) }} className="custom-dropdown-menu__option">
                <div className="custom-dropdown-menu__option-title">{value}</div>
              </div>
            ))}
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__item">
        <button className="btn btn-success rounded-pill search-bar__search-button">Search Jobs</button>
      </div>
    </div>
  )
}
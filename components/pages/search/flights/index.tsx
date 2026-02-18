import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { CabinClasses, Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import RangeSlider from '@/components/elements/rangeSlider'
import airlineQatarAirways from '@/assets/images/airline_partner_qatar_airways.png'
import { useRouter } from 'next/router'
import moment from 'moment'
import { callMystiflyAPI, callBookingAPI} from '@/lib/axiosHelper'
import DropdownMenu from '@/components/elements/dropdownMenu'
import mystiflyResponseExample from '@/mystifly-response-example.json'
import airlines from '@/lib/db/airlines.json'
import LoadingOverlay from '@/components/loadingOverlay/index'
import { useFlightStore } from '@/lib/stores/flightStore'


import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

const airportToCityMap: { [key: string]: string } = {
  // Indonesia - City codes
  'JKT': 'Jakarta',
  'SUB': 'Surabaya', 
  'DPS': 'Denpasar',
  'MES': 'Medan',
  
  // Airport codes
  'CGK': 'Jakarta',
  'HLP': 'Jakarta',
  'JED': 'Jeddah',
  'KNO': 'Medan',
  'UPG': 'Makassar',
  'BTH': 'Batam',
  'PLM': 'Palembang',
  'BDO': 'Bandung',
  'SRG': 'Semarang',
  'SOC': 'Solo',
  'YIA': 'Yogyakarta',
  'MLG': 'Malang',
  'BPN': 'Balikpapan',
  'PKU': 'Pekanbaru',
  'PDG': 'Padang',
  'TKG': 'Bandar Lampung',
  'BDJ': 'Banjarmasin',
  'AMQ': 'Ambon',
  'MDC': 'Manado',
  
  // International
  'SIN': 'Singapore',
  'KUL': 'Kuala Lumpur',
  'BKK': 'Bangkok',
  'HKG': 'Hong Kong',
  'TPE': 'Taipei',
  'ICN': 'Seoul',
  'NRT': 'Tokyo',
  'HND': 'Tokyo',
  'PEK': 'Beijing',
  'PVG': 'Shanghai',
  'SYD': 'Sydney',
  'MEL': 'Melbourne',
  'DXB': 'Dubai',
  'DOH': 'Doha',
  'JFK': 'New York',
  'LAX': 'Los Angeles',
  'LHR': 'London',
  'CDG': 'Paris',
  'FRA': 'Frankfurt',
  'AMS': 'Amsterdam',
}

// Function to get city name from IATA code
const getCityName = (iataCode: string): string => {
  return airportToCityMap[iataCode] || iataCode
}

const SearchFlights = () => {
  const MYSTIFLY_PASSENGERS = {
    'ADT': 'Adult',
    'CHD': 'Children',
    'INF': 'Baby'
  }
  const MYSTIFLY_CABIN_CLASSES = {
    'Y': 'Economy',
    'S': 'Premium Economy',
    'C': 'Business',
    'F': 'First'
  }
  const SKYSCANNER_CABIN_CLASSES = {
    'Y': 'CABIN_CLASS_ECONOMY',
    'S': 'CABIN_CLASS_PREMIUM_ECONOMY',
    'C': 'CABIN_CLASS_BUSINESS',
    'F': 'CABIN_CLASS_FIRST'
  }

  const itemsPerPage = 10
  const sortByOptions = {
    best: 'Best',
    cheapest: 'Cheapest',
    fastest: 'Fastest'
  }

  const stopOptions = {
    direct: 'Direct',
    oneStop: '1 stop',
    moreThanOneStop: '> 1 stop'
  }

  const router = useRouter()
  const { origin, destination, dyear, dmonth, dday, ryear, rmonth, rday, adt, chd, inf, cabin } = router.query || {}

  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<any[]>([])
  const [airportMap, setAirportMap] = useState<Record<string, string>>({})

  const [sortBy, setSortBy] = useState<string>(Object.keys(sortByOptions)[0])
  const [showSortByDropdown, setShowSortByDropdown] = useState<boolean>(false)

  const [currentPage, setCurrentPage] = useState<number>(1)

  const [filtersData, setFiltersData] = useState({
    carriers: {},
    duration: [0, 0],
    stops: stopOptions
  })

  const [filters, setFilters] = useState({
    carriers: [],
    duration: [0, 0],
    stops: [...Object.keys(stopOptions)]
  })

  const loadFlights = async () => {
    if (!(origin && destination && dyear && dmonth && dday && adt)) return

    setLoading(true)

      const formatDate = (year: string, month: string, day: string) => {
      const paddedMonth = String(month).padStart(2, '0')
      const paddedDay = String(day).padStart(2, '0')
      return `${year}-${paddedMonth}-${paddedDay}T00:00:00`
    }

      const payload = {
      OriginDestinationInformations: [
        {
          DepartureDateTime: formatDate(dyear as string, dmonth as string, dday as string),
          OriginLocationCode: origin,
          DestinationLocationCode: destination
        }, 
        ...((ryear && rmonth && rday) ? [{
          DepartureDateTime: formatDate(ryear as string, rmonth as string, rday as string),
          OriginLocationCode: destination,
          DestinationLocationCode: origin
        }] : [])
      ],
      TravelPreferences: {
        MaxStopsQuantity: 'All',
        CabinPreference: cabin,
        Preferences: {
          CabinClassPreference: {
            CabinType: cabin,
            PreferenceLevel: "Restricted"
          }
        },
        AirTripType: (ryear && rmonth && rday) ? 'Return' : 'OneWay'
      },
      PricingSourceType: "Public",
      IsRefundable: true,
      PassengerTypeQuantities: [
        {
          Code: "ADT",
          Quantity: parseInt(adt as string || '1')
        },
        ...(parseInt(chd as string || '0') > 0 ? [{
          Code: "CHD",
          Quantity: parseInt(chd as string || '0')
        }] : []),
        ...(parseInt(inf as string || '0') > 0 ? [{
          Code: "INF",
          Quantity: parseInt(inf as string || '0')
        }] : [])
      ],
      RequestOptions: "Fifty",
      NearByAirports: true,
      Target: process.env.NODE_ENV === 'production' ? 'Production' : 'Test',
    }

    console.log('[Mystifly] Request Payload:', JSON.stringify(payload, null, 2))
    console.log('[Mystifly] Is One Way:', !(ryear && rmonth && rday))


    const { ok, data, status, error } = await callMystiflyAPI({
    url: 'https://restapidemo.myfarebox.com/api/v1/search/flight',
    method: 'POST',
    data: payload
  })

  if (!ok) {
    console.error('[Mystifly] API Error:', { status, error, data })
  }

  console.log('[Mystifly] Response:', { ok, status, dataLength: data?.Data?.PricedItineraries?.length })


    if (ok && data) {
      const itineraries = data?.Data?.PricedItineraries

      const newFormattedData = (itineraries || []).map((data, index) => {
        const firstLeg = data?.OriginDestinationOptions[0]
        const firstLegSegmentsData = (firstLeg?.FlightSegments || [])
        const getAirportName = (iata?: string) => {
          if (!iata) return ''
          return airportMap[iata] || iata
        }

        const firstLegSegments = firstLegSegmentsData.map(segment => {
          const originIata = segment?.DepartureAirportLocationCode
          const destinationIata = segment?.ArrivalAirportLocationCode

          return {
            originIata,
            originName: getAirportName(originIata),
            destinationIata,
            destinationName: getAirportName(destinationIata),
            departureDateTime: segment?.DepartureDateTime,
            arrivalDateTime: segment?.ArrivalDateTime,
            journeyDuration: segment?.JourneyDuration || 0,
            cabinClass: segment?.CabinClassType,
            airline: {
              code: segment?.MarketingAirlineCode,
              flightNumber: segment?.FlightNumber,
              name: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.name || '',
              image: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.image || ''
            },
            mealCode: segment?.MealCode
          }
        })
        const firstLegCarriers = []
        firstLegSegmentsData.map(segment => {
          firstLegCarriers.findIndex(carrier => carrier?.name === segment?.MarketingAirlineCode) === -1 && firstLegCarriers.push({
            name: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.name || segment?.MarketingAirlineCode || '',
            imageUrl: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.image || '',
          })
        })
        const firstLegDepartureDateTime = firstLegSegmentsData.length ? firstLegSegmentsData[0]?.DepartureDateTime : null
        const firstLegArrivalDateTime = firstLegSegmentsData.length ? firstLegSegmentsData[0]?.ArrivalDateTime : null
        const firstLegDurationInMinutes = firstLegSegmentsData.length ? firstLegSegmentsData.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0) : 0
        const firstLegStopCount = firstLegSegmentsData.length ? firstLegSegmentsData.length - 1 : 0


        const secondLeg = data?.OriginDestinationOptions.length > 1 ? data?.OriginDestinationOptions[1] : null
        const secondLegSegmentsData = (secondLeg?.FlightSegments || [])
        const secondLegSegments = secondLegSegmentsData.map(segment => {
          const originIata = segment?.DepartureAirportLocationCode
          const destinationIata = segment?.ArrivalAirportLocationCode

          
          return {
            originIata,
            originName: getAirportName(originIata),
            destinationIata,
            destinationName: getAirportName(destinationIata),
            departureDateTime: segment?.DepartureDateTime,
            arrivalDateTime: segment?.ArrivalDateTime,
            journeyDuration: segment?.JourneyDuration || 0,
            cabinClass: segment?.CabinClassType,
            airline: {
              code: segment?.MarketingAirlineCode,
              flightNumber: segment?.FlightNumber,
              name: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.name || '',
              image: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.image || ''
            },
            mealCode: segment?.MealCode
          }
        })
        const secondLegCarriers = []
        secondLegSegmentsData.map(segment => {
          secondLegCarriers.findIndex(carrier => carrier?.name === segment?.MarketingAirlineCode) === -1 && secondLegCarriers.push({
            name: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.name || segment?.MarketingAirlineCode || '',
            imageUrl: (airlines as any[]).find(({ code }) => code === segment?.MarketingAirlineCode)?.image || '',
          })
        })
        const secondLegDepartureDateTime = secondLegSegmentsData.length ? secondLegSegmentsData[0]?.DepartureDateTime : null
        const secondLegArrivalDateTime = secondLegSegmentsData.length ? secondLegSegmentsData[0]?.ArrivalDateTime : null
        const secondLegDurationInMinutes = secondLegSegmentsData.length ? secondLegSegmentsData.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0) : 0
        const secondLegStopCount = secondLegSegmentsData.length ? secondLegSegmentsData.length - 1 : 0

        return ({
          fareSourceCode: data?.AirItineraryPricingInfo?.FareSourceCode,
          price: {
            amount: data?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.Amount,
            unit: data?.AirItineraryPricingInfo?.ItinTotalFare?.TotalFare?.CurrencyCode,
          },
          priceBreakdowns: [
            ...((data?.AirItineraryPricingInfo?.PTC_FareBreakdowns || []).map((fare, index) => ((fare?.PassengerFare?.EquivFare || fare?.PassengerFare?.BaseFare) && fare?.PassengerTypeQuantity) && ({
              label: (fare?.PassengerTypeQuantity?.Code && fare?.PassengerTypeQuantity?.Quantity) ? `Ticket (${fare?.PassengerTypeQuantity?.Quantity} ${MYSTIFLY_PASSENGERS[fare?.PassengerTypeQuantity?.Code] || ''})` : `Ticket (Passenger ${index + 1})`,
              amount: `${(parseFloat(fare?.PassengerFare?.EquivFare?.Amount || fare?.PassengerFare?.BaseFare?.Amount) * parseInt(fare?.PassengerTypeQuantity?.Quantity.toString())).toFixed(2)} ${fare?.PassengerFare?.EquivFare?.CurrencyCode || fare?.PassengerFare?.BaseFare?.CurrencyCode}`
            })).filter(value => value)),
            ...(data?.AirItineraryPricingInfo?.ItinTotalFare?.TotalTax ? [{
              label: 'Taxes and fees',
              amount: `${data?.AirItineraryPricingInfo?.ItinTotalFare?.TotalTax?.Amount} ${data?.AirItineraryPricingInfo?.ItinTotalFare?.TotalTax?.CurrencyCode}`
            }] : []),
          ],
          firstLeg,
          firstLegSegments,
          firstLegCarriers,
          firstLegDepartureDateTime,
          firstLegArrivalDateTime,
          firstLegDurationInMinutes,
          firstLegStopCount,
          secondLeg,
          secondLegSegments,
          secondLegCarriers,
          secondLegDepartureDateTime,
          secondLegArrivalDateTime,
          secondLegDurationInMinutes,
          secondLegStopCount,
        })
      })

      const durations = []
      const carriers = {}

      newFormattedData.map(data => {
        const duration = parseInt(data?.firstLegDurationInMinutes.toString() || '0') + parseInt(data?.secondLegDurationInMinutes.toString() || '0')
        if (!durations.includes(duration)) durations.push(duration)

        data?.firstLegCarriers.map(carrier => {
          if (carrier?.name) carriers[carrier.name] = { name: carrier.name }
        })

        data?.secondLegCarriers.map(carrier => {
          if (carrier?.name) carriers[carrier.name] = { name: carrier.name }
        })
      })

      setFiltersData(prevState => ({ ...prevState, duration: [Math.min(...durations), Math.max(...durations)], carriers }))

      setData(newFormattedData)

    } else {

      setData([]) // biar UI no-results yang tampil

    }

    setLoading(false)
  }

  useEffect(() => {
    if (filtersData.carriers) {
      setFilters(prevState => ({ ...prevState, carriers: Object.keys(filtersData.carriers) }))
    }

    if (filtersData.duration) {
      setFilters(prevState => ({ ...prevState, duration: [(60 * Math.floor(filtersData.duration[0] / 60)), (60 * Math.ceil(filtersData.duration[1] / 60))] }))
    }
  }, [filtersData])

  useEffect(() => {
    loadFlights()
  }, [router.query])

  const filteredData = data.filter(data => {
    const isFilteredStops =
  filters.stops.length === 0
    ? true
    : filters.stops.some((key) => {
        if (key === 'moreThanOneStop') {
          return data?.firstLegStopCount > 1 || data?.secondLegStopCount > 1
        }
        if (key === 'oneStop') {
          return data?.firstLegStopCount === 1 || data?.secondLegStopCount === 1
        }
        return data?.firstLegStopCount === 0 || data?.secondLegStopCount === 0
      })

    const isFilteredDuration = !!(parseInt(data?.firstLegDurationInMinutes || '0') + parseInt(data?.secondLegDurationInMinutes || '0') >= filters.duration[0] && parseInt(data?.firstLegDurationInMinutes || '0') + parseInt(data?.secondLegDurationInMinutes || '0') <= filters.duration[1])

    const isFilteredCarriers = !!([...(data?.firstLegCarriers || []), ...(data?.secondLegCarriers || [])].filter((carrier) => filters.carriers.includes(carrier?.name)).length)

    return isFilteredStops && isFilteredDuration && isFilteredCarriers
  }).sort((a, b) => {
    if (sortBy === 'cheapest') {
      return (a?.price?.amount || 0) - (b?.price?.amount)
    }
    if (sortBy === 'fastest') {
      return (a?.firstLegDurationInMinutes + a?.secondLegDurationInMinutes) - (b?.firstLegDurationInMinutes + b?.secondLegDurationInMinutes)
    }
    return 0
  })

  const pageCounts = Math.ceil(filteredData.length / itemsPerPage)


  return (
    <main className="search-hotel search-flight">
      <SearchForm
        isOneWay={!(ryear && rmonth && rday)}
        departure={origin as string}
        arrival={destination as string}
        adults={parseInt((adt || '0') as string)}
        childrens={parseInt((chd || '0') as string)}
        baby={parseInt((inf || '0') as string)}
        date={[...((dyear && dmonth && dday) ? [moment(`${dyear}-${('0' + dmonth).slice(-2)}-${('0' + dday).slice(-2)}`).format('ddd, D MMM')] : []), ...((ryear && rmonth && rday) ? [moment(`${ryear}-${('0' + rmonth).slice(-2)}-${('0' + rday).slice(-2)}`).format('ddd, D MMM')] : [])]}
        cabinClass={MYSTIFLY_CABIN_CLASSES[(cabin || '') as string]}
      />
      <div className="container">
        <div className="search-hotel__wrapper">
          {(!loading || !!data.length) && (
            <Sidebar
              stops={{
                selected: filters.stops,
                options: filtersData.stops,
                onChange: (selected) => setFilters(prevState => ({ ...prevState, stops: selected }))
              }}
              duration={{
                min: filtersData.duration[0],
                max: filtersData.duration[1],
                values: [filters.duration[0], filters.duration[1]],
                onChange: (values) => setFilters(prevState => ({ ...prevState, duration: values }))
              }}
              carriers={{
                selected: filters.carriers,
                options: filtersData.carriers,
                onChange: (selected) => setFilters(prevState => ({ ...prevState, carriers: selected }))
              }}
            />
          )}
          <div className="search-hotel__content">
            {(!loading || !!data.length) && (
              <div className="search-hotel__content-header">
                <div className="search-hotel__content-header-title">Showing {filteredData.length} best flights with best deals</div>
                <div className="custom-dropdown">
                  <div className="custom-dropdown-toggle" onClick={() => setShowSortByDropdown(true)}>
                    <div>Sort By : {sortByOptions[sortBy]}</div>
                    <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                  </div>
                  <DropdownMenu show={showSortByDropdown} setShow={setShowSortByDropdown} className="search-hotel__filter-dropdown-menu" style={{ width: '100%' }}>
                    <div className="custom-dropdown-menu__options">
                      {Object.keys(sortByOptions).map((key, index) => (
                        <div key={key} onClick={() => {
                          setSortBy(key)
                          setShowSortByDropdown(false)
                        }} className="custom-dropdown-menu__option">{sortByOptions[key]}</div>
                      ))}
                    </div>
                  </DropdownMenu>
                </div>
              </div>
            )}
            <div className="flight-list">
              {loading ? (
                <LoadingOverlay />
              ) : (!filteredData.length ? (
                <div className="text-center">Sorry, there aren't any flights that match your filters.</div>
              ) : filteredData
                .map((data, index) => {
                  const filteredPaginationItems = (index >= ((currentPage - 1) * itemsPerPage) && index < (currentPage * itemsPerPage))

                  const shownItem = filteredPaginationItems

                  return shownItem && (
                    <FlightCard
                      key={`mystifly-flight-${index}`}
                      fareSourceCode={data?.fareSourceCode}
                      price={data?.price}
                      priceBreakdowns={data?.priceBreakdowns}
                      date={[...((dyear && dmonth && dday) ? [moment(`${dyear}-${('0' + dmonth).slice(-2)}-${('0' + dday).slice(-2)}`).format('ddd, D MMM')] : []), ...((ryear && rmonth && rday) ? [moment(`${ryear}-${('0' + rmonth).slice(-2)}-${('0' + rday).slice(-2)}`).format('ddd, D MMM')] : [])]}
                      id={`mystifly-flight-${index}`}
                      firstLeg={{
                        departureDateTime: data?.firstLegDepartureDateTime,
                        arrivalDateTime: data?.firstLegArrivalDateTime,
                        durationInMinutes: data?.firstLegDurationInMinutes,
                        stopCount: data?.firstLegStopCount,
                        carriers: data?.firstLegCarriers,
                        segments: data?.firstLegSegments
                      }}
                      secondLeg={data?.secondLeg ? {
                        departureDateTime: data?.secondLegDepartureDateTime,
                        arrivalDateTime: data?.secondLegArrivalDateTime,
                        durationInMinutes: data?.secondLegDurationInMinutes,
                        stopCount: data?.secondLegStopCount,
                        carriers: data?.secondLegCarriers,
                        segments: data?.secondLegSegments
                      } : null}
                    />
                  )
                })
              )}
            </div>
            {(!loading && !!filteredData.length) && (
              <div className="search-hotel__pagination">
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
    </main>
  )
}


interface SearchFormProps {
  isOneWay: boolean
  departure: string
  arrival: string
  date: string[]
  adults: number
  childrens: number
  baby: number
  cabinClass: string
}

const SearchForm = (props: SearchFormProps) => {
  const { isOneWay, departure, arrival, date, adults, childrens, baby, cabinClass } = props

  return (
    <div className="search-flight-header">
      <div className="container">
        <FlightBreadCrumb />
        <div className="search-flight-header__inner">
          <div className="search-flight-header__details">
            <div className="search-flight-header__route">
              <div className="search-flight-header__route-icon">
                <SVGIcon src={Icons.AirplaneTakeOff} width={24} height={24} />
              </div>
              <div>
                <div className="search-flight-header__route-header">Departure & Arrival</div>
                <div className="search-flight-header__route-details">
                  <div>{getCityName(departure)} ({departure})</div>
                  <SVGIcon src={isOneWay ? Icons.ArrowRight : Icons.ArrowLeftRight} width={20} height={20} />
                  <div>{getCityName(arrival)} ({arrival})</div>
                </div>
              </div>
            </div>
            <div className="search-flight-header__separator" />
            <div className="search-flight-header__field">
              <div className="search-flight-header__field-header">Date & Passenger</div>
              <div className="search-flight-header__field-details">
                <div className="search-flight-header__field-details-date">
                  {date.map((item, index) => (
                    <Fragment key={index}>
                      <SVGIcon src={Icons.Calendar} width={20} height={20} />
                      <div>{item}</div>
                      <div className="search-flight-header__field-details-bullet" />
                    </Fragment>
                  ))}
                </div>
                <div>{adults + childrens + baby} Passenger</div>
                <div className="search-flight-header__field-details-bullet" />
                <div className="text-capitalize">{cabinClass}</div>
              </div>
            </div>
          </div>
          <div className="search-flight-header__cta">
            <div>
              <Link href="/?search=flights" className="btn btn-success rounded-pill">Change Search</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


interface SidebarProps {
  stops: {
    selected: string[]
    options: { [stopId: string]: string }
    onChange: (selected: string[]) => void
  }
  duration: {
    min: number
    max: number
    values: [number, number]
    onChange: (values: [number, number]) => void
  }
  carriers: {
    selected: string[]
    options: { [carrierId: string]: any }
    onChange: (selected: string[]) => void
  }
}

const Sidebar = (props: SidebarProps) => {
  const { stops, duration, carriers } = props

  return (
    <div className="search-hotel__sidemenu">
      <div className="search-hotel__sidemenu-filter">
        {!!Object.keys(stops.options).length && (
          <div className="search-hotel__sidemenu-filter-block">
            <a className="search-hotel__sidemenu-filter-head" data-bs-toggle="collapse" href="#transitFilterCollapse" role="button" aria-expanded="true" aria-controls="transitFilterCollapse">
              <div className="search-hotel__sidemenu-filter-head--title">Stops</div>
              <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
            </a>
            <div id="transitFilterCollapse" className="collapse show search-hotel__sidemenu-filter-block">
              {Object.keys(stops.options).map(key => (
                <div key={key} className="search-hotel__sidemenu-filter-item form-check">
                  <input
                    checked={stops.selected.includes(key)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.checked) {
                        if (!stops.selected.includes(key)) stops.onChange([...stops.selected, key])
                      } else {
                        stops.onChange(stops.selected.filter(item => item !== key))
                      }
                    }}
                    type="checkbox" id={`filter-stop-${key}`} className="form-check-input" />
                  <label htmlFor={`filter-stop-${key}`} className="form-check-label">{stops.options[key]}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        {(duration.min > 0 && duration.max > 0) && (
          <div className="search-hotel__sidemenu-filter-block">
            <a className="search-hotel__sidemenu-filter-head" data-bs-toggle="collapse" href="#journeyDurationFilterCollapse" role="button" aria-expanded="true" aria-controls="journeyDurationFilterCollapse">
              <div className="search-hotel__sidemenu-filter-head--title">Journey Duration</div>
              <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
            </a>
            <div id="journeyDurationFilterCollapse" className="collapse show search-hotel__sidemenu-filter-block">
              <div className="text-neutral-subtle">{(duration.values[0] / 60).toFixed(1)}h - {(duration.values[1] / 60).toFixed(1)}h</div>
              <div className="pt-2">
                <div className="px-2">
                  <RangeSlider onSlideEnd={(values) => duration.onChange([values[0], values[1]])} domain={[(60 * Math.floor(duration.min / 60)), (60 * Math.ceil(duration.max / 60))]} values={duration.values} step={30} />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-neutral-subtle">{((60 * Math.floor(duration.min / 60)) / 60).toFixed(1)}h</div>
                  <div className="text-neutral-subtle">{((60 * Math.ceil(duration.max / 60)) / 60).toFixed(1)}h</div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!!Object.keys(carriers.options).length && (
          <div className="search-hotel__sidemenu-filter-block">
            <a className="search-hotel__sidemenu-filter-head" data-bs-toggle="collapse" href="#airlinesFilterCollapse" role="button" aria-expanded="true" aria-controls="airlinesFilterCollapse">
              <div className="search-hotel__sidemenu-filter-head--title">Airlines</div>
              <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
            </a>
            <div id="airlinesFilterCollapse" className="collapse show search-hotel__sidemenu-filter-block">
              {Object.keys(carriers.options).map(key => (
                <div key={key} className="search-hotel__sidemenu-filter-item justify-content-between">
                  <div className="form-check">
                    <input
                      checked={carriers.selected.includes(key)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (e.target.checked) {
                          if (!carriers.selected.includes(key)) carriers.onChange([...carriers.selected, key])
                        } else {
                          carriers.onChange(carriers.selected.filter(item => item !== key))
                        }
                      }}
                      type="checkbox" id={`filter-airline-${key}`} className="form-check-input" />
                    <label htmlFor={`filter-airline-${key}`} className="form-check-label">{carriers.options[key]?.name}</label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


interface FlightCardProps {
  id: string
  fareSourceCode: string
  price: {
    amount: number
    unit: string
  }
  priceBreakdowns: {
    label: string
    amount: string
  }[]
  date: string[]
  firstLeg: {
    departureDateTime: string
    arrivalDateTime: string
    durationInMinutes: number
    stopCount: number
    carriers: {
      name: string
      imageUrl: string
    }[]
    segments: {
      originIata: string
      originName: string
      destinationIata: string
      destinationName: string
      departureDateTime: string
      arrivalDateTime: string
      journeyDuration: number
      cabinClass: string
      airline: {
        code: string
        flightNumber: string
        name: string
      }
      mealCode: string
    }[]
  }
  secondLeg?: {
    departureDateTime: string
    arrivalDateTime: string
    durationInMinutes: number
    stopCount: number
    carriers: {
      name: string
      imageUrl: string
    }[]
    segments: {
      originIata: string
      originName: string
      destinationIata: string
      destinationName: string
      departureDateTime: string
      arrivalDateTime: string
      journeyDuration: number
      cabinClass: string
      airline: {
        code: string
        flightNumber: string
        name: string
      }
      mealCode: string
    }[]
  }
}

const FlightCard = (props: FlightCardProps) => {
  const { id, fareSourceCode, price, priceBreakdowns, date, firstLeg } = props
  const router = useRouter()
  const priceUnits = {
    PRICE_UNIT_UNSPECIFIED: 1,
    PRICE_UNIT_WHOLE: 1,
    PRICE_UNIT_CENTI: 100,
    PRICE_UNIT_MILLI: 1000,
    PRICE_UNIT_MICRO: 1000000
  }

  const [activeTab, setActiveTab] = useState<'flight-details' | 'price-details' | 'other-information'>('flight-details')

  const { changePrice, currencySymbol } = UseCurrencyConverter();
  const { setSelectedFlight } = useFlightStore()

  const handleSelectFlight = () => {
    // ✅ SOLUTION: Store COMPLETE flight object from search results
    // This follows OTA best practice (Traveloka, Tiket.com flow)
    setSelectedFlight({
      // Core data from search (STABLE)
      id,
      fareSourceCode,
      price,
      priceBreakdowns,
      date,
      firstLeg,
      secondLeg: props.secondLeg,
      
      // Token for optional detail fetch (best-effort)
      token: fareSourceCode,
      
      // Metadata
      savedAt: Date.now(),
      expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes
    })

    // Navigate WITHOUT token in URL (cleaner & more secure)
    router.push('/booking/flights/')
  }

  return (
    <>
      <div className="flight-card">
        <div className="flex-grow-1 d-flex flex-column align-items-stretch">
          <div className="d-flex flex-column flex-sm-row align-items-stretch">
            {!!firstLeg.carriers.length && (
              <div className="flight-card__brand" style={{ flex: 'none', width: 200, textAlign: 'center' }}>
                <div className="flight-card__brand-name">{firstLeg.carriers[0].name}</div>
                <div className="flight-card__brand-image">
                  <img src={firstLeg.carriers[0].imageUrl || Images.Placeholder} alt={firstLeg.carriers[0].name} width={160} height={48} />
                </div>
                {firstLeg.carriers.length > 1 && (
                  <div className="fs-sm">{firstLeg.carriers.filter(({ name }, index) => index !== 0 && name !== firstLeg.carriers[0].name).map(({ name }) => ` + ${name}`)}</div>
                )}
              </div>
            )}
            <div className="flight-card__routes" style={{ flex: '1', justifyContent: 'center' }}>
              <div>
                <div className="flight-card__route-time">{moment(firstLeg.departureDateTime).format('HH:mm')}</div>
                <div className="flight-card__route-code">{firstLeg.segments[0].originIata}</div>
              </div>
              <div className="flight-card__route-details">
                <div className="flight-card__route-details-inner">
                  <div className="flight-card__route-details-duration">{Math.floor(firstLeg.durationInMinutes / 60)}h {moment.duration(firstLeg.durationInMinutes, 'minutes').minutes()}m</div>
                  <SVGIcon src={Icons.AirplaneLine} width={61} height={8} className="flight-card__route-details-line" />
                  <div className="flight-card__route-details-transit text-center">
                    <span>
                      {firstLeg.stopCount > 0 ? `${firstLeg.stopCount} Transit` : 'Direct'}
                    </span>
                    {firstLeg.stopCount > 0 && (
                      <span>
                        {' (' + firstLeg.segments.filter((_, index) => index !== 0).map(({ originIata }) => originIata).join(', ') + ')'}
                      </span>
                    )}
                  </div>
                </div>
                <SVGIcon src={Icons.Airplane} width={16} height={16} className="flight-card__route-details-icon" />
              </div>
              <div>
                <div className="flight-card__route-time">{moment(firstLeg.arrivalDateTime).format('HH:mm')}</div>
                <div className="flight-card__route-code">{firstLeg.segments[firstLeg.segments.length - 1].destinationIata}</div>
              </div>
            </div>
          </div>
          {props?.secondLeg && (
            <div className="d-flex flex-row align-items-stretch">
              {!!props.secondLeg.carriers.length && (
                <div className="flight-card__brand" style={{ flex: 'none', textAlign: 'center' }}>
                  <div className="flight-card__brand-name">{props.secondLeg.carriers[0].name}</div>
                  <div className="flight-card__brand-image">
                    <img src={props.secondLeg.carriers[0].imageUrl || Images.Placeholder} alt={props.secondLeg.carriers[0].name} width={160} height={48} />
                  </div>
                  {props.secondLeg.carriers.length > 1 && (
                    <div className="fs-sm">{props.secondLeg.carriers.filter(({ name }, index) => index !== 0 && name !== props.secondLeg.carriers[0].name).map(({ name }) => ` + ${name}`)}</div>
                  )}
                </div>
              )}
              <div className="flight-card__routes" style={{ flex: '1', justifyContent: 'center' }}>
                <div>
                  <div className="flight-card__route-time">{moment(props.secondLeg.departureDateTime).format('HH:mm')}</div>
                  <div className="flight-card__route-code">{props.secondLeg.segments[0].originIata}</div>
                </div>
                <div className="flight-card__route-details">
                  <div className="flight-card__route-details-inner">
                    <div className="flight-card__route-details-duration">{Math.floor(props.secondLeg.durationInMinutes / 60)}h {moment.duration(props.secondLeg.durationInMinutes, 'minutes').minutes()}m</div>
                    <SVGIcon src={Icons.AirplaneLine} width={61} height={8} className="flight-card__route-details-line" />
                    <div className="flight-card__route-details-transit text-center">
                      <span>
                        {props.secondLeg.stopCount > 0 ? `${props.secondLeg.stopCount} Transit` : 'Direct'}
                      </span>
                      {props.secondLeg.stopCount > 0 && (
                        <span>
                          {' (' + props.secondLeg.segments.filter((_, index) => index !== 0).map(({ originIata }) => originIata).join(', ') + ')'}
                        </span>
                      )}
                    </div>
                  </div>
                  <SVGIcon src={Icons.Airplane} width={16} height={16} className="flight-card__route-details-icon" />
                </div>
                <div>
                  <div className="flight-card__route-time">{moment(props.secondLeg.arrivalDateTime).format('HH:mm')}</div>
                  <div className="flight-card__route-code">{props.secondLeg.segments[props.secondLeg.segments.length - 1].destinationIata}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flight-card__details" style={{ flex: 'none' }}>
          <div className="flight-card__details-top">
            <div className="flight-card__details-facilities">
              {(!!firstLeg?.segments.filter(({ mealCode }) => mealCode).length || !!props?.secondLeg?.segments.filter(({ mealCode }) => mealCode).length) && (
                <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
              )}
            </div>
            <div className="flight-card__details-price">
              <div>{currencySymbol} {changePrice((price.amount / (priceUnits[price.unit] || 1)).toFixed(2))}</div>
              <div>/ pax</div>
            </div>
          </div>
          <div className="flight-card__details-buttons">
            <button className="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target={`#modal-${id}`}>See Details</button>
            <button
              onClick={handleSelectFlight}
              className="btn btn-sm btn-success"
            >
              Select
            </button>
          </div>
        </div>
      </div>

      <div className="modal flight-details-modal fade" id={`modal-${id}`} aria-hidden="true" tabIndex={-1}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="modal-title">
                  <h4>{getCityName(firstLeg.segments[0].originIata)} ({firstLeg.segments[0].originIata})</h4>
                  <SVGIcon src={props?.secondLeg ? Icons.ArrowLeftRight : Icons.ArrowRight} width={20} height={20} />
                  <h4>{getCityName(firstLeg.segments[firstLeg.segments.length - 1].destinationIata)} ({firstLeg.segments[firstLeg.segments.length - 1].destinationIata})</h4>
                </div>
                  <div className="flight-details-modal__header-caption">{date.join(' - ')}</div>
                </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="tabs">
                <div className="tabs-menu">
                  <button
                    className={`btn ${activeTab === 'flight-details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('flight-details')}>
                    Flight Details
                  </button>
                  <button
                    className={`btn ${activeTab === 'price-details' ? 'active' : ''}`}
                    onClick={() => setActiveTab('price-details')}>
                    Price Details
                  </button>
                  {/* <button
                    className={`btn ${activeTab === 'other-information' ? 'active' : ''}`}
                    onClick={() => setActiveTab('other-information')}>
                    Other Information
                  </button> */}
                </div>
                <div className="tabs-content">
                  {activeTab === 'flight-details' && (
                    <>
                      <div className="flight-details">
                        <div style={{ marginBottom: 20 }}>
                          <div className="flight-details__airport-name">Flight to {firstLeg.segments[firstLeg.segments.length - 1].destinationName} ({firstLeg.segments[firstLeg.segments.length - 1].destinationIata})</div>
                          <div className="flight-details__airport-description">{firstLeg.stopCount > 0 ? `${firstLeg.stopCount} Transit` : 'Direct'} - {Math.floor(firstLeg.durationInMinutes / 60)}h {moment.duration(firstLeg.durationInMinutes, 'minutes').minutes()}m</div>
                        </div>
                        {firstLeg.segments.map(({ originIata, originName, destinationIata, destinationName, departureDateTime, arrivalDateTime, journeyDuration, airline, cabinClass, mealCode }, index) => (
                          <Fragment key={`flight-segment-details-${index}`}>
                            <div className="flight-details__item flight-details__item--solid-line">
                              <div className="flight-details__item-left">
                                <div className="flight-details__time">{moment(departureDateTime).format('HH:mm')}</div>
                                <div className="flight-details__date">{moment(departureDateTime).format('D MMM')}</div>
                              </div>
                              <div className="flight-details__item-right">
                                <div>
                                  <div>
                                    <div className="flight-details__airport-name">{originIata}</div>
                                    <div className="flight-details__airport-description">{originName}</div>
                                  </div>
                                </div>
                                <div className="flight-details__flight">
                                  <div className="flight-details__flight-brand">
                                    <img src={Images.Placeholder} alt={airline.code} width={160} height={48} />
                                  </div>
                                  <div>
                                    <div className="flight-details__flight-code">{airline.code}-{airline.flightNumber}</div>
                                    <div className="flight-details__flight-class">{cabinClass}</div>
                                    <div className="flight-details__flight-class">Flight time {moment(arrivalDateTime).diff(moment(departureDateTime), 'hours')}h {moment.utc(moment(arrivalDateTime, 'HH:mm:ss').diff(moment(departureDateTime, 'HH:mm:ss'))).format('m')}m</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flight-details__item" style={{ paddingBottom: 48 }}>
                              <div className="flight-details__item-left">
                                <div className="flight-details__time">{moment(arrivalDateTime).format('HH:mm')}</div>
                                <div className="flight-details__date">{moment(arrivalDateTime).format('D MMM')}</div>
                              </div>
                              <div className="flight-details__item-right">
                                <div>
                                  <div>
                                    <div className="flight-details__airport-name">{destinationIata}</div>
                                    <div className="flight-details__airport-description">{destinationName}</div>
                                  </div>
                                  <div className="flight-details__facilities">
                                    {/* <div className="flight-details__facility">
                                      <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                                      <div>Baggage: 35 kg, without cabin</div>
                                    </div> */}
                                    {mealCode && (
                                      <div className="flight-details__facility">
                                        <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                                        <div>Meals: {mealCode}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      {props.secondLeg && (
                        <div className="flight-details" style={{ marginTop: 48 }}>
                          <div style={{ marginBottom: 20 }}>
                            <div className="flight-details__airport-name">Flight to ({props.secondLeg.segments[props.secondLeg.segments.length - 1].destinationIata})</div>
                            <div className="flight-details__airport-description">{props.secondLeg.stopCount > 0 ? `${props.secondLeg.stopCount} Transit` : 'Direct'} - {Math.floor(props.secondLeg.durationInMinutes / 60)}h {moment.duration(props.secondLeg.durationInMinutes, 'minutes').minutes()}m</div>
                          </div>
                          {props.secondLeg.segments.map(({ originIata, originName, destinationIata, destinationName, departureDateTime, arrivalDateTime, airline, cabinClass, mealCode }, index) => (
                            <Fragment key={`flight-segment-details-${index}`}>
                              <div className="flight-details__item flight-details__item--solid-line">
                                <div className="flight-details__item-left">
                                  <div className="flight-details__time">{moment(departureDateTime).format('HH:mm')}</div>
                                  <div className="flight-details__date">{moment(departureDateTime).format('D MMM')}</div>
                                </div>
                                <div className="flight-details__item-right">
                                  <div>
                                    <div>
                                      <div className="flight-details__airport-name">{originIata}</div>
                                      <div className="flight-details__airport-description">{originName}</div>
                                    </div>
                                  </div>
                                  <div className="flight-details__flight">
                                    <div className="flight-details__flight-brand">
                                      <img src={Images.Placeholder} alt={airline.code} width={160} height={48} />
                                    </div>
                                    <div>
                                      <div className="flight-details__flight-code">{airline.code}-{airline.flightNumber}</div>
                                      <div className="flight-details__flight-class">{cabinClass}</div>
                                      <div className="flight-details__flight-class">Flight time {moment(arrivalDateTime).diff(moment(departureDateTime), 'hours')}h {moment.utc(moment(arrivalDateTime, 'HH:mm:ss').diff(moment(departureDateTime, 'HH:mm:ss'))).format('m')}m</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flight-details__item">
                                <div className="flight-details__item-left">
                                  <div className="flight-details__time">{moment(arrivalDateTime).format('HH:mm')}</div>
                                  <div className="flight-details__date">{moment(arrivalDateTime).format('D MMM')}</div>
                                </div>
                                <div className="flight-details__item-right">
                                  <div>
                                    <div>
                                      <div className="flight-details__airport-name">{destinationIata}</div>
                                      <div className="flight-details__airport-description">{destinationName}</div>
                                    </div>
                                    <div className="flight-details__facilities">
                                      {/* <div className="flight-details__facility">
                                        <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                                        <div>Baggage: 35 kg, without cabin</div>
                                      </div> */}
                                      {mealCode && (
                                        <div className="flight-details__facility">
                                          <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                                          <div>Meals: {mealCode}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      )
                      }
                    </>
                  )}

                  {activeTab === 'price-details' && (
                    <div className="price-details">
                      {priceBreakdowns.map(({ label, amount }, index) => (
                        <div key={`price-breakdown-${index}`} className="row row-cols-2">
                          <div className="col">
                            <ul className="m-0">
                              <li className="price-details__title price-details__title--main">{label}</li>
                            </ul>
                          </div>
                          <div className="col">
                            <div className="price-details__value">{amount}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'other-information' && (
                    <div className="other-information">
                      <div>
                        <div className="other-information__title">Refund Information</div>
                        <div className="other-information__content">
                          <div className="other-information__content-title">Cancellation Fee</div>
                          <div className="other-information__content-description">
                            <p>*From departure date
                              <ul className="m-0">
                                <li>This is the method to estimate the refund amount: Ticket Price - Cancellation Fee.</li>
                                <li>All charges above are for one passenger.</li>
                                <li>Charges are subject to change by the airline.</li>
                                <li>The refund will be given following the airline and tiket.com’s cancellation terms & conditions. You may receive cash, travel credits, vouchers, points, or any combination of these.</li>
                                <li>You can only request a refund for the PCR and Rapid Antigen voucher if the voucher has not been used.</li>
                              </ul>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="other-information__title">Reschedule Information</div>
                        <div className="other-information__content">
                          <div className="other-information__content-title">Reschedule Fee</div>
                          <div className="other-information__content-description">
                            <p>*From departure date
                              <ul className="m-0">
                                <li>This is the method to estimate the refund amount: Ticket Price - Cancellation Fee.</li>
                                <li>All charges above are for one passenger.</li>
                                <li>Charges are subject to change by the airline.</li>
                                <li>The refund will be given following the airline and tiket.com’s cancellation terms & conditions. You may receive cash, travel credits, vouchers, points, or any combination of these.</li>
                                <li>You can only request a refund for the PCR and Rapid Antigen voucher if the voucher has not been used.</li>
                              </ul>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <div className="price">
                <div className="price__title">Total Price:</div>
                <div>
                  <h5 className="price__value">{price.amount} {price.unit} / {currencySymbol} {changePrice(price.amount)}</h5>
                  <div className="price__description">Includes taxes and charges</div>
                </div>
              </div>
              <button
                onClick={handleSelectFlight}
                className="btn btn-success"
              >
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const FlightBreadCrumb = () => {
  return (
    <div className="search-flight__breadcrumb">
      <Link className="search-flight__breadcrumb--link" href="/">Home</Link>
      <p>/</p>
      <p className="search-flight__breadcrumb--current">Search Flight</p>
    </div>
  )
}

const FlightDetails = () => {
  const [activeTab, setActiveTab] = useState<'flight-details' | 'price-details' | 'other-information'>('flight-details')
  const router = useRouter()

  return (
    <div className="modal flight-details-modal fade" id="flight-details-modal" aria-hidden="true" tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <div className="modal-title">
                <h4>Jakarta (JKT)</h4>
                <SVGIcon src={Icons.ArrowLeftRight} width={20} height={20} />
                <h4>Jeddah (JED)</h4>
              </div>
              <div className="flight-details-modal__header-caption">Wed, 5 Oct 2022</div>
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            <div className="tabs">
              <div className="tabs-menu">
                <button
                  className={`btn ${activeTab === 'flight-details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('flight-details')}>
                  Flight Details
                </button>
                <button
                  className={`btn ${activeTab === 'price-details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('price-details')}>
                  Price Details
                </button>
                <button
                  className={`btn ${activeTab === 'other-information' ? 'active' : ''}`}
                  onClick={() => setActiveTab('other-information')}>
                  Other Information
                </button>
              </div>
              <div className="tabs-content">
                {activeTab === 'flight-details' && (
                  <div className="flight-details">
                    <div className="flight-details__item flight-details__item--solid-line">
                      <div className="flight-details__item-left">
                        <div className="flight-details__time">17:10</div>
                        <div className="flight-details__date">5 Oct</div>
                      </div>
                      <div className="flight-details__item-right">
                        <div>
                          <div>
                            <div className="flight-details__airport-name">Soekarno Hatta (CGK)</div>
                            <div className="flight-details__airport-description">Terminal 3 International</div>
                          </div>
                          <div className="flight-details__facilities">
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.Suitcase} width={20} height={20} className="flight-details__facility-icon" />
                              <div>Baggage: 35 kg, without cabin</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.ForkKnife} width={20} height={20} className="flight-details__facility-icon" />
                              <div>Meals</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.WifiHigh} width={20} height={20} className="flight-details__facility-icon" />
                              <div>Free Wifi</div>
                            </div>
                            <div className="flight-details__facility flight-details__facility--large">3+</div>
                          </div>
                        </div>
                        <div className="flight-details__flight">
                          <div className="flight-details__flight-brand">
                            <img src={airlineQatarAirways.toString()} alt="Qatar Airways" width={160} height={48} />
                          </div>
                          <div>
                            <div className="flight-details__flight-code">GA-980</div>
                            <div className="flight-details__flight-class">Economy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flight-details__item">
                      <div className="flight-details__item-left">
                        <div className="flight-details__time">22:55</div>
                        <div className="flight-details__date">5 Oct</div>
                      </div>
                      <div className="flight-details__item-right">
                        <div>
                          <div>
                            <div className="flight-details__airport-name">Abu Dhabi International Apt (AUH)</div>
                            <div className="flight-details__airport-description">Terminal 1 </div>
                          </div>
                          <div className="flight-details__facilities">
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                              <div>Baggage: 35 kg, without cabin</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                              <div>Meals</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                              <div>Free Wifi</div>
                            </div>
                            <div className="flight-details__facility flight-details__facility--large">3+</div>
                          </div>
                          <div className="flight-details__optional-description">
                            <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                            <div>Layover 6h 25m</div>
                          </div>
                        </div>
                        <div className="flight-details__flight">
                          <div className="flight-details__flight-brand">
                            <img src={airlineQatarAirways.toString()} alt="Qatar Airways" width={160} height={48} />
                          </div>
                          <div>
                            <div className="flight-details__flight-code">EY-475</div>
                            <div className="flight-details__flight-class">Economy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flight-details__item flight-details__item--solid-line">
                      <div className="flight-details__item-left">
                        <div className="flight-details__time">01:30</div>
                        <div className="flight-details__date">6 Oct</div>
                      </div>
                      <div className="flight-details__item-right">
                        <div>
                          <div>
                            <div className="flight-details__airport-name">Abu Dhabi International Apt (AUH)</div>
                            <div className="flight-details__airport-description">Terminal 3 </div>
                          </div>
                          <div className="flight-details__facilities">
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                              <div>Baggage: 35 kg, without cabin</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                              <div>Meals</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                              <div>Free Wifi</div>
                            </div>
                            <div className="flight-details__facility flight-details__facility--large">3+</div>
                          </div>
                        </div>
                        <div className="flight-details__flight">
                          <div className="flight-details__flight-brand">
                            <img src={airlineQatarAirways.toString()} alt="Qatar Airways" width={160} height={48} />
                          </div>
                          <div>
                            <div className="flight-details__flight-code">EY-475</div>
                            <div className="flight-details__flight-class">Economy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flight-details__item">
                      <div className="flight-details__item-left">
                        <div className="flight-details__time">02:30</div>
                        <div className="flight-details__date">6 Oct</div>
                      </div>
                      <div className="flight-details__item-right">
                        <div>
                          <div>
                            <div className="flight-details__airport-name">Jeddah (JED)</div>
                            <div className="flight-details__airport-description">Terminal 1 </div>
                          </div>
                          <div className="flight-details__facilities">
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                              <div>Baggage: 35 kg, without cabin</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.ForkKnife} width={20} height={20} />
                              <div>Meals</div>
                            </div>
                            <div className="flight-details__facility">
                              <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                              <div>Free Wifi</div>
                            </div>
                            <div className="flight-details__facility flight-details__facility--large">3+</div>
                          </div>
                          <div className="flight-details__optional-description">
                            <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                            <div>Layover 6h 25m</div>
                          </div>
                        </div>
                        <div className="flight-details__flight">
                          <div className="flight-details__flight-brand">
                            <img src={airlineQatarAirways.toString()} alt="Qatar Airways" width={160} height={48} />
                          </div>
                          <div>
                            <div className="flight-details__flight-code">EY-475</div>
                            <div className="flight-details__flight-class">Economy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'price-details' && (
                  <div className="price-details">
                    <div className="row row-cols-2">
                      <div className="col">
                        <ul className="m-0">
                          <li className="price-details__title price-details__title--main">Ticket (1 adult)</li>
                        </ul>
                      </div>
                      <div className="col">
                        <div className="price-details__value">$ 1,882.29</div>
                      </div>
                    </div>
                    <div className="row row-cols-2">
                      <div className="col">
                        <ul className="m-0">
                          <li className="price-details__title">Flight fare</li>
                        </ul>
                      </div>
                      <div className="col">
                        <div className="price-details__value">$ 1,659.99</div>
                      </div>
                    </div>
                    <div className="row row-cols-2">
                      <div className="col">
                        <ul className="m-0">
                          <li className="price-details__title">Taxes and fees</li>
                        </ul>
                      </div>
                      <div className="col">
                        <div className="price-details__value">$ 165.99</div>
                      </div>
                    </div>
                    <div className="row row-cols-2">
                      <div className="col">
                        <ul className="m-0">
                          <li className="price-details__title">Platform service fee</li>
                        </ul>
                      </div>
                      <div className="col">
                        <div className="price-details__value">$ 56.33</div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'other-information' && (
                  <div className="other-information">
                    <div>
                      <div className="other-information__title">Refund Information</div>
                      <div className="other-information__content">
                        <div className="other-information__content-title">Cancellation Fee</div>
                        <div className="other-information__content-description">
                          <p>*From departure date
                            <ul className="m-0">
                              <li>This is the method to estimate the refund amount: Ticket Price - Cancellation Fee.</li>
                              <li>All charges above are for one passenger.</li>
                              <li>Charges are subject to change by the airline.</li>
                              <li>The refund will be given following the airline and tiket.com’s cancellation terms & conditions. You may receive cash, travel credits, vouchers, points, or any combination of these.</li>
                              <li>You can only request a refund for the PCR and Rapid Antigen voucher if the voucher has not been used.</li>
                            </ul>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="other-information__title">Reschedule Information</div>
                      <div className="other-information__content">
                        <div className="other-information__content-title">Reschedule Fee</div>
                        <div className="other-information__content-description">
                          <p>*From departure date
                            <ul className="m-0">
                              <li>This is the method to estimate the refund amount: Ticket Price - Cancellation Fee.</li>
                              <li>All charges above are for one passenger.</li>
                              <li>Charges are subject to change by the airline.</li>
                              <li>The refund will be given following the airline and tiket.com’s cancellation terms & conditions. You may receive cash, travel credits, vouchers, points, or any combination of these.</li>
                              <li>You can only request a refund for the PCR and Rapid Antigen voucher if the voucher has not been used.</li>
                            </ul>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <div className="price">
              <div className="price__title">Total Price:</div>
              <div>
                <h5 className="price__value">$ 1,882.29</h5>
                <div className="price__description">Includes taxes and charges</div>
              </div>
            </div>
            <a onClick={() => router.push('/booking/flights/')} type="button" className="btn btn-success" data-bs-dismiss='modal'>Select Flight</a>
          </div>
        </div>
      </div>
    </div>

  )
}

export default SearchFlights
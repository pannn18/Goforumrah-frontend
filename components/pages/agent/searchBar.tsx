import React, { useEffect, useState } from 'react'
import { CabinClasses, Icons } from '@/types/enums'
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { DateRange, Calendar, Range } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import moment from 'moment';
import Link from 'next/link';
import { getEnumAsArray } from '@/lib/enumsHelper';

interface HotelPassenger {
  adult: number
  children: number
  room: number
}

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
  useVariant?: boolean
}


// Start:: Home Page Search Bar & Each Service Header Search Bar
export const HotelSearchBar = (props: HotelSearchBarProps) => {
  const { useVariant } = props

  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false)
  const [location, setLocation] = useState<string>('')
  const handleClickLocationOption = (location: string) => {
    setLocation(location)
    setShowLocationDropdown(false)
  }

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
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


  return (
    <div className={`search-bar search-bar--col ${useVariant ? 'search-bar--variant' : ''}`}>
      <div className={`search-bar__item search-bar__item--grow ${showLocationDropdown ? 'search-bar__item--active' : ''}`}>
        {useVariant && (
          <div className="search-bar__item-title">Destination</div>
        )}
        <div className={`search-bar__field search-bar__field-bordered ${location ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`}>
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
        <DropdownMenu show={showLocationDropdown} setShow={setShowLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Popular Destination</div>
          </div>
          <div className="custom-dropdown-menu__options">
            <div onClick={() => { handleClickLocationOption('Makkah, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Makkah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Makkah</div>
              </div>
            </div>
            <div onClick={() => { handleClickLocationOption('Madinah, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Madinah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Madinah</div>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div className='search-bar__inner'>
        <div className={`search-bar__item search-bar__item--grow ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
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
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field search-bar__field-bordered ${isDateRangeHasChanged ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('ddd, MMM DD') : 'Check in'}</div>
              <div>-</div>
              <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('ddd, MMM DD') : 'Check out'}</div>
            </div>
          )}

          <DropdownMenu className={'search-bar__date-range'} show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
            <DateRange
              months={2}
              direction="horizontal"
              ranges={[dateRange]}
              onChange={item => setDateRange(item.selection)}
            />
          </DropdownMenu>
        </div>
        <div className={`search-bar__item search-bar__item--grow ${showPassengerDropdown ? 'search-bar__item--active' : ''}`}>
          {useVariant && (
            <div className="search-bar__item-title">Room & Guest</div>
          )}
          <div onClick={() => setShowPassengerDropdown(true)} className={`search-bar__field search-bar__field-bordered ${passengerHasChanged ? 'has-value' : ''} ${useVariant ? 'search-bar__field--variant' : ''}`} style={{ cursor: 'pointer' }}>
            <SVGIcon src={Icons.Users} width={20} height={20} />
            <div>Room & Guest</div>
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
          {useVariant ? (
            <button className="btn btn-success rounded-pill search-bar__search-button">Change Search</button>
          ) : (
            <Link href="/agent/hotel" className="btn btn-success rounded-pill search-bar__search-button">Search Hotel</Link>
          )}
        </div>
      </div>
    </div>
  )
}

export const FlightSearchBar = () => {
  const [isOneWay, setIsOneWay] = useState<boolean>(false)

  const [showFlightFromDropdown, setShowFlightFromDropdown] = useState<boolean>(false)
  const [flightFrom, setFlightFrom] = useState<string>('')
  const handleClickFlightFromOption = (flightFrom: string) => {
    setFlightFrom(flightFrom)
    setShowFlightFromDropdown(false)
  }

  const [showFlightToDropdown, setShowFlightToDropdown] = useState<boolean>(false)
  const [flightTo, setFlightTo] = useState<string>('')
  const handleClickFlightToOption = (flightTo: string) => {
    setFlightTo(flightTo)
    setShowFlightToDropdown(false)
  }

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

  const [departureOnly, setDepartureOnly] = useState<Date>(null)

  return (
    <div className="search-bar">
      <div className="search-bar__radio-fields">
        <div className="form-check">
          <input checked={!isOneWay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsOneWay(!e.currentTarget.checked)} className="form-check-input" type="radio" name="flight-search-type" id="flight-search-round-trip" />
          <label className="form-check-label" htmlFor="flight-search-round-trip">
            Round-trip
          </label>
        </div>
        <div className="form-check">
          <input checked={isOneWay} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIsOneWay(e.currentTarget.checked)} className="form-check-input" type="radio" name="flight-search-type" id="flight-search-one-way" />
          <label className="form-check-label" htmlFor="flight-search-one-way">
            One-way
          </label>
        </div>
      </div>
      <div className={`search-bar__item search-bar__item--grow ${showFlightFromDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field ${flightFrom ? 'has-value' : ''}`}>
          <SVGIcon src={Icons.AirplaneTakeOff} width={20} height={20} />
          <input
            type="text"
            value={flightFrom}
            onChange={(e) => setFlightFrom(e.currentTarget.value)}
            onFocus={() => setShowFlightFromDropdown(true)}
            onClick={() => setShowFlightFromDropdown(true)}
            className="search-bar__input"
            placeholder="Where from?" />
        </div>
        <DropdownMenu show={showFlightFromDropdown} setShow={setShowFlightFromDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__options">
            <div onClick={() => { handleClickFlightFromOption('Abha, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Abha, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Abha</div>
              </div>
            </div>
            <div onClick={() => { handleClickFlightFromOption('Al Baha, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Al Baha, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Al Baha</div>
              </div>
            </div>
            <div onClick={() => { handleClickFlightFromOption('Al Kharj, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Al Kharj, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Al Kharj</div>
              </div>
            </div>
            <div onClick={() => { handleClickFlightFromOption('Al Ula, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Al Ula, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Al Ula</div>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div style={{ marginInline: -16, flex: 'none', alignSelf: 'center' }}>
        <SVGIcon src={Icons.ArrowLeftRight} width={20} height={20} color="#9E9E9E" />
      </div>
      <div className={`search-bar__item search-bar__item--grow ${showFlightToDropdown ? 'search-bar__item--active' : ''}`}>
        <div className={`search-bar__field ${flightTo ? 'has-value' : ''}`}>
          <SVGIcon src={Icons.AirplaneLanding} width={20} height={20} />
          <input
            type="text"
            value={flightTo}
            onChange={(e) => setFlightTo(e.currentTarget.value)}
            onFocus={() => setShowFlightToDropdown(true)}
            onClick={() => setShowFlightToDropdown(true)}
            className="search-bar__input"
            placeholder="Where to?" />
        </div>
        <DropdownMenu show={showFlightToDropdown} setShow={setShowFlightToDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__options">
            <div onClick={() => { handleClickFlightToOption('Abha, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Abha, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Abha</div>
              </div>
            </div>
            <div onClick={() => { handleClickFlightToOption('Al Baha, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Al Baha, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Al Baha</div>
              </div>
            </div>
            <div onClick={() => { handleClickFlightToOption('Al Kharj, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Al Kharj, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Al Kharj</div>
              </div>
            </div>
            <div onClick={() => { handleClickFlightToOption('Al Ula, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Flight} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Al Ula, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Al Ula</div>
              </div>
            </div>
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
            <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
              <DateRange
                months={2}
                direction="horizontal"
                ranges={[dateRange]}
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
            <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${departureOnly ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
              <SVGIcon src={Icons.Calendar} width={20} height={20} />
              <div>{departureOnly ? moment(departureOnly).format('ddd, MMM DD') : 'Departure'}</div>
            </div>
            <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
              <Calendar
                months={1}
                direction="horizontal"
                date={departureOnly}
                onChange={date => setDepartureOnly(date)}
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
                    <button onClick={() => handleUpdatePassenger({ ...passenger, adult: passenger.adult + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.adult >= 99}>
                      <SVGIcon src={Icons.Plus} width={20} height={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="search-bar__passenger-option">
                  <div className="search-bar__passenger-option-type">
                    <div>Children</div>
                    <div className="search-bar__passenger-option-type-small">Age 2 - 12</div>
                  </div>
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
                    <button onClick={() => handleUpdatePassenger({ ...passenger, baby: passenger.baby + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.baby >= 99}>
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
        <Link href="/search/flights" className="btn btn-success rounded-pill search-bar__search-button">Search Flight</Link>
      </div>
    </div>
  )
}

export const BookTransferSearchBar = () => {
  const [isDifferentLocation, setIsDifferentLocation] = useState<boolean>(false)

  const [showPickupLocationDropdown, setShowPickupLocationDropdown] = useState<boolean>(false)
  const [pickupLocation, setPickupLocation] = useState<string>('')
  const handleClickPickupLocationOption = (pickupLocation: string) => {
    setPickupLocation(pickupLocation)
    setShowPickupLocationDropdown(false)
  }

  const [showDropOffLocationDropdown, setShowDropOffLocationDropdown] = useState<boolean>(false)
  const [dropOffLocation, setDropOffLocation] = useState<string>('')
  const handleClickDropOffLocationOption = (dropOffLocation: string) => {
    setDropOffLocation(dropOffLocation)
    setShowDropOffLocationDropdown(false)
  }

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  })
  const isDateRangeHasChanged = dateRange.startDate.getTime() !== dateRange.endDate.getTime()

  return (
    <div className="search-bar">
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
        <div className={`search-bar__field ${pickupLocation ? 'has-value' : ''}`}>
          <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
          <input
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.currentTarget.value)}
            onFocus={() => setShowPickupLocationDropdown(true)}
            onClick={() => setShowPickupLocationDropdown(true)}
            className="search-bar__input"
            placeholder="Your pick-up location?" />
        </div>
        <DropdownMenu show={showPickupLocationDropdown} setShow={setShowPickupLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Popular Destination</div>
          </div>
          <div className="custom-dropdown-menu__options">
            <div onClick={() => { handleClickPickupLocationOption('Jeddah, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Jeddah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Jeddah</div>
              </div>
            </div>
            <div onClick={() => { handleClickPickupLocationOption('Madinah, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Madinah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Madinah</div>
              </div>
            </div>
            <div onClick={() => { handleClickPickupLocationOption('Riyadh, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Riyadh, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Riyadh</div>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      {isDifferentLocation && (
        <>
          <div className="search-bar__separator"></div>
          <div className={`search-bar__item search-bar__item--grow ${showDropOffLocationDropdown ? 'search-bar__item--active' : ''}`}>
            <div className={`search-bar__field ${dropOffLocation ? 'has-value' : ''}`}>
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <input
                type="text"
                value={dropOffLocation}
                onChange={(e) => setDropOffLocation(e.currentTarget.value)}
                onFocus={() => setShowDropOffLocationDropdown(true)}
                onClick={() => setShowDropOffLocationDropdown(true)}
                className="search-bar__input"
                placeholder="Your drop-off location?" />
            </div>
            <DropdownMenu show={showDropOffLocationDropdown} setShow={setShowDropOffLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
              <div className="custom-dropdown-menu__header">
                <div className="custom-dropdown-menu__title">Popular Destination</div>
              </div>
              <div className="custom-dropdown-menu__options">
                <div onClick={() => { handleClickDropOffLocationOption('Jeddah, Saudi Arabia') }} className="custom-dropdown-menu__option">
                  <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                  <div>
                    <div className="custom-dropdown-menu__option-title">Jeddah, Saudi Arabia</div>
                    <div className="custom-dropdown-menu__option-description">Jeddah</div>
                  </div>
                </div>
                <div onClick={() => { handleClickDropOffLocationOption('Madinah, Saudi Arabia') }} className="custom-dropdown-menu__option">
                  <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                  <div>
                    <div className="custom-dropdown-menu__option-title">Madinah, Saudi Arabia</div>
                    <div className="custom-dropdown-menu__option-description">Madinah</div>
                  </div>
                </div>
                <div onClick={() => { handleClickDropOffLocationOption('Riyadh, Saudi Arabia') }} className="custom-dropdown-menu__option">
                  <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="custom-dropdown-menu__option-icon" />
                  <div>
                    <div className="custom-dropdown-menu__option-title">Riyadh, Saudi Arabia</div>
                    <div className="custom-dropdown-menu__option-description">Riyadh</div>
                  </div>
                </div>
              </div>
            </DropdownMenu>
          </div>
        </>
      )}
      <div className="search-bar__separator"></div>
      <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
        <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Calendar} width={20} height={20} />
          <div>{isDateRangeHasChanged ? moment(dateRange.startDate).format('ddd, MMM DD') : 'Pick-up Date & Time'}</div>
        </div>
        <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
          <DateRange
            months={2}
            direction="horizontal"
            ranges={[dateRange]}
            onChange={item => setDateRange(item.selection)}
          />
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      <div className="search-bar__item">
        <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${isDateRangeHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Calendar} width={20} height={20} />
          <div>{isDateRangeHasChanged ? moment(dateRange.endDate).format('ddd, MMM DD') : 'Drop-off Date & Time'}</div>
        </div>
      </div>
      <div className="search-bar__item">
        <Link href="/search/book-transfer" className="btn btn-success rounded-pill search-bar__search-button">Search Car</Link>
      </div>
    </div>
  )
}

export const TourPackageSearchBar = () => {
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false)
  const [location, setLocation] = useState<string>('')
  const handleClickLocationOption = (location: string) => {
    setLocation(location)
    setShowLocationDropdown(false)
  }

  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)
  const [date, setDate] = useState<Date>(null)

  const [showPassengerDropdown, setShowPassengerDropdown] = useState<boolean>(false)
  const [passengerHasChanged, setPassengerHasChanged] = useState<boolean>(false)
  const [passenger, setPassenger] = useState<TourPackagePassenger>({ people: 1 })
  const handleUpdatePassenger = (passenger: TourPackagePassenger) => {
    setPassenger(passenger)
    setPassengerHasChanged(true)
  }

  return (
    <div className="search-bar">
      <div className={`search-bar__item search-bar__item--grow ${showLocationDropdown ? 'search-bar__item--active' : ''}`}>
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
        <DropdownMenu show={showLocationDropdown} setShow={setShowLocationDropdown} className="search-bar__location-dropdown" style={{ marginTop: 36, width: 396 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Popular Destination</div>
          </div>
          <div className="custom-dropdown-menu__options">
            <div onClick={() => { handleClickLocationOption('Jeddah, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Jeddah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Jeddah</div>
              </div>
            </div>
            <div onClick={() => { handleClickLocationOption('Madinah, Saudi Arabia') }} className="custom-dropdown-menu__option">
              <SVGIcon src={Icons.Hotel} width={20} height={20} className="custom-dropdown-menu__option-icon" />
              <div>
                <div className="custom-dropdown-menu__option-title">Madinah, Saudi Arabia</div>
                <div className="custom-dropdown-menu__option-description">Madinah</div>
              </div>
            </div>
            <div onClick={() => { handleClickLocationOption('Riyadh, Saudi Arabia') }} className="custom-dropdown-menu__option">
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
      <div className={`search-bar__item ${showDateDropdown ? 'search-bar__item--active' : ''}`}>
        <div onClick={() => setShowDateDropdown(true)} className={`search-bar__field ${date ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Calendar} width={20} height={20} />
          <div>{date ? moment(date).format('ddd, MMM DD') : 'Date'}</div>
        </div>
        <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ marginTop: 36, overflow: 'hidden' }}>
          <Calendar
            months={1}
            direction="horizontal"
            date={date}
            onChange={date => setDate(date)}
          />
        </DropdownMenu>
      </div>
      <div className="search-bar__separator"></div>
      <div className={`search-bar__item ${showPassengerDropdown ? 'search-bar__item--active' : ''}`}>
        <div onClick={() => setShowPassengerDropdown(true)} className={`search-bar__field ${passengerHasChanged ? 'has-value' : ''}`} style={{ cursor: 'pointer' }}>
          <SVGIcon src={Icons.Users} width={20} height={20} />
          <div>{passenger.people} People</div>
        </div>

        <DropdownMenu show={showPassengerDropdown} setShow={setShowPassengerDropdown} className="search-bar__passenger-dropdown" style={{ marginTop: 36, width: 289 }}>
          <div className="custom-dropdown-menu__header">
            <div className="custom-dropdown-menu__title">Passenger</div>
          </div>
          <div className="custom-dropdown-menu__options">
            <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
              <div className="search-bar__passenger-option">
                <div className="search-bar__passenger-option-type">
                  <div>People</div>
                </div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, people: passenger.people - 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.people <= 1}>
                    <SVGIcon src={Icons.Minus} width={20} height={20} />
                  </button>
                </div>
                <div className="search-bar__passenger-option-value">{passenger.people}</div>
                <div>
                  <button onClick={() => handleUpdatePassenger({ ...passenger, people: passenger.people + 1 })} type="button" className="search-bar__passenger-option-button" disabled={passenger.people >= 99}>
                    <SVGIcon src={Icons.Plus} width={20} height={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </div>
      <div className="search-bar__item">
        <button className="btn btn-success rounded-pill search-bar__search-button">Search Tour</button>
      </div>
    </div>
  )
}
// End:: Home Page Search Bar & Each Service Header Search Bar
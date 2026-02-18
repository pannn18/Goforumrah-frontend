import React, { useEffect, useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import CarTransferCard from '@/components/pages/search/book-transfer/carTransferCard'
import CarTypeCard from '@/components/pages/search/book-transfer/carTypeCard'
import sidemenuMapImage from '@/assets/images/sidemenu_maps.png'
import carTypeImage from '@/assets/images/search_transfer_car_type.png'
import carListImage from '@/assets/images/search_transfer_car_image.png'
import { BookTransferSearchBar, CarSearchBar } from '../../home/searchBar'
import RangeSlider from '@/components/elements/rangeSlider'
import Link from 'next/link'
import DropdownMenu from '@/components/elements/dropdownMenu'
import useFetch from '@/hooks/useFetch'
import { useRouter } from 'next/router'
import { BookTransfer } from '@/types/types'
import moment from 'moment'
import { callAPI } from '@/lib/axiosHelper'
import { Range } from 'react-date-range'
import LoadingOverlay from '@/components/loadingOverlay'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

interface Filters {
  price_range?: [number, number]
  sort_by?: number
  supplier?: string[]
  passenger?: number
  car_brand?: string[]
  specification?: string[]
}

const SearchBookTransfer = () => {
  const router = useRouter()
  const pickup = (router.query?.pickup || '') as string
  const dropoff = (router.query?.dropoff || '') as string
  const search = (router.query?.search || '') as string

  const [sortBy, setSortBy] = useState<number>(0)
  const [showSortByDropdown, setShowSortByDropdown] = useState<boolean>(false)
  const sortByOptions = [{ id: 1, display: 'Cheapest' }, { id: 2, display: 'Most Expensive' }, { id: 3, display: 'Most Rented' }]
  const passengerOptions = [{ id: 0, display: 'All' }, { id: 1, display: '<5 Passenger' }, { id: 2, display: '5-6 Passenger' }, { id: 3, display: '>6 Passenger' }]

  const [filters, setFilters] = useState<Filters>({
    price_range: [0, 200],
    sort_by: 1,
    supplier: [],
    passenger: 0,
    car_brand: [],
    specification: []
  })

  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [data, setData] = useState<BookTransfer[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1);

  const loadBookTransfer = async (page) => {
    const savedDateRange = localStorage.getItem('search-book-transfer-date')
    let initialDateRange: Range = JSON.parse(savedDateRange)

    const savedPickupTime = localStorage.getItem('search-book-transfer-pickup-time')

    const savedDropOffTime = localStorage.getItem('search-book-transfer-dropoff-time')

    console.log("savedPickupTime : ", savedPickupTime);
    console.log("savedDropOffTime : ", savedDropOffTime);

    if (!pickup || !dropoff || !initialDateRange || !savedPickupTime || !savedDropOffTime) return

    setLoading(true)

    const updatedFilters = {
      price_range: `${filters.price_range[0]}-${filters.price_range[1]}`,
      sort_by: sortByOptions[sortBy].id,
      ...(filters?.passenger !== 0 && {
        passenger: filters?.passenger
      }),
      ...(filters?.supplier?.length && {
        supplier: filters?.supplier
      }),
      ...(filters?.car_brand?.length && {
        car_brand: filters?.car_brand
      }),
      ...(filters?.specification?.length && {
        specification: filters?.specification
      }),
    }

    setCheckInDate(moment(initialDateRange.startDate).format('YYYY-MM-DD'))
    setCheckOutDate(moment(initialDateRange.endDate).format('YYYY-MM-DD'))
    const currentDateString = moment().format('YYYY-MM-DD'); // Get the current date in a valid format
    const pickupTime = moment(currentDateString + ' ' + savedPickupTime).format('HH:mm');
    const dropOffTime = moment(currentDateString + ' ' + savedDropOffTime).format('HH:mm');

    console.log("pickupTime : ", pickupTime);
    console.log("dropOffTime : ", dropOffTime);

    const payload = {
      drop_off: dropoff,
      check_in: checkInDate,
      check_out: checkOutDate,
      ...updatedFilters,
    }
    const calculateTotalPages = (totalCount) => {
      return Math.ceil(totalCount / 10);
    };
    console.log("data car business show from apis: ", checkInDate)
    const { ok, error, data } = await callAPI(`/car-business-booking/show?page=${page}`, 'POST', payload)
    if (ok && data) {
      console.log("data car business show from apis: ", data.data)
      const modifiedData = data?.data?.map((car) => ({
        ...car,
        checkInDate,
        checkOutDate,
        pickupTime,
        dropOffTime,
        car_photo_thumbnail: car?.photo?.photo,
      }))
      setData(modifiedData)
      setTotalPages(calculateTotalPages(data?.total || 0));
      // setLastPage(data?.last_page || 1)
    } else {
      // TODO: Handle the error
    }

    setLoading(false)
  }

  useEffect(() => {
    loadBookTransfer(currentPage)
  }, [pickup, dropoff, filters, sortBy, currentPage, totalPages])

  console.log("setData fetched Car : ", data)

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  return (
    <main className="search-transfer">
      <div className="search-transfer__header-form">
        <div className="container">
          <BookTransferBreadCrumb />
          <BookTransferSearchBar useVariant={true} pickupSearch={pickup} dropOffSearch={dropoff} onSearchChange={() => loadBookTransfer(currentPage)} />
          {/* <CarSearchBar /> */}
        </div>
      </div>
      <div className="container">
        <div className="search-transfer__wrapper">
          <Sidebar
            dropOff={dropoff} checkInDate={checkInDate} checkOutDate={checkOutDate}
            price={{
              values: filters.price_range,
              onChange: (price_range) => setFilters(prevState => ({ ...prevState, price_range }))
            }}
            filters={{
              supplier: {
                values: filters.supplier,
                onChange: (supplier) => setFilters(prevState => ({ ...prevState, supplier }))
              },
              passenger: {
                options: passengerOptions,
                value: filters.passenger,
                onChange: (passenger) => setFilters(prevState => ({ ...prevState, passenger }))
              },
              car_brand: {
                values: filters.car_brand,
                onChange: (car_brand) => setFilters(prevState => ({ ...prevState, car_brand }))
              },
              specification: {
                values: filters.specification,
                onChange: (specification) => setFilters(prevState => ({ ...prevState, specification }))
              },
            }}
          />
          <div className="search-transfer__content">
            <div className="search-transfer__content-header">
              <div className="search-transfer__content-header-title">Showing {data.length > 500 ? '500+' : data.length} best accomodation with best deals</div>
              <div className="custom-dropdown">
                <div className="custom-dropdown-toggle" onClick={() => setShowSortByDropdown(true)}>
                  <div style={{ whiteSpace: 'nowrap' }}>Show Price : {sortByOptions[sortBy].display}</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
                <DropdownMenu show={showSortByDropdown} setShow={setShowSortByDropdown} className="search-hotel__filter-dropdown-menu" style={{ width: '100%' }}>
                  <div className="custom-dropdown-menu__options">
                    {sortByOptions.map(({ id, display }, index) => (
                      <div key={index} onClick={() => {
                        setSortBy(index)
                        setShowSortByDropdown(false)
                      }} className="custom-dropdown-menu__option">{display}</div>
                    ))}
                  </div>
                </DropdownMenu>
              </div>
            </div>
            {/* <CarType /> */}
            <div className="search-transfer__content-list">
              {loading ? (
                <LoadingOverlay />
              ) : data && data.length ? (
                data.map(({ id_car_business_fleet, car_brand, edition, model, address_line, price, quantity, transmission, fuel_type, checkInDate, checkOutDate, pickupTime, dropOffTime, car_photo_thumbnail, spec_name, spec_total }, index) => (
                  <CarTransferCard key={index} image={car_photo_thumbnail || carListImage.src} name={`${car_brand} ${model} ${edition}`} location={address_line} price={`${currencySymbol}${changePrice(price)}`} linkURL={`/car/detail?id=${id_car_business_fleet}&checkin=${checkInDate} ${pickupTime}&checkout=${checkOutDate} ${dropOffTime}`}
                    seats={quantity} transmission={transmission} fuelType={fuel_type} />
                ))
              ) : (
                <div style={{ width: '100%', margin: 'auto', textAlign: 'center' }}>
                  It seems that there are no cars currently available.
                </div>
              )}
              {/* {Array.isArray(data) && data?.length > 0 ? (
                data?.map((item, index) => (
                  <CarTransferCard
                    key={index}
                    image={carListImage}
                    name={`${item.car_brand} ${item.edition}`}
                    location={item.address_line}
                    price={`$${item.price}`}
                    linkURL={`/car/detail?id=${item.id_car_business_fleet}&checkin=${item.checkInDate} ${item.pickupTime}&checkout=${item.checkOutDate} ${item.dropOffTime}`}
                    seats={item.quantity}
                    transmission={item.transmission}
                    fuelType={item.fuel_type}
                  />
                ))
              ) : (
                <p>No cars available</p>
              )} */}
            </div>
            <div className="search-transfer__pagination">
              <div className="pagination">
                <button
                  type="button"
                  className={`pagination__button pagination__button--arrow ${currentPage === 1 ? 'disabled' : ''}`}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pagination__button ${i + 1 === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  className={`pagination__button pagination__button--arrow ${currentPage === totalPages ? 'disabled' : ''}`}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const BookTransferBreadCrumb = () => {
  return (
    <div className="search-hotel__breadcrumb">
      <Link className="search-hotel__breadcrumb--link" href="/">Home</Link>
      <p>/</p>
      <p className="search-hotel__breadcrumb--current">Search Car</p>
    </div>
  )
}

// const CarType = () => {
//   const types = [
//     { image: carTypeImage, name: 'Small', desc: '3 pax, 3 bags' },
//     { image: carTypeImage, name: 'Medium', desc: '3 pax, 3 bags' },
//     { image: carTypeImage, name: 'Medium', desc: '3 pax, 3 bags' },
//     { image: carTypeImage, name: 'Estate', desc: '3 pax, 3 bags' },
//     { image: carTypeImage, name: 'Premium', desc: '3 pax, 3 bags' },
//     { image: carTypeImage, name: 'Minivans', desc: '3 pax, 3 bags' },
//     { image: carTypeImage, name: 'MiniBus', desc: '3 pax, 3 bags' },
//   ]

//   return (
//     <div className="search-transfer__content-type">
//       {types.map((types, index) => (
//         <CarTypeCard {...types} key={index} />
//       ))}
//     </div>
//   )
// }

interface SidebarFilters {
  dropoff: { region: string }[]
  supplier: { id_car_business: number, trading_as: string, fleet_count: number }[]
  car_brand: { brand_name: string, brand_total: number }[]
  specification: { spec_name: string, spec_total: number }[]
}

const Sidebar = ({ filters, price, dropOff, checkInDate, checkOutDate }: {
  filters: {
    supplier: {
      values: string[]
      onChange: (values: string[]) => void 
    }
    passenger: {
      options: { id: number, display: string }[]
      value: number
      onChange: (value: number) => void
    }
    car_brand: {
      values: string[]
      onChange: (values: string[]) => void
    }
    specification: {
      values: string[]
      onChange: (values: string[]) => void
    }
  }
  price: {
    values: [number, number]
    onChange: (values: [number, number]) => void
  }
  dropOff: any
  checkInDate: any
  checkOutDate: any
}) => {
  const payload = {
    drop_off: dropOff,
    check_in: checkInDate,
    check_out: checkOutDate,
    price_range: `${price.values[0]}-${price.values[1]}`,
  }
  const { data, loading }: { loading: boolean, data: SidebarFilters } = useFetch('/car-business-booking/filters', 'POST', payload)
  console.log("filter data : ", data);
  return loading ? (
    <LoadingOverlay />
  ) : (
    <div className="search-transfer__sidemenu">
      {/* TODO: Enable this feature once the design or request has been fixed */}
      <div className="search-transfer__sidemenu-map">
        <BlurPlaceholderImage src={sidemenuMapImage} alt="Trending City" width={265} height={117} />
        <div className="search-transfer__sidemenu-map-overlay"></div>
        <button className="search-transfer__sidemenu-map-button btn btn-sm btn-success">
          <SVGIcon src={Icons.Upload} width={20} height={20} />
          Show Map
        </button>
      </div>
      <div className="search-transfer__sidemenu-filter">
        <div className="search-transfer__sidemenu-filter-block">
          <a className="search-transfer__sidemenu-filter-head" data-bs-toggle="collapse" href="#priceFilterCollapse" role="button" aria-expanded="true" aria-controls="priceFilterCollapse">
            <div className="search-transfer__sidemenu-filter-head--title">Price</div>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </a>
          <div id="priceFilterCollapse" className="collapse show search-transfer__sidemenu-filter-block">
            <div className="search-transfer__sidemenu-filter-item">
              <p className="search-transfer__sidemenu-filter-counter search-transfer__sidemenu-filter-counter--text">Range per day : <label className="form-check-label">${price.values[0]} - ${price.values[1]}</label></p>
            </div>
            <div>
              <div className="mt-2 pt-1 px-2">
                <RangeSlider domain={[0, 200]} values={price.values} onChange={(values) => price.onChange([values[0], values[1]])} step={1} />
              </div>
              <div className="search-transfer__sidemenu-filter-range">
                <p>$0</p>
                <p>$200</p>
              </div>
            </div>
          </div>
        </div>
        <div className="search-transfer__sidemenu-filter-divider"></div>
        {!!data?.supplier?.length && (
          <>
            <div className="search-transfer__sidemenu-filter-block">
              <a className="search-transfer__sidemenu-filter-head" data-bs-toggle="collapse" href="#supplierFilterCollapse" role="button" aria-expanded="true" aria-controls="supplierFilterCollapse">
                <div className="search-transfer__sidemenu-filter-head--title">Supplier</div>
                <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
              </a>
              <div id="supplierFilterCollapse" className="collapse show search-transfer__sidemenu-filter-block">
                {data.supplier.map(({ trading_as, fleet_count }, index) => (
                  <div key={index} className="search-transfer__sidemenu-filter-item form-check">
                    <input type="checkbox" id={`sidebar-supplier-${index}`} className="form-check-input" checked={filters.supplier.values.includes(trading_as)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const checked = e.target.checked
                      let values = filters.supplier.values
                      if (checked) values = !values.includes(trading_as) ? [...values, trading_as] : values
                      else values = values.filter((v) => v != trading_as)
                      filters.supplier.onChange(values)
                    }} />
                    <label htmlFor={`sidebar-supplier-${index}`} className="form-check-label">{trading_as}</label>
                    <p className="search-transfer__sidemenu-filter-counter">{fleet_count}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="search-transfer__sidemenu-filter-divider"></div>
          </>
        )}
        <div className="search-transfer__sidemenu-filter-block">
          <a className="search-transfer__sidemenu-filter-head" data-bs-toggle="collapse" href="#passengerFilterCollapse" role="button" aria-expanded="true" aria-controls="passengerFilterCollapse">
            <div className="search-transfer__sidemenu-filter-head--title">Passenger Capability</div>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </a>
          <div id="passengerFilterCollapse" className="collapse show search-transfer__sidemenu-filter-block">
            {filters.passenger.options.map(({ id, display }, index) => (
              <div key={index} className="search-transfer__sidemenu-filter-item form-check">
                <input type="radio" id={`sidebar-passenger-${id}`} name="sidebar-passenger" className="form-check-input" value={id} checked={index === filters.passenger.value} onChange={() => filters.passenger.onChange(index)} />
                <label htmlFor={`sidebar-passenger-${id}`} className="form-check-label">{display}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="search-transfer__sidemenu-filter-divider"></div>
        {!!data?.car_brand?.length && (
          <>
            <div className="search-transfer__sidemenu-filter-block">
              <a className="search-transfer__sidemenu-filter-head" data-bs-toggle="collapse" href="#cardBrandFilterCollapse" role="button" aria-expanded="true" aria-controls="cardBrandFilterCollapse">
                <div className="search-transfer__sidemenu-filter-head--title">Car Brand</div>
                <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
              </a>
              <div id="cardBrandFilterCollapse" className="collapse show search-transfer__sidemenu-filter-block">
                {data.car_brand.map(({ brand_name, brand_total }, index) => (
                  <div key={index} className="search-transfer__sidemenu-filter-item form-check">
                    <input type="checkbox" id={`sidebar-car_brand-${index}`} className="form-check-input" checked={filters.car_brand.values.includes(brand_name)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const checked = e.target.checked
                      let values = filters.car_brand.values
                      if (checked) values = !values.includes(brand_name) ? [...values, brand_name] : values
                      else values = values.filter((v) => v != brand_name)
                      filters.car_brand.onChange(values)
                    }} />
                    <label htmlFor={`sidebar-car_brand-${index}`} className="form-check-label">{brand_name}</label>
                    <p className="search-transfer__sidemenu-filter-counter">{brand_total}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="search-transfer__sidemenu-filter-divider"></div>
          </>
        )}
        {/* {!!data?.specification?.length && (
          <>
            <div className="search-transfer__sidemenu-filter-block">
              <a className="search-transfer__sidemenu-filter-head" data-bs-toggle="collapse" href="#cardSpesificationFilterCollapse" role="button" aria-expanded="true" aria-controls="cardSpesificationFilterCollapse">
                <div className="search-transfer__sidemenu-filter-head--title">Car Specifications</div>
                <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
              </a>
              <div id="cardSpesificationFilterCollapse" className="collapse show search-transfer__sidemenu-filter-block">
                {data.specification.map((item, index) => (
                  <div key={index} className="search-transfer__sidemenu-filter-item form-check">
                    <input type="checkbox" id={`sidebar-specification-${index}`} className="form-check-input" checked={filters.specification.values.includes(item)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const checked = e.target.checked
                      let values = filters.specification.values
                      if (checked) values = !values.includes(item) ? [...values, item] : values
                      else values = values.filter((v) => v != item)
                      filters.specification.onChange(values)
                    }} />
                    <label htmlFor={`sidebar-specification-${index}`} className="form-check-label">{item}</label>
                    <p className="search-transfer__sidemenu-filter-counter">{124}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="search-transfer__sidemenu-filter-divider"></div>
          </>
        )} */}
        {Array.isArray(data?.specification) && data?.specification.length > 0 && (
          <>
            <div className="search-transfer__sidemenu-filter-block">
              <a className="search-transfer__sidemenu-filter-head" data-bs-toggle="collapse" href="#cardSpesificationFilterCollapse" role="button" aria-expanded="true" aria-controls="cardSpesificationFilterCollapse">
                <div className="search-transfer__sidemenu-filter-head--title">Car Specifications</div>
                <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
              </a>
              <div id="cardSpesificationFilterCollapse" className="collapse show search-transfer__sidemenu-filter-block">
                {data?.specification.map((item, index) => (
                  <div key={index} className="search-transfer__sidemenu-filter-item form-check">
                    <input type="checkbox" id={`sidebar-specification-${index}`} className="form-check-input" checked={filters.specification.values.includes(item.spec_name)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const checked = e.target.checked;
                      let values = filters.specification.values;
                      if (checked) values = !values.includes(item.spec_name) ? [...values, item.spec_name] : values;
                      else values = values.filter((v) => v !== item.spec_name);
                      filters.specification.onChange(values);
                    }} />
                    <label htmlFor={`sidebar-specification-${index}`} className="form-check-label">{item.spec_name}</label>
                    <p className="search-transfer__sidemenu-filter-counter">{typeof item === 'string' ? 0 : item.spec_total}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="search-transfer__sidemenu-filter-divider"></div>
          </>
        )}
        <div onClick={() => {
          price.onChange([30, 120])
          filters.supplier.onChange([])
          filters.passenger.onChange(0)
          filters.car_brand.onChange([])
          filters.specification.onChange([])
        }} className="search-transfer__sidemenu-filter-button" style={{ cursor: 'pointer' }}>Clear filters</div>
      </div>
    </div >
  )
}

export default SearchBookTransfer
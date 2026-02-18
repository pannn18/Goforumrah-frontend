import React, { useEffect, useState } from 'react'
import { Icons, Images, StarDescription } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import HotelCard from '@/components/pages/search/hotel/hotelCard'
import Link from 'next/link'
import { HotelSearchBar } from '../../home/searchBar'
import DropdownMenu from '@/components/elements/dropdownMenu'
import RangeSlider from '@/components/elements/rangeSlider'
import { useRouter } from 'next/router'
import { Hotel, HotelPassenger } from '@/types/types'
import { callAPI } from '@/lib/axiosHelper'
import { Range } from 'react-date-range'
import moment from 'moment'
import useFetch from '@/hooks/useFetch'
import sidemenuMapImage from '@/assets/images/sidemenu_maps.png'
import { set } from 'react-hook-form'
import LoadingOverlay from '@/components/loadingOverlay'

interface IProps {

}

interface Filters {
  price_range?: [number, number]
  star_rating?: (string | number)[]
  region?: string[]
  review?: (string | number)[]
  benefits?: string[]
  room_facilities?: string[]
  property_type?: string[]
}

const SearchHotel = ({ }: IProps) => {
  const router = useRouter()
  const search = (router.query?.search || '') as string

  const [showPriceFilterDropdown, setShowPriceFilterDropdown] = useState<boolean>(false)
  const [priceFilter, setPriceFilter] = useState<string>('Per Room Per Night')
  const [filters, setFilters] = useState<Filters>({
    price_range: [0, 1000],
    star_rating: [],
    region: [],
    review: [],
    benefits: [],
    room_facilities: [],
    property_type: []
  })


  const [starRatings, setStarRatings] = useState<{ rating: string | number, many_hotels: number }[]>([])
  const [reviewRatings, setReviewRatings] = useState<{ rating: string | number, many_hotels: number }[]>([])
  const [regions, setRegions] = useState<{ region: string, many_hotels: number }[]>([])

  useEffect(() => {
    (async () => {
      if (!search) return

      const { data: starRatings }: { data: { rating: string | number, many_hotels: number }[] } = await callAPI('/hotel/filters/star-rating', 'POST', { city: search })
      const { data: reviewRatings }: { data: { rating: string | number, many_hotels: number }[] } = await callAPI('/hotel/filters/review', 'POST', { city: search })
      const { data: regions }: { data: { region: string, many_hotels: number }[] } = await callAPI('/hotel/filters/region', 'POST', { city: search })

      setStarRatings(starRatings)
      setReviewRatings(reviewRatings)
      setRegions(regions)
    })()
  }, [search])

  const [data, setData] = useState<Hotel[]>([])
  const [totalData, setTotalData] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)

  const sortBy: string[] = [
    'Recommended',
    'Price (lowest first)',
    'Price (highest first)',
    'Rating (highest first)',
    'Hotel Star (highest first)',
  ]

  const [selectedSortBy, setSelectedSortBy] = useState<number>(0)

  const loadHotels = async () => {
    const savedDateRange = localStorage.getItem('search-hotel-date')
    let initialDateRange: Range = JSON.parse(savedDateRange)

    const savedPassenger = localStorage.getItem('search-hotel-passenger')
    let initialPassenger: HotelPassenger = JSON.parse(savedPassenger)

    if (!search || !initialDateRange) return

    setLoading(true)

    const updatedFilters = {
      price_range: `${filters.price_range[0]}-${filters.price_range[1]}`,
      ...(filters.star_rating.length && {
        star_rating: filters.star_rating
      }),
      ...(filters.region.length && {
        region: filters.region
      }),
      ...(filters.review.length && {
        review_rating: filters.review
      }),
      ...(filters.benefits.length && {
        benefits: filters.benefits
      }),
      ...(filters.room_facilities.length && {
        room_facilities: filters.room_facilities
      }),
      ...(filters.property_type.length && {
        property_type: filters.property_type
      }),
    }

    const checkInDate = moment(initialDateRange.startDate).format('YYYY-MM-DD')
    const checkOutDate = moment(initialDateRange.endDate).format('YYYY-MM-DD')

    const payload = {
      city: search,
      check_in: checkInDate,
      check_out: checkOutDate,
      number_of_person: initialPassenger ? initialPassenger.adult : 1,
      sort: selectedSortBy + 1,
      show_per_page: 10,
      page: currentPage,
      ...updatedFilters,
    }

    const { ok, error, data } = await callAPI('/hotel/show', 'POST', payload)
    if (ok && data) {
      const modifiedData = data?.data.map((hotel) => ({
        ...hotel,
        checkInDate,
        checkOutDate,
        hotel_photo_thumbnail: hotel?.hotel_photo?.[0]?.photo || Images.Placeholder,
      }))
      setData(modifiedData)
      setTotalData(data?.total || 0)
      setLastPage(data?.last_page || 1)
    } else {
      // TODO: Handle the error
    }
    
    setLoading(false)
  }

  const [passenger, setPassenger] = useState(null)
  useEffect(() => {
    // Load saved passenger
    const savedPassenger = localStorage.getItem('search-hotel-passenger')
    let initialPassenger: HotelPassenger = JSON.parse(savedPassenger)
    setPassenger(initialPassenger)
  }, [currentPage])

  useEffect(() => {
    loadHotels()
  }, [search, filters, selectedSortBy, currentPage])


  return (
    <main className="search-hotel">
      <div className="search-hotel__header-form">
        <div className="container">
          <HotelBreadCrumb />
          <HotelSearchBar useVariant={true} search={search} onSearchChange={() => loadHotels()} />
        </div>
      </div>
      <HeaderFilters
        price={{
          values: filters.price_range,
          onChange: (price_range) => setFilters(prevState => ({ ...prevState, price_range }))
        }}
        rating={{
          stars: starRatings,
          values: filters.star_rating,
          onChange: (star_rating) => setFilters(prevState => ({ ...prevState, star_rating }))
        }}
        region={{
          regions,
          values: filters.region,
          onChange: (region) => setFilters(prevState => ({ ...prevState, region }))
        }}
        review={{
          stars: reviewRatings,
          values: filters.review,
          onChange: (review) => setFilters(prevState => ({ ...prevState, review }))
        }}
        benefits={{
          values: filters.benefits,
          onChange: (benefits) => setFilters(prevState => ({ ...prevState, benefits }))
        }}
        room_facilities={{
          values: filters.room_facilities,
          onChange: (room_facilities) => setFilters(prevState => ({ ...prevState, room_facilities }))
        }}
        property_type={{
          values: filters.property_type,
          onChange: (property_type) => setFilters(prevState => ({ ...prevState, property_type }))
        }}
      />
      <div className="container">
        <div className="search-hotel__wrapper">
          <Sidebar
            benefits={{
              values: filters.benefits,
              onChange: (benefits) => setFilters(prevState => ({ ...prevState, benefits }))
            }}
            sortBy={{
              values: sortBy,
              selected: selectedSortBy,
              onChange: (value) => setSelectedSortBy(value)
            }}
          />
          <div className="search-hotel__content">
            <div className="search-hotel__content-header">
              <div className="search-hotel__content-header-title">Showing {totalData} best accomodation with best deals</div>
              <div className="custom-dropdown">
                <div className="custom-dropdown-toggle" onClick={() => setShowPriceFilterDropdown(true)}>
                  <div>Show Price : {priceFilter}</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
                <DropdownMenu show={showPriceFilterDropdown} setShow={setShowPriceFilterDropdown} className="search-hotel__filter-dropdown-menu" style={{ width: '100%' }}>
                  <div className="custom-dropdown-menu__options">
                    {['Per Room Per Night'].map((value, index) => (
                      <div key={index} onClick={() => {
                        setPriceFilter(value)
                        setShowPriceFilterDropdown(false)
                      }} className="custom-dropdown-menu__option">{value}</div>
                    ))}
                  </div>
                </DropdownMenu>
              </div>
            </div>
            <div className="search-hotel__content-list">
              {loading ? (
                <LoadingOverlay />
              ) : !!data.length && data.map(({ id_hotel, property_name, street_address, price, star_rating, checkInDate, checkOutDate, hotel_photo_thumbnail }, index) => (
                <HotelCard
                  image={hotel_photo_thumbnail}
                  name={property_name}
                  location={street_address}
                  price={{ amount: `${price}`, description: 'night' }}
                  star={star_rating}
                  starDescription={StarDescription[`Rating${Math.round(star_rating || 0)}`]}
                  linkURL={`/hotel/detail?id=${id_hotel}&search=${search}&checkin=${checkInDate}&checkout=${checkOutDate}&adult=${passenger?.adult}&children=${passenger?.children}`}
                  key={index}
                />
              ))}
            </div>
            {!loading && (
              <div className="search-hotel__pagination">
                <div className="pagination">
                  <button type="button" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(90deg)', cursor: currentPage === 1 ? 'default' : 'pointer' }}>
                    <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                  </button>
                  {Array.from({ length: lastPage }, (_, i) => i + 1).map((number) => {
                    const isCloseToCurrent = number >= currentPage - 2 && number <= currentPage + 2
                    const hasMoreOnLeft = number !== 1 && number === currentPage - 3
                    const hasMoreOnRight = number !== lastPage && number === currentPage + 3
                    const isFirst = number === 1
                    const isLast = number === lastPage

                    const isVisible = isCloseToCurrent || hasMoreOnLeft || hasMoreOnRight || isFirst || isLast

                    return isVisible && (
                      <button key={number} onClick={() => !(hasMoreOnLeft || hasMoreOnRight) && setCurrentPage(number)} type="button" className={`pagination__button ${number === currentPage ? 'active' : ''}`} style={{ cursor: hasMoreOnLeft || hasMoreOnRight ? 'default' : 'pointer' }}>{(hasMoreOnLeft || hasMoreOnRight) ? '...' : number}</button>
                    )
                  })}
                  <button type="button" onClick={() => currentPage < lastPage && setCurrentPage(currentPage + 1)} className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(-90deg)', cursor: currentPage === lastPage ? 'default' : 'pointer' }}>
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

const HeaderFilters = (props: {
  price: {
    values: [number, number]
    onChange: (values: [number, number]) => void
  }
  rating: {
    stars: { rating: string | number, many_hotels: number }[]
    values: (string | number)[]
    onChange: (values: (string | number)[]) => void
  }
  region: {
    regions: { region: string, many_hotels: number }[]
    values: string[]
    onChange: (values: string[]) => void
  }
  review: {
    stars: { rating: string | number, many_hotels: number }[]
    values: (string | number)[]
    onChange: (values: (string | number)[]) => void
  }
  benefits: {
    values: string[]
    onChange: (values: string[]) => void
  }
  room_facilities: {
    values: string[]
    onChange: (values: string[]) => void
  }
  property_type: {
    values: string[]
    onChange: (values: string[]) => void
  }
}) => {
  const { price, rating, region, review } = props
  const [showPriceDropdown, setShowPriceDropdown] = useState<boolean>(false)
  const [showRatingDropdown, setShowRatingDropdown] = useState<boolean>(false)
  const [showRegionDropdown, setShowRegionDropdown] = useState<boolean>(false)
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  const [showMoreFilterDropdown, setShowMoreFilterDropdown] = useState<boolean>(false)
  const [benefits, setBenefits] = useState<string[]>(props.benefits.values)
  const [roomFacilities, setRoomFacilities] = useState<string[]>(props.room_facilities.values)
  const [propertyType, setPropertyType] = useState<string[]>(props.property_type.values)

  return (
    <div className="search-hotel__filters">
      <div className="container">
        <div className="search-hotel__filters-inner-wrapper">
          <div className="search-hotel__filters-title">Filters</div>
          <div className="search-hotel__filters-content">
            <div className="custom-dropdown">
              <div onClick={() => setShowPriceDropdown(true)} className="custom-dropdown-toggle">
                <SVGIcon src={Icons.PriceTag} width={20} height={20} />
                <div>Price</div>
                <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
              </div>
              <DropdownMenu show={showPriceDropdown} setShow={setShowPriceDropdown} className="search-hotel__filter-dropdown-menu" style={{ marginTop: 28, width: 396 }}>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Price Range</div>
                  <div onClick={() => price.onChange([0, 1000])} className="link-green-01 fw-bold" style={{ cursor: 'pointer' }}>Reset</div>
                </div>
                <div className="custom-dropdown-menu__body">
                  <div className="d-flex gap-4 flex-row align-items-center">
                    <div>
                      <input type="number" className="form-control" placeholder="$0" min={0} value={price.values[0]} onChange={(e: React.ChangeEvent<HTMLInputElement>) => price.onChange([Number(e.target.value), price.values[1]])} />
                    </div>
                    <div>
                      <input type="number" className="form-control" placeholder="$1000" max={1000} value={price.values[1]} />
                    </div>
                  </div>
                  <div className="mt-2 pt-1 px-2">
                    <RangeSlider domain={[0, 1000]} values={price.values} onChange={(values) => price.onChange([values[0], values[1]])} step={1} />
                  </div>
                </div>
              </DropdownMenu>
            </div>
            {!!rating.stars?.length && (
              <div className="custom-dropdown">
                <div onClick={() => setShowRatingDropdown(true)} className="custom-dropdown-toggle">
                  <SVGIcon src={Icons.Star} width={20} height={20} />
                  <div>Star Rating</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
                <DropdownMenu show={showRatingDropdown} setShow={setShowRatingDropdown} className="search-hotel__filter-dropdown-menu" style={{ marginTop: 28, width: 396 }}>
                  <div className="custom-dropdown-menu__header">
                    <div className="custom-dropdown-menu__title">Hotel Ratings</div>
                    <div onClick={() => rating.onChange([])} className="link-green-01 fw-bold" style={{ cursor: 'pointer' }}>Reset</div>
                  </div>
                  <div className="custom-dropdown-menu__options">
                    {rating.stars.sort((a, b) => (Number(a.rating) - Number(b.rating)) || 0).map(({ rating: star, many_hotels }, index) => (
                      <div key={index} className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                        <div className="form-check">
                          <input type="checkbox" id={`hotel-rating-${index}`} className="form-check-input" checked={rating.values.includes(star)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked
                            let values = rating.values
                            if (checked) values = !values.includes(star) ? [...values, star] : values
                            else values = values.filter((v) => v != star)
                            rating.onChange(values)
                          }} />
                          <label htmlFor={`hotel-rating-${index}`} className="form-check-label">
                            <div className="d-flex flex-row align-items-center">
                              {star.toString().toLowerCase() === 'unrated' ? (
                                <span className="me-2">{star}</span>
                              ) : (
                                <div className="d-flex gap-1 flex-row align-items-center me-2">
                                  {Array.from(Array(star).keys()).map((index) => (
                                    <SVGIcon key={index} src={Icons.Star} width={16} height={16} color="#EECA32" />
                                  ))}
                                </div>
                              )}
                              <span className="text-neutral-subtle fw-normal">({many_hotels} Property)</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenu>
              </div>
            )}
            {!!region.regions?.length && (
              <div className="custom-dropdown">
                <div onClick={() => setShowRegionDropdown(true)} className="custom-dropdown-toggle">
                  <SVGIcon src={Icons.MapPin} width={20} height={20} />
                  <div>Region</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
                <DropdownMenu show={showRegionDropdown} setShow={setShowRegionDropdown} className="search-hotel__filter-dropdown-menu" style={{ marginTop: 28, width: 396 }}>
                  <div className="custom-dropdown-menu__header">
                    <div className="custom-dropdown-menu__title">Region</div>
                    <div onClick={() => { }} className="link-green-01 fw-bold" style={{ cursor: 'pointer' }}>Reset</div>
                  </div>
                  <div className="custom-dropdown-menu__options">
                    {region.regions.map(({ region: name, many_hotels }, index) => (
                      <div key={index} className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                        <div className="form-check">
                          <input type="checkbox" id={`hotel-region-${index}`} className="form-check-input" checked={region.values.includes(name)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked
                            let values = region.values
                            if (checked) values = !values.includes(name) ? [...values, name] : values
                            else values = values.filter((v) => v != name)
                            region.onChange(values)
                          }} />
                          <label htmlFor={`hotel-region-${index}`} className="form-check-label">
                            <div className="d-flex flex-row align-items-center">
                              <span className="me-2">{name}</span>
                              <span className="text-neutral-subtle fw-normal">({many_hotels} Property)</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenu>
              </div>
            )}

            {!!review.stars?.length && (
              <div className="custom-dropdown">
                <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
                  <SVGIcon src={Icons.ThumbsUp} width={20} height={20} />
                  <div>Review</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
                <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="search-hotel__filter-dropdown-menu" style={{ marginTop: 28, width: 396 }}>
                  <div className="custom-dropdown-menu__header">
                    <div className="custom-dropdown-menu__title">Review</div>
                    <div onClick={() => review.onChange([])} className="link-green-01 fw-bold" style={{ cursor: 'pointer' }}>Reset</div>
                  </div>
                  <div className="custom-dropdown-menu__options">
                    {review.stars.sort((a, b) => (Number(a.rating) - Number(b.rating)) || 0).map(({ rating: star, many_hotels }, index) => (
                      <div key={index} className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                        <div className="form-check">
                          <input type="checkbox" id={`hotel-review-${index}`} className="form-check-input" checked={review.values.includes(star)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked
                            let values = review.values
                            if (checked) values = !values.includes(star) ? [...values, star] : values
                            else values = values.filter((v) => v != star)
                            review.onChange(values)
                          }} />
                          <label htmlFor={`hotel-review-${index}`} className="form-check-label">
                            <div className="d-flex flex-row align-items-center">
                              {star.toString().toLowerCase() === 'unrated' ? (
                                <span className="me-2">{star}</span>
                              ) : (
                                <div className="d-flex gap-1 flex-row align-items-center me-2">
                                  {Array.from(Array(star).keys()).map((index) => (
                                    <SVGIcon key={index} src={Icons.Star} width={16} height={16} color="#EECA32" />
                                  ))}
                                </div>
                              )}
                              <span className="text-neutral-subtle fw-normal">({many_hotels} Property)</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </DropdownMenu>
              </div>
            )}

            <div className="custom-dropdown">
              <div onClick={() => setShowMoreFilterDropdown(true)} className="custom-dropdown-toggle">
                <SVGIcon src={Icons.Sliders} width={20} height={20} />
                <div>More Filter</div>
                <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
              </div>
              <DropdownMenu show={showMoreFilterDropdown} setShow={setShowMoreFilterDropdown} className="search-hotel__filter-dropdown-menu custom-dropdown-menu--right" style={{ marginTop: 28, width: 740 }}>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Benefits</div>
                </div>
                <div className="custom-dropdown-menu__body">
                  <div className="w-100 row gx-3 row-cols-3">
                    {['Breakfast', 'Free Cancelation', 'Deals'].map((value, index) => (
                      <div key={index} className="col custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border-all">
                        <div className="form-check">
                          <input type="checkbox" id={`benefits-${index}`} className="form-check-input" checked={benefits.includes(value)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked
                            let values = benefits
                            if (checked) values = !values.includes(value) ? [...values, value] : values
                            else values = values.filter((v) => v != value)
                            setBenefits(values)
                          }} />
                          <label htmlFor={`benefits-${index}`} className="form-check-label">{value}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Room Facilities</div>
                </div>
                <div className="custom-dropdown-menu__body">
                  <div className="w-100 row gx-3 row-cols-3">
                    {['Bathub', 'Coffee Tea Maker', 'Connecting Room', 'Hair Dryer', 'Kitchen', 'Washing Machine', 'Ironing', 'TV'].map((value, index) => (
                      <div key={index} className="col custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border-all">
                        <div className="form-check">
                          <input type="checkbox" id={`room-facilities-${index}`} className="form-check-input" checked={roomFacilities.includes(value)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked
                            let values = roomFacilities
                            if (checked) values = !values.includes(value) ? [...values, value] : values
                            else values = values.filter((v) => v != value)
                            setRoomFacilities(values)
                          }} />
                          <label htmlFor={`room-facilities-${index}`} className="form-check-label">{value}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Property Type</div>
                </div>
                <div className="custom-dropdown-menu__body">
                  <div className="w-100 row gx-3 row-cols-3">
                    {['Hotel', 'Lodge', 'Love Hotel', 'Guest house', 'Ryokan', 'Motel'].map((value, index) => (
                      <div key={index} className="col custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border-all">
                        <div className="form-check">
                          <input type="checkbox" id={`property-type-${index}`} className="form-check-input" checked={propertyType.includes(value)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const checked = e.target.checked
                            let values = propertyType
                            if (checked) values = !values.includes(value) ? [...values, value] : values
                            else values = values.filter((v) => v != value)
                            setPropertyType(values)
                          }} />
                          <label htmlFor={`property-type-${index}`} className="form-check-label">{value}</label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="custom-dropdown-menu__footer">
                  <div className="d-flex flex-row gap-5 align-items-center justify-content-end">
                    <div onClick={() => {
                      setBenefits([])
                      setRoomFacilities([])
                      setPropertyType([])
                    }} className="link-green-01" style={{ cursor: 'pointer' }}>Reset</div>
                    <button onClick={() => {
                      props.benefits.onChange(benefits)
                      props.room_facilities.onChange(roomFacilities)
                      props.property_type.onChange(propertyType)
                    }} type="button" className="btn btn-success">Apply</button>
                  </div>
                </div>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HotelBreadCrumb = () => {
  return (
    <div className="search-hotel__breadcrumb">
      <Link className="search-hotel__breadcrumb--link" href="/">Home</Link>
      <p>/</p>
      <p className="search-hotel__breadcrumb--current">Search Hotel</p>
    </div>
  )
}



const Sidebar = (props: {
  benefits: {
    values: string[]
    onChange: (values: string[]) => void
  }
  sortBy: {
    values: string[]
    selected: number
    onChange: (value: number) => void
  }
}) => {
  const sidebarFilters = ['Book without credit card', 'Breakfast included', 'Free cancellation', 'All-inclusive', 'Breakfast & dinner included', 'No prepayment']
  const { benefits, sortBy } = props
  const [allBenefits, setAllBenefits] = useState<boolean>(false)

  useEffect(() => {
    benefits.onChange(allBenefits ? sidebarFilters : [])
  }, [allBenefits])


  return (
    <div className="search-hotel__sidemenu">
      <div className="search-hotel__sidemenu-filter">
        <div className="search-hotel__sidemenu-filter-block search-hotel__sidemenu-filter-block--dropdown">
          <a className="search-hotel__sidemenu-filter-head" data-bs-toggle="collapse" href="#popularFilterCollapse" role="button" aria-expanded="true" aria-controls="popularFilterCollapse">
            <div className="search-hotel__sidemenu-filter-head--title">Popular filters</div>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </a>
          <div id="popularFilterCollapse" className="collapse show search-hotel__sidemenu-filter-block">
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInputAll" className="form-check-input" defaultChecked />
              <input type="checkbox" id={`sidebar-benefits-all`} className="form-check-input" checked={allBenefits} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const checked = e.target.checked
                setAllBenefits(checked)
              }} />
              <label htmlFor={`sidebar-benefits-all`} className="form-check-label">All</label>
            </div>
            {sidebarFilters.map((value, index) => (
              <div key={index} className="search-hotel__sidemenu-filter-item form-check">
                <input type="checkbox" id={`sidebar-benefits-${index}`} className="form-check-input" checked={benefits.values.includes(value)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const checked = e.target.checked
                  let values = benefits.values
                  if (checked) values = !values.includes(value) ? [...values, value] : values
                  else values = values.filter((v) => v != value)
                  benefits.onChange(values)
                }} />
                <label htmlFor={`sidebar-benefits-${index}`} className="form-check-label">{value}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="search-hotel__sidemenu-filter-block search-hotel__sidemenu-filter-block--dropdown">
          <a className="search-hotel__sidemenu-filter-head" data-bs-toggle="collapse" href="#sortFilterCollapse" role="button" aria-expanded="true" aria-controls="sortFilterCollapse">
            <div className="search-hotel__sidemenu-filter-head--title">Sort By</div>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </a>
          <div id="sortFilterCollapse" className="collapse show search-hotel__sidemenu-filter-block">
            {sortBy.values.map((item, index) => (
              <div key={index} className="search-hotel__sidemenu-filter-item form-check">
                <input type="radio" id={`filter-sort-${index}`} name="filter-sort" className="form-check-input" value={index} checked={index === sortBy.selected} onChange={(e: React.ChangeEvent<HTMLInputElement>) => sortBy.onChange(index)} />
                <label htmlFor={`filter-sort-${index}`} className="form-check-label">{item}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchHotel
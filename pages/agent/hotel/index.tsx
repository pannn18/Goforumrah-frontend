import React, { useState } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import HotelCard from '@/components/pages/search/hotel/hotelCard'
import sidemenuMapImage from '@/assets/images/sidemenu_maps.png'
// import { HotelSearchBar } from '../../home/searchBar'
import AgentNavbar from "@/components/layout/agentNavbar"
import { HotelSearchBar } from '@/components/pages/home/searchBar'
import DropdownMenu from '@/components/elements/dropdownMenu'
import RangeSlider from '@/components/elements/rangeSlider'
import { Chart as ChartJS, ArcElement, CategoryScale, Filler, Legend, PointElement, Title, Tooltip} from "chart.js";
import { Doughnut } from "react-chartjs-2"

const SearchHotel = () => {
  return (
    <main className="search-hotel">
      <AgentNavbar />
      <SearchForm />
      {/* <Filters /> */}
      <div className="container">
        <div className="search-hotel__wrapper">
          <Sidebar />
          <div className="search-hotel__content">
            <div className="search-hotel__content-selection">
              <div className="search-hotel__content-selection-icon">
                <SVGIcon src={Icons.Heart} height={24} width={24} />
                <p>0</p>
              </div>
              <div className="search-hotel__content-selection-divider"></div>
              <p>Prepare a selection</p>
            </div>
            <div className="search-hotel__content-header">
              <div className="search-hotel__content-header-title">Showing 500+ best accomodation with best deals</div>
              <div className="custom-dropdown">
                <div className="custom-dropdown-toggle">
                  <div>Show Price : Per Room Per Night</div>
                  <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                </div>
              </div>
            </div>
            <HotelList />
            <div className="search-hotel__pagination">
              <div className="pagination">
                <button type="button" className="pagination__button pagination__button--arrow">
                  <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                </button>
                <button type="button" className="pagination__button active">1</button>
                <button type="button" className="pagination__button">2</button>
                <button type="button" className="pagination__button">3</button>
                <button type="button" className="pagination__button">...</button>
                <button type="button" className="pagination__button">12</button>
                <button type="button" className="pagination__button pagination__button--arrow">
                  <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

const SearchForm = () => {
  return (
    <div className="search-hotel__header-form">
      <div className="container">
        <HotelSearchBar useVariant={true} />
      </div>
    </div>
  )
}

const Filters = () => {
  const [showPriceDropdown, setShowPriceDropdown] = useState<boolean>(false)
  const [showRatingDropdown, setShowRatingDropdown] = useState<boolean>(false)
  const [showRegionDropdown, setShowRegionDropdown] = useState<boolean>(false)
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  const [showMoreFilterDropdown, setShowMoreFilterDropdown] = useState<boolean>(false)

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
                  <div className="link-green-01 fw-bold">Reset</div>
                </div>
                <div className="custom-dropdown-menu__body">
                  <div className="d-flex gap-4 flex-row align-items-center">
                    <div>
                      <input type="text" className="form-control" placeholder="Min Price" value={'$0'} />
                    </div>
                    <div>
                      <input type="text" className="form-control" placeholder="Max Price" value={'$1000'} />
                    </div>
                  </div>
                  <div className="mt-2 pt-1 px-2">
                    <RangeSlider domain={[0, 1000]} values={[0, 1000]} step={1} />
                  </div>
                </div>
              </DropdownMenu>
            </div>
            <div className="custom-dropdown">
              <div onClick={() => setShowRatingDropdown(true)} className="custom-dropdown-toggle">
                <SVGIcon src={Icons.Star} width={20} height={20} />
                <div>Star Rating</div>
                <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
              </div>
              <DropdownMenu show={showRatingDropdown} setShow={setShowRatingDropdown} className="search-hotel__filter-dropdown-menu" style={{ marginTop: 28, width: 396 }}>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Hotel Ratings</div>
                  <div className="link-green-01 fw-bold">Reset</div>
                </div>
                <div className="custom-dropdown-menu__options">
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-unrated" className="form-check-input" />
                      <label htmlFor="hotel-rating-unrated" className="form-check-label">
                        <span className="me-2">Unrated</span>
                        <span className="text-neutral-subtle fw-normal">(120 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-5" className="form-check-input" />
                      <label htmlFor="hotel-rating-5" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-4" className="form-check-input" />
                      <label htmlFor="hotel-rating-4" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-3" className="form-check-input" />
                      <label htmlFor="hotel-rating-3" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-2" className="form-check-input" />
                      <label htmlFor="hotel-rating-2" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-1" className="form-check-input" />
                      <label htmlFor="hotel-rating-1" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </DropdownMenu>
            </div>
            <div className="custom-dropdown">
              <div onClick={() => setShowRegionDropdown(true)} className="custom-dropdown-toggle">
                <SVGIcon src={Icons.MapPin} width={20} height={20} />
                <div>Region</div>
                <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
              </div>
              <DropdownMenu show={showRegionDropdown} setShow={setShowRegionDropdown} className="search-hotel__filter-dropdown-menu" style={{ marginTop: 28, width: 396 }}>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Region</div>
                  <div className="link-green-01 fw-bold">Reset</div>
                </div>
                <div className="custom-dropdown-menu__options">
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-alshatiea" className="form-check-input" />
                      <label htmlFor="hotel-rating-alshatiea" className="form-check-label">
                        <span className="me-2">Al Shatiea</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-saristreet" className="form-check-input" />
                      <label htmlFor="hotel-rating-saristreet" className="form-check-label">
                        <span className="me-2">Sari Street</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-herastreet" className="form-check-input" />
                      <label htmlFor="hotel-rating-herastreet" className="form-check-label">
                        <span className="me-2">Hera Street</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-alhamra" className="form-check-input" />
                      <label htmlFor="hotel-rating-alhamra" className="form-check-label">
                        <span className="me-2">Al Hamra</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-alsalamah" className="form-check-input" />
                      <label htmlFor="hotel-rating-alsalamah" className="form-check-label">
                        <span className="me-2">Al Salamah</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-altahliastreet" className="form-check-input" />
                      <label htmlFor="hotel-rating-altahliastreet" className="form-check-label">
                        <span className="me-2">Al Tahlia Street</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-saristreet" className="form-check-input" />
                      <label htmlFor="hotel-rating-saristreet" className="form-check-label">
                        <span className="me-2">Sari Street</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="hotel-rating-saristreet" className="form-check-input" />
                      <label htmlFor="hotel-rating-saristreet" className="form-check-label">
                        <span className="me-2">Sari Street</span>
                        <span className="text-neutral-subtle fw-normal">(20 Property)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </DropdownMenu>
            </div>
            <div className="custom-dropdown">
              <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
                <SVGIcon src={Icons.ThumbsUp} width={20} height={20} />
                <div>Review</div>
                <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
              </div>
              <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="search-hotel__filter-dropdown-menu" style={{ marginTop: 28, width: 396 }}>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Review</div>
                  <div className="link-green-01 fw-bold">Reset</div>
                </div>
                <div className="custom-dropdown-menu__options">
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="review-rating-5" className="form-check-input" />
                      <label htmlFor="review-rating-5" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="review-rating-4" className="form-check-input" />
                      <label htmlFor="review-rating-4" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="review-rating-3" className="form-check-input" />
                      <label htmlFor="review-rating-3" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="review-rating-2" className="form-check-input" />
                      <label htmlFor="review-rating-2" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="form-check">
                      <input type="checkbox" id="review-rating-1" className="form-check-input" />
                      <label htmlFor="review-rating-1" className="form-check-label">
                        <div className="d-flex flex-row align-items-center">
                          <div className="d-flex gap-1 flex-row align-items-center me-2">
                            <SVGIcon src={Icons.Star} width={16} height={16} color="#EECA32" />
                          </div>
                          <span className="text-neutral-subtle fw-normal">(90 Property)</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </DropdownMenu>
            </div>
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
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="w-100 row g-3 row-cols-3">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-benefit-breakfast" className="form-check-input" />
                          <label htmlFor="more-benefit-breakfast" className="form-check-label">Breakfast</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-benefit-cancelation" className="form-check-input" />
                          <label htmlFor="more-benefit-cancelation" className="form-check-label">Free Cancelation</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-benefit-deals" className="form-check-input" />
                          <label htmlFor="more-benefit-deals" className="form-check-label">Deals</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Room Facilities</div>
                </div>
                <div className="custom-dropdown-menu__body">
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="w-100 row g-3 row-cols-3">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-bathtub" className="form-check-input" />
                          <label htmlFor="more-facilities-bathtub" className="form-check-label">Bathtub</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-coffee" className="form-check-input" />
                          <label htmlFor="more-facilities-coffee" className="form-check-label">Coffee Tea Maker</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-connecting-room" className="form-check-input" />
                          <label htmlFor="more-facilities-connecting-room" className="form-check-label">Connecting Room</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="w-100 row g-3 row-cols-3">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-hair-dryer" className="form-check-input" />
                          <label htmlFor="more-facilities-hair-dryer" className="form-check-label">Hair Dryer</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-kitchen" className="form-check-input" />
                          <label htmlFor="more-facilities-kitchen" className="form-check-label">Kitchen</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-washing-machine" className="form-check-input" />
                          <label htmlFor="more-facilities-washing-machine" className="form-check-label">Washing Machine</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="w-100 row g-3 row-cols-3">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-ironing" className="form-check-input" />
                          <label htmlFor="more-facilities-ironing" className="form-check-label">Ironing</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-tv" className="form-check-input" />
                          <label htmlFor="more-facilities-tv" className="form-check-label">TV</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="custom-dropdown-menu__header">
                  <div className="custom-dropdown-menu__title">Property Type</div>
                </div>
                <div className="custom-dropdown-menu__body">
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="w-100 row g-3 row-cols-3">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-hotel" className="form-check-input" />
                          <label htmlFor="more-facilities-hotel" className="form-check-label">Hotel</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-lodge" className="form-check-input" />
                          <label htmlFor="more-facilities-lodge" className="form-check-label">Lodge</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-love-hotel" className="form-check-input" />
                          <label htmlFor="more-facilities-love-hotel" className="form-check-label">Love Hotel</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="custom-dropdown-menu__option custom-dropdown-menu__option--readonly custom-dropdown-menu__option--border">
                    <div className="w-100 row g-3 row-cols-3">
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-guest-house" className="form-check-input" />
                          <label htmlFor="more-facilities-guest-house" className="form-check-label">Guest House</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-ryokan" className="form-check-input" />
                          <label htmlFor="more-facilities-ryokan" className="form-check-label">Ryokan</label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <input type="checkbox" id="more-facilities-motel" className="form-check-input" />
                          <label htmlFor="more-facilities-motel" className="form-check-label">Motel</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="custom-dropdown-menu__footer">
                  <div className="d-flex flex-row gap-5 align-items-center justify-content-end">
                    <a type="button" className="link-green-01">Reset</a>
                    <button type="button" className="btn btn-success">Apply</button>
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

ChartJS.register( ArcElement, CategoryScale, PointElement, Title, Tooltip, Filler, Legend);
export const bookOptions = {  
  maintainAspectRatio: false,  
  responsive: true,
  cutout: "80%",
  borderRaduys: 20,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: false },    
    beforeDraw: function(chart) {
      var width = chart.width,
      height = chart.height,
      ctx = chart.ctx;
      ctx.restore();
      var fontSize = (height / 160).toFixed(2);
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "top";
      var text = "Foo-bar",
      textX = Math.round((width - ctx.measureText(text).width) / 2),
      textY = height / 2;
      ctx.fillText(text, textX, textY);
      ctx.save();
     }
  }
};

const plugins = [{
  beforeDraw: function(chart) {
   var width = chart.width,
       height = chart.height,
       ctx = chart.ctx;
       ctx.restore();
       var fontSize = (height / 160).toFixed(2);
       ctx.font = fontSize + "em sans-serif";
       ctx.textBaseline = "top";
       var text = "Foo-bar",
       textX = Math.round((width - ctx.measureText(text).width) / 2),
       textY = height / 2;
       ctx.fillText(text, textX, textY);
       ctx.save();
  }
}]

export const bookData = {
  labels: ["Hotel"],
  datasets: [
    {
      label: "Hotel Quota",
      data: [40, 60],
      backgroundColor: [
        "#EECA32",
        "#FAFBFB"
      ],      
      borderWidth: 0
    }
  ]
};

const Sidebar = () => {
  return (
    <div className="search-hotel__sidemenu">
      <div className="search-hotel__sidemenu-quota">
        <button className="search-hotel__sidemenu-quota-button">
          <SVGIcon src={Icons.Cancel} width={20} height={20} />
        </button>
        <div style={{width: '140px', height: '140px'}}>
          <Doughnut options={bookOptions} data={bookData} height={140} width={140} />
        </div>
        <div className="search-hotel__sidemenu-quota-text">
          <p className="search-hotel__sidemenu-quota-title">Hotel in Makkah</p>
          <p className="search-hotel__sidemenu-quota-desc">519 out of 1100 hotels are available for your travel dates</p>
        </div>
      </div>      
      <div className="search-hotel__sidemenu-filter">
        <div className="search-hotel__sidemenu-filter-block">
          <a className="search-hotel__sidemenu-filter-head" data-bs-toggle="collapse" href="#popularFilterCollapse" role="button" aria-expanded="true" aria-controls="popularFilterCollapse">
            <div className="search-hotel__sidemenu-filter-head--title">Popular filters</div>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </a>
          <div id="popularFilterCollapse" className="collapse show search-hotel__sidemenu-filter-block">
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInputAll" className="form-check-input" defaultChecked />
              <label htmlFor="filterInputAll" className="form-check-label">All</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInput1" className="form-check-input" />
              <label htmlFor="filterInput1" className="form-check-label">Book without credit card</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInput2" className="form-check-input" />
              <label htmlFor="filterInput2" className="form-check-label">Breakfast included</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInput3" className="form-check-input" />
              <label htmlFor="filterInput3" className="form-check-label">Free cancellation</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInput4" className="form-check-input" />
              <label htmlFor="filterInput4" className="form-check-label">All-inclusive</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInput5" className="form-check-input" />
              <label htmlFor="filterInput5" className="form-check-label">Breakfast & dinner included</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="checkbox" id="filterInput6" className="form-check-input" />
              <label htmlFor="filterInput6" className="form-check-label">No prepayment</label>
            </div>
          </div>
        </div>
        <div className="search-hotel__sidemenu-filter-block">
          <a className="search-hotel__sidemenu-filter-head" data-bs-toggle="collapse" href="#sortFilterCollapse" role="button" aria-expanded="true" aria-controls="sortFilterCollapse">
            <div className="search-hotel__sidemenu-filter-head--title">Sort By</div>
            <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
          </a>
          <div id="sortFilterCollapse" className="collapse show search-hotel__sidemenu-filter-block">
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="radio" id="filterSort1" name="filterSort" className="form-check-input" defaultChecked />
              <label htmlFor="filterSort1" className="form-check-label">Recommended</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="radio" id="filterSort2" name="filterSort" className="form-check-input" />
              <label htmlFor="filterSort2" className="form-check-label">Price (lowest first)</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="radio" id="filterSort3" name="filterSort" className="form-check-input" />
              <label htmlFor="filterSort3" className="form-check-label">Price (highest first)</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="radio" id="filterSort4" name="filterSort" className="form-check-input" />
              <label htmlFor="filterSort4" className="form-check-label">Rating (highest first)</label>
            </div>
            <div className="search-hotel__sidemenu-filter-item form-check">
              <input type="radio" id="filterSort5" name="filterSort" className="form-check-input" />
              <label htmlFor="filterSort5" className="form-check-label">Hotel star (highest first)</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const HotelList = () => {
  const hotels = [
    { image: Images.Placeholder, name: 'Sheraton Makkah Jabal Al Kaaba Hotel', location: 'Hotel in Ayjad, Makkah', price: { amount: '$ 350.00', description: 'night' }, linkURL: '/hotel-details' },
    { image: Images.Placeholder, name: 'Sheraton Makkah Jabal Al Kaaba Hotel', location: 'Hotel in Ayjad, Makkah', price: { amount: '$ 350.00', description: 'night' }, linkURL: '#' },
    { image: Images.Placeholder, name: 'Sheraton Makkah Jabal Al Kaaba Hotel', location: 'Hotel in Ayjad, Makkah', price: { amount: '$ 350.00', description: 'night' }, linkURL: '#' },
    { image: Images.Placeholder, name: 'Sheraton Makkah Jabal Al Kaaba Hotel', location: 'Hotel in Ayjad, Makkah', price: { amount: '$ 350.00', description: 'night' }, linkURL: '#' },
    { image: Images.Placeholder, name: 'Sheraton Makkah Jabal Al Kaaba Hotel', location: 'Hotel in Ayjad, Makkah', price: { amount: '$ 350.00', description: 'night' }, linkURL: '#' },
  ]

  return (
    <div className="search-hotel__content-list">
      {hotels.map((hotels, index) => (
        <HotelCard {...hotels} key={index} />
      ))}
    </div>
  )
}

export default SearchHotel
import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import { useEffect, useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import useFetch from "@/hooks/useFetch"
import { getSession, useSession } from "next-auth/react"
import { callAPI } from "@/lib/axiosHelper"

export default function GuestReviewBusiness({ propertyHotel }) {

  const [propertyHotelData, setPropertyHotelData] = useState(null);

  useEffect(() => {
    if (propertyHotel) {
      // Assuming propertyHotel is an array
      const lastIndex = propertyHotel.length - 1;
      if (lastIndex >= 0) {
        setPropertyHotelData(propertyHotel[lastIndex]);
        // sethotelBusinessID(propertyHotel[lastIndex]?.id_hotel)
      }
    }
  }, [propertyHotel]);


  const firstData = propertyHotel[0];
  const id_hotel = firstData?.id_hotel;
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  const [showTimeSpanDropdown, setShowTimeSpanDropdown] = useState<boolean>(false)
  const [filter, setFilter] = useState(1)
  const [sort, setSort] = useState('DESC')
  const [star, setStar] = useState([])
  const [isLoadingReview, setIsLoadingReview] = useState(false)
  const [isLoadingOverall, setIsLoadingOverall] = useState(false)


  // Overall Data
  const [overallData, setOverallData] = useState({
    "total_review": 0,
    "average_star": 0,
    "average_staff": 0,
    "average_facilities": 0,
    "average_clean": 0,
    "average_comfortable": 0,
    "average_money": 0,
    "average_location": 0,
    "percentage_5_star": 0,
    "percentage_4_star": 0,
    "percentage_3_star": 0,
    "percentage_2_star": 0,
    "percentage_1_star": 0
  })

  // Review Data
  const [reviewData, setReviewData] = useState([{
    "id_hotel_review": 0,
    "id_hotel_booking": 0,
    "star": 0,
    "staff": 0,
    "facilities": 0,
    "clean": 0,
    "comfortable": 0,
    "money": 0,
    "location": 0,
    "description": '',
    "fullname": "",
    "created_at": ''
  }])

  // Get Overall Data
  useEffect(() => {
    if (id_hotel === null) return
    setIsLoadingOverall(true)

    const fetchOverallData = async () => {
      try {
        const { data, ok, error } = await callAPI(`/hotel-review/overall`, 'POST', { 'id_hotel': id_hotel }, true)
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setOverallData(data)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingOverall(false)
      }
    }


    fetchOverallData()
  }, [id_hotel])

  // Get Review Data
  useEffect(() => {
    if (id_hotel === null) return

    setIsLoadingReview(true)

    const fetchReviewData = async () => {
      try {
        const { data, ok, error } = await callAPI(
          `/hotel-review/show`,
          'POST',
          {
            'id_hotel': id_hotel,
            "filter": filter,
            "sort": sort,
            "star": star
          }, true
        )
        if (error) {
          console.log(error);
        }
        if (ok) {
          setReviewData(data)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoadingReview(false)
      }

    }

    fetchReviewData()
  }, [id_hotel, filter, sort, star])

  const handleStarFilter = (starValue) => {
    const isStarSelected = star.includes(starValue);

    if (isStarSelected) {
      setStar(star.filter(star => star !== starValue));
    } else {
      setStar([...star, starValue]);
    }
  }

  const handleSort = (sortValue) => {
    setSort(sortValue)
    setShowTimeSpanDropdown(false)
  }

  const handleFilter = (filterValue) => {
    setFilter(filterValue)
    setShowReviewDropdown(false)
  }

  return (
    <Layout>
      <InnerLayout propertyHotel={propertyHotelData}>
        <div className="container container-guestreview">

          {/* OVERALL */}
          <div className="admin-guestreview-business__top-header">
            <div className="admin-guestreview-business__top-header-wrapper">
              <h4 className="admin-latest-business__top-header-title">Guest Review</h4>
            </div>
          </div>
          {isLoadingOverall ? (
            <div className="admin-guestreview-business__summary">
              Loading Data Overall...
            </div>
          ) : (
            <div className="admin-guestreview-business__summary">
              <div className="admin-guestreview-business__top-content">
                <div className="admin-guestreview-business__average-rating--wrapper">
                  <div className="admin-guestreview-business__average-rating--header">
                    <p className="admin-guestreview-business__average-rating--header">Average Rating</p>
                    <div className="admin-guestreview-business__average-rating--overall">
                      <div className="admin-guestreview-business__average-rating--review">
                        <h5 className="admin-guestreview-business__average-rating--review">{overallData.average_star}</h5>
                        <div className="admin-guestreview-business__average-rating--star">
                          <SVGIcon src={Icons.Star} width={20} height={20} />
                          <SVGIcon src={Icons.Star} width={20} height={20} />
                          <SVGIcon src={Icons.Star} width={20} height={20} />
                          <SVGIcon src={Icons.Star} width={20} height={20} />
                          <SVGIcon src={Icons.Star} width={20} height={20} />
                        </div>
                      </div>
                      <p className="admin-guestreview-business__average-rating--desc">Based on {overallData.total_review} Reviews</p>
                    </div>
                  </div>
                  <div className="admin-guestreview-business__average-rating-chart">
                    <div className="admin-guestreview-business__average-rating-rate">
                      <div className="admin-guestreview-business__average-rating-rate--number">
                        <p className="admin-guestreview-business__average-rating-rate--rating">5</p>
                        <SVGIcon className="admin-guestreview-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-guestreview-business__average-rating-rate--bar">
                        <div className="admin-guestreview-business__average-rating-rate--level"
                          style={{ width: `${overallData.percentage_5_star}%` }}>
                        </div>

                      </div>
                    </div>
                    <div className="admin-guestreview-business__average-rating-rate">
                      <div className="admin-guestreview-business__average-rating-rate--number">
                        <p className="admin-guestreview-business__average-rating-rate--rating">4</p>
                        <SVGIcon className="admin-guestreview-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-guestreview-business__average-rating-rate--bar">
                        <div className="admin-guestreview-business__average-rating-rate--level" style={{ width: `${overallData.percentage_4_star}%` }}></div>
                      </div>
                    </div>
                    <div className="admin-guestreview-business__average-rating-rate">
                      <div className="admin-guestreview-business__average-rating-rate--number">
                        <p className="admin-guestreview-business__average-rating-rate--rating">3</p>
                        <SVGIcon className="admin-guestreview-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-guestreview-business__average-rating-rate--bar">
                        <div className="admin-guestreview-business__average-rating-rate--level" style={{ width: `${overallData.percentage_3_star}%` }}></div>
                      </div>
                    </div>
                    <div className="admin-guestreview-business__average-rating-rate">
                      <div className="admin-guestreview-business__average-rating-rate--number">
                        <p className="admin-guestreview-business__average-rating-rate--rating">2</p>
                        <SVGIcon className="admin-guestreview-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-guestreview-business__average-rating-rate--bar">
                        <div className="admin-guestreview-business__average-rating-rate--level" style={{ width: `${overallData.percentage_2_star}%` }}></div>
                      </div>
                    </div>
                    <div className="admin-guestreview-business__average-rating-rate">
                      <div className="admin-guestreview-business__average-rating-rate--number">
                        <p className="admin-guestreview-business__average-rating-rate--rating">1</p>
                        <SVGIcon className="admin-guestreview-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-guestreview-business__average-rating-rate--bar">
                        <div className="admin-guestreview-business__average-rating-rate--level" style={{ width: `${overallData.percentage_1_star}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="admin-guestreview-business__top-content-separator"></div>
                <div className="admin-guestreview-business__overall-category">
                  <div className="admin-guestreview-business__overall-category--header">
                    <p className="admin-guestreview-business__overall-category--header">Overall Category :</p>
                    <div className="admin-guestreview-business__overall-category--desc">
                      it is the most common aspect of any guest experience. They are rated by your guests and are independent of your overall review score
                    </div>
                  </div>

                  <div className="admin-guestreview-business__overall-category-split--wrapper">
                    <div className="admin-guestreview-business__overall-category-split">
                      <div className="admin-guestreview-business__overall-category-chart">
                        <div className="admin-guestreview-business__overall-category-chart--wrapper">
                          <p className="admin-guestreview-business__overall-category-chart--desc">Location</p>
                          <div className="admin-guestreview-business__overall-category-bar--wrapper">
                            <div className="admin-guestreview-business__overall-category-rate">
                              <div className="admin-guestreview-business__overall-category-rate-bar">
                                <div className="admin-guestreview-business__overall-category-rate-level admin-guestreview-business__overall-category-rate-level--1" style={{ width: `${overallData.average_location / 5 * 100}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-guestreview-business__overall-category-rate--value">{overallData.average_location}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-guestreview-business__overall-category-chart">
                        <div className="admin-guestreview-business__overall-category-chart--wrapper">
                          <p className="admin-guestreview-business__overall-category-chart--desc">Staff</p>
                          <div className="admin-guestreview-business__overall-category-bar--wrapper">
                            <div className="admin-guestreview-business__overall-category-rate">
                              <div className="admin-guestreview-business__overall-category-rate-bar">
                                <div className="admin-guestreview-business__overall-category-rate-level admin-guestreview-business__overall-category-rate-level--1" style={{ width: `${overallData.average_staff / 5 * 100}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-guestreview-business__overall-category-rate--value">{overallData.average_staff}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-guestreview-business__overall-category-chart">
                        <div className="admin-guestreview-business__overall-category-chart--wrapper">
                          <p className="admin-guestreview-business__overall-category-chart--desc">Cleanliness</p>
                          <div className="admin-guestreview-business__overall-category-bar--wrapper">
                            <div className="admin-guestreview-business__overall-category-rate">
                              <div className="admin-guestreview-business__overall-category-rate-bar">
                                <div className="admin-guestreview-business__overall-category-rate-level admin-guestreview-business__overall-category-rate-level--1" style={{ width: `${overallData.average_clean / 5 * 100}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-guestreview-business__overall-category-rate--value">{overallData.average_clean}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="admin-guestreview-business__overall-category-split">
                      <div className="admin-guestreview-business__overall-category-chart">
                        <div className="admin-guestreview-business__overall-category-chart--wrapper">
                          <p className="admin-guestreview-business__overall-category-chart--desc">Comfort</p>
                          <div className="admin-guestreview-business__overall-category-bar--wrapper">
                            <div className="admin-guestreview-business__overall-category-rate">
                              <div className="admin-guestreview-business__overall-category-rate-bar">
                                <div className="admin-guestreview-business__overall-category-rate-level admin-guestreview-business__overall-category-rate-level--1" style={{ width: `${overallData.average_comfortable / 5 * 100}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-guestreview-business__overall-category-rate--value">{overallData.average_comfortable}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-guestreview-business__overall-category-chart">
                        <div className="admin-guestreview-business__overall-category-chart--wrapper">
                          <p className="admin-guestreview-business__overall-category-chart--desc">Value for money</p>
                          <div className="admin-guestreview-business__overall-category-bar--wrapper">
                            <div className="admin-guestreview-business__overall-category-rate">
                              <div className="admin-guestreview-business__overall-category-rate-bar">
                                <div className="admin-guestreview-business__overall-category-rate-level admin-guestreview-business__overall-category-rate-level--1" style={{ width: `${overallData.average_money / 5 * 100}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-guestreview-business__overall-category-rate--value">{overallData.average_money}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-guestreview-business__overall-category-chart">
                        <div className="admin-guestreview-business__overall-category-chart--wrapper">
                          <p className="admin-guestreview-business__overall-category-chart--desc">Facilities</p>
                          <div className="admin-guestreview-business__overall-category-bar--wrapper">
                            <div className="admin-guestreview-business__overall-category-rate">
                              <div className="admin-guestreview-business__overall-category-rate-bar">
                                <div className="admin-guestreview-business__overall-category-rate-level admin-guestreview-business__overall-category-rate-level--1" style={{ width: `${overallData.average_facilities / 5 * 100}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-guestreview-business__overall-category-rate--value">{overallData.average_facilities}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-guestreview-business__banner-wrapper">
                <div className="homepage__banner" >
                  <div className="col-auto">
                    <div className="icon">
                      <SVGIcon src={Icons.Lamp} width={24} height={24} />
                    </div>
                  </div>
                  <div className="col">
                    <div className="details">
                      <div className="fs-lg">Get deeper insights on the guest experience page to learn how to improve your review score</div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <Link href="#" className="link-green-01 fs-lg">See Tips</Link>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* REVIEW */}

          <div className="admin-guestreview-business__guest-rating">
            <div className="admin-guestreview-business__sidemenu-filter">
              <div className="admin-guestreview-business__sidemenu-filter-block">
                <a className="admin-guestreview-business__sidemenu-filter-head" data-bs-toggle="collapse" href="#popularFilterCollapse" role="button" aria-expanded="true" aria-controls="popularFilterCollapse">
                  <div className="admin-guestreview-business__sidemenu-filter-head--title">Stars</div>
                  <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                </a>
                <div id="popularFilterCollapse" className="collapse show admin-guestreview-business__sidemenu-filter-block">
                  <div className="admin-guestreview-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput5Star"
                      className="form-check-input"
                      checked={star.includes(5)}
                      onChange={() => handleStarFilter(5)}
                    />
                    <label htmlFor="filterInput5Star" className="form-check-label">
                      <div className="admin-guestreview-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-guestreview-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput4Star"
                      className="form-check-input"
                      checked={star.includes(4)}
                      onChange={() => handleStarFilter(4)}
                    />
                    <label htmlFor="filterInput4Star" className="form-check-label">
                      <div className="admin-guestreview-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-guestreview-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput3Star"
                      className="form-check-input"
                      checked={star.includes(3)}
                      onChange={() => handleStarFilter(3)}
                    />
                    <label htmlFor="filterInput3Star" className="form-check-label">
                      <div className="admin-guestreview-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-guestreview-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput2Star"
                      className="form-check-input"
                      checked={star.includes(2)}
                      onChange={() => handleStarFilter(2)}
                    />
                    <label htmlFor="filterInput2Star" className="form-check-label">
                      <div className="admin-guestreview-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-guestreview-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput1Star"
                      className="form-check-input"
                      checked={star.includes(1)}
                      onChange={() => handleStarFilter(1)}
                    />
                    <label htmlFor="filterInput1Star" className="form-check-label">
                      <div className="admin-guestreview-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="admin-guestreview-business__sidemenu-separator"></div>

            </div>
            <div className="admin-guestreview-business__guest-rating-inner">
              <div className="admin-guestreview-business__guest-rating-inner-info">
                <div className="custom-dropdown">
                  <div onClick={() => setShowReviewDropdown(true)} className="custom-dropdown-toggle">
                    {filter === 1 &&
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>All Review</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    }
                    {filter === 2 &&
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>With Comment</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    }
                    {filter === 3 &&
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>No Reply</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    }


                  </div>
                  <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-guestreview-business__dropdown-menu-option" style={{ marginTop: 8, width: 194 }}>
                    <div className="admin-guestreview-business__guest-rating-dropdown custom-dropdown-menu__options">
                      <Link href="#" onClick={() => handleFilter(1)} className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        All Review
                        {filter === 1 && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-guestreview-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                      <Link href="#" onClick={() => handleFilter(2)} className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        With Comment
                        {filter === 2 && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-guestreview-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                      <Link href="#" onClick={() => handleFilter(3)} className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        No Reply
                        {filter === 3 && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-guestreview-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
                <div className="custom-dropdown">
                  <div onClick={() => setShowTimeSpanDropdown(true)} className="custom-dropdown-toggle">

                    {(sort === 'DESC') ? (
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>Newest To Oldest</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    ) : (
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>Oldest To Newest</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    )}


                  </div>
                  <DropdownMenu show={showTimeSpanDropdown} setShow={setShowTimeSpanDropdown} className="guest-rating-inner__header-dropdown-menu" style={{ marginTop: 8, width: 194 }}>
                    <div className="custom-dropdown-menu__options">
                      <Link href="#" onClick={() => handleSort('DESC')} className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Newest To Oldest
                        {sort === 'DESC' && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-guestreview-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                      <Link href="#" onClick={() => handleSort('ASC')} className="admin-guestreview-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Oldest To Newest
                        {sort === 'ASC' && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-guestreview-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
              </div>

              {
                isLoadingReview ? (
                  <div className="admin-guestreview-business__guest-summary">
                    Loading Data Review...
                  </div>
                ) : (
                  !reviewData.length ? (
                    <div className="admin-guestreview-business__guest-summary">
                      Data not found
                    </div>
                  ) : (
                    reviewData.map((review, index) => (
                      <div className="admin-guestreview-business__guest-summary" key={index}>
                        <div className="admin-guestreview-business__guest-summary-header">
                          <div className="admin-guestreview-business__guest-summary-rating">
                            <h5 className="admin-guestreview-business__guest-summary-rating--value">{review.star}</h5>
                            <SVGIcon src={Icons.Star} width={20} height={20} />
                          </div>
                          <div className="admin-guestreview-business__guest-summary-header-separator"></div>
                          <div className="admin-guestreview-business__guest-summary-desc--wrapper">
                            <div className="admin-guestreview-business__guest-summary-desc">
                              <p className="admin-guestreview-business__guest-summary-desc--customer">{review.fullname}</p>
                              <p className="admin-guestreview-business__guest-summary-desc--id">Reservation ID : {review.id_hotel_booking}</p>
                            </div>
                            <div className="admin-guestreview-business__guest-summary-desc--date">
                              {review.created_at && (
                                new Date(review.created_at).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="admin-guestreview-business__sidemenu-separator"></div>
                        <div className="admin-guestreview-business__guest-summary-split--wrapper">
                          <div className="admin-guestreview-business__guest-summary-split">
                            <div className="admin-guestreview-business__guest-summary-chart">
                              <div className="admin-guestreview-business__guest-summary-chart--wrapper">
                                <p className="admin-guestreview-business__guest-summary-chart--desc">Location</p>
                                <div className="admin-guestreview-business__guest-summary-bar--wrapper">
                                  <div className="admin-guestreview-business__guest-summary-rate">
                                    <div className="admin-guestreview-business__guest-summary-rate-bar">
                                      <div
                                        className="admin-guestreview-business__guest-summary-rate-level admin-guestreview-business__guest-summary-rate-level--1"
                                        style={{ width: `${review.location / 5 * 100}%` }}
                                      >
                                      </div>
                                    </div>
                                  </div>
                                  <p className="admin-guestreview-business__guest-summary-rate--value">{review.location}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-guestreview-business__guest-summary-chart">
                              <div className="admin-guestreview-business__guest-summary-chart--wrapper">
                                <p className="admin-guestreview-business__guest-summary-chart--desc">Staff</p>
                                <div className="admin-guestreview-business__guest-summary-bar--wrapper">
                                  <div className="admin-guestreview-business__guest-summary-rate">
                                    <div className="admin-guestreview-business__guest-summary-rate-bar">
                                      <div
                                        className="admin-guestreview-business__guest-summary-rate-level admin-guestreview-business__guest-summary-rate-level--1"
                                        style={{ width: `${review.staff / 5 * 100}%` }}
                                      >
                                      </div>
                                    </div>
                                  </div>
                                  <p className="admin-guestreview-business__guest-summary-rate--value">{review.staff}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-guestreview-business__guest-summary-chart">
                              <div className="admin-guestreview-business__guest-summary-chart--wrapper">
                                <p className="admin-guestreview-business__guest-summary-chart--desc">Cleanliness</p>
                                <div className="admin-guestreview-business__guest-summary-bar--wrapper">
                                  <div className="admin-guestreview-business__guest-summary-rate">
                                    <div className="admin-guestreview-business__guest-summary-rate-bar">
                                      <div className="admin-guestreview-business__guest-summary-rate-level admin-guestreview-business__guest-summary-rate-level--1" style={{ width: `${review.clean / 5 * 100}%` }}></div>
                                    </div>
                                  </div>
                                  <p className="admin-guestreview-business__guest-summary-rate--value">{review.clean}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="admin-guestreview-business__guest-summary-split">
                            <div className="admin-guestreview-business__guest-summary-chart">
                              <div className="admin-guestreview-business__guest-summary-chart--wrapper">
                                <p className="admin-guestreview-business__guest-summary-chart--desc">Comfort</p>
                                <div className="admin-guestreview-business__guest-summary-bar--wrapper">
                                  <div className="admin-guestreview-business__guest-summary-rate">
                                    <div className="admin-guestreview-business__guest-summary-rate-bar">
                                      <div className="admin-guestreview-business__guest-summary-rate-level admin-guestreview-business__guest-summary-rate-level--1" style={{ width: `${review.comfortable / 5 * 100}%` }}></div>
                                    </div>
                                  </div>
                                  <p className="admin-guestreview-business__guest-summary-rate--value">{review.comfortable}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-guestreview-business__guest-summary-chart">
                              <div className="admin-guestreview-business__guest-summary-chart--wrapper">
                                <p className="admin-guestreview-business__guest-summary-chart--desc">Value for money</p>
                                <div className="admin-guestreview-business__guest-summary-bar--wrapper">
                                  <div className="admin-guestreview-business__guest-summary-rate">
                                    <div className="admin-guestreview-business__guest-summary-rate-bar">
                                      <div className="admin-guestreview-business__guest-summary-rate-level admin-guestreview-business__guest-summary-rate-level--1" style={{ width: `${review.money / 5 * 100}%` }}></div>
                                    </div>
                                  </div>
                                  <p className="admin-guestreview-business__guest-summary-rate--value">{review.money}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-guestreview-business__guest-summary-chart">
                              <div className="admin-guestreview-business__guest-summary-chart--wrapper">
                                <p className="admin-guestreview-business__guest-summary-chart--desc">Facilities</p>
                                <div className="admin-guestreview-business__guest-summary-bar--wrapper">
                                  <div className="admin-guestreview-business__guest-summary-rate">
                                    <div className="admin-guestreview-business__guest-summary-rate-bar">
                                      <div className="admin-guestreview-business__guest-summary-rate-level admin-guestreview-business__guest-summary-rate-level--1" style={{ width: `${review.facilities / 5 * 100}%` }}></div>
                                    </div>
                                  </div>
                                  <p className="admin-guestreview-business__guest-summary-rate--value">{review.facilities}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="admin-guestreview-business__guest-summary-comment">
                          <p className="admin-guestreview-business__guest-summary-comment--value">{review.description}</p>
                        </div>
                      </div>
                    ))
                  )
                )
              }

            </div>
          </div>
        </div>
      </InnerLayout>
    </Layout>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  const { ok, data } = await callAPI('/hotel/list-property', 'POST', { id_hotel_business: session?.user?.id }, true)

  if (ok && data?.length) {
    return {
      props: {
        propertyHotel: data
      }
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: '/business/hotel/empty',
      },
    }
  }
}
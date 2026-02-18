import Layout from "@/components/layout"
import InnerLayout from "@/components/business/car/layout"
import Navbar from '@/components/business/car/navbar'
import { useEffect, useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import arrowLeft from 'assets/images/arrow_left_green.svg'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import useFetch from "@/hooks/useFetch"
import { getSession, useSession } from "next-auth/react"
import { callAPI } from "@/lib/axiosHelper"
import moment from "moment"

export default function CustomerFeedbackBusiness({ propertyCar }) {
  const [showFilterDropdown, setFilterDropdown] = useState<boolean>(false)
  const [showTimeSpanDropdown, setShowTimeSpanDropdown] = useState<boolean>(false)
  const [filter, setFilter] = useState(null)
  const [sort, setSort] = useState('DESC')
  const [star, setStar] = useState([])
  const [isLoadingReview, setIsLoadingReview] = useState(false)
  const [isLoadingOverall, setIsLoadingOverall] = useState(false)

  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)
  const [overallData, setOverallData] = useState<any>(null)
  const [reviewData, setReviewData] = useState<any>(null)


  // Get overall data
  const getOverallData = async () => {
    setIsLoadingOverall(true)
    try {
      const { ok, error, data } = await callAPI('/car-business-dashboard/customer-feedback', 'POST', { id_car_business: id_car_business }, true)
      if (error) {
        console.log(error);
      }
      if (ok) {
        setOverallData(data)
      }
    } catch (error) {
      console.log('Error Fetch Overall Data');
    } finally {
      setIsLoadingOverall(false)
    }
  }

  useEffect(() => {
    if (!id_car_business) return
    if (overallData) return

    getOverallData()
  }, [id_car_business, overallData])



  // Get Review data
  const getReviewData = async () => {
    setIsLoadingReview(true)
    const payload = {
      id_car_business: id_car_business,
      star: star,
      sort: sort,
      filter: filter
    }
    try {
      const { ok, error, data } = await callAPI('/car-business-dashboard/customer-feedback-data', 'POST', payload, true)
      if (error) {
        console.log(error);
      }
      if (ok) {
        setReviewData(data)
      }
    } catch (error) {
      console.log('Error Fetch Review Data');
    } finally {
      setIsLoadingReview(false)
    }
  }

  useEffect(() => {
    if (!id_car_business) return

    getReviewData()
  }, [id_car_business, filter, sort, star])

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
    setFilterDropdown(false)
  }

  const callPercentageStar = (value) => {
    const totalStarReview =
      overallData?.car_review_rating?.one_star +
      overallData?.car_review_rating?.two_star +
      overallData?.car_review_rating?.three_star +
      overallData?.car_review_rating?.four_star +
      overallData?.car_review_rating?.five_star

    const percentage = (value / totalStarReview) * 100
    return percentage
  }

  const callPercentageOverallCategoryBar = (value) => {
    const maxValue = 5
    const percentage = (value / maxValue) * 100

    return percentage
  }

  const totalStarReview =
    overallData?.car_review_rating?.one_star +
    overallData?.car_review_rating?.two_star +
    overallData?.car_review_rating?.three_star +
    overallData?.car_review_rating?.four_star +
    overallData?.car_review_rating?.five_star


  return (
    <Layout>
      <InnerLayout >
        <div className="sticky-top">
          <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
          <HeaderCustomer />
        </div>
        <div className="container container-customerfeedback">

          {isLoadingOverall ? (
            <div className="admin-customerfeedback-business__summary">
              Loading Data Overall...
            </div>
          ) : (
            <div className="admin-customerfeedback-business__summary">
              <div className="admin-customerfeedback-business__top-content">
                <div className="admin-customerfeedback-business__average-rating--wrapper">
                  <div className="admin-customerfeedback-business__average-rating--header">
                    <p className="admin-customerfeedback-business__average-rating--header">Average Rating</p>
                    <div className="admin-customerfeedback-business__average-rating--overall">
                      <div className="admin-customerfeedback-business__average-rating--review">
                        <h5 className="admin-customerfeedback-business__average-rating--review">{overallData?.car_review_rating?.star_average}</h5>
                        <div className="admin-customerfeedback-business__average-rating--star">
                          {Array.from({ length: Math.floor(overallData?.car_review_rating?.star_average) }, (_, index) => (
                            <SVGIcon key={index} src={Icons.Star} width={20} height={20} />
                          ))}
                        </div>
                      </div>
                      <p className="admin-customerfeedback-business__average-rating--desc">Based on {totalStarReview || 0} Reviews</p>
                    </div>
                  </div>
                  <div className="admin-customerfeedback-business__average-rating-chart">
                    <div className="admin-customerfeedback-business__average-rating-rate">
                      <div className="admin-customerfeedback-business__average-rating-rate--number">
                        <p className="admin-customerfeedback-business__average-rating-rate--rating">5</p>
                        <SVGIcon className="admin-customerfeedback-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-customerfeedback-business__average-rating-rate--bar">
                        <div className="admin-customerfeedback-business__average-rating-rate--level"
                          style={{ width: `${callPercentageStar(overallData?.car_review_rating?.five_star)}%` }}>
                        </div>

                      </div>
                    </div>
                    <div className="admin-customerfeedback-business__average-rating-rate">
                      <div className="admin-customerfeedback-business__average-rating-rate--number">
                        <p className="admin-customerfeedback-business__average-rating-rate--rating">4</p>
                        <SVGIcon className="admin-customerfeedback-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-customerfeedback-business__average-rating-rate--bar">
                        <div className="admin-customerfeedback-business__average-rating-rate--level" style={{ width: `${callPercentageStar(overallData?.car_review_rating?.four_star)}%` }}></div>
                      </div>
                    </div>
                    <div className="admin-customerfeedback-business__average-rating-rate">
                      <div className="admin-customerfeedback-business__average-rating-rate--number">
                        <p className="admin-customerfeedback-business__average-rating-rate--rating">3</p>
                        <SVGIcon className="admin-customerfeedback-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-customerfeedback-business__average-rating-rate--bar">
                        <div className="admin-customerfeedback-business__average-rating-rate--level" style={{ width: `${callPercentageStar(overallData?.car_review_rating?.three_star)}%` }}></div>
                      </div>
                    </div>
                    <div className="admin-customerfeedback-business__average-rating-rate">
                      <div className="admin-customerfeedback-business__average-rating-rate--number">
                        <p className="admin-customerfeedback-business__average-rating-rate--rating">2</p>
                        <SVGIcon className="admin-customerfeedback-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-customerfeedback-business__average-rating-rate--bar">
                        <div className="admin-customerfeedback-business__average-rating-rate--level" style={{ width: `${callPercentageStar(overallData?.car_review_rating?.two_star)}%` }}></div>
                      </div>
                    </div>
                    <div className="admin-customerfeedback-business__average-rating-rate">
                      <div className="admin-customerfeedback-business__average-rating-rate--number">
                        <p className="admin-customerfeedback-business__average-rating-rate--rating">1</p>
                        <SVGIcon className="admin-customerfeedback-business__average-rating-rate--number" src={Icons.Star} width={12} height={12} />
                      </div>
                      <div className="admin-customerfeedback-business__average-rating-rate--bar">
                        <div className="admin-customerfeedback-business__average-rating-rate--level" style={{ width: `${callPercentageStar(overallData?.car_review_rating?.one_star)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="admin-customerfeedback-business__top-content-separator"></div>
                <div className="admin-customerfeedback-business__overall-category">
                  <div className="admin-customerfeedback-business__overall-category--header">
                    <p className="admin-customerfeedback-business__overall-category--header">Overall Category :</p>
                    <div className="admin-customerfeedback-business__overall-category--desc">
                      it is the most common aspect of any guest experience. They are rated by your guests and are independent of your overall review score
                    </div>
                  </div>

                  <div className="admin-customerfeedback-business__overall-category-split--wrapper">
                    <div className="admin-customerfeedback-business__overall-category-split">
                      <div className="admin-customerfeedback-business__overall-category-chart">
                        <div className="admin-customerfeedback-business__overall-category-chart--wrapper">
                          <p className="admin-customerfeedback-business__overall-category-chart--desc">Value for money</p>
                          <div className="admin-customerfeedback-business__overall-category-bar--wrapper">
                            <div className="admin-customerfeedback-business__overall-category-rate">
                              <div className="admin-customerfeedback-business__overall-category-rate-bar">
                                <div className="admin-customerfeedback-business__overall-category-rate-level admin-customerfeedback-business__overall-category-rate-level--1"
                                  style={{ width: `${callPercentageOverallCategoryBar(overallData?.car_review_money)}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-customerfeedback-business__overall-category-rate--value">{overallData?.car_review_money}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-customerfeedback-business__overall-category-chart">
                        <div className="admin-customerfeedback-business__overall-category-chart--wrapper">
                          <p className="admin-customerfeedback-business__overall-category-chart--desc">Condition</p>
                          <div className="admin-customerfeedback-business__overall-category-bar--wrapper">
                            <div className="admin-customerfeedback-business__overall-category-rate">
                              <div className="admin-customerfeedback-business__overall-category-rate-bar">
                                <div className="admin-customerfeedback-business__overall-category-rate-level admin-customerfeedback-business__overall-category-rate-level--1"
                                  style={{ width: `${callPercentageOverallCategoryBar(overallData?.car_review_condition)}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-customerfeedback-business__overall-category-rate--value">{overallData?.car_review_condition}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-customerfeedback-business__overall-category-chart">
                        <div className="admin-customerfeedback-business__overall-category-chart--wrapper">
                          <p className="admin-customerfeedback-business__overall-category-chart--desc">Cleanliness</p>
                          <div className="admin-customerfeedback-business__overall-category-bar--wrapper">
                            <div className="admin-customerfeedback-business__overall-category-rate">
                              <div className="admin-customerfeedback-business__overall-category-rate-bar">
                                <div className="admin-customerfeedback-business__overall-category-rate-level admin-customerfeedback-business__overall-category-rate-level--1"
                                  style={{ width: `${callPercentageOverallCategoryBar(overallData?.car_review_clean)}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-customerfeedback-business__overall-category-rate--value">{overallData?.car_review_clean}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="admin-customerfeedback-business__overall-category-split">
                      <div className="admin-customerfeedback-business__overall-category-chart">
                        <div className="admin-customerfeedback-business__overall-category-chart--wrapper">
                          <p className="admin-customerfeedback-business__overall-category-chart--desc">Facilities</p>
                          <div className="admin-customerfeedback-business__overall-category-bar--wrapper">
                            <div className="admin-customerfeedback-business__overall-category-rate">
                              <div className="admin-customerfeedback-business__overall-category-rate-bar">
                                <div className="admin-customerfeedback-business__overall-category-rate-level admin-customerfeedback-business__overall-category-rate-level--1"
                                  style={{ width: `${callPercentageOverallCategoryBar(overallData?.car_review_facilities)}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-customerfeedback-business__overall-category-rate--value">{overallData?.car_review_facilities}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-customerfeedback-business__overall-category-chart">
                        <div className="admin-customerfeedback-business__overall-category-chart--wrapper">
                          <p className="admin-customerfeedback-business__overall-category-chart--desc">Comfort</p>
                          <div className="admin-customerfeedback-business__overall-category-bar--wrapper">
                            <div className="admin-customerfeedback-business__overall-category-rate">
                              <div className="admin-customerfeedback-business__overall-category-rate-bar">
                                <div className="admin-customerfeedback-business__overall-category-rate-level admin-customerfeedback-business__overall-category-rate-level--1"
                                  style={{ width: `${callPercentageOverallCategoryBar(overallData?.car_review_comfortable)}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-customerfeedback-business__overall-category-rate--value">{overallData?.car_review_comfortable}</p>
                          </div>
                        </div>
                      </div>
                      <div className="admin-customerfeedback-business__overall-category-chart">
                        <div className="admin-customerfeedback-business__overall-category-chart--wrapper">
                          <p className="admin-customerfeedback-business__overall-category-chart--desc">Staff</p>
                          <div className="admin-customerfeedback-business__overall-category-bar--wrapper">
                            <div className="admin-customerfeedback-business__overall-category-rate">
                              <div className="admin-customerfeedback-business__overall-category-rate-bar">
                                <div className="admin-customerfeedback-business__overall-category-rate-level admin-customerfeedback-business__overall-category-rate-level--1"
                                  style={{ width: `${callPercentageOverallCategoryBar(overallData?.car_review_staff)}%` }}></div>
                              </div>
                            </div>
                            <p className="admin-customerfeedback-business__overall-category-rate--value">{overallData?.car_review_staff}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-customerfeedback-business__banner-wrapper">
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

          <div className="admin-customerfeedback-business__guest-rating">
            <div className="admin-customerfeedback-business__sidemenu-filter">
              <div className="admin-customerfeedback-business__sidemenu-filter-block">
                <a className="admin-customerfeedback-business__sidemenu-filter-head" data-bs-toggle="collapse" href="#popularFilterCollapse" role="button" aria-expanded="true" aria-controls="popularFilterCollapse">
                  <div className="admin-customerfeedback-business__sidemenu-filter-head--title">Stars</div>
                  <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                </a>
                <div id="popularFilterCollapse" className="collapse show admin-customerfeedback-business__sidemenu-filter-block">
                  <div className="admin-customerfeedback-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput5Star"
                      className="form-check-input"
                      checked={star.includes(5)}
                      onChange={() => handleStarFilter(5)}
                    />
                    <label htmlFor="filterInput5Star" className="form-check-label">
                      <div className="admin-customerfeedback-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-customerfeedback-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput4Star"
                      className="form-check-input"
                      checked={star.includes(4)}
                      onChange={() => handleStarFilter(4)}
                    />
                    <label htmlFor="filterInput4Star" className="form-check-label">
                      <div className="admin-customerfeedback-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-customerfeedback-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput3Star"
                      className="form-check-input"
                      checked={star.includes(3)}
                      onChange={() => handleStarFilter(3)}
                    />
                    <label htmlFor="filterInput3Star" className="form-check-label">
                      <div className="admin-customerfeedback-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-customerfeedback-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput2Star"
                      className="form-check-input"
                      checked={star.includes(2)}
                      onChange={() => handleStarFilter(2)}
                    />
                    <label htmlFor="filterInput2Star" className="form-check-label">
                      <div className="admin-customerfeedback-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                  <div className="admin-customerfeedback-business__sidemenu-filter-item form-check">
                    <input
                      type="checkbox"
                      id="filterInput1Star"
                      className="form-check-input"
                      checked={star.includes(1)}
                      onChange={() => handleStarFilter(1)}
                    />
                    <label htmlFor="filterInput1Star" className="form-check-label">
                      <div className="admin-customerfeedback-business__sidemenu-rating-star">
                        <SVGIcon src={Icons.Star} width={20} height={20} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              <div className="admin-customerfeedback-business__sidemenu-separator"></div>

            </div>
            <div className="admin-customerfeedback-business__guest-rating-inner">
              <div className="admin-customerfeedback-business__guest-rating-inner-info">
                <div className="custom-dropdown">
                  <div onClick={() => setFilterDropdown(true)} className="custom-dropdown-toggle">
                    {filter === null &&
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>All Review</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    }
                    {filter === 1 &&
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>With Comment</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    }
                    {filter === 2 &&
                      <>
                        <div style={{ whiteSpace: "nowrap" }}>No Reply</div>
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                      </>
                    }


                  </div>
                  <DropdownMenu show={showFilterDropdown} setShow={setFilterDropdown} className="admin-customerfeedback-business__dropdown-menu-option" style={{ marginTop: 8, width: 194 }}>
                    <div className="admin-customerfeedback-business__guest-rating-dropdown custom-dropdown-menu__options">
                      <Link href="#" onClick={() => handleFilter(null)} className="admin-customerfeedback-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        All Review
                        {filter === null && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-customerfeedback-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                      <Link href="#" onClick={() => handleFilter(1)} className="admin-customerfeedback-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        With Comment
                        {filter === 1 && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-customerfeedback-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                      <Link href="#" onClick={() => handleFilter(2)} className="admin-customerfeedback-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        No Reply
                        {filter === 2 && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-customerfeedback-business__dropdown dropdown-toggle-arrow" />}
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
                      <Link href="#" onClick={() => handleSort('DESC')} className="admin-customerfeedback-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Newest To Oldest
                        {sort === 'DESC' && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-customerfeedback-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                      <Link href="#" onClick={() => handleSort('ASC')} className="admin-customerfeedback-business__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                        Oldest To Newest
                        {sort === 'ASC' && <SVGIcon src={Icons.Check} width={16} height={16} className="admin-customerfeedback-business__dropdown dropdown-toggle-arrow" />}
                      </Link>
                    </div>
                  </DropdownMenu>
                </div>
              </div>

              {
                isLoadingReview ? (
                  <div className="admin-customerfeedback-business__guest-summary">
                    Loading Data Review...
                  </div>
                ) : (
                  isLoadingReview ? (
                    <div className="admin-customerfeedback-business__guest-summary">
                      Data not found
                    </div>
                  ) : (
                    reviewData?.map((review, index) => (
                      <div key={index} className="admin-customerfeedback-business__guest-summary" >
                        <div className="admin-customerfeedback-business__guest-summary-header">
                          <div className="admin-customerfeedback-business__guest-summary-rating">
                            <h5 className="admin-customerfeedback-business__guest-summary-rating--value">{review?.star}</h5>
                            <SVGIcon src={Icons.Star} width={20} height={20} />
                          </div>
                          <div className="admin-customerfeedback-business__guest-summary-header-separator"></div>
                          <div className="admin-customerfeedback-business__guest-summary-desc--wrapper">
                            <div className="admin-customerfeedback-business__guest-summary-desc">
                              <p className="admin-customerfeedback-business__guest-summary-desc--customer">{review?.agency_name}</p>
                              <p className="admin-customerfeedback-business__guest-summary-desc--id">Reservation ID : {review?.id_car_booking}</p>
                            </div>
                            <div className="admin-customerfeedback-business__guest-summary-desc--date">
                              {moment(review?.created_at).format('DD MMM YYYY')}
                            </div>
                          </div>
                        </div>
                        <div className="admin-customerfeedback-business__sidemenu-separator"></div>
                        <div className="admin-customerfeedback-business__guest-summary-split--wrapper">
                          <div className="admin-customerfeedback-business__guest-summary-split">
                            <div className="admin-customerfeedback-business__guest-summary-chart">
                              <div className="admin-customerfeedback-business__guest-summary-chart--wrapper">
                                <p className="admin-customerfeedback-business__guest-summary-chart--desc">Value for money</p>
                                <div className="admin-customerfeedback-business__guest-summary-bar--wrapper">
                                  <div className="admin-customerfeedback-business__guest-summary-rate">
                                    <div className="admin-customerfeedback-business__guest-summary-rate-bar">
                                      <div
                                        className="admin-customerfeedback-business__guest-summary-rate-level admin-customerfeedback-business__guest-summary-rate-level--1"
                                        style={{ width: `${callPercentageOverallCategoryBar(review?.money)}%` }}
                                      >
                                      </div>
                                    </div>
                                  </div>
                                  <p className="admin-customerfeedback-business__guest-summary-rate--value">{review?.money}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-customerfeedback-business__guest-summary-chart">
                              <div className="admin-customerfeedback-business__guest-summary-chart--wrapper">
                                <p className="admin-customerfeedback-business__guest-summary-chart--desc">Condition</p>
                                <div className="admin-customerfeedback-business__guest-summary-bar--wrapper">
                                  <div className="admin-customerfeedback-business__guest-summary-rate">
                                    <div className="admin-customerfeedback-business__guest-summary-rate-bar">
                                      <div
                                        className="admin-customerfeedback-business__guest-summary-rate-level admin-customerfeedback-business__guest-summary-rate-level--1"
                                        style={{ width: `${callPercentageOverallCategoryBar(review?.condition)}%` }}
                                      >
                                      </div>
                                    </div>
                                  </div>
                                  <p className="admin-customerfeedback-business__guest-summary-rate--value">{review?.condition}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-customerfeedback-business__guest-summary-chart">
                              <div className="admin-customerfeedback-business__guest-summary-chart--wrapper">
                                <p className="admin-customerfeedback-business__guest-summary-chart--desc">Cleanliness</p>
                                <div className="admin-customerfeedback-business__guest-summary-bar--wrapper">
                                  <div className="admin-customerfeedback-business__guest-summary-rate">
                                    <div className="admin-customerfeedback-business__guest-summary-rate-bar">
                                      <div className="admin-customerfeedback-business__guest-summary-rate-level admin-customerfeedback-business__guest-summary-rate-level--1"
                                        style={{ width: `${callPercentageOverallCategoryBar(review?.clean)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <p className="admin-customerfeedback-business__guest-summary-rate--value">{review?.clean}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="admin-customerfeedback-business__guest-summary-split">
                            <div className="admin-customerfeedback-business__guest-summary-chart">
                              <div className="admin-customerfeedback-business__guest-summary-chart--wrapper">
                                <p className="admin-customerfeedback-business__guest-summary-chart--desc">Facilities</p>
                                <div className="admin-customerfeedback-business__guest-summary-bar--wrapper">
                                  <div className="admin-customerfeedback-business__guest-summary-rate">
                                    <div className="admin-customerfeedback-business__guest-summary-rate-bar">
                                      <div className="admin-customerfeedback-business__guest-summary-rate-level admin-customerfeedback-business__guest-summary-rate-level--1"
                                        style={{ width: `${callPercentageOverallCategoryBar(review?.facilities)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <p className="admin-customerfeedback-business__guest-summary-rate--value">{review?.facilities}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-customerfeedback-business__guest-summary-chart">
                              <div className="admin-customerfeedback-business__guest-summary-chart--wrapper">
                                <p className="admin-customerfeedback-business__guest-summary-chart--desc">Comfort</p>
                                <div className="admin-customerfeedback-business__guest-summary-bar--wrapper">
                                  <div className="admin-customerfeedback-business__guest-summary-rate">
                                    <div className="admin-customerfeedback-business__guest-summary-rate-bar">
                                      <div className="admin-customerfeedback-business__guest-summary-rate-level admin-customerfeedback-business__guest-summary-rate-level--1"
                                        style={{ width: `${callPercentageOverallCategoryBar(review?.comfort)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                  <p className="admin-customerfeedback-business__guest-summary-rate--value">{review?.comfort}</p>
                                </div>
                              </div>
                            </div>
                            <div className="admin-customerfeedback-business__guest-summary-chart">
                              <div className="admin-customerfeedback-business__guest-summary-chart--wrapper">
                                <p className="admin-customerfeedback-business__guest-summary-chart--desc">Staff</p>
                                <div className="admin-customerfeedback-business__guest-summary-bar--wrapper">
                                  <div className="admin-customerfeedback-business__guest-summary-rate">
                                    <div className="admin-customerfeedback-business__guest-summary-rate-bar">
                                      <div className="admin-customerfeedback-business__guest-summary-rate-level admin-customerfeedback-business__guest-summary-rate-level--1"
                                        style={{ width: `${callPercentageOverallCategoryBar(review?.staff)}%` }}></div>
                                    </div>
                                  </div>
                                  <p className="admin-customerfeedback-business__guest-summary-rate--value">{review?.staff}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="admin-customerfeedback-business__guest-summary-comment">
                          <p className="admin-customerfeedback-business__guest-summary-comment--value">{review?.description}</p>
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
const HeaderCustomer = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link href={"/business/car"} className='car-dashboard__content-header car-dashboard__content-header--link'>
            <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
            <h4 className='car-dashboard__content-title-heading'>Customer Feedback</h4>
          </Link>
        </div>
      </div>
    </header>
  )
}
// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx)

//   const { ok, data } = await callAPI('/hotel/list-property', 'POST', { id_hotel_business: session?.user?.id }, true)

//   if (ok && data?.length) {
//     return {
//       props: {
//         propertyHotel: data
//       }
//     }
//   } else {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/business/hotel/empty',
//       },
//     }
//   }
// }
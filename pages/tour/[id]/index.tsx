import React, { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import BannerInfo from '@/components/pages/home/bannerInfo'
import { HotelSearchBar } from '@/components/pages/home/searchBar'
import hotelImagery1 from '@/assets/images/hotel_details_imagery_1.png'
import hotelImagery2 from '@/assets/images/hotel_details_imagery_2.png'
import hotelImagery3 from '@/assets/images/hotel_details_imagery_3.png'
import hotelImagery4 from '@/assets/images/hotel_details_imagery_4.png'
import hotelImagery5 from '@/assets/images/hotel_details_imagery_5.png'
import reviewerProfile1 from '@/assets/images/reviewer_profile_1.png'
import reviewerProfile2 from '@/assets/images/reviewer_profile_2.png'
import reviewerProfile3 from '@/assets/images/reviewer_profile_3.png'
import TourBookingSummary from '@/components/pages/booking/tour/summary'
import HotelBookingSummary from '@/components/pages/booking/book-transfer/summary'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { callAPI } from '@/lib/axiosHelper'
import { useRouter } from 'next/router'
import moment from 'moment'

import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"


interface TourData {
  id_tour_package: number
  package_name: string
  address: string
  description: string
  rating: number
  rating_status: string
  tour_photos: {
    id_tour_photo: number
    photo: string
  }[]
  tour_plans: {
    id_tour_plan: number
    id_tour_package: number
    type_plan: string
    plan_name: string
    price: string
    total_day: string
    plan_location: {
      id_tour_plan_location: number
      id_tour_plan: number
      city: string
      location: string
      location_activity: string
      order_day: number
    }[]
  }[]
  tour_facilities: {
    id_tour_facility: number
    id_tour_package: number
    facility_name: string
    include_status: number
  }[]
  tour_review: [
    {
      fullname: string
      email: string
      address: string
      profile_photo: string
      star: number
      description: string
    }
  ]
}

export const getServerSideProps: GetServerSideProps<{
  id: number
  data: TourData
}> = async (context) => {
  const id = parseInt(context.params?.id as string)

  // const session = await getServerSession(context.req, context.res, authOptions)

  // if (!session?.user) return { notFound: true }

  // TODO: Remove auth options when API has removed the JWT middleware
  // const { ok, data, status, error } = await callAPI('/tour-package/tour-details', 'POST', { id_tour_package: id }, true, session.user.accessToken)
  const { ok, data, status, error } = await callAPI('/tour-package/tour-details', 'POST', { id_tour_package: id })

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
  data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const reviewsPerPage = 4
  const sortByOptions = {
    highestRating: 'Highest Rating',
    lowestRating: 'Lowest Rating',
  }

  console.log('data tour review: ', data.tour_review);
  console.log('data:', data);

  const [isShowMorePlanDetails, setIsShowMorePlanDetails] = useState<boolean>(false)
  const [sortBy, setSortBy] = useState<string>(Object.keys(sortByOptions)[0])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const filteredReviews = data.tour_review.sort((a, b) => {
    if (sortBy === 'highestRating') {
      if (a?.star > b?.star) {
        return -1
      }
      if (a?.star < b?.star) {
        return 1
      }
      return 0
    }
    if (sortBy === 'lowestRating') {
      if (a?.star < b?.star) {
        return -1
      }
      if (a?.star > b?.star) {
        return 1
      }
      return 0
    }
    return 0
  })

  const pageCounts = Math.ceil(filteredReviews.length / reviewsPerPage)

  const calculateHalfIndex = (array) => Math.ceil(array.length / 2);

  const [selectedPlan, setSelectedPlan] = useState(data.tour_plans[0]);

  const handlePlanChange = (id) => {
    const foundPlan = data.tour_plans.find((plan) => plan.id_tour_plan === id);
    setSelectedPlan(foundPlan);
  }

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <main className="tour-details">
        <TourTopNav />
        <div className="container">
          <div className="tour-details__header">

            {/* Breadcrumb */}
            <div className="tour-details__header-breadcrumb">
              <Link className="tour-details__header-breadcrumb--link" href="/">Home</Link>
              {!!data.address && (
                <>
                  <p>/</p>
                  <Link className="tour-details__header-breadcrumb--link" href="#">{data.address}</Link>
                </>
              )}
              {!!data.package_name && (
                <>
                  <p>/</p>
                  <p className="tour-details__header-breadcrumb--current">{data.package_name}</p>
                </>
              )}
            </div>

            {/* Image Galleries */}
            <div className="tour-details__imagery">
              <BlurPlaceholderImage src={data.tour_photos?.[0]?.photo} alt={data.package_name} width={644} height={468} />
              <div className="tour-details__imagery-src">
                <BlurPlaceholderImage src={data.tour_photos?.[1]?.photo} alt={data.package_name} width={230} height={230} />
                <BlurPlaceholderImage src={data.tour_photos?.[2]?.photo} alt={data.package_name} width={230} height={230} />
                <BlurPlaceholderImage src={data.tour_photos?.[3]?.photo} alt={data.package_name} width={230} height={230} />
                <BlurPlaceholderImage src={data.tour_photos?.[4]?.photo} alt={data.package_name} width={230} height={230} />
              </div>
            </div>

            {/* Tour Heading */}
            <div className="tour-details__summary">
              <div className="tour-details__summary-left">
                <h3>{data.package_name}</h3>

                <div className="tour-details__summary-left-stars">
                  {Array.from({ length: data.rating }, (_, index) => (
                    <SVGIcon key={index} src={Icons.Star} width={32} height={32} color="#EECA32" />
                  ))}
                </div>

                {!!data.address && (
                  <div className="tour-details__summary-left-location">
                    <SVGIcon src={Icons.MapPin} width={24} height={24} className="" />
                    <p>{data.address}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="search-tour-package__sidemenu-separator"></div>
            <div className="tour-details__content mb-5">
              <div className="tour-details__inner">

                {/* Descriptions */}
                {!!data.description && (
                  <div className="tour-details__desc">
                    <div className="tour-details__desc-left">
                      <p className="tour-details__desc-left-title">Description</p>
                      <p className="tour-details__desc-left-description">{data.description}</p>
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {!!data.tour_review.length && (
                  <div className="tour-details__reviews">
                    <div className="tour-details__reviews-header">
                      <p className="">Reviews</p>
                      <div className="tour-details__reviews-header-overall">
                        <div className="tour-details__reviews-header-chips">{(data.rating / 1).toFixed(1)}</div>
                        <p className="fw-semibold">{
                          data?.rating >= 4.5 ? "Excellent" :
                            data?.rating >= 4.0 ? "Very Good" :
                              data?.rating >= 3.5 ? "Good" :
                                data?.rating >= 3.0 ? "Fair" :
                                  data?.rating >= 2.5 ? "Poor" :
                                    data?.rating >= 2.0 ? "Very Poor" :
                                      data?.rating >= 1.5 ? "Terrible" :
                                        data?.rating >= 1.0 ? "Horrible" :
                                          data?.rating == 0.0 ? "N/A" : "N/A"
                        }</p>
                      </div>
                    </div>
                    <div className="tour-details__reviews-row">
                      {data.tour_review.slice(0, 2).map(({ star, description, profile_photo, fullname, address }, index) => (
                        <div key={`highlight-review-${index}`} className="tour-details__reviews-review">
                          {!!profile_photo && (
                            <BlurPlaceholderImage className='tour-details__guest-review-guest--profile' src={profile_photo} alt={fullname} width={48} height={48} />
                          )}
                          <div className="tour-details__reviews-review-column">
                            <div className="tour-details__reviews-review-content">
                              <div className="tour-details__reviews-review-content--chips">{star || 0}/5</div>
                              {!!description && (
                                <p>“{description}”</p>
                              )}
                            </div>
                            <div className="tour-details__reviews-review-customer">
                              <p>{fullname || 'Anonymous'}</p>
                              <div className="tour-details__reviews-review-customer--location">
                                {/* // TODO: Implement this section when the data is available */}
                                {/* <SVGIcon src={Icons.countryFlagIndonesia} width={16} height={16} /> */}

                                {!!address && (
                                  <p>{address}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {data.tour_review.length > 2 && (
                        <div className="tour-details__reviews-review-content--button-wrap">
                          <a href="#guestReview" className="tour-details__reviews-review-content--button">
                            See More Review
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Plan Details */}
                {!!data.tour_plans.length && (
                  <>
                    <div className="tour-details__detail-plan">
                      <h4>Detail Plan</h4>
                      <div className="tour-details__detail-plan-wrapper">
                        <Fragment>
                          <h6>Plan {selectedPlan.type_plan}</h6>
                          {selectedPlan.plan_location.map(({ order_day, location, location_activity }, index) => (
                            <div key={`plan-details-${index}`} className="tour-details__detail-plan-content-wrapper">
                              <div className="tour-details__detail-plan-content">
                                <div className="tour-details__detail-plan-content-line-left"></div>
                                <div className="tour-details__detail-plan-content-title-wrapper">
                                  <p className="tour-details__detail-plan-content-title">Day {order_day}</p>
                                  <div className="tour-details__detail-plan-content-desc">{location}</div>
                                </div>
                                <div className="tour-details__detail-plan-content-item-wrapper">
                                  <div className="tour-details__detail-plan-content-item">
                                    <p className="tour-details__detail-plan-content-item-desc">{location_activity}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </Fragment>

                        {/* {data.tour_plans.length > 2 && (
                          <Link onClick={() => setIsShowMorePlanDetails(!isShowMorePlanDetails)} href="#" className="tour-details__detail-plan-link">{isShowMorePlanDetails ? 'Show less plan' : 'Show more plan'}</Link>
                        )} */}
                      </div>
                    </div>
                    <div className="search-tour-package__sidemenu-separator"></div>
                  </>
                )}

                {/* Plan Details */}
                {!!data.tour_plans.length && (
                  <>
                    <div className="tour-details__tours-plan">
                      <h4>Tour Plan</h4>
                      {data.tour_plans.map(({ type_plan, plan_name, price, plan_location }, index) => (
                        <div key={`tour-plan-${index}`} className="tour-details__card-wrapper">
                          <div className="tour-details__card-heading-wrapper">
                            <a className="tour-details__card collapsed" data-bs-toggle="collapse" href={`#tour-plan-accord-${index}`} role="button" aria-expanded="false" aria-controls={`tour-plan-accord-${index}`}>
                              <div className="tour-details__card-header-wrapper">
                                <div>Plan {type_plan}</div>&nbsp;
                                <div className="tour-details__card-header-desc">{plan_name ? `(${plan_name})` : ''}</div>
                              </div>
                              <SVGIcon src={Icons.ArrowDown} width={20} height={20} />
                            </a>
                          </div>
                          <div className="tour-details__special collapse" id={`tour-plan-accord-${index}`}>
                            {!!plan_location.length && plan_location.map(({ city, }, planIndex) => (
                              <div key={`tour-plan-${index}-${planIndex}`} className="tour-details__special-location">
                                <div className="tour-details__special-location-title">
                                  <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                                  <p className="tour-details__special-location-desc">{city}</p>
                                </div>

                                <div className="tour-details__special-location-row">
                                  <div className="tour-details__special-location-block">
                                    <div className="tour-details__special-location-block-left">
                                      {plan_location.slice(0, calculateHalfIndex(plan_location)).map(({ location }, planLocationIndex) => (
                                        <ul className="tour-details__special-location-block-item" key={planLocationIndex}>
                                          <li className="tour-details__special-location-block-item">{location}</li>
                                        </ul>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="tour-details__special-location-block">
                                    <div className="tour-details__special-location-block-right">
                                      {plan_location.slice(calculateHalfIndex(plan_location)).map(({ location }, planLocationIndex) => (
                                        <ul className="tour-details__special-location-block-item" key={planLocationIndex}>
                                          <li className="tour-details__special-location-block-item">{location}</li>
                                        </ul>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {!!price && (
                              <div className="tour-details__special-location-footer">
                                <div className="tour-details__special-location-summary-desc">Total</div>
                                <div className="tour-details__special-location-summary-price">$ {price}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="search-tour-package__sidemenu-separator"></div>
                  </>
                )}

                {!!data.tour_facilities.length && (
                  <>
                    <div className="tour-details__facility">
                      <h4>Facilities</h4>
                      <div className="tour-details__facility-wrapper">
                        {!!data.tour_facilities.filter(({ include_status }) => include_status === 1).length && (
                          <div className="tour-details__facility-content-wrapper">
                            <div className="tour-details__facility-content">
                              <p className="tour-details__facility-content-title">Included</p>
                              <div className="tour-details__facility-content-item-wrapper">
                                {data.tour_facilities.filter(({ include_status }) => include_status === 1).map(({ facility_name }, index) => (
                                  <div key={`included-facility-${index}`} className="tour-details__facility-content-item">
                                    <SVGIcon className="tour-details__facility-content-item-icon" src={Icons.Check} width={20} height={20} />
                                    <p className="tour-details__facility-content-item-desc">{facility_name}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {!!data.tour_facilities.filter(({ include_status }) => include_status === 2).length && (
                          <div className="tour-details__facility-content-wrapper">
                            <div className="tour-details__facility-content">
                              <p className="tour-details__facility-content-title">Not Included</p>
                              <div className="tour-details__facility-content-item-wrapper">
                                {data.tour_facilities.filter(({ include_status }) => include_status === 2).map(({ facility_name }, index) => (
                                  <div key={`not-included-facility-${index}`} className="tour-details__facility-content-item">
                                    <SVGIcon className="tour-details__facility-content-item-icon--red" src={Icons.Cancel} width={23} height={23} />
                                    <p className="tour-details__facility-content-item-desc">{facility_name}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                    <div className="search-tour-package__sidemenu-separator"></div>
                  </>
                )}
              </div>

              {/* // TODO: Continue this section for booking flow */}
              <TourDetailBookingSummary data={data} onPlanChange={handlePlanChange} />
            </div>

            {!!data.tour_review.length && (
              <div className="tour-details__guest" id='guestReview'>
                <h4>Guest Reviews</h4>
                <div className="tour-details__guest-header">
                  <div className="tour-details__guest-header-rating">
                    <div className="tour-details__guest-header-chips">{(data.rating / 1).toFixed(1)}</div>
                    <p className="tour-details__guest-header-overall">{
                      data?.rating >= 4.5 ? "Excellent" :
                        data?.rating >= 4.0 ? "Very Good" :
                          data?.rating >= 3.5 ? "Good" :
                            data?.rating >= 3.0 ? "Fair" :
                              data?.rating >= 2.5 ? "Poor" :
                                data?.rating >= 2.0 ? "Very Poor" :
                                  data?.rating >= 1.5 ? "Terrible" :
                                    data?.rating >= 1.0 ? "Horrible" :
                                      data?.rating == 0.0 ? "N/A" : "N/A"
                    }</p>
                    <div className="tour-details__guest-header-dots"></div>
                    <p>{data.tour_review.length} reviews</p>
                  </div>
                  <select onChange={(e) => setSortBy(e.target.value)} value={sortBy} className="tour-details__guest-header-filter" name="filterSort" id="filterSort">
                    {Object.keys(sortByOptions).map((key) => (
                      <option key={`sort-by-${key}`} value={key}>Sort : {sortByOptions[key]}</option>
                    ))}
                  </select>
                </div>
                <div className="tour-details__guest-wrapper">
                  <div className="tour-details__guest-content" style={{ width: '100%' }}>
                    {filteredReviews.map(({ star, description, profile_photo, fullname, address }, index) => {
                      const filteredPaginationItems = (index >= ((currentPage - 1) * reviewsPerPage) && index < (currentPage * reviewsPerPage))

                      const shownItem = filteredPaginationItems

                      return shownItem && (
                        <div key={`review-${index}`} className="hotel-details__guest-review">
                          <div className="tour-details__guest-review-guest" style={{ flex: '1', width: '100%' }}>
                            <BlurPlaceholderImage src={profile_photo} className="tour-details__guest-review-guest--profile" alt={fullname} width={48} height={48} />
                            <div className="tour-details__guest-review-guest--bio" style={{ whiteSpace: 'normal' }}>
                              <p className="tour-details__guest-review-guest--name">{fullname || 'Anonymous'}</p>
                              {!!address && (
                                <div className="tour-details__guest-review-guest--location">
                                  <p>{address}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="tour-details__guest-review-content" style={{ flex: 'none', width: '72%' }}>
                            <div className="tour-details__guest-review-content--chips">{star || '-'}/5</div>
                            {!!description && (
                              <p>“{description}“</p>
                            )}

                          </div>
                        </div>
                      )
                    })}

                  </div>
                </div>
                <div className="tour-details__guest-pagination">
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
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  )
}

const TourTopNav = () => {
  return (
    <div className="container tour-details__nav">
      <button className="tour-details__nav-item active">Overview</button>
      <button className="tour-details__nav-item">Location</button>
      <button className="tour-details__nav-item">Room</button>
      <button className="tour-details__nav-item">Facilities</button>
      <button className="tour-details__nav-item">Reviews</button>
      <button className="tour-details__nav-item">More Information</button>
    </div>
  )
}

const TourDetailBookingSummary = ({ data, onPlanChange }) => {
  const router = useRouter()
  const date = router.query?.date
  const [idTourPlan, setIdTourPlan] = useState<number>(data.tour_plans[0]?.id_tour_plan)
  // const [date, setDate] = useState(null)
  const [ticket, setTicket] = useState<number>(1)
  const [totalPrice, setTotalPrice] = useState(data.tour_plans[0]?.price)

  console.log('idTourPlan: ', idTourPlan);

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  useEffect(() => {
    const selectedPlan = data.tour_plans.find(plan => plan.id_tour_plan === idTourPlan);
    if (selectedPlan) {
      setTotalPrice(parseFloat(selectedPlan.price) * ticket);
    }
  }, [ticket, idTourPlan, data.tour_plans]);


  return (

    <div className="tour-booking-details__summary">
      <div className="tour-booking-details__summary-title">Booking Details</div>
      <div className="tour-booking-details__ticket-block">
        <label className="tour-booking-details__ticket-block" htmlFor="tour-package">Choose Package</label>
        <select required value={idTourPlan} onChange={(e) => { setIdTourPlan(Number(e.target.value)), onPlanChange(Number(e.target.value)) }} name="tour-plan" id="tour-plan" placeholder="Select your plan">
          {data.tour_plans.map(({ type_plan, id_tour_plan }, index) => (
            <option value={id_tour_plan} key={index}>Plan {type_plan}</option>
          ))}
        </select>
      </div>
      <div className="tour-booking-details__ticket-block">
        <label htmlFor="payment-date">Date</label>
        <div className="tour-booking-details__payment-input">
          <input disabled required type="text" value={moment(date).format("MM / DD / YYYY")} name="payment-date" id="payment-date" placeholder="MM / DD / YYYY" />
          <SVGIcon className="tour-booking-details__payment-input--icon" src={Icons.Calendar} width={20} height={20} />
        </div>
      </div>
      <div className="tour-booking-details__ticket-block">
        <label htmlFor="contact-ticket">How many ticket ?</label>
        <div className="tour-booking-details__ticket-wrapper">
          <div className="tour-booking-details__ticket-adult">Adult (Age 1-80)</div>
          <div className="tour-booking-details__ticket-amount">
            <button onClick={() => setTicket(ticket - 1)} disabled={ticket <= 1} className={`tour-booking-details__ticket-amount-btn-${ticket <= 1 ? 'gray' : 'green'}`} style={{ border: 'none' }}>
              <SVGIcon src={Icons.Minus} width={16} height={16} />
            </button>
            <div className="tour-booking-details__ticket-amount">{ticket}</div>
            <button onClick={() => setTicket(ticket + 1)} className="tour-booking-details__ticket-amount-btn-green" style={{ border: 'none' }}>
              <SVGIcon src={Icons.Plus} width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="tour-booking-details__summary-separator"></div>
      <div className="tour-booking-details__summary-total">
        <div className="tour-booking-details__summary-total-title">Total</div>
        <div className="tour-booking-details__summary-total-price">
          <div className="tour-booking-details__summary-total-price--text">{currencySymbol} {changePrice(totalPrice)}</div>
        </div>
      </div>
      {!idTourPlan || !date || !ticket ? (
        <button disabled className="btn btn-success tour-booking-details__summary-button">Book</button>
      ) : (
        <Link
          href={`/booking/tour/${data.id_tour_package}?id_plan=${idTourPlan}&start_date=${date}&tickets=${ticket}`}
          className="btn btn-success tour-booking-details__summary-button"
        >
          Book
        </Link>
      )}
    </div>

  )
}
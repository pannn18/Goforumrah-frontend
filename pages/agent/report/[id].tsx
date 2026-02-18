import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import Navbar from "@/components/layout/navbar"
import AgentNavbar from "@/components/layout/agentNavbar"
import Link from "next/link"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons, Images } from "@/types/enums"
import { BlurPlaceholderImage } from "@/components/elements/images"
import hotelMapLocation from '@/assets/images/sidemenu_maps.png'


const PartnerHotel = (props) => {
  const [isStatusCancelled, setisStatusCancelled] = useState(true)
  const [isStatusCompleted, setisStatusCompleted] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (router.query?.status) {
      setisStatusCancelled(router.query.status === '4')
    }
    if (router.query?.status) {
      setisStatusCompleted(router.query.status === '2')
    }
  }, [router.query?.status])
  return (
    <Layout>
      <AgentNavbar />
      <div className="agent-booking">
        <div className="container">
          <Breadcrumb />
          <BookingHeader isStatusCancelled={isStatusCancelled} isStatusCompleted={isStatusCompleted} />
          <BookingContent isStatusCancelled={isStatusCancelled} isStatusCompleted={isStatusCompleted} />
        </div>
      </div>
      <BookingOffCanvas />
      <ConfirmModal />
    </Layout>
  )
}

interface BookingCancelledProps {
  isStatusCancelled?: boolean,
  isStatusCompleted?: boolean
}

const Breadcrumb = () => {
  return (
    <div className="hotel-details__header-breadcrumb">
      <Link className="hotel-details__header-breadcrumb--link" href="/agent/report">Report</Link>
      <p>/</p>
      <p className="hotel-details__header-breadcrumb--current">Booking Details</p>
    </div>
  )
}

const BookingHeader = (props: BookingCancelledProps) => {
  return (
    <div className="agent-booking__summary">
      <div className="agent-booking__summary-header">
        <h3>Booking details</h3>
        {!props.isStatusCancelled && (
          <button className="btn btn-lg btn-success"><SVGIcon src={Icons.Printer} width={20} height={20} />Print Invoice</button>
        )}
        {props.isStatusCancelled && (
          <button className="btn btn-lg btn-success">Reorder</button>
        )}
      </div>
      <div className="agent-booking__summary-list">
        <div className="agent-booking__summary-list-item">
          <p className="agent-booking__summary-list-label">Booking ID</p>
          <p className="agent-booking__summary-list-text">#1122334455</p>
        </div>
        <div className="agent-booking__summary-list-item">
          <p className="agent-booking__summary-list-label">Guest name</p>
          <p className="agent-booking__summary-list-text">Eleanor Pena</p>
        </div>
        <div className="agent-booking__summary-list-item">
          <p className="agent-booking__summary-list-label">Email</p>
          <p className="agent-booking__summary-list-text">Devomelane@gmail.com</p>
        </div>
        <div className="agent-booking__summary-list-item">
          <p className="agent-booking__summary-list-label">Phone Number</p>
          <p className="agent-booking__summary-list-text">+966 11123 4567</p>
        </div>
        <div className="agent-booking__summary-list-item">
          <p className="agent-booking__summary-list-label">Status</p>
          {props.isStatusCompleted && (
            <p className="agent-booking__summary-list-chips agent-booking__summary-list-chips--completed">Complete</p>
          )}
          {props.isStatusCancelled && (
            <p className="agent-booking__summary-list-chips agent-booking__summary-list-chips--cancelled">Cancelled</p>
          )}
          {!props.isStatusCancelled && !props.isStatusCompleted && (
            <p className="agent-booking__summary-list-chips agent-booking__summary-list-chips--completed">Complete</p>
          )}
        </div>
        <div className="agent-booking__summary-list-item">
          <p className="agent-booking__summary-list-label">Paid on</p>
          <p className="agent-booking__summary-list-text">20/02/23</p>
        </div>
      </div>
    </div>
  )
}
const BookingContent = (props: BookingCancelledProps) => {
  return (
    <div className="agent-booking__content">
      <div className="agent-booking__wrapper">
        <div className="agent-booking__hotel">
          <div className="agent-booking__hotel-detail">
            <BlurPlaceholderImage alt="" src={Images.Placeholder} width={120} height={100} />
            <div className="agent-booking__hotel-detail__text">
              <p className="agent-booking__hotel-detail__name">Sheraton Makkah Jabal Al Kaaba Hotel</p>
              <p className="agent-booking__hotel-detail__desc">Twin Room (Standard)</p>
            </div>
            <button className="btn btn-lg btn-success">Live view</button>
          </div>
          <div className="agent-booking__hotel-checkin">
            <div className="agent-booking__hotel-checkin__box">
              <div className="agent-booking__hotel-checkin__icon">
                <SVGIcon src={Icons.Calendar} width={20} height={20} />
              </div>
              <div className="agent-booking__hotel-checkin__text">
                <p>Check-in</p>
                <div className="agent-booking__hotel-checkin__text-date">
                  <p>Sept 28, 2022</p>
                  <div className="agent-booking__hotel-checkin__text-time">
                    <p>(06:00)</p>
                    <p>-</p>
                    <p>(21:00)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="agent-booking__hotel-checkin__box">
              <div className="agent-booking__hotel-checkin__icon">
                <SVGIcon src={Icons.Calendar} width={20} height={20} />
              </div>
              <div className="agent-booking__hotel-checkin__text">
                <p>Check-out</p>
                <div className="agent-booking__hotel-checkin__text-date">
                  <p>Sept 29, 2022</p>
                  <div className="agent-booking__hotel-checkin__text-time">
                    <p>(06:00)</p>
                    <p>-</p>
                    <p>(21:00)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="agent-booking__hotel-divider"></div>
          <div className="agent-booking__room">
            <div className="agent-booking__room-box">
              <p>Duration</p>
              <div className="agent-booking__room-desc">
                <SVGIcon src={Icons.SunHorizon} width={20} height={20} />
                <p>1 day</p>
              </div>
            </div>
            <div className="agent-booking__room-box">
              <p>Room</p>
              <div className="agent-booking__room-desc">
                <SVGIcon src={Icons.Calendar} width={20} height={20} />
                <p>1 Room</p>
              </div>
            </div>
            <div className="agent-booking__room-box">
              <p>Guest</p>
              <div className="agent-booking__room-desc">
                <SVGIcon src={Icons.Users} width={20} height={20} />
                <p>1 Guest</p>
              </div>
            </div>
          </div>
          <div className="agent-booking__location">
            <p>Location</p>
            <div className="agent-booking__location-inner">
              <div className="agent-booking__location-map">
                <BlurPlaceholderImage src={hotelMapLocation} alt="Trending City" width={240} height={117} />
                <div className="agent-booking__location-map-overlay"></div>
                <label htmlFor="export" className="agent-booking__location-map-button btn btn-sm btn-success">
                  <SVGIcon src={Icons.Upload} width={20} height={20} />
                  Upload
                </label>
                <input type="file" id="export" hidden />
              </div>
              <div className="agent-booking__location-text">
                <p>King Abdulaziz International Airport - Jeddah</p>
                <div className="agent-booking__location-address">
                  <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
                  <p>318, Federal circle, JFK Airport, USA 11432</p>
                </div>
              </div>
            </div>
          </div>
          <div className="agent-booking__facilities">
            <p>Facilities</p>
            <div className="agent-booking__facilities-list">
              <div className="agent-booking__facilities-box">
                <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                <p>4 Seats</p>
              </div>
              <div className="agent-booking__facilities-box">
                <SVGIcon src={Icons.WifiHigh} width={20} height={20} />
                <p>4 Doors</p>
              </div>
              <div className="agent-booking__facilities-box">
                <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
                <p>Manual</p>
              </div>
              <div className="agent-booking__facilities-box">
                <SVGIcon src={Icons.Barbel} width={20} height={20} />
                <p>Air Conditioning</p>
              </div>
              <Link href="#" className="btn btn-lg btn-outline-success agent-booking__facilities-button">Show more facilities</Link>
            </div>
          </div>
        </div>
        <div className="agent-booking__additional">
          <p className="agent-booking__additional-title">Additional information</p>
          <p className="agent-booking__additional-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
        </div>
      </div>
      <div className="agent-booking__manage">
        <p className="agent-booking__manage-title">Manage your Booking</p>
        {!props.isStatusCancelled && (
          <div>
            <Link href="#" className="agent-booking__manage-list">
              <SVGIcon src={Icons.User} className="agent-booking__manage-list-icon" width={24} height={24} />
              <p>Edit guest details</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </Link>
            <Link href="#" className="agent-booking__manage-list">
              <SVGIcon src={Icons.Pencil} className="agent-booking__manage-list-icon" width={24} height={24} />
              <p>Change your room</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </Link>
            <Link href="#" className="agent-booking__manage-list">
              <SVGIcon src={Icons.SandClock} className="agent-booking__manage-list-icon" width={24} height={24} />
              <p>Reschedule</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </Link>
            <Link href="#" className="agent-booking__manage-list agent-booking__manage-list--cancel" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
              <SVGIcon src={Icons.Cancel} width={24} height={24} />
              <p>Cancel booking</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </Link>
          </div>
        )}
        {props.isStatusCancelled && (
          <div>
            <div className="agent-booking__manage-list agent-booking__manage-list--disable">
              <SVGIcon src={Icons.User} className="agent-booking__manage-list-icon" width={24} height={24} />
              <p>Edit guest details</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </div>
            <div className="agent-booking__manage-list agent-booking__manage-list--disable">
              <SVGIcon src={Icons.Pencil} className="agent-booking__manage-list-icon" width={24} height={24} />
              <p>Change your room</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </div>
            <div className="agent-booking__manage-list agent-booking__manage-list--disable">
              <SVGIcon src={Icons.SandClock} className="agent-booking__manage-list-icon" width={24} height={24} />
              <p>Reschedule</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </div>
            <div className="agent-booking__manage-list agent-booking__manage-list--cancel agent-booking__manage-list--disable">
              <SVGIcon src={Icons.Cancel} width={24} height={24} />
              <p>Cancel booking</p>
              <SVGIcon src={Icons.ArrowRight} className="agent-booking__manage-list-arrow" width={24} height={24} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const BookingOffCanvas = (props: BookingCancelledProps) => {
  return (
    <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
      <div className="offcanvas-header agent-booking__offcanvas-header">
        <h4 id="offcanvasRightLabel">Cancel Booking</h4>
        <button type="button" className="agent-booking__offcanvas-button" data-bs-dismiss="offcanvas" aria-label="Close">
          <SVGIcon src={Icons.Cancel} width={24} height={24} />
        </button>
      </div>
      <div className="offcanvas-body agent-booking__offcanvas-body">
        <p>We can find alternative solution if you need to make changes to your booking</p>
        <div className="agent-booking__offcanvas-group">
          <label htmlFor="contact-country">Reason</label>
          <select name="contact-title" id="contact-title" placeholder="Select your country">
            <option value="request">Guest Request</option>
            <option value="wrong">Wrong Data</option>
            <option value="owner">Owner Rquest</option>
          </select>
        </div>
        <div>
          <label className="agent-booking__offcanvas-options form-check" htmlFor="cancelReasonPremises">
            <p className="form-check-label">Want to change hotel premises</p>
            <input type="radio" name="cancelReason" id="cancelReasonPremises" className="form-check-input cancelation__reason-input" defaultChecked />
          </label>
          <label className="agent-booking__offcanvas-options form-check" htmlFor="cancelReasonDate">
            <p className="form-check-label">Wrong date</p>
            <input type="radio" name="cancelReason" id="cancelReasonDate" className="form-check-input cancelation__reason-input" />
          </label>
          <label className="agent-booking__offcanvas-options form-check" htmlFor="cancelReasonAccident">
            <p className="form-check-label">Accidentally placed an order</p>
            <input type="radio" name="cancelReason" id="cancelReasonAccident" className="form-check-input cancelation__reason-input" />
          </label>
          <label className="agent-booking__offcanvas-options form-check" htmlFor="cancelReasonPlan">
            <p className="form-check-label">I want to change my plan</p>
            <input type="radio" name="cancelReason" id="cancelReasonPlan" className="form-check-input cancelation__reason-input" />
          </label>
          <label className="agent-booking__offcanvas-options form-check" htmlFor="cancelReasonPersonal">
            <p className="form-check-label">Personal reasons</p>
            <input type="radio" name="cancelReason" id="cancelReasonPersonal" className="form-check-input cancelation__reason-input" />
          </label>
          <label className="agent-booking__offcanvas-options form-check" htmlFor="cancelReasonRequirement">
            <p className="form-check-label">Room Requirements Changed</p>
            <input type="radio" name="cancelReason" id="cancelReasonRequirement" className="form-check-input cancelation__reason-input" />
          </label>
        </div>

      </div>
      <div className="agent-booking__offcanvas-body">
        <button type="button" className="btn btn-lg btn-success" data-bs-dismiss="offcanvas" data-bs-toggle="modal" data-bs-target="#confirmationModal">Continue</button>
      </div>
    </div>
  )
}

const ConfirmModal = () => {
  const router = useRouter()

  return (
    <>
      <div className="modal fade" id="confirmationModal" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal">
          <div className="modal-content cancelation__modal-body">
            <div className="cancelation__modal-content">
              <div className="cancelation__modal-image">
                <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
              </div>
              <div className="cancelation__modal-text">
                <h3>Do you want to proceed with the cancellation ?</h3>
                <p className="cancelation__modal-desc">Once a request has been submitted, you cannot change or add it again</p>
              </div>
            </div>
            <div className="cancelation__modal-footer">
              <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
              <a type='button' onClick={() => router.push('/agent/report/details?status=4')} className="btn btn-lg btn-success cancelation__modal-button" data-bs-dismiss="modal">Request to cancel</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: 'details' } }],
    fallback: false
  }
}

export async function getStaticProps(context) {
  return {
    props: {
      id: context.params.id
    },
  }
}

export default PartnerHotel
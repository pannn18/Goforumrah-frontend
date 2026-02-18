import React from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ManageCardList from '@/components/pages/manage/manageReview'
import SVGIcon from '@/components/elements/icons'
import { useRouter } from 'next/router'
import { StaticImageData } from "next/image"
import { BlurPlaceholderImage } from "@/components/elements/images"
import ReviewStar from '@/assets/images/review-star.svg'
import CheckCircle from '@/assets/images/icon_check_circle.svg'



export default function Home() {
  return (
    <>
      <Layout>
        <Navbar showCurrency={true} />
        <main className="manage-review">
          <BookingHeader />
          <div className="container">
          <BreadCrumb />
            <div className="manage-review__wrapper">
              <MenuBar />
              <div className="manage-review__content">
                <div className="manage-review__content-header">
                    <h5 className="manage-review__content-header-title">Rate your trips</h5>
                  <div className="manage-review__content-header-subtitle">Share with other travelers what you liked most about the places.</div>
                </div>
                <ManageReview />
              </div>
            </div>
          </div>
        </main>
        <ReviewModal1 />
        <ReviewModal2 />
        <ReviewModalConfirmation />
        <Footer />
      </Layout>
    </>
  )
}

const BookingHeader = () => {
  return (
    <div className="booking-hotel__header">
      <div className="container">
        <div className="booking-hotel__header-wrapper">
          <Link href="/" className="booking-hotel__header-title">
            <div className="booking-hotel__header-title-button">
              <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
            </div>
            <h4>Back</h4>
          </Link>
        </div>
      </div>
    </div>
  )
}

const BreadCrumb = () => {
    return (
      <div className="manage-review__breadcrumb">
        <Link className="manage-review__breadcrumb--link" href="#">Home</Link>
        <p>/</p>      
        <p className="manage-review__breadcrumb--current">My Review</p>
      </div>
    )
  }

const MenuBar = () => {
  return (
    <div className="manage-review__menu">
      <div className="manage-review__menu-profile">
        <div className="manage-review__menu-avatar">
          <SVGIcon src={Icons.User} width={20} height={20} />
        </div>
        <div className="manage-review__menu-text">
          <p className="manage-review__menu-text-name">Abdurrahman</p>
          <p className="manage-review__menu-text-email">Abdurrahman@gmail.com</p>
        </div>
      </div>
      <div className="manage-review__menu-list">
        <Link href="/manage-account" className="manage-review__menu-item">
          <SVGIcon src={Icons.User} width={20} height={20} />
          <p>My account</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage-review__menu-item--arrow" />
        </Link>
        <Link href="/manage-booking" className="manage-review__menu-item">
          <SVGIcon src={Icons.Box} width={20} height={20} />
          <p>My booking</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage-review__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage-review__menu-item active">
          <SVGIcon className="manage-review__menu-item--icon" src={Icons.StarOutline} width={20} height={20} />
          <p>My review</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage-review__menu-item--arrow" />
        </Link>
        <Link href="/manage-account" className="manage-review__menu-item">
          <SVGIcon src={Icons.Setting} width={20} height={20} />
          <p>Account setting</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage-review__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage-review__menu-item">
          <SVGIcon src={Icons.Help} width={20} height={20} />
          <p>My review</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage-review__menu-item--arrow" />
        </Link>
        <Link href="#" className="manage-review__menu-item">
          <SVGIcon src={Icons.Logout} width={20} height={20} />
          <p>Logout</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage-review__menu-item--arrow" />
        </Link>
      </div>
    </div>
  )
}

const ManageReview = () => {
  const manages = [
    {type: Services.Hotel, image: Images.Placeholder, name: { name: 'Sheraton Makkah Jabal Al Kaaba' }, status: 'confirm', location: 'Hotel in Ayjad, Makkah', desc: { date: 'Sun, 27 Oct 2022', people: '2 Guest', duration: '1 Day' }, linkURL: '#' },
  ]


  return (
    <div className="manage-review__content-list">
      {manages.map((manages, index) => (
        <ManageCardList {...manages} key={index} />
      ))}
    </div>
  )
}

const ReviewModal1 = () => {
  const router = useRouter()

  return(
    <>
      <div className="modal fade" id="reviewModal1" tabIndex={-1} aria-labelledby="reviewLabel" aria-hidden="true">
        <div className="modal-dialog manage-review__modal">
          <div className="modal-content manage-review__modal-body">
            <div className="manage-review__modal-header">
            <div>
              <h5 className="">Rate your reviews</h5>
            </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="manage-review__modal-desc">
              <BlurPlaceholderImage className="manage-review__modal-desc-image" src={Images.Placeholder} alt="Review Image" width={120} height={120} />
              <div className="manage-review__modal-review-detail">
                <div className="manage-review__modal-review-title">
                  <h4>Sheraton Makkah Jabal Al Kaaba</h4>
                </div>
                <div className="manage-review__modal-review-star">
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
              </div>
            </div> 
          </div>
        </div>
      </div>
    </>
  )
}

const ReviewModal2 = () => {
  const router = useRouter()

  return(
    <>
      <div className="modal fade" id="reviewModal2" tabIndex={-1} aria-labelledby="reviewLabel" aria-hidden="true">
        <div className="modal-dialog manage-review__modal">
          <div className="modal-content manage-review__modal-body">
            <div className="manage-review__modal-header">
            <div>
              <h5 className="">Rate your reviews</h5>
            </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="manage-review__modal-desc-question">
              <BlurPlaceholderImage className="manage-review__modal-desc-question-image" src={Images.Placeholder} alt="Review Image" width={120} height={120} />
              <div className="manage-review__modal-review-detail">
                <div className="manage-review__modal-review-title">
                  <h4>Sheraton Makkah Jabal Al Kaaba</h4>
                </div>
                <div className="manage-review__modal-review-star">
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                  <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
              </div>
              </div> 
              <div className="manage-review__modal-review-question-wrapper">
                <div className="manage-review__modal-review-question">
                  <span className="manage-review__modal-review-question-title">
                    How Were The Staff ?
                  </span>
                  <div className="manage-review__modal-review-star">
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
                </div>
                <div className="manage-review__modal-review-question">
                  <span className="manage-review__modal-review-question-title">
                    How Were The Facilities ?
                  </span>
                  <div className="manage-review__modal-review-star">
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
                </div>
                <div className="manage-review__modal-review-question">
                  <span className="manage-review__modal-review-question-title">
                    Was it clean ?
                  </span>
                  <div className="manage-review__modal-review-star">
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
                </div>
                <div className="manage-review__modal-review-question">
                  <span className="manage-review__modal-review-question-title">
                    Was it comfortable ?
                  </span>
                  <div className="manage-review__modal-review-star">
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
                </div>
                <div className="manage-review__modal-review-question">
                  <span className="manage-review__modal-review-question-title">
                    Was it good value for money ?
                  </span>
                  <div className="manage-review__modal-review-star">
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
                </div>
                <div className="manage-review__modal-review-question">
                  <span className="manage-review__modal-review-question-title">
                    How was the location ?
                  </span>
                  <div className="manage-review__modal-review-star">
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                    <SVGIcon src={Icons.StarOutline} width={24} height={24} />
                </div>
                </div>
                <div className="manage-review__modal-review-question">
                  <span className="manage-review__modal-review-question-title">
                    Tell us a litte more
                  </span>
                  <div className="manage-review__modal-review-form">
                    <textarea className="manage-review__modal-review-form-desc" placeholder="Type your taglines here.." name="form-placeholder" rows={6}></textarea>
                  </div>
                </div>
              </div>  
              <div className="manage-review__modal-footer">
                  <div className="manage-review__buttons">
                    <button type="button" className="manage-review__buttons btn btn-lg btn-outline-success" data-bs-toggle="modal" data-bs-target="#reviewModal2" > Cancel</button>            
                  </div>
                  <div className="manage-review__buttons">
                    <button type="button" className="manage-review__buttons btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#reviewModalConfirmation" > Save </button>            
                  </div>
              </div>
            </div>
        </div>
      </div>
    </>
  )
}

const ReviewModalConfirmation = () => {
  const router = useRouter()

  return(
    <>
      <div className="modal fade" id="reviewModalConfirmation" tabIndex={-1} aria-labelledby="confirmationModalLabel" aria-hidden="true">
        <div className="modal-dialog manage-review__modal-complete">
          <div className="modal-content manage-review__modal-complete-body">
          <div className="manage-review__modal-complete-header">
            <div>
            </div>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="manage-review__modal-complete-content">
              <div className="manage-review__modal-complete-image">
                <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
              </div>
              <div className="manage-review__modal-complete-text">
                <h4>Thank for your sharing</h4>
                <p className="manage-review__modal-complete-desc">
                We’ve just sent your review to our moderation team . They’ll check that it follows our guideline and let you know as soon as they add to the site.
                </p>
              </div>
            </div>       
          </div>
        </div>
      </div>
    </>
  )
}
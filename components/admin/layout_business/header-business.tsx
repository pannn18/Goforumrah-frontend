import { BlurPlaceholderImage } from '@/components/elements/images'
import React from 'react'
import defaultProfileImage from '@/assets/images/default_profile_64x64.png'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import logoText from '@/assets/images/logo_text_dark.svg';
import DropdownMenu from "@/components/elements/dropdownMenu";
import { useState } from "react";

const Header = () => {
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)
  
  return (
    <div className="admin-header">
      <div className="admin-business-header__left">
      <button className="admin-header__sidemenu-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
          <SVGIcon src={Icons.Sort} width={24} height={24} />
        </button>
      <div className="admin-business-header__left-content">
        <div className="admin-business-header__left-content-img">
            <BlurPlaceholderImage className="manage-review__modal-desc-image" src={Images.Placeholder} alt="Review Image" width={48} height={48} />
        </div>
        <div className="admin-business-header__left-content-wrapper">
          <div className="admin-business-header__left-content-location">Big Makkah Hotel</div>
          <div className="admin-business-header__left-content-desc">#10292827</div>
        </div>
      </div>
        <div className="admin-business-header__left-content-link">
          <Link href="#" className="admin-business-header__left-content-link">See your property</Link>
        </div>
      </div>
      <div className="admin-header__right-content">
        <div className="admin-header__search">
          <input type="text" className="form-control" placeholder="Search" />
          <SVGIcon src={Icons.Search} width={20} height={20} />
        </div>
        <div className="admin-header__notification">
          <SVGIcon src={Icons.Bell} width={24} height={24} className="admin-header__notification-toggle admin-business-header__notification-toggle--has-dot" />
        </div>
        <div className="admin-header__user">
          <div className="admin-header__user-toggle " onClick={() => setShowReviewDropdown(true)}>
            <BlurPlaceholderImage src={defaultProfileImage} alt="Administrator" width={64} height={64} className="admin-header__user-image" />
            <div className="admin-header__user-group">
              <div className="admin-header__user-name">John Doe</div>
              <div className="admin-header__user-title">Administrator</div>
            </div>
            <SVGIcon src={Icons.ArrowDown} width={20} height={20} className="admin-header__user-arrow" />
            <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-business__header-dropdown-menu admin-business-header__dropdown-menu" style={{ marginTop: 16, width: 273 }}>
              <div className="admin-business-header__shape-triangle"></div>
              <div className="custom-dropdown-menu__options">
                <Link href={"/business/hotel/account/change-password"} className="admin-business-header__list-menu">
                  <div className="admin-business-header__list-menu-wrapper">
                    <SVGIcon src={Icons.Lock} width={20} height={20} className="admin-header__user-arrow" color='#616161' />
                    <p className='admin-business-header__list-menu-caption'>Change Password</p>
                  </div>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-header__user-arrow" color='#D9E0E4' />
                </Link>
                <Link href={"/business/hotel/account/manage-user"} className="admin-business-header__list-menu">
                  <div className="admin-business-header__list-menu-wrapper">
                    <SVGIcon src={Icons.UserThree} width={20} height={20} className="admin-header__user-arrow" color='#616161' />
                    <p className='admin-business-header__list-menu-caption'>Manage User</p>
                  </div>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-header__user-arrow" color='#D9E0E4' />
                </Link>
                <Link href={"/business/hotel/account/linked-device"} className="admin-business-header__list-menu">
                  <div className="admin-business-header__list-menu-wrapper">
                    <SVGIcon src={Icons.MonitorOutline} width={20} height={20} className="admin-header__user-arrow" color='#616161' />
                    <p className='admin-business-header__list-menu-caption'>Linked Device</p>
                  </div>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-header__user-arrow" color='#D9E0E4' />
                </Link>
                <Link href="#" className="admin-business-header__list-menu">
                  <div className="admin-business-header__list-menu-wrapper">
                    <SVGIcon src={Icons.Logout} width={20} height={20} className="admin-header__user-arrow" color='#616161' />
                    <p className='admin-business-header__list-menu-caption'>Logout</p>
                  </div>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-header__user-arrow" color='#D9E0E4' />
                </Link>
              </div>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <AdminOffCanvas />
    </div>
  )
}

const AdminOffCanvas = () => {
  const { pathname } = useRouter()

  return(
    <div className="offcanvas offcanvas-start admin-sidebar-offcanvas" tabIndex={-1} id="offcanvasLeft" aria-labelledby="offcanvasLeftLabel">
      <div className="offcanvas-header admin-sidebar-offcanvas__header">
        <Image src={logoText} alt="GoForUmrah" width={146} height={26} />
        <SVGIcon src={Icons.Bell} width={24} height={24} className="admin-sidebar-offcanvas__notification-toggle admin-sidebar-offcanvas__notification-toggle--has-dot" />
        <button type="button" className="admin-sidebar-offcanvas__header-button" data-bs-dismiss="offcanvas" aria-label="Close">
          <SVGIcon src={Icons.Cancel} width={24} height={24} />
        </button>
      </div>
      <div className="offcanvas-body admin-sidebar-offcanvas__body">
      <div className="admin-sidebar-menu-wrapper">
        <Link href={'/business/hotel/dashboard'} className={`admin-sidebar-menu ${pathname === '/business/hotel/dashboard' ? 'active' : ''}`}>
          <SVGIcon src={Icons.SquaresFor} width={20} height={20} />
          <span>Dashboard</span>
        </Link>
        <Link href={'/business/hotel/rate-availability'} className={`admin-sidebar-menu ${pathname === '/business/hotel/rate-availability' ? 'active' : ''}`}>
          <SVGIcon src={Icons.Calendar} width={20} height={20} />
          <span>Rates & Availability</span>
        </Link>
        <Link href={'/business/hotel/reservation-list'} className={`admin-sidebar-menu ${pathname === '/business/hotel/reservation-list' ? 'active' : ''}`}>
          <SVGIcon src={Icons.Reservation} width={20} height={20} />
          <span>Reservation</span>
        </Link>
        <Link href={'/business/hotel/property'} className={`admin-sidebar-menu ${pathname === '/business/hotel/property' ? 'active' : ''}`}>
          <SVGIcon src={Icons.Property} width={20} height={20} />
          <span>Property</span>
        </Link>
        <Link href={'/business/hotel/guest-review'} className={`admin-sidebar-menu ${pathname === '/business/hotel/guest-review' ? 'active' : ''}`}>
          <SVGIcon src={Icons.StarOutline} width={20} height={20} />
          <span>Guest review</span>
        </Link>
      </div> 
      </div>      
    </div>
  )
}

export default Header
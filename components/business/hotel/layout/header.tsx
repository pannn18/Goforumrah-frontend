import { BlurPlaceholderImage } from '@/components/elements/images'
import React, { useEffect, useState } from 'react'
import defaultProfileImage from '@/assets/images/default_profile_64x64.png'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import logoText from '@/assets/images/logo_text_dark.svg';
import DropdownMenu from "@/components/elements/dropdownMenu";
import { signOut } from 'next-auth/react'
import { useSession } from "next-auth/react"
import { callAPI } from '@/lib/axiosHelper'
interface HeaderProps {
  propertyHotel?: any
}
const Header = (props: HeaderProps) => {
  const session = useSession()
  const [propertyHotelData, setPropertyHotelData] = useState(null);
  const [userData, setUserData] = useState(null);
  // console.log("Session : ", session)
  // console.log(propertyHotelData);



  const fetchData = async () => {
    if (!propertyHotelData && session?.data?.user?.id) {
      try {
        // Requires a user_id reference for the endpoint below
        const { status, data, ok, error } = await callAPI('/hotel/list-property', 'POST', { id_hotel_business: session?.data?.user?.id }, true)
        // Assuming propertyHotel is an array
        const lastIndex = data.length - 1;
        // console.log(lastIndex)
        if (lastIndex >= 0) {
          setPropertyHotelData(data[0]);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (!userData && session?.data?.user?.id) {
      try {
        // Requires a user_id reference for the endpoint below
        const { status: statusUser, data: dataUser, ok: okUser, error: errorUser } = await callAPI('/hotel-business/show', 'POST', { id_hotel_business: session?.data?.user?.id }, true)
        // Assuming propertyHotel is an array
        setUserData(dataUser);
      } catch (error) {
        console.log(error);
      }
    }

    return
  };

  useEffect(() => {
    if (propertyHotelData && userData) return
    fetchData();
  }, [session]);

  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)

  // console.log("propertyHotelData fetched : ", propertyHotelData)
  // console.log("userData fetched : ", userData)
  // console.log("session User : ", session)

  const [profilePhoto, setProfilePhoto] = useState(null)

  const getPropertyProfile = async () => {
    try {
      const { data: profile, ok: profileOk, error: profileError } = await callAPI(`/hotel-account-menu/business-setting-property/show`, 'POST', { id_hotel_business: session?.data?.user?.id }, true)
      if (profileError) {
        console.error('Fetching error: ', profileError)
      }
      if (profileOk && profile) {
        setProfilePhoto(profile?.profile_icon || profile?.hotel_photos?.[0]?.photo)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (!session?.data?.user?.id) return
    if (!profilePhoto) {
      getPropertyProfile()
    }
  }, [session?.data?.user?.id])

  // console.log("profilePhoto : ", profilePhoto)

  return (
    <div className="admin-header admin-business-header">
      <div className="admin-business-header__left">
        <button className="admin-header__sidemenu-toggle" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasLeft" aria-controls="offcanvasLeft">
          <SVGIcon src={Icons.Sort} width={24} height={24} />
        </button>
        <div className="admin-business-header__left-content">
          <div className="admin-business-header__left-content-img">
            <img src={profilePhoto || Images.Placeholder} alt="" width={48} height={48} />
          </div>
          <div className="admin-business-header__left-content-wrapper">
            <div className="admin-business-header__left-content-location">{propertyHotelData && propertyHotelData?.property_name}</div>
            <div className="admin-business-header__left-content-desc">{propertyHotelData && "#" + propertyHotelData?.id_hotel}</div>
          </div>
        </div>
        <div className="admin-business-header__left-content-link">
          <Link href={propertyHotelData?.id_hotel ? `/hotel/detail?id=${propertyHotelData?.id_hotel}` : "#"} target="_blank" className="admin-business-header__left-content-link">See your property</Link>
        </div>
      </div>
      <div className="admin-header__right-content">
        {/* <div className="admin-header__search">
          <input type="text" className="form-control" placeholder="Search" /> // TEMPORARILY HIDDEN SEARCH BAR
          <SVGIcon src={Icons.Search} width={20} height={20} />
        </div> */}
        <div className="admin-header__notification">
          <SVGIcon src={Icons.Bell} width={24} height={24} className="admin-header__notification-toggle admin-business-header__notification-toggle--has-dot" />
        </div>
        <div className="admin-header__user">
          <div className="admin-header__user-toggle " onClick={() => setShowReviewDropdown(true)}>
            <img src={profilePhoto || Images.Placeholder} alt="Administrator" width={64} height={64} className="admin-header__user-image" />
            <div className="admin-header__user-group">
              <div className="admin-header__user-name">{userData ? userData?.firstname + " " + userData?.lastname : ""}</div>
              <div className="admin-header__user-title">Administrator</div>
            </div>
            <SVGIcon src={Icons.ArrowDown} width={20} height={20} className="admin-header__user-arrow" />
            <DropdownMenu show={showReviewDropdown} setShow={setShowReviewDropdown} className="admin-business__header-dropdown-menu admin-business-header__dropdown-menu" style={{ marginTop: 16, width: 273 }}>
              <div className="admin-business-header__shape-triangle"></div>
              <div className="custom-dropdown-menu__options">
                <Link href={"/business/hotel/account"} className="admin-business-header__list-menu">
                  <div className="admin-business-header__list-menu-wrapper">
                    <SVGIcon src={Icons.Setting} width={20} height={20} className="admin-header__user-arrow" color='#616161' />
                    <p className='admin-business-header__list-menu-caption'>Account setting</p>
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
                <a type="button" onClick={() => signOut({ redirect: true, callbackUrl: '/business/hotel/login' })} className="admin-business-header__list-menu">
                  <div className="admin-business-header__list-menu-wrapper">
                    <SVGIcon src={Icons.Logout} width={20} height={20} className="admin-header__user-arrow" color='#616161' />
                    <p className='admin-business-header__list-menu-caption'>Logout</p>
                  </div>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-header__user-arrow" color='#D9E0E4' />
                </a>
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

  return (
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
          <Link href={'/business/hotel/rates-availability'} className={`admin-sidebar-menu ${pathname === '/business/hotel/rates-availability' ? 'active' : ''}`}>
            <SVGIcon src={Icons.Calendar} width={20} height={20} />
            <span>Rates & Availability</span>
          </Link>
          <Link href={'/business/hotel/reservation'} className={`admin-sidebar-menu ${pathname === '/business/hotel/reservation' ? 'active' : ''}`}>
            <SVGIcon src={Icons.Reservation} width={20} height={20} />
            <span>Reservation</span>
          </Link>
          <Link href={'/business/hotel/room'} className={`admin-sidebar-menu ${pathname === '/business/hotel/room' ? 'active' : ''}`}>
            <SVGIcon src={Icons.Property} width={20} height={20} />
            <span>Room</span>
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
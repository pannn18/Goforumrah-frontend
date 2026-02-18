import React from 'react'
import Link from 'next/link'
import SVGIcon from '@/components/elements/icons'
import { Icons } from '@/types/enums'
import Image from 'next/image'
import logoText from '@/assets/images/logo_text_dark.svg';
import { useRouter } from 'next/router'

const Sidebar = () => {
  const { pathname } = useRouter()

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar__header">
        <Image src={logoText} alt="GoForUmrah" width={146} height={26} />
      </div>
      <div className="admin-sidebar-menu-wrapper">
        <Link href={'/admin'} className={`admin-sidebar-menu ${pathname === '/admin' ? 'active' : ''}`}>
          <SVGIcon src={Icons.SquaresFor} width={20} height={20} />
          <span>Dashboard</span>
        </Link>
        <div>
          <a className={`admin-sidebar-menu ${pathname.startsWith('/admin/booking/') ? 'active' : 'collapsed'}`} data-bs-toggle="collapse" href="#sidebar-booking-menu" role="button" aria-expanded={!!pathname.startsWith('/admin/booking/')} aria-controls="sidebar-booking-menu">
            <SVGIcon src={Icons.Book} width={20} height={20} />
            <span>Booking</span>
            <SVGIcon src={Icons.ArrowDown} width={20} height={20} className="admin-sidebar-menu__arrow" />
          </a>
          <div id="sidebar-booking-menu" className={`admin-sidebar-menu-children collapse ${pathname.startsWith('/admin/booking/') ? 'show' : ''}`}>
            <Link href={'/admin/booking/hotel'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/booking/hotel') ? 'active' : ''}`}>
              <SVGIcon src={Icons.DownRight} width={20} height={20} />
              <span>Hotel</span>
            </Link>
            <Link href={'/admin/booking/flight'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/booking/flight') ? 'active' : ''}`}>
              <SVGIcon src={Icons.DownRight} width={20} height={20} />
              <span>Flight</span>
            </Link>
            <Link href={'/admin/booking/car'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/booking/car') ? 'active' : ''}`}>
              <SVGIcon src={Icons.DownRight} width={20} height={20} />
              <span>Car</span>
            </Link>
            <Link href={'/admin/booking/tour-booking'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/booking/tour-booking') ? 'active' : ''}`}>
              <SVGIcon src={Icons.DownRight} width={20} height={20} />
              <span>Tour Package</span>
            </Link>
          </div>
        </div>
        <div>
          <a className={`admin-sidebar-menu ${pathname.startsWith('/admin/partner/') ? 'active' : 'collapsed'}`} data-bs-toggle="collapse" href="#sidebar-partner-menu" role="button" aria-expanded={!!pathname.startsWith('/admin/partner/')} aria-controls="sidebar-partner-menu">
            <SVGIcon src={Icons.Suitcase} width={20} height={20} />
            <span>Partner</span>
            <SVGIcon src={Icons.ArrowDown} width={20} height={20} className="admin-sidebar-menu__arrow" />
          </a>
          <div id="sidebar-partner-menu" className={`admin-sidebar-menu-children collapse ${pathname.startsWith('/admin/partner/') ? 'show' : ''}`}>
            <Link href={'/admin/partner/hotel'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/partner/hotel') ? 'active' : ''}`}>
              <SVGIcon src={Icons.DownRight} width={20} height={20} />
              <span>Hotel</span>
            </Link>
            <Link href={'/admin/partner/flight'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/partner/flight') ? 'active' : ''}`}>
              <SVGIcon src={Icons.DownRight} width={20} height={20} />
              <span>Flight</span>
            </Link>
            <Link href={'/admin/partner/car'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/partner/car') ? 'active' : ''}`}>
              <SVGIcon src={Icons.DownRight} width={20} height={20} />
              <span>Car</span>
            </Link>
          </div>
        </div>
        <Link href={'/admin/tour'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/tour') ? 'active' : ''}`}>
          <SVGIcon src={Icons.SunHorizon} width={20} height={20} />
          <span>Tour Package</span>
        </Link>
        <Link href={'/admin/featured'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/featured') ? 'active' : ''}`}>
          <SVGIcon src={Icons.Hotel} width={20} height={20} />
          <span>Featured City</span>
        </Link>
        <Link href={'/admin/customer'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/customer') ? 'active' : ''}`}>
          <SVGIcon src={Icons.User} width={20} height={20} />
          <span>Customer</span>
        </Link>
        <Link href={'/admin/agent'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/agent') ? 'active' : ''}`}>
          <SVGIcon src={Icons.User} width={20} height={20} />
          <span>Agent</span>
        </Link>
        <Link href={'/admin/emails'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/emails') ? 'active' : ''}`}>
          <SVGIcon src={Icons.Mail} width={20} height={20} />
          <span>Emails</span>
        </Link>
        <Link href={'/admin/blog'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/blog') ? 'active' : ''}`}>
          <SVGIcon src={Icons.Articles} width={20} height={20} />
          <span>Blog</span>
        </Link>
        <Link href={'/admin/setting'} className={`admin-sidebar-menu ${pathname.startsWith('/admin/setting') ? 'active' : ''}`}>
          <SVGIcon src={Icons.Setting} width={20} height={20} />
          <span>Setting</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
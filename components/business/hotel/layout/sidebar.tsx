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
        <Link href={'/business/hotel'} className={`admin-sidebar-menu ${pathname === '/business/hotel' ? 'active' : ''}`}>
          <SVGIcon src={Icons.SquaresFor} width={20} height={20} />
          <span>Dashboard</span>
        </Link>
        <div>
          <Link href={'/business/hotel/rates-availability'} className={`admin-sidebar-menu ${pathname.startsWith('/business/hotel/rates-availability') ? 'active' : ''}`}>
            <SVGIcon src={Icons.Calendar} width={20} height={20} />
            <span>Rate & Availability</span>
          </Link>
        </div>
        <div>
          <Link href={'/business/hotel/reservation'} className={`admin-sidebar-menu ${pathname.startsWith('/business/hotel/reservation') ? 'active' : ''}`}>
            <SVGIcon className="admin-sidebar-menu-svg" src={Icons.Reservation} width={20} height={20} />
            <span>Reservation</span>
          </Link>
        </div>
        <div>
          <Link href={'/business/hotel/room'} className={`admin-sidebar-menu ${pathname.startsWith('/business/hotel/room') ? 'active' : ''}`}>
            <SVGIcon className="admin-sidebar-menu-svg" src={Icons.Property} width={20} height={20} />
            <span>Room</span>
          </Link>
        </div>
        <div>
          <Link href={'/business/hotel/guest-review'} className={`admin-sidebar-menu ${pathname.startsWith('/business/hotel/guest-review') ? 'active' : ''}`}>
            <SVGIcon className="admin-sidebar-menu-svg" src={Icons.StarOutline} width={20} height={20} />
            <span>Guest Review</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Sidebar


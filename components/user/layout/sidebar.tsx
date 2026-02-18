import SVGIcon from '@/components/elements/icons'
import useFetch from '@/hooks/useFetch'
import { Icons } from '@/types/enums'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

interface IProps {
  activeMenu?: string
  data: Session
}

const Sidebar = ({ activeMenu, data }: IProps) => {
  const { data: profile } = useFetch('/customer/personal/show', 'POST', { id_customer: data?.user.id }, true)

  return (
    <div className="user-layout-sidebar">
      <div className="profile-card">
        <div className="profile-card__icon-wrapper">
          {profile?.profile_photo ? (
            <img className="profile-card__icon" src={profile?.profile_photo} width={20} height={20} />
          ) : (
            <SVGIcon src={Icons.User} width={20} height={20} />
          )}
        </div>
        <div className="profile-card__name">{profile?.fullname || ''}</div>
        <div className="profile-card__email">{profile?.email || data?.user.email || ''}</div>
      </div>

      <div className="menu">
        <Link href={'/user'} className={`menu__link ${activeMenu === 'booking' ? 'active' : ''}`}>
          <SVGIcon className="menu__link-icon" src={Icons.Box} width={20} height={20} />
          <span>My booking</span>
          <SVGIcon className="menu__link-arrow-icon" src={Icons.ArrowRight} width={16} height={16} />
        </Link>
        <Link href={'/user/review'} className={`menu__link ${activeMenu === 'review' ? 'active' : ''}`}>
          <SVGIcon className="menu__link-icon" src={Icons.StarOutline} width={20} height={20} />
          <span>My review</span>
          <SVGIcon className="menu__link-arrow-icon" src={Icons.ArrowRight} width={16} height={16} />
        </Link>
        <Link href={'/user/account'} className={`menu__link ${activeMenu === 'account' ? 'active' : ''}`}>
          <SVGIcon className="menu__link-icon" src={Icons.Setting} width={20} height={20} />
          <span>Account Setting</span>
          <SVGIcon className="menu__link-arrow-icon" src={Icons.ArrowRight} width={16} height={16} />
        </Link>
        <Link href={'/user/help'} className={`menu__link ${activeMenu === 'help' ? 'active' : ''}`}>
          <SVGIcon className="menu__link-icon" src={Icons.Help} width={20} height={20} />
          <span>Help Center</span>
          <SVGIcon className="menu__link-arrow-icon" src={Icons.ArrowRight} width={16} height={16} />
        </Link>
        <div onClick={() => signOut({ redirect: true, callbackUrl: '/' })} className="menu__link" style={{ cursor: 'pointer' }}>
          <SVGIcon className="menu__link-icon" src={Icons.Logout} width={20} height={20} />
          <span>Logout</span>
          <SVGIcon className="menu__link-arrow-icon" src={Icons.ArrowRight} width={16} height={16} />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
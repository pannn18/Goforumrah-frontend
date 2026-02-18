import SVGIcon from '@/components/elements/icons'
import { Icons } from '@/types/enums'
import Link from 'next/link'
import React from 'react'

interface IProps {
  activeMenu: 'personal' | 'payment' | 'security' | 'notification'
}

const Sidebar = ({ activeMenu }: IProps) => {
  return (
    <div className="manage__menu">
      <div className="manage__menu-list">
        <Link href="/user/account/personal" className={`manage__menu-item ${activeMenu === 'personal' ? 'active' : ''}`}>
          <SVGIcon className="manage__menu-item--icon" src={Icons.User} width={20} height={20} />
          <p style={{ flex: 1 }}>Personal details</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="/user/account/payment" className={`manage__menu-item ${activeMenu === 'payment' ? 'active' : ''}`}>
          <SVGIcon className="manage__menu-item--icon" src={Icons.Box} width={20} height={20} />
          <p style={{ flex: 1 }}>Payment details</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="/user/account/security" className={`manage__menu-item ${activeMenu === 'security' ? 'active' : ''}`}>
          <SVGIcon className="manage__menu-item--icon" src={Icons.StarOutline} width={20} height={20} />
          <p style={{ flex: 1 }}>Security settings</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
        <Link href="/user/account/notification" className={`manage__menu-item ${activeMenu === 'notification' ? 'active' : ''}`}>
          <SVGIcon className="manage__menu-item--icon" src={Icons.Setting} width={20} height={20} />
          <p style={{ flex: 1 }}>Email notification</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="manage__menu-item--arrow" />
        </Link>
      </div>
    </div>
  )
}

export default Sidebar
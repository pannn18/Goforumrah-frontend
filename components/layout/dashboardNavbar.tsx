import { BlurPlaceholderImage } from '@/components/elements/images'
import React from 'react'
import defaultProfileImage from '@/assets/images/default_profile_64x64.png'
import logoText from '@/assets/images/logo_text_dark.svg';
import SVGIcon from '@/components/elements/icons'
import { Icons } from '@/types/enums'
import Image from 'next/image';
import Link from 'next/link';

const DashboadNavbar = () => {
  return (
    <div className="dashboard-navbar">
      <div className="container dashboard-navbar__wrapper">
          <Link href="#"><Image src={logoText} alt="GoForUmrah" width={146} height={26} /></Link>
          <div className="dashboard-navbar__right-content">
            <div className="dashboard-navbar__search">
              <input type="text" className="form-control" placeholder="Search" />
              <SVGIcon src={Icons.Search} width={20} height={20} />
            </div>
            <div className="dashboard-navbar__notification">
              <SVGIcon src={Icons.Bell} width={24} height={24} className="dashboard-navbar__notification-toggle dashboard-navbar__notification-toggle--has-dot" />
            </div>
            <div className="dashboard-navbar__user">
              <div className="dashboard-navbar__user-toggle">
                <BlurPlaceholderImage src={defaultProfileImage} alt="Administrator" width={64} height={64} className="dashboard-navbar__user-image" />
                <div>
                  <div className="dashboard-navbar__user-name">John Doe</div>
                  <div className="dashboard-navbar__user-title">Administrator</div>
                </div>
                <SVGIcon src={Icons.ArrowDown} width={20} height={20} className="dashboard-navbar__user-arrow" />
              </div>
            </div>
          </div>
      </div>
    </div>
  )
}

export default DashboadNavbar
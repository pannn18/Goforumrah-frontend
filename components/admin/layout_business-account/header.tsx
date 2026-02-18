import { BlurPlaceholderImage } from '@/components/elements/images'
import React from 'react'
import defaultProfileImage from '@/assets/images/default_profile_64x64.png'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import Link from 'next/link'

const HeaderMenu = () => {
  return (
    <div className="admin-partner__detail-header">
      <div className="container">
        <div className="admin-partner__detail-header-row">
          <Link href="/business/hotel/dashboard" className="admin-partner__detail-header-back">
            <SVGIcon src={Icons.ArrowLeft} className="admin-partner__detail-header-back--icon" width={20} height={20} />
            <h4 className="">Back to Home</h4>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeaderMenu
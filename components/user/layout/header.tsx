import React from 'react'
import SVGIcon from '@/components/elements/icons'
import { Icons } from '@/types/enums'
import { useRouter } from 'next/router'

interface IProps {
  title?: string
  url?: string
}

const Header = ({ title, url }: IProps) => {
  const router = useRouter()

  return (
    <div className="user-layout-header">
      <div className="container">
        <div className="user-layout-header__content" onClick={() => url ? router.push(url) : router.back()} style={{ cursor: 'pointer' }}>
          <div onClick={() => url ? router.push(url) : router.back()} style={{ cursor: 'pointer' }} >
            <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
          </div>
          <h4>{title || 'Back'}</h4>
        </div>
      </div>
    </div>
  )
}

export default Header
import React from 'react'
import Link from 'next/link'
import SVGIcon from '@/components/elements/icons'

interface IProps {
  title: string
  description: string
  icon: string
  linkText: string
  linkURL: string
}

const BannerInfo = (props: IProps) => {
  const { title, description, icon, linkText, linkURL } = props

  return (
    <div className="homepage__banner" >
      <div className="col-auto">
        <div className="icon">
          <SVGIcon src={icon} width={24} height={24} />
        </div>
      </div>
      <div className="col">
        <div className="details">
          <div className="fs-xl fw-bold text-neutral-primary">{title}</div>
          <div className="fs-lg">{description}</div>
        </div>
      </div>
      <div className="col-auto">
        <Link href={linkURL} className="link-green-01 fs-lg">{linkText}</Link>
      </div>
    </div>
  )
}

export default BannerInfo
import React from "react"
import Link from "next/link"
import { StaticImageData } from "next/image"
import { Icons } from "@/types/enums"
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from "@/components/elements/icons"

interface HotelCardProps {
  image: StaticImageData | string
  title: string
  location: string
  price: {
    amount: string
    description: string
  }
  linkURL: string
}

const HotelCard = (props: HotelCardProps) => {
  const { image, title, location, price, linkURL } = props

  return (
    <div className="hotel-card">
      <div className="hotel-card__image">
        <BlurPlaceholderImage src={image} alt={title} width={512} height={512} />
      </div>
      <div className="hotel-card__details">
        <div>
          <Link href={linkURL} className="stretched-link">
            <h5 className="hotel-card__title">{title}</h5>
          </Link>
          <div className="hotel-card__location fs-lg">
            <SVGIcon className="hotel-card__location-icon" src={Icons.MapPin} width={24} height={24} />
            <div className="hotel-card__location-name">{location}</div>
          </div>
        </div>
        <div className="hotel-card__price">
          <div className="fs-xl fw-bold">{price.amount}</div>
          <div>/ {price.description}</div>
        </div>
      </div>
    </div>
  )
}

export default HotelCard
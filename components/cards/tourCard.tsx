import React from "react"
import Link from "next/link"
import { StaticImageData } from "next/image"
import { Icons } from "@/types/enums"
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from "@/components/elements/icons"

interface TourCardProps {
  image: StaticImageData | string
  title: string
  location: string
  duration: string
  price: string
  linkURL: string
}

const TourCard = (props: TourCardProps) => {
  const { image, title, location, duration, price, linkURL } = props

  return (
    <div className="tour-card">
      <div className="tour-card__image">
        <BlurPlaceholderImage src={image} alt={title} width={512} height={512} />
      </div>
      <div className="tour-card__details">
        <div>
          <div className="tour-card__location fs-lg">
            <SVGIcon className="tour-card__location-icon" src={Icons.MapPin} width={24} height={24} />
            <div className="tour-card__location-name">{location}</div>
          </div>
          <Link href={linkURL} className="stretched-link">
            <h5 className="tour-card__title">{title}</h5>
          </Link>
        </div>
        <div className="tour-card__bottom-content">
          <div className="tour-card__duration">
            <SVGIcon src={Icons.CircleTime} width={20} height={20} />
            <div>{duration}</div>
          </div>
          <div className="tour-card__price">
            <div>Start from </div>
            <div className="fs-xl fw-bold">{price}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourCard
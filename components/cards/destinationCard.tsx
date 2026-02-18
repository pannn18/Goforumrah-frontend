import React from "react"
import Link from "next/link"
import { StaticImageData } from "next/image"
import { BlurPlaceholderImage } from "@/components/elements/images"

interface DestinationCardProps {
  image: StaticImageData | string
  title: string
  price: {
    amount: string
    description: string
  }
  linkURL: string
}

const DestinationCard = (props: DestinationCardProps) => {
  const { image, title, price, linkURL } = props

  return (
    <div className="destination-card">
      <div className="destination-card__image">
        <BlurPlaceholderImage src={image} alt={title} width={512} height={512} />
      </div>
      <div className="destination-card__details">
        <Link href={linkURL} className="stretched-link">
          <h5 className="destination-card__title text-neutral-primary">{title}</h5>
        </Link>
        <div className="destination-card__price text-neutral-primary">
          <div>Start from </div>
          <div className="fs-xl fw-bold">{price.amount}</div>
          <div>/ {price.description}</div>
        </div>
      </div>
    </div>
  )
}

export default DestinationCard
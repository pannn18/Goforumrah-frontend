import { StaticImageData } from "next/image"
import Link from "next/link"
import { Icons } from '@/types/enums'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import { useEffect, useState } from "react"
import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

interface HotelCardProps {
  image: string,
  name: string,
  linkURL: string,
  location: string,
  price: {
    amount: string
    description: string
  },
  star?: number
  starDescription?: string
}

const HotelCard = ({ image, name, linkURL, location, price, star, starDescription }: HotelCardProps) => {

  const { changePrice, currencySymbol } = UseCurrencyConverter();
  
  return (
    <div className="search-hotel__hotel">
      <div className="search-hotel__hotel-image">
        <img className="search-hotel__hotel-image-src" src={image} alt={name} width={264} height={264} />
        <div className="search-hotel__hotel-image-favorite">
          <SVGIcon src={Icons.Heart} width={24} height={24} />
        </div>
      </div>
      <div className="search-hotel__hotel-content">
        <div className="search-hotel__hotel-content__header">
          <Link href={linkURL} className="">
            <h5 className="search-hotel__hotel-content__header--name">{name}</h5>
          </Link>
          <div className="search-hotel__hotel-content__header-row">
            <SVGIcon src={Icons.MapPin} width={24} height={24} className="search-hotel__hotel-content__header--pin" />
            <div className="search-hotel__hotel-content__header--location">{location}</div>
          </div>
          <div className="search-hotel__hotel-content__header-row">
            {star && Array.from(Array(Math.round(star)).keys()).map((index) => (
              <SVGIcon key={index} src={Icons.Star} width={24} height={24} color="#EECA32" />
            ))}
          </div>
          <div className="search-hotel__hotel-content__header-row">
            <div className="search-hotel__hotel-content__header-chips">{star || '5'}</div>
            <div className="search-hotel__hotel-content__header--overall">{starDescription || ''}</div>
          </div>
        </div>
        <div className="search-hotel__hotel-content__facilities">
          <div className="search-hotel__hotel-content__facilities-item">
            <SVGIcon src={Icons.FacilitiesMoney} width={20} height={20} />
            <div>Pay at Hotel</div>
          </div>
          <div className="search-hotel__hotel-content__facilities-item">
            <SVGIcon src={Icons.FacilitiesRestauran} width={20} height={20} />
            <div>Free Breakfast</div>
          </div>
          <div className="search-hotel__hotel-content__facilities-item">
            <SVGIcon src={Icons.FacilitiesWifi} width={20} height={20} />
            <div>Free Wifi</div>
          </div>
          <div className="search-hotel__hotel-content__facilities-item">3+</div>
        </div>
        <div className="search-hotel__hotel-content__price">
          <h6 className="fw-bold">{currencySymbol} {changePrice(price.amount)}</h6>
          <div className="search-hotel__hotel-content__price-duration">/ {price.description}</div>
        </div>
      </div>
    </div>
  )
}

export default HotelCard
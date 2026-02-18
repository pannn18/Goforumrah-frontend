import Link from 'next/link'
import { StaticImageData } from "next/image"
import { Icons } from '@/types/enums'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'

interface carTransferCardProps {
  image: string
  name: string
  location: string
  price: string
  linkURL: string
  seats?: number
  transmission?: string
  fuelType?: string
}

const carTransferCard = (props: carTransferCardProps) => {
  const { image, name, location, price, linkURL, seats, transmission, fuelType } = props
  return (
    <div className="search-transfer__car">
      <img className="search-transfer__car-image" src={image} alt={name} width={192} height={152} />
      <div className="search-transfer__car-wrapper">
        <div className="search-transfer__car-content">
          <h5>{name}</h5>
          <div className="search-transfer__car-location">
            <SVGIcon src={Icons.MapPin} width={24} height={24} className="search-transfer__car-location-pin" />
            <p className="search-transfer__car-location-name">{location}</p>
          </div>
          <div className="search-transfer__car-features">
            <div className="search-transfer__car-features-item">
              <SVGIcon src={Icons.User} width={20} height={20} />
              <div>{seats || 2} seats</div>
            </div>
            <div className="search-transfer__car-features-item--dots"></div>
            <div className="search-transfer__car-features-item">
              <SVGIcon src={Icons.Setting} width={20} height={20} />
              <div>{transmission || '-'}</div>
            </div>
            <div className="search-transfer__car-features-item--dots"></div>
            <div className="search-transfer__car-features-item">
              <SVGIcon src={Icons.GasPump} width={20} height={20} />
              <div>{fuelType || '-'}</div>
            </div>
            <div className="search-transfer__car-features-item--dots"></div>
            <div className="search-transfer__car-features-item">3+</div>
          </div>
        </div>
        <div className="search-transfer__car-footer">
          <div className="search-transfer__car-price">
            <h6>{price}</h6>
            <p className="search-transfer__car-price-range">/ day</p>
          </div>
          <Link href={linkURL} className="btn btn-sm btn-success">Select</Link>
        </div>
      </div>
    </div>
  )
}

export default carTransferCard
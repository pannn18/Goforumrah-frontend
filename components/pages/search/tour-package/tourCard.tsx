import { StaticImageData } from "next/image"
import Link from "next/link"
import { Icons } from '@/types/enums'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'
import Currency from "currencies.json"
import { UseCurrencyConverter } from "@/components/convertCurrency"

interface HotelCardProps {
  image: StaticImageData | string,
  name: string,
  linkURL: string,
  location: string,
  price: string,
  description: string
}

const TourCard = (props: HotelCardProps) => {
  const { image, name, linkURL, location, price, description } = props

  const { changePrice, currencySymbol } = UseCurrencyConverter();

  return (
    <div className="search-tour-package__hotel">
      <div className="search-tour-package__hotel-image">
        <BlurPlaceholderImage className="search-tour-package__hotel-image-src" src={image} alt={name} width={204} height={204} />
        <div className="search-tour-package__hotel-image-favorite">
          <SVGIcon src={Icons.Heart} width={24} height={24} />
        </div>
      </div>
      <div className="search-tour-package__hotel-content">
        <div className="search-tour-package__hotel-content__header">
          <div className="search-tour-package__hotel-content__header-row">
            <SVGIcon src={Icons.MapPin} width={20} height={20} className="search-tour-package__hotel-content__header--pin" />
            <div className="search-tour-package__hotel-content__header--location">{location}</div>
          </div>
          <Link href={linkURL} className="">
            <h5 className="search-tour-package__hotel-content__header--name">{name}</h5>
          </Link>
          <div className="search-tour-package__hotel-content__header-row">
            <div className="search-tour-package__hotel-content__header--desc">{description}</div>
          </div>
        </div>
        {/* <div className="search-tour-package__hotel-content__facilities">
          <div className="search-tour-package__hotel-content__facilities-item">
            <SVGIcon src={Icons.CircleTime} width={20} height={20} />
            <div className="search-tour-package__hotel-content__facilities-time">8 Days</div>
          </div>
        </div> */}
        <div className="search-tour-package__hotel-content__price">
          <div className="search-tour-package__hotel-content__facilities-pricing">
            <SVGIcon src={Icons.Money} width={20} height={20} />
            <div className="search-tour-package__hotel-content__facilities-pricing">Free cancellation available</div>
          </div>
          <div className="search-tour-package__hotel-content__facilities-duration">
            {/* <div className="search-tour-package__hotel-content__facilities-duration">{description}</div> */}
            <h6 className="fw-bold">{currencySymbol} {changePrice(price)}</h6>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourCard
import { StaticImageData } from "next/image"
import Link from "next/link"
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from "@/components/elements/images"
import SVGIcon from '@/components/elements/icons'


interface ManageCardProps {
  type: Services,
  image: StaticImageData | string,
  name: {
    from?: string,
    to?: string,
    name?: string,
  },
  tenant?: string,
  location?: string,
  desc: {
    date?: string,
    time?: string,
    people?: string,
    vehicle?: string,
    duration?: string,
  },
  status: string,
  linkURL: string,
  id_booking ?: number,
}

const ManageReview = (props: ManageCardProps) => {
  const { type, image, tenant, name, location, desc, id_booking } = props

  return (
    <div className="manage-review__card">
      <BlurPlaceholderImage className="manage-review__card-image" src={image} alt="Booking Image" width={220} height={220} />
      <div className="manage-review__card-content">
        <div className="manage-review__card-title">
          {type === Services.Flights && (
            <>
              <div className="manage-review__card-title-name">
                <h5>{name.from}</h5>
                <div className="manage-review__card-title-destination">
                  <SVGIcon src={Icons.AirplaneLine} width={69} height={8} />
                  <SVGIcon src={Icons.Airplane} width={16} height={16} />
                </div>
                <h5>{name.to}</h5>
              </div>
            </>
          )}
          {type === Services.Hotel && (
            <>
              <h5 className="manage-review__card-title-name">{name.name}</h5>
            </>
          )}
          {type === Services.BookTransfer && (
            <>
              <h5 className="manage-review__card-title-name">{name.name}</h5>
            </>
          )}

        </div>
        <div className="manage-review__card-desc">
          <div className="manage-review__card-desc-content">
          
            {type === Services.Flights && (
              <>
                <div className="manage-review__card-desc-tenant">
                  <BlurPlaceholderImage alt="Tenant Logo" className="manage-review__card-desc-tenant--icon" src={Images.Placeholder} width={24} height={24} />
                  <p>{tenant}</p>
                </div>
                <div className="manage-review__card-desc-detail">
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p>{desc.date}</p>
                  </div>
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                    <p>{desc.time}</p>
                  </div>
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.User} width={20} height={20} />
                    <p>{desc.people}</p>
                  </div>
                </div>
                
              </>
            )}
            {type === Services.Hotel && (
              <>
              <div className="manage-review__card-desc-description"> 
                <div className="manage-review__card-desc-location">
                  <SVGIcon className="manage-review__card-desc-location--icon" src={Icons.MapPinOutline} width={24} height={24} />
                  <p>{location}</p>
                </div>
                <div className="manage-review__card-desc-detail">
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p>{desc.date}</p>
                  </div>
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.User} width={20} height={20} />
                    <p>{desc.people}</p>
                  </div>
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.Sun} width={20} height={20} />
                    <p>{desc.duration}</p>
                  </div>
                  </div>
                </div>
                <div className="manage-review__buttons-wrapper">
                  <div className="manage-review__buttons">
                    <button type="button" className="manage-review__buttons btn btn-lg btn-outline-success" data-bs-toggle="modal" data-bs-target="#reviewModal2" data-id-booking={id_booking} > Write Review</button>            
                  </div>
                </div>
              </>
              
            )}
            {type === Services.BookTransfer && (
              <>
                <div className="manage-review__card-desc-tenant">
                  <BlurPlaceholderImage alt="Tenant Logo" className="manage-review__card-desc-tenant--icon" src={Images.Placeholder} width={24} height={24} />
                  <p>{tenant}</p>
                </div>
                <div className="manage-review__card-desc-detail">
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p>{desc.date}</p>
                  </div>
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.Car} width={20} height={20} />
                    <p>{desc.vehicle}</p>
                  </div>
                  <div className="manage-review__card-desc-item">
                    <SVGIcon src={Icons.Sun} width={20} height={20} />
                    <p>{desc.duration}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
export default ManageReview


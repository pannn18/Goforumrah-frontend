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
  tenantImage?: string,
  location?: string,
  desc: {
    date?: string,
    time?: string,
    people?: string,
    ticket?: string,
    vehicle?: string,
    duration?: string,
  },
  orderId: string,
  status: string,
  linkURL: string,
  id_booking?: number,
}

const ManageCard = (props: ManageCardProps) => {
  const { type, image, tenantImage, tenant, name, linkURL, location, desc, orderId, status, id_booking } = props
  console.log(props)
  return (
    <div className="manage__card">
      <img className="manage__card-image" src={image as string} alt="Booking Image" width={220} height={240} />
      <div className="manage__card-content">
        <div className="manage__card-header">
          <div className="manage__card-header-type">
            {type === Services.Flights && (
              <>
                <div className="manage__card-header-type--icon">
                  <SVGIcon src={Icons.AirplaneTakeOff} width={20} height={20} />
                </div>
                <p>Flight</p>
              </>
            )}
            {type === Services.Hotel && (
              <>
                <div className="manage__card-header-type--icon">
                  <SVGIcon src={Icons.Hotel} width={20} height={20} />
                </div>
                <p>Hotels</p>
              </>
            )}
            {type === Services.BookTransfer && (
              <>
                <div className="manage__card-header-type--icon">
                  <SVGIcon src={Icons.Car} width={20} height={20} />
                </div>
                <p>Book Transfer</p>
              </>
            )}
            {type === Services.TourPackage && (
              <>
                <div className="manage__card-header-type--icon">
                  <SVGIcon src={Icons.SunHorizon} width={20} height={20} />
                </div>
                <p>Tour Package</p>
              </>
            )}
          </div>
          <p className="manage__card-header-order">Order ID : {orderId}</p>
        </div>
        <div className="manage__card-separator"></div>
        <div className="manage__card-title">
          {type === Services.Flights && (
            <>
              <div className="manage__card-title-name">
                <h5>{name.from}</h5>
                <div className="manage__card-title-destination">
                  <SVGIcon src={Icons.AirplaneLine} width={69} height={8} />
                  <SVGIcon src={Icons.Airplane} width={16} height={16} />
                </div>
                <h5>{name.to}</h5>
              </div>
            </>
          )}
          {type === Services.Hotel && (
            <>
              <h5 className="manage__card-title-name">{name.name}</h5>
            </>
          )}
          {type === Services.BookTransfer && (
            <>
              <h5 className="manage__card-title-name">{name.name}</h5>
            </>
          )}
          {type === Services.TourPackage && (
            <>
              <h5 className="manage__card-title-name">{name.name}</h5>
            </>

          )}
          {status === 'check-in' || status === 'Check In' && (
            <div className="manage__card-status manage__card-status--checkin">Check-in</div>
          )}
          {status === 'check-out' || status === 'Check Out' && (
            <div className="manage__card-status manage__card-status--checkin">Check-out</div>
          )}
          {status === 'confirm' || status === 'Confirmed' && (
            <div className="manage__card-status manage__card-status--confirm">Confirmed</div>
          )}
          {status === 'completed'  || status === 'Completed' && (
            <div className="manage__card-status manage__card-status--checkin">Completed</div>
          )}
          {status === 'Cancelled' && (
            <div className="manage__card-status manage__card-status--cancelled">Cancelled</div>
          )}
          {status === 'Payment Needed' && (
            <div className="manage__card-status manage__card-status--confirm">Payment Needed</div>
          )}
          {!['Completed','check-in', 'Check In', 'check-out', 'Check Out', 'confirm', 'Confirmed', 'completed', 'Cancelled', 'Payment Needed'].includes(status) && (
            <div className="manage__card-status manage__card-status--warning">{status}</div>
          )}
        </div>
        <div className="manage__card-desc">
          <div className="manage__card-desc-content">
            {type === Services.Flights && (
              <>
                <div className="manage__card-desc-tenant">
                  <BlurPlaceholderImage alt="Tenant Logo" className="manage__card-desc-tenant--icon" src={image || Images.Placeholder} width={24} height={24} />
                  <p>{tenant}</p>
                </div>
                <div className="manage__card-desc-detail">
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p>{desc.date}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                    <p>{desc.time}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.User} width={20} height={20} />
                    <p>{desc.people}</p>
                  </div>
                </div>
              </>
            )}
            {type === Services.Hotel && (
              <>
                <div className="manage__card-desc-location">
                  <SVGIcon className="manage__card-desc-location--icon" src={Icons.MapPinOutline} width={24} height={24} />
                  <p>{location}</p>
                </div>
                <div className="manage__card-desc-detail">
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p>{desc.date}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.User} width={20} height={20} />
                    <p>{desc.people}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Sun} width={20} height={20} />
                    <p>{desc.duration}</p>
                  </div>
                </div>
              </>
            )}
            {type === Services.BookTransfer && (
              <>
                <div className="manage__card-desc-tenant">
                  <img alt="Tenant Logo" className="manage__card-desc-tenant--icon" src={tenantImage || Images.Placeholder} width={24} height={24} />
                  <p>{tenant}</p>
                </div>
                <div className="manage__card-desc-detail">
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p>{desc.date}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Car} width={20} height={20} />
                    <p>{desc.vehicle}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Sun} width={20} height={20} />
                    <p>{desc.duration}</p>
                  </div>
                </div>
              </>
            )}
            {type === Services.TourPackage && (
              <>
                <div className="manage__card-desc-location">
                <SVGIcon className="manage__card-desc-location--icon" src={Icons.MapPinOutline} width={24} height={24} />
                  <p>{location}</p>
                </div>
                <div className="manage__card-desc-detail">
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} />
                    <p>{desc.date}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.User} width={20} height={20} />
                    <p>{desc.ticket}</p>
                  </div>
                  <div className="manage__card-desc-item">
                    <SVGIcon src={Icons.Sun} width={20} height={20} />
                    <p>{desc.duration}</p>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* //TODO: Please change the url with linkURL prop */}
          <Link className="manage__card-desc-link" href={`/user/booking/${type}/${id_booking}`}>See details</Link>
        </div>
      </div>
    </div>
  )
}
export default ManageCard
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"


export default function PartnerCarDetail() {
  return (
    <Layout>
      <AdminLayout pageTitle="Edit Details Car" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <PartnerCarEdit />
          </div>
        </div>
      </AdminLayout>
    </Layout>
  )
}

const PartnerCarEdit = () => {
  const router = useRouter()
  const { id: id_car_business } = router.query;
  useEffect(() => {
  }, [id_car_business])

  return (
    <div className="admin-partner__edit">
      <div className="admin-partner__edit-detail__content">
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Info} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Fleet</h5>
            <p className="admin-partner__edit-detail__item-content__desc">General details about your property like facilities available, internet, parking</p>
          </div>
          <Link href={`/admin/partner/car/fleet?id=${id_car_business}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.SquaresFor} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Allocation</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Edit property's name, contact details, and address.</p>
          </div>
          <Link href={`/admin/partner/car/allocation?id=${id_car_business}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.WifiHigh} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Location</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Choose you room type to fill the details</p>
          </div>
          <Link href={`/admin/partner/car/location?id=${id_car_business}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Bed} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Facilities</h5>
            <p className="admin-partner__edit-detail__item-content__desc">General details about your property like facilities available, internet, parking</p>
          </div>
          <Link href={`/admin/partner/car/facilities?id=${id_car_business}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Image} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Photos</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Great photos invite guests to get the full experience of your property</p>
          </div>
          <Link href={`/admin/partner/car/photos?id=${id_car_business}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
      </div>
    </div>
  )
}


const PartnerCarEditModal = () => {

}

const PartnerCarDeleteModal = () => {

}
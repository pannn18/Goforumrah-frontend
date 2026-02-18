import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"


export default function EditTour() {
  return (
    <Layout>
      <AdminLayout pageTitle="Edit Detail Tour" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <PartnerTourEdit />
          </div>
        </div>
      </AdminLayout>
    </Layout>
  )
}

const PartnerTourEdit = () => {
  const router = useRouter()
  const { id: id_tour_package } = router.query;
  useEffect(() => {
  }, [id_tour_package])

  return (
    <div className="admin-partner__edit">
      <div className="admin-partner__edit-detail__content">
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Info} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Package Information</h5>
            <p className="admin-partner__edit-detail__item-content__desc">General details about package information</p>
          </div>
          <Link href={`/admin/tour/information?id=${id_tour_package}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.WifiHigh} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Plan & Location</h5>
            <p className="admin-partner__edit-detail__item-content__desc">General detail of plan and location</p>
          </div>
          <Link href={`/admin/tour/plan?id=${id_tour_package}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Bed} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Facilities</h5>
            <p className="admin-partner__edit-detail__item-content__desc">General details about your package like facilities available</p>
          </div>
          <Link href={`/admin/tour/facilities?id=${id_tour_package}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Image} className="admin-partner__detail-header-back--icon" width={20} height={20} />
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Photos</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Great photos invite guests to get the full experience of your package</p>
          </div>
          <Link href={`/admin/tour/photos?id=${id_tour_package}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
      </div>
    </div>
  )
}


const PartnerCarEditModal = () => {

}

const PartnerCarDeleteModal = () => {

}
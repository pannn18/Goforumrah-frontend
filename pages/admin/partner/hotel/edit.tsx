import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { callAPI } from '@/lib/axiosHelper'
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"


export default function PartnerHotelDetail()  {    
  return (
    <Layout>
      <AdminLayout pageTitle="Edit Details Hotel" enableBack={true}>
        <div className="admin-partner__detail">      
          <div className="container">    
            <PartnerHotelEdit />
          </div>
        </div>      
      </AdminLayout>
    </Layout>
  )
}

const PartnerHotelDetailHeader = () => {
  return (
    <div className="admin-partner__detail-header">
      <div className="container">
        <div className="admin-partner__detail-header-row">
          <Link href="/admin/partner/hotel" className="admin-partner__detail-header-back">
            <SVGIcon src={Icons.ArrowLeft} className="admin-partner__detail-header-back--icon" width={20} height={20}/>
            <h4 className="">Hotel Details</h4>
          </Link>          
          <div className="admin-partner__detail-header-buttons">            
            <button type="button" className="btn btn-sm btn-success">Save</button>
          </div>          
        </div>
      </div>
    </div>
  )
}

const PartnerHotelEdit = () => {
  const router = useRouter()
  const { id_hotel } = router.query;
  return (
    <div className="admin-partner__edit">      
      <div className="admin-partner__edit-detail__content">
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Info} className="admin-partner__detail-header-back--icon" width={20} height={20}/>
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Basic Info</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Edit property's name, contact details, and address.</p>
          </div>
          <Link href={`/admin/partner/hotel/basic?id_hotel=${id_hotel}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.SquaresFor} className="admin-partner__detail-header-back--icon" width={20} height={20}/>
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Room Type</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Choose you room type to fill the details</p>
          </div>
          <Link href={`/admin/partner/hotel/room-type?id_hotel=${id_hotel}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.WifiHigh} className="admin-partner__detail-header-back--icon" width={20} height={20}/>
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Facilities</h5>
            <p className="admin-partner__edit-detail__item-content__desc">General details about your property like facilities available, internet, parking</p>
          </div>
          <Link href={`/admin/partner/hotel/facilities?id_hotel=${id_hotel}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Bed} className="admin-partner__detail-header-back--icon" width={20} height={20}/>
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Amenities</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Details about specific features and services available.</p>
          </div>
          <Link href={`/admin/partner/hotel/amenities?id_hotel=${id_hotel}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Image} className="admin-partner__detail-header-back--icon" width={20} height={20}/>
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Photos</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Great photos invite guests to get the full experience of your property</p>
          </div>
          <Link href={`/admin/partner/hotel/photos?id_hotel=${id_hotel}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>
        <div className="admin-partner__edit-detail__item">
          <div className="admin-partner__edit-detail__item-icon">
            <SVGIcon src={Icons.Scale} className="admin-partner__detail-header-back--icon" width={20} height={20}/>
          </div>
          <div className="admin-partner__edit-detail__item-content">
            <h5 className="admin-partner__edit-detail__item-content__title">Policies</h5>
            <p className="admin-partner__edit-detail__item-content__desc">Specify some basic policies. </p>
          </div>
          <Link href={`/admin/partner/hotel/policies?id_hotel=${id_hotel}`} className="btn btn-sm btn-outline-success admin-partner__edit-detail__item-button">Edit</Link>
        </div>        
      </div>      
    </div>
  )
}
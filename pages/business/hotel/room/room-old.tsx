import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"

export default function Property() {
  return (
    <Layout>
      <InnerLayout>

        <div className="container container-property">

          <div className="admin-latest-business__top-header">
            <div className="admin-latest-business__top-header-wrapper">
              <h4 className="admin-latest-business__top-header-title">Room</h4>
            </div>
            <button type="button" className="admin-latest-business__top-header-btn btn btn-md btn-outline-success">
              <SVGIcon src={Icons.Plus} width={20} height={20} />
              Add new room
            </button>
          </div>
          <div className="admin-property-business__wrapper">
            <div className="admin-property-business__card">
              <div className="admin-property-business__card-header">
                <h5>Standart Room</h5>
                <button type="button" className="btn btn-outline-success">Edit</button>
              </div>
              <div className="admin-property-business__card-item">
                <BlurPlaceholderImage alt="Hotel Image" src={Images.Placeholder} width={64} height={64} className="admin-property-business__card-item__image" />
                <div className="admin-property-business__card-item__content">
                  <p className="admin-property-business__card-item__content-name">Double or Twin Room</p>
                  <p className="admin-property-business__card-item__content-status">2 Ongoing Reservation</p>
                </div>
                <div className="admin-property-business__card-item__action">
                  <Link href={"#"}>Edit Room</Link>
                  <button className="btn btn-sm btn-outline-success">See Details</button>
                </div>
              </div>
              <div className="admin-property-business__card-item">
                <BlurPlaceholderImage alt="Hotel Image" src={Images.Placeholder} width={64} height={64} className="admin-property-business__card-item__image" />
                <div className="admin-property-business__card-item__content">
                  <p className="admin-property-business__card-item__content-name">Double or Twin Room</p>
                  <p className="admin-property-business__card-item__content-status">2 Ongoing Reservation</p>
                </div>
                <div className="admin-property-business__card-item__action">
                  <Link href={"#"}>Edit Room</Link>
                  <button className="btn btn-sm btn-outline-success">See Details</button>
                </div>
              </div>
            </div>
            <div className="admin-property-business__card">
              <div className="admin-property-business__card-header">
                <h5>Standart Room</h5>
                <button type="button" className="btn btn-outline-success">Edit</button>
              </div>
              <div className="admin-property-business__card-item">
                <BlurPlaceholderImage alt="Hotel Image" src={Images.Placeholder} width={64} height={64} className="admin-property-business__card-item__image" />
                <div className="admin-property-business__card-item__content">
                  <p className="admin-property-business__card-item__content-name">Double or Twin Room</p>
                  <p className="admin-property-business__card-item__content-status">2 Ongoing Reservation</p>
                </div>
                <div className="admin-property-business__card-item__action">
                  <Link href={"#"}>Edit Room</Link>
                  <button className="btn btn-sm btn-outline-success">See Details</button>
                </div>
              </div>
              <div className="admin-property-business__card-item">
                <BlurPlaceholderImage alt="Hotel Image" src={Images.Placeholder} width={64} height={64} className="admin-property-business__card-item__image" />
                <div className="admin-property-business__card-item__content">
                  <p className="admin-property-business__card-item__content-name">Double or Twin Room</p>
                  <p className="admin-property-business__card-item__content-status">2 Ongoing Reservation</p>
                </div>
                <div className="admin-property-business__card-item__action">
                  <Link href={"#"}>Edit Room</Link>
                  <button className="btn btn-sm btn-outline-success">See Details</button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </InnerLayout>
    </Layout>
  )
}

{/*
import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"

export default function Property() {
  return (
    <Layout>
      <InnerLayout>

        <div className="container container-property">

          <div className="admin-latest-business__top-header">
            <div className="admin-latest-business__top-header-wrapper">
              <h4 className="admin-latest-business__top-header-title">Property</h4>
            </div>
            <button type="button" className="admin-latest-business__top-header-btn btn btn-md btn-outline-success">
              <SVGIcon src={Icons.Plus} width={20} height={20} />
              Add new room
            </button>
          </div>
          <div className="property-alert__box company-detail__content-alert">
            <SVGIcon className='property-alert__icon' src={Icons.Info} width={28} height={28} />
            <div className="property-alert__content-desc">
              <p className='property-alert__content-desc'>
                If you register a new room, make sure to set Availability, Price, Photos, features and anything related to your service
              </p>
            </div>
          </div>
          <div className="admin-property-business__card-wrapper">
            <div className="admin-property-business">
              <div className="admin-property-business__content">
                <div className="admin-property-business__content-img">
                  <BlurPlaceholderImage className="admin-property-business__content-img--item" src={Images.Placeholder} alt="Review Image" width={364} height={220} />
                </div>
                <div className="admin-property-business__content-wrapper">
                  <div className="admin-property-business__content-inner">
                    <div className="admin-property-business__content-inner admin-property-business__content-inner--top">
                      <p className="admin-property-business__content-inner--number">(123456789)</p>
                      <p className="admin-property-business__content-inner--header">Deluxe Two-Bedroom Suite</p>
                    </div>
                    <div className="admin-property-business__content-inner admin-property-business__content-inner--bottom">
                      <div className="admin-property-business__content-inner--wrapper">
                        <p className="admin-property-business__content-inner--desc">Num. Type : </p>
                        <p className="admin-property-business__content-inner--value">01</p>
                      </div>
                      <div className="admin-property-business__content-inner--wrapper">
                        <p className="admin-property-business__content-inner--desc">Occupancy : </p>
                        <p className="admin-property-business__content-inner--value">5 Adult + 2 Children</p>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="admin-property-business__content-btn btn btn-md btn-outline-success">
                    Edit room
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-property-business">
              <div className="admin-property-business__content">
                <div className="admin-property-business__content-img">
                  <BlurPlaceholderImage className="admin-property-business__content-img--item" src={Images.Placeholder} alt="Review Image" width={364} height={220} />
                </div>
                <div className="admin-property-business__content-wrapper">
                  <div className="admin-property-business__content-inner">
                    <div className="admin-property-business__content-inner admin-property-business__content-inner--top">
                      <p className="admin-property-business__content-inner--number">(123456789)</p>
                      <p className="admin-property-business__content-inner--header">Deluxe Two-Bedroom Suite</p>
                    </div>
                    <div className="admin-property-business__content-inner admin-property-business__content-inner--bottom">
                      <div className="admin-property-business__content-inner--wrapper">
                        <p className="admin-property-business__content-inner--desc">Num. Type : </p>
                        <p className="admin-property-business__content-inner--value">01</p>
                      </div>
                      <div className="admin-property-business__content-inner--wrapper">
                        <p className="admin-property-business__content-inner--desc">Occupancy : </p>
                        <p className="admin-property-business__content-inner--value">5 Adult + 2 Children</p>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="admin-property-business__content-btn btn btn-md btn-outline-success">
                    Edit room
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-property-business">
              <div className="admin-property-business__content">
                <div className="admin-property-business__content-img">
                  <BlurPlaceholderImage className="admin-property-business__content-img--item" src={Images.Placeholder} alt="Review Image" width={364} height={220} />
                </div>
                <div className="admin-property-business__content-wrapper">
                  <div className="admin-property-business__content-inner">
                    <div className="admin-property-business__content-inner admin-property-business__content-inner--top">
                      <p className="admin-property-business__content-inner--number">(123456789)</p>
                      <p className="admin-property-business__content-inner--header">Deluxe Two-Bedroom Suite</p>
                    </div>
                    <div className="admin-property-business__content-inner admin-property-business__content-inner--bottom">
                      <div className="admin-property-business__content-inner--wrapper">
                        <p className="admin-property-business__content-inner--desc">Num. Type : </p>
                        <p className="admin-property-business__content-inner--value">01</p>
                      </div>
                      <div className="admin-property-business__content-inner--wrapper">
                        <p className="admin-property-business__content-inner--desc">Occupancy : </p>
                        <p className="admin-property-business__content-inner--value">5 Adult + 2 Children</p>
                      </div>
                    </div>
                  </div>
                  <button type="button" className="admin-property-business__content-btn btn btn-md btn-outline-success">
                    Edit room
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </InnerLayout>
    </Layout>
  )
}
*/}
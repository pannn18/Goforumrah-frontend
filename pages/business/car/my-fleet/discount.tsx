import Layout from '@/components/layout'
import React from 'react'
import Navbar from '@/components/business/car/navbar'
import CustomFullCalendar from '@/components/fullcalendar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useState } from "react"
import carImage from 'assets/images/car_details_image_2.png'

export default function LocationManagement() {
  return (
    <Layout>
      <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
      <HeaderReservation />
      <div className="add-location">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className='add-location__content-container'>
                <div className="allocation-car__content-discount-setting">
                  <ContentDiscount />
                  <DiscountList />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
};

const HeaderReservation = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link href={"/business/book-transfer/car-dashboard-user/"}>
            <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
          </Link>
          <h4 className='car-dashboard__content-title-heading'>Discount Settings</h4>
        </div>
      </div>
    </header>
  )
}

const ContentDiscount = () => {
  return (
    <div className="allocation-car__setting-content">
      <div className='goform-tips goform-tips__properties'>
        <div className="goform-tips__content-left">
          <div className='goform-tips__icon goform-tips__icon-property'>
            <SVGIcon src={Icons.Percentage} width={24} height={24} color='#1CB78D' />
          </div>
          <div className="goform-tips__text">
            <p className='goform-tips__text-caption'>Nearly 50% of marketplace rentals are between 2 - 7 days in duration. Without multidays rates you will remain uncompetitive. Creating for example 2, 3, 6 day discountis easy</p>
          </div>
        </div>
      </div>
      <div className="allocation-car__content-form">
        <div className="allocation-car__content-discount">
          <div className='company-detail__content-label company-detail__content-label--setting'>
            <label htmlFor="smookingPolicy" className="form-label goform-label">From day</label>
            <input type="text" placeholder='2' className="form-control goform-input" id="fromDay" aria-describedby="fromDayHelp" />
          </div>
          <div className='company-detail__content-label company-detail__content-label--setting'>
            <label htmlFor="smookingPolicy" className="form-label goform-label">To day</label>
            <input type="text" placeholder='2' className="form-control goform-input" id="toDay" aria-describedby="toDayHelp" />
          </div>
          <div className='company-detail__content-label company-detail__content-label--setting'>
            <label htmlFor="smookingPolicy" className="form-label goform-label">Discount</label>
            <input type="text" placeholder='10' className="form-control goform-select goform-select--acc-setting" id="Discount" aria-describedby="DiscountHelp" />
          </div>
          <div className='company-detail__content-label company-detail__content-label--setting'>
            <label htmlFor="smookingPolicy" className="form-label goform-label">Start date</label>
            <input type="text" placeholder='29 May 2023' className="form-control goform-input" id="startDate" aria-describedby="startDateHelp" />
          </div>
          <div className='company-detail__content-label company-detail__content-label--setting'>
            <label htmlFor="smookingPolicy" className="form-label goform-label">End date</label>
            <input type="text" placeholder='31 May 2023' className="form-control goform-input" id="endDate" aria-describedby="endDateHelp" />
          </div>
          <button className="goform-live goform-live__green">
            <SVGIcon src={Icons.Plus} width={20} height={20} color="#FFFFFF" />
            <p className="allocation-car__button-live">Add</p>
          </button>
        </div>
      </div>
    </div>
  )
}

const DiscountList = () => {
  const data = [
    { id: '01', dayRange: '2 - 3', discount: '10 %', startDate: 'Jeddah', endDate: '23415', Action: '10:05 AM ', returnDate: 'Mon, Jan 5, 2022', returnTime: '10:05 AM ', actionEdit: 'edit' },
    { id: '02', dayRange: '2 - 3', discount: '10 %', startDate: 'Jeddah', endDate: '23415', Action: '10:05 AM ', returnDate: 'Mon, Jan 5, 2022', returnTime: '10:05 AM ', actionEdit: 'edit' },
    { id: '03', dayRange: '2 - 3', discount: '10 %', startDate: 'Jeddah', endDate: '23415', Action: '10:05 AM ', returnDate: 'Mon, Jan 5, 2022', returnTime: '10:05 AM ', actionEdit: 'edit' },
  ]

  return (
    <div className="allocation-car__discount-list">
      <p className="allocation-car__title-discount">Discount List</p>
      <div className="allocation-car__content-form">
        <div className="table-responsive">
          <table className="dashboard__data-table table">
            <thead>
              <tr className="dashboard__data-list">
                <th>Number</th>
                <th>Day range</th>
                <th>Discount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className='allocation-car__text-center'>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, index) => (
                <tr key={index} className="dashboard__data-list">
                  <td>{d.id}</td>
                  <td>{d.dayRange}</td>
                  <td>{d.discount}</td>
                  <td>{d.startDate}</td>
                  <td>{d.endDate}</td>
                  <td>
                    <div className="allocation-car__action-table">
                      <button type="button" className="admin-business__top-header-btn btn btn-md btn-outline-success allocation-car__btn allocation-car__btn-table">
                        {d.actionEdit}
                      </button>
                      <button className="allocation-car__delete">
                        <SVGIcon src={Icons.Disabled} width={20} height={20} color="#CA3232" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

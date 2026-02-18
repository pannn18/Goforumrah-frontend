import Layout from '@/components/layout'
import React, { useRef, useEffect } from 'react';
import Navbar from '@/components/business/car/navbar'
import CustomFullCalendar from '@/components/fullcalendar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import carImage from 'assets/images/car_details_image_2.png'
import { useSession } from 'next-auth/react';
import { callAPI } from '@/lib/axiosHelper';
import LoadingOverlay from '@/components/loadingOverlay';
import moment from 'moment';

export default function MyFleet() {

  const { data: session, status } = useSession()

  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)
  const [fleetList, setFleetList] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10)

  useEffect(() => {
    if (!id_car_business || fleetList) {
      return
    }

    // Get data for fleet list
    const getFleetList = async () => {
      try {
        const { data, error, ok } = await callAPI(`/car-business/fleet/show`, 'POST', { id_car_business: id_car_business }, true)
        if (error) {
          console.log(error);
        }
        if (ok) {
          setFleetList(formatFleet(data))
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }

    getFleetList()

  }, [fleetList, id_car_business])


  const formatFleet = (fleetData) => {
    return fleetData.map((fleet, index) => ({
      number: (currentPage - 1) * itemsPerPage + index + 1,
      photo: fleet.photo?.photo,
      carName: `${fleet.car_brand} ${fleet.model}`,
      carBrand: fleet.car_brand,
      quantity: fleet.quantity,
      addedDate: moment(fleet.created_at).format('DD MMM YYYY'),
      idFleet: fleet.id_car_business_fleet,
      totalCar: fleet.total_car
    }));
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = fleetList?.slice(indexOfFirstItem, indexOfLastItem);
  const pageCounts = Math.ceil(fleetList?.length / itemsPerPage)


  if (loading) {
    return <LoadingOverlay />
  }



  return (
    <Layout>
      <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
      <HeaderMyFleet />
      <div className="my-fleet">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className='my-fleet__content-container'>
                <div className="my-fleet__wrapper">
                  <div className="my-fleet__content">
                    <table className="my-fleet__table">
                      <thead>
                        <tr className="my-fleet__table-list">
                          <th>No.</th>
                          <th>Car Name</th>
                          <th>Car Brand</th>
                          <th>Quantity</th>
                          <th>AddedDate</th>
                          <th>Total Car</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems && currentItems.map((fleet, index) => (
                          <FleetList {...fleet} key={index} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="my-fleet__pagination">
                    <div className="pagination justify-content-center">
                      <button type="button"
                        onClick={() => {
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(90deg)', cursor: currentPage === 1 ? 'default' : 'pointer' }}>
                        <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                      </button>
                      {Array.from({ length: pageCounts }, (_, i) => i + 1).map((number) => {
                        const isCloseToCurrent = number >= currentPage - 2 && number <= currentPage + 2
                        const hasMoreOnLeft = number !== 1 && number === currentPage - 3
                        const hasMoreOnRight = number !== pageCounts && number === currentPage + 3
                        const isFirst = number === 1
                        const isLast = number === pageCounts

                        const isVisible = isCloseToCurrent || hasMoreOnLeft || hasMoreOnRight || isFirst || isLast

                        return isVisible && (
                          <button key={number}
                            onClick={() => {
                              !(hasMoreOnLeft || hasMoreOnRight) && setCurrentPage(number)
                            }}
                            type="button" className={`pagination__button ${number === currentPage ? 'active' : ''}`} style={{ cursor: hasMoreOnLeft || hasMoreOnRight ? 'default' : 'pointer' }}>{(hasMoreOnLeft || hasMoreOnRight) ? '...' : number}</button>
                        )
                      })}
                      <button type="button"
                        onClick={() => {
                          if (currentPage < pageCounts) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(-90deg)', cursor: currentPage === pageCounts ? 'default' : 'pointer' }}>
                        <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
};

const HeaderMyFleet = () => {
  return (
    <header>
      <div className="my-fleet__header">
        <div className="container my-fleet__content-header">
          <Link href={"/business/car"} className='car-dashboard__content-header car-dashboard__content-header--link'>
            <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
            <h4 className='my-fleet__content-title-heading'>My Fleet</h4>
          </Link>
          <div>
            <Link href={"/business/car/my-fleet/add"} className='my-fleet__content-header-button btn btn-success btn-md'>
              <SVGIcon src={Icons.Plus} width={24} height={24} />
              Add New
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

interface FleetListProps {
  number: number,
  photo: string,
  carName: string,
  carBrand: string,
  quantity: number,
  addedDate: string,
  idFleet: number,
  totalCar: number
}

const FleetList = (props: FleetListProps) => {
  const { number, photo, carName, carBrand, quantity, addedDate, idFleet, totalCar } = props

  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  return (
    <tr className="my-fleet__table-list">
      <td>{number}</td>
      <td>
        <div className="my-fleet__table-list--carname">
          <img className="my-fleet__table-list--icon" src={photo || Images.Placeholder} alt="Review Image" width={20} height={20} />
          {carName}
        </div>
      </td>
      <td>
        <div className="my-fleet__table-list--return">
          <p>{carBrand}</p>
        </div>
      </td>
      <td>
        <div className="my-fleet__table-list--return">
          <p>{quantity}</p>
        </div>
      </td>

      <td>
        <div className="my-fleet__table-list--icon">
          <SVGIcon src={Icons.Calendar} width={20} height={20} className="" />
          {addedDate}
        </div>
      </td>

      <td>
        <div className="my-fleet__table-list--return">
          <p>{totalCar}</p>
        </div>
      </td>
      <td>
        <div className="custom-dropdown">
          <div onClick={() => setShowActionDropdown(true)} className="custom-dropdown-toggle admin-booking-flight__table-dropdown">
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu show={showActionDropdown} setShow={setShowActionDropdown} className="admin-booking-flight__header-dropdown-menu" style={{ marginTop: 8, marginLeft: -110, width: 155 }}>
            <div className="custom-dropdown-menu__options">
              <Link href="#" className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-flight__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Eye} width={20} height={20} className="" />
                  <p>See Details</p>
                </div>
              </Link>
              <Link href={`/business/car/my-fleet/edit?id_fleet=${idFleet}`} className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-flight__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Pencil} width={20} height={20} className="" />
                  <p>Edit</p>
                </div>
              </Link>
              <Link href="#" className="admin-booking-flight__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-flight__dropdown-menu-option-delete">
                  <SVGIcon src={Icons.Trash} width={20} height={20} className="" />
                  <p>Delete</p>
                </div>
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}
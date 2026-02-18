import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/business/car/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from '@/components/loadingOverlay'

export default function LocationManagement() {
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)

  const [location, setLocation] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!id_car_business) return

    // getLocation
    const getLocation = async () => {
      try {
        const { error, ok, data } = await callAPI('/car-business/location/show', 'POST', { id_car_business: id_car_business }, true)
        if (error) {
          console.log(error);
        }
        if (ok) {
          setLocation(data)
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false)
      }
    }

    getLocation()
  }, [id_car_business])



  if (loading) {
    return <LoadingOverlay />
  }
  return (
    <Layout>
      <div className="add-location">
        <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
        <HeaderLocation />
        <div className="container">
          <div className='add-location__content-container'>
            <ContentManagement location={location} />
            <TableLocation {...location} />
          </div>
        </div>
      </div>
    </Layout>
  )
};

const HeaderLocation = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link href={"/business/car"} className='car-dashboard__content-header car-dashboard__content-header--link'>
            <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
            <h4 className='car-dashboard__content-title-heading'>Location Management</h4>
          </Link>
        </div>
      </div>
    </header>
  )
}

const ContentManagement = ({ location }) => {


  return (
    <div className="add-location__content-tabel">
      <p className='add-location__tabel-text'></p>
      {location ? (
        ''
      ) : (
        <Link href={'/business/car/location/add'} className='btn btn-success add-location__tabel-button'>Add new location</Link>
      )}
    </div>
  )
}


interface TableLocationProps {
  location_name: string;
  address_line: string;
  city: string;
  postcode: string
}
const TableLocation = (props: TableLocationProps) => {

  return (
    <div className="dashboard__data">
      <div className="table-responsive">
        <table className="dashboard__data-table table">
          <thead>
            <tr className="dashboard__data-list">
              <th>Name</th>
              <th>Address</th>
              <th>City</th>
              <th>Pascode</th>
              <th className='all-location__content-action'>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="dashboard__data-list">
              <td>
                <div className="admin-booking__table-list--icon">
                  {props.location_name}
                  <div className="add-location__info-approval">approval</div>
                </div>
              </td>
              <td>
                <div className="admin-booking__table-list--icon">
                  <SVGIcon src={Icons.MapPinOutline} width={20} height={20} color="#1b1b1bf5" />
                  {props.address_line}
                </div>
              </td>
              <td>{props.city}</td>
              <td>{props.postcode}</td>
              <td>
                <Link href='/business/car/location/review' className='btn btn-outline-success btn-sm'>Review</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}


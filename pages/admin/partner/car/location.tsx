import React, { useEffect, useState } from "react"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import DropdownMenu from "@/components/elements/dropdownMenu"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { useRouter } from "next/router"
import LoadingOverlay from "@/components/loadingOverlay"
import { callAPI } from "@/lib/axiosHelper"

export default function PartnerCarEdit() {
  const router = useRouter()
  const { id: id_car_business } = router.query;
  const [carLocation, setCarLocation] = useState<any>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    const carLocationBusiness = async () => {
      try {
        const { ok, status, error, data } = await callAPI('/car-business/location/show', 'POST', { id_car_business: id_car_business }, true)
        if (ok) {
          console.log(data)
          setIsLoading(false)
          setCarLocation(data)
        } else {
          console.error('Error fetching data', error)
        }
      } catch (err) {
        console.error('An unexpected error occurred', err.message)
      }
    }

    carLocationBusiness()
  }, [id_car_business])


  const handleSave = async () => {
    setIsLoading(true)
    const payload = {
      id_car_business: id_car_business,
      location_name: carLocation?.location_name,
      address_line: carLocation?.address_line,
      city: carLocation?.city,
      region: carLocation?.region,
      postcode: carLocation?.postcode,
      lat: carLocation?.lat,
      long: carLocation?.long,
    }

    console.log(payload)

    const { ok, status, error, data } = await callAPI('/car-business/location/store', 'POST', payload, true)
    try {
      if (ok) {
        console.log(data)
        console.log('Success API handle submit admin partner location store ', status, data, ok, error)
        setIsLoading(false)
        setCarLocation(data)
        setIsEditMode(false)
      } else {
        console.error('Error fetching data', error)
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  const carLocationArray = [
    { label: 'Location Name', value: carLocation?.location_name, key: 'location_name' },
    { label: 'Address Line', value: carLocation?.address_line, key: 'address_line' },
    { label: 'City', value: carLocation?.city, key: 'city' },
    { label: 'Region', value: carLocation?.region, key: 'region' },
    { label: 'Post Code', value: carLocation?.postcode, key: 'postcode' },
    { label: 'Lat', value: carLocation?.lat, key: 'lat' },
    { label: 'Long', value: carLocation?.long, key: 'long' },
  ];

  const handleEditModeToggle = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleInputChange = (e, key) => {
    // console.log('Input change event:', e.target.value);
    // console.log('Key:', key);
    setCarLocation((prev) => ({ ...prev, [key]: e.target.value }));
  };


  return (
    <Layout>
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <AdminLayout pageTitle="Location" enableBack={true}>
          <div className="admin-partner__detail">
            <div className="container">
              <form className="admin-partner__car-edit" onSubmit={(e) => e.preventDefault()}>
                <div className="admin-partner__fleet-card">
                  <div className="admin-partner__fleet-card--header">
                    <h5 className="admin-partner__fleet-car--name"> {carLocation?.address_line}</h5>
                    <button type="button"
                      className="btn btn-md btn-outline-success"
                      onClick={handleEditModeToggle}
                    >
                      {isEditMode ? 'Cancel' : 'Edit'}
                    </button>
                  </div>
                  <div className="admin-partner__fleet-body">
                    {carLocationArray.map((item, index) => (
                      <div key={index} className="admin-partner__fleet-body-block">
                        <label htmlFor={`company-${index}`}>{item.label}</label>
                        <input
                          name={`company-${index}`}
                          id={`company-${index}`}
                          type="text"
                          readOnly={!isEditMode}
                          value={isEditMode ? (carLocation[item.key]) : (item?.value || 'N/A')}
                          onChange={(e) => handleInputChange(e, item.key)}
                          className={`${isEditMode ? '' : 'admin-partner__fleet-body-block--edited'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                  <Link href={`/admin/partner/car/${id_car_business}`} className="btn btn-lg btn-outline-success">Cancel</Link>
                  <button type='button'
                    className='btn btn-lg btn-success'
                    disabled={isLoading}
                    onClick={handleSave}
                  >
                    {isLoading ? 'Please wait...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </AdminLayout>
      )}
    </Layout>
  );

}

interface CarLocationListProps {
  id_car_business: number,
  location_name: string,
  address_line: string,
  city: string,
  region: string,
  postcode: string,
  lat: string,
  long: string
}
const CarLocationList = (props: CarLocationListProps) => {
  const { id_car_business, location_name, city, region, postcode, lat, long } = props
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  return (
    <tr className="admin-partner__table-list">
      <td>{id_car_business}</td>
      <td className="admin-partner__table-list--truncate">{ }</td>
      <td>
        <div className="admin-partner__table-list--icon">
          <SVGIcon src={Icons.MapPinOutline} width={20} height={20} className="" />
          {location_name}
        </div>
      </td>
      <td className="admin-partner__table-list--center">{city}</td>
      <td className="admin-partner__table-list--center">{postcode}</td>
      <td>
        <div className="custom-dropdown">
          <div onClick={() => setShowActionDropdown(true)} className="custom-dropdown-toggle admin-partner__table-dropdown">
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu show={showActionDropdown} setShow={setShowActionDropdown} className="admin-partner__header-dropdown-menu" style={{ marginTop: 8, marginLeft: -110, width: 155 }}>
            <div className="custom-dropdown-menu__options">
              <Link href={`/car/details`} className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-partner__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Eye} width={20} height={20} className="" />
                  <p>See Details</p>
                </div>
              </Link>
              <Link href="#" className="admin-partner__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-partner__dropdown-menu-option-delete">
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
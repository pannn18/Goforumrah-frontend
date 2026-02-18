import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import LoadingOverlay from "@/components/loadingOverlay"

export default function PartnerHotelDetail() {
  const router = useRouter()
  const { id_hotel } = router.query;

  //Retrive Data from API
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);

  // hotel amneties data for edit modal
  const [hotelAmnetiesToEdit, setHotelAmnetiesToEdit] = useState(null);

  const fetchHotelData = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/hotel-amenities/show-v2', 'POST', { id_hotel: id_hotel }, true);
      setHotelData(data);
      setHotelLoading(false);
    } catch (error) {
      setHotelError(error);
      setHotelLoading(false);
    }
  };

  useEffect(() => {
    if (!id_hotel) return;
    if (hotelData) return;
    fetchHotelData();
  }, [id_hotel]);

  const onActionForm = async () => {
    fetchHotelData();
    window.scrollTo({ top: 0, behavior: 'auto' })
  };

  if (hotelLoading) {
    return <LoadingOverlay />;
  }

  if (hotelError) {
    return <div>Error Fetching Data</div>;
  }

  const openEditModal = (hotelAmneties) => {
    setHotelAmnetiesToEdit(hotelAmneties);
  };

  // Define hotelAmenitiesArray array
  const hotelAmenitiesArray = [
    'Extra Bed',
    'Electric Kattle',
    'Terrace',
    'Air Conditioning',
    'Balcony',
    'Flat-screen TV',
    'Spa Tub',
    'View',
  ];

  console.log("data : ", hotelData)
  return (
    <Layout>
      <AdminLayout pageTitle="Amenities" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <form action="#" className="admin-partner__basic">
              {Object.keys(hotelData).map((roomName) => {
                const rooms = hotelData[roomName];
                return (
                  <>
                    <div key={roomName} className="admin-partner__basic-card">
                      <p className="admin-partner__basic-card__title">{roomName}</p>
                      {rooms.map((room, index) => (
                        <div key={index} className="admin-partner__amenities">
                          <div className="admin-partner__amenities-header">
                            <p className="admin-partner__amenities-header-title">{room.room_type}</p>
                            <button type="button" className="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#facilitesEditModal" onClick={() => openEditModal(room)}>Edit</button>
                          </div>
                          <div className="admin-partner__amenities-list">
                            {hotelAmenitiesArray.map((name) => {
                              // Check if the name exists in the amenities of the current room
                              const available = room.amenities && room.amenities.some(
                                (amenity) => amenity.amenities_name === name
                              );
                              return (
                                <HotelAmenitiesItem key={name} name={name} available={available}
                                />
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )
              })}
              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-outline-success">Cancel</Link>
                <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-success">Save</Link>
              </div>
              <AmnetiesEditModal hotelAmneties={hotelAmnetiesToEdit} onActionForm={onActionForm} />
            </form>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  )
}

interface HotelAmenitiesItemProps {
  name: string
  available: boolean
}

const HotelAmenitiesItem = (props: HotelAmenitiesItemProps) => {
  const { name, available } = props
  return (
    <label htmlFor={""} className="admin-partner__amenities-item">
      {props.available &&
        <SVGIcon src={Icons.Check} width={20} height={20} className="admin-partner__amenities-item--available" />
      }
      {!props.available &&
        <SVGIcon src={Icons.Cancel} width={20} height={20} className="admin-partner__amenities-item--unavailable" />
      }
      <p>{name}</p>
    </label>
  )
}

const AmnetiesEditModal = ({ hotelAmneties, onActionForm }) => {
  const router = useRouter();
  const { id_hotel } = router.query;
  console.log("hotelAmneties : ", hotelAmneties)

  // Initialize formData as an empty array
  const [formData, setFormData] = useState({
    id_hotel: id_hotel,
    extra_bed: 1,
    amenities: []
  });

  // Define hotelAmenitiesArray array
  const hotelAmenitiesArray = [
    'Extra Bed',
    'Electric Kattle',
    'Terrace',
    'Air Conditioning',
    'Balcony',
    'Flat-screen TV',
    'Spa Tub',
    'View',
  ];

  // Use a separate useEffect for fetching initial data
  useEffect(() => {
    if (hotelAmneties?.amenities) {
      // Map firstHotelAmneties.amenities to the amenities format you want
      const amenitiesArrayFromData = hotelAmneties.amenities.map((amenity) => ({
        amenities_name: amenity?.amenities_name || "", // Provide a default value if amenities_name is undefined
        id_hotel_layout: [hotelAmneties?.id_hotel_layout || 0], // Wrap it in an array
      }));

      // Update formData with the new amenities
      setFormData((prevFormData) => ({
        ...prevFormData,
        amenities: amenitiesArrayFromData,
      }));

      console.log("formData : ", formData)
    }
  }, [hotelAmneties?.amenities]);

  // Define a function to handle checkbox changes
  const handleCheckboxChange = (name) => {
    // Find the index of the amenity with the given name in the formData
    const amenityIndex = formData.amenities.findIndex(
      (amenity) => amenity.amenities_name === name
    );

    if (amenityIndex !== -1) {
      // If the amenity is found, remove it from the formData
      const updatedAmenities = [...formData.amenities];
      updatedAmenities.splice(amenityIndex, 1);
      setFormData({
        ...formData,
        amenities: updatedAmenities,
      });
    } else {
      // If the amenity is not found, add it to the formData
      setFormData((prevFormData) => ({
        ...prevFormData,
        amenities: [
          ...prevFormData.amenities,
          {
            amenities_name: name,
            id_hotel_layout: [hotelAmneties?.id_hotel_layout || 0], // Wrap it in an array
          },
        ],
      }));
    }

    console.log("formData : ", formData);
  };


  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/hotel-amenities/store', 'POST', formData, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit admin partner amenities store ", status, data, ok, error);
      // Call onActionForm to refetch hotel data and scroll to the top
      onActionForm();
    } else {
      console.log("fail to handle submit post api admin partner amenities store   ", status, data, ok, error);
    }
  };

  return (
    <div className="modal fade" id="facilitesEditModal" tabIndex={-1} aria-labelledby="facilityLabel" aria-hidden="true">
      <div className="modal-dialog ">
        <div className="modal-content admin-partner__amenities-modal">
          <div className="admin-partner__amenities-modal__body">
            <h5 className="admin-partner__amenities-modal__header">Edit</h5>
            <div className="admin-partner__amenities-modal__content">
              {hotelAmenitiesArray.map((name) => {
                // Check if the name exists in the formData amenities
                const isChecked = formData.amenities.some(
                  (amenity) => amenity.amenities_name === name
                );

                return (
                  <HotelAmenitiesItemEdit key={name} name={name} inputId={name} inputValue={name} checked={isChecked} onChange={() => handleCheckboxChange(name)} />
                );
              })}
            </div>

          </div>
          <div className="admin-partner__amenities-modal__footer">
            <button type="button" data-bs-dismiss="modal" aria-label="Close" className="btn btn-lg btn-outline-success">Cancel</button>
            <button type="button" onClick={handleSubmit} data-bs-dismiss="modal" aria-label="Close" className="btn btn-lg btn-success">Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface HotelAmenitiesItemEditProps {
  name: string
  inputId: string
  inputValue: string
  checked: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const HotelAmenitiesItemEdit = (props: HotelAmenitiesItemEditProps) => {
  const { name, inputId, inputValue, checked, onChange } = props
  return (
    <label htmlFor={inputId} className="admin-partner__amenities-modal__content-item">
      <p>{name}</p>
      <input type="checkbox" name="hotel-facilities" id={inputId} value={inputValue} checked={checked} onChange={onChange} className="form-check-input" />
    </label>
  )
}
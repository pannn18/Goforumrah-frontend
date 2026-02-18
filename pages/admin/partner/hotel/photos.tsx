import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import { BlurPlaceholderImage } from "@/components/elements/images"
import placeholder from '@/public/images/placeholder.svg'
import { co } from "@fullcalendar/core/internal-common"
import LoadingOverlay from "@/components/loadingOverlay"


export default function PartnerHotelDetail() {
  const router = useRouter()
  const { id_hotel } = router.query;

  //Retrive Data from API
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);

  const [formDataPhotosDelete, setFormDataPhotosDelete] = useState({
    id_hotel_layout_photo: []
  });

  const [selectedRoom, setSelectedRoom] = useState(null); // Step 1: Create state for selected room
  const inputFileRef = useRef(null); // Create a ref for the input file

  const fetchHotelData = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/hotel-layout-photo/show-v2', 'POST', { id_hotel: id_hotel }, true);
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

  const handleAddPhotosClick = (room) => { // Step 2: Update the function to accept room data
    setSelectedRoom(room); // Set the selected room data

    // Ensure that inputFileRef is set before accessing its current property
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  // Function to toggle the 'remove' state of a room
  const toggleRemoveState = (roomName) => {
    // Create a copy of the hotel data to avoid mutating the original state
    const updatedHotelData = { ...hotelData };

    // Find the room by name in the copied data
    const roomToUpdate = updatedHotelData[roomName];

    // Toggle the 'remove' state for the room
    roomToUpdate.forEach((room) => {
      room.remove = !room.remove;
    });

    // Update the state with the modified data
    setHotelData(updatedHotelData);
  };

  // Function to handle the "Save" button click
  const handleSaveClick = (roomName) => {
    // Toggle the 'remove' state to hide the "Save" button and show "Remove" and "Add Photos" buttons
    toggleRemoveState(roomName);
  };

  // Function to handle adding photo IDs to formDataPhotosDelete
  const addToFormDataPhotosDelete = (photoId) => {
    // Create a copy of the current formDataPhotosDelete
    const updatedFormDataPhotosDelete = { ...formDataPhotosDelete };

    // Add the photoId to the array
    updatedFormDataPhotosDelete.id_hotel_layout_photo.push(photoId);

    // Update the state with the modified object
    setFormDataPhotosDelete(updatedFormDataPhotosDelete);
    console.log("updatedFormDataPhotosDelete", updatedFormDataPhotosDelete);
  };

  // Function to reset formDataPhotosDelete
  const resetFormDataPhotosDelete = () => {
    setFormDataPhotosDelete({
      id_hotel_layout_photo: []
    });
  };

  const handleSubmitDelete = async (event) => {
    const { status, data, ok, error } = await callAPI('/hotel-layout-photo/delete-v2', 'POST', formDataPhotosDelete, true)
    console.log(status, data, ok, error);
    if (ok) {
      fetchHotelData();
      window.location.reload()
      console.log("success api handle submit admin partner layout photo delete", status, data, ok, error);
    } else {
      console.log("fail to handle submit post api admin partner layout photo delete", status, data, ok, error);
    }
  };



  console.log("hotelData", hotelData)

  return (
    <Layout>
      <AdminLayout pageTitle="Photos" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <div className="admin-partner__basic">
              {Object.keys(hotelData).map((roomName) => {
                const rooms = hotelData[roomName];
                return (
                  <>
                    <div key={roomName} className="admin-partner__basic-card">
                      <h5>{roomName}</h5>
                      <div className="admin-partner__photos">
                        {rooms.map((room, index) => {
                          return (
                            <>
                              <div className="admin-partner__photos-header">
                                <p className="admin-partner__photos-header-title">
                                  {room.room_type}
                                </p>
                                <div className="admin-partner__photos-header-buttons">
                                  {/* Show "Remove" and "Add Photos" buttons if 'remove' state is not active */}
                                  {room.remove ? (
                                    <>
                                      <button type="button" className="btn btn-outline-danger"
                                        onClick={() => {
                                          toggleRemoveState(roomName)
                                          window.location.reload();
                                        }}>Cancel</button>
                                      <button type="button" className="btn btn-outline-success" onClick={() => { toggleRemoveState(roomName); handleSubmitDelete(event); }}>Save</button>
                                    </>
                                  ) : (
                                    <>
                                      <button type="button" className="btn btn-outline-danger" onClick={() => toggleRemoveState(roomName)}>Remove</button>
                                      <button type="button" className="btn btn-outline-success" onClick={() => handleAddPhotosClick(room)}>Add Photos</button>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="admin-partner__photos-list">
                                {room.hotel_layout_photo && room.hotel_layout_photo.length > 0 ? (
                                  room.hotel_layout_photo.slice(0, 5).map((photo, photoIndex) => (
                                    <HotelLayoutPhotos
                                      photos={photo?.photo || ''}
                                      remove={room.remove}
                                      key={photoIndex}
                                      onRemoveClick={() => addToFormDataPhotosDelete(photo.id_hotel_layout_photo)}
                                    />
                                  ))
                                ) : (
                                  <div>
                                    <div className="position-relative">
                                      <BlurPlaceholderImage
                                        src={placeholder}
                                        className="admin-partner__detail-hotel__image-src"
                                        alt=""
                                        width={123}
                                        height={123}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </>
                          )
                        }
                        )}
                      </div>
                    </div>
                  </>
                )
              })}
              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-outline-success">Cancel</Link>
                <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-success">Save</Link>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
      <PartnerPhotosForm idHotelLayout={selectedRoom?.id_hotel_layout} totalPhotos={selectedRoom?.hotel_layout_photo.length} inputFileRef={inputFileRef} onActionForm={onActionForm} />
    </Layout>
  )
}

const PartnerPhotosForm = ({ idHotelLayout, totalPhotos, inputFileRef, onActionForm }) => {
  totalPhotos = totalPhotos || 0;
  console.log("idHotelLayout", idHotelLayout)
  console.log("totalPhotos", totalPhotos)

  // Initialize photosArray as an empty array
  const [photosArray, setPhotosArray] = useState([]);

  // Use the input file ref to trigger the file input
  const handleAddPhotosClick = () => {
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const handleFileInputChange = async (event) => {
    const files = event.target.files;
    const promises = [];

    // Calculate the maximum number of images allowed
    const maxImages = 5 - totalPhotos;

    for (let i = 0; i < files.length && i < maxImages; i++) {
      const file = files[i];

      // Use FileReader to read the selected file as base64
      const reader = new FileReader();

      promises.push(
        new Promise((resolve, reject) => {
          reader.onload = (e) => {
            const base64String = e.target.result;
            resolve(base64String);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file);
        })
      );
    }

    try {
      // Wait for all file reading promises to complete
      const base64Array = await Promise.all(promises);

      console.log("base64Array : ", base64Array);

      const { status, data, ok, error } = await callAPI('/hotel-layout-photo/store', 'POST', { id_hotel_layout: idHotelLayout, photos: base64Array }, true);
      console.log(status, data, ok, error);
      if (ok) {
        console.log("success api handle submit admin partner layout photo store", status, data, ok, error);
        console.log("formData submitted ", base64Array);
        // Call onActionForm to refetch hotel data and scroll to the top
        onActionForm();
        window.location.reload()
      } else {
        console.log("fail to handle submit post api admin partner layout photo store", status, data, ok, error);
      }
    } catch (error) {
      console.error('Error reading files:', error);
    }
  };

  // const handleSubmit = async (event) => {
  //   const { status, data, ok, error } = await callAPI('/hotel-layout-photo/store', 'POST', { id_hotel_layout: idHotelLayout, photos: photosArray }, true);
  //   console.log(status, data, ok, error);
  //   if (ok) {
  //     console.log("success api handle submit admin partner layout photo store", status, data, ok, error);
  //     console.log("formData submitted ", photosArray);
  //     // Call onActionForm to refetch hotel data and scroll to the top
  //     onActionForm();
  //   } else {
  //     console.log("fail to handle submit post api admin partner layout photo store", status, data, ok, error);
  //   }
  // };

  return (
    <form action="#" className="d-none">
      {/* input file multiple */}
      <div className="form-group">
        <label htmlFor="photos">Photos</label>
        {/* input only image multiple */}
        <input type="file" className="form-control" id="photos" multiple accept="image/*" onChange={handleFileInputChange} ref={inputFileRef} />
        <button type="button" className="btn btn-outline-success" onClick={handleAddPhotosClick}>Add Photos</button>
      </div>
    </form>
  )
}


interface HotelLayoutPhotosProps {
  photos: string
  remove: boolean
  onRemoveClick: () => void
}

const HotelLayoutPhotos = (props: HotelLayoutPhotosProps) => {
  const { photos, remove, onRemoveClick } = props
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Reset the 'show' state whenever new data is fetched
    setShow(false);
  }, [photos]); // Add 'photos' as a dependency to the useEffect

  const handleClick = () => {
    setShow(!show);
    // Call the onRemoveClick function to handle removal
    onRemoveClick();
  };

  return (
    <div className={`admin-partner__detail-hotel__image ${show ? 'd-none' : ''}`}>
      <BlurPlaceholderImage src={photos || placeholder} className="admin-partner__detail-hotel__image-src" alt="" width={123} height={123} />
      <button className={`admin-partner__detail-hotel__image-button ${remove ? 'show' : ''}`} onClick={handleClick} type="button">
        <SVGIcon src={Icons.Cancel} height={24} width={24} />
      </button>
    </div>
  )
}
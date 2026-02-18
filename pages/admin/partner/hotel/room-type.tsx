import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { BlurPlaceholderImage } from '@/components/elements/images'
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import LoadingOverlay from "@/components/loadingOverlay"


export default function PartnerHotel() {
  const router = useRouter()
  const { id_hotel } = router.query;

  //Retrive Data from API
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);


  // HotelLayout Modal
  const [hotelLayoutToDelete, setHotelLayoutToDelete] = useState(null);
  const [hotelLayoutToEdit, setHotelLayoutToEdit] = useState(null);


  const fetchHotelData = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/hotel-layout/show-v2', 'POST', { id_hotel: id_hotel }, true);
      setHotelData(data);
      setHotelLoading(false);
    } catch (error) {
      setHotelError(error);
      setHotelLoading(false);
    }
  };


  useEffect(() => {
    if (!id_hotel) return

    // Check if personalData or hotelData is already available
    if (hotelData) return;

    fetchHotelData();
  }, [id_hotel]);

  const onActionForm = async () => {
    fetchHotelData();
    window.scrollTo({ top: 0, behavior: 'auto' })
  };



  if (hotelLoading) {
    return <LoadingOverlay />
  }

  if (hotelError) {
    return <div>Error Fetching Data</div>;
  }

  const openPopupDelete = (hotelLayout) => {
    setHotelLayoutToDelete(hotelLayout);
  };

  const openEditModal = (hotelLayout) => {
    setHotelLayoutToEdit(hotelLayout);
  };

  console.log("data : ", hotelData)
  return (
    <Layout>
      <AdminLayout pageTitle="Room Type" enableBack={true}>
        <div className="container admin-partner__container-room">
          <div className="admin-partner">
            <div className="admin-partner__content-room">
              {Object.keys(hotelData).map((roomType) => {
                const rooms = hotelData[roomType];
                return (
                  <div key={roomType} className="admin-partner__wrapper admin-partner__wrapper-room">
                    <div className="admin-partner__property-room-title">
                      <h5>{roomType}</h5>
                      <div className="admin-partner__property-room-button">
                        <button type="button" className="admin-partner__room-btn btn btn-md btn-outline-danger" data-bs-toggle="modal" data-bs-target="#cancelationModal" onClick={() => openPopupDelete(rooms)}>Delete</button>
                        <button type="button" className="admin-partner__room-btn btn btn-md btn-outline-success" data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => openEditModal(rooms)}>Edit</button>
                      </div>
                    </div>
                    {rooms.map((room, index) => (
                      <>
                        <div key={index} className="admin-partner__property-room-content">
                          <p className="admin-partner__property-content-title">{room.room_type}</p>
                          <div className="admin-partner__property-content-detail">
                            {room.hotel_bed.map((bed, bedIndex) => (
                              <div key={index} className="admin-partner__property-detail-list">
                                <SVGIcon src={Icons.Bed} width={20} height={20} className="admin-partner__summary-header-icon" color="#616161" />
                                <p>
                                  {bed.amount} {bed.bed_type}
                                </p>
                              </div>
                            ))}
                            <div className="admin-partner__property-detail-list">
                              <SVGIcon src={Icons.Users} width={20} height={20} className="admin-partner__summary-header-icon" color="#616161" />
                              <p>{room.guest_count} guests</p>
                            </div>
                            <div className="admin-partner__property-detail-list">
                              <SVGIcon src={Icons.Money} width={20} height={20} className="admin-partner__summary-header-icon" color="#616161" />
                              <p>Extra low price! (non-refundable)</p>
                            </div>
                          </div>
                        </div>

                      </>
                    ))}
                  </div>
                );
              })}

              <button type="button" className="admin-partner__btn-room-add btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#addModal">
                <SVGIcon src={Icons.Plus} width={24} height={24} className="admin-partner__summary-header-icon" color="#616161" />
                <p className="admin-partner__property-content-title--md">Add New</p>
              </button>
              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-outline-success">Cancel</Link>
                <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-success">Save</Link>
              </div>
            </div>
          </div>
          <PopupDelete hotelLayout={hotelLayoutToDelete} onActionForm={onActionForm} />
          <PopupEdit hotelLayout={hotelLayoutToEdit} onActionForm={onActionForm} />
          <PopupAdd onActionForm={onActionForm} />
        </div>
      </AdminLayout>
    </Layout>
  )
}

const PopupEdit = ({ hotelLayout, onActionForm }) => {
  const router = useRouter();
  const { id_hotel } = router.query;
  // console.log("hotelLayout Edit PopUp : ", hotelLayout);

  // Initialize formData as an empty array
  const [formData, setFormData] = useState([]);

  // Initialize rooms based on hotelLayout
  const [rooms, setRooms] = useState([]);

  // Add a state variable to track the room name value
  const [roomNameValue, setRoomNameValue] = useState(null);

  // Use a separate useEffect for fetching initial data
  useEffect(() => {
    if (hotelLayout && hotelLayout.length > 0) {
      const updatedFormData = hotelLayout.map((layout) => {
        // Calculate bedCount based on the length of hotel_bed array
        const bedCount = (layout.hotel_bed || []).length;

        // Map the hotel_bed array to add id_hotel_bed_form
        const bedLayoutWithFormId = (layout.hotel_bed || []).map((bed) => ({
          ...bed,
          id_hotel_bed_form: bed.id_hotel_bed, // Use a unique identifier
        }));

        return {
          id_hotel_layout: layout.id_hotel_layout,
          id_hotel: layout.id_hotel,
          room_name: layout.room_name,
          room_type: layout.room_type,
          number_of_room: layout.number_of_room,
          smoking_policy: layout.smoking_policy,
          guest_count: layout.guest_count,
          room_size: layout.room_size,
          price: layout.price,
          soft_delete: layout.soft_delete,
          bed_layout: bedLayoutWithFormId,
          bedCount, // Add the calculated bedCount
        };
      });

      setFormData(updatedFormData);

      // Calculate rooms based on hotelLayout
      const updatedRooms = hotelLayout.map((layout, index) => ({
        id: index + 1, // Use an incremental number
        bedCount: (layout.hotel_bed || []).length,
      }));

      setRooms(updatedRooms);

      const initialRoomName = hotelLayout && hotelLayout.length > 0 ? hotelLayout[0].room_name : '';
      setRoomNameValue(initialRoomName);

      // console.log("formData Edit PopUp : ", formData);
    }
  }, [hotelLayout]);

  const handleSubmitStore = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const totalItems = formData.length;
    let successfulSubmissions = 0;
    // Loop through each item in formData and submit it to the API
    for (const formDataItem of formData) {
      // console.log("formDataItem : ", formDataItem);
      // console.log("formDataItem Bed Layout : ", formDataItem.bed_layout);
      const { status, data, ok, error } = await callAPI('/hotel-layout/store', 'POST', formDataItem, true);
      // console.log(status, data, ok, error);

      for (const bed of formDataItem.bed_layout) {
        // console.log("bed formdata : ", bed);
        const payload = {
          id_hotel_bed: bed.id_hotel_bed,
          id_hotel_layout: data.id_hotel_layout,
          bed_type: bed.bed_type,
          amount: bed.amount,
          soft_delete: bed.soft_delete,
        }
        const { status: statusBed, data: dataBed, ok: okBed, error: errorBed } = await callAPI('/hotel-layout/bed/store', 'POST', payload, true);
        console.log(statusBed, dataBed, okBed, errorBed);
      }

      if (ok) {
        // console.log("Success API handle submit store new room layout store", data);
        successfulSubmissions++;

        // If all items have been successfully submitted, execute the callback function
        if (successfulSubmissions === totalItems) {
          onActionForm();
        }
      } else {
        // console.log("Fail to handle submit post API store new room layout store", data);
      }
    }
  };

  // Define bedTypeOptions array with bed type options
  const bedTypeOptions = [
    'Single',
    'Double',
    'Twin',
    'Twin/Double',
    'Triple',
    'Quad',
    'Family',
    'Suite',
  ];

  const addNewRoom = () => {
    const newRoomId = rooms.length + 1;
    setRooms([...rooms, { id: newRoomId, bedCount: 1 }]);

    // Determine the room name for the new room
    const newRoomName = roomNameValue || ''; // Use roomNameValue if it has a value, otherwise use an empty string

    // Add a new entry to the formData array for the new room
    setFormData((prevData) => [
      ...prevData,
      {
        id_hotel_layout: null,
        id_hotel: id_hotel,
        room_name: newRoomName,
        room_type: '',
        number_of_room: 1,
        smoking_policy: '-',
        guest_count: 1,
        room_size: '',
        price: '',
        soft_delete: 0,
        bed_layout: [
          {
            id_hotel_bed: null,
            id_hotel_bed_form: `new_bed_${Date.now()}`, // Use a unique identifier
            bed_type: 'Single', // Fixed bed type
            amount: 1, // Fixed amount
            soft_delete: 0,
          }, // Initialize with default values
        ],
      },
    ]);

    console.log('updated formData : ', formData);
  };

  const updateFormData = (roomId, data) => {
    setFormData((prevData) =>
      prevData.map((item, index) =>
        index === roomId - 1 ? { ...item, ...data } : item
      )
    );

    console.log('updated formData : ', formData);
  };

  const removeRoom = (roomId) => {
    if (roomId === 1) {
      return;
    }

    // Update the soft_delete property to 1 instead of removing the room
    const updatedFormData = formData.map((data, index) =>
      index === roomId - 1 ? { ...data, soft_delete: 1 } : data
    );

    setFormData(updatedFormData);
    console.log('updated formData : ', formData);
  };

  const addBedSection = (roomId) => {
    setFormData((prevData) => {
      return prevData.map((roomData, index) => {
        if (index === roomId - 1) {
          // Clone the roomData object and bed_layout array
          const updatedRoomData = { ...roomData };
          const updatedBedLayout = [...(updatedRoomData.bed_layout || [])];

          // Add a new bed section with default values
          updatedBedLayout.push({
            id_hotel_bed: null,
            id_hotel_bed_form: `new_bed_${Date.now()}`, // Use a unique identifier
            id_hotel_layout: updatedRoomData.id_hotel_layout,
            bed_type: 'Single', // Fixed bed type
            amount: 1, // Fixed amount
            soft_delete: 0,
          });

          // Update the bed_layout array in the roomData
          updatedRoomData.bed_layout = updatedBedLayout;

          return updatedRoomData;
        }
        return roomData;
      });
    });
  };


  const updateHotelBedData = (roomId, bedIndex, data) => {
    console.log('Updating bed data for room:', roomId, 'bedIndex:', bedIndex, 'data:', data);

    setFormData((prevData) =>
      prevData.map((roomData, index) =>
        index === roomId - 1
          ? {
            ...roomData,
            bed_layout: roomData.bed_layout.map((bedData) =>
              bedData.id_hotel_bed_form === bedIndex
                ? { ...bedData, ...data }
                : bedData
            ),
          }
          : roomData
      )
    );
    console.log('updated formData : ', formData);
  };


  const renderBedSections = (roomId) => {
    const roomData = formData[roomId - 1];
    if (!roomData) return null;

    const filteredBedLayout = roomData.bed_layout.filter((bedData) => bedData.soft_delete !== 1);

    return filteredBedLayout.map((bedData, bedIndex) => {
      // Generate a unique key for the bed section based on id_hotel_bed or a fallback value
      const bedKey = bedData.id_hotel_bed_form;

      return (
        <>
          <div className="admin-partner__popup-edit-label--wrapper" key={`bed_${bedKey}`}>
            <div className="admin-partner__popup-edit-label admin-partner__popup-edit-label--dropdown">
              <label htmlFor={`edit_room_type_${roomId}_bed_type_${bedKey}`} className="admin-partner__popup-edit-caption">
                Bed type
              </label>
              <select
                id={`edit_room_type_${roomId}_bed_type_${bedKey}`}
                name={`edit_room_type_${roomId}_bed_type_${bedKey}`}
                className="form-select goform-select admin-partner__popup-edit-dropdown"
                aria-label={`Bed type for Room ${roomId}`}
                value={bedData.bed_type}
                onChange={(e) => updateHotelBedData(roomId, bedKey, { bed_type: e.target.value })}
              >
                {bedTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-partner__popup-edit-label admin-partner__popup-edit-label--dropdown">
              <label htmlFor={`edit_room_type_${roomId}_amount_${bedKey}`} className="admin-partner__popup-edit-caption">
                Number of bed
              </label>
              <select
                id={`edit_room_type_${roomId}_amount_${bedKey}`}
                name={`edit_room_type_${roomId}_amount_${bedKey}`}
                className="form-select goform-select"
                aria-label="star rating select"
                value={bedData.amount}
                onChange={(e) => updateHotelBedData(roomId, bedKey, { amount: e.target.value })}
              >
                {Array.from({ length: 10 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="button" className="admin-partner__popup-btn-delete" onClick={() => deleteBedSection(roomId, bedData.id_hotel_bed)}>Delete</button>
        </>
      );
    });
  };

  const deleteBedSection = (roomId, bedId) => {
    setFormData((prevData) => {
      return prevData.map((roomData) =>
        roomData.id_hotel_layout === roomId
          ? {
            ...roomData,
            bed_layout: roomData.bed_layout.map((bedData) =>
              bedData.id_hotel_bed === bedId
                ? bedData.id_hotel_bed === null
                  ? null // Delete the entire bed section by setting it to null
                  : { ...bedData, soft_delete: 1 } // Set soft_delete to 1 for non-null id_hotel_bed
                : bedData
            ).filter((bedData) => bedData !== null), // Remove null bed sections
          }
          : roomData
      );
    });
  };



  const updateAllRoomNames = (newRoomName) => {
    setFormData((prevData) =>
      prevData.map((item) => ({
        ...item,
        room_name: newRoomName,
      }))
    );
  };

  // Function to handle changes in the room name input
  const handleRoomNameChange = (e) => {
    const newRoomName = e.target.value;
    setRoomNameValue(newRoomName); // Update the state variable
    updateAllRoomNames(newRoomName); // Call the function to update formData
  };

  return (
    <>
      <div className="modal fade" id="editModal" tabIndex={-1} aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal admin-partner__add-modal">
          <div className="modal-content admin-partner__add-modal-content">
            <div className="admin-partner__popup-edit">
              <div className="admin-partner__popup-edit-content">
                <h5>Edit</h5>
                <div className="admin-partner__popup-add-label">
                  <label htmlFor="room_name" className="admin-partner__popup-edit-caption">Category Name</label>
                  <input name="room_name" type="text" placeholder="Standard Room" className="form-control goform-input admin-partner__popup-edit-input" id="room_name" value={roomNameValue} onChange={handleRoomNameChange} />
                </div>
                {rooms.filter((room) => formData[room.id - 1]?.soft_delete !== 1).map((room) => (
                  <div className="admin-partner__popup-edit-wrapper" key={`room_${room.id}`}>
                    <div className="admin-partner__popup-edit-title">
                      <p className="admin-partner__property-content-title--md">Room {room.id}</p>
                      {room.id !== 1 && ( // Allow removal of rooms except the first one
                        <button type="button" className="admin-partner__popup-btn-delete" onClick={() => removeRoom(room.id)} >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`edit_room_type_${room.id}`} className="admin-partner__popup-edit-caption">Room Name</label>
                      <input type="text" placeholder="Double or Twin Room" className="form-control goform-input  admin-partner__popup-edit-input" id={`edit_room_type_${room.id}`} name={`edit_room_type_${room.id}`} value={formData[room.id - 1]?.room_type} onChange={(e) => updateFormData(room.id, { room_type: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`edit_room_type_${room.id}_total`} className="admin-partner__popup-edit-caption">Number of Room</label>
                      <input type="number" min={0} placeholder="15" className="form-control goform-input admin-partner__popup-edit-input" id={`edit_room_type_${room.id}_total`} name={`edit_room_type_${room.id}_total`} value={formData[room.id - 1]?.number_of_room} onChange={(e) => updateFormData(room.id, { number_of_room: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`edit_room_type_${room.id}_size`} className="admin-partner__popup-edit-caption">Room Size</label>
                      <input type="text" min={0} placeholder="20 meters" className="form-control goform-input  admin-partner__popup-edit-input" id={`edit_room_type_${room.id}_size`} name={`edit_room_type_${room.id}_size`} value={formData[room.id - 1]?.room_size} onChange={(e) => updateFormData(room.id, { room_size: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`edit_room_type_${room.id}_price`} className="admin-partner__popup-edit-caption">Price</label>
                      <input type="number" min={0} placeholder="200" className="form-control goform-input admin-partner__popup-edit-input" id={`edit_room_type_${room.id}_price`} name={`edit_room_type_${room.id}_price`} value={formData[room.id - 1]?.price} onChange={(e) => updateFormData(room.id, { price: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    {/* Render the bed sections for this room */}
                    {renderBedSections(room.id)}
                    {/* Button to add a new bed section for this room */}
                    <button type="button" className="admin-partner__popup-add-btn" onClick={() => addBedSection(room.id)}>
                      <SVGIcon src={Icons.Plus} width={16} height={16} className="admin-partner__summary-header-icon" color="#1CB78D" />
                      <p className="admin-partner__popup-add-btn-text">Add bed</p>
                    </button>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-edit-label">
                      <label htmlFor={`edit_room_type_${room.id}_guest_count`} className="admin-partner__popup-edit-caption">Guest Number</label>
                      <select id={`edit_room_type_${room.id}_guest_count`} name={`edit_room_type_${room.id}_guest_count`} className="form-select goform-select" aria-label="star rating select" value={formData[room.id - 1]?.guest_count} onChange={(e) => updateFormData(room.id, { guest_count: e.target.value })}>
                        {Array.from({ length: 10 }, (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" name="allroomCheckOptions" id="allroomCheck" />
                      <label className="form-check-label" htmlFor="allroomCheck">Set as Refundable</label>
                    </div>
                  </div>
                ))}
                {/* Button to add a new room */}
                <button type="button" className="admin-partner__popup-add-btn admin-partner__popup-add-btn--center" onClick={addNewRoom}>
                  <SVGIcon src={Icons.Plus} width={16} height={16} className="admin-partner__summary-header-icon" color="#1CB78D" />
                  <p className="admin-partner__popup-add-btn-text">Add new room</p>
                </button>
              </div>
              <div className="admin-partner__popup-button-bar">
                <button data-bs-dismiss="modal" type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--outline-green">
                  Cancel
                </button>
                <button data-bs-dismiss="modal" onClick={handleSubmitStore} type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--fill-green">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PopupAdd = ({ onActionForm }) => {
  const router = useRouter();
  const { id_hotel } = router.query;

  const [formData, setFormData] = useState([
    {
      id_hotel_layout: null,
      id_hotel: id_hotel,
      room_name: '',
      room_type: '',
      number_of_room: 1,
      smoking_policy: '-',
      guest_count: 1,
      room_size: '',
      price: '',
      bed_layout: [
        { bed_type: 'Single', amount: 1 }, // Initialize with default values
      ],
    },
  ]);

  const handleSubmitStore = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const totalItems = formData.length;
    let successfulSubmissions = 0;

    try {
      // Loop through each item in formData and submit it to the API
      for (const formDataItem of formData) {
        const { status, data, ok, error } = await callAPI('/hotel-layout/store-v2', 'POST', formDataItem, true);
        console.log(status, data, ok, error);

        if (ok) {
          console.log("Success API handle submit store new room layout store", status, data, ok, error);
          successfulSubmissions++;

          // If all items have been successfully submitted, execute the callback function
          if (successfulSubmissions === totalItems) {
            onActionForm();
          }
        } else {
          console.log("Fail to handle submit post API store new room layout store", status, data, ok, error);
        }
      }
    } catch (error) {
      console.error("Error occurred while submitting data:", error);
    }
  };



  const [rooms, setRooms] = useState([{ id: 1, bedCount: 1 }]);

  // Define bedTypeOptions array with bed type options
  const bedTypeOptions = [
    'Single',
    'Double',
    'Twin',
    'Twin/Double',
    'Triple',
    'Quad',
    'Family',
    'Suite',
  ];

  const addNewRoom = () => {
    const newRoomId = rooms.length + 1;
    setRooms([...rooms, { id: newRoomId, bedCount: 1 }]);

    // Determine the room name for the new room
    const newRoomName = roomNameValue || ''; // Use roomNameValue if it has a value, otherwise use an empty string

    // Add a new entry to the formData array for the new room
    setFormData((prevData) => [
      ...prevData,
      {
        id_hotel_layout: null,
        id_hotel: id_hotel,
        room_name: newRoomName,
        room_type: '',
        number_of_room: 1,
        smoking_policy: '-',
        guest_count: 1,
        room_size: '',
        price: '',
        bed_layout: [
          { bed_type: 'Single', amount: 1 }, // Initialize with default values
        ],
      },
    ]);

    console.log('updated formData : ', formData);
  };

  const updateFormData = (roomId, data) => {
    setFormData((prevData) =>
      prevData.map((item, index) =>
        index === roomId - 1 ? { ...item, ...data } : item
      )
    );

    console.log('updated formData : ', formData);
  };

  const removeRoom = (roomId) => {
    if (roomId === 1) {
      return;
    }

    // Filter out the room to be removed from both rooms and formData
    const updatedRooms = rooms.filter((room) => room.id !== roomId);
    const updatedFormData = formData.filter((_, index) => index !== roomId - 1);

    setRooms(updatedRooms);
    setFormData(updatedFormData);
  };

  const addBedSection = (roomId) => {
    setFormData((prevData) =>
      prevData.map((roomData, index) =>
        index === roomId - 1
          ? {
            ...roomData,
            bed_layout: [
              ...(roomData.bed_layout || []),
              { bed_type: 'Single', amount: 1 }, // Initialize with default values
            ],
          }
          : roomData
      )
    );
  };

  const updateHotelBedData = (roomId, bedIndex, data) => {
    setFormData((prevData) =>
      prevData.map((roomData, index) =>
        index === roomId - 1
          ? {
            ...roomData,
            bed_layout: roomData.bed_layout.map((bedData, i) =>
              i === bedIndex ? { ...bedData, ...data } : bedData
            ),
          }
          : roomData
      )
    );
  };

  const renderBedSections = (roomId) => {
    const roomData = formData[roomId - 1];
    if (!roomData) return null;

    return roomData.bed_layout.map((bedData, bedIndex) => (
      <div className="admin-partner__popup-edit-label--wrapper" key={`bed_${bedIndex}`}>
        <div className="admin-partner__popup-edit-label admin-partner__popup-edit-label--dropdown">
          <label htmlFor={`room_type_${roomId}_bed_type_${bedIndex + 1}`} className="admin-partner__popup-edit-caption">
            Bed type
          </label>
          <select
            id={`room_type_${roomId}_bed_type_${bedIndex + 1}`}
            name={`room_type_${roomId}_bed_type_${bedIndex + 1}`}
            className="form-select goform-select admin-partner__popup-edit-dropdown"
            aria-label={`Bed type for Room ${roomId}`}
            value={bedData.bed_type}
            onChange={(e) => updateHotelBedData(roomId, bedIndex, { bed_type: e.target.value })}
          >
            {bedTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-partner__popup-edit-label admin-partner__popup-edit-label--dropdown">
          <label htmlFor={`room_type_${roomId}_amount_${bedIndex + 1}`} className="admin-partner__popup-edit-caption">
            Number of bed
          </label>
          <select
            id={`room_type_${roomId}_amount_${bedIndex + 1}`}
            name={`room_type_${roomId}_amount_${bedIndex + 1}`}
            className="form-select goform-select"
            aria-label="star rating select"
            value={bedData.amount}
            onChange={(e) => updateHotelBedData(roomId, bedIndex, { amount: e.target.value })}
          >
            {Array.from({ length: 10 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    ));
  };

  const updateAllRoomNames = (newRoomName) => {
    setFormData((prevData) =>
      prevData.map((item) => ({
        ...item,
        room_name: newRoomName,
      }))
    );
  };

  // Add a state variable to track the room name value
  const [roomNameValue, setRoomNameValue] = useState(null);

  // Function to handle changes in the room name input
  const handleRoomNameChange = (e) => {
    const newRoomName = e.target.value;
    setRoomNameValue(newRoomName); // Update the state variable
    updateAllRoomNames(newRoomName); // Call the function to update formData
  };

  return (
    <>
      <div className="modal fade" id="addModal" tabIndex={-1} aria-labelledby="addModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal admin-partner__add-modal">
          <div className="modal-content admin-partner__add-modal-content">
            <div className="admin-partner__popup-edit">
              <div className="admin-partner__popup-edit-content">
                <h5>Add New</h5>
                <div className="admin-partner__popup-add-label">
                  <label htmlFor="room_name" className="admin-partner__popup-edit-caption">Category Name</label>
                  <input name="room_name" type="text" placeholder="Standard Room" className="form-control goform-input admin-partner__popup-edit-input" id="room_name" value={roomNameValue} onChange={handleRoomNameChange} />
                </div>
                {rooms.map((room) => (
                  <div className="admin-partner__popup-edit-wrapper" key={`room_${room.id}`}>
                    <div className="admin-partner__popup-edit-title">
                      <p className="admin-partner__property-content-title--md">Room {room.id}</p>
                      {room.id !== 1 && ( // Allow removal of rooms except the first one
                        <button type="button" className="admin-partner__popup-btn-delete" onClick={() => removeRoom(room.id)} >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`room_type_${room.id}`} className="admin-partner__popup-edit-caption">Room Name</label>
                      <input type="text" placeholder="Double or Twin Room" className="form-control goform-input  admin-partner__popup-edit-input" id={`room_type_${room.id}`} name={`room_type_${room.id}`} value={formData[room.id - 1].room_type} onChange={(e) => updateFormData(room.id, { room_type: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`room_type_${room.id}_total`} className="admin-partner__popup-edit-caption">Number of Room</label>
                      <input type="number" min={0} placeholder="15" className="form-control goform-input admin-partner__popup-edit-input" id={`room_type_${room.id}_total`} name={`room_type_${room.id}_total`} value={formData[room.id - 1].number_of_room} onChange={(e) => updateFormData(room.id, { number_of_room: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`room_type_${room.id}_size`} className="admin-partner__popup-edit-caption">Room Size</label>
                      <input type="text" min={0} placeholder="20 meters" className="form-control goform-input  admin-partner__popup-edit-input" id={`room_type_${room.id}_size`} name={`room_type_${room.id}_size`} value={formData[room.id - 1].room_size} onChange={(e) => updateFormData(room.id, { room_size: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-add-label">
                      <label htmlFor={`room_type_${room.id}_price`} className="admin-partner__popup-edit-caption">Price</label>
                      <input type="number" min={0} placeholder="200" className="form-control goform-input admin-partner__popup-edit-input" id={`room_type_${room.id}_price`} name={`room_type_${room.id}_price`} value={formData[room.id - 1].price} onChange={(e) => updateFormData(room.id, { price: e.target.value })} />
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    {/* Render the bed sections for this room */}
                    {renderBedSections(room.id)}
                    {/* Button to add a new bed section for this room */}
                    <button type="button" className="admin-partner__popup-add-btn" onClick={() => addBedSection(room.id)}>
                      <SVGIcon src={Icons.Plus} width={16} height={16} className="admin-partner__summary-header-icon" color="#1CB78D" />
                      <p className="admin-partner__popup-add-btn-text">Add bed</p>
                    </button>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="admin-partner__popup-edit-label">
                      <label htmlFor={`room_type_${room.id}_guest_count`} className="admin-partner__popup-edit-caption">Guest Number</label>
                      <select id={`room_type_${room.id}_guest_count`} name={`room_type_${room.id}_guest_count`} className="form-select goform-select" aria-label="star rating select" value={formData[room.id - 1].guest_count} onChange={(e) => updateFormData(room.id, { guest_count: e.target.value })}>
                        {Array.from({ length: 10 }, (_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="admin-partner__popup-edit-separator"></div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" name="allroomCheckOptions" id="allroomCheck" />
                      <label className="form-check-label" htmlFor="allroomCheck">Set as Refundable</label>
                    </div>
                  </div>
                ))}
                {/* Button to add a new room */}
                <button type="button" className="admin-partner__popup-add-btn admin-partner__popup-add-btn--center" onClick={addNewRoom}>
                  <SVGIcon src={Icons.Plus} width={16} height={16} className="admin-partner__summary-header-icon" color="#1CB78D" />
                  <p className="admin-partner__popup-add-btn-text">Add new room</p>
                </button>
              </div>
              <div className="admin-partner__popup-button-bar">
                <button data-bs-dismiss="modal" type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--outline-green">
                  Cancel
                </button>
                <button data-bs-dismiss="modal" onClick={handleSubmitStore} type="button" className="admin-partner__room-btn--popup btn btn-md goform-button--fill-green">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const PopupDelete = ({ hotelLayout, onActionForm }) => {
  console.log("hotelLayout Cancel Modal : ", hotelLayout);

  const handleSubmitDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    //Forms Data for Delete Room Layout
    const formDataDelete = {
      id_hotel_layout: hotelLayout?.id_hotel_layout,
      soft_delete: 1,
    };

    const { status, data, ok, error } = await callAPI('/hotel-layout/store', 'POST', formDataDelete, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit delete room layout store ", status, data, ok, error);
      // Call the onActionForm callback here
      onActionForm();
    } else {
      console.log("fail to handle submit post api delete room layout store   ", status, data, ok, error);
    }
  };

  return (
    <>
      <div className="modal fade" id="cancelationModal" tabIndex={-1} aria-labelledby="cancelationModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal">
          <div className="modal-content cancelation__modal-body">
            <div className="cancelation__modal-content">
              <div className="cancelation__modal-image">
                <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
              </div>
              <div className="cancelation__modal-text">
                <h3>Delete Room</h3>
                <p className="cancelation__modal-desc">Deleted rooms cannot be returned, do you really want to delete it ?</p>
              </div>
            </div>
            <div className="cancelation__modal-footer">
              <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
              <button data-bs-dismiss="modal" onClick={handleSubmitDelete} className="btn btn-lg goform-button--fill-red cancelation__modal-button">Confirm Delete</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
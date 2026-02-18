import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import styles from "./index.module.scss";
import Layout from "@/components/layout";
import Navbar from "@/components/layout/navbar";
import LayoutForm from "@/components/pages/business/hotel/registration/layout";
import SVGIcon from "@/components/elements/icons";
import { BlurPlaceholderImage } from "@/components/elements/images";
import alertInfo from "@/assets/images/alert_info.svg";
import { Icons } from "@/types/enums";
import { callAPI } from "@/lib/axiosHelper";
import CustomDropzone from "@/components/dropzone";
import useFetch from "@/hooks/useFetch";
import { set } from "react-hook-form";
import LoadingOverlay from "@/components/loadingOverlay";
import { cA } from "@fullcalendar/core/internal-common";

const HeaderAllocation = () => {
  return (
    <header>
      <div className="car-dashboard__header">
        <div className="container car-dashboard__content-header">
          <Link
            className="d-flex gap-2 align-items-center"
            href={"/business/hotel/room"}
          >
            <SVGIcon
              src={Icons.ArrowLeft}
              width={24}
              height={24}
              color="#1CB78D"
            />
            <h4 className="car-dashboard__content-title-heading">Edit Room</h4>
          </Link>
        </div>
      </div>
    </header>
  );
};

const Photos = () => {
  const [isRemoveShow, setIsRemoveShow] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [images, setImages] = useState([]);
  const [removePhoto, setRemovePhoto] = useState([]);
  const [idHotel, setIdHotel] = useState(null);
  const [roomType, setRoomType] = useState("");
  const [hotelBed, setHotelBed] = useState([]);
  const [guestCount, setGuestCount] = useState(1);
  const [loading, setLoading] = useState(false);

  // For Add Bed
  const [showAddBed, setShowAddBed] = useState(false)

  const amenityNames = [
    "Air conditioning",
    "Bathub",
    "Spa tub",
    "Flat-screen TV",
    "Electric kattle",
    "Balcony",
    "View",
    "Terrace",
  ];
  const router = useRouter();
  const id_hotel_layout = router.query.id_hotel_layout;

  const handleRemoveShow = () => {
    setIsRemoveShow(!isRemoveShow);
  };

  const dropzoneOptions = {
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 10,
    maxSize: 10000000,
    multiple: true,
    onDropAccepted: useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onloadend = () => {
          setImages((prevState) => [
            ...prevState,
            { name: file?.name || "", url: reader.result.toString() },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }, []),
  };
  const {
    getRootProps: getRootPropsImages2,
    getInputProps: getInputPropsImages2,
  } = useDropzone(dropzoneOptions);

  useEffect(() => {
    if (!id_hotel_layout) {
      return;
    }

    const getDataHotel = async () => {
      const { ok, error, data } = await callAPI(
        `/hotel-layout/show-v3`,
        "POST",
        { id_hotel_layout: id_hotel_layout },
        true
      );
      if (error) {
        console.log("Error get data hotel: ", error);
      }
      if (ok) {
        setIdHotel(data.id_hotel)
        setRoomType(data.room_type);
        setHotelBed(data.hotel_bed);
        setGuestCount(data.guest_count);
        const initialSelectedAmenities = data.amenities.map(
          (amenity) => amenity.amenities_name
        );
        setSelectedAmenities(initialSelectedAmenities);

        // Extracting photo URLs from data.hotel_layout_photo
        const initialImages = data.hotel_layout_photo.map((photo) => ({
          id: photo.id_hotel_layout_photo,
          url: photo.photo,
        }));
        setImages(initialImages);
      }
    };

    getDataHotel();
  }, [id_hotel_layout]);

  const handleGuestCountChange = (e) => {
    setGuestCount(e.target.value);
  };

  const handleBedTypeChange = (index, value) => {
    const updatedBed = [...hotelBed];
    updatedBed[index].bed_type = value;
    setHotelBed(updatedBed);
  };

  const handleBedAmountChange = (index, value) => {
    const updatedBed = [...hotelBed];
    updatedBed[index].amount = value;
    setHotelBed(updatedBed);
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prevAmenities) => {
      if (prevAmenities.includes(amenity)) {
        return prevAmenities.filter((item) => item !== amenity);
      } else {
        return [...prevAmenities, amenity];
      }
    });
  };




  const handleAddBedTypeChange = (index, event) => {
    const updatedHotelBed = [...hotelBed];
    updatedHotelBed[index].bed_type = event.target.value;
    setHotelBed(updatedHotelBed);
  };

  const handleAddAmountChange = (index, event) => {
    const updatedHotelBed = [...hotelBed];
    updatedHotelBed[index].amount = event.target.value;
    setHotelBed(updatedHotelBed);
  };

  const addNewBed = () => {
    setShowAddBed(true)
    setHotelBed([
      ...hotelBed,
      {
        "id_hotel_layout": id_hotel_layout,
        "bed_type": "Single bed",
        "amount": "1"
      }
    ]);
  };


  if (loading) {
    return <LoadingOverlay />
  }
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!idHotel) {
      return
    }
    setLoading(true);
    e.preventDefault();

    const photos = images.map(({ url }) => url);

    const payload = {
      photos,
      roomType,
      hotelBed,
      guestCount,
      selectedAmenities,
      removePhoto,
    };

    const { ok: photoRemoveOk, error: photoRemoveError } = await callAPI(
      "/hotel-layout-photo/delete-v2",
      "POST",
      { id_hotel_layout_photo: payload.removePhoto },
      true
    );

    const { ok: photoOk, error: photoError } = await callAPI(
      "/hotel-layout-photo/store",
      "POST",
      {
        id_hotel_layout: id_hotel_layout,
        photos: payload.photos,
      },
      true
    );

    const { ok, error, data } = await callAPI(
      `/hotel-layout/store-v3`,
      "POST",
      {
        id_hotel_layout: id_hotel_layout,
        id_hotel: idHotel,
        room_type: payload.roomType,
        guest_count: payload.guestCount,
        bed_layout: payload.hotelBed,
        amenities: payload.selectedAmenities,
        soft_delete: 0,
      },
      true
    );

    if (error) {
      setLoading(false);
      console.log(error);
    }
    if (ok) {
      setLoading(false);
      router.push('/business/hotel/room')
      alert(`Success updated for ${payload.roomType}`);
    }
  };

  const onCancel = () => {
    router.push('/business/hotel/room')
  }

  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <div className="hotel-registration">
        <HeaderAllocation />
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="hotel-registration__content-container">
                <form onSubmit={onFormSubmit}>
                  <div className="hotel-registration__content-form">
                    <div className="admin-property-business__form-header">
                      <p className="admin-property-business__content-form-title admin-property-business__content-form-title--image">
                        Image
                      </p>
                      <div className="admin-property-business__content-btn">
                        {images.length > 0 ? (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={handleRemoveShow}
                          >
                            {isRemoveShow ? "Cancel" : "Remove"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm disabled"
                            style={{ opacity: "0.5 !important" }}
                          >
                            Remove
                          </button>
                        )}
                        <div>
                          {images.length > 0 ? (
                            <div
                              {...getRootPropsImages2()}
                              className="dropzone-edit-room"
                            >
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-outline-success btn-sm"
                                >
                                  <span>Add Photos</span>
                                </button>
                              </div>
                              <input {...getInputPropsImages2()} />
                            </div>
                          ) : (
                            <>
                              <label
                                className="btn btn-outline-success btn-sm disabled"
                                htmlFor="addPhotosLabel"
                                style={{ opacity: "0.5 !important" }}
                              >
                                Add Photos
                              </label>
                              <input type="file" id="addPhotosLabel" hidden />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 24 }}>
                      {images.length > 0 ? (
                        <div style={{ display: "none" }}>
                          <CustomDropzone
                            images={images}
                            setImages={setImages}
                          />
                        </div>
                      ) : (
                        <CustomDropzone images={images} setImages={setImages} />
                      )}
                      <div className="admin-property-business wrapper">
                        {!!images.length && (
                          <div className="uploadedImages">
                            {images.map(({ id, url }, index) => (
                              <div key={index} className="column">
                                <div
                                  className="image"
                                  style={{ backgroundImage: `url('${url}')` }}
                                >
                                  {isRemoveShow && (
                                    <>
                                      <div
                                        onClick={() => {
                                          setImages(
                                            images.filter((_, i) => i !== index)
                                          );
                                          setRemovePhoto((prevRemovedPhoto) => [
                                            ...prevRemovedPhoto,
                                            id,
                                          ]);
                                        }}
                                        className="removeButton"
                                      >
                                        <SVGIcon
                                          src={Icons.CloseIcon}
                                          width={12}
                                          height={12}
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>

                <div className="hotel-registration__content-form">
                  <p className="admin-property-business__content-form-title">
                    Room Type
                  </p>
                  <div className="admin-property-business__form-wrapper">
                    {/* <div className="admin-property-business__form-content-wrapper">
                      <label htmlFor="streetAddress" className="form-label goform-label">Category Name</label>
                      <select name="country" id="" className='w-100 admin-property-business__content-form-select'>
                        <option value="">Standard Room</option>
                        <option value="">King Room</option>
                        <option value="">Queen Room</option>
                      </select>
                    </div>  */}
                    <div className="admin-property-business__form-content-wrapper">
                      <label
                        htmlFor="streetAddress"
                        className="form-label goform-label"
                      >
                        Room Name
                      </label>
                      <input
                        type="text"
                        name="roomName"
                        className="form-control"
                        value={roomType}
                        onChange={(e) => {
                          setRoomType(e.target.value);
                        }}
                      />
                    </div>
                    <div className="admin-property-business__content-separator"></div>
                    <div className="admin-property-business__form-wrapper row d-flex align-items-center">
                      <div className="admin-property-business__content-form-wrapper">
                        <div className="admin-property-business__form-content-wrapper w-100">
                          <label
                            htmlFor="bedType"
                            className="form-label goform-label"
                          >
                            Bed type
                          </label>
                          {hotelBed.map((bed, index) => (
                            <select
                              name="bedType"
                              id={`bedType-${index}`}
                              className="w-100 admin-property-business__content-form-select mb-2"
                              key={index}
                              value={bed.bed_type}
                              onChange={(e) =>
                                handleBedTypeChange(index, e.target.value)
                              }
                            >
                              <option value="Single bed">Single Bed</option>
                              <option value="Double bed">Double Bed</option>
                              <option value="Triple bed">Triple Bed</option>
                            </select>
                          ))}

                        </div>
                        <div className="admin-property-business__form-content-wrapper w-100">
                          <label
                            htmlFor="bedType"
                            className="form-label goform-label"
                          >
                            Number of bed
                          </label>
                          {hotelBed.map((bed, index) => (
                            <select
                              name="bedAmount"
                              id={`bedAmount-${index}`}
                              className="w-100 admin-property-business__content-form-select mb-2"
                              key={index}
                              value={bed.amount}
                              onChange={(e) =>
                                handleBedAmountChange(index, e.target.value)
                              }
                            >
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                            </select>
                          ))}

                        </div>
                      </div>
                      {!hotelBed.length && !showAddBed &&
                        <p className="text-center">
                          Bed Not Found
                        </p>
                      }

                      <button
                        type="button"
                        className="admin-property-business__form-btn"
                        onClick={addNewBed}
                      >
                        <SVGIcon
                          src={Icons.Plus}
                          width={16}
                          height={16}
                          color="#1CB78D"
                        />
                        Add Bed
                      </button>
                    </div>

                    <div className="admin-property-business__content-separator"></div>
                    <div className="admin-property-business__form-content-wrapper">
                      <label
                        htmlFor="guestCount"
                        className="form-label goform-label"
                      >
                        Guest Number
                      </label>
                      <select
                        value={guestCount}
                        onChange={handleGuestCountChange}
                        name="guestCount"
                        id="guestCount"
                        className="w-100 admin-property-business__content-form-select"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="hotel-registration__content-form">
                  <p className="hotel-registration__content-form-title">
                    Amenities
                  </p>
                  <div className="hotel-registration__content-inner">
                    <p className="hotel-registration__content-inner-title">
                      Most requested by Guest
                    </p>
                    {amenityNames.map((amenity, index) => (
                      <div
                        key={`amenity-${index}`}
                        className="hotel-registration__content-inside"
                      >
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name={`amenity-${index}`}
                            id={`amenity-${index}`}
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`amenity-${index}`}
                          >
                            {amenity}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <div className="hotel-dashboard__button-list">
                      <button
                        type="button"
                        className="button goform-button goform-button--outline-green hotel-dashboard__button-list-item"
                        data-bs-toggle="modal"
                        data-bs-target="#CancelValidation"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="button goform-button goform-button--fill-green hotel-dashboard__button-list-item"
                        data-bs-toggle="modal"
                        data-bs-target="#SaveValidation"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalSaveValidation onConfirm={onFormSubmit} />
      <ModalCancelValidation onCancel={onCancel} />
    </Layout>
  );
};

const ModalSaveValidation = ({ onConfirm }) => {
  return (
    <div
      className="modal fade"
      id="SaveValidation"
      tabIndex={-1}
      aria-labelledby="SaveValidationLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-reservation__modal">
        <div className="modal-content admin-reservation__modal-content">
          <div className="admin-reservation__modal-wrapper">
            <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
              <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
            </div>
            <div className="company-detail__popup-contents">
              <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">
                Are you sure want to edit this room ?
              </h3>
              <p className="company-detail__content-caption--popup">
                If you agree, the room will be update immediately
              </p>
            </div>
          </div>
          <div className="company-detail__button-list-group row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <button
                type="button"
                data-bs-dismiss="modal"
                className="button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item"
              >
                Cancel
              </button>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <button
                onClick={onConfirm}
                type="button"
                data-bs-dismiss="modal"
                className="button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const ModalCancelValidation = ({ onCancel }) => {
  return (
    <div
      className="modal fade"
      id="CancelValidation"
      tabIndex={-1}
      aria-labelledby="CancelValidationLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cancelation__modal admin-reservation__modal">
        <div className="modal-content admin-reservation__modal-content">
          <div className="admin-reservation__modal-wrapper">
            <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
              <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
            </div>
            <div className="company-detail__popup-contents">
              <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">
                Are you sure you want to leave the editing room?
              </h3>
              <p className="company-detail__content-caption--popup">
                If you agree, the room will not be updated
              </p>
            </div>
          </div>
          <div className="company-detail__button-list-group row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <button
                type="button"
                data-bs-dismiss="modal"
                className="button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item"
              >
                Cancel
              </button>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <button
                onClick={onCancel}
                type="button"
                data-bs-dismiss="modal"
                className="button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Photos;

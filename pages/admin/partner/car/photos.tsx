import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import SVGIcon from "@/components/elements/icons";
import { Icons } from "@/types/enums";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { callAPI } from "@/lib/axiosHelper";
import { useRouter } from "next/router";
import LoadingOverlay from "@/components/loadingOverlay";
import { BlurPlaceholderImage } from "@/components/elements/images";
import placeholder from '@/public/images/placeholder.svg';
import { C } from "@fullcalendar/core/internal-common";

export default function PartnerCarPhotos() {
  return (
    <Layout>
      <AdminLayout pageTitle="Photos" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <PartnerCarPhotosContent />
          </div>
        </div>
      </AdminLayout>
    </Layout>
  );
}

interface CarFleetDataProps {
  id_car_business_fleet: number;
  id_fleet_photo: number;
  car_brand: string;
  edition: string;
  model: string;
  car_fleet_photo: any[];
  created_at: string;
  fuel_type: string;
  id_car_business: number;
  price: number;
  price_pay: number;
  quantity: number;
  rented_count: number;
  total_car: number;
  transmission: string;
}

const PartnerCarPhotosContent = () => {
  const router = useRouter();
  const { id: id_car_business } = router.query;

  const [carFleetData, setCarFleetData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showRemoveButton, setShowRemoveButton] = useState<boolean>(false);
  const [idCarFleet, setIdCarCleet] = useState<number>(null)
  const [photosToDelete, setPhotosToDelete] = useState<number[]>([]);
  const inputFileRef = useRef(null);

  console.log(photosToDelete)
  // console.log(carFleetData)


  useEffect(() => {
    const fetchCarFleetData = async () => {
      const { ok, data, error } = await callAPI('/admin-car-business/fleet-photo/show', 'POST', { id_car_business: id_car_business }, true);
      try {
        if (ok) {
          setCarFleetData(data);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchCarFleetData();
  }, [id_car_business]);

  const handleAddPhotosClick = (idCarFleet) => { // For add photos
    setIdCarCleet(idCarFleet) // Set idCarFleet

    // Trigger input file click to open file dialog
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }

  };

  const handleCancelButton = () => {
    setShowRemoveButton((prev) => !prev);
    window.location.reload()
  }

  const handleDeletePhotos = (idFleetPhoto) => {
    console.log("ID Fleet Photos : ", idFleetPhoto)

    if (!photosToDelete.includes(idFleetPhoto)) {
      // Add the ID to the photosToDelete array to deleted in handleSave
      setPhotosToDelete((prevPhotos) => [...prevPhotos, idFleetPhoto]);
    }

    // Update Data Locally
    setCarFleetData((prevData) => {
      const newCarData = prevData.map((car) => {
        const updatedCar = {
          ...car,
          car_fleet_photo: car.car_fleet_photo.filter(
            (photo) => photo.id_fleet_photo !== idFleetPhoto
          ),
        };

        console.log('Updated Car : ', updatedCar)
        return updatedCar;
      });

      console.log('New Car Data : ', newCarData);

      return newCarData;
    });

  };

  const handleRemoveButton = (idCarFleet) => {
    setShowRemoveButton((prev) => !prev);
  };

  const handleSave = async (idCarFleet) => {
    console.log('saved');
    try {
      // Construct the list of photo IDs to delete
      const clickedCarFleetData = carFleetData.find((car) => car.id_car_business_fleet === idCarFleet);
      const photoIdsToDelete = photosToDelete.map((id) => (id));

      // Delete photos
      const deleteRequests = photoIdsToDelete.map(async (photoId) => {
        console.log(`Deleting photo with ID: ${photoId}`);
        const response = await callAPI('/admin-car-business/fleet-photo/delete', 'POST', { id_fleet_photo: photoId }, true);

        if (response.ok) {
          console.log(`Successfully deleted photo with ID: ${photoId}`);
          window.location.reload()
        } else {
          console.error(`Failed to delete photo with ID: ${photoId}`);
        }
      });

      // Wait for all delete requests to complete
      await Promise.all(deleteRequests);

      // Update carFleetData after successful deletion
      setCarFleetData((prevData) => {
        const newCarData = [...prevData];
        const carIndex = newCarData.findIndex((car) => car.id_car_business_fleet === idCarFleet);
        console.log('car Index : ', carIndex)

        if (carIndex !== -1) {
          // Remove deleted photos from the local data
          newCarData[carIndex].car_fleet_photo = newCarData[carIndex].car_fleet_photo.filter(
            (photo) => !photoIdsToDelete.includes(photo.id_fleet_photo)
          );
        }

        return newCarData;
      });

      // Clear the photosToDelete array
      setPhotosToDelete([]);
    } catch (error) {
      console.error('Error deleting photos:', error);
    }
  };


  const handleFileInputChange = async (event, idCarFleet) => {
    const files = event.target.files;

    const formData = {
      id_car_business_fleet: idCarFleet,
      photos: [],
    };

    const promises = [];

    // Iterate over each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);

      const reader = new FileReader();

      promises.push(
        new Promise((resolve, reject) => {
          reader.onload = (e) => {
            const base64String = e.target.result;
            formData.photos.push(base64String);
            resolve(base64String);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          reader.readAsDataURL(file); // Read the current file as a data URL
        })
      );
    }

    try {
      await Promise.all(promises);

      // Call your API to upload images for the current car
      const { status, data, ok, error } = await callAPI('/admin-car-business/fleet-photo/store', 'POST', formData, true);

      if (ok) {
        console.log(`Success API call for car ${idCarFleet}`, status, data, ok, error);
        window.location.reload()
      } else {
        // Handle failure case here
        console.log(`Failed API call for car ${idCarFleet}`, status, data, ok, error);
      }
    } catch (error) {
      console.error('Error reading files:', error);
    }
  };


  return (
    <form action="#" className="admin-partner__basic">
      {isLoading ? (
        <LoadingOverlay />
      ) : (
        <>
          <PartnerCarPhotosName
            carFleetDatas={carFleetData}
            handleCancelButton={handleCancelButton}
            handleDeletePhotos={(idFleetPhoto) => handleDeletePhotos(idFleetPhoto)}
            handleRemoveButton={(photoId) => handleRemoveButton(photoId)}
            handleAddPhotosClick={handleAddPhotosClick}
            handleSave={(idCarFleet) => handleSave(idCarFleet)}
            isRemoveButton={showRemoveButton}

          />
          <PartnerPhotosForm
            carFleetData={carFleetData}
            idCarFleet={idCarFleet}
            inputFileRef={inputFileRef}
            handleFileInputChange={(event) => handleFileInputChange(event, idCarFleet)}
            handleAddPhotosClick={handleAddPhotosClick}
          />
          {/* <PartnerCarEditButtons /> */}
        </>
      )}
    </form>
  );
};

const PartnerCarPhotosName = (
  props: {
    carFleetDatas: CarFleetDataProps[];
    handleRemoveButton: (photoId: number) => void;
    handleDeletePhotos: (idFleetPhoto: number) => void;
    handleAddPhotosClick: (idCarFleet: number) => void;
    handleSave: (idCarFleet: number) => void;
    handleCancelButton: () => void;
    isRemoveButton: boolean;

  }) => {
  const { carFleetDatas, handleRemoveButton, handleDeletePhotos, handleAddPhotosClick, handleSave, handleCancelButton, isRemoveButton } = props;

  return (
    <div>
      <div className="admin-partner__basic-card">
        {carFleetDatas && carFleetDatas.length > 0 ? (
          carFleetDatas?.map((carFleetData, index) => (
            <CarFleetItem
              key={index}
              carFleetData={carFleetData}
              isRemoveButton={isRemoveButton}
              handleRemoveButton={handleRemoveButton}
              handleAddPhotosClick={handleAddPhotosClick}
              handleSave={handleSave}
              handleCancelButton={handleCancelButton}
              handleDeletePhotos={handleDeletePhotos}
            />
          ))
        ) : (
          <h5 className="d-flex justify-content-center align-items-center">
            Sorry, no car fleet data is available at the moment. We apologize for any inconvenience.
          </h5>
        )}
      </div>
    </div>
  );
};


// Car Fleet Item Component
const CarFleetItem = ({
  carFleetData,
  isRemoveButton,
  handleRemoveButton,
  handleAddPhotosClick,
  handleSave,
  handleCancelButton,
  handleDeletePhotos,
}) => {

  const [photos, setPhotos] = useState<any[]>(carFleetData?.car_fleet_photo);

  // Update photos when photos props changed
  useEffect(() => {
    setPhotos(carFleetData?.car_fleet_photo);
  }, [carFleetData?.car_fleet_photo]);

  const handleDelete = (id: number) => {
    setPhotos(photos.filter((photo) => photo.id_car_fleet_photo !== id));
    handleDeletePhotos(id);
  }

  return (
    <div className="admin-partner__photos" key={carFleetData.id_car_business_fleet}>
      <div>
        <div className="admin-partner__photos-header">
          <p className="admin-partner__photos-header-title">
            {carFleetData?.car_brand} {carFleetData?.model} {carFleetData?.edition}
          </p>
          {isRemoveButton ? (
            <div className="admin-partner__photos-header-buttons">
              <button type="button" className="btn btn-outline-danger" onClick={handleCancelButton}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => handleSave(carFleetData?.id_car_business_fleet)}
              >
                Save
              </button>
            </div>
          ) : (
            <div className="admin-partner__photos-header-buttons">
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleRemoveButton(carFleetData?.id_car_business_fleet)}
              >
                Remove
              </button>
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => handleAddPhotosClick(carFleetData?.id_car_business_fleet)}
              >
                Add Photos
              </button>
            </div>
          )}
        </div>
        <div className="admin-partner__photos-list">
          {photos.length > 0 ? (
            photos.map((car, photoIndex) => (
              <CarFleetPhoto
                key={photoIndex}
                photos={car}
                photoIndex={photoIndex}
                isRemoveButton={isRemoveButton}
                handleDeletePhotos={handleDelete}
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
      </div>
    </div>
  )
};

// Car Fleet Photo Component
const CarFleetPhoto = ({ photos, photoIndex, isRemoveButton, handleDeletePhotos }) => {
  const { photo, id_fleet_photo } = photos
  return (
    <div key={`photo-${photoIndex}`}>
      <div className="position-relative">
        <img
          src={photo || placeholder}
          data-id={photo || placeholder}
          className="admin-partner__detail-hotel__image-src"
          alt={`photo-${photoIndex}`}
          width={123}
          height={123}
        />
        <button
          className={`admin-partner__detail-hotel__image-button ${isRemoveButton ? 'show' : ''}`}
          type="button"
          onClick={() => {
            handleDeletePhotos(id_fleet_photo);
          }}
        >
          <SVGIcon src={Icons.Cancel} height={24} width={24} />
        </button>
      </div>
    </div>
  );
};


const PartnerPhotosForm = ({ carFleetData, inputFileRef, handleFileInputChange, handleAddPhotosClick, idCarFleet }) => {

  console.log('ID CAR FLEET : ', idCarFleet)

  return (
    <form action="#" className="d-none">
      <div key={carFleetData.id_car_business_fleet} className="form-group">
        <label htmlFor={`photos-${carFleetData.id_car_business_fleet}`}>Photos</label>
        <input
          type="file"
          className="form-control"
          id={`photos-${carFleetData.id_car_business_fleet}`}
          multiple
          accept="image/*"
          onChange={(event) => handleFileInputChange(event, idCarFleet)}
          ref={inputFileRef}
        />
        <button type="button" className="btn btn-outline-success" onClick={handleAddPhotosClick}>Add Photos</button>
      </div>
    </form>
  );
};

const PartnerCarEditButtons = () => {
  return (
    <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
      <Link href="/admin/partner/car/edit" className="btn btn-lg btn-outline-success">Cancel</Link>
      <Link href="/admin/partner/car/edit" className="btn btn-lg btn-success">Save</Link>
    </div>
  );
};





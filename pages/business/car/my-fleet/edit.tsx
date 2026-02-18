import Layout from '@/components/layout'
import React, { useEffect, useState, useRef } from 'react'
import Navbar from '@/components/business/car/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Link from 'next/link';
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconCheck from 'assets/images/icon_check_soft.svg'
import { callAPI } from '@/lib/axiosHelper';
import { useSession } from "next-auth/react"
import LoadingOverlay from '@/components/loadingOverlay';
import { useRouter } from 'next/router';
import SVGIcon from '@/components/elements/icons';
import { Icons } from '@/types/enums';
import placeholder from '@/public/images/placeholder.svg';

const EditFleet = () => {
   const router = useRouter()
   const { data: session, status } = useSession();
   const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null
   const id_car_business_fleet = router.query?.id_fleet

   const [errors, setErrors] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false)
   const [CarPhotos, setCarPhotos] = useState<any>([])
   const [isEditing, setIsEditing] = useState(false);
   const [photosToDelete, setPhotosToDelete] = useState<any>([]);
   const [carModel, setCarModel] = useState<any>([])
   const [filteredCarModel, setFilteredCarModel] = useState<any>([])
   const [formData, setFormData] = useState<any>({
      fuel_type: '',
      car_brand: '',
      model: '',
      edition: '',
      transmission: '',
      aircon: '',
      quantity: '',
      total_car: ''
   })

   const inputFileRef = useRef(null);


   useEffect(() => {
      if (formData.car_brand === '') return

      try {
         (async () => {
            const where = encodeURIComponent(JSON.stringify({
               "Make": {
                  "$exists": true
               }
            }));
            const response = await fetch(
               `https://parseapi.back4app.com/classes/Carmodels_Car_Model_List_${formData.car_brand}?count=1&limit=500&order=Model,Category,Year&excludeKeys=Make&where=${where}`,
               {
                  headers: {
                     'X-Parse-Application-Id': process.env.NEXT_PUBLIC_CAR_MODELS_ID, // This is your app's application id
                     'X-Parse-REST-API-Key': process.env.NEXT_PUBLIC_CAR_MODELS_KEY, // This is your app's REST API key
                  }
               }
            );
            const data = await response.json(); // Here you have the data that you need
            // console.log(`Car brand ${formData.car_brand} data: `, data);

            if (data.results) {
               setCarModel(data.results)
            }
         })();
      } catch (error) {
         console.log('Error: ', error);
      }
   }, [formData.car_brand])

   //filter same car model name
   useEffect(() => {
      if (!carModel) return

      const filteredCarModel = carModel.filter((car, index, self) =>
         index === self.findIndex((t) => (
            t.Model === car.Model
         ))
      )

      setFilteredCarModel(filteredCarModel)
   }, [carModel])


   //Photo Functionalities
   const handleAddPhotosClick = () => { // For add photos
      // Trigger input file click to open file dialog
      if (inputFileRef && inputFileRef.current) {
         inputFileRef.current.click();
      }
   };

   // Function to handle delete photo
   const handleDeletePhotos = (id_fleet_photo) => {
      setCarPhotos(CarPhotos.filter((photo) => photo.id_fleet_photo !== id_fleet_photo));
      setPhotosToDelete([...photosToDelete, id_fleet_photo]);
   }

   // console.log('photos to delete', photosToDelete);

   // Function to toggle editing mode
   const toggleEditing = () => {
      setIsEditing(!isEditing);
   };

   const toggleCancel = () => {
      setIsEditing(false);
      setPhotosToDelete([]);
      router.reload();
   }

   const handleFileInputChange = async (event) => {
      const files = event.target.files;

      const formData = {
         id_car_business_fleet: id_car_business_fleet,
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
         setIsLoading(true)
         await Promise.all(promises);

         const { status, data, ok, error } = await callAPI('/admin-car-business/fleet-photo/store', 'POST', formData, true);

         if (ok) {
            setIsLoading(false)
            router.reload();
         } else {
            // Handle failure case here
            console.log(`Failed API call for car`, status, data, ok, error);
         }
      } catch (error) {
         console.error('Error reading files:', error);
      }
   };

   // Function to handle save photo changes
   const handleSaveChanges = async () => {
      setIsLoading(true)
      try {
         const photoIdsToDelete = photosToDelete.map((id) => (id));

         //Delete photo
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

         await Promise.all(deleteRequests);
         setPhotosToDelete([]);
         setIsLoading(false)
      } catch (error) {
         console.error('Error deleting photos:', error);
      }
   }



   useEffect(() => {
      if (!id_car_business) return

      const payload = {
         id_car_business: id_car_business,
         id_car_business_fleet: id_car_business_fleet
      }

      const getDataFleet = async () => {
         try {
            setIsLoading(true)
            const { data, error, ok } = await callAPI(`/car-business/fleet/show-v2`, 'POST', payload, true)
            if (error) {
               console.log(error);
            }
            if (ok) {
               setFormData(data)
               setCarPhotos(data?.photos?.map(photo => ({
                  ...photo,
                  id_fleet_photo: photo?.id_fleet_photo,
               })))
            }
            setIsLoading(false)
         } catch (error) {
            console.log('Error: ', error);
         }
      }

      getDataFleet()

   }, [id_car_business, id_car_business_fleet])

   const handleChange = (event) => {
      const { name, value } = event.target;

      // Menggunakan spread operator untuk mempertahankan nilai sebelumnya dari formData
      setFormData((prevFormData) => ({
         ...prevFormData,
         [name]: value,
      }));
   };


   const onSubmit = async (e) => {
      e.preventDefault();


      // Validation form submit
      let errorMessage = {
         full_type: '',
         car_brand: '',
         model: '',
         edition: '',
         transmission: '',
         aircon: '',
         quantity: '',
         total_car: "",
         car_photos: ""
      }

      if (!formData.fuel_type) {
         errorMessage.full_type = 'Fuel type cannot be empty'
      }
      if (!formData.car_brand) {
         errorMessage.car_brand = 'Car brand cannot be empty'
      }
      if (!formData.model) {
         errorMessage.model = 'Model cannot be empty'
      }
      if (!formData.edition) {
         errorMessage.edition = 'Edition cannot be empty'
      }
      if (!formData.transmission) {
         errorMessage.transmission = 'Transmission cannot be empty'
      }
      if (!formData.aircon) {
         errorMessage.aircon = 'Aircon cannot be empty'
      }
      if (!formData.quantity) {
         errorMessage.quantity = 'Quantity cannot be empty'
      }
      if (formData.quantity <= 0) {
         errorMessage.quantity = 'Quantity must be more than 0'
      }
      if (!formData.total_car) {
         errorMessage.total_car = 'Total car cannot be empty'
      }
      if (formData.total_car <= 0) {
         errorMessage.total_car = 'Total car must be more than 0'
      }

      if (CarPhotos.length === 0) {
         errorMessage.car_photos = 'Car photos cannot be empty'
      }

      if (errorMessage.full_type || errorMessage.car_brand || errorMessage.model || errorMessage.edition || errorMessage.transmission || errorMessage.aircon || errorMessage.quantity || errorMessage.total_car || errorMessage.car_photos) {
         setErrors(errorMessage);
         return
      }

      // Reset error
      if (!errorMessage.full_type && !errorMessage.car_brand && !errorMessage.model && !errorMessage.edition && !errorMessage.transmission && !errorMessage.aircon && !errorMessage.quantity && !errorMessage.total_car && !errorMessage.car_photos) {
         setErrors(null);
      }


      // Submit form
      try {
         const { data, error, ok } = await callAPI('/car-business/fleet/store', 'POST', formData, true)
         if (error) {
            console.log(error);
         }
         if (ok) {
            router.push('/business/car/my-fleet')
         }
      } catch (error) {
         console.log('Error: ', error);
      }

   }

   if (!id_car_business || isLoading) {
      return <LoadingOverlay />
   }

   return (
      <Layout>
         <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
         <header>
            <div className="my-fleet__header">
               <div className="container my-fleet__content-header">
                  <Link href={"/business/car/my-fleet"} className='car-dashboard__content-header car-dashboard__content-header--link'>
                     <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
                     <h4 className='my-fleet__content-title-heading'>Edit Car</h4>
                  </Link>
                  <div>
                     <div className="admin-blog__modal-footer">
                        <button type="button" className="btn btn-lg btn-success" data-bs-toggle="modal" data-bs-target="#postModal">Save</button>
                     </div>
                  </div>
               </div>
            </div>
         </header>

         <form onSubmit={onSubmit}>
            <div className="add-fleet">
               <div className="container py-5">
                  <div className="row">
                     <div className="add-location__content-form col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <p className="add-location__content-title">Edit car</p>
                        <div className='goform-group row'>
                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="fuel_type" className="form-label goform-label">Fuel type : </label>
                              <select
                                 id="fuel_type"
                                 name="fuel_type"
                                 onChange={handleChange}
                                 value={formData.fuel_type}
                                 className="form-select goform-select-white goform-select"
                                 aria-label="star rating select"
                              >
                                 <option value="" >-- Select Fuel Type --</option>
                                 <option value='Gasoline'>Gasoline</option>
                                 <option value='Diesel'>Diesel</option>
                                 <option value='Hydrogen'>Hydrogen</option>
                              </select>
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.full_type}</p>
                              </div>
                           </div>

                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="car_brand" className="form-label goform-label">Car Brand</label>
                              <select
                                 id="car_brand"
                                 name="car_brand"
                                 onChange={handleChange}
                                 value={formData.car_brand}
                                 className="form-select goform-select goform-select-white" aria-label="star rating select"
                              >
                                 <option value="" >-- Select Car Brand --</option>
                                 <option value='Acura'>Acura</option>
                                 <option value='Alfa_Romeo'>Alfa Romeo</option>
                                 <option value='Aston_Martin'>Aston Martin</option>
                                 <option value='Audi'>Audi</option>
                                 <option value='BMW'>BMW</option>
                                 <option value='Bentley'>Bentley</option>
                                 <option value='Buick'>Buick</option>
                                 <option value='Cadillac'>Cadillac</option>
                                 <option value='Chevrolet'>Chevrolet</option>
                                 <option value='Chrysler'>Chrysler</option>
                                 <option value='Daewoo'>Daewoo</option>
                                 <option value='Daihatsu'>Daihatsu</option>
                                 <option value='Dodge'>Dodge</option>
                                 <option value='Eagle'>Eagle</option>
                                 <option value='Ferrari'>Ferrari</option>
                                 <option value='Fiat'>Fiat</option>
                                 <option value='Fisker'>Fisker</option>
                                 <option value='Ford'>Ford</option>
                                 <option value='Freightliner'>Freightliner</option>
                                 <option value='GMC'>GMC</option>
                                 <option value='Genesis'>Genesis</option>
                                 <option value='Geo'>Geo</option>
                                 <option value='Honda'>Honda</option>
                                 <option value='Hummer'>Hummer</option>
                                 <option value='Hyundai'>Hyundai</option>
                                 <option value='Infinity'>Infinity</option>
                                 <option value='Isuzu'>Isuzu</option>
                                 <option value='Jaguar'>Jaguar</option>
                                 <option value='Jeep'>Jeep</option>
                                 <option value='Kla'>Kia</option>
                                 <option value='Lamborghini'>Lamborghini</option>
                                 <option value='Land_Rover'>Land Rover</option>
                                 <option value='Lexus'>Lexus</option>
                                 <option value='Lincoln'>Lincoln</option>
                                 <option value='Lotus'>Lotus</option>
                                 <option value='MAZDA'>Mazda</option>
                                 <option value='Maserati'>Maserati</option>
                                 <option value='Maybach'>Maybach</option>
                                 <option value='McLaren'>McLaren</option>
                                 <option value='Mercedes_Benz'>Mercedes Benz</option>
                                 <option value='Mercury'>Mercury</option>
                                 <option value='Mini'>Mini</option>
                                 <option value='Mitsubishi'>Mitsubishi</option>
                                 <option value='Nissan'>Nissan</option>
                                 <option value='Oldsmobile'>Oldsmobile</option>
                                 <option value='Panoz'>Panoz</option>
                                 <option value='Plymouth'>Plymouth</option>
                                 <option value='Pontiac'>Pontiac</option>
                                 <option value='Porsche'>Porsche</option>
                                 <option value='Ram'>Ram</option>
                                 <option value='Rolls_Royce'>Rolls Royce</option>
                                 <option value='Saab'>Saab</option>
                                 <option value='Saturn'>Saturn</option>
                                 <option value='Smart'>Smart</option>
                                 <option value='Subaru'>Subaru</option>
                                 <option value='Susuki'>Suzuki</option>
                                 <option value='Tesla'>Tesla</option>
                                 <option value='Toyota'>Toyota</option>
                                 <option value='Volkswagen'>Volkswagen</option>
                                 <option value='Volvo'>Volvo</option>
                              </select>
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.car_brand}</p>
                              </div>
                           </div>

                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="model" className="form-label goform-label">Model </label>
                              <select
                                 id="model"
                                 name="model"
                                 onChange={handleChange}
                                 value={formData.model}
                                 className="form-select goform-select goform-select-white" aria-label="star rating select"
                              >
                                 <option value="" >-- Select Model --</option>
                                 {filteredCarModel?.map((model, index) => (
                                    <option key={index} value={model?.Model}>{model?.Model}</option>
                                 ))}
                              </select>
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.model}</p>
                              </div>
                           </div>

                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="edition" className="form-label goform-label">Edition</label>
                              <select
                                 id="edition"
                                 name="edition"
                                 onChange={handleChange}
                                 value={formData.edition}
                                 className="form-select goform-select goform-select-white" aria-label="star rating select"
                              >
                                 <option value="" >-- Select Edition --</option>
                                 {carModel?.map((model, index) => (
                                    <option key={index} value={model?.Year}>{model?.Year}</option>
                                 ))}
                              </select>
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.edition}</p>
                              </div>
                           </div>

                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="transmission" className="form-label goform-label">Transmission</label>
                              <select
                                 id="transmission"
                                 name="transmission"
                                 onChange={handleChange}
                                 value={formData.transmission}
                                 className="form-select goform-select goform-select-white" aria-label="star rating select"
                              >
                                 <option value="" >-- Select Transmission --</option>
                                 <option value='Automatic'>Automatic</option>
                                 <option value='Manual'>Manual</option>
                              </select>
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.transmission}</p>
                              </div>
                           </div>

                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="aircon" className="form-label goform-label">Aircon :</label>
                              <select
                                 id="aircon"
                                 name="aircon"
                                 onChange={handleChange}
                                 value={formData.aircon}
                                 className="form-select goform-select goform-select-white" aria-label="star rating select"
                              >
                                 <option value="" >-- Select Aircon --</option>
                                 <option value={0}>Yes</option>
                                 <option value={1}>No</option>
                              </select>
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.aircon}</p>
                              </div>
                           </div>

                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="quantity" className="form-label goform-label">Quantit (seat)</label>
                              <input type="number"
                                 id="quantity"
                                 name="quantity"
                                 onChange={handleChange}
                                 value={formData.quantity}
                                 placeholder='Enter your Quantity'
                                 className="form-control goform-input goform-input--active"
                                 aria-describedby="QuantityHelp"
                              />
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.quantity}</p>
                              </div>
                           </div>

                           <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                              <label htmlFor="total_car" className="form-label goform-label">Total Car</label>
                              <input type="number"
                                 id="total_car"
                                 name="total_car"
                                 onChange={handleChange}
                                 value={formData.total_car}
                                 placeholder='Enter your total car'
                                 className="form-control goform-input goform-input--active"
                                 aria-describedby="totalCarHelp"
                              />
                              <div className="form-control-message form-control-message--error">
                                 <p>{errors?.total_car}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="add-location__content-form col-xl-12 col-lg-12 col-md-12 col-sm-12">
                     <p className="add-location__content-title">Edit car photo</p>
                     <div className="admin-partner__photos">
                        <div>
                           <div className="admin-partner__photos-header mb-5">
                              <div className="admin-partner__photos-header-title">
                                 <div className="form-control-message form-control-message--error">
                                    <p>{errors?.car_photos}</p>
                                 </div>
                              </div>
                              <div className="admin-partner__photos-header-buttons">

                                 {isEditing ? (
                                    <div className="admin-partner__photos-header-buttons">
                                       <button type="button" className="btn btn-md btn-outline-danger" onClick={toggleCancel}>
                                          Cancel
                                       </button>
                                       <button
                                          type="button"
                                          className="btn btn-md btn-outline-success"
                                          onClick={handleSaveChanges}
                                       >
                                          Save Changes
                                       </button>
                                    </div>
                                 ) : (
                                    <div className="admin-partner__photos-header-buttons">
                                       <button
                                          type="button"
                                          className="btn btn-md btn-outline-danger"
                                          onClick={toggleEditing}
                                       >
                                          Remove
                                       </button>
                                       <button
                                          type="button"
                                          className="btn btn-md btn-outline-success"
                                          onClick={handleAddPhotosClick}
                                       >
                                          Add Photos
                                       </button>
                                    </div>
                                 )}
                              </div>
                           </div>

                           <div className="admin-partner__photos-list ">
                              {CarPhotos?.map((photo) => (
                                 <div
                                    key={photo?.id_fleet_photo}
                                    className="admin-partner__photos-list position-relative"
                                 >
                                    <img
                                       src={photo?.photo}
                                       alt={`Preview ${photo?.id_fleet_photo}`}
                                       className="admin-partner__detail-hotel__image-src"
                                       width={123}
                                       height={123}
                                    />
                                    {isEditing && (
                                       <button
                                          type="button"
                                          className="admin-partner__detail-hotel__image-button show position-absolute"
                                          onClick={() => handleDeletePhotos(photo?.id_fleet_photo)}
                                       >
                                          <SVGIcon src={Icons.Cancel} height={24} width={24} />
                                       </button>
                                    )}
                                 </div>
                              ))}
                              {CarPhotos?.length === 0 && (
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
                              <div className="d-none">
                                 <input
                                    type="file"
                                    className="form-control"
                                    id={`photos`}
                                    multiple
                                    accept="image/*"
                                    onChange={(event) => handleFileInputChange(event)}
                                    ref={inputFileRef}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>
            </div>

            <div className="modal fade" id="postModal" tabIndex={-1} aria-labelledby="postLabel" aria-hidden="true">
               <div className="modal-dialog admin-blog__modal">
                  <div className="modal-content admin-blog__modal-body">
                     <div className="admin-blog__modal-content">
                        <div className="admin-blog__modal-image">
                           <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                        </div>
                        <div className="admin-blog__modal-text">
                           <h3 className="company-detail_content-title-heading company-detail_content-title-heading--popup">Update this car to your fleet?</h3>
                           <p className="company-detail__content-caption--popup">Once marked as complete, the car will be updated to your fleet.</p>
                        </div>
                     </div>
                     <div className="admin-blog__modal-footer">
                        <button type="button" className="btn btn-outline-secondary admin-blog__modal-button" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-success admin-blog__modal-button" data-bs-dismiss="modal">Yes, Update this car</button>
                     </div>
                  </div>
               </div>
            </div>

         </form>
      </Layout>
   );
}

export default EditFleet;
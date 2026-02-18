import { Fragment, useEffect, useState } from "react";
import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import Link from "next/link";
import { Icons } from "@/types/enums";
import { cl } from "@fullcalendar/core/internal-common";
import React from "react";
import placeholder from "@/public/images/placeholder.svg";
import SVGIcon from "@/components/elements/icons";
import { callAPI } from "@/lib/axiosHelper";
import LoadingOverlay from "@/components/loadingOverlay";
import { parse, resolve } from "path";
import { BlurPlaceholderImage } from "@/components/elements/images";
import { useRouter } from "next/router";

export default function PackagePhoto() {
    const [tourPackagePhotos, setTourPackagePhotos] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // State to track whether the "Edit" button is pressed
    const [isEditing, setIsEditing] = useState(false);
    const [photosToDelete, setPhotosToDelete] = useState<any>([]);

    const router = useRouter();
    const { id: id_tour_package } = router.query;

    console.log("tour package photos", tourPackagePhotos)

    console.log("photos to delete", photosToDelete);


    // Function to toggle editing mode
    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const toggleCancel = () => {
        setIsEditing(false);
        router.reload();
    }

    // Photos

    const handlePhotoChange = async (e,) => {

        const files = e.target.files;
        const formData = {
            id_tour_package: id_tour_package,
            photos: []
        }

        const promises = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            console.log(file);

            const reader = new FileReader();

            promises.push(
                new Promise((resolve, reject) => {
                    reader.onload = (e) => {
                        const base64String = e.target.result
                        formData.photos.push({ photo: base64String, soft_delete: 0 });
                        resolve(base64String);
                    }

                    reader.onerror = (err) => {
                        reject(err);
                    }

                    reader.readAsDataURL(file);
                })
            )
        }


        try {
            setIsLoading(true);
            await Promise.all(promises);

            const { ok, data, error } = await callAPI("/tour-package/photos-store", "POST", formData, true);

            console.log('Form data store', formData);

            if (ok) {
                console.log(`success API call for photos store ${id_tour_package}`),
                    router.reload()
            } else {
                console.error("Failed to Store:", error);
            }
        } catch (error) {
            console.log('Error reading files: ', error);
        }
    };

    const handleDeletePhoto = (index) => {
        setTourPackagePhotos(tourPackagePhotos.filter((photo) => photo.id_tour_photo !== index));
        setPhotosToDelete([...photosToDelete, index]);
    };

    // Handle to delete selected photos
    const handleSave = async () => {
        console.log('Saved');

        const formData = {
            id_tour_package: id_tour_package,
            photos: []
        }

        photosToDelete.map((photo) => {
            formData.photos.push({ id_tour_photo: photo, soft_delete: 1 });
        })

        console.log('Form data delete', formData);

        try {
            setIsLoading(true);
            const { ok, data, error } = await callAPI("/tour-package/photos-store", "POST", formData, true);

            if (ok) {
                console.log(`success API call for photos store ${id_tour_package}`),
                    router.reload()
            } else {
                console.error("Failed to Store:", error);
            }
        } catch (error) {
            console.error("An error occurred while saving photos:", error);
        }
    }


    const getPhotosData = async () => {
        setIsLoading(true);

        try {
            if (id_tour_package) {
                // Get detail tour package from API
                const { ok, data, error } = await callAPI("/tour-package/tour-details", "POST", { id_tour_package }, true);

                if (ok) {
                    // Set data to tourPackagePhotos with id_tour_photo
                    setTourPackagePhotos(data.tour_photos.map(photo => ({
                        ...photo,
                        id_tour_photo: photo.id_tour_photo // Assuming there is an id_tour_photo in the API response
                    })));
                    console.log('photos data :', tourPackagePhotos);
                } else {
                    console.error("Failed to fetch tour package data:", error);
                }
            }

        } catch (error) {
            console.error("An error occurred while getting tour package data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Ref to the file input element
    const inputfileRef = React.useRef<HTMLInputElement>(null);

    const handleAddPhotosClick = () => {
        if (inputfileRef && inputfileRef.current) {
            inputfileRef.current.click()
        }
    }

    useEffect(() => {
        getPhotosData();
    }, [id_tour_package])

    return (
        <Layout>
            <AdminLayout pageTitle="Photos" enableBack={true}>
                <div className="admin-partner__detail">
                    <div className="container">
                        <form action="" className="admin-partner__car-edit">
                            {isLoading ? (
                                <LoadingOverlay />
                            ) : (
                                <Fragment>
                                    <TourPackage
                                        handlePhotoChange={handlePhotoChange}
                                        handleDeletePhoto={handleDeletePhoto}
                                        tourPackagePhotos={tourPackagePhotos}
                                        isEditing={isEditing}
                                        inputfileRef={inputfileRef}
                                        handleAddPhotosClick={handleAddPhotosClick}
                                    />
                                </Fragment>
                            )}

                            <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                                {tourPackagePhotos.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-outline-danger"
                                        onClick={toggleEditing}
                                    >
                                        Remove
                                    </button>
                                )}
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-outline-secondary"
                                        onClick={toggleCancel}
                                    >
                                        Cancel
                                    </button>
                                
                                )}
                                {photosToDelete.length > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-lg btn-outline-success "
                                        onClick={handleSave}
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </Layout>
    );
}

// Interface Props
interface TourPackageProps {
    tourPackagePhotos: any[];
    handlePhotoChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;
    handleDeletePhoto: (
        index: number
    ) => void;
    handleAddPhotosClick: () => void;
    isEditing: boolean;
}

// Tour Package
const TourPackage = (props: TourPackageProps & { isEditing: boolean, inputfileRef }) => {
    const {
        tourPackagePhotos,
        handleDeletePhoto,
        handlePhotoChange,
        isEditing,
        inputfileRef,
        handleAddPhotosClick
    } = props;

    return (
        <div className="admin-partner__fleet-card">
            <div className="admin-partner__fleet-body-block">
                <button
                    type="button"
                    className="btn btn-outline-success w-25"
                    onClick={() => handleAddPhotosClick()}
                >
                    Upload Photo
                </button>
                <input
                    ref={inputfileRef}
                    type="file"
                    id="tour-upload-photo"
                    name="tour-upload-photo"
                    className="form-control d-none"
                    onChange={(e) => {
                        handlePhotoChange(e);
                    }}
                    multiple
                    accept="image/*"
                />
                <br />
            </div>
            <div className="admin-partner__photos">
                <label>{tourPackagePhotos.length === 0 ? "No Photos Uploaded" : "Already Uploaded Photos"}</label>
                <div className="admin-partner__photos-list">
                    {tourPackagePhotos?.map((photo) => (
                        <div
                            key={photo.id_tour_photo}
                            className="admin-partner__photos-list position-relative"
                        >
                            <img
                                src={photo.photo || placeholder}
                                alt={`Preview ${photo.id_tour_photo}`}
                                className="admin-partner__detail-hotel__image-src "
                                width={123}
                                height={123}
                            />
                            {isEditing && (
                                <button
                                    type="button"
                                    className="admin-partner__detail-hotel__image-button show position-absolute"
                                    onClick={() => handleDeletePhoto(photo.id_tour_photo)}
                                >
                                    <SVGIcon src={Icons.Cancel} height={24} width={24} />
                                </button>
                            )}
                        </div>
                    ))}
                    {tourPackagePhotos.length === 0 && (
                        <div className="admin-partner__photos-list position-relative">
                            <BlurPlaceholderImage
                                src={placeholder}
                                className="admin-partner__detail-hotel__image-src"
                                alt=""
                                width={123}
                                height={123}
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
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
import { parse } from "path";
import Router from "next/router";

export default function NewPackageForm() {
  const [tourPackagePhotos, setTourPackagePhotos] = useState<any>([]);
  const [tourPackageInfoFields, setTourPackageInfoFields] = useState<any>([
    { title: "", description: "" },
  ]); // Handled
  const [tourPackagePlans, setTourPackagePlans] = useState<any>([
    {
      type_plan: "",
      plan_name: "",
      price: 0,
      total_day: 0,
      plan_location: [
        {
          city: "",
          order_day: 0,
          location: "",
          location_activity: "",
        },
      ],
    },
  ]); // Handled
  const [facilities, setFacilities] = useState<any>([
    { facility_name: "", included: true },
  ]); // Handled
  const [tourPackage, setTourPackage] = useState<any>({
    package_name: "",
    city: "",
    address: "",
    description: "",
  }); // Handled
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Tour Package Info

  const addMoreTourPackageInfoField = () => {
    setTourPackageInfoFields([
      ...tourPackageInfoFields,
      { title: "", description: "" },
    ]);
  };

  const handleTourPackageInfoChange = (index, field, value) => {
    const updatedFields = [...tourPackageInfoFields];
    updatedFields[index][field] = value;
    setTourPackageInfoFields(updatedFields);
  };

  // Tour package Plan

  const handleAddMorePlan = () => {
    setTourPackagePlans((prevPlans) => [
      ...prevPlans,
      {
        type_plan: "",
        plan_name: "",
        price: 0,
        total_day: 0,
        plan_location: [
          {
            city: "",
            order_day: 0,
            location: "",
            location_activity: "",
          },
        ],
      },
    ]);
  };

  // Facility

  const handleAddMoreFacility = () => {
    setFacilities([...facilities, { facility_name: "", included: true }]);
  };

  const handleFacilityChange = (index, value) => {
    // console.log("Facility Index : ", index);
    // console.log("Facility Value : ", value);

    const updatedFacilities = [...facilities];
    updatedFacilities[index] = value;
    setFacilities(updatedFacilities);
  };

  // Photos

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    const convertToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      });
    };

    const uploadedPhotos = await Promise.all(
      Array.from(files).map(async (file) => {
        const base64String = await convertToBase64(file);
        return base64String;
      })
    );

    setTourPackagePhotos([...tourPackagePhotos, ...uploadedPhotos]);
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...tourPackagePhotos];
    updatedPhotos.splice(index, 1);
    setTourPackagePhotos(updatedPhotos);
  };

  // Tour Package

  const handleTourPackage = (name, value) => {
    setTourPackage((prevPackage) => ({
      ...prevPackage,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Store tour package data and retrieve id_tour_package from API response
      const payloadTourPackage = {
        package_name: tourPackage.package_name,
        address: tourPackage.address,
        city: tourPackage.city,
        description: tourPackage.description,
        more_information: tourPackageInfoFields.map((infoField) => ({
          title: infoField.title,
          description: infoField.description,
        })),
      };

      const {
        ok: tourPackageOk,
        data: tourPackageData,
        error: tourPackageError,
      } = await callAPI(
        "/tour-package/store",
        "POST",
        payloadTourPackage,
        true
      );

      if (tourPackageOk) {
        console.log("Tour package data stored successfully");
        const idTourPackage = tourPackageData.id_tour_package;

        // After store tour package, store the facilities and retrieve id_tour_package from API response

        const facilitiesArray = facilities.map((facility) => ({
          facility_name: facility,
          include_status: facility.included ? 2 : 1,
        }));

        const payloadFacilities = {
          id_tour_package: idTourPackage,
          facilities: facilitiesArray,
        };

        const {
          ok: facilitiesOk,
          data: facilitiesData,
          error: facilitiesError,
        } = await callAPI(
          "/tour-package/facilities-store",
          "POST",
          payloadFacilities,
          true
        );

        if (facilitiesOk) {
          console.log("Facilities data stored successfully");
        } else {
          console.error("Failed to store facilities data:", facilitiesError);
        }

        // After store facilities, store the photos and retrieve id_tour_package from API response\

        const photosArray = tourPackagePhotos.map((photo) => ({
          photo: photo,
        }));

        const payloadPhotos = {
          id_tour_package: idTourPackage,
          photos: photosArray,
        };

        const {
          ok: photosOk,
          data: photosData,
          error: photosError,
        } = await callAPI(
          "/tour-package/photos-store",
          "POST",
          payloadPhotos,
          true
        );

        if (photosOk) {
          console.log("Photos data stored successfully");
        } else {
          console.error("Failed to store photos data:", photosError);
        }

        // After store photos, store the plans and retrieve id_tour_package from API response
        const plansArray = tourPackagePlans.map((plan) => ({
          id_tour_package: idTourPackage,
          type_plan: plan.type_plan,
          plan_name: plan.plan_name,
          price: plan.price,
          total_day: plan.total_day,
          plan_location: plan.plan_location.map((location) => ({
            city: location.city,
            order_day: location.order_day,
            location: location.location,
            location_activity: location.location_activity,
          })),
        }));

        // console.log(" Plans: ", plansArray);

        // const payloadPlans = {
        //   plansArray
        // };

        // console.log("Payload Plans: ", payloadPlans);

        const {
          ok: plansOk,
          data: plansData,
          error: plansError,
        } = await callAPI("/tour-package/plan-store", "POST", plansArray, true);

        if (plansOk) {
          console.log("Plans data stored successfully");
        } else {
          console.error("Failed to store plans data:", plansError);
        }
      } else {
        console.error("Failed to store tour package data:", tourPackageError);
      }

      setIsLoading(false);

      setTourPackagePhotos([]);
      setTourPackageInfoFields([{ title: "", description: "" }]);
      setTourPackagePlans([
        {
          type_plan: "",
          plan_name: "",
          price: 0,
          total_day: 0,
          plan_location: [
            {
              city: "",
              order_day: 0,
              location: "",
              location_activity: "",
            },
          ],
        },
      ]);

      setFacilities([{ facility_name: "" }]);

      setTourPackage({
        package_name: "",
        city: "",
        address: "",
        description: "",
      });

      // redirect to /admin/booking/tour-booking
      const router = Router;
      router.push("/admin/tour");

    } catch (error) {
      console.error("An error occurred while storing data:", error);
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <AdminLayout pageTitle="Package Form" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <form action="" className="admin-partner__car-edit">
              {isLoading ? (
                <LoadingOverlay />
              ) : (
                <Fragment>
                  <TourPackage
                    handleTourPackage={handleTourPackage}
                    handlePhotoChange={handlePhotoChange}
                    handleDeletePhoto={handleDeletePhoto}
                    tourPackagePhotos={tourPackagePhotos}
                    tourPackage={tourPackage}
                  />
                  <TourPackageInformation
                    handleTourPackageInfoChange={handleTourPackageInfoChange}
                    addMoreTourPackageInfoField={addMoreTourPackageInfoField}
                    tourPackageInfoFields={tourPackageInfoFields}
                  />
                  <TourPackageFacilities
                    handleFacilityChange={handleFacilityChange}
                    facilities={facilities}
                    handleAddMoreFacility={handleAddMoreFacility}
                  />
                  <TourPackagePlan
                    setTourPackagePlans={setTourPackagePlans}
                    handleAddMorePlan={handleAddMorePlan}
                    tourPackagePlans={tourPackagePlans}
                  />
                </Fragment>
              )}

              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                <Link
                  href="/admin/booking/tour-booking"
                  className="btn btn-lg btn-outline-success"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  className="btn btn-lg btn-success"
                  onClick={handleSave}
                >
                  Save
                </button>
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
  tourPackagePhotos: string[];
  tourPackage: {
    package_name: string;
    city: string;
    address: string;
    description: string;
  };
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTourPackage: (name: string, value: string) => void;
  handleDeletePhoto: (index: number) => void;
}

interface TourPackegeInformationProps {
  tourPackageInfoFields: { title: string; description: string }[];
  handleTourPackageInfoChange: (
    index: number,
    field: string,
    value: string
  ) => void;
  addMoreTourPackageInfoField: () => void;
}

interface TourPackageFacilitiesProps {
  facilities: { name: string; included: boolean }[];
  handleFacilityChange: (index: number, value: string) => void;
  handleAddMoreFacility: () => void;
}

interface TourPackagePlanProps {
  tourPackagePlans: {
    type_plan: string;
    plan_name: string;
    price: number;
    total_day: number;
    plan_location: [
      {
        city: string;
        order_day: number;
        location: string;
        location_activity: string;
      }
    ];
  }[];
  setTourPackagePlans: React.Dispatch<
    React.SetStateAction<
      {
        type_plan: string;
        plan_name: string;
        price: number;
        total_day: number;
        plan_location: [
          {
            city: string;
            order_day: number;
            location: string;
            location_activity: string;
          }
        ];
      }[]
    >
  >;
  handleAddMorePlan: () => void;
}

// Tour Package
const TourPackage = (props: TourPackageProps) => {
  const {
    tourPackage,
    tourPackagePhotos,
    handlePhotoChange,
    handleDeletePhoto,
    handleTourPackage,
  } = props;
  return (
    <div className="admin-partner__fleet-card">
      <div className="admin-partner__fleet-card--header">
        <h5>Tour Package</h5>
      </div>
      <div className="admin-partner__fleet-body--tour-package">
        <div className="admin-partner__fleet-body-block">
          <label htmlFor="package-name">Package Name</label>
          <input
            name="package_name"
            id="package_name"
            type="text"
            value={tourPackage.package_name}
            onChange={(e) => handleTourPackage(e.target.name, e.target.value)}
          />
        </div>
        <div className="admin-partner__fleet-body-block ">
          <label htmlFor="city">City</label>
          <input
            name="city"
            id="city"
            type="text"
            className=""
            onChange={(e) => handleTourPackage(e.target.name, e.target.value)}
          />
        </div>
      </div>
      <br />
      <div className="admin-partner__fleet-body-block admin-partner__flex-container">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          name="address"
          id="address"
          onChange={(e) => handleTourPackage(e.target.name, e.target.value)}
        />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          rows={5}
          onChange={(e) => handleTourPackage(e.target.name, e.target.value)}
        />
      </div>
      <br />
      <div className="admin-partner__fleet-body-block">
        <label htmlFor="tour-upload-photo">Upload Photo</label>
        <input
          type="file"
          id="tour-upload-photo"
          name="tour-upload-photo"
          className="form-control"
          onChange={handlePhotoChange}
          multiple
          accept="image/*"
        />
        <br />
      </div>

      {tourPackagePhotos?.length > 0 && (
        <div className="admin-partner__photos">
          <label>Imported Photos</label>
          <div className="admin-partner__photos-list ">
            {tourPackagePhotos.map((photo, index) => (
              <div
                key={index}
                className="admin-partner__photos-list position-relative"
              >
                <img
                  src={photo}
                  alt={`Preview ${index}`}
                  className="admin-partner__detail-hotel__image-src "
                  width={123}
                  height={123}
                />
                <button
                  type="button"
                  className="admin-partner__detail-hotel__image-button show position-absolute"
                  onClick={() => handleDeletePhoto(index)}
                >
                  <SVGIcon src={Icons.Cancel} height={24} width={24} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Tour Package Information
const TourPackageInformation = (props: TourPackegeInformationProps) => {
  const {
    tourPackageInfoFields,
    handleTourPackageInfoChange,
    addMoreTourPackageInfoField,
  } = props;

  return (
    <div className="admin-partner__fleet-card">
      <div className="admin-partner__fleet-card--header">
        <h5>Tour Package Information</h5>
      </div>
      <div className="admin-partner__fleet-body--tour-package admin-partner__flex-container">
        {tourPackageInfoFields.map((field, index) => (
          <div key={index} className="admin-partner__fleet-body-block">
            <label htmlFor={`title-${index}`}>Title</label>
            <input
              name={`title-${index}`}
              id={`title-${index}`}
              type="text"
              className=""
              value={field.title}
              onChange={(e) =>
                handleTourPackageInfoChange(index, "title", e.target.value)
              }
            />
            <label htmlFor={`description-${index}`}>Description</label>
            <textarea
              name={`description-${index}`}
              id={`description-${index}`}
              cols={30}
              rows={5}
              value={field.description}
              onChange={(e) =>
                handleTourPackageInfoChange(
                  index,
                  "description",
                  e.target.value
                )
              }
            />
            <br />
          </div>
        ))}

        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={addMoreTourPackageInfoField}
        >
          Add More
        </button>
      </div>
    </div>
  );
};

// Tour Package Facilities
const TourPackageFacilities = (props: TourPackageFacilitiesProps) => {
  const { facilities, handleFacilityChange, handleAddMoreFacility } = props;
  return (
    <div className="admin-partner__fleet-card">
      <div className="admin-partner__fleet-card--header">
        <h5 className="">Tour Package Facilities</h5>
      </div>
      <div className="admin-partner__fleet-body--tour-package admin-partner__flex-container">
        {facilities.map((facility, index) => (
          <div key={index}>
            <div className="admin-partner__fleet-body-block">
              <label htmlFor={`facilities-name-${index}`}>
                Facilities Name
              </label>
              <input
                name={`facilities-name-${index}`}
                id={`facilities-name-${index}`}
                type="text"
                value={facility.name}
                onChange={(e) => handleFacilityChange(index, e.target.value)}
              />
            </div>
            <br />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={handleAddMoreFacility}
        >
          Add More
        </button>
      </div>
    </div>
  );
};

// Tour Package Plan
const TourPackagePlan = (props: TourPackagePlanProps) => {
  const { tourPackagePlans, setTourPackagePlans, handleAddMorePlan } = props;

  const handleAddMorePlanLocation = (index: number, locationIndex: number) => {
    const newPlans = [...tourPackagePlans];
    newPlans[index].plan_location.push({
      city: "",
      order_day: 0,
      location: "",
      location_activity: "",
    });
    setTourPackagePlans(newPlans);
  };

  return (
    <div className="admin-partner__fleet-card">
      <div className="admin-partner__fleet-card--header">
        <h5 className="">Tour Package Plan & Location</h5>
      </div>
      <div className="admin-partner__fleet-body--tour-package admin-partner__flex-container">
        {tourPackagePlans.map((plan, index) => (
          <div key={index}>
            <h5>Plan {index + 1}</h5>
            <div className="admin-partner__fleet-body--tour-package">
              <div className="admin-partner__fleet-body-block">
                <label htmlFor={`type-plan-${index}`}>Type Plan</label>
                <input
                  type="text"
                  id={`type-plan-${index}`}
                  name={`type-plan-${index}`}
                  placeholder="Type 'A' etc..."
                  value={plan.type_plan}
                  onChange={(e) => {
                    const newPlans = [...tourPackagePlans];
                    newPlans[index].type_plan = e.target.value;
                    setTourPackagePlans(newPlans);
                  }}
                />
              </div>
              <div className="admin-partner__fleet-body-block">
                <label htmlFor={`plan-name-${index}`}>Plan Name</label>
                <input
                  type="text"
                  id={`plan-name-${index}`}
                  name={`plan-name-${index}`}
                  value={plan.plan_name}
                  onChange={(e) => {
                    const newPlans = [...tourPackagePlans];
                    newPlans[index].plan_name = e.target.value;
                    setTourPackagePlans(newPlans);
                  }}
                />
              </div>
              <div className="admin-partner__fleet-body-block">
                <label htmlFor={`price-${index}`}>Price</label>
                <input
                  type="number"
                  min={0}
                  id={`price-${index}`}
                  name={`price-${index}`}
                  value={plan.price}
                  onChange={(e) => {
                    const newPlans = [...tourPackagePlans];
                    newPlans[index].price = parseInt(e.target.value);
                    setTourPackagePlans(newPlans);
                  }}
                />
              </div>
              <div className="admin-partner__fleet-body-block">
                <label htmlFor={`total-day-${index}`}>Total Day</label>
                <input
                  type="number"
                  min={0}
                  id={`total-day-${index}`}
                  name={`total-day-${index}`}
                  value={plan.total_day}
                  onChange={(e) => {
                    const newPlans = [...tourPackagePlans];
                    newPlans[index].total_day = parseInt(e.target.value);
                    setTourPackagePlans(newPlans);
                  }}
                />
              </div>
            </div>
            <br />

            <div className="admin-partner__photos">
              <div className="admin-partner__fleet-body-block">
                {plan.plan_location.map((location, locationIndex) => (
                  <div key={locationIndex}>
                    <h6>
                      Plan {index + 1} Location ({locationIndex + 1})
                    </h6>{" "}
                    <br />
                    {/* Render input fields for plan location */}
                    <label htmlFor={`order-day-${index}-${locationIndex}`}>
                      Order Day
                    </label>
                    <input
                      type="number"
                      id={`order-day-${index}-${locationIndex}`}
                      name={`order-day-${index}-${locationIndex}`}
                      min={0}
                      value={location.order_day}
                      onChange={(e) => {
                        const newPlans = [...tourPackagePlans];
                        newPlans[index].plan_location[locationIndex].order_day =
                          parseInt(e.target.value);
                        setTourPackagePlans(newPlans);
                      }}
                    />
                    <label htmlFor={`city-${index}-${locationIndex}`}>
                      City
                    </label>
                    <input
                      type="text"
                      id={`city-${index}-${locationIndex}`}
                      name={`city-${index}-${locationIndex}`}
                      value={location.city}
                      onChange={(e) => {
                        const newPlans = [...tourPackagePlans];
                        newPlans[index].plan_location[locationIndex].city =
                          e.target.value;
                        setTourPackagePlans(newPlans);
                      }}
                    />
                    <label htmlFor={`location-${index}-${locationIndex}`}>
                      Location
                    </label>
                    <input
                      type="text"
                      id={`location-${index}-${locationIndex}`}
                      name={`location-${index}-${locationIndex}`}
                      value={location.location}
                      onChange={(e) => {
                        const newPlans = [...tourPackagePlans];
                        newPlans[index].plan_location[locationIndex].location =
                          e.target.value;
                        setTourPackagePlans(newPlans);
                      }}
                    />
                    <label
                      htmlFor={`location-activity-${index}-${locationIndex}`}
                    >
                      Location Activity
                    </label>
                    <textarea
                      rows={5}
                      id={`location-activity-${index}-${locationIndex}`}
                      name={`location-activity-${index}-${locationIndex}`}
                      value={location.location_activity}
                      onChange={(e) => {
                        const newPlans = [...tourPackagePlans];
                        newPlans[index].plan_location[
                          locationIndex
                        ].location_activity = e.target.value;
                        setTourPackagePlans(newPlans);
                      }}
                    />
                    <hr />
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-success"
                  onClick={() =>
                    handleAddMorePlanLocation(index, plan.plan_location.length)
                  }
                >
                  Add More Plan Location
                </button>
                <hr />
                <br />
              </div>
            </div>
            <br />
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-success"
          onClick={handleAddMorePlan}
        >
          Add More
        </button>
      </div>
    </div>
  );
};

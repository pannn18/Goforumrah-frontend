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
import { useRouter } from "next/router";
import { get } from "http";

export default function NewPackageForm() {
  const router = useRouter();
  const { id: id_tour_package } = router.query;

  const [tourPackageInfoFields, setTourPackageInfoFields] = useState<any>([
    { title: "", description: "" },
  ]); // Handled

  const [moreInfoSetToDelete, setMoreInfoSetToDelete] = useState<any>([]);

  console.log('more info set to delete', moreInfoSetToDelete);

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

  // ...

  const handleTourPackageInfoChange = (index: number, field: string, value: string) => {
    setTourPackageInfoFields((prevFields) => {
      const newFields = [...prevFields];
      newFields[index][field] = value;
      return newFields;
    });
  }

  const handleTourPackageInfoDelete = (index: number) => {
    setMoreInfoSetToDelete((prevSet) => {
      const fieldToDelete = tourPackageInfoFields[index];
      if (fieldToDelete && fieldToDelete.id_tour_information) {
        // Add the information to the set of fields to delete
        return new Set([...prevSet, fieldToDelete.id_tour_information]);
      }
      return prevSet;
    });

    setTourPackageInfoFields((prevFields) => {
      const newFields = [...prevFields];
      newFields.splice(index, 1);
      return newFields;
    });
  };

  // ...

  useEffect(() => {
    // Use useEffect to log the updated state when it changes
    console.log('info field', tourPackageInfoFields);
  }, [tourPackageInfoFields]); // Add dependency array

  // ...


  // Tour Package
  const handleTourPackage = (name, value) => {
    setTourPackage((prevPackage) => ({
      ...prevPackage,
      [name]: value,
    }));
  };

  const getData = async () => {
    setIsLoading(true);

    // Get id_tour_package from the router


    try {
      if (id_tour_package) {
        // Get detail tour package from API
        const { ok, data, error } = await callAPI("/tour-package/tour-details", "POST", { id_tour_package }, true);

        if (ok) {
          console.log("data", data);
          // Set data to tour package info fields & tour package
          // setTourPackageInfoFields(data.more_information);
          console.log('info field', tourPackageInfoFields);
          setTourPackage({
            package_name: data.package_name,
            city: data.city,
            address: data.address,
            description: data.description,
          });
        } else {
          console.error("Failed to fetch tour package data:", error);
        }
      }

    } catch (error) {
      console.error("An error occurred while getting tour package data:", error);
    }

    // get tour package more info fields from API
    try {
      if (id_tour_package) {
        const { ok, data, error } = await callAPI("/tour-package/more-information-show-all", "POST", { id_tour_package: id_tour_package }, true);

        if (ok) {
          console.log('data', data);
          setTourPackageInfoFields(data);

        } else {
          console.error("Failed to fetch tour package info fields:", error);
        }
      }
    } catch (error) {
      console.error("An error occurred while getting tour package info fields:", error);
    }

    setIsLoading(false);
  }

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Iterate through tourPackageInfoFields and add soft_delete: 1 to empty values
      const sanitizedTourPackageInfoFields = tourPackageInfoFields.map((infoField) => {
        if (infoField.title == "" || infoField.description == "") {
          return { ...infoField, soft_delete: 1 };
        }
        return infoField;
      });

      // Store tour package data and retrieve id_tour_package from API response
      const payloadTourPackage = {
        id_tour_package: typeof id_tour_package === "string" ? parseInt(id_tour_package) : id_tour_package,
        package_name: tourPackage.package_name,
        address: tourPackage.address,
        city: tourPackage.city,
        description: tourPackage.description,
        more_information: sanitizedTourPackageInfoFields,
      };

      console.log('payload :', payloadTourPackage);

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
      } else {
        console.error("Failed to store tour package data:", tourPackageError);
      }

      // Delete marked information fields
      if (moreInfoSetToDelete.size > 0) {
        const deletePayload = {
          id_tour_package: typeof id_tour_package === "string" ? parseInt(id_tour_package) : id_tour_package,
          information: Array.from(moreInfoSetToDelete).map((id_tour_information) => ({
            id_tour_information,
            soft_delete: 1,
          })),
        };

        const {
          ok: deleteOk,
          data: deleteData,
          error: deleteError,
        } = await callAPI(
          "/tour-package/information-store",
          "POST",
          deletePayload,
          true
        );

        if (deleteOk) {
          console.log("Tour package information fields deleted successfully");
        } else {
          console.error("Failed to delete tour package information fields:", deleteError);
        }

        console.log('Delte Payload', deletePayload);
      }

      setIsLoading(false);
      getData();
    } catch (error) {
      console.error("An error occurred while storing data:", error);
      setIsLoading(false);
    }
  };



  useEffect(() => {
    getData();
  }, [id_tour_package])

  return (
    <Layout>
      <AdminLayout pageTitle="Tour Information Details" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <form action="" className="admin-partner__car-edit">

              {isLoading ? (
                <LoadingOverlay />
              ) : (
                <Fragment>
                  <TourPackage
                    handleTourPackage={handleTourPackage}
                    tourPackage={tourPackage}
                  />
                  <TourPackageInformation
                    handleTourPackageInfoChange={handleTourPackageInfoChange}
                    addMoreTourPackageInfoField={addMoreTourPackageInfoField}
                    tourPackageInfoFields={tourPackageInfoFields}
                    handleTourPackageInfoDelete={handleTourPackageInfoDelete}
                  />
                </Fragment>
              )}

              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
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
  tourPackage: {
    package_name: string;
    city: string;
    address: string;
    description: string;
  };
  handleTourPackage: (name: string, value: string) => void;
}

interface TourPackegeInformationProps {
  tourPackageInfoFields: { title: string; description: string }[];
  handleTourPackageInfoChange: (
    index: number,
    field: string,
    value: string
  ) => void;
  addMoreTourPackageInfoField: () => void;
  handleTourPackageInfoDelete: (index: number) => void;
}

// Tour Package
const TourPackage = (props: TourPackageProps) => {
  const {
    tourPackage,
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
            value={tourPackage.city}
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
          className=""
          value={tourPackage.address}
          onChange={(e) => handleTourPackage(e.target.name, e.target.value)}
        />
        <label htmlFor="description">Description</label>
        <textarea
          name="description"
          id="description"
          rows={5}
          value={tourPackage.description}
          onChange={(e) => handleTourPackage(e.target.name, e.target.value)}
        />
      </div>
    </div>
  );
};

// Tour Package Information
const TourPackageInformation = (props: TourPackegeInformationProps) => {
  const {
    tourPackageInfoFields,
    handleTourPackageInfoChange,
    addMoreTourPackageInfoField,
    handleTourPackageInfoDelete,
  } = props;

  return (
    <div className="admin-partner__fleet-card">
      <div className="admin-partner__fleet-card--header">
        <h5>Tour Package Information</h5>
      </div>
      <div className="admin-partner__fleet-body--tour-package admin-partner__flex-container">
        {tourPackageInfoFields?.map((field, index) => (
          <div key={index} className="admin-partner__fleet-body-block">
            <label htmlFor={`title-${index}`}>Title</label>
            <input
              name={`title-${index}`}
              id={`title-${index}`}
              type="text"
              className=""
              value={tourPackageInfoFields[index].title}
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
              value={tourPackageInfoFields[index].description}
              onChange={(e) =>
                handleTourPackageInfoChange(
                  index,
                  "description",
                  e.target.value
                )
              }
            />
            <button
              type="button"
              className="btn btn-sm btn-danger"
              style={{ width: "1rem" }}
              onClick={() => handleTourPackageInfoDelete(index)}
            >
              Delete
            </button>
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

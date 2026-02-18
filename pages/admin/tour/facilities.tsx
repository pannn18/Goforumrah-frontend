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
import { useRouter } from "next/router";

export default function FacilitiesDetails() {
    const [facilities, setFacilities] = useState<any>([
        { facility_name: "", included: 1 },
    ]); // Handled

    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Tour Package Info

    // Facility
    const handleAddMoreFacility = () => {
        // console.log(facilities);
        setFacilities([...facilities, { facility_name: "", include_status: 1 }]);
    };

    const handleFacilityChange = (index, value) => {
        const updatedFacilities = [...facilities];
        updatedFacilities[index].facility_name = value;
        setFacilities(updatedFacilities);
    };

    const handleIncludedStatusChange = (index, value) => {
        const updatedFacilities = [...facilities];
        updatedFacilities[index].include_status = value;
        setFacilities(updatedFacilities);
    };

    // get id_tour_package from router
    const router = useRouter();
    const { id: id_tour_package } = router.query;

    const getFacilitiesData = async () => {
        setIsLoading(true); // Set loading to true when starting data fetching

        try {
            // Get detail tour package from api
            const { ok, data, error } = await callAPI("/tour-package/tour-details", "POST", { id_tour_package }, true);

            if (ok) {
                // console.log("data", data.tour_facilities);
                // set data to planState
                setFacilities(data.tour_facilities);
                console.log('Facilities Data:', data.tour_facilities);
            } else {
                console.error("Failed to fetch plans data:", error);
            }
        } catch (error) {
            console.error("An error occurred while getting data:", error);
        } finally {
            setIsLoading(false); // Set loading back to false once data fetching is complete
        }
    }

    const handleSave = async () => {
        setIsLoading(true);

        try {
            // After storing the tour package, store the facilities and retrieve id_tour_package from API response
            const facilitiesArray = facilities.map((facility) => ({
                id_tour_facility: facility.id_tour_facility || null, // Add this line to handle existing facilities
                facility_name: facility.facility_name,
                include_status: facility.include_status,
            }));

            const payloadFacilities = {
                id_tour_package: id_tour_package,
                facilities: facilitiesArray,
            };

            console.log('facilities array', facilitiesArray);

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

            setIsLoading(false);
            getFacilitiesData();
        } catch (error) {
            console.error("An error occurred while storing data:", error);
            setIsLoading(false);
        }
    };


    useEffect(() => {
        getFacilitiesData();
    }, [id_tour_package])

    return (
        <Layout>
            <AdminLayout pageTitle="Facilities Details" enableBack={true}>
                <div className="admin-partner__detail">
                    <div className="container">
                        <form action="" className="admin-partner__car-edit">    
                            {isLoading ? (
                                <LoadingOverlay />
                            ) : (
                                <Fragment>
                                    <TourPackageFacilities
                                        handleIncludedStatusChange={handleIncludedStatusChange}
                                        handleFacilityChange={handleFacilityChange}
                                        facilities={facilities}
                                        handleAddMoreFacility={handleAddMoreFacility}
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

interface TourPackageFacilitiesProps {
    facilities: { facility_name: string; include_status: number }[];
    handleFacilityChange: (index: number, value: string) => void;
    handleIncludedStatusChange: (index: number, value: number) => void;
    handleAddMoreFacility: () => void;
}


// Tour Package Facilities
const TourPackageFacilities = (props: TourPackageFacilitiesProps) => {
    const { facilities, handleFacilityChange, handleAddMoreFacility, handleIncludedStatusChange } = props;
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
                                value={facility.facility_name}
                                onChange={(e) => handleFacilityChange(index, e.target.value)}
                            />
                        </div>
                        <div className="admin-partner__fleet-body-block">
                            <label htmlFor={`facilities-status-${index}`}>
                                Facilities Status
                            </label>
                            <select
                                name={`facilities-status-${index}`}
                                id={`facilities-status-${index}`}
                                value={facility.include_status}
                                onChange={(e) => handleIncludedStatusChange(index, parseInt(e.target.value))}
                            >
                                <option value="1">Included</option>
                                <option value="2">Not Included</option>
                            </select>
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

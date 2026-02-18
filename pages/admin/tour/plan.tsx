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

export default function PlanLocation() {
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

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFormDirty, setIsFormDirty] = useState<boolean>(false);

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

    // get id_tour_package from router
    const router = useRouter();
    const { id: id_tour_package } = router.query;

    const getPlansData = async () => {
        setIsLoading(true); // Set loading to true when starting data fetching

        try {
            // Get detail tour package from api
            const { ok, data, error } = await callAPI("/tour-package/tour-details", "POST", { id_tour_package }, true);

            if (ok) {
                console.log("data", data);
                // set data to planState
                setTourPackagePlans(data.tour_plans);
            } else {
                console.error("Failed to fetch plans data:", error);
            }
        } catch (error) {
            console.error("An error occurred while getting data:", error);
        } finally {
            setIsLoading(false); // Set loading back to false once data fetching is complete
        }
    };

    // API NEED FIX FOR PLAN LOCATION
    const handleSave = async () => {
        setIsLoading(true);

        try {

            // After store photos, store the plans and retrieve id_tour_package from API response
            const plansArray = tourPackagePlans?.map((plan) => ({
                id_tour_package: id_tour_package,
                id_tour_plan: plan.id_tour_plan || null,
                type_plan: plan.type_plan,
                plan_name: plan.plan_name,
                price: plan.price,
                total_day: plan.total_day,
                plan_location: plan.plan_location.map((location) => ({
                    id_tour_plan_location: location.id_tour_plan_location || null,
                    city: location.city,
                    order_day: location.order_day,
                    location: location.location,
                    location_activity: location.location_activity,
                })),
            }));

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

            console.log('payload :', plansArray);

            {/**  */ }

            setIsLoading(false);
            getPlansData();

            setIsFormDirty(false);
        } catch (error) {
            console.error("An error occurred while storing data:", error);
            setIsLoading(false);
        }
    };

    const handleInputChange = () => {
        // This function will be called whenever there is a change in the input fields
        setIsFormDirty(true);
    };

    useEffect(() => {
        getPlansData();
    }, [id_tour_package]);

    return (
        <Layout>
            <AdminLayout pageTitle="Plans & Location Details" enableBack={true}>
                <div className="admin-partner__detail">
                    <div className="container">
                        <form action="" className="admin-partner__car-edit">
                            {isLoading ? (
                                <LoadingOverlay />
                            ) : (
                                <Fragment>
                                    <TourPackagePlan
                                        setTourPackagePlans={setTourPackagePlans}
                                        handleAddMorePlan={handleAddMorePlan}
                                        tourPackagePlans={tourPackagePlans}
                                        onInputChange={handleInputChange}
                                    />
                                </Fragment>
                            )}

                            <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                                <button
                                    type="button"
                                    className="btn btn-lg btn-success"
                                    onClick={handleSave}
                                    disabled={!isFormDirty}
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
    onInputChange: () => void;
}

// Tour Package Plan
const TourPackagePlan = (props: TourPackagePlanProps) => {
    const { tourPackagePlans, setTourPackagePlans, handleAddMorePlan, onInputChange } = props;

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
                                        onInputChange();
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
                                        onInputChange();
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
                                        onInputChange();
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
                                        onInputChange();
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
                                                onInputChange();
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
                                                onInputChange();
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
                                                onInputChange();
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
                                                onInputChange();
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
                    Add More Plan
                </button>
            </div>
        </div>
    );
};

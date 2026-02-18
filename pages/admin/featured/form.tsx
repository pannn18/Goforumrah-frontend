import Layout from "@/components/layout";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { callAPI } from "@/lib/axiosHelper";
import { useSession } from "next-auth/react";
import Navbar from "@/components/business/car/navbar";
import SVGIcon from "@/components/elements/icons";
import { Icons, Images, Services } from "@/types/enums";
import { BlurPlaceholderImage } from "@/components/elements/images";
import placeholder from "@/public/images/placeholder.svg";
import AdminLayout from "@/components/admin/layout";
import LoadingOverlay from "@/components/loadingOverlay";
import { useRouter } from "next/router";

export default function FeaturedCity() {
    const [cityData, setCityData] = useState("");
    const [photo, setPhoto] = useState("");
    const [isDirty, setIsDirty] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onSubmitFeatured = async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);

            const formData = new FormData();
            formData.append("city", cityData);
            formData.append("icon", photo);

            const response = await callAPI("/featured-city/store", "POST", formData, true);

            if (response.status === 200) {
                setIsLoading(false);
                console.log("Success Message :", response.data);
            }
        } catch (error) {
            setIsLoading(false);
            console.log('Error Message :', error);
        } finally {
            setIsLoading(false);
            router.push("/admin/featured");
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhoto(e.target.result.toString());
        };
        reader.readAsDataURL(file);
        setIsDirty(true);
    };

    const handleButtonClick = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCityChange = (e) => {
        e.preventDefault();
        setCityData(e.target.value);
        setIsDirty(true);
    }

    if (isLoading) {
        return <LoadingOverlay />;
    }

    return (
        <Layout>
            <AdminLayout pageTitle="Featured City Form" enableBack={true}>
                <div className="business-profile w-50">
                    <div className="container">
                        <form id="myForm" onSubmit={onSubmitFeatured}>
                            <div className="account mb-0">
                                <div className="account__block">
                                    <label htmlFor="">City Icon</label>
                                    <div className="account__profile">
                                        {photo == "" ? (
                                            <BlurPlaceholderImage
                                                src={placeholder}
                                                alt=""
                                                width={123}
                                                height={123}
                                            />
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={photo}
                                                alt=""
                                                width={123}
                                                height={123}
                                            />
                                        )}
                                        <button
                                            onClick={handleButtonClick}
                                            className="btn btn-sm btn-outline-success"
                                        >
                                            {photo == "" ? "Add Icon" : "Change Icon"}
                                        </button>
                                       <p>{photo !== "" ? "Don't forget to Save & fill the City Name to store data!" : "Choose your images for Icon"}</p>
                                        <input
                                            type="file"
                                            name="file"
                                            id="file"
                                            ref={fileInputRef}
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                </div>
                                <div className="account__row">
                                    <div className="account__block">
                                        <label htmlFor="businessCarFirstName">City Name</label>
                                        <input
                                            type="text"
                                            name="businessCarFirstName"
                                            id="businessCarFirstName"
                                            placeholder="City"
                                            className="form-control"
                                            onChange={handleCityChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="account">
                                <div className="account__row">
                                    <button
                                        type="submit"
                                        form="myForm"
                                        className="btn btn-md btn-success"
                                        disabled={!isDirty || cityData == ""}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </AdminLayout>
        </Layout>
    );
}

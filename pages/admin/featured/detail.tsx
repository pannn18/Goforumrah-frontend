import Layout from "@/components/layout";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
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

export default function FeaturedCity() {
    const router = useRouter();
    const { id: id_featured_city } = router.query;

    const [formDataFeatured, setFormDataFeatured] = useState({
        id_featured_city: id_featured_city,
        city: "",
        icon: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    // Add a state variable to track whether a new file has been selected
    const [isNewFileSelected, setIsNewFileSelected] = useState(false);

    // Retrive data from API
    const [FeaturedCityData, setFeaturedCityData] = useState(null);

    useEffect(() => {
        if (id_featured_city) return;
        setFormDataFeatured({
            ...formDataFeatured,
            id_featured_city: id_featured_city,
        });
    }, [id_featured_city]);

    const getDataById = async () => {
        if (!id_featured_city) return;
        setIsLoading(true);

        try {
            const { status, data, ok, error } = await callAPI(
                "/featured-city/show",
                "POST",
                { id_featured_city: id_featured_city },
                true
            );

            setFeaturedCityData(data);

            if (ok) {
                const featuredCityDatas = data;

                console.log("Business Settings Account Show : ", featuredCityDatas);

                setFormDataFeatured({
                    id_featured_city: featuredCityDatas.id_featured_city,
                    city: featuredCityDatas.city,
                    icon: featuredCityDatas.icon,
                });
                setCityIcon(featuredCityDatas.icon);
            }
        } catch (error) {
            console.log("Error : ", error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getDataById();
    }, []);

    const onSubmitFeatured = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const FormFeaturedCopy = {
            ...formDataFeatured,
        };

        // Set profile_photo to an empty string only if a new file is not selected
        if (!isNewFileSelected) {
            FormFeaturedCopy.icon = "";
        }

        console.log("PLIS", FormFeaturedCopy);

        const { ok, error } = await callAPI(
            "/featured-city/store",
            "POST",
            FormFeaturedCopy,
            true
        );
        if (ok) {
            console.log("Success");
            router.push("/admin/featured");
        } else {
            console.log("iniiiieror", error);
        } 

        setIsLoading(false);
    };



    const [cityIcon, setCityIcon] = useState(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    console.log("FOTO", cityIcon);

    const handleFileChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCityIcon(reader.result);
                setFormDataFeatured((prevState) => ({
                    ...prevState,
                    icon: reader.result.toString(),
                }));
            };
            reader.readAsDataURL(file);
            setIsNewFileSelected(true); // Set the flag for a new file
        } else {
            setIsNewFileSelected(false); // Reset the flag if no file is selected
        }
    };

    const handleButtonClick = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // const addImageURL = (image) => {
    //     return `https://api.goforumrah.com/storage/${image}`;
    // };

    if (isLoading) {
        return <LoadingOverlay />;
    }

    return (
        <Layout>
            <AdminLayout pageTitle={`${FeaturedCityData?.city} Details`} enableBack={true}>
                <div className="business-profile w-50">
                    <div className="container">
                        <form id="myForm" >
                            <div className="account mb-0">
                                <div className="account__block">
                                    <label htmlFor="">City Icon</label>
                                    <div className="account__profile">
                                        {cityIcon ? (
                                            <img
                                                src={cityIcon}
                                                alt="Profile Photo"
                                                className="account__profile-preview"
                                            />
                                        ) : (
                                            <BlurPlaceholderImage
                                                src={placeholder}
                                                alt="Profile Photo"
                                                className="account__profile-preview"
                                            />
                                        )}
                                        <button
                                            onClick={handleButtonClick}
                                            className="btn btn-sm btn-outline-success"
                                        >
                                            Change
                                        </button>
                                        <input
                                            type="file"
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
                                            value={formDataFeatured.city}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setFormDataFeatured((prevData) => ({
                                                    ...prevData,
                                                    city: newValue,
                                                }));
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="account align-items-end">
                                <div className="account__row">
                                    <button
                                        type="submit"
                                        form="myForm"
                                        className="btn btn-md btn-success"
                                        disabled={!isNewFileSelected && !formDataFeatured.city}
                                        onClick={onSubmitFeatured}
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

// const ProfileHeader = () => {
//     const router = useRouter();
//     return (
//         <section className="business-profile__header">
//             <div className="container">
//                 <div className="business-profile__header-inner">
//                     <button
//                         onClick={() => router.back()}
//                         className="business-profile__header-back"
//                     >
//                         <SVGIcon src={Icons.ArrowLeft} height={24} width={24} />
//                         <h4>Back</h4>
//                     </button>
//                     <div className="ms-auto d-flex gap-5 align-items-center">
//                         <button
//                             type="button"
//                             className="btn btn-sm btn-outline-success"
//                             data-bs-toggle="modal"
//                             data-bs-target="#editModal"
//                         >
//                             Change Password
//                         </button>
//                         <button
//                             type="submit"
//                             form="myForm"
//                             className="btn btn-sm btn-success"
//                         >
//                             Save
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

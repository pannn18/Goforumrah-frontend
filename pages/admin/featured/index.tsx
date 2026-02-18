import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import Link from "next/link";
import { callAPI } from "@/lib/axiosHelper";
import useFetch from "@/hooks/useFetch";
import { BlurPlaceholderImage } from "@/components/elements/images";
import { Icons, Images } from "@/types/enums";
import LoadingOverlay from "@/components/loadingOverlay";
import moment from "moment";

export default function FeaturedCity() {
    const [featuredData, setFeaturedData] = useState<any>([]);
    const [search, setSearch] = useState<string>("");
    const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
    const [displayFilter, setDisplayFilter] = useState("This Year");
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(4);

    const [cityToDelete, setCityToDelete] = useState(null);

    // Pagination Settings
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const startIndex = (currentPage - 1) * itemsPerPage;

    // // Handle for filter
    // const handleFilterChange = (value) => {
    //     if (value !== filter) {
    //         setFilter(Number(value));

    //         if (value === 1) setDisplayFilter("Today");
    //         if (value === 2) setDisplayFilter("This Week");
    //         if (value === 3) setDisplayFilter("This Month");
    //         if (value === 4) setDisplayFilter("This Year");
    //     }
    //     setLoading(true);
    //     setCurrentPage(1);
    //     setShowFilterDropdown(false);
    // };

    const openPopupDelete = (id_featured_city, city) => {
        setCityToDelete({ id_featured_city, city });
    };

    console.log(" city to delete", cityToDelete);

    const onActionForm = async () => {
        setLoading(true);
        fetchData(currentPage);
        window.scrollTo({ top: 0, behavior: "auto" });
    };

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, filter, search]);

    const fetchData = async (page) => {
        try {
            // Fetch data for Show Featured City
            const [dataAll] = await Promise.all([
                callAPI(
                    `/featured-city/show`,
                    "POST",
                    { id_featured_city: null },
                    true
                ),
            ]);

            const updatedTabs = dataAll.data;
            console.log("data all", dataAll);

            const totalCount = featuredData.length;
            const totalPagesAll = Math.ceil(totalCount / itemsPerPage);

            setTotalPages(totalPagesAll);

            setFeaturedData(updatedTabs);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
        setLoading(false);
    };

    // const handleSearchChange = (event) => {
    //     setSearch(event.target.value);
    //     setLoading(false);
    //     setCurrentPage(1);
    // };

    const handleSubmitDelete = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formDataDelete = {
                id_featured_city: cityToDelete.id_featured_city,
                soft_delete: 1,
            };

            const { status, data, ok, error } = await callAPI(
                "/featured-city/store",
                "POST",
                formDataDelete,
                true
            );

            console.log(status, data, ok, error);
            if (ok) {
                console.log("Success", status, data, ok, error);
                onActionForm();
            }

            console.log("delete form data", formDataDelete);

            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Layout>
            <AdminLayout pageTitle="Featured City">
                <div className="container">
                    <div className="admin-customer pt-0">
                        <div className="admin-customer__wrapper">
                            <div className="admin-customer__header">
                                <div className="admin-partner__header">
                                    <Link
                                        href={`/admin/featured/form`}
                                        className="btn btn-sm btn-outline-success"
                                    >
                                        <SVGIcon src={Icons.Plus} width={20} height={20} />
                                        Add City
                                    </Link>
                                </div>
                            </div>
                            <div className="admin-customer__content">
                                <div className="">
                                    <table className="admin-customer__table">
                                        <thead>
                                            <tr className="admin-customer__table-list">
                                                <th>No.</th>
                                                <th>City Name</th>
                                                <th>Icon</th>
                                                <th>Published</th>
                                                <th>Last Updated</th>
                                                <th className="admin-customer__table-header-center">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading && (
                                                <tr>
                                                    <td>
                                                        <LoadingOverlay />
                                                    </td>
                                                </tr>
                                            )}
                                            {featuredData?.length ? (
                                                featuredData?.map((featured, index) => (
                                                    <CustomerList
                                                        {...featured}
                                                        index={startIndex + index + 1}
                                                        key={index}
                                                        openPopupDelete={openPopupDelete}
                                                    />
                                                ))
                                            ) : (
                                                <tr className="admin-customer__table-list">
                                                    <td colSpan={9} className="text-center">
                                                        Sorry, No Featured City found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Modal Delete */}
                    <div
                        className="modal fade"
                        id="deleteModal"
                        tabIndex={-1}
                        aria-labelledby="deleteModalLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog cancelation__modal">
                            <div className="modal-content cancelation__modal-body">
                                <div className="cancelation__modal-content">
                                    <div className="cancelation__modal-image">
                                        <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
                                    </div>
                                    <div className="cancelation__modal-text">
                                        <h3>
                                            Delete{" "}
                                            <span className="fw-bolder">{cityToDelete?.city}</span>
                                        </h3>
                                        <p className="cancelation__modal-desc">
                                            Deleted city cannot be returned, do you really want to
                                            delete it ?
                                        </p>
                                    </div>
                                </div>
                                <div className="cancelation__modal-footer">
                                    <button
                                        data-bs-dismiss="modal"
                                        className="btn btn-lg btn-outline-secondary cancelation__modal-button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        data-bs-dismiss="modal"
                                        className="btn btn-lg goform-button--fill-red cancelation__modal-button"
                                        onClick={handleSubmitDelete}
                                    >
                                        Confirm Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* End Modal Delete */}
                </div>
            </AdminLayout>
        </Layout>
    );
}

interface FeaturedListProps {
    id_featured_city: number;
    city: string;
    icon: string;
    soft_delete: number;
    updated_at: string;
    created_at: string;
}
const CustomerList = (
    props: FeaturedListProps & { index: number; openPopupDelete }
) => {
    const {
        openPopupDelete,
        index,
        id_featured_city,
        city,
        updated_at,
        created_at,
        icon,
        soft_delete,
    } = props;
    const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false);

    //Function to count last Updated (update_at) then format to hour or day or month or year
    const countLastUpdated = (date) => {
        const dateNow = new Date();
        const dateUpdated = new Date(date);
        const timeDiff = Math.abs(dateNow.getTime() - dateUpdated.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const diffHours = Math.ceil(timeDiff / (1000 * 3600));
        const diffMinutes = Math.ceil(timeDiff / (1000 * 60));
        const diffSeconds = Math.ceil(timeDiff / 1000);

        if (diffDays > 365) return `${Math.ceil(diffDays / 365)} years ago`;
        if (diffDays > 30) return `${Math.ceil(diffDays / 30)} months ago`;
        if (diffHours > 24) return `${diffDays} days ago`;
        if (diffMinutes > 60) return `${diffHours} hours ago`;
        if (diffSeconds > 60) return `${diffMinutes} minutes ago`;
        return `${diffSeconds} seconds ago`;
    };

    // //Funtion to add https://api.goforumrah.com/storage/ to icon data from API to prevent error from image
    // const addImageURL = (image) => {
    //     return `https://api.goforumrah.com/storage/${image}`;
    // }; //temporary

    return (
        <tr className="admin-customer__table-list">
            <td>{index < 10 ? `0${index}` : index}</td>
            <td>
                <div className="admin-customer__table-name">{city || "NULLNAME"}</div>
            </td>
            <td>
                <BlurPlaceholderImage
                    src={icon}
                    width={40}
                    height={40}
                    alt="FeaturedCityIcon"
                />
            </td>
            <td>
                <div className="admin-partner__table-list--icon">
                    <SVGIcon src={Icons.Calendar} width={20} height={20} className="" />
                    {moment(created_at).format("DD MMM YYYY")}
                </div>
            </td>
            <td>
                <div className="admin-customer__table-list--icon">
                    <SVGIcon src={Icons.CircleTime} width={20} height={20} className="" />
                    {countLastUpdated(updated_at)}
                </div>
            </td>
            <td>
                <div className="custom-dropdown">
                    <div
                        onClick={() => setShowActionDropdown(true)}
                        className="custom-dropdown-toggle admin-booking-hotel__table-dropdown"
                    >
                        <SVGIcon src={Icons.More} width={20} height={20} className="" />
                    </div>
                    <DropdownMenu
                        show={showActionDropdown}
                        setShow={setShowActionDropdown}
                        className="admin-booking-hotel__header-dropdown-menu"
                        style={{ marginTop: 1, marginLeft: -110, width: 155 }}
                    >
                        <div className="custom-dropdown-menu__options">
                            <Link
                                href={`/admin/featured/detail?id=${id_featured_city}`}
                                className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                            >
                                <div className="admin-booking-hotel__dropdown-menu-option-details">
                                    <SVGIcon
                                        src={Icons.Pencil}
                                        width={20}
                                        height={20}
                                        className=""
                                    />
                                    <p>Edit</p>
                                </div>
                            </Link>
                            <div className="admin-customer__dropdown-separator"></div>
                            <Link
                                href=""
                                className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                                onClick={() => openPopupDelete(id_featured_city, city)}
                                data-bs-toggle="modal"
                                data-bs-target="#deleteModal"
                            >
                                <div className="admin-booking-hotel__dropdown-menu-option-delete">
                                    <SVGIcon
                                        src={Icons.Trash}
                                        width={20}
                                        height={20}
                                        className=""
                                    />
                                    <p>Delete</p>
                                </div>
                            </Link>
                        </div>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    );
};

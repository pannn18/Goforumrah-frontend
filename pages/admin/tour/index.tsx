import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useState, useMemo } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { callAPI } from "@/lib/axiosHelper"
import moment from "moment"
import LoadingOverlay from "@/components/loadingOverlay"


export default function TourPackage() {

    // Retrive Data From API
    const [tourData, setTourData] = useState(null)
    const [tourLoading, setTourLoading] = useState(true)
    const [tourOk, setTourOk] = useState(false)

    const [categoryData, setCategoryData] = useState(null)
    const [categoryLoading, setCategoryLoading] = useState(true)
    const [categoryOk, setCategoryOk] = useState(null)


    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage] = useState(4)
    const indexOfLastPost = currentPage * postPerPage
    const indexOfFirstPost = indexOfLastPost - postPerPage
    const [search, setSearch] = useState('')

    const [blogToDelete, setBlogToDelete] = useState(null);


    const openPopupDelete = (idTour) => {
        setBlogToDelete(idTour);
    };

    const fetchTourData = async () => {
        try {
            const { status, data, ok, error } = await callAPI('/tour-package/show-all', 'POST', search, true);
            setTourData(data)
            setTourOk(true)
            console.log(data);
        } catch (error) {
            setTourLoading(false)
            console.log(error);
        } finally {
            setTourLoading(false)
        }
    };

    const onActionForm = async () => {
        fetchTourData()
        window.scrollTo({ top: 0, behavior: 'auto' })
    };

    useEffect(() => {
        if (tourData) return
        fetchTourData()
        setCurrentPage(1);
    }, [tourData, search])

// Function to sort tours by date in descending order
const sortToursByDate = (tours) => {

    const sortedTours = (tours || []).slice().sort((a, b) => {
        const dateA = new Date(b.created_at) as any;
        const dateB = new Date(a.created_at) as any;

        return dateA - dateB;
    });

    return sortedTours;
};

const filteredTour = sortToursByDate(tourData?.filter((tour) => {
    return tour.package_name.toLowerCase().includes(search.toLowerCase());
})) || []; 

const currentFilteredTour = filteredTour.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <Layout>
            <AdminLayout pageTitle="Tour Package">
                <div className="container">
                    <div className="admin-tour">
                        <div className="admin-tour__wrapper">
                            <div className="admin-tour__header">
                                <div className="admin-tour__header-split">
                                    <div className="admin-tour__header-search">
                                        <input type="text" className="form-control" placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                                        <SVGIcon src={Icons.Search} width={20} height={20} />
                                    </div>
                                </div>
                                <Link href="/admin/tour/package-form" type="button" className="btn btn-sm btn-outline-success">
                                    <SVGIcon src={Icons.Plus} width={20} height={20} className="" />
                                    Add Tour
                                </Link>
                            </div>

                            <div className="admin-tour__list">
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem',
                                        height: `calc(100vh - 100px)`
                                    }}>

                                    {tourLoading ? (
                                        <LoadingOverlay />
                                    ) : (
                                        tourData?.length === 0 ? (
                                            <div className="admin-tour__list-item">
                                                <p className="admin-tour__list-item__label">No Data</p>
                                            </div>
                                        ) : (
                                            currentFilteredTour?.map((tour, index) => (
                                                <Tour key={index}
                                                    tourOk={tourOk}
                                                    packageName={tour.package_name}
                                                    created_at={tour.created_at}
                                                    tourId={tour.id_tour_package}
                                                    price={tour.price}
                                                    description={tour.description}
                                                    thumbnail={tour.tour_photos}
                                                    totalDay={tour.total_day}
                                                    idBlogtoDelete={blogToDelete}
                                                    openPopupDelete={() => openPopupDelete(tour.id_tour_package)}
                                                    onActionForm={onActionForm}
                                                />
                                            ))
                                        )
                                    )}

                                </div>
                                <div className="admin-booking-tour__pagination mt-5">
                                    {!!tourData?.length
                                        ? <Pagination data={tourData} currentPage={currentPage} postPerPage={postPerPage} setCurrentPage={setCurrentPage} />
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        </Layout >
    )
}

const Tour = (
    {
        tourOk,
        packageName,
        created_at,
        tourId,
        price,
        description,
        thumbnail,
        totalDay,
        idBlogtoDelete,
        openPopupDelete,
        onActionForm
    }) => {

    const handleSubmitDelete = async (event) => {
        event.preventDefault();

        const formDataDelete = {
            id_tour_package: idBlogtoDelete,
            soft_delete: 1,
        };

        const { status, data, ok, error } = await callAPI('/tour-package/store', 'POST', formDataDelete, true)

        console.log('PAYLOAD DELETE', formDataDelete);
        console.log(status, data, ok, error);
        if (ok) {
            console.log("Success", status, data, ok, error);
            // Call the onActionForm callback here
            onActionForm();
        } else {
            console.log(error);
        }
    }

    if (tourOk) {
        return (
            <div className="admin-tour__list-item">
                <div className="admin-tour__list-item__header">
                    <BlurPlaceholderImage className="admin-tour__list-item__header-image" alt="profilePhoto" src={thumbnail} width={80} height={80} />
                    <div>
                        <p className="admin-tour__list-item__header-title"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >{packageName}</p>
                        <p className="admin-tour__list-item__label"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >{description}</p>
                    </div>
                </div>
                <div className="admin-tour__list-item__published">
                    <p className="admin-tour__list-item__label">Published</p>
                    <div className="admin-tour__list-item__published-date">
                        <SVGIcon src={Icons.Calendar} width={16} height={16} className="MapIcon" />
                        <span
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: '2',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px',
                            }}
                        >
                            {moment(created_at).format('DD MMM YYYY')}
                        </span>
                    </div>
                </div>
                <div className="admin-tour__list-item__published">
                    <p className="admin-tour__list-item__label">Total Day</p>
                    <div className="admin-tour__list-item__published-date">
                        <SVGIcon src={Icons.Sun} width={16} height={16} className="CalendarIcon" />
                        <p>{totalDay ?? 0}</p>
                    </div>
                </div>
                <div className="admin-tour__list-item__action">
                    <button onClick={() => openPopupDelete()} className="admin-tour__list-item__action-delete" data-bs-toggle="modal" data-bs-target="#deleteModal">
                        <SVGIcon src={Icons.Trash} width={16} height={16} className="" />
                    </button>
                    <Link href={`/admin/tour/edit?id=${tourId}`} className="btn btn-outline-success">Edit</Link>
                </div>

                {/* Modal PopupDelete */}
                <div className="modal fade" id="deleteModal" tabIndex={-1} aria-labelledby="deleteModalLabel" aria-hidden="true">
                    <div className="modal-dialog cancelation__modal">
                        <div className="modal-content cancelation__modal-body">
                            <div className="cancelation__modal-content">
                                <div className="cancelation__modal-image">
                                    <SVGIcon src={Icons.CircleCancel} width={48} height={48} />
                                </div>
                                <div className="cancelation__modal-text">
                                    <h3>Delete Tour Package</h3>
                                    <p className="cancelation__modal-desc">Deleted tour cannot be returned, do you really want to delete it ?</p>
                                </div>
                            </div>
                            <div className="cancelation__modal-footer">
                                <button data-bs-dismiss="modal" className="btn btn-lg btn-outline-secondary cancelation__modal-button">Cancel</button>
                                <button data-bs-dismiss="modal" className="btn btn-lg goform-button--fill-red cancelation__modal-button" onClick={handleSubmitDelete}>Confirm Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Modal PopupDelete */}
            </div >
        )
    }
}

const Pagination = ({ currentPage, setCurrentPage, data, postPerPage }) => {

    const pageCounts = Math.ceil(data.length / postPerPage)

    return (
        <div className="hotel-details__guest-pagination">
            <div className="pagination">
                <button type="button"
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(90deg)', cursor: currentPage === 1 ? 'default' : 'pointer' }}>
                    <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                </button>
                {Array.from({ length: pageCounts }, (_, i) => i + 1).map((number) => {
                    const isCloseToCurrent = number >= currentPage - 2 && number <= currentPage + 2
                    const hasMoreOnLeft = number !== 1 && number === currentPage - 3
                    const hasMoreOnRight = number !== pageCounts && number === currentPage + 3
                    const isFirst = number === 1
                    const isLast = number === pageCounts

                    const isVisible = isCloseToCurrent || hasMoreOnLeft || hasMoreOnRight || isFirst || isLast

                    return isVisible && (
                        <button key={number} onClick={() => !(hasMoreOnLeft || hasMoreOnRight) && setCurrentPage(number)} type="button" className={`pagination__button ${number === currentPage ? 'active' : ''}`} style={{ cursor: hasMoreOnLeft || hasMoreOnRight ? 'default' : 'pointer' }}>{(hasMoreOnLeft || hasMoreOnRight) ? '...' : number}</button>
                    )
                })}
                <button type="button" onClick={() => currentPage < pageCounts && setCurrentPage(currentPage + 1)} className="pagination__button pagination__button--arrow" style={{ transform: 'rotate(-90deg)', cursor: currentPage === pageCounts ? 'default' : 'pointer' }}>
                    <SVGIcon src={Icons.ArrowDown} width={24} height={24} />
                </button>
            </div>
        </div>
    )
}
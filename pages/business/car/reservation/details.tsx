import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BlurPlaceholderImage } from '@/components/elements/images'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import Layout from "@/components/layout";
import Navbar from '@/components/business/car/navbar'
import InnerLayout from "@/components/business/hotel/layout"
import { Icons, Images } from "@/types/enums"
import SVGIcon from "@/components/elements/icons"
import { useRouter } from "next/router";
import { callAPI } from "@/lib/axiosHelper";
import { useSession } from "next-auth/react";
import countryList from 'country-list';
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import LoadingOverlay from "@/components/loadingOverlay";
import { redirect } from "next/dist/server/api-utils";

export default function CarReservationDetails() {
    const router = useRouter()
    const { data: session, status } = useSession()

    const id_car_business = (status === 'authenticated' || session ? Number(session.user.id) : null)
    const id_car_booking = router.query.id_car_booking
    const id_customer = router.query.id_customer

    const [details, setDetails] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!id_car_business || !id_car_booking || !id_customer) {
            return
        }
        if (details) {
            return
        }

        // Get details data
        const payload = {
            "id_car_booking": id_car_booking,
            "id_car_business": id_car_business,
            "id_customer": id_customer,
            "sort": 1,
            "completed": null
        }

        const getDetails = async () => {
            try {
                const { data, ok, error } = await callAPI(`/car-business-booking/show-booking`, 'POST', payload, true)
                if (error) {
                    console.log(error);
                }
                if (ok) {
                    setDetails(data?.[0])
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false)
            }
        }

        getDetails()
    }, [id_car_business, details])

    const seat = details?.car_facilities?.find(item => item.name_facility === 'Seat' && item.status === 1);
    const door = details?.car_facilities?.find(item => item.name_facility === 'Doors' && item.status === 1);

    const getCountryFlagUrl = (countryCode) => {

        if (countryCode.length >= 3) {
            const code = countryList.getCode(countryCode || 'SA')
            return `https://flagsapi.com/${code}/flat/64.png`
        } else {
            return `https://flagsapi.com/${countryCode}/flat/64.png`
        }

        // return country
    };

    // for pickup adn dropoff format
    const pickup = moment(details?.pickup_date_time)
    const dropoff = moment(details?.dropoff_date_time)

    const duration = moment.duration(dropoff.diff(pickup));
    const days = duration.days();
    const hours = duration.hours();

    // Handle Print
    const componentRef = useRef()
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${details?.car_brand}-[${id_car_booking}]-Reservation Details`,
        pageStyle: `
            @page {
                size: A3;
            }

            @media all {
                .pagebreak {
                display: none;
                }
            }

            @media print {

            .pagebreak {
            page-break-before: always;
            }

            @supports (-webkit-print-color-adjust: exact) {
            body {
                -webkit-print-color-adjust: exact;
            }
            }
        }`
    });

    const handleMarkPickup = async () => {
        const payload = {
            "id_car_booking": id_car_booking,
            "pickup_date_time": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }

        const { data, ok, error } = await callAPI(`/car-business-booking/mark-as`, 'POST', payload, true)
        if (error) {
            console.log(error);
        }
        if (ok) {
            console.log(data);
        }
    }

    const handleMarkDropoff = async () => {
        const payload = {
            "id_car_booking": id_car_booking,
            "dropoff_date_time": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        }

        const { data, ok, error } = await callAPI(`/car-business-booking/mark-as`, 'POST', payload, true)
        if (error) {
            console.log(error);
        }
        if (ok) {
            console.log(data);
        }
    }

    if (loading) {
        return <LoadingOverlay />
    }



    return (
        <Layout>
            <div className="sticky-top">
                <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
                <HeaderReservation />
            </div>

            <div className="car-dashboard">
                <div className="car-dashboard__content-container">
                    <div className="container">
                        <div className="admin-latest-business__top-header">
                            <div className="admin-latest-business__top-header-wrapper">
                                <h4 className="admin-latest-business__top-header-title">Reservation Detail</h4>
                            </div>
                            <button type="button" onClick={handlePrint} className="btn btn-md btn-outline-success"> Export <SVGIcon src={Icons.Download} width={18} height={18} /> </button>
                        </div>
                        <div className='admin-reservation__content-container'>
                            <div className="admin-reservation__form row">



                                <div className="company-detail__content-form admin-reservation__content-form" ref={componentRef}>
                                    <div className="admin-reservation__guest">
                                        <div className="admin-reservation__profile">
                                            <p className="admin-reservation__title-content">Customer Name</p>
                                            <div className="admin-reservation__profile-content">
                                                <div className="admin-reservation__profile-person">
                                                    <BlurPlaceholderImage className="manage-review__modal-desc-image" src={Images.Placeholder} alt="Review Image" width={40} height={40} />
                                                    <h4 className="admin-reservation__title-content--bold text-capitalize">{details?.fullname}</h4>
                                                </div>
                                                <div className="admin-reservation__profile-region">
                                                    <img src={getCountryFlagUrl(details?.country)} width={20} height={20} />
                                                    <p className="admin-reservation__caption-content--black">{countryList.getName(details?.country) || details?.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-reservation__booking-number">
                                            <p className="admin-reservation__title-content">Booking number :</p>
                                            <p className="admin-reservation__booking-id">#{details?.id_car_booking}</p>
                                        </div>
                                    </div>
                                    <div className="cancelation__car-summary mb-5">
                                        <img
                                            className="cancelation__car-summary-image"
                                            src={details?.photo || Images.Placeholder}
                                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                                const target = e.currentTarget;
                                                target.src = Images.Placeholder; // Ganti dengan placeholder jika terjadi kesalahan
                                            }}
                                            alt="Car Preview"
                                            width={120}
                                            height={100}
                                        />
                                        <div className="cancelation__car-summary-text">
                                            <p className="cancelation__car-summary-name">
                                                {`${details?.car_brand} ${details?.model}`}
                                            </p>
                                            <div className="cancelation__car-summary-brand">
                                                <img className="cancelation__car-summary-brand--image" src={details?.car_company?.profile_icon || Images.Placeholder} alt="Hotel Preview" width={24} height={24} />
                                                <p>{details?.car_company?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-reservation__date">
                                        <div className="admin-reservation__date-check">
                                            <div className="admin-reservation__date-icon">
                                                <SVGIcon src={Icons.CalendarGray} width={20} height={20} className="" />
                                            </div>
                                            <div className="admin-reservation__date-wrapper">
                                                <div className="admin-reservation__title-content">Pickup Time</div>
                                                <div className="admin-reservation__date-content">
                                                    <p className="admin-reservation__title-semibold">{pickup.format('ddd')},</p>
                                                    <p className="admin-reservation__caption-time">
                                                        {pickup.format('MMM DD, YYYY')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-reservation__date-check">
                                            <div className="admin-reservation__date-icon">
                                                <SVGIcon src={Icons.CalendarGray} width={20} height={20} className="" />
                                            </div>
                                            <div className="admin-reservation__date-wrapper">
                                                <div className="admin-reservation__title-content">Drop-Off Time</div>
                                                <div className="admin-reservation__date-content">
                                                    <p className="admin-reservation__title-semibold">{dropoff.format('ddd')},</p>
                                                    <p className="admin-reservation__caption-time">
                                                        {dropoff.format('MMM DD, YYYY')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="admin-reservation__content-wrapper">
                                        <div className="admin-reservation__content row">
                                            <div className="admin-reservation__content-card">
                                                <div className="admin-reservation__title-content">Duration</div>
                                                <div className="admin-reservation__info-content">
                                                    <SVGIcon src={Icons.Sun} width={20} height={20} />
                                                    <p className="admin-reservation__title-semibold">{days} Days {hours} Hours</p>
                                                </div>
                                            </div>
                                            <div className="admin-reservation__content-card">
                                                <div className="admin-reservation__title-content">Car Specs</div>
                                                <div className="admin-reservation__info-content">
                                                    <SVGIcon src={Icons.Car} width={20} height={20} />
                                                    <p className="admin-reservation__title-semibold">{door ? `${door.amount} ${door.name_facility}, ` : ''} {seat ? `${seat.amount} ${seat.name_facility}` : ''}</p>
                                                </div>
                                            </div>
                                            <div className="admin-reservation__content-card">
                                                <div className="admin-reservation__title-content">Mail/Contact</div>
                                                <div className="admin-reservation__info-content">
                                                    <SVGIcon src={Icons.Mail} width={20} height={20} />
                                                    <p className="admin-reservation__title-semibold">{details?.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cancelation__car-facility mb-5">
                                        <p className="cancelation__car-facility fw-semibold">Fasilities</p>
                                        <div className="cancelation__car-facility-list">
                                            {details?.transmission &&
                                                <div className="cancelation__car-facility-item">
                                                    <SVGIcon src={Icons.Automatic} width={20} height={20} />
                                                    <p>{details?.transmission}</p>
                                                </div>
                                            }
                                            {/* <div className="cancelation__car-facility-item">
                                                <SVGIcon src={Icons.Suitcase} width={20} height={20} />
                                                <p>4 Small Bags</p>
                                            </div> */}
                                            {details?.fuel_type &&
                                                <div className="cancelation__car-facility-item">
                                                    <SVGIcon src={Icons.GasPump} width={20} height={20} />
                                                    <p>{details?.fuel_type}</p>
                                                </div>
                                            }
                                            {details?.aircon === 1 &&
                                                <div className="cancelation__car-facility-item">
                                                    <SVGIcon src={Icons.AirConditioner} width={20} height={20} />
                                                    <p>Air Conditioning</p>
                                                </div>
                                            }

                                        </div>
                                    </div>
                                    <div className="admin-reservation__info">
                                        <div className="admin-reservation__info-title">
                                            <p className="admin-reservation__title-semibold">Additional information</p>
                                        </div>
                                        <div className="admin-reservation__info-content">
                                            <span>{details?.note || 'There are no special requests from customer'}</span>
                                        </div>
                                    </div>
                                </div>


                                <div className="company-detail__content-form admin-reservation__form-right">
                                    <div className="admin-reservation__form-button">
                                        <div className={`admin-reservation__form-reservation`}>
                                            <p className="admin-reservation__title-bold">Update this reservation</p>
                                            <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation`} data-bs-toggle="modal" data-bs-target="#PickupModal"> Mark as Pickup </button>
                                            <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation`} data-bs-toggle="modal" data-bs-target="#DropoffModal"> Mark as Dropoff </button>

                                            {/* <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'}>Change reservation date & price</button>
                      <button type="button" className={` btn btn-md btn-outline-success admin-reservation__button-reservation ${statusReservation === 'Check-In' || statusReservation === 'Check-Out' ? 'd-none' : null} ${statusReservation === 'No-Show' ? 'admin-reservation__button-reservation--disabled' : null}`} disabled={statusReservation === 'No-Show'}>Report guest misconduct</button> */}
                                            <button type="button" onClick={handlePrint} className=" btn btn-md btn-outline-success admin-reservation__button-reservation">Print this page</button>
                                        </div>
                                        {/* {statusReservation === 'Check-In' ? null : <div className="separator"></div>} */}
                                        <div className={`admin-reservation__form-reservation`}>
                                            <p className="admin-reservation__title-bold">Payment</p>
                                            <button type="button" className={`btn btn-md btn-outline-success admin-reservation__button-reservation`}>Mark credit card as invalid</button>
                                            <button type="button" className={`btn btn-md btn-outline-success admin-reservation__button-reservation`}>View credit card details</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=""></div>
                        </div>
                    </div>
                </div>
            </div>
            <PopupPickup handleMarkPickup={handleMarkPickup} />
            <PopupDropoff handleMarkDropoff={handleMarkDropoff} />
        </Layout>
    )
}

const HeaderReservation = () => {
    return (
        <header>
            <div className="car-dashboard__header">
                <div className="container car-dashboard__content-header">
                    <Link href={"/business/car/reservation"} className='car-dashboard__content-header car-dashboard__content-header--link'>
                        <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
                        <h4 className='car-dashboard__content-title-heading'>Reservation Details</h4>
                    </Link>
                </div>
            </div>
        </header>
    )
}

const PopupPickup = ({ handleMarkPickup }) => {

    return (
        <div className="modal fade" id="PickupModal" tabIndex={-1} aria-labelledby="PickupModalLabel" aria-hidden="true">
            <div className="modal-dialog cancelation__modal admin-reservation__modal">
                <div className="modal-content admin-reservation__modal-content">
                    <div className="admin-reservation__modal-wrapper">
                        <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
                            <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
                        </div>
                        <div className="company-detail__popup-contents">
                            <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Mark as Pickup ?</h3>
                            <p className="company-detail__content-caption--popup">You want to mark this booking that the customer has pickup</p>
                        </div>
                    </div>
                    <div className='company-detail__button-list-group row'>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                            <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                            <button onClick={handleMarkPickup} type='button' data-bs-dismiss="modal" className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'>Yes, Mark as Pickup</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
const PopupDropoff = ({ handleMarkDropoff }) => {

    return (
        <div className="modal fade" id="DropoffModal" tabIndex={-1} aria-labelledby="DropoffModalLabel" aria-hidden="true">
            <div className="modal-dialog cancelation__modal admin-reservation__modal">
                <div className="modal-content admin-reservation__modal-content">
                    <div className="admin-reservation__modal-wrapper">
                        <div className="admin-reservation__notification-icon admin-reservation__notification-icon--success">
                            <SVGIcon src={Icons.CheckRoundedGreen} width={48} height={48} />
                        </div>
                        <div className="company-detail__popup-contents">
                            <h3 className="company-detail__content-title-heading company-detail__content-title-heading--popup">Mark as Dropoff ?</h3>
                            <p className="company-detail__content-caption--popup">You want to mark this booking that the customer has dropoff</p>
                        </div>
                    </div>
                    <div className='company-detail__button-list-group row'>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                            <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
                        </div>
                        <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                            <button onClick={handleMarkDropoff} type='button' data-bs-dismiss="modal" className='button goform-button goform-button--fill-green goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'>Yes, Mark as Dropoff</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



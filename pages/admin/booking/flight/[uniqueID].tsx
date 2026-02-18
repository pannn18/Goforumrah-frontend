import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { Fragment, useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import { BlurPlaceholderImage } from '@/components/elements/images'
import iconCheck from 'assets/images/icon_check_soft.svg'
import iconSuspended from 'assets/images/icon_suspended_soft.svg'
import iconCancel from 'assets/images/icon_cancel_soft.svg'
import airlineEmirates from '@/assets/images/airline_partner_emirates.png'
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { callAPI, callMystiflyAPI, callSkyscannerAPI } from "@/lib/axiosHelper"
import moment from "moment"
import dbAirlines from '@/lib/db/airlines.json'
import { useRouter } from "next/router"
import { useEffect } from "react"
import LoadingOverlay from "@/components/loadingOverlay"

export const getServerSideProps: GetServerSideProps<{
    tripDetails: any
    airports: any
    uniqueID: string
}> = async (context) => {
    const uniqueID = context.params?.uniqueID

    const { ok, data: tripDetails, status, error } = await callMystiflyAPI({
        url: 'https://restapidemo.myfarebox.com/api/tripdetails/' + uniqueID,
        method: 'GET',
    }, (context.req.headers.host.includes('localhost') || context.req.headers.host.includes('127.0.0.1') ? 'http://' : 'https://') + context.req.headers.host)

    if (ok && tripDetails?.Data?.TripDetailsResult && tripDetails?.Success) {
        const { ok: airportsOK, data: airports } = await callSkyscannerAPI({
            url: 'https://partners.api.skyscanner.net/apiservices/v3/geo/hierarchy/flights/en-US',
            method: 'GET'
        }, (context.req.headers.host.includes('localhost') || context.req.headers.host.includes('127.0.0.1') ? 'http://' : 'https://') + context.req.headers.host)

        if (airports?.places) {
            return {
                props: {
                    tripDetails: tripDetails.Data.TripDetailsResult,
                    airports: airports.places,
                    uniqueID: uniqueID as string
                },
            }
        }
    }

    return {
        notFound: true,
    }
}

export default function Page({
    tripDetails,
    airports,
    uniqueID
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const [isSuspended, setIsSuspended] = useState<boolean>(false);
    const [isCanceled, setIsCanceled] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isShow, setIsShow] = useState<boolean>(false);
    const [isReturnShow, setIsReturnShow] = useState<boolean>(false);

    const itineraries = tripDetails?.TravelItinerary?.Itineraries.length ? tripDetails?.TravelItinerary?.Itineraries[0]?.ItineraryInfo?.ReservationItems : []

    const itinerariesNoReturn = itineraries.filter(itinerary => !itinerary?.IsReturn)
    const itinerariesNoReturnDuration = itinerariesNoReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)
    const itinerariesReturn = itineraries.filter(itinerary => itinerary?.IsReturn)

    const itinerariesReturnDuration = itinerariesReturn.reduce((a, b) => a + parseInt(b?.JourneyDuration.toString()), 0)

    const origin = itinerariesNoReturn?.length ? itinerariesNoReturn[0] : null
    const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin?.DepartureAirportLocationCode)
    const originName = airports?.[originKey]?.name
    const originDepartureDate = origin?.DepartureDateTime ? moment(origin?.DepartureDateTime).format('ddd, DD MMM YY') : null

    const destination = itinerariesNoReturn?.length ? itinerariesNoReturn[itinerariesNoReturn.length - 1] : null
    const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination?.ArrivalAirportLocationCode)
    const destinationName = airports?.[destinationKey]?.name

    const returnOrigin = itinerariesReturn?.length ? itinerariesReturn[0] : null
    const returnOriginKey = Object.keys(airports || {}).find(key => airports[key]?.iata === returnOrigin?.DepartureAirportLocationCode)
    const returnOriginName = airports?.[returnOriginKey]?.name
    const returnOriginDepartureDate = returnOrigin?.DepartureDateTime ? moment(returnOrigin?.DepartureDateTime).format('ddd, DD MMM YY') : null

    const returnDestination = itinerariesReturn?.length ? itinerariesReturn[itinerariesReturn.length - 1] : null
    const returnDestinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === returnDestination?.ArrivalAirportLocationCode)
    const returnDestinationName = airports?.[returnDestinationKey]?.name

    const bookingDate = tripDetails?.BookingCreatedOn ? moment(tripDetails?.BookingCreatedOn).format('DD / MM / YY') : null
    const fareBreakdowns = tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns?.length ? tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0] : {}
    const passengers = tripDetails?.TravelItinerary?.PassengerInfos?.length ? tripDetails?.TravelItinerary?.PassengerInfos : []
    const airlines = itineraries.map(itinerary => itinerary?.MarketingAirlineCode || itinerary?.OperatingAirlineCode).filter((value, index, array) => value && array.indexOf(value) === index)

    console.log('tripDetails', tripDetails);

    const airline = (dbAirlines as any[]).find(
        (airline: any) => airline.code === airlines[0]
    );

    //get customer data from API
    const [customerData, setCustomerData] = useState<any>(null)

    const router = useRouter()
    const { idCustomer: id_customer } = router.query

    const getCustomer = async () => {
        setIsLoading(true)
        try {
            const { ok, data, status, error } = await callAPI('/customer/personal/show', 'POST', { id_customer: id_customer }, true)
            if (ok) {
                setCustomerData(data)
                console.log('customerData', data);
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCustomer()
    }, [id_customer])

    if (isLoading) {
        return <LoadingOverlay />
    }

    return (
        <Layout>
            <AdminLayout pageTitle="Booking Details" enableBack={true}>
                <div className="container admin-booking-flight-details__container">
                    {isComplete && <BannerComplete />}
                    {isSuspended && <BannerSuspended />}
                    {isCanceled && <BannerCanceled />}
                    <div className="admin-booking-flight-details">
                        <div className="admin-booking-flight-details__content-wrapper">
                            <div className="admin-booking-flight-details__content">
                                {!!itinerariesNoReturn?.length && (
                                    <>
                                        <div className="content-top-header">
                                            <div className="content-top-header__flight-brand">
                                                <BlurPlaceholderImage src={airline.image ? airline.image : Images.Placeholder} width={68} height={48} alt={airline.name || 'Airline Name'} />
                                            </div>
                                            <div className="flight-card__routes">
                                                <div className="flight-card__route-times">
                                                    <h4 className="flight-card__route-time">{(origin?.DepartureDateTime) ? moment(origin.DepartureDateTime).format('HH:mm') : ''}</h4>
                                                    <div className="flight-card__route-code">{origin?.DepartureAirportLocationCode}</div>
                                                </div>
                                                <div className="flight-card__route-details">
                                                    <div className="flight-card__route-details-inner">
                                                        <div className="flight-card__route-details-duration">{Math.floor(itinerariesNoReturnDuration / 60)}h {moment.duration(itinerariesNoReturnDuration, 'minutes').minutes()}m</div>
                                                        <SVGIcon src={Icons.AirplaneLineLong} width={''} height={''} className="flight-card__route-details-line" />
                                                        <div className="flight-card__route-details-transit">{itinerariesNoReturn?.length > 1 ? `${itinerariesNoReturn?.length - 1} Transit` : 'Direct'}</div>
                                                    </div>
                                                    <SVGIcon src={Icons.Airplane} width={16} height={16} className="flight-card__route-details-line" />
                                                </div>
                                                <div>
                                                    <div className="flight-card__route-times">
                                                        <h4 className="flight-card__route-time">{(destination?.ArrivalDateTime) ? moment(destination.ArrivalDateTime).format('HH:mm') : ''}</h4>
                                                        <div className="flight-card__route-code">{destination?.ArrivalAirportLocationCode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content-header">
                                            <div className="content-header-details">
                                                {!!itinerariesNoReturn?.length && itinerariesNoReturn.map((itinerary, index) => {
                                                    const origin = itinerary?.DepartureAirportLocationCode
                                                    const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin)
                                                    const originName = airports?.[originKey]?.name

                                                    const destination = itinerary?.ArrivalAirportLocationCode
                                                    const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination)
                                                    const destinationName = airports?.[destinationKey]?.name

                                                    return (index === 0 || (index > 0 && isShow)) && (
                                                        <Fragment key={`flight-details-${index}`}>
                                                            <div className="content-header-details__item content-header-details__item--solid-line">
                                                                <div className="content-header-details__item-left">
                                                                    <div className="content-header-details__time">{(itinerary?.DepartureDateTime) ? moment(itinerary.DepartureDateTime).format('HH:mm') : ''}</div>
                                                                    <div className="content-header-details__date">{(itinerary?.DepartureDateTime) ? moment(itinerary.DepartureDateTime).format('D MMM') : ''}</div>
                                                                </div>
                                                                <div className="content-header-details__item-right">
                                                                    <div>
                                                                        <div>
                                                                            <div className="content-header-details__airport-name">{originName} ({origin})</div>
                                                                            {itinerary?.DepartureTerminal && (
                                                                                <div className="content-header-details__airport-description">Departure Terminal {itinerary?.DepartureTerminal}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="content-header-details__facilities">
                                                                            {(!!fareBreakdowns?.BaggageInfo?.length && fareBreakdowns?.BaggageInfo[index]) && (
                                                                                <div className="content-header-details__facility">
                                                                                    <SVGIcon src={Icons.Suitcase} width={20} height={20} className="content-header-details__facility-icon" />
                                                                                    <div>{[`Baggage: ${fareBreakdowns?.BaggageInfo[index]}`, ...(!!fareBreakdowns?.CabinBaggageInfo?.length && fareBreakdowns?.CabinBaggageInfo[index] ? [`Cabin: ${fareBreakdowns?.CabinBaggageInfo[index]}`] : [])].join(', ')}</div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="content-header-details__flight">
                                                                        <div className="content-header-details__flight-brand">
                                                                            <BlurPlaceholderImage src={airline.image ? airline.image : Images.Placeholder} width={20} height={20} alt={airline.name || 'Airline Name'} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="content-header-details__flight-code">{itinerary?.MarketingAirlineCode || itinerary?.OperatingAirlineCode}-{itinerary?.FlightNumber}</div>
                                                                            <div className="content-header-details__flight-class">{itinerary?.CabinClassType}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="content-header-details__item">
                                                                <div className="content-header-details__item-left">
                                                                    <div className="content-header-details__time">{moment(itinerary?.ArrivalDateTime).format('HH:mm')}</div>
                                                                    <div className="content-header-details__date">{moment(itinerary?.ArrivalDateTime).format('D MMM')}</div>
                                                                </div>
                                                                <div className="content-header-details__item-right">
                                                                    <div>
                                                                        <div>
                                                                            <div className="content-header-details__airport-name">{destinationName} ({destination})</div>
                                                                            {itinerary?.ArrivalTerminal && (
                                                                                <div className="content-header-details__airport-description">Arrival Terminal {itinerary?.ArrivalTerminal}</div>
                                                                            )}
                                                                        </div>
                                                                        {index !== itinerariesNoReturn.length - 1 && (
                                                                            <div className="content-header-details__facilities-wrap">
                                                                                <div className="content-header-details__optional-description">
                                                                                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                                                                                    <div>Layover</div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                })}
                                            </div>
                                            {itinerariesNoReturn.length > 1 && <a type="button" onClick={() => setIsShow(!isShow)} className="content-header-details__flight-link">{isShow ? 'Hide' : 'Show'}</a>}
                                        </div>
                                    </>
                                )}
                                {!!itinerariesReturn?.length && (
                                    <>
                                        <div className="content-top-header" style={{ marginTop: 64 }}>
                                            <div className="content-top-header__flight-brand">
                                                <BlurPlaceholderImage src={airline.image ? airline.image : Images.Placeholder} width={68} height={48} alt={airline.name || 'Airline Name'} />
                                            </div>
                                            <div className="flight-card__routes">
                                                <div className="flight-card__route-times">
                                                    <h4 className="flight-card__route-time">{(returnOrigin?.DepartureDateTime) ? moment(returnOrigin.DepartureDateTime).format('HH:mm') : ''}</h4>
                                                    <div className="flight-card__route-code">{returnOrigin?.DepartureAirportLocationCode}</div>
                                                </div>
                                                <div className="flight-card__route-details">
                                                    <div className="flight-card__route-details-inner">
                                                        <div className="flight-card__route-details-duration">{Math.floor(itinerariesReturnDuration / 60)}h {moment.duration(itinerariesReturnDuration, 'minutes').minutes()}m</div>
                                                        <SVGIcon src={Icons.AirplaneLineLong} width={''} height={''} className="flight-card__route-details-line" />
                                                        <div className="flight-card__route-details-transit">{itinerariesReturn?.length > 1 ? `${itinerariesReturn?.length - 1} Transit` : 'Direct'} (Return)</div>
                                                    </div>
                                                    <SVGIcon src={Icons.Airplane} width={16} height={16} className="flight-card__route-details-line" />
                                                </div>
                                                <div>
                                                    <div className="flight-card__route-times">
                                                        <h4 className="flight-card__route-time">{(returnDestination?.ArrivalDateTime) ? moment(returnDestination.ArrivalDateTime).format('HH:mm') : ''}</h4>
                                                        <div className="flight-card__route-code">{returnDestination?.ArrivalAirportLocationCode}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="content-header">
                                            <div className="content-header-details">
                                                {!!itinerariesReturn?.length && itinerariesReturn.map((itinerary, index) => {
                                                    const origin = itinerary?.DepartureAirportLocationCode
                                                    const originKey = Object.keys(airports || {}).find(key => airports[key]?.iata === origin)
                                                    const originName = airports?.[originKey]?.name

                                                    const destination = itinerary?.ArrivalAirportLocationCode
                                                    const destinationKey = Object.keys(airports || {}).find(key => airports[key]?.iata === destination)
                                                    const destinationName = airports?.[destinationKey]?.name

                                                    return (index === 0 || (index > 0 && isReturnShow)) && (
                                                        <Fragment key={`flight-details-${index}`}>
                                                            <div className="content-header-details__item content-header-details__item--solid-line">
                                                                <div className="content-header-details__item-left">
                                                                    <div className="content-header-details__time">{(itinerary?.DepartureDateTime) ? moment(itinerary.DepartureDateTime).format('HH:mm') : ''}</div>
                                                                    <div className="content-header-details__date">{(itinerary?.DepartureDateTime) ? moment(itinerary.DepartureDateTime).format('D MMM') : ''}</div>
                                                                </div>
                                                                <div className="content-header-details__item-right">
                                                                    <div>
                                                                        <div>
                                                                            <div className="content-header-details__airport-name">{originName} ({origin})</div>
                                                                            {itinerary?.DepartureTerminal && (
                                                                                <div className="content-header-details__airport-description">Departure Terminal {itinerary?.DepartureTerminal}</div>
                                                                            )}
                                                                        </div>
                                                                        <div className="content-header-details__facilities">
                                                                            {(!!fareBreakdowns?.BaggageInfo?.length && fareBreakdowns?.BaggageInfo[index]) && (
                                                                                <div className="content-header-details__facility">
                                                                                    <SVGIcon src={Icons.Suitcase} width={20} height={20} className="content-header-details__facility-icon" />
                                                                                    <div>{[`Baggage: ${fareBreakdowns?.BaggageInfo[index]}`, ...(!!fareBreakdowns?.CabinBaggageInfo?.length && fareBreakdowns?.CabinBaggageInfo[index] ? [`Cabin: ${fareBreakdowns?.CabinBaggageInfo[index]}`] : [])].join(', ')}</div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="content-header-details__flight">
                                                                        <div className="content-header-details__flight-brand">
                                                                            <BlurPlaceholderImage src={airline.image ? airline.image : Images.Placeholder} width={20} height={20} alt={airline.name || 'Airline Name'} />
                                                                        </div>
                                                                        <div>
                                                                            <div className="content-header-details__flight-code">{itinerary?.MarketingAirlineCode || itinerary?.OperatingAirlineCode}-{itinerary?.FlightNumber}</div>
                                                                            <div className="content-header-details__flight-class">{itinerary?.CabinClassType}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="content-header-details__item">
                                                                <div className="content-header-details__item-left">
                                                                    <div className="content-header-details__time">{moment(itinerary?.ArrivalDateTime).format('HH:mm')}</div>
                                                                    <div className="content-header-details__date">{moment(itinerary?.ArrivalDateTime).format('D MMM')}</div>
                                                                </div>
                                                                <div className="content-header-details__item-right">
                                                                    <div>
                                                                        <div>
                                                                            <div className="content-header-details__airport-name">{destinationName} ({destination})</div>
                                                                            {itinerary?.ArrivalTerminal && (
                                                                                <div className="content-header-details__airport-description">Arrival Terminal {itinerary?.ArrivalTerminal}</div>
                                                                            )}
                                                                        </div>
                                                                        {index !== itinerariesNoReturn.length - 1 && (
                                                                            <div className="content-header-details__facilities-wrap">
                                                                                <div className="content-header-details__optional-description">
                                                                                    <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                                                                                    <div>Layover</div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Fragment>
                                                    )
                                                })}
                                            </div>
                                            {itinerariesReturn.length > 1 && <a type="button" onClick={() => setIsReturnShow(!isReturnShow)} className="content-header-details__flight-link">{isReturnShow ? 'Hide' : 'Show'}</a>}

                                        </div>
                                    </>
                                )}
                                <div className="admin-booking-flight-details__separator"></div>
                                {/* <div className="admin-booking-flight-details__content-information">
                                    <p className="admin-booking-flight-details__content-information-value">Additional Information</p>
                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                </div> */}
                            </div>
                            <div className="admin-booking-flight-details__content-bottom">
                                <div className="admin-booking-flight-details__routes-wrapper">
                                    <div className="admin-booking-flight-details__routes">
                                        <div className="admin-booking-flight-details__route-times">
                                            <h4 className="admin-booking-flight-details__route-time">{originName}</h4>
                                        </div>
                                        <div className="admin-booking-flight-details__route-details">
                                            <div className="admin-booking-flight-details__route-details-inner">
                                                <SVGIcon src={Icons.AirplaneLineMedium} width={''} height={8.1} className="admin-booking-flight-details__route-details-line" />
                                            </div>
                                            <SVGIcon src={Icons.Airplane} width={16} height={16} className="admin-booking-flight-details__route-details-line" />
                                        </div>
                                        <div>
                                            <div className="admin-booking-flight-details__route-times">
                                                <h4 className="admin-booking-flight-details__route-time">{destinationName}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100 admin-booking-flight-details__routes-order">
                                    <div className="w-100 d-flex flex-row align-items-center justify-content-between g-3">
                                        {!!itinerariesReturn?.length && (
                                            <div>Return</div>
                                        )}
                                        <div>Order ID : {uniqueID}</div>
                                    </div>
                                </div>
                                <div className="admin-booking-flight-details__separator"></div>
                                <div className="admin-booking-flight-details__content-bottom-total">
                                    <p className="admin-booking-flight-details__content-bottom-total-desc">Total Payment</p>
                                    <h5>{tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.Amount} {tripDetails?.TravelItinerary?.TripDetailsPTC_FareBreakdowns[0]?.TripDetailsPassengerFare?.TotalFare?.CurrencyCode}</h5>
                                </div>
                            </div>
                        </div>

                        <div className="admin-booking-flight-details__summary">
                            {tripDetails?.TravelItinerary?.BookingStatus && (
                                <div className="admin-booking-hotel-details__summary-action btn btn-md btn-success" style={{ cursor: 'default' }}>
                                    <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
                                    {tripDetails?.TravelItinerary?.BookingStatus}
                                </div>
                            )}
                             <div className="admin-booking-flight-details__summary-box">
                                <div className="admin-booking-flight-details__summary-row">
                                    <h5>Contact Details</h5>
                                </div>
                                    <div className="admin-booking-flight-details__summary-content">
                                        <div className="admin-booking-flight-details__summary-content-rounded">
                                            <BlurPlaceholderImage alt='image' src={customerData?.profile_photo} width={70} height={70} />
                                        </div>
                                        <div className="admin-booking-flight-details__summary-content-wrapper">
                                            <p className="admin-booking-flight-details__summary-content-desc admin-booking-flight-details__summary-content-desc--bold">{customerData?.fullname}</p>
                                            <p className="admin-booking-flight-details__summary-content-desc">{customerData?.phone}</p>
                                            <p className="admin-booking-flight-details__summary-content-desc">{customerData?.email}</p>
                                            <p className="admin-booking-flight-details__summary-content-desc"></p>
                                        </div>
                                    </div>
                            </div>
                            <div className="admin-booking-flight-details__summary-box">
                                <div className="admin-booking-flight-details__summary-row">
                                    <h5>Passengers</h5>
                                </div>
                                {!!passengers?.length && (passengers.map((passenger, index) => (
                                    <div key={`passenger-${index}`} className="admin-booking-flight-details__summary-content">
                                        <div className="admin-booking-flight-details__summary-content-rounded">
                                            <SVGIcon src={Icons.User} width={20} height={20} />&nbsp;{index + 1}
                                        </div>
                                        <div className="admin-booking-flight-details__summary-content-wrapper">
                                            <p className="admin-booking-flight-details__summary-content-desc admin-booking-flight-details__summary-content-desc--bold">{passenger?.Passenger?.PaxName?.PassengerTitle} {passenger?.Passenger?.PaxName?.PassengerFirstName} {passenger?.Passenger?.PaxName?.PassengerLastName}</p>
                                            <p className="admin-booking-flight-details__summary-content-desc">{passenger?.Passenger?.EmailAddress}</p>
                                            <p className="admin-booking-flight-details__summary-content-desc">{passenger?.Passenger?.PhoneNumber},&nbsp; <span style={{ fontWeight: '500' }}>{passenger?.Passenger?.PassengerNationality}</span></p>
                                            
                                        </div>
                                    </div>
                                )))}
                            </div>
                            <div className="admin-booking-flight-details__summary-box">
                                <div className="admin-booking-flight-details__summary-row">
                                    <h5>Airlines</h5>
                                </div>
                                {/* {airlines.map((airline, index) => (
                                    <div key={`airline-${index}`} className="admin-booking-flight-details__summary-content">
                                        <div className="admin-booking-flight-details__summary-content-rounded"></div>
                                        <div className="admin-booking-flight-details__summary-content-wrapper">
                                            <p className="admin-booking-flight-details__summary-content-desc admin-booking-flight-details__summary-content-desc--value">{airline}</p>
                                        </div>
                                    </div>
                                ))} */}

                                <div className="admin-booking-flight-details__summary-content">
                                    <div className="admin-booking-flight-details__summary-content-rounded">
                                        <img src={airline.image ? airline.image : Images.Placeholder} alt={airline.name || 'Airline Name'} style={{ width: '100%' }} />
                                    </div>
                                    <div className="admin-booking-flight-details__summary-content-wrapper">
                                        <p className="admin-booking-flight-details__summary-content-desc admin-booking-flight-details__summary-content-desc--value">{airline?.name}</p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </AdminLayout>
            <PopupComplete handleComplete={() => { setIsComplete(true); setIsSuspended(false); setIsCanceled(false); }} />
            <PopupSuspend handleSuspended={() => { setIsSuspended(true); setIsComplete(false); setIsCanceled(false); }} />
            <PopupCancel handleCanceled={() => { setIsCanceled(true); setIsSuspended(false); setIsComplete(false); }} />
            <PopupNote />
        </Layout>


    )
}

const PopupComplete = ({ handleComplete }: { handleComplete: () => void }) => {
    return (
        <>
            <div className="modal fade" id="popUpComplete" tabIndex={-1} aria-labelledby="popUpCompleteLabel" aria-hidden="true">
                <div className="modal-dialog cancelation__modal admin-customer__modal-block">
                    <div className="modal-content admin-customer__add-modal-content">
                        <div className="admin-booking-hotel__popup-form">
                            <div className="admin-booking-hotel__popup-form-content">
                                <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                                <div className="admin-booking-hotel__popup-contents">
                                    <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">Complete this Booking ?</h3>
                                    <p className="admin-booking-hotel__content-caption--popup">You want to mark this booking that the customer has checked-in</p>
                                </div>
                            </div>
                            <div className="admin-booking-hotel__popup-footer">
                                <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item' data-bs-dismiss="modal">Cancel</button>
                                <button type='button' onClick={handleComplete} className='btn btn-md btn-success' data-bs-dismiss="modal">Yes, Complete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

const PopupSuspend = ({ handleSuspended }: { handleSuspended: () => void }) => {
    return (
        <div className="modal fade" id="popUpSuspend" tabIndex={-1} aria-labelledby="popUpSuspendLabel" aria-hidden="true">
            <div className="modal-dialog cancelation__modal admin-customer__modal-block">
                <div className="modal-content admin-customer__add-modal-content">
                    <div className="admin-booking-hotel__popup-form">
                        <div className="admin-booking-hotel__popup-form-content">
                            <BlurPlaceholderImage className='' alt='image' src={iconSuspended} width={72} height={72} />
                            <div className="admin-booking-hotel__popup-contents">
                                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">Suspend this Booking ?</h3>
                                <p className="admin-booking-hotel__content-caption--popup">Please give a reason before to continue suspend this booking</p>
                            </div>
                            <textarea name="#" id="#" cols={10} rows={4} placeholder="Give me a reason"></textarea>
                        </div>
                        <div className="admin-booking-hotel__popup-footer">
                            <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item' data-bs-dismiss="modal">Cancel</button>
                            <button type='button' onClick={handleSuspended} className='btn btn-md btn-success' data-bs-dismiss="modal">Yes, Suspend</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PopupNote = () => {
    return (
        <div className="modal fade" id="popUpNote" tabIndex={-1} aria-labelledby="popUpNoteLabel" aria-hidden="true">
            <div className="modal-dialog cancelation__modal admin-customer__modal-block">
                <div className="modal-content admin-customer__add-modal-content admin-booking-hotel__popup-form-note__wrapper">
                    <div className="admin-booking-hotel__popup-form admin-booking-hotel__popup-form-note">
                        <div className="admin-booking-hotel__popup-form-note-header">
                            <h5>Note</h5>
                            <textarea name="#" id="#" cols={10} rows={4}>This order is having a little problem, just waiting for approval from superiors</textarea>
                        </div>
                        <div className="admin-booking-hotel__popup-footer">
                            <button className='btn btn-sm btn-success' data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const PopupCancel = ({ handleCanceled }: { handleCanceled: () => void }) => {
    return (
        <div className="modal fade" id="popUpCancel" tabIndex={-1} aria-labelledby="popUpCancelLabel" aria-hidden="true">
            <div className="modal-dialog cancelation__modal admin-customer__modal-block">
                <div className="modal-content admin-customer__add-modal-content">
                    <div className="admin-booking-hotel__popup-form">
                        <div className="admin-booking-hotel__popup-form-content">
                            <BlurPlaceholderImage className='' alt='image' src={iconCancel} width={72} height={72} />
                            <div className="admin-booking-hotel__popup-contents">
                                <h3 className="admin-booking-hotel__content-title-heading admin-booking-hotel__content-title-heading--popup">Cancel this Booking ?</h3>
                                <p className="admin-booking-hotel__content-caption--popup">Booking that have been cancelled cannot be returned again</p>
                            </div>
                        </div>
                        <div className="admin-booking-hotel__popup-footer">
                            <button type='button' className='button goform-button goform-button--outline-grey goform-button--large-text admin-booking-hotel__button-list-item' data-bs-dismiss="modal">Cancel</button>
                            <button onClick={handleCanceled} type='button' className='btn btn-md btn-success' data-bs-dismiss="modal">Yes, Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const BannerComplete = () => {
    return (
        <div className="admin-booking-flight__content-banner admin-booking-flight__content-banner--complete">
            <div className="admin-booking-flight__content-banner-icon admin-booking-flight__content-banner-icon--complete">
                <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
            </div>
            <p className="admin-booking-flight__content-banner-desc">The booking has been completed</p>
        </div>
    )
}

const BannerCanceled = () => {
    return (
        <div className="admin-booking-flight__content-banner admin-booking-flight__content-banner--canceled">
            <div className="admin-booking-flight__content-banner-icon admin-booking-flight__content-banner-icon--canceled">
                <SVGIcon src={Icons.CircleCancelWhite} width={24} height={24} />
            </div>
            <p className="admin-booking-flight__content-banner-desc">The booking has been cancelled</p>
        </div>
    )
}


const BannerSuspended = () => {
    return (
        <div className="admin-booking-flight__content-banner admin-booking-flight__content-banner--suspended">
            <div className="admin-booking-flight__content-banner-icon admin-booking-flight__content-banner-icon--suspended">
                <SVGIcon src={Icons.Disabled} width={24} height={24} />
            </div>
            <div className="admin-booking-flight__content-banner-wrapper">
                <p className="admin-booking-flight__content-banner-desc">Booking has been suspended</p>
                <p className="admin-booking-flight__content-banner-subdesc">You can reactivate it by pressing the “set active” button</p>
            </div>
            <button type="button" data-bs-toggle="modal" data-bs-target="#popUpNote" className="admin-booking-hotel__content-banner-action btn btn-md btn-outline-success">View Note</button>
            <button type="button" data-bs-toggle="modal" data-bs-target="#popUpComplete" className="admin-booking-hotel__content-banner-action btn btn-md btn-success">
                <SVGIcon src={Icons.CheckRoundedWhite} width={20} height={20} />
                Set Active
            </button>
        </div>
    )
}


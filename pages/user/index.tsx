import Layout from "@/components/layout";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import UserLayout from "@/components/user/layout";
import React, { useEffect, useState } from "react";
import SVGIcon from "@/components/elements/icons";
import { Icons, Images, Services } from "@/types/enums";
import ManageCard from "@/components/pages/manage/manageCard";
import { useSession } from "next-auth/react";
import { callAPI, callMystiflyAPI } from "@/lib/axiosHelper";
import moment from "moment";
import DropdownMenu from "@/components/elements/dropdownMenu";
import Link from "next/link";
import airlines from "@/lib/db/airlines.json"

const MyBooking = () => {
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState<boolean>(true);
  const [mystiflyBookings, setMystiflyBookings] = useState<any[]>([]);
  const [mystiflyBookingIDs, setMystiflyBookingIDs] = useState<string[]>([]);
  const [flightBookings, setFlightBookings] = useState<any[]>([]);
  const [hotelBookings, setHotelBookings] = useState<any[]>([]);
  const [carBookings, setCarBookings] = useState<any[]>([]);
  const [tourBookings, setTourBookings] = useState<any[]>([]);
  const bookingStatus = ["Payment Needed", "Credit Card Not Verified", "Confirmed", "Rejected", "Cancelled", "Check In", "Check Out"];
  const tourStatus = ["Payment Needed", "Credit Card Not Verified", "Confirmed", "Rejected", "Cancelled", "Completed", "Check Out"];

  const [selectedFilter, setSelectedFilter] = useState("Filter");
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [selectedSort, setSelectedSort] = useState(1);
  const [tourSort, setTourSort] = useState("DESC");
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (!mystiflyBookingIDs.length) return;

    (async () => {
      const bookings = await Promise.all(
        mystiflyBookingIDs
          .map(async (MFRef) => {
            const { ok, data, status, error } = await callMystiflyAPI({
              url: "https://restapidemo.myfarebox.com/api/TripDetails/" + MFRef,
              method: "GET",
            });

            return ok && data?.Data ? data.Data : null;
          })
          .filter((value) => value)
      );

      setMystiflyBookings(bookings);
    })();
  }, [mystiflyBookingIDs]);

  useEffect(() => {
    setLoading(true);

    if (!(status === "authenticated") || !session) return;

    (async () => {
      await Promise.all([
        new Promise(async (resolve, reject) => {
          try {
            const { ok, data, error } = await callAPI(
              "/flight-booking/show",
              "POST",
              { id_customer: session.user.id, sort: selectedSort },
              true
            );

            if (ok && data) {
              setFlightBookings(data);
              if (data?.length) setMystiflyBookingIDs(data.map((item) => item?.mfref).filter((value) => value));
            }

            resolve(true);
          } catch (error) {
            reject(error);
          }
        }),
        new Promise(async (resolve, reject) => {
          try {
            const { ok, data, error } = await callAPI(
              "/hotel-booking/show",
              "POST",
              { id_customer: session.user.id, sort: selectedSort },
              true
            );

            if (ok && data) {
              const updatedData = await Promise.all(
                data.map(async (item) => {
                  const {
                    ok,
                    data: hotel_booking_details,
                    error,
                  } = await callAPI(
                    "/hotel-booking/detail",
                    "POST",
                    { id_hotel_booking: item.id_hotel_booking },
                    true
                  );
                  return { ...item, hotel_booking_details };
                })
              );

              setHotelBookings(updatedData);
            }

            resolve(true);
          } catch (error) {
            reject(error);
          }
        }),
        new Promise(async (resolve, reject) => {
          try {
            const { ok, data, error } = await callAPI(
              "/car-business-booking/show-booking",
              "POST",
              { id_customer: session.user.id, sort: selectedSort },
              true
            );

            if (ok && data) {
              setCarBookings(data);
            }

            resolve(true);
          } catch (error) {
            reject(error);
          }
        }),
        new Promise(async (resolve, reject) => {
          try {
            const { ok, data, error } = await callAPI(
              "/tour-package/show-booking",
              "POST",
              { id_customer: session.user.id, sort: tourSort },
              true
            );

            if (ok && data) {
              setTourBookings(data);
            }

            console.error(error)

            resolve(true);
          } catch (error) {
            reject(error);
          }
        }),
      ]);

      setLoading(false);
    })();
  }, [status, selectedSort]);

  const handleSelectedFilter = (selectedFilter) => {
    setSelectedFilter(selectedFilter);
    setShowFilterDropdown(false);
  };

  const handleSelectedSort = (selectedSort, tourSort) => {
    setSelectedSort(selectedSort);
    setTourSort(tourSort);
    setShowSortDropdown(false);
  };

  const countHotelDuration = (checkin, checkout) => {
    const checkinDate = moment(checkin);
    const checkoutDate = moment(checkout);
    const duration = checkoutDate.diff(checkinDate, "days");
    const durationText = `${duration < 1 ? 1 : duration} ${duration === 0 ? ' day' : ' days'}`
    return durationText;
  };

  const allBookings = [
    ...flightBookings.map((item) => {
      const foundAirline = (airlines as any[]).find((a: any) => a.name === item?.airline_name || a.code === item?.airline_code)
      return {
        type: Services.Flights,
        created_at: item?.created_at,
        image: foundAirline?.image || Images.Placeholder,
        orderId: item?.id_flight_booking,
        name: {
          from: item?.origin || "",
          to: item?.destination || "",
        },
        status: item?.status || "confirmed",
        location: "",
        tenantImage: "",
        tenant: item?.airline_name || "",
        desc: {
          date: item?.departure_time ? moment(item?.departure_time).format("ddd, DD MMM YYYY") : "",
          time: item?.departure_time ? moment(item?.departure_time).format("HH:mm") : "",
          people: "1 passenger",
        },
        linkURL: "#",
        id_booking: item?.id_flight_booking,
      }
    }),
    ...mystiflyBookings.map((data) => {
      const itineraries =
        data?.TripDetailsResult?.TravelItinerary?.Itineraries[0]?.ItineraryInfo?.ReservationItems || [];
      const foundAirline = (airlines as any[]).find((airline: any) => airline.code === itineraries?.[0]?.MarketingAirlineCode)

      return {
        type: Services.Flights,
        created_at: data?.TripDetailsResult?.BookingCreatedOn,
        image: foundAirline?.image || Images.Placeholder,
        orderId: data?.TripDetailsResult?.TravelItinerary?.MFRef || "",
        name: {
          from: data?.TripDetailsResult?.TravelItinerary?.Origin || "",
          to: data?.TripDetailsResult?.TravelItinerary?.Destination || "",
        },
        status: data?.TripDetailsResult?.TravelItinerary?.BookingStatus || "",
        location: "",
        tenantImage: "",
        tenant: foundAirline?.name || foundAirline?.code || "",
        desc: {
          date: itineraries?.length && itineraries[0]?.DepartureDateTime
            ? moment(itineraries[0].DepartureDateTime).format("ddd, DD MMM YYYY")
            : "",
          time: itineraries?.length && itineraries[0]?.DepartureDateTime
            ? moment(itineraries[0].DepartureDateTime).format("HH:mm")
            : "",
          people: data?.TripDetailsResult?.TravelItinerary?.PassengerInfos?.length
            ? `${data?.TripDetailsResult?.TravelItinerary?.PassengerInfos?.length} passenger`
            : "",
        },
        linkURL: "#",
        id_booking: data?.TripDetailsResult?.TravelItinerary?.MFRef || "",
      };
    }),
    ...hotelBookings.map((item) => ({
      type: Services.Hotel,
      created_at: item?.created_at,
      image: item?.hotel?.profile_icon ? item?.hotel?.profile_icon : item?.hotel?.hotel_photo[0]?.photo ? item?.hotel?.hotel_photo[0]?.photo : Images.Placeholder,
      orderId: item?.id_hotel_booking,
      name: {
        name: item?.hotel_booking_details?.hotel?.property_name,
      },
      status: item.reservation_status == 1 ? bookingStatus[5] : item?.reservation_status == 2 ? bookingStatus[6] : bookingStatus[item?.status],
      location: `Hotel in ${item?.hotel_booking_details?.hotel?.city}, ${item?.hotel_booking_details?.hotel?.country}`,
      tenant: "",
      tenantImage: "",
      id_booking: item?.id_hotel_booking,
      desc: {
        date: moment(item?.checkin).format("ddd, DD MMM YYYY"),
        people: `${item?.hotel_booking_details?.adult_count !== null || item?.hotel_booking_details?.children_count !== null ? item?.hotel_booking_details?.adult_count + item?.hotel_booking_details?.children_count : 1} Guest`,
        duration: `${countHotelDuration(item?.checkin, item?.checkout)}`,
      },
      linkURL: `/user/booking/hotel/${item?.id_hotel_booking}`,
    })),
    ...carBookings.map((item) => ({
      type: Services.BookTransfer,
      created_at: item?.created_at,
      image: item?.photo || Images.Placeholder,
      orderId: item?.id_car_booking,
      name: { name: `${item?.car_brand} ${item?.edition}` },
      status: bookingStatus[item?.status],
      tenant: item?.car_company?.name,
      tenantImage: item.car_company.profile_icon,
      location: "",
      id_booking: item?.id_car_booking,
      desc: {
        date: moment(item?.pickup_date_time).format("ddd, DD MMM YYYY"),
        vehicle: `${1} Car`,
        duration: `${item?.total_day_for_rent} day`,
      },
      linkURL: `/user/booking/book-transfer/${item?.id_car_booking}`,
    })),
    ...tourBookings.map((item) => ({
      type: Services.TourPackage,
      created_at: item?.created_at,
      image: item?.photos[0]?.photo || Images.Placeholder,
      orderId: item?.id_tour_booking,
      name: { name: `${item?.tour_package.package_name} ` },
      status: tourStatus[item?.status],
      tenant: item?.car_company?.name,
      tenantImage: item.photo,
      location: `${item?.tour_package?.address}`,
      id_booking: item?.id_tour_booking,
      desc: {
        date: moment(item?.pickup_date_time).format("ddd, DD MMM YYYY"),
        ticket: `${item?.number_of_tickets} Ticket`,
        duration: `${item?.tour_plan?.total_day} day`,
      },
      linkURL: `/user/booking/book-transfer/${item?.id_tour_booking}`,
    })),
  ];

  allBookings.sort((a, b) => {
    const dateA = new Date(a.created_at || 0);
    const dateB = new Date(b.created_at || 0);
    return (selectedSort === 1 ? 1 : -1) * (dateB.getTime() - dateA.getTime());
  });

  const totalFlights = flightBookings.length + mystiflyBookings.length;

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu="booking" header={{ title: "Back", url: "/" }}>
        {loading ? (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-center">
            Loading...
          </div>
        ) : !mystiflyBookings.length &&
          !flightBookings.length &&
          !hotelBookings.length &&
          !tourBookings.length &&
          !carBookings.length ? (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-center">
            You don't have any active booking.
          </div>
        ) : (
          <div className="search-hotel__content">
            <div className="search-hotel__content-header">
              <div className="search-hotel__content-header-title">
                {selectedFilter === "Filter" &&
                  `Showing ${(totalFlights) +
                  (hotelBookings?.length || 0) +
                  (tourBookings?.length || 0) +
                  (carBookings?.length || 0)
                  } data from bookings`
                }
                {selectedFilter === "Flight" && `Showing ${totalFlights} data from flight bookings`}
                {selectedFilter === "Hotel" && `Showing ${hotelBookings.length} data from hotel bookings`}
                {selectedFilter === "Car" && `Showing ${carBookings.length} data from car bookings`}
                {selectedFilter === "Tour" && `Showing ${tourBookings.length} data from tour bookings`}
              </div>
              <div className="d-flex flex-row align-items-center">
                <div className="pe-2">
                  <div className="custom-dropdown">
                    <div onClick={() => setShowFilterDropdown(true)} className="custom-dropdown-toggle">
                      <SVGIcon src={Icons.Filter} width={20} height={20} />
                      <div style={{ whiteSpace: "nowrap" }}>{selectedFilter}</div>
                      <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                    </div>
                    <DropdownMenu show={showFilterDropdown} setShow={setShowFilterDropdown} className="admin-booking-car__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                      <div className="custom-dropdown-menu__options">
                        <Link href={"#"} onClick={() => handleSelectedFilter("Flight")} className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">Flight</Link>
                        <Link href={"#"} onClick={() => handleSelectedFilter("Hotel")} className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">Hotel</Link>
                        <Link href={"#"} onClick={() => handleSelectedFilter("Car")} className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">Car</Link>
                        <Link href={"#"} onClick={() => handleSelectedFilter("Tour")} className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">Tour</Link>
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="ps-1">
                  <div className="custom-dropdown">
                    <div onClick={() => setShowSortDropdown(true)} className="custom-dropdown-toggle">
                      <div>Sort by: {selectedSort === 1 ? "Newest" : "Oldest"}</div>
                      <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" />
                    </div>
                    <DropdownMenu show={showSortDropdown} setShow={setShowSortDropdown} className="admin-booking-car__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                      <div className="custom-dropdown-menu__options">
                        <Link href={"#"} onClick={() => handleSelectedSort(1, "DESC")} className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">Newest</Link>
                        <Link href={"#"} onClick={() => handleSelectedSort(2, "ASC")} className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">Oldest</Link>
                      </div>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
            <div className="search-hotel__content-list">
              {selectedFilter === "Filter" ? (
                <>
                  {allBookings.map((booking, index) => (
                    (booking.type === Services.Flights && (
                      <ManageCard
                        key={index}
                        type={Services.Flights}
                        id_booking={booking.id_booking}
                        image={booking.image}
                        orderId={booking.orderId}
                        name={booking.name}
                        status={booking.status}
                        tenant={booking.tenant}
                        desc={booking.desc}
                        linkURL={booking.linkURL}
                      />
                    )) ||
                    (booking.type === Services.Hotel && (
                      <ManageCard
                        key={index}
                        type={Services.Hotel}
                        id_booking={booking.id_booking}
                        image={booking.image}
                        orderId={booking.orderId}
                        name={booking.name}
                        status={booking.status}
                        location={booking.location}
                        desc={booking.desc}
                        linkURL={booking.linkURL}
                      />
                    )) ||
                    (booking.type === Services.BookTransfer && (
                      <ManageCard
                        key={index}
                        type={Services.BookTransfer}
                        id_booking={booking.id_booking}
                        image={booking.image}
                        orderId={booking.orderId}
                        name={booking.name}
                        status={booking.status}
                        tenant={booking.tenant}
                        tenantImage={booking.tenantImage}
                        desc={booking.desc}
                        linkURL={booking.linkURL}
                      />
                    )) ||
                    (booking.type === Services.TourPackage && (
                      <ManageCard
                        key={index}
                        type={Services.TourPackage}
                        id_booking={booking.id_booking}
                        image={booking.image}
                        orderId={booking.orderId}
                        name={booking.name}
                        status={booking.status}
                        tenant={booking.tenant}
                        location={booking.location}
                        tenantImage={booking.tenantImage}
                        desc={booking.desc}
                        linkURL={booking.linkURL}
                      />
                    ))
                  ))}
                </>
              ) : (
                <>
                  {selectedFilter === "Flight" && (
                    <>
                      {flightBookings.map((item, index) => {
                        const foundAirline = (airlines as any[]).find((a: any) => a.name === item?.airline_name || a.code === item?.airline_code)
                        return (
                          <ManageCard
                            key={`flight-${index}`}
                            type={Services.Flights}
                            image={foundAirline?.image || Images.Placeholder}
                            orderId={item?.id_flight_booking}
                            name={{
                              from: item?.origin || "",
                              to: item?.destination || "",
                            }}
                            status={item?.status || "confirmed"}
                            tenant={item?.airline_name || ""}
                            desc={{
                              date: item?.departure_time ? moment(item?.departure_time).format("ddd, DD MMM YYYY") : "",
                              time: item?.departure_time ? moment(item?.departure_time).format("HH:mm") : "",
                              people: "1 passenger",
                            }}
                            linkURL="#"
                            id_booking={item?.id_flight_booking}
                          />
                        )
                      })}
                      {mystiflyBookings.map((data, index) => {
                        const itineraries = data?.TripDetailsResult?.TravelItinerary?.Itineraries[0]?.ItineraryInfo?.ReservationItems;
                        const foundAirline = (airlines as any[]).find((airline: any) => airline.code === itineraries?.[0]?.MarketingAirlineCode)
                        return (
                          <ManageCard
                            key={`mystifly-${index}`}
                            type={Services.Flights}
                            image={foundAirline?.image || Images.Placeholder}
                            orderId={data?.TripDetailsResult?.TravelItinerary?.MFRef || ""}
                            name={{
                              from: data?.TripDetailsResult?.TravelItinerary?.Origin || "",
                              to: data?.TripDetailsResult?.TravelItinerary?.Destination || "",
                            }}
                            status={data?.TripDetailsResult?.TravelItinerary?.BookingStatus || ""}
                            tenant={foundAirline?.name || foundAirline?.code || ""}
                            desc={{
                              date: itineraries?.length && itineraries[0]?.DepartureDateTime
                                ? moment(itineraries[0].DepartureDateTime).format("ddd, DD MMM YYYY")
                                : "",
                              time: itineraries?.length && itineraries[0]?.DepartureDateTime
                                ? moment(itineraries[0].DepartureDateTime).format("HH:mm")
                                : "",
                              people: data?.TripDetailsResult?.TravelItinerary?.PassengerInfos?.length
                                ? `${data?.TripDetailsResult?.TravelItinerary?.PassengerInfos?.length} passenger`
                                : "",
                            }}
                            linkURL="#"
                            id_booking={data?.TripDetailsResult?.TravelItinerary?.MFRef || ""}
                          />
                        );
                      })}
                    </>
                  )}
                  {selectedFilter === "Hotel" && !!hotelBookings.length && hotelBookings.map((item, index) => (
                    <ManageCard
                      key={index}
                      type={Services.Hotel}
                      image={item?.hotel?.profile_icon ? item?.hotel?.profile_icon : item?.hotel?.hotel_photo[0]?.photo ? item?.hotel?.hotel_photo[0]?.photo : Images.Placeholder}
                      orderId={item?.id_hotel_booking}
                      name={{ name: item?.hotel_booking_details?.hotel?.property_name }}
                      status={item.reservation_status == 1 ? bookingStatus[5] : item?.reservation_status == 2 ? bookingStatus[6] : bookingStatus[item?.status]}
                      location={`Hotel in ${item?.hotel_booking_details?.hotel?.city}, ${item?.hotel_booking_details?.hotel?.country}`}
                      id_booking={item?.id_hotel_booking}
                      desc={{
                        date: moment(item?.checkin).format("ddd, DD MMM YYYY"),
                        people: `${item?.hotel_booking_details?.adult_count !== null || item?.hotel_booking_details?.children_count !== null ? item?.hotel_booking_details?.adult_count + item?.hotel_booking_details?.children_count : 1} Guest`,
                        duration: `${countHotelDuration(item?.checkin, item?.checkout)}`,
                      }}
                      linkURL="#"
                    />
                  ))}
                  {selectedFilter === "Car" && !!carBookings.length && carBookings.map((item, index) => (
                    <ManageCard
                      key={index}
                      type={Services.BookTransfer}
                      image={item?.photo || Images.Placeholder}
                      orderId={item?.id_car_booking}
                      name={{ name: `${item?.car_brand} ${item?.edition}` }}
                      status={bookingStatus[item?.status]}
                      tenant={item?.car_company?.name}
                      tenantImage={item?.car_company?.profile_icon}
                      id_booking={item?.id_car_booking}
                      desc={{
                        date: moment(item?.pickup_date_time).format("ddd, DD MMM YYYY"),
                        vehicle: `${1} Car`,
                        duration: `${item?.total_day_for_rent} day`,
                      }}
                      linkURL="#"
                    />
                  ))}
                  {selectedFilter === "Tour" && !!tourBookings.length && tourBookings.map((item, index) => (
                    <ManageCard
                      key={index}
                      type={Services.TourPackage}
                      image={item?.photos[0]?.photo || Images.Placeholder}
                      orderId={item?.id_tour_booking}
                      name={{ name: `${item?.tour_package.package_name}` }}
                      status={tourStatus[item?.status]}
                      location={`${item?.tour_package?.address}`}
                      tenant={item?.car_company?.name}
                      tenantImage={item?.car_company?.profile_icon}
                      id_booking={item?.id_tour_booking}
                      desc={{
                        date: moment(item?.pickup_date_time).format("ddd, DD MMM YYYY"),
                        ticket: `${item?.number_of_tickets} ticket`,
                        duration: `${item?.tour_plan?.total_day} day`,
                      }}
                      linkURL="#"
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </UserLayout>
      <Footer />
    </Layout>
  );
};

export default MyBooking;
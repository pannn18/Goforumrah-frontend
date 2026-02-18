import Layout from "@/components/layout";
import InnerLayout from "@/components/business/hotel/layout";
import { useEffect, useState } from "react";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { BlurPlaceholderImage } from "@/components/elements/images";
import { Icons, Images } from "@/types/enums";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { callAPI } from "@/lib/axiosHelper";
import LoadingOverlay from "@/components/loadingOverlay";

export default function Property({ propertyHotel }) {
  const firstData = propertyHotel[0];
  const id_hotel = firstData?.id_hotel;


  const [hotelData, setHotelData] = useState({});
  const [loading, setLoading] = useState(true)

  // Get data hotel
  useEffect(() => {
    if (!id_hotel) return;

    const getDataHotel = async () => {
      const { ok, error, data } = await callAPI(
        `/hotel-layout/show-v2`,
        "POST",
        { id_hotel },
        true
      );
      if (ok) {
        setHotelData(data);
      }
    };

    getDataHotel();
    setLoading(false)
  }, [id_hotel]);


  const [propertyHotelData, setPropertyHotelData] = useState(null);

  useEffect(() => {
    if (propertyHotel) {
      // Assuming propertyHotel is an array
      const lastIndex = propertyHotel.length - 1;
      if (lastIndex >= 0) {
        setPropertyHotelData(propertyHotel[lastIndex]);
        // sethotelBusinessID(propertyHotel[lastIndex]?.id_hotel)
      }
    }
  }, [propertyHotel]);

  if (loading) {
    return <LoadingOverlay />
  }



  return (
    <Layout>
      <InnerLayout propertyHotel={propertyHotelData}>
        <div className="container container-property">
          <div className="admin-latest-business__top-header">
            <div className="admin-latest-business__top-header-wrapper">
              <h4 className="admin-latest-business__top-header-title">Room</h4>
            </div>
            <button type="button" className="btn btn-sm btn-outline-success">
              <SVGIcon src={Icons.Plus} width={20} height={20} />
              Add new room
            </button>
          </div>
          <div className="admin-property-business__wrapper">
            {Object.keys(hotelData).map((roomType, index) => (
              <div className="admin-property-business__card" key={index}>
                <div className="admin-property-business__card-header">
                  <h5>{roomType}</h5>
                  <button type="button" className="btn btn-outline-success">
                    Edit
                  </button>
                </div>

                {hotelData[roomType].map((room, roomIndex) => (
                  <div
                    className="admin-property-business__card-item"
                    key={roomIndex}
                  >
                    <BlurPlaceholderImage
                      alt="Hotel Image"
                      src={
                        room.hotel_layout_photo[0]?.photo || Images.Placeholder
                      }
                      width={64}
                      height={64}
                      className="admin-property-business__card-item__image"
                    />
                    <div className="admin-property-business__card-item__content">
                      <p className="admin-property-business__card-item__content-name">
                        {room.room_type}
                      </p>
                      <p className="admin-property-business__card-item__content-status">
                        Number of room: {room?.number_of_room || ''}
                      </p>
                    </div>
                    <div className="admin-property-business__card-item__action">
                      <Link
                        href={`/business/hotel/room/edit?id_hotel_layout=${room.id_hotel_layout}`}
                      >
                        Edit Room
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </InnerLayout>
    </Layout>
  );
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  const { ok, data } = await callAPI(
    "/hotel/list-property",
    "POST",
    { id_hotel_business: session?.user?.id },
    true
  );

  if (ok && data?.length) {
    return {
      props: {
        propertyHotel: data,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/business/hotel/empty",
      },
    };
  }
};

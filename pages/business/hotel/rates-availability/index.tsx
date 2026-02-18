import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import { useEffect, useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import Link from "next/link"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { callAPI } from "@/lib/axiosHelper"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth"
import useFetch from "@/hooks/useFetch"
import { getSession } from "next-auth/react"
import Property from "../room"

export const getServerSideProps: GetServerSideProps<{
  id_hotel: number
  propertyHotel: any[]
}> = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session?.user) return { notFound: true }

  const { ok, data, status, error } = await callAPI('/hotel/list-property', 'POST', { id_hotel_business: session?.user.id }, true, session.user.accessToken)

  if (ok && data?.length) {
    const id_hotel = data[0]?.id_hotel
    if (id_hotel) {
      return {
        props: {
          id_hotel,
          propertyHotel: data
        }
      }
    }
  }

  return { notFound: true }
}


export default function Page({
  id_hotel,
  propertyHotel
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { ok, data: groupedLayouts, error } = useFetch('/hotel-layout/show-v2', 'POST', { id_hotel, propertyHotel }, true)
  const [propertyHotelData, setPropertyHotelData] = useState(null);

  useEffect(() => {
    if (propertyHotel) {
      // Assuming propertyHotel is an array
      const lastIndex = propertyHotel.length - 1;
      console.log(lastIndex)
      if (lastIndex >= 0) {
        setPropertyHotelData(propertyHotel[lastIndex]);
        // sethotelBusinessID(propertyHotel[lastIndex]?.id_hotel)
      }
    }
  }, [propertyHotel]);


  return (
    <Layout>
      <InnerLayout propertyHotel={propertyHotelData}>

        <div className="container container-property">

          <div className="admin-latest-business__top-header">
            <div className="admin-latest-business__top-header-wrapper">
              <h4 className="admin-latest-business__top-header-title">Room</h4>
            </div>
          </div>
          <div className="admin-property-business__wrapper">
            {(groupedLayouts && typeof groupedLayouts === 'object') && Object.keys(groupedLayouts).map((roomName, index) => (
              <div key={`room-${index}`} className="admin-property-business__card">
                <div className="admin-property-business__card-header">
                  <h5>{roomName}</h5>
                </div>
                {groupedLayouts[roomName].map((room, insideIndex) => (
                  <div key={`room-${index}-${insideIndex}`} className="admin-property-business__card-item">
                    <BlurPlaceholderImage alt="Hotel Image" src={room?.hotel_layout_photo?.length ? (room?.hotel_layout_photo[0]?.photo || Images.Placeholder) : Images.Placeholder} width={64} height={64} className="admin-property-business__card-item__image" />
                    <div className="admin-property-business__card-item__content">
                      <p className="admin-property-business__card-item__content-name">{room?.room_type || ''}</p>
                      <p className="admin-property-business__card-item__content-status">Number of room: {room?.number_of_room || ''}</p>
                    </div>
                    <div className="admin-property-business__card-item__action">
                      <Link href={room?.id_hotel_layout ? `/business/hotel/rates-availability/${room.id_hotel_layout}` : ''} className="btn btn-sm btn-outline-success">See Details</Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

        </div>
      </InnerLayout>
    </Layout>
  )
}

// export const getServerSideProps = async (ctx) => {
//   const session = await getSession(ctx)

//   const { ok, data } = await callAPI('/hotel/list-property', 'POST', { id_hotel_business: session?.user?.id }, true)

//   if (ok && data?.length) {
//     return {
//       props: {
//         propertyHotel: data
//       }
//     }
//   } else {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/business/hotel/empty',
//       },
//     }
//   }
// }
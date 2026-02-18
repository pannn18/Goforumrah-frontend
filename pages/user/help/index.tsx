import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import UserLayout from '@/components/user/layout'
import React, { useEffect, useState } from 'react'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from '@/components/loadingOverlay'

const MyReview = () => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<any[]>([])

  // useEffect(() => {
  //   setLoading(true)

  //   if (!(status === 'authenticated') || !session) return

  //   (async () => {
  //     await Promise.all([
  //       new Promise(async (resolve, reject) => {
  //         try {
  //           const { ok, data, error } = await callAPI('/hotel-booking/show', 'POST', { id_customer: session.user.id }, true)

  //           if (ok && data) {
  //             const updatedData = await Promise.all(data.map(async (item) => {
  //               const { ok, data: hotel_booking_details, error } = await callAPI('/hotel-booking/detail', 'POST', { id_hotel_booking: item.id_hotel_booking }, true)
  //               return ({ ...item, hotel_booking_details })
  //             }))

  //             setData(updatedData)
  //           }

  //           // TODO: Add an error exception when the data isn't retrieved or error occurred
  //           // console.error(error)

  //           resolve(true)
  //         } catch (error) {
  //           reject(error)
  //         }
  //       })
  //     ])

  //     setLoading(false)
  //   })()
  // }, [status])

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu='help' header={{ title: 'Back', url: '/' }}>
        {loading ? (
          <LoadingOverlay />
        ) : (!data.length ? (
          <div className="w-100 h-100 d-flex align-items-center justify-content-center text-center">404 Not Found {'<'}Waiting Design{'>'}</div>
        ) : (
          <div>
          </div>
        ))}
      </UserLayout>
      <Footer />
    </Layout>
  )
}

export default MyReview
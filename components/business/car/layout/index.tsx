import React from 'react'
import { useRouter } from 'next/router'

interface IProps {
  children: React.ReactNode
  propertyCar?: any
}

const Layout = (props: IProps) => {
  const { pathname } = useRouter()

  return (
    <>
      <div className="admin-layout">
        {/* <Header propertyHotel={props?.propertyHotel} /> */}
        {/* <Sidebar /> */}
        <div className="admin-layout__content-customer-feedback">
          {props?.children}
        </div>
      </div>
    </>
  )
}

export default Layout
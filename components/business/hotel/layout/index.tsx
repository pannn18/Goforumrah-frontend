import React from 'react'
import Header from './header'
import Sidebar from './sidebar'
import { useRouter } from 'next/router'

interface IProps {
  children: React.ReactNode
  propertyHotel?: any
}

const Layout = (props: IProps) => {
  const { pathname } = useRouter()

  return (
    <>
      <div className="admin-layout">
        <Header propertyHotel={props?.propertyHotel} />
        <Sidebar />
        <div className="admin-layout__content-guest-review">
          {props?.children}
        </div>
      </div>
    </>
  )
}

export default Layout
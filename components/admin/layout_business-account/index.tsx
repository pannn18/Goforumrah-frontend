import React from 'react'
import HeaderMenu from './header'
import Navbar from "./navbar"

interface IProps {
  children: React.ReactNode
}

const Layout = (props: IProps) => {
  return (
    <>
      <div className="admin-layout">
        <Navbar showCurrency={true} lightMode={true} showNotification={true} loggedIn={true} />
        <HeaderMenu />
        <div className="admin-layout__content-full">
          {props.children}
        </div>
      </div>
    </>
  )
}

export default Layout
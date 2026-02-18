import React from 'react'
import Header from './header-business'
import Sidebar from './sidebar-business'

interface IProps {
  children: React.ReactNode
}

const Layout = (props: IProps) => {
  return (
    <>
      <div className="admin-layout">
        <Header />
        <Sidebar />
        <div className="admin-layout__content">
          {props.children}
        </div>
      </div>
    </>
  )
}

export default Layout
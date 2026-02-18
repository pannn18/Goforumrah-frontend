import React from 'react'
import Header from './header'
import Sidebar from './sidebar'

interface IProps {
  children: React.ReactNode,
  pageTitle?: string,
  enableBack?: Boolean
}

const Layout = (props: IProps) => {
  return (
    <>
      <div className="admin-layout">
        <Header pageTitle={props.pageTitle} enableBack={props.enableBack} />
        <Sidebar />
        <div className="admin-layout__content">
          {props.children}
        </div>
      </div>
    </>
  )
}

export default Layout
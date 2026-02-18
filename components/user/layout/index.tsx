import React from 'react'
import Header from './header'
import Breadcrumb from './breadcrumb'
import Sidebar from './sidebar'
import { useSession } from 'next-auth/react'
import LoadingOverlay from '@/components/loadingOverlay'

interface IProps {
  children: React.ReactNode
  activeMenu?: string
  header?: {
    title?: string
    url?: string
  }
  breadcrumb?: { text: string, url?: string, type?: string, category?: string }[]
  hideSidebar?: boolean
}

const Layout = ({ children, activeMenu, header, breadcrumb, hideSidebar }: IProps) => {
  const { data, status } = useSession()

  return status === 'loading' ? (
    <>
      <LoadingOverlay />
    </>
  ) : (
    <div className="bg-neutral-light">
      <Header {...header} />
      {!!breadcrumb?.length && <Breadcrumb breadcrumb={breadcrumb} />}
      <div className="container">
        <div className="user-layout">
          {!hideSidebar && (
            <Sidebar activeMenu={activeMenu} data={data} />
          )}
          <div className="user-layout-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout
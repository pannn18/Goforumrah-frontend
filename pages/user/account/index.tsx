import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import UserLayout from '@/components/user/layout'
import React, { useEffect, useState } from 'react'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import Link from 'next/link'
import LoadingOverlay from '@/components/loadingOverlay'

const AccountSettings = () => {
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout activeMenu='account' header={{ title: 'Back', url: '/' }}>
        {loading ? (
          <LoadingOverlay />
        ) : (
          <div className="search-hotel__content">
            <div className="manage-account__wrapper">
              <Link href="/user/account/personal" className="manage-account__box">
                <SVGIcon src={Icons.User} className="manage-account__box-icon" width={32} height={32} />
                <div className="manage-account__box-text">
                  <p className="manage-account__box-title">Personal details</p>
                  <p className="manage-account__box-desc">Update your info and find out how it’s used</p>
                </div>
              </Link>
              <Link href="/user/account/payment" className="manage-account__box">
                <SVGIcon src={Icons.Receipt} className="manage-account__box-icon" width={32} height={32} />
                <div className="manage-account__box-text">
                  <p className="manage-account__box-title">Payment details</p>
                  <p className="manage-account__box-desc">Securely add or remove payment method</p>
                </div>
              </Link>
              <Link href="/user/account/security" className="manage-account__box">
                <SVGIcon src={Icons.ShieldCheck} className="manage-account__box-icon" width={32} height={32} />
                <div className="manage-account__box-text">
                  <p className="manage-account__box-title">Security settings</p>
                  <p className="manage-account__box-desc">Make your account more securely </p>
                </div>
              </Link>
              <Link href="/user/account/notification" className="manage-account__box">
                <SVGIcon src={Icons.Mail} className="manage-account__box-icon" width={32} height={32} />
                <div className="manage-account__box-text">
                  <p className="manage-account__box-title">Email notifications</p>
                  <p className="manage-account__box-desc">Set what your email will receive</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </UserLayout>
      <Footer />
    </Layout>
  )
}

export default AccountSettings
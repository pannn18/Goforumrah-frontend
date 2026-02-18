import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import UserLayout from '@/components/user/layout'
import React, { useEffect, useState } from 'react'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import Sidebar from '@/components/user/account/sidebar'
import Link from 'next/link'
import { callAPI } from '@/lib/axiosHelper'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react';
import LoadingOverlay from '@/components/loadingOverlay'

const AccountSecurity = () => {
  const { data: session, status } = useSession()
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    setLoading(true)

    if (!(status === 'authenticated') || !session) return

    setLoading(false)
  }, [status])

  const removeActiveSession = async () => {
    setLoading(true)

    const payload = {
      id_customer: session.user.id
    }

    const { ok, status, error } = await callAPI('/customer/remove-active-session', 'POST', payload, true)

    if (ok) {

    } else {
      setError(error || 'Unknown error')
    }

    setLoading(false)
  }

  const permanentDelete = async () => {
    setLoading(true)
    const payload = {
      id_customer: session.user.id
    }
    const { ok, status, error } = await callAPI('/customer/permanent-delete', 'POST', payload, true)
    if (ok) {
      // If successful, navigate to the root route
      signOut({ redirect: true, callbackUrl: '/' })
    } else {
      setError(error || 'Unknown error')
    }
    setLoading(false)
  }

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout hideSidebar={true} header={{ title: 'Account Settings', url: '/user/account' }}>
        <div className="search-hotel__wrapper" style={{ padding: 0 }}>
          <Sidebar activeMenu='security' />
          {loading ? (
            <LoadingOverlay />
          ) : (
            <form className="search-hotel__content">
              <div className="manage-account__card">
                <div className="manage-account__header">
                  <h5>Security settings</h5>
                  <p className="manage-account__card-header-desc">Add or remove payment methods securely to make it easier when you order.</p>
                </div>
                <div>
                  <div className="manage-account__security">
                    <div className="manage-account__security-text">
                      <p className="manage-account__security-text-title">Password</p>
                      <p className="manage-account__security-text-desc">Reset your password regularly to keep your account secure</p>
                    </div>
                    <Link href="#" className="text-end manage-account__security-link">Reset password</Link>
                  </div>
                  <div className="manage-account__security">
                    <div className="manage-account__security-text">
                      <p className="manage-account__security-text-title">Active session</p>
                      <p className="manage-account__security-text-desc">You will sign you out from all devices except this one. This can take up to 10 minutes</p>
                    </div>
                    <a type='button' onClick={() => removeActiveSession()} className="text-end manage-account__security-link">Sign out all account</a>
                  </div>
                  <div className="manage-account__security">
                    <div className="manage-account__security-text">
                      <p className="manage-account__security-text-title">Delete account</p>
                      <p className="manage-account__security-text-desc">Permanently delete your GoForUmrah account</p>
                    </div>
                    <Link href="#" data-bs-toggle="modal" data-bs-target="#DeleteAccountModal" className="text-end manage-account__security-link--delete">Delete account</Link>
                  </div>
                </div>
                {error && (
                  <div className="d-flex flex-column align-items-stretch text-danger-main">
                    {error}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </UserLayout>
      <Footer />

      <div className="modal fade" id="DeleteAccountModal" tabIndex={-1} aria-labelledby="DeleteAccountModalLabel" aria-hidden="true">
        <div className="modal-dialog cancelation__modal manage-account__modal">
          <div className="modal-content manage-account__modal-content">
            <div className="manage-account__modal-wrapper">
              <SVGIcon src={Icons.CircleCancel} width={72} height={72} color="#FFF9F9" className='goform-close' />
              <div className="manage-account__modal-text">
                <h3>Do you want to proceed the deleting account</h3>
                <p className='manage-account__modal-caption'>Once your delete, it will permanently delete your account</p>
              </div>
            </div>
            <div className='row'>
              <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                <button type='button' data-bs-dismiss="modal" className='button goform-button goform-button--outline-grey goform-button--large-text company-detail__button-list-item'>Cancel</button>
              </div>
              <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                <button type='button' onClick={() => permanentDelete()} data-bs-dismiss="modal" className='button goform-button goform-button--fill-red goform-button--large-text company-detail__button-list-item company-detail__button-list-item--form'>Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AccountSecurity
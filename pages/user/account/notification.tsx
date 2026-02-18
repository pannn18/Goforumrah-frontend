import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import UserLayout from '@/components/user/layout'
import React, { useEffect, useState } from 'react'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import Sidebar from '@/components/user/account/sidebar'
import { useSession } from 'next-auth/react'
import { callAPI } from '@/lib/axiosHelper'
import LoadingOverlay from '@/components/loadingOverlay/index'

interface NotificationData {
  pad_deal: number
  pad_reward: number
  pad_refer: number
  pad_search: number
  pad_direct: number
  pas_business: number
  pas_feedback: number
  pas_product: number
  pas_mission: number
  gt_transport: number
  gt_taxi: number
  gt_cars: number
  res_email: number
  res_upcoming: number
  res_booking: number
  res_review: number,
  res_offer: number,
  soft_delete: number
}

const AccountNotification = () => {
  const { data: session, status } = useSession()

  const [notificationData, setNotificationData] = useState<NotificationData>()
  const [formData, setFormData] = useState<NotificationData>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const loadNotificationData = async () => {
    await Promise.all([
      new Promise(async (resolve, reject) => {
        try {
          const { ok, data, error } = await callAPI('/customer/notification/show', 'POST', { id_customer: session.user.id }, true)

          if (ok && data) {
            setNotificationData(data as NotificationData)
          }

          // TODO: Add an error exception when the data isn't retrieved or error occurred
          // console.error(error)

          resolve(true)
        } catch (error) {
          reject(error)
        }
      }),
    ])

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    if (!(status === 'authenticated') || !session) return

    loadNotificationData()
  }, [status])

  const initFormData = () => {
    if (!notificationData) return

    setFormData(notificationData)
  }

  useEffect(() => {
    initFormData()
  }, [notificationData])

  const handleSave = async () => {
    setError('')
    console.log(formData)
    const payload = {
      id_customer: session.user.id,
      ...formData
    }

    setLoading(true)

    const { ok, status, error } = await callAPI('/customer/notification/update', 'POST', payload, true)

    if (ok) {
      await loadNotificationData()
    } else {
      setError(error || 'Unknown error')
    }

    setLoading(false)

    return
  }

  const groupedForms = {
    pad: [
      {
        key: 'pad_deal',
        display: 'Deal discovery'
      },
      {
        key: 'pad_reward',
        display: 'Reward'
      },
      {
        key: 'pad_refer',
        display: 'Refer a friend'
      },
      {
        key: 'pad_search',
        display: 'Search assistance'
      },
      {
        key: 'pad_direct',
        display: 'Direct mail'
      },
    ],
    pas: [
      {
        key: 'pas_business',
        display: 'GoForUmrah for Business'
      },
      {
        key: 'pas_feedback',
        display: 'Customer feedback and survey'
      },
      {
        key: 'pas_product',
        display: 'Product announcements and news'
      },
      {
        key: 'pas_mission',
        display: 'Emails about earning travel rewards with Missions'
      },
    ],
    gt: [
      {
        key: 'gt_transport',
        display: 'Public Transport'
      },
      {
        key: 'gt_taxi',
        display: 'Taxi'
      },
      {
        key: 'gt_cars',
        display: 'Cars'
      },
    ],
    res: [
      {
        key: 'res_email',
        display: 'Reservation emails',
        desc: 'Emails you receive after making a reservation. This includes invitations to review the properties you stayed in.'
      },
      {
        key: 'res_upcoming',
        display: 'Upcoming booking',
        desc: 'Emails that remind you of your upcoming booking with all the details you need'
      },
      {
        key: 'res_review',
        display: 'Review invites',
        desc: 'Emails inviting you to leave a review on the property you stayed at'
      },
      {
        key: 'res_offer',
        display: 'Offers in confirmation emails',
        desc: 'Other product deals and upgrades in your confirmation emails.'
      },
      {
        key: 'res_booking',
        display: 'Booking confirmation emails',
        desc: 'You are not able to unsubscribe from booking confirmation emails'
      },
    ]
  }

  const tabs = {
    'News letter and news': '',
    'Reservations': '',
  }
  const [selectedTab, setSelectedTab] = useState<String>(Object.keys(tabs)[0])

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout hideSidebar={true} header={{ title: 'Account Settings', url: '/user/account' }}>
        <div className="search-hotel__wrapper" style={{ padding: 0 }}>
          <Sidebar activeMenu='notification' />
          {loading ? (
            <LoadingOverlay />
          ) : (
            <form className="search-hotel__content" onSubmit={() => handleSave()}>
              <div className="manage-account__card">
                <div className="manage-account__header">
                  <h5>Email notification</h5>
                  <p className="manage-account__card-header-desc">Add or remove payment methods securely to make it easier when you order.</p>
                </div>
                <div className="manage-account__tab">
                  <div className="manage-account__tab-menu">
                    {Object.keys(tabs).map((tab, index) => (
                      <button
                        type="button"
                        key={index}
                        className={`btn ${tab === selectedTab ? 'active' : ''}`}
                        onClick={() => setSelectedTab(tab)}>
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {(selectedTab === 'News letter and news') && (
                <>
                  <div className="manage-account__card">
                    <div className="manage-account__tab-content">
                      <div className="manage-account__tab-header">
                        <p className="manage-account__tab-header-title">Promotions and deals</p>
                        <p className="manage-account__tab-header-subtitle">Email based on destination you’re interested in (Search assistance) and news letter highlighting</p>
                      </div>
                      <div>
                        {groupedForms.pad.map(({ key, display }) => (
                          <label key={key} className="manage-account__email form-check">
                            <label htmlFor={key} className="form-check-label manage-account__email-label">{display}</label>
                            <input type="checkbox" id={key} className="form-check-input manage-account__email-checkbox" checked={formData?.[key] === 1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFormData(prevState => ({ ...prevState, [key]: e.target.checked ? 1 : '0' }))
                            }} />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="manage-account__card">
                    <div className="manage-account__tab-content">
                      <div className="manage-account__tab-header">
                        <p className="manage-account__tab-header-title">Product and service</p>
                        <p className="manage-account__tab-header-subtitle">Communications about Booking.com's products and services.</p>
                      </div>
                      <div>
                        {groupedForms.pas.map(({ key, display }) => (
                          <label key={key} className="manage-account__email form-check">
                            <label htmlFor={key} className="form-check-label manage-account__email-label">{display}</label>
                            <input type="checkbox" id={key} className="form-check-input manage-account__email-checkbox" checked={formData?.[key] === 1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFormData(prevState => ({ ...prevState, [key]: e.target.checked ? 1 : '0' }))
                            }} />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="manage-account__card">
                    <div className="manage-account__tab-content">
                      <div className="manage-account__tab-header">
                        <p className="manage-account__tab-header-title">Ground transportation</p>
                        <p className="manage-account__tab-header-subtitle">Everything to help you get around during your stay.</p>
                      </div>
                      <div>
                        {groupedForms.gt.map(({ key, display }) => (
                          <label key={key} className="manage-account__email form-check">
                            <label htmlFor={key} className="form-check-label manage-account__email-label">{display}</label>
                            <input type="checkbox" id={key} className="form-check-input manage-account__email-checkbox" checked={formData?.[key] === 1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              setFormData(prevState => ({ ...prevState, [key]: e.target.checked ? 1 : '0' }))
                            }} />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {(selectedTab === 'Reservations') && (
                <>
                  <div className="manage-account__card">
                    <div className="manage-account__tab-content">
                      <div>
                        {groupedForms.res.map(({ key, display, desc }) => (
                          <>
                            <label key={key} className="manage-account__email manage-account__email--reservation form-check">
                              <div className="manage-account__email-reservation">
                                <label htmlFor={key} className="form-check-label manage-account__email-label">{display}</label>
                                <p className="manage-account__tab-header-subtitle">{desc}</p>
                              </div>
                              <input type="checkbox" id={key} className="form-check-input manage-account__email-checkbox" checked={formData?.[key] === 1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData(prevState => ({ ...prevState, [key]: e.target.checked ? 1 : '0' }))
                              }} />
                            </label>
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {error && (
                <div className="manage-account__card">
                  <div className="d-flex flex-column align-items-stretch text-danger-main">
                    {error}
                  </div>
                </div>
              )}
              <div className="manage-account__card">
                <div className="manage-account__form-buttons">
                  <button type="button" onClick={() => initFormData()} className="btn btn-lg btn-outline-success">Cancel</button>
                  <button type="submit" className="btn btn-lg btn-success">Save</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </UserLayout>
      <Footer />
    </Layout>
  )
}

export default AccountNotification
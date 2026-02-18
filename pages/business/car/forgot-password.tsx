import React, { useState } from 'react'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import businessImage from '@/assets/images/business_login_img.jpg'
import { BlurPlaceholderImage } from '@/components/elements/images'
import CheckInbox from '@/components/pages/business/auth/checkInbox'
import { callAPI } from '@/lib/axiosHelper'

const ForgotPassword = () => {
  const [isLinkSent, setIsLinkSent] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  const handleFormSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    const payload = {
      email
    }

    const { ok, error } = await callAPI(`/car-business/forgot-password/request`, 'POST', payload)

    if (ok && !error) {
      setIsLinkSent(true)
    } else {
      setError(error || 'Unknown error')
    }

    setLoading(false)
  }

  return (
    <Layout>
      <Navbar showHelp={true} hideAuthButtons={true} />
      {isLinkSent ? (
        <CheckInbox email={email} />
      ) : (
        <div className="signup-business">
          <div className='container signup-business__container'>
            <div className='row'>
              <div className='col-lg-6 col-lg-offset-6 col-md-12 signup-business__left'>
                <div className='signup-business__left-content'>
                  <h1 className='signup-business__left-heading'>Forgot your password ?</h1>
                  <p className='signup-business__left-subheading'>Confirm your username and we'll send you a link to reset your password.</p>
                  <form className='signup-business__form' onSubmit={handleFormSubmission}>
                    <label htmlFor="email-address" className="form-label goform-label signup-business__form-label">Email Address</label>
                    <input
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      required type="email" placeholder='Enter your email address' className="form-control goform-input signup-business__form-control" id="email-address" />
                    {!!error && (
                      <div style={{ marginBottom: 16, color: 'red' }}>{error}</div>
                    )}
                    <button disabled={loading} type="submit" className="btn goform-button goform-button--fill-green signup-business__form-submit" id="submitForm">{loading ? 'Please wait...' : 'Continue'}</button>
                  </form>
                  <p className='signup-business__left-info'>By signing in or creating an account, you agree with our <a>Terms & conditions</a> and <a>Privacy statement</a></p>
                </div>
                <div className='signup-business__left-footer'>
                  <p>All rights reserved. Copyright 2022 – GoForUmrah.com™</p>
                </div>
              </div>
            </div>
          </div>
          <BlurPlaceholderImage className='signup-business__image' alt='image' src={businessImage} width={2100} height={2460} />
        </div>
      )}
    </Layout>
  )
}

export default ForgotPassword

import React from 'react'
import { BlurPlaceholderImage } from '@/components/elements/images'
import businessImage from '@/assets/images/icon_check_soft.svg'
import Link from 'next/link'

const CheckInbox = ({ email }: { email: string }) => {
  return (
    <div className="signup-business signup-business__verify-box">
      <div className='container signup-business__container'>
        <div className='row'>
          <div className='col'>
            <BlurPlaceholderImage className='signup-business__verify-icon' alt='image' src={businessImage} width={72} height={72} />
            <h3 className='signup-business__verify-title'>Check your inbox</h3>
            <p className='signup-business__verify-caption'>
              We just emailed instructions and a reset password link to <strong>{email}</strong> <br />
              It might take a few minutes to arrive.
            </p>
            <Link href="/" className="btn goform-button goform-button--fill-green signup-business__form-submit">Back to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckInbox
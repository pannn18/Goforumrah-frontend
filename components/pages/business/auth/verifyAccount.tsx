import React from 'react'
import { BlurPlaceholderImage } from '@/components/elements/images'
import businessImage from '@/assets/images/icon_check_soft.svg'

const VerifyAccount = () => {
  return (
    <div className="signup-business signup-business__verify-box">
      <div className='container signup-business__container'>
        <div className='row'>
          <div className='col'>
            <BlurPlaceholderImage className='signup-business__verify-icon' alt='image' src={businessImage} width={72} height={72} />
            <h3 className='signup-business__verify-title'>Verify your email address</h3>
            <p className='signup-business__verify-caption'>
              We sent you an email with a verification link to <strong>fahmiauliyarohman@gmail.com</strong>.
              To confirm your account please follow the link in the email we just sent.
            </p>
            <a href="#" className="btn goform-button goform-button--fill-green signup-business__form-submit">Open your email</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount
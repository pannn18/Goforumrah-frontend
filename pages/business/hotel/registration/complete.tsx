import Layout from '@/components/layout'
import React from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons } from '@/types/enums'
import iconCheck from 'assets/images/icon_check_soft.svg'
import iconCheckDark from 'assets/images/icon_check_dark.svg'
import iconTime from 'assets/images/icon_time.svg'
import SVGIcon from '@/components/elements/icons'


const registrationDone = () => {
  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <div className='hotel-registration'>
        <div className='container'>
          <div className='row'>
            <div className='col'>
              <div className='hotel-registration__content-container hotel-registration__content-container__registration-done'>
                <div className='hotel-registration__content-form hotel-registration__content-registration-done'>
                  <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                  <h3 className='hotel-registration__content-title-heading'>Registration complete</h3>
                  <p className='hotel-registration__content-title-caption'>Congrats! It's time to relax and put your feet up, since you've completed your registration. For your records, we also sent you an email confirming your registration, along with a separate email containing a copy of your agreement.</p>
                </div>
                <div className='hotel-registration__content-form hotel-registration__content-registration-done'>
                  <h3 className='hotel-registration__content-title-heading'>You Made It!</h3>
                  <p className='hotel-registration__content-title-caption'>You just finished registering your property with Booking.com, so take it easy and let us do the rest. From here, the next steps are:</p>
                  <div className='hotel-registration__stepper-wrapper'>
                    <div className='hotel-registration__stepper-item completed'>
                      <div className='hotel-registration__step-counter hotel-registration__step-counter-active'><BlurPlaceholderImage className='hotel-registration__step-counter__img' alt='image' src={iconCheckDark} /></div>
                      <div className="hotel-registration__step-content">
                        <h5 className='hotel-registration__step-title'>Registration property</h5>
                        <p className='hotel-registration__step-paragraph'>You just finished registering your property with GoForUmrah.com, so take it easy and let us do the rest.</p>
                      </div>
                    </div>
                    <div className='hotel-registration__stepper-item active'>
                      <div className='hotel-registration__step-counter hotel-registration__step-counter-active'><BlurPlaceholderImage className='hotel-registration__step-counter__img' alt='image' src={iconTime} /></div>
                      <div className="hotel-registration__step-content hotel-registration__step-content-active">
                        <h5 className='hotel-registration__step-title'>We’re reviewing</h5>
                        <p className='hotel-registration__step-paragraph'>The team at GoForUmrah.com is currently reviewing your property details. We'll send you an email letting you know when we're done.</p>
                      </div>
                    </div>
                    <div className='hotel-registration__stepper-item unactive'>
                      <div className='hotel-registration__step-counter'></div>
                      <div className="hotel-registration__step-content">
                        <h5 className='hotel-registration__step-title'>Getting access</h5>
                        <p className='hotel-registration__step-paragraph'>After we've finished reviewing your property, we'll send you an email explaining how to access your dashboard</p>
                      </div>
                    </div>
                    <div className='hotel-registration__stepper-item unactive'>
                      <div className='hotel-registration__step-counter'></div>
                      <div className="hotel-registration__step-content">
                        <h5 className='hotel-registration__step-title'>Getting online</h5>
                        <p className='hotel-registration__step-paragraph'>Soon after we've checked your property, we'll call you with details about what happens next.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default registrationDone
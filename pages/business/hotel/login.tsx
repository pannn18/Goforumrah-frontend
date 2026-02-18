import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { getSession, signIn } from 'next-auth/react'
import { RFHInput } from "@/components/forms/fields"
import { useRouter } from "next/router"
import Link from 'next/link'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import businessImage from '@/assets/images/business_login_img.jpg'
import { BlurPlaceholderImage } from '@/components/elements/images'
import platform from 'platform'

type wizardStep = 'email' | 'password'

const wizardData: {
  [step: string]: {
    title: string
    description: string
  }
} = {
  'email': {
    title: 'Sign in to manage your property',
    description: 'Sign in to your account to list and manage your property.'
  },
  'password': {
    title: 'Enter your password',
    description: 'Enter your password for '
  },
}

const Login = () => {
  const [latLong, setLatLong] = useState<{ latitude: number, longitude: number } | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => setLatLong({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    )
  }, [])

  const fieldShapes = {
    email: yup.string().email('Wrong email format').required('Email address is required'),
    password: yup.string().required('Password is required'),
  }

  const schema = yup.object().shape(fieldShapes)

  const router = useRouter()

  const [activeStep, setActiveStep] = useState<wizardStep>('email')
  const [error, setError] = useState<string>()

  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  // Submit handler
  const onSubmit = async (values) => {
    setError('')

    // Email Step Handler
    if (activeStep === 'email' && ((!isValid && !errors.email && !values.email) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['email'].includes(field)))

      if (!errors.email) setActiveStep('password')

      return
    }

    // Password Step Handler
    if (activeStep === 'password' && ((!isValid && !errors.password && !values.password) || (isValid))) {
      clearErrors(Object.keys(fieldShapes).filter(field => !['password'].includes(field)))

      const { email, password } = getValues()
      const { error, ok, status } = await signIn('credentials', {
        role: 'admin-hotel',
        email,
        password,
        useragent_info: platform?.ua || '-',
        device_info: platform?.description || '',
        location_info: latLong?.latitude && latLong?.longitude ? `${latLong.latitude} ${latLong.longitude}` : '',
        redirect: false
      })

      if (ok && status == 200) {
        //! I don't know whats wrong with the middleware on production mode 
        //! it can't use the router to redirect to a protected page
        document.location.href = '/business/hotel'
      } else {
        setError(error || 'Unknown error')
      }

      return
    }
  }

  return (
    <Layout>
      <Navbar showHelp={true} hideAuthButtons={true} />
      <div className="signup-business">
        <div className='container signup-business__container'>
          <div className='row h-100'>
            <div className='col-lg-6 col-lg-offset-6 col-md-12 signup-business__left'>
              <div className='signup-business__left-content'>
                <h1 className='signup-business__left-heading'>{wizardData[activeStep].title}</h1>
                <p className='signup-business__left-subheading'>{wizardData[activeStep].description} {activeStep === 'password' && (<strong>{(getValues())?.email}</strong>)}</p>
                <form className='signup-business__form' onSubmit={handleSubmit(onSubmit, onSubmit)}>
                  {activeStep === 'email' && (
                    <>
                      <label htmlFor="emailAddress" className="form-label goform-label signup-business__form-label">Email address</label>
                      <RFHInput id="emailAddress" register={register('email')} type="email" placeholder="Enter your email address" error={errors.email?.message.toString()} />
                    </>
                  )}

                  {activeStep === 'password' && (
                    <>
                      <label htmlFor="businessPassword" className="form-label goform-label signup-business__form-label">Password</label>
                      <RFHInput id="businessPassword" register={register('password')} type="password" placeholder="Enter your password" error={errors.password?.message.toString()} />
                      <p className='signup-business__single-link' style={{ marginTop: 24 }}><Link href='/business/hotel/forgot-password'>Forgot Password?</Link></p>
                    </>
                  )}

                  {error && (
                    <div className="d-flex flex-column align-items-stretch text-danger-main text-center" style={{ marginTop: 24 }}>
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn goform-button goform-button--fill-green signup-business__form-submit"
                    style={{ marginTop: 24 }}>
                    {activeStep === 'email' && 'Continue'}
                    {activeStep === 'password' && 'Login'}
                  </button>
                </form>
                {activeStep === 'email' && (
                  <Link href='/business/hotel/signup' className='btn goform-button goform-button--outline-green signup-business__form-button'>Create your partner account</Link>
                )}
                <p className='signup-business__left-info'>By signing in or creating an account, you agree with our <a>Terms & conditions</a> and <a>Privacy statement</a></p>
              </div>
              <div className='signup-business__left-footer'>
                <p>All rights reserved. Copyright 2024 – GoForUmrah.com™</p>
              </div>
            </div>
          </div>
        </div>
        <BlurPlaceholderImage className='signup-business__image' alt='image' src={businessImage} width={2100} height={2460} />
      </div>
    </Layout>
  )
}

export default Login

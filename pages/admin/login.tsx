import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { signIn } from 'next-auth/react'
import { useEffect, useState } from "react"
import { RFHInput } from "@/components/forms/fields"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import { BlurPlaceholderImage } from '@/components/elements/images'
import brandLogo from '@/assets/images/logo_admin_text_dark.svg'
import logoText from '@/assets/images/logo_text_dark.svg';
import platform from "platform"

export default function Login() {
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

  const [error, setError] = useState<string>()

  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  // Submit handler
  const onSubmit = async (values) => {
    setError('')

    if (isValid) {
      clearErrors(Object.keys(fieldShapes))

      const { email, password } = getValues()
      const { error, ok, status } = await signIn('credentials', {
        role: 'admin',
        email,
        password,
        useragent_info: platform?.ua || '',
        device_info: platform?.description || '',
        location_info: latLong?.latitude && latLong?.longitude ? `${latLong.latitude} ${latLong.longitude}` : '',
        redirect: false
      })

      if (ok && status == 200) {
        router.replace('/admin')
      } else {
        setError(error || 'Unknown error')
      }

      return
    }
  }

  return (
    <Layout>
      <div className="admin-login">
        <div className="admin-login__header">
          <BlurPlaceholderImage className='' alt='image' src={logoText} width={208} height={32} />
        </div>
        <div className="container">
          <div className="admin-login__wrapper">
            <form className="admin-login__form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-login__form-header">
                <h3 className="admin-login__form-header-title">Admin Login</h3>
                <p className="admin-login__form-header-subtitle">Enter your details to get sign in to your account</p>
              </div>
              <div className="admin-login__form-group">
                <label htmlFor="username" className="form-label goform-label signup-business__form-label">Email address</label>
                <RFHInput register={register('email')} type="email" placeholder="Enter your email here" error={errors.email?.message.toString()} />
              </div>
              <div className="admin-login__form-group">
                <label className="form-label goform-label signup-business__form-label">Password</label>
                <RFHInput register={register('password')} type="password" placeholder="Enter your password" error={errors.password?.message.toString()} />
              </div>
              <div className="form-check admin-login__form-checklist">
                <input type="checkbox" placeholder="" className="form-check-input" id="rememberMe" aria-describedby="rememberMe" />
                <label htmlFor="rememberMe" className="form-check-label">Remember Me</label>
              </div>
              <button type="submit" className="btn goform-button goform-button--fill-green">Continue</button>
              {error && (
                <div className="d-flex flex-column align-items-stretch text-danger-main text-center">
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
        <p className="admin-login__footer">All rights reserved. Copyright 2022 – GoForUmrah.com™</p>
      </div>
    </Layout>
  )
}
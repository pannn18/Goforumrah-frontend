import React, { useState } from 'react'
import Router from 'next/router'
import Layout from '@/components/layout'
import Image from 'next/image'
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import { RFHInput } from '@/components/forms/fields';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import SVGIcon from '@/components/elements/icons';
import { Icons } from '@/types/enums';
import { callAPI } from '@/lib/axiosHelper';
import Link from 'next/link';

interface IProps {
  type: 'agent' | 'customer' | 'business-hotel' | 'business-car'
  email: string,
  code: string
}

const fieldShapes = {
  password: yup.string().required('Password is required').matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
    'Use a minimum of 8 characters, including uppercase letters, lowercase letters and numbers'
  ),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match')
}

const schema = yup.object().shape(fieldShapes)

const ResetPassword = (props: IProps) => {
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const [isTravelAgent, setIsTravelAgent] = useState<boolean>(props.type === 'agent')
  const [error, setError] = useState<string>()

  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (values) => {
    setError('')

    if (isValid) {
      clearErrors()

      const { password } = getValues()
      const payload = {
        email: props.email,
        code: props.code,
        new_password: password
      }

      const { ok, status, error } = await callAPI(`/${props.type === 'agent' ? 'agent' : (props.type === 'business-hotel' ? 'hotel-business' : props.type === 'business-car' ? 'car-business' : 'customer')}/forgot-password/submit`, 'POST', payload)

      if (ok) {
        setIsSuccess(true)
        reset()
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    return
  }

  return (
    <Layout>
      <div className="reset-password-page">
        <nav>
          <div className="container">
            <div className="nav-content">
              <Image className="nav-logo" src={logoTextDark} alt="GoForUmrah" height={26} />
            </div>
          </div>
        </nav>
        <main>
          <div className="container">
            {isSuccess ? (
              <div className="content-wrapper">
                <div className="content-icon">
                  <SVGIcon src={Icons.CircleCheckLarge} width={92} height={92} />
                </div>
                <h2 className="content-title">Password Reset</h2>
                <div className="content-subtitle">Your password has been successfully reset. Click below to continue login</div>
                <div className="content-cta d-flex flex-column align-items-stretch">
                  <Link href="/" className="btn btn-outline-success">Back to Login</Link>
                </div>
              </div>
            ) : (
              <div className="content-wrapper">
                <div className="content-icon">
                  <SVGIcon src={Icons.LockStatusLarge} width={92} height={92} />
                </div>
                <h2 className="content-title">Set new password</h2>
                <div className="content-subtitle">Your new password must be different to previously used password</div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <label className="form-label">New Password</label>
                    <RFHInput register={register('password')} type="password" placeholder="Enter a new password" error={errors.password?.message.toString()} info="Must be at least 8 character" />
                  </div>
                  <div>
                    <label className="form-label">Re-Enter New Password</label>
                    <RFHInput register={register('confirmPassword')} type="password" placeholder="Re-enter new password" error={errors.confirmPassword?.message.toString()} />
                  </div>
                  {error && (
                    <div className="d-flex flex-column align-items-stretch text-danger-main text-center">
                      {error}
                    </div>
                  )}
                  <div className="d-flex flex-column align-items-stretch">
                    <button type="submit" className="btn btn-success">Reset Password</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
        <footer>
          <div className="container">
            <div className="footer-content">© 2023 Goforumrah LLC All rights reserved.</div>
          </div>
        </footer>
      </div>
    </Layout>
  )
}

export const getServerSideProps = async ({ query }) => {
  const { email, code, type } = query

  if (!email || !code) {
    return {
      redirect: {
        permanent: true,
        destination: '/',
      },
    }
  }

  return {
    props: {
      email, code, type: ['agent', 'business-hotel', 'business-car'].includes(type) ? type : 'customer'
    }
  }
}

export default ResetPassword
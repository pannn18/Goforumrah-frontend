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
  email: string,
  code: string,
  type: string,
  success: boolean
}

const ResetPassword = (props: IProps) => {
  const { email, code, type, success } = props

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
            <div className="content-wrapper">
              <div className="content-icon">
                <SVGIcon src={success ? Icons.CircleCheckLarge : Icons.CircleErrorLarge} width={92} height={92} />
              </div>
              <h2 className="content-title">{success ? 'Email Verified' : 'Email Verification Failed'}</h2>
              <div className="content-subtitle">{success ? 'Your email has been verified. Click below to continue login' : 'We\'re sorry, but we couldn\'t verify your email address. It seems that the verification process has failed.'}</div>
              {success && (
                <div className="content-cta d-flex flex-column align-items-stretch">
                  <Link href="/" className="btn btn-outline-success">Back to Login</Link>
                </div>
              )}
            </div>
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

  const { ok } = await callAPI(`/${type === 'agent' ? 'agent' : 'customer'}/email-verification/verify`, 'POST', { email, code })

  return {
    props: {
      email, code, type, success: ok
    }
  }
}

export default ResetPassword
import React, { useEffect, useRef, useState } from 'react'
import SVGIcon from '../elements/icons'
import { Icons } from '@/types/enums'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { signIn, useSession } from 'next-auth/react'
import { RFHInput } from '../forms/fields'

type wizardStep = 'email' | 'password' | 'forgot'

const schema = yup.object().shape({
  email: yup.string().email('Wrong email format').required('Email address is required'),
  password: yup.string().required('Password is required'),
  forgotEmail: yup.string().email('Wrong email format').required('Email address is required'),
})

const LoginModal = () => {
  const [currentStep, setCurrentStep] = useState<wizardStep>('email')
  const [isTravelAgent, setIsTravelAgent] = useState<boolean>(false)
  const [isSigninSuccess, setIsSigninSuccess] = useState<boolean>(false)
  const [isForgotSuccess, setIsForgotSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const modalRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, clearErrors } = useForm({ resolver: yupResolver(schema) })

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onSubmit = async (values) => {
    setError('')

    if (currentStep === 'email' && ((!isValid && !errors.email && !values.email) || (isValid))) {
      clearErrors(['password', 'forgotEmail'])
      return setCurrentStep('password')
    }

    if (currentStep === 'password' && ((!isValid && !errors.password && !values.password) || (isValid))) {
      clearErrors(['email', 'forgotEmail'])

      const { email, password } = getValues()
      const { error, ok, status } = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (ok && status == 200) {
        reset()
        setIsSigninSuccess(true)
      } else {
        setError(error || 'Unknown error')
      }

      return
    }

    if (currentStep === 'forgot' && ((!isValid && !errors.forgotEmail && !values.forgotEmail) || (isValid))) {
      clearErrors(['email', 'password'])
      // TODO: Send the email to API to get the reset link
    }

    return
  }

  // Modal event listener
  useEffect(() => {
    const modal = modalRef.current

    const onModalShow = () => {
      setCurrentStep('email')
      setIsSigninSuccess(false)
      setIsForgotSuccess(false)
    }

    const onModalHidden = () => {
      setCurrentStep('email')
      setIsSigninSuccess(false)
      setIsForgotSuccess(false)
    }

    modal.addEventListener('show.bs.modal', onModalShow)
    modal.addEventListener('hidden.bs.modal', onModalHidden)

    return () => {
      modal.removeEventListener('show.bs.modal', onModalShow)
      modal.removeEventListener('hidden.bs.modal', onModalHidden);
    }
  }, [])


  return (
    <div ref={modalRef} className="modal login-modal fade" id="login-modal" aria-hidden="true" tabIndex={-1}>
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <div className="flex-grow-1 text-center text-neutral-primary fs-lg fw-bold">
              {currentStep === 'email' && 'Sign in or create an account'}
            </div>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
          </div>
          <div className="modal-body">
            {/* Sign in success modal */}
            {isSigninSuccess && (
              <div className="login-modal__success">
                <div className="login-modal__success-icon">
                  <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                </div>
                <div>
                  <h4 className="login-modal__title">Salam, Welcome to GoForUmrah.com!</h4>
                  <div className="login-modal__subtitle">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
                </div>
                <div className="align-self-stretch d-flex flex-column align-items-stretch">
                  <button type="button" data-bs-dismiss="modal" className="btn btn-success">Ok, Got it</button>
                </div>
              </div>
            )}

            {/* Forgot password send link success modal */}
            {isForgotSuccess && (
              <div className="login-modal__success">
                <div className="login-modal__success-icon">
                  <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
                </div>
                <div>
                  <h4 className="login-modal__title">Check your inbox</h4>
                  <div className="login-modal__subtitle">We've just emailed a verification link to <span className="fw-bold">{(getValues())?.email}</span>. Once it arrives, it will be valid for 10 minutes.</div>
                </div>
                <div className="align-self-stretch d-flex flex-column align-items-stretch">
                  <button type="button" onClick={() => {
                    setCurrentStep('email')
                    setIsSigninSuccess(false)
                    setIsForgotSuccess(false)
                  }} className="btn btn-outline-success">Back to sign-in</button>
                </div>
              </div>
            )}

            {/* Main form */}
            {(!isSigninSuccess && !isForgotSuccess) && (
              <form onSubmit={handleSubmit(onSubmit, onSubmit)}>
                <h4 className="login-modal__title">
                  {currentStep === 'email' && <>Welcome to <span className="text-green-01">GoForUmrah {isTravelAgent && 'Agent'}</span></>}
                  {currentStep === 'password' && 'Enter your password'}
                  {currentStep === 'forgot' && 'Forgotten your password?'}
                </h4>
                <div className="login-modal__subtitle">
                  {currentStep === 'email' && 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.'}
                  {currentStep === 'password' && <>Please enter your GoForUmrah.com password for <span className="fw-bold">{(getValues()).email}</span>.</>}
                  {currentStep === 'forgot' && 'No problem! We\'ll send you a link to reset it. Please enter the email address you use to sign in to GoForUmrah.com.'}
                </div>

                <div className="login-modal__form">
                  {currentStep === 'email' && (
                    <div>
                      <label className="form-label">Email Address</label>
                      <RFHInput register={register('email')} type="email" placeholder="Enter your email here" error={errors.email?.message.toString()} />
                    </div>
                  )}

                  {currentStep === 'password' && (
                    <div>
                      <label className="form-label">Password</label>
                      <RFHInput register={register('password')} type="password" placeholder="Enter your password" error={errors.password?.message.toString()} />
                    </div>
                  )}

                  {currentStep === 'forgot' && (
                    <div>
                      <label className="form-label">Email Address</label>
                      <RFHInput register={register('forgotEmail')} type="email" placeholder="Enter your email address" error={errors.forgotEmail?.message.toString()} />
                    </div>
                  )}

                  {error && (
                    <div className="d-flex flex-column align-items-stretch text-danger-main text-center">
                      {error}
                    </div>
                  )}

                  <div className="d-flex flex-column align-items-stretch">
                    <button
                      type="submit"
                      className="btn btn-success">
                      {currentStep === 'email' && 'Continue with Email'}
                      {currentStep === 'password' && 'Log In'}
                      {currentStep === 'forgot' && 'Send reset link'}
                    </button>
                  </div>

                  {currentStep === 'email' && (
                    <div className="login-modal__cta-link">
                      <a type="button" onClick={() => setIsTravelAgent(!isTravelAgent)} className="link link-green-01">I'm a {isTravelAgent ? 'Customer' : 'Travel Agency'}</a>
                    </div>
                  )}

                  {(currentStep === 'email' || currentStep === 'password') && (
                    <div className="login-modal__or-divider">or use one of these options</div>
                  )}

                  {currentStep === 'email' && (
                    <div className="login-modal__login-options">
                      <button type="button" onClick={() => signIn('google')} className="btn btn-outline-neutral-primary">
                        <SVGIcon src={Icons.GoogleColored} width={20} height={20} />
                        <span>Continue with Google</span>
                      </button>
                      <button type="button" onClick={() => signIn('facebook')} className="btn btn-outline-neutral-primary">
                        <SVGIcon src={Icons.FacebookColored} width={20} height={20} />
                        <span>Continue with Facebook</span>
                      </button>
                      <button type="button" className="btn btn-outline-neutral-primary">
                        <SVGIcon src={Icons.Phone} width={20} height={20} />
                        <span>Continue with Phone Number</span>
                      </button>
                    </div>
                  )}

                  {currentStep === 'password' && (
                    <>
                      <div className="login-modal__login-options">
                        <button type="button" className="btn btn-outline-success">Sign in with a verification link</button>
                      </div>
                      <div className="login-modal__cta-link">
                        <a type="button" onClick={() => setCurrentStep('forgot')} className="link link-green-01">Forgotten your password?</a>
                      </div>
                    </>
                  )}
                </div>
              </form>
            )}

            {!isSigninSuccess && (
              <div className="login-modal__footer">By signing in or creating an account, you agree with our <a href="#">Terms & conditions</a> and <a href="#">Privacy statement</a></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal
import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import Navbar from "@/components/layout/navbar"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { callAPI } from "@/lib/axiosHelper"


const SidebarMenus = [
  {
    id: 1,
    URL:
      "/business/hotel/account",
    name: "Account Setting",
    icon: Icons.User,
  },
  {
    id: 2,
    URL:
      "/business/hotel/account/business",
    name: "Business Setting",
    icon: Icons.Store,
  },
  {
    id: 3,
    name: "Change Password",
    URL:
      "/business/hotel/account/change-password",
    icon: Icons.Lock,
  },
  {
    id: 4,
    name: "Linked Device",
    URL:
      "/business/hotel/account/linked-device",
    icon: Icons.MonitorOutline,
  },
];

const SidebarMenu = (settings) => {
  const { pathname } = useRouter()
  return (
    <div className="admin-business-settings__menu-list">
      <Link href={`${settings.URL}`} className={`admin-business-settings__menu-item ${pathname === settings.URL ? 'active' : ''}`}>
        <SVGIcon className="admin-business-settings__menu-item--icon" src={`${settings.icon}`} width={20} height={20} />
        <p className="admin-business-settings__menu-desc">{settings.name}</p>
        <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
      </Link>
    </div>
  )
}

const SidebarSettings = () => {
  const { pathname } = useRouter()
  return (
    <div className="admin-business-settings__menu">
      <div className="admin-business-settings__menu-list">
        {SidebarMenus.map(SidebarMenu)}
        <a type="button" onClick={() => signOut({ redirect: true, callbackUrl: '/business/hotel/login' })} className="admin-business-settings__menu-item">
          <SVGIcon className="admin-business-settings__menu-item--icon" src={Icons.Logout} width={20} height={20} />
          <p className="admin-business-settings__menu-desc">Logout</p>
          <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="admin-business-settings__menu-item--arrow" />
        </a>
      </div>
    </div>
  )
}


const ContentChangePassword = () => {


  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

  const handlePasswordShow = () => {
    setIsPasswordShow(!isPasswordShow)
  }

  const handleConfirmPasswordShow = () => {
    setIsConfirmPasswordShow(!isConfirmPasswordShow)
  }

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false
  })

  const router = useRouter()
  const { data: session, status } = useSession()
  const id_hotel_business = (status === 'authenticated' || session) ? Number(session.user.id) : null;

  const handleValidation = (value) => {
    const length = value.length >= 8;
    const uppercase = /[A-Z]/.test(value);
    const number = /\d/.test(value);

    setValidations({
      length,
      uppercase,
      number,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation newPassword
    handleValidation(newPassword)

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (Object.values(validations).every(Boolean)) {
      const { ok, error } = await callAPI(`/hotel-business/store`, 'POST', { "id_hotel_business": id_hotel_business, 'password': newPassword }, true)
      if (ok) {
        router.push('/business/hotel/account/success')
      }
      if (error) {
        console.log(error)
      }
      return
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-menu-settings__content">
      <div className="admin-change-password__content-top">
        <div className="admin-change-password__content-require">
          <p className="admin-change-password__content-require-desc">Password must contain:</p>
          <div className="admin-change-password__content-require-wrapper">
            <div className="admin-change-password__content-require-item">
              {validations.length ? (
                <>
                  <SVGIcon src={Icons.Check} width={20} height={20} className="admin-change-password__content-require-item--icon" />
                  <p>At least 8 characters</p>
                </>
              ) : (
                <p className="text-danger">At least 8 character</p>
              )}
            </div>

            <div className="admin-change-password__content-require-item">
              {validations.uppercase ? (
                <>
                  <SVGIcon src={Icons.Check} width={20} height={20} className="admin-change-password__content-require-item--icon" />
                  <p>At least 1 Uppercase Letter</p>
                </>
              ) : (
                <p className="text-danger">At least 1 Uppercase Letter</p>
              )}
            </div>
            <div className="admin-change-password__content-require-item">
              {validations.number ? (
                <>
                  <SVGIcon src={Icons.Check} width={20} height={20} className="admin-change-password__content-require-item--icon" />
                  <p>At least 1 Number</p>
                </>
              ) : (
                <p className="text-danger">At least 1 Number</p>
              )}
            </div>
          </div>
        </div>
        <div className="booking-tour__contact w-100">
          <div className="booking-tour__contact-block w-100">
            <label htmlFor="contact-name">New Password</label>
            <input
              type={isPasswordShow ? "text" : "password"}
              name="contact-name"
              id="contact-name"
              placeholder="Enter your current password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                handleValidation(e.target.value);

              }}
            />
            <div onClick={handlePasswordShow} className="booking-tour__contact-icon">
              <SVGIcon src={isPasswordShow ? Icons.EyeSlash : Icons.Eye} width={20} height={20} />
            </div>
          </div>
          <div className="booking-tour__contact-block w-100">
            <label htmlFor="contact-name">Confirm new password</label>
            <input
              type={isConfirmPasswordShow ? 'text' : 'password'}
              name="contact-name"
              id="contact-name"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <div onClick={handleConfirmPasswordShow} className="booking-tour__contact-icon">
              <SVGIcon src={isConfirmPasswordShow ? Icons.EyeSlash : Icons.Eye} width={20} height={20} />
            </div>
          </div>
        </div>
      </div>
      <div className="admin-change-password__content-bottom">
        {/* <Link href="/business/hotel/account/success" type="button" className="btn btn-lg btn-password btn-success">Save</Link> */}
        <button type="submit" className="btn btn-lg btn-password btn-success" data-bs-toggle="modal" data-bs-target="#success-modal">Save</button>
      </div>
    </form >
  )
}

const SuccessModal = () => {
  const modalRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={modalRef} className="modal login-modal create-account-modal fade" id="success-modal" aria-hidden="true" tabIndex={-1}>
      <div className="modal-dialog modal-md">
        <div className="modal-content">
          <div className="modal-header">
            <div className="flex-grow-1 text-center text-neutral-primary fs-lg fw-bold">
            </div>
          </div>
          <div className="modal-body">
            {/* Sign in success modal */}
            <div className="login-modal__success" style={{ padding: "0 !Important" }}>
              <div className="login-modal__success-icon">
                <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
              </div>
              <div>
                <h3 className="login-modal__title">Change Password Succesfully</h3>
                <div className="login-modal__subtitle">You’re successfully change your password, You can use them when you login</div>
              </div>
              <div className="align-self-stretch d-flex flex-column align-items-stretch">
                <button type="button" data-bs-dismiss="modal" className="btn btn-success">Okay !</button>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChangePassword() {
  return (
    <Layout>
      <InnerLayout>
        <div className="container-menusettings container">
          <div className="admin-settings__wrapper">
            <SidebarSettings />
            <ContentChangePassword />
            <SuccessModal />
          </div>
        </div>
      </InnerLayout>
    </Layout>
  )
}

import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import Link from "next/link"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import { useRef, useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"

import { Images } from "@/types/enums"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { callAPI } from "@/lib/axiosHelper"

export default function AccountSettings() {
  const [showNotificationSetting, setShowNotificationSetting] = useState<boolean>(true)
  const [showEmailSetting, setShowEmailSetting] = useState<boolean>(false)
  return (
    <Layout>
      <AdminLayout>
        <div className="container">
          <AdminCustomerDetailContent />
          <ContentChangePassword/>
        </div>        
      </AdminLayout>
    </Layout>
  )
}

const NotificationSettingContent = () => {
  return(
    <div className="admin-settings__detail-content">
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="messageNotification" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Messages Notification</p>
          <p className="admin-settings__detail-content__notif-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
        </label>
        <div className="admin-settings__detail-content__notif-toggle">
          <input type="checkbox" name="messageNotification" id="messageNotification" checked={true} />
        </div>
      </div>
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="bookingActivity" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Booking Activity</p>
          <p className="admin-settings__detail-content__notif-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
        </label>
        <div className="admin-settings__detail-content__notif-toggle">
          <input type="checkbox" name="bookingActivity" id="bookingActivity" />
        </div>
      </div>
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="customerActivity" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Customer Activity</p>
          <p className="admin-settings__detail-content__notif-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
        </label>
        <div className="admin-settings__detail-content__notif-toggle">
          <input type="checkbox" name="customerActivity" id="customerActivity" />
        </div>
      </div>
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="partnerActivity" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Partner Activity</p>
          <p className="admin-settings__detail-content__notif-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
        </label>
        <div className="admin-settings__detail-content__notif-toggle">
          <input type="checkbox" name="partnerActivity" id="partnerActivity" />
        </div>
      </div>
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="blogActivity" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Blog Activity</p>
          <p className="admin-settings__detail-content__notif-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
        </label>
        <div className="admin-settings__detail-content__notif-toggle">
          <input type="checkbox" name="blogActivity" id="blogActivity" checked={true} />
        </div>
      </div>
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="allowSound" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Allow Sound</p>
          <p className="admin-settings__detail-content__notif-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
        </label>
        <div className="admin-settings__detail-content__notif-toggle">
          <input type="checkbox" name="allowSound" id="allowSound" />
        </div>
      </div>
    </div>
  )
}
const EmailSettingContent = () => {
  return(
    <div className="admin-settings__detail-content">
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="languageSetting" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Language</p>          
        </label>
        <select className="admin-settings__detail-content__notif-select" name="languageSetting" id="languageSetting">
          <option value="ENG">English</option>
          <option value="ARB">Arabic</option>
          <option value="IND">Indonesian</option>
        </select>        
      </div>
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="wordSetting" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Maximum page size</p>
          <p className="admin-settings__detail-content__notif-desc">Displays the number of words can be full page</p>
        </label>
        <select className="admin-settings__detail-content__notif-select" name="wordSetting" id="wordSetting">
          <option value="ENG">50 Word</option>
          <option value="ARB">75 Word</option>
          <option value="IND">100 Word</option>
        </select>        
      </div>
      <div className="admin-settings__detail-content__notif">
        <label htmlFor="wordSetting" className="admin-settings__detail-content__notif-text">
          <p className="admin-settings__detail-content__notif-name">Undo Send</p>
          <p className="admin-settings__detail-content__notif-desc">Adjust cancellation period </p>
        </label>
        <select className="admin-settings__detail-content__notif-select" name="wordSetting" id="wordSetting">
          <option value="ENG">5 Second</option>
          <option value="ARB">10 Second</option>
          <option value="IND">15 Second</option>
        </select>        
      </div>
      <div className="admin-settings__detail-content__email-signature">
        <div className="admin-settings__detail-content__email-signature__text">
          <p className="admin-settings__detail-content__email-signature__title">Signature</p>
          <p className="admin-settings__detail-content__email-signature__desc">(appended at the end of all outgoing messages)</p>
        </div>
        <div className="admin-settings__detail-content__email-signature__list">
          <div className="admin-settings__detail-content__email-signature__item selected">
            <p className="admin-settings__detail-content__email-signature__item-name">Default</p>
            <Link href="#"><SVGIcon className="admin-settings__detail-content__email-signature__item-icon" src={Icons.Pencil} width={16} height={16} /></Link>
            <Link href="#"><SVGIcon className="admin-settings__detail-content__email-signature__item-icon" src={Icons.Lock} width={16} height={16} /></Link>
          </div>
          <div className="admin-settings__detail-content__email-signature__item">
            <p className="admin-settings__detail-content__email-signature__item-name">My Mind</p>
            <Link href="#"><SVGIcon className="admin-settings__detail-content__email-signature__item-icon" src={Icons.Pencil} width={16} height={16} /></Link>
            <Link href="#"><SVGIcon className="admin-settings__detail-content__email-signature__item-icon" src={Icons.Trash} width={16} height={16} /></Link>
          </div>
          <div className="admin-settings__detail-content__email-signature__item">
            <p className="admin-settings__detail-content__email-signature__item-name">My Mind</p>
            <Link href="#"><SVGIcon className="admin-settings__detail-content__email-signature__item-icon" src={Icons.Pencil} width={16} height={16} /></Link>
            <Link href="#"><SVGIcon className="admin-settings__detail-content__email-signature__item-icon" src={Icons.Trash} width={16} height={16} /></Link>
          </div>
          <button type="button" className="admin-settings__detail-content__email-signature__list-button">
            <SVGIcon src={Icons.Plus} width={16} height={16} />
            <p>Add New</p>
          </button>
        </div>
        <div className="admin-settings__detail-content__email-signature__divider"></div>
        <div className="admin-settings__detail-content__email-signature__reason">
          <textarea name="emailReason" id="emailReason" placeholder="Give a reason"></textarea>
        </div>
      </div>
    </div>
  )
}

const AdminCustomerDetailContent = () => {  
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)

  return(
    <div className="admin-settings__account-content">
      <div className="admin-settings__account-content__header">
        <div className="admin-settings__account-content__header-text">
          <h4>Go for Umrah</h4>
          <div className="admin-settings__account-content__header-chips">Administrator</div>                    
        </div>        
        
      </div>
        
      <div className="admin-settings__account-profile">
        <div className="admin-settings__account-profile__content">
          <div>
            <p className="admin-settings__account-profile__content-label">Email</p>
            <p className="admin-settings__account-profile__content-desc">Admin@Goforumrah.com</p>
          </div>
          <div>
            <p className="admin-settings__account-profile__content-label">Username</p>
            <p className="admin-settings__account-profile__content-desc">Silikon</p>
          </div>                    

        </div>
      </div>

    </div>
  )
}

const ContentChangePassword = () => {
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false
  })

  const router = useRouter()
  const { data: session, status } = useSession()
  const user_id = (status === 'authenticated' || session) ? Number(session.user.id) : null;
  


  const handlePasswordShow = () => {
    setIsPasswordShow(!isPasswordShow)
  }
  const handleConfirmPasswordShow = () => {
    setIsConfirmPasswordShow(!isConfirmPasswordShow)
  }
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

    handleValidation(newPassword)
    
    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (Object.values(validations).every(Boolean)) {
      const {ok, error} = await callAPI(`/admin/store`, 'POST', {"id_admin": user_id, "password": newPassword}, true)

      if (ok) {
        router.push('/admin/account-setting')
        setNewPassword('')
        setConfirmNewPassword('')
        alert('Success')
      }
      if (error) {
        console.log(error)
      }
      return
    }
  }

  return (
    <div className="admin-settings__account-content" style={{ marginTop:'12px' }}>
      <h5 style={{ marginBottom: '24px' }}>
        Change Password
      </h5>
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
                handleValidation(e.target.value)
              }}
            />
            <div onClick={handlePasswordShow} className="booking-tour__contact-icon">
              <SVGIcon src={isPasswordShow ? Icons.Eye : Icons.EyeSlash} width={20} height={20} />
            </div>
          </div>
          
          <div className="booking-tour__contact-block w-100">
            <label htmlFor="contact-name">Confirm New Password</label>
            <input
              type={isConfirmPasswordShow ? "text" : "password"}
              name="contact-name"
              id="contact-name"
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => {
                setConfirmNewPassword(e.target.value)
              }}
            />
            <div onClick={handleConfirmPasswordShow} className="booking-tour__contact-icon">
              <SVGIcon src={isConfirmPasswordShow ? Icons.Eye : Icons.EyeSlash} width={20} height={20} />
            </div>
          </div>
  
        </div>
      </div>
      <div className="admin-change-password__content-bottom">
        <button type="button" onClick={handleSubmit} className="btn btn-lg btn-password btn-success" style={{ marginTop: '24px' }}>Save</button>
      </div>
    </div >
  )
}

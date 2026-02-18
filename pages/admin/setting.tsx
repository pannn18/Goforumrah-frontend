import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import Link from "next/link"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"

import { Images } from "@/types/enums"
import { BlurPlaceholderImage } from "@/components/elements/images"

export default function AccountSettings() {
  const [showNotificationSetting, setShowNotificationSetting] = useState<boolean>(true)
  const [showEmailSetting, setShowEmailSetting] = useState<boolean>(false)
  return (
    <Layout>
      <AdminLayout pageTitle="Settings">
        <div className="container">
          <div className="admin-settings__wrapper">
            <div className="admin-settings__menu">      
              <div className="admin-settings__menu-list">        
                <Link href="#" className={`admin-settings__menu-item ${showNotificationSetting ? 'active' : '' }`} onClick={() => {setShowNotificationSetting(true); setShowEmailSetting(false);}}>
                  <SVGIcon className="admin-settings__menu-item--icon" src={Icons.Bell} width={20} height={20} />
                  <p>Notification settings</p>          
                </Link>
                <Link href="#" className={`admin-settings__menu-item ${showEmailSetting ? 'active' : '' }`} onClick={() => {setShowEmailSetting(true); setShowNotificationSetting(false);}}>
                  <SVGIcon className="admin-settings__menu-item--icon" src={Icons.Mail} width={20} height={20} />
                  <p>Email Settings</p>          
                </Link>        
                <Link href="#" className="admin-settings__menu-item">
                  <SVGIcon className="admin-settings__menu-item--icon" src={Icons.Logout} width={20} height={20} />
                  <p>Logout</p>          
                </Link>        
              </div>
            </div>
            {showNotificationSetting &&
              <NotificationSettingContent/>
            }
            {showEmailSetting &&
              // <EmailSettingContent/>
              <EmailSettingContent />
            }
          </div>
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
          <div className="admin-settings__account-content__header-row">
            <h4>Go for Umrah</h4>
            <div className="admin-settings__account-content__header-chips">Administrator</div>
          </div>
          {/* <div className="admin-settings__account-content__header-row">
            <p>User ID : #012</p>            
          </div>           */}
        </div>        
        <Link href="/admin/partner/hotel/edit" className="btn btn-sm btn-outline-success" style={{marginLeft: 'auto'}}>
          Edit
          <SVGIcon src={Icons.Pencil} width={20} height={20} className="" />                
        </Link>
        {/* <div className="custom-dropdown">
          <div onClick={() => setShowFilterDropdown(true)} className="custom-dropdown-toggle" style={{ border: 'none' }}>
            <SVGIcon src={Icons.More} width={20} height={20} className="" />                
          </div>
          <DropdownMenu show={showFilterDropdown} setShow={setShowFilterDropdown} className="admin-settings__header-dropdown-menu" style={{ marginTop: 8, marginLeft: -80, width: 180 }}>                    
            <div className="custom-dropdown-menu__options">
              <Link href="/admin/customer-details" className="admin-settings__account-content__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">                        
                <SVGIcon src={Icons.Pencil} width={20} height={20} className="" />  
                Edit detail
              </Link>
              <Link href="#" className="admin-settings__account-content__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">                        
                <SVGIcon src={Icons.Block} width={20} height={20} className="" />  
                Block
              </Link>                      
              <Link href="#" className="admin-settings__account-content__dropdown custom-dropdown-menu__option custom-dropdown-menu__option--readonly">                        
                <SVGIcon src={Icons.Trash} width={20} height={20} className="" />  
                Delete
              </Link>                      
            </div>
          </DropdownMenu>
        </div> */}
      </div>
      {/* <div className="admin-settings__account-content__divider"></div> */}
      <div className="admin-settings__account-profile">
      <BlurPlaceholderImage className="admin-settings__account-profile__picture" alt="profilePhoto" src={Images.Placeholder} width={180} height={180} />
        <div className="admin-settings__account-profile__content">
          <div>
            <p className="admin-settings__account-profile__content-label">Firstname</p>
            <p className="admin-settings__account-profile__content-desc">Devon</p>
          </div>
          <div>
            <p className="admin-settings__account-profile__content-label">Lastname</p>
            <p className="admin-settings__account-profile__content-desc">Lane</p>
          </div>                    
          <div>
            <p className="admin-settings__account-profile__content-label">Email</p>
            <p className="admin-settings__account-profile__content-desc">Admin@Goforumrah.com</p>
          </div>
          <div>
            <p className="admin-settings__account-profile__content-label">Phone Number</p>
            <p className="admin-settings__account-profile__content-desc">+966 11123 4567</p>
          </div>
          <div>
            <p className="admin-settings__account-profile__content-label">Email</p>
            <p className="admin-settings__account-profile__content-desc">Admin@Goforumrah.com</p>
          </div>
          <div>
            <p className="admin-settings__account-profile__content-label">Phone Number</p>
            <p className="admin-settings__account-profile__content-desc">+966 11123 4567</p>
          </div>          
        </div>
      </div>
    </div>
  )
}
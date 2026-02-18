import React, { useState } from 'react'
import Link from 'next/link';
import logoText from '@/assets/images/logo_text.svg';
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import Image from 'next/image';
import { Icons, Services } from '@/types/enums';
import ServiceTabs from '@/components/serviceTabs';
import DropdownMenu from '@/components/elements/dropdownMenu';
import SVGIcon from '@/components/elements/icons';
import { useRouter } from 'next/router';
import CreateAccountModal from '@/components/modals/createAccount';
import LoginModal from '@/components/modals/login';
import { signOut, useSession } from 'next-auth/react';

interface IProps {
  children?: React.ReactNode
  selectedServiceTab?: Services
  showCurrency?: Boolean
  showHelp?: Boolean
  showSearch?: Boolean
  showNotification?: Boolean
  hideAuthButtons?: Boolean
  loggedIn?: Boolean
  lightMode?: Boolean
}


const Navbar = (props: IProps) => {
  const router = useRouter()
  const { data, status } = useSession()
  const isAuthenticated = status !== 'loading' && status === 'authenticated'
  const isNotAuthenticated = status !== 'loading' && status === 'unauthenticated'
  const { selectedServiceTab, showCurrency, showHelp, showSearch, showNotification, hideAuthButtons, loggedIn, lightMode } = props
  // const [loggedIn, setLoggedIn] = useState(false)
  const [showRatingDropdown, setShowRatingDropdown] = useState<boolean>(false)

  return (
    <nav className={`navbar navbar-expand-lg ${lightMode ? 'navbar--light' : ''}`}>
      <div className="container container--navbar">
        <Link className="navbar-brand" href="/">
          {lightMode && (
            <Image src={logoTextDark} alt="GoForUmrah" height={26} />
          )}
          {!lightMode && (
            <Image src={logoText} alt="GoForUmrah" height={26} />
          )}
        </Link>

        {showSearch && (
          <div className="navbar-services">
            <ServiceTabs selected={selectedServiceTab} onChange={(selected) => router.push('/search/' + selected)} />
          </div>
        )}
        {selectedServiceTab && (
          <div className="navbar-services">
            <ServiceTabs selected={selectedServiceTab} onChange={(selected) => router.push('/search/' + selected)} />
          </div>
        )}

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="ms-auto d-flex gap-5 align-items-center">
            {(showCurrency && isAuthenticated) && (
              <>
                <div className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`}>
                  <div>USD</div>
                </div>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
              </>
            )}

            <div className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`}>
              <SVGIcon src={Icons.Globe} height={24} width={24} />
              <div>En</div>
            </div>

            {(showNotification && isNotAuthenticated) && (
              <>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
                <div className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`}>
                  <SVGIcon src={Icons.Bell} height={24} width={24} />
                </div>
              </>
            )}
            {(showHelp && isNotAuthenticated) && (
              <>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
                <Link href={'#'} className="btn btn-sm btn-outline-success text-white">Help</Link>
              </>
            )}

            {isNotAuthenticated && (
              <>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
                <button type="button" className="btn btn-sm btn-outline-success text-white" data-bs-toggle="modal" data-bs-target="#login-modal">Login</button>
                <button type="button" className="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#create-account-modal">Register</button>
              </>
            )}

            {isAuthenticated && (
              <>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
                <Link className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`} href="#">
                  <SVGIcon src={Icons.Heart} height={24} width={24} />
                </Link>
                <Link className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`} href="#">
                  <SVGIcon src={Icons.Bell} height={24} width={24} />
                </Link>
                <div className="custom-dropdown">
                  <div onClick={() => setShowRatingDropdown(true)} className="navbar__user">
                    <SVGIcon src={Icons.User} className="navbar__user-icon" height={20} width={20} />
                  </div>
                  <DropdownMenu show={showRatingDropdown} setShow={setShowRatingDropdown} className="navbar__dropdown" style={{ marginTop: 28, width: 396 }}>
                    <div className="navbar__dropdown-profile">
                      <div className="navbar__dropdown-avatar">
                        <SVGIcon src={Icons.User} width={20} height={20} />
                      </div>
                      <div className="navbar__dropdown-text">
                        <p className="navbar__dropdown-text-name">{data?.user.name}</p>
                        <p className="navbar__dropdown-text-email">{data?.user.email}</p>
                      </div>
                      <Link className="navbar__dropdown-edit" href="#">
                        <SVGIcon src={Icons.Pencil} height={20} width={20} />
                      </Link>
                    </div>
                    <Link href="/manage-booking" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.Box} width={20} height={20} />
                      <p>My booking</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <Link href="#" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.StarOutline} width={20} height={20} />
                      <p>My review</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <Link href="/manage-account" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.Setting} width={20} height={20} />
                      <p>Account setting</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <a type="button" onClick={() => signOut({ redirect: true, callbackUrl: '/' })} className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.Logout} width={20} height={20} />
                      <p>Logout</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </a>
                  </DropdownMenu>
                </div>
              </>
            )}

            <LoginModal />
            <CreateAccountModal />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
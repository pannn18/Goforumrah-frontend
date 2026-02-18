import React, { useState } from 'react'
import Link from 'next/link';
import logoText from '@/assets/images/logo_text.svg';
import Image from 'next/image';
import { Icons, Services } from '@/types/enums';
import ServiceTabs from '@/components/serviceTabs';
import DropdownMenu from '../elements/dropdownMenu';
import SVGIcon from '@/components/elements/icons';
import { useRouter } from 'next/router';
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


const AgentNavbar = (props: IProps) => {
  const router = useRouter()
  const { data, status } = useSession()
  const isAuthenticated = status !== 'loading' && status === 'authenticated'
  const isNotAuthenticated = status !== 'loading' && status === 'unauthenticated'
  const { selectedServiceTab, showCurrency, showHelp, showSearch, showNotification, hideAuthButtons, loggedIn, lightMode } = props
  // const [loggedIn, setLoggedIn] = useState(false)
  const [showRatingDropdown, setShowRatingDropdown] = useState<boolean>(false)
  const { pathname } = useRouter()

  return (
    <nav className={`navbar navbar-expand-lg`}>
      <div className="container container--navbar">
        <Link className="navbar-brand" href="/">
          <Image src={logoText} alt="GoForUmrah" height={26} />
        </Link>

        {selectedServiceTab && (
          <div className="navbar-services">
            <ServiceTabs selected={selectedServiceTab} onChange={(selected) => router.push('/search/' + selected)} />
          </div>
        )}

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          {/* <span className="navbar-toggler-icon" /> */}
          <SVGIcon src={Icons.Sort} height={24} width={24} />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="ms-auto d-flex gap-5 align-items-center">
            <Link href={'/agent'} className={`navbar__agent-link ${pathname === '/agent' ? 'active' : ''}`}>
              <span>Home</span>
              <div className="navbar__agent-link--dots"></div>
            </Link>
            <Link href={'/agent/trips'} className={`navbar__agent-link ${pathname === '/agent/trips' ? 'active' : ''}`}>
              <span>Trips</span>
              <div className="navbar__agent-link--dots"></div>
            </Link>
            <Link href={'/agent/report'} className={`navbar__agent-link ${pathname.startsWith('/agent/report') ? 'active' : ''}`}>
              <span>Report</span>
              <div className="navbar__agent-link--dots"></div>
            </Link>
            <Link href={'#'} className={`navbar__agent-link ${pathname === '/help' ? 'active' : ''}`}>
              <span>Help</span>
              <div className="navbar__agent-link--dots"></div>
            </Link>

            <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
            <div className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`}>
              <SVGIcon src={Icons.Bell} height={24} width={24} />
            </div>
            <div className="custom-dropdown">
              <div onClick={() => setShowRatingDropdown(true)} className="navbar__user">
                <SVGIcon src={Icons.User} className="navbar__user-icon" height={20} width={20} />
              </div>
              <DropdownMenu show={showRatingDropdown} setShow={setShowRatingDropdown} className="navbar__dropdown agent" style={{ marginTop: 32, width: 396 }}>
                <Link href="/user" className="navbar__dropdown-menu-link">
                  <SVGIcon src={Icons.Globe} width={20} height={20} />
                  <p>General</p>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                </Link>
                <Link href="/user/review" className="navbar__dropdown-menu-link">
                  <SVGIcon src={Icons.Bell} width={20} height={20} />
                  <p>Notification</p>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                </Link>
                <Link href="/agent/account-setting" className="navbar__dropdown-menu-link">
                  <SVGIcon src={Icons.Users} width={20} height={20} />
                  <p>Users</p>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                </Link>
                <a type="button" onClick={() => signOut({ redirect: true, callbackUrl: '/' })} className="navbar__dropdown-menu-link">
                  <SVGIcon src={Icons.Logout} width={20} height={20} />
                  <p>Logout</p>
                  <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                </a>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AgentNavbar
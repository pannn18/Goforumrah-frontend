import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import logoText from '@/assets/images/logo_text.svg';
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import Image from 'next/image';
import { Icons, Services } from '@/types/enums';
import DropdownMenu from '@/components/elements/dropdownMenu';
import SVGIcon from '@/components/elements/icons';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { callAPI } from '@/lib/axiosHelper';

interface IProps {
  children?: React.ReactNode
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
  const { asPath } = useRouter();


  const isAuthenticated = status !== 'loading' && status === 'authenticated' && data.user.role === 'admin-car'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && data.user.role === 'admin-car')

  const { showHelp, showSearch, showNotification, hideAuthButtons, loggedIn, lightMode } = props
  // const [loggedIn, setLoggedIn] = useState(false)
  const [showRatingDropdown, setShowRatingDropdown] = useState<boolean>(false)

  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        // Todo: get data personal info for account business car
        // const { data: profile } = isAuthenticated && await callAPI('/customer/personal/show', 'POST', { id_customer: data?.user.id }, true)
        // setProfile(profile)
      })()
    }
  }, [isAuthenticated])


  return (
    <nav className={`navbar navbar-expand-lg ${lightMode ? 'navbar--light' : ''}`}>
      <div className="container container--navbar">
        <Link className="navbar-brand" href={
          asPath.startsWith('/business/car')
            ? (
              '/business/car'
            ) : asPath.startsWith('/business/hotel') ? (
              '/business/hotel'
            ) : (
              '/'
            )}>
          {lightMode && (
            <Image src={logoTextDark} alt="GoForUmrah" height={26} />
          )}
          {!lightMode && (
            <Image src={logoText} alt="GoForUmrah" height={26} />
          )}
        </Link>


        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ flex: 'none' }}>
          <div className="ms-auto d-flex gap-5 align-items-center">

            {isAuthenticated &&
              <div className="admin-header__search">
                <input type="text" className="form-control" placeholder="Search" />
                <SVGIcon src={Icons.Search} width={20} height={20} />
              </div>
            }

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

            {(isAuthenticated && !hideAuthButtons) && (
              <>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
                <Link className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`} href="#">
                  <SVGIcon src={Icons.Bell} height={24} width={24} />
                </Link>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
                <div className="custom-dropdown">
                  <div onClick={() => setShowRatingDropdown(true)} className="navbar__user">
                    {profile?.profile_photo ? (
                      <img src={profile?.profile_photo} alt="Profile" className="navbar__user-avatar" />
                    ) : (
                      <SVGIcon src={Icons.User} className="navbar__user-icon" height={20} width={20} />
                    )}
                  </div>
                  <DropdownMenu show={showRatingDropdown} setShow={setShowRatingDropdown} className="navbar__dropdown" style={{ marginTop: 28, width: 396 }}>
                    <Link href="/business/car/profile/account" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.User} width={20} height={20} />
                      <p>Account setting</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <Link href="/business/car/profile/company" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.Info} width={20} height={20} />
                      <p>Company setting</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <Link href="/business/car/opening-times" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.CircleTime} width={20} height={20} />
                      <p>Opening times</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <a type="button" onClick={() => signOut({ redirect: true, callbackUrl: '/business/car/login' })} className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.Logout} width={20} height={20} />
                      <p>Logout</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </a>
                  </DropdownMenu>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
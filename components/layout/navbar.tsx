import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import logoText from '@/assets/images/logo_text.svg';
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import Image from 'next/image';
import { Icons, Services } from '@/types/enums';
import ServiceTabs from '@/components/serviceTabs';
import DropdownMenu from '../elements/dropdownMenu';
import SVGIcon from '@/components/elements/icons';
import { useRouter } from 'next/router';
import CreateAccountModal from '../modals/createAccount';
import LoginModal from '../modals/login';
import { signOut, useSession } from 'next-auth/react';
import AuthModal from '../modals/auth';
import useFetch from '@/hooks/useFetch';
import { callAPI } from '@/lib/axiosHelper';
import ChangeLanguageModal from '../modals/changeLanguage';
import CurrenciesModal from '../modals/currenciesModal';
import { loadGoogleTranslateScript } from '@/components/googleTranslateUtils'
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
  const { asPath } = useRouter();


  const isAuthenticated = status !== 'loading' && status === 'authenticated' && data.user.role === 'customer'
  const isNotAuthenticated = status !== 'loading' && !(status === 'authenticated' && data.user.role === 'customer')

  const { selectedServiceTab, showCurrency, showHelp, showSearch, showNotification, hideAuthButtons, loggedIn, lightMode } = props
  // const [loggedIn, setLoggedIn] = useState(false)
  const [showRatingDropdown, setShowRatingDropdown] = useState<boolean>(false)

  const [profile, setProfile] = useState<any>(null)

  const [currency, setCurrency] = useState({ code: '', symbol: '', rate: '' });

  const convertCurrency = (countryCode: string, countrySymbol: string, rate: string) => {
    setCurrency({ code: countryCode, symbol: countrySymbol, rate: rate });
    localStorage.setItem('currency', JSON.stringify({ code: countryCode, symbol: countrySymbol, rate: rate }));
  };


  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const { data: profile } = isAuthenticated && await callAPI('/customer/personal/show', 'POST', { id_customer: data?.user.id }, true)
        setProfile(profile)
      })()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (localStorage.getItem('currency') === null) {
      localStorage.setItem('currency', JSON.stringify({ code: 'USD', symbol: '$', rate: '1' }));
      setCurrency({ code: 'USD', symbol: '$', rate: '1' });
    } else {
      setCurrency(JSON.parse(localStorage.getItem('currency')));
    }

    loadGoogleTranslateScript()
  }, []);


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

        {showSearch && (
          <div className="navbar-services">
            <ServiceTabs selected={selectedServiceTab} onChange={(selected) => router.push('/search/' + selected)} />
          </div>
        )}
        {selectedServiceTab && (
          <div className="navbar-services navbar-services-tab" style={{ margin: 'auto' }}>
            <ServiceTabs selected={selectedServiceTab} onChange={(selected) => router.push('/search/' + selected)} />
          </div>
        )}

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <SVGIcon src={Icons.Sort} height={24} width={24} />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent" style={{ flex: 'none' }}>
          <div className="ms-auto d-flex gap-5 align-items-center">
            {(showCurrency && isAuthenticated) && (
              <>
                <div className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`}>
                  <div className="button text-dark" data-bs-toggle="modal" data-bs-target="#currencies-modal" id='currencies-button'>
                    <div className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`}   >

                      <div>{currency.code}</div>
                    </div>
                  </div>
                </div>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
              </>
            )}

            <div className="button text-dark" data-bs-toggle="modal" data-bs-target="#change-language-modal" id='change-language-button'>
              <div className={`navbar__selected-option ${lightMode ? 'navbar__selected-option--dark' : ''}`}   >
                <SVGIcon src={Icons.Globe} height={24} width={24} />
                <div>En</div>
              </div>
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

            {(isNotAuthenticated && !hideAuthButtons) && (
              <>
                <div className={`navbar__separator ${lightMode ? 'navbar__separator--dark' : ''}`}></div>
                <button type="button" className="btn btn-sm btn-outline-success text-white" data-bs-toggle="modal" data-bs-target="#auth-modal" id='auth-login-button'>Login</button>
                <button type="button" className="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#auth-modal">Register</button>
              </>
            )}

            {(isAuthenticated && !hideAuthButtons) && (
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
                    {profile?.profile_photo ? (
                      <img src={profile?.profile_photo} alt="Profile" className="navbar__user-avatar" />
                    ) : (
                      <SVGIcon src={Icons.User} className="navbar__user-icon" height={20} width={20} />
                    )}
                  </div>
                  <DropdownMenu show={showRatingDropdown} setShow={setShowRatingDropdown} className="navbar__dropdown" style={{ marginTop: 28, width: 396 }}>
                    <div className="navbar__dropdown-profile">
                      <div className="navbar__dropdown-avatar">
                        {profile?.profile_photo ? (
                          <img src={profile?.profile_photo} alt="Profile" className="navbar__dropdown-avatar__img" height={20} width={20} />
                        ) : (
                          <SVGIcon src={Icons.User} height={20} width={20} />
                        )}
                      </div>
                      <div className="navbar__dropdown-text">
                        <p className="navbar__dropdown-text-name">{profile?.fullname || ''}</p>
                        <p className="navbar__dropdown-text-email">{profile?.email || data?.user.email || ''}</p>
                      </div>
                      <Link className="navbar__dropdown-edit" href="/user/account/personal">
                        <SVGIcon src={Icons.Pencil} height={20} width={20} />
                      </Link>
                    </div>
                    <Link href="/user" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.Box} width={20} height={20} />
                      <p>My booking</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <Link href="/user/review" className="navbar__dropdown-menu-link">
                      <SVGIcon src={Icons.StarOutline} width={20} height={20} />
                      <p>My review</p>
                      <SVGIcon src={Icons.ArrowRight} width={16} height={16} className="navbar__dropdown-menu-link--arrow" />
                    </Link>
                    <Link href="/user/account" className="navbar__dropdown-menu-link">
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

            {(status !== 'loading' && status === 'authenticated' && data.user.role === 'admin-hotel' && asPath.startsWith('/business/hotel') && !['/business/hotel/login', '/business/hotel/signup', '/business/hotel/forgot-password'].filter((excluded) => asPath.startsWith(excluded)).length) && (
              <button onClick={() => signOut({ redirect: true, callbackUrl: '/business/hotel/login' })} type="button" className="btn btn-sm btn-outline-success text-white">Logout</button>
            )}

            <AuthModal />
            <ChangeLanguageModal />
            <CurrenciesModal currency={currency} convertCurrency={convertCurrency} />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
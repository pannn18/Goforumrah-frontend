import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import Navbar from "@/components/layout/navbar"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
import useFetch from "@/hooks/useFetch"
import { callAPI } from "@/lib/axiosHelper"
import LoadingOverlay from "@/components/loadingOverlay"

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


const ContentAccount = () => {
    const [fullCallingCode, setFullCallingCode] = useState('')
    const defaultPhoneCountry = 'GB';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [errorUsername, setErrorUsername] = useState('')
    const [errorEmail, setErrorEmail] = useState('')

    const router = useRouter()
    const { data: session, status } = useSession();
    const id_hotel_business = (status === 'authenticated' || session) ? Number(session.user.id) : null;

    const [accountData, setAccountData] = useState({
        'id_hotel_business': id_hotel_business,
        'firstname': '',
        'lastname': '',
        'username': '',
        'phone_country': '',
        'phone': '',
        'email': ''
    })


    useEffect(() => {
        if (!id_hotel_business) return

        const fetchAccountData = async () => {
            const { data, error, ok } = await callAPI(`/hotel-account-menu/account-setting/show`, 'POST', { 'id_hotel_business': id_hotel_business }, true);
            if (ok) {
                const userPhone = parsePhoneNumberFromString(data.phone)
                setFullCallingCode(`+${userPhone.countryCallingCode}`)

                setAccountData({
                    'id_hotel_business': id_hotel_business,
                    'firstname': data.firstname,
                    'lastname': data.lastname,
                    'username': data.username,
                    'phone_country': userPhone.country,
                    'phone': userPhone.nationalNumber,
                    'email': data.email
                })

                setLoading(false)
            }
            if (error) {
                console.log(error)
                setError(true)
            }
        }

        fetchAccountData()

    }, [id_hotel_business])


    const [validations, setValidations] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        phone_country: '',
        phone: '',
    });

    const validateInput = (fieldName, value) => {
        const validations = {
            firstname: {
                pattern: /^[a-zA-Z\s']{2,25}$/,
                errorMessage: "Only use letters and spaces, consisting of 2 to 25 characters"
            },
            lastname: {
                pattern: /^[a-zA-Z\s']{2,25}$/,
                errorMessage: "Only use letters and spaces, consisting of 2 to 25 characters"
            },
            username: {
                pattern: /^[a-zA-Z0-9]{4,12}$/,
                errorMessage: "Only use letters and numbers, consisting of 4 to 12 characters"
            },
            email: {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                errorMessage: "Invalid email format"
            }
        }

        const validation = validations[fieldName]
        if (validation) {
            if (value && !validation.pattern.test(value)) {
                return validation.errorMessage
            }
        }

        return ""
    }

    const handlePhoneCodeChange = (value) => {
        const countryCode = value;
        const callingCode = getCountryCallingCode(countryCode);
        const fullCallingCode = `+${callingCode}`;

        setFullCallingCode(fullCallingCode);
    }

    const handleChange = (fieldName, value) => {
        setAccountData(prevData => ({
            ...prevData,
            [fieldName]: value
        }))

        setValidations(prevValidations => ({
            ...prevValidations,
            [fieldName]: validateInput(fieldName, value)
        }));

        setErrorEmail('')
        setErrorUsername('')
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validations.firstname || validations.lastname || validations.username || validations.email) {
            alert("Incorrect input")
            return;
        }

        const phone = `${fullCallingCode}${accountData.phone}`

        const payload = {
            "id_hotel_business": accountData.id_hotel_business,
            "firstname": accountData.firstname,
            "lastname": accountData.lastname,
            "username": accountData.username,
            "phone": phone,
            "email": accountData.email
        }


        const { ok, error } = await callAPI(`/hotel-account-menu/account-setting/update`, 'POST', payload, true)
        if (ok) {
            alert("Success")
        }
        if (error) {
            console.log(error);
            if (error === 'Username is already used.') {
                setErrorUsername('Username is already used.')
            } else if (error === 'Email is already used.') {
                setErrorEmail('Email is already used.')
            }
        }

    }
    
    if (loading) {
        return <LoadingOverlay />
    }

    if (id_hotel_business) {
        return (
            <div className="admin-menu-settings__content">
                <div className="admin-account">
                    <form onSubmit={handleSubmit} className="admin-account__content-form col-xl-12 col-lg-8 col-md-8 col-sm-12">
                        <div className='goform-group row'>
                            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 admin-account__content-label'>
                                <label htmlFor="addressLine" className="form-label goform-label">First Name</label>
                                <input
                                    type="text"
                                    className="form-control goform-input goform-input--active"
                                    id="addressLine"
                                    aria-describedby="addressLineHelp"
                                    value={accountData.firstname}
                                    onChange={(e) => handleChange('firstname', e.target.value)}
                                />
                                {validations.firstname && <p className="text-danger mt-1">{validations.firstname}</p>}

                            </div>
                            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 admin-account__content-label'>
                                <label htmlFor="city" className="form-label goform-label">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control goform-input goform-input--active"
                                    id="city"
                                    aria-describedby="cityHelp"
                                    value={accountData.lastname}
                                    onChange={(e) => handleChange('lastname', e.target.value)}
                                />
                                {validations.lastname && <p className="text-danger mt-1">{validations.lastname}</p>}

                            </div>
                            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 admin-account__content-label'>
                                <label htmlFor="Passcode" className="form-label goform-label">Username</label>
                                <input
                                    type="text"
                                    className="form-control goform-input goform-input--active"
                                    id="passcode"
                                    aria-describedby="passcodeHelp"
                                    value={accountData.username}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                />
                                {validations.username && <p className="text-danger mt-1">{validations.username}</p>}
                                <p className="text-danger mt-1">{errorUsername}</p>
                            </div>


                            <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6 admin-account__content-label'>
                                <label htmlFor="Passcode" className="form-label goform-label">Phone Number</label>
                                <div className="PhoneInput form-control-wrapper">
                                    <div className={`form-control-field`}>
                                        <div className="PhoneInputCountry">
                                            <select
                                                value={accountData.phone_country}
                                                onChange={(e) => {
                                                    handleChange('phone_country', e.target.value)
                                                    handlePhoneCodeChange(e.target.value)
                                                }}
                                                name="phone-code">
                                                {getCountries().map((country) => (
                                                    <option key={country} value={country}>
                                                        {countryLabels[country]} +{getCountryCallingCode(country)}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className={`PhoneInputSelectedValue ${accountData.phone_country ? 'HasValue' : ''}`}>+{getCountryCallingCode((accountData.phone_country || defaultPhoneCountry) as CountryCode)}</div>
                                        </div>
                                        <input
                                            type="number"
                                            value={accountData.phone}
                                            onChange={(e) => { handleChange('phone', e.target.value) }}
                                            placeholder="(888) 888-8888"
                                        />
                                    </div>
                                </div>
                            </div>


                            <div className='col-xl-12 col-lg-5 col-md-5 col-sm-5'>
                                <label htmlFor="locationName" className="form-label goform-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control goform-input goform-input--active"
                                    id="locationName"
                                    aria-describedby="locationNameHelp"
                                    value={accountData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                                {validations.email && <p className="text-danger mt-1">{validations.email}</p>}
                                <p className="text-danger mt-1">{errorEmail}</p>
                            </div>
                        </div>
                        <div className="admin-change-password__content-bottom">
                            <button
                                // href="/business/hotel/account/success" 
                                type="submit"
                                className="btn btn-lg btn-password btn-success"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

const LinkedDevice = () => {

    return (
        <Layout>
            <InnerLayout>
                <div className="container container-menusettings">
                    <div className="admin-settings__wrapper">
                        <SidebarSettings />
                        <ContentAccount />
                    </div>
                </div>
            </InnerLayout>
        </Layout>
    )
}

export default LinkedDevice
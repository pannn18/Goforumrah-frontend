import Layout from "@/components/layout"
import InnerLayout from "@/components/business/hotel/layout"
import Navbar from "@/components/layout/navbar"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Images } from "@/types/enums"
import { getCountries, getCountryCallingCode } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import countryLabels from 'react-phone-number-input/locale/en.json'
import PhoneInput from 'react-phone-number-input/input'
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
    const [phoneCountry, setPhoneCountry] = useState<string>()
    const [phone, setPhone] = useState<string>()
    const [phoneCountry2, setPhoneCountry2] = useState<string>()
    const [alternative_phone, setAlternative_phone] = useState<string>()

    const router = useRouter()

    // Retrive data from API
    const [businessProperty, setBusinessProperty] = useState(null)
    const [businessPropertyLoading, setBusinessPropertyLoading] = useState(false)
    const [businessPropertyLoadingFirst, setBusinessPropertyLoadingFirst] = useState(true)
    const [businessPropertyOk, setBusinessPropertyOk] = useState(false)
    const [businessPropertyError, setBusinessPropertyError] = useState(false)

    const [businessContact, setBusinessContact] = useState(null)
    const [businessContactLoading, setBusinessContactLoading] = useState(false)
    const [businessContactLoadingFirst, setBusinessContactLoadingFirst] = useState(true)
    const [businessContactOk, setBusinessContactOk] = useState(false)
    const [businessContactError, setBusinessContactError] = useState(false)

    const [businessLocation, setBusinessLocation] = useState(null)
    const [businessLocationLoading, setBusinessLocationLoading] = useState(false)
    const [businessLocationLoadingFirst, setBusinessLocationLoadingFirst] = useState(true)
    const [businessLocationOk, setBusinessLocationOk] = useState(false)
    const [businessLocationError, setBusinessLocationError] = useState(false)

    const handlePhoneChange = (newPhone) => {
        setPhone(newPhone);

        // Update the formData with the new phone number
        setFormDataContact((prevData) => ({
            ...prevData,
            phone: newPhone,
        }));
        if (!newPhone) {
            errorMessage.contactPhoneValidation = 'Phone number is required'
        } else {
            errorMessage.contactPhoneValidation = ''
        }
    };

    const handleAlternativePhoneChange = (newValue) => {
        setAlternative_phone(newValue)

        setFormDataContact((prevData) => ({
            ...prevData,
            alternative_phone: newValue
        }))
    }

    const handleRadioChange = (e) => {
        const newValue = e.target.value
        setFormDataContact((prevData) => ({
            ...prevData,
            multiple_hotel: newValue,
        }));
    }

    const tabs = {
        'Property Profile': [
            {
                TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.',
                TextLeftTwo: 'For now we have the 4 best business services for you',
                TextFlight: 'We are partnering with more than 90 domestic & international airlines.',
                TextHotel: 'We have more than 2 millions domestic & international hotel partners.',
                TextCar: 'We have more than 175 partners across 90 different cities.',
                TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
            },
        ],
        'Contact': [
            {
                TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.',
                TextLeftTwo: 'For now we have the 4 best business services for you',
                TextFlight: 'We are partnering with more than 90 domestic & international airlines.',
                TextHotel: 'We have more than 2 millions domestic & international hotel partners.',
                TextCar: 'We have more than 175 partners across 90 different cities.',
                TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
            },
        ],
        'Location': [
            {
                TextLeftOne: 'We are an online travel startup located in Saudi Arabia that provides a reliable platform to accommodate all your travel needs with our best service.', TextLeftTwo: 'For now we have the 4 best business services for you', TextFlight: 'We are partnering with more than 90 domestic & international airlines.', TextHotel: 'We have more than 2 millions domestic & international hotel partners.', TextCar: 'We have more than 175 partners across 90 different cities.', TextTour: 'We have more than 30 tour packages that you can choose from and enjoy'
            },
        ]
    }

    const [image, setImage] = useState(null)
    const [errorLocation, setErrorLocation] = useState(false)
    const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])

    const { data: session, status } = useSession();
    // console.log("session on business : ", session);
    const [id_hotel_business, setIdHotel] = useState(session?.user?.id);

    useEffect(() => {
        if (id_hotel_business) return
        setIdHotel(session?.user?.id)
        setFormDataProperty({ ...formDataProperty, id_hotel_business: session?.user?.id })
        setFormDataContact({ ...formDataContact, id_hotel_business: session?.user?.id })
        setFormDataLocation({ ...formDataLocation, id_hotel_business: session?.user?.id })
    }, [session, session?.user?.id])

    // Form Property
    const [formDataProperty, setFormDataProperty] = useState({
        id_hotel_business: id_hotel_business,
        property_name: '',
        star_rating: '',
        description: '',
        profile_icon: ''
    })

    // Form Contact
    const [formDataContact, setFormDataContact] = useState({
        id_hotel_business: id_hotel_business,
        contact_name: '',
        phone: '',
        alternative_phone: '',
        multiple_hotel: 0
    })

    // Form Location
    const [formDataLocation, setFormDataLocation] = useState({
        id_hotel_business: id_hotel_business,
        street_address: '',
        street_address2: '',
        country: '',
        city: '',
        postcode: ''
    })

    const [errorMessage, setErrorMessage] = useState({
        propertyNameValidation: '',
        propertyDescValidation: '',
        contactNameValidation: '',
        contactPhoneValidation: '',
        locationStreetValidation: '',
        locationCityValidation: '',
        locationZipValidation: ''
    })

    const [errors, setErrors] = useState({});

    // Fetch Data Property
    useEffect(() => {
        if (businessProperty) return
        const fetchBusinessProperty = async () => {
            const { status, data, ok, error } = await callAPI('/hotel-account-menu/business-setting-property/show', 'POST', { 'id_hotel_business': id_hotel_business }, true);
            if (error) {
                setBusinessPropertyError(true)
            } else {
                setBusinessProperty(data)
                if (ok) {
                    const businessProperty = data

                    // console.log("Business Settings Property Show : ", businessProperty)

                    setFormDataProperty((prevData) => ({
                        id_hotel_business: id_hotel_business,
                        property_name: businessProperty.property_name,
                        star_rating: businessProperty.star_rating,
                        description: businessProperty.description,
                        profile_icon: businessProperty.profile_icon
                    }))
                    setImage(businessProperty.profile_icon)
                }
                setBusinessPropertyOk(ok)
                setBusinessPropertyLoadingFirst(false)
            }
        }
        fetchBusinessProperty()
    }, [id_hotel_business])

    // Fetch Data Contact
    useEffect(() => {
        if (businessContact) return
        const fetchBusinessContact = async () => {
            const { status, data, ok, error } = await callAPI('/hotel-account-menu/business-setting-contact/show', 'POST', { 'id_hotel_business': id_hotel_business }, true);
            if (error) {
                setBusinessContactError(true)
            } else {
                setBusinessContact(data)
                if (ok) {
                    const businessContact = data

                    setFormDataContact((prevData) => ({
                        id_hotel_business: id_hotel_business,
                        contact_name: businessContact.contact_name,
                        phone: businessContact.phone,
                        alternative_phone: businessContact.alternative_phone,
                        multiple_hotel: businessContact.multiple_hotel
                    }))

                    const phoneData = parsePhoneNumberFromString(businessContact.phone)
                    const phoneCountry = phoneData.country
                    setPhoneCountry(phoneCountry)

                    const phoneData2 = parsePhoneNumberFromString(businessContact.alternative_phone)
                    const phoneCountry2 = phoneData2.country
                    setPhoneCountry2(phoneCountry2)

                    setPhone(businessContact.phone)
                    setAlternative_phone(businessContact.alternative_phone)
                }
                setBusinessContactOk(ok)
                setBusinessContactLoadingFirst(false)
            }
        }
        fetchBusinessContact()
    }, [id_hotel_business])

    // Fetch Data Location
    useEffect(() => {
        if (businessLocation) return
        const fetchBusinessLocation = async () => {
            const { status, data, ok, error } = await callAPI('/hotel-account-menu/business-setting-location/show', 'POST', { 'id_hotel_business': id_hotel_business }, true);
            if (error) {
                setBusinessLocationError(true)
            } else {
                setBusinessLocation(data)
                if (ok) {
                    const businessLocation = data

                    setFormDataLocation((prevData) => ({
                        id_hotel_business: id_hotel_business,
                        street_address: businessLocation.street_address,
                        street_address2: businessLocation.street_address2,
                        country: businessLocation.country,
                        city: businessLocation.city,
                        postcode: businessLocation.postcode
                    }))
                }
                setBusinessLocationOk(ok)
                setBusinessLocationLoadingFirst(false)
            }
        }
        fetchBusinessLocation()
    }, [id_hotel_business])

    const defaultPhoneCountry = 'ID';

    const handleFileChange = (e) => {
        e.preventDefault()
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
                setFormDataProperty((prevState) => ({
                    ...prevState,
                    profile_icon: reader.result.toString(),
                }))
            };
            reader.readAsDataURL(file);
        }
    }

    const onSubmitProperty = async (e) => {
        e.preventDefault()

        setBusinessPropertyLoading(true)

        const formDataPropertyCopy = {
            ...formDataProperty
        }

        if (!errorMessage.propertyDescValidation && !errorMessage.propertyNameValidation) {
            const { ok, error } = await callAPI('/hotel-account-menu/business-setting-property/update', 'POST', formDataPropertyCopy, true)
            if (ok) {
                // console.log('Success')
                window.location.reload();
            }
            else {
                console.log(error)
            }
        }
        setBusinessPropertyLoading(false)
    }

    const onSubmitContact = async (e) => {
        e.preventDefault()

        setBusinessContactLoading(true)

        const formDataContactCopy = {
            ...formDataContact
        }

        if (!errorMessage.contactNameValidation && !errorMessage.contactPhoneValidation) {
            const { ok, error } = await callAPI('/hotel-account-menu/business-setting-contact/update', 'POST', formDataContactCopy, true)
            if (ok) {
                router.push(`/business/hotel/account/business`)
                // console.log('Success')
            }
            else {
                console.log(error)
            }
        }
        setBusinessContactLoading(false)
    }

    const onSubmitLocation = async (e) => {
        e.preventDefault()

        setBusinessLocationLoading(true)

        const formDataLocationCopy = {
            ...formDataLocation
        }

        if (!errorMessage.locationStreetValidation && !errorMessage.locationCityValidation && !errorMessage.locationZipValidation) {
            const { ok, error } = await callAPI('/hotel-account-menu/business-setting-location/update', 'POST', formDataLocationCopy, true)
            if (ok) {
                router.push(`/business/hotel/account/business`)
                // console.log('Success')
            }
            else {
                console.log(error)
            }
        }
        setBusinessLocationLoading(false)
    }
    
    if (businessPropertyLoadingFirst && businessContactLoadingFirst && businessLocationLoadingFirst) {
        return <LoadingOverlay />
    }

    if (businessPropertyOk && businessContactOk && businessLocationOk) {

        // console.log('Data : ', businessLocation);
        console.log('formDataLocation : ', formDataLocation);

        return (
            <div className="admin-menu-settings__content">
                <div className="admin-business__content-wrapper">
                    <div className="admin-business__content-header">
                        <div className="admin-business__content-header-split">
                            <div className="admin-business__content-header-tab-menu">
                                {Object.keys(tabs).map((tab, index) => (
                                    <button
                                        key={index}
                                        className={`btn admin-business__btn ${tab === selectedTab ? 'active' : ''}`}
                                        onClick={() => setSelectedTab(tab)}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="admin-business__content-tabs">
                        {selectedTab === 'Property Profile' && tabs[selectedTab].map((Property, index) => (
                            <div key={index} className="container container-business-settings">
                                <form onSubmit={onSubmitProperty}>
                                    <div className="admin-business__property">
                                        <div className="admin-business__property-content">
                                            <div className="admin-business__property-content-header">
                                                <label htmlFor="">Profile Image</label>
                                                <div className="admin-business__property-content-header-inner">
                                                    {image ? <img src={image} alt="Uploaded" className="admin-business__property-content-header-image" style={{ width: '104px', height: '104px' }} /> : <BlurPlaceholderImage className="admin-business__property-content-header-image" src={image} alt="Review Image" width={104} height={104} />}
                                                    <div className="admin-business__property-content-header-form">
                                                        <label htmlFor='profile_icon' className="admin-business__property-content-header-input">
                                                            <label htmlFor="profile_icon" className="admin-business__property-content-header-label">Upload</label>
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                id="profile_icon"
                                                                name="profile_icon"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                hidden={true}
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-business__property-form">
                                            <div className="admin-business__contact w-100">
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="contact-name">Property Name</label>
                                                    <input
                                                        type="text"
                                                        className="admin-business__contact-block-form"
                                                        name="property-name"
                                                        id="property-name"
                                                        placeholder="Enter your property name"
                                                        value={formDataProperty.property_name}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value

                                                            setFormDataProperty((prevData) => ({
                                                                ...prevData,
                                                                property_name: newValue,
                                                            }))

                                                            if (!newValue.trim()) {
                                                                errorMessage.propertyNameValidation = 'Property name is required'
                                                            } else {
                                                                errorMessage.propertyNameValidation = ''
                                                            }
                                                        }}
                                                    />
                                                    <div className="form-control-message form-control-message--error">
                                                        {errorMessage.propertyNameValidation}
                                                    </div>
                                                    <p className="admin-business__contact-block-info">Guests will see this name when they search for a place to stay.</p>
                                                </div>
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="star-rating">Star Rating</label>
                                                    <select
                                                        value={formDataProperty.star_rating}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataProperty((prevData) => ({
                                                                ...prevData,
                                                                star_rating: newValue,
                                                            }))
                                                        }}
                                                    >
                                                        <option value={1}>Star 1</option>
                                                        <option value={2}>Star 2</option>
                                                        <option value={3}>Star 3</option>
                                                        <option value={4}>Star 4</option>
                                                        <option value={5}>Star 5</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-business__property-form">
                                            <div className="admin-business__contact w-100">
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="description">Description</label>
                                                    <textarea
                                                        className="admin-business__contact-form"
                                                        rows={5}
                                                        value={formDataProperty.description}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataProperty((prevData) => ({
                                                                ...prevData,
                                                                description: newValue,
                                                            }))
                                                            if (!newValue.trim()) {
                                                                errorMessage.propertyDescValidation = 'Description is required'
                                                            } else {
                                                                errorMessage.propertyDescValidation = ''
                                                            }
                                                        }}
                                                    />
                                                    <div className="form-control-message form-control-message--error">
                                                        {errorMessage.propertyDescValidation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-change-password__content-bottom" style={{ width: "100%" }}>
                                            <button disabled={businessPropertyLoading} type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item w-25'>{businessPropertyLoading ? 'Please wait...' : 'Save'}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ))}
                        {selectedTab === 'Contact' && tabs[selectedTab].map((Contact, index) => (
                            <div key={index} className="container container-business-settings">
                                <form onSubmit={onSubmitContact}>
                                    <div className="admin-business__about">
                                        <div className="admin-business__about-content">
                                            <div className="admin-business__contact w-100">
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="contact-name">Contact Name</label>
                                                    <input
                                                        type="text"
                                                        className="admin-business__contact-block-form"
                                                        name="contact-name"
                                                        id="contact-name"
                                                        placeholder="Enter your Contact Name"
                                                        value={formDataContact.contact_name}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataContact((prevData) => ({
                                                                ...prevData,
                                                                contact_name: newValue,
                                                            }))
                                                            if (!newValue.trim()) {
                                                                errorMessage.contactNameValidation = 'Contact name is required'
                                                            } else {
                                                                errorMessage.contactNameValidation = ''
                                                            }
                                                        }}
                                                    />
                                                    <div className="form-control-message form-control-message--error">
                                                        {errorMessage.contactNameValidation}
                                                    </div>
                                                    <p className="admin-business__contact-block-info">Contact number (so we can assist with your registration when needed)</p>
                                                </div>
                                                <div className="admin-business__contact-block-radio--wrapper w-100">
                                                    <p>Do you own multiple hotels, or are you part of a property management company or group?</p>
                                                    <div className="admin-business__contact-block-radio">
                                                        <div className="search-tour-package__sidemenu-filter-item form-check">
                                                            <input type="radio" id="multiple_hotel_yes" name="multiple_hotel_yes" value={1} className="form-check-input" checked={formDataContact.multiple_hotel == 1} onChange={handleRadioChange} />
                                                            <label htmlFor="multiple_hotel_yes" className="form-check-label">Yes</label>
                                                        </div>
                                                        <div className="search-tour-package__sidemenu-filter-item form-check">
                                                            <input type="radio" id="multiple_hotel_no" name="multiple_hotel_no" value={0} className="form-check-input" checked={formDataContact.multiple_hotel == 0} onChange={handleRadioChange} />
                                                            <label htmlFor="multiple_hotel_no" className="form-check-label">No</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="admin-business__contact-block-phone--wrapper">
                                                <div className="admin-business__contact-block-phone w-100">
                                                    <label htmlFor="phone-number" className="form-label goform-label">Phone Number</label>
                                                    <div className="PhoneInput form-control-wrapper">
                                                        <div className={`form-control-field`}>
                                                            <div className="PhoneInputCountry">
                                                                <select
                                                                    value={phoneCountry}
                                                                    onChange={event => setPhoneCountry(event.target.value || null)}
                                                                    name="phone-code">
                                                                    {getCountries().map((country) => (
                                                                        <option key={country} value={country}>
                                                                            {countryLabels[country]} +{getCountryCallingCode(country)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <div className={`PhoneInputSelectedValue ${phoneCountry ? 'HasValue' : ''}`}>+{getCountryCallingCode((phoneCountry || defaultPhoneCountry) as CountryCode)}</div>
                                                            </div>
                                                            <PhoneInput
                                                                international={true}
                                                                country={(phoneCountry || defaultPhoneCountry) as CountryCode}
                                                                value={phone}
                                                                onChange={handlePhoneChange}
                                                                placeholder="(888) 888-8888"
                                                            />
                                                        </div>
                                                        <div className="form-control-message form-control-message--error">
                                                            {errorMessage.contactPhoneValidation}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="admin-business__contact-block-phone w-100">
                                                    <label htmlFor="Alternative-phone-number" className="form-label goform-label">Alternative Phone Number <span className="admin-business__contact-block-phone-optional">(optional)</span></label>
                                                    <div className="PhoneInput form-control-wrapper">
                                                        <div className={`form-control-field`}>
                                                            <div className="PhoneInputCountry">
                                                                <select
                                                                    value={phoneCountry2}
                                                                    onChange={event => setPhoneCountry2(event.target.value || null)}
                                                                    name="phone-code2">
                                                                    {getCountries().map((country2) => (
                                                                        <option key={country2} value={country2}>
                                                                            {countryLabels[country2]} +{getCountryCallingCode(country2)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <div className={`PhoneInputSelectedValue ${phoneCountry2 ? 'HasValue' : ''}`}>+{getCountryCallingCode((phoneCountry2 || defaultPhoneCountry) as CountryCode)}</div>
                                                            </div>
                                                            <PhoneInput
                                                                international={true}
                                                                country={(phoneCountry2 || defaultPhoneCountry) as CountryCode}
                                                                value={alternative_phone}
                                                                placeholder="(888) 888-8888"
                                                                onChange={handleAlternativePhoneChange}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-change-password__content-bottom" style={{ width: "100%" }}>
                                            <button disabled={businessContactLoading} type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item w-25 w-25'>{businessContactLoading ? 'Please wait...' : 'Save'}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ))}
                        {selectedTab === 'Location' && tabs[selectedTab].map((aboutUs, index) => (
                            <div key={index} className="container container-business-settings">
                                <form onSubmit={onSubmitLocation}>
                                    <div className="admin-business__about">
                                        <div className="admin-business__about-content">
                                            <div className="admin-business__contact w-100">
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="street_address">Street Address</label>
                                                    <input
                                                        type="text"
                                                        className="admin-business__contact-block-form"
                                                        name="street_address"
                                                        id="street_address"
                                                        placeholder="Enter street address"
                                                        value={formDataLocation.street_address}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataLocation((prevData) => ({
                                                                ...prevData,
                                                                street_address: newValue,
                                                            }))
                                                            if (!newValue.trim()) {
                                                                errorMessage.locationStreetValidation = 'Street address is required'
                                                            } else {
                                                                errorMessage.locationStreetValidation = ''
                                                            }
                                                        }}
                                                    />
                                                    <div className="form-control-message form-control-message--error">
                                                        {errorMessage.locationStreetValidation}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="admin-business__contact w-100">
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="street-address-2">Street Address 2</label>
                                                    <input
                                                        type="text"
                                                        className="admin-business__contact-block-form"
                                                        name="street-address-2"
                                                        id="street-address-2"
                                                        placeholder="Enter street address 2"
                                                        value={formDataLocation.street_address2}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataLocation((prevData) => ({
                                                                ...prevData,
                                                                street_address2: newValue,
                                                            }))
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="admin-business__contact w-100">
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="country">Country/Region</label>
                                                    <select
                                                        value={formDataLocation.country}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataLocation((prevData) => ({
                                                                ...prevData,
                                                                country: newValue,
                                                            }))
                                                        }}
                                                    >
                                                        {getCountries().map((country) => (
                                                            <option key={country} value={country}>
                                                                {countryLabels[country]}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="admin-business__contact w-100">
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="city">City</label>
                                                    <input
                                                        type="text"
                                                        className="admin-business__contact-block-form"
                                                        name="city"
                                                        id="city"
                                                        placeholder="E.g district 12"
                                                        value={formDataLocation.city}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataLocation((prevData) => ({
                                                                ...prevData,
                                                                city: newValue,
                                                            }))
                                                            if (!newValue.trim()) {
                                                                errorMessage.locationCityValidation = 'City is required'
                                                            } else {
                                                                errorMessage.locationCityValidation = ''
                                                            }
                                                        }}
                                                    />
                                                    <div className="form-control-message form-control-message--error">
                                                        {errorMessage.locationCityValidation}
                                                    </div>
                                                </div>
                                                <div className="admin-business__contact-block w-100">
                                                    <label htmlFor="zip-code">Zipcode</label>
                                                    <input
                                                        type="number"
                                                        className="admin-business__contact-block-form"
                                                        name="zip-code"
                                                        id="zip-code"
                                                        placeholder="XXXXXXXX"
                                                        value={formDataLocation.postcode}
                                                        onChange={(e) => {
                                                            const newValue = e.target.value
                                                            setFormDataLocation((prevData) => ({
                                                                ...prevData,
                                                                postcode: newValue,
                                                            }))
                                                            if (!newValue.trim()) {
                                                                errorMessage.locationZipValidation = 'Zipcode is required'
                                                            } else {
                                                                errorMessage.locationZipValidation = ''
                                                            }
                                                        }}
                                                    />
                                                    <div className="form-control-message form-control-message--error">
                                                        {errorMessage.locationZipValidation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="admin-change-password__content-bottom" style={{ width: "100%" }}>
                                            <button disabled={businessLocationLoading} type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item w-25'>{businessLocationLoading ? 'Please wait...' : 'Save'}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        )
    }
}

export default function LinkedDevice() {
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

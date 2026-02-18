import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import UserLayout from '@/components/user/layout'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Sidebar from '@/components/user/account/sidebar'
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { RFHDate, RFHInput, RFHSelect } from '@/components/forms/fields'
import PhoneInput, { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import countryLabels from 'react-phone-number-input/locale/en.json'
import moment from 'moment'
import LoadingOverlay from '@/components/loadingOverlay/index'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import emptyProfile from '@/assets/images/default_profile_64x64.png'


interface PersonalData {
  id_customer_personal: number
  id_customer: number
  title: string
  fullname: string
  email: string
  email_status: number
  phone: string
  nationality: string
  birth: string
  country: string
  gender: string
  address: string
  city: string
  postcode: string
  profile_photo: string
  soft_delete: number
  created_at: string
  updated_at: string
}

const fieldShapes = {
  title: yup.string().required('Title is required'),
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Wrong email format').required('Email address is required'),
  phone: yup.string().required('Phone number is required'),
  nationality: yup.string().required('Nationality is required'),
  birth: yup.date().required('Date of Birth is required'),
  country: yup.string().required('Country / region is required'),
  gender: yup.string().required('Gender is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postcode: yup.string().required('Zipcode is required'),
}
const schema = yup.object().shape(fieldShapes)

const defaultPhoneCountry = 'US'

const AccountPersonal = () => {
  const { data: session, status } = useSession()

  const [personalData, setPersonalData] = useState<PersonalData>()
  const [loading, setLoading] = useState<boolean>(false)

  const [phoneCountry, setPhoneCountry] = useState<string>()
  const [phone, setPhone] = useState<string>()
  const [birth, setBirth] = useState<Date>()
  const [profileImage, setProfileImage] = useState<any>(null)
  const [profileImageBase64, setProfileImageBase64] = useState<any>(null)
  const [error, setError] = useState<string>()
  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  const loadPersonalData = async () => {
    await Promise.all([
      new Promise(async (resolve, reject) => {
        try {
          const { ok, data, error } = await callAPI('/customer/personal/show', 'POST', { id_customer: session.user.id }, true)

          if (ok && data) {
            setPersonalData(data as PersonalData)
          }

          // TODO: Add an error exception when the data isn't retrieved or error occurred
          // console.error(error)

          resolve(true)
        } catch (error) {
          reject(error)
        }
      }),
    ])

    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)

    if (!(status === 'authenticated') || !session) return

    loadPersonalData()
  }, [status])

  const setFormData = () => {
    if (!personalData) return

    personalData.title && setValue('title', personalData.title)
    personalData.fullname && setValue('fullName', personalData.fullname)
    personalData.email && setValue('email', personalData.email)
    if (personalData.phone) {
      const phoneNumber = parsePhoneNumber(personalData.phone)
      if (phoneNumber) {
        setPhoneCountry(phoneNumber.country)
        setPhone(personalData.phone)
      }
    }
    personalData.nationality && setValue('nationality', personalData.nationality)
    personalData.birth && setBirth(moment(personalData.birth).toDate())
    personalData.country && setValue('country', personalData.country)
    personalData.gender && setValue('gender', personalData.gender)
    personalData.address && setValue('address', personalData.address)
    personalData.city && setValue('city', personalData.city)
    personalData.postcode && setValue('postcode', personalData.postcode)
    personalData.profile_photo && setProfileImage(personalData.profile_photo)
  }

  useEffect(() => {
    setFormData()
  }, [personalData])

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setProfileImage(reader.result as string)

          // Convert the image to base64
          const base64Image = `data:${file.type};base64,${reader.result?.toString().split(',')[1]}`;
          setProfileImageBase64(base64Image);
        }
        reader.readAsDataURL(file)
    }
  }

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onSubmit = async (values) => {
    console.log(profileImageBase64);
    setError('')

    clearErrors(['phone', 'birth'])
    if (!phone?.length) return setFieldError('phone', { message: 'Phone number is required', type: 'required' })
    if (!birth) return setFieldError('birth', { message: 'Date of Birth is required', type: 'required' })

    const { title, fullName: fullname, email, nationality, country, gender, address, city, postcode } = getValues()
    const payload = {
      id_customer: session.user.id,
      title,
      fullname,
      email,
      phone,
      nationality,
      birth: moment(birth).format('YYYY-MM-DD'),
      country,
      gender,
      address,
      city,
      postcode,
      profile_photo: profileImageBase64
    }

    setLoading(true)

    const { ok, status, error } = await callAPI('/customer/personal/update', 'POST', payload, true)

    if (ok) {
      // await loadPersonalData()
      // Reload the page upon successful submission
      window.location.reload();
    } else {
      setError(error || 'Unknown error')
    }

    setLoading(false)

    return
  }

  return (
    <Layout>
      <Navbar showCurrency={true} />
      <UserLayout hideSidebar={true} header={{ title: 'Account Settings', url: '/user/account' }}>
        <div className="search-hotel__wrapper" style={{ padding: 0 }}>
          <Sidebar activeMenu='personal' />
          {loading ? (
            <LoadingOverlay />
          ) : (
            <form className="search-hotel__content" onSubmit={handleSubmit(onSubmit, onSubmit)}>
              <div className="manage-account__card">
                <div className="manage-account__header">
                  <h5>Personal details</h5>
                  <p className="manage-account__card-header-desc">You can set your account details</p>
                </div>
                <div className="manage-account__form">
                  <div className="manage-account__form-row manage-account__form-row--profile">
                    <div className='manage-account__form-profile'>
                      <img src={profileImage ? profileImage : emptyProfile.src} alt={profileImage} />
                    </div>
                    <label htmlFor='change-profile' className="btn btn-sm btn-outline-success">
                      <SVGIcon src={Icons.Image} className="manage-account__form-profile--icon" width={24} height={24} />
                      <p>
                          Change Image
                      </p>
                    </label>
                    <input type="file" id='change-profile' hidden={true}
                        onChange={handleProfileChange}
                    />
                  </div>
                  <div className="manage-account__form-row">
                    <div className="manage-account__form-block">
                      <label htmlFor="personal-title">Title</label>
                      <RFHSelect
                        register={register('title')}
                        customClasses=''
                        onChange={(e) => setValue('title', e.target.value, { shouldValidate: true })}
                      >
                        <option value="" selected disabled>Your title</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                      </RFHSelect>
                    </div>
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-name">Full Name</label>
                      <RFHInput customClasses='' register={register('fullName')} type="text" placeholder="Enter your full name" error={errors.fullName?.message.toString()} />
                    </div>
                  </div>
                  <div className="manage-account__form-row">
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-email">Email Address</label>
                      <RFHInput customClasses='' register={register('email')} type="text" placeholder="Enter your email address" error={errors.email?.message.toString()} />
                    </div>
                    <div className="manage-account__form-end">
                      <button type="button" className="btn btn-lg btn-success">Verify</button>
                    </div>
                  </div>
                  <div className="manage-account__form-block">
                    <label htmlFor="personal-phone">Phone Number</label>
                    <div className="PhoneInput form-control-wrapper">
                      <div className={`form-control-field w-100 ${errors.phone ? 'form-control-field--error' : ''}`}>
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
                        <PhoneInput international={true} country={(phoneCountry || defaultPhoneCountry) as CountryCode} value={phone} onChange={setPhone} placeholder="(888) 888-8888" />
                      </div>
                      {errors.phone && (
                        <div className="form-control-message form-control-message--error">{errors.phone?.message.toString()}</div>
                      )}
                    </div>
                  </div>
                  <div className="manage-account__form-row">
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-nationality">Nationality</label>
                      <RFHSelect
                        register={register('nationality')}
                        customClasses='w-100'
                        onChange={(e) => setValue('nationality', e.target.value, { shouldValidate: true })}
                      >
                        <option value="asia">Asia</option>
                        <option value="europe">Europe</option>
                        <option value="rusia">Rusia</option>
                      </RFHSelect>
                    </div>
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-dateBirth">Date of Birth</label>
                      <RFHDate date={birth} onDateChange={(date) => setBirth(new Date(date))} customClasses='' register={register('birth')} type="text" placeholder="DD / MM / YY" error={errors.birth?.message.toString()} />
                    </div>
                  </div>
                  <div className="manage-account__form-row">
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-country">Country / region</label>
                      <RFHSelect
                        register={register('country')}
                        customClasses='w-100'
                        onChange={(e) => setValue('country', e.target.value, { shouldValidate: true })}
                      >
                        <option value="asia">Asia</option>
                        <option value="europe">Europe</option>
                        <option value="rusia">Rusia</option>
                      </RFHSelect>
                    </div>
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-gender">Gender</label>
                      <RFHSelect
                        register={register('gender')}
                        customClasses='w-100'
                        onChange={(e) => setValue('gender', e.target.value, { shouldValidate: true })}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </RFHSelect>
                    </div>
                  </div>
                  <div className="manage-account__form-block">
                    <label htmlFor="personal-address">Address</label>
                    <RFHInput customClasses='' register={register('address')} type="text" placeholder="Your street name and house / apartement number" error={errors.address?.message.toString()} />
                  </div>
                  <div className="manage-account__form-row">
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-address">Town / City</label>
                      <RFHInput customClasses='' register={register('city')} type="text" placeholder="Enter your Town/City" error={errors.city?.message.toString()} />
                    </div>
                    <div className="manage-account__form-block w-100">
                      <label htmlFor="personal-address">Zipcode</label>
                      <RFHInput customClasses='' register={register('postcode')} type="text" placeholder="Enter your zipcode" error={errors.postcode?.message.toString()} />
                    </div>
                  </div>
                </div>
                {error && (
                  <div className="d-flex flex-column align-items-stretch text-danger-main">
                    {error}
                  </div>
                )}
              </div>
              <div className="manage-account__card">
                <div className="manage-account__form-buttons">
                  <button type="button" onClick={() => setFormData()} className="btn btn-lg btn-outline-success">Cancel</button>
                  <button type="submit" className="btn btn-lg btn-success">Save</button>
                </div>
              </div>
            </form>
          )}
        </div>
      </UserLayout>
      <Footer />
    </Layout>
  )
}

export default AccountPersonal
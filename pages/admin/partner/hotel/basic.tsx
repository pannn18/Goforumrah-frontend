import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"

import { RFHInput, RFHSelect, RFHSelectAndInput, RFHTextarea } from '@/components/forms/fields'
import PhoneInput, { getCountries, getCountryCallingCode, parsePhoneNumber } from 'react-phone-number-input/input'
import { CountryCode } from 'libphonenumber-js/types'
import { format, isValidNumber } from 'libphonenumber-js';
import countryLabels from 'react-phone-number-input/locale/en.json'
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'


export default function PartnerHotelDetail()  {    
  return (
    <Layout>
      <AdminLayout pageTitle="Basic Info" enableBack={true}>
        <div className="admin-partner__detail">      
          <div className="container">    
            <PartnerHotelEditBasic />
          </div>
        </div>      
      </AdminLayout>
    </Layout>
  )
}

const PartnerHotelEditBasic = () => {
  const router = useRouter()
  const { id_hotel } = router.query;
  

  const defaultPhoneCountry = 'US'

  const [phoneCountry, setPhoneCountry] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>('');

  const [alternativePhoneCountry, setAlternativePhoneCountry] = useState<string | null>(null);
  const [alternativePhone, setAlternativePhone] = useState<string>('');

  const handlePhoneChange = (newPhone) => {
    setPhone(newPhone);

    // Update the formData with the new phone number
    setFormData((prevData) => ({
      ...prevData,
      phone: newPhone,
    }));
  };

  const handleAlternativePhoneChange = (newAlternativePhone) => {
    setAlternativePhone(newAlternativePhone);

    // Update the formData with the new alternative phone number
    setFormData((prevData) => ({
      ...prevData,
      alternative_phone: newAlternativePhone,
    }));
  };

  //Forms
  const [formData, setFormData] = useState({
    id_hotel: id_hotel,
    property_name: '',
    star_rating: 5,
    contact_name: '',
    phone: '',
    alternative_phone: '',
    multiple_hotel: '',
    street_address: '',
    street_address2: '',
    country: '',
    city: '',
    postcode: '',
  });
  
  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/hotel/store', 'POST', formData, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit detail booking store ", status, data, ok, error);
      // redirect to 
      router.push(`/admin/partner/hotel/${id_hotel}`);
    } else {
      console.log("fail to handle submit post api detail booking store   ", status, data, ok, error);
    }
  };

  // Effect to set id_hotel once it's available
  useEffect(() => {
    if (id_hotel !== undefined) {
      setFormData({ ...formData, id_hotel: id_hotel });
    }
  }, [id_hotel]);

  // Handle changes for all form fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData)
  };


  // Update the country field in formData when the select value changes
  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    setFormData({
      ...formData, // Spread the existing formData
      country: selectedCountry, // Update the country field with the selected value
    });
  };

  return (
    <form action="#" className="admin-partner__basic">
      {/* <div className="admin-partner__basic-headline">
          <h4 className="admin-partner__basic-headline">Basic Info</h4>
          <p className="admin-partner__basic-headline">Edit property's name, contact details, and address.</p>
      </div> */}
      <div className="admin-partner__basic-card">
        <p className="admin-partner__basic-card__title">Property Name</p>
        <div className="admin-partner__basic-card__field">
          <div className="admin-partner__basic-card__block">
            <label htmlFor="basic-property-name">Property Name</label>
            <input
              className="admin-partner__basic-card__input"
              type="text"
              name="property_name"
              id="property_name"
              value={formData.property_name}
              onChange={handleChange} // Use the handleChange function
            />
            <p className="admin-partner__basic-card__footer">
              Guests will see this name when they search for a place to stay.
            </p>
          </div>
          <div className="admin-partner__basic-card__block">
            <label htmlFor="basic-property-name">Star Rating</label>
            <select
              name="star_rating"
              id="star_rating"
              value={formData.star_rating}
              onChange={handleChange} // Use the handleChange function
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
      </div>
      <div className="admin-partner__basic-card">
        <p className="admin-partner__basic-card__title">Contact Details</p>
        <div className="admin-partner__basic-card__field">
          <div className="admin-partner__basic-card__block">
            <label htmlFor="basic-contact-name">Contact Name</label>
            <input className="admin-partner__basic-card__input" type="text" name="contact_name" id="contact_name"  placeholder="Your Contact Name..." value={formData.contact_name} onChange={handleChange} />
            <p className="admin-partner__basic-card__footer">Contact number (so we can assist with your registration when needed)</p>
          </div>
          <div className="admin-partner__basic-card__multiple">
            <p className="admin-partner__basic-card__multiple-label">
              Do you own multiple hotels, or are you part of a property management company or group?
            </p>
            <div className="admin-partner__basic-card__multiple-row">
              <div className="admin-partner__basic-card__multiple-radio form-check">
                <input
                  type="radio"
                  id="multiple_hotel_1"
                  name="multiple_hotel"
                  value="1"
                  className="form-check-input"
                  disabled={formData.id_hotel === null} // Disable the radio buttons if id_hotel is null
                  checked={formData.multiple_hotel === '1'}
                  onChange={(e) => setFormData({ ...formData, multiple_hotel: e.target.value })}
                />
                <label htmlFor="multiple_hotel_1">Yes</label>
              </div>
              <div className="admin-partner__basic-card__multiple-radio form-check">
                <input
                  type="radio"
                  id="multiple_hotel_0"
                  name="multiple_hotel"
                  value="0"
                  className="form-check-input"
                  disabled={formData.id_hotel === null} // Disable the radio buttons if id_hotel is null
                  checked={formData.multiple_hotel === '0'}
                  onChange={(e) => setFormData({ ...formData, multiple_hotel: e.target.value })}
                />
                <label htmlFor="multiple_hotel_0">No</label>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-partner__basic-card__field">
          <div className="admin-partner__basic-card__block">
            <label htmlFor="basic-contact-phone">Phone Number</label>
            <div className="PhoneInput form-control-wrapper">
              <div className={`form-control-field w-100`}>
                <div className="PhoneInputCountry">
                  <select
                    value={phoneCountry || ''}
                    onChange={(event) => setPhoneCountry(event.target.value || null)}
                    name="phone-code"
                  >
                    {getCountries().map((country) => (
                      <option key={country} value={country}>
                        {countryLabels[country]} +{getCountryCallingCode(country)}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`PhoneInputSelectedValue ${
                      phoneCountry ? 'HasValue' : ''
                    }`}
                  >
                    +{getCountryCallingCode((phoneCountry || defaultPhoneCountry) as CountryCode)}
                  </div>
                </div>
                <PhoneInput
                  international={true}
                  country={(phoneCountry || defaultPhoneCountry) as CountryCode}
                  value={phone}
                  onChange={handlePhoneChange} // Update the phone value and formData
                  placeholder="(888) 888-8888"
                />
              </div>
            </div>
          </div>
          <div className="admin-partner__basic-card__block">
            <label htmlFor="basic-contact-phone-2">Alternative Phone Number <span>(optional)</span></label>
            <div className="PhoneInput form-control-wrapper">
              <div className={`form-control-field w-100`}>
                <div className="PhoneInputCountry">
                  <select
                    value={alternativePhoneCountry || ''}
                    onChange={(event) => setAlternativePhoneCountry(event.target.value || null)}
                    name="phone-code"
                  >
                    {getCountries().map((country) => (
                      <option key={country} value={country}>
                        {countryLabels[country]} +{getCountryCallingCode(country)}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`PhoneInputSelectedValue ${
                      alternativePhoneCountry ? 'HasValue' : ''
                    }`}
                  >
                    +{getCountryCallingCode((alternativePhoneCountry || defaultPhoneCountry) as CountryCode)}
                  </div>
                </div>
                <PhoneInput
                  international={true}
                  country={(alternativePhoneCountry || defaultPhoneCountry) as CountryCode}
                  value={alternativePhone}
                  onChange={handleAlternativePhoneChange} // Update the alternativePhone value and formData
                  placeholder="(888) 888-8888"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="admin-partner__basic-card">
        <p className="admin-partner__basic-card__title">Property Location</p>
        <div className="admin-partner__basic-card__field">
          <div className="admin-partner__basic-card__block">
            <label htmlFor="street_address">Street Address</label>
            <input className="admin-partner__basic-card__input" type="text" name="street_address" id="street_address" placeholder="Enter street address" value={formData.street_address} onChange={handleChange} />
          </div>
          <div className="admin-partner__basic-card__block">
            <label htmlFor="street_address2">Street Address 2</label>
            <input className="admin-partner__basic-card__input" type="text" name="street_address2" id="street_address2" placeholder="Enter street address 2" value={formData.street_address2} onChange={handleChange} />
          </div>        
        </div>
        <div className="admin-partner__basic-card__block">
          <label htmlFor="basic-property-country">Country/Region</label>
          <RFHSelect onChange={handleCountryChange}>
            <option value={''}>---</option>
            {getCountries().map((country) => (
              <option key={country} value={country}>
                {countryLabels[country]}
              </option>
            ))}
          </RFHSelect>
        </div>
        <div className="admin-partner__basic-card__field">
          <div className="admin-partner__basic-card__block">
            <label htmlFor="city">City</label>
            <input className="admin-partner__basic-card__input" type="text" name="city" id="city" placeholder="E.g district 12" value={formData.city} onChange={handleChange} />
          </div>        
          <div className="admin-partner__basic-card__block">
            <label htmlFor="postcode">Zipcode</label>
            <input className="admin-partner__basic-card__input" type="number" name="postcode" id="postcode" placeholder="XXXXXXXX" value={formData.postcode} onChange={handleChange} />
          </div>        
        </div>
      </div>
      <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
          <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-outline-success">Cancel</Link>
          <button onClick={handleSubmit} className="btn btn-lg btn-success">Save</button>
      </div>
    </form>
  )
}
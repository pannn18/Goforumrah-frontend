import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import LoadingOverlay from "@/components/loadingOverlay"


export default function PartnerHotelDetail() {
  const router = useRouter()
  const { id_hotel } = router.query;

  //Retrive Data from API
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);

  ///SELECTED Languages
  // State to keep track of selected languages
  const [selectedLanguages, setSelectedLanguages] = useState([]);

  // Function to add a new language field
  const addLanguageField = () => {
    setSelectedLanguages([...selectedLanguages, ""]);
  };

  // Function to remove a language field
  const removeLanguageField = (index) => {
    if (selectedLanguages.length > 1) {
      const updatedLanguages = [...selectedLanguages];
      updatedLanguages.splice(index, 1);
      setSelectedLanguages(updatedLanguages);

      // Remove the corresponding language from formData
      setFormData((prevData) => ({
        ...prevData,
        languages: prevData.languages.filter((_, i) => i !== index),
      }));
    }
  };

  //Forms
  const [formData, setFormData] = useState({
    id_hotel_facilities: '',
    id_hotel: id_hotel,
    parking: 'no',
    breakfast: 'no',
    breakfast_price: 0,
    languages: selectedLanguages,
    facilities: [],
  });

  useEffect(() => {
    if (!id_hotel) return

    // Check if personalData or hotelData is already available
    if (hotelData) return;

    const fetchHotelData = async () => {
      const { status, data, ok, error } = await callAPI('/hotel-facilities/show', 'POST', { id_hotel: id_hotel }, true);

      if (error) {
        setHotelError(error);
        setHotelLoading(false);
      } else {
        setHotelData(data);
        if (Array.isArray(data) && data.length > 0) {
          const hotelData = data[0];
          const languagesArray = hotelData.languages ? hotelData.languages.split(',') : [];
          const facilitiesArray = hotelData.facilities ? hotelData.facilities.split(',') : [];

          setFormData((prevData) => ({
            ...prevData,
            id_hotel_facilities: hotelData.id_hotel_facilities,
            id_hotel: hotelData.id_hotel,
            parking: hotelData.parking,
            breakfast: hotelData.breakfast,
            breakfast_price: hotelData.breakfast_price,
            languages: languagesArray,
            facilities: facilitiesArray,
          }));
        }

        setHotelLoading(false);
      }
    };

    fetchHotelData();
  }, [id_hotel]);

  useEffect(() => {
    // When the component mounts, split the fetched languages and set them as initial selectedLanguages
    if (hotelData && hotelData.length > 0 && selectedLanguages.length === 0) {
      const fetchedLanguages = hotelData[0].languages.split(',');
      setSelectedLanguages(fetchedLanguages);
    }
  }, [hotelData, selectedLanguages]); // Remove the selectedLanguages from the dependency array to stop useEffect


  if (hotelLoading) {
    return <LoadingOverlay />;
  }

  if (hotelError) {
    return <div>Error Fetching Data</div>;
  }

  const languages = [
    "Afrikaans",
    "Albanian",
    "Arabic",
    "Armenian",
    "Azerbaijani",
    "Basque",
    "Belarusian",
    "Bengali",
    "Bosnian",
    "Bulgarian",
    "Catalan",
    "Chinese (Simplified)",
    "Chinese (Traditional)",
    "Croatian",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Estonian",
    "Finnish",
    "French",
    "Galician",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Haitian Creole",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Icelandic",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Kannada",
    "Kazakh",
    "Khmer",
    "Korean",
    "Lao",
    "Latvian",
    "Lithuanian",
    "Macedonian",
    "Malay",
    "Maltese",
    "Marathi",
    "Mongolian",
    "Nepali",
    "Norwegian",
    "Pashto",
    "Persian",
    "Polish",
    "Portuguese",
    "Romanian",
    "Russian",
    "Serbian",
    "Slovak",
    "Slovenian",
    "Spanish",
    "Swahili",
    "Swedish",
    "Tajik",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Ukrainian",
    "Urdu",
    "Uzbek",
    "Vietnamese",
    "Welsh",
    "Yiddish",
  ];

  const facilityNames = [
    "Free wifi",
    "Non smoking room",
    "Restaurant",
    "Airport Suffle",
    "Room service",
    "Family room",
    "Bar",
    "Spa",
    "Bathub",
    "24 - Front desk",
    "Hot tub/Jacuzzi",
    "Sauna",
    "Air conditioning",
    "Fitness center",
    "Waterpark",
    "Garden",
    "Terrace",
    "Rooftop"
  ];

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/hotel-facilities/store', 'POST', formData, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit detail booking store ", status, data, ok, error);
      // redirect to 
      router.push(`/admin/partner/hotel/${id_hotel}`);
    } else {
      console.log("fail to handle submit post api detail booking store   ", status, data, ok, error);
    }
  };

  console.log("formData : ", formData)
  console.log("data : ", hotelData)
  return (
    <Layout>
      <AdminLayout pageTitle="Facilities" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <form action="#" className="admin-partner__basic">
              {hotelData.slice(0, 1).map((hotelData, index) => (
                <div key={index}>
                  <div className="admin-partner__basic-card">
                    <div className="admin-partner__basic-card__field">
                      <div className="admin-partner__basic-card__block">
                        <label htmlFor="parking">Available Parking</label>
                        <select name="parking" id="parking" defaultValue={hotelData.parking === "yes" ? "yes" : "no"} onChange={(e) => { const value = e.target.value; setFormData((prevData) => ({ ...prevData, parking: value, })); }}>
                          <option value="yes">yes</option>
                          <option value="no">no</option>
                        </select>
                      </div>
                      <div className="admin-partner__basic-card__block">
                        <label htmlFor="breakfast">Available Breakfast</label>
                        <select name="breakfast" id="breakfast" defaultValue={hotelData.breakfast === "yes" ? "yes" : "no"} onChange={(e) => { const value = e.target.value; setFormData((prevData) => ({ ...prevData, breakfast: value, })); }}>
                          <option value="yes">yes</option>
                          <option value="no">no</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-partner__facilites-language">
                      <div className="admin-partner__basic-card__block">
                        <label>Languages</label>
                        {selectedLanguages.map((language, index) => (
                          <div key={index} className="language-field">
                            <select
                              name={`languages_${index}`}
                              value={language}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSelectedLanguages((prevLanguages) =>
                                  prevLanguages.map((prevLang, i) =>
                                    i === index ? value : prevLang
                                  )
                                );

                                // Update formData directly within the onChange handler
                                setFormData((prevData) => ({
                                  ...prevData,
                                  languages: prevData.languages.map((prevLang, i) =>
                                    i === index ? value : prevLang
                                  ),
                                }));
                              }}
                            >
                              <option value="" disabled>Select a language</option>
                              {languages.map((lang, langIndex) => (
                                <option key={langIndex} value={lang}>
                                  {lang}
                                </option>
                              ))}
                            </select>
                            <button
                              className="btn btn-outline-success"
                              onClick={() => removeLanguageField(index)}
                              disabled={selectedLanguages.length === 1}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-outline-success" onClick={(e) => {
                        e.preventDefault(); addLanguageField();
                        // Update formData when adding a language field
                        setFormData((prevData) => ({
                          ...prevData,
                          languages: [...prevData.languages, ""], // Add an empty language
                        }));
                      }} >
                        <SVGIcon src={Icons.Plus} width={20} height={20} />
                        Add another language
                      </button>
                    </div>
                  </div>
                  <div className="admin-partner__basic-card">
                    <p className="admin-partner__basic-card__title">Detail Facilities</p>
                    <div className="admin-partner__facilites-grid">
                      {facilityNames.map((name, index) => (
                        <HotelFacilityItem
                          key={index} name={name} inputId={`facilities-${name.toLowerCase().replace(/\s/g, '-')}`} inputValue={`facilities_${name}`} checked={hotelData.facilities.includes(name)} onChange={(isChecked, facilityName) => {
                            // Update the formData with the new value
                            if (isChecked) {
                              setFormData((prevData) => ({
                                ...prevData,
                                facilities: [...prevData.facilities, facilityName],
                              }));
                            } else {
                              setFormData((prevData) => ({
                                ...prevData,
                                facilities: prevData.facilities.filter((facility) => facility !== facilityName),
                              }));
                            }
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                <Link href="/admin/partner/hotel/edit" className="btn btn-lg btn-outline-success">Cancel</Link>
                <button onClick={handleSubmit} className="btn btn-lg btn-success">Save</button>
              </div>
            </form>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  )
}

interface HotelFacilityItemProps {
  name: string
  inputId: string
  inputValue: string
  checked?: boolean
  onChange?: (isChecked: boolean, name: string) => void
}

const HotelFacilityItem = (props: HotelFacilityItemProps) => {
  const { name, inputId, inputValue, checked, onChange } = props
  const [isChecked, setIsChecked] = useState(checked || false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setIsChecked(isChecked);
    // Call the onChange callback with the new checkbox value and name
    if (onChange) {
      onChange(isChecked, name);
    }
  };
  return (
    <label htmlFor={inputId} className="admin-partner__facilites-item">
      <SVGIcon src={Icons.Filter} width={20} height={20} />
      <p>{name}</p>
      <input type="checkbox" id={inputId} name={inputValue} value={name} className="form-check-input" checked={isChecked} onChange={handleCheckboxChange} />
    </label>
  )
}
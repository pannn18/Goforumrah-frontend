import Layout from "@/components/layout";
import React, { useState, useRef, useEffect } from "react";
import { callAPI } from "@/lib/axiosHelper";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ReactDOM from "react-dom";
import Navbar from '@/components/business/car/navbar'
import Link from "next/link";
import SVGIcon from "@/components/elements/icons";
import { Icons, Images, Services } from "@/types/enums";
import PhoneInput, {
  getCountries,
  getCountryCallingCode,
  parsePhoneNumber,
} from "react-phone-number-input/input";
import { CountryCode } from "libphonenumber-js/types";
import countryLabels from "react-phone-number-input/locale/en.json";
import ISO6391 from 'iso-639-1'

export default function CarCompany() {
  return (
    <Layout>
      <div className="business-profile">
        <Navbar
          showHelp={false}
          lightMode={true}
          showNotification={true}
          loggedIn={true}
        />
        <ProfileHeader />
        <div className="container">
          <CompanyForm />
          <CompanyDocument />
        </div>
      </div>
    </Layout>
  );
}

const ProfileHeader = () => {
  const router = useRouter();
  return (
    <section className="business-profile__header">
      <div className="container">
        <div className="business-profile__header-inner">
          <button
            onClick={() => router.back()}
            className="business-profile__header-back"
          >
            <SVGIcon src={Icons.ArrowLeft} height={24} width={24} />
            <h4>Back</h4>
          </button>
          <button
            type="submit"
            form="myForm"
            className="btn btn-sm btn-success"
          >
            Save
          </button>
        </div>
      </div>
    </section>
  );
};

const CompanyForm = () => {
  const tabs = {
    "Account Profile": "",
    Policies: "",
  };
  const [selectedTab, setSelectedTab] = useState<String>(Object.keys(tabs)[0]);
  const router = useRouter();
  const defaultPhoneCountry = "US";
  const [phoneCountry, setPhoneCountry] = useState<string>();
  const [phone, setPhone] = useState<string>();

  // Retrive data from API FOR COMPANY ACCOUNT
  const [businessAccount, setBusinessAccount] = useState(null);
  const [businessAccountLoading, setBusinessAccountLoading] = useState(false);
  const [businessAccountLoadingFirst, setBusinessAccountLoadingFirst] =
    useState(true);
  const [businessAccountOk, setBusinessAccountOk] = useState(false);
  const [businessAccountError, setBusinessAccountError] = useState(false);

  // Retrive data from API FOR POLICIES
  const [businessPolicies, setBusinessPolicies] = useState(null);
  const [businessPoliciesLoading, setBusinessPoliciesLoading] = useState(false);
  const [businessPoliciesLoadingFirst, setBusinessPoliciesLoadingFirst] =
    useState(true);
  const [businessPoliciesOk, setBusinessPoliciesOk] = useState(false);
  const [businessPoliciesError, setBusinessPoliciesError] = useState(false);

  const { data: session, status } = useSession();
  console.log("session on business : ", session);
  const [id_car_business, setIdCar] = useState(session?.user?.id);

  useEffect(() => {
    if (id_car_business) return;
    setIdCar(session?.user?.id);
    setFormDataAccount({
      ...formDataAccount,
      id_car_business: session?.user?.id,
    });
  }, [session, session?.user?.id]);

  const [formDataAccount, setFormDataAccount] = useState({
    id_car_business: id_car_business,
    company_name: "",
    trading_as: "",
    country: "",
    vat_number: "",
    registration_number: "",
    language: "",
  });

  const [formDataPolicies, setFormDataPolicies] = useState({
    id_car_business: id_car_business,
    policies_name: "",
    policies_description: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    AccountNameValidation: "",
    AccountDescValidation: "",
  });

  // FETCH DATA CAR BUSINESS ACCOUNT
  useEffect(() => {
    if (businessAccount) return;
    const fetchBusinessAccount = async () => {
      const { status, data, ok, error } = await callAPI(
        "/car-business/details/show",
        "POST",
        { id_car_business: id_car_business },
        true
      );
      if (error) {
        setBusinessAccountError(true);
      } else {
        setBusinessAccount(data);
        if (ok) {
          const businessAccount = data;

          console.log("Business Settings Account Show : ", businessAccount);

          setFormDataAccount((prevData) => ({
            id_car_business: id_car_business,
            company_name: businessAccount.company_name,
            trading_as: businessAccount.trading_as,
            country: businessAccount.country,
            vat_number: businessAccount.vat_number,
            registration_number: businessAccount.registration_number,
            language: businessAccount.language,
          }));
          // setProfilePhoto(businessAccount.profile_photo)
        }
        setBusinessAccountOk(ok);
        setBusinessAccountLoadingFirst(false);
      }
    };
    fetchBusinessAccount();
  }, [id_car_business]);

  //  FETCH DATA POLICIES
  useEffect(() => {
    if (businessPolicies) return;
    const fetchBusinessPolicies = async () => {
      const { status, data, ok, error } = await callAPI(
        "/car-business/policies/show-details",
        "POST",
        { id_car_business: id_car_business },
        true
      );
      if (error) {
        setBusinessPoliciesError(true);
      } else {
        setBusinessPolicies(data);
        if (ok) {
          const businessPolicies = data;

          console.log("Business Settings Account Show : ", businessPolicies);

          setFormDataPolicies((prevData) => ({
            id_car_business: id_car_business,
            policies_name: businessPolicies.policies_name,
            policies_description: businessPolicies.policies_description,
          }));
          // setProfilePhoto(businessAccount.profile_photo)
        }
        setBusinessPoliciesOk(ok);
        setBusinessPoliciesLoadingFirst(false);
      }
    };
    fetchBusinessPolicies();

  }, [id_car_business]);

  const onSubmitAccount = async (e) => {
    e.preventDefault();

    setBusinessAccountLoading(true);

    const formDataAccountCopy = {
      ...formDataAccount,
    };
    if (
      !errorMessage.AccountDescValidation &&
      !errorMessage.AccountNameValidation
    ) {
      const { ok, error } = await callAPI(
        "/car-business/details/store",
        "POST",
        formDataAccountCopy,
        true
      );
      if (ok) {
        console.log("Success");
        window.location.reload();
      } else {
        console.log("This is error", error);
      }
    }
    setBusinessAccountLoading(false);
  };
  const onSubmitPolicies = async (e) => {
    e.preventDefault();

    setBusinessPoliciesLoading(true);

    const formDataPoliciesCopy = {
      ...formDataPolicies,
    };

    if (
      !errorMessage.AccountDescValidation &&
      !errorMessage.AccountNameValidation
    ) {
      const { ok, error } = await callAPI(
        "/car-business/policies/store-details",
        "POST",
        formDataPoliciesCopy,
        true
      );
      if (ok) {
        // console.log("Success");
        window.location.reload();
      } else {
        console.log(error);
      }
    }
    setBusinessPoliciesLoading(false);
  };

  return (
    <div className="company">
      <div className="company__tab">
        <div className="company__tabs-menu">
          {Object.keys(tabs).map((tab, index) => (
            <button
              key={index}
              className={`btn ${tab === selectedTab ? "active" : ""}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      {selectedTab === "Account Profile" && (
        <form id="myForm" onSubmit={onSubmitAccount}>
          <div className="company__tab-content">
            <div className="company__row">
              <div className="company__block">
                <label htmlFor="businessCarCompanyName">Company name</label>
                <input
                  type="text"
                  name="businessCarCompanyName"
                  id="businessCarCompanyName"
                  placeholder="Enter your company name"
                  value={formDataAccount.company_name}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setFormDataAccount((prevData) => ({
                      ...prevData,
                      company_name: newValue,
                    }));

                    if (!newValue.trim()) {
                      errorMessage.AccountNameValidation =
                        "Account name is required";
                    } else {
                      errorMessage.AccountNameValidation = "";
                    }
                  }}
                />
              </div>
              <div className="company__block">
                <label htmlFor="businessCarTradingAs">Trading as :</label>
                <input
                  type="text"
                  name="businessCarTradingAs"
                  id="businessCarTradingAs"
                  placeholder="Enter the name"
                  value={formDataAccount.trading_as}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setFormDataAccount((prevData) => ({
                      ...prevData,
                      trading_as: newValue,
                    }));

                    if (!newValue.trim()) {
                      errorMessage.AccountNameValidation =
                        "Account name is required";
                    } else {
                      errorMessage.AccountNameValidation = "";
                    }
                  }}
                />
              </div>
            </div>
            <div className="company__row">
              <div className="company__block">
                <label htmlFor="businessCarCompanyCountry">Country :</label>
                <select
                  value={formDataAccount.country}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setFormDataAccount((prevData) => ({
                      ...prevData,
                      country: newValue,
                    }));
                  }}
                >
                  {getCountries().map((country) => (
                    <option key={country} value={country}>
                      {countryLabels[country]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="company__block">
                <label htmlFor="businessCarCompanyLanguage">Language :</label>
                <select 
                value={formDataAccount.language}
                onChange={(e) => {
                    const newValue = e.target.value;
                    setFormDataAccount((prevData) => ({
                      ...prevData,
                      language: newValue,
                    }));
                  }}
                   className="form-select goform-select" id="language" aria-label="star rating select">
                            {ISO6391.getAllNames().map((lang) => (
                              <option key={lang} value={lang}>
                                {lang}
                              </option>
                            ))}
                          </select>
              </div>
            </div>
            <div className="company__row">
              <div className="company__block">
                <label htmlFor="businessCarCompanyVAT">VAT Number</label>
                <input
                  type="text"
                  name="businessCarCompanyVAT"
                  id="businessCarCompanyVAT"
                  placeholder="Enter the number"
                  value={formDataAccount.vat_number}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setFormDataAccount((prevData) => ({
                      ...prevData,
                      vat_number: newValue,
                    }));

                    if (!newValue.trim()) {
                      errorMessage.AccountNameValidation =
                        "Account name is required";
                    } else {
                      errorMessage.AccountNameValidation = "";
                    }
                  }}
                />
              </div>
              <div className="company__block">
                <label htmlFor="businessCarCompanyRegistrationNumber">
                  Company Registration Number
                </label>
                <input
                  type="text"
                  name="businessCarCompanyRegistrationNumber"
                  id="businessCarCompanyRegistrationNumber"
                  placeholder="Enter the name"
                  value={formDataAccount.registration_number}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setFormDataAccount((prevData) => ({
                      ...prevData,
                      registration_number: newValue,
                    }));

                    if (!newValue.trim()) {
                      errorMessage.AccountNameValidation =
                        "Account name is required";
                    } else {
                      errorMessage.AccountNameValidation = "";
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </form>
      )}
      {selectedTab === "Policies" && (
        <form id="myForm" onSubmit={onSubmitPolicies}>
          <div className="company__tab-content">
            <div className="company__row">
              <div className="company__block">
                <label htmlFor="businessCarPoliciesName">Policies Name</label>
                <input
                  type="text"
                  name="businessCarPoliciesName"
                  id="businessCarPoliciesName"
                  placeholder="Your Policies Name"
                  value={formDataPolicies.policies_name}
                  onChange={(e) => {
                    const newValue = e.target.value;

                    setFormDataPolicies((prevData) => ({
                      ...prevData,
                      policies_name: newValue,
                    }));

                    if (!newValue.trim()) {
                      errorMessage.AccountNameValidation =
                        "Account name is required";
                    } else {
                      errorMessage.AccountNameValidation = "";
                    }
                  }}
                />
              </div>
              <div className="company__block"></div>
            </div>
            <div className="company__block">
              <label htmlFor="businessCarPoliciesDescription">
                Policies Description
              </label>
              <textarea
                name="businessCarPoliciesDescription"
                id="businessCarPoliciesDescription"
                cols={30}
                rows={10}
                placeholder="Your Policies Description"
                value={formDataPolicies.policies_description}
                onChange={(e) => {
                  const newValue = e.target.value;

                  setFormDataPolicies((prevData) => ({
                    ...prevData,
                    policies_description: newValue,
                  }));

                  if (!newValue.trim()) {
                    errorMessage.AccountNameValidation =
                      "Account name is required";
                  } else {
                    errorMessage.AccountNameValidation = "";
                  }
                }}
              ></textarea>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

const CompanyDocument = () => {
  return (
    <div className="company">
      <Link
        href={"/business/car/profile/insurance"}
        className="company__document"
      >
        <div className="company__document-icon">
          <SVGIcon src={Icons.Hotel} height={24} width={24} />
        </div>
        <span className="company__document-text">Insurance Document</span>
        <SVGIcon src={Icons.ArrowRight} height={24} width={24} />
      </Link>
      <Link
        href={"/business/car/profile/individual"}
        className="company__document"
      >
        <div className="company__document-icon">
          <SVGIcon src={Icons.Hotel} height={24} width={24} />
        </div>
        <span className="company__document-text">
          Individual Identification Document
        </span>
        <SVGIcon src={Icons.ArrowRight} height={24} width={24} />
      </Link>
      <Link
        href={"/business/car/profile/identification"}
        className="company__document"
      >
        <div className="company__document-icon">
          <SVGIcon src={Icons.Hotel} height={24} width={24} />
        </div>
        <span className="company__document-text">
          Company Identification Details
        </span>
        <SVGIcon src={Icons.ArrowRight} height={24} width={24} />
      </Link>
    </div>
  );
};

import Layout from "@/components/layout";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import ReactDOM from "react-dom";
import { callAPI } from "@/lib/axiosHelper";
import { useSession } from "next-auth/react";
import Navbar from "@/components/business/car/navbar";
import SVGIcon from "@/components/elements/icons";
import { Icons, Images, Services } from "@/types/enums";
import { BlurPlaceholderImage } from "@/components/elements/images";
import placeholder from "@/public/images/placeholder.svg";
import PhoneInput, { getCountries, getCountryCallingCode, parsePhoneNumber,} from "react-phone-number-input/input";
import { CountryCode } from "libphonenumber-js/types";
import countryLabels from "react-phone-number-input/locale/en.json";

export default function CarAccountProfile() {
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
          <ProfileForm />
          <EditModal />
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
          <div className="ms-auto d-flex gap-5 align-items-center">
            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
            >
              Change Password
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
      </div>
    </section>
  );
};

const ProfileForm = () => {
  const [phoneCountry, setPhoneCountry] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const router = useRouter();

  // Retrive data from API
  const [businessAccount, setBusinessAccount] = useState(null);
  const [businessAccountLoading, setBusinessAccountLoading] = useState(false);
  const [businessAccountLoadingFirst, setBusinessAccountLoadingFirst] =
    useState(true);
  const [businessAccountOk, setBusinessAccountOk] = useState(false);
  const [businessAccountError, setBusinessAccountError] = useState(false);

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
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
    profile_photo: "",
  });
  const [errorMessage, setErrorMessage] = useState({
    AccountNameValidation: "",
    AccountPhoneValidation: "",
    AccountDescValidation: "",
  });

  useEffect(() => {
    if (businessAccount) return;
    const fetchBusinessAccount = async () => {
      const { status, data, ok, error } = await callAPI(
        "/car-business/show",
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
            email: businessAccount.email,
            firstname: businessAccount.firstname,
            lastname: businessAccount.lastname,
            phone: businessAccount.phone,
            profile_photo: businessAccount.profile_photo,
          }));
          setProfilePhoto(businessAccount.profile_photo);
        }
        setBusinessAccountOk(ok);
        setBusinessAccountLoadingFirst(false);
      }
    };
    fetchBusinessAccount();
    console.log("HALo", formDataAccount);
  }, [id_car_business]);

  const setFormData = () => {
    if (!businessAccount) return;

    if (businessAccount.phone) {
      const phoneNumber = parsePhoneNumber(businessAccount.phone);
      if (phoneNumber) {
        setPhoneCountry(phoneNumber.country);
        setPhone(businessAccount.phone);
      }
    }
  };

  useEffect(() => {
    setFormData();
  }, [businessAccount]);

  // Add a state variable to track whether a new file has been selected
const [isNewFileSelected, setIsNewFileSelected] = useState(false);

const onSubmitAccount = async (e) => {
  e.preventDefault();

  setBusinessAccountLoading(true);

  const formDataAccountCopy = {
    ...formDataAccount,
  };

  // Set profile_photo to an empty string only if a new file is not selected
  if (!isNewFileSelected) {
    formDataAccountCopy.profile_photo = "";
  }

  console.log("Form data copy", formDataAccountCopy);

  if (
    !errorMessage.AccountDescValidation &&
    !errorMessage.AccountNameValidation
  ) {
    const { ok, error } = await callAPI(
      "/car-business/store-v2",
      "POST",
      formDataAccountCopy,
      true
    );
    if (ok) {
      console.log("Success");
      window.location.reload();
    } else {
      console.log("iniiiieror", error);
    }
  }

  setBusinessAccountLoading(false);
};

  

  const [profilePhoto, setProfilePhoto] = useState(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log("FOTO", profilePhoto);

  const handleFileChange = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePhoto(reader.result);
        setFormDataAccount((prevState) => ({
          ...prevState,
          profile_photo: reader.result.toString(),
        }));
      };
      reader.readAsDataURL(file);
      setIsNewFileSelected(true); // Set the flag for a new file
    } else {
      setIsNewFileSelected(false); // Reset the flag if no file is selected
    }
  };

  const handlePhoneChange = (newPhone) => { 
    setPhone(newPhone); 

    // Update the formData with the new phone number
    setFormDataAccount((prevData) => ({
        ...prevData, 
        phone: newPhone, 
    }));
    if (!newPhone) {
      errorMessage.AccountPhoneValidation = 'Phone number is required'
    } else {
        errorMessage.AccountPhoneValidation = ''
    }
};
  

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
  
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const defaultPhoneCountry = "US";

  return (
    <form id="myForm" onSubmit={onSubmitAccount}>
      <div className="account">
        <div className="account__block">
          <label htmlFor="">Profile Image</label>
          <div className="account__profile">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile Photo"
                className="account__profile-preview"
              />
            ) : (
              <BlurPlaceholderImage
                src={placeholder}
                alt="Profile Photo"
                className="account__profile-preview"
              />
            )}
            <button
              onClick={handleButtonClick}
              className="btn btn-sm btn-outline-success"
            >
              Change
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
        <div className="account__row">
          <div className="account__block">
            <label htmlFor="businessCarFirstName">First Name</label>
            <input
              type="text"
              name="businessCarFirstName"
              id="businessCarFirstName"
              placeholder="Your First Name"
              value={formDataAccount.firstname}
              onChange={(e) => {
                const newValue = e.target.value;

                setFormDataAccount((prevData) => ({
                  ...prevData,
                  firstname: newValue,
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
          <div className="account__block">
            <label htmlFor="businessCarlastName">Last Name</label>
            <input
              type="text"
              name="businessCarlastName"
              id="businessCarlastName"
              placeholder="Your Last Name"
              value={formDataAccount.lastname}
              onChange={(e) => {
                const newValue = e.target.value;

                setFormDataAccount((prevData) => ({
                  ...prevData,
                  lastname: newValue,
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
        <div className="account__row">
          <div className="account__block">
            <label htmlFor="businessCarEmail">Email Address</label>
            <input
              type="email"
              name="businessCarEmail"
              id="businessCarEmail"
              placeholder="Your Email"
              value={formDataAccount.email}
              onChange={(e) => {
                const newValue = e.target.value;

                setFormDataAccount((prevData) => ({
                  ...prevData,
                  email: newValue,
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
          <div className="account__block">
            <label htmlFor="businessCarlastName">Phone</label>
            <div className="PhoneInput form-control-wrapper">
              <div className={`form-control-field w-100`}>
                <div className="PhoneInputCountry">
                  <select
                    value={phoneCountry}
                    onChange={(event) =>
                      setPhoneCountry(event.target.value || null)
                    }
                    name="phone-code"
                  >
                    {getCountries().map((country) => (
                      <option key={country} value={country}>
                        {countryLabels[country]} +
                        {getCountryCallingCode(country)}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`PhoneInputSelectedValue ${
                      phoneCountry ? "HasValue" : ""
                    }`}
                  >
                    +
                    {getCountryCallingCode(
                      (phoneCountry || defaultPhoneCountry) as CountryCode
                    )}
                  </div>
                </div>
                <PhoneInput
                  international={true}
                  country={(phoneCountry || defaultPhoneCountry) as CountryCode}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="(888) 888-8888"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
const EditModal = () => {
  const [isPasswordShow, setIsPasswordShow] = useState(false);
  const [isConfirmPasswordShow, setIsConfirmPasswordShow] = useState(false);

  const handlePasswordShow = () => {
    setIsPasswordShow(!isPasswordShow);
  };

  const handleConfirmPasswordShow = () => {
    setIsConfirmPasswordShow(!isConfirmPasswordShow);
  };

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    number: false,
  });
  const router = useRouter();
  const { data: session, status } = useSession();
  const id_car_business =
    status === "authenticated" || session ? Number(session.user.id) : null;

  const handleValidation = (value) => {
    const length = value.length >= 8;
    const uppercase = /[A-Z]/.test(value);
    const number = /\d/.test(value);

    setValidations({
      length,
      uppercase,
      number,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation newPassword
    handleValidation(newPassword);

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (Object.values(validations).every(Boolean)) {
      const { ok, error } = await callAPI(
        `/car-business/store`,
        "POST",
        { id_car_business: id_car_business, password: newPassword },
        true
      );
      if (ok) {
        console.log("Success");
        window.location.reload();
      }
      if (error) {
        console.log(error);
      }
      return;
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="editModal"
        tabIndex={-1}
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog cancelation__modal admin-customer__modal-edit">
          <div className="modal-content admin-customer__add-modal-content">
            <form
              onSubmit={handleSubmit}
              className="admin-menu-settings__content"
            >
              <div className="admin-change-password__content-top">
                <div className="admin-change-password__content-require">
                  <p className="admin-change-password__content-require-desc">
                    Password must contain:
                  </p>
                  <div className="admin-change-password__content-require-wrapper">
                    <div className="admin-change-password__content-require-item">
                      {validations.length ? (
                        <>
                          <SVGIcon
                            src={Icons.Check}
                            width={20}
                            height={20}
                            className="admin-change-password__content-require-item--icon"
                          />
                          <p>At least 8 characters</p>
                        </>
                      ) : (
                        <p className="text-danger">At least 8 character</p>
                      )}
                    </div>

                    <div className="admin-change-password__content-require-item">
                      {validations.uppercase ? (
                        <>
                          <SVGIcon
                            src={Icons.Check}
                            width={20}
                            height={20}
                            className="admin-change-password__content-require-item--icon"
                          />
                          <p>At least 1 Uppercase Letter</p>
                        </>
                      ) : (
                        <p className="text-danger">
                          At least 1 Uppercase Letter
                        </p>
                      )}
                    </div>
                    <div className="admin-change-password__content-require-item">
                      {validations.number ? (
                        <>
                          <SVGIcon
                            src={Icons.Check}
                            width={20}
                            height={20}
                            className="admin-change-password__content-require-item--icon"
                          />
                          <p>At least 1 Number</p>
                        </>
                      ) : (
                        <p className="text-danger">At least 1 Number</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="booking-tour__contact w-100">
                  <div className="booking-tour__contact-block w-100">
                    <label htmlFor="contact-name">New Password</label>
                    <input
                      type={isPasswordShow ? "text" : "password"}
                      name="contact-name"
                      id="contact-name"
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        handleValidation(e.target.value);
                      }}
                    />
                    <div
                      onClick={handlePasswordShow}
                      className="booking-tour__contact-icon"
                    >
                      <SVGIcon
                        src={isPasswordShow ? Icons.EyeSlash : Icons.Eye}
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                  <div className="booking-tour__contact-block w-100">
                    <label htmlFor="contact-name">Confirm new password</label>
                    <input
                      type={isConfirmPasswordShow ? "text" : "password"}
                      name="contact-name"
                      id="contact-name"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                    />
                    <div
                      onClick={handleConfirmPasswordShow}
                      className="booking-tour__contact-icon"
                    >
                      <SVGIcon
                        src={isConfirmPasswordShow ? Icons.EyeSlash : Icons.Eye}
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-change-password__content-bottom">
                <button
                  type="submit"
                  className="btn btn-lg btn-password btn-success"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

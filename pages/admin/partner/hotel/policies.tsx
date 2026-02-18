import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import { BlurPlaceholderImage } from "@/components/elements/images"
import { Images } from "@/types/enums"
import Link from "next/link"
import { useSession } from "next-auth/react"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { RFHSelect } from "@/components/forms/fields"
import alertInfo from '@/assets/images/alert_info.svg'
import { useForm } from "react-hook-form"
import { callAPI } from '@/lib/axiosHelper'
import * as bootstrap from 'bootstrap';
import LoadingOverlay from "@/components/loadingOverlay"


export default function PartnerHotelDetail() {
  const router = useRouter()
  const { id_hotel } = router.query;
  // console.log(id_hotel)

  //Retrive Data from API
  const [hotelData, setHotelData] = useState(null);
  const [hotelLoading, setHotelLoading] = useState(true);
  const [hotelError, setHotelError] = useState(null);

  // console.log(hotelData)

  //for cancellation options
  const [toastOptions, setToastOptions] = useState({
    title: 'Hotel Policies',
    message: 'Success Update Hotel Policies !',
    variant: 'success update',
    variant_class: 'gfu-toast--danger',
    autohide: true,
    delay: 3000,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import the bootstrap library when needed
      import('bootstrap').then((bootstrap) => {
        const toastTrigger = document.getElementById('liveToastBtn');
        const toastLiveExample = document.getElementById('liveToast');

        if (toastTrigger) {
          toastTrigger.addEventListener('click', function () {
            const toast = new bootstrap.Toast(toastLiveExample);
            toast.show();
          });
        }
      });
    }
  }, []);

  // Function to trigger the toast with custom options
  const showToast = () => {
    if (typeof window !== 'undefined') {
      // Dynamically import the bootstrap library when needed
      import('bootstrap').then((bootstrap) => {
        const toastTrigger = document.getElementById('liveToastBtn');
        const toastLiveExample = document.getElementById('liveToast');

        if (toastTrigger) {
          toastTrigger.addEventListener('click', function () {
            const toast = new bootstrap.Toast(toastLiveExample);
            toast.show();
          });

          // Automatically click the button
          toastTrigger.click();
        }
      });
    }
  };

  // Function to update the toastOptions and trigger the toast
  const updateAndShowToast = (newOptions) => {
    // Update toastOptions with the newOptions
    setToastOptions({
      ...toastOptions,
      ...newOptions,
    });
    // Trigger the toast using the showToast variable
    showToast();
  };

  // Function to trigger the toast with custom options
  const handleTriggerToast = (title, message, variant, variant_class) => {
    // Create custom options based on parameters
    const customOptions = {
      title,
      message,
      variant,
      variant_class,
    };
    // Trigger the toast with custom options
    updateAndShowToast(customOptions);
  };


  //Forms
  const [formData, setFormData] = useState({
    id_hotel_policies: null,
    id_hotel: null,
    cancellation_day: null,
    protect_against: null,
    checkin_from: null,
    checkin_to: null,
    checkout_from: null,
    checkout_to: null,
    children: null,
    pets: null,
  });

  const fetchHotelData = async () => {
    try {
      const { status, data, ok, error } = await callAPI('/hotel-policies/show', 'POST', { id_hotel: id_hotel }, true);
      console.log(data)
      if (Array.isArray(data) && data.length > 0) {
        const hotelPolicyData = data[0]; // Access the first element of the array
        setFormData({
          id_hotel_policies: hotelPolicyData.id_hotel_policies,
          id_hotel: hotelPolicyData.id_hotel,
          cancellation_day: hotelPolicyData.cancellation_day,
          protect_against: hotelPolicyData.protect_against,
          checkin_from: hotelPolicyData.checkin_from,
          checkin_to: hotelPolicyData.checkin_to,
          checkout_from: hotelPolicyData.checkout_from,
          checkout_to: hotelPolicyData.checkout_to,
          children: hotelPolicyData.children,
          pets: hotelPolicyData.pets,
        });
        setHotelData(hotelPolicyData);
        setHotelLoading(false);
      } else {
        // Handle the case where the data array is empty or not an array
        setHotelError("No hotel data found");
        setHotelLoading(false);
      }
    } catch (error) {
      setHotelError(error);
      setHotelLoading(false);
    }
  }


  useEffect(() => {
    if (!id_hotel) return;
    if (hotelData) return;
    fetchHotelData();
  }, [id_hotel]);

  if (hotelLoading) {
    return <LoadingOverlay />;
  }



  // console.log("hotelData", hotelData)
  // console.log("formData", formData)

  //for times array
  const times = ['00:00:00', '00:30:00', '01:00:00', '01:30:00', '02:00:00', '02:30:00', '03:00:00', '03:30:00', '04:00:00', '04:30:00', '05:00:00', '05:30:00', '06:00:00', '06:30:00', '07:00:00', '07:30:00', '08:00:00', '08:30:00', '09:00:00', '09:30:00', '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00', '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00', '16:00:00', '16:30:00', '17:00:00', '17:30:00', '18:00:00', '18:30:00', '19:00:00', '19:30:00', '20:00:00', '20:30:00', '21:00:00', '21:30:00', '22:00:00', '22:30:00', '23:00:00', '23:30:00'];

  //for cancellation options
  const cancellationOptions = [
    { value: 0, text: 'Day of arrival' },
    { value: 0.25, text: '6 Hours before check-In' },
    { value: 1, text: '1 Day before check-In' },
    { value: 2, text: '2 Day before check-In' },
    { value: 3, text: '3 Day before check-In' },
    { value: 7, text: '7 Day before check-In' },
    { value: 14, text: '14 Day before check-In' },
  ];

  // Define a function to handle the change of select elements
  const handleSelectChange = (fieldName, event) => {
    const newValue = event.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: newValue,
    }));

    console.log("formData update : ", formData)
  };

  // Define a function to handle the toggle of the checkbox
  const handleProtectAgainstToggle = () => {
    // Toggle the value of formData.protect_against
    setFormData((prevFormData) => ({
      ...prevFormData,
      protect_against: prevFormData.protect_against === 1 ? 0 : 1,
    }));

    console.log("formData update : ", formData)
  };

  // Define a function to handle the change of children radio input
  const handleChildrenOptionChange = (event) => {
    const newChildrenValue = event.target.value === "1" ? 1 : 0;
    setFormData((prevFormData) => ({
      ...prevFormData,
      children: newChildrenValue,
    }));
  };

  // Define a function to handle the change of pets radio input
  const handlePetsOptionChange = (event) => {
    const newPetsValue = event.target.value === "1" ? 1 : 0;
    setFormData((prevFormData) => ({
      ...prevFormData,
      pets: newPetsValue,
    }));
  };

  const onActionForm = async () => {
    fetchHotelData();
    window.scrollTo({ top: 0, behavior: 'auto' })
  };


  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    const { status, data, ok, error } = await callAPI('/hotel-policies/store', 'POST', formData, true)
    console.log(status, data, ok, error);
    if (ok) {
      console.log("success api handle submit detail booking store ", status, data, ok, error);
      // redirect to 
      onActionForm();
      handleTriggerToast("Hotel Policies", "Success Update Hotel Policies !", "success update", "gfu-toast--success");
    } else {
      console.log("fail to handle submit post api detail booking store   ", status, data, ok, error);
      handleTriggerToast("Hotel Policies", "Failed Update Hotel Policies !", "failed update", "gfu-toast--danger");
    }
  };

  return (
    <Layout>
      <AdminLayout pageTitle="Policies" enableBack={true}>
        <div className="admin-partner__detail">
          <div className="container">
            <section className="admin-partner__basic">
              <form action="" className='admin-partner__policies-wrap'>
                <div className='admin-partner__policies-form'>
                  <p className='admin-partner__policies-form-title'>Cancellation</p>
                  <div className='goform-group'>
                    {
                      hotelError || hotelData === null ?
                        (
                          'Error Fetching Data / Hotel Policies Data is null'
                        ) : (
                          <>
                            <label htmlFor="propertyName" className="form-label goform-label">How many days in advance can guests cancel free of charge?</label>
                            <RFHSelect id={"cancellation_day"} name={"cancellation_day"} defaultValue={formData.cancellation_day} onChange={(event) => handleSelectChange("cancellation_day", event)}>
                              {cancellationOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.text}
                                </option>
                              ))}
                            </RFHSelect>
                          </>
                        )}
                  </div>
                </div>

                <div className='admin-partner__policies-form admin-partner__policies-form--row'>
                  <div className='admin-partner__policies-form-col admin-partner__policies-left-col'>
                    <p className='admin-partner__policies-form-title'>Protect Against Accidental Bookings</p>
                    <p className='admin-partner__policies-form-caption'>
                      To save you time handling accidental bookings, we automatically waive cancellation fees for guests who cancel within
                      the first 24 hours of a booking being made. You can change this period of time later in your property management
                      platform.
                    </p>
                  </div>
                  <div className='admin-partner__policies-form-col'>
                    <div className='goform-switches admin-partner__policies-switch'>
                      <input className='goform-switches__check' type="checkbox" id="protect-againts-checkbox" checked={formData.protect_against === 1} onChange={handleProtectAgainstToggle} />
                      <label htmlFor="protect-againts-checkbox">
                        <span></span>
                        <span></span>
                      </label>
                    </div>
                    <div className="form-check form-switch">
                      {/* <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked /> */}
                    </div>
                  </div>
                </div>

                <div className='admin-partner__policies-slice row'>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                    <div className='admin-partner__policies-form'>
                      <p className='admin-partner__policies-form-title'>Check In</p>
                      <div className='goform-group'>
                        {hotelError || hotelData === null ?
                          (
                            'Error Fetching Data / Hotel Policies Data is null'
                          ) : (
                            <>
                              <label className="form-label goform-label">From :</label>
                              <RFHSelect id="checkin_from" name="checkin_from" defaultValue={formData.checkin_from} onChange={(event) => handleSelectChange("checkin_from", event)}>
                                {times.map((time) => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </RFHSelect>
                            </>
                          )}
                      </div>
                      <div className='goform-group'>
                        {hotelError || hotelData === null ?
                          (
                            'Error Fetching Data / Hotel Policies Data is null'
                          ) : (
                            <>
                              <label className="form-label goform-label">To :</label>
                              <RFHSelect id="checkin_to" name="checkin_to" defaultValue={formData.checkin_to} onChange={(event) => handleSelectChange("checkin_to", event)}>
                                {times.map((time) => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </RFHSelect>
                            </>
                          )}
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-6'>
                    <div className='admin-partner__policies-form'>
                      <p className='admin-partner__policies-form-title'>Check Out</p>
                      <div className='goform-group'>
                        <label className="form-label goform-label">From :</label>
                        <RFHSelect id="checkout_from" name="checkout_from" defaultValue={formData.checkout_from} onChange={(event) => handleSelectChange("checkout_from", event)}>
                          {times.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </RFHSelect>
                      </div>
                      <div className='goform-group'>
                        <label className="form-label goform-label">To :</label>
                        <RFHSelect id="checkout_to" name="checkout_to" defaultValue={formData.checkout_to} onChange={(event) => handleSelectChange("checkout_to", event)}>
                          {times.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </RFHSelect>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='admin-partner__policies-form'>
                  <p className='admin-partner__policies-form-title admin-partner__policies-child-title'>Children</p>
                  <div className='goform-group row'>
                    <div className='col-xl-6 col-xl-offset-6 col-lg-6 col-md-12'>
                      <label htmlFor="contactName" className="form-label goform-label goform-label--text-bold admin-partner__policies-child-label">
                        Can you accommodate children? (You can specify the ages and prices later)
                      </label>
                      <div className="form-check form-check-inline">
                        {/* checked input if formData.childern != 0  */}
                        <input className="form-check-input" type="radio" name="children-option" id="children-option-yes" defaultChecked={formData.children !== 0} value={1} onChange={handleChildrenOptionChange} />
                        <label className="form-check-label" htmlFor="children-option-yes">Yes</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="children-option" id="children-option-no" defaultChecked={formData.children === 0} value={0} onChange={handleChildrenOptionChange} />
                        <label className="form-check-label" htmlFor="children-option-no">No</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='admin-partner__policies-form'>
                  <p className='admin-partner__policies-form-title admin-partner__policies-child-title'>Pets</p>
                  <div className='goform-group row'>
                    <div className='col-xl-6 col-xl-offset-6 col-lg-6 col-md-12'>
                      <label htmlFor="contactName" className="form-label goform-label goform-label--text-bold admin-partner__policies-child-label">
                        Do you allow pets?
                      </label>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="pets-option" id="pets-option-yes" defaultChecked={formData.pets !== 0} value={1} onChange={handlePetsOptionChange} />
                        <label className="form-check-label" htmlFor="pets-option-yes">Yes</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="pets-option" id="pets-option-no" defaultChecked={formData.pets === 0} value={0} onChange={handlePetsOptionChange} />
                        <label className="form-check-label" htmlFor="pets-option-no">No</label>
                      </div>
                    </div>
                  </div>
                  <div className='goform-alert admin-partner__policies-alert'>
                    <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
                    <p>Some guests like to travel with their furry friends. Indicate if you allow pets and if any charges apply.</p>
                  </div>
                </div>
                {/* {error && (
                  <div className="d-flex flex-column align-items-center text-center text-danger-main">
                    {error}
                  </div>
                )} */}
                <div className='hotel-registration__button-list hotel-registration__button-list--draft justify-content-end'>
                  <div className="admin-partner__basic-card admin-partner__basic-card--buttons">
                    <Link href={`/admin/partner/hotel/edit?id_hotel=${id_hotel}`} className="btn btn-lg btn-outline-success">Cancel</Link>
                    <button type="button" onClick={handleSubmit} className="btn btn-lg btn-success">Save</button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
        <Toast toastOptions={toastOptions} />
      </AdminLayout>
    </Layout>
  )
}

const Toast = ({ toastOptions }) => {
  return (
    <>
      <button type="button" className="btn btn-primary d-none" id="liveToastBtn">Show live toast</button>
      <div className={`toast-container position-fixed bottom-0 end-0 p-3 gfu-toast ${toastOptions.variant_class}`}>
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <strong className="toast-header__title">{toastOptions.title}</strong>
            <small>{toastOptions.variant}</small>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" />
          </div>
          <div className="toast-body">
            {toastOptions.message}
          </div>
        </div>
      </div>
    </>
  )
}
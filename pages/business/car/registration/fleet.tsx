import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/layout/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Link from 'next/link';
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconInfo from 'assets/images/alert_info.svg'
import iconPlus from 'assets/images/icon_plus_soft.svg'
import iconCheck from 'assets/images/icon_check_soft.svg'
import { callAPI } from '@/lib/axiosHelper';
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

const AddFleet = () => {
  const router = useRouter()
  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

  const formData = {
    id_car_business: id_car_business,
    fuel_type: "",
    car_brand: "",
    model: "",
    edition: "",
    transmission: "",
    aircon: "",
    quantity: ""
  }

  const [carError, setCarError] = useState({
    fuel_typeValidation: '',
    car_brandValidation: '',
    modelValidation: '',
    editionValidation: '',
    transmissionValidation: '',
    airconValidation: '',
    quantityValidation: '',
  });

  const [errorMessage, setErrorMessage] = useState([]);

  let hasError = false

  const [carForms, setCarForms] = useState([formData]);

  const onMutate = (e, index, fieldName) => {
    const { value } = e.target;

    setCarForms((prevCarForms) => {
      const updatedCarForms = [...prevCarForms];
      updatedCarForms[index] = { ...updatedCarForms[index], [fieldName]: value };
      return updatedCarForms;
    });

    setErrorMessage((prevErrors) => {
      const updatedErrors = [...prevErrors];
      updatedErrors[index] = { ...updatedErrors[index], [`${fieldName}Validation`]: '' };
      return updatedErrors;
    });
  }

  const addNewCarForm = () => {
    setCarForms([...carForms, formData]);
    setErrorMessage([...errorMessage, {}])
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Car Forms : ', carForms);

    const newErrorMessage = [];

    for (let i = 0; i < carForms.length; i++) {
      if (carForms[i].fuel_type === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], fuel_typeValidation: 'Fuel type is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], fuel_typeValidation: '' };
      }

      if (carForms[i].car_brand === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], car_brandValidation: 'Car brand is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], car_brandValidation: '' };
      }

      if (carForms[i].model === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], modelValidation: 'Model is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], modelValidation: '' };
      }

      if (carForms[i].edition === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], editionValidation: 'Edition is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], editionValidation: '' };
      }

      if (carForms[i].transmission === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], transmissionValidation: 'Transmission is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], transmissionValidation: '' };
      }

      if (carForms[i].transmission === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], transmissionValidation: 'Transmission is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], transmissionValidation: '' };
      }

      if (carForms[i].aircon === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], airconValidation: 'Aircon is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], airconValidation: '' };
      }

      if (carForms[i].quantity === '') {
        newErrorMessage[i] = { ...newErrorMessage[i], quantityValidation: 'Quantity is required' };
        hasError = true;
      } else {
        newErrorMessage[i] = { ...newErrorMessage[i], quantityValidation: '' };
      }

      // Set the error messages for this form
      setErrorMessage((prevErrors) => {
        const updatedErrors = [...prevErrors];
        updatedErrors[i] = newErrorMessage[i];
        return updatedErrors;
      });
    }

    if (!hasError) {
      hasError = false
    }

    if (!hasError) {
      for (let i = 0; i < carForms.length; i++) {
        const { ok, error } = await callAPI('/car-business/fleet/store', 'POST', carForms[i], true)
      }
      router.push('/business/car/registration');
    }
  }

  return (
    <Layout>
      <Navbar showHelp={false} hideAuthButtons={true} />
      <header>
        <div className="car-dashboard__header">
          <Link href={"./"}>
            <div className="container car-dashboard__content-header">
              <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
              <h4 className='car-dashboard__content-title-heading'>Add your car</h4>
            </div>
          </Link>
        </div>
      </header>
      <form onSubmit={onSubmit}>
        <div className="add-fleet">
          <div className="container">
            {carForms.map((carForm, index) => (
              <div key={index} className="row">
                <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12">
                  <div className="goform-alert__box">
                    <BlurPlaceholderImage className='' alt='image' src={iconInfo} width={28} height={28} />
                    <div className="add-location__content-flag-form">
                      <p className="add-location_content-title add-location_content-title--alert-info">This is important</p>
                      <div className="add-location__content-flag-desc">
                        <p className='add-location__content-caption'>
                          This is where you can list the cars you’d like to make available on Marketplace.
                        </p>
                        <p className='add-location__content-caption'>
                          We use industry standard ACRISS codes to classify cars. The four letters reflect the size and features of each car group. You can find out more about what each code means at the <a href="#">ACRISS</a> website
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="add-location__content-form col-xl-8 col-lg-8 col-md-12 col-sm-12">
                  <p className="add-location__content-title">Add car</p>
                  <div className='goform-group row'>
                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                      <label htmlFor="fuel_type" className="form-label goform-label">Fuel type : </label>
                      <select
                        onChange={(e) => onMutate(e, index, "fuel_type")} id="fuel_type" className="form-select goform-select-white goform-select" aria-label="star rating select">
                        <option value="" disabled selected>-- Select Fuel Type --</option>
                        <option value='Hydrogen'>Hydrogen</option>
                        <option value='Diesel'>Diesel</option>
                      </select>
                      <div className="form-control-message form-control-message--error">
                        {errorMessage[index]?.fuel_typeValidation}
                      </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                      <label htmlFor="car_brand" className="form-label goform-label">Car Brand</label>
                      <select onChange={(e) => onMutate(e, index, "car_brand")} id="car_brand" className="form-select goform-select goform-select-white" aria-label="star rating select">
                        <option value="" disabled selected>-- Select Car Brand --</option>
                        <option value='BMW'>BMW</option>
                        <option value='Mercy'>Mercy</option>
                        <option value='Land Rover'>Land Rover</option>
                        <option value='Porsche'>Porsche</option>
                        <option value='Rolls Royce'>Rolls Royce</option>
                      </select>
                      <div className="form-control-message form-control-message--error">
                        {errorMessage[index]?.car_brandValidation}
                      </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                      <label htmlFor="model" className="form-label goform-label">Model </label>
                      <select onChange={(e) => onMutate(e, index, "model")} id="model" className="form-select goform-select goform-select-white" aria-label="star rating select">
                        <option value="" disabled selected>-- Select Model --</option>
                        <option value='1 Series'>1 Series</option>
                        <option value='2 Series'>2 Series</option>
                      </select>
                      <div className="form-control-message form-control-message--error">
                        {errorMessage[index]?.modelValidation}
                      </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                      <label htmlFor="edition" className="form-label goform-label">Edition</label>
                      <select onChange={(e) => onMutate(e, index, "edition")} id="edition" className="form-select goform-select goform-select-white" aria-label="star rating select">
                        <option value="" disabled selected>-- Select Edition --</option>
                        <option value='1 1 6i 5dr'>1 1 6i 5dr</option>
                        <option value='1 1 5i 5dr'>1 1 5i 5dr</option>
                      </select>
                      <div className="form-control-message form-control-message--error">
                        {errorMessage[index]?.editionValidation}
                      </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                      <label htmlFor="transmission" className="form-label goform-label">Transmission</label>
                      <select onChange={(e) => onMutate(e, index, "transmission")} id="transmission" className="form-select goform-select goform-select-white" aria-label="star rating select">
                        <option value="" disabled selected>-- Select Transmission --</option>
                        <option value='Automatic'>Automatic</option>
                        <option value='Manual'>Manual</option>
                      </select>
                      <div className="form-control-message form-control-message--error">
                        {errorMessage[index]?.transmissionValidation}
                      </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                      <label htmlFor="aircon" className="form-label goform-label">Aircon :</label>
                      <select onChange={(e) => onMutate(e, index, "aircon")} id="aircon" className="form-select goform-select goform-select-white" aria-label="star rating select">
                        <option value="" disabled selected>-- Select Aircon --</option>
                        <option value={0}>Yes</option>
                        <option value={1}>No</option>
                      </select>
                      <div className="form-control-message form-control-message--error">
                        {errorMessage[index]?.airconValidation}
                      </div>
                    </div>
                    <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 company-detail__content-label'>
                      <label htmlFor="quantity" className="form-label goform-label">Quantity</label>
                      <input onChange={(e) => onMutate(e, index, "quantity")} type="number" placeholder='Enter your Quantity' className="form-control goform-input goform-input--active" id="quantity" aria-describedby="QuantityHelp" min={1} />
                      <div className="form-control-message form-control-message--error">
                        {errorMessage[index]?.quantityValidation}
                      </div>
                    </div>
                  </div>
                </div>
                {/* ... other form fields */}
              </div>
            ))}
            <div className="row">
              <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12"></div>
              <div className='add-location_button-list add-location_button-list--payment col-xl-8 col-lg-8 col-md-12 col-sm-12'>
                <div className='add-location__button-list-group'>
                  <button
                    type="button"
                    onClick={addNewCarForm}
                    className='add-fleet__button-car mb-5'
                  >
                    <BlurPlaceholderImage className='' alt='image' src={iconPlus} width={24} height={24} />
                    <p className="add-fleet__button-caption">Add another car</p>
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-4"></div>
              <div className="col-4"></div>
              <div className="col-3">
                <div className='add-location_button-list add-location_button-list--payment col-xl-8 col-lg-8 col-md-12 col-sm-12'>
                  <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#postModal">Complete registration</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="postModal" tabIndex={-1} aria-labelledby="postLabel" aria-hidden="true">
          <div className="modal-dialog admin-blog__modal">
            <div className="modal-content admin-blog__modal-body">
              <div className="admin-blog__modal-content">
                <div className="admin-blog__modal-image">
                  <BlurPlaceholderImage className='' alt='image' src={iconCheck} width={72} height={72} />
                </div>
                <div className="admin-blog__modal-text">
                  <h3 className="company-detail_content-title-heading company-detail_content-title-heading--popup">Mark this step as complete?</h3>
                  <p className="company-detail__content-caption--popup">Once marked as complete you will not be able to update the information until your registration is complete and your account is live.</p>
                </div>
              </div>
              <div className="admin-blog__modal-footer">
                <button type="button" className="btn btn-outline-secondary admin-blog__modal-button" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-success admin-blog__modal-button" data-bs-dismiss="modal">Yes, Complete step</button>
              </div>
            </div>
          </div>
        </div>

      </form>
    </Layout>
  );
}

export default AddFleet;
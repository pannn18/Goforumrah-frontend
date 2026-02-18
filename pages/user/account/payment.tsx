import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import UserLayout from '@/components/user/layout'
import React, { useEffect, useState } from 'react'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import Sidebar from '@/components/user/account/sidebar'
import { callAPI } from '@/lib/axiosHelper'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { RFHDate, RFHInput, RFHSelect } from '@/components/forms/fields'
import LoadingOverlay from '@/components/loadingOverlay/index'

interface PaymentData {
  id_customer_payment: number
  id_customer: number
  card_name: string
  card_number: string
  card_type: string
  expired_date: string
  cvv: string
  soft_delete: number
  created_at: string
  updated_at: string
}

const fieldShapes = {
  cardName: yup.string().required('Cardholder\'s name is required'),
  cardNumber: yup.string().required('Card number is required'),
  cardType: yup.string().required('Card type is required'),
  expiredDate: yup.string().required('Expiry Date is required'),
  cvv: yup.string().required('CVV/CVC is required')
}
const schema = yup.object().shape(fieldShapes)

const AccountPayment = () => {
  const { data: session, status } = useSession()

  const [paymentData, setPaymentData] = useState<PaymentData>()
  const [expiredDate, setExpiredDate] = useState<Date>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  const loadPaymentData = async () => {
    await Promise.all([
      new Promise(async (resolve, reject) => {
        try {
          const { ok, data, error } = await callAPI('/customer/payment/show', 'POST', { id_customer: session.user.id }, true)

          if (ok && data) {
            setPaymentData(data as PaymentData)
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

    loadPaymentData()
  }, [status])

  const setFormData = () => {
    if (!paymentData) return

    paymentData.card_name && setValue('cardName', paymentData.card_name)
    paymentData.card_number && setValue('cardNumber', paymentData.card_number)
    paymentData.card_type && setValue('cardType', paymentData.card_type)
    paymentData.expired_date && setValue('expiredDate', paymentData.expired_date)
    paymentData.cvv && setValue('cvv', paymentData.cvv)
  }
  

  const handleInputCardNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');

    // Format the card number with spaces every 4 characters
    let formattedValue = numericValue.replace(/(\d{4})/g, '$1 ');
  

    if (numericValue.length >= 16) {
      // If 16 or more characters are entered, prevent further input but allow deletion
      formattedValue = formattedValue.slice(0, 19); // Truncate to 16 characters
    }

    setValue('cardNumber', formattedValue)

    console.log('Payment Card Number Update : ', formattedValue);
  };
  
  const handleInputExpiredDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    let formattedValue;

    if (numericValue.length >= 5) {
      event.target.value = numericValue.slice(0, 5);
    } else {
      // Format the input as "MM / YY"
      let formattedValue = numericValue;

      if (numericValue.length > 2) {
        // Add a space after the first 2 characters
        formattedValue = numericValue.slice(0, 2) + ' / ' + numericValue.slice(2);
      }

      setValue('expiredDate', formattedValue)
    }

    console.log('Payment Expired Date Update : ', formattedValue);
  };

  useEffect(() => {
    setFormData()
  }, [paymentData])


  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onSubmit = async (values) => {
    setError('')

    // clearErrors(['expiredDate'])
    // if (!expiredDate) return setFieldError('expiredDate', { message: 'Expiry date is required', type: 'required' })

    const { cardName: card_name, cardNumber: card_number, cardType: card_type, expiredDate: expired_date, cvv } = getValues()
    const payload = {
      id_customer: session.user.id,
      card_name,
      card_number,
      card_type,
      expired_date,
      // expiredDate,
      cvv
    }

    setLoading(true)

    const { ok, status, error } = await callAPI('/customer/payment/update', 'POST', payload, true)

    if (ok) {
      await loadPaymentData()
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
          <Sidebar activeMenu='payment' />
          {loading ? (
            <LoadingOverlay />
          ) : (
            <form className="search-hotel__content" onSubmit={handleSubmit(onSubmit)}>
              <div className="manage-account__card">
                <div className="manage-account__header">
                  <h5>Payment details</h5>
                  <p className="manage-account__card-header-desc">Add or remove payment methods securely to make it easier when you order.</p>
                </div>
                <div className="manage-account__card-header-row">
                  <p className="manage-account__form-payment-text">Payment Details</p>
                  <div className="manage-account__form-icon">
                    <SVGIcon src={Icons.PaymentMastercard} width={32} height={24} />
                    <SVGIcon src={Icons.PaymentVisa} width={32} height={24} />
                    <SVGIcon src={Icons.PaymentAmex} width={32} height={24} />
                    <SVGIcon src={Icons.PaymentDci} width={32} height={24} />
                    <SVGIcon src={Icons.PaymentJcb} width={32} height={24} />
                    <SVGIcon src={Icons.PaymentDiscover} width={32} height={24} />
                  </div>
                </div>
                <div className="manage-account__form">
                  <div className="booking-hotel__payment-block w-100">
                    <label htmlFor="personal-payment-cardHolder">Cardholder's Name</label>
                    <RFHInput customClasses='' register={register('cardName')} type="text" placeholder="Enter Cardholder name" error={errors.cardName?.message.toString()} />
                  </div>
                  <div className="booking-hotel__payment-block w-100">
                    <label htmlFor="personal-payment-cardNumber">Card number</label>
                    <RFHInput customClasses='' register={register('cardNumber')} type="text" placeholder="0000 0000 0000 0000" error={errors.cardNumber?.message.toString()} onInput={handleInputCardNumberChange}/>
                  </div>
                  <div className="booking-hotel__payment-block w-100">
                    <label htmlFor="personal-payment-cardType">Card Type</label>
                    <RFHSelect
                      register={register('cardType')}
                      customClasses='w-100'
                      onChange={(e) => setValue('cardType', e.target.value, { shouldValidate: true })}
                    >
                      <option value="Credit Card">Credit Card</option>
                      <option value="Debit Card">Debit Card</option>
                      <option value="Regular Bank">Regular Bank</option>
                    </RFHSelect>
                  </div>
                  <div className="booking-hotel__payment-row w-100">
                    <div className="booking-hotel__payment-block w-100">
                      <label htmlFor="personal-payment-expiryDate">Expiry Date</label>
                      <RFHInput customClasses='' register={register('expiredDate')} type="text" placeholder="MM/YY" error={errors.expiredDate?.message.toString()} onInput={handleInputExpiredDate} maxLength={7}/>
                    </div>
                    <div className="booking-hotel__payment-block w-100">
                      <label htmlFor="personal-payment-cvv">CVV/CVC</label>
                      <RFHInput customClasses='' register={register('cvv')} type="text" placeholder="000" error={errors.cvv?.message.toString()} maxLength={3} />
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

export default AccountPayment
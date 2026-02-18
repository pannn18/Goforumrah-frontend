import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { RFHInput, RFHSelect, RFHSelectAndInput } from '@/components/forms/fields'
import alertInfo from '@/assets/images/alert_info.svg'
import { Icons } from '@/types/enums'

interface Layout {
  roomName?: string
  roomType?: string
  roomNumber?: number
  smokingPolicy?: string
  maxGuest?: number
  roomSize?: number
  price?: number
  beds?: { type: string, amount: number }[]
  roomSizeType?: string
  priceType?: string
}

interface IProps {
  data: Layout,
  onCancel: () => void
  onActiveLayoutUpdate: (layout: Layout) => void
}

const LayoutForm = ({ data, onCancel, onActiveLayoutUpdate }: IProps) => {
  const fieldShapes = {
    roomName: yup.string().required('Room name is required'),
    roomType: yup.string().required('Room type is required'),
    roomNumber: yup.number().min(1).required('Number of room is required'),
    smokingPolicy: yup.string().required('Smoking policy is required'),
    maxGuest: yup.number().required('Max guest is required'),
    roomSize: yup.number().required('Room size is required'),
    price: yup.number().required('Price is required'),
  }

  const schema = yup.object().shape(fieldShapes)

  const [beds, setBeds] = useState<{ type: string, amount: number }[]>([{ type: '', amount: 1 }])
  const [roomSizeType, setRoomSizeType] = useState<string>('Square per meter')
  const [priceType, setPriceType] = useState<string>('$ / Per night')

  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { register, handleSubmit, reset, formState: { errors, isValid }, getValues, setValue, clearErrors, setError: setFieldError } = useForm({ resolver: yupResolver(schema) })

  // Submit and validate whether is valid or invalid
  // We will need more logic because of step method & grouped form
  const onFormSubmit = async (values) => {
    setError('')

    if (Object.keys(errors).length) return

    const {
      roomName,
      roomType,
      roomNumber,
      smokingPolicy,
      maxGuest,
      roomSize,
      price
    } = getValues()

    const updatedLayout = {
      roomName,
      roomType,
      roomNumber,
      smokingPolicy,
      maxGuest,
      roomSize,
      price,
      beds,
      roomSizeType,
      priceType,
    }

    onActiveLayoutUpdate(updatedLayout)
  }

  useEffect(() => {
    setValue('roomName', data.roomName)
    setValue('roomType', data.roomType)
    setValue('roomNumber', data.roomNumber)
    setValue('smokingPolicy', data.smokingPolicy)
    setValue('maxGuest', data.maxGuest)
    setValue('roomSize', data.roomSize)
    setValue('price', data.price)
    setBeds(data.beds)
  }, [data])


  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className='hotel-registration__content-form'>
        <p className='hotel-registration__content-form-title'>Room Type</p>
        <div className='goform-group row'>
          <div className='col-xl-6'>
            <label className="form-label goform-label">Room name</label>
            <RFHSelect
              register={register('roomName')}
              onChange={(e) => setValue('roomName', e.target.value, { shouldValidate: true })}
              error={errors.roomName?.message.toString()}
            >
              <option value={''}>Select your room name</option>
              <option value={'Budget Double or Twin Room'}>Budget Double or Twin Room</option>
              <option value={'Cabin on Boat'}>Cabin on Boat</option>
              <option value={'Deluxe Double or Twin Room'}>Deluxe Double or Twin Room</option>
              <option value={'Deluxe Double or Twin Room with Balcony'}>Deluxe Double or Twin Room with Balcony</option>
              <option value={'Deluxe Double or Twin Room with City View'}>Deluxe Double or Twin Room with City View</option>
              <option value={'Deluxe Double or Twin Room with Garden View'}>Deluxe Double or Twin Room with Garden View</option>
              <option value={'Deluxe Double or Twin Room with Lake View'}>Deluxe Double or Twin Room with Lake View</option>
              <option value={'Deluxe Double or Twin Room with Mountain View'}>Deluxe Double or Twin Room with Mountain View</option>
              <option value={'Deluxe Double or Twin Room with Ocean View'}>Deluxe Double or Twin Room with Ocean View</option>
              <option value={'Deluxe Double or Twin Room with Pool Access'}>Deluxe Double or Twin Room with Pool Access</option>
              <option value={'Deluxe Double or Twin Room with Pool View'}>Deluxe Double or Twin Room with Pool View</option>
              <option value={'Deluxe Double or Twin Room with River View'}>Deluxe Double or Twin Room with River View</option>
              <option value={'Deluxe Double or Twin Room with Sea View'}>Deluxe Double or Twin Room with Sea View</option>
              <option value={'Deluxe Double or Twin Room with Spa Bath'}>Deluxe Double or Twin Room with Spa Bath</option>
              <option value={'Double or Twin Room'}>Double or Twin Room</option>
              <option value={'Double or Twin Room - Disability Access '}>Double or Twin Room - Disability Access </option>
              <option value={'Double or Twin Room with Balcony '}>Double or Twin Room with Balcony </option>
              <option value={'Double or Twin Room with Bathroom '}>Double or Twin Room with Bathroom </option>
              <option value={'Double or Twin Room with Canal View '}>Double or Twin Room with Canal View </option>
              <option value={'Double or Twin Room with City View'}>Double or Twin Room with City View</option>
            </RFHSelect>
          </div>
          <div className='col-xl-6'>
            <label className="form-label goform-label">Room type</label>
            <RFHSelect
              register={register('roomType')}
              onChange={(e) => setValue('roomType', e.target.value, { shouldValidate: true })}
              error={errors.roomType?.message.toString()}
            >
              <option value={''}>Select your room type</option>
              <option value={'Single'}>Single</option>
              <option value={'Double'}>Double</option>
              <option value={'Twin'}>Twin</option>
              <option value={'Twin/Double'}>Twin/Double</option>
              <option value={'Triple'}>Triple</option>
              <option value={'Quad'}>Quad</option>
              <option value={'Family'}>Family</option>
              <option value={'Suite'}>Suite</option>
            </RFHSelect>
          </div>
        </div>
        <div className='goform-group row'>
          <div className='col-xl-6'>
            <label htmlFor="numberRoom" className="form-label goform-label">Number of room <span className='goform-label__caption'>(of this type)</span></label>
            <RFHInput register={register('roomNumber')} type="number" min={1} placeholder="00" error={errors.roomNumber?.message.toString()} />
          </div>
          <div className='col-xl-6'>
            <label htmlFor="smookingPolicy" className="form-label goform-label">Smoking policy</label>
            <RFHSelect
              register={register('smokingPolicy')}
              onChange={(e) => setValue('smokingPolicy', e.target.value, { shouldValidate: true })}
              error={errors.smokingPolicy?.message.toString()}
            >
              <option value={''}>Select type</option>
              <option value={'Non-smoking'}>Non-smoking</option>
              <option value={'Smoking'}>Smoking</option>
              <option value={'I have both smoking and non-smoking options for this room type'}>I have both smoking and non-smoking options for this room type</option>
            </RFHSelect>
          </div>
        </div>
      </div>
      <div className='hotel-registration__content-form'>
        <p className='hotel-registration__content-form-title'>Bed Option</p>
        <div className='goform-alert hotel-registration__content-alert'>
          <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
          <p>Tell us only about the existing beds in a room (don't include extra beds).</p>
        </div>
        {beds.map(({ type, amount }, index) => (
          <div key={`bed-option-${index}`} data-form="bed-option" className='goform-group row'>
            <div className='col-xl'>
              <label htmlFor="bedType" className="form-label goform-label">What kind of beds are available in this room?</label>
              <RFHSelect
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setBeds(beds.map((bed, bedIndex) => bedIndex === index ? { type: e.target.value, amount: bed.amount } : bed))
                }}
                value={type}
              >
                <option value={''}>Select your bed type</option>
                <option value={'Single Bed'}>Single Bed</option>
                <option value={'Double Bed'}>Double Bed</option>
                <option value={'Queen Size Bed'}>Queen Size Bed</option>
                <option value={'King Size Bed'}>King Size Bed</option>
              </RFHSelect>
            </div>
            <div className='col-xl'>
              <label htmlFor="smookingPolicy" className="form-label goform-label">How many bed in the room?</label>
              <RFHSelect
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setBeds(beds.map((bed, bedIndex) => bedIndex === index ? { type: bed.type, amount: parseInt(e.target.value) } : bed))
                }}
                value={amount}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </RFHSelect>
            </div>
            {index !== beds.length - 1 && (
              <div className='col-xl-auto'>
                <div
                  onClick={() => setBeds(beds.filter((_, bedIndex) => bedIndex !== index))}
                  style={{ cursor: 'pointer', marginTop: 44 }}>
                  <SVGIcon src={Icons.Trash} width={22} height={22} color='#CA3232' />
                </div>
              </div>
            )}
          </div>
        ))}
        <div className='goform-group'>
          <button
            onClick={() => setBeds([...beds, { type: '', amount: 1 }])}
            type="button" className='button goform-button goform-button--outline-green'>+ Add another bed</button>
        </div>
        <div className='goform-group'>
          <label htmlFor="guestCount" className="form-label goform-label">How many guests can stay in this room?</label>
          <RFHInput register={register('maxGuest')} type="number" min={1} max={8} placeholder="1" defaultValue={1} error={errors.maxGuest?.message.toString()} />
        </div>
      </div>
      <div className='hotel-registration__content-form'>
        <p className='hotel-registration__content-form-title'>Room Size</p>
        <label className="form-label goform-label">Room Size</label>
        <RFHSelectAndInput
          selectOptions={[{ value: 'Square per meter', label: 'Square per meter' }]}
          selectValue={roomSizeType} selectOnChange={(e) => setRoomSizeType(e.target.value || null)} register={register('roomSize')} type="number" min={0} placeholder="00" error={errors.roomSize?.message.toString()} />
      </div>
      <div className='hotel-registration__content-form'>
        <p className='hotel-registration__content-form-title'>Price</p>
        <div className='goform-alert hotel-registration__content-alert'>
          <BlurPlaceholderImage className='goform-alert-image' alt='image' src={alertInfo} width={28} height={28} />
          <p>This is the lowest price that we automatically apply to this room for all dates. Before your property goes live, you can set seasonal pricing on your property dashboard.</p>
        </div>
        <label className="form-label goform-label">Price</label>
        <RFHSelectAndInput
          selectOptions={[{ value: '$ / Per night', label: '$ / Per night' }]}
          selectValue={priceType} selectOnChange={(e) => setPriceType(e.target.value || null)} register={register('price')} type="number" min={0} placeholder="00" error={errors.price?.message.toString()} />
      </div>
      <div className='hotel-registration__button-list hotel-registration__button-list--draft'>
        <div>
          {error && (
            <div className="d-flex flex-column align-items-stretch text-danger-main">
              {error}
            </div>
          )}
        </div>
        <div className='hotel-registration__button-list-group'>
          <button
            onClick={() => onCancel()}
            type='button' className='button goform-button goform-button--outline-green goform-button--large-text hotel-registration__button-list-item'>Cancel</button>
          <button type='submit' className='button goform-button goform-button--fill-green goform-button--large-text hotel-registration__button-list-item' disabled={loading}>{loading ? 'Please wait...' : 'Continue'}</button>
        </div>
      </div>
    </form>
  )
}

export default LayoutForm
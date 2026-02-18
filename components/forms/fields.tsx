import React, { useState } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import SVGIcon from '../elements/icons'
import { Icons } from '@/types/enums'
import DropdownMenu from '../elements/dropdownMenu'
import { Calendar } from 'react-date-range'
import moment from 'moment'

interface RFHInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn
  error?: string
  success?: string
  info?: string
  customClasses?: string
}

export const RFHInput = ({ register, error, success, info, customClasses, ...props }: RFHInputProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const isPasswordField = props?.type === 'password'

  return (
    <div className="form-control-wrapper">
      <div className={`form-control-field ${isPasswordField ? 'form-control-field--has-icon' : ''} ${error ? 'form-control-field--error' : (success ? 'form-control-field--success' : '')}`}>
        <input {...props} {...register} type={isPasswordField ? (open ? 'text' : 'password') : props?.type} className={`${customClasses !== undefined ? customClasses : 'form-control'}`} />

        {isPasswordField && (
          <div onClick={() => setOpen(prevState => !prevState)} className="form-control-icon">
            <SVGIcon src={open ? Icons.EyeSlash : Icons.Eye} width={20} height={20} />
          </div>
        )}
      </div>

      {error ? (
        <div className="form-control-message form-control-message--error">{error}</div>
      ) : (success ? (
        <div className="form-control-message form-control-message--success">{success}</div>
      ) : (info && (
        <div className="form-control-message">{info}</div>
      )))}
    </div>
  )
}

interface RFHSelectAndInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectValue: any
  selectOnChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  selectOptions: { value: any, label: any }[]
  register?: UseFormRegisterReturn
  error?: string
  success?: string
  info?: string
  customClasses?: string
}

export const RFHSelectAndInput = ({ selectValue, selectOnChange, selectOptions, register, error, success, info, customClasses, ...props }: RFHSelectAndInputProps) => {
  return (
    <div className="form-control-wrapper">
      <div className={`form-control-field form-control-select-and-input ${error ? 'form-control-field--error' : (success ? 'form-control-field--success' : '')}`}>
        <div className="form-control-select">
          <select
            value={selectValue}
            onChange={selectOnChange}>
            {selectOptions.map(({ value, label }, index) => (
              <option data-test={`${register?.name || 'select'}-option-${index}`} key={`${register.name}-option-${index}`} value={value}>{label}</option>
            ))}
          </select>
          <div className={`form-control-selected ${selectValue ? 'has-value' : ''}`}>{selectValue}</div>
        </div>
        <input {...props} {...register} className={`${customClasses !== undefined ? customClasses : 'form-control'}`} />
      </div>

      {error ? (
        <div className="form-control-message form-control-message--error">{error}</div>
      ) : (success ? (
        <div className="form-control-message form-control-message--success">{success}</div>
      ) : (info && (
        <div className="form-control-message">{info}</div>
      )))}
    </div>
  )
}

interface RFHTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  register?: UseFormRegisterReturn
  error?: string
  success?: string
  info?: string
  customClasses?: string
}

export const RFHTextarea = ({ register, error, success, info, customClasses, ...props }: RFHTextareaProps) => {
  return (
    <div className="form-control-wrapper">
      <div className={`form-control-field ${error ? 'form-control-field--error' : (success ? 'form-control-field--success' : '')}`}>
        <textarea {...props} {...register} className={`${customClasses !== undefined ? customClasses : 'form-control'}`} />
      </div>

      {error ? (
        <div className="form-control-message form-control-message--error">{error}</div>
      ) : (success ? (
        <div className="form-control-message form-control-message--success">{success}</div>
      ) : (info && (
        <div className="form-control-message">{info}</div>
      )))}
    </div>
  )
}

interface RFHSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  register?: UseFormRegisterReturn
  error?: string
  success?: string
  info?: string
  customClasses?: string
  children: React.ReactNode
}

export const RFHSelect = ({ register, error, success, info, customClasses, children, ...props }: RFHSelectProps) => {
  return (
    <div className="form-control-wrapper">
      <div className={`form-control-field form-control-field--has-icon ${error ? 'form-control-field--error' : (success ? 'form-control-field--success' : '')}`}>
        <select {...props} {...register} className={`${customClasses !== undefined ? customClasses : 'form-control'}`} >
          {children}
        </select>
      </div>

      {error ? (
        <div className="form-control-message form-control-message--error">{error}</div>
      ) : (success ? (
        <div className="form-control-message form-control-message--success">{success}</div>
      ) : (info && (
        <div className="form-control-message">{info}</div>
      )))}
    </div>
  )
}

interface RFHDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
  date: Date
  onDateChange: (date: Date) => void
  register?: UseFormRegisterReturn
  error?: string
  success?: string
  info?: string
  customClasses?: string
}

export const RFHDate = ({ date, onDateChange, register, error, success, info, customClasses, ...props }: RFHDateProps) => {
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false)

  return (
    <div className="custom-dropdown">
      <div className="form-control-wrapper" onClick={() => setShowDateDropdown(true)}>
        <div className={`form-control-field form-control-field--has-icon ${error ? 'form-control-field--error' : (success ? 'form-control-field--success' : '')}`}>
          <input {...props} {...register} type="text" className={`${customClasses !== undefined ? customClasses : 'form-control'}`} value={date ? moment(date).format('DD / MM / YY') : ''} readOnly />
          <div className="form-control-icon">
            <SVGIcon src={Icons.Calendar} color="#1CB78D" width={20} height={20} />
          </div>
        </div>

        {error ? (
          <div className="form-control-message form-control-message--error">{error}</div>
        ) : (success ? (
          <div className="form-control-message form-control-message--success">{success}</div>
        ) : (info && (
          <div className="form-control-message">{info}</div>
        )))}
      </div>
      <DropdownMenu show={showDateDropdown} setShow={setShowDateDropdown} style={{ overflow: 'hidden' }}>
        <Calendar
          date={date}
          onChange={onDateChange}
        />
      </DropdownMenu>
    </div>
  )
}

import React, { useState, useEffect, useRef, forwardRef } from 'react'
import { Icons, Images } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import SVGIcon from '@/components/elements/icons'
import Link from 'next/link'
import Image from 'next/image';
import logoText from '@/assets/images/logo_text.svg';
import logoTextDark from '@/assets/images/logo_text_dark.svg';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/router'

interface IProps {
  data: any;
  bookingDetailData?: any;
  bookingPaymentData?: any;
}
const BookingConfirmation = (props: IProps) => {
  const data = props;
  const router = useRouter()
  // console.log("data BookingConfrimation / Completed index : ", data)

  return (
    <>
      <div className="container" >
        <div className="loyalty-checkout__confirmation">
          <div className="loyalty-checkout__confirmation-heading">
            <div className="loyalty-checkout__confirmation-heading-icon">
              <SVGIcon src={Icons.CheckRounded} width={48} height={48} />
            </div>
            <div className="loyalty-checkout__confirmation-heading-text">
              <p className="loyalty-checkout__confirmation-heading-text--name">Thanks, John!</p>
              <h4>Loyalty Program is Active</h4>
            </div>
          </div>
          <div className="loyalty-checkout__confirmation-card">
            <div className="loyalty-checkout__confirmation-card-heading">
              <BlurPlaceholderImage src={logoTextDark} alt={'Brand Logo'} width={146} height={26} />
              <p>Loyalty Program</p>
            </div>
            <div className='loyalty-checkout__confirmation-card-body'>
              <h5>Standard Plus</h5>
              <p>Book flights to a destination popular with travelers from Indonesia</p>
            </div>
          </div>
          <button className='btn btn-outline-success' onClick={() => {router.push('/')}}>Back To Home</button>
        </div>
      </div>

    </>
  )
}



export default BookingConfirmation
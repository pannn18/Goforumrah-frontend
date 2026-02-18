import React, { useState, useEffect } from 'react'
import { Icons, Images } from '@/types/enums'
import SVGIcon from '@/components/elements/icons'
import { BlurPlaceholderImage } from '@/components/elements/images'
import brandLogo from '@/assets/images/logo_text_dark.svg'

const LoyaltyCheckoutSummary = () => {
  return (
    <div className="loyalty-checkout__summary">
      <div className="loyalty-checkout__summary-heading">
        <BlurPlaceholderImage src={brandLogo} alt={'Brand Logo'} width={146} height={26} />
        <p>Loyalty Program</p>
      </div>
      <div className='loyalty-checkout__summary-body'>
        <h5>Standard Plus</h5>
        <p>Book flights to a destination popular with travelers from Indonesia</p>
      </div>
    </div>
  )
}

export default LoyaltyCheckoutSummary
import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { Icons, Images } from '@/types/enums'
import logoText from '@/assets/images/logo_text_dark.svg';
import Layout from '@/components/layout'
import SVGIcon from '@/components/elements/icons'


export default function Home() {
  return (
    <div className="coming">
      <ComingSoonHeader />
      <div className="container">
        <ComingSoon />
      </div>
      <ComingSoonFooter />
    </div>    
  )
}

const ComingSoonHeader = () => {
  return (
    <div className="coming__header">
      <Image src={logoText} alt="GoForUmrah" height={26} />
    </div>
  )
}

const ComingSoon = () => {
  return (
    <div className="coming__content">
      <div className="coming__top">
        <div className="coming__top-icon">
          <SVGIcon src={Icons.SandClock} height={60} width={60} />
        </div>
        <h1>We’re Launching Soon</h1>
        <p className="coming__top-subtitle">We’re currently  still working on this. Subcribe our Newsletter to get update when it will be live.</p>
      </div>
      <form action="#" className="coming__form">
        <div className="coming__form-group">
          <label htmlFor="emailAddress">Email Address</label>
          <input className="coming__form-input" type="email" name="emailAddress" id="emailAddress" placeholder="Enter your email address" />
        </div>
        <button className="btn btn-success">Subscribe</button>
      </form>
    </div>
  )
}

const ComingSoonFooter = () => {
  return (
    <div className="coming__footer">
      <p>© 2023 Goforumrah LLC All rights reserved.</p>
    </div>
  )
}
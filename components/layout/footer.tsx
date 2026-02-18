import React from 'react'
import Image from 'next/image';
import { Icons } from '@/types/enums';
import SVGIcon from '@/components/elements/icons';
import logoText from '@/assets/images/logo_text.svg';
import Link from 'next/link';

interface IProps {
  children?: React.ReactNode
}

const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
}

const Footer = (props: IProps) => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="row gx-4 footer-content-top ">
          <div className="col-4 col-md">
            <div className="footer-menu">
              <h5 className="footer-menu__title">Explore</h5>
              <div className="footer-menu__links">
                <Link href="/search/hotel">Hotels</Link>
                <Link href="/search/flights">Flights</Link>
                <Link href="/search/book-transfer">Transfers</Link>
                <Link href="/search/tour-package">Packages</Link>
                <Link href="#">Shopping</Link>
                <Link href="/loyalty">Loyalty</Link>
              </div>
            </div>
          </div>
          <div className="col-4 col-md">
            <div className="footer-menu">
              <h5 className="footer-menu__title">About Us</h5>
              <div className="footer-menu__links">
                <Link href="#">About Us</Link>
                <Link href="/partnership">B2B Travel Platform</Link>
                <Link href="https://goforumrah.com/business/hotel/login">Register Hotel</Link>
                <Link href="#">Travel Agent</Link>
                <Link href="/blog">Blogs</Link>
              </div>
            </div>
          </div>
          <div className="col-4 col-md">
            <div className="footer-menu">
              <h5 className="footer-menu__title">Helps</h5>
              <div className="footer-menu__links">
                <Link href="/contact-us">Help</Link>
                <Link href="#">Privacy Settings</Link>
                <Link href="#">Security</Link>
              </div>
            </div>
          </div>
          <div className='footer-content-top--separator'></div>
          <div className="col col-md-5">
            <div className="footer-menu subscribe-wrap">
              <h5 className="footer-menu__title">Join Our Newsletter</h5>
              <div>
                <div>Sign up and we'll send the best deals to you</div>
                <form onSubmit={handleSubscribe} className="subscribe-form">
                  <input className="form-control" type="email" placeholder="Enter your email here" />
                  <button className="btn btn-success" type="submit">Subscribe</button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-content-middle">
          <div>
            <div className="footer-brand">
              <Image src={logoText} alt="GoForUmrah" height={40} />
            </div>
            <div>© 2024 Powered by alfursaangroup.com - All rights reserved.</div>
          </div>
          <div className="socials">
            <Link href="#">
              <SVGIcon src={Icons.Instagram} width={24} height={24} />
            </Link>
            <Link href="#">
              <SVGIcon src={Icons.Facebook} width={24} height={24} />
            </Link>
            <Link href="#">
              <SVGIcon src={Icons.Twitter} width={24} height={24} />
            </Link>
            <Link href="#">
              <SVGIcon src={Icons.Youtube} width={24} height={24} />
            </Link>
          </div>
        </div>
        <div className="footer-content-bottom">
          <Link href="#">How the site works</Link>
          <Link href="#">Cookie consent</Link>
          <Link href="#">Site Map</Link>
          <Link href="/terms">Terms of Use</Link>
          <Link href="/privacy">Privacy and Cookies Statement</Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
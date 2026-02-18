import React, { useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { CareerPageSearchBar } from '@/components/pages/home/searchBar'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import ArticleCard from '@/components/cards/articleCard'
import headerCoverCareer from '@/assets/images/hero_career_cover.png'


const Career = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />

      <main className="career">
        <CareerHero />
        <CareerTags />
        <div className="container container-content">
          <CareerSideContent />
          <CareerMainContent />
        </div>
      </main>

      <Footer />
      <ShareModal />
    </Layout>
  )
}

const CareerHero = () => {
  return (
    <header className="career__header">
      <div className="career__header-bg">
        <BlurPlaceholderImage src={headerCoverCareer} alt="Blog Cover Image" />  {/* <Image src={cover} alt={title} width={1440} placeholder="blur" blurDataURL={Images.Placeholder} /> */}
        <div className="career__header-bg-overlay-shadow" />
      </div>
      <div className="container">
        <div className="career__header-content">

          <h1 className="heading">Lets start your new journey with us</h1>
          <p className="subheading">Opening up opportunities to connect, grow and join our team</p>
        </div>
      </div>
      <div className="career__header-form">
        <div className="container container-search-career">
          <CareerPageSearchBar />
        </div>
      </div>
    </header>
  )
}

const CareerTags = () => {
  return (
    <div className="container container-tags-career">
      <div className="career__option">
        <div className="career__option-skill">
          <p className="career__option-skill-header">Select Skills</p>
          <div className="career__option-skill-list">
            <div className="career__option-skill-tags">Prototyping</div>
            <div className="career__option-skill-tags">Customer Service</div>
            <div className="career__option-skill-tags">Marketing</div>
            <div className="career__option-skill-tags">CRM</div>
            <div className="career__option-skill-tags">Frontend Developer</div>
            <div className="career__option-skill-tags">Coding</div>
            <div className="career__option-skill-tags">Product Development</div>
            <div className="career__option-skill-tags">Product Marketing</div>
            <div className="career__option-skill-tags">Human Resource</div>
          </div>
        </div>
        <div className="search-bar__separator"></div>
        <div className="career__option-team">
          <p className="career__option-team-header">Team</p>
          <div className="career__option-team-list">
            <div className="career__option-team-tags">Customer Service</div>
            <div className="career__option-team-tags">Support</div>
            <div className="career__option-team-tags">Data Science</div>
            <div className="career__option-team-tags">Engineering</div>
            <div className="career__option-team-tags">Finance</div>
            <div className="career__option-team-tags">Leadership</div>
            <div className="career__option-team-tags">Product</div>
          </div>
        </div>
      </div>
    </div>

  )
}

const CareerMainContent = () => {
  return (
    <div className="career__main-content-wrapper">
      <div className="career__main-content">
        <div className="career__main-content-top">
          <div className="career__main-content-top-header">
            <p >ID : 1000000</p>
            <h3>Senior HR Business partner</h3>
            <div className="career__main-content-top-location">
              <SVGIcon src={Icons.MapPinOutline} width={20} height={20} />
              <p>Amsterdam, Netherland</p>
            </div>
          </div>
          <div className="career__main-content-top-action">
            <a href="mailto:development@1smartmedia.com" className='btn btn-md btn-success'>Apply Now</a>
            <button className='btn btn-md btn-outline-success' data-bs-toggle="modal" data-bs-target="#shareModal">Share</button>
          </div>
        </div>
        <div className="career__main-content-job">
          <div className="career__main-content-job-description">
            <h5>Job Description</h5>
            <p className="career__main-content-job-description">GoForUmrah is the world’s #1 accommodation site and the 3rd largest global e-commerce player. Our diverse team, ~12,000 strong, is united by a single mission: to empower people to experience the world. Whether in our Saudi Arabia HQ or at one of our 200 offices worldwide, we work hard to help make more than a million travel dreams come true every single day.<br />
              With strategic long-term investments into what we believe the future of travel can be, we are opening career opportunities within our People Teams that will have a strong impact on our mission.<br />
              We believe that the passion and talent of our employees is our strength – it is what drives us towards outstanding performance. We offer a dynamic, motivating and ever changing work environment. A culture that is open, innovative and performance orientated. Our scale and scope, commitment to people and high standards of integrity make GoForUmrah.com a great place to work.<br />
              We are looking for an experienced HR Business Partner to strengthen the existing HR team. You will provide HR advice and support to the HR Advisory and Talent Acquisition functions (essentially in a HR4HR capacity) in the head office of GoForUmrah.com in Saudi Arabia.<br />
              You will provide both operational and tactical HR support to the line managers and the employees within your accounts, with a proactive approach, able to perform a wide variety of tasks and be passionate about adding value to your business partners.<br />
              This is a fast paced role and in an exciting environment where you will need to be comfortable and competent to manage and support through change.</p>
          </div>
          <div className="career__main-content-job-separate">
            <div className="career__main-content-job-responsibilities">
              <h5>Key Responsibilities</h5>
              <div>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Be the trusted advisor for your stakeholders, providing expert advice, guidance and coaching to managers in all aspects of HR (for instance recruitment, L&D, compensation & benefits)</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Handle some operational issues such as prolonged absence and performance management and disciplinary procedures within your accounts</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Develop and execute training and development in order to support business needs and empower management</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Be pro-active in identifying people issues and trends within the business and work together with your key stakeholders in order to formulate and implement solutions</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Work closely with your business partnering team,and broader HR colleagues, to contribute to HR projects, and provide ideas and suggestions</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Keep up to date with legal requirements for your accounts, providing suggestions for changes</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Own the ‘best place to work’ topic.</li>
                </ul>
              </div>
            </div>
            <div className="career__main-content-job-requirements">
              <h5>Requirements:</h5>
              <div>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">5+ years of experience with HR within an international company</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Your experience should include 3+ years of HR Advisory or business partnering</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Previous experience in a commercial environment</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Excellent communication and influencing skills</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Able to develop strong relationships and influence a wide range of stakeholders within the organisation</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Proactive, data-driven, takes initiative, able to multi-task and prioritise without close supervision</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Flexible and able to cope well with change and complexity</li>
                </ul>
                <ul className="tour-details__special-location-block-item">
                  <li className="tour-details__special-location-block-item">Fluent in English</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="career__main-content-job-description">
            <h5>Pre-Employment Screening:</h5>
            <p className="career__main-content-job-description">If your application is successful, your personal data may be used for a pre-employment screening check by a third party as permitted by applicable law. Depending on the vacancy and applicable law, a pre-employment screening may include employment history, education and other information (such as media information) that may be necessary for determining your qualifications and suitability for the position.</p>
          </div>
        </div>
      </div>
      <div className="career__main-content-bottom">
        <h4>Similar Job</h4>
        <div className="career__main-content-bottom-job">
          <div className="career__bottom-content-item">
            <div className="career__bottom-content-item-header">
              <p className="career__bottom-content-item-header">HR Business Partner II (Fintech)</p>
              <div className="career__bottom-content-item-location">
                <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
                <p className="career__bottom-content-item-location">Jeddah, Saudi Arabia</p>
              </div>
            </div>
            <div className="career__option-team-tags">Engineering</div>
          </div>
          <div className="career__bottom-content-item">
            <div className="career__bottom-content-item-header">
              <p className="career__bottom-content-item-header">HR Business Partner I</p>
              <div className="career__bottom-content-item-location">
                <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
                <p className="career__bottom-content-item-location">Manchecster, United Kingdom</p>
              </div>
            </div>
            <div className="career__option-team-tags">Engineering</div>
          </div>
          <div className="career__bottom-content-item">
            <div className="career__bottom-content-item-header">
              <p className="career__bottom-content-item-header">Lead Executive Business Partner</p>
              <div className="career__bottom-content-item-location">
                <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
                <p className="career__bottom-content-item-location">Manchecster, United Kingdom</p>
              </div>
            </div>
            <div className="career__option-team-tags">Engineering</div>
          </div>
        </div>
      </div>
    </div>


  )
}

const CareerSideContent = () => {
  return (
    <div className="career__side-content-wrap">
      <div className="career__side-content">
        <div className="career__side-content-item active">
          <div className="career__side-content-item-header">
            <p className="career__side-content-item-header">Senior HR Business Partner</p>
            <div className="career__side-content-item-location">
              <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
              <p className="career__side-content-item-location">Amsterdam, Netherland</p>
            </div>
          </div>
          <p className="career__side-content-item-desc">Engineering</p>
        </div>
        <div className="career__side-content-item">
          <div className="career__side-content-item-header">
            <p className="career__side-content-item-header">Senior HR Business Partner</p>
            <div className="career__side-content-item-location">
              <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
              <p className="career__side-content-item-location">Amsterdam, Netherland</p>
            </div>
          </div>
          <p className="career__side-content-item-desc">Engineering</p>
        </div>
        <div className="career__side-content-item">
          <div className="career__side-content-item-header">
            <p className="career__side-content-item-header">Senior HR Business Partner</p>
            <div className="career__side-content-item-location">
              <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
              <p className="career__side-content-item-location">Amsterdam, Netherland</p>
            </div>
          </div>
          <p className="career__side-content-item-desc">Engineering</p>
        </div>
        <div className="career__side-content-item">
          <div className="career__side-content-item-header">
            <p className="career__side-content-item-header">Senior HR Business Partner</p>
            <div className="career__side-content-item-location">
              <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
              <p className="career__side-content-item-location">Amsterdam, Netherland</p>
            </div>
          </div>
          <p className="career__side-content-item-desc">Engineering</p>
        </div>
        <div className="career__side-content-item">
          <div className="career__side-content-item-header">
            <p className="career__side-content-item-header">Senior HR Business Partner</p>
            <div className="career__side-content-item-location">
              <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
              <p className="career__side-content-item-location">Amsterdam, Netherland</p>
            </div>
          </div>
          <p className="career__side-content-item-desc">Engineering</p>
        </div>
        <div className="career__side-content-item">
          <div className="career__side-content-item-header">
            <p className="career__side-content-item-header">Senior HR Business Partner</p>
            <div className="career__side-content-item-location">
              <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
              <p className="career__side-content-item-location">Amsterdam, Netherland</p>
            </div>
          </div>
          <p className="career__side-content-item-desc">Engineering</p>
        </div>
        <div className="career__side-content-item">
          <div className="career__side-content-item-header">
            <p className="career__side-content-item-header">Senior HR Business Partner</p>
            <div className="career__side-content-item-location">
              <SVGIcon src={Icons.MapPinOutline} width={16} height={16} />
              <p className="career__side-content-item-location">Amsterdam, Netherland</p>
            </div>
          </div>
          <p className="career__side-content-item-desc">Engineering</p>
        </div>
      </div>
      <div className="career__side-content-action">
        <a type="button" href="#" className="career__side-content-action-desc">Load More</a>
        <SVGIcon src={Icons.ArrowDown} width={16} height={16} />
      </div>
    </div>
  )
}

const ShareModal = () => {
  return (
    <div className="modal fade" id="shareModal" tabIndex={-1} aria-labelledby="newMessageModalLabel" aria-hidden="true">
      <div className="modal-dialog cancelation__modal career__modal">
        <div className="modal-content career__modal-wrapper">
          <div className="career__modal-header">
            <h4>Share</h4>
            <button data-bs-dismiss="modal" type="button" className='career__modal-header-btn'>
              <SVGIcon src={Icons.CloseIcon} width={16} height={16} color='#616161' />
            </button>
          </div>
          <div className="career__modal-content">
            <div className="career__modal-content-list">
              <button className='career__modal-content-btn career__modal-content-btn--link'>
                <SVGIcon src={Icons.Link} width={20} height={20} color='#1CB78D' />
              </button>
              <p className="career__modal-content-text">Copy Link</p>
            </div>
            <div className="career__modal-content-list">
              <button className='career__modal-content-btn career__modal-content-btn--social'>
                <SVGIcon src={Icons.TwitterColored} width={20} height={20} color='#02A2F6' />
              </button>
              <p className="career__modal-content-text">Twitter</p>
            </div>
            <div className="career__modal-content-list">
              <button className='career__modal-content-btn career__modal-content-btn--social'>
                <SVGIcon src={Icons.FacebookColored} width={20} height={20} color='#3975EB' />
              </button>
              <p className="career__modal-content-text">Facebook</p>
            </div>
            <div className="career__modal-content-list">
              <button className='career__modal-content-btn career__modal-content-btn--social'>
                <SVGIcon src={Icons.Whatsapp} width={20} height={20} color='#1CB78D' />
              </button>
              <p className="career__modal-content-text">Whatsapp</p>
            </div>
            <div className="career__modal-content-list">
              <button className='career__modal-content-btn career__modal-content-btn--social'>
                <SVGIcon src={Icons.Telegram} width={20} height={20} color='#54A7E5' />
              </button>
              <p className="career__modal-content-text">Telegram</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



export default Career
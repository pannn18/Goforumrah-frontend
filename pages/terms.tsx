import React, { useState } from 'react'
import Link from 'next/link'
import { Icons, Images, Services } from '@/types/enums'
import { BlurPlaceholderImage } from '@/components/elements/images'
import { CareerPageSearchBar } from '@/components/pages/home/searchBar'
import SVGIcon from '@/components/elements/icons'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'


const Career = () => {
  return (
    <Layout>
      <Navbar showCurrency={true} />
      
      <main className="terms-condition">        
        <TermsConditionBreadcrumb />
        <div className="container">      
          <TermsCondition />
        </div>
      </main>

      <Footer />      
    </Layout>
  )
}

const TermsCondition = () => {
  const tabs = {
    'All Travel Experience': '',
    'Hotels and Accommodations': '',
    'Tour Packages': '',
    'Payment and Refunds': '',
  }  
  const [selectedTabTerms, setSelectedTabTerms] = useState<String>(Object.keys(tabs)[0])
  return(
    <div className='terms'>
      <div className='terms__header'>
        <div className='terms__header-text'>
          <h1>Customer terms of service</h1>
          <span>December 18, 2022 06:00 AM</span>
        </div>
        <button type='button' className='btn btn-success'>Print / Save</button>
      </div>
      <div className="terms__tab">
        <div className="terms__tabs-menu">
          {Object.keys(tabs).map((tab, index) => (
            <button
              key={index}
              className={`btn ${ tab === selectedTabTerms ? 'active' : ''}`}
              onClick={() => setSelectedTabTerms(tab)}>
              {tab}
            </button>
          ))}
        </div>
      </div>      
      {(selectedTabTerms == 'All Travel Experience') && (
        <>
          <div className='terms__box'>
            <span className='terms__box-title'>A. Definitions and Who we are</span>
            <p>
            Some of the words you’ll see have very specific meanings, so please check out the Goforumrah.com dictionary in our <Link href={'/terms'}>Terms of Service</Link>.
              <br /><br />
            When you book an Accommodation, Goforumrah.com provides and is responsible for the Platform – but not the Travel Experience itself (see 1B below). Goforumrah.com B.V. is a company incorporated under the laws of the Netherlands (registered address: Herengracht 597, 1017 CE, Amsterdam, the Netherlands; Chamber of Commerce number: 31047344; VAT number: NL805734958B01).
            </p>
          </div>
          <div className='terms__box'>
            <span className='terms__box-title'>B. How does our service work?</span>
            <p>
              We make it easy for you to compare Bookings from many hotels, property owners and other Service Providers.
              When you make a Booking on our Platform, you enter into a contract with the Service Provider (unless otherwise stated).
                <br /><br />
              The information on our Platform is based on what Service Providers tell us. We do our best to keep things up to date at all times, but realistically it can take a few hours to update e.g. text descriptions and lists of the facilities that Accommodations provide.
            </p>
          </div>
          <div className='terms__box'>
            <span className='terms__box-title'>C. Who do we work with?</span>
            <p>
              Only Service Providers that have a contractual relationship with us will be displayed on our Platform. They may offer Travel Experiences outside our Platform as well (so what they offer on our Platform may not be exhaustive).
                <br /><br />
              We don’t own any Accommodations ourselves - we’re separate companies that have agreed to work with each other in a certain way.
                <br /><br />
              Our Platform tells you how many Accommodations you can book through us worldwide - and our search results page tells you how many of them might be right for you, based on what you’ve told us.
            </p>
          </div>
          <div className='terms__box'>
            <span className='terms__box-title'>D. How do we make money?</span>
            <p>
              We don’t buy or (re-)sell any products or services. Once your stay is finished, the Service Provider simply pays us a commission.
                <br /><br />
              And we don’t charge you any booking fees at all.
            </p>
          </div>
        </>
      )}
      {(selectedTabTerms == 'Hotels and Accommodations') && (
        <>
          <div className='terms__box'>
            <span className='terms__box-title'>A. Understanding Our Accommodation Services</span>
            <p>
              To ensure clarity, we maintain a specialized Goforumrah.com dictionary within our Terms of Service, where you can find precise definitions for key terms used throughout this section.
              <br /><br />
              Goforumrah.com acts as a facilitator for booking accommodations. It's important to note that while we provide the platform for booking, we do not directly provide the accommodations themselves. Goforumrah.com B.V. is a legally registered company based in the Netherlands, with its official address at Herengracht 597, 1017 CE, Amsterdam, the Netherlands. Our Chamber of Commerce registration number is 31047344, and our VAT number is NL805734958B01.
            </p>
          </div>          
          <div className='terms__box'>
            <span className='terms__box-title'>B. How Our Hotel and Accommodation Service Works</span>
            <p>
              Our platform simplifies the process of comparing and booking accommodations from a wide range of hotels, property owners, and other service providers. We aim to provide you with a seamless experience to find the perfect place to stay.
              <br /><br />              
              When you make a booking through our platform, you are entering into a contractual agreement with the accommodation provider unless otherwise specified. This means that the terms and conditions of your stay are governed by the policies and regulations set forth by the accommodation provider.
              <br /><br />              
              We strive to present accurate and up-to-date information on our platform based on the details provided by service providers. However, please be aware that there may be a slight delay, typically a few hours, in updating information such as text descriptions and lists of facilities offered by accommodations.
            </p>
          </div>          
          <div className='terms__box'>
            <span className='terms__box-title'>C. Your Stay Experience</span>
            <p>
              We are committed to ensuring a comfortable and enjoyable stay for you. Learn about our quality assurance measures and what to expect during your accommodation experience.              
            </p>
          </div>          
        </>
      )}
      {(selectedTabTerms == 'Tour Packages') && (
        <>
          <div className='terms__box'>
            <span className='terms__box-title'>A. Exploring Our Tour Package Services</span>
            <p>
              To ensure clarity, we maintain a specialized Goforumrah.com dictionary within our Terms of Service, where you can find precise definitions for key terms used throughout this section.
              <br /><br />
              Goforumrah.com acts as a facilitator for booking tour packages and guided experiences. It's important to note that while we provide the platform for booking, we do not directly provide the travel experiences. Goforumrah.com B.V. is a legally registered company based in the Netherlands, with its official address at Herengracht 597, 1017 CE, Amsterdam, the Netherlands. Our Chamber of Commerce registration number is 31047344, and our VAT number is NL805734958B01.
            </p>
          </div>          
          <div className='terms__box'>
            <span className='terms__box-title'>B. How Our Tour Package Service Works</span>
            <p>
              Our platform is designed to simplify the process of discovering and booking tour packages and guided experiences. We offer a wide selection of tours to cater to your interests and preferences.
              <br /><br />              
              When you book a tour through our platform, you are entering into a contractual agreement with the tour operator or service provider, unless otherwise stated. This means that the terms and conditions of your tour are subject to the policies set forth by the tour provider.
              <br /><br />              
              We make every effort to keep tour information up to date. However, please be aware that there may be a slight delay, typically a few hours, in updating details such as tour itineraries and other relevant information.
            </p>
          </div>          
          <div className='terms__box'>
            <span className='terms__box-title'>C. Creating Memorable Journeys</span>
            <p>
              Discover exclusive tour packages designed to create unforgettable memories. Explore unique destinations and experiences that go beyond the ordinary.
            </p>
          </div>          
        </>
      )}
      {(selectedTabTerms == 'Payment and Refunds') && (
        <>
          <div className='terms__box'>
            <span className='terms__box-title'>A. Understanding Payments and Refunds</span>
            <p>
              To ensure clarity, we maintain a specialized Goforumrah.com dictionary within our Terms of Service, where you can find precise definitions for key terms used throughout this section.
              <br /><br />
              Goforumrah.com is your trusted partner in facilitating secure and hassle-free payments for your bookings. We are Goforumrah.com B.V., a legally registered company based in the Netherlands. Our official address is Herengracht 597, 1017 CE, Amsterdam, the Netherlands. We are registered with the Chamber of Commerce under number 31047344, and our VAT number is NL805734958B01.
            </p>
          </div>          
          <div className='terms__box'>
            <span className='terms__box-title'>B. Payment Methods and Refund Policies</span>
            <p>
              We offer a variety of payment methods to accommodate your preferences. You can choose from a range of secure payment options to complete your bookings.
              <br /><br />
              Our refund policies are designed to provide transparency and fairness. In the event of cancellations or changes to your bookings, we outline the procedures and timelines for refunds, ensuring a smooth and efficient process.
              <br /><br />
              We strive to resolve any payment-related disputes amicably and efficiently. In this section, we detail our dispute resolution mechanisms and how we work to find satisfactory resolutions for all parties involved.
            </p>
          </div>          
          <div className='terms__box'>
            <span className='terms__box-title'>C. Secure Transactions</span>
            <p>
              We prioritize the security of your transactions. Learn about the advanced security measures in place to safeguard your payment information.
            </p>
          </div>          
        </>
      )}
    </div>
  )
}

const TermsConditionBreadcrumb = () => {
  return(
    <section className='terms__breadcrumb'>
      <div className='container'>
        <div className="terms__breadcrumb-inner">
          <Link className="terms__breadcrumb--link" href="/">Home</Link>
          <p>/</p>
          <p className="terms__breadcrumb--current">Terms & Condition</p>      
        </div>
      </div>
    </section>
  )
}

export default Career
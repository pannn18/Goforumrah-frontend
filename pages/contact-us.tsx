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
      
      <main className="contact-us">        
        <PrivacyPolicyBreadcrumb />
        <PrivacyPolicy />
        <div className="container">      
        </div>
      </main>

      <Footer />      
    </Layout>
  )
}

const PrivacyPolicy = () => {
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  return(
    <section className='contact'>
      <div className='container'>
        <div className='contact__wrapper'>
          <div className='contact__header'>
            <h1>Contact us</h1>
            <span>Let us know what you want to know directly from us</span>            
          </div>
          <form action='' className='contact__form'>
            <div className='contact__form-card'>
              <div className='contact__form-row'>
                <div className='contact__form-group'>
                  <label htmlFor="contactUsFirstName">First Name</label>
                  <input type="text" name="contactUsFirstName" id="contactUsFirstName" placeholder='Enter your first name' />
                </div>
                <div className='contact__form-group'>
                  <label htmlFor="contactUsLastName">Last Name</label>
                  <input type="text" name="contactUsLastName" id="contactUsLastName" placeholder='Enter your last name' />
                </div>
              </div>
              <div className='contact__form-group'>
                <label htmlFor="contactUsSubject">Subject</label>
                <input type="text" name="contactUsSubject" id="contactUsSubject" placeholder='Enter your subject' />
              </div>
              <div className='contact__form-group'>
                <label htmlFor="contactUsDescription">Description</label>
                <textarea name="contactUsDescription" id="contactUsDescription" cols={30} rows={10} placeholder='Type your taglines here..'></textarea>
              </div>
              <div
                className={`file-upload ${dragging ? 'dragging' : ''}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!files.length && (
                  <div className='file-upload__inner'>
                    <div className='file-upload__text'>
                      <p className='file-upload__text-title'>Drag and drop your photos here</p>
                      <p className='file-upload__text-subtitle'>You’ll also be able to upload more after registration</p>
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="fileInput" className="file-upload__button btn btn-sm btn-success">
                      <SVGIcon src={Icons.Plus} height={20} width={20} />
                      Add photos 
                    </label>
                  </div>
                )}
                <ul className='file-upload__list'>
                  {files.map((file, index) => (
                    <li key={index} className='file-upload__list-item'>
                      {file.name}
                      <button onClick={() => handleRemoveFile(index)}>
                        <SVGIcon src={Icons.Cancel} height={24} width={24} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='contact__form-card contact__form-card--footer'>
              <button type='submit' className='btn btn-success'>Send</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

const PrivacyPolicyBreadcrumb = () => {
  return(
    <section className='contact__breadcrumb'>
      <div className='container'>
        <div className="contact__breadcrumb-inner">
          <Link className="contact__breadcrumb--link" href="/">Home</Link>
          <p>/</p>
          <p className="contact__breadcrumb--current">Privacy  & Cookies</p>      
        </div>
      </div>
    </section>
  )
}

export default Career
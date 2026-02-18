import Layout from '@/components/layout'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router';
import ReactDOM from 'react-dom';
import Navbar from '@/components/business/car/navbar'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { callAPI } from '@/lib/axiosHelper';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function IndividualDocumentUpload() {
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' && session ? Number(session.user.id) : null)
  const router = useRouter();

  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [proggresBar, setProggresBar] = useState<number>(0);
  const [error, setError] = useState<string>('')

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

  // convert files to base 64 string then set it to convertedFiles state
  const convertToBase64 = (file) => new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });

  const onSubmit = async () => {
    setLoading(true);
    setProggresBar(0);
    setError('');

    try {
      // convert files to base64 string
      const convertedFiles = await Promise.all(files.map((file) => convertToBase64(file)));

      const payloadFile = {
        id_car_business: id_car_business,
        files: convertedFiles
      };

      console.log('Payload File :', payloadFile);

      const { status, data, ok, error } = await callAPI('/car-business/policies/store-individual', 'POST', payloadFile, true, '', 'multipart/form-data', { onUploadProgress: (e) => setProggresBar(Math.floor((e.loaded / e.total) * 100)) })

      setError(error)
      setLoading(false)
      setFiles([])
    } catch (error) {
      console.log(error)
      setError(error)
    }
  }

  // Function to reset the progress bar
  const resetProgressBar = () => {
    setProggresBar(0);
  };

  return (
    <Layout>
      <div className="business-profile">
        <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
        <section className='business-profile__header'>
          <div className='container'>
            <div className='business-profile__header-inner'>
              <Link href={'/business/car/profile/company'} className='business-profile__header-back'>
                <SVGIcon src={Icons.ArrowLeft} height={24} width={24} />
                <h4>Individual Identification Document</h4>
              </Link>
              <button disabled={loading || files.length === 0} type='button' className='btn btn-sm btn-success' onClick={onSubmit}>
                {loading ? 'Please wait...' : 'Upload'}
              </button>
            </div>
          </div>
        </section>
        <div className="container">
          <div className='company'>
            <h5>
              {(loading) ? "Uploading your file..." : (proggresBar > 99 ? (!error ? "Upload Successfully" : "Upload Error") : "Upload your file down here")}
            </h5>
            <div
              className={`file-upload ${dragging ? 'dragging' : ''}`}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!files.length && (
                <div className='file-upload__inner'>
                  <input
                    type="file"
                    id="fileInput"
                    multiple
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }}
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onClick={resetProgressBar}
                  />
                  <label htmlFor="fileInput" className="file-upload__button btn btn-sm btn-outline-success" >
                    <SVGIcon src={Icons.Plus} height={20} width={20} />
                    Browse
                  </label>
                  <div className='file-upload__text'>
                    <p className='file-upload__text-title'>Select files to upload</p>
                    <p className='file-upload__text-subtitle'>or drag and drop them here</p>
                  </div>
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
              {files.length > 0 && (
                <div className="admin-partner__modal-progress" style={{ justifyContent: "center" }}>
                  <div className="progress" style={{ height: "16px", borderRadius: "16px", width: "50%" }}>
                    <div className="progress-bar progress-bar-stripped progress-bar-animated"
                      role="proggresbar"
                      aria-label="proggresbar"
                      aria-valuenow={proggresBar}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      style={{ width: `${proggresBar}%`, backgroundColor: "#1cb78d" }}
                    >
                    </div>
                  </div>
                  <h6>{`${proggresBar}%`}</h6>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
};


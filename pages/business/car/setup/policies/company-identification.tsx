import Layout from '@/components/layout'
import React, { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/router';
import ReactDOM from 'react-dom';
import Navbar from '@/components/layout/navbar'
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import { useSession } from 'next-auth/react';
import { callAPI } from '@/lib/axiosHelper';
import { useDropzone } from 'react-dropzone';
import styles from '../../../../../components/dropzone/index.module.scss'

export default function InsuranceDocumentUpload() {
  return (
    <Layout>
      <div className="business-profile">
        <Navbar showHelp={false} hideAuthButtons={true} />
        <div className="container">
          <CompanyDocument />
        </div>
      </div>
    </Layout>
  )
};

const CompanyDocument = () => {
  const router = useRouter();

  const { data: session, status } = useSession();
  const id_car_business = (status === 'authenticated' || session) ? Number(session.user.id) : null

  const [dragging, setDragging] = useState(false);

  const [documents, setDocuments] = useState<{ name: string, url: string }[]>([])

  const handleRemoveFile = (index) => {
    const updatedFiles = [...documents];
    updatedFiles.splice(index, 1);
    setDocuments(updatedFiles);
  };

  let hasError = false

  const [errorMessage, setErrorMessage] = useState({
    fileValidation: '',
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      id_car_business: id_car_business,
      files: documents.map(({ url }) => url)
    }

    if (!hasError) {
      console.log('Payload : ', payload);

      const { ok, error } = await callAPI('/car-business/policies/store-company', 'POST', payload, true)
      if (ok) {
        router.push(`/business/car/setup/policies`)
        console.log('Success')
      }
      else {
        console.log(error)
      }
    }

  }

  const dropzoneOptions = {
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 10,
    maxSize: 10000000,
    multiple: true,
    onDropAccepted: useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        if (file.type === 'application/pdf') {
          const reader = new FileReader();

          reader.onabort = () => console.log('file reading was aborted');
          reader.onerror = () => console.log('file reading has failed');
          reader.onloadend = () => {
            setDocuments((prevState) => [...prevState, { name: file.name || '', url: reader.result.toString() }]);
          };
          reader.readAsDataURL(file);
        } else {
          // File is not a PDF, set an error message
          setErrorMessage((prevState) => ({
            ...prevState,
            fileValidation: 'Please upload only PDF files.',
          }));
          hasError = true;
        }
      })

    }, []),
  }
  const { getRootProps: getRootPropsImages, getInputProps: getInputPropsImages } = useDropzone(dropzoneOptions)


  return (
    <div>
      <form onSubmit={onSubmit}>
        <section className='business-profile__header'>
          <div className='container'>
            <div className='business-profile__header-inner'>
              <button onClick={() => router.back()} className='business-profile__header-back'>
                <SVGIcon src={Icons.ArrowLeft} height={24} width={24} />
                <h4>Company Identification Details</h4>
              </button>
              <button type='submit' className='btn btn-sm btn-success'>Save</button>
            </div>
          </div>
        </section>
        <div className='company'>
          <CustomDropzone
            documents={documents}
            setDocuments={setDocuments}
          />
          <div className="form-control-message form-control-message--error">
            {errorMessage.fileValidation}
          </div>
        </div>
      </form>
    </div>
  );
}


type DocumentType = { name: string, url: string }

interface IProps {
  documents: DocumentType[]
  setDocuments: React.Dispatch<React.SetStateAction<DocumentType[]>>
}

const CustomDropzone = ({ documents, setDocuments }: IProps) => {

  const dropzoneOptions = {
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 10,
    maxSize: 10000000,
    multiple: true,
    onDropAccepted: useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onloadend = () => {
          setDocuments((prevState) => [...prevState, { name: file?.name || '', url: reader.result.toString() }])
        }
        reader.readAsDataURL(file)
      })

    }, [setDocuments]),
  }
  const { getRootProps: getRootPropsImages, getInputProps: getInputPropsImages } = useDropzone(dropzoneOptions)

  return (
    <>
      {documents.length > 0 ? (
        <>
          {!!documents.length && (
            <ul className='file-upload__list'>
              {documents.map((file, index) => (
                <li key={index} className='file-upload__list-item'>
                  {file.name}
                  <button onClick={() => {
                    setDocuments(documents.filter((_, i) => i !== index));
                  }}>
                    <SVGIcon src={Icons.Cancel} height={24} width={24} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className={styles.wrapper}>
          <div {...getRootPropsImages()} className={styles.dropzone}>
            <div>
              <div className={`${styles.heading} fs-lg fw-bold text-neutral-primary`}>
                Upload Your Files
              </div>
              <div>or drag and drop them here</div>
            </div>
            <div>
              <button type="button" className="file-upload__button btn btn-sm btn-outline-success">
                <SVGIcon src={Icons.Plus} width={24} height={24} />
                <span>Browse</span>
              </button>
            </div>
            <input {...getInputPropsImages()} />
          </div>
          {!!documents.length && (
            <ul className='file-upload__list'>
              {documents.map((file, index) => (
                <li key={index} className='file-upload__list-item'>
                  {file.name}
                  <button onClick={() => {
                    setDocuments(documents.filter((_, i) => i !== index));
                  }}>
                    <SVGIcon src={Icons.Cancel} height={24} width={24} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  )
}

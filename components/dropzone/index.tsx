import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from './index.module.scss'
import SVGIcon from '../elements/icons'
import { Icons } from '@/types/enums'

type ImageType = { name: string, url: string }

interface IProps {
  images: ImageType[]
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>
}

const CustomDropzone = ({ images, setImages }: IProps) => {


  const dropzoneOptions = {
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
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
          setImages((prevState) => [...prevState, { name: file?.name || '', url: reader.result.toString() }])
        }
        reader.readAsDataURL(file)
      })

    }, []),
  }
  const { getRootProps: getRootPropsImages, getInputProps: getInputPropsImages } = useDropzone(dropzoneOptions)

  return (
    <>
      {/* {console.log(images.length)} */}
      {images.length > 0 ? (
        <>
          <div className={styles.wrapperOutlineNone}>
            {!!images.length && (
              <div className={styles.uploadedImages}>
                {images.map(({ name, url }, index) => (
                  <div key={index} className={styles.column}>
                    <div className={styles.image} title={name} style={{ backgroundImage: `url('${url}')` }}>
                      <div
                        onClick={() => {
                          setImages(images.filter((_, i) => i !== index));
                        }}
                        className={styles.removeButton}
                      >
                        <SVGIcon src={Icons.CloseIcon} width={12} height={12} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className={styles.wrapper}>
          <div {...getRootPropsImages()} className={styles.dropzone}>
            <div>
              <div className={`${styles.heading} fs-lg fw-bold text-neutral-primary`}>
                Drag and drop your photos here
              </div>
              <div>You’ll also be able to upload more after registration</div>
            </div>
            <div className="text-neutral-subtle">Or</div>
            <div>
              <button type="button" className="btn btn-success">
                <SVGIcon src={Icons.Plus} width={24} height={24} />
                <span>Add photos</span>
              </button>
            </div>
            <input {...getInputPropsImages()} />
          </div>
          {!!images.length && (
            <div className={styles.uploadedImages}>
              {images.map(({ name, url }, index) => (
                <div key={index} className={styles.column}>
                  <div className={styles.image} title={name} style={{ backgroundImage: `url('${url}')` }}>
                    <div
                      onClick={() => {
                        setImages(images.filter((_, i) => i !== index));
                      }}
                      className={styles.removeButton}
                    >
                      <SVGIcon src={Icons.CloseIcon} width={12} height={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CustomDropzone


import React, { useState } from 'react'
import CustomDropzone from '@/components/dropzone'

const ReactDropzoneExample = () => {
  const [images, setImages] = useState<{ name: string, url: string }[]>([])

  return (
    <>
      <div className="container my-5">
        <div className="row">
          <div className="col">
            <CustomDropzone
              images={images}
              setImages={setImages}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ReactDropzoneExample


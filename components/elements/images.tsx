import React, { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { Images } from '@/types/enums'

export const BlurPlaceholderImage = ({ src: srcProps, alt, ...props }: ImageProps) => {
  const [src, setSrc] = useState(srcProps || Images.Placeholder)

  return (
    <Image
      src={src}
      alt={alt || ''}
      placeholder="blur"
      blurDataURL={Images.Placeholder}
      onError={() => setSrc(Images.Placeholder)}
      {...props} />
  )
}
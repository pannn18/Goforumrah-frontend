import { StaticImageData } from "next/image"
import { BlurPlaceholderImage } from "@/components/elements/images"

interface transferCardProps {
  image: StaticImageData | string,
  name: string,
  desc: string,  
}

const transferCard = (props: transferCardProps) => {
  const { image, name, desc } = props

  return (
    <div className="search-transfer__type">
      <BlurPlaceholderImage className="search-transfer__type-image" src={image} alt={name} width={104} height={55} />        
      <div>
        <p className="search-transfer__type-name">{name}</p>
        <p className="search-transfer__type-desc">{desc}</p>  
      </div>            
    </div>
  )
}

export default transferCard
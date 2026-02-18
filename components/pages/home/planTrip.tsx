import { StaticImageData } from "next/image"
import { BlurPlaceholderImage } from "@/components/elements/images"

interface PlanTripCategoryProps {
  image: StaticImageData | string,
  title: string,
  description: string
}

const PlanTripCategory = (props: PlanTripCategoryProps) => {
  const { image, title, description } = props

  return (
    <div className="plan-trip">
      <BlurPlaceholderImage className="plan-trip__image" src={image} alt={title} width={256} height={256} />
      <div className="plan-trip__details">
        <div className="plan-trip__title">{title}</div>
        <div className="plan-trip__description">{description}</div>
      </div>
    </div>
  )
}

export default PlanTripCategory
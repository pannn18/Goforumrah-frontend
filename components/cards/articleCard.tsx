import React from "react"
import { StaticImageData } from "next/image"
import { BlurPlaceholderImage } from "@/components/elements/images"
import Link from "next/link"

interface ArticleCardProps {
  image: StaticImageData | string
  title: string
  description?: string
  linkURL: string
}

const ArticleCard = (props: ArticleCardProps) => {
  const { image, title, description, linkURL } = props

  return (
    <div className="article-card">
      <div className="article-card__image">
        <BlurPlaceholderImage src={image} alt={title} width={512} height={512} />
      </div>
      <div className="article-card__details">
        <div>
          <h5 className="article-card__title text-neutral-primary">{title}</h5>
          {description && (
            <div className="article-card__description fs-lg text-neutral-subtle">{description}</div>
          )}
        </div>
        <Link href={linkURL} className="stretched-link link-green-01">Read more</Link>
      </div>
    </div>
  )
}

export default ArticleCard
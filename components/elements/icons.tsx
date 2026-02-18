import React from 'react'
import { Props, ReactSVG } from 'react-svg'

interface IProps {
  width: string | number,
  height: string | number,
  color?: string
}

const SVGIcon = (props: IProps & Props) => {
  const { width, height, color } = props

  return (
    <ReactSVG className={`react-svg ${props.className || ''}`} src={props.src} style={{ width, height, ...(color ? { color } : {}) }} />
  )
}

export default SVGIcon
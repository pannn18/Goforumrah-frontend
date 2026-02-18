import React, { useEffect, useRef } from 'react'

interface IProps {
  children?: React.ReactNode
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const DropdownMenu = ({ children, show, setShow, className, ...props }: IProps & React.HTMLAttributes<HTMLDivElement>) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setShow(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  return show && (
    <div ref={wrapperRef} {...{ ...props, className: (className || '') + ' custom-dropdown-menu' }}>
      {children}
    </div>
  )
}

export default DropdownMenu
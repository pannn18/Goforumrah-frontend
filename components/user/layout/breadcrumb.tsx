import SVGIcon from '@/components/elements/icons'
import { Icons } from '@/types/enums'
import Link from 'next/link'
import React, { Fragment, useState } from 'react'

interface IProps {
  breadcrumb: { text: string, url?: string, type?: string, category?: string }[]
}

const Breadcrumb = ({ breadcrumb }: IProps) => {

  console.log(breadcrumb)

  const [showText, isShowText] = useState(false);

  return (
    <div className="container">
      <div className="user-layout-breadcrumb" style={{ marginBottom: 0 }}>
        {breadcrumb.map(({ text, url, type, category }, index) => (
          <Fragment key={`breadcrumb-${index}`}>
            {index !== 0 && (
              <div className="user-layout-breadcrumb__separator active">/</div>
            )}
            {url ? (
              type === 'reason' ? (
                <>
                  <div className='user-layout-breadcrumb__desk active'>{text}</div>
                  <SVGIcon className='user-layout-breadcrumb__resp active' src={Icons.Calendar} width={28} height={28} />
                </>
              ) : type === 'confirm' ? (
                <>
                  <Link href={url} className="user-layout-breadcrumb__desk active">{text}</Link>
                  <SVGIcon className='user-layout-breadcrumb__resp active' src={Icons.Calendar} width={28} height={28} />
                </>
              ) : (
                <>
                  <Link href={url} className="user-layout-breadcrumb__desk active">{text}</Link>
                  {/* If there some new category just pass category in the breadcrumb props */}
                  {category === 'hotel' ? (
                    <SVGIcon className='user-layout-breadcrumb__resp active' src={Icons.Hotel} width={28} height={28} />
                  ) : category === 'flight' ? (
                    <SVGIcon className='user-layout-breadcrumb__resp active' src={Icons.Flight} width={28} height={28} />
                  ) : category === 'car' ? (
                    <SVGIcon className='user-layout-breadcrumb__resp active' src={Icons.Car} width={28} height={28} />
                  ) : (
                    <SVGIcon className='user-layout-breadcrumb__resp active' src={Icons.Calendar} width={28} height={28} />
                  )}
                </>
              )
            ) : (
              <div>
                <>
                  <div className='user-layout-breadcrumb__desk'>{text}</div>
                  <SVGIcon className='user-layout-breadcrumb__resp' src={Icons.BookingCompleted} width={28} height={28} />
                </>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div >
  )
}

export default Breadcrumb
import Head from 'next/head'
import React from 'react'
import Script from 'next/script'

interface IProps {
  children: React.ReactNode
  title?: string
  description?: string
  thumbnail?: string
}

const Layout = (props: IProps) => {
  let { children, title, description, thumbnail } = props

  title = title || 'GoForUmrah - Your Umrah Partner'
  description = description || 'Your Umrah Partner'
  thumbnail = thumbnail || ''

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta id="meta-vp" name="viewport" content="width=device-width" />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={thumbnail} />
        <meta property="og:type" content="website" />

        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={thumbnail} />
        <meta property="twitter:card" content="summary_large_image" />

        <link rel="icon" href="/IconLogo.png" />
      </Head>

      {children}
    </>
  )
}

export default Layout
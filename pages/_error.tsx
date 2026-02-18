import Error from 'next/error'

const Page = ({ statusCode }) => {
  return <Error statusCode={statusCode || 'Unknown Error'} title={!statusCode && 'An error occurred on client'} withDarkMode={false} />
}

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Page
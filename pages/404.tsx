import Error from 'next/error'

const Page = () => {
  return <Error statusCode={404} title={'This page could not be found'} withDarkMode={false} />
}

export default Page
import React from 'react'
import { Services } from '@/types/enums'
import { getEnumAsArray } from '@/lib/enumsHelper'
import Layout from '@/components/layout'
import Navbar from '@/components/layout/navbar'
import Footer from '@/components/layout/footer'
import SearchHotel from '@/components/pages/search/hotel'
import SearchFlights from '@/components/pages/search/flights'
import SearchBookTransfer from '@/components/pages/search/book-transfer'
import SearchTourPackage from '@/components/pages/search/tour-package'

interface IProps {
  service: Services
}

const Search = (props: IProps) => {
  const { service } = props
  const pages = {
    [Services.Hotel]: <SearchHotel />,
    [Services.Flights]: <SearchFlights />,
    [Services.BookTransfer]: <SearchBookTransfer />,
    [Services.TourPackage]: <SearchTourPackage />,
  }

  return (
    <Layout>
      <Navbar showCurrency={true} selectedServiceTab={service} />
      {pages[service]}
      <Footer />
    </Layout>
  )
}

export async function getStaticPaths() {
  return {
    paths: getEnumAsArray(Services).map((key) => ({ params: { service: Services[key] } })),
    fallback: false
  }
}

export async function getStaticProps(context) {
  return {
    props: { service: context.params.service },
  }
}

export default Search
import React from 'react'
import ServiceTabs from '@/components/serviceTabs'
import { Services } from '@/types/enums'
import { HotelSearchBar, FlightSearchBar, BookTransferSearchBar, TourPackageSearchBar, SkyscannerSearchBar } from './searchBar'

interface IProps {
  title: string
  description?: string
  coverImage: React.ReactNode  // StaticImageData | string
  service: Services
  onServiceChange: (selected: Services) => void
}

const Header = (props: IProps) => {
  const { title, description, coverImage, service, onServiceChange } = props

  return (
    <header className={`homepage__header homepage__header--${service}`}>
      <div className="homepage__header-bg">
        {coverImage}  {/* <Image src={cover} alt={title} width={1440} placeholder="blur" blurDataURL={Images.Placeholder} /> */}
        <div className="homepage__header-bg-overlay-shadow" />
      </div>
      <div className="container">
        <div className="homepage__header-content">
          <div className="tabs">
            <ServiceTabs selected={service} onChange={onServiceChange} />
          </div>
          <h1 className="heading">{title}</h1>
          {description && <p className="subheading">{description}</p>}
        </div>
      </div>
      <div className="homepage__header-form">
        <div className="container">
          <SearchBar service={service} />
        </div>
      </div>
    </header>
  )
}

const SearchBar = (props: { service: Services }) => {
  const searchBars = {
    [Services.Hotel]: <HotelSearchBar homepage={true} />,
    [Services.Flights]: <FlightSearchBar homepage={true} />,
    [Services.BookTransfer]: <BookTransferSearchBar homepage={true} />,
    [Services.TourPackage]: <TourPackageSearchBar homepage={true} />,
  }

  return searchBars[props.service]
}


export default Header
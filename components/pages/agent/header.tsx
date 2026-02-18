import React from 'react'
import AgentServiceTabs from '@/components/agentServiceTabs'
import { AgentServices } from '@/types/enums'
import { HotelSearchBar, FlightSearchBar, BookTransferSearchBar, TourPackageSearchBar } from './searchBar'

interface IProps {
  title: string
  description?: string
  coverImage: React.ReactNode  // StaticImageData | string
  service: AgentServices
  onServiceChange: (selected: AgentServices) => void
}

const Header = (props: IProps) => {
  const { title, description, coverImage, service, onServiceChange } = props

  return (
    <header className="agent__header">
      <div className="agent__header-bg">
        {coverImage}  {/* <Image src={cover} alt={title} width={1440} placeholder="blur" blurDataURL={Images.Placeholder} /> */}
        <div className="agent__header-bg-overlay-shadow" />
      </div>
      <div className="container">
        <div className="agent__header-content">
          <h1 className="heading mb-4">{title}</h1>
          <div className="tabs mb-0">
            <AgentServiceTabs selected={service} onChange={onServiceChange} />
          </div>          
        </div>
      </div>
      <div className="agent__header-form">
        <div className="container">
          <SearchBar service={service} />
        </div>
      </div>
    </header>
  )
}

const SearchBar = (props: { service: AgentServices }) => {
  const searchBars = {
    [AgentServices.Hotel]: <HotelSearchBar />,
    [AgentServices.Flights]: <FlightSearchBar />,
    [AgentServices.BookTransfer]: <BookTransferSearchBar />,
    [AgentServices.TourPackage]: <TourPackageSearchBar />    
  }

  return searchBars[props.service]
}


export default Header
import React from "react"
import { Icons, Services } from '@/types/enums'
import { ReactSVG } from 'react-svg'

interface IProps {
  selected: Services
  onChange: (selected: Services) => void
}

const icons = {
  [Services.Hotel]: Icons.Hotel,
  [Services.Flights]: Icons.Flight,
  [Services.BookTransfer]: Icons.Car,
  [Services.TourPackage]: Icons.SunHorizon,
}

const ServiceTabs = (props: IProps) => {
  const { selected, onChange } = props

  return (
    <div className="service-tabs" >
      {(Object.keys(Services) as Array<keyof typeof Services>).map((key) => key !== 'Skyscanner' && (
        <button key={key} onClick={() => Services[key] !== selected && onChange(Services[key])} type="button" className={`btn service-tabs__button ${selected === Services[key] ? 'active' : ''}`}>
          <ReactSVG src={icons[Services[key]]} style={{ height: 24, width: 24 }} />
          <div className="service-tabs__button-text">{Services[key].replaceAll('-', ' ')}</div>
        </button>
      ))}
    </div>
  )
}

export default ServiceTabs
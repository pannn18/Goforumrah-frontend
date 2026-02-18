import React from "react"
import { AgentServices, Icons } from '@/types/enums'
import { ReactSVG } from 'react-svg'

interface IProps {
  selected: AgentServices
  onChange: (selected: AgentServices) => void
}

const icons = {
  [AgentServices.Hotel]: Icons.Hotel,
  [AgentServices.Flights]: Icons.Flight,
  [AgentServices.BookTransfer]: Icons.Car,
  [AgentServices.TourPackage]: Icons.SunHorizon,
}

const AgentServiceTabs = (props: IProps) => {
  const { selected, onChange } = props

  return (
    <div className="service-tabs" >
      {(Object.keys(AgentServices) as Array<keyof typeof AgentServices>).map((key) => (
        <button key={key} onClick={() => AgentServices[key] !== selected && onChange(AgentServices[key])} type="button" className={`btn service-tabs__button ${selected === AgentServices[key] ? 'active' : ''}`}>
          <ReactSVG src={icons[AgentServices[key]]} style={{ height: 24, width: 24 }} />
          <span className="service-tabs__description">{AgentServices[key].replaceAll('-', ' ')}</span>
        </button>
      ))}
    </div>
  )
}

export default AgentServiceTabs
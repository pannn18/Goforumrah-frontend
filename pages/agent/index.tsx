import { useState } from "react"
import Link from "next/link"
import Layout from "@/components/layout"
import AgentNavbar from "@/components/layout/agentNavbar"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import { Chart as ChartJS, ArcElement, CategoryScale, Filler, Legend, LinearScale, LineElement, PointElement, Title, Tooltip, ScriptableContext} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2"

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Dashboard() {
  return (
    <Layout>
      <AgentNavbar />
      <div className="agent-dashboard">
        <div className="container">
          <div className="agent-dashboard__wrapper">
            <AgentSummary />
            <DashboardContent />
            <DashboardTable />
          </div>
        </div>      
      </div>
    </Layout>
  )
}

const AgentSummary = () => {
  return(
    <div className="agent-dashboard__summary">
      <div className="agent-dashboard__summary-box">
        <div className="agent-dashboard__summary-row">
          <p className="agent-dashboard__summary-header-text">Total Transaction </p>
          <SVGIcon src={Icons.Money} width={20} height={20} className="agent-dashboard__summary-header-icon" />
        </div>
        <div className="agent-dashboard__summary-row">
          <p className="agent-dashboard__summary-content-value">$ 120.00</p>
          <div className="agent-dashboard__summary-content-recap agent-dashboard__summary-content-recap--success">
            <p className="agent-dashboard__summary-content-recap--text">20%</p>
            <SVGIcon src={Icons.TrendUp} width={20} height={20} className="agent-dashboard__summary-header-icon" />
          </div>
        </div>
      </div>

      <div className="agent-dashboard__summary-box">
        <div className="agent-dashboard__summary-row">
          <p className="agent-dashboard__summary-header-text">Total Booking</p>
          <SVGIcon src={Icons.Book} width={20} height={20} className="agent-dashboard__summary-header-icon" />
        </div>
        <div className="agent-dashboard__summary-row">
          <p className="agent-dashboard__summary-content-value">28 Bookings</p>
          <div className="agent-dashboard__summary-content-recap agent-dashboard__summary-content-recap--success">
            <p className="agent-dashboard__summary-content-recap--text">20%</p>
            <SVGIcon src={Icons.TrendUp} width={20} height={20} className="agent-dashboard__summary-header-icon" />
          </div>
        </div>
      </div>

      <div className="agent-dashboard__summary-box">
        <div className="agent-dashboard__summary-row">
          <p className="agent-dashboard__summary-header-text">Completed Booking</p>
          <SVGIcon src={Icons.ChartBar} width={20} height={20} className="agent-dashboard__summary-header-icon" />
        </div>
        <div className="agent-dashboard__summary-row">
          <p className="agent-dashboard__summary-content-value">24 Bookings</p>
          <div className="agent-dashboard__summary-content-recap agent-dashboard__summary-content-recap--success">
            <p className="agent-dashboard__summary-content-recap--text">20%</p>
            <SVGIcon src={Icons.TrendUp} width={20} height={20} className="agent-dashboard__summary-header-icon" />
          </div>
        </div>
      </div>
    </div>
  )
}

const DashboardContent = () => {
  return(
    <div className="agent-dashboard__content">
      <div className="agent-dashboard__overview">
        <div className="agent-dashboard__overview-header">
          <h5 className="agent-dashboard__overview-header-title">Sales Overview</h5>
          <button className="btn btn-sm">
            <SVGIcon src={Icons.More} width={16} height={16} />
          </button>
        </div>          
        <div style={{ height: 278 }}>
          <Line options={options} data={getChartData()} height={200} />
        </div>
      </div>      
      <div className="agent-dashboard__content-split">        
        <div className="agent-dashboard__customer">
          <div className="agent-dashboard__customer-header">
            <h5>All Booked Type</h5>
            <button className="btn btn-sm">
              <SVGIcon src={Icons.More} width={16} height={16} />
            </button>
          </div>
          <div className="agent-dashboard__book">
            <div style={{width: '180px', height: '180px'}}>
              <Doughnut options={bookOptions} data={bookData} height={180} width={180} />
            </div>
            <div className="agent-dashboard__book-list">
              <div className="agent-dashboard__book-legend">
                <div className="agent-dashboard__book-legend-point agent-dashboard__book-legend-point--hotel"></div>
                <div className="">
                  <p className="agent-dashboard__book-legend-title">Hotel</p>
                  <div className="agent-dashboard__book-legend-value">
                    <p>100 Order</p>
                    <p>42%</p>
                  </div>
                </div>
              </div>
              <div className="agent-dashboard__book-legend">
                <div className="agent-dashboard__book-legend-point agent-dashboard__book-legend-point--cars"></div>
                <div className="">
                  <p className="agent-dashboard__book-legend-title">Cars</p>
                  <div className="agent-dashboard__book-legend-value">
                    <p>100 Order</p>
                    <p>42%</p>
                  </div>
                </div>
              </div>
              <div className="agent-dashboard__book-legend">
                <div className="agent-dashboard__book-legend-point agent-dashboard__book-legend-point--tour"></div>
                <div className="">
                  <p className="agent-dashboard__book-legend-title">Tour</p>
                  <div className="agent-dashboard__book-legend-value">
                    <p>100 Order</p>
                    <p>42%</p>
                  </div>
                </div>
              </div>
              <div className="agent-dashboard__book-legend">
                <div className="agent-dashboard__book-legend-point agent-dashboard__book-legend-point--flight"></div>
                <div className="">
                  <p className="agent-dashboard__book-legend-title">Flight</p>
                  <div className="agent-dashboard__book-legend-value">
                    <p>100 Order</p>
                    <p>42%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  )
}

ChartJS.register( ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);
export const options = {  
  maintainAspectRatio: false,  
  responsive: true,
  scales: {
    x: {
      grid: {display: false}
    },
    y:{
      ticks: {stepSize: 2000}
    }
  },
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: false },    
  }
};
export const bookOptions = {  
  maintainAspectRatio: false,  
  responsive: true,
  cutout: "80%",
  spacing: 10,    
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: false },    
  }
};

export const bookData = {
  labels: ["Hotel", "Cars", "Tour", "Flight"],
  datasets: [
    {
      label: "Book Type",
      data: [42, 42, 42, 42],
      backgroundColor: [
        "#5EBD4E",
        "#E4DE51",
        "#D98352",
        "#AA2E20"
      ],      
      borderWidth: 0
    }
  ]
};

const getChartData = () => {  
  return{
    labels : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        fill: true,
        label: "Sales",        
        data: [0, 1200, 0, 4200, 3000, 7500, 6000],
        borderColor: 'rgba(28, 183, 141, 0.4',       
        borderWidth: 1, 
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0.21, "rgba(28, 183, 141, 0.4)");
          gradient.addColorStop(0.42, "rgba(28, 183, 141, 0.3)");
          gradient.addColorStop(0.63, "rgba(28, 183, 141, 0.2)");
          gradient.addColorStop(0.84, "rgba(28, 183, 141, 0.1)");
          gradient.addColorStop(1, "rgba(28, 183, 141, 0)");
          return gradient;
        },
        pointBackgroundColor: '#1CB78D',
        pointBorderWidth: 2,
        pointBorderColor: '#FFFFFF',
        pointRadius: 4,
        pointHoverRadius: 5
      },
    ],    
  }  
}

const DashboardTable = () => {
  const data = [
    { id: '11045211312', date: '7/Sept/2022', name:'John Doe', address: 'Makkah, Saudi Arab', trips: 'Hotel' ,total: '$120.00', status: 'complete' },
    { id: '11045211312', date: '7/Sept/2022', name:'John Doe', address: 'Makkah, Saudi Arab', trips: 'Flight' ,total: '$120.00', status: 'unpaid' },
    { id: '11045211312', date: '7/Sept/2022', name:'John Doe', address: 'Makkah, Saudi Arab', trips: 'Tour Package' ,total: '$120.00', status: 'canceled' },
    { id: '11045211312', date: '7/Sept/2022', name:'John Doe', address: 'Makkah, Saudi Arab', trips: 'Car' ,total: '$120.00', status: 'complete' },
    { id: '11045211312', date: '7/Sept/2022', name:'John Doe', address: 'Makkah, Saudi Arab', trips: 'Hotel' ,total: '$120.00', status: 'complete' },
    { id: '11045211312', date: '7/Sept/2022', name:'John Doe', address: 'Makkah, Saudi Arab', trips: 'Hotel' ,total: '$120.00', status: 'unpaid' },
  ]
  return(
    <div className="agent-dashboard__data">
      <table className="agent-dashboard__data-table">
        <thead>
          <tr className="agent-dashboard__data-list">
            <th>Order ID</th>
            <th>Date</th>
            <th>Name</th>
            <th>Address</th>
            <th>Trips</th>
            <th>Total</th>
            <th className="agent-dashboard__data-list--center">Payment status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {data.map((d, index) => (
          <tr key={index} className="agent-dashboard__data-list">
            <td>{d.id}</td>
            <td>{d.date}</td>
            <td>{d.name}</td>
            <td>{d.address}</td>
            <td>{d.trips}</td>
            <td>{d.total}</td>
            <td>
              {(d.status === "complete") && (
               <div className="agent-dashboard__data-status agent-dashboard__data-status--complete">Complete</div>
              )}
              {(d.status === "unpaid") && (
               <div className="agent-dashboard__data-status agent-dashboard__data-status--unpaid">Unpaid</div>
              )}
              {(d.status === "canceled") && (
               <div className="agent-dashboard__data-status agent-dashboard__data-status--canceled">Canceled</div>
              )}              
            </td>            
            <td><Link href="#" className="agent-dashboard__data-link">See Details</Link></td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}
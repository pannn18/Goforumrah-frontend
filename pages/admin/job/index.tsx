import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import { Icons } from "@/types/enums"
import Link from "next/link"


export default function BookingHotel() {
  const tabs = {
    'All': [      
      { jobId: 'ID : 1000000', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000000', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000000', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000000', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000000', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
    ],
    'Draft': [      
      { jobId: 'ID : 1000000', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000001', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000002', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000003', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000004', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
    ],
    'Scheduled': [      
      { jobId: 'ID : 1000010', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000011', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000012', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000013', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000014', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
    ],
    'Published': [    
      { jobId: 'ID : 1000100', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000101', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000102', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000103', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
      { jobId: 'ID : 1000104', jobName: 'Senior HR Bisness Partner', role: '1', location: 'Amsterdam, Netherland' },
    ]
  }
  const [selectedTab, setSelectedTab] = useState<string>(Object.keys(tabs)[0])
  const [showReviewDropdown, setShowReviewDropdown] = useState<boolean>(false)

  return (
    <Layout>
      <AdminLayout pageTitle="Job post">
        <div className="container">
          <div className="admin-booking-hotel">
            <div className="admin-booking-hotel__wrapper">
              <div className="admin-booking-hotel__header">
                <div className="admin-booking-hotel__header-split">
                  <div className="admin-booking-hotel__header-tab-menu">
                    {Object.keys(tabs).map((tab, index) => (
                      <button
                        key={index}
                        className={`btn ${tab === selectedTab ? 'active' : ''}`}
                        onClick={() => setSelectedTab(tab)}>
                        {tab}
                      </button>
                    ))}
                  </div>
                  <div className="admin-header__search">
                    <input type="text" className="form-control" placeholder="Search" />
                    <SVGIcon src={Icons.Search} width={20} height={20} />
                  </div>
                </div>
                <Link href={'job/create'} className="admin-job__post-btn">
                  <SVGIcon src={Icons.Plus} width={20} height={20} color="#1B1B1BF5"/>
                  Add New
                </Link>
              </div>
              <div className="admin-booking-hotel__content">
                <div className="table-responsive">
                  <table className="admin-job__post-table w-100">
                    <tbody>
                      {tabs[selectedTab].map((hotel, index) => (
                        <PartnerList {...hotel} key={index} />
                      ))}
                    </tbody>
                  </table>  
                </div>
              </div>
              <div className="admin-booking-hotel__pagination">
                <div className="pagination">
                  <button type="button" className="pagination__button pagination__button--arrow">
                    <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                  </button>
                  <button type="button" className="pagination__button active">1</button>
                  <button type="button" className="pagination__button">2</button>
                  <button type="button" className="pagination__button">3</button>
                  <button type="button" className="pagination__button">...</button>
                  <button type="button" className="pagination__button">12</button>
                  <button type="button" className="pagination__button pagination__button--arrow">
                    <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </Layout>
  )
}

interface PartnerListProps {
  jobId: string;
  jobName: string;
  role: string;
  location: string;

}
const PartnerList = (props: PartnerListProps) => {
  const { jobId, jobName, role, location } = props
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  return (
    <tr className="admin-job__post-table-list">
      <td>
        <div className="admin-job__post-table-wrapper">
          <p className="admin-job__post-table-name">{jobName}</p>
          <p className="admin-job__post-table-id">{jobId}</p>
        </div>
      </td>
      <td>
        {(role === '0') && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--waiting">Waiting</div>
        )}
        {(role === '1') && (
          <div className="admin-job__post-table-role admin-job__post-table-role__green">Human Resource</div>
        )}
        {(role === '2') && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--canceled">Canceled</div>
        )}
        {(role === '3') && (
          <div className="admin-booking-hotel__table-status admin-booking-hotel__table-status--ongoing">Ongoing</div>
        )}
      </td>
      <td>
        <div className="admin-job__post-table-wrapper--row">
          <SVGIcon src={Icons.MapPinOutline} width={20} height={20} color="#9E9E9E"/>
          <p className="admin-job__post-table-location">{location}</p>
        </div>
      </td>
      <td>
        <button type="button" className="admin-job__post-btn">
          Edit
        </button>
      </td>
    </tr>
  )
}
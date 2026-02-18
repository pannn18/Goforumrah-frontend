import Layout from "@/components/layout"
import AdminLayout from "@/components/admin/layout"
import { useEffect, useState } from "react"
import DropdownMenu from "@/components/elements/dropdownMenu"
import SVGIcon from "@/components/elements/icons"
import Link from "next/link"
import { callAPI } from "@/lib/axiosHelper"
import { BlurPlaceholderImage } from '@/components/elements/images'
import { Icons, Images } from "@/types/enums"
import LoadingOverlay from "@/components/loadingOverlay"
import moment from "moment"


export default function Customer() {

  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false)
  const [agentOverview, setAgentOverview] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filterStatus, setFilterStatus] = useState<string>('thisYear'); // Current Year
  const [filterType, setFilterType] = useState<number>(4); // Current Year
  const [agents, setAgents] = useState<any>([]);
  const [filteredAgents, setFilteredAgents] = useState<any>([]);
  const [search, setSearch] = useState<string>('');

  // Pagination Settings
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, agents?.length);

  // let visibleAgents = agents?.slice(startIndex, endIndex);
  // console.log(visibleAgents)
  // console.log(filteredAgents)
  const visibleAgents = filteredAgents?.slice(startIndex, endIndex);

  useEffect(() => {
    const filteredAgent = async () => {
      const filteredResults = searchFunction(agents, search);
      setFilteredAgents(filteredResults);
    }

    filteredAgent()
  }, [search, agents])


  // useEffect(() => {

  //   // Agent Summary
  //   const fetchDataAgentOverview = async () => {
  //     const { status, data, ok, error } = await callAPI('/admin-agent/statistic', 'GET', {}, true)
  //     try {
  //       if (ok) {
  //         setAgentOverview(data)
  //         setIsLoading(false)
  //       }
  //     } catch (err) {
  //       console.error(err.message)
  //     }
  //   }

  //   // Agent Table Data
  //   const fetchDataAgentTable = async (agentOverview) => {

  //     console.log(agentOverview)
  //     // const { listed_agent } = agentOverview

  //     const payload = {
  //       filter: filterType,
  //       show_per_page: agents.length < 8 ? 20 : agents.length,
  //       start: (currentPage - 1) * itemsPerPage,
  //       end: currentPage * itemsPerPage,
  //     }

  //     try {
  //       const { status, data, ok, error } = await callAPI('/admin-agent/data', 'POST', payload, true);

  //       if (ok) {
  //         const agentData = data?.data;
  //         const totalData = data?.total;
  //         const totalPageCount = Math.ceil(totalData / itemsPerPage);

  //         setTotalPages(totalPageCount);
  //         setAgents(agentData);
  //         setIsLoading(false);
  //       }
  //     } catch (err) {
  //       console.error(err.message);
  //     }
  //   }


  //   fetchDataAgentOverview()
  //   fetchDataAgentTable(agentOverview)
  // }, [filterStatus, filterType])

  useEffect(() => {
    // Agent Summary
    const fetchDataAgentOverview = async () => {
      try {
        const { status, data, ok, error } = await callAPI('/admin-agent/statistic', 'GET', {}, true);

        if (ok) {
          setAgentOverview(data);
          setIsLoading(false);

          fetchDataAgentTable(data);
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    // Agent Table Data
    const fetchDataAgentTable = async (agentOverview) => {

      const { listed_agent } = agentOverview

      const payload = {
        filter: filterType,
        show_per_page: agents.length < 8 ? listed_agent : agents.length,
        start: (currentPage - 1) * itemsPerPage,
        end: currentPage * itemsPerPage,
      }

      try {
        const { status, data, ok, error } = await callAPI('/admin-agent/data', 'POST', payload, true);

        if (ok) {
          const agentData = data?.data;
          const totalData = data?.total;
          const totalPageCount = Math.ceil(totalData / itemsPerPage);
console.log(agentData)
          setTotalPages(totalPageCount);
          setAgents(agentData);
          setIsLoading(false);
        }
      } catch (err) {
        console.error(err.message);
      }
    }

    fetchDataAgentOverview();
  }, [filterStatus, filterType]);


  const searchFunction = (agents, search) => {
    // console.log('Search query:', search);

    if (!search) {
      return agents;
    }

    const normalizedSearch = search.toLowerCase().trim();

    return agents.filter((agent) => {
      console.log(agent)
      const agentName = agent?.fullname?.toLowerCase();
      const agentEmail = agent?.email?.toLowerCase();
      const agentPhone = agent?.phone?.toLowerCase();
      const agentLastActive = agent?.last_active;
      const agentTotalBooking = String(agent?.total_booking);

      // check if any of the fields contains the normalized search query
      return (
        agentName?.includes(normalizedSearch) ||
        agentEmail?.includes(normalizedSearch) ||
        agentPhone?.includes(normalizedSearch) ||
        agentLastActive?.includes(normalizedSearch) ||
        agentTotalBooking?.includes(normalizedSearch)

      );
    });
  };


  // Handle Filter Change
  const handleFilterChange = (selectedType, selectedStatus) => {
    setFilterType(selectedType);
    setFilterStatus(selectedStatus);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };


  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setSearch(event.target.value);
  };

  // console.log(agents?.length)

  return (
    <Layout>
      <AdminLayout pageTitle="Agent">
        <div className="container">
          <div className="admin-agent">
            {isLoading ? (
              <LoadingOverlay />
            ) : (
              <>
                <CustomerSummary agentOverview={agentOverview} />
                <div className="admin-agent__wrapper">
                  <div className="admin-agent__header">
                    <div className="admin-partner__header-search admin-agent__header-search">
                      <input
                        type="text"
                        className="form-control admin-agent__search-input"
                        placeholder="Search"
                        value={search}
                        onChange={() => handleSearchChange(event)}
                      />
                      <SVGIcon src={Icons.Search} width={20} height={20} />
                    </div>
                    <div className="custom-dropdown">
                      <div onClick={() => setShowFilterDropdown(true)} className="custom-dropdown-toggle">
                        <SVGIcon src={Icons.Filter} width={20} height={20} color="#1B1B1B" />
                        {filterStatus === 'today' && 'Today'}
                        {filterStatus === 'thisWeek' && 'This Week'}
                        {filterStatus === 'thisMonth' && 'This Month'}
                        {filterStatus === 'thisYear' && 'This Year'}
                        <SVGIcon src={Icons.ArrowDown} width={16} height={16} className="dropdown-toggle-arrow" color="#1B1B1B" />
                      </div>
                      <DropdownMenu show={showFilterDropdown} setShow={setShowFilterDropdown} className="admin-agent__header-dropdown-menu" style={{ marginTop: 8, width: 180 }}>
                        <div className="custom-dropdown-menu__options">
                          <Link href="#" onClick={() => handleFilterChange(1, 'today')} className="admin-agent__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                            Today
                          </Link>
                          <Link href="#" onClick={() => handleFilterChange(2, 'thisWeek')} className="admin-agent__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                            This Week
                          </Link>
                          <Link href="#" onClick={() => handleFilterChange(3, 'thisMonth')} className="admin-agent__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                            This Month
                          </Link>
                          <Link href="#" onClick={() => handleFilterChange(4, 'thisYear')} className="admin-agent__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                            This Year
                          </Link>
                        </div>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="admin-agent__content">
                    <table className="admin-agent__table">
                      <thead>
                        <tr className="admin-agent__table-list">
                          <th>No.</th>
                          <th>Agency Name</th>
                          <th>Email</th>
                          <th>Number phone</th>
                          <th className="admin-agent__table-header-center">Booking Total</th>
                          <th className="admin-agent__table-header-center">Status</th>
                          <th >Last Active</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleAgents?.length ? (
                          visibleAgents?.map((agent, index) => (
                            <CustomerList {...agent} index={startIndex + index + 1} key={index} />
                          ))
                        ) : (
                          <tr className="admin-agent__table-list">
                            <td colSpan={9} className="text-center">
                              Sorry, No agents found. Try a different search term or check your filter better results.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="hotel-details__guest-pagination">
                    <div className="pagination">
                      <button
                        type="button"
                        className="pagination__button pagination__button--arrow"
                        onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                        disabled={currentPage === 1}
                      >
                        <SVGIcon src={Icons.ArrowLeft} width={24} height={24} />
                      </button>

                      {Array.from({ length: totalPages }).map((_, index) => {
                        if (
                          (index === 0 && currentPage > 3) ||
                          (index === totalPages - 1 && currentPage < totalPages - 2) ||
                          (index >= currentPage - 2 && index <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={index + 1}
                              type="button"
                              className={`pagination__button ${currentPage === index + 1 ? 'active' : ''}`}
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          );
                        } else if ((index === 1 && currentPage > 4) || (index === totalPages - 2 && currentPage < totalPages - 3)) {
                          return (
                            <button disabled key={`ellipsis-${index}`} type="button" className="pagination__button">
                              ...
                            </button>
                          );
                        }
                        return null;
                      })}

                      <button
                        type="button"
                        className="pagination__button pagination__button--arrow"
                        onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <SVGIcon src={Icons.ArrowRight} width={24} height={24} />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </AdminLayout>
    </Layout>
  );
}

const CustomerSummary = ({ agentOverview }) => {
  const renderPercentageIcon = (percentage) => {
    if (percentage > 0) {
      return <SVGIcon src={Icons.TrendUp} width={20} height={20} className="admin-agent__summary-header-icon admin-agent__summary-content-recap--success" />;
    }
    else if (percentage <= 0) {
      return <SVGIcon src={Icons.TrendDown} width={20} height={20} className="admin-agent__summary-header-icon admin-agent__summary-content-recap--danger" />;
    }
    else {
      return null;
    }
  };

  const getSummaryClass = (percentage) => {
    if (percentage > 0) {
      return 'admin-agent__summary-content-recap--success';
    }
    else if (percentage <= 0) {
      return 'admin-agent__summary-content-recap--danger';
    }
    else {
      return '';
    }
  };

  // console.log(agentOverview)

  return (
    <div className="admin-agent__summary">
      <div className="admin-agent__summary-box">
        <div className="admin-agent__summary-row">
          <p className="admin-agent__summary-header-text">New Agent</p>
          <SVGIcon src={Icons.Money} width={20} height={20} className="admin-agent__summary-header-icon" />
        </div>
        <div className="admin-agent__summary-row">
          <p className="admin-agent__summary-content-value">{agentOverview?.new_agent}</p>
          <div className={`admin-agent__summary-content-recap ${getSummaryClass(agentOverview?.new_agent_percentage)}`}>
            <p className={`admin-agent__summary-content-recap--text`}>{agentOverview?.new_agent_percentage}%</p>
            {renderPercentageIcon(agentOverview?.new_agent_percentage)}
          </div>
        </div>
      </div>
      <div className="admin-agent__summary-box">
        <div className="admin-agent__summary-row">
          <p className="admin-agent__summary-header-text">All Agent</p>
          <SVGIcon src={Icons.UserList} width={20} height={20} className="admin-agent__summary-header-icon" color="#FFFFFF" />
        </div>
        <div className="admin-agent__summary-row">
          <p className="admin-agent__summary-content-value">{agentOverview?.listed_agent}</p>
          <div className={`admin-agent__summary-content-recap ${getSummaryClass(agentOverview?.listed_agent_percentage)}`}>
            <p className="admin-agent__summary-content-recap--text">{agentOverview?.listed_agent_percentage}%</p>
            {renderPercentageIcon(agentOverview?.listed_agent_percentage)}
          </div>
        </div>
      </div>
      <div className="admin-agent__summary-box">
        <div className="admin-agent__summary-row">
          <p className="admin-agent__summary-header-text">Inactive Agent</p>
          <SVGIcon src={Icons.Disabled} width={20} height={20} className="admin-agent__summary-header-icon" />
        </div>
        <div className="admin-agent__summary-row">
          <p className="admin-agent__summary-content-value">{agentOverview?.inactive_agent}</p>
          <div className={`admin-agent__summary-content-recap ${getSummaryClass(agentOverview?.inactive_agent_percentage)}`}>
            <p className="admin-agent__summary-content-recap--text">{agentOverview?.inactive_agent_percentage}%</p>
            {renderPercentageIcon(agentOverview?.inactive_agent_percentage)}
          </div>
        </div>
      </div>
    </div>
  )
}

interface CustomerListProps {
  id_customer: number,
  status: number,
  fullname: string,
  total_booking: number,
  phone: string,
  email: string,
  last_active: string,
  soft_delete: number,
  total: string,
}
const CustomerList = (props: CustomerListProps & { index: number }) => {
  const { index, id_customer, fullname, phone, email, total_booking, last_active, soft_delete, status } = props
  const [showActionDropdown, setShowActionDropdown] = useState<boolean>(false)

  // Format Last Active
  const formatLastActive = (lastActive: string) => {
    const lastActiveDate = new Date(lastActive);
    const now = new Date();

    if (isNaN(lastActiveDate.getTime()) || isNaN(now.getTime())) {
      return 'Invalid date';
    }

    const differenceInYears: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24 * 365));

    if (differenceInYears > 0) {
      return `${differenceInYears} ${differenceInYears === 1 ? 'Year' : 'Years'} ago`;
    }

    const differenceInDays: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

    if (differenceInDays > 0) {
      return `${differenceInDays} ${differenceInDays === 1 ? 'Day' : 'Days'} ago`;
    }

    const differenceInHours: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60));

    if (differenceInHours > 0) {
      return `${differenceInHours} ${differenceInHours === 1 ? 'Hour' : 'Hours'} ago`;
    }

    const differenceInMinutes: number = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
    return `${differenceInMinutes} ${differenceInMinutes === 1 ? 'Minute' : 'Minutes'} ago`;
  };

  // console.log(props)

  return (
    <tr className="admin-agent__table-list">
      <td>
        {index < 10 ? `0${index}` : index}
      </td>
      <td>
        <div className="admin-agent__table-name">
          {fullname}
        </div>
      </td>
      <td>{email}</td>
      <td>{phone}</td>
      <td>
        <div className="admin-agent__table-header-center">
          {total_booking}
        </div>
      </td>
      <td>
        {(status === 0) && (
          <div className="admin-partner__table-status admin-partner__table-status--waiting mx-0">
            Need Review
          </div>
        )}
        {(status === 1) && (
          <div className="admin-partner__table-status admin-partner__table-status--paid mx-0">
            Active
          </div>
        )}
        {(status === 2) && (
          <div className="admin-partner__table-status admin-partner__table-status--ongoing mx-0">
            Suspended
          </div>
        )}
        {(soft_delete === 1) && (
          <div className="admin-partner__table-status admin-partner__table-status--danger mx-0">
            Declined
          </div>
        )}
      </td>
      <td>
        <div className="admin-agent__table-list--icon">
          <SVGIcon src={Icons.CircleTime} width={20} height={20} className="" />
          {formatLastActive(last_active)}
        </div>
      </td>
      <td>
        <div className="custom-dropdown">
          <div onClick={() => setShowActionDropdown(true)} className="custom-dropdown-toggle admin-booking-hotel__table-dropdown">
            <SVGIcon src={Icons.More} width={20} height={20} className="" />
          </div>
          <DropdownMenu show={showActionDropdown} setShow={setShowActionDropdown} className="admin-booking-hotel__header-dropdown-menu" style={{ marginTop: 8, marginLeft: -110, width: 155 }}>
            <div className="custom-dropdown-menu__options">
              <Link href={`/admin/agent/details/${id_customer}`} className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-hotel__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Eye} width={20} height={20} className="" />
                  <p>See Details</p>
                </div>
              </Link>
              <div className="admin-agent__dropdown-separator"></div>
              <Link href="#" className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-hotel__dropdown-menu-option-details">
                  <SVGIcon src={Icons.Disabled} width={20} height={20} className="" color="#1B1B1B" />
                  <p>Suspend</p>
                </div>
              </Link>
              <Link href="#" className="admin-booking-hotel__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly">
                <div className="admin-booking-hotel__dropdown-menu-option-delete">
                  <SVGIcon src={Icons.Trash} width={20} height={20} className="" />
                  <p>Delete</p>
                </div>
              </Link>
            </div>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )
}
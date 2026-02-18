import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/components/layout";
import AdminLayout from "@/components/admin/layout";
import DropdownMenu from "@/components/elements/dropdownMenu";
import SVGIcon from "@/components/elements/icons";
import { Icons } from "@/types/enums";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { callAPI } from "@/lib/axiosHelper";
import moment from "moment";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  elements: {
    bar: {
      borderRadius: 30,
      borderSkipped: false,
      barPercentage: 0.1,
    },
  },
  responsive: true,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        stepSize: 100,
      },
    },
  },
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: false },
  },
};
export const earningOptions = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      grid: { display: false },
    },
    y: {
      ticks: { stepSize: 500 },
    },
  },
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: { enabled: false },
  },
};

// Earnings
const getChartData = (labels, dataEarnings) => {
  return {
    labels: labels,
    datasets: [
      {
        fill: true,
        // label: "Sales",
        // data: [80, 600, 400, 550, 400, 650],
        label: "Sales",
        data: dataEarnings,
        borderColor: "rgba(28, 183, 141, 0.4",
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
        pointBackgroundColor: "#1CB78D",
        pointBorderWidth: 2,
        pointBorderColor: "#FFFFFF",
        pointRadius: 4,
        pointHoverRadius: 5,
      },
    ],
  };
};

const labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

export const dataPage = {
  labels,
  datasets: [
    {
      label: "Page View",
      data: [350, 150, 320, 240, 100, 250, 50, 290, 310, 190, 110, 290],
      backgroundColor: "#1CB78D",
      barThickness: 10,
    },
  ],
};

const getDataOverview = (labels, data) => {
  return {
    labels: labels,
    datasets: [
      {
        label: "Booking",
        data: data,
        backgroundColor: "#1CB78D",
        barThickness: 6,
      },
    ],
  };
};

export default function Dashboard() {
  return (
    <Layout>
      <AdminLayout>
        <div className="container dashboard">
          <DashboardContent />
          <DashboardTable />
        </div>
      </AdminLayout>
    </Layout>
  );
}

const DashboardContent = () => {
  const [bookingBarOverview, setBookingBarOverview] = useState(null);
  const [earningBarOverview, setEarningBarOverview] = useState(null);
  const [bookingOverview, setBookingOverview] = useState(null);
  const tabs = {
    Hotel: 1,
    Flight: 2,
    Car: 3,
    Tour: 4,
  };
  const [selectedTabOverview, setSelectedTabOverview] = useState<String>(
    Object.keys(tabs)[0]
  );

  const [selectedTabOverviewValue, setSelectedTabOverviewValue] = useState(1);
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [filter, setFilter] = useState(4);
  const [displayFilter, setDisplayFilter] = useState("This Year");

  useEffect(() => {
    const fetchDataBookingOverview = async () => {
      const { data, error, ok } = await callAPI(
        "/admin-dashboard/booking-overview",
        "POST",
        { filter: filter, type: selectedTabOverviewValue },
        true
      );
      if (error) {
        console.log(error);
      }
      if (ok && data) {
        setBookingOverview(data);

        // for booking overview bar
        const bookingBarChart = data.earning_overview
        let labelOverview
        let dataBarChart
        if (filter === 4) {
          labelOverview = Object.keys(bookingBarChart)
          dataBarChart = Object.values(bookingBarChart)
        }
        if (filter === 3 || filter === 2) {
          labelOverview = bookingBarChart.map(item => Object.keys(item)[0]);
          dataBarChart = bookingBarChart.map(item => Object.values(item)[0]);
        }

        const barDataOverview = getDataOverview(labelOverview, dataBarChart);
        setBookingBarOverview(barDataOverview);

        // for earning overview bar
        const earningOverviewData = data.earning_bar_chart;

        const labels = Object.keys(earningOverviewData);
        const dataEarnings = Object.values(earningOverviewData);
        const getChart = getChartData(labels, dataEarnings);
        setEarningBarOverview(getChart);

      }
    };

    fetchDataBookingOverview();
  }, [filter, selectedTabOverviewValue]);

  const [dataSummary, setDataSummary] = useState(null);
  useEffect(() => {
    const getDataSummary = async () => {
      const { error, ok, data } = await callAPI(
        "/admin-dashboard/summary",
        "GET",
        {},
        true
      );
      if (error) {
        console.log(error);
      }
      if (ok && data) {
        setDataSummary(data);
      }
    };
    if (!dataSummary) {
      getDataSummary();
    }
  }, [dataSummary]);

  const handleFilter = (value) => {
    if (value !== filter) {
      setFilter(value);

      if (value === 1) setDisplayFilter("Today");
      if (value === 2) setDisplayFilter("This Week");
      if (value === 3) setDisplayFilter("This Month");
      if (value === 4) setDisplayFilter("This Year");
    }

    setShowFilterDropdown(false);
  };

  // Calculate Monthly Report
  const [dataMonthly, setDataMonthly] = useState<any>();

  const [selectedTabMonthly, setSelectedTabMonthly] = useState<String>(
    Object.keys(tabs)[0]
  );
  const [selectedTabMonthlyValue, setSelectedTabMonthlyValue] = useState(1);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  useEffect(() => {
    setLoadingMonthly(true);
    const getDataMonthly = async () => {
      try {
        const { ok, error, data } = await callAPI(
          "/admin-dashboard/monthly-report",
          "POST",
          { type: selectedTabMonthlyValue },
          true
        );
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setDataMonthly(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingMonthly(false);
      }
    };

    getDataMonthly();
  }, [selectedTabMonthlyValue]);

  const [dataMonthlyReport, setDataMonthlyReport] = useState({
    performance_score: 0,
    performance_score_percentage: 0,
    excellent_customer: 0,
    excellent_customer_percentage: 0,
    very_good_customer: 0,
    very_good_customer_percentage: 0,
    good_customer: 0,
    good_customer_percentage: 0,
    poor_customer: 0,
    poor_customer_percentage: 0,
    very_poor_customer: 0,
    very_poor_customer_percentage: 0,
  });
  const [loadingMonthlyReport, setLoadingMonthlyReport] = useState(false);

  useEffect(() => {
    setLoadingMonthlyReport(true);
    const getDataMonthlyReport = async () => {
      try {
        const { ok, error, data } = await callAPI(
          "/admin-dashboard/customer-satisfaction",
          "GET",
          {},
          true
        );
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setDataMonthlyReport(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingMonthlyReport(false);
      }
    };

    getDataMonthlyReport();
  }, []);

  const {
    performance_score,
    performance_score_percentage,
    excellent_customer,
    excellent_customer_percentage,
    very_good_customer,
    very_good_customer_percentage,
    good_customer,
    good_customer_percentage,
    poor_customer,
    poor_customer_percentage,
    very_poor_customer,
    very_poor_customer_percentage,
  } = dataMonthlyReport;

  return (
    <>
      <div className="dashboard__summary">
        <div className="dashboard__summary-box">
          <div className="dashboard__summary-box-content">
            <p className="dashboard__summary-box-title">Total Revenue</p>
            <SVGIcon
              className="dashboard__summary-box-icon"
              src={Icons.Money}
              width={20}
              height={20}
            />
          </div>
          <div className="dashboard__summary-box-content">
            <p className="dashboard__summary-box-data">
              $ {dataSummary?.total_revenue}
            </p>
            {/* <div className="dashboard__summary-box-recap dashboard__summary-box-recap--up">
              <p>20%</p>
              <SVGIcon src={Icons.TrendUp} width={16} height={16} />
            </div> */}
          </div>
        </div>
        <div className="dashboard__summary-box">
          <div className="dashboard__summary-box-content">
            <p className="dashboard__summary-box-title">Total Customer</p>
            <SVGIcon
              className="dashboard__summary-box-icon"
              src={Icons.Book}
              width={20}
              height={20}
            />
          </div>
          <div className="dashboard__summary-box-content">
            <p className="dashboard__summary-box-data">
              {dataSummary?.total_customer}
            </p>

            {dataSummary?.total_customer_percentage >= 0 ? (
              <div className="dashboard__summary-box-recap dashboard__summary-box-recap--up">
                <p>{dataSummary?.total_customer_percentage}%</p>
                <SVGIcon src={Icons.TrendUp} width={16} height={16} />
              </div>
            ) : (
              <div className="dashboard__summary-box-recap dashboard__summary-box-recap--down">
                <p>{dataSummary?.total_customer_percentage}%</p>
                <SVGIcon src={Icons.TrendDown} width={16} height={16} />
              </div>
            )}
          </div>
        </div>

        <div className="dashboard__summary-box">
          <div className="dashboard__summary-box-content">
            <p className="dashboard__summary-box-title">Total Partner</p>
            <SVGIcon
              className="dashboard__summary-box-icon"
              src={Icons.Group}
              width={20}
              height={20}
            />
          </div>
          <div className="dashboard__summary-box-content">
            <p className="dashboard__summary-box-data">
              {dataSummary?.total_partner}
            </p>

            {dataSummary?.total_partner_percentage >= 0 ? (
              <div className="dashboard__summary-box-recap dashboard__summary-box-recap--up">
                <p>{dataSummary?.total_partner_percentage}%</p>
                <SVGIcon src={Icons.TrendUp} width={16} height={16} />
              </div>
            ) : (
              <div className="dashboard__summary-box-recap dashboard__summary-box-recap--down">
                <p>{dataSummary?.total_partner_percentage}%</p>
                <SVGIcon src={Icons.TrendDown} width={16} height={16} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard__content">
        <div className="dashboard__content-split">
          <div className="dashboard__overview">
            <div className="dashboard__overview-header">
              <h5 className="dashboard__overview-header-title">
                Booking Overview
              </h5>
              <div className="custom-dropdown">
                <div
                  onClick={() => setShowFilterDropdown(true)}
                  className="custom-dropdown-toggle"
                >
                  <SVGIcon src={Icons.Filter} width={20} height={20} />
                  <div style={{ whiteSpace: "nowrap" }}>{displayFilter}</div>
                  <SVGIcon
                    src={Icons.ArrowDown}
                    width={16}
                    height={16}
                    className="dropdown-toggle-arrow"
                  />
                </div>
                <DropdownMenu
                  show={showFilterDropdown}
                  setShow={setShowFilterDropdown}
                  className="admin-booking-car__header-dropdown-menu"
                  style={{ marginTop: 8, width: 180 }}
                >
                  <div className="custom-dropdown-menu__options">
                    <Link
                      href={"#"}
                      onClick={() => handleFilter(2)}
                      className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                    >
                      This Week
                    </Link>
                    <Link
                      href={"#"}
                      onClick={() => handleFilter(3)}
                      className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                    >
                      This Month
                    </Link>
                    <Link
                      href={"#"}
                      onClick={() => handleFilter(4)}
                      className="admin-booking-car__dropdown-menu-option custom-dropdown-menu__option custom-dropdown-menu__option--readonly"
                    >
                      This Year
                    </Link>
                  </div>
                </DropdownMenu>
              </div>
            </div>
            <div className="dashboard__tab">
              <div className="dashboard__tabs-menu">
                {Object.keys(tabs).map((tab, index) => (
                  <button
                    key={index}
                    className={`btn ${tab === selectedTabOverview ? "active" : ""
                      }`}
                    onClick={() => {
                      setSelectedTabOverview(tab);
                      setSelectedTabOverviewValue(tabs[tab]);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {selectedTabOverview === "Hotel" && (
              <div className="dashboard__overview-inner">
                <div className="dashboard__overview-summary">
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Earning Summary
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Money}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        $ {bookingOverview?.earning_summary || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.earning_summary_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.earning_summary_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.earning_summary_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Total Booking
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Book}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.total_booking || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.total_booking_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.total_booking_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.total_booking_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Active Partner
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Group}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.partner_active || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.partner_active_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.partner_active_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.partner_active_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {bookingBarOverview && (
                  <Bar options={options} data={bookingBarOverview} />
                )}
              </div>
            )}

            {/* Flight is coming soon */}
            {selectedTabOverview === "Flight" && (
              <div className="dashboard__overview-inner">
                <div className="text-center">
                  Coming soon
                </div>
                {/* <div className="dashboard__overview-summary">
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Earning Summary
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Money}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        $ {bookingOverview?.earning_summary}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.earning_summary_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.earning_summary_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.earning_summary_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Total Booking
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Book}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.total_booking}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.total_booking_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.total_booking_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.total_booking_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Active User
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Group}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.partner_active || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.partner_active_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.partner_active_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.partner_active_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* {bookingBarOverview && (
                  <Bar options={options} data={bookingBarOverview} />
                )} */}
              </div>
            )}
            {selectedTabOverview === "Car" && (
              <div className="dashboard__overview-inner">
                <div className="dashboard__overview-summary">
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Earning Summary
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Money}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        $ {bookingOverview?.earning_summary || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.earning_summary_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.earning_summary_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.earning_summary_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Total Booking
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Book}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.total_booking || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.total_booking_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.total_booking_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.total_booking_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Active Partner
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Group}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.partner_active || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.partner_active_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.partner_active_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.partner_active_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {bookingBarOverview && (
                  <Bar options={options} data={bookingBarOverview} />
                )}
              </div>
            )}

            {/* Tour is coming soon */}
            {selectedTabOverview === "Tour" && (
              <div className="dashboard__overview-inner">
                <div className="text-center">
                  Coming soon
                </div>
                {/* <div className="dashboard__overview-summary">
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Earning Summary
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Money}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        $ {bookingOverview?.earning_summary}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.earning_summary_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.earning_summary_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.earning_summary_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Total Booking
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Book}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.total_booking}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.total_booking_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.total_booking_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.total_booking_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="dashboard__summary-box">
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-title">
                        Active Partner
                      </p>
                      <SVGIcon
                        className="dashboard__summary-box-icon"
                        src={Icons.Group}
                        width={20}
                        height={20}
                      />
                    </div>
                    <div className="dashboard__summary-box-content">
                      <p className="dashboard__summary-box-data">
                        {bookingOverview?.partner_active || 0}
                      </p>
                      <div
                        className={`dashboard__summary-box-recap dashboard__summary-box-recap${bookingOverview?.partner_active_percentage >= 0
                          ? "--up"
                          : "--down"
                          }`}
                      >
                        <p>{bookingOverview?.partner_active_percentage}%</p>
                        <SVGIcon
                          src={
                            bookingOverview?.partner_active_percentage >= 0
                              ? Icons.TrendUp
                              : Icons.TrendDown
                          }
                          width={16}
                          height={16}
                        />
                      </div>
                    </div>
                  </div>
                </div> */}
                {/* {bookingBarOverview && (
                  <Bar options={options} data={bookingBarOverview} />
                )} */}
              </div>
            )}

          </div>
          <div className="dashboard__overview">
            <div className="dashboard__overview-header">
              <h5 className="dashboard__overview-header-title">
                Earning Overview
              </h5>
            </div>
            {earningBarOverview && (
              <div style={{ height: 278 }}>
                <Line
                  options={earningOptions}
                  data={earningBarOverview}
                  height={200}
                />
              </div>
            )}
          </div>
        </div>

        <div className="dashboard__content-split">
          <div className="dashboard__calculate">
            <div className="dashboard__calculate-header">
              <h5>Calculate Report</h5>
            </div>
            <div className="dashboard__tab">
              <div className="dashboard__tabs-menu">
                {Object.keys(tabs).map((tab, index) => (
                  <button
                    key={index}
                    className={`btn ${tab === selectedTabMonthly ? "active" : ""
                      }`}
                    onClick={() => {
                      setSelectedTabMonthly(tab);
                      setSelectedTabMonthlyValue(tabs[tab]);
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="dashboard__calculate-content">
                {loadingMonthly && <p>LoadingMonthly...</p>}
                {!loadingMonthly && selectedTabMonthly === "Hotel" && (
                  <>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">
                        Total Properties
                      </p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.total_properties} Hotel</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Hotel}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">Total Booking</p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.booking}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Book}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">Total Partner</p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.total_partner}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Group}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">Total Revenue</p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.transaction_revenue}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Money}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Flight is coming soon */}
                {!loadingMonthly && selectedTabMonthly === "Flight" && (
                  <div>
                    Coming soon
                  </div>
                  // <>
                  //   <div className="dashboard__calculate-box">
                  //     <p className="dashboard__calculate-title">
                  //       Total Properties
                  //     </p>
                  //     <div className="dashboard__calculate-box-content">
                  //       <p>44 Planes</p>
                  //       <SVGIcon
                  //         className="dashboard__calculate-box-icon"
                  //         src={Icons.Flight}
                  //         width={24}
                  //         height={24}
                  //       />
                  //     </div>
                  //   </div>
                  //   <div className="dashboard__calculate-box">
                  //     <p className="dashboard__calculate-title">New Booking</p>
                  //     <div className="dashboard__calculate-box-content">
                  //       <p>2K</p>
                  //       <SVGIcon
                  //         className="dashboard__calculate-box-icon"
                  //         src={Icons.Book}
                  //         width={24}
                  //         height={24}
                  //       />
                  //     </div>
                  //   </div>
                  //   <div className="dashboard__calculate-box">
                  //     <p className="dashboard__calculate-title">New customer</p>
                  //     <div className="dashboard__calculate-box-content">
                  //       <p>1.5K</p>
                  //       <SVGIcon
                  //         className="dashboard__calculate-box-icon"
                  //         src={Icons.Group}
                  //         width={24}
                  //         height={24}
                  //       />
                  //     </div>
                  //   </div>
                  //   <div className="dashboard__calculate-box">
                  //     <p className="dashboard__calculate-title">
                  //       Total Revenue
                  //     </p>
                  //     <div className="dashboard__calculate-box-content">
                  //       <p>44 M</p>
                  //       <SVGIcon
                  //         className="dashboard__calculate-box-icon"
                  //         src={Icons.Money}
                  //         width={24}
                  //         height={24}
                  //       />
                  //     </div>
                  //   </div>
                  // </>
                )}

                {!loadingMonthly && selectedTabMonthly === "Car" && (
                  <>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">
                        Total Units
                      </p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.total_properties}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Car}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">Total Booking</p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.booking}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Book}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">Total Partner</p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.total_partner}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Group}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">
                        Total Revenue
                      </p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.transaction_revenue}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Money}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Tour is coming soon */}
                {!loadingMonthly && selectedTabMonthly === "Tour" && (
                  <>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">
                        Total Package
                      </p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.total_properties}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Car}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">Total Booking</p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.booking}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Book}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                    <div className="dashboard__calculate-box">
                      <p className="dashboard__calculate-title">Total Revenue</p>
                      <div className="dashboard__calculate-box-content">
                        <p>{dataMonthly?.transaction_revenue}</p>
                        <SVGIcon
                          className="dashboard__calculate-box-icon"
                          src={Icons.Money}
                          width={24}
                          height={24}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="dashboard__customer">
            <div className="dashboard__customer-header">
              <h5>Calculate Report</h5>
            </div>
            <div className="dashboard__customer-rating">
              {loadingMonthlyReport && <p>Loading...</p>}
              {!loadingMonthlyReport && (
                <>
                  <div className="dashboard__customer-rating-summary">
                    <div className="dashboard__customer-rating-number">
                      <h5>
                        {performance_score}
                        <span className="dashboard__customer-rating-percentage">
                          <span
                            style={{
                              color:
                                performance_score_percentage > 0
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {performance_score_percentage} %
                          </span>
                        </span>
                      </h5>
                    </div>
                    <p className="dashboard__customer-rating-score">
                      Performance score
                    </p>
                  </div>
                  <div className="dashboard__customer-rating-progress">
                    <div className="dashboard__customer-rating-legend dashboard__customer-rating-legend--carnelian"></div>
                    <div className="dashboard__customer-rating-legend dashboard__customer-rating-legend--siena"></div>
                    <div className="dashboard__customer-rating-legend dashboard__customer-rating-legend--yellow"></div>
                    <div className="dashboard__customer-rating-legend dashboard__customer-rating-legend--lime"></div>
                    <div className="dashboard__customer-rating-legend dashboard__customer-rating-legend--mantis"></div>
                  </div>
                  <div>
                    <div className="dashboard__customer-desc">
                      <div className="dashboard__customer-desc-dot dashboard__customer-rating-legend--mantis"></div>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--name">
                        Excellent
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--total">
                        {excellent_customer} User
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--percentage">
                        {excellent_customer_percentage}%
                      </p>
                    </div>

                    <div className="dashboard__customer-desc">
                      <div className="dashboard__customer-desc-dot dashboard__customer-rating-legend--lime"></div>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--name">
                        Very Good
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--total">
                        {very_good_customer} User
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--percentage">
                        {very_good_customer_percentage}%
                      </p>
                    </div>

                    <div className="dashboard__customer-desc">
                      <div className="dashboard__customer-desc-dot dashboard__customer-rating-legend--yellow"></div>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--name">
                        Good
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--total">
                        {good_customer} User
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--percentage">
                        {good_customer_percentage}%
                      </p>
                    </div>

                    <div className="dashboard__customer-desc">
                      <div className="dashboard__customer-desc-dot dashboard__customer-rating-legend--siena"></div>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--name">
                        Poor
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--total">
                        {poor_customer} User
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--percentage">
                        {poor_customer_percentage}%
                      </p>
                    </div>

                    <div className="dashboard__customer-desc">
                      <div className="dashboard__customer-desc-dot dashboard__customer-rating-legend--carnelian"></div>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--name">
                        Very Poor
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--total">
                        {very_poor_customer} User
                      </p>
                      <p className="dashboard__customer-desc-text dashboard__customer-desc-text--percentage">
                        {very_poor_customer_percentage}%
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardTable = () => {
  const data = [
    {
      id: "11045211312",
      date: "7/Sept/2022",
      name: "John Doe",
      address: "Makkah, Saudi Arab",
      status: "paid",
      total: "$120.00",
    }
  ];
  const [latestBooking, setLatestBooking] = useState(null);
  const [loadingLatestBooking, setLoadingLatestBooking] = useState(false);

  useEffect(() => {
    setLoadingLatestBooking(true);

    const getDataLatestBooking = async () => {
      try {
        const { ok, error, data } = await callAPI(
          "/admin-dashboard/latest-booking",
          "GEt",
          {},
          true
        );
        if (error) {
          console.log(error);
        }
        if (ok && data) {
          setLatestBooking(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingLatestBooking(false);
      }
    };

    getDataLatestBooking();
  }, []);

  const formatedDate = (date) => {
    return moment(date, "YYYY-MM-DD HH:mm:ss").format("DD/MMM/YYYY");
  };

  return (
    <div className="dashboard__data">
      <div className="table-responsive">
        <table className="dashboard__data-table w-100">
          <thead>
            <tr className="dashboard__data-list">
              <th>Order ID</th>
              <th>Date</th>
              <th>Name</th>
              <th>Address</th>
              <th className="dashboard__data-list--center">Payment status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loadingLatestBooking && (
              <tr>
                <td>Loading...</td>
              </tr>
            )}
            {!loadingLatestBooking &&
              latestBooking &&
              latestBooking.map((d, index) => (
                <tr key={index} className="dashboard__data-list">
                  <td>{d.order_id}</td>
                  <td>{formatedDate(d.date)}</td>
                  <td>{d.fullname}</td>
                  <td>{d.address}</td>
                  <td>
                    <div className={`dashboard__data-status dashboard__data-status--${d.status === 1 ? 'paid' : 'unpaid'}`}>
                      {d.status === 1 ? 'Paid' : 'Unpaid'}
                    </div>
                  </td>
                  <td>$ {d.total_price}</td>
                  <td>
                    {d.booking_type === 'hotel' &&
                      <Link
                        href={`/admin/booking/hotel/detail?id=${d.order_id}`}
                        className="dashboard__data-link">
                        See Details
                      </Link>
                    }
                    {d.booking_type === 'car' &&
                      <Link
                        href={`/admin/booking/car/${d.order_id}`}
                        className="dashboard__data-link">
                        See Details
                      </Link>
                    }
                    {d.booking_type === 'flight' &&
                      <Link
                        href={`/admin/booking/flight/${d.order_id}`}
                        className="dashboard__data-link">
                        See Details
                      </Link>
                    }
                    {d.booking_type === 'tour' &&
                      <Link
                        href={`/admin/booking/tour-booking/${d.order_id}`}
                        className="dashboard__data-link">
                        See Details
                      </Link>
                    }
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DashboardList = () => {
  const data = [
    {
      id: "11045211312",
      date: "7/Sept/2022",
      name: "John Doe",
      address: "Makkah, Saudi Arab",
      status: "paid",
      total: "$120.00",
    },
    {
      id: "11045211312",
      date: "7/Sept/2022",
      name: "John Doe",
      address: "Makkah, Saudi Arab",
      status: "paid",
      total: "$120.00",
    },
    {
      id: "11045211312",
      date: "7/Sept/2022",
      name: "John Doe",
      address: "Makkah, Saudi Arab",
      status: "paid",
      total: "$120.00",
    },
    {
      id: "11045211312",
      date: "7/Sept/2022",
      name: "John Doe",
      address: "Makkah, Saudi Arab",
      status: "paid",
      total: "$120.00",
    },
    {
      id: "11045211312",
      date: "7/Sept/2022",
      name: "John Doe",
      address: "Makkah, Saudi Arab",
      status: "paid",
      total: "$120.00",
    },
    {
      id: "11045211312",
      date: "7/Sept/2022",
      name: "John Doe",
      address: "Makkah, Saudi Arab",
      status: "paid",
      total: "$120.00",
    },
  ];
  return (
    <div className="dashboard__list">
      <div className="dashboard__list-header">Order ID</div>

      <div className="dashboard__list-item custom-dropdown"></div>
    </div>
  );
};

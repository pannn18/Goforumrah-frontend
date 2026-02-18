import Layout from '@/components/layout'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/business/car/navbar'
import { BlurPlaceholderImage } from '@/components/elements/images'
import Link from 'next/link';
import SVGIcon from '@/components/elements/icons'
import { Icons, Images, Services } from '@/types/enums'
import arrowLeft from 'assets/images/arrow_left_green.svg'
import iconCheck from 'assets/images/icon_check_soft.svg'
import { callAPI } from '@/lib/axiosHelper';
import LoadingOverlay from '@/components/loadingOverlay';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import { getData } from 'country-list';
import { C } from '@fullcalendar/core/internal-common';
import { useRouter } from 'next/router';


export default function OpeningTime() {
  const { data: session, status } = useSession()
  const id_car_business = (status === 'authenticated' && session ? Number(session.user.id) : null)
  const [loading, setLoading] = useState<boolean>(false)
  const [timeData, setTimeData] = useState<any>([])
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      if (!id_car_business) return
      try {
        const { data, error, ok } = await callAPI('/car-business/working-time/show', 'POST', { id_car_business: id_car_business }, true)
        if (error) {
          console.log(error)
        }
        if (ok && data) {
          setTimeData(data)
          console.log(data);
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [id_car_business])


  const handleSave = async () => {
    setLoading(true);

    try {
      const PayloadData = timeData.map(item => ({
        id_car_business: item.id_car_business,
        day_name: item.day_name,
        status: item.status === 1 ? '1' : item.status === 0 ? '0' : null,
        from: item.from,
        to: item.to
      }));

      console.log('Formated data', PayloadData);
      await callAPI('/car-business/working-time/store-array', 'POST', PayloadData, true)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setIsDirty(false);
      router.reload;
    }
  };



  const handleInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    if (type === 'radio') {
      // Handle radio input change
      const updatedData = [...timeData];
      updatedData[index].status = value === '1' ? 1 : 0;
      setTimeData(updatedData);
    } else {
      // Handle text input change
      // Check if the value is empty or already contains a colon
      if (value === '' || value.includes(':')) {
        setTimeData((prev) => {
          const updatedData = [...prev];
          updatedData[index][name] = value;
          return updatedData;
        });
      } else {
        // Insert a colon after the first two characters
        const formattedValue = value.replace(/(\d{2})/, '$1:');
        setTimeData((prev) => {
          const updatedData = [...prev];
          updatedData[index][name] = formattedValue;
          return updatedData;
        });
      }
    }

    setIsDirty(true);
  };

  if (loading) {
    return <LoadingOverlay />
  }

  return (
    <Layout>
      <Navbar showHelp={true} lightMode={true} showNotification={true} loggedIn={true} />
      <div className="car-dashboard">
        <header>
          <div className="car-dashboard__header">
            <div className="container car-dashboard__content-header car-dashboard__content-header--time">
              <div className="car-dashboard__header-left">
                <Link href={"/business/car"}>
                  <BlurPlaceholderImage className='' alt='image' src={arrowLeft} width={24} height={24} />
                </Link>
                <h4 className='car-dashboard__content-title-heading'>Back</h4>
              </div>
              <button className="btn btn-md btn-success" onClick={handleSave} disabled={!isDirty}>Save</button>
            </div>
          </div>
        </header>
        <div className="container">
          <div className='car-dashboard__content-container'>
            <div className="dashboard__data dashboard__data--opening">
              <div className="table-responsive">
                <table className="dashboard__data-table table">
                  <thead>
                    <tr className="dashboard__data-list">
                      <th>Day Name</th>
                      <th>Time From</th>
                      <th>Time to</th>
                      <th><div className="car-dashboard__title-radio">24 Hours</div></th>
                      <th><div className="car-dashboard__title-radio">Closed</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeData.map((item, index) => (
                      <tr key={index} className="dashboard__data-list">
                        <td>{item.day_name}</td>
                        <td>
                          <div className='add-location__content-label--time'>
                            <input
                              type="text"
                              placeholder="00:00"
                              className="form-control goform-input goform-input__opening"
                              name="from"
                              id={`workingTimeFrom${item.from}`}
                              aria-describedby="workingTimeFromHelp"
                              value={item.from}
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className='add-location__content-label--time'>
                            <input
                              type="text"
                              placeholder="00:00"
                              className="form-control goform-input goform-input__opening"
                              name="to"
                              id={`workingTimeFrom${item.to}`}
                              aria-describedby="workingTimeFromHelp"
                              value={item.to}
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="car-dashboard__radio">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`status-${item.day_name}`}
                              defaultValue="1"
                              defaultChecked={item.status === 1}
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="car-dashboard__radio">
                            <input
                              className="form-check-input"
                              type="radio"
                              name={`status-${item.day_name}`}
                              defaultValue="0"
                              defaultChecked={item.status === 0}
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
};
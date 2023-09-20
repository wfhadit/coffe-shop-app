import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Header } from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { api } from '../../API/api';
import { useSelector } from 'react-redux';

export const SalesReportPage = () => {
  const userSelector = useSelector((state) => state.auth);
  const [createdAt, setcreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [reportData, setReportData] = useState([]);

  const handleCreatedAt = (e) => {
    setcreatedAt(e.target.value);
  };

  const handleUpdatedAt = (e) => {
    setUpdatedAt(e.target.value);
  };

  const fetchReport = async () => {
    try {
      const response = await api.get('/report/p1', {
        params: {
          createdAt,
          updatedAt,
        },
      });
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  useEffect(() => {
    if (createdAt && updatedAt) {
      fetchReport();
    }
  }, [createdAt, updatedAt]);

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: reportData.map((item) => item.date),
    },
  };

  const series = [
    {
      name: 'Total Sales',
      data: reportData.map((item) => item.totalSales),
    },
  ];
  console.log(reportData);

  return (
    <>
      <Header />
      <div className='flex flex-row'>
        <Sidebar />
        <div className='flex-grow ml-4'>
          <div className='my-4'>
            <label className='text-gray-600 px-3'>Select date:</label>
            <input
              type='date'
              value={createdAt}
              onChange={handleCreatedAt}
              className='px-2 py-1 border rounded-md border-gray-300'
            />
            {/* <label className='text-gray-600 ml-4'>End Date:</label>
            <span className='px-2'></span>
            <input
              type='date'
              value={updatedAt}
              onChange={handleUpdatedAt}
              className='px-2 py-1 border rounded-md border-gray-300'
            /> */}
            {/* <button
              onClick={fetchReport}
              className='ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              Filter
            </button> */}
          </div>
          <Chart options={options} series={series} type='bar' height='350' />
        </div>
      </div>
    </>
  );
};

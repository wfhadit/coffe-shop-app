import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Header } from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { api } from '../../API/api';
import { useSelector } from 'react-redux';

export const SalesReportPage = () => {
  const userSelector = useSelector((state) => state.auth);
  const [totalByDate, setTotalByDate] = useState([]);
  const [dateAxis, setDateAxis] = useState([]);

  const handleQueryDate = () => {
    const datefrom = document.getElementById('datefrom-report-graphic').value;
    const dateto = document.getElementById('dateto-report-graphic').value;
    fetchReport(datefrom, dateto);
  };

  const fetchReport = async (datefrom = '', dateto = '') => {
    try {
      const { data } = await api.get('/report/p1', {
        params: {
          datefrom,
          dateto,
        },
      });
      setTotalByDate(data.totalByDate);
      setDateAxis(data.date);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const options = {
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: dateAxis,
    },
  };

  const series = [
    {
      name: 'Total Sales',
      data: totalByDate,
    },
  ];

  return (
    <>
      <Header />
      <div className='flex flex-row'>
        <div className='bg-[#D3A774] px-2 w-60 h-screen'>
          <Sidebar />
        </div>
        <div className='flex-grow ml-4'>
          <h1 className='font-sans font-bold text-center py-4 text-2xl'>
            Graph Sales Data
          </h1>
          <div className='my-4'>
            <label className='font-sans font-semibold px-3'>Date from:</label>
            <input
              id='datefrom-report-graphic'
              type='date'
              onChange={handleQueryDate}
              className='px-2 py-1 border rounded-md border-gray-300'
            />
          </div>
          <div className='my-4'>
            <label className='font-sans font-semibold px-3'>Date to:</label>
            <span className='ml-5'></span>
            <input
              id='dateto-report-graphic'
              type='date'
              onChange={handleQueryDate}
              className='px-2 py-1 border rounded-md border-gray-300'
            />
          </div>
          <Chart options={options} series={series} type='bar' height='350' />
        </div>
      </div>
    </>
  );
};

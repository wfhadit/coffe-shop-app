import { useState } from 'react';
import Chart from 'react-apexcharts';

export const SalesReportPage = () => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [
          'Senin',
          'Selasa',
          'Rabu',
          'Kamis',
          'Jumat',
          'Sabtu',
          'Minggu',
        ],
      },
    },
    series: [
      {
        name: 'Total Penjualan Produk',
        data: [30, 90, 45, 50, 31, 60, 70, 91],
      },
    ],
  });

  return (
    <>
      <Chart
        options={state.options}
        series={state.series}
        type='line'
        width='500'
      />
    </>
  );
};

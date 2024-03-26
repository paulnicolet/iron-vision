'use client';
import 'chartjs-adapter-date-fns';

import { Chart } from 'chart.js/auto';
import { useEffect } from 'react';

import PerformanceChartProps from './props';

export default function Vo2maxHistory({
  vo2maxHistory,
}: PerformanceChartProps) {
  const data = vo2maxHistory.map((point) => {
    return {
      date: point.generic.calendarDate,
      value: point.generic.vo2MaxPreciseValue,
    };
  });

  useEffect(() => {
    const chart = new Chart('chart2', {
      type: 'line',
      data: {
        datasets: [{ data: data, label: 'vo2max' }],
      },
      options: {
        parsing: {
          xAxisKey: 'date',
          yAxisKey: 'value',
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Vo2max',
            },
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  });

  return (
    <div>
      <h2>Vo2max history</h2>
      <canvas id="chart2" />
    </div>
  );
}

'use client';
import 'chartjs-adapter-date-fns';

import { Chart } from 'chart.js/auto';
import { groupBy, range } from 'lodash';
import { useEffect } from 'react';

import ActivitiesChartProps from './props';

export default function HeartrateProgression({
  activities,
}: ActivitiesChartProps) {
  const data = activities
    .filter((activity) => activity.activityType.typeKey === 'running')
    .map((activity) => {
      return {
        pace: activity.duration / 60 / (activity.distance / 1000),
        averageHeartRate: activity.averageHR,
        date: activity.startTimeLocal,
      };
    });

  const buckets = range(2, 10, 0.5);

  const groups = groupBy(data, (point) => {
    for (const bucket of buckets) {
      if (point.pace < bucket) {
        return bucket;
      }
    }
  });

  useEffect(() => {
    const chart = new Chart('chart', {
      type: 'bubble',
      data: {
        datasets: Object.keys(groups)
          .map((key) => key)
          .sort()
          .map((key) => {
            return {
              label: `< ${key}mn/km`,
              data: groups[key].map((row) => {
                return {
                  x: row.date,
                  y: row.averageHeartRate,
                  r: 10,
                };
              }),
            };
          }),
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
            },
          },
          y: { beginAtZero: false },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  });

  return (
    <div>
      <h2>Heart rate per pace</h2>
      <canvas id="chart" />
    </div>
  );
}

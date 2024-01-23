'use client';
import 'chartjs-adapter-date-fns';

import { Chart } from 'chart.js/auto';
import { format, parseISO } from 'date-fns';
import { IActivity } from 'garmin-connect/dist/garmin/types';
import { groupBy, range, reduce } from 'lodash';
import { useEffect, useRef } from 'react';

interface HeartRateEvolutionChartProps {
  activities: IActivity[];
}

function computeSeason(activity: IActivity): string {
  const date = parseISO(activity.startTimeLocal);
  let year = parseISO(activity.startTimeLocal).getFullYear();
  if (activity.activityType.typeKey.includes('ski')) {
    if (date.getMonth() < 7) {
      year -= 1;
    }
  }
  return year.toString();
}

export default function DistancePerSportChart({
  activities,
}: HeartRateEvolutionChartProps) {
  const data = activities
    .filter((activity) => activity.distance)
    .map((activity) => {
      return {
        type: activity.activityType.typeKey,
        distance: activity.distance,
        season: computeSeason(activity),
      };
    });

  const grouped = data.reduce((result, item) => {
    let type: { string: any } = (result[item.type as keyof typeof result] =
      result[item.type as keyof typeof result] || {});
    let seasonTotal = (type[item.season as keyof typeof type] =
      type[item.season as keyof typeof type] || 0);
    type[item.season as keyof typeof type] = seasonTotal + item.distance;
    return result;
  }, {});

  console.log(grouped);

  useEffect(() => {
    const chart = new Chart('chart2', {
      type: 'line',
      data: {
        datasets: Object.keys(grouped).map((type) => {
          const seasons = grouped[type as keyof typeof grouped];
          return {
            label: type,
            tension: 0.2,
            data: Object.keys(seasons).map((season) => {
              return {
                season: season,
                total: seasons[season] / 1000,
              };
            }),
          };
        }),
      },
      options: {
        parsing: {
          xAxisKey: 'season',
          yAxisKey: 'total',
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Season',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Distance (km)',
            },
            type: 'logarithmic',
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
      <h2>Distance per sport</h2>
      <canvas id="chart2" />
    </div>
  );
}

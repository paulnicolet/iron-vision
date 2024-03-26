'use client';
import 'chartjs-adapter-date-fns';

import { Chart } from 'chart.js/auto';
import { getUnixTime, getWeek, getYear, parseISO, sub } from 'date-fns';
import { IActivity } from 'garmin-connect/dist/garmin/types';
import { useEffect } from 'react';

import ActivitiesChartProps from './props';

function computeWeek(activity: IActivity) {
  const date = parseISO(activity.startTimeLocal);
  return formatWeek(date);
}

function formatWeek(date: Date): string {
  const week = getWeek(date, { weekStartsOn: 1 });
  const year = getYear(date);
  return `${year}-${week}`;
}

function generateAllWeeks(activities: IActivity[]): string[] {
  const firstActivityDate = parseISO(
    activities.toSorted((activity) => -getUnixTime(activity.startTimeLocal))[0]
      .startTimeLocal
  );

  var currentDate = new Date();
  var weeks: string[] = [];
  while (currentDate > firstActivityDate) {
    const newWeek = formatWeek(currentDate);
    currentDate = sub(currentDate, { days: 1 });
    if (weeks[weeks.length - 1] == newWeek) {
      continue;
    }
    weeks.push(newWeek);
  }

  return weeks;
}

export default function TrainingLoadPerWeek({
  activities,
}: ActivitiesChartProps) {
  const data = activities.map((activity) => {
    return {
      type: activity.activityType.typeKey,
      duration: activity.duration,
      week: computeWeek(activity),
    };
  });

  const labels = generateAllWeeks(activities);

  console.log(labels.findIndex((label) => label == '2023-1'));

  const grouped = data.reduce((result, item) => {
    let type: { string: any } = (result[item.type as keyof typeof result] =
      result[item.type as keyof typeof result] || {});

    let weekTotal = (type[item.week as keyof typeof type] =
      type[item.week as keyof typeof type] || 0);
    type[item.week as keyof typeof type] = weekTotal + item.duration;
    return result;
  }, {});

  const datasets = Object.keys(grouped).map((type) => {
    const weeks = grouped[type as keyof typeof grouped];
    return {
      label: type,
      tension: 0.2,
      data: Object.keys(weeks).map((week) => {
        return {
          week: week,
          hours: weeks[week] / 60 / 60,
        };
      }),
    };
  });

  useEffect(() => {
    const chart = new Chart('chart2', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        parsing: {
          xAxisKey: 'week',
          yAxisKey: 'hours',
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weeks',
            },
            stacked: true,
          },
          y: {
            title: {
              display: true,
              text: 'Load (hours)',
            },
            stacked: true,
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
      <h2>Weekly training load</h2>
      <canvas id="chart2" />
    </div>
  );
}

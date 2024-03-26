'use client';
import 'chartjs-adapter-date-fns';

import { Chart } from 'chart.js/auto';
import {
  differenceInDays,
  formatDuration,
  getUnixTime,
  getWeek,
  getYear,
  intervalToDuration,
  parseISO,
  sub,
} from 'date-fns';
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

function getFirstActivityDate(activities: IActivity[]): Date {
  return parseISO(
    activities.toSorted((activity) => -getUnixTime(activity.startTimeLocal))[0]
      .startTimeLocal
  );
}

function generateAllWeeks(activities: IActivity[]): string[] {
  const firstActivityDate = getFirstActivityDate(activities);

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

  const totalSeconds = data
    .map((point) => point.duration)
    .reduce((total, point) => total + point);

  const totalDuration = intervalToDuration({
    start: sub(new Date(), { seconds: totalSeconds }),
    end: new Date(),
  });

  const totalDurationDays = differenceInDays(
    new Date(),
    sub(new Date(), { seconds: totalSeconds })
  );

  const totalWindowDays = differenceInDays(
    new Date(),
    getFirstActivityDate(activities)
  );

  const labels = generateAllWeeks(activities);

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
      <h3>
        Total: {formatDuration(totalDuration)} (over {totalWindowDays} days)
      </h3>
      <h4>
        You spent {((totalDurationDays / totalWindowDays) * 100).toFixed(2)}% of
        your life doing sport
      </h4>
      <canvas id="chart2" />
    </div>
  );
}

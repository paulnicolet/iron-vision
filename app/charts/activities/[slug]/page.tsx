import React from 'react';

import { getClient } from '@/app/lib/garmin';

import DistancePerSeason from '../charts/DistancePerSeason';
import HeartrateProgression from '../charts/HeartrateProgression';

const CHARTS = {
  'distance-per-season': DistancePerSeason,
  'heartrate-progression': HeartrateProgression,
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(CHARTS);
}

export default async function Page({ params }: { params: { slug: string } }) {
  const Chart = CHARTS[params.slug as keyof typeof CHARTS];
  const activities = await getClient().getActivities(0, 1000);

  return (
    <div>
      <Chart activities={activities} />
    </div>
  );
}

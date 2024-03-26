import React from 'react';

import { getClient } from '@/app/lib/garmin';

import CHARTS from '../charts';

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(CHARTS).map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const Chart = CHARTS[params.slug as keyof typeof CHARTS];
  const vo2maxHistory = (await getClient().get(
    'https://connectapi.garmin.com/metrics-service/metrics/maxmet/monthly/2022-04-01/2024-03-31'
  )) as any[];

  return (
    <div>
      <Chart vo2maxHistory={vo2maxHistory} />
    </div>
  );
}

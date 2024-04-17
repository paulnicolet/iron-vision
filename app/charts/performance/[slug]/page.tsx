import React from 'react';

import { getClient } from '@/app/lib/garmin';

import CHARTS from '../charts';

export const dynamicParams = false;

export async function generateStaticParams() {
  return Object.keys(CHARTS).map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const Chart = CHARTS[params.slug as keyof typeof CHARTS];

  const currentDate = new Date();
  const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  const vo2maxHistory = (await getClient().get(
    `https://connectapi.garmin.com/metrics-service/metrics/maxmet/monthly/2022-04-01/${formattedDate}`
  )) as any[];

  return (
    <div>
      <Chart vo2maxHistory={vo2maxHistory} />
    </div>
  );
}

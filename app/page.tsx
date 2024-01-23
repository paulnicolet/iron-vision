import { redirect } from 'next/navigation';

import { unauthenticate } from './action';
import DistancePerSportChart from './components/DistancePerSportChart';
import HeartRateEvolutionChart from './components/HeartRateEvolutionChart';
import { getClient, isLoggedIn } from './lib/garmin';

export default async function Home() {
  if (!isLoggedIn()) {
    return redirect('/login');
  }

  const activities = await getClient().getActivities(0, 1000);

  return (
    <main>
      <h1>Hello</h1>
      <form action={unauthenticate}>
        <button type="submit">Logout</button>
      </form>
      <DistancePerSportChart activities={activities} />
      <HeartRateEvolutionChart activities={activities} />
    </main>
  );
}

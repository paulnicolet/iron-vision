import { redirect } from 'next/navigation';

import { getClient, isLoggedIn } from './lib/garmin';

export default async function Home() {
  if (!isLoggedIn()) {
    return redirect('/login');
  }

  const activities = await getClient().getActivities(0, 1);

  return (
    <main>
      <h1>Hello</h1>
      <span>Your last activity: {activities[0].activityName} </span>
    </main>
  );
}

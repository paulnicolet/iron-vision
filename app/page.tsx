import Link from 'next/link';
import { redirect } from 'next/navigation';

import { useGarminClient } from './hooks/useGarminClient';

export default async function Home() {
  const { isLoggedIn, getClient } = useGarminClient();
  if (!isLoggedIn()) {
    return redirect('/login');
  }

  const activities = await getClient()!.getActivities(0, 1);

  return (
    <main>
      <h1>Hello</h1>
      <span>Your last activity: {activities[0].activityName} </span>
    </main>
  );
}

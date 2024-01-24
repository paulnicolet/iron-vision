import { redirect } from 'next/navigation';

import { unauthenticate } from './action';
import { isLoggedIn } from './lib/garmin';

export default async function Home() {
  if (!isLoggedIn()) {
    return redirect('/login');
  }

  return (
    <main>
      <h1>Hello</h1>
      <form action={unauthenticate}>
        <button type="submit">Logout</button>
      </form>
    </main>
  );
}

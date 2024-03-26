import Image from 'next/image';
import { redirect } from 'next/navigation';

import { unauthenticate } from './action';
import { getClient, isLoggedIn } from './lib/garmin';

export default async function Home() {
  if (!isLoggedIn()) {
    return redirect('/login');
  }

  const profile = await getClient().getUserProfile();
  var firstname = 'you';
  try {
    firstname = profile.fullName.split(' ')[0];
  } catch {}

  return (
    <main>
      <Image
        width="40"
        height="40"
        src={profile.profileImageUrlSmall}
        alt="profile picture"
        style={{ marginTop: 20 }}
      />
      <h1>Hello {firstname}, press ⌘K</h1>
      <form action={unauthenticate}>
        <button type="submit">Logout</button>
      </form>
    </main>
  );
}

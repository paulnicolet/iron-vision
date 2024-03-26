import { redirect } from 'next/navigation';

import { isLoggedIn } from '../lib/garmin';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!isLoggedIn()) {
    return redirect('/login');
  }

  return <div>{children}</div>;
}

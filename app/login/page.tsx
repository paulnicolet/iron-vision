import { useGarminClient } from '../hooks/useGarminClient';
import { authenticate } from './action';

export default function Login() {
  const { isLoggedIn, login, getClient } = useGarminClient();

  return (
    <main>
      <h3>Is logged in: {isLoggedIn() ? 'Yes' : 'No'}</h3>

      <form action={authenticate}>
        <div>
          <label>Email</label>
          <input name="email" type="text" required />
        </div>

        <div>
          <label>Password</label>
          <input name="password" type="password" required />
        </div>

        <button type="submit">Login</button>
      </form>
    </main>
  );
}

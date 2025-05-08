// src/components/LoginButton.tsx
import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { useAuth0 } from '@auth0/auth0-react';

function Login() {
  const auth = useAuth0();//useAuth();
  const [email, setEmail] = useState(''); // State to hold the email input
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    // The email here acts as a HINT to Ping Identity.
    // Ping might use it to pre-fill the username field on its login page.
    // It doesn't bypass the actual authentication steps (password, MFA etc.)
    /*
    auth.signinRedirect({ login_hint: email }).catch((err) => {
      console.error("Failed to initiate login redirect:", err);
      // Handle error display for the user
    });
    */
  };

  // Handle different auth states
  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }
  /*
  if (auth.isAuthenticated) {
    return (
      <div>
        <p>Hello {auth.user?.profile?.name}!</p>
        <p>Your ID Token (JWT):</p>
        <pre style={{ maxWidth: '80vw', overflowX: 'auto', background: '#eee', padding: '10px' }}>
          {auth.user?.id_token}
        </pre>
        <button onClick={() => auth.signoutRedirect()}>Log out</button>
      </div>
    );
  }
  */

  // If not authenticated, show login form
  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin} disabled={!email}>
        Log In
      </button>
      <p>Enter your email to start the login process.</p>
    </div>
  );
}

export default Login;
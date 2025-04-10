// src/CallbackPage.tsx
import React, { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router';

function CallbackPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // The AuthProvider's onSigninCallback handles the token processing.
    // This component just needs to render while that happens.
    // If there's an error during callback processing, it will be reflected
    // in auth.error state in the main app.
    // We check if we are already authenticated and redirect away
    // or if loading is finished but we are not authenticated (error occurred).
    if (!auth.isLoading && auth.isAuthenticated) {
        console.log("Callback successful, redirecting...");
         // Redirect handled by onSigninCallback in index.tsx usually
        // navigate('/'); // Or let onSigninCallback handle redirect
    } else if (!auth.isLoading && !auth.isAuthenticated){
         console.error("Callback failed or user not authenticated.");
         // Optionally redirect to an error page or login
         navigate('/');
    }

    // The onSigninCallback in AuthProvider config should handle navigation
    // after successful sign-in. This component might just show a loading indicator.

  }, [auth.isLoading, auth.isAuthenticated, navigate]);


  // Render loading indicator or minimal content
  return <div>Processing login...</div>;
}

export default CallbackPage;
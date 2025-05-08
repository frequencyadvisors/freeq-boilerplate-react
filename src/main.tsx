import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getConfig } from './config.ts';
import history from "history/browser";
import { To } from 'history';
import { Auth0Provider, Auth0ProviderOptions } from '@auth0/auth0-react';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './authConfig.ts';
import { AuthProvider as FreeqAuthProvider } from './context/AuthContext.tsx';

const onRedirectCallback = (appState?: { returnTo?: To }) => {
  history.push(
    appState?.returnTo || window.location.pathname
  );
};

const config = getConfig();

const providerConfig:Auth0ProviderOptions = {
  domain: config.domain,
  clientId: config.clientId,
  onRedirectCallback,
  authorizationParams: {
    redirect_uri: window.location.origin,
    ...(config.audience ? { audience: config.audience } : null),
  },
};

// Optional: Handle navigation for redirects
const onSigninCallback = (): void => {
  window.history.replaceState({}, document.title, window.location.pathname);
  // Redirect to the intended page after login
  window.location.href = '/';
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider {...providerConfig}>
    {/*<AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>*/}
      <FreeqAuthProvider>
        <App />
      </FreeqAuthProvider>
    {/*</AuthProvider>*/}
    </Auth0Provider>
  </StrictMode>,
)

/*
// Callback component (see step 7)
import CallbackPage from './CallbackPage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
      <BrowserRouter>
        <Routes>
          {/* Route for the OIDC callback 
          <Route path="/callback" element={<CallbackPage />} />
          {/* Your main application routes 
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
*/

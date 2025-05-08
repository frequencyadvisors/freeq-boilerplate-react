import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { lazy, memo, Suspense, useEffect, useState } from 'react';
/*
import { getConfig } from '../../config';
import Address from '../Address/Address';
import { useAuthContext } from '../../context/AuthContext';
import BannerCard from '../BannerCard/BannerCard';
import Steel from '../../assets/png/steel.png';
import Museum from '../../assets/png/museum.png';
*/
import { Box, Typography } from '@mui/material';
//import { useAuth, withAuthenticationRequired } from 'react-oidc-context';
import { useAuthContext } from '../context/AuthContext';
import { getConfig } from '../config';

const WalletBalance = lazy(() => import("./WalletBalance"));
const Faucet = lazy(() => import("./Faucet"));

const HomePage = () => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [address, setAddress] = useState<string | null>(null);
  
  //const pingAuth = useAuth();
  const { isAuthenticated, user, logout, isLoading, error } = useAuth0();
  
  const { auth } = useAuthContext();

  /* 
  //Auth0
  useEffect(() => {
    if (isAuthenticated && auth?.isSignedIn && auth.walletAddress) {
      setAddress(auth.walletAddress);
      try {
        setImageSrc(`${getConfig().apiOrigin}public/image/${auth.userProfileId}`);
      } catch {
        setImageSrc(user?.picture || ''); 
      }
    }
  }, [isAuthenticated, auth?.isSignedIn]);
  */

  return (
    /*pingAuth.isAuthenticated*/isAuthenticated ? (
      <Suspense
                fallback={
                  <div id="loading">
                    <span>Loading...</span>
                  </div>
                }
              >
    <div>
      {/*<p>Hello {pingAuth.user?.profile?.name}!</p>
      <p>Your ID Token (JWT):</p>
      <pre style={{ color: 'black', maxWidth: '80vw', overflowX: 'auto', background: '#eee', padding: '10px' }}>
        {pingAuth.user?.access_token}
      </pre>*/}
      {auth.isSignedIn && auth.walletAddress && (
      <>
        <p>Your Wallet Address:</p>
        <Typography>{auth.walletAddress}</Typography>
      </>
      )}
      <WalletBalance />
      <Faucet />
      <button onClick={() => logout() /*pingAuth.signoutRedirect()*/}>Log out</button>
    </div>
    </Suspense>
    ) : /*pingAuth.isLoading*/ isLoading ? (
      <div>
        <span>Loading...</span>
      </div>
    ) : /*pingAuth.error*/ error ? (
      <div>
        <span>Oops... {/*pingAuth.error.message*/ error.message}</span>
      </div>
    ) : null 
  );
}

export default withAuthenticationRequired(memo(HomePage), {
  onRedirecting: () => <>Loading...</>//<Loading />,
  //OnRedirecting: () => <>Loading...</>
});


import  { memo, useEffect, useState } from 'react';
import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { MonetizationOn } from '@mui/icons-material';
import Amount from './Amount';
import { useAuthContext } from '../context/AuthContext';
import { Box } from '@mui/material';
//import { useAuth, withAuthenticationRequired } from 'react-oidc-context';

const WalletBalance = () => {
  const { isAuthenticated } = useAuth0();
  //const { isAuthenticated } = useAuth();
  const { auth, callApi } = useAuthContext()
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await callApi(
          'userprofiles/me/wallets/balance',
          null,
          'POST',
        );
        setBalance(response.balance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    if (isAuthenticated/* && auth.isSignedIn*/) {
      fetchBalance();
    }
  }, [isAuthenticated/*, auth.isSignedIn*/])

  return (
    <Box className="balance-card">
      <Box className="token-title">
        <h5>
          <MonetizationOn className="material-symbols-outlined" /> Balance
        </h5>
      </Box>
      <Box className="token-content">
        <h2>
          <Amount value={balance} />
        </h2>
      </Box>
    </Box>
  );
}

//export default withAuthenticationRequired(WalletBalance, {
export default withAuthenticationRequired(memo(WalletBalance), {
  onRedirecting: () => (
  //OnRedirecting: () => (
    <div className="loading">
      <span>Loading...</span>
    </div>
  ),
});

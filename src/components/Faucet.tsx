import { memo, useEffect, useState } from 'react';
//import Loading from '../components/Loading';
//import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';
import { useAuth, withAuthenticationRequired } from 'react-oidc-context';
import { WaterDrop, MonetizationOn } from '@mui/icons-material';
import { useAuthContext } from '../context/AuthContext';
import { Button } from '@mui/material';
import Amount from './Amount';

interface FaucetState {
    error: Error|unknown|string;
}

const RELOAD_BALANCE_TIMER:number = 5000;

const Faucet = () => {
  const { isAuthenticated } = useAuth();
  const { auth, callApi } = useAuthContext();
  const [balance, setBalance] = useState(0);
  const [state, setState] = useState<FaucetState>({ error: null });
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const drip = async () => {
    setIsRunning(true);
    setIsSuccess(null);

    try {
      await callApi(`userprofiles/me/wallets/main/faucet`, null, 'POST');
      setIsSuccess(true);
    } catch (error: unknown) {
      setState({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
      setIsSuccess(false);
    } finally {
      setIsRunning(false);
      setTimeout(() => {
        setIsSuccess(null);
      },RELOAD_BALANCE_TIMER)
    }
  };

  return (
    <>
      <div className="page-header">
        <span>
          <WaterDrop className="material-symbols-outlined" />
        </span>
        <h1>Faucet</h1>
      </div>

      {isRunning ? (
        <div className="card">
          <h4>Sending funds to your wallet...</h4>
        </div>
      ) : isSuccess !== null ? (
        isSuccess ? (
          <div className="card">
            <h4 className="gen-title">Faucet Successfuly</h4>
            <div>Funds have been successfully added to your wallet.</div>
          </div>
        ) : (
          <div className="card">
            <h4 className="gen-title">Faucet Failed</h4>
            <div className="gen-content">{String(state.error)}</div>
          </div>
        )
      ) : (
        <div className="card">
          <div className="token-title">
            <h3>
              <MonetizationOn className="material-symbols-outlined" /> Balance
            </h3>
          </div>

          <div className="faucet-form">
            {/*
          <p>
            To ensure a sufficient balance for all users, the Faucet is set to
            dispense 0.1 BERA tokens every 4 hours.
          </p>
          */}
            <Button variant='contained' color="primary" onClick={drip}>
              Drip BERA
            </Button>
            {/*
          <div className="faucet-timer">
            <Timer className="material-symbols-outlined" />
            <span>01:58:00</span>
          </div>
          <p>
            Patience is a virtue - You need to wait for a while before we can
            drip more BERA
          </p>
          */}
          </div>
        </div>
      )}
      <div className="card">
        <div className="gen-title">
          <h3>
            <WaterDrop className="material-symbols-outlined" /> Fund your
            testnet wallet with BERA
          </h3>
        </div>

        <div className="gen-content">
          <p>
            The BERA Faucet allows you to receive 0.1 BERA every 4 hours with
            the click of a button. Follow the steps below to claim your free
            BERA tokens...
          </p>
          <br />
          <h5>Claim Your BERA</h5>
          <p>Click the "Drip BERA" button.</p>
          <p>A transaction request will be sent to the network.</p>
          <p>If successful, the 0.1 BERA will be deposited into your wallet.</p>
          <hr />
          <h5>Wait for the Cooldown Period</h5>
          <p>You can only claim once every 2 hours.</p>
          <p>A timer will indicate when you can claim again.</p>
          <p>
            If you see a message saying "You must wait before claiming again",
            check the timer and return when it's available.
          </p>
          <hr />
          <h5>Verify Your Balance</h5>
          <p>
            You balance will update as soon as the 0.1 BERA addition has been
            confirmed.
          </p>
          <p>
            The transaction may take a short time to process, depending on
            network activity.
          </p>
          <hr />
          <h5>Troubleshooting</h5>
          <p>
            <strong>Claim Button Disabled?</strong>
          </p>
          <p>You may need to wait for the cooldown period to end.</p>
          <p>
            <strong>Tokens Not Received?</strong>
          </p>
          <p>Check your wallet balance and refresh the page.</p>
          <p>
            <strong>Network Issues?</strong>
          </p>
          <p>Transactions may be delayed. Try again later if needed.</p>
        </div>

        {/* Render NavLinks outside the ul tag */}
      </div>
    </>
  );
};

export default withAuthenticationRequired(memo(Faucet), {
  OnRedirecting: () => (
    <div className="loading">
      <span>Loading...</span>
    </div>
  ), //<Loading />,
});

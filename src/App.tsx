import { useState } from 'react';
import { TextField, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress, Card, CardContent } from '@mui/material';
import { FreeqSDK } from './sdk/FreeqSDK';
import type { Wallet } from './sdk';

const sdk = FreeqSDK.getInstance();

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [signInError, setSignInError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [walletConnected, setWalletConnected] = useState(false);

  sdk.setOtpCallback(() => {
    setLoading(false);
    setOpenOtpDialog(true);
  });

  sdk.setSignInErrorCallback((errMsg) => {
    setSignInError(errMsg);
  });

  sdk.setOtpErrorCallback((errMsg) => {
    setOtpError(errMsg);
  });

  sdk.setSignOutErrorCallback((errMsg) => {
    setSignOutError(errMsg);
  });

  const handleEmailSubmit = async () => {
    try {
      setSignInError('');
      setLoading(true);
      const wallet = await sdk.signIn(email);
      console.log("wallet: " + JSON.stringify(wallet));
      setWallet(wallet);
      setWalletConnected(sdk.isWalletConnected())
    } catch (error) {
      setSignInError("'Error during sign in");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setOtpError('');
      setLoading(true);
      const validOtp = await sdk.submitOtp(otp);
      console.log("validOtp:" + validOtp);
      setLoading(false);
      setOtp('');
      if(validOtp) {
        setOpenOtpDialog(false);
      }
    } catch (error) {
      setOtpError("Error submitting OTP");
    }
  };

  const handleOtpCancel = async () => {
      setOtpError('');
      setLoading(false);
      setOpenOtpDialog(false);
      setOtp('');
  };

  const handleSignOut = async () => {
    try {
      await sdk.signOut();
      setWallet(undefined);
      setWalletConnected(sdk.isWalletConnected())
    } catch (error) {
      setSignOutError("'Error during sign out");
    }
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      gap={2}
    >
      <Typography color='primary' variant="h3" gutterBottom>
        Freeq SDK React Demo App
      </Typography>

      {signOutError && (
          <Typography color="error" sx={{ mt: 2 }}>
            {signOutError}
          </Typography>
      )}

      {!walletConnected && (
        <>
          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleEmailSubmit} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          {signInError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {signInError}
            </Typography>
          )}
        </>
      )}

      {walletConnected && (
        <>
          <Box display="flex" alignItems="center" gap={1} mt={2}>
            <Typography color="primary" sx={{ mt: 2 }}>
                  Wallet Address:
            </Typography>
            <Typography color="secondary" sx={{ mt: 2 }}>
                {wallet?.address}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleSignOut}>
              Sign out
            </Button>
          </Box>

          {(wallet && wallet.walletInventory.length > 0) ? (
          <Box >
            {wallet.walletInventory.map((item, index) => (
                <Card variant="outlined" key={index} sx={{ marginBottom: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {item.symbol}
                    </Typography>
                    <Typography variant="body1">
                      Balance: {item.balance}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {item.type}
                    </Typography>
                  </CardContent>
                </Card>
            ))}
          </Box>
        ) : (
          <Box mt={4}>
            <Typography variant="h6" color="text.secondary" align="center">
              No wallet inventory available.
            </Typography>
          </Box>
        )}

        </>
      )}


      {/* OTP Modal */}
      <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)} maxWidth = "md">
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="OTP Code"
            type="text"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOtpCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleOtpSubmit} color="primary" variant="contained">
            {loading ? <CircularProgress size={24} /> : 'Submit OTP'}
          </Button>
        </DialogActions>

        {otpError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {otpError}
        </Typography>
      )}
      </Dialog>
    </Box>
  );
}

export default App;

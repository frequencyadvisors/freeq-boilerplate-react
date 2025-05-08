import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { getConfig } from '../config';
import { SIGN_IN } from '../utils/constants/paths';
import { AuthContextType } from './types/ContextTypes';
import { authReducer, initialState } from './reducers/AuthReducer';
import { useAuth } from 'react-oidc-context';

const { apiOrigin, apiKey } = getConfig();

export const AuthContext = createContext<AuthContextType | null>(null);
export const AuthDispatchContext = createContext<React.Dispatch<any> | null>(null);
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
};

const _callApi = async (token: string, endpoint: string, data?: any, method?: any) => {
  try {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${apiOrigin}${endpoint}`, {
      method: method ? method : data ? 'POST' : 'GET',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  //const pingAuth = useAuth();
  const [auth, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const callSignin = async () => {
      try {
        const token = await getAccessTokenSilently();//pingAuth.user!.access_token!;//
        const data = await _callApi(token, SIGN_IN, { key: apiKey });
        dispatch({ type: 'SET_ALL', payload: {
          token: data.token,
          profile_id: data.userProfileId,
          wallet_id: data.walletId,
          wallet_address: data.walletAddress,
          signed_in: true
        }})
      } catch (error) {
        console.error('Error during sign-in:', error);
      }
    };

    //if (pingAuth.isAuthenticated && pingAuth.user) {
    if(isAuthenticated && !auth.isSignedIn) {
      callSignin();
    }
  }, [/*pingAuth*/isAuthenticated]);

  const callApi = async (endpoint: string, data?: any, method?: any) => {
    if (!auth.apiToken) {
      throw new Error('No token available. Call signin first.');
    }
    return await _callApi(auth.apiToken, `api/${endpoint}`, data, method);
  };

  return (
      <AuthContext.Provider value={{
        auth,
        callApi
      }}>
        <AuthDispatchContext.Provider value={dispatch}>
            {children}
        </AuthDispatchContext.Provider>
      </AuthContext.Provider>
  );
};

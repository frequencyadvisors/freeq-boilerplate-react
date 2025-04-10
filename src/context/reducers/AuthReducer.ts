import { AuthAction } from "../actions/AuthActions";
import { AuthState } from "../types/ContextTypes";

export const initialState: AuthState = {
  apiToken: null,
  userProfileId: null,
  walletId: null, 
  walletAddress: null,
  isSignedIn: false
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_ALL': 
      return {
        ...state,
        apiToken: action.payload.token,
        userProfileId: action.payload.profile_id,
        walletId: action.payload.wallet_id,
        walletAddress: action.payload.wallet_address,
        isSignedIn: action.payload.signed_in
      }
    case 'SET_API_TOKEN':
      return {
        ...state,
        apiToken: action.payload
      };
    case 'SET_USER_PROFILE':
      return {
        ...state,
        userProfileId: action.payload
      };
    case 'SET_WALLET':
      return {
        ...state,
        walletId: action.payload.id,
        walletAddress: action.payload.address
      };
    case 'CLEAR_AUTH':
      return initialState;
    case 'SET_SIGNED_IN':
      return {
        ...state,
        isSignedIn: action.payload
      };
    default:
      return state;
  }
};
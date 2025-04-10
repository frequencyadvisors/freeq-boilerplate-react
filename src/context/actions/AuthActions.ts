import { useContext } from "react";
import { AuthDispatchContext } from "../AuthContext";

export type AuthAction = 
  | { type: 'SET_API_TOKEN', payload: string }
  | { type: 'SET_USER_PROFILE', payload: string }
  | { type: 'SET_WALLET', payload: { id: string, address: string } }
  | { type: 'SET_SIGNED_IN', payload: boolean } //TODO: this and above may not be needed. delete when confirmed
  | { type: 'SET_ALL', payload: {token: string, profile_id: string, wallet_id:string, wallet_address: string, signed_in:boolean}}
  | { type: 'CLEAR_AUTH' } 

export const useAuthDispatch = () => {
    return useContext(AuthDispatchContext);
}

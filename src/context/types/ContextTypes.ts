export interface AuthState {
    apiToken: string | null;
    userProfileId: string | null; 
    walletId: string | null;
    walletAddress: string | null;
    isSignedIn: boolean;
  }
  
export interface AuthContextType {
    auth: AuthState;
    callApi: (endpoint: string, data?: any, method?: any) => Promise<any>;
}

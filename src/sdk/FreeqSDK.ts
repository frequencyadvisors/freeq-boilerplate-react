import { SequenceWaaS, type SignInResponse } from '@0xsequence/waas';
import { Wallet } from './Wallet';

export class FreeqSDK {
  private static instance: FreeqSDK;
  private sequence: SequenceWaaS;
  private respondWithCodeFn: ((code: string) => Promise<void>) | null = null;
  private otpCallback: (() => void) | null = null;
  private signInErrorCallback?: (error: string) => void;
  private otpErrorCallback?: (error: string) => void;
  private signOutErrorCallback?: (error: string) => void;
  private wallet: Wallet | undefined;
  private walletConnected: boolean = false;

  private constructor() {
    this.sequence = new SequenceWaaS({
      projectAccessKey: `${import.meta.env.VITE_PROJECT_ACCESS_KEY}`,
      waasConfigKey: `${import.meta.env.VITE_WAAS_CONFIG_KEY}`,
      network: 53716 // TODO: Make it dynamic if we are supporting multi chain
    });

    // Register OTP callback
    this.sequence.onEmailAuthCodeRequired(async (respondWithCode) => {
      this.respondWithCodeFn = respondWithCode;
      if (this.otpCallback) {
        this.otpCallback(); // Notify UI that OTP is needed
      }
    });
  }

  public static getInstance(): FreeqSDK {
    if (!FreeqSDK.instance) {
      FreeqSDK.instance = new FreeqSDK();
    }
    return FreeqSDK.instance;
  }

  /**
   * Sign in using email
   * @param email User's email address
   */
  public async signIn(email: string): Promise<Wallet | undefined> {
    try {
        console.log('Sign in started.');
        const response: SignInResponse = await this.sequence.signIn({ email }, 'Email WaaS Auth');
        console.log('Sign in completed.');
        this.wallet =  new Wallet(response.wallet);
        await this.wallet.getInventory();
        this.walletConnected = true;
        return this.wallet;
    } catch (error: any) {
        console.error('SignIn error', error);
        this.signInErrorCallback?.(error?.message || 'Sign in failed.');
    }
  }

  /**
   * Submit the OTP code received on email
   * @param otp OTP code from email
   */
  public async submitOtp(otp: string): Promise<boolean> {
    if (!this.respondWithCodeFn) {
      throw new Error('No OTP callback available');
    }
    try {
        console.log('OTP submitted');
        await this.respondWithCodeFn(otp);
        return true;
    } catch (err: any) {
        console.error('OTP error', err);
        this.otpErrorCallback?.(err?.message || 'Invalid OTP. Try again.');
        return false;
    }
  }

   /**
   * Sign out user by clearing sessions
   */
   public async signOut() {
    try {
        console.log('Sign out started.');
        const sessions = await this.sequence.listSessions()
        for(let i = 0; i < sessions.length; i++){
          await this.sequence.dropSession({ sessionId: sessions[i].id })
        }
        console.log('Sign out completed.');
        this.wallet = undefined
        this.walletConnected = false;
    } catch (error: any) {
        console.error('SignOut error', error);
        this.signOutErrorCallback?.(error?.message || 'Sign out failed.');
    }
  }

  /**
   * Set a callback function to run when OTP is required
   * @param callback 
   */
  public setOtpCallback(callback: () => void) {
    this.otpCallback = callback;
  }

  /**
   * Set a error callback function to run when sign in failed
   * @param callback 
   */
  setSignInErrorCallback(callback: (error: string) => void) {
    this.signInErrorCallback = callback;
  }

  /**
   * Set a error callback function to run when otp is invalid
   * @param callback 
   */
  setOtpErrorCallback(callback: (error: string) => void) {
    this.otpErrorCallback = callback;
  }

  /**
   * Set a error callback function to run when otp is invalid
   * @param callback 
   */
  setSignOutErrorCallback(callback: (error: string) => void) {
    this.signOutErrorCallback = callback;
  }

  /**
   * Get the user's wallet address after sign in
   */
  public getWalletAddress(): string | undefined {
    return this.wallet?.address;
  }

  /**
   * Returns whether user is currently signin succesfully and connected to wallet
   */
  public isWalletConnected(): boolean {
    return this.walletConnected;
  }
}

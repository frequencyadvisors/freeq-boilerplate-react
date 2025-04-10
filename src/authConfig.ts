// src/authConfig.ts
import { UserManagerSettings } from 'oidc-client-ts';

export const oidcConfig: UserManagerSettings = {
  authority: import.meta.env.VITE_ISSUER_URL, // Replace with your Ping Identity Issuer URL
  client_id: import.meta.env.VITE_CLIENT_ID, // Replace with your Client ID from Ping
  redirect_uri: 'http://localhost:3000/callback', // Or your production callback URL
  //post_logout_redirect_uri: 'http://localhost:3000/', // Or your production logout redirect
  response_type: 'code', // Use Authorization Code Flow
  scope: 'openid profile email', // Request scopes
  // Optional settings:
  // loadUserInfo: true, // Automatically load user info from userinfo endpoint
  // automaticSilentRenew: true, // Attempt to renew tokens silently
  // filterProtocolClaims: true, // Filter protocol claims from profile
};
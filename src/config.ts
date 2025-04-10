export function getConfig() {
  // Configure the audience here. By default, it will take whatever is in the config
  // (specified by the `audience` key) unless it's the default value of "YOUR_API_IDENTIFIER" (which
  // is what you get sometimes by using the Auth0 sample download tool from the quickstart page, if you
  // don't have an API).
  // If this resolves to `null`, the API page changes to show some helpful info about what to do
  // with the audience.
  const audience =
    import.meta.env.VITE_AUDIENCE && import.meta.env.VITE_AUDIENCE !== 'YOUR_API_IDENTIFIER'
      ? import.meta.env.VITE_AUDIENCE
      : null;

  return {
    issuer: import.meta.env.VITE_ISSUER_URL,
    apiOrigin: import.meta.env.VITE_API_ORIGIN,
    apiKey: import.meta.env.VITE_API_KEY,
    domain: import.meta.env.VITE_DOMAIN,
    clientId: import.meta.env.VITE_CLIENT_ID,
    ...(audience ? { audience } : null),
  };
}
  
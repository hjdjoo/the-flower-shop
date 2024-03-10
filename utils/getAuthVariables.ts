export function getGoogleVariables(): { clientId: string, clientSecret: string } {

  const clientId = process.env.AUTH_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;

  if (!clientId || !clientId.length) {
    throw new Error("No Client ID");
  }
  if (!clientSecret || !clientSecret.length) {
    throw new Error("No Client Secret")
  }
  return { clientId, clientSecret }

}
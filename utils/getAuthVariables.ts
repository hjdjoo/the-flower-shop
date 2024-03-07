export function getGoogleVariables(): { clientId: string, clientSecret: string } {

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_SECRET;

  if (!clientId || !clientId.length) {
    throw new Error("No Client ID");
  }
  if (!clientSecret || !clientSecret.length) {
    throw new Error("No Client Secret")
  }
  return { clientId, clientSecret }

}
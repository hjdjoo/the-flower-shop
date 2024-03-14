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

export function getAuth0Variables(): { clientId: string, clientSecret: string, issuer: string } {

  const clientId = process.env.AUTH0_CLIENT_ID;
  const clientSecret = process.env.AUTH0_CLIENT_SECRET;
  const issuer = process.env.AUTH0_ISSUER;

  if (!clientId || !clientId.length) {
    throw new Error("No Client ID");
  };
  if (!clientSecret || !clientSecret.length) {
    throw new Error("No Client Secret");
  };
  if (!issuer || !issuer.length) {
    throw new Error("No Issuer");
  };

  return { clientId, clientSecret, issuer };


}
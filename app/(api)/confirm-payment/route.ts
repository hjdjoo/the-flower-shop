import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {

  console.log(req);

  console.log(req.nextUrl);
  console.log(req.nextUrl.searchParams.get("payment_intent"))

  const paymentIntent = req.nextUrl.searchParams.get("payment_intent")
  const piClientSecret = req.nextUrl.searchParams.get("payment_intent_client_secret")
  const redirectStatus = req.nextUrl.searchParams.get("redirect_status")

  console.log("payment intent: ", paymentIntent)
  console.log("client secret: ", piClientSecret)
  console.log("redirect_status: ", redirectStatus)

}
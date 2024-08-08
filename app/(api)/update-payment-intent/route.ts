import { NextRequest } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {

  const { total } = await req.json();
  console.log("update-payment-intent/total", total);

  if (!total) {


  }


}
import { NextRequest, NextResponse } from "next/server";
import { Cart } from "@/app/types/component-types/OrderFormData";
import calculateCart from "@/utils/actions/calculateCart";
import Stripe from "stripe";


const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(STRIPE_SECRET_KEY);


/**
 * 
 * @param req : NextRequest - this request should be accompanied by the cart in the body of the request.
 * @returns NextResponse - send back the clientSecret, as per the docs - https://docs.stripe.com/payments/quickstart
 * 
 */

export async function POST(req: NextRequest) {

  const { total } = await req.json();

  console.log("create-payment-intent/total: ", total);

  // if (!sortedCart || !sortedCart[0].length) {
  //   return NextResponse.json({ error: "No cart detected" }, { status: 205 })
  // }

  if (!total) {
    return NextResponse.json({ clientSecret: null })
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: total,
    currency: "usd",
  })

  // const priceDetails = {
  //   orderPrices: orderPrices,
  //   cartTotal: cartTotal
  // }

  const response = { clientSecret: paymentIntent.client_secret }

  return NextResponse.json(response);

}
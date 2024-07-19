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

  const cart = await req.json();

  console.log("create-payment-intent/cart: ", cart);

  const cartInfo = await calculateCart(cart);

  if (!cartInfo) {
    return NextResponse.json({ error: "No cart detected" }, { status: 500 })
  }

  const { itemPrices, cartTotal } = cartInfo;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: cartTotal * 100,
    currency: "usd",
  })

  const priceDetails = {
    itemPrices: itemPrices,
    cartTotal: cartTotal
  }

  const response = { ...priceDetails, clientSecret: paymentIntent.client_secret }

  return NextResponse.json(response);

}
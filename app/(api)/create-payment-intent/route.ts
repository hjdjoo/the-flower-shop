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

  const sortedCart = await req.json();

  const cartInfo = await calculateCart(sortedCart);

  if (!cartInfo) {
    return NextResponse.json({ error: "No cart detected" }, { status: 500 })
  }

  const { orderPrices, cartTotal } = cartInfo;

  // console.log("create-payment-intent/orderPrices: ", cartInfo);

  const total = (cartTotal * 100).toFixed(0);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(total),
    currency: "usd",
  })

  const priceDetails = {
    orderPrices: orderPrices,
    cartTotal: cartTotal
  }

  const response = { ...priceDetails, clientSecret: paymentIntent.client_secret }

  return NextResponse.json(response);

}
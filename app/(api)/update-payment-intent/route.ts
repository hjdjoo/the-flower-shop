import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const stripe = new Stripe(STRIPE_SECRET_KEY);

export async function POST(req: NextRequest) {
  try {
    const { total } = await req.json();
    const { searchParams } = req.nextUrl;

    const paymentIntent = searchParams.get("payment_intent")

    if (!total) {
      return NextResponse.json({ message: "No charge detected - attempting to refresh page" }, { status: 205 })
    }
    if (!paymentIntent) {
      return NextResponse.json({ message: "No payment intent detected - attempting to refresh page" }, { status: 205 })
    }

    await stripe.paymentIntents.update(paymentIntent, { amount: total });

    return NextResponse.json({ message: "Payment intent updated" }, { status: 200 })

  } catch (e) {
    return NextResponse.json({ message: "Something went wrong while updating payment intent.", error: e }, { status: 500 })
  }

}
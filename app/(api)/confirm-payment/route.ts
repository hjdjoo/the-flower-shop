import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/serviceClient";

export async function GET(req: NextRequest) {

  // console.log(req);
  const supabase = createClient();

  // console.log(req.nextUrl);
  // console.log(req.nextUrl.searchParams.get("payment_intent"))
  // console.log(req.nextUrl.searchParams.get("orders"))

  const orders = req.nextUrl.searchParams.get("orders")

  const paymentIntent = req.nextUrl.searchParams.get("payment_intent")
  const piClientSecret = req.nextUrl.searchParams.get("payment_intent_client_secret")
  const redirectStatus = req.nextUrl.searchParams.get("redirect_status")

  // console.log("orders: ", orders);
  if (!orders) {
    return NextResponse.redirect("http://localhost:3000/", { status: 500 })
  }

  const orderIds = JSON.parse(orders) as number[]
  // console.log("payment intent: ", paymentIntent)
  // console.log("client secret: ", piClientSecret)
  // console.log("redirect_status: ", redirectStatus);
  // if a request is made for order information but the payment intent or client secret are missing, serve an unauthorized error and redirect.

  if (!piClientSecret || !paymentIntent) {
    return NextResponse.redirect("http://localhost:3000/", { status: 401 })
  }

  const { error } = await supabase
    .from("orders")
    .update({ payment_status: "success" })
    .in("id", orderIds)

  if (error) {
    console.error(error);
    console.error(error.message);
    console.error(error.details);
    return NextResponse.redirect(`http://localhost:3000/checkout/error`, { status: 500 })
  }

  return NextResponse.redirect(`http://localhost:3000/checkout/confirm?orders=${orders}`)


}
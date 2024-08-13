import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

import { createClient as createServiceClient } from "@/utils/supabase/serviceClient";


const serviceClient = createServiceClient();

/**
 * 
 * @param req :NextRequest - should contain "userId" in search params. Unauthenticated users will manage cart state in localstorage.
 * @returns NextResponse - the body should be an object containing a message and a cart. If no user or cart id is provided, return null in the cart.
 */
export async function GET(req: NextRequest) {
  const supabase = createClient();

  const { searchParams } = req.nextUrl;

  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: "no user to look up", data: null }, { status: 200 })
  }

  // get all cart items where the cartId 
  const { data, error } = await supabase
    .from("cart")
    .select("id, cart_items(*)")
    .eq("sender_id", userId)

  if (!data) {
    return NextResponse.json({ message: "no user cart found", data: null }, { status: 404 })
  }

  const response = {
    message: "user cart found",
    data: data[0],
  };

  return NextResponse.json(response, { status: 200 });

}


export async function POST(req: NextRequest) {




}


export async function DELETE(req: NextRequest) {




}
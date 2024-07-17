import { NextRequest, NextResponse } from "next/server";
import calculateDelivery from "@/utils/actions/calculateDelivery";
import calculateTax from "@/utils/actions/calculateTax";
import { Cart } from "@/app/types/component-types/OrderFormData";
import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo";

/**
 * 
 * @param req : NextRequest - this request should be accompanied by the cart in the body of the request.
 * @returns NextResponse - send back the clientSecret, as per the docs - https://docs.stripe.com/payments/quickstart
 * 
 */

interface PaymentIntentRequest extends NextRequest {

}

const calculateTotal = async (cart: Cart) => {

  const { cartItems } = cart;

  // tiers as defined in DB
  let total;

  for (let item of cartItems) {

    const { data, error } = await getProductInfo(item.productId);

    if (!data || error) {
      throw new Error("Couldn't get product data")
    };
    const tier = item.selectedTier;

    const itemValue = data[0].prices[tier!]

    const { tax, total } = calculateTax(itemValue)

  };

}

export async function POST(req: NextRequest) {

  const { cart } = await req.json();






}
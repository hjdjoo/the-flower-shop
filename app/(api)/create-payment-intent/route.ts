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
  let itemPrice;

  for (let item of cartItems) {

    const { data, error } = await getProductInfo(item.productId);
    if (!data || error) {
      throw new Error("Couldn't get product data")
    }

    if (item.selectedTier === 0) {
      itemPrice = data[0].standard_price;
    }
    if (item.selectedTier === 1) {
      itemPrice = data[0].premium_price;
    }
    if (item.selectedTier === 2) {
      itemPrice = data[0].deluxe_price;
    }





  };

}

export async function POST(req: NextRequest) {

  const { cart } = await req.json();






}
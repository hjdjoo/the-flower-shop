import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@/utils/supabase/serviceClient";
import { OrderForm } from "@/app/types/component-types/OrderFormData";
import calculateCart from "@/utils/actions/calculateCart";


export async function GET(req: NextRequest) {


}

export async function POST(req: NextRequest) {

  // use supabase client if user is logged in.
  // use serviceClient for anonymous users.
  const supabase = createClient();
  const serviceClient = createServiceClient();

  const { orders, sortedOrder, total, paymentIntent } = await req.json() as OrderForm;

  let clientTotal = total;

  const priceCheck = await calculateCart(sortedOrder);
  // console.log("/db/order server price check: clientTotal: ", clientTotal)
  // console.log("/db/order server price check: priceCheck.cartTotal.toFixed(2): ", priceCheck.cartTotal.toFixed(2))

  if (priceCheck.cartTotal.toFixed(2) !== clientTotal) {

    return NextResponse.json({
      message: "There was a price mismatch on the server.",
      serverTotal: priceCheck.cartTotal
    },
      { status: 500 })
  };

  const { data: userData, } = await supabase.auth.getUser();

  // unauthenticated user flow:
  if (!userData || !userData.user) {

    const db_order_init_data = orders.map((order, i) => {

      const { senderInfo, orderPrices, address } = order;

      return {
        delivery_date: order.deliveryDate,
        sender_first: senderInfo.senderFirst,
        sender_last: senderInfo.senderLast,
        sender_phone: senderInfo.senderPhone,
        sender_email: senderInfo.senderEmail,
        order_prices: JSON.stringify(orderPrices),
        stripe_pi_id: paymentIntent,
        recip_street_1: address.streetAddress1,
        recip_street_2: address.streetAddress2,
        recip_town_city: address.townCity,
        recip_state: address.state,
        recip_zip: address.zip
      }

    })

    const { data: orderIdData, error: orderError } = await serviceClient
      .from("orders")
      .insert(db_order_init_data)
      .select("id");


    if (!orderIdData) {
      return NextResponse.json({ message: `There was an error while initiating orders in the Db. \n ${orderError.message} ${orderError.details}` }, { status: 500 })
    }

    const db_order_items_data: {
      order_id: number,
      recip_first: string,
      recip_last: string,
      product_id: number,
      selected_tier: number,
      card_message: string,
      delivery_instructions: string,
    }[] = [];

    orders.forEach((order, i) => {

      const { orderItems } = order;

      orderItems.forEach(item => {
        db_order_items_data.push({
          order_id: orderIdData[i].id,
          recip_first: item.recipFirst,
          recip_last: item.recipLast,
          product_id: item.productId,
          selected_tier: item.selectedTier!,
          card_message: item.cardMessage,
          delivery_instructions: item.deliveryInstructions,
        })
      })

    })

    const { error: orderItemsError } = await serviceClient
      .from("order_items")
      .insert(db_order_items_data)
      .select();

    if (orderItemsError) {
      console.error(orderItemsError.details)

      const orderIds = orderIdData.map((data) => data.id)

      await serviceClient.from("orders")
        .delete()
        .in("id", orderIds)


      return NextResponse.json({ message: `There was an error while populating order items in the Db. ${orderItemsError}` }, { status: 500 })
    };

    return NextResponse.json({
      message: "DB successfully updated with order",
      data: {
        orderIds: orderIdData
      }
    }, { status: 200 });

  };

  // authenticated user flow:


}


export async function DELETE(req: NextRequest) {




}
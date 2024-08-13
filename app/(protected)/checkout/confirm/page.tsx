"use server"

import Link from "next/link";
import { redirect } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";


import OrderSummary from "../_components/OrderSummary";

import { createClient } from "@/utils/supabase/serviceClient";
import snakeToCamel from "@/utils/actions/snakeToCamel";
import camelToSnake from "@/utils/actions/camelToSnake";
import { OrderPriceInfo } from "@/app/types/component-types/OrderFormData";


export default async function PayConfirmPage(
  { params,
    searchParams }:
    {
      params: string,
      searchParams: {
        [key: string]: string | string[] | undefined
      }
    }) {


  const supabase = createClient();
  // const orderIds = searchParams["orders"];
  const {
    orders: orderIds,
    payment_intent: paymentIntent,
    payment_intent_client_secret: clientSecret
  } = searchParams;


  let parsedOrderIds: number[];

  if (!orderIds) {
    // console.log(orderIds);
    throw new Error("No orders to fetch!")
  } else if (Array.isArray(orderIds)) {

    parsedOrderIds = orderIds.map(id => parseInt(id));

  } else if (typeof orderIds === "string") {

    const decodedIds = JSON.parse(decodeURIComponent(orderIds)) as number[];

    // console.log("PayConfirm/decodedIds: ", decodedIds);

    parsedOrderIds = decodedIds;
  } else {
    parsedOrderIds = []
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ payment_status: "success" })
    .in("id", parsedOrderIds)

  if (updateError) {
    throw new Error("Something went wrong while updating payment status in database.")
  }

  const { data: ordersData, error } = await supabase
    .from("orders")
    .select("*, order_items!inner(*) ")
    .in("order_items.order_id", parsedOrderIds);

  if (!ordersData || error) {
    console.error("PayConfirm/error.message", error.message)
    console.error("PayConfirm/error.details", error.details)
    throw new Error("Something went wrong while fetching info from database.");
  }

  const Orders = ordersData.map((order, idx) => {

    const deliveryDate = order.delivery_date!;

    const address = {
      streetAddress1: order.recip_street_1!,
      streetAddress2: order.recip_street_2 ? order.recip_street_2 : "",
      townCity: order.recip_town_city!,
      state: order.recip_state!,
      zip: order.recip_zip!
    };

    const orderItems = order.order_items.map(item => {
      return {
        recipId: item.recipient_id ? item.recipient_id : undefined,
        recipFirst: item.recip_first!,
        recipLast: item.recip_last!,
        productId: item.product_id!,
        selectedTier: item.selected_tier!,
        cardMessage: item.card_message!,
      }
    });

    const orderPriceInfo: OrderPriceInfo = JSON.parse(order.order_prices as string)

    return (
      <Box key={`order-${idx + 1}-summary-box`}
        sx={{ my: 2 }}>
        <Typography sx={{ textDecoration: "underline", mb: 1 }}>{`Order ${idx + 1}`}</Typography>
        <OrderSummary deliveryDate={deliveryDate} address={address} orderItems={orderItems} orderPriceInfo={orderPriceInfo}></OrderSummary>
      </Box>
    )
  })

  return (
    <Box sx={{
      height: "auto",
      marginTop: "80px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {
        clientSecret ?
          <Box id="order-summary-box">
            <Typography sx={{
              fontWeight: 800,
            }}>
              Thank you for your order!
            </Typography>
            <Box>
              <Typography>
                Order Summaries:
              </Typography>
              {Orders}
            </Box>
          </Box>
          :
          <Typography>
            Unauthorized
          </Typography>
      }
      <Box id="back-to-home-button"
        sx={{
          my: 4,
          textDecoration: "underline"
        }}>
        <Link href="/">
          <Typography>
            Back to Homepage
          </Typography>
        </Link>
      </Box>
    </Box>
  )
}

// http://localhost:3000/payment/confirm?payment_intent=pi_3PgC8n02GTbaCA9R0EM3TFEg&payment_intent_client_secret=pi_3PgC8n02GTbaCA9R0EM3TFEg_secret_6Gx5OjNT7eQ25YYzdXWJqjDt2&redirect_status=succeeded
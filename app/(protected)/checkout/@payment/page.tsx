"use client"

import { useState, useEffect } from "react";

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { CartContextType } from "@/lib/contexts/CartContext";
import { useCart } from "@/lib/contexts/CartContext";
import getStripe from "@/utils/stripe/getStripe";

import OrderSummary from "../_components/OrderSummary";
import CheckoutForm from "../_components/CheckoutForm";

import { Dates, SortedOrder } from "@/app/types/component-types/OrderFormData";
import { Cart } from "@/app/types/component-types/OrderFormData";

const stripePromise = getStripe();

interface ItemPrices {
  itemValue: number,
  deliveryFee: number,
  tax: number,
  total: number
}

interface OrderSummaryData {
  cart: Cart,
  cartTotal: number,
  itemPrices: { cartTotal: number, clientSecret: string, itemPrices: ItemPrices[] }
}

export default function MakePaymentPage() {

  const { cart } = useCart() as CartContextType;
  const [clientSecret, setClientSecret] = useState<string>("");
  const [orderSummaryData, setOrderSummaryData] = useState<OrderSummaryData>();

  useEffect(() => {

    if (!cart) return;
    if (!cart.cartItems.length) return;

    fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cart)
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        setOrderSummaryData({ cart: cart, cartTotal: data.cartTotal, itemPrices: data.itemPrices })
        setClientSecret(data.clientSecret);
      })
      .catch(error => {
        console.log("Something went wrong while creating payment intent")
        console.error(error.message)
      })
  }, [cart])


  const appearance = {
    theme: "stripe",
  }
  const options = {
    clientSecret,
    appearance
  } as StripeElementsOptions

  return (
    <Box id="payment-box"
      width={"60%"}
      maxWidth={"600px"}
      sx={{
        marginTop: "15px",
        marginX: "15px",
      }}>
      {orderSummaryData &&
        <OrderSummary />
      }
      <Typography>Payment Page</Typography>
      {clientSecret &&
        <Elements stripe={stripePromise} options={options} >
          <CheckoutForm />
        </Elements>
      }
    </Box>

  )

}
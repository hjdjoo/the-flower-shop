"use client"

import { useState, useEffect, useMemo } from "react";

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import { CartContextType } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import getStripe from "@/utils/stripe/getStripe";

// import OrderSummary from "../_components/OrderSummary";
import CheckoutForm from "../_components/CheckoutForm";

import { Dates, SortedOrder } from "@/app/types/component-types/OrderFormData";
import { Cart, ItemPrices, OrderPrices } from "@/app/types/component-types/OrderFormData";

const stripePromise = getStripe();

export default function MakePaymentPage() {

  const { cart, getSortedOrder } = useCart() as CartContextType;
  const [clientSecret, setClientSecret] = useState<string>("");
  const [_orderPrices, setOrderPrices] = useState<OrderPrices>();

  // Come back to this - React is getting angry between renders when the clientSecret temporary goes back to being null.
  // const cachedSecret = useMemo(() => {

  // }, [])

  useEffect(() => {

    if (!cart || !cart.cartItems || !cart.cartItems.length) return;

    const sortedOrder = getSortedOrder();

    fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sortedOrder)
    })
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        // console.log("MakePaymentPage/useEffect/fetch/create-payment-intent/cart total: ", data.cartTotal);
        if (!data.clientSecret) return;
        const updatedOrderPrices = {
          itemValues: data.itemValues,
          deliveryFee: data.deliveryFee,
          tax: data.tax,
          total: data.total,
        }
        setOrderPrices(updatedOrderPrices)
        setClientSecret(data.clientSecret);
      })
      .catch(error => {
        console.error("Something went wrong while creating payment intent")
        console.error(error.message)
      })
  }, [cart, getSortedOrder])


  const appearance = {
    theme: "stripe",
  }
  const options = {
    clientSecret,
    appearance
  } as StripeElementsOptions

  return (
    <Box id="payment-box"
      width={"100%"}
      maxWidth={"600px"}
      sx={{
        marginTop: "15px",
        marginX: "15px",
        display: "flex",
        flexDirection: "column",

      }}>
      {clientSecret &&
        <Elements stripe={stripePromise} options={options} >
          <CheckoutForm />
        </Elements>
      }
    </Box>

  )

}
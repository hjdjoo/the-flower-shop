"use client"

import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import getStripe from "@/utils/stripe/getStripe";

import CheckoutForm from "./_components/CheckoutForm";
import CartItem from "./_components/CartItem";
import { CartContextType } from "@/lib/contexts/CartContext";

import { useCart } from "@/lib/contexts/CartContext";

import { Dates, Addresses, SortedOrder } from '../../types/component-types/OrderFormData'


const stripePromise = getStripe();

export default function Checkout() {

  const { cart, getSortedOrder } = useCart() as CartContextType;

  const [deliveryDates, setDeliveryDates] = useState<Dates>([]);
  const [order, setOrder] = useState<SortedOrder>([]);

  const [clientSecret, setClientSecret] = useState<string>("");

  // moved setState actions to useEffect to ensure that checkout renders cart items upon refresh.
  useEffect(() => {

    if (!cart) return;

    setDeliveryDates(cart.deliveryDates);
    const sortedOrder = getSortedOrder();
    setOrder(sortedOrder);

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
        setClientSecret(data.clientSecret);
      })
      .catch(error => {
        console.log("Something went wrong while creating payment intent")
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

    <Container
      sx={{
        marginTop: "80px",
      }}
    >
      <Typography component='h1' sx={{ fontSize: 32, fontWeight: 500 }}>Cart</Typography>
      {deliveryDates.map((date, dateIndex) =>
        <Accordion defaultExpanded key={dateIndex}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container className="Description-Root">
              {order[dateIndex].map((product, orderIndex) =>
                <Container className="CartItem-Root" key={orderIndex}>
                  <CartItem product={product} orderIndex={orderIndex} dateIndex={dateIndex}></CartItem>
                </Container>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
      {clientSecret &&
        <Elements stripe={stripePromise} options={options} >
          <CheckoutForm />
        </Elements>
      }
    </Container>
  )
}
"use client"

import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CartItem from "./_components/CartItem";
import { CartContextType } from "@/lib/contexts/CartContext";

import { useCart } from "@/lib/contexts/CartContext";

import { Dates, Addresses, SortedOrder } from '../../types/component-types/OrderFormData'


const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_P_KEY
const STRIPE_SK = process.env.NEXT_PUBLIC_STRIPE_S_KEY

const stripePromise = loadStripe(STRIPE_PK!)


export default function Checkout() {

  const { cart, getSortedOrder } = useCart() as CartContextType;

  const [deliveryDates, setDeliveryDates] = useState<Dates>(cart.deliveryDates);

  const order = getSortedOrder();




  return (
    <Elements stripe={stripePromise} >
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
      </Container>
    </Elements>
  )
}
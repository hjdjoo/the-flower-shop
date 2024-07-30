"use client"

import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Button from '@mui/material/Button';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { StripeElementsOptions } from "@stripe/stripe-js";

import CartItem from "./_components/CartItem";
import OrderSummary from "./_components/OrderSummary";
import { CartContextType } from "@/lib/contexts/CartContext";

import { useCart } from "@/lib/contexts/CartContext";
import formatDate from "@/utils/actions/formatDate";

import { Dates, Addresses, SortedOrder } from '../../types/component-types/OrderFormData'

export default function Checkout() {

  const { cart, getSortedOrder } = useCart() as CartContextType;

  const [deliveryDates, setDeliveryDates] = useState<Dates>([]);
  const [order, setOrder] = useState<SortedOrder>([]);

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]


  // moved setState actions to useEffect to ensure that checkout renders cart items upon refresh.
  useEffect(() => {

    if (!cart) return;

    setDeliveryDates(cart.deliveryDates);
    const sortedOrder = getSortedOrder();
    setOrder(sortedOrder);

  }, [cart, getSortedOrder])

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
            <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {`${daysOfWeek[new Date(date).getDay()]} ${formatDate(date)}`}</Typography>
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
  )
}
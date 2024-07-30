"use client"

import { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import CartItem from "./_components/CartItem";
import { CartContextType } from "@/lib/contexts/CartContext";
import { Cart, ItemPrices, PriceInfo } from "../../types/component-types/OrderFormData";
import calculateCart from "@/utils/actions/calculateCart";

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
        <Accordion defaultExpanded key={`delivery-accordion-${dateIndex + 1}`}>
          <AccordionSummary
            id={`summary-panel-${dateIndex + 1}`}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
          >
            <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {`${daysOfWeek[new Date(date).getDay()]} ${formatDate(date)}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box id={`delivery-group-${dateIndex + 1}`}>
              {order[dateIndex].map((orderItem, orderIndex) =>
                <Box id={`cart-item-delivery-group-${dateIndex + 1}-order-${orderIndex + 1}`} key={`del-${dateIndex + 1}-order-${orderIndex + 1}`}>
                  <CartItem orderItem={orderItem} orderIndex={orderIndex} dateIndex={dateIndex}></CartItem>
                </Box>
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Container>
  )
}
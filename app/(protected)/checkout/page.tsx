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
import PriceInfoDisplay from "./_components/_sub/PriceInfoDisplay";

import { useCart } from "@/lib/contexts/CartContext";
import formatDate from "@/utils/actions/formatDate";

import { Dates, Addresses, SortedOrder } from '../../types/component-types/OrderFormData'


export default function Checkout() {

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const { cart, getSortedOrder } = useCart() as CartContextType;

  const { addresses } = cart;

  const [deliveryDates, setDeliveryDates] = useState<Dates>([]);
  const [order, setOrder] = useState<SortedOrder>([]);

  // moved setState actions to useEffect to ensure that checkout renders cart items upon refresh.
  useEffect(() => {

    console.log(cart);
    if (!cart) return;
    setDeliveryDates(cart.deliveryDates);
    const sortedOrder = getSortedOrder();
    setOrder(sortedOrder);

  }, [cart, getSortedOrder]);


  return (

    <Container
      sx={{
        marginTop: "80px",
      }}
    >
      <Typography component='h1' sx={{ fontSize: 32, fontWeight: 500 }}>Cart</Typography>
      {deliveryDates.length ? deliveryDates.map((date, dateIdx) =>
        <Accordion defaultExpanded key={`delivery-accordion-${dateIdx + 1}`}>
          <AccordionSummary
            id={`summary-panel-${dateIdx + 1}`}
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
          >
            <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {`${daysOfWeek[new Date(date).getDay()]} ${formatDate(date)}`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box id={`delivery-group-${dateIdx + 1}`}>
              {
                addresses.map((address, addressIdx) => {
                  for (let item of order[dateIdx]) {
                    if (item.recipAddressIndex === addressIdx) {
                      return (
                        <Box id={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`} key={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`}>
                          <Box>
                            <Typography>Delivery to:</Typography>
                            <Typography>{address}</Typography>
                          </Box>
                          {order[dateIdx].map((orderItem, orderIdx) => {
                            if (orderItem.recipAddressIndex === addressIdx) {
                              return (
                                <Box id={`cart-item-delivery-group-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`} key={`del-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`}>
                                  <CartItem orderItem={orderItem} orderIdx={orderIdx} dateIdx={dateIdx}></CartItem>
                                </Box>)
                            }
                          })}
                          <Box id={`order-${dateIdx + 1}-${addressIdx + 1}-price-info-display`} sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}>
                            {/* <PriceInfoDisplay itemPrices={itemPrices} dateIdx={dateIdx} addressIdx={addressIdx} /> */}
                          </Box>
                        </Box>
                      )
                    }
                  }
                })
              }
            </Box>
          </AccordionDetails>
        </Accordion>
      ) : <Typography>
        Cart is empty!
      </Typography>}
    </Container>
  )
}
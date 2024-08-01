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
import { Cart, ItemPrices, OrderPrices, PriceInfo } from "../../types/component-types/OrderFormData";
import calculateCart from "@/utils/actions/calculateCart";
import PriceInfoDisplay from "./_components/_sub/PriceInfoDisplay";

import { useCart } from "@/lib/contexts/CartContext";
import formatDate from "@/utils/actions/formatDate";

import { Dates, Addresses, SortedOrder } from '../../types/component-types/OrderFormData'


export default function Checkout() {

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const { cart, getSortedOrder } = useCart() as CartContextType;

  const { addresses } = cart;

  const [deliveryDates, setDeliveryDates] = useState<Dates>([]);
  const [order, setOrder] = useState<SortedOrder>([]);
  const [orderPrices, setOrderPrices] = useState<OrderPrices[][]>([]);

  // moved setState actions to useEffect to ensure that checkout renders cart items upon refresh.
  useEffect(() => {
    // console.log("Checkout/useEffect/cart: ", cart);
    if (!cart) return;
    setDeliveryDates(cart.deliveryDates);
    const sortedOrder = getSortedOrder();

    (async () => {
      try {
        const cartPriceInfo = await calculateCart(sortedOrder);

        if (!cartPriceInfo) {
          throw new Error(`Couldn't get price info for cart`)
        }

        const { orderPrices, cartTotal } = cartPriceInfo;

        setOrder(sortedOrder);
        setOrderPrices(orderPrices);

      } catch (e) {
        console.error(e);
        return;
      }
    })();

  }, [cart, getSortedOrder]);


  return (

    <Container
      sx={{
        marginTop: "80px",
      }}
    >
      <Typography component='h1' sx={{ fontSize: 32, fontWeight: 500 }}>Cart</Typography>
      {order.length ? order.map((dateArr, dateIdx) => {

        return (
          <Accordion defaultExpanded key={`delivery-accordion-${dateIdx + 1}`}>
            <AccordionSummary
              id={`summary-panel-${dateIdx + 1}`}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
            >
              <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {`${daysOfWeek[new Date(deliveryDates[dateIdx]).getDay()]} ${formatDate(deliveryDates[dateIdx])}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box id={`delivery-group-${dateIdx + 1}`}>
                {
                  dateArr.map((addressArr, addressIdx) => {
                    if (!addressArr.length) return;
                    return (
                      <Box id={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`} key={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`}>
                        <Box>
                          <Typography>Delivery to:</Typography>
                          <Typography>{addresses[addressIdx]}</Typography>
                        </Box>
                        {addressArr.map((orderItem, orderIdx) => {
                          if (orderItem.recipAddressIndex === addressIdx) {
                            return (
                              <Box id={`cart-item-delivery-group-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`} key={`del-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`}>
                                <CartItem orderItem={orderItem} orderPrices={orderPrices[dateIdx][addressIdx]} addressIdx={addressIdx} orderIdx={orderIdx} dateIdx={dateIdx}></CartItem>
                              </Box>)
                          }
                        })}
                        <Box id={`order-${dateIdx + 1}-${addressIdx + 1}-price-info-display-container`} sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "end"
                        }}>
                          <Typography sx={{
                            mr: 3,
                            mb: 3
                          }}>
                            Order Price Summary:
                          </Typography>
                          <PriceInfoDisplay orderPrices={orderPrices[dateIdx][addressIdx]} dateIdx={dateIdx} addressIdx={addressIdx} />
                        </Box>
                      </Box>
                    )
                  })
                }
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })
        :
        <Typography>
          Cart is empty!
        </Typography>}
    </Container>
  )
}
"use client"

import { useState, useEffect } from "react";

import { useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCart from "@mui/icons-material/ShoppingCart";


import CartItem from "./_components/CartItem";
import { CartContextType } from "@/contexts/CartContext";
import { Cart, ItemPrices, OrderPrices, PriceInfo } from "../../types/component-types/OrderFormData";
import calculateCart from "@/utils/actions/calculateCart";
import PriceInfoDisplay from "./_components/_sub/PriceInfoDisplay";

import { useCart } from "@/contexts/CartContext";
import formatDate from "@/utils/actions/formatDate";

import { Dates, Addresses, SortedOrder } from '../../types/component-types/OrderFormData'


export default function Checkout() {

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const { cart, getSortedOrder } = useCart() as CartContextType;

  const { addresses } = cart;

  const [deliveryDates, setDeliveryDates] = useState<Dates>([]);
  const [order, setOrder] = useState<SortedOrder>([]);
  const [orderPrices, setOrderPrices] = useState<OrderPrices[][]>([]);
  const [orderQuantity, setOrderQuantity] = useState<number>()
  const [cartTotal, setCartTotal] = useState<string>("")

  // moved setState actions to useEffect to ensure that checkout renders cart items upon refresh.
  useEffect(() => {
    // console.log("Checkout/useEffect/cart: ", cart);
    if (!cart) return;

    setDeliveryDates(cart.deliveryDates);

    const sortedOrder = getSortedOrder();

    let quantity = 0;
    // currently: 
    // [ [{}, null], [[{}, {}]]   ]
    for (let addressArr of sortedOrder) {
      for (let orderArr of addressArr) {

      }
    }
    setOrderQuantity(quantity);

    if (sortedOrder[0][0] && sortedOrder[0][0].length)
      (async () => {
        try {
          const cartPriceInfo = await calculateCart(sortedOrder);

          if (!cartPriceInfo) {
            throw new Error(`Couldn't get price info for cart`)
          }

          const { orderPrices, cartTotal } = cartPriceInfo;

          setOrder(sortedOrder);
          setOrderPrices(orderPrices);
          setCartTotal(cartTotal.toFixed(2))

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
      <Box id="cart-header-box"
        sx={{
          display: "flex",
          alignItems: "center"
        }}>
        <ShoppingCart sx={{ mr: 1 }} />
        <Typography component='h1' sx={{ fontSize: 24, fontWeight: 800, my: 1 }}>Cart</Typography>
      </Box>
      <Box id="order-quantity-info-box">
        <Typography>{`It looks like we'll need to send ${orderQuantity ? orderQuantity === 1 ? `${orderQuantity} order.` : ` ${orderQuantity} orders.` : "..."}`}</Typography>
      </Box>
      {order.length ? order.map((addressArr, dateIdx) => {

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
                  addressArr.map((orderArr, addressIdx) => {
                    if (!orderArr.length) return;
                    return (
                      <Box id={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`} key={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`}
                        sx={{
                          display: "flex",
                          flexDirection: "column"
                        }}>
                        <Box>
                          <Typography>Delivery to:</Typography>
                          <Typography>{addresses[addressIdx]}</Typography>
                        </Box>
                        {orderArr.map((orderItem, orderIdx) => {
                          if (orderItem.recipAddressIndex === addressIdx) {
                            return (
                              <Box id={`cart-item-delivery-group-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`} key={`del-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`}>
                                <CartItem orderItem={orderItem} orderPrices={orderPrices[dateIdx][addressIdx]} addressIdx={addressIdx} orderIdx={orderIdx} dateIdx={dateIdx}></CartItem>
                              </Box>)
                          }
                        })}
                        <Box id={`order-${dateIdx + 1}-${addressIdx + 1}-price-info-display-container`} sx={{
                          py: 2,
                          px: 4,
                          width: "50%",
                          alignSelf: "end",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "end",
                          backgroundColor: "#F0FEF180",
                        }}>
                          <Typography sx={{
                            mb: 3
                          }}>
                            {`Order ${dateIdx + addressIdx + 1} Price Summary:`}
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
"use client"

import { useState, useEffect, useRef } from "react";

import { useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCart from "@mui/icons-material/ShoppingCart";

import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import getStripe from "@/utils/stripe/getStripe";
import CheckoutForm from "./_components/CheckoutForm";

import CartItem from "./_components/CartItem";
import { CartContextType } from "@/contexts/CartContext";
import { Address, Cart, ItemPrices, OrderPrices, PriceInfo } from "@/app/types/component-types/OrderFormData";
import calculateCart from "@/utils/actions/calculateCart";
import PriceInfoDisplay from "./_components/_sub/PriceInfoDisplay";

import { useCart } from "@/contexts/CartContext";
import formatDate from "@/utils/actions/formatDate";

import { Dates, Addresses, SortedOrder } from '@/app/types/component-types/OrderFormData'
import addressToString from "@/utils/actions/addressToString";

const stripePromise = getStripe();

export default function CheckoutPage() {

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const { cart, getSortedOrder, } = useCart() as CartContextType;


  const [clientSecret, setClientSecret] = useState<string>("");

  const [currCart, setCurrCart] = useState<Cart>();
  const [order, setOrder] = useState<SortedOrder>([[]]);
  const [sortedOrderPrices, setSortedOrderPrices] = useState<OrderPrices[][]>([]);
  const [deliveryDates, setDeliveryDates] = useState<Dates>([]);
  const [orderQuantity, setOrderQuantity] = useState<number>();
  const [addresses, setAddresses] = useState<Address[]>([]);


  // Only component that needs this is the stripe element.
  const [cartTotal, setCartTotal] = useState<string>("")

  const stripeAppearance = {
    theme: "stripe",
  }
  const stripeOptions = {
    clientSecret,
    appearance: stripeAppearance
  } as StripeElementsOptions

  //synchronous ref updates;
  // order.current = sortedOrder;
  // set

  // console.log("Synchronous state log")
  // console.table({ currCart, order, sortedOrderPrices, deliveryDates, orderQuantity });

  useEffect(() => {

    if (!cart.deliveryDates.length) {
      console.log("CheckoutContainer/useEffect/ no orders detected");
      return;
    }

    (async () => {
      console.log("CheckoutContainer/useEffect/ async tasks started")
      const sortedOrder = getSortedOrder();

      // console.log("setting quantity")
      const priceData = await calculateCart(sortedOrder);
      console.log("CheckoutContainer/useEffect/ async calculation finished, setting states");
      let quantity = 0;
      // currently: 
      // [ [{}, null], [[{}, {}]]   ]
      for (let addressArr of sortedOrder) {
        for (let orderArr of addressArr) {
          if (orderArr.length) {
            quantity += 1;
          }
        }
      }

      setOrderQuantity(quantity);
      setOrder(sortedOrder);
      setAddresses(cart.addresses);
      setDeliveryDates(cart.deliveryDates);
      setSortedOrderPrices(priceData.orderPrices);
      setCartTotal(priceData.cartTotal.toFixed(2));
      setCurrCart(cart);

      const request = {
        total: parseInt((priceData.cartTotal * 100).toFixed(2))
      }

      if (!clientSecret) {
        console.log("CheckoutContainer/useEffect/ no client secret; create-payment-intent fetch initiating");
        fetch("/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request)
        })
          .then((res) => {

            return res.json()
          })
          .then((data) => {
            console.log("fetched, attempting to set client secret.")
            if (!data.clientSecret) return;
            setClientSecret(data.clientSecret);
          })
          .catch(error => {
            console.error("Something went wrong while creating payment intent")
            console.error(error.message)
          });
      } else {
        fetch("/update-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request)
        }).then((res) => {

          return res.json()
        })
          .then((data) => {
            console.log("fetched, attempting to set client secret.")
            if (!data.clientSecret) return;
            setClientSecret(data.clientSecret);
          })
          .catch(error => {
            console.error("Something went wrong while creating payment intent")
            console.error(error.message)
          });
      }
    })();

  }, [cart, clientSecret, getSortedOrder])

  return (

    <Container
      sx={{
        marginTop: "80px",
        display: "flex",
        flexDirection: "column",
        mb: "80px"
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
      <Box id="order-quantity-info-box" sx={{
        mb: 2
      }}>
        <Typography>{`It looks like we'll need to send ${orderQuantity ? orderQuantity === 1 ? `${orderQuantity} order.` : ` ${orderQuantity} orders.` : "..."}`}</Typography>
      </Box>
      {currCart && order[0] && order[0].length ? order.map((addressArr, dateIdx) => {

        if (!deliveryDates[dateIdx]) return;

        return (
          <Accordion defaultExpanded key={`delivery-accordion-${dateIdx + 1}`}>
            <AccordionSummary
              id={`summary-panel-${dateIdx + 1}`}
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
            >
              <Typography component='h2' sx={{ fontSize: "1rem", fontWeight: 500 }}>Deliver on: {`${daysOfWeek[new Date(deliveryDates[dateIdx]).getDay()]} ${formatDate(deliveryDates[dateIdx])}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box id={`delivery-group-${dateIdx + 1}`}>
                {
                  addressArr.map((orderArr, addressIdx) => {

                    if (!orderArr.length || !sortedOrderPrices[dateIdx].length) return;

                    const addressStr = addressToString(addresses[addressIdx])
                    // console.log(addressStr);

                    return (
                      <Box id={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`} key={`cart-item-delivery-group-${dateIdx + 1}-address-${addressIdx + 1}`}
                        sx={{
                          display: "flex",
                          flexDirection: "column"
                        }}>
                        <Box>
                          <Typography sx={{ fontSize: "0.9rem" }}>Delivery to:</Typography>
                          <Typography sx={{ fontSize: "0.8rem" }}>{addressStr}</Typography>
                        </Box>
                        {orderArr.map((orderItem, orderIdx) => {
                          if (!orderItem) {
                            console.log("no order item detected")
                            return;
                          }

                          if (orderItem.recipAddressIndex === addressIdx) {
                            return (
                              <Box id={`cart-item-delivery-group-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`} key={`del-${dateIdx + 1}-order-${orderIdx + 1}-date-${orderItem.recipAddressIndex + 1}`}>
                                <CartItem cart={currCart} setCurrCart={setCurrCart} order={order} setOrder={setOrder} setSortedOrderPrices={setSortedOrderPrices} setCartTotal={setCartTotal} setAddresses={setAddresses} orderItem={orderItem} orderPrices={sortedOrderPrices[dateIdx][addressIdx]} addressIdx={addressIdx} orderIdx={orderIdx} dateIdx={dateIdx}></CartItem>
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
                          <PriceInfoDisplay order={order} orderPrices={sortedOrderPrices[dateIdx][addressIdx]} dateIdx={dateIdx} addressIdx={addressIdx} />
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
      <Box id="payment-box"
        width={"90%"}
        sx={{
          alignSelf: "center",
          marginTop: "15px",
          display: "flex",
          flexDirection: "column",
        }}>
        {
          cartTotal &&
          <Box id="cart-total-display"
            sx={{
              display: "flex",
              justifyContent: "end"
            }}>
            <Typography
            >
              Cart Total:
            </Typography>
            <Typography id="cart-total-value"
              sx={{
                ml: 2
              }}
            >
              ${cartTotal}
            </Typography>
          </Box>
        }
        {
          (clientSecret && currCart) &&
          <Elements stripe={stripePromise} options={stripeOptions} >
            <CheckoutForm cart={currCart} />
          </Elements>
        }
      </Box>
    </Container>
  )
}
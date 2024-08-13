"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, ChangeEvent, } from "react";

import { useTheme } from "@mui/material";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ShoppingCart from "@mui/icons-material/ShoppingCart";

import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions } from "@stripe/stripe-js";
import getStripe from "@/utils/stripe/getStripe";

import { createClient } from "@/utils/supabase/client";

import CheckoutForm from "./_components/CheckoutForm";
import SenderInfo from "@/app/_components/SenderInfo";
import CartItem from "./_components/CartItem";
import { CartContextType } from "@/contexts/CartContext";
import { Address, Cart, OrderPriceInfo } from "@/app/types/component-types/OrderFormData";
import calculateCart from "@/utils/actions/calculateCart";
import PriceInfoDisplay from "./_components/_sub/PriceInfoDisplay";

import { useUser } from "@/contexts/UserContext";
import { UserContextType } from "@/app/types/auth-types";
import { useCart } from "@/contexts/CartContext";
import formatDate from "@/utils/actions/formatDate";
import { parsePhone } from "@/utils/actions/parsePhone";

import { Dates, Addresses, SortedOrder, SenderInfo as SenderInfoType, OrderForm } from '@/app/types/component-types/OrderFormData'
import addressToString from "@/utils/actions/addressToString";

const stripePromise = getStripe();

type SenderObject = {
  [key: string]: string
}

export default function CheckoutPage() {

  /** Hooks and constants */
  const supabase = createClient();
  const theme = useTheme();
  const router = useRouter();
  const { cart, getSortedOrder, } = useCart() as CartContextType;

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  /** Refs */
  const senderPhoneRef = useRef<string>("")

  /** States */
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntent, setPaymentIntent] = useState<string>("");

  const [currCart, setCurrCart] = useState<Cart>();
  const [order, setOrder] = useState<SortedOrder>([[]]);
  const [sortedOrderPriceInfo, setSortedOrderPriceInfo] = useState<OrderPriceInfo[][]>([]);
  const [deliveryDates, setDeliveryDates] = useState<Dates>([]);
  const [orderQuantity, setOrderQuantity] = useState<number>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editSenderInfo, setEditSenderInfo] = useState<boolean>(false);
  const [senderInfo, setSenderInfo] = useState<SenderInfoType | SenderObject>({
    senderFirst: "",
    senderLast: "",
    senderName: "",
    senderPhone: "",
    senderEmail: "",
  })
  // Only component that needs this is the stripe element.
  const [cartTotal, setCartTotal] = useState<string>("");

  const stripeAppearance = {
    theme: "stripe",
  }
  const stripeOptions = {
    clientSecret,
    appearance: stripeAppearance
  } as StripeElementsOptions

  // useEffect for setting sender information from user information;
  useEffect(() => {

    (async () => {
      const { data, error } = await supabase.auth.getSession()
      console.log("session: ", data)
      if (!data || !data.session) {
        return;
      }
      if (error) {
        console.error(error);
      }
      else {
        const { user } = data.session;
        const { user_metadata: userMetadata } = user;

        // if there is no phone number in the user object, then check the user metadata. Failing that, just return an empty string.
        const phone = user.phone ? user.phone : (userMetadata.phone ? userMetadata.phone : "");

        const { email, name, shop_acct_id: id } = userMetadata

        const senderNameArr = name.split(" ");
        const senderFirst = senderNameArr[0]
        const senderLast = senderNameArr.slice(1).join(" ")

        const updatedSenderInfo = {
          senderId: id,
          senderFirst: senderFirst,
          senderLast: senderLast.length ? senderLast : "",
          senderName: name,
          senderPhone: phone ? phone : senderPhoneRef.current,
          senderEmail: email ? email : "",
        }

        setSenderInfo(updatedSenderInfo);
      };

    })()

  }, [supabase])

  // useEffect for calculating order and initiating payment intent.
  // I have concerns that this useEffect is too heavy, as it both sets quantity and inits the stripe payment intent. Possible that the stripe payment element should be even further down the tree to make this component less heavy.
  useEffect(() => {

    if (!cart.deliveryDates.length) {
      console.log("CheckoutContainer/useEffect/ no orders detected");
      return;
    }

    (async () => {
      console.log("CheckoutContainer/useEffect/ async tasks started")
      const sortedOrder = getSortedOrder();

      const priceData = await calculateCart(sortedOrder);
      console.log("CheckoutContainer/useEffect/ async calculation finished, setting states");
      let quantity = 0;
      // currently: 
      // [ [{}, null], [[{}, {}]]  ]
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
      setSortedOrderPriceInfo(priceData.orderPrices);
      setCartTotal(priceData.cartTotal.toFixed(2));
      setCurrCart(cart);

      const request = {
        total: parseInt((priceData.cartTotal * 100).toFixed(2))
      }

      if (!clientSecret) {
        console.log("Checkout/useEffect/ no client secret; creating payment intent");
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
            setPaymentIntent(data.id)
          })
          .catch(error => {
            console.error("Something went wrong while creating payment intent")
            console.error(error.message)
          });
      } else {
        console.log("Checkout/useEffect/client secret detected; updating payment intent")
        fetch(`/update-payment-intent?payment_intent=${paymentIntent}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request)
        }).then((res) => {

          return res.json()

        }).then((data) => {
          console.log("updated, logging response")
          console.log(data);

        }).catch(error => {
          console.error("Something went wrong while creating payment intent")
          console.error(error.message)
        });
      }
    })();


  }, [cart, clientSecret, paymentIntent, getSortedOrder])

  // due to timing of async operations, totals are sometimes not matching. About 10% of the time, a delivery calculation will finish before a data fetch, resulting in a order total that does not reflect the actual price of the item. Rather than refactor all the calculations or make big changes in order to store product information on the client side for synchronous order calculation, I think just running a second check on the order is inexpensive enough to justify.
  useEffect(() => {

    if (!order || !order[0].length) return;

    (async () => {
      console.log("double checking cart total")
      const totalCheck = await calculateCart(order);
      console.log(totalCheck.cartTotal.toFixed(2), cartTotal)
      if (totalCheck.cartTotal.toFixed(2) === cartTotal) {
        console.log("totals match, returning")
        return;
      } else {
        console.log("totals don't match, refreshing")
        router.refresh()
      }

    })()

  }, [order, cartTotal, router])

  // handlers:
  const handleSenderInfo = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {

    const { name, value } = e.target;

    const updatedSenderInfo = { ...senderInfo, [name]: value };

    console.log("Checkout/handleSenderInfo/updatedSenderInfo: ", updatedSenderInfo)

    setSenderInfo(updatedSenderInfo);
  }

  const handleEditSenderInfo = async () => {

    if (editSenderInfo) {
      // if the user has an ID...
      if (!!senderInfo.senderId) {

        console.log("updating user metadata...")
        await supabase.auth.updateUser({
          data: { phone: senderInfo.senderPhone }
        });
      } else {
        const updatedSenderInfo = { ...senderInfo }
        senderPhoneRef.current = senderInfo.senderPhone;
        if (!senderInfo.senderName) {
          const senderName = senderInfo.senderFirst!.concat(` ${senderInfo.senderLast}`)

          updatedSenderInfo.senderName = senderName.trim();
        }
        setSenderInfo(updatedSenderInfo);
      }
    }
    setEditSenderInfo(!editSenderInfo);
  };


  const SenderInfoDisplay = Object.keys(senderInfo).map((key, idx) => {

    const senderObject = senderInfo as SenderObject

    // console.log(senderInfo, key)

    if (key === "id") return;
    if (key === "senderFirst" || key === "senderLast") {
      return;
    }
    if (key === "senderPhone") {
      if (!senderObject[key].length) {
        return (
          <Box key={`${key}-display`} sx={{
            display: "flex",
          }}>
            <Typography color={theme.palette.error.light} fontStyle={"italic"}>{"*Contact phone number required"}</Typography>
          </Box>
        )
      } else {
        return (
          <Box key={`${key}-display`} sx={{
            display: "flex",
          }}>
            <Typography>{parsePhone(senderObject[key])}</Typography>
          </Box>
        )
      }
    }

    return (
      <Box key={`${key}-display`} sx={{
        display: "flex",
      }}>
        <Typography sx={{}}>{senderObject[key]}</Typography>
      </Box>
    )
  })

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
                {addressArr.map((orderArr, addressIdx) => {
                  if (!orderArr.length || !sortedOrderPriceInfo[dateIdx].length) return;
                  const addressStr = addressToString(addresses[addressIdx])
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
                              <CartItem cart={currCart} setCurrCart={setCurrCart} order={order} setOrder={setOrder} setSortedOrderPriceInfo={setSortedOrderPriceInfo} setCartTotal={setCartTotal} setAddresses={setAddresses} orderItem={orderItem} orderPrices={sortedOrderPriceInfo[dateIdx][addressIdx]} addressIdx={addressIdx} orderIdx={orderIdx} dateIdx={dateIdx}></CartItem>
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
                        <PriceInfoDisplay order={order} orderPrices={sortedOrderPriceInfo[dateIdx][addressIdx]} dateIdx={dateIdx} addressIdx={addressIdx} />
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
        {cartTotal &&
          <>
            <Box id="sender-info-box"
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "start"
              }}>
              <Box id="sender-info-header"
                sx={{
                  mb: 2
                }}>
                <Typography>
                  {"Sender Information"}
                </Typography>
                <Typography fontSize="0.7rem">
                  {"(Not shown to recipient - for shop use only)"}
                </Typography>
              </Box>
              {editSenderInfo ?
                <SenderInfo formData={senderInfo as SenderInfoType} handleFormData={(handleSenderInfo)} />
                : SenderInfoDisplay
              }
              <Button
                variant="outlined"
                onClick={handleEditSenderInfo}
                sx={{
                  alignSelf: "center",
                  my: 2
                }}
              >
                {editSenderInfo ? "Confirm Changes" : "Edit Sender Info"}
              </Button>
              {(!senderInfo.senderEmail || !senderInfo.senderId) &&
                <Button sx={{
                  alignSelf: "center",
                  textDecoration: "underline",
                  textTransform: "none",
                }}>
                  Log in to save information
                </Button>}
            </Box>
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
          </>}
        {(clientSecret && currCart) &&
          <Elements stripe={stripePromise} options={stripeOptions} >
            <CheckoutForm cart={currCart} senderInfo={senderInfo as SenderInfoType} order={order} sortedPrices={sortedOrderPriceInfo} total={cartTotal} paymentIntent={paymentIntent} />
          </Elements>}
      </Box>
    </Container>
  )
}
import { useState, useEffect, ChangeEvent, MouseEvent } from "react";

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

import { Cart, Order, OrderForm, OrderPriceInfo, SenderInfo, SortedOrder } from "@/app/types/component-types/OrderFormData";
// import { useCart, CartContextType } from "@/contexts/CartContext";

interface CheckoutFormProps {
  cart: Cart
  senderInfo: SenderInfo
  order: SortedOrder,
  total: string,
  paymentIntent: string,
  sortedPrices: OrderPriceInfo[][]
}

export default function CheckoutForm(props: CheckoutFormProps) {

  const { cart, senderInfo, order, sortedPrices, total, paymentIntent } = props;

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orderReady, setOrderReady] = useState<boolean>(false);
  const [orderStatusAlert, setOrderStatusAlert] = useState({
    nameAlert: "",
    senderAlert: "",
    addressAlert: "",
    phoneAlert: "",
    cardMessageAlert: "",
  })

  // Setting up stripe and payment intent;
  useEffect(() => {

    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret)
      .then(({ paymentIntent }) => {

        if (!paymentIntent) {
          setMessage("Something Went Wrong");
          return;
        }

        switch (paymentIntent.status) {
          case "succeeded":
            setMessage("Payment Succeeded");
            break;
          case "processing":
            setMessage("Payment Processing");
            break;
          case "requires_payment_method":
            setMessage("Payment not successful, please try again");
            break;
          default:
            setMessage("Something went wrong");
            break;
        }

      })

  }, [stripe])

  // Set alerts based on information provided
  useEffect(() => {

    const newStatusAlert = {
      nameAlert: "",
      senderAlert: "",
      addressAlert: "",
      phoneAlert: "",
      cardMessageAlert: ""
    }

    if (!senderInfo.senderName.length) {
      newStatusAlert.senderAlert = "Missing sender name"
    }
    if (!senderInfo.senderPhone.length) {
      newStatusAlert.senderAlert = newStatusAlert.senderAlert.length ? newStatusAlert.senderAlert.concat(" and phone number") : "Missing sender phone number";
    }

    for (let i = 0; i < cart.cartItems.length; i++) {
      const item = cart.cartItems[i];
      const { recipAddress } = item;

      if (!item.recipFirst.length && !item.recipLast.length) {
        newStatusAlert.nameAlert = `Recipient name missing - item ${i + 1} will be delivered to the address without a recipient.`
      }
      if (!recipAddress.streetAddress1.length || !recipAddress.townCity.length || !recipAddress.state.length || !recipAddress.zip.length) {
        newStatusAlert.addressAlert = `Full address required for item ${i + 1}.`
      }
      if (!item.recipPhone.length) {
        newStatusAlert.phoneAlert = `Missing recipient phone number - we won't be able to contact the recipient about item ${i + 1}`
      }
      if (!item.cardMessage.length) {
        newStatusAlert.cardMessageAlert = `No card message - item ${i + 1} will be sent anonymously`
      }
    }
    if (newStatusAlert.addressAlert.length || newStatusAlert.senderAlert.length || newStatusAlert.senderAlert.length) {
      setOrderStatusAlert(newStatusAlert);
      setOrderReady(false);
    } else {
      setOrderStatusAlert(newStatusAlert);
      setOrderReady(true);
    }

  }, [cart, senderInfo, orderReady])


  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { addresses, deliveryDates } = cart;

    setIsLoading(true);

    const finalOrders: Order[] = [];

    order.forEach((addressArr, i) => {
      if (!!addressArr.length) {
        addressArr.forEach((orderItems, j) => {

          finalOrders.push({
            senderInfo: senderInfo,
            deliveryDate: deliveryDates[i],
            address: addresses[j],
            orderItems: orderItems,
            orderPrices: sortedPrices[i][j]
          });
        });
      };
    });

    const request = {
      orders: finalOrders,
      sortedOrder: order,
      total: total,
      paymentIntent: paymentIntent
    } as OrderForm;

    // init order 
    const response = await fetch(`http://localhost:3000/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request)
    })

    console.log("response: ", response);

    const {
      message,
      data
    }: {
      message: string,
      data: {
        orderIds: { id: number }[]
      }
    } = await response.json();

    if (!response.ok) {
      console.error(message);
      setMessage("Error in database");
      setIsLoading(false);
      return;
    }

    const orderParams: number[] = [];

    data.orderIds.forEach((order, idx) => {
      orderParams.push(order.id);
    })

    const encodedParams = encodeURIComponent(JSON.stringify(orderParams));

    localStorage.removeItem("cart");

    // Set up a checkout completion page and change return_url to this endpoint.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/checkout/confirm/?orders=${encodedParams}`
      }
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      console.error(error);
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false);
  }


  const OrderStatusAlerts = Object.keys(orderStatusAlert).map((status, idx) => {

    if (!status.length) return;

    return (
      <Box key={`order-status-alert-${idx + 1}`}
        id={`order-${status}-message`}>
        <Typography>
          {Object.values(orderStatusAlert)[idx]}
        </Typography>
      </Box>
    )

  })


  const paymentElementOptions = {
    layout: "tabs"
  } as StripePaymentElementOptions

  return (

    <form id="payment-form">
      <PaymentElement id="stripe-payment-element" options={paymentElementOptions} />
      <Box id="payment-button-box"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
        <Button id="submit-button"
          disabled={isLoading || !stripe || !elements || !orderReady}
          variant="contained"
          onClick={handleSubmit}
          sx={{
            marginY: "20px",
            width: "50%"
          }}
        >
          <span id="button-text">
            {isLoading ? <div>loading...</div> : "Pay Now"}
          </span>
        </Button>
      </Box>
      {
        OrderStatusAlerts
      }
      {message &&
        <Box id="payment-message">
          <Typography>
            {message}
          </Typography>
        </Box>
      }
    </form>

  )

}
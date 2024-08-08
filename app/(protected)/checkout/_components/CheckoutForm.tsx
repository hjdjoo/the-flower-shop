import { useState, useEffect, ChangeEvent, MouseEvent } from "react";

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"

import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

import { Cart } from "@/app/types/component-types/OrderFormData";
// import { useCart, CartContextType } from "@/contexts/CartContext";

interface CheckoutFormProps {
  cart: Cart
}

export default function CheckoutForm(props: CheckoutFormProps) {

  const { cart } = props;

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

  useEffect(() => {

    const newStatusAlert = {
      nameAlert: "",
      senderAlert: "",
      addressAlert: "",
      phoneAlert: "",
      cardMessageAlert: ""
    }

    for (let i = 0; i < cart.cartItems.length; i++) {
      const item = cart.cartItems[i];
      const { recipAddress } = item;

      if (!item.recipFirst.length && !item.recipLast.length) {
        newStatusAlert.nameAlert = `Recipient name missing - item ${i + 1} will be delivered to the address without a recipient.`
      }
      if (!recipAddress.streetAddress1.length || !recipAddress.townCity.length || !recipAddress.state.length || !recipAddress.zip.length) {
        newStatusAlert.addressAlert = `Full address missing - item ${i + 1}`
      }
      if (!item.recipPhone.length) {
        newStatusAlert.phoneAlert = `Missing recipient phone number - we won't be able to contact the recipient about item ${i + 1}`
      }
      if (!item.cardMessage.length) {
        newStatusAlert.cardMessageAlert = `No card message - item ${i + 1} will be sent anonymously`
      }
    }
    if (newStatusAlert.addressAlert.length || newStatusAlert.senderAlert.length) {
      setOrderReady(false);
      setOrderStatusAlert(newStatusAlert);
    } else {
      setOrderReady(true);
    }

  }, [cart])

  // TODO: handleSubmit should also add item to DB. 
  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Set up a checkout completion page and change return_url to this endpoint.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/confirm-payment"
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
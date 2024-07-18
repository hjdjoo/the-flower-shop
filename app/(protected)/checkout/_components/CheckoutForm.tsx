import { useState, useEffect, ChangeEvent } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { StripePaymentElementOptions } from "@stripe/stripe-js";

export default function CheckoutForm() {

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    // Set up a checkout completion page and change return_url to this endpoint.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "localhost:3000/"
      }
    })

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.")
    }

    setIsLoading(false);

  }

  const paymentElementOptions = {
    layout: "tabs"
  } as StripePaymentElementOptions

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="stripe-payment-element" options={paymentElementOptions} />
      <button id="submit-button"
        disabled={isLoading || !stripe || !elements}>
        <span id="button-text">
          {isLoading ? <div>loading...</div> : "Pay Now"}
        </span>
      </button>
      {message &&
        <div id="payment-message">
          {message}
        </div>
      }
    </form>
  )

}
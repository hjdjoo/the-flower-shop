"use client"

import { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
/***** custom components *****/
import { InputField } from "./styled/InputField";
import SenderInfo from "./SenderInfo";
import RecipientInfo from "./RecipientInfo";
import OrderInfo from "./OrderInfo";

import { OrderForm as orderForm } from "./lib/OrderForm";

/***** types *****/
import { OrderFormData } from "../types/component-types/OrderFormData";

// leaving "cart" type as "any" while creating new order functionality is underway.
interface OrderSheetProps {
  senderId: string | undefined,
  cart: any
}

export default function OrderSheet() {

  const [formData, setFormData] = useState<OrderFormData>({ ...orderForm });

  const handleFormData = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    const { name, value } = e.currentTarget;

    setFormData({
      ...formData,
      [name]: value
    })

  }

  // order submission logic to database...
  const handleSubmit = () => {
    console.log(formData);
  }


  return (
    <Box
      component="form"
      sx={{
        // border: "1px dotted black",
        display: "flex",
        flexDirection: "column",
        width: "100%"
      }}
    >
      <SenderInfo formData={formData} handleFormData={handleFormData} />
      <RecipientInfo formData={formData} handleFormData={handleFormData} />
      <OrderInfo formData={formData} setFormData={setFormData} handleFormData={handleFormData} />
      <Button
        variant="contained"
        onClick={handleSubmit}
      >
        Proceed to Billing
      </Button>
    </Box>
  )
}
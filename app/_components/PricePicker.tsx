import { useState, useEffect, Dispatch, SetStateAction, ChangeEvent } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

import { OrderFormData, OrderItem } from "../types/component-types/OrderFormData";

// pricePicker should take in a dispatch function to set state as well.
interface PricePickerProps {
  // prices: Array<number | string | undefined>
  productInfo: { id: number, description: string, prices: Array<string> }
  orderItem: OrderItem
  setOrderItem: Dispatch<SetStateAction<OrderItem>>
  submitStatus: string | undefined
  setPriceSelected: Dispatch<SetStateAction<boolean>>
}


export default function PricePicker(props: PricePickerProps) {

  const { productInfo, orderItem, setOrderItem, submitStatus, setPriceSelected } = props;

  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined)

  const priceTiers = ["Standard", "Premium", "Deluxe"]

  useEffect(() => {

    if (submitStatus === "submitted") {
      setSelectedPrice(undefined);
      setPriceSelected(false);
    }

  }, [submitStatus, setPriceSelected])


  const handlePrice = (price: string, idx: number) => {
    setSelectedPrice(idx);

    const updatedOrderInfo = { ...orderItem };

    updatedOrderInfo.price = price;

    setOrderItem({ ...updatedOrderInfo });
    setPriceSelected(true);
  }


  const PriceButtons = productInfo.prices?.map((price, idx) => {
    return (
      <Button
        variant={selectedPrice === idx ? "contained" : "outlined"}
        key={`price-button-${idx + 1}`}
        id={`price-button-`}
        onClick={() => handlePrice(price, idx)}
        aria-label={`Select ${priceTiers[idx]}`}
        sx={{
          width: "25%"
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography fontSize={"0.8rem"}>{priceTiers[idx]}</Typography>
          <Typography>{`$${price}`}</Typography>
        </Box>
      </Button>)
  })

  return (
    <Box
      width={"90%"}
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      {PriceButtons}
    </Box>
  )

}
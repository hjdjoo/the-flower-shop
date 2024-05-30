import { useState, Dispatch, SetStateAction, ChangeEvent } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Radio, { RadioProps } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Button } from "@mui/material";

import { OrderFormData } from "./types/OrderFormData";

// pricePicker should take in a dispatch function to set state as well.
interface PricePickerProps extends RadioProps {
  // prices: Array<number | string | undefined>
  productInfo: { id: number, description: string, prices: Array<number | undefined> }
  orderInfo: OrderFormData
  setOrderInfo: Dispatch<SetStateAction<OrderFormData>>
}

interface ItemPrice {
  id: string
  price: number
}

export default function PricePicker(props: PricePickerProps) {

  const { id, productInfo, orderInfo, setOrderInfo } = props;

  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined)

  const priceTiers = ["Standard", "Premium", "Deluxe"]

  const handlePrice = (price: number, idx: number) => {
    setSelectedPrice(idx);

    const updatedOrderInfo = { ...orderInfo };

    if (!updatedOrderInfo.products.length) {
      updatedOrderInfo.products.push({
        productId: productInfo.id,
        description: productInfo.description,
        productType: undefined,
        value: price
      })
    }
    else {
      for (let product of updatedOrderInfo.products) {
        if (product?.productId === id) {
          product!.value = price
        }
      }
    }

    setOrderInfo(updatedOrderInfo)
  }


  const PriceButtons = productInfo.prices?.map((price, idx) => {
    return (
      <Button
        variant={selectedPrice === idx ? "contained" : "outlined"}
        key={`price-button-${idx + 1}`}
        id={`price-button-`}
        onClick={() => handlePrice(price!, idx)}
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
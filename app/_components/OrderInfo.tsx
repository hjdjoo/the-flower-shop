"use client"
import { useState } from "react";

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

/***** Icons *****/
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddIcon from '@mui/icons-material/Add';

/***** Custom Components *****/
import { InputField } from "./styled/InputField";

/***** types *****/
import { OrderFormData } from "../types/component-types/OrderFormData";
import type { ChangeEvent, ChangeEventHandler, SetStateAction, SyntheticEvent } from "react";
import type { Dispatch } from "react";

interface OrderInfoProps {
  formData: OrderFormData
  setFormData: Dispatch<SetStateAction<OrderFormData>>
  handleFormData: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

const productTypes = [
  { label: "Vase" },
  { label: "Basket" },
  { label: "Loose" },
  { label: "Wreath" },
  { label: "Basket" },
  { label: "Sympathy" },
  { label: "Boutonniere" },
  { label: "Corsage" },
  { label: "Gift Basket" },
  { label: "Balloon - Mylar" },
  { label: "Balloon - Latex" },
  { label: "Miscellaneous" }
]

export default function OrderInfo(props: OrderInfoProps) {

  const { formData, setFormData, handleFormData } = props;

  const [products, setProducts] = useState(formData.orderItems);

  const addNewItem = () => {
    // products.push({
    //   productId: "",
    //   productType: "",
    //   description: "",
    //   value: 0
    // })

    // setFormData({ ...formData, orderItems })
  }

  const handleProducts = (e: SyntheticEvent<Element, Event> | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {


  }

  const orderItems = products.map((_el, idx) => {
    return (
      <Grid
        container
        key={`order-item-${idx + 1}`}
      >
        <Grid xs={8}>
          <Autocomplete
            options={productTypes}
            renderInput={(params) => <TextField {...params}
              label={`Item ${idx + 1} Type`}
            />}
            onChange={handleProducts}
            size="small"
            sx={{
              margin: "5px",
            }}
          />
        </Grid>
        <Grid xs={4}>
          <InputField
            name={`orderItem${idx + 1}`}
            label={`Price:`}
            size="small"
            InputProps={{
              startAdornment: <AttachMoneyIcon sx={{
                fontSize: "1rem",
                margin: "0",
              }} />
            }}
          >
          </InputField>
        </Grid>
        <Grid
          xs={12}
        >
          <FormControl
            fullWidth={true}
          >
            <InputField
              multiline={true}
              name={`orderItem${idx + 1}`}
              label={`Item ${idx + 1} Description`}
              sx={{
                // width: "100%",
                marginRight: "5px"
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    )
  })

  return (
    <>
      <Typography
        sx={{
          fontSize: "1.5rem"
        }}>
        Order Details
      </Typography>
      <InputField
        id="card-message"
        name="cardMessage"
        multiline={true}
        label="Enter Your Card Message"
        // helperText={`${formData.cardMessage.length}/300`}
        onChange={handleFormData}
        // value={formData.cardMessage}
        sx={{
        }} />
      {orderItems}
      <InputLabel>Add Item(s):</InputLabel>
      <Button
        onClick={addNewItem}
        sx={{
          alignSelf: "flex-start"
        }}
      >
        <AddIcon />
      </Button>
      <InputLabel>Delivery Date:</InputLabel>
      <InputField
        id="delivery-date"
        name="deliveryDate"
        type="date"
        onChange={handleFormData}
        sx={{
        }} />
    </>
  )
}
import { useState, ChangeEvent } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Radio, { RadioProps } from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

interface PricePickerProps extends RadioProps {
  id: string
  name: string
  standardPrice: number | string | undefined
  premiumPrice: number | string | undefined
  deluxePrice: number | string | undefined
}

interface ItemPrice {
  id: string
  price: number
}

export default function PricePicker(props: PricePickerProps) {

  const { name, id, standardPrice, premiumPrice, deluxePrice } = props;

  const [itemPrice, setItemPrice] = useState<ItemPrice>({
    id: "",
    price: 0
  })

  const handlePrice = (e: ChangeEvent<HTMLInputElement>) => {



  }

  return (
    <FormControl>
      <Grid
        container
      >
        <Grid xs={4}>
          <Typography fontSize={"0.8rem"}>Standard:</Typography>
        </Grid>
        <Grid xs={4}>
          <Typography fontSize={"0.8rem"}>Premium:</Typography>
        </Grid>
        <Grid xs={4}>
          <Typography fontSize={"0.8rem"}>Deluxe:</Typography>
        </Grid>
        <RadioGroup
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
          onChange={handlePrice}
        >
          <Grid xs={4}>
            <FormControlLabel
              value={standardPrice}
              name="standardPrice"
              control={<Radio />}
              label={`$${standardPrice}`}
            />
          </Grid>
          <Grid xs={4}>
            <FormControlLabel
              value={premiumPrice}
              name="premiumPrice"
              control={<Radio />}
              label={`$${premiumPrice}`}
            />
          </Grid>
          <Grid xs={4}>
            <FormControlLabel
              value={deluxePrice}
              name="premiumPrice"
              control={<Radio />}
              label={`$${deluxePrice}`}
            />
          </Grid>
        </RadioGroup>
      </Grid>
    </FormControl>
  )

}
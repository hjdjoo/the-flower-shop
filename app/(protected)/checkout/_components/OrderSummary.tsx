import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import formatDate from "@/utils/actions/formatDate";

import { OrderPriceInfo, Address } from "@/app/types/component-types/OrderFormData";

interface OrderSummaryProps {
  deliveryDate: string
  address: Address
  orderItems: {
    recipId?: number
    recipFirst: string
    recipLast: string
    productId: number
    selectedTier: number
    cardMessage: string
  }[]
  orderPriceInfo: OrderPriceInfo
}

export default async function OrderSummary(props: OrderSummaryProps) {

  const { deliveryDate, address, orderItems, orderPriceInfo } = props;

  const { streetAddress1, streetAddress2, townCity, state, zip } = address;


  const OrderItems = orderItems.map((item, idx) => {

    return (
      <Grid key={`order-item-${idx + 1}`} container>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>
            Delivery for:
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>
            {`${item.recipFirst} ${item.recipLast}`}
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>
            Item Value:
          </Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>${orderPriceInfo.itemValues[idx].toFixed(2)}</Typography>
        </Grid>
      </Grid>
    )
  })


  return (
    <Box>
      <Grid container
      >
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>{"Deliver on:"}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>{formatDate(deliveryDate)}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>Delivery to:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>{streetAddress1}</Typography>
          <Typography sx={{ fontSize: "0.8rem" }}>{streetAddress2}</Typography>
          <Typography sx={{ fontSize: "0.8rem" }}>{`${townCity} ${state}`}</Typography>
          <Typography sx={{ fontSize: "0.8rem" }}>{zip}</Typography>
        </Grid>
      </Grid>
      {OrderItems}
      <Grid container
        sx={{ my: 1, py: 1, borderTop: "1px solid lightgrey" }}>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>Delivery Fee:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>${orderPriceInfo.deliveryFee.toFixed(2)}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>Tax:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>${orderPriceInfo.tax.toFixed(2)}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>Total:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography sx={{ fontSize: "0.8rem" }}>${orderPriceInfo.total.toFixed(2)}</Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
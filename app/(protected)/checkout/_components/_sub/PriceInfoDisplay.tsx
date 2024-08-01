import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import { ItemPrices, OrderPrices } from "@/app/types/component-types/OrderFormData";
import { CartContextType, useCart } from "@/lib/contexts/CartContext";

interface PriceInfoDisplayProps {
  orderPrices: OrderPrices
  dateIdx: number
  addressIdx: number
}

export default function PriceInfoDisplay(props: PriceInfoDisplayProps) {

  const { getSortedOrder } = useCart() as CartContextType;
  const sortedOrder = getSortedOrder();
  const { orderPrices, dateIdx, addressIdx } = props;

  const { itemValues, deliveryFee, tax, total } = orderPrices

  const ItemInfo = itemValues.map((value, orderIdx) => {

    return (
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-item`}
        key={`order-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-item`}
        container
        xs={12}
        sx={{
          width: "full"
        }}
      >
        <Grid xs={7}>
          <Typography sx={{
            fontSize: "0.9rem",
            textAlign: "right",
            pr: 1
          }}>
            {sortedOrder && `${sortedOrder[dateIdx][addressIdx][orderIdx].name}:`}
          </Typography>
        </Grid>
        <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-item-value`}
          xs={5}>
          <Typography sx={{
            fontSize: "0.9rem",
            textAlign: "right"
          }}>
            ${value}
          </Typography>
        </Grid>
      </Grid>
    )
  })


  return (
    <Grid container
      rowSpacing={1}
      sx={{
        width: "75%",
        mb: 3,
        mr: 3
      }}>
      {ItemInfo}
      <Grid xs={7}>
        <Typography sx={{
          fontSize: "0.9rem",
          textAlign: "right",
          pr: 1
        }}>
          Del. Fee
        </Typography>
      </Grid>
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-delivery-fee`}
        xs={5}>
        <Typography sx={{
          fontSize: "0.9rem",
          textAlign: "right"
        }}>
          ${deliveryFee}
        </Typography>
      </Grid>
      <Grid xs={7}>
        <Typography sx={{
          fontSize: "0.9rem",
          textAlign: "right",
          pr: 1
        }}>
          Tax:
        </Typography>
      </Grid>
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-tax`}
        xs={5}>
        <Typography sx={{
          fontSize: "0.9rem",
          textAlign: "right"
        }}>
          ${tax}
        </Typography>
      </Grid>
      <Grid xs={7}>
        <Typography sx={{
          fontSize: "0.9rem",
          fontWeight: 900,
          textAlign: "right",
          pr: 1
        }}>
          Total:
        </Typography>
      </Grid>
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-total`}
        xs={5}>
        <Typography sx={{
          fontSize: "0.9rem",
          fontStyle: "bold",
          fontWeight: 900,
          textAlign: "right"
        }}>
          ${total}
        </Typography>
      </Grid>
    </Grid>
  )
}
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import { ItemPrices } from "@/app/types/component-types/OrderFormData";
import { useCart } from "@/lib/contexts/CartContext";
import { CartContextType } from "@/lib/contexts/CartContext";

interface PriceInfoDisplayProps {
  itemPrices: ItemPrices
  dateIdx: number
  addressIdx: number
}

export default function PriceInfoDisplay(props: PriceInfoDisplayProps) {

  const { cart } = useCart() as CartContextType;
  const { itemPrices, dateIdx, addressIdx } = props;
  const { itemValue, tax, total } = itemPrices

  return (
    <Grid container
      rowSpacing={2}
      sx={{
        width: "100%",
        mb: 3,
        mr: 3
      }}>
      <Grid xs={7}>
        <Typography sx={{
          fontSize: "0.9rem",
          textAlign: "right",
          pr: 1
        }}>
          Item:
        </Typography>
      </Grid>
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-item-value`}
        xs={5}>
        <Typography sx={{
          fontSize: "0.9rem",
          textAlign: "right"
        }}>
          ${itemValue}
        </Typography>
      </Grid>
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
          {/* ${deliveryFee} */}
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
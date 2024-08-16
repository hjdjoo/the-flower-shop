import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import { OrderPriceInfo, SortedOrder } from "@/app/types/component-types/OrderFormData";
import { CartContextType, useCart } from "@/contexts/CartContext";
import { SxProps } from "@mui/material";

interface PriceInfoDisplayProps {
  order: SortedOrder
  orderPrices: OrderPriceInfo
  dateIdx: number
  addressIdx: number
  typographyStyle?: SxProps
}



export default function PriceInfoDisplay(props: PriceInfoDisplayProps) {

  const { order: sortedOrder, orderPrices, dateIdx, addressIdx, typographyStyle: style } = props;

  const typographyStyle: SxProps = {
    ...style,
    textAlign: "right",
  }

  // console.log("PriceInfoDisplay/")
  // console.table({ sortedOrder, orderPrices, dateIdx, addressIdx })

  const { itemValues, deliveryFee, tax, total } = orderPrices

  const ItemInfo = itemValues.length ? itemValues.map((value, orderIdx) => {

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
          <Typography sx={typographyStyle}>
            {sortedOrder[dateIdx][addressIdx][orderIdx] && `${sortedOrder[dateIdx][addressIdx][orderIdx].name}:`}
          </Typography>
        </Grid>
        <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-item-value`}
          xs={5}>
          <Typography sx={typographyStyle}>
            ${value.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    )
  }) : <></>


  return (
    <Grid container
      rowSpacing={1}
      sx={{
        width: "100%",
      }}>
      {ItemInfo}
      <Grid xs={7}>
        <Typography sx={typographyStyle}>
          Del. Fee
        </Typography>
      </Grid>
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-delivery-fee`}
        xs={5}>
        <Typography sx={typographyStyle}>
          ${deliveryFee.toFixed(2)}
        </Typography>
      </Grid>
      <Grid xs={7}>
        <Typography sx={typographyStyle}>
          Tax:
        </Typography>
      </Grid>
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-tax`}
        xs={5}>
        <Typography sx={typographyStyle}>
          ${tax.toFixed(2)}
        </Typography>
      </Grid>
      <Grid xs={7}>
        <Typography sx={{
          ...typographyStyle,
          fontWeight: 900,
          pr: 1,
          mt: 1,
          pt: 1,
          borderTop: "1px solid lightgrey"
        }}>
          Total:
        </Typography>
      </Grid>
      <Grid id={`order-${dateIdx + 1}-${addressIdx + 1}-total`}
        xs={5}>
        <Typography sx={{
          ...typographyStyle,
          fontStyle: "bold",
          fontWeight: 900,
          mt: 1,
          pt: 1,
          borderTop: "1px solid lightgrey"
        }}>
          ${total.toFixed(2)}
        </Typography>
      </Grid>
    </Grid>
  )
}
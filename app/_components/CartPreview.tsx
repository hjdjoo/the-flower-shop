
import Image from "next/image";

import { useState, useEffect } from "react";

// import { useContext } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Box";
import { useTheme } from "@mui/material";

import OrderInfoDisplay from "./OrderInfoDisplay";
import PriceInfoDisplay from "./PriceInfoDisplay";
import AddressDisplay from "./AddressDisplay";

import { imageLoader } from "@/app/lib/imageLoader";

import { useCart, CartContextType } from "@/contexts/CartContext";
import useBreakpoints from "@/utils/hooks/useBreakpoints";

import calculateTax from "@/utils/actions/calculateTax";
import calculateCart from "@/utils/actions/calculateCart";
import formatDate from "@/utils/actions/formatDate";
import getDayOfWeek from "@/utils/actions/getDayOfWeek";

import { Cart, OrderItem, OrderPriceInfo, SortedOrder } from "../types/component-types/OrderFormData";



/** Current cart methods:
 * 
 * Cart.getSortedOrder() returns orders sorted into a 3d array, sorted by delivery date and then mapped to address indices.
 * 
 * Removing an item can be done by passing in an updated cart to updateCart().
 * If a SortedCart needs to be used to update (for example, removing SortedCart[i][j]), simply remove item as desired then pass in SortedCart.flat() into updateCart.
 * 
 * Will keep CartPreviewItem within this file unless file grows otherwise too large.
 * 
 */

interface CartPreviewItemProps {
  orderItem: OrderItem
  dateIdx: number
  addressIdx: number
  orderIdx: number
}


const miniCartTypographyStyle = {
  fontSize: "0.7rem"
}

const CartPreviewItem = (props: CartPreviewItemProps) => {

  const { orderItem: item, dateIdx, addressIdx, orderIdx } = props;

  return (
    <Grid id={`preview-item-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}`}
      container
      sx={{
        my: 2
      }}>
      <Grid xs={5}>
        <Box id={`preview-item-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-name`} sx={{
          textAlign: "start",
          mb: 1
        }}>
          <Typography sx={{ fontSize: "0.8rem" }}>{item.name}</Typography>
        </Box>
        <Box
          id={`preview-item-image-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}`}
          sx={{
            height: "100px",
            width: "100px",
            display: "flex",
            flexDirection: "row",
            background: "lightgrey",
            position: "relative",
            flexWrap: "wrap",
          }}>
          <Image src={item.imageUrl} alt={`preview-item-${addressIdx + 1}-${orderIdx + 1}-image`} loader={imageLoader} fill style={{ objectFit: "contain" }} />
        </Box>
      </Grid>
      <Grid id={`preview-item-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-recip-details`}
        xs={7}
        container
        columnSpacing={2}
        sx={{
          textAlign: "right"
        }}>
        <Grid xs={12}></Grid>
        <Grid xs={4}
        >
          <Typography sx={miniCartTypographyStyle}>To:</Typography>
        </Grid>
        <Grid id={`preview-item-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-recip-name`}
          xs={8}>
          <Typography sx={
            {
              ...miniCartTypographyStyle,
              fontStyle: !item.recipLast.length ? "italic" : "normal"
            }
          }>{item.recipLast.length ? `${item.recipFirst} ${item.recipLast}` : `Recipient name required`}</Typography>
        </Grid>
        <Grid xs={4}
        >
          <Typography sx={miniCartTypographyStyle}>Message:</Typography>
        </Grid>
        <Grid id={`preview-item-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}-message`}
          xs={8}>
          <Typography sx={
            {
              ...miniCartTypographyStyle,
              fontStyle: !item.cardMessage.length ? "italic" : "normal"
            }
          }>{item.cardMessage.length ? `${item.cardMessage}` : `No card message`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  )

}

interface DeliveryOrderGroupProps {
  items: OrderItem[]
  dateIdx: number
  addressIdx: number

}

const DeliveryOrderGroup = (props: DeliveryOrderGroupProps) => {

  const { items, dateIdx, addressIdx } = props

  const previewItems = items.map((item, orderIdx) => {
    return (
      <CartPreviewItem key={`preview-item-${dateIdx + 1}-${addressIdx + 1}-${orderIdx + 1}`} orderItem={item} dateIdx={dateIdx} orderIdx={orderIdx} addressIdx={addressIdx} />
    )
  })

  return (
    <Box id={`preview-item-${dateIdx + 1}-${addressIdx + 1}`}>
      {previewItems}
    </Box>
  )
}

interface DeliveryDateBoxProps {
  cart: Cart,
  sortedOrder: SortedOrder
  sortedPrices: OrderPriceInfo[][]
  orders: OrderItem[][]
  dateIdx: number
}

const DeliveryDateGroup = (props: DeliveryDateBoxProps) => {

  const { cart, sortedOrder, sortedPrices, orders, dateIdx } = props

  const orderGroups = orders.map((items, addressIdx) => {
    if (!items.length) return;
    return (
      <>
        <DeliveryOrderGroup key={`delivery-${dateIdx + 1}-${addressIdx + 1}`} items={items} dateIdx={dateIdx} addressIdx={addressIdx} />
        <Box sx={{
          display: "flex",
          alignItems: "center",
        }}>
          <Box
            sx={{
              flexGrow: 1,
              marginTop: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
              alignItems: "end",
              borderRadius: "10px",
              textAlign: "end",
              marginRight: 4
            }}
          >
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 650, my: 1 }}>
              Delivering {`${orders.length} ${orders.length === 1 ? "item" : "items"}`} to:
            </Typography>
            <AddressDisplay address={cart.addresses[addressIdx]} typographyStyle={{ fontSize: "0.7rem" }} />
          </Box>
          <PriceInfoDisplay order={sortedOrder} orderPrices={sortedPrices[dateIdx][addressIdx]} dateIdx={dateIdx} addressIdx={addressIdx} typographyStyle={{ fontSize: "0.7rem" }} />
        </Box>
      </>
    )
  })

  return (
    <Box id={`delivery-date-box-${dateIdx + 1}`}
      display="flex"
      flexDirection="column"
      paddingBottom="10px"
    >
      {orderGroups}
    </Box>
  )


}

export default function CartPreview() {

  // interesting note -- if you call "useTheme" in a parent component, MUI components in child components will not apply any theming unless specifically directed. Unless I'm missing something?
  const theme = useTheme();
  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const { cart, getSortedOrder } = useCart() as CartContextType;
  const [order, setOrder] = useState<SortedOrder>([]);
  const [sortedPrices, setSortedPrices] = useState<OrderPriceInfo[][]>([]);
  const [total, setTotal] = useState<string>("")

  const { deliveryDates } = cart;

  useEffect(() => {
    if (!cart.deliveryDates.length) {
      return;
    }
    const sortedOrder = getSortedOrder();
    (async () => {
      const prices = await calculateCart(sortedOrder);

      setOrder(sortedOrder);
      setSortedPrices(prices.orderPrices);
      setTotal(prices.cartTotal.toFixed(2));

    })()
  }, [cart, getSortedOrder])

  // go thru delivery dates;
  const deliveryDivs = order.map((addressArr, dateIdx) => {

    const displayDay = getDayOfWeek(deliveryDates[dateIdx]);
    const displayDate = formatDate(deliveryDates[dateIdx]);

    return (
      <Box key={`delivery-date-${dateIdx + 1}-preview`}>
        <Box
          id={`delivery-date-${dateIdx + 1}-preview`}
          display="flex"
          paddingY="10px"
          paddingX="15px"
          borderRadius="10px"
          marginY="10px"
          sx={{
            background: theme.palette.info.main,
            color: "white",
            fontSize: () => {
              if (mobile) return "0.8rem"
              if (tablet) return "0.9rem"
              if (large) return "1rem"
              return "1rem"
            },
          }}>
          <Typography>
            For Delivery On {`${displayDay} ${displayDate}`}
          </Typography>
        </Box>
        <DeliveryDateGroup cart={cart} sortedOrder={order} sortedPrices={sortedPrices} orders={addressArr} dateIdx={dateIdx} />
      </Box>
    )
  });

  return (
    <Box
      marginTop="15px"
      height="auto"
      display="flex"
      flexDirection="column"
      paddingX="5px"
      justifyContent="center"
    >
      <Box
        id={`delivery-div-font-provider`}
        fontFamily={theme.typography.fontFamily}>
        {deliveryDivs}
      </Box>
      <Box
        fontFamily={theme.typography.fontFamily}
        sx={{
          display: "flex",
          justifyContent: "end"
        }}>
        <Typography
          sx={{
            mx: 1,
            fontSize: "0.8rem",
            fontWeight: "650"
          }}
        >
          Cart Total:
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: "650"
          }}
        >
          ${total}
        </Typography>
      </Box>
    </Box>
  )
}
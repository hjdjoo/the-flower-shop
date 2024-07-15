
import Image from "next/image";

// import { useContext } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Box";
import { useTheme } from "@mui/material";

import { imageLoader } from "@/lib/imageLoader";

import { useCart, CartContextType } from "@/lib/contexts/CartContext";

import calculateTax from "@/utils/actions/calculateTax";
import formatDate from "@/utils/actions/formatDate";
import getDayOfWeek from "@/utils/actions/getDayOfWeek";

import type { OrderItem } from "../types/component-types/OrderFormData";



/** Current cart shape:
 * 
 * Cart.getSortedOrder() returns orders sorted into nested array by delivery date.
 * 
 */

interface CartPreviewItemProps {
  idx: number,
  cartItem: OrderItem
}

const CartPreviewItem = (props: CartPreviewItemProps) => {

  const { name, imageUrl, price, recipFirst, recipLast, recipAddress, deliveryDate, deliveryFee } = props.cartItem
  const { idx } = props;

  const addressStr = Object.values(recipAddress).join(" ");

  const { tax, total } = calculateTax(price, deliveryFee)

  return (
    <Box id={`${deliveryDate}-box-${idx + 1}`}
      display="flex"
      sx={{
        marginY: "5px"
      }}
    >
      <Box
        id={`${deliveryDate}-image-container-${idx + 1}`}
        position="relative"
        width="50%"
        sx={{
          objectFit: "contain"
        }}
      >
        <Image src={imageUrl} alt={`${name}-image`} loader={imageLoader} fill style={{ objectFit: "contain" }} />
      </Box>
      <Box id={`${deliveryDate}-order-${idx + 1}-information`}
        textAlign="left"
        paddingX="5px"
      >
        <Typography sx={{ fontSize: "0.8rem", marginBottom: "5px" }}>
          Delivery to:
        </Typography>
        <Typography>
          {`${recipFirst} ${recipLast}`}
        </Typography>
        <Typography>
          {`${addressStr}`}
        </Typography>
      </Box>
      <Grid id={`${deliveryDate}-${name}-price`} container
        sx={{
          fontSize: "0.8rem",
          textAlign: "right",
          width: "60%"
        }}
      >
        <Grid xs={6}>
          <Typography>Item value:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>{`$${price}`}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>Delivery Fee:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>{`$${deliveryFee}`}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>Estimated Tax:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>{`$${tax}`}</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>Total:</Typography>
        </Grid>
        <Grid xs={6}>
          <Typography>{`$${total}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  )

}


export default function CartPreview() {

  // interesting note -- if you call "useTheme" in a parent component, MUI components in child components will not apply any theming unless specifically directed. Unless I'm missing something?
  const theme = useTheme();
  const { cart, getSortedOrder } = useCart() as CartContextType;

  const order = getSortedOrder();

  const { deliveryDates } = cart;

  // go thru delivery dates;
  const deliveryDivs = deliveryDates.map((date, i) => {

    const displayDay = getDayOfWeek(date);
    const displayDate = formatDate(date);

    const previewItems = order[i].map((item, j) => {

      if (item.deliveryDate === date) {

        return (
          <div key={`${date}-item-${j + 1}`}>
            <CartPreviewItem idx={j} cartItem={item}></CartPreviewItem>
          </div >
        );
      };
    })

    return (
      <Box key={`delivery-date-box-${i + 1}`} id={`delivery-date-box-${i + 1}`}
        display="flex"
        flexDirection="column"
        paddingBottom="10px"
      >
        <Box
          display="flex"
          paddingY="10px"
          paddingX="15px"
          sx={{
            background: theme.palette.info.main,
            color: "white"
          }}
          borderRadius="10px"
          marginY="10px"
        >
          <Typography>For Delivery On {`${displayDay} ${displayDate}`}:</Typography>
        </Box>
        {previewItems}
      </Box>
    )
  });




  return (
    <Box
      marginTop="15px"
      height="auto"
      display="flex"
      paddingX="5px"
      justifyContent="center"
    >
      <Typography
        fontFamily={theme.typography.fontFamily}
      >
        {deliveryDivs}
      </Typography>
    </Box>
  )
}
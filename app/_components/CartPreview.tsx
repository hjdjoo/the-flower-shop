
import Image from "next/image";

// import { useContext } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Box";
import { useTheme } from "@mui/material";

import { imageLoader } from "@/lib/imageLoader";

import { useCart, CartContextType } from "@/lib/contexts/CartContext";
import useBreakpoints from "@/utils/hooks/useBreakpoints";

import calculateTax from "@/utils/actions/calculateTax";
import formatDate from "@/utils/actions/formatDate";
import getDayOfWeek from "@/utils/actions/getDayOfWeek";

import type { OrderItem } from "../types/component-types/OrderFormData";



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
  idx: number,
  cartItem: OrderItem
}

const CartPreviewItem = (props: CartPreviewItemProps) => {

  const { name, imageUrl, recipFirst, recipLast, recipAddress, deliveryDate, prices, selectedTier, deliveryFee } = props.cartItem
  const { idx } = props;

  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const addressStr = Object.values(recipAddress).join(" ");

  const itemPrice = prices[selectedTier!]
  const itemTax = calculateTax(itemPrice)
  const deliveryTax = calculateTax(deliveryFee)

  const taxedItem = itemPrice + itemTax;
  const taxedDelivery = parseFloat(deliveryFee) + deliveryTax;

  const tax = (itemTax + deliveryTax).toFixed(2);

  const total = (taxedItem + taxedDelivery).toFixed(2);


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
        sx={{
          fontSize: () => {
            if (mobile) return "0.5rem"
            if (tablet) return "0.6rem"
            if (large) return "0.7rem"
            else return "0.8rem"
          },
        }}
      >
        <Typography sx={{
          fontSize: () => {
            if (mobile) return "0.6rem"
            if (tablet) return "0.7rem"
            if (large) return "0.8rem"
            else return "0.9rem"
          },
          marginBottom: "5px"
        }}>
          Delivery:
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
          fontSize: () => {
            if (mobile) return "0.5rem"
            if (tablet) return "0.6rem"
            if (large) return "0.7rem"
            else return "0.8rem"
          },
          textAlign: "right",
          width: "60%"
        }}
      >
        <Grid xs={8}>
          <Typography>Item Value:</Typography>
        </Grid>
        <Grid xs={4}>
          <Typography>{`$${(prices[selectedTier!]).toFixed(2)}`}</Typography>
        </Grid>
        <Grid xs={8}>
          <Typography>Del. Fee:</Typography>
        </Grid>
        <Grid xs={4}>
          <Typography>{`$${deliveryFee}`}</Typography>
        </Grid>
        <Grid xs={8}>
          <Typography>Est. Tax:</Typography>
        </Grid>
        <Grid xs={4}>
          <Typography>{`$${tax}`}</Typography>
        </Grid>
        <Grid xs={8}>
          <Typography>Total:</Typography>
        </Grid>
        <Grid xs={4}>
          <Typography>{`$${total}`}</Typography>
        </Grid>
      </Grid>
    </Box>
  )

}


export default function CartPreview() {

  // interesting note -- if you call "useTheme" in a parent component, MUI components in child components will not apply any theming unless specifically directed. Unless I'm missing something?
  const theme = useTheme();
  const { mobile, tablet, large, xlarge } = useBreakpoints();
  const { cart, getSortedOrder } = useCart() as CartContextType;

  const sortedOrder = getSortedOrder();

  const { deliveryDates } = cart;

  // go thru delivery dates;
  const deliveryDivs = sortedOrder.map((dateArr, dateIdx) => {

    const displayDay = getDayOfWeek(deliveryDates[dateIdx]);
    const displayDate = formatDate(deliveryDates[dateIdx]);

    const previewItems = dateArr.map((addressArr, addressIdx) => {

      // if (item.deliveryDate === date) {

      //   return (
      //     <div key={`${date}-item-${j + 1}`}>
      //       <CartPreviewItem idx={j} cartItem={item}></CartPreviewItem>
      //     </div >
      //   );
      // };
      return (
        <Box key={`preview-${dateIdx}-${addressIdx}`}>
          Preview
        </Box>
      )

    })

    return (
      <Box key={`delivery-date-box-${dateIdx + 1}`} id={`delivery-date-box-${dateIdx + 1}`}
        display="flex"
        flexDirection="column"
        paddingBottom="10px"
      >
        <Box
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
          }}
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
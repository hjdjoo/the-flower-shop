
import Image from "next/image";

import { useContext } from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Box";
import { useTheme } from "@mui/material";

import { imageLoader } from "@/lib/imageLoader";

import { useCart, CartContextType } from "@/lib/contexts/CartContext";

import { OrderItem } from "../types/component-types/OrderFormData";


/** Expected cart shape:
 * OrderItems[][];
 * 
 * Create a nested array "orderItems" representing the date idx and the address idx for each date to hold orderItem. OrderItem contains productId, price, etc.
 * [[orderItem], [orderItem2, orderItem3]]
 * orderItems[0][0] should refer to item to be delivered on the first-inputted date to the first address that was inputted.
 * in this case, orderItem3 refers to the 2nd item that was ordered to be delivered on a different date to a particular address.
 * 
 * Adding a delivery date would add a new index.
 * 
 * This should initialize a new kv pair for the addresses hash map
 * 
 * And the orderItem would be added to the array at [1][0].
 * 
 * 
 * Adding an order item that has the same delivery date and delivery address:
 * Finds idx of date;
 * uses date idx to check if address exists;
 * if so, add order to orderItems[dIdx][aIdx]
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

  const tax100 = Math.floor((parseFloat(price) + parseFloat(deliveryFee)) * .0625 * 100).toFixed(2)

  const tax = parseInt(tax100) / 100

  const total = (parseFloat(price) + parseFloat(deliveryFee) + tax).toString();

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

  const { deliveryDates, cartItems } = cart;

  const formatDate = (date: string): string => {
    // date: yyyy-mm-dd
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const day = new Date(date).getDay();

    const splitDate = date.split("-");
    // [yyyy, mm, dd]

    [splitDate[0], splitDate[1], splitDate[2]] = [splitDate[1], splitDate[2], splitDate[0]];
    // [mm, dd, yyyy]

    const normalDate = splitDate.join("/");
    // mm/dd/yyyy

    return `${days[day]} ${normalDate}`

  }

  const deliveryDivs = deliveryDates.map((date, i) => {

    const displayDate = formatDate(date);
    const previewItems = order[i].map((item, j) => {
      if (cartItems[i]?.deliveryDate === date) {
        return (
          <>
            <CartPreviewItem idx={j} cartItem={item}></CartPreviewItem>
          </>
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
          <Typography>For Delivery On {displayDate}:</Typography>
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
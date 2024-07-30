import Image from "next/image";
import { Cart, PriceInfo } from "@/app/types/component-types/OrderFormData";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { imageLoader } from "@/lib/imageLoader";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';

import { useCart } from "@/lib/contexts/CartContext";
import { CartContextType } from "@/lib/contexts/CartContext";

interface PriceSummaryProps {
  priceInfo: PriceInfo
}

export default function OrderSummary(props: PriceSummaryProps) {

  const { cartTotal, itemPrices } = props.priceInfo;

  const { cart } = useCart() as CartContextType
  const { cartItems } = cart;

  const CartItemSummaries = cartItems.map((item, idx) => {

    return (
      <Box key={`cart-item-summary-${idx + 1}`}
        sx={{
          my: 1,
          width: "100%",
          display: "flex",
        }}>
        <Box id={`${item.name}-summary-image-box`}
          sx={{
            position: "relative",
            width: "75px",
            height: "75px"
          }}>
          <Image id={`${item.name}-summary-preview-image`} src={item.imageUrl} loader={imageLoader} alt={`${item.name}-summary-privew-image`} fill style={{
            objectFit: "contain"
          }} />
        </Box>
        <Box id="order-valid-check"
          sx={{
            display: "flex",
            justifyContent: "space-around",
            px: "2rem",
          }}>
          <Grid container>
            <Grid id={`${item.productId}-recipient-name-check`}
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}>
              <Typography sx={{
                fontSize: "0.8rem"
              }}>
                Recipient Name:
              </Typography>
              {(item.recipFirst || item.recipLast) ? <CheckIcon /> : <ClearIcon />}
            </Grid>
            <Grid id={`${item.productId}-delivery-address-check`}
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}>
              <Typography sx={{
                fontSize: "0.8rem"
              }}>
                Recipient Address:
              </Typography>
              {(item.recipAddress.streetAddress1 && item.recipAddress.townCity && item.recipAddress.zip) ? <CheckIcon /> : <ClearIcon />}
            </Grid>
            <Grid id={`${item.productId}-recip-phone-check`}
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}>
              <Typography sx={{
                fontSize: "0.8rem"
              }}>
                Recipient Phone:
              </Typography>
              {(item.recipPhone) ? <CheckIcon /> : <ClearIcon />}
            </Grid>
            <Grid id={`${item.productId}-card-message-check`}
              xs={6}
              sx={{
                display: "flex",
                justifyContent: "flex-end"
              }}>
              <Typography sx={{
                fontSize: "0.8rem"
              }}>
                Card Message:
              </Typography>
              {(item.cardMessage) ? <CheckIcon /> : <ClearIcon />}
            </Grid>
          </Grid>
        </Box>
        <Box id={`${item.name}-pricing-summary-box`}
          sx={{
            display: "flex",
            flexDirection: "column",
          }}>
          <Grid container>
            <Grid
              xs={8}
              sx={{
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem",
              }}>Item Value</Typography>
            </Grid>
            <Grid
              xs={4}
              sx={{
                flexGrow: 1,
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem"
              }}>${itemPrices[idx].itemValue.toFixed(2)}</Typography>
            </Grid>
            <Grid
              xs={8}
              sx={{
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem",
              }}>Delivery Fee</Typography>
            </Grid>
            <Grid
              xs={4}
              sx={{
                flexGrow: 1,
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem"
              }}>${itemPrices[idx].deliveryFee.toFixed(2)}</Typography>
            </Grid>
            <Grid
              xs={8}
              sx={{
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem",
              }}>Tax</Typography>
            </Grid>
            <Grid
              xs={4}
              sx={{
                flexGrow: 1,
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem"
              }}>${itemPrices[idx].tax.toFixed(2)}</Typography>
            </Grid>
            <Grid
              xs={8}
              sx={{
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem",
              }}>Total</Typography>
            </Grid>
            <Grid
              xs={4}
              sx={{
                flexGrow: 1,
                textAlign: "right"
              }}>
              <Typography sx={{
                fontSize: "0.7rem"
              }}>${itemPrices[idx].total.toFixed(2)}</Typography>
            </Grid>

          </Grid>
        </Box>
      </Box>
    )

  })

  return (
    <Box id="order-summary-box"
      sx={{
        maxWidth: "90%",
      }}
    >
      <Typography>
        Order Summary:
      </Typography>
      {CartItemSummaries}
    </Box>
  )

}
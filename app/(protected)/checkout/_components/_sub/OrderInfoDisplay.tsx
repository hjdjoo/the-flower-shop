
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Report';
import CheckIcon from '@mui/icons-material/CheckCircle';

import PriceInfoDisplay from "./PriceInfoDisplay";

import { parsePhone } from "@/app/_components/RecipientInfo";

import { OrderItem, ItemPrices } from "@/app/types/component-types/OrderFormData";

interface OrderInfoDisplayProps {
  orderItem: OrderItem
  itemPrices: ItemPrices
  orderIdx: number
  dateIdx: number
}

export default function OrderInfoDisplay(props: OrderInfoDisplayProps) {

  const { orderItem, itemPrices, orderIdx, dateIdx } = props;

  const { name, recipFirst, recipLast, recipAddress, recipPhone, cardMessage } = orderItem;
  const { itemValue, deliveryFee, tax, total } = itemPrices;

  const CheckIconColored = styled(CheckIcon)(({ theme }) => ({
    color: theme.palette.primary.main
  }))
  const ErrorIconColored = styled(ErrorIcon)(({ theme }) => ({
    color: theme.palette.error.main
  }))


  const WarningIconColored = styled(WarningIcon)(({ theme }) => ({
    color: theme.palette.warning.main
  }))

  return (
    <Box id={`order-${dateIdx + 1}-${orderIdx + 1}-order-info-display-box`} sx={{
      display: "flex",
      width: "auto",
    }}>
      <Box id={`order-${dateIdx + 1}-${orderIdx + 1}-recipient-info-display-box`}>
        <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-recipient-info-grid`}
          container
          rowSpacing={1}
          sx={{
            mb: 2,
          }}>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-item-name`}
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "end"
            }}>
            <Typography>{name}:</Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-price`}
            xs={6}>
            <Typography sx={{
              pl: 2
            }}>${itemValue}</Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-name-confirm-icon`}
            xs={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}>
            {recipLast ? <CheckIconColored /> : <WarningIconColored />}
          </Grid>
          <Grid xs={4}
            sx={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem", }}>
              Name:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-name`}
            xs={6}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "center",
            }}>
            <Typography id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-name`}
              sx={{
                fontSize: "0.9rem",
              }}>
              {`${recipFirst} ${recipLast}`}
            </Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-address-confirm-icon`}
            xs={2}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "end",
            }}>
            {recipAddress.streetAddress1 && recipAddress.townCity && recipAddress.state ? <CheckIconColored /> : <ErrorIconColored />}
          </Grid>
          <Grid xs={4}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Address:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-address-grid`}
            xs={6}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "start",
            }}>
            <Box id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-address-box`}
            >
              <Typography sx={{
                fontSize: "0.9rem",
              }}>{recipAddress.streetAddress1}</Typography>
              <Typography sx={{
                fontSize: "0.9rem",
              }}>{recipAddress.streetAddress2}</Typography>
              <Box sx={{ display: "flex" }}>
                <Typography sx={{
                  fontSize: "0.9rem",
                }}>{recipAddress.townCity}</Typography>
                <Typography sx={{
                  fontSize: "0.9rem",
                  pl: 1
                }}>{recipAddress.state}</Typography>
              </Box>
              <Typography sx={{
                fontSize: "0.9rem",
              }}>{recipAddress.zip}</Typography>
            </Box>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-phone-confirm-icon`}
            xs={2}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}>
            {recipPhone ? <CheckIconColored /> : <ErrorIconColored />}
          </Grid>
          <Grid xs={4}
            sx={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem", }}>
              Phone:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-name`}
            xs={6}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "center",
            }}>
            <Typography id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-name`}
              sx={{
                fontSize: "0.9rem",
              }}>
              {`${parsePhone(recipPhone)}`}
            </Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-card-message-confirm-icon`}
            xs={2}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "end",
            }}>
            {cardMessage ? <CheckIconColored /> : <WarningIconColored />}
          </Grid>
          <Grid xs={4}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem", textAlign: "right" }}>
              Card Message:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-address-grid`}
            xs={6}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "start",
            }}>
            <Box id={`order-${dateIdx + 1}-${orderIdx + 1}-recip-address-box`}
            >
              <Typography sx={{
                fontSize: "0.9rem",
                whiteSpace: "pre"
              }}>
                {cardMessage}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box id={`order-${dateIdx + 1}-${orderIdx + 1}-price-info-display`} sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        <PriceInfoDisplay itemPrices={itemPrices} dateIdx={dateIdx} orderIdx={orderIdx} />
      </Box>
    </Box>
  )
}
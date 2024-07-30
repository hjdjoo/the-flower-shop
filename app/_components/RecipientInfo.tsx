import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
/***** custom components *****/
import { InputField } from "./styled/InputField";
/***** types *****/
import { OrderItem } from "../types/component-types/OrderFormData";
import { ChangeEvent } from "react";
import type { ChangeEventHandler } from "react";

interface RecipientInfoProps {
  orderItem: OrderItem
  handleOrderItem: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  handleAddress: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export const parsePhone = (phoneNumber: string): string | undefined => {
  // i: formatted phone
  // o: formatted phone
  // normalize phone number, then re-format.
  const normalized = phoneNumber.replace(/[(, )]|[-]|[\s]/g, "")
  const length = normalized.length;

  if (length < 4) {
    const areaCode = normalized.slice(0)
    return `${areaCode}`
  }
  if (length >= 4 && length < 7) {
    const areaCode = normalized.slice(0, 3)
    const firstThree = normalized.slice(3)
    return `(${areaCode}) ${firstThree}`
  }
  if (length >= 7 && length < 11) {
    const areaCode = normalized.slice(0, 3)
    const firstThree = normalized.slice(3, 6)
    const lastFour = normalized.slice(6)
    return `(${areaCode}) ${firstThree}-${lastFour}`
  }
  if (length >= 11) {
    const areaCode = normalized.slice(0, 3)
    const firstThree = normalized.slice(3, 6)
    const lastFour = normalized.slice(6, 10)
    return `(${areaCode}) ${firstThree}-${lastFour}`
  }
}

export default function RecipientInfo(props: RecipientInfoProps) {

  const { orderItem, handleOrderItem, handleAddress } = props;

  return (
    <Box id="recipient-address-form"
      marginBottom="15px"
    >
      <Typography
        sx={{
          fontSize: "1.1rem"
        }}
      >
        Recipient Information:
      </Typography>
      <Box id="recipient-name-box"
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}>
        <InputField id="recipient-first-name"
          name="recipFirst"
          label="First Name"
          onChange={handleOrderItem}
          value={orderItem.recipFirst}
          size="small"
          sx={{
            flexGrow: 1
          }}
        />
        <InputField
          id="recipient-last-name"
          name="recipLast"
          label="Last Name"
          onChange={handleOrderItem}
          value={orderItem.recipLast}
          size="small"
          sx={{
            flexGrow: 1
          }}
        />
      </Box>
      <Box id="recipient-address-box"
        display="flex"
        flexDirection="column"
      >
        <InputField
          id="recipient-street-1"
          name="streetAddress1"
          label="Street Address Line 1"
          onChange={handleAddress}
          value={orderItem.recipAddress.streetAddress1}
          size="small"
          sx={{
            flexGrow: 1
          }}
        />
        <InputField
          id="recipient-street-2"
          name="streetAddress2"
          label="Street Address Line 2"
          onChange={handleAddress}
          value={orderItem.recipAddress.streetAddress2}
          size="small"

          sx={{
            flexGrow: 1
          }}
        />
        <Box id="town-city-zip-box"
          display="flex"
        >
          <InputField
            id="recipient-town-city"
            name="townCity"
            label="Town/City"
            onChange={handleAddress}
            value={orderItem.recipAddress.townCity}
            size="small"
            sx={{
              flexGrow: 3
            }}
          />
          <InputField
            id="recipient-state"
            name="state"
            label="State"
            onChange={handleAddress}
            value={orderItem.recipAddress.state}
            size="small"
            sx={{ flexGrow: 1 }}
          />
          <InputField
            id="recipient-zip"
            name="zip"
            label="Zip Code"
            onChange={handleAddress}
            value={orderItem.recipAddress.zip}
            size="small"
            sx={{
              flexGrow: 1
            }}
          />
        </Box>
        <InputField
          id="recipient-phone"
          name="recipPhone"
          label="Phone Number"
          onChange={handleOrderItem}
          value={parsePhone(orderItem.recipPhone)}
          size="small"
        />
      </Box>
    </Box>
  )
}
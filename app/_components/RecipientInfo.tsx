import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
/***** custom components *****/
import { InputField } from "./styled/InputField";
/***** types *****/
import { OrderFormData } from "./types/OrderFormData";
import type { ChangeEventHandler } from "react";

interface RecipientInfoProps {
  formData: OrderFormData
  handleFormData: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export default function RecipientInfo(props: RecipientInfoProps) {

  const { formData, handleFormData } = props;

  const parsePhone = (phoneNumber: number): string => {

    const zip = phoneNumber.toString().slice(0, 2);

    return `(${zip})`

  }

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
          onChange={handleFormData}
          value={formData.recipFirst}
          size="small"
          sx={{
            flexGrow: 1
          }}
        />
        <InputField
          id="recipient-last-name"
          name="recipLast"
          label="Last Name"
          onChange={handleFormData}
          value={formData.recipLast}
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
          name="recipStreetAddress1"
          label="Street Address Line 1"
          onChange={handleFormData}
          value={formData.recipStreetAddress1}
          size="small"
          sx={{
            flexGrow: 1
          }}
        />
        <InputField
          id="recipient-street-2"
          name="recipStreetAddress2"
          label="Street Address Line 2"
          onChange={handleFormData}
          value={formData.recipStreetAddress2}
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
            name="recipTownCity"
            label="Town/City"
            onChange={handleFormData}
            value={formData.recipTownCity}
            size="small"
            sx={{
              flexGrow: 1
            }}
          />
          <InputField
            id="recipient-zip"
            name="recipZip"
            label="Zip Code"
            onChange={handleFormData}
            value={formData.recipZip}
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
          onChange={handleFormData}
          value={formData.recipPhone}
          size="small"
        />
      </Box>
    </Box>
  )
}
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
/***** custom components *****/
import { InputField } from "./styled/styledComponents";
/***** types *****/
import { OrderFormData } from "./types/OrderFormData";
import type { ChangeEventHandler } from "react";

interface RecipientInfoProps {
  formData: OrderFormData
  handleFormData: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export default function RecipientInfo(props: RecipientInfoProps) {

  const { formData, handleFormData } = props;


  return (
    <>
      <Typography
        sx={{
          fontSize: "1.2rem"
        }}
      >
        Recipient Information:
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}>
        <InputField
          id="recipient-first-name"
          name="recipFirst"
          label="First Name"
          onChange={handleFormData}
          value={formData.recipFirst}
          size="small"
          sx={{
            width: "48%"
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
            width: "48%"
          }}
        />
      </Box>
      <InputField
        id="recipient-street-1"
        name="recipStreetAddress1"
        label="Street Address Line 1"
        onChange={handleFormData}
        value={formData.recipStreetAddress1}
        size="small"
      />
      <InputField
        id="recipient-street-2"
        name="recipStreetAddress2"
        label="Street Address Line 2"
        onChange={handleFormData}
        value={formData.recipStreetAddress2}
        size="small"
      />
      <InputField
        id="recipient-town-city"
        name="recipTownCity"
        label="Town/City"
        onChange={handleFormData}
        value={formData.recipTownCity}
        size="small"
      />
      <InputField
        id="recipient-zip"
        name="recipZip"
        label="Zip Code"
        onChange={handleFormData}
        value={formData.recipZip}
        size="small"
      />
      <InputField
        id="recipient-phone"
        name="recipPhone"
        label="Phone Number"
        onChange={handleFormData}
        value={formData.recipPhone}
        size="small"
      />
    </>)
}
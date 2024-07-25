import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
/***** Custom Components *****/
import { InputField } from "./styled/InputField";
/***** types *****/
import { OrderFormData } from "../types/component-types/OrderFormData";
import type { ChangeEventHandler } from "react";

interface SenderInfoProps {
  formData: OrderFormData
  handleFormData: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export default function SenderInfo(props: SenderInfoProps) {

  const { formData, handleFormData } = props;

  return (
    <>
      <Typography
        sx={{
          fontSize: "1.5rem"
        }}
      >
        Sender Information:
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between"
        }}>
        <InputField
          id="sender-first-name"
          label="First Name"
          name="senderFirst"
          onChange={handleFormData}
          value={formData.senderFirst}
          size="small"
          sx={{
            width: "48%"
          }}
        />
        <InputField
          id="sender-last-name"
          label="Last Name"
          name="senderLast"
          onChange={handleFormData}
          value={formData.senderLast}
          size="small"
          sx={{
            width: "48%"
          }}
        />
      </Box>
      <InputField
        id="sender-phone"
        name="senderPhone"
        label="Phone Number"
        onChange={handleFormData}
        value={formData.senderPhone}
        size="small"
      />
      <InputField
        id="sender-email"
        name="senderEmail"
        label="Email (optional)"
        onChange={handleFormData}
        value={formData.senderEmail}
        size="small"
      />
    </>)
}
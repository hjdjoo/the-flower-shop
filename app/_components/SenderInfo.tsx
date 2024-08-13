import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Box from "@mui/material/Box";
/***** Custom Components *****/
import { InputField } from "./styled/InputField";

import { parsePhone } from "@/utils/actions/parsePhone";
/***** types *****/
import { OrderForm, SenderInfo as SenderInfoType } from "../types/component-types/OrderFormData";
import type { ChangeEventHandler } from "react";

interface SenderInfoProps {
  formData: SenderInfoType
  handleFormData: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export default function SenderInfo(props: SenderInfoProps) {

  const { formData, handleFormData } = props;

  return (
    <Grid id="sender-information-form-grid"
      container
      columnSpacing={2}
      rowSpacing={1}
    >
      <Grid xs={6}>
        <InputField
          id="sender-first-name"
          label="First Name"
          name="senderFirst"
          onChange={handleFormData}
          value={formData.senderFirst}
          size="small"
          sx={{
            width: "100%"
          }}
        />
      </Grid>
      <Grid xs={6}>
        <InputField
          id="sender-last-name"
          label="Last Name"
          name="senderLast"
          onChange={handleFormData}
          value={formData.senderLast}
          size="small"
          sx={{
            width: "100%"
          }}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <InputField
          id="sender-phone"
          name="senderPhone"
          label="Phone Number"
          onChange={(e) => {
            handleFormData(e)
          }}
          value={parsePhone(formData.senderPhone)}
          size="small"
          sx={{
            width: "100%"
          }}
        />
      </Grid>
      <Grid xs={12} md={6}>
        <InputField
          id="sender-email"
          name="senderEmail"
          label="Email (optional)"
          onChange={handleFormData}
          value={formData.senderEmail}
          size="small"
          sx={{
            width: "100%"
          }}
        />
      </Grid>
    </Grid>
  )
}
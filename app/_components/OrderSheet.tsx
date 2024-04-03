"use client"

import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"


export default function OrderSheet() {

  // Order Sheet may take in cart information?

  const InputField = styled(TextField, {
    name: "InputField",
  })(() => ({
    margin: "5px",
  })) as typeof TextField

  return (
    <Box
      component="form"
      sx={{
        // border: "1px dotted black",
        display: "flex",
        flexDirection: "column",
        width: "100%"
      }}
    >
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
          label="First Name"
          sx={{
            width: "48%"
          }}
        />
        <InputField
          label="Last Name"
          sx={{
            width: "48%"
          }}
        />
      </Box>
      <InputField
        label="Phone Number"
      />
      <InputField
        label="Email (optional)"
      />
      <Typography
        sx={{
          fontSize: "1.5rem"
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
          label="First Name"
          sx={{
            width: "48%"
          }}
        />
        <InputField
          label="Last Name"
          sx={{
            width: "48%"
          }}
        />
      </Box>
      <InputField
        label="Street Address Line 1"
      />
      <InputField
        label="Street Address Line 2"
      />
      <InputField
        label="Town/City"
      />
      <InputField
        label="Zip Code"
      />
      <InputField
        label="Phone Number"
      />
      <Typography
        sx={{
          fontSize: "1.5rem"
        }}>
        Message
      </Typography>
      <InputField
        multiline={true}
        label="Input Message"
        sx={{

        }}>
      </InputField>
      <Button
        variant="contained"
      >
        Proceed to Billing
      </Button>
    </Box>
  )
}
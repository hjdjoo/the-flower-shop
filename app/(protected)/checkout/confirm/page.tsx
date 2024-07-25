import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function PayConfirmPage() {

  return (
    <Box sx={{
      height: "500px",
      marginTop: "60px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <Typography>
        Thank you for your order!
      </Typography>
    </Box>
  )
}

// http://localhost:3000/payment/confirm?payment_intent=pi_3PgC8n02GTbaCA9R0EM3TFEg&payment_intent_client_secret=pi_3PgC8n02GTbaCA9R0EM3TFEg_secret_6Gx5OjNT7eQ25YYzdXWJqjDt2&redirect_status=succeeded
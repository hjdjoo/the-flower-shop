
import { Container } from "@mui/material";
import OrderSheet from "@/app/_components/OrderSheet";

export default function NewOrderPage() {

  return (
    <>
      <Container
        sx={{
          // border: "1px solid black",
          justifyContent: "center",
          alignItems: "center",
          marginY: "25px",
          paddingX: "0px"
        }}
      >
        <OrderSheet></OrderSheet>
      </Container>
    </>
  )
}
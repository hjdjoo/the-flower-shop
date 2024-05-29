import SenderInfo from "@/app/_components/SenderInfo";

import RecipientInfo from "@/app/_components/RecipientInfo";
import { useState, Dispatch, SetStateAction, MouseEvent, ChangeEvent } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/Button";
import Icon from "@mui/material/Icon";

import ShoppingCart from "@mui/icons-material/ShoppingCart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import { TextField } from "@/app/_components/styled/TextField";
import { ExpandMore } from "@/app/_components/styled/ExpandIcon"

import { OrderFormData } from "@/app/_components/types/OrderFormData";
import { ErrorMessage } from "@/app/types/client-types";

interface CustomerOrderFormProps {
  orderInfo: OrderFormData
  setOrderInfo: Dispatch<SetStateAction<OrderFormData>>
}

// this form should always take in the order form and its setter function as a prop.

export default function CustomerOrderForm(props: CustomerOrderFormProps) {

  const { orderInfo, setOrderInfo } = props;

  const orderFields = ["deliveryDate", "deliveryZip", "cardMessage"];

  const [activeField, setActiveField] = useState<string | undefined>()

  const [userAlert, setUserAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })

  // handle open/close for delivery fields
  const handleActiveField = (e: MouseEvent<HTMLButtonElement>) => {

    const fieldName = e.currentTarget.name;
    if (activeField === fieldName) setActiveField(undefined);
    else setActiveField(fieldName);

  }

  // handle order info update
  const handleOrderInfo = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderInfo({ ...orderInfo, [name]: value })
  }

  const verifyDeliveryDate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    console.log("verifying delivery date; input value: ", value);

    const today = Date.now();

    const deliveryDate = Date.parse(value);

    if (deliveryDate < today) {
      setUserAlert({
        severity: "error",
        message: "We can't go back in time!"
      })
    }

  }

  const verifyZip = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;


  }

  const checkMessageLength = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

  }

  return (
    <Box
      width="100%"
      marginTop="15px"
      display="flex"
      flexDirection="column"
    >
      <Box
        marginTop="15px"
        marginBottom="5px"
        paddingLeft="15px"
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: "lightgrey"
        }}
        aria-label="Select Delivery Date"
      >
        <Typography>Select Delivery Date</Typography>
        <ExpandMore
          expand={activeField === "deliveryDate"}
          name="deliveryDate"
          onClick={(e) => handleActiveField(e)}
          aria-label="Show delivery date input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Box
        width="100%"
        id="delivery-date-box"
      >
        <Collapse in={activeField === "deliveryDate"}>
          <Typography>{"When would you like them delivered?"}</Typography>
          <TextField
            id="delivery-date-input"
            type="date"
            name="deliveryDate"
            value={orderInfo.deliveryDate}
            onChange={(e) => {
              verifyDeliveryDate(e)
              handleOrderInfo(e)
            }}
            sx={{
              marginTop: "5px",
              marginBottom: "15px"
            }}
          // fullWidth
          />
        </Collapse>
      </Box>
      <Box
        marginBottom="5px"
        paddingLeft="15px"
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: "lightgrey"
        }}>
        <Typography>Delivery Zip</Typography>
        <ExpandMore
          expand={activeField === "deliveryZip"}
          name="deliveryZip"
          onClick={(e) => handleActiveField(e)}
          aria-label="Show delivery zip input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Box
        id="delivery-zip-box"
      >
        <Collapse in={activeField === "deliveryZip"}>
          <Typography>{"Where's this going?"}</Typography>
          <TextField
            id="delivery-zip-input"
            label="Enter Zip Code"
            name="recipZip"
            value={orderInfo.recipZip}
            onChange={(e) => {
              verifyZip(e);
              handleOrderInfo(e);
            }}
            sx={{
              marginTop: "5px",
              marginBottom: "15px"
            }}
          />
        </Collapse>
      </Box>
      <Box
        paddingLeft="15px"
        display="flex"
        alignItems={"center"}
        sx={{
          backgroundColor: "lightgrey"
        }}>
        <Typography>Card Message</Typography>
        <ExpandMore
          expand={activeField === "cardMessage"}
          name="cardMessage"
          onClick={(e) => handleActiveField(e)}
          aria-label="Show card message input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Box id="card-message-box">
        <Collapse in={activeField === "cardMessage"}>
          <Typography>{"What would you like to say?"}</Typography>
          <TextField
            id="card-message-input"
            sx={{
              marginBottom: "15px"
            }}
            name="cardMessage"
            value={orderInfo.cardMessage}
            onChange={(e) => {
              handleOrderInfo(e);
              checkMessageLength(e);
            }}
            fullWidth
            multiline
          />
        </Collapse>
      </Box>
    </Box>
  )

}

import SenderInfo from "@/app/_components/SenderInfo";

import RecipientInfo from "@/app/_components/RecipientInfo";
import { useState, useRef, Dispatch, SetStateAction, MouseEvent, ChangeEvent } from "react";

import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
// import IconButton from "@mui/material/Button";
// import Icon from "@mui/material/Icon";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import { TextField } from "@/app/_components/styled/TextField";
import { ExpandMore } from "@/app/_components/styled/ExpandIcon"

import { OrderFormData } from "@/app/_components/types/OrderFormData";
import { ErrorMessage } from "@/app/types/client-types";

import verifyDeliveryDate from "@/utils/actions/types/verifyDeliveryDate";

interface CustomerOrderFormProps {
  orderInfo: OrderFormData
  setOrderInfo: Dispatch<SetStateAction<OrderFormData>>
}

// this form should always take in the order form and its setter function as a prop.

export default function CustomerOrderForm(props: CustomerOrderFormProps) {

  const theme = useTheme();

  const { orderInfo, setOrderInfo } = props;

  // const orderFields = ["deliveryDate", "deliveryZip", "deliveryInstructions"];

  const activeRef = useRef(null);

  const [activeField, setActiveField] = useState<string | undefined>()

  const [deliveryDateAlert, setDeliveryDateAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })
  const [deliveryZipAlert, setDeliveryZipAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })
  const [deliveryInstructionsAlert, setDeliveryInstructionsAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: `${orderInfo.deliveryInstructions.length}/200`
  })

  /* Handler Functions */
  // handle open/close for delivery fields
  const handleActiveField = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {


    const currNode = e.currentTarget.lastChild as HTMLButtonElement
    console.log(currNode.name);
    const fieldName = currNode?.name;
    if (activeField === fieldName) setActiveField(undefined);
    else setActiveField(fieldName);

  }

  // handle order info update
  const handleOrderInfo = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderInfo({ ...orderInfo, [name]: value })
  }

  /* Other utility functions and handlers */
  // confirm that the delivery date is valid
  const checkDeliveryDate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    const validDate = verifyDeliveryDate(value)

    if (!validDate) {
      setDeliveryDateAlert({
        severity: "error",
        message: "We cannot halt the inexorable forward march of time!"
      })
    }
    else {
      setDeliveryDateAlert({
        severity: undefined,
        message: ""
      })
    }
  }
  // simple check with zip code regexp
  const verifyZip = async (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    const validZipRegExp = /^[0-9]{5}$/

    if (!value.match(validZipRegExp)) {
      setDeliveryZipAlert({
        severity: "error",
        message: "Please enter a valid ZIP"
      })
    }
    else setDeliveryZipAlert({
      severity: undefined,
      message: ""
    })
  }

  const checkInstructionLength = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length <= 200) {
      setDeliveryInstructionsAlert({
        severity: undefined,
        message: `${value.length}/200`
      })
    }
    else {
      setDeliveryInstructionsAlert({
        severity: "error",
        message: `${value.length}/200 - too long!`
      })
    }
  }

  const checkDeliveryArea = async () => {
    // Either: have a list of delivery zip codes in DB (not great)
    // Or: utilize Google Maps API to check that the driving distance and time are within a preset limit.
    // Either way -- if outside typical delivery zone, display message (maybe as a popup?) something like:
    // "Oops! It looks like this is outside of our typical delivery area. Please call the shop for further assistance: 201 445 4111"
  }

  return (
    <Box
      id="customer-order-form-box"
      width="100%"
      marginTop="15px"
      display="flex"
      flexDirection="column"
    >
      <Box id="delivery-date-toggle-box"
        marginTop="15px"
        marginBottom="5px"
        paddingLeft="15px"
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
            color: "black"
          }
        }}
        onClick={handleActiveField}
      >
        <Typography>Select Delivery Date</Typography>
        <ExpandMore
          expand={activeField === "deliveryDate"}
          name="deliveryDate"
          aria-label="Toggle delivery date input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Box id="delivery-date-box"
        width="100%"
      >
        <Collapse in={activeField === "deliveryDate"}>
          <Typography>{"When would you like them delivered?"}</Typography>
          <TextField
            id="delivery-date-input"
            type="date"
            name="deliveryDate"
            value={orderInfo.deliveryDate}
            error={!!deliveryDateAlert.severity}
            helperText={deliveryDateAlert.message}
            onChange={(e) => {
              checkDeliveryDate(e)
              handleOrderInfo(e)
            }}
            sx={{
              marginTop: "5px",
              marginBottom: "15px"
            }}
          />
        </Collapse>
      </Box>
      <Box id="delivery-zip-toggle-box"
        marginBottom="5px"
        paddingLeft="15px"
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: "lightgrey",
          "&:hover": {
            backgroundColor: "grey",
            color: "white"
          }
        }}
        onClick={handleActiveField}
      >
        <Typography>Delivery Zip</Typography>
        <ExpandMore
          expand={activeField === "deliveryZip"}
          name="deliveryZip"
          aria-label="Toggle delivery zip input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Box id="delivery-zip-box">
        <Collapse in={activeField === "deliveryZip"}>
          <Typography>{"Where's this going?"}</Typography>
          <Box
            display="flex"
            alignItems="center">
            <TextField
              id="delivery-zip-input"
              label="Enter Zip Code"
              name="recipZip"
              value={orderInfo.recipZip ? orderInfo.recipZip : ""}
              error={!!deliveryZipAlert.severity}
              helperText={deliveryZipAlert.message}
              onChange={(e) => {
                verifyZip(e);
                handleOrderInfo(e);
              }}
              sx={{
                marginTop: "5px",
                marginBottom: "15px"
              }}
            />
            <Button
              variant="outlined"
              sx={{
                marginX: "15px"
              }}
              onClick={checkDeliveryArea}
            >
              Check Zip
            </Button>
            <Box
              height="100%"
              display="flex"
              flexDirection="column"
            >
              <Typography>Estimated Delivery Fee:</Typography>
              <Typography>(Insert Fee Calculation Here)</Typography>
            </Box>
          </Box>
        </Collapse>
      </Box>
      <Box id="delivery-instructions-toggle-box"
        marginBottom="5px"
        paddingLeft="15px"
        display="flex"
        alignItems={"center"}
        sx={{
          backgroundColor: "lightgrey",
          "&:hover": {
            backgroundColor: "grey",
            color: "white"
          }
        }}
        onClick={handleActiveField}
      >
        <Typography>Delivery Instructions</Typography>
        <ExpandMore
          expand={activeField === "deliveryInstructions"}
          name="deliveryInstructions"
          aria-label="Toggle delivery instructions input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Box id="delivery-instructions-box">
        <Collapse in={activeField === "deliveryInstructions"}>
          <Typography>{"Any specific instructions?"}</Typography>
          <TextField
            id="card-message-input"
            name="deliveryInstructions"
            value={orderInfo.deliveryInstructions}
            error={!!deliveryInstructionsAlert.severity}
            helperText={deliveryInstructionsAlert.message}
            onChange={(e) => {
              handleOrderInfo(e);
              checkInstructionLength(e);
            }}
            fullWidth
            multiline
            sx={{
              marginTop: "5px",
              marginBottom: "15px"
            }}
          />
        </Collapse>
      </Box>
    </Box>
  )

}
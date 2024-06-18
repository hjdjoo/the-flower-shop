
import { useState, useEffect, useRef, Dispatch, SetStateAction, MouseEvent, ChangeEvent } from "react";

import { useMapsLibrary, APIProvider, APIProviderContext } from "@vis.gl/react-google-maps";

import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// import { TextField } from "@/app/_components/styled/TextField";
import RecipientInfo from "@/app/_components/RecipientInfo";
import ZipCheckerButton from "@/app/_components/ZipChecker";
import { ExpandMore } from "@/app/_components/styled/ExpandIcon"

import { OrderFormData } from "@/app/_components/types/OrderFormData";
import { ErrorMessage } from "@/app/types/client-types";

import verifyDeliveryDate from "@/utils/actions/types/verifyDeliveryDate";


interface CustomerOrderFormProps {
  orderInfo: OrderFormData
  setOrderInfo: Dispatch<SetStateAction<OrderFormData>>
  setReadyToSubmit: Dispatch<SetStateAction<boolean>>
}

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY

// this form should always take in the order form and its setter function as a prop.

export default function CustomerOrderForm(props: CustomerOrderFormProps) {

  const theme = useTheme();

  const { orderInfo, setOrderInfo, setReadyToSubmit } = props;

  /* Component states */
  const [activeField, setActiveField] = useState<string | undefined>()
  const [deliveryDateAlert, setDeliveryDateAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })
  const [deliveryZipAlert, setDeliveryZipAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })
  const [cardMessageAlert, setCardMessageAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: `${orderInfo.cardMessage.length}/200`
  })

  const [deliveryFee, setDeliveryFee] = useState<number>(8.95);


  /* Handler Functions */
  // handle open/close for delivery fields and highlights active field
  const handleActiveField = (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => {

    const currNode = e.currentTarget.lastChild as HTMLButtonElement
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
      setReadyToSubmit(false)
    } else {
      setDeliveryZipAlert({
        severity: undefined,
        message: ""
      })
      setReadyToSubmit(true)
    };
  }

  const checkMessageLength = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length > 250) {
      setCardMessageAlert({
        severity: "error",
        message: `${value.length}/250 - too long!`
      });
      setReadyToSubmit(false);
      return;
    }

    setCardMessageAlert({
      severity: undefined,
      message: `${value.length}/250`
    })
    setReadyToSubmit(true);

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
          backgroundColor: activeField === "deliveryDate" ? theme.palette.info.main : "lightgrey",
          color: activeField === "deliveryDate" ? "white" : "black",
          "&:hover": {
            backgroundColor: "grey",
            color: "white"
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
      <Box id="delivery-addr-toggle-box"
        marginBottom="5px"
        paddingLeft="15px"
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: activeField === "deliveryAddr" ? theme.palette.info.main : "lightgrey",
          color: activeField === "deliveryAddr" ? "white" : "black",
          "&:hover": {
            backgroundColor: "grey",
            color: "white"
          }
        }}
        onClick={handleActiveField}
      >
        <Typography>Delivery Address</Typography>
        <ExpandMore
          expand={activeField === "deliveryAddr"}
          name="deliveryAddr"
          aria-label="Toggle delivery zip input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <APIProvider apiKey={`${GOOGLE_API_KEY}`} onLoad={() => { console.log("Maps API loaded") }}>
        <Box id="delivery-add-box">
          <Collapse in={activeField === "deliveryAddr"}>
            <Typography>{"Where's this going?"}</Typography>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center">
              <TextField
                id="delivery-zip-input"
                label="Enter Zip Code"
                name="recipZip"
                value={orderInfo.recipZip ? orderInfo.recipZip : ""}
                error={deliveryZipAlert.severity === "error"}
                helperText={deliveryZipAlert.message}
                onChange={(e) => {
                  verifyZip(e);
                  handleOrderInfo(e);
                }}
                sx={{
                  flexGrow: 2,
                  marginTop: "5px",
                  marginBottom: "5px",
                }}
              />
              <ZipCheckerButton
                zipCode={orderInfo.recipZip}
                setDeliveryZipAlert={setDeliveryZipAlert}
                setDeliveryFee={setDeliveryFee}
                setReadyToSubmit={setReadyToSubmit}
              />
            </Box>
            <Box
              id="delivery-fee-display"
              display="flex"
              flexDirection="row"
              justifyContent="flex-end"
            >
              <Typography
                sx={{
                  margin: "10px"
                }}
              >{`Estimated Delivery Fee:`}
              </Typography>
              <Typography
                id="delivery-fee"
                sx={{
                  margin: "10px"
                }}
              >{deliveryZipAlert.severity === "success" &&
                `$${deliveryFee}`
                }
              </Typography>
            </Box>
            {deliveryZipAlert.severity === "success" &&
              <Box
                sx={{

                }}
              >
                <RecipientInfo formData={orderInfo} handleFormData={handleOrderInfo} />
              </Box>
            }
          </Collapse>
        </Box>
      </APIProvider>
      <Box id="card-message-toggle-box"
        marginBottom="5px"
        paddingLeft="15px"
        display="flex"
        alignItems={"center"}
        sx={{
          backgroundColor: activeField === "cardMessage" ? theme.palette.info.main : "lightgrey",
          color: activeField === "cardMessage" ? "white" : "black",
          "&:hover": {
            backgroundColor: "grey",
            color: "white"
          }
        }}
        onClick={handleActiveField}
      >
        <Typography>Card Message</Typography>
        <ExpandMore
          expand={activeField === "cardMessage"}
          name="cardMessage"
          aria-label="Toggle card message input"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Box>
      <Box id="card-message-box">
        <Collapse in={activeField === "cardMessage"}>
          <Typography>What would you like to say?</Typography>
          <TextField
            id="card-message-input"
            name="cardMessage"
            value={orderInfo.cardMessage}
            error={!!cardMessageAlert.severity}
            helperText={cardMessageAlert.message}
            onKeyDown={(k) => {
              if (cardMessageAlert.severity === "error" && k.code !== "Backspace") k.preventDefault();
            }}
            onChange={(e) => {
              handleOrderInfo(e);
              checkMessageLength(e);
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
    </Box >
  )

}
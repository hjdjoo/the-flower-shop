import { Dispatch, SetStateAction, useState, useRef, type ChangeEventHandler } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Alert from "@mui/material/Alert";
/***** custom components *****/
import { InputField } from "./styled/InputField";
import AddressModal from "./AddressModal";

/***** utilities *****/
import { parsePhone } from "@/utils/actions/parsePhone";

/***** types *****/
import { OrderItem, Address } from "../types/component-types/OrderFormData";
import { ErrorMessage } from "../types/client-types";

import validateAddress from "@/utils/google/validateAddress";

interface RecipientInfoProps {
  orderItem: OrderItem
  setOrderItem: Dispatch<SetStateAction<OrderItem>>
  handleOrderItem: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
  handleAddress: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>,
}

export default function RecipientInfo(props: RecipientInfoProps) {

  const { orderItem, setOrderItem, handleOrderItem, handleAddress } = props;

  const updatedAddress = useRef<Address>()

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [addressAlert, setAddressAlert] = useState<ErrorMessage>(
    {
      severity: undefined,
      message: ""
    });

  const checkAddress = async () => {
    try {
      const validatedAddress = await validateAddress(orderItem);
      updatedAddress.current = validatedAddress
      if (!validatedAddress || !validatedAddress.streetAddress1.length) {
        setAddressAlert({
          severity: "error",
          message: "Address validation returned nothing. Please check recipient details."
        })
      }
      else {
        setAddressAlert({
          severity: "success",
          message: "Address is valid!"
        })
      }
      setModalOpen(true);
    }
    catch (e) {
      setAddressAlert({
        severity: "error",
        message: "Address could not be validated. Please check recipient details."
      })
    };
  }


  return (
    <Box id="recipient-address-form"
      marginBottom="15px"
    >
      <Grid id="recipient-info-grid"
        container
        columnSpacing={1}
      >
        <Grid xs={6}>
          <InputField id="recipient-first-name"
            name="recipFirst"
            label="First Name"
            onChange={handleOrderItem}
            value={orderItem.recipFirst}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid>
        <Grid xs={6}>
          <InputField
            id="recipient-last-name"
            required
            name="recipLast"
            label="Last Name"
            onChange={handleOrderItem}
            value={orderItem.recipLast}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid>
        <Grid xs={12}
        >
          <InputField
            id="recipient-street-1"
            required
            name="streetAddress1"
            label="Street Address Line 1"
            onChange={handleAddress}
            value={orderItem.recipAddress.streetAddress1}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid>
        <Grid xs={12}>
          <InputField
            id="recipient-street-2"
            name="streetAddress2"
            label="Street Address Line 2"
            onChange={handleAddress}
            value={orderItem.recipAddress.streetAddress2}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid>
        <Grid xs={12}>
          <InputField
            id="recipient-town-city"
            required
            name="townCity"
            label="Town/City"
            onChange={handleAddress}
            value={orderItem.recipAddress.townCity}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid>
        <Grid xs={6}>
          <InputField
            id="recipient-state"
            required
            name="state"
            label="State"
            onChange={handleAddress}
            value={orderItem.recipAddress.state}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid>
        <Grid xs={6}>
          <InputField
            id="recipient-zip"
            required
            name="zip"
            label="Zip Code"
            onChange={handleAddress}
            value={orderItem.recipAddress.zip}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid>
        <Grid xs={12}>
          <InputField
            id="recipient-phone"
            required
            name="recipPhone"
            label="Phone Number"
            onChange={handleOrderItem}
            value={parsePhone(orderItem.recipPhone)}
            size="small"
            sx={{
              width: "100%"
            }}
          />
        </Grid >
      </Grid>
      <Box id={`orderItem-address-check-button-box`}
        sx={{
          flexGrow: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}>
        {
          updatedAddress.current &&
          <AddressModal orderItem={orderItem} setOrderItem={setOrderItem} modalOpen={modalOpen} setModalOpen={setModalOpen} newAddress={updatedAddress.current} />
        }
        {
          addressAlert.severity &&
          <Alert severity={addressAlert.severity}
            sx={{
              mt: 1,
              width: "90%"
            }}
            onClose={() => { setAddressAlert({ severity: undefined, message: "" }) }}>
            {addressAlert.message}
          </Alert>
        }
        <Button id={`orderItem-address-check-button`}
          onClick={checkAddress}
          sx={{
            border: "1px solid",
            borderColor: "primary.main",
            width: "90%",
            my: 2,
            '&:hover': {
              backgroundColor: "#dfe6df",
            }
          }}
        >
          Validate Address
        </Button>
      </Box>
    </Box >
  )
}
"use client"

import { useEffect, useState, ChangeEvent, DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_REACT_NODES } from "react";
import Image from 'next/image';

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DeleteIcon from '@mui/icons-material/DeleteForever';


import { useCart } from "@/lib/contexts/CartContext";
import { imageLoader } from "@/lib/imageLoader";
import useBreakpoints from "@/utils/hooks/useBreakpoints";

import { InputField } from "@/app/_components/styled/InputField";
import OrderInfoDisplay from "./_sub/OrderInfoDisplay";
import RecipientInfo from "@/app/_components/RecipientInfo";

import validateAddress from "@/utils/google/validateAddress";
import calculatePrices from "@/utils/actions/calculatePrices";

import { ErrorMessage } from "@/app/types/client-types";
import type { CartContextType } from "@/lib/contexts/CartContext";
import type { OrderItem, Address, ItemPrices } from "@/app/types/component-types/OrderFormData";


interface CartItem {
  orderItem: OrderItem,
  orderIdx: number,
  dateIdx: number
}

const CartItem = (props: CartItem) => {

  const { orderItem, orderIdx, dateIdx } = props;
  const { cart, updateCart, getSortedOrder } = useCart() as CartContextType;
  const order = getSortedOrder();
  const orderItemCopy = Object.assign({}, orderItem);
  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const [itemPrices, setItemPrices] = useState<ItemPrices>({
    itemValue: 0,
    tax: 0,
    total: 0
  });

  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [updatedItem, setUpdatedItem] = useState<OrderItem>(orderItemCopy);
  const [tier, setTier] = useState<number>(orderItem.selectedTier ? orderItem.selectedTier : 1);

  const [addressAlert, setAddressAlert] = useState<ErrorMessage>(
    {
      severity: undefined,
      message: ""
    });

  const [deliveryAlert, setDeliveryAlert] = useState<ErrorMessage>(
    {
      severity: undefined,
      message: ""
    });

  const [cardMessageAlert, setCardMessageAlert] = useState<ErrorMessage>(
    {
      severity: undefined,
      message: `${updatedItem.cardMessage.length}/250`
    });



  useEffect(() => {

    (async () => {
      try {
        const prices = await calculatePrices(updatedItem);
        setItemPrices(prices);
      }
      catch (e) {
        setDeliveryAlert({
          severity: "error",
          message: e as string
        })
      }
    })();

  }, [updatedItem])

  const handleOrderItem = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setUpdatedItem({ ...updatedItem, [name]: value });

  }

  const handleAddress = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const newItem = updatedItem;
    const updatedAddress = { ...updatedItem.recipAddress, [name]: value };
    newItem.recipAddress = updatedAddress;

    setUpdatedItem({ ...newItem });
  }

  const handleAddressCheck = async () => {
    try {
      const formattedAddress = await validateAddress(updatedItem);
      if (!formattedAddress) {
        setAddressAlert({
          severity: "error",
          message: "Address validation returned nothing. Please check recipient details."
        })
      };
      setUpdatedItem({ ...updatedItem, recipAddress: formattedAddress })
    }
    catch (e) {
      setAddressAlert({
        severity: "error",
        message: "Address could not be validated. Please check recipient details."
      })

    };
  }

  const checkMessageLength = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length > 250) {
      setCardMessageAlert({
        severity: "error",
        message: `${value.length}/250 - too long!`
      });
      // setSubmitStatus("incomplete");
      return;
    }
    setCardMessageAlert({
      severity: undefined,
      message: `${value.length}/250`
    })
  }

  const confirmChanges = async () => {
    if (toggleEdit) {
      let updateOrder = structuredClone(order);
      updateOrder[dateIdx][orderIdx] = updatedItem;
      // to update the cart, just flatten out the order into a 1-D array and use update method with new cart. Treat as basic state dispatch.
      const newCartItems = updateOrder.flat();
      updateCart({ ...cart, cartItems: newCartItems });
      setToggleEdit(false);
    }
    else {
      setToggleEdit(true);
    }
  };

  // Wrote this without testing... Should work but haven't hooked it up.
  const removeItem = () => {

    let updateOrder = structuredClone(order);
    // remove item from array;
    updateOrder[dateIdx].splice(orderIdx, 1);
    // flatten;
    const newCartItems = updateOrder.flat();

    updateCart({ ...cart, cartItems: newCartItems });

  };

  // Note about Container usage: MUI Docs recommends "Container" as a top-level element - basically something to quickly get elements centered on the page. It states that you can have nested containers, but "Box" is the typical component for regular div elements.
  return (
    <Box
      id={`orderItem-${dateIdx}-${dateIdx}-order-item`}
      sx={{
        display: 'flex',
        flexDirection: mobile || tablet ? "column" : "row",
        marginY: "25px"
      }}
    >
      <Box id={`orderItem-${dateIdx}-${dateIdx}-image-box`}
        sx={{
          position: "relative",
          flexGrow: 0,
          flexShrink: 0,
          minWidth: (mobile || tablet) ? "150px" : "200px",
          minHeight: (mobile) ? "250px" : "200px",
          mx: "2rem",
          my: "2rem",
        }}
      >
        <Image id={`orderItem-${dateIdx}-${dateIdx}-image`} alt={`${orderItem.name} image`} src={orderItem.imageUrl} loader={imageLoader} fill style={{ paddingBottom: 25, objectFit: "contain" }} />
      </Box>
      <Box id={`orderItem-${dateIdx}-${dateIdx}-info-box`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2.5,
        }}>
        {toggleEdit
          ?
          <Box id={`orderItem-${dateIdx}-${dateIdx}-edit-info-box`}
            sx={{
              mb: 3,
            }}>
            <FormControl>
              <Box id={`orderItem-${dateIdx}-${dateIdx}-price-wrapper`}
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  mb: 1
                }} >
                <Typography component="p" style={{ fontWeight: 500 }}>
                  {`${orderItem.name}`}
                </Typography>
                <Select
                  variant="standard"
                  sx={{ ml: 1 }}
                  value={tier.toString()}
                  onChange={(event: SelectChangeEvent<string>) => {
                    setTier(parseInt(event.target.value));
                    setTier(parseInt(event.target.value));
                  }}
                >
                  {orderItem.prices.map((price, idx) => (
                    <MenuItem key={`price-tier-${idx + 1}`}
                      value={idx}>
                      {`$${price}`}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <RecipientInfo orderItem={updatedItem} handleOrderItem={handleOrderItem} handleAddress={handleAddress} />
              <Box id={`orderItem-${dateIdx}-${dateIdx}-address-check-button-box`}
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Button id={`orderItem-${dateIdx}-${dateIdx}-address-check-button`}
                  onClick={handleAddressCheck}
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    width: "90%",
                    mb: 3,
                    '&:hover': {
                      backgroundColor: "#dfe6df",
                    }
                  }}
                >
                  Check Address
                </Button>
              </Box>
              <Box id={`orderItem-${dateIdx}-${dateIdx}-card-message-box`}
                sx={{
                  display: "flex",
                  width: "100%"
                }}>
                <InputField
                  id={`orderItem-${dateIdx}-${dateIdx}-card-message-input`}
                  name="cardMessage"
                  value={updatedItem.cardMessage}
                  error={cardMessageAlert.severity === "error"}
                  helperText={cardMessageAlert.message}
                  onKeyDown={(k) => {
                    if (cardMessageAlert.severity === ("error" || "warning") && k.code !== "Backspace") k.preventDefault();
                  }}
                  onChange={(e) => {
                    handleOrderItem(e);
                    checkMessageLength(e);
                  }}
                  fullWidth
                  multiline
                  sx={{
                    marginTop: "5px",
                    marginBottom: "15px"
                  }}
                />
              </Box>
            </FormControl>
          </Box>
          : <OrderInfoDisplay orderItem={updatedItem} itemPrices={itemPrices} orderIdx={orderIdx} dateIdx={dateIdx} />
        }
        {toggleEdit
          ? <Button id={`orderItem-${dateIdx}-${dateIdx}-confirm-changes-button`}
            onClick={() => confirmChanges()}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              width: "80%",
            }}
          >
            Confirm
          </Button>
          : <Button id={`orderItem-${dateIdx}-${dateIdx}-toggle-edit-button`}
            onClick={() => {
              toggleEdit ? setToggleEdit(false) : setToggleEdit(true);
            }}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              width: "80%",
            }}
          >
            Edit
          </Button>
        }
        <Button id={`orderItem-${dateIdx}-${dateIdx}-remove-from-cart-button`}
          onClick={removeItem}
          variant="outlined"
          color="error"
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "0.8rem",
            width: "80%",
            my: 2
          }}
        >
          <DeleteIcon /> Remove From Cart
        </Button>
      </Box>

    </Box>
  )
}

export default CartItem;
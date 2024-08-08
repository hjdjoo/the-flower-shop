"use client"

import React, { useEffect, useState, ChangeEvent, Suspense, Dispatch, SetStateAction, MutableRefObject } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import DeleteIcon from '@mui/icons-material/DeleteForever';


import { useCart } from "@/contexts/CartContext";
import { imageLoader } from "@/app/lib/imageLoader";
import useBreakpoints from "@/utils/hooks/useBreakpoints";

import { InputField } from "@/app/_components/styled/InputField";
import OrderInfoDisplay from "./_sub/OrderInfoDisplay";
import RecipientInfo from "@/app/_components/RecipientInfo";

import validateAddress from "@/utils/google/validateAddress";
import verifyDeliveryDate from "@/utils/actions/verifyDeliveryDate";
import calculateCart from "@/utils/actions/calculateCart";
import addressToString from "@/utils/actions/addressToString";


import { ErrorMessage } from "@/app/types/client-types";
import type { CartContextType } from "@/contexts/CartContext";
import type { OrderItem, Cart, Address, ItemPrices, OrderPrices, SortedOrder } from "@/app/types/component-types/OrderFormData";


interface CartItem {
  orderItem: OrderItem
  cart: Cart
  order: SortedOrder
  orderPrices: OrderPrices
  // sortedOrderPrices: OrderPrices[][]
  setCurrCart: Dispatch<SetStateAction<Cart | undefined>>
  setOrder: Dispatch<SetStateAction<SortedOrder>>
  setSortedOrderPrices: Dispatch<SetStateAction<OrderPrices[][]>>
  setCartTotal: Dispatch<SetStateAction<string>>
  setAddresses: Dispatch<SetStateAction<Address[]>>
  addressIdx: number
  dateIdx: number
  orderIdx: number
  // setDeliveryDates: Dispatch<SetStateAction<string[]>>,
}

const CartItem = ((props: CartItem) => {

  const router = useRouter();
  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const { cart, order: sortedOrder, orderItem, orderPrices, dateIdx, addressIdx, orderIdx, setCurrCart, setOrder, setCartTotal, setSortedOrderPrices, setAddresses } = props;
  // const { } = useCart() as CartContextType;

  const { updateAddressesAndDates, updateCart, getSortedOrder } = useCart() as CartContextType;

  // console.log("CartItem/cart: ", cart)
  // const sortedOrder = getSortedOrder();

  const orderItemCopy = Object.assign({}, orderItem);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [updatedItem, setUpdatedItem] = useState<OrderItem>(orderItemCopy);
  const [tier, setTier] = useState<number>(orderItem.selectedTier === 0 || orderItem.selectedTier ? orderItem.selectedTier : 0);
  // const [addressIdx, setAddressIdx] = useState<number>()
  const [newAddressIdx, setNewAddressIdx] = useState<number>(addressIdx)

  const [addressAlert, setAddressAlert] = useState<ErrorMessage>(
    {
      severity: undefined,
      message: ""
    });

  const [deliveryDateAlert, setDeliveryDateAlert] = useState<ErrorMessage>(
    {
      severity: undefined,
      message: ""
    });

  const [cardMessageAlert, setCardMessageAlert] = useState<ErrorMessage>(
    {
      severity: undefined,
      message: `${updatedItem.cardMessage.length}/250`
    });

  // useEffect(() => {

  // }, [cart])

  // Handler functions:
  const handleOrderItem = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
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

  const handleAddressSelect = (e: SelectChangeEvent<string>) => {

    const { value } = e.target;

    console.log("handleAddressSelect/value: ", value);
    const newItem = updatedItem;
    const updatedAddress = cart.addresses[parseInt(value)];

    console.log("updatedAddress: ", updatedAddress);
    newItem.recipAddress = updatedAddress;
    setUpdatedItem({ ...newItem });


  }

  const confirmChanges = async () => {
    if (isEditing) {

      let updatedOrder = structuredClone(sortedOrder);
      console.log("confirmChanges/updatedItem: ", updatedItem)
      updatedOrder[dateIdx][addressIdx][orderIdx] = updatedItem;
      // to update the cart, just flatten out the order into a 1-D array and use update method with new cart. Treat as basic state dispatch.
      const newCartItems = updatedOrder.flat(2);
      const newCart = updateAddressesAndDates({ ...cart, cartItems: newCartItems });

      updateCart(newCart);
      const newSortedOrder = getSortedOrder();

      const newOrderPrices = await calculateCart(newSortedOrder);

      await checkAddress();
      setCurrCart(newCart);
      setOrder(newSortedOrder);
      setSortedOrderPrices(newOrderPrices.orderPrices);
      setCartTotal(newOrderPrices.cartTotal.toFixed(2));
      setAddresses(newCart.addresses);
      setIsEditing(false);
    }
    else {
      setIsEditing(true);
    }
  };

  const removeItem = () => {

    let updateOrder = structuredClone(sortedOrder);
    updateOrder[dateIdx][addressIdx].splice(orderIdx, 1);
    const newCartItems = updateOrder.flat(2);
    // console.log(newCartItems);

    const newCart = updateAddressesAndDates({ ...cart, cartItems: newCartItems });

    setCurrCart(newCart);
    updateCart(newCart);

  };

  // Helper functions
  const checkDeliveryDate = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    const { valid, message } = verifyDeliveryDate(value)

    if (!valid) {
      setDeliveryDateAlert({
        severity: "error",
        message: `${message}`
      })
    }
    else {
      setDeliveryDateAlert({
        severity: undefined,
        message: ""
      })
    }
  }


  const checkAddress = async () => {
    try {
      const formattedAddress = await validateAddress(updatedItem);
      if (!formattedAddress || !formattedAddress.streetAddress1.length) {
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

  // Note about Container usage: MUI Docs recommends "Container" as a top-level element - basically something to quickly get elements centered on the page. It states that you can have nested containers, but "Box" is the typical component for regular div elements.
  return (
    <Box
      id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-order-item`}
      sx={{
        display: 'flex',
        flexDirection: mobile || tablet ? "column" : "row",
        marginY: "25px",
        borderBottom: (orderIdx < sortedOrder[dateIdx][addressIdx].length) ? "1px lightgray solid" : "none"
      }}
    >
      <Box id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-image-box`}
        sx={{
          position: "relative",
          flexGrow: 0,
          flexShrink: 0,
          minWidth: (mobile || tablet) ? "150px" : "200px",
          minHeight: (mobile || tablet) ? "250px" : "200px",
          mx: "2rem",
          my: "2rem",
        }}
      >
        <Image id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-image`} alt={`${orderItem.name} image`} src={orderItem.imageUrl} loader={imageLoader} fill style={{ paddingBottom: 25, objectFit: "contain" }} />
      </Box>
      <Box id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-info-container`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2.5,
        }}>
        <Box id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-info-box`}
          sx={{
            display: "flex",
            flexDirection: "column"
          }}>
          {isEditing
            ?
            <Suspense >
              <Box id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-edit-info-box`}
                sx={{
                  mb: 3,
                }}>

                <Typography component="p" style={{ fontWeight: 500 }}>
                  {`${orderItem.name}`}
                </Typography>
                <Grid id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-price-wrapper`}
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    mb: 1
                  }} >
                  <Grid xs={6} md={3}>
                    <Typography
                      sx={{
                        fontSize: "0.8rem"
                      }}>
                      Change Price Tier:
                    </Typography>
                  </Grid>
                  <Grid xs={6} md={3}>
                    <Select
                      variant="standard"
                      sx={{ ml: 1 }}
                      name="selectedTier"
                      value={tier.toString()}
                      onChange={(event) => {
                        setTier(parseInt(event.target.value));
                        handleOrderItem(event)
                      }}
                    >
                      {orderItem.prices.map((price, idx) => (
                        <MenuItem key={`price-tier-${idx + 1}`}
                          value={idx}>
                          {`$${price}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                  <Grid xs={6} md={3}>
                    <Typography
                      sx={{
                        fontSize: "0.8rem"
                      }}>
                      Change Delivery Date:
                    </Typography>
                  </Grid>
                  <Grid xs={6} md={3}>
                    <InputField
                      id="delivery-date-input"
                      type="date"
                      name="deliveryDate"
                      value={updatedItem.deliveryDate}
                      error={!!deliveryDateAlert.severity}
                      helperText={deliveryDateAlert.message}
                      onChange={(e) => {
                        checkDeliveryDate(e);
                        handleOrderItem(e);
                      }}
                      sx={{
                        marginTop: "15px",
                        marginBottom: "15px",
                        width: "95%",
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-price-wrapper`}
                  container
                  sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    mb: 1
                  }} >
                  <Grid xs={6} md={3}>
                    <Typography
                      sx={{
                        fontSize: "0.8rem"
                      }}>
                      Select from an existing delivery address:
                    </Typography>
                  </Grid>
                  <Grid xs={6} md={3}>
                    <Select
                      variant="standard"
                      value={newAddressIdx.toString()}
                      onChange={(event) => {
                        setNewAddressIdx(parseInt(event.target.value));
                        handleAddressSelect(event);
                      }}
                      sx={{
                        ml: 1,
                        maxWidth: "100%",
                      }}>
                      {cart.addresses.map((address, idx) => {

                        const addressStr = addressToString(address);

                        return (
                          <MenuItem key={`delivery-${dateIdx + 1}-select-option-${idx + 1}`}
                            value={idx}
                          >
                            <Box id={`delivery-${dateIdx + 1}-select-option-${idx + 1}`} sx={{
                              overflow: "hidden",
                              fontSize: "0.7rem",
                              textOverflow: "ellipsis"
                            }}>
                              {addressStr}
                            </Box>
                          </MenuItem>
                        )
                      })}
                    </Select>
                  </Grid>
                </Grid>
                <RecipientInfo orderItem={updatedItem} handleOrderItem={handleOrderItem} handleAddress={handleAddress} />
                <Box id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-address-check-button-box`}
                  sx={{
                    flexGrow: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <Button id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-address-check-button`}
                    onClick={checkAddress}
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
                    Verify Address
                  </Button>
                </Box>
                <Box id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-card-message-box`}
                  sx={{
                    display: "flex",
                    width: "100%"
                  }}>
                  <InputField
                    id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-card-message-input`}
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
                <Box id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-confirm-changes-button-box`}
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center"
                  }}>
                  <Button id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-confirm-changes-button`}
                    onClick={() => confirmChanges()}
                    sx={{
                      border: "1px solid",
                      borderColor: "primary.main",
                      width: "90%",
                    }}
                  >
                    Confirm Changes
                  </Button>
                </Box>

              </Box>
            </Suspense>
            : <OrderInfoDisplay orderItem={updatedItem} orderPrices={orderPrices} dateIdx={dateIdx} addressIdx={addressIdx} orderIdx={orderIdx} alerts={{ addressAlert: addressAlert, deliveryDateAlert: deliveryDateAlert, cardMessageAlert: cardMessageAlert, }} />
          }
          <Box id={`item-edit-buttons-box-${dateIdx + 1}`} sx={{
            alignSelf: "center",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <Button id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-toggle-edit-button`}
              onClick={() => {
                isEditing ? setIsEditing(false) : setIsEditing(true);
              }}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                width: "80%",
              }}
            >
              Edit
            </Button>
            <Button id={`orderItem-${dateIdx}-${addressIdx}-${orderIdx}-remove-from-cart-button`}
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
              <DeleteIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
})

export default CartItem;
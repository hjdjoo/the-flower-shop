"use client"

import { useEffect, useState, ChangeEvent } from "react";
import Image from 'next/image';

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Report';
import CheckIcon from '@mui/icons-material/CheckCircle';

import { InputField } from "@/app/_components/styled/InputField";

import { useCart } from "@/lib/contexts/CartContext";
import { imageLoader } from "@/lib/imageLoader";
import useBreakpoints from "@/utils/hooks/useBreakpoints";

import { parsePhone } from "@/app/_components/RecipientInfo";

import RecipientInfo from "@/app/_components/RecipientInfo";
import { OrderItemForm, address, FullOrderForm } from "@/app/_components/lib/OrderForm";

import calculatePrices from "@/utils/actions/calculatePrices";

import type { CartContextType } from "@/lib/contexts/CartContext";
import type { OrderItem, Address, ItemPrices } from "@/app/types/component-types/OrderFormData";
import { styled } from "@mui/material";

interface CartItem {
  orderItem: OrderItem,
  orderIndex: number,
  dateIndex: number
}

const CartItem = (props: CartItem) => {

  const { orderItem, orderIndex, dateIndex } = props;
  const { cart, updateCart, getSortedOrder } = useCart() as CartContextType;
  const order = getSortedOrder();
  const orderItemCopy = Object.assign({}, orderItem);
  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const [itemPrices, setItemPrices] = useState<ItemPrices>({
    itemValue: 0,
    deliveryFee: 0,
    tax: 0,
    total: 0
  })

  const CheckIconColored = styled(CheckIcon)(({ theme }) => ({
    color: theme.palette.primary.main
  }))
  const ErrorIconColored = styled(ErrorIcon)(({ theme }) => ({
    color: theme.palette.error.main
  }))
  const WarningIconColored = styled(WarningIcon)(({ theme }) => ({
    color: theme.palette.warning.main
  }))

  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [updatedItem, setUpdatedItem] = useState<OrderItem>(orderItemCopy);
  const [tier, setTier] = useState<number>(orderItem.selectedTier ? orderItem.selectedTier : 1)
  const [cardMessage, setCardMessage] = useState<string>(orderItem.cardMessage);


  useEffect(() => {

    (async () => {
      const prices = await calculatePrices(updatedItem);
      setItemPrices(prices);
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

  const validateAddress = async () => {
    const { streetAddress1, streetAddress2, townCity, state, zip } = updatedItem.recipAddress;
    const formatApt = streetAddress2.replace(/^[^0-9]*/g, '');
    fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            addressLines: [streetAddress1, formatApt, townCity, state, zip]
          }
        })
      })
      .then(data => data.json())
      .then(res => {
        let newStreetAddress1 = "";
        let newStreetAddress2 = "";
        if (res.result.address.addressComponents.length > 7) {
          newStreetAddress1 = res.result.address.postalAddress.addressLines[0].replace(/\s[^\s]*$/, '');
          newStreetAddress2 = res.result.address.addressComponents[2].componentName.text
        } else {
          newStreetAddress1 = res.result.address.postalAddress.addressLines[0];
        }
        const formattedAddress = {
          streetAddress1: newStreetAddress1,
          streetAddress2: newStreetAddress2,
          townCity: res.result.address.postalAddress.locality,
          state: res.result.address.postalAddress.administrativeArea,
          zip: res.result.address.postalAddress.postalCode,
        }
        setUpdatedItem({ ...updatedItem, recipAddress: formattedAddress })
        console.log('Valid Address');
      })
      .catch(err => console.log('Error validating new address: ', err))
  }

  // const compareAddress = (newAddress: Address, currAddress: Address) => {
  //   if (newAddress.streetAddress1 == currAddress.streetAddress1 &&
  //     newAddress.streetAddress2 == currAddress.streetAddress2 &&
  //     newAddress.townCity == currAddress.townCity &&
  //     newAddress.state == currAddress.state &&
  //     newAddress.zip == currAddress.zip
  //   ) return true;
  //   else return false;
  // }

  const confirmChanges = async () => {
    if (toggleEdit) {

      let updateOrder = structuredClone(order);
      updateOrder[dateIndex][orderIndex] = updatedItem;
      // to update the cart, just flatten out the order into a 1-D array and use generic set.
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
    updateOrder[dateIndex].splice(orderIndex, 1);
    // flatten;
    const newCartItems = updateOrder.flat();

    updateCart({ ...cart, cartItems: newCartItems });

  };

  // Big subcomponent for displaying order info neatly.
  // Could move this into another component altogether, but not sure if it is going to be that reusable.
  const OrderInfoDisplay = () => {

    const { name, recipFirst, recipLast, recipAddress, recipPhone, cardMessage } = updatedItem;
    const { itemValue, deliveryFee, tax, total } = itemPrices;

    return (
      <Box id={`order-${dateIndex + 1}-${orderIndex + 1}-product-info-display-box`} sx={{
        display: "flex"
      }}>
        <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-info-display`}
          container
          rowSpacing={1}
          sx={{
            mb: 2,
            ml: 4,
          }}>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-item-name`}
            xs={3} sm={4} md={2}
            sx={{
              display: "flex",
              justifyContent: "end"
            }}>
            <Typography>{name}:</Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-price`}
            xs={9} sm={8} md={10}>
            <Typography sx={{
              pl: 2
            }}>${itemValue}</Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-name-confirm-icon`}
            xs={1}
            sx={{
              display: "flex",
              alignItems: "center"
            }}>
            {recipLast ? <CheckIconColored /> : <WarningIconColored />}
          </Grid>
          <Grid xs={2} sm={3} md={1}
            sx={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem", }}>
              Name:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-name`}
            xs={9} sm={8} md={10}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "center",
            }}>
            <Typography id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-name`}
              sx={{
                fontSize: "0.9rem",
              }}>
              {`${recipFirst} ${recipLast}`}
            </Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-address-confirm-icon`}
            xs={1}
            sx={{
              display: "flex",
              alignItems: "start",
            }}>
            {recipAddress.streetAddress1 && recipAddress.townCity && recipAddress.state ? <CheckIconColored /> : <ErrorIconColored />}
          </Grid>
          <Grid xs={2} sm={3} md={1}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem" }}>
              Address:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-address-grid`}
            xs={9} sm={8} md={10}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "start",
            }}>
            <Box id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-address-box`}
            >
              <Typography sx={{
                fontSize: "0.9rem",
              }}>{recipAddress.streetAddress1}</Typography>
              <Typography sx={{
                fontSize: "0.9rem",
              }}>{recipAddress.streetAddress2}</Typography>
              <Box sx={{ display: "flex" }}>
                <Typography sx={{
                  fontSize: "0.9rem",
                }}>{recipAddress.townCity}</Typography>
                <Typography sx={{
                  fontSize: "0.9rem",
                  pl: 1
                }}>{recipAddress.state}</Typography>
              </Box>
              <Typography sx={{
                fontSize: "0.9rem",
              }}>{recipAddress.zip}</Typography>
            </Box>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-phone-confirm-icon`}
            xs={1}
            sx={{
              display: "flex",
              alignItems: "center"
            }}>
            {recipPhone ? <CheckIconColored /> : <ErrorIconColored />}
          </Grid>
          <Grid xs={2} sm={3} md={1}
            sx={{
              textAlign: "right",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem", }}>
              Phone:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-name`}
            xs={9} sm={8} md={10}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "center",
            }}>
            <Typography id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-name`}
              sx={{
                fontSize: "0.9rem",
              }}>
              {`${parsePhone(recipPhone)}`}
            </Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-card-message-confirm-icon`}
            xs={1}
            sx={{
              display: "flex",
              alignItems: "start",
            }}>
            {cardMessage ? <CheckIconColored /> : <WarningIconColored />}
          </Grid>
          <Grid xs={2} sm={3} md={1}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "end",
            }}>
            <Typography sx={{ fontSize: "0.9rem", textAlign: "right" }}>
              Card Message:
            </Typography>
          </Grid>
          <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-address-grid`}
            xs={9} sm={8} md={10}
            sx={{
              pl: 2,
              display: "flex",
              alignItems: "start",
            }}>
            <Box id={`order-${dateIndex + 1}-${orderIndex + 1}-recip-address-box`}
            >
              <Typography sx={{
                fontSize: "0.9rem",
                whiteSpace: "pre"
              }}>
                {cardMessage}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box id={`order-${dateIndex + 1}-${orderIndex + 1}-price-info-display`} sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          <Grid container
            rowSpacing={2}
            sx={{
              mb: 3,
              mr: 3
            }}>
            <Grid xs={8}>
              <Typography sx={{
                fontSize: "0.9rem",
                textAlign: "right",
                pr: 1
              }}>
                Item:
              </Typography>
            </Grid>
            <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-item-value`}
              xs={4}>
              <Typography sx={{
                fontSize: "0.9rem",
                textAlign: "right"
              }}>
                ${itemValue}
              </Typography>
            </Grid>
            <Grid xs={8}>
              <Typography sx={{
                fontSize: "0.9rem",
                textAlign: "right",
                pr: 1
              }}>
                Del. Fee
              </Typography>
            </Grid>
            <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-delivery-fee`}
              xs={4}>
              <Typography sx={{
                fontSize: "0.9rem",
                textAlign: "right"
              }}>
                ${deliveryFee}
              </Typography>
            </Grid>
            <Grid xs={8}>
              <Typography sx={{
                fontSize: "0.9rem",
                textAlign: "right",
                pr: 1
              }}>
                Tax:
              </Typography>
            </Grid>
            <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-tax`}
              xs={4}>
              <Typography sx={{
                fontSize: "0.9rem",
                textAlign: "right"
              }}>
                ${tax}
              </Typography>
            </Grid>
            <Grid xs={8}>
              <Typography sx={{
                fontSize: "0.9rem",
                fontWeight: 900,
                textAlign: "right",
                pr: 1
              }}>
                Total:
              </Typography>
            </Grid>
            <Grid id={`order-${dateIndex + 1}-${orderIndex + 1}-total`}
              xs={4}>
              <Typography sx={{
                fontSize: "0.9rem",
                fontStyle: "bold",
                fontWeight: 900,
                textAlign: "right"
              }}>
                ${total}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }

  // Note about Container usage: MUI Docs recommends "Container" as a top-level element - basically something to quickly get elements centered on the page. It states that you can have nested containers, but "Box" is the typical component for regular div elements.
  return (
    <Box
      id={`orderItem-${orderItem.productId}-order-item`}
      sx={{
        display: 'flex',
        flexDirection: mobile ? "column" : "row",
        marginY: "25px"
      }}
    >
      <Box id={`orderItem-${orderItem.productId}-image-box`}
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
        <Image id={`orderItem-${orderItem.productId}-image`} alt={`${orderItem.name} image`} src={orderItem.imageUrl} loader={imageLoader} fill style={{ paddingBottom: 25, objectFit: "contain" }} />
      </Box>
      <Box id={`orderItem-${orderItem.productId}-info-box`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2.5,
        }}>
        {toggleEdit
          ?
          <Box id={`orderItem-${orderItem.productId}-edit-info-box`}
            sx={{
              mb: 3,
            }}>
            <FormControl>
              <Box id={`orderItem-${orderItem.productId}-price-wrapper`}
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
              <Box id={`orderItem-${orderItem.productId}-address-check-button-box`}
                sx={{
                  flexGrow: 1,
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Button id={`orderItem-${orderItem.productId}-address-check-button`}
                  onClick={() => validateAddress()}
                  sx={{
                    border: "1px solid",
                    borderColor: "primary.main",
                    width: "90%",
                    my: 3,
                    '&:hover': {
                      backgroundColor: "#dfe6df",
                    }
                  }}
                >
                  Check Address
                </Button>
                <Box id={`orderItem-${orderItem.productId}-card-message-box`}
                  sx={{
                    display: "flex",
                    width: "100%"
                  }}>
                  <InputField
                    id={`orderItem-${orderItem.productId}-card-message`}
                    name="cardMessage"
                    label="Card Message"
                    multiline
                    sx={{
                      width: "100%"
                    }}
                    value={updatedItem.cardMessage ? updatedItem.cardMessage : ""}
                    onChange={handleOrderItem}
                  />
                </Box>
              </Box>
            </FormControl>
          </Box>
          : <OrderInfoDisplay />
        }
        {toggleEdit
          ? <Button
            onClick={() => confirmChanges()}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              width: "80%",
            }}
          >
            Confirm
          </Button>
          : <Button
            onClick={() => {
              toggleEdit ? setToggleEdit(false) : setToggleEdit(true);
            }}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              width: "80%",
              ml: 3
            }}
          >
            Edit
          </Button>
        }
      </Box>

    </Box>
  )
}

export default CartItem;
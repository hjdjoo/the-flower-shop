"use client"

import { useState } from "react";
import Image from 'next/image';

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { InputField } from "@/app/_components/styled/InputField";

import { useCart } from "@/lib/contexts/CartContext";
import { imageLoader } from "@/lib/imageLoader";
import useBreakpoints from "@/utils/hooks/useBreakpoints";

import { OrderItemForm, address, FullOrderForm } from "@/app/_components/lib/OrderForm";

import type { CartContextType } from "@/lib/contexts/CartContext";
import type { OrderItem, Address } from "@/app/types/component-types/OrderFormData";

interface CartItem {
  product: OrderItem,
  orderIndex: number,
  dateIndex: number
}

const CartItem = (props: CartItem) => {

  const { product, orderIndex, dateIndex } = props;

  const { cart, updateCart, getSortedOrder } = useCart() as CartContextType;
  const order = getSortedOrder();

  const { mobile, tablet, large, xlarge } = useBreakpoints();

  const [toggleEdit, setToggleEdit] = useState<boolean>(false);

  // const [price, setPrice] = useState<string>(product.price);
  const [tier, setTier] = useState<number>(product.selectedTier ? product.selectedTier : 1)
  const [recipFirst, setRecipFirst] = useState<string>(product.recipFirst);
  const [recipLast, setRecipLast] = useState<string>(product.recipLast);
  const [recipPhone, setRecipPhone] = useState<string>(product.recipPhone);
  const [cardMessage, setCardMessage] = useState<string>(product.cardMessage);

  const [changeAdddress, setChangeAddress] = useState<boolean>(false);
  const [streetAddress1, setStreetAddress1] = useState<string>(product.recipAddress.streetAddress1);
  const [streetAddress2, setStreetAddress2] = useState<string>(product.recipAddress.streetAddress2);
  const [townCity, setTownCity] = useState<string>(product.recipAddress.townCity);
  const [state, setState] = useState<string>(product.recipAddress.state);
  const [zip, setZip] = useState<string>(product.recipAddress.zip);


  const validateAddress = async () => {
    let formatApt = streetAddress2.replace(/^[^0-9]*/g, '');
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
        if (res.result.address.addressComponents.length > 7) {
          setStreetAddress1(res.result.address.postalAddress.addressLines[0].replace(/\s[^\s]*$/, ''));
          setStreetAddress2(res.result.address.addressComponents[2].componentName.text);
        } else {
          setStreetAddress1(res.result.address.postalAddress.addressLines[0]);
        }
        setTownCity(res.result.address.postalAddress.locality);
        setState(res.result.address.postalAddress.administrativeArea);
        setZip(res.result.address.postalAddress.postalCode);
        console.log('Valid Address');
      })
      .catch(err => console.log('Error validating new address: ', err))
  }

  const compareAddress = (newAddress: Address, currAddress: Address) => {
    if (newAddress.streetAddress1 == currAddress.streetAddress1 &&
      newAddress.streetAddress2 == currAddress.streetAddress2 &&
      newAddress.townCity == currAddress.townCity &&
      newAddress.state == currAddress.state &&
      newAddress.zip == currAddress.zip
    ) return true;
    else return false;
  }

  const confirmChanges = async () => {
    if (toggleEdit) {

      let updateOrder = structuredClone(order);
      updateOrder[dateIndex][orderIndex] = {
        ...product,
        recipFirst,
        recipLast,
        recipPhone,
        cardMessage,
        selectedTier: tier,
        recipAddress: {
          streetAddress1,
          streetAddress2,
          townCity,
          state,
          zip
        }
      }

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

  // const prices = product.priceTiers;
  // const prices = product.priceTiers;


  // Note about Container usage: MUI Docs recommends "Container" as a top-level element - basically something to quickly get elements centered on the page. It states that you can have nested containers, but "Box" is the typical component for regular div elements.
  return (
    <Box
      id={`product-${product.productId}-order-item`}
      sx={{
        display: 'flex',
        flexDirection: mobile ? "column" : "row",
        marginY: "25px"
      }}
    >
      <Box id={`product-${product.productId}-image-box`}
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
        <Image id={`product-${product.productId}-image`} alt={`${product.name} image`} src={product.imageUrl} loader={imageLoader} fill style={{ paddingBottom: 25, objectFit: "contain" }} />
      </Box>
      <Box id={`product-${product.productId}-info-box`}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 2.5,
        }}>
        {toggleEdit
          ?
          <Box id={`product-${product.productId}-edit-info-box`}
            sx={{
              mb: 3,
            }}>
            <FormControl>
              <Box id={`product-${product.productId}-price-wrapper`}
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  mb: 1
                }} >
                <Typography component="p" style={{ fontWeight: 500 }}>
                  {`ProductID: ${product.productId}`}
                </Typography>
                {/* <Label></Label> */}
                <Select
                  variant="standard"
                  sx={{ ml: 1 }}
                  value={tier.toString()}
                  onChange={(event: SelectChangeEvent<string>) => {
                    setTier(parseInt(event.target.value));
                    setTier(parseInt(event.target.value));
                  }}
                >
                  {product.prices.map((price, idx) => (
                    <MenuItem key={`price-tier-${idx + 1}`}
                      value={idx}>
                      {`$${price}`}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box id={`product-${product.productId}-delivery-details`}
                sx={{
                  maxWidth: "100%",
                }}>
                <Box id={`product-${product.productId}-recipient-name-box`}
                  sx={{
                    display: "flex"
                  }}>
                  <InputField
                    id="recipient-first-name"
                    name="recipFirst"
                    label="First Name"
                    // color={}
                    sx={{
                    }}
                    value={recipFirst ? recipFirst : ""}
                    onChange={(event) => setRecipFirst(event.target.value)}
                  />
                  <InputField
                    id="recipient-last-name"
                    name="recipLast"
                    label="Last Name"
                    sx={{
                    }}
                    value={recipLast ? recipLast : ""}
                    onChange={(event) => setRecipLast(event.target.value)}
                  />
                </Box>
                <Box id={`product-${product.productId}-recipient-phone`}
                  sx={{
                    display: "flex"
                  }}>
                  <InputField
                    id={`product-${product.productId}-recip-phone`}
                    name="recipPhone"
                    label="Phone Number"
                    sx={{
                      width: "100%",
                    }}
                    value={recipPhone ? recipPhone : ""}
                    onChange={(event) => setRecipPhone(event.target.value)}
                  />
                </Box>
                <Box id={`product-${product.productId}-recip-address-box`}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}>
                  <InputField
                    id={`product-${product.productId}-address-1`}
                    name="StreetAddress1"
                    label="Address Line 1"
                    sx={{
                    }}
                    value={streetAddress1 ? streetAddress1 : ""}
                    onChange={(event) => {
                      setChangeAddress(true);
                      setStreetAddress1(event.target.value);
                    }}
                  />
                  <InputField
                    id={`product-${product.productId}-address-2`}
                    name="StreetAddress2"
                    label="APT/Suite/Unit #"
                    sx={{
                    }}
                    value={streetAddress2 ? streetAddress2 : ""}
                    onChange={(event) => {
                      setChangeAddress(true);
                      setStreetAddress2(event.target.value);
                    }}
                  />
                  <Box id={`product-${product.productId}-recip-town-state-box`}
                    sx={{
                      display: "flex"
                    }}>
                    <InputField
                      id="town"
                      name="Town"
                      label="Town"
                      sx={{
                        flexGrow: 1
                      }}
                      value={townCity ? townCity : ""}
                      onChange={(event) => {
                        setChangeAddress(true);
                        setTownCity(event.target.value);
                      }}
                    />
                    <InputField
                      id="State"
                      name="State"
                      label="State"
                      sx={{
                        flexGrow: 1
                      }}
                      value={state ? state : ""}
                      onChange={(event) => {
                        setChangeAddress(true);
                        setState(event.target.value);
                      }}
                    />
                  </Box>
                </Box>
                <Box id={`product-${product.productId}-zip-and-check-box`}
                  sx={{
                    display: "flex",
                  }}>
                  <Box id={`product-${product.productId}-zip-box`}
                    sx={{
                      flexGrow: 1,
                      width: "50%",
                    }}>
                    <InputField
                      id={`product-${product.productId}-zip`}
                      name="Zip"
                      label="Zip"
                      value={zip ? zip : ""}
                      onChange={(event) => {
                        setChangeAddress(true);
                        setZip(event.target.value);
                      }}
                    />
                  </Box>
                  <Box id={`product-${product.productId}-address-check-button-box`}
                    sx={{
                      flexGrow: 1,
                      width: "50%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <Button id={`product-${product.productId}-address-check-button`}
                      onClick={() => validateAddress()}
                      sx={{
                        border: "1px solid",
                        borderColor: "primary.main",
                        width: "80%",
                        '&:hover': {
                          backgroundColor: "#dfe6df",
                        }
                      }}
                    >
                      Check Address
                    </Button>
                  </Box>
                </Box>
                <Box id={`product-${product.productId}-card-message-box`}
                  sx={{
                    display: "flex"
                  }}>
                  <InputField
                    id={`product-${product.productId}-card-message`}
                    name="cardMessage"
                    label="Card Message"
                    multiline
                    sx={{
                      width: "100%"
                    }}
                    value={cardMessage ? cardMessage : ""}
                    onChange={(event) => setCardMessage(event.target.value)}
                  />
                </Box>
              </Box>
            </FormControl>
          </Box>
          : <Box id={`product-${product.productId}-info-display-box`}
            sx={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              pl: 4,
              mb: 4,
            }}>
            <Typography
              component="p"
              sx={{
                fontWeight: 500
              }}>
              {`ProductID: ${product.productId}`}
            </Typography>
            <Typography
              component="p"
              sx={{
                fontWeight: 500
              }}>
              {`Price: $${(product.prices[tier]).toFixed(2)}`}
            </Typography>
            <Typography
              component="p"
              sx={{
                fontWeight: 500
              }}>
              {`Recipient Name: ${product.recipFirst} ${product.recipLast}`}
            </Typography>
            <Typography
              component="p"
              sx={{
                fontWeight: 500
              }}>
              {`Phone Number: ${product.recipPhone}`}
            </Typography>
            <Typography
              component="p"
              sx={{
                fontWeight: 500
              }}>
              {`Address: ${!product.recipAddress.streetAddress1 ? "" : `${product.recipAddress.streetAddress1} ${product.recipAddress.streetAddress2} ${product.recipAddress.townCity} ${product.recipAddress.state} ${product.recipAddress.zip}`}`}
            </Typography>
            <Typography
              component="p"
              sx={{
                fontWeight: 500
              }}>
              {`Card Message: 
                  ${product.cardMessage}`
              }
            </Typography>
          </Box>
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
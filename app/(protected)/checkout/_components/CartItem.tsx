"use client"

import { useState } from "react";
import Image from 'next/image';

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import Button from '@mui/material/Button';
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { InputField } from "@/app/_components/styled/InputField";

import { useCart } from "@/lib/contexts/CartContext";
import { imageLoader } from "@/lib/imageLoader";

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

  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [price, setPrice] = useState<string>(product.price);
  const [recipFirst, setRecipFirst] = useState<string>(product.recipFirst);
  const [recipLast, setRecipLast] = useState<string>(product.recipLast);
  const [recipPhone, setRecipPhone] = useState<string>(product.recipPhone);
  const [cardMessage, setCardMessage] = useState<string>(product.cardMessage);

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

  const confirmChanges = () => {

    if (toggleEdit) {

      let updateOrder = structuredClone(order);
      updateOrder[dateIndex][orderIndex] = {
        ...product,
        price,
        recipFirst,
        recipLast,
        recipPhone,
        cardMessage,
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
  }

  // Wrote this without testing... Should work but haven't hooked it up.
  const removeItem = () => {

    let updateOrder = structuredClone(order);
    // remove item from array;
    updateOrder[dateIndex].splice(orderIndex, 1);
    // flatten;
    const newCartItems = updateOrder.flat();

    updateCart({ ...cart, cartItems: newCartItems });

  }

  const prices = product.priceTiers;


  // Note about Container usage: MUI Docs recommends "Container" as a top-level element - basically something to quickly get elements centered on the page. It states that you can have nested containers, but "Box" is the typical component for regular div elements.
  return (
    <Container
      className="mapped"
      style={{
        display: 'flex',
      }}
    >
      <Image alt="Logo" src={product.imageUrl} loader={imageLoader} width="128" height="128" style={{ paddingBottom: 25 }} />
      <Container>
        {toggleEdit
          ? <FormControl>
            <Container className="Price-wrapper" sx={{ display: "flex", height: 23, ml: 1, mb: 1 }} >
              <Typography component="p" style={{ fontWeight: 500 }}>{`ProductID: ${product.productId} | Price:`}</Typography>
              <Select
                variant="standard"
                sx={{ ml: 1 }}
                value={price}
                onChange={(event: SelectChangeEvent<string>) => {
                  setPrice(event.target.value);
                  // throw new Error("Price is not a number");
                }}
              >
                <MenuItem value={prices.standardPrice}>{`$${prices.standardPrice}`}</MenuItem>
                <MenuItem value={prices.premiumPrice}>{`$${prices.premiumPrice}`}</MenuItem>
                <MenuItem value={prices.deluxePrice}>{`$${prices.deluxePrice}`}</MenuItem>
              </Select>
            </Container>
            <Container className="Address-TextBox-Wrapper">
              <InputField
                id="recipient-first-name"
                name="recipFirst"
                label="First Name"
                sx={{
                  width: '37.5%'
                }}
                value={recipFirst}
                onChange={(event) => setRecipFirst(event.target.value)}
              />
              <InputField
                id="recipient-last-name"
                name="recipLast"
                label="Last Name"
                sx={{
                  width: '37.5%'
                }}
                value={recipLast}
                onChange={(event) => setRecipLast(event.target.value)}
              />
              <InputField
                id="phone-Number"
                name="recipPhone"
                label="Phone Number"
                sx={{
                  width: '20%',
                }}
                value={recipPhone}
                onChange={(event) => setRecipPhone(event.target.value)}
              />
              <InputField
                id="address-line-1"
                name="StreetAddress1"
                label="Address Line 1"
                sx={{
                  width: '97.5%'
                }}
                value={streetAddress1}
                onChange={(event) => setStreetAddress1(event.target.value)}
              />
              <InputField
                id="address-line-2"
                name="StreetAddress2"
                label="Address Line 2"
                sx={{
                  width: '97.5%'
                }}
                value={streetAddress2}
                onChange={(event) => setStreetAddress2(event.target.value)}
              />
              <InputField
                id="town"
                name="Town"
                label="Town"
                sx={{
                  width: '33%'
                }}
                value={townCity}
                onChange={(event) => setTownCity(event.target.value)}
              />
              <InputField
                id="State"
                name="State"
                label="State"
                sx={{
                  width: '31%'
                }}
                value={state}
                onChange={(event) => setState(event.target.value)}
              />
              <InputField
                id="zip"
                name="Zip"
                label="Zip"
                sx={{
                  width: '31%'
                }}
                value={zip}
                onChange={(event) => setZip(event.target.value)}
              />
              <InputField
                id="card-message"
                name="cardMessage"
                label="Note"
                rows={4}
                sx={{
                  width: '97.5%',
                }}
                value={cardMessage}
                onChange={(event) => setCardMessage(event.target.value)}
              />
            </Container>
          </FormControl>
          : <Container>
            <Typography component="p" style={{ fontWeight: 500 }}>
              {`ProductID: ${product.productId} | Price: ${product.price}`}
            </Typography>
            <Typography component="p" style={{ fontWeight: 500 }}>
              {`Recipient Name: ${product.recipFirst} ${product.recipLast}`}
            </Typography>
            <Typography component="p" style={{ fontWeight: 500 }}>
              {`Phone Number: ${product.recipPhone}`}
            </Typography>
            <Typography component="p" style={{ fontWeight: 500 }}>
              {`Address: ${product.recipAddress.streetAddress1 ? `${product.recipAddress.streetAddress1} ${product.recipAddress.streetAddress2} ${product.recipAddress.townCity} ${product.recipAddress.state}` : ""} ${product.recipAddress.zip}`}
            </Typography>
            <Typography component="p" style={{ fontWeight: 500 }}>
              {`Note: 
                  ${product.cardMessage}`
              }
            </Typography>
          </Container>
        }

        {toggleEdit
          ? <Button
            onClick={() => confirmChanges()}
            sx={{
              border: "1px solid",
              borderColor: "primary.main",
              mt: 1,
              ml: 3.5,
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
              mt: 1,
              ml: 3
            }}
          >
            Edit
          </Button>
        }
      </Container>
    </Container>
  )
}

export default CartItem;
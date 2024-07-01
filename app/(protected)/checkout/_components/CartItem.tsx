"use client"

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import Image from 'next/image';
import FavIcon from "../../../../assets/TheFlowerShop_Icons/TheFlowerShop512x512.ico"
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { InputField } from "@/app/_components/styled/InputField";
import { Address } from "@/app/_components/types/OrderFormData";
import e from "cors";

const CartItem = (props: any) => {
  const { 
    product, 
    demoOrder, 
    setDemoOrder, 
    orderIndex, dateIndex, 
    demoDates, 
    setDemoDates,
    demoAddress,
    setDemoAddress 
  } = props;
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(product.price);
  const [recipFirst, setRecipFirst] = useState<string>(product.recipFirst);
  const [recipLast, setRecipLast] = useState<string>(product.recipLast);
  const [recipPhone, setRecipPhone] = useState<string>(product.recipPhone);
  const [cardMessage, setCardMessage] = useState<string>(product.cardMessage);

  const [changeAdddress, setChangeAddress] = useState<boolean>(false);
  const [streetAddress1, setStreetAddress1] = useState<string>(demoAddress[product.recipAddress].streetAddress1);
  const [streetAddress2, setStreetAddress2] = useState<string>(demoAddress[product.recipAddress].streetAddress2);
  const [townCity, setTownCity] = useState<string>(demoAddress[product.recipAddress].townCity);
  const [state, setState] = useState<string>(demoAddress[product.recipAddress].state);
  const [zip, setZip] = useState<string>(demoAddress[product.recipAddress].zip);

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

  const confirmChanges = async () => {
    if (toggleEdit) {
      let updateOrder = structuredClone(demoOrder);

      // currently, updateAddresses does not check for duplicate addresses in state
      // the address autocomplete feature should minimize instances of duplicate address objects
      // however, this function should still be able to remove duplicate addresses and increment the orders property on the address objects

      if (changeAdddress) {
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
          let updateAddresses = structuredClone(demoAddress);
          const newAddress: Address = {
            streetAddress1,
            streetAddress2,
            townCity,
            state,
            zip,
            orders: 1
          };

          if (res.result.address.addressComponents.length > 7) {
            setStreetAddress1(res.result.address.postalAddress.addressLines[0].replace(/\s[^\s]*$/, ''));
            setStreetAddress2(res.result.address.addressComponents[2].componentName.text);
            newAddress.streetAddress1 = res.result.address.postalAddress.addressLines[0].replace(/\s[^\s]*$/, '');
            newAddress.streetAddress2 = res.result.address.addressComponents[2].componentName.text;
          } else {
            setStreetAddress1(res.result.address.postalAddress.addressLines[0]);
            newAddress.streetAddress1 = res.result.address.postalAddress.addressLines[0];
          }
          setTownCity(res.result.address.postalAddress.locality);
          setState(res.result.address.postalAddress.administrativeArea);
          setZip(res.result.address.postalAddress.postalCode);
          newAddress.townCity = res.result.address.postalAddress.locality;
          newAddress.state = res.result.address.postalAddress.administrativeArea;
          newAddress.zip = res.result.address.postalAddress.postalCode;
          console.log('Valid Address');

          updateAddresses[product.recipAddress].orders--;
          if (updateAddresses[product.recipAddress].orders == 0) {
            delete updateAddresses[product.recipAddress];
          }
          updateAddresses.push(newAddress);
          setDemoAddress(updateAddresses);

          updateOrder[dateIndex][orderIndex] = {
            ...product,
            price,
            recipFirst,
            recipLast,
            recipPhone,
            cardMessage,
            recipAddress: updateAddresses.length - 1
          }
          setChangeAddress(false);
        })
        .catch(err => console.log('Error validating/updating new address: ', err))
      } else {
        updateOrder[dateIndex][orderIndex] = {
          ...product,
          price,
          recipFirst,
          recipLast,
          recipPhone,
          cardMessage,
        }
      }

      setDemoOrder(updateOrder);
      setToggleEdit(false);
    }
    else { 
      setToggleEdit(true);
    }
  }

  const deleteItem = () => {
    let updateAddresses = structuredClone(demoAddress);
    let updateOrder = structuredClone(demoOrder);
    let updateItems = updateOrder[dateIndex];

    if (updateAddresses[updateItems[orderIndex].recipAddress].orders <= 0) {
      throw new Error('Error in deleteItem: address with negative orders');
    } else {
      updateAddresses[updateItems[orderIndex].recipAddress].orders--;
      setDemoAddress(updateAddresses);
    }

    if (updateItems.length > 1) {
      updateItems = updateItems.slice(0, orderIndex).concat(updateItems.slice(orderIndex + 1));
      updateOrder[dateIndex] = updateItems;
      setDemoOrder(updateOrder);
    } else {
      updateOrder = updateOrder.slice(0, dateIndex).concat(updateOrder.slice(dateIndex + 1));
      setDemoOrder(updateOrder);
      
      let updateDates = structuredClone(demoDates);
      updateDates = updateDates.slice(0, dateIndex).concat(updateDates.slice(dateIndex + 1));
      setDemoDates(updateDates);
    }
  }

  return (
    <Container
      className="mapped"
      style={{
        display: 'flex',
      }}
    >
      <Image alt="Logo" src={FavIcon} width="128" height="128" style={{ paddingBottom: 25 }} />
      <Container>
        {toggleEdit
          ? <FormControl>
            <Container className="Price-wrapper" sx={{ display: "flex", height: 23, ml: 1, mb: 1 }} >
              <Typography component="p" style={{ fontWeight: 500 }}>{`ProductID: ${product.productID} | Price:`}</Typography>
              <Select
                variant="standard"
                sx={{ ml: 1 }}
                value={price}
                onChange={(event : SelectChangeEvent<number>) => {
                  if (typeof event.target.value === "number") setPrice(event.target.value);
                  else throw new Error("Price is not a number");
                }}
              >
                <MenuItem value={100}>$100</MenuItem>
                <MenuItem value={115}>$115</MenuItem>
                <MenuItem value={130}>$130</MenuItem>
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
                onChange={(event) => {
                  setChangeAddress(true);
                  setStreetAddress1(event.target.value);
                }}
              />
              <InputField
                id="address-line-2"
                name="StreetAddress2"
                label="APT/Suite/Unit #"
                sx={{
                  width: '97.5%'
                }}
                value={streetAddress2}
                onChange={(event) => {
                  setChangeAddress(true);
                  setStreetAddress2(event.target.value);
                }}
              />
              <InputField
                id="town"
                name="Town"
                label="Town"
                sx={{
                  width: '33%'
                }}
                value={townCity}
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
                  width: '31%'
                }}
                value={state}
                onChange={(event) => {
                  setChangeAddress(true);
                  setState(event.target.value);
                }}
              />
              <InputField
                id="zip"
                name="Zip"
                label="Zip"
                sx={{
                  width: '31%'
                }}
                value={zip}
                onChange={(event) => {
                  setChangeAddress(true);
                  setZip(event.target.value);
                }}
              />
              <Button
              onClick={() => validateAddress()}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                mt: 1,
                ml: 3.5,
                '&:hover': {
                  backgroundColor: "#dfe6df",
                }
              }}
            >
              Check Address
            </Button>
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
                {`ProductID: ${product.productID} | Price: ${product.price}`}
                </Typography>
              <Typography component="p" style={{ fontWeight: 500 }}>
                {`Recipient Name: ${product.recipFirst} ${product.recipLast}`}
              </Typography>
              <Typography component="p" style={{ fontWeight: 500 }}>
                {`Phone Number: ${product.recipPhone}`}
              </Typography>
              <Typography component="p" style={{ fontWeight: 500 }}>
                {`Address: ${demoAddress[product.recipAddress].streetAddress1} ${demoAddress[product.recipAddress].streetAddress2} ${demoAddress[product.recipAddress].townCity} ${demoAddress[product.recipAddress].state} ${demoAddress[product.recipAddress].zip}`}
              </Typography>
              <Typography component="p" style={{ fontWeight: 500 }}>
                {`Note: 
                  ${product.cardMessage}`
                }
              </Typography>
          </Container>
        }

        { toggleEdit
          ? <Button
              onClick={() => {
                confirmChanges();
              }}
              sx={{
                border: "1px solid",
                borderColor: "primary.main",
                mt: 1,
                ml: 3.5,
                '&:hover': {
                  backgroundColor: "#dfe6df",
                }
              }}
            >
              Confirm
            </Button>
          : <Button
              onClick={() => {
                toggleEdit ? setToggleEdit(false) : setToggleEdit(true);
              }}
              variant="outlined"
              sx={{
                mt: 1,
                ml: 3,
                '&:hover': {
                  backgroundColor: "#dfe6df",
                }
              }}
            >
              Edit
            </Button>
        }
        <Button 
          onClick={() => deleteItem()}
          variant="outlined"
          color="error"
          sx={{
            mt: 1,
            ml: 2,
            '&:hover': {
              bgcolor: "#d32e2f",
              color: "white"
            }
          }}
        >
          Delete
        </Button>
      </Container>
      
    </Container>
  )
}

export default CartItem;
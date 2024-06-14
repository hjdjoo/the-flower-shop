"use client"

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Button from '@mui/material/Button';
import Image from 'next/image';
import FavIcon from "../../../../assets/TheFlowerShop_Icons/TheFlowerShop512x512.ico"
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { InputField } from "@/app/_components/styled/InputField";

const CartItem = (props: any) => {
  const { product, demoOrder, setDemoOrder, orderIndex, dateIndex } = props;
  const [toggleEdit, setToggleEdit] = useState<boolean>(false);
  const [price, setPrice] = useState<number>(product.price);
  const [recipFirst, setRecipFirst] = useState<string>( product.recipFirst);
  const [recipLast, setRecipLast] = useState<string>( product.recipLast);
  const [recipPhone, setRecipPhone] = useState<string>( product.recipPhone);
  const [cardMessage, setCardMessage] = useState<string>( product.cardMessage);

  const [streetAddress1, setStreetAddress1] = useState<string>(product.recipAddress.streetAddress1);
  const [streetAddress2, setStreetAddress2] = useState<string>(product.recipAddress.streetAddress2);
  const [townCity, setTownCity] = useState<string>(product.recipAddress.townCity);
  const [state, setState] = useState<string>(product.recipAddress.state);
  const [zip, setZip] = useState<string>(product.recipAddress.zip);

  const confirmChanges = () => {
    if (toggleEdit) {
      let updateOrder = structuredClone(demoOrder);
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

      setDemoOrder(updateOrder);
      setToggleEdit(false);
    } 
    else { 
      setToggleEdit(true);
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
                {`ProductID: ${product.productID} | Price: ${product.price}`}
                </Typography>
              <Typography component="p" style={{ fontWeight: 500 }}>
                {`Recipient Name: ${product.recipFirst} ${product.recipLast}`}
              </Typography>
              <Typography component="p" style={{ fontWeight: 500 }}>
                {`Phone Number: ${product.recipPhone}`}
              </Typography>
              <Typography component="p" style={{ fontWeight: 500 }}>
                {`Address: ${product.recipAddress.streetAddress1} ${product.recipAddress.streetAddress2} ${product.recipAddress.townCity} ${product.recipAddress.state} ${product.recipAddress.zip}`}
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
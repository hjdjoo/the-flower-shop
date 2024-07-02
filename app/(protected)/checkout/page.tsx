"use client"

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as OrderTypes from '../../_components/types/OrderFormData'
import CartItem from "./_components/CartItem";
import Button from '@mui/material/Button';

export default function Checkout() {

  const [demoDates, setDemoDates] = useState<OrderTypes.Dates>(["9/16/2024","12/25/2024"]);
  const [demoAddress, setDemoAddress] = useState<OrderTypes.Addresses>([
    {
      streetAddress1: '71 Tennyson Dr',
      streetAddress2: '',
      townCity: 'Nanuet',
      state: 'NY',
      zip: '10954-1039',
      orders: 2
    },
    {
      streetAddress1: '624 Cambridge St',
      streetAddress2: '',
      townCity: 'Allston',
      state: 'MA',
      zip: '02134-2433',
      orders: 1
    }
  ]);

  //imageURL, name, and deliveryDate has been newly added and not accounted for
  const [demoOrder, setDemoOrder] = useState<OrderTypes.Order>([
    [
      {
        productId: '1',
        imageUrl: 'FakeURL1',
        name: 'Birthday Flowers',
        price: '115',
        cardMessage: "Happy Birthday Mom",
        recipFirst: "Jenny",
        recipLast: "Cho",
        recipAddress: {
          streetAddress1: '71 Tennyson Dr',
          streetAddress2: '',
          townCity: 'Nanuet',
          state: 'NY',
          zip: '10954-1039',
          orders: 2
        },
        recipAddressIndex: 0,
        recipPhone: '8452834700',
        deliveryFee: '25.00',
        deliveryInstructions: '',
        deliveryDate: "9/16/2024"
      },
      {
        productId: '2',
        imageUrl: 'FakeURL2',
        name: 'Birthday Flowers 2',
        price: '100',
        cardMessage: '',
        recipFirst: "Jenny",
        recipLast: "Cho",
        recipAddress: {
          streetAddress1: '71 Tennyson Dr',
          streetAddress2: '',
          townCity: 'Nanuet',
          state: 'NY',
          zip: '10954-1039',
          orders: 2
        },
        recipAddressIndex: 0,
        recipPhone: '8452834700',
        deliveryFee: '0.00',
        deliveryInstructions: '',
        deliveryDate: "12/25/2024"
      }
    ],
    [
      {
        productId: '3',
        imageUrl: 'FakeURL3',
        name: 'Christmas Flowers',
        price: '100',
        cardMessage: "Merry Christmas",
        recipFirst: "Edwyn",
        recipLast: "Song",
        recipAddress: {
          streetAddress1: '624 Cambridge St',
          streetAddress2: '',
          townCity: 'Allston',
          state: 'MA',
          zip: '02134-2433',
          orders: 1
        },
        recipAddressIndex: 1,
        recipPhone: '1234567890',
        deliveryFee: '25.00',
        deliveryInstructions: '',
        deliveryDate: "9/16/2024"
      }
    ]
  ]);

  return (
    <Container
      sx={{
        marginTop: "80px",
        // border: "solid blue 1px"
      }}
    >
      <Typography component='h1' sx={{ fontSize: 32, fontWeight: 500 }}>Cart</Typography>
      {demoDates.map((date, dateIndex) =>
        <Accordion defaultExpanded key={dateIndex}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container className="Description-Root">
              {demoOrder[dateIndex].map((product, orderIndex) => 
              <Container className="CartItem-Root" key={orderIndex}>
                <CartItem 
                  product={product} 
                  demoOrder={demoOrder} 
                  setDemoOrder={setDemoOrder} 
                  orderIndex={orderIndex} 
                  dateIndex={dateIndex} 
                  setDemoDates={setDemoDates} 
                  demoDates={demoDates} 
                  demoAddress={demoAddress} 
                  setDemoAddress={setDemoAddress}
                />
              </Container>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
      <Button
        onClick={() => {
          console.log('demoAddress', demoAddress);
          console.log('demoOrder', demoOrder);
          console.log('demoDates', demoDates);
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
              Check
      </Button>
    </Container>
  )
}
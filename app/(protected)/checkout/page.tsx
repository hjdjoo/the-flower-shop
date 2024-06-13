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

export default function Checkout() {

  const [demoDates, setDemoDates] = useState<OrderTypes.Dates>(["9/16/2024","12/25/2024"]);
  const [demoAddress, setDemoAddress] = useState<OrderTypes.Addresses>([
    {
      streetAddress1: '71 Tennyson Drive',
      streetAddress2: '',
      townCity: 'Nanuet',
      state: 'NY',
      zip: '10954',
    },
    {
      streetAddress1: '624 Cambridge Street',
      streetAddress2: '',
      townCity: 'Allston',
      state: 'MA',
      zip: '02134',
    }
  ]);

  const [demoOrder, setDemoOrder] = useState<OrderTypes.Order>([
    [
      {
        productID: 1,
        price: 115,
        cardMessage: "Happy Birthday Mom",
        recipFirst: "Jenny",
        recipLast: "Cho",
        recipAddress: demoAddress[0],
        recipPhone: 8452834700,
        deliveryFee: 25.00,
        deliveryInstructions: '',
      },
      {
        productID: 2,
        price: 100,
        cardMessage: '',
        recipFirst: "Jenny",
        recipLast: "Cho",
        recipAddress: demoAddress[0],
        recipPhone: 8452834700,
        deliveryFee: 0.00,
        deliveryInstructions: '',
      }
    ],
    [
      {
        productID: 3,
        price: 100,
        cardMessage: "Merry Christmas",
        recipFirst: "Edwyn",
        recipLast: "Song",
        recipAddress: demoAddress[1],
        recipPhone: 1234567890,
        deliveryFee: 25.00,
        deliveryInstructions: '',
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
                <CartItem product={product} demoOrder={demoOrder} setDemoOrder={setDemoOrder} orderIndex={orderIndex} dateIndex={dateIndex}></CartItem>
              </Container>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
    </Container>
  )
}
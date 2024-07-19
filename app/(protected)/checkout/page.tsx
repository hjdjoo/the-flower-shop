"use client"

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dates, Addresses, SortedOrder } from '../../types/component-types/OrderFormData'
import CartItem from "./_components/CartItem";
import Button from '@mui/material/Button';
import { CartContextType } from "@/lib/contexts/CartContext";

import { useCart } from "@/lib/contexts/CartContext";


export default function Checkout() {

  const { cart, getSortedOrder } = useCart() as CartContextType;

  const [deliveryDates, setDeliveryDates] = useState<Dates>(cart.deliveryDates);

  const order = getSortedOrder();


  return (
    <Container
      sx={{
        marginTop: "80px",
      }}
    >
      <Typography component='h1' sx={{ fontSize: 32, fontWeight: 500 }}>Cart</Typography>
      {deliveryDates.map((date, dateIndex) =>
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
              {order[dateIndex].map((product, orderIndex) =>
                <Container className="CartItem-Root" key={orderIndex}>
                  <CartItem product={product} orderIndex={orderIndex} dateIndex={dateIndex}></CartItem>
                </Container>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
      {/* <Button
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
      </Button> */}
    </Container>
  )
}
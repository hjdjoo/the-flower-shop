"use client"

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { CartDateDiv } from "./_components/CartComps";
import { useState, useEffect } from "react";
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Divider from '@mui/material/Divider';
import FavIcon from "../../../assets/TheFlowerShop_Icons/TheFlowerShop512x512.ico"


export default function Checkout() {
  const [demoDates, setDemoDates] = useState([
    "9/16/2024",
    "12/25/2024"
  ]);

  const [demoAddress, setDemoAddress] = useState([
    "71 Tennyson Drive, Nanuet, NY, 10954",
    "624 Cambridge Street, Allston, MA, 02134"
  ]);

  const [demoOrder, setDemoOrder] = useState([
    [
      {
        productID: 1,
        productType: 3,
        address: demoAddress[0],
        cardMessage: "Happy Birthday Mom",
        recipFirst: "string",
        recipLast: "string",
        recipAddress: "string",
        recipZip: 10954,
        recipPhone: 8452834700,
        deliveryFee: "25.00",
        deliveryInstructions: "",
      },
      {
        productID: 2,
        productType: 2,
        address: "71 Tennyson Drive, Nanuet, NY 10954",
        note: null,
      }
    ],
    [
      {
        productID: 3,
        productType: 1,
        address: "624 Cambridge Street, Allston, MA 02134",
        note: "Merry Christmas Edwyn",
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
      {demoDates.map((date, index) =>
        <Accordion defaultExpanded key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container className="Description-Root">
              {demoOrder[index].map((product, index) => 
                <Container key={index}  className="mapped"
                  style={{ 
                    display: 'flex', 
                  }}
                >
                  <Image alt="Logo" src={FavIcon} width="128" height="128"  style={{ paddingBottom: 25}}/>
                  <Container className="Description-wrapper" sx={{ marginLeft: 1 }} >
                    <Typography component="p" key={index} style={{ fontWeight: 500 }}>{`Product Name | Quality | Price `}</Typography>
                    <Typography component="p" key={index} style={{ fontWeight: 500 }}>{`Address: ${product.address}`}</Typography>
                    <Typography component="p" key={index} style={{ fontWeight: 500 }}>{`Note: ${product.note}`}</Typography>
                    <Button 
                      // onClick={() => handleClick(false)}
                      sx={{
                        border: "1px solid",
                        borderColor: "primary.main",
                        mt: 1
                      }}
                    >
                      Edit
                    </Button>
                  </Container>
                </Container>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
      <Typography component='h1' sx={{ fontSize: 32, fontWeight: 500 }}>Edit Cart</Typography>
      {demoDates.map((date, index) =>
        <Accordion defaultExpanded key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component='h2' sx={{ fontSize: 20, fontWeight: 500 }}>Deliver on: {date}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Container className="Description-Root">
              {demoOrder[index].map((product, index) => 
                <Container key={index}  className="mapped"
                  style={{ 
                    display: 'flex', 
                  }}
                >
                  <Image alt="Logo" src={FavIcon} width="128" height="128"  style={{ paddingBottom: 25}}/>
                  <Container className="Description-wrapper" sx={{ marginLeft: 1 }} >
                    <Typography component="p" key={index} style={{ fontWeight: 500 }}>{`Product Name | Quality | Price `}</Typography>
                    <Typography component="p" key={index} style={{ fontWeight: 500 }}>{`Address: ${product.address}`}</Typography>
                    <Typography component="p" key={index} style={{ fontWeight: 500 }}>{`Note: ${product.note}`}</Typography>
                    <Button 
                      // onClick={() => handleClick(false)}
                      sx={{
                        border: "1px solid",
                        borderColor: "primary.main",
                        mt: 1
                      }}
                    >
                      Edit
                    </Button>
                  </Container>
                </Container>
              )}
            </Container>
          </AccordionDetails>
        </Accordion>
      )}
    </Container>
  )
}
"use client";
import { Dispatch, type SetStateAction, useEffect, useState } from "react";

import Image from "next/image";
import { imageLoader } from "@/lib/imageLoader";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import CustomerOrderForm from "./CustomerOrderForm";
import PricePicker from "@/app/_components/PricePicker";
import { OrderForm as defaultOrderForm } from "@/app/_components/lib/OrderForm";

import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo";

import { ProductData } from "@/app/types/client-types";
import { OrderFormData } from "@/app/_components/types/OrderFormData";

interface ProductCardProps {
  productInfo: ProductData,
  productId: number
  // setProductInfo: Dispatch<SetStateAction<ProductData>>
}

export default function ProductCard(props: ProductCardProps) {

  const { productId } = props
  const { name, categories, description, standardPrice, premiumPrice, deluxePrice, imageUrl } = props.productInfo
  const [orderInfo, setOrderInfo] = useState<OrderFormData>({ ...defaultOrderForm })

  // const { setProductInfo, productInfo, productId } = props;

  // console.log('ProductCard/imageUrl: ', imageUrl);

  return (
    <Container
      id="product-container"
    >
      <Grid container>
        <Grid
          xs={12}
          sm={6}
        >
          <Box
            id="product-display-box"
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box
              id="product-name-box"
              height={"50px"}
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid lightgrey",
                marginBottom: "15px"
              }}
            >
              <Typography id="product-name">{name}</Typography>
            </Box>
            <Box
              id="product-image-box"
              width={"100%"}
              height={"500px"}
              position={"relative"}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "15px"
              }}
            >
              <Image
                id="product-image"
                loader={imageLoader}
                src={imageUrl}
                alt="Product-image"
                objectFit="contain"
                fill
                priority
              />
            </Box>
            <Typography marginBottom={"15px"} id="product-description">
              {description}
            </Typography>
            <PricePicker name={name} prices={[standardPrice, premiumPrice, deluxePrice]} setOrderInfo={setOrderInfo} />
          </Box>
        </Grid>
        <Grid>
          <Box
            id={"order-form-box"}
          >
            <CustomerOrderForm setOrderInfo={setOrderInfo} />
          </Box>
        </Grid>
      </Grid>
    </Container >
  )
}
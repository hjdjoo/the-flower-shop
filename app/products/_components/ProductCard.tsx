"use client";
import { Dispatch, type SetStateAction, useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { imageLoader } from "@/lib/imageLoader";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

import ShoppingCart from "@mui/icons-material/ShoppingCart";

import { useTheme } from "@mui/material";

import CartPreview from "@/app/_components/CartPreview";
import CustomerOrderForm from "./CustomerOrderForm";
import PricePicker from "@/app/_components/PricePicker";
import { OrderForm as defaultOrderForm } from "@/app/_components/lib/OrderForm";

import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo";
import { getCategoryNames } from "@/utils/supabase/clientActions/getCategoryNames";

import { ProductData } from "@/app/types/client-types";
import { OrderFormData } from "@/app/_components/types/OrderFormData";

interface ProductCardProps {
  productInfo: ProductData,
  productId: number
}

export default function ProductCard(props: ProductCardProps) {

  const theme = useTheme();

  const { productId } = props
  const { name, categories, description, standardPrice, premiumPrice, deluxePrice, imageUrl } = props.productInfo
  const [orderInfo, setOrderInfo] = useState<OrderFormData>({ ...defaultOrderForm })
  const [relatedCategories, setRelatedCategories] = useState<{ id: number, name: string }[] | undefined>()

  useEffect(() => {
    (async () => {

      const { data } = await getCategoryNames(categories);
      console.log(data);

      setRelatedCategories(data)

    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddToCart = async () => {
    console.log("Order Info: ", orderInfo)
    console.log("Add Cart Logic...")
  }

  const relatedCategoriesLinks = relatedCategories?.map((category, idx) => {
    return (
      <>
        <Link href={`/category/${category.id}`}>
          <Box
            key={`related-categories-box-${idx + 1}`}
            marginY="10px"
            display="flex"
            justifyContent="space-between"
            sx={{
              backgroundColor: theme.palette.primary.light
            }}
          >
            <Typography>Explore {category.name} flowers</Typography>
            <Typography>{">>"}</Typography>
          </Box>
        </Link>

      </>
    )
  })

  return (
    <Container
      id="product-container"
    >
      <Grid
        container>
        <Grid
          xs={12}
          sm={6}
        >
          <Box
            id="product-display-box"
            paddingX="15px"
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
                marginBottom: "5px"
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
        <Grid xs={12} sm={6}>
          <Box
            width="100%"
            id="order-form-box"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <CustomerOrderForm
              orderInfo={orderInfo}
              setOrderInfo={setOrderInfo} />
            <Box
              id="cart-button-box"
              aria-label="Add to cart"
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Button
                id="add-to-cart-button"
                variant="contained"
                sx={{
                  marginTop: "15px"
                }}
                onClick={handleAddToCart}
                fullWidth
              >
                Add to Cart
                <ShoppingCart sx={{ marginLeft: "10px" }} />
              </Button>
              <Typography
                fontSize={"0.8rem"}
                marginTop="3px"
              >You can update your order at any time.</Typography>
            </Box>
            <CartPreview></CartPreview>
          </Box>
        </Grid>
        <Grid xs={12} sm={6}>
          <Box
            id="category-suggestion-box"
            marginTop="30px"
          >
            <Typography>Related Categories:</Typography>
            {relatedCategoriesLinks}
          </Box>
        </Grid>
      </Grid>
    </Container >
  )
}
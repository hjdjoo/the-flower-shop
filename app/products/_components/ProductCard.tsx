"use client";
import { useEffect, useState, useContext } from "react";

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

import { useCart, CartContextType } from "@/lib/contexts/CartContext";

import CartPreview from "@/app/_components/CartPreview";
import CustomerOrderForm from "./CustomerOrderForm";
import PricePicker from "@/app/_components/PricePicker";
import { OrderItemForm as defaultOrderForm } from "@/app/_components/lib/OrderForm";

import useBreakpoints from "@/utils/hooks/useBreakpoints";
import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo";
import { getCategoryNames } from "@/utils/supabase/clientActions/getCategoryNames";

import { ProductData } from "@/app/types/client-types";
import { OrderFormData, OrderItem, Address } from "@/app/_components/types/OrderFormData";


// import { useCart } from "@/lib/contexts/CartContext";

interface ProductCardProps {
  productInfo: ProductData,
  productId: number
}

export default function ProductCard(props: ProductCardProps) {

  /* hooks */
  const theme = useTheme();
  const { mobile, tablet, large, xlarge } = useBreakpoints();
  const { cart, updateCart } = useCart() as CartContextType;

  /* prop destructuring */
  const { productId } = props
  const { name, categories, description, standardPrice, premiumPrice, deluxePrice, imageUrl } = props.productInfo

  /* Other necessary component states */
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  const orderForm = Object.assign(defaultOrderForm, { ...defaultOrderForm, productId: productId.toString(), deliveryDate: deliveryDate, imageUrl: imageUrl, name: name })

  const [orderItem, setOrderItem] = useState<OrderItem>(orderForm)
  const [relatedCategories, setRelatedCategories] = useState<{ id: number, name: string }[] | undefined>()
  const [readyToSubmit, setReadyToSubmit] = useState<boolean>(true);

  useEffect(() => {
    (async () => {

      const { data } = await getCategoryNames(categories);

      setRelatedCategories(data)

    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const handleAddToCart = async () => {
    console.log("Order Info: ", orderItem);
    if (!deliveryDate) {
      console.log("You gotta pick a delivery date");
      return;
    }
    if (!orderItem.price) {
      // have customer select a price first
      // insert logic here....
      console.log("You gotta pick a price")
      return;
    }
    const currCart = cart;

    currCart.deliveryDates.push(deliveryDate);
    currCart.cartItems.push(orderItem);

    updateCart({ ...currCart })
  }


  const relatedCategoriesLinks = relatedCategories?.map((category, idx) => {
    return (
      <Box
        key={`related-categories-box-${idx + 1}`}
        paddingRight="25px"
      >
        <Link href={`/category/${category.id}`}>
          <Box
            marginY="15px"
            width="100%"
            display="flex"
            justifyContent="space-between"
            borderRadius={"5px"}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              boxShadow: "2px 2px 4px lightgrey",
              "&:hover": {
                backgroundColor: "lightgrey",
              }
            }}
          >
            <Typography
              sx={{
                paddingLeft: "15px"
              }}
            >Explore {category.name} flowers</Typography>
            <Typography
              sx={{
                paddingRight: "15px"
              }}
            >{">"}</Typography>
          </Box>
        </Link>
      </Box>
    )
  })

  return (
    <Box
      id="product-container"
      maxWidth={() => {
        if (mobile || tablet) return "100%";
        if (large) return "80%";
        if (xlarge) return "70%";
      }}
      sx={{
        marginTop: "65px",
      }}
    >
      <Grid
        container
        sx={{
          paddingX: "25px"
        }}>
        <Grid xs={12} sm={6} id="product-display-grid-area" >
          <Box
            id="product-display-box"
            paddingX="15px"
            marginBottom="25px"
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box
              id="product-name-box"
              height={"75px"}
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid lightgrey",
                marginBottom: "15px"
              }}
            >
              <Typography
                id="product-name"
                fontSize="1.2rem"
              >{name}</Typography>
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
                style={{
                  objectFit: "contain"
                }}
                fill
                priority
              />
            </Box>
            <Typography
              id="product-description"
              marginTop="5px"
              marginBottom="15px"
            >
              {description}
            </Typography>
            <Typography
              id="product-description"
              marginTop="5px"
              marginBottom="10px"

            >
              {"Select a price tier:"}
            </Typography>
            <PricePicker
              productInfo={{
                id: productId,
                description: description,
                prices: [standardPrice, premiumPrice, deluxePrice]
              }}
              orderItem={orderItem}
              setOrderItem={setOrderItem} />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} id="order-form-grid-area">
          <Box
            width="100%"
            id="order-form-box"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <CustomerOrderForm
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              orderItem={orderItem}
              setOrderItem={setOrderItem}
              setReadyToSubmit={setReadyToSubmit}
            />
            <Box
              id="cart-button-box"
              aria-label="Add to cart"
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Button
                id="add-to-cart-button"
                disabled={!readyToSubmit}
                variant="contained"
                sx={{
                  marginTop: "15px"
                }}
                onClick={() => handleAddToCart()}
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
            {!!cart.deliveryDates.length &&
              <>
                <Box id="cart-preview-box"
                  marginTop="25px"
                  marginBottom="35px"
                  textAlign="center"
                >
                  <Typography paddingX="10px" fontWeight={600}>Cart Preview:</Typography>
                  <CartPreview />
                </Box>
                <Button variant="contained">
                  Checkout
                </Button>
              </>
            }
          </Box>
        </Grid>
        <Grid xs={12} sm={6} id="related-categories-grid-area"
          order={mobile ? 1 : 0}
        >
          <Box
            id="category-suggestion-box"
          >
            <Typography
              fontSize={"1.2rem"}
              fontStyle={"italic"}
            >Related Categories:</Typography>
            {relatedCategoriesLinks}
          </Box>
        </Grid>
        <Grid xs={12} sm={6}>
        </Grid>
      </Grid>
    </Box >
  )
}
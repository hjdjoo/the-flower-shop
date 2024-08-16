"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { imageLoader } from "@/app/lib/imageLoader";

import { useRouter } from "next/navigation";

import { styled, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Collapse from "@mui/material/Collapse";

import ShoppingCart from "@mui/icons-material/ShoppingCart";
import ErrorIcon from '@mui/icons-material/Report';
import CheckIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


import { useCart, CartContextType } from "@/contexts/CartContext";

import { ExpandMore } from "@/app/_components/styled/ExpandIcon";
import CartPreview from "@/app/_components/CartPreview";
import CustomerOrderForm from "./CustomerOrderForm";
import PricePicker from "@/app/_components/PricePicker";
import { OrderItemForm as defaultOrderForm } from "@/app/_components/lib/OrderForm";


import useBreakpoints from "@/utils/hooks/useBreakpoints";
import { getCategoryNames } from "@/utils/supabase/clientActions/getCategoryNames";

import { ProductData } from "@/app/types/client-types";
import { OrderItem } from "@/app/types/component-types/OrderFormData";



// import { useCart } from "@/contexts/CartContext";

interface ProductCardProps {
  productInfo: ProductData,
  productId: number
}

export type SubmitStatus = "incomplete" | "ready" | "submitting" | "submitted" | undefined

export default function ProductCard(props: ProductCardProps) {

  /* hooks */
  const theme = useTheme();
  const router = useRouter();
  const { mobile, tablet, large, xlarge } = useBreakpoints();
  const { cart, addToCart, updateAddressesAndDates } = useCart() as CartContextType;

  /* prop destructuring */
  const { productId } = props
  const { name, categories, description, prices, imageUrl } = props.productInfo

  const CheckIconColored = styled(CheckIcon)(({ theme }) => ({
    color: theme.palette.success.main
  }));
  const ErrorIconColored = styled(ErrorIcon)(({ theme }) => ({
    color: theme.palette.error.main
  }));
  const WarningIconColored = styled(WarningIcon)(({ theme }) => ({
    color: theme.palette.warning.main
  }));

  /* Other necessary component states */
  const [deliveryDate, setDeliveryDate] = useState<string>("");

  /* Object reassignment to get default order for page;  */
  const baseOrderForm: OrderItem = Object.assign(defaultOrderForm, { ...defaultOrderForm, productId: productId, deliveryDate: deliveryDate, prices: prices, imageUrl: imageUrl, name: name });

  const [orderItem, setOrderItem] = useState<OrderItem>(baseOrderForm)
  const [relatedCategories, setRelatedCategories] = useState<{ id: number, name: string }[] | undefined>()
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("incomplete");

  /* State checks for adding to cart */
  const [zipValid, setZipValid] = useState<boolean>(false);
  const [deliveryDateValid, setDeliveryDateValid] = useState<boolean>(false);
  const [priceSelected, setPriceSelected] = useState<boolean>(false);

  /* Cart preview state */
  const [cartPreviewOpen, setCartPreviewOpen] = useState<boolean>(false);


  useEffect(() => {
    (async () => {

      const { data } = await getCategoryNames(categories);

      setRelatedCategories(data)

    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!orderItem.deliveryDate || !priceSelected || !zipValid) {
      setSubmitStatus("incomplete");
    }
    else if (orderItem.deliveryDate && priceSelected && zipValid) {
      setSubmitStatus("ready");
    }
  }, [orderItem, priceSelected, zipValid])


  const handleAddToCart = async () => {
    console.log("Order Info: ", orderItem);
    if (!deliveryDateValid) {
      // have customer select a delivery date
      // insert error logic here...
      console.log("You gotta pick a delivery date");
      return;
    }
    if (orderItem.selectedTier === undefined || null) {
      // have customer select a price first
      // insert error logic here...
      console.log("You gotta pick a price")
      return;
    }
    else {
      setSubmitStatus("submitting");
      addToCart(orderItem);
      setSubmitStatus("submitted");
      setDeliveryDate("");
      setOrderItem({ ...baseOrderForm });
      router.refresh();
    }
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
          <Box id="product-display-box"
            paddingX="15px"
            marginBottom="25px"
            sx={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box id="product-name-box"
              height={"75px"}
              sx={{
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid lightgrey",
                marginBottom: "15px"
              }}
            >
              <Typography id="product-name"
                fontSize="1.2rem"
              >{name}</Typography>
            </Box>
            <Box id="product-image-box"
              width={"100%"}
              height={"500px"}
              position={"relative"}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "5px"
              }}
            >
              <Image id="product-image"
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
            <Typography id="product-description"
              marginTop="5px"
              marginBottom="15px"
            >
              {description}
            </Typography>
            <Typography id="product-price-header"
              marginTop="5px"
              marginBottom="10px"

            >
              {"Select a price tier:"}
            </Typography>
            <PricePicker
              productInfo={{
                id: productId,
                description: description,
                prices: prices
              }}
              orderItem={orderItem}
              submitStatus={submitStatus}
              setOrderItem={setOrderItem}
              setPriceSelected={setPriceSelected}
            />
          </Box>
        </Grid>
        <Grid xs={12} sm={6} id="order-form-grid-area">
          <Box
            id="order-form-box"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <CustomerOrderForm
              deliveryDate={deliveryDate}
              setDeliveryDate={setDeliveryDate}
              orderItem={orderItem}
              setOrderItem={setOrderItem}
              setSubmitStatus={setSubmitStatus}
              setZipValid={setZipValid}
              setDeliveryDateValid={setDeliveryDateValid}
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
                disabled={submitStatus === "incomplete"}
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
              >You can update your order during checkout.</Typography>
            </Box>
            <Box id="add-to-cart-checklist"
              display="flex"
              flexDirection="column"
              alignItems="flex-end"
            >
              <Box sx={{
                display: "flex",
                alignItems: "center",
              }}>
                <Typography id="delivery-date-check"
                  sx={{
                    my: 1,
                    mx: 1
                  }}
                >
                  Delivery date selected
                </Typography>
                {deliveryDateValid ? <CheckIconColored /> : <ErrorIconColored />}
              </Box>
              <Box sx={{
                display: "flex",
                alignItems: "center",
              }}>
                <Typography id="valid-zip-check"
                  sx={{
                    my: 1,
                    mx: 1
                  }}
                >
                  Zip code valid
                </Typography>
                {zipValid ? <CheckIconColored /> : <ErrorIconColored />}
              </Box>
              <Box sx={{
                display: "flex",
                alignItems: "center",
              }}>
                <Typography id="price-tier-check"
                  sx={{
                    my: 1,
                    mx: 1
                  }}
                >
                  Price tier selected
                </Typography>
                {priceSelected ? <CheckIconColored /> : <ErrorIconColored />}
              </Box>
            </Box>
            {(cart.cartItems && !!cart.cartItems.length) &&
              <>
                <Box id="cart-preview-box"
                  marginTop="25px"
                  marginBottom="35px"
                  textAlign="center"
                >
                  <Box id="cart-preview-toggle"
                    sx={{
                      background: "lightgrey",
                      borderRadius: "5px"
                    }}>
                    <Button
                      fullWidth
                      onClick={() => setCartPreviewOpen(!cartPreviewOpen)}
                      sx={{
                        textTransform: "none",
                        height: "30px",
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                      <Typography paddingX="10px" fontWeight={600} sx={{
                        fontSize: "0.8rem"
                      }}>View Cart Preview</Typography>
                      <ExpandMore
                        expand={cartPreviewOpen}
                        name="deliveryDate"
                        aria-label="Toggle delivery date input"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </Button>
                  </Box>
                  <Collapse in={cartPreviewOpen}>
                    <CartPreview />
                  </Collapse>
                </Box>
                <Link href="/checkout"
                  style={{
                    width: "100%",
                    marginBottom: "15px"
                  }}>
                  <Button id="checkout-button"
                    fullWidth
                    variant="contained">
                    Checkout
                  </Button>
                </Link>
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
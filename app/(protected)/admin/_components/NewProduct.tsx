"use client"

import { ChangeEvent, useState } from "react";

import Image from "next/image";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { UploadButton } from "./styled/UploadButton";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

const productTypes = [
  { label: "Vase" },
  { label: "Basket" },
  { label: "Loose" },
  { label: "Wreath" },
  { label: "Basket" },
  { label: "Sympathy" },
  { label: "Boutonniere" },
  { label: "Corsage" },
  { label: "Gift Basket" },
  { label: "Balloon - Mylar" },
  { label: "Balloon - Latex" },
  { label: "Miscellaneous" }
]

export default function NewProduct() {

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {

    const reader = new FileReader();
    const file = e.target.files?.[0];

    if (file) {
      // onloadend is triggered at the end of "readAsDataUrl";
      reader.onloadend = () => {
        const imageDataUrl = reader.result?.toString();
        console.log(reader.result);
        setPreviewUrl(imageDataUrl);
      }
      reader.readAsDataURL(file);
      reader.removeEventListener("loadend", reader.onloadend)
    };

  };

  // should upload picture 
  //  -> adds to supabase -> returns URL for updating product page
  // should have input fields for product name, description, and price
  // should have selectable fields for categories (at least 1)
  // -> updates "products" table with item & url from image.

  return (
    <Stack
      component={"form"}
      // border={"1px solid black"}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {previewUrl &&
        <Box
          // border={"1px dotted grey"}
          position="relative"
          height={"450px"}
        >
          <Image
            src={previewUrl}
            fill
            alt={"Image Preview"}
            objectFit="cover"
          />

        </Box>
      }
      <UploadButton
        handleUpload={handleUpload}
      />
      <Typography
        marginTop={"15px"}
      >
        Product Details:
      </Typography>
      <TextField
        id={"new-product-name"}
        label={"Product Name"}
        size="small"
        sx={{
          marginY: "5px"
        }}
      />
      <Autocomplete
        options={productTypes}
        renderInput={(params) => <TextField {...params}
          label={"Item Type"}
        />}
        size="small"
        sx={{
          marginY: "5px"
        }}
      />
      <TextField
        id={"new-product-description"}
        label={"Description"}
        sx={{
          marginY: "5px"
        }}
      />
      <Typography>
        Pricing:
      </Typography>
      <Grid
        container
      >
        <Grid xs={4} >
          <TextField
            id={"new-product-price-standard"}
            label={"Standard"}
            size="small"
          />
        </Grid>
        <Grid xs={4} >
          <TextField
            id={"new-product-price-standard"}
            label={"Premium"}
            size="small"
          />
        </Grid>
        <Grid xs={4} >
          <TextField
            id={"new-product-price-standard"}
            label={"Deluxe"}
            size="small"
          />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        sx={{
          marginY: "10px"
        }}
      >
        Add Product
      </Button>
    </Stack>

  )

}
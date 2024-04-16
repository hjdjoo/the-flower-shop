"use client"

import { ChangeEvent, useState } from "react";

import Image from "next/image";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { UploadButton } from "./styled/UploadButton";
import { GridItem } from "@/app/_components/styled/GridItem";
import PreviewBox from "./styled/PreviewBox";
import { Paper } from "@mui/material";


// ah! - these should be retrieved from the database...
// can do this in a useEffect
const productCategories = [
  { label: "Spring" },
  { label: "Summer" },
  { label: "Fall" },
  { label: "Winter" },
  { label: "Modern" },
  { label: "Classic" },
  { label: "Holiday" },
  { label: "Get Well" },
  { label: "Sympathy" },
  { label: "Event" },
  { label: "Wedding" },
  { label: "Romantic" },
]

interface ProductForm {
  name: string,
  categories: string[],
  description: string,
  prices: number[]
}

export default function NewProduct() {

  // should have selectable fields for categories (at least 1)
  // should have input fields for product name, description, and price

  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [newProductForm, setNewProductForm] = useState({
    productName: ""
  })


  const handlePreview = (e: ChangeEvent<HTMLInputElement>) => {

    const reader = new FileReader();
    const file = e.target.files?.[0];
    console.log("admin/components/NewProduct/handlePreview/file: ", file)

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

  const handleSubmit = () => {
    // should upload picture 
    //  -> adds to supabase -> returns URL for updating product page

    // -> updates "products" table with item & url from image.

  }


  return (
    <Paper
      sx={{
        padding: "10px"
      }}
    >
      <Stack
        id={""}
        component={"form"}
        // border={"1px solid black"}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {previewUrl &&
          <PreviewBox
            // border={"1px dotted grey"}
            previewUrl={previewUrl}
            id="upload-preview-box"
            position="relative"
            sx={{
              alignSelf: "center"
            }}
          />
        }
        <UploadButton
          handlePreview={handlePreview}
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
          options={productCategories}
          renderInput={(params) => <TextField {...params}
            label={"Category"}
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
          <GridItem xs={4} >
            <TextField
              id={"new-product-price-standard"}
              label={"Standard"}
              size="small"
            />
          </GridItem>
          <GridItem xs={4} >
            <TextField
              id={"new-product-price-standard"}
              label={"Premium"}
              size="small"
            />
          </GridItem>
          <GridItem xs={4} >
            <TextField
              id={"new-product-price-standard"}
              label={"Deluxe"}
              size="small"
            />
          </GridItem>
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
    </Paper>
  )

}
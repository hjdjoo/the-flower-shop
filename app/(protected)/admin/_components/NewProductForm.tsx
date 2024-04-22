"use client"

import { ChangeEvent, useState, useEffect } from "react";

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

import getCategories from "@/utils/supabase/clientActions/getCategories";
import uploadImage from "@/utils/supabase/clientActions/uploadImage";
import { CategoryData } from "@/app/types/db-types";
import { FileData, ProductForm } from "@/app/types/client-types";



export default function NewProduct() {

  // Should be able to add new categories.
  // should have input fields for product name, description, and price

  const [autocompleteCategories, setAutocompleteCategories] = useState<{ label: string }[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [fileData, setFileData] = useState<FileData | undefined>(undefined)
  const [newProductForm, setNewProductForm] = useState<ProductForm>({
    name: "",
    categories: [],
    description: "",
    prices: [],
    imageUrl: ""
  })

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getCategories();

        if (error || !data) {
          throw new Error(error?.message);
        }

        const categories = data.map((el) => {
          return { label: el.name };
        })
        setAutocompleteCategories(categories);

      }
      catch (error) {
        // handle errors - update Alert component with user alert state.
      }
    })();
  }, []);

  const handlePreview = (e: ChangeEvent<HTMLInputElement>) => {

    const reader = new FileReader();
    const file = e.target.files?.[0];
    // console.log("admin/components/NewProduct/handlePreview/file: ", file)

    if (file) {
      // onloadend is triggered at the end of "readAsDataUrl";
      reader.onloadend = () => {
        const imageDataUrl = reader.result?.toString();
        console.log(reader.result);

        const base64Data = imageDataUrl?.replace(/data:\S*;base64,/, "");

        const fileType = imageDataUrl?.replace(/data:/, "").replace(/;base64,\S*/, "");

        const ext = fileType?.slice(fileType.indexOf("/") + 1);

        console.log(ext)

        console.log(fileType);
        console.log(base64Data);
        setFileData({
          encodedData: base64Data,
          fileType: ext
        });
        setPreviewUrl(imageDataUrl);
      }
      reader.readAsDataURL(file);
      reader.removeEventListener("loadend", reader.onloadend)
    };

  };

  const handleSubmit = async () => {
    // should upload picture 
    const { name } = newProductForm;
    //  -> adds to supabase -> returns URL for updating product page
    const url = await uploadImage(name, fileData);
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
          options={autocompleteCategories}
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
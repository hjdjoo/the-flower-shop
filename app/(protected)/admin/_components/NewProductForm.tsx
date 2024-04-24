"use client"

import { ChangeEvent, useState, useEffect } from "react";

import Paper from "@mui/material/Paper";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';

import AddIcon from "@mui/icons-material/Add";
import CancelIcon from '@mui/icons-material/Cancel';

import { UploadButton } from "./styled/UploadButton";
import { GridItem } from "@/app/_components/styled/GridItem";
import PreviewBox from "./styled/PreviewBox";

import getCategories from "@/utils/supabase/clientActions/getCategories";
import uploadImage from "@/utils/supabase/clientActions/uploadImage";
import addProduct from "@/utils/supabase/clientActions/addProduct";
import { FileData, ProductForm, ErrorMessage } from "@/app/types/client-types";

export default function NewProduct() {

  /* Component states */
  const [autocompleteCategories, setAutocompleteCategories] = useState<{ id: number, label: string }[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [fileData, setFileData] = useState<FileData | undefined>(undefined)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [categories, setCategories] = useState<{ id: number, label: string }[]>([{ id: 1, label: "Default" }])
  const [newProductForm, setNewProductForm] = useState<ProductForm>({
    name: "",
    categories: [],
    description: "",
    standardPrice: "",
    premiumPrice: "",
    deluxePrice: "",
    imageUrl: ""
  })
  const [alertUser, setAlertUser] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  useEffect(() => {
    // immediately invoked async function to get categories upon first render
    (async () => {
      try {
        const { data, error } = await getCategories();

        if (error || !data) {
          throw new Error(error?.message);
        }

        const dbCategories = data.map((el) => {
          return { id: el.id, label: el.name };
        })
        setAutocompleteCategories(dbCategories);

      }
      catch (error) {
        // handle errors - update Alert component with user alert state.
        setAlertUser({
          severity: "error",
          message: `Something went wrong: ${error}`
        })
      }
    })();
  }, []);

  /* Component-specific async handlers */
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

  const handleImageUrl = async () => {

    const { name } = newProductForm;
    //  -> adds to supabase -> returns URL for updating product page
    const url = await uploadImage(name, fileData);
    // -> updates "products" table with item & url from image.
    if (!url) {
      throw new Error("Couldn't add image to database!")
    };
    setNewProductForm({ ...newProductForm, imageUrl: url });

  }

  const handleSubmit = async () => {
    try {
      const { data, error } = await addProduct(newProductForm);

      if (error || !data) {
        throw new Error(`Something went wrong! ${error?.message}`)
      }


      setAlertUser({
        severity: "success",
        message: "Product added!"
      });
      clearForm();

    }
    catch (error) {
      setAlertUser({
        severity: "error",
        message: `${error}`
      })
      clearForm();
    }
  }

  /* Synchronous handlers and utilities */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewProductForm({ ...newProductForm, [name]: value })
  }

  const handleAddCategory = (category: { id: number, label: string } | null) => {
    const newCategories = [...newProductForm.categories];
    if (!category) return;
    if (newProductForm.categories.includes(category.id)) {
      setAlertUser({
        severity: "warning",
        message: "Category already included!"
      })
      return;
    }
    else {
      newCategories[activeIdx!] = category.id;
      const updatedCategories = [...categories];
      updatedCategories[activeIdx!] = category;
      setCategories(updatedCategories);
      setNewProductForm({ ...newProductForm, categories: newCategories });
    };
  };

  const handleDeleteCategory = () => {

    const updatedCategories = categories.slice(0, activeIdx!).concat(categories.slice(activeIdx! + 1))
    setCategories(updatedCategories);
  }

  const addNewCategory = () => {

    const newCategory = { id: 1, label: "Default" }
    const renderCategories = [...categories];
    renderCategories.push(newCategory);
    setCategories(renderCategories);
  }

  const clearForm = () => {

    setNewProductForm({
      name: "",
      categories: [],
      description: "",
      standardPrice: "",
      premiumPrice: "",
      deluxePrice: "",
      imageUrl: ""
    });

    setCategories([{ id: 1, label: "Default" }]);

    setPreviewUrl(undefined);
  }

  /* Rendering inputs for adding new categories */
  const categoryInputs = categories.map((el, idx) => {
    return (
      <Box
        key={`category-box-${idx + 1}`}
        sx={{
          width: "100%",
          display: "flex",
        }}
        onClick={() => { setActiveIdx(idx) }}
      >
        <Autocomplete
          id={`category${idx + 1}`}
          value={categories[idx]}
          options={autocompleteCategories}
          renderInput={(params) =>
            <TextField {...params}
              label={"Category"}
            />
          }
          isOptionEqualToValue={(option, value) => option.label === value.label}
          size="small"
          sx={{
            marginY: "5px",
            flexGrow: "1"
          }}
          onChange={(_event, value) => handleAddCategory(value)}
        />
        <IconButton
          id={`delete-category-${idx + 1}`}
          onClick={handleDeleteCategory}
        >
          <CancelIcon />
        </IconButton>
      </Box>
    )
  })

  /* Main component */
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
          name="name"
          value={newProductForm.name}
          onChange={handleChange}
          size="small"
          sx={{
            marginY: "5px"
          }}
        />
        {categoryInputs}
        <Button
          fullWidth
          onClick={addNewCategory}
        >
          <AddIcon />
          Add Category
        </Button>
        <TextField
          id={"new-product-description"}
          label={"Description"}
          name="description"
          value={newProductForm.description}
          onChange={handleChange}
          sx={{
            marginY: "5px"
          }}
        />
        <Typography
          marginTop={"15px"}
          marginBottom={"15px"}
        >
          Pricing:
        </Typography>
        <Grid
          container
        >
          <GridItem xs={4} >
            <TextField
              id={"new-product-price-standard"}
              label={"Standard"}
              name="standardPrice"
              value={newProductForm.standardPrice}
              onChange={handleChange}
              size="small"
            />
          </GridItem>
          <GridItem xs={4} >
            <TextField
              id={"new-product-price-standard"}
              label={"Premium"}
              name="premiumPrice"
              value={newProductForm.premiumPrice}
              onChange={handleChange}
              size="small"
            />
          </GridItem>
          <GridItem xs={4} >
            <TextField
              id={"new-product-price-standard"}
              label={"Deluxe"}
              name="deluxePrice"
              value={newProductForm.deluxePrice}
              onChange={handleChange}
              size="small"
            />
          </GridItem>
        </Grid>

        <Button
          variant="contained"
          onClick={async () => {
            try {
              setFormSubmitting(true);
              await handleImageUrl();
              await handleSubmit()
              setFormSubmitting(false);
            } catch (error) {
              setAlertUser({
                severity: "error",
                message: `${error}`
              })
              setFormSubmitting(false);
            }
          }}
          sx={{
            marginY: "10px"
          }}
        >
          {formSubmitting ? <CircularProgress sx={{ color: "white" }} /> : "Add Product"}
        </Button>
        {alertUser.severity && <Alert
          severity={alertUser.severity}
          sx={{
            marginY: "10px",
          }}
        >
          {alertUser.message}
        </Alert>}
      </Stack>
    </Paper>
  )

}
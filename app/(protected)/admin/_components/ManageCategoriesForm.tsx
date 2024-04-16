
import { useState, useEffect } from "react";
import { MouseEvent, MouseEventHandler } from "react";

import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableFooter from "@mui/material/TableFooter";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Collapse from "@mui/material/Collapse";
import Switch from "@mui/material/Switch";
import CircularProgress from '@mui/material/CircularProgress';

import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';

import { createClient } from "@/utils/supabase/client";

interface CategoryData {
  name: string,
  is_active: boolean,
}

interface CategoryForm {
  name: string,
}

export default function ManageCategoriesForm() {

  const [categories, setCategories] = useState<Array<CategoryData | undefined>>([]);
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [editCategoriesForm, setEditCategoriesForm] = useState<CategoryData[]>([]);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [editCategories, setEditCategories] = useState<boolean>(false);

  useEffect(() => {

    getCategories();

  }, []);


  // Table row components
  const rows = categories.map((category, idx) => {
    return (
      <TableRow
        key={category?.name}
      >
        <TableCell>{category?.name}</TableCell>
        <TableCell>
          <Switch checked={category?.is_active} disabled={!editCategories}></Switch>
        </TableCell>
      </TableRow>
    )
  })

  /***** component functions *****/
  async function getCategories() {
    const supabase = createClient();
    const { data, error } = await supabase
      .schema("public")
      .from("product_categories")
      .select("name, is_active")

    if (error) return;

    setCategories([...data]);
  }

  async function updateCategories() {
    const supabase = createClient();



  }

  function clearForm() {
    setCategoryForm({ name: "" })
  }

  async function handleSubmit() {
    const supabase = createClient();

    setFormSubmitting(true);

    const { data, error } = await supabase
      .schema("public")
      .from("product_categories")
      .insert({ name: categoryForm.name });

    if (error) {
      // handle error - clear form and display error;
    }

    await getCategories();
    setFormSubmitting(false);
    clearForm();
  }

  return (
    <Paper
      sx={{
        padding: "10px"
      }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell>
                Active?
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows}
          </TableBody>
          <TableFooter>
            <TableRow>
              <IconButton>
                <EditIcon />
              </IconButton>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Stack
        sx={{
          marginTop: "15px"
        }}
      >
        <Collapse in={addCategory}>
          {addCategory &&
            <>
              <TextField
                label="New Category"
                name="name"
                value={categoryForm.name}
                onChange={(e) => {
                  e.preventDefault()
                  const { name, value } = e.target;
                  setCategoryForm({
                    ...categoryForm,
                    [name]: value
                  })
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                    >
                      <IconButton
                        onClick={() => {
                          setAddCategory(false);
                          clearForm();
                        }}
                      >
                        <CancelIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{
                  marginBottom: "15px",
                  width: "100%"
                }}
              />

            </>
          }
        </Collapse>
        <Button
          variant="contained"
          onClick={() => {
            switch (addCategory) {
              case false:
                setAddCategory(true);
                break;
              case true:
                handleSubmit();
                break;
            }
          }}
        >
          {formSubmitting ? <CircularProgress /> : "Add New Category"}
        </Button>
      </Stack>
    </Paper>
  )
}
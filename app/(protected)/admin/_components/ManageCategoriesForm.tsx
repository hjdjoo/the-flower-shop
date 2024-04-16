
import { useState, useEffect } from "react";
import { MouseEvent, MouseEventHandler, ChangeEvent } from "react";

import { styled } from "@mui/material";
import Box from "@mui/material/Box";
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { createClient } from "@/utils/supabase/client";

// Type interfaces:
interface CategoryData {
  id: number,
  name: string,
  is_active: boolean,
}

interface CategoryForm {
  name: string,
}

interface ErrorMessage {
  show: boolean,
  message: string
}

interface HeaderColumns {
  id: "category-id" | "category-name" | "category-active" | "delete-category",
  label: string,
  align: "left" | "center" | "right",
}

const headerCols: HeaderColumns[] = [
  {
    id: "category-id",
    label: "ID",
    align: "left",
  },
  {
    id: "category-name",
    label: "Name",
    align: "left",
  },
  {
    id: "category-active",
    label: "Active Status",
    align: "right"
  },
]

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function ManageCategoriesForm() {

  const [categories, setCategories] = useState<Array<CategoryData | undefined>>([]);
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [categoryForm, setCategoryForm] = useState({ name: "" });
  const [activeCategory, setActiveCategory] = useState<number | undefined>(undefined)
  const [editCategoriesForm, setEditCategoriesForm] = useState<CategoryData[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [editCategories, setEditCategories] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>({
    show: false,
    message: ""
  })

  useEffect(() => {

    getCategories();

  }, []);

  /***** component functions *****/
  async function getCategories() {
    const supabase = createClient();
    const { data, error } = await supabase
      .schema("public")
      .from("product_categories")
      .select("id, name, is_active")

    if (error) return;

    setCategories([...data.slice(1)]);
  }

  async function updateCategories() {
    const supabase = createClient();

  }

  async function deleteCategory(id: number) {
    const supabase = createClient();

    const { data, error } = await supabase
      .schema("public")
      .from("product_categories")
      .delete()
      .eq("id", id)

    if (error) {
      //handle error
    }

    setConfirmDelete(false);
    getCategories();
  }

  function clearForm() {
    setCategoryForm({ name: "" })
  }

  function handleUpdateCategories(e: ChangeEvent<HTMLElement>) {
    console.log(e.target.id)
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


  /***** Sub-components ******/

  const header = headerCols.map((col, idx) => {
    return (
      <TableCell key={col.id} id={col.id} align={col.align}>
        {col.label}
      </TableCell>
    )
  })

  const rows = categories.map((category) => {
    return (
      <StyledTableRow
        key={category?.name}
        hover
        onClick={() => {
          setActiveCategory(category?.id)
        }}
      >
        <TableCell sx={{ border: "none" }}>
          {category?.id}
        </TableCell>
        <TableCell sx={{ border: "none" }}>
          {
            editCategories ?
              <TextField defaultValue={category?.name} size="small" />
              : <Typography>
                {category?.name}
              </Typography>
          }
        </TableCell>
        <TableCell align="right"
          sx={{
            display: "flex",
            alignItems: "center",
            border: "none",
          }}
        >
          <Collapse
            in={editCategories}
            orientation="horizontal"
            style={{
              transitionDelay: "100ms",
              transitionDuration: "300ms"
            }}
          >
            <Box
              maxWidth="100%"
              height="100%"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}>
              <IconButton
                onClick={() => setConfirmDelete(true)}
              >
                <DeleteForeverIcon />
              </IconButton>
              {/* Dialog Box for confirming Delete */}
              <Dialog
                open={confirmDelete}
              >
                <DialogTitle>{"Delete Category?"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="delete-alert-description">
                    Deleting a category cannot be undone! Are you sure?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => deleteCategory(activeCategory!)}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => { setConfirmDelete(false) }}
                  >
                    Cancel
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Collapse>
          <Switch
            checked={category?.is_active}
            disabled={!editCategories}
            onChange={handleUpdateCategories}
          // sx={{ border: "1px solid grey" }}
          />
        </TableCell>
      </StyledTableRow>
    )
  })

  return (
    <Paper
      sx={{
        padding: "10px"
      }}>
      <Box
        width={"100%"}
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          borderBottom: "1px solid lightgrey"
        }}
      >
        <IconButton
          onClick={() => {
            setEditCategories(!editCategories)
          }}
        >
          <EditIcon />
        </IconButton>
      </Box>
      {/* Begin Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {header}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows}
          </TableBody>
          {/* Footer with "edit" and pagination features */}
          <TableFooter>
            <TableRow
              sx={{
                borderTop: "1px solid lightgrey",
              }}
            >
              <TableCell
                colSpan={3}
                size="small"
                align="right"
                sx={{
                  border: "none"
                }}
              >
                {editCategories &&
                  <Button
                    variant="outlined">
                    Save
                  </Button>
                }
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      {/* Table end; Add new Category */}
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
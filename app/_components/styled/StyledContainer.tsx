import { styled } from "@mui/material/styles";

import Container from "@mui/material/Container";

export const StyledContainer = styled(Container, {
  name: "MainContainer",
})(({ theme }) => ({
  [theme.breakpoints.between('xs', 'sm')]: {
    maxWidth: "500px",
  },
  [theme.breakpoints.between('sm', 'md')]: {
    maxWidth: "650px",
  },
  [theme.breakpoints.up('md')]: {
    maxWidth: "800px",
  },
}))

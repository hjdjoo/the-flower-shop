import Box from "@mui/material/Box";
import Typography from "@mui/material/Box";
import { useTheme } from "@mui/material";

export default function CartPreview() {

  // interesting note -- if you call "useTheme" in a parent component, MUI components in child components will not apply any theming unless specifically directed.
  const theme = useTheme();

  return (
    <Box
      marginTop="15px"
      height="auto"
      display="flex"
      justifyContent="center"
      border="1px solid black"
    >
      <Typography
        fontFamily={theme.typography.fontFamily}
      >
        <br />
        <br />
        CART PREVIEW!!
        <br />
        <br />
        <br />
      </Typography>
    </Box>
  )
}
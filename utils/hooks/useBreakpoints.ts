import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material";

export default function useBreakpoints() {

  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.between("xs", "md"));
  const large = useMediaQuery(theme.breakpoints.between("md", "lg"));
  const xlarge = useMediaQuery(theme.breakpoints.up("lg"));

  return { mobile: mobile, large: large, xlarge: xlarge }

}
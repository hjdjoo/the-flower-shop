import useMediaQuery from "@mui/material/useMediaQuery"
import { type Theme } from "@mui/material";

export default function useBreakpoints() {

  const mobile = useMediaQuery((theme: Theme) => theme.breakpoints.between("xs", "sm"));
  const tablet = useMediaQuery((theme: Theme) => theme.breakpoints.between("sm", "md"))
  const large = useMediaQuery((theme: Theme) => theme.breakpoints.between("md", "lg"));
  const xlarge = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  return { mobile: mobile, tablet: tablet, large: large, xlarge: xlarge }

}
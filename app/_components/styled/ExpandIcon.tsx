import { IconButton, styled } from "@mui/material";
import { IconButtonProps } from "@mui/material";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

export const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginleft: "auto",
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}))
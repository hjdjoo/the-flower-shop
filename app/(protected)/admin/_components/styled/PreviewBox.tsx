import Image from "next/image";
import Box, { BoxProps } from "@mui/material/Box"
import { styled } from "@mui/material/styles";

interface PreviewBoxProps extends BoxProps {
  previewUrl: string
}

export default function PreviewBox(props: PreviewBoxProps) {

  const StyledBox = styled(Box, {
    name: "PreviewBox",
    slot: "root"
  })(({ theme }) => ({
    [theme.breakpoints.between('xs', 'sm')]: {
      minWidth: "350px",
      minHeight: "350px",
      maxWidth: "450px",
      maxHeight: "450px",
    },
    [theme.breakpoints.between('sm', 'md')]: {
      minWidth: "450px",
      minHeight: "450px",
      maxWidth: "650px",
      maxHeight: "650px",
    },
    [theme.breakpoints.up('md')]: {
      minWidth: "650px",
      minHeight: "650px",
      maxWidth: "800px",
      maxHeight: "800px",
    },
    marginBottom: "10px",
    alignSelf: "center",
    position: "relative",
  })) as typeof Box

  const StyledImage = styled(Image, {
    name: "PreviewBox",
    slot: "image",
  })(({ theme }) => ({
    [theme.breakpoints.between('xs', 'sm')]: {
      minWidth: "200px",
      maxWidth: "350px",
    },
    [theme.breakpoints.between('sm', 'md')]: {
      minWidth: "350px",
      maxWidth: "650px",
    },
    [theme.breakpoints.up('md')]: {
      minWidth: "500px",
      maxWidth: "800px",
    },
  }))

  return (
    <StyledBox >
      <StyledImage
        id="upload-preview"
        src={props.previewUrl}
        fill
        alt={"Image Preview"}
        style={{
          objectFit: "contain"
        }}
      />
    </StyledBox>
  )
}
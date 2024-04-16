"use client"
import { ChangeEventHandler } from "react";
// import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button"
import FileUploadIcon from '@mui/icons-material/FileUpload';


interface UploadButtonProps extends ButtonProps {
  handlePreview: ChangeEventHandler<HTMLInputElement>
}

const UploadButton = (props: UploadButtonProps) => {
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<FileUploadIcon />}
    >
      Upload Image
      <input
        id="upload-image"
        hidden
        accept="image/*"
        type="file"
        onChange={props.handlePreview}
      />
    </Button>
  )
}

export {
  UploadButton
};
"use client"

import Image from "next/image";

import { useEffect, useState, ChangeEvent } from "react";

import Container from "@mui/material/Container";

import { UploadButton } from "../../_components/styled/UploadButton";
import PreviewBox from "../../_components/styled/PreviewBox";
import { uploadPreview } from "../../actions/handlePreview";

import { FileData } from "@/app/types/client-types";

export default function UpdateCarouselPage() {

  const [fileData, setFileData] = useState<FileData | undefined>({
    encodedData: "",
    fileType: ""
  })
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  /* Component-specific async handlers */
  const handlePreview = (e: ChangeEvent<HTMLInputElement>) => {

    const reader = new FileReader();
    const file = e.target.files?.[0];

    if (file) {
      // onloadend is triggered at the end of "readAsDataUrl";
      reader.onloadend = () => {
        const imageDataUrl = reader.result?.toString();
        // console.log(reader.result);

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

  return (
    <Container
      sx={{
        marginTop: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {previewUrl && <PreviewBox previewUrl={previewUrl!} />}
      <UploadButton
        handlePreview={handlePreview}
      />
    </Container>
  )
}
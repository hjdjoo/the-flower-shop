"use client"

import Image from "next/image";

import { useEffect, useState, ChangeEvent } from "react";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { InputField } from "@/app/_components/styled/InputField";

import UploadButton from "./styled/UploadButton";
import PreviewBox from "./styled/PreviewBox";
import BackgroundBanner from "@/app/_components/BackgroundBanner";

import uploadBannerImage from "@/utils/supabase/clientActions/uploadBannerImage";

import { createClient } from "@/utils/supabase/client";

import { FileData, ErrorMessage } from "@/app/types/client-types";


export default function NewBannerImageForm() {

  const [fileData, setFileData] = useState<FileData | undefined>({
    encodedData: "",
    fileType: ""
  });
  const [bannerName, setBannerName] = useState<string>("");
  const [bannerUrls, setBannerUrls] = useState<string[] | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [userAlert, setUserAlert] = useState<ErrorMessage>({
    severity: undefined,
    message: ""
  })

  useEffect(() => {


  })

  /*Preview handler - wanted to modularize this but had trouble maintaining state.*/
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

  const handleUpload = async () => {
    try {
      const urls = await uploadBannerImage(bannerName, fileData);
      // setBannerUrls(urls);
    }
    catch (error) {
      setUserAlert({
        severity: "error",
        message: `${error}`
      })
    }
  }

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
        id="preview-upload-button"
        handlePreview={handlePreview}
      />
      {previewUrl &&
        <>
          {/* This should be refactored to select from categories */}
          <InputField
            id="banner-name-input"
            label="Banner name"
            onChange={(e) => {
              setBannerName(e.target.value);
            }}
            value={bannerName}
          />
          <Button
            id="banner-upload-button"
            variant="contained"
            onClick={handleUpload}
          >
            Add To Carousel
          </Button>
        </>
      }
      {

      }
    </Container>
  )
}

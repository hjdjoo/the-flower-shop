import { ChangeEvent } from "react";

import { FileData } from "@/app/types/client-types";

export interface PreviewData {
  fileData: FileData
  imageDataUrl: string | undefined
}

export const uploadPreview = (e: ChangeEvent<HTMLInputElement>): PreviewData => {

  const reader = new FileReader();
  const file = e.target.files?.[0];
  // console.log("admin/components/NewProduct/handlePreview/file: ", file)
  const output: PreviewData = {
    fileData: { encodedData: "", fileType: "" },
    imageDataUrl: ""
  };

  if (file) {
    // onloadend is triggered at the end of "readAsDataUrl";
    reader.onloadend = () => {
      const imageDataUrl = reader.result?.toString();
      console.log(reader.result);

      const base64Data = imageDataUrl?.replace(/data:\S*;base64,/, "");

      const fileType = imageDataUrl?.replace(/data:/, "").replace(/;base64,\S*/, "");

      const ext = fileType?.slice(fileType.indexOf("/") + 1);

      output.fileData.encodedData = base64Data;
      output.fileData.fileType = ext;
      output.imageDataUrl = imageDataUrl;

    }
    reader.readAsDataURL(file);
    reader.removeEventListener("loadend", reader.onloadend)
  };
  return output;
};
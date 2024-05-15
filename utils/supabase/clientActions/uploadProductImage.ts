
import { createClient } from "../client";
import { decode } from "base64-arraybuffer";
import { FileData } from "@/app/types/client-types";
import { getUrls } from "./getUrls";
import normalizeCasing from "@/utils/actions/normalizeCasing";

export default async function uploadProductImage(fileName: string, fileData: FileData | undefined): Promise<string> {
  // uploads image to storage and returns public URL
  if (!fileData?.encodedData) {
    throw new Error("No file to upload!")
  }

  const supabase = createClient();

  const { error } = await supabase
    .storage
    .from("products")
    .upload(`/${fileName}.${fileData.fileType}`, decode(fileData.encodedData), {
      contentType: `image/${fileData.fileType}`
    })

  if (error) {
    throw new Error(`Couldn't upload file to database. Error: ${error.message}`)
  }

  const { data } = await getUrls([`${fileName}.${fileData.fileType}`], "products");

  if (!data) {
    throw new Error("Couldn't get URL for this product")
  }

  const url = data[0];

  return url;
}
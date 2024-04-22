
import { createClient } from "../client";
import { decode } from "base64-arraybuffer";
import { FileData } from "@/app/types/client-types";
import { getUrl } from "./getUrl";

export default async function uploadImage(fileName: string, fileData: FileData | undefined): Promise<string> {
  // uploads image to storage and returns public URL
  if (!fileData?.encodedData) {
    throw new Error("No file to upload!")
  }

  const supabase = createClient();

  const { error } = await supabase
    .storage
    .from("products")
    .upload(`${fileName}.${fileData.fileType}`, decode(fileData.encodedData))

  if (error) {
    throw new Error("Couldn't upload file to database.")
  }

  const url = await getUrl(`${fileName}.${fileData.fileType}`);

  return url;
}
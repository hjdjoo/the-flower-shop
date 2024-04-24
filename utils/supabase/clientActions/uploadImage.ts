
import { createClient } from "../client";
import { decode } from "base64-arraybuffer";
import { FileData } from "@/app/types/client-types";
import { getUrl } from "./getUrl";
import normalizeCasing from "@/utils/actions/normalizeCasing";

export default async function uploadImage(fileName: string, fileData: FileData | undefined): Promise<string> {
  // uploads image to storage and returns public URL
  if (!fileData?.encodedData) {
    throw new Error("No file to upload!")
  }

  const supabase = createClient();

  const { error } = await supabase
    .storage
    .from("products")
    .upload(`public/${fileName}.${fileData.fileType}`, decode(fileData.encodedData), {
      contentType: `image/${fileData.fileType}`
    })

  if (error) {
    throw new Error(`Couldn't upload file to database. Error: ${error.message}`)
  }

  const url = await getUrl(`${fileName}.${fileData.fileType}`);

  return url;
}
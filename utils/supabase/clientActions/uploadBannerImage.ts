
import { createClient } from "../client";
import { decode } from "base64-arraybuffer";
import { FileData } from "@/app/types/client-types";
import { getBanners } from "./getBanners";
import { getUrls } from "./getUrls";

export default async function uploadBannerImage(fileName: string, fileData: FileData | undefined): Promise<string[]> {
  // uploads image to storage and returns public URL
  if (!fileData?.encodedData) {
    throw new Error("No file to upload!")
  }
  if (!fileName) {
    throw new Error("Please enter a name!")
  }

  const supabase = createClient();

  const { error } = await supabase
    .storage
    .from("banner_images")
    .upload(`/${fileName}.${fileData.fileType}`, decode(fileData.encodedData), {
      contentType: `image/${fileData.fileType}`
    })

  if (error) {
    throw new Error(`Couldn't upload file to database. Error: ${error.message}`)
  }

  else {
    const { data: banners } = await getBanners();
    if (!banners) {
      throw new Error("Couldn't get banners")
    }
    const { data: urls } = await getUrls(banners, "banner_images");
    if (!urls) {
      throw new Error("Couldn't get banner URLS")
    }
    return urls;
  };
}
import { ImageLoader, ImageLoaderProps } from "next/image";

export const imageLoader: ImageLoader = ({ src, width, quality }: ImageLoaderProps) => {

  // console.log(src, width, quality)

  return `${src}?w=${width}&q=${quality || 75}`

}
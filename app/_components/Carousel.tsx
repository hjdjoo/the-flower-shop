import { CarouselBox, CarouselItem } from './styled/CarouselComponents';
import Box from "@mui/material/Box";
import Image, { ImageProps } from 'next/image';
import type { ImageLoader, ImageLoaderProps } from 'next/image';

type CarouselProps = {
  category: string
}

export function Carousel(props: CarouselProps) {

  // const { imageUrls } = props;
  // console.log('Carousel.tsx - imageUrls: ', imageUrls);
  // console.log('Carousel/imageUrls: ', imageUrls)
  // const images = imageUrls?.map((url: string, i: number) => {

  //   return (
  //     <CarouselItem
  //       key={`blankImg-${i}`}
  //     >
  //       <Image loader={({ src, width, quality }: ImageLoaderProps): string => `${src}?w=${width}`} src={url} alt={`test image ${i}`} width={150} height={150}></Image>
  //     </CarouselItem>
  //   )
  // })

  return (

    <CarouselBox>
      {/* {images} */}
    </CarouselBox >

  )

}
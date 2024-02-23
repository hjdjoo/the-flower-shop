import * as dotenv from 'dotenv';
dotenv.config();

import { StyledImageList, StyledListItem } from './styledComponents';
import Box from "@mui/material/Box";
import Image, { ImageProps } from 'next/image';


type CarouselProps = {
  imageUrls: string[] | undefined
}

export function Carousel(props: CarouselProps) {

  const { imageUrls } = props

  console.log('Carousel/imageUrls: ', imageUrls)


  const testImages = imageUrls?.map((url: string, i: number) => {

    console.log('imageUrls.map/url: ', url)

    return (
      <StyledListItem
        key={`blankImg-${i}`}
      >
        <Image src={url} alt={`test image ${i}`} width={150} height={150}></Image>
      </StyledListItem>
    )
  })

  return (

    <StyledImageList>
      {testImages}
    </StyledImageList >

  )

}
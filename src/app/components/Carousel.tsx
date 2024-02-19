import * as dotenv from 'dotenv';
dotenv.config();

import { StyledImageList, StyledListItem } from './styledComponents';
import Box from "@mui/material/Box";
import Image, { ImageProps } from 'next/image';


type CarouselProps = {
  imageUrls: string[] | undefined
}


export async function Carousel(props: CarouselProps) {

  const { imageUrls } = props

  // Promise.resolve(imageUrls)

  // console.log('Carousel/imagePromises: ', imagePromises)

  // const imageUrls = Promise.all(imagePromises);

  // console.log('Carousel/imageUrls: ', imageUrls)



  // const StyledListItemBar = styled("div")({
  //   width: 

  // })

  // const blankArr = Array(10).fill('');

  // const blankImgs = imageUrls.map((url: string, i: number) => {
  //   return (
  //     <StyledListItem
  //       key={`blankImg-${i}`}
  //     >
  //       {/* <Image src={url}></Image> */}
  //     </StyledListItem>
  //   )
  // })

  return (

    <StyledImageList>
      {/* {blankImgs} */}
    </StyledImageList >

  )

}
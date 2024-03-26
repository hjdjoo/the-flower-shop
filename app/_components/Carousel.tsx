"use client"

// import { useEffect, useState } from 'react';

import * as dotenv from 'dotenv';
dotenv.config();

import { StyledImageList, StyledListItem } from './styledComponents';
import Box from "@mui/material/Box";
import Image, { ImageProps } from 'next/image';
import type { ImageLoader, ImageLoaderProps } from 'next/image';

type CarouselProps = {
  imageUrls: string[] | undefined
}

// const loader: ImageLoader = async ({ src }: ImageLoaderProps) => {
//   "use server";
//   return src;
// }

// There is an unexpected behavior in the browser when a user is using a mac device and has configured to swipe between pages with 2 fingers. Because this is also the default "scroll" behavior, it will swipe to the previous page. Wondering if this is a big enough issue for users browsing on personal laptops to be of concern. Will come back to this to test.

export function Carousel(props: CarouselProps) {

  const { imageUrls } = props;
  // console.log('Carousel.tsx - imageUrls: ', imageUrls);
  // console.log('Carousel/imageUrls: ', imageUrls)
  const images = imageUrls?.map((url: string, i: number) => {

    return (
      <StyledListItem
        key={`blankImg-${i}`}
      >
        <Image loader={({ src, width, quality }: ImageLoaderProps): string => `${src}?w=${width}`} src={url} alt={`test image ${i}`} width={150} height={150}></Image>
      </StyledListItem>
    )
  })

  return (

    <StyledImageList>
      {images}
    </StyledImageList >

  )

}
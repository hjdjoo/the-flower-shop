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

export function Carousel(props: CarouselProps) {

  const { imageUrls } = props
  console.log('Carousel.tsx - imageUrls: ', imageUrls);
  // console.log('Carousel/imageUrls: ', imageUrls)

  const testImages = imageUrls?.map((url: string, i: number) => {

    // console.log('imageUrls.map/url: ', url)

    return (
      <StyledListItem
        key={`blankImg-${i}`}
      >
        <Image loader={(): string => url} src={url} alt={`test image ${i}`} width={150} height={150}></Image>
      </StyledListItem>
    )
  })

  return (

    <StyledImageList>
      {testImages}
    </StyledImageList >

  )

}
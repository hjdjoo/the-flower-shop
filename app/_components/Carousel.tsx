
import { useState, useEffect } from 'react';
import { CarouselBox, CarouselItem } from './styled/CarouselComponents';
import Box from "@mui/material/Box";
import Image, { ImageProps } from 'next/image';
import type { ImageLoader, ImageLoaderProps } from 'next/image';
// import ProductDat
import { HomepageCategory, ProductData } from '../types/client-types';
import getCategoryImages from '@/utils/supabase/clientActions/getCategoryImages';

type CarouselProps = {
  category: HomepageCategory
}

export function Carousel(props: CarouselProps) {

  const { name, id } = props.category;
  const [productData, setProductData] = useState<ProductData[]>([])

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getCategoryImages(id);

        if (error || !data) {
          throw new Error(`Couldn't get images from DB! Error: ${error?.message}`)
        }

        setProductData(data);
      } catch (error) {
        // handle error...
      }
    })()

  }, [id])

  const products = productData.map((data, idx) => {

    console.log(data.image_url)

    return (
      <CarouselItem
        key={`${name}-product-${idx + 1}`}
      >
        <Image
          loader={({ src, width, quality }: ImageLoaderProps): string => `${src}?w=${width}`}
          src={data.image_url}
          alt={`${name} product ${idx + 1}`}
          fill />
      </CarouselItem>
    )
  })

  return (
    <CarouselBox>
      {products}
    </CarouselBox >
  )

}

import { useState, useEffect } from 'react';
import { CarouselBox, CarouselItem } from './styled/CarouselComponents';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Image from 'next/image';
import type { ImageLoaderProps } from 'next/image';
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
        console.log('Carousel/data: ', data)
        setProductData(data);
      } catch (error) {
        // handle error...
      }
    })()

  }, [id])

  const products = productData.map((data, idx) => {

    return (
      <CarouselItem
        key={`${name}-product-${idx + 1}`}
      >
        <Typography>
          {data.name}
        </Typography>

        <Image
          loader={({ src, width }: ImageLoaderProps): string => (`${src}?w=${width}`)}
          src={data.image_url}
          alt={`${name} product ${idx + 1}`}
          style={{
            objectFit: "contain"
          }}
          width={250}
          height={350}
        />
      </CarouselItem>
    )
  })

  return (
    <Paper
      id={`${name}-carousel-container`}
    >
      <Typography
        sx={{
          margin: "10px",
          fontSize: "1.3rem"
        }}
      >
        {name}
      </Typography>
      <CarouselBox>
        {products}
      </CarouselBox >
    </Paper>
  )

}
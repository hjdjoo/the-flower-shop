
import { useState, useEffect } from 'react';

import Image from 'next/image';
import type { ImageLoaderProps } from 'next/image';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";


import { useTheme } from '@mui/material';

import { CarouselBox, CarouselItem } from './styled/CarouselComponents';
import PricePicker from './PricePicker';
import { HomepageCategory } from '../types/client-types';
import { ProductData } from '../types/db-types';
import { getCategoryItems } from '@/utils/supabase/clientActions/getCategoryItems';

type CarouselProps = {
  category: HomepageCategory
}

export function Carousel(props: CarouselProps) {

  const theme = useTheme();

  const { name, id } = props.category;
  const [productData, setProductData] = useState<ProductData[]>([])
  const [showButton, setShowButton] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getCategoryItems(id);

        if (error || !data) {
          throw new Error(`Couldn't get images from DB! Error: ${error?.message}`)
        }
        // console.log('Carousel/data: ', data)
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
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
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
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <PricePicker
            name={data.name}
            id={data.id}
            standardPrice={data.standard_price}
            premiumPrice={data.premium_price}
            deluxePrice={data.deluxe_price}
          />
          <Button
            variant="outlined"
            sx={{
              width: "80%"
            }}
          >
            Add to Cart
          </Button>
        </Box>
      </CarouselItem>
    )
  })

  return (
    <Paper
      id={`${name}-carousel-container`}
      sx={{
        paddingTop: "10px",
        marginBottom: "25px",
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          paddingLeft: "15px",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontStyle: "italic",
          }}
        >
          {name}
        </Typography>
      </Box>
      <CarouselBox
        sx={{
          display: "flex"
        }}
      >
        {products}
      </CarouselBox >
    </Paper>
  )

}
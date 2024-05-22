
import { useState, useEffect, SyntheticEvent } from 'react';

import Image from 'next/image';
import type { ImageLoaderProps } from 'next/image';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useTheme } from '@mui/material';

import * as CarouselComp from './styled/CarouselComponents';
import PricePicker from './PricePicker';
import { HomepageCategory, ProductData } from '../types/client-types';
import getCategoryImages from '@/utils/supabase/clientActions/getCategoryImages';

type CarouselProps = {
  category: HomepageCategory
}

export function Carousel(props: CarouselProps) {

  const theme = useTheme();
  const CardTextStyles = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '8px',
    boxSizing: 'border-box',
    textAlign: 'center',
  };


  const { name, id } = props.category;
  const [productData, setProductData] = useState<ProductData[]>([])
  const [showButton, setShowButton] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getCategoryImages(id);

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

  const handleScroll = (event: SyntheticEvent<HTMLButtonElement, MouseEvent>, translateX: number) => {
    if (event.target instanceof HTMLButtonElement) {
      event.target.parentElement?.scrollBy({
        left: (translateX),
        top: 0,
        behavior: 'smooth'
      })
    } 
    
    if (event.target !instanceof HTMLButtonElement) { // if user clicks on svg of button
      event.target.parentElement?.parentElement?.scrollBy({
        left: (translateX),
        top: 0,
        behavior: 'smooth'
      })
    }
  };

  const products = productData.map((data, idx) => {
    return (
      <CarouselComp.CarItem
        key={`${name}-product-${idx + 1}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          loader={({ src, width }: ImageLoaderProps): string => (`${src}?w=${width}`)}
          src={data.image_url}
          alt={`${name} product ${idx + 1}`}
          width={250}
          height={350}
        />
        <Typography variant='h5' component='h5' sx={{CardTextStyles}}>
          {data.name}
        </Typography>
        <Typography component='p' sx={{CardTextStyles}}>
          {`$${data.standard_price}`}
        </Typography>
        {/* <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
        </Box> */}
      </CarouselComp.CarItem>
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
      <CarouselComp.CarBox sx={{ display: "flex" }}>
        <CarouselComp.CarButton 
          onClick={(event) => {handleScroll(event, -500)}}
          disableRipple
          sx={{ left: 0 }}
        >
          <CarouselComp.CarPrevIcon fontSize='large'/>
        </CarouselComp.CarButton>
          {products}
        <CarouselComp.CarButton 
          onClick={(event) => {handleScroll(event, 500)}}
          disableRipple
          sx={{ right: 0 }}
        >
          <CarouselComp.CarNextIcon fontSize='large'/>
        </CarouselComp.CarButton>
      </CarouselComp.CarBox >
    </Paper>
  )

}
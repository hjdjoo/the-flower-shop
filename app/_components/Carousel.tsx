
import { useState, useEffect } from 'react';

import Image from 'next/image';
import type { ImageLoaderProps } from 'next/image';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined'
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';

import { useTheme } from '@mui/material';

import { CarouselBox, CarouselItem } from './styled/CarouselComponents';
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

  const handleScroll = (e: any, translateX: number) => {
    if (e.target instanceof HTMLButtonElement) {
      e.target.parentElement.scrollBy({
        left: (translateX),
        top: 0,
        behavior: 'smooth'
      })
    } else { // if user clicks on svg of button
      e.target.parentElement.parentElement.scrollBy({
        left: (translateX),
        top: 0,
        behavior: 'smooth'
      })
    }
  };

  const products = productData.map((data, idx) => {
    return (
      <CarouselItem
        key={`${name}-product-${idx + 1}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* <Typography>
          {data.name}
        </Typography> */}
        <Image
          loader={({ src, width }: ImageLoaderProps): string => (`${src}?w=${width}`)}
          src={data.image_url}
          alt={`${name} product ${idx + 1}`}
          // style={{
          //   objectFit: "contain"
          // }}
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
      <CarouselBox sx={{ display: "flex" }}
      >
        <IconButton 
          onClick={(event) => {handleScroll(event, -500)}}
          sx={{
            position: 'absolute',
            color: 'black',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            left: 0,
            borderRadius: 0,
            height: 400,
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white'
          }
        }}>
          <ArrowBackIosOutlinedIcon 
            fontSize='large'
            sx={{
              position: 'relative',
              bottom: '30px'
            }}
          />
        </IconButton>
          {products}
        <IconButton 
          onClick={(event) => { handleScroll(event, 500) }}
          sx={{
            position: 'absolute',
            color: 'black',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            right: 0,
            borderRadius: 0,
            height: 400,
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white'
            }
          }}
        >
          <ArrowForwardIosOutlinedIcon 
            fontSize='large'
            sx={{
              position: 'relative',
              bottom: '30px'
            }}
          />
        </IconButton>
      </CarouselBox >
    </Paper>
  )

}
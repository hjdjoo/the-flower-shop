
import { useState, useEffect } from 'react';

import Image from 'next/image';
import type { ImageLoaderProps } from 'next/image';

import { useRouter } from 'next/navigation';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useTheme } from '@mui/material';

import * as CarouselComp from './styled/CarouselComponents';
import PricePicker from './PricePicker';
import { HomepageCategory } from '../types/client-types';
import { ProductData } from '../types/db-types';
import { getCategoryItems } from '@/utils/supabase/clientActions/getCategoryItems';

type CarouselProps = {
  category: HomepageCategory
}

export function Carousel(props: CarouselProps) {

  const router = useRouter();

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

  // i think document.getElementById can be refactored with a useRef for slightly cleaner syntax - might be nice to look into.
  const handleScroll = (carouselName: string, translateX: number) => {
    document.getElementById(`${carouselName}-carousel`)?.scrollBy({
      left: (translateX),
      top: 0,
      behavior: 'smooth'
    })
  };

  const products = productData.map((data, idx) => {
    return (
      <CarouselComp.CarItem
        id={`${data.name}-product`}
        key={`${name}-product-${idx + 1}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onClick={() => router.push(`products/${data.id}`)}
      >
        <Box
          className="image-box"
          sx={{
            [theme.breakpoints.between("xs", "sm")]: {
              width: "150px",
            },
            [theme.breakpoints.between("sm", "md")]: {
              width: "175px",
            },
            [theme.breakpoints.up("md")]: {
              width: "250px",
            },
          }}
        >
          <Image
            id={`${data.name}-image`}
            className="responsive-image"
            loader={({ src, width }: ImageLoaderProps): string => (`${src}?w=${width}`)}
            src={data.image_url}
            alt={`${name} product ${idx + 1}`}
            fill
            style={{
              objectFit: "contain"
            }}
          />
        </Box>
        <Typography component='p' sx={{
          [theme.breakpoints.between("xs", "sm")]: {
            fontSize: "0.8rem"
          },
          [theme.breakpoints.between("sm", "md")]: {
            fontSize: "0.9rem"
          },
          [theme.breakpoints.up("md")]: {
            fontSize: "1rem"
          },
        }}>
          {data.name}
        </Typography>
        <Typography component='p'
          sx={{
            [theme.breakpoints.between("xs", "sm")]: {
              fontSize: "0.7rem"
            },
            [theme.breakpoints.between("sm", "md")]: {
              fontSize: "0.8rem"
            },
            [theme.breakpoints.up("md")]: {
              fontSize: "0.9rem"
            },
          }}>
          {`$${data.standard_price}`}
        </Typography>
      </CarouselComp.CarItem>
    )
  })

  return (
    <Paper
      id={`${name}-carousel-container`}
      sx={{
        marginBottom: "25px",
      }}
    >
      <Box
        className="carousel-header-box"
        id={`${name}-carousel-header-box`}
        marginBottom="10px"
        sx={{
          backgroundColor: `${theme.palette.secondary.main}`,
          display: "flex",
          justifyContent: "flex-start",
          paddingLeft: "15px",
        }}
      >
        <Typography
          className="carousel-name"
          sx={{
            color: "white",
            [theme.breakpoints.between("xs", "sm")]: {
              fontSize: "1rem"
            },
            [theme.breakpoints.between("sm", "md")]: {
              fontSize: "1.1rem"
            },
            [theme.breakpoints.up("md")]: {
              fontSize: "1.3rem"
            },
          }}
        >
          {name}
        </Typography>
      </Box>
      <CarouselComp.CarBox id={`${name}-carousel`}
        sx={{ display: "flex", alignItems: "flex-end" }}>
        <CarouselComp.CarButton
          onClick={() => { handleScroll(name, -500) }}
          disableRipple
          sx={{
            left: 0,
          }}
        >
          <CarouselComp.CarPrevIcon sx={{
            [theme.breakpoints.between("xs", "sm")]: {
              fontSize: "1.2rem"
            },
            [theme.breakpoints.between("sm", "md")]: {
              fontSize: "1.5rem"
            },
          }} />
        </CarouselComp.CarButton>
        {products}
        <CarouselComp.CarButton
          onClick={() => { handleScroll(name, 500) }}
          disableRipple
          sx={{ right: 0 }}
        >
          <CarouselComp.CarNextIcon sx={{
            [theme.breakpoints.between("xs", "sm")]: {
              fontSize: "1.2rem"
            },
            [theme.breakpoints.between("sm", "md")]: {
              fontSize: "1.5rem"
            },
          }} />
        </CarouselComp.CarButton>
      </CarouselComp.CarBox >
    </Paper >
  )

}
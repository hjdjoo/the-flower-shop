
import { useState, useEffect } from 'react';

import Image from 'next/image';
import type { ImageLoaderProps } from 'next/image';

import { useRouter } from 'next/navigation';

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";

import { useTheme } from '@mui/material';

import { ExpandMore } from './styled/ExpandIcon';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as CarouselComp from './styled/CarouselComponents';

import useBreakpoints from '@/utils/hooks/useBreakpoints';

import { HomepageCategory } from '../types/client-types';
import { ProductData } from '../types/db-types';
import { getCategoryItems } from '@/utils/supabase/clientActions/getCategoryItems';

type CarouselProps = {
  category: HomepageCategory
}

export function Carousel(props: CarouselProps) {

  const [viewCategory, setViewCategory] = useState<boolean>(false)

  const router = useRouter();
  const theme = useTheme();
  const { mobile, large, xlarge } = useBreakpoints();


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
        className="product"
        key={`${name}-product-${idx + 1}`}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          className="image-box"
          onClick={() => router.push(`products/${data.id}`)}
          sx={{
            minWidth: () => {
              if (mobile) return "130px";
              else if (large) return "175px";
              else if (xlarge) return "250px";
            },
            maxWidth: () => {
              if (mobile) return "130px";
              else if (large) return "175px";
              else if (xlarge) return "250px";
            },
          }}
          position="relative"
        >
          <Image
            id={`${data.name}-image`}
            className="product-image"
            loader={({ src, width }: ImageLoaderProps): string => (`${src}?w=${width}`)}
            src={data.image_url}
            alt={`${name} product ${idx + 1}`}
            fill
            style={{
              objectFit: "contain"
            }}
            sizes={"(max-width: 850) "}
            priority={idx < 5}
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
    <Box
      id={`${name}-carousel-container`}
      className="carousel-container"
      sx={{
        backgroundColor: "white",
        marginBottom: name === "Bestsellers" ? "0px" : "5px",
        width: () => {
          if (mobile) return "100%";
        },
        marginX: () => {
          if (mobile) return "0%";
          if (large) return "10%";
          if (xlarge) return "15%";
        }
      }}
    >
      <Box id={`${name}-carousel-header-box`}
        className="carousel-header-box"
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingLeft: "15px",
          paddingY: "5px",
          "&:hover": name === "Bestsellers" ? null : {
            cursor: "pointer"
          }
        }}
        onClick={() => { if (name !== "Bestsellers") setViewCategory(!viewCategory) }}
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
        {name !== "Bestsellers" &&
          <ExpandMore
            expand={viewCategory}
            sx={{
              padding: "0px"
            }}
          >
            <ExpandMoreIcon
              sx={{
                color: "white",
              }}
            />
          </ExpandMore>}
      </Box>
      <Collapse in={name === "Bestsellers" ? true : viewCategory}
      >
        <CarouselComp.CarBox id={`${name}-carousel`}
          sx={{
            display: "flex",
            alignItems: "flex-end",
          }}>
          <CarouselComp.CarSpacer
            className="carousel-spacer-start"
            sx={{
              height: () => {
                if (mobile) return "220px";
                if (large) return "290px";
                if (xlarge) return "380px";
              },
              left: () => {
                if (mobile) return "0%"
                if (large) return "10%";
                if (xlarge) return "15%";
              }
            }}
          />
          <CarouselComp.CarButton
            className="carousel-arrow"
            onClick={() => { handleScroll(name, -500) }}
            disableRipple
            sx={{
              left: () => {
                if (mobile) return "1%"
                if (large) return "11%";
                if (xlarge) return "16%";
              }
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
            className="carousel-arrow"
            onClick={() => { handleScroll(name, 500) }}
            disableRipple
            sx={{
              right: () => {
                if (mobile) return "1%"
                if (large) return "11%";
                if (xlarge) return "16%";
              }
            }}
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
          <CarouselComp.CarSpacer
            className="carousel-spacer-end"
            sx={{
              height: () => {
                if (mobile) return "220px";
                if (large) return "290px";
                if (xlarge) return "380px";
              },
              right: () => {
                if (mobile) return "0%"
                if (large) return "10%";
                if (xlarge) return "15%";
              }
            }}
          />
        </CarouselComp.CarBox >
      </Collapse>
    </Box >
  )

}
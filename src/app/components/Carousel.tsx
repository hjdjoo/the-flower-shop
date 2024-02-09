"use client"

import * as dotenv from 'dotenv';
dotenv.config();

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList"
import ImageListItem from "@mui/material/ImageListItem"
import ImageListItemBar from "@mui/material/ImageListItemBar"


export default function Carousel() {

  const StyledImageList = styled("ul")({
    height: "250px",
    border: "1px solid black",
    listStyle: "none",
    overflowX: "scroll",
    whiteSpace: "nowrap",
    alignContent: "center",
    padding: "15px"
  })

  const StyledListItem = styled("li")({
    height: "220px",
    width: "170px",
    margin: "10px",
    display: "inline-block",
    border: "1px dotted black"
  })

  const blankArr = Array(10).fill('');

  const blankImgs = blankArr.map((_, i) => {
    return (
      <StyledListItem
        key={`blankImg-${i}`}
      >
        {/* <img></img> */}
      </StyledListItem>
    )
  })

  return (

    <StyledImageList>
      {blankImgs}
    </StyledImageList >

  )

}
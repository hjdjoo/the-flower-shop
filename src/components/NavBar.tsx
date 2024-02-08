import { useState, useEffect } from "react";
import Image from "next/image";
import { Sacramento } from "next/font/google"
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
  Typography,
  MenuItem,
  Avatar,
  Tooltip
} from '@mui/material'
import {
  ShoppingCart as ShoppingCartIcon,
  Menu as MenuIcon
} from '@mui/icons-material';

const sacramento = Sacramento({
  weight: ['400'],
  subsets: ['latin'],
})

export function Navbar() {

  return (
    <>
      <Box sx={{ flexgrow: 1 }}>
        <AppBar className="navbar">
          <Toolbar
            className="toolbar"
            sx={{
              display: "flex"
            }}
          >
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
            >
              <MenuIcon
                sx={{
                  color: "white"
                }}
              />
            </IconButton>
            <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: sacramento.style.fontFamily,
                textAlign: "center"
              }}
            >
              The Flower Shop
            </Typography>
            <IconButton>
              <Avatar
                sx={{
                  justifySelf: "flex-end"
                }} />
            </IconButton>
          </Toolbar>
        </AppBar >
        <Toolbar
          sx={{
            minHeight: "48px"
          }}
        />
      </Box>
    </>
  );
}
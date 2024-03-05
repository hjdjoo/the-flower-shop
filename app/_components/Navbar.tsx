"use client"

import next from "next";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Sacramento } from "next/font/google"
import Link from "next/link"

/******* Material UI imports  *********/
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';


const sacramento = Sacramento({
  weight: ['400'],
  subsets: ['latin'],
})

export function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
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
              marginTop: "5px",
              paddingLeft: "16px",
              justifySelf: "center",
              flexGrow: 1,
              fontFamily: sacramento.style.fontFamily,
              textAlign: "center"
            }}
          >
            The Flower Shop
          </Typography>
          <IconButton>
            <Link href={isLoggedIn ? '/account' : '/account/signin'}>
              <PersonIcon
                sx={{
                  marginTop: "5px",
                  color: "white"
                }}
              // onClick={ }
              >
              </PersonIcon>
            </Link>
          </IconButton>
          <IconButton>
            <ShoppingCartIcon
              sx={{
                color: "white"
              }} />
          </IconButton>
        </Toolbar>
      </AppBar >
      <Toolbar
        sx={{
          minHeight: "48px"
        }}
      />

    </>
  );
}
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
import LogoutIcon from '@mui/icons-material/Logout';

import MainIcon from "./Icon";


// const sacramento = Sacramento({
//   weight: ['400'],
//   subsets: ['latin'],
// })

export function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <AppBar id="navbar">
        <Toolbar
          className="toolbar"
          sx={{ display: "flex" }}
        >
          <Box
            sx={{
              flexGrow: "2"
            }}>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
            >
              <MenuIcon
                sx={{ color: "white" }}
              />
            </IconButton>
            <IconButton>
              <MainIcon />
              <Typography
                variant="h4"
                component="div"
                sx={{
                  marginTop: "2px",
                  paddingLeft: "12px",
                  fontSize: "1rem",
                  flexGrow: 1,
                  textAlign: "left",
                  color: "white"
                }}
              >
                t h e / f l o w e r / s h o p
              </Typography>
            </IconButton>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "right"
            }}>
            <IconButton>
              <Link href={isLoggedIn ? '/account' : '/signin'}>
                <PersonIcon
                  sx={{
                    marginTop: "5px",
                    color: "white",
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
            <IconButton>
              <LogoutIcon
                sx={{
                  color: "white"
                }}>
              </LogoutIcon>
            </IconButton>
          </Box>
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
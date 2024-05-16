"use client"

import next from "next";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link"
import { useRouter } from "next/navigation";

/******* Material UI imports  *********/
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
// import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
/******* Icons ******/
import MenuIcon from '@mui/icons-material/Menu';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import PersonIcon from '@mui/icons-material/Person';
// import LogoutIcon from '@mui/icons-material/Logout';
// import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
/******** Styled Components ********/
import { TitleText } from "@/app/_components/TitleText";
import { NavIcons } from "./NavIcons";

// import MainIcon from "./Icon";

import { useUser } from "@/lib/contexts/UserContext";

import { createClient } from "@/utils/supabase/client";


interface NavbarProps {
  isAdmin: boolean
}

export function Navbar() {

  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {

    const supabase = createClient();
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, _session) => {
      if (event === "SIGNED_OUT") {
        router.push('/');
      }
    })

    return () => { authListener.unsubscribe() };
  }, [router]);

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
              <Link href={'/'}>
                <TitleText
                  // variant="h4"
                  // component="div"
                  sx={{
                    marginTop: "2px",
                    paddingLeft: "5px",
                    border: "1px solid white",
                    paddingRight: "5px",
                    flexGrow: 1,
                    textAlign: "left",
                    color: "white"
                  }}
                >
                  beersflower.shop
                </TitleText>
              </Link>
            </IconButton>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "right"
            }}>
            <NavIcons userRole={user?.role ? user.role : "guest"} />
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
"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { styled } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { GridItem } from "@/app/_components/styled/GridItem";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
/***** Icons *****/
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WebIcon from '@mui/icons-material/Web';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import { AdminButton } from "./styled/AdminButton";

const DashboardRoot = styled(Container, {
  name: "Dashboard",
  slot: "root",
})(() => ({
  maxWidth: "md"
})) as typeof Container

const DashboardNav = styled(Grid, {
  name: "Dashboard",
  slot: "nav",
})(() => ({})) as typeof Grid

const DashboardButton = styled(Button, {
  name: "Dashboard",
  slot: "button",
})(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: "5%",
  justifyContent: "space-around",
  width: "100%",
  height: "100%",
  font: theme.typography.fontFamily,
  "&:hover": {
    backgroundColor: theme.palette.primary.light
  }
})) as typeof Button

const DashboardDisplay = styled(Box, {
  name: "Dashboard",
  slot: "display",
})(() => ({})) as typeof Box

export default function Dashboard() {

  const router = useRouter();

  return (
    <>
      <DashboardRoot
        maxWidth="md"
      >
        <DashboardNav
          container
          spacing={{
            xs: 2,
            sm: 2,
            md: 5
          }}
          sx={{
            marginTop: "9%",
            // border: "1px dotted black",
          }}
        >
          <GridItem xs={6}>
            <DashboardButton
              onClick={() => router.push("admin/newOrder")}
            >
              <NoteAddIcon
                sx={{
                  fontSize: "4rem"
                }}
              />
              New Order
            </DashboardButton>
          </GridItem>
          <GridItem xs={6}>
            <DashboardButton
              onClick={() => router.push("admin/orders")}
            >
              <InventoryIcon
                sx={{
                  fontSize: "4rem"
                }}
              />
              Orders
            </DashboardButton>
          </GridItem>
          <GridItem xs={6}>
            <DashboardButton
              onClick={() => router.push("admin/customers")}
            >
              <PeopleAltIcon
                sx={{
                  fontSize: "4rem"
                }}
              />
              Customers
            </DashboardButton>
          </GridItem>
          <GridItem xs={6}>
            <DashboardButton
              onClick={() => router.push("admin/deliveries")}
            >
              <LocalShippingIcon
                sx={{
                  fontSize: "4rem"
                }}
              />
              Deliveries
            </DashboardButton>
          </GridItem>
          <GridItem xs={6}>
            <DashboardButton
              onClick={() => router.push("admin/website")}
            >
              <WebIcon
                sx={{
                  fontSize: "4rem"
                }}
              />
              Website Settings
            </DashboardButton>
          </GridItem>
          <GridItem xs={6}>
            <DashboardButton
              onClick={() => router.push("admin/settings")}
            >
              <AdminPanelSettingsIcon
                sx={{
                  fontSize: "4rem"
                }}
              />
              Admin Settings
            </DashboardButton>
          </GridItem>
        </DashboardNav>
      </DashboardRoot>

    </>
  )
}
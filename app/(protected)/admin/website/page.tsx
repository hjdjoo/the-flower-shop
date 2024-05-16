"use client";

import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { GridItem } from "@/app/_components/styled/GridItem";
import { StyledContainer } from "@/app/_components/styled/StyledContainer";

export default function WebsiteSettingsPage() {

  const router = useRouter();

  return (
    <StyledContainer>
      <Grid
        container
        sx={{
          marginTop: "15px"
        }}
      >
        <GridItem xs={12} marginBottom="15px">
          <Button
            onClick={() => router.push('/admin/website/manageProducts')}
            sx={{
              border: "1px solid black"
            }}
          >
            Manage Products
          </Button>
        </GridItem>
        <GridItem xs={12} marginBottom="15px">
          <Button
            onClick={() => router.push('/admin/website/updateCarousel')}
            sx={{
              border: "1px solid black"
            }}
          >
            Update Carousel
          </Button>
        </GridItem>
      </Grid>
    </StyledContainer >
  )

}
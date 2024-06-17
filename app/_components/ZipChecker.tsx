import { useEffect, useState, useMemo, forwardRef, Dispatch, ChangeEvent, SetStateAction } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps";


import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

import { ErrorMessage } from "../types/client-types";

const shopPosition = { lat: 40.9804046653245, lng: -74.11758860293361 }

interface ZipCheckerProps {
  zipCode: number | undefined
  setDeliveryZipAlert: Dispatch<SetStateAction<ErrorMessage>>
}

export default function ZipCheckerButton(props: ZipCheckerProps) {

  const { zipCode, setDeliveryZipAlert } = props;

  const routesLib = useMapsLibrary("routes");

  const checkDeliveryArea = async (delAddress: string) => {
    try {
      let drivingTime = 0;
      let drivingDistance = 0;
      const { DirectionsService, TravelMode, TrafficModel } = routesLib!;

      const transitMode = TravelMode.DRIVING
      const trafficModel = TrafficModel.PESSIMISTIC


      const directions = new DirectionsService();

      const routeRequest = {
        avoidTolls: true,
        origin: shopPosition,
        destination: delAddress,
        travelMode: transitMode,
        drivingOptions: {
          departureTime: new Date(Date.now()),
          trafficModel: trafficModel
        }
      }

      const { routes } = await directions.route(routeRequest)

      console.log("checkDeliveryArea/routes: ", routes)
      if (!routes.length) { throw new Error("Couldn't compute routes") }

      routes[0].legs.forEach(leg => {
        drivingTime += leg.duration ? leg.duration.value : 0;
        drivingDistance += leg.distance ? leg.distance.value : 0;
      })

      if (drivingDistance / 1609 > 12 || drivingTime / (1000 * 60) > 20) {
        setDeliveryZipAlert({
          severity: "error",
          message: "This may be outside of our delivery zone."
        })
      } else {
        setDeliveryZipAlert({
          severity: "success",
          message: "Looks good!",
        })
      }
    }
    catch (error) {
      console.error(error);
      setDeliveryZipAlert({
        severity: "error",
        message: `Couldn't check route: ${error}`
      })
    }
  }

  return (
    <Button
      variant="outlined"
      sx={{
        marginX: "15px"
      }}
      onClick={async () => {
        if (!zipCode) {
          setDeliveryZipAlert({
            severity: "error",
            message: "Please input a zip code!"
          })
        } else {
          await checkDeliveryArea(zipCode.toString());
        }
      }}
    >
      Check Zip
    </Button>
  )
}
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
  setDeliveryFee: Dispatch<SetStateAction<number>>
  setReadyToSubmit: Dispatch<SetStateAction<boolean>>
}

export default function ZipCheckerButton(props: ZipCheckerProps) {

  const { zipCode, setDeliveryZipAlert, setDeliveryFee, setReadyToSubmit } = props;

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

      const miles = drivingDistance / 1609;
      const time = drivingTime / (60);

      if (miles > 12 || time > 18) {
        throw new Error("This may be outside of our delivery zone.")
      }

      console.log(miles, time);

      if (zipCode?.toString() === "07450") {
        setDeliveryZipAlert({
          severity: "success",
          message: "Looks good!",
        })
      }
      if (miles > 2 || time > 4) {
        setDeliveryFee(9.95);
      };
      if (miles > 4 || time > 7) {
        setDeliveryFee(10.95);
      };
      if (miles > 6 || time > 10) {
        setDeliveryFee(11.95);
      };
      if (miles > 8 || time > 13) {
        setDeliveryFee(12.95)
      };
      if (miles > 10 || time > 16) {
        setDeliveryFee(13.95)
      };
      setDeliveryZipAlert({
        severity: "success",
        message: "Looks good!",
      });
      setReadyToSubmit(true);
    }
    catch (error) {
      console.error(error);
      setDeliveryZipAlert({
        severity: "error",
        message: `${error}`
      });
      setReadyToSubmit(false);
    }
  }

  return (
    <Button
      id="order-zip-checker-button"
      variant="outlined"
      sx={{
        marginX: "15px",
        alignSelf: "flex-start",
        marginTop: "15px",
        flexGrow: 1,
      }}
      onClick={async () => {
        if (!zipCode) {
          setDeliveryZipAlert({
            severity: "error",
            message: "Please input a zip code!"
          })
          setReadyToSubmit(false);
        } else {
          await checkDeliveryArea(zipCode.toString());
        }
      }}
    >
      Check Zip
    </Button>
  )
}
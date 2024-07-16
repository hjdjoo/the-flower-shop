import { useEffect, useState, useMemo, forwardRef, Dispatch, ChangeEvent, SetStateAction } from "react"
import { useMapsLibrary } from "@vis.gl/react-google-maps";


import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";

import { ErrorMessage } from "../types/client-types";

import calculateDelivery from "@/utils/actions/calculateDelivery";

const shopPosition = { lat: 40.9804046653245, lng: -74.11758860293361 }

interface ZipCheckerProps {
  zipCode: string
  setDeliveryZipAlert: Dispatch<SetStateAction<ErrorMessage>>
  setDeliveryFee: Dispatch<SetStateAction<string>>
  setZipValid: Dispatch<SetStateAction<boolean>>
}

export default function ZipCheckerButton(props: ZipCheckerProps) {

  const { zipCode, setDeliveryZipAlert, setDeliveryFee, setZipValid } = props;

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

      // console.log("checkDeliveryArea/routes: ", routes)
      if (!routes.length) { throw new Error("Couldn't compute routes") }

      routes[0].legs.forEach(leg => {
        drivingTime += leg.duration ? leg.duration.value : 0;
        drivingDistance += leg.distance ? leg.distance.value : 0;
      })

      if (zipCode?.toString() === "07450") {
        setDeliveryFee("8.95")
      } else {
        const deliveryFee = JSON.stringify(calculateDelivery(drivingDistance, drivingTime))
        console.log("deliveryFee from check: ", deliveryFee)
        setDeliveryFee(deliveryFee);
      }

      setDeliveryZipAlert({
        severity: "success",
        message: "Looks good!",
      });
      setZipValid(true);
    }
    catch (error) {
      console.error(error);
      setDeliveryZipAlert({
        severity: "error",
        message: `${error}`
      });
      setZipValid(false);
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
          setZipValid(false);
        } else {
          await checkDeliveryArea(zipCode.toString());
        }
      }}
    >
      Check Zip
    </Button>
  )
}
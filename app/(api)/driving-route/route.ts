import { NextRequest, NextResponse } from "next/server";
import addressToString from "@/utils/supabase/clientActions/addressToString";

const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY!

export async function POST(req: NextRequest) {

  const address = await req.json();

  const computeRoutesEndpoint = "https://routes.googleapis.com/directions/v2:computeRoutes"

  const addressStr = addressToString(address);

  const routeOptions = {
    origin: {
      address: "33 Oak Street, Ridgewood, NJ, 07450"
    },
    destination: {
      address: addressStr
    },
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_UNAWARE",
    trafficModel: "PESSIMISTIC",
    routeModifiers: {
      avoidTolls: true,
      avoidHighways: true,
      avoidFerries: true
    },
    languageCode: "en-US"
  }

  const googleResponse = await fetch(computeRoutesEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_API_KEY,
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
      "Referer": "http://localhost:3000"
    },
    body: JSON.stringify(routeOptions)
  })

  const response = await googleResponse.json();

  console.log("driving-route/googleResponse: ", response);

  return NextResponse.json(googleResponse)

}
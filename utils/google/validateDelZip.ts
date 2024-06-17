import { RoutesClient } from "@googlemaps/routing";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default async function validateDelZip(zipCode: number, boundary: google.maps.LatLngBounds) {


  // hard-coding shop address for development. Want to make this adjustable from admin side eventually.
  const shopAddress = {}
  const routingClient = new RoutesClient();


}
// import { useEffect, useState, useMemo } from "react"
// import { useMapsLibrary } from "@vis.gl/react-google-maps";

// export default function Geocoding({ children, }: { children: React.ReactNode }) {
//   const geocodingLib = useMapsLibrary("geocoding");
//   const geocoder = useMemo(
//     () => geocodingLib && new geocodingLib.Geocoder(),
//     [geocodingLib])
//   const coreLib = useMapsLibrary("core")
//   const [boundary, setBoundary] = useState<google.maps.LatLngBounds | null>(null);

//   useEffect(() => {
//     console.log("useEffectlibs: ", geocodingLib, coreLib);
//     if (!geocodingLib || !coreLib) return;

//     const { LatLngBounds } = coreLib;
//     // hard-coded coordinates for rough delivery area.
//     const southWest = { lat: 40.815482900059344, lng: -74.2531687158364 }
//     const northEast = { lat: 41.052626082834614, lng: -73.91901230380985 }

//     const bounds = new LatLngBounds(southWest, northEast);
//     console.log("bounds: ", bounds)

//     setBoundary(new LatLngBounds(southWest, northEast))

//   }, [geocodingLib, coreLib])

//   return (<>{children}</>)
// }
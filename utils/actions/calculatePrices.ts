import { getProductInfo } from "../supabase/clientActions/getProductInfo";
import { OrderItem } from "@/app/types/component-types/OrderFormData";
import calculateTax from "@/utils/actions/calculateTax";
import calculateDeliveryFee from "@/utils/actions/calculateDeliveryFee";

type DrivingRouteResponse = { duration: number, distanceMeters: number }

export default async function calculatePrices(item: OrderItem) {

  // use database info as reference instead of using client-side info for consistency.
  const { data, error } = await getProductInfo(item.productId);

  if (!data || error) {
    throw new Error("Couldn't get product data")
  };

  const tier = item.selectedTier!;
  const itemValue = data.prices[tier];
  const address = item.recipAddress;

  const itemTax = calculateTax(itemValue);

  console.log(item.recipAddress);

  const drivingRouteResponse = await fetch('http://localhost:3000/driving-route', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(address)
  })

  const drivingRoute = await drivingRouteResponse.json() as DrivingRouteResponse;

  console.log("calculatePrices/drivingRouteResponse.json(): ", drivingRoute);

  const deliveryFee = calculateDeliveryFee(drivingRoute.duration, drivingRoute.distanceMeters);

  const deliveryTax = calculateTax(deliveryFee);

  const tax = itemTax + deliveryTax;

  const total = itemValue + deliveryFee + tax;

  return {
    itemValue: itemValue,
    deliveryFee: deliveryFee,
    tax: tax,
    total: total
  };

}
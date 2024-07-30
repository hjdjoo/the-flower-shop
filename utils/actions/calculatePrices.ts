import { getProductInfo } from "../supabase/clientActions/getProductInfo";
import { OrderItem } from "@/app/types/component-types/OrderFormData";
import calculateTax from "@/utils/actions/calculateTax";
import calculateDeliveryFee from "@/utils/actions/calculateDeliveryFee";

type DrivingRouteResponse = {
  routes: Array<{ distanceMeters: number, duration: string }>
}

export default async function calculatePrices(item: OrderItem) {
  try {
    // use database info instead of using client-provided data for safety
    const { data, error } = await getProductInfo(item.productId);

    if (!data || error) {
      throw new Error("Couldn't get product data")
    };

    const tier = item.selectedTier!;
    const itemValue = data.prices[tier];
    const address = item.recipAddress;
    // console.log(address);

    const itemTax = calculateTax(itemValue);

    const drivingRouteResponse = await fetch('http://localhost:3000/driving-route', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address)
    })

    const drivingRoute = await drivingRouteResponse.json() as DrivingRouteResponse;

    // console.log(drivingRoute);

    const { duration, distanceMeters } = drivingRoute.routes[0];

    // console.log(duration, distanceMeters)

    const durationVal = parseInt(duration.replace("s", ""))

    const deliveryFee = calculateDeliveryFee(durationVal, distanceMeters);

    const deliveryTax = calculateTax(deliveryFee);

    const tax = (itemTax * 100 + deliveryTax * 100) / 100

    const total = parseInt(((itemValue + deliveryFee + tax) * 100).toFixed(2)) / 100;

    // console.log(total);

    // console.log("calculatePrices: total", total)

    return {
      itemValue: itemValue,
      deliveryFee: deliveryFee,
      tax: tax,
      total: total
    };
  }
  catch (e) {
    throw new Error(`An error occurred:${e}`)
  }

}
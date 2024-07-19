import { getProductInfo } from "../supabase/clientActions/getProductInfo";
import { OrderItem } from "@/app/types/component-types/OrderFormData";
import calculateTax from "@/utils/actions/calculateTax";
import calculateDeliveryFee from "@/utils/actions/calculateDeliveryFee";

type DrivingRouteResponse = {
  routes: Array<{ distanceMeters: number, duration: string }>
}

export default async function calculatePrices(item: OrderItem) {
  try {
    // use database info as reference instead of using client-side info for consistency.
    const { data, error } = await getProductInfo(item.productId);

    if (!data || error) {
      throw new Error("Couldn't get product data")
    };

    const tier = item.selectedTier!;
    const itemValue = data.prices[tier];
    const address = item.recipAddress;

    const itemTax = calculateTax(itemValue);

    const drivingRouteResponse = await fetch('http://localhost:3000/driving-route', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address)
    })

    const drivingRoute = await drivingRouteResponse.json() as DrivingRouteResponse;

    const { duration, distanceMeters } = drivingRoute.routes[0];

    const durationVal = parseInt(duration.replace("s", ""))

    const deliveryFee = calculateDeliveryFee(durationVal, distanceMeters);

    const deliveryTax = calculateTax(deliveryFee);

    const tax = itemTax + deliveryTax;

    const total = parseInt(((itemValue + deliveryFee + tax) * 100).toFixed(2)) / 100;


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
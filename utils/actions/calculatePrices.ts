import { getProductInfo } from "../supabase/clientActions/getProductInfo";
import { OrderItem, Order, OrderPrices, Address } from "@/app/types/component-types/OrderFormData";
import calculateTax from "@/utils/actions/calculateTax";
import calculateDeliveryFee from "@/utils/actions/calculateDeliveryFee";

type DrivingRouteResponse = {
  routes: Array<{ distanceMeters: number, duration: string }>
}


export default async function calculatePrices(order: OrderItem[], address: Address) {
  try {
    // use database info instead of using client-provided data for safety
    const orderPrices: OrderPrices = {
      itemValues: [],
      deliveryFee: 0,
      tax: 0,
      total: 0
    }

    order.forEach(async (item) => {

      const { data, error } = await getProductInfo(item.productId);

      if (!data || error) {
        throw new Error("Couldn't get product data")
      };

      const tier = item.selectedTier!;
      const itemValue = data.prices[tier];

      orderPrices.itemValues.push(itemValue);


    })

    const drivingRouteResponse = await fetch('http://localhost:3000/driving-route', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address)
    })


    const drivingRoute = await drivingRouteResponse.json() as DrivingRouteResponse;
    // console.log("calculatePrices/drivingRoute", drivingRoute);

    const { duration, distanceMeters } = drivingRoute.routes[0];

    const durationVal = parseInt(duration.replace("s", ""))

    const deliveryFee = calculateDeliveryFee(durationVal, distanceMeters);

    const itemTotal = orderPrices.itemValues.reduce((acc, curr) => {
      return acc += curr;
    }, 0)

    const preTaxTotal = itemTotal + deliveryFee;

    const tax = calculateTax(preTaxTotal);

    const total = tax + preTaxTotal;

    orderPrices.deliveryFee = deliveryFee;
    orderPrices.tax = tax;
    orderPrices.total = total;

    // console.log("calculatePrices/orderPrices: ", orderPrices)

    return orderPrices;


  }
  catch (e) {
    throw new Error(`An error occurred:${e}`)
  }

}
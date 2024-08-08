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

    // console.log("calculatePrices/before forEach/orderPrices: ", orderPrices)

    order.forEach(async (item, idx) => {
      // console.log("calculatePrices/order.forEach/item, idx", item, idx)
      const { data, error } = await getProductInfo(item.productId);

      if (!data || error) {
        throw new Error("Couldn't get product data")
      };

      // console.log("calculatePrices/orderData: ", data)
      // console.log("calculatePrices/orderItem: ", item)

      const tier = item.selectedTier!;
      const itemValue = data.prices[tier];

      // console.log("calculatePrices/adding item value to order prices. orderPrices, itemValues: ")
      // console.table({ orderPrices, itemValue })
      orderPrices.itemValues[idx] = itemValue

      // console.log("calculatePrices/orderforEach/after update: ", orderPrices);

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

    const total = parseInt((tax * 100 + preTaxTotal * 100).toFixed(0));

    orderPrices.deliveryFee = deliveryFee;
    orderPrices.tax = tax;
    orderPrices.total = total / 100;

    // console.log("calculatePrices/orderPrices: ", orderPrices)

    return orderPrices;


  }
  catch (e) {
    throw new Error(`An error occurred:${e}`)
  }

}
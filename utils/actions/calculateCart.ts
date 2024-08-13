"use server";

import { SortedOrder } from "@/app/types/component-types/OrderFormData";
import calculatePrices from "./calculatePrices";

/**
 * 
 * @param cart :Cart - Cart passed in from client
 * @returns : a nested array of prices, each mapping to SortedOrder
 * 
 */
export default async function calculateCart(sortedOrder: SortedOrder) {

  let cartTotal = 0;
  // console.log(sortedOrder);

  const orderPrices = await Promise.all(sortedOrder.map((addressArr) => {

    // console.log("microtask")
    // console.log("calculateCart/sortedOrder: ", sortedOrder);
    return Promise.all(addressArr.map(async (orderArr) => {
      // console.log("microtask")
      // console.log("orderArr: ", orderArr)
      if (!orderArr.length) {
        return {
          itemValues: [],
          deliveryFee: 0,
          tax: 0,
          total: 0
        }
      }
      const address = orderArr[0].recipAddress
      const prices = await calculatePrices(orderArr, address);
      // console.log("prices: ", prices)
      cartTotal += prices.total;
      return prices;
    }))

  }));

  // console.log("calculateCart/orderPrices: ", orderPrices)

  return {
    orderPrices: orderPrices,
    cartTotal: cartTotal
  };
}
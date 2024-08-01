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

  const orderPrices = await Promise.all(sortedOrder.map((dateArr) => {

    return Promise.all(dateArr.map(async (addressArr) => {
      if (!addressArr.length) {
        return {
          itemValues: [],
          deliveryFee: 0,
          tax: 0,
          total: 0
        }
      }
      const address = addressArr[0].recipAddress
      const prices = await calculatePrices(addressArr, address);
      cartTotal += prices.total;
      return prices;
    }))

  }));

  return {
    orderPrices: orderPrices,
    cartTotal: cartTotal
  };
}
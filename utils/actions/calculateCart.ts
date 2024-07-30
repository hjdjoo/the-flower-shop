"use server";

import { Cart } from "@/app/types/component-types/OrderFormData";
import calculatePrices from "./calculatePrices";

/**
 * 
 * @param cart :Cart - Cart passed in from client
 * @returns : an object that contains:
 *  an array of pricing details for each item (item value, delivery, tax, total)
 * and the total value of the cart, including delivery fees and taxes.
 * 
 */
export default async function calculateCart(cart: Cart) {

  if (!cart) return;

  const { cartItems } = cart;

  const itemPrices = await Promise.all(cartItems.map(
    async (item) => {
      try {
        return await calculatePrices(item);
      }
      catch (e) {
        throw new Error(`Something went wrong while calculating prices: ${e}`)
      }
    }));

  let cartTotal = 0;

  for (let item in itemPrices) {
    cartTotal += itemPrices[item].total;
  }

  // console.log(cartTotal);

  return {
    itemPrices: itemPrices,
    cartTotal: cartTotal
  };

}
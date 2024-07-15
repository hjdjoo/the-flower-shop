"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import { Cart, OrderItem, SortedOrder, Dates } from "../../app/types/component-types/OrderFormData"
import { defaultCart } from "@/app/_components/lib/DefaultCart";

interface CartProviderProps {
  children: React.ReactNode
}

/**
 * In order to make the Cart more organized/performant:
 * deliveryDates is a sorted array in ascending order.
 * cartItems are also inserted into the array in ascending order.
 */

export interface CartContextType {
  cart: Cart
  setCart: (cart: Cart) => void // 
  addToCart: (deliveryDate: string, item: OrderItem) => void
  getSortedOrder: () => SortedOrder
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {

  const context = useContext(CartContext);

  return context;

}

export const CartProvider: React.FC<CartProviderProps> = ({ children }: { children: React.ReactNode }) => {

  const storedCartJSON = localStorage.getItem("cart");
  const storedCart = storedCartJSON ? JSON.parse(storedCartJSON) : null;

  console.log("CartContext/CartProvider/storedCart: ", storedCart);
  const [cart, setCart] = useState<Cart>(storedCart ? storedCart : defaultCart);

  /**
   * 
   * @param item OrderItem - whatever the customer is ordering at that moment.
   * For marginal efficiency improvements, add items to cart in sorted order.
   */
  const addToCart = (deliveryDate: string, item: OrderItem) => {
    // take current cart;
    const { deliveryDates, cartItems } = cart;
    // take the delivery date from the item being added;

    const newDeliveryDates: Dates = [...deliveryDates];
    const newCartItems: Array<OrderItem> = [...cartItems];

    // see if this delivery date exists in the deliveryDates array;
    // if not, add item to cartItems and add deliveryDate to deliveryDate;
    if (!deliveryDates.includes(deliveryDate)) {
      newDeliveryDates.push(deliveryDate);
      newDeliveryDates.sort((a, b) => Date.parse(a) - Date.parse(b));
    }

    // otherwise, add to cartItems array without adding delivery date;
    newCartItems.push(item);
    newCartItems.sort((a, b) => Date.parse(a.deliveryDate) - Date.parse(b.deliveryDate));

    const newCart = {
      deliveryDates: newDeliveryDates,
      cartItems: newCartItems
    }

    setCart({ ...newCart });
    localStorage.setItem("cart", JSON.stringify(newCart))

  }

  const getSortedOrder = () => {

    const { deliveryDates, cartItems } = cart;

    // Fun fact: Array.fill([]) won't work for this algorithm, since the fill method passes the *reference* to the object that was given as a param. Thus, mutating an array at any idx will mutate all others.
    const order = Array(deliveryDates.length);

    deliveryDates.forEach((date, idx) => {

      for (let item of cartItems) {
        if (item?.deliveryDate === date) {
          if (!order[idx]) {
            order[idx] = [item];
          }
          else {
            order[idx].push(item);
          }
        }
      }
    })

    return order;
  }

  const removeFromCart = () => {


  }

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, getSortedOrder }}>{children}</CartContext.Provider>
  )

}
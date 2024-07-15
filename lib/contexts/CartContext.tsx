"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import { Cart, OrderItem, SortedOrder, Dates } from "../../app/types/component-types/OrderFormData"
import { defaultCart } from "@/app/_components/lib/DefaultCart";

interface CartProviderProps {
  children: React.ReactNode
}


/**
 * 
 * To access cart, import useCart and CartContextType into module, then typecast as CartContextType, like so:
 * 
 * const cart = useCart() as CartContextType
 * 
 * Cart {
 *  deliveryDates: []
 *  cartItems: OrderItem[]
 * }
 * 
 * Cart.getSortedOrder() returns an array of arrays where the order items are organized by deliveryDate.
 * 
 * addToCart() adds item to carItems and then sorts the cart by delivery date.
 * 
 * removing from cart can be done by creating a copy of the cart with the item removed and using the generic setCart state dispatch.
 * 
 */

interface LocalCart extends Cart {
  updatedAt: number
}

export interface CartContextType {
  cart: Cart
  updateCart: (cart: Cart) => void // 
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
  const storedCart: LocalCart = storedCartJSON ? JSON.parse(storedCartJSON) : null;

  console.log(storedCart);

  const storedCartAge = storedCart ? (Date.now() - storedCart.updatedAt) / 3600 : null;

  const [cart, setCart] = useState<Cart>((storedCartAge && storedCartAge <= 48) ? storedCart : defaultCart);

  const addToCart = (deliveryDate: string, item: OrderItem) => {

    const { deliveryDates, cartItems } = cart;

    const newDeliveryDates: Dates = [...deliveryDates];
    const newCartItems: Array<OrderItem> = [...cartItems];

    if (!deliveryDates.includes(deliveryDate)) {
      newDeliveryDates.push(deliveryDate);
      newDeliveryDates.sort((a, b) => Date.parse(a) - Date.parse(b));
    }

    newCartItems.push(item);
    newCartItems.sort((a, b) => Date.parse(a.deliveryDate) - Date.parse(b.deliveryDate));

    const newCart = {
      deliveryDates: newDeliveryDates,
      cartItems: newCartItems
    }

    setCart({ ...newCart })

    const localCart = { ...newCart } as LocalCart;

    localCart.updatedAt = Date.now();

    localStorage.setItem("cart", JSON.stringify(localCart));

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

  const updateCart = (newCart: Cart) => {

    localStorage.setItem("cart", JSON.stringify(newCart));
    setCart({ ...newCart })

  }


  return (
    <CartContext.Provider value={{ cart, updateCart, addToCart, getSortedOrder }}>{children}</CartContext.Provider>
  )

}
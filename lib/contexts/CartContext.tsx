"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";
import { Cart } from "../../app/types/component-types/OrderFormData"
import { defaultCart } from "@/app/_components/lib/DefaultCart";

interface CartProviderProps {
  children: React.ReactNode
}

/**
 * In order to make the Cart more organized/performant:
 * deliveryDates is a hash map that takes the date as a key and assigns it an index.
 * addresses is a hashmap that takes the address as a key and assigns it to the index of the delivery date.
 */


export interface CartContextType {
  cart: Cart
  updateCart: (cart: Cart) => void
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {

  const context = useContext(CartContext);

  return context;

}

export const CartProvider: React.FC<CartProviderProps> = ({ children }: { children: React.ReactNode }) => {

  const [cart, setCart] = useState<Cart>(defaultCart);

  const updateCart = (cart: Cart) => {

    console.log("cart: ", cart)
    setCart(cart);

  }

  return (
    <CartContext.Provider value={{ cart, updateCart }}>{children}</CartContext.Provider>
  )

}
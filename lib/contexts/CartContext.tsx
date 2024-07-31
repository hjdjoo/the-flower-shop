"use client";

import { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { Cart, OrderItem, SortedOrder, Dates, Addresses } from "../../app/types/component-types/OrderFormData"
import { defaultCart } from "@/app/_components/lib/DefaultCart";
import { createClient } from "@/utils/supabase/client";

import addressToString from "@/utils/actions/addressToString";

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

  const supabase = createClient();

  const [cart, setCart] = useState<Cart>(defaultCart);

  // Todo: set userId to shop ID and update user info as needed with session.
  // const [user, setUser] = useState()

  useEffect(() => {

    const storedCartJSON = localStorage && localStorage.getItem("cart")
    const storedCart: LocalCart = storedCartJSON ? JSON.parse(storedCartJSON) : null;

    const newCart = refreshCart(storedCart);

    setCart(newCart);

  }, [])

  // useEffect(() => {
  //   (async () => {

  //     const { data, error } = await supabase
  //       .auth
  //       .getSession();

  //   })()

  // }, [supabase])


  function refreshCart(cart: LocalCart) {

    if (!cart) { return defaultCart }

    const cartAgeHrs = (Date.now() - cart.updatedAt) / 1000 / 3600;

    if (cartAgeHrs > 48) {
      localStorage.removeItem("cart");
      return defaultCart;
    }
    else {
      return cart;
    };
  }

  const addToCart = (deliveryDate: string, item: OrderItem) => {

    const { deliveryDates, addresses, cartItems } = cart;

    const newDeliveryDates: Dates = [...deliveryDates];
    const newAddresses: Addresses = [...addresses];
    const newCartItems: Array<OrderItem> = [...cartItems];

    if (!deliveryDates.includes(deliveryDate)) {
      newDeliveryDates.push(deliveryDate);
      newDeliveryDates.sort((a, b) => Date.parse(a) - Date.parse(b));
    }

    newCartItems.push(item);
    newCartItems.sort((a, b) => Date.parse(a.deliveryDate) - Date.parse(b.deliveryDate));

    const newCart = {
      addresses: newAddresses,
      deliveryDates: newDeliveryDates,
      cartItems: newCartItems
    }

    updateCart(newCart)

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

  /**
   * updateAddresses()
   * @returns :Cart - this is a NEW cart object with a refreshed set of addresses and cart items containing the new address indices.
   * This does *not* refresh the cart and should be used as a utility function for other cart operations.
   * 
   */
  const updateAddressesAndDates = (cart: Cart) => {

    // careful when using "keyof typeof" to dynamically type keys. A "keyof" a blank object will return an array-like with number indices, and so TS will automatically type the key as "string | number" even if the key has been indicated as a string in the interface.
    // Address cache for updating addresses. Initialized every time cart is updated.
    interface AddressCache {
      [key: string]: number
    };
    const addressCache: AddressCache = {};

    const { cartItems } = cart;

    const newCartItems = [...cartItems]
    const newAddresses: Addresses = [];
    const newDeliveryDates: string[] = [];

    newCartItems.forEach((item) => {

      const addressStr = addressToString(item.recipAddress);

      // be careful of zero indexing and null checks
      if (addressCache[addressStr] === 0 || addressCache[addressStr]) {
        item.recipAddressIndex = addressCache[addressStr];
      } else {
        newAddresses.push(addressStr);
        item.recipAddressIndex = newAddresses.length - 1;
        addressCache[addressStr] = newAddresses.length - 1;
      };

      if (!newDeliveryDates.includes(item.deliveryDate)) {
        newDeliveryDates.push(item.deliveryDate);
      };

    });

    const newCart = {
      addresses: newAddresses,
      deliveryDates: newDeliveryDates,
      cartItems: newCartItems,
    }

    console.log("CartContext/updateAddresses/newCart: ", newCart);
    return newCart;

  }

  const updateCart = (newCart: Cart) => {

    if (!newCart.cartItems.length) {
      console.log("No items in cart - setting to default cart.")
      localStorage.setItem("cart", JSON.stringify(defaultCart));
      setCart({ ...defaultCart })
    }

    const updatedCart = updateAddressesAndDates(newCart);

    const localCart = { ...updatedCart } as LocalCart;

    localCart.updatedAt = Date.now();
    localStorage.setItem("cart", JSON.stringify(localCart));

    setCart({ ...newCart });

  }


  return (
    <CartContext.Provider value={{ cart, updateCart, addToCart, getSortedOrder }}>{children}</CartContext.Provider>
  )

}
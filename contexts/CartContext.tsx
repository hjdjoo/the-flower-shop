"use client";

import { createContext, useContext, useState, useEffect, useRef, Dispatch, SetStateAction } from "react";
import { Cart, OrderItem, SortedOrder, Dates, Addresses } from "../app/types/component-types/OrderFormData"
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
  addToCart: (item: OrderItem) => void
  getSortedOrder: () => SortedOrder
  updateAddressesAndDates: (cart: Cart) => Cart
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {

  const context = useContext(CartContext);

  return context;

}

export const CartProvider: React.FC<CartProviderProps> = ({ children }: { children: React.ReactNode }) => {

  const supabase = createClient();

  const [cart, setCart] = useState<Cart>(defaultCart);

  const cartRef = useRef<Cart>(cart);

  // console.log("CartProvider/cart: ", cart);

  // Todo: set userId to shop ID and update user info as needed with session.
  // const [user, setUser] = useState()

  useEffect(() => {

    console.log("CartProvider useEffect triggered. getting cart.")

    const storedCartJSON = localStorage && localStorage.getItem("cart")
    const storedCart: LocalCart = storedCartJSON ? JSON.parse(storedCartJSON) : null;

    const newCart = refreshCart(storedCart);

    cartRef.current = newCart;
    setCart(newCart);

  }, [])


  /**
   * 
   * @param cart :LocalCart - check if there is a cart. If so, check the age of the cart. Return client a new cart after 2 days.
   * @returns updated version of cart.
   */
  function refreshCart(cart: LocalCart) {

    if (!cart || !cart.deliveryDates) { return defaultCart }

    const cartAgeHrs = (Date.now() - cart.updatedAt) / 1000 / 3600;
    if (cartAgeHrs > 48) {
      localStorage.removeItem("cart");
      return defaultCart;
    }
    else {
      return cart;
    };
  }

  /**
   * 
   * @param item :OrderItem - new item that customer is adding to cart. Updates the addresses and dates stored in the cart.
   * 
   */
  const addToCart = (item: OrderItem) => {

    const { deliveryDates, addresses, cartItems } = cart;
    console.log("deliveryDates, addresses, cartItems: ", deliveryDates, addresses, cartItems)

    const newCartItems: Array<OrderItem> = [...cartItems];

    newCartItems.push(item);

    const newCart = updateAddressesAndDates({
      ...cart,
      cartItems: newCartItems
    })

    updateCart(newCart)

  }

  /**
   * 
   * @returns :SortedOrder - 
   * OrderItems[][] where:
   * The outer array is organized in ascending order of delivery date
   * The inner array contains an array of orders mapped to the index of the deliveryDate array.
   * 
   * 
   */
  const getSortedOrder = () => {

    const { deliveryDates, addresses, cartItems } = cartRef.current;
    // console.log("getSortedOrder/deliveryDates, addresses, cartItems: ", deliveryDates, addresses, cartItems)
    // Fun fact: Array.fill([]) won't work for this kind of an algorithm, since the fill method passes the *reference* to the object that was given as a param. Thus, mutating an array at any idx will mutate all others.
    if (!deliveryDates || !deliveryDates.length) {
      return [[[]]]
    }
    // Initialize an "order" array that contains an array of arrays.
    const order = deliveryDates.map(() => {
      // go through each order item and check the delivery date.
      // initialize an empty array at each dateIndex that is the length of addresses.
      return addresses.map(() => {
        return new Array();
      })
    });

    // console.log("blank order: ", order)
    order.forEach((dateArr, dateIdx) => {
      for (let item of cartItems) {
        // console.log(item.deliveryDate, deliveryDates[dateIdx], dateArr, item.recipAddressIndex)
        if (item.deliveryDate === deliveryDates[dateIdx] && dateArr[item.recipAddressIndex]) {
          // console.log("getSortedItem/dateArr[item.recipAddressIndex].push")
          dateArr[item.recipAddressIndex].push(item);
        }
      }
    })

    return order;
  }

  /**
   * 
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

    newCartItems.sort((a, b) => Date.parse(a.deliveryDate) - Date.parse(b.deliveryDate))

    newCartItems.forEach((item) => {

      const addressStr = addressToString(item.recipAddress);

      // be careful of zero indexing and null checks
      if (addressCache[addressStr] === 0 || addressCache[addressStr]) {
        item.recipAddressIndex = addressCache[addressStr];
      } else {
        newAddresses.push(item.recipAddress);
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

    return newCart;

  }

  // setter function - makes sure to add timestamp to cart.
  const updateCart = (newCart: Cart) => {

    if (!newCart.cartItems.length) {
      console.log("No items in cart - setting to default cart.")
      localStorage.setItem("cart", JSON.stringify(defaultCart));
      setCart({ ...defaultCart })
    }

    // const updatedCart = updateAddressesAndDates(newCart);

    const localCart = { ...newCart } as LocalCart;

    localCart.updatedAt = Date.now();
    localStorage.setItem("cart", JSON.stringify(localCart));

    cartRef.current = newCart;
    setCart({ ...newCart });

  }


  return (
    <CartContext.Provider value={{ cart, updateCart, addToCart, getSortedOrder, updateAddressesAndDates }}>{children}</CartContext.Provider>
  )
}
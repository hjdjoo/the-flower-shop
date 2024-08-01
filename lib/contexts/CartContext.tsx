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
      console.log("addtoCart/newDeliverydates.push")
      newDeliveryDates.push(deliveryDate);
      newDeliveryDates.sort((a, b) => Date.parse(a) - Date.parse(b));
    }
    console.log("addtoCart/newCartItems.push")
    newCartItems.push(item);
    newCartItems.sort((a, b) => Date.parse(a.deliveryDate) - Date.parse(b.deliveryDate));

    const newCart = {
      addresses: newAddresses,
      deliveryDates: newDeliveryDates,
      cartItems: newCartItems
    }

    updateCart(newCart)

  }

  /**
   * 
   * @returns :SortedOrder - 
   * A 3-d array in which:
   * - The outermost index references the deliveryDate index
   * - The next inner index references the address index
   * - The innermost index does not reference anything, but the array represents the items for an order.
   * 
   */
  const getSortedOrder = () => {

    const { deliveryDates, addresses, cartItems } = cart;

    // Fun fact: Array.fill([]) won't work for this kind of an algorithm, since the fill method passes the *reference* to the object that was given as a param. Thus, mutating an array at any idx will mutate all others.

    // Initialize an "order" array that contains an array of arrays.
    const order = deliveryDates.map(() => {
      // go through each order item and check the delivery date.
      // initialize an empty array at each dateIndex that is the length of addresses.
      return addresses.map(() => {
        return new Array();
      })
    });

    order.forEach((dateArr, dateIdx) => {
      for (let item of cartItems) {
        if (item.deliveryDate === deliveryDates[dateIdx]) {
          // console.log("getSortedItem/dateArr[item.recipAddressIndex].push")
          dateArr[item.recipAddressIndex].push(item);
        }
      }
    })

    return order;
  }

  /**
   * updateAddressesAndDates()
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

    if (!cartItems.length) return;

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
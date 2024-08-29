"use client";

import { createContext, useContext, useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

import { defaultCart } from "@/app/_components/lib/DefaultCart";
import { createClient } from "@/utils/supabase/client";
import { User } from "@/app/types/auth-types";
import { useUser } from "./UserContext";

import { Cart, OrderItem, SortedOrder, Dates, Addresses } from "../app/types/component-types/OrderFormData"
import { OrderItemForm as DefaultItem } from "@/app/_components/lib/OrderForm";

import addressToString from "@/utils/actions/addressToString";
import CartItem from "@/app/(protected)/checkout/_components/CartItem";
import { getUrls } from "@/utils/supabase/clientActions/getUrls";
import { getProductInfo } from "@/utils/supabase/clientActions/getProductInfo";
import getUserCart from "@/utils/supabase/clientActions/getUserCart";
import initCart from "@/utils/supabase/clientActions/initCart";

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
  updateItem: (item: OrderItem) => void
  removeItem: (item: OrderItem) => void
  getSortedOrder: () => SortedOrder
  updateAddressesAndDates: (cart: Cart) => Cart
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {

  const context = useContext(CartContext);

  return context;

}

export const CartProvider: React.FC<CartProviderProps> = ({ children }: { children: React.ReactNode }) => {

  const { user } = useUser();
  const [cart, setCart] = useState<Cart>(defaultCart);
  const cartRef = useRef<Cart>(cart);

  // console.log("CartProvider/cart: ", cart);

  // Todo: set userId to shop ID and update user info as needed with session.
  // const [user, setUser] = useState()

  useEffect(() => {
    console.log("CartProvider useEffect triggered.");

    if (!user || user.role === "guest") {
      if (user) {
        console.log("User detected. User role: ", user?.role);
      }
      console.log("Getting cart from storage...")
      const storedCartJSON = localStorage && localStorage.getItem("cart")
      const storedCart: LocalCart = storedCartJSON ? JSON.parse(storedCartJSON) : null;

      const refreshedCart = refreshCart(storedCart);

      cartRef.current = refreshedCart;
      setCart(refreshedCart);
    };

  }, [user])


  useEffect(() => {

    if (user && user.role === ("user" || "admin")) {
      console.log("User detected. Getting cart from DB...");
      {
        (async () => {
          console.log("getting user cart...")
          const userCart = await getUserCart(user);

          if (!userCart) {
            console.log("no cart detected; setting default cart")

            const { data, error } = await initCart(user);

            if (!data) {
              console.log("Cannot initialize cart without a user.");
              console.log(error && error.message);
              return;
            }

            const emptyCart = {
              id: data.id,
              ...defaultCart
            }
            cartRef.current = emptyCart;
            setCart(emptyCart);
            // cartRef.current = refreshedCart;
            // setCart(refreshedCart);
            return;
          } else {
            console.log("user cart initialized! setting user cart...")
            console.log("userCart: ", userCart)
            cartRef.current = userCart;
            setCart(userCart);
          }

        })()
        return;
      }

    }
  }, [user]);

  /**
   * 
   * @param cart :LocalCart - This is used to check the age of the cart in storage and to refresh it.. If so, check the age of the cart. Return client a new cart after 2 days.
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
  const addToCart = async (item: OrderItem) => {

    const supabase = createClient();

    let cartId;

    const { id, deliveryDates, addresses, cartItems } = cart;
    // console.log("deliveryDates, addresses, cartItems: ", deliveryDates, addresses, cartItems);

    // Unauthenticated user flow:
    if (!user) {
      // Get the cart items in the cart;
      const newCartItems: Array<OrderItem> = [...cartItems];
      // add the item to the array;
      newCartItems.push(item);
      // sort + update addresses and delivery dates
      const newCart = updateAddressesAndDates({
        ...cart,
        cartItems: newCartItems
      })
      // update cart - should update in localstorage only.
      updateCart(newCart);
      return;
    }

    // Authenticated user flow:
    if (!id) {
      console.log("CartContext/addToCart - User found, fetching data...")
      // first init a Cart in the DB if there is no cart ID, since the cart is local only.
      const { data: cartInitData, error: cartInitError } = await supabase
        .from("carts")
        .insert({ sender_id: user.id })
        .select("id")
        .single();

      if (!cartInitData) {
        console.error(cartInitError.details);
        return;
      }
      cartId = cartInitData.id;
    } else {
      cartId = id;
    }
    // then insert the new item into cart_items with the cart_id.
    const query = {
      card_message: item.cardMessage,
      cart_id: cartId,
      delivery_date: item.deliveryDate,
      delivery_instructions: item.deliveryInstructions,
      product_id: item.productId,
      recipient_id: item.recipId,
      selected_tier: item.selectedTier
    };

    const { data: addToCartData, error: addToCartError } = await supabase
      .from("cart_items")
      .insert(query)
      .select("id")
      .single();

    if (addToCartError) {
      console.error(addToCartError.details);
      return;
    }
    // Then make sure to update the cart_item with the cart_item_id for update operations.
    const newCartItems: Array<OrderItem> = [...cartItems];

    item.id = addToCartData.id
    newCartItems.push(item);

    const newCart = updateAddressesAndDates({
      ...cart,
      cartItems: newCartItems
    })

    cartRef.current = newCart;
    setCart(newCart);

  };


  /**
   * 
   * @param newCart:Cart - The new cart that should be the result of updating the cart.
   * @returns void - If authenticated, upsert to DB. Otherwise, update localstorage.
   */
  const updateCart = async (newCart: Cart) => {

    const supabase = createClient();
    // if the user is not logged in, then the cart_item id is blank.
    if (!user) {
      if (!newCart.cartItems.length) {
        console.log("No items in cart - setting to default cart.");
        localStorage.setItem("cart", JSON.stringify(defaultCart));
        setCart({ ...defaultCart });
      };

      // const updatedCart = updateAddressesAndDates(newCart);
      const localCart = { ...newCart } as LocalCart;

      localCart.updatedAt = Date.now();
      localStorage.setItem("cart", JSON.stringify(localCart));

      cartRef.current = newCart;
      setCart({ ...newCart });
    } else {

      // if the user is logged in, then the cart_item should have an id associated with it.
      // upsert for all cart_items with the ids.
      const query = newCart.cartItems.map(item => {
        return {
          card_message: item.cardMessage,
          cart_id: cart.id,
          delivery_date: item.deliveryDate,
          delivery_instructions: item.deliveryInstructions,
          product_id: item.productId,
          recipient_id: item.recipId,
          selected_tier: item.selectedTier
        };
      });

      const ids = newCart.cartItems.map(item => item.id)

      const { data: upsertData, error: upsertError } = await supabase
        .from("cart_items")
        .upsert(query)
        .in("id", ids)
        .select("id");

      if (upsertError) {
        console.error(upsertError.details);
        return;
      };

    }
  };

  async function updateItem(item: OrderItem) {
    const supabase = createClient();

    const { id, productId, selectedTier, cardMessage, recipId, deliveryInstructions, deliveryDate } = item;

    if (!id) {
      throw new Error("No cart item ID detected - cannot update item")
    }

    const query = {
      product_id: productId,
      delivery_date: deliveryDate,
      recipient_id: recipId,
      selectedTier: selectedTier,
      card_message: cardMessage,
      delivery_instructions: deliveryInstructions,
    }

    const { data, error } = await supabase
      .from("cart_items")
      .upsert(query)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error.details);
      throw new Error(`${error.message}`);
    }

    console.log("CartContext/updateItem/data: ", data);

  }

  async function removeItem(item: OrderItem) {
    const supabase = createClient();
    const { id } = item;

    if (!id) {
      throw new Error("No ID detected - cannot remove from DB");
    }

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id)

    if (error) {
      console.error(error.details);
      throw new Error(`${error.message}`);
    };

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

    order.forEach((addressArr, dateIdx) => {
      for (let item of cartItems) {

        if ((item.deliveryDate === deliveryDates[dateIdx]) && addressArr[item.recipAddressIndex]) {

          addressArr[item.recipAddressIndex].push(item);
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
  const updateAddressesAndDates = (cart: Cart | LocalCart) => {
    // careful when using "keyof typeof" to dynamically type keys. The "keyof" a blank object will return an array-like with number indices, and so TS will automatically type the key as "string | number" even if the key has been indicated as a string in the interface.
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
    };

    return newCart;

  };


  return (
    <CartContext.Provider value={{ cart, updateCart, addToCart, updateItem, removeItem, getSortedOrder, updateAddressesAndDates }}>{children}</CartContext.Provider>
  )
}
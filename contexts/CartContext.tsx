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

  const { user } = useUser();

  const [cart, setCart] = useState<Cart>(defaultCart);

  const cartRef = useRef<Cart>(cart);

  // console.log("CartProvider/cart: ", cart);

  // Todo: set userId to shop ID and update user info as needed with session.
  // const [user, setUser] = useState()

  useEffect(() => {
    console.log("CartProvider useEffect triggered.")

    console.log("Getting cart from storage...")
    const storedCartJSON = localStorage && localStorage.getItem("cart")
    const storedCart: LocalCart = storedCartJSON ? JSON.parse(storedCartJSON) : null;

    const refreshedCart = refreshCart(storedCart);

    /**
     * 
     * @returns :Cart 
     * This function takes no arguments and returns a Cart after fetching the user's cart and the relevant product details. The cart is returned after running the updateAddressesAndDates function on the fetched data.
     */
    async function getUserCart() {

      if (!user || !user.id) return;

      // get: cartId, cart items associated with the cart ID, and the recipients associated with the orders.
      const { data: cartData, error: cartError } = await supabase
        .from("carts")
        .select(`id, cartItems:cart_items!inner(*)`)
        .eq("carts.sender_id", user.id)
        .single();

      if (!cartData || cartError) {
        console.error("CartContext/useEffect/error.details: ", cartError.details);
        return;
      };

      const itemIds = cartData.cartItems.map(item => item.product_id);

      // get product info for each item in the cart;
      const { data: cartItemsData, error: cartItemsError } = await getProductInfo(itemIds)

      if (!cartItemsData || cartItemsError) {
        console.error(cartItemsError && cartItemsError.details);
        return;
      }
      if (!cartItemsData.length) {
        return;
      }

      // map the cart data to the product data.
      const clientCartItems = cartData.cartItems.map((item, idx) => {

        const cartItem = {
          id: item.id,
          deliveryDate: item.delivery_date,
          productId: item.product_id,
          imageUrl: cartItemsData[idx].imageUrl,
          name: cartItemsData[idx].name,
          prices: cartItemsData[idx].prices,
          selectedTier: item.selected_tier ? item.selected_tier : 0,
          cardMessage: item.card_message,
          deliveryInstructions: item.delivery_instructions,
        }

        if (!item.recipient_id) {
          return {
            ...DefaultItem,
            ...cartItem
          }
        }

        const recipInfo = user.recipients![item.recipient_id];

        // typeof NaN ==="number", so we can use this to force typing momentarily before we reassign it with the updater function.
        return {
          ...cartItem,
          recipId: recipInfo.id,
          recipFirst: recipInfo.firstName,
          recipLast: recipInfo.lastName,
          recipAddress: {
            streetAddress1: recipInfo.street1,
            streetAddress2: recipInfo.street2,
            townCity: recipInfo.townCity,
            state: recipInfo.state,
            zip: recipInfo.zip
          },
          recipAddressIndex: NaN,
          recipPhone: recipInfo.phone
        }
      })

      return updateAddressesAndDates({
        id: cartData.id,
        addresses: [],
        deliveryDates: [],
        cartItems: [...clientCartItems],
        updatedAt: Date.now()
      })
    }

    if (user && user.role === "user") {
      console.log("User detected. Getting cart from DB...");
      // fetch cart from DB;
      (async () => {
        const userCart = await getUserCart();

        if (!userCart) {
          cartRef.current = refreshedCart;
          setCart(refreshedCart);
          return;
        } else {
          cartRef.current = userCart;
          setCart(userCart);
        }

      })()
      return;
    }

    cartRef.current = refreshedCart;
    setCart(refreshedCart);

  }, [user, supabase])

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

    let cartId;

    const { id, deliveryDates, addresses, cartItems } = cart;
    console.log("deliveryDates, addresses, cartItems: ", deliveryDates, addresses, cartItems);

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
      // first init a Cart in the DB if there is no cart.
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

    updateCart(newCart);

  };


  /**
   * 
   * @param newCart:Cart - The new cart that should be the result of updating the cart.
   * @returns void - If authenticated, upsert to DB. Otherwise, update localstorage.
   */
  const updateCart = async (newCart: Cart) => {

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
      // upsert for all cart_items with the id.
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
    <CartContext.Provider value={{ cart, updateCart, addToCart, getSortedOrder, updateAddressesAndDates }}>{children}</CartContext.Provider>
  )
}
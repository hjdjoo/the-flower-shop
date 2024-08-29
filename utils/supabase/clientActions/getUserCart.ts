import { createClient } from "../client";

import { User } from "@/app/types/auth-types";
import { getProductInfo } from "./getProductInfo";

import { OrderItemForm as DefaultItem } from "@/app/_components/lib/OrderForm";

/**
 * 
 * @returns :Cart 
 * This function takes user information and returns a Cart after fetching the user's cart and the relevant product details. The cart contains a blank array for the delivery dates and addresses
 */
export default async function getUserCart(user: User) {

  const supabase = createClient();

  if (!user || !user.id) {
    console.log("No user detected. returning...")
    return
  };

  console.log(user.id);

  // using .select().single() when the query returns multiple rows throws a 406 error. Use limit(1) to ensure that the return rows are limited.
  const { data: cartIdData, error: cartIdError } = await supabase
    .from("carts")
    .select("id")
    .eq("sender_id", user.id)
    .limit(1)
    .single();

  if (!cartIdData) {
    console.log(cartIdData);
    console.log("getUserCart/cartIdError", cartIdError.message);
    return;
  }

  // get: cartId, cart items associated with the cart ID, and the recipients associated with the orders.
  const { data: cartData, error: cartError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cartIdData.id);

  console.log("getUserCart/cartData: ", cartData)
  if (!cartData || cartError) {
    console.log("getUserCart/error.message: ", cartError.message);
    console.log("getUserCart/error.details: ", cartError.details);
    return {
      id: cartIdData.id,
      cartItems: [],
      addresses: [],
      deliveryDates: []
    };
  };

  if (!cartData || !cartData.length) {
    return {
      id: cartIdData.id,
      cartItems: [],
      addresses: [],
      deliveryDates: []
    };
  }

  const itemIds = cartData.map(item => item.product_id);

  // get product info for each item in the cart;
  const { data: cartItemsData, error: cartItemsError } = await getProductInfo(itemIds)

  if (!cartItemsData || !cartItemsData.length || cartItemsError) {
    console.error(cartItemsError && cartItemsError.details);
    return {
      id: cartIdData.id,
      cartItems: [],
      addresses: [],
      deliveryDates: []
    };
  }

  // map the cart data to the product data.
  const clientCartItems = cartData.map((item, idx) => {

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

  return {
    id: cartIdData.id,
    addresses: [],
    deliveryDates: [],
    cartItems: [...clientCartItems],
    updatedAt: Date.now()
  }

  // return updateAddressesAndDates({
  //   id: cartData.id,
  //   addresses: [],
  //   deliveryDates: [],
  //   cartItems: [...clientCartItems],
  //   updatedAt: Date.now()
  // })


}
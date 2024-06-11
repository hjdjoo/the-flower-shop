import { createContext, useContext, useState } from "react";

type productData = {
  id: number,
  address: string,
  note: string
}

const CartContext = createContext([]);

export default CartContext;
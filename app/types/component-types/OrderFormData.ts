// when sending to DB:
// have order details ready in "cart" table
// "cart" table should contain OrderFormData.

// keep price, delivery fee, and other numerical inputs to strings to avoid null errors. ProductId can stay as a number since that is what the DB is expecting and the value will always be nonzero.
export interface OrderItem {
  productId: number,
  imageUrl: string,
  name: string,
  selectedTier?: number,
  prices: number[],
  cardMessage: string,
  recipFirst: string,
  recipLast: string,
  recipAddress: Address,
  recipAddressIndex: number,
  recipPhone: string,
  deliveryFee: string,
  deliveryInstructions: string,
  deliveryDate: string,
}

export type SortedOrder = OrderItem[][];

export interface SenderInfo {
  senderFirst: string,
  senderLast: string,
  phoneNumber: number,
  email: string
}

export interface OrderFormData {

  senderId?: number,
  senderFirst?: string,
  senderLast?: string,
  senderPhone?: string,
  senderEmail?: string,

  orderItems: Array<OrderItem>

}

export interface Cart {
  deliveryDates: string[]
  cartItems: Array<OrderItem>
}

export interface PriceInfo {
  cartTotal: number,
  itemPrices: ItemPrices[]
}

export interface ItemPrices {
  itemValue: number,
  deliveryFee: number,
  tax: number,
  total: number
}

export type Dates = string[];

export interface Address {
  streetAddress1: string,
  streetAddress2: string,
  townCity: string,
  state: string,
  zip: string,
}

export type Addresses = Address[];


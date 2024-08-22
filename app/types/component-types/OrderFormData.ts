// when sending to DB:
// have order details ready in "cart" table
// "cart" table should contain OrderFormData.

// keep price, delivery fee, and other numerical inputs to strings to avoid null errors. ProductId can stay as a number since that is what the DB is expecting and the value will always be nonzero.
export interface OrderItem {
  id?: number
  productId: number,
  imageUrl: string,
  name: string,
  selectedTier?: number,
  prices: number[],
  cardMessage: string,
  recipId?: number,
  recipFirst: string,
  recipLast: string,
  recipAddress: Address,
  recipAddressIndex: number,
  recipPhone: string,
  deliveryInstructions: string,
  deliveryDate: string,
}

export type SortedOrder = OrderItem[][][];

export type Dates = string[];

export interface Address {
  streetAddress1: string,
  streetAddress2: string,
  townCity: string,
  state: string,
  zip: string,
}

export type Addresses = Address[];

export interface SenderInfo {
  senderId?: number
  senderFirst: string,
  senderLast: string,
  senderName: string,
  senderPhone: string,
  senderEmail?: string
}

export interface OrderForm {
  orders: Order[],
  sortedOrder: SortedOrder,
  total: string,
  paymentIntent: string
}

export interface Order {
  senderInfo: SenderInfo
  deliveryDate: string
  address: Address
  orderItems: OrderItem[]
  orderPrices: OrderPriceInfo
}

export interface Cart {
  id?: number
  addresses: Addresses
  deliveryDates: string[]
  cartItems: Array<OrderItem>
}

export interface OrderPriceInfo {
  itemValues: number[],
  tax: number,
  deliveryFee: number,
  total: number
}

export interface FinalPriceInfo {
  cartTotal: number,
  orderPrices: OrderPriceInfo[]
}

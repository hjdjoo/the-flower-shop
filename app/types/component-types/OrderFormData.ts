export interface OrderFormData {

  senderId: string | undefined,
  senderFirst: string,
  senderLast: string,
  senderPhone: number | undefined,
  senderEmail: string | undefined,

  orderItems: Array<OrderItem>

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

// keep price, delivery fee, and other numerical inputs to strings to avoid null errors. ProductId can stay as a number since that is what the DB is expecting and the value will always be nonzero.
export interface PriceTiers {
  standardPrice: string,
  premiumPrice: string,
  deluxePrice: string
}

export interface OrderItem {
  productId: number,
  priceTiers: PriceTiers,
  imageUrl: string,
  name: string,
  price: string,
  selectedTier: number,
  cardMessage: string,
  recipFirst: string,
  recipLast: string,
  recipAddress: Address,
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

export interface Cart {
  deliveryDates: string[]
  cartItems: Array<OrderItem>
}
export interface OrderFormData {

  senderId: string | undefined,
  senderFirst: string,
  senderLast: string,
  senderPhone: number | undefined,
  senderEmail: string | undefined,

  orderItems: Array<OrderItem | undefined>

}

export type Dates = string[];

export interface Address {
  streetAddress1: string,
  streetAddress2: string,
  townCity: string,
  zip: string,
}

export type Addresses = Address[];

// I was going to extend OrderItem to CartItem to have the date and image URl available in the cart, but... I realized it was just complicating the typechecking process.

export interface OrderItem {
  productId: string,
  imageUrl: string,
  name: string,
  price: string,
  cardMessage: string,
  recipFirst: string,
  recipLast: string,
  recipAddress: Address,
  recipPhone: string,
  deliveryFee: string,
  deliveryInstructions: string,
  deliveryDate: string,
}

export type Order = OrderItem[][];

export interface SenderInfo {
  senderFirst: string,
  senderLast: string,
  phoneNumber: number,
  email: string
}

export interface Cart {
  deliveryDates: string[]
  cartItems: Array<OrderItem | undefined>
}
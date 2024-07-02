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
  state: string,
  zip: string,
  orders: number
}

export type Addresses = Address[];

// Elliot: originally the recipAddress was just a number that had the index of the address from the Addresses type
// I'm not sure if we need to save the address in the orderItem explicitly, so I'll just leave a comment about it to discuss later with Darryl
export interface OrderItem {
  productId: string,
  imageUrl: string,
  name: string,
  price: string,
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
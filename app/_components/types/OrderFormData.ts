export interface OrderFormData {

  senderId: string | undefined,
  senderFirst: string,
  senderLast: string,
  senderPhone: number | undefined,
  senderEmail: string | undefined,

  recipFirst: string,
  recipLast: string,
  recipStreetAddress1: string,
  recipStreetAddress2: string,
  recipTownCity: string,
  recipZip: number | undefined,
  recipPhone: number | string,
  cardMessage: string,
  deliveryDate: string,
  deliveryFee: number | undefined,
  deliveryInstructions: string,

  products: Array<undefined | {
    productId: string | number | undefined,
    productType: string | undefined,
    description: string,
    value: number
  }>,

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


export interface OrderItem {
  productID: number,
  price: number,
  cardMessage: string,
  recipFirst: string,
  recipLast: string,
  recipAddress: Address,
  recipPhone: number,
  deliveryFee: number,
  deliveryInstructions: string,
}

export type Order = OrderItem[][];

export interface SenderInfo {
  senderFirst: string,
  senderLast: string,
  phoneNumber: number,
  email: string
}
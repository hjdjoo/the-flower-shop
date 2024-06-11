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
  recipPhone: number | undefined,
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

export interface Dates {
  dates: string[]
};

export interface Address {
  StreetAddress1: string,
  StreetAddress2: string,
  TownCity: string,
  State: string,
  Zip: number,
}

export interface Addresses {
  addresses: Address[]
};

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

export interface Order {
  orders: OrderItem[],
  senderFirst: string,
  senderLast: string,
  phoneNumber: number,
  email: string | undefined
}
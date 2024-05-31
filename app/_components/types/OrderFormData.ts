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

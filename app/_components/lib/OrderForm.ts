import type { OrderFormData } from "../types/OrderFormData"
export const OrderForm = {

  senderId: undefined,
  senderFirst: "",
  senderLast: "",
  senderPhone: undefined,
  senderEmail: "",
  recipFirst: "",
  recipLast: "",
  recipStreetAddress1: "",
  recipStreetAddress2: "",
  recipTownCity: "",
  recipZip: undefined,
  recipPhone: undefined,
  cardMessage: "",
  products: [],
  orderDate: "",
  deliveryDate: "",

} as OrderFormData
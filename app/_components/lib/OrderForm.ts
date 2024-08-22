import type { OrderForm, OrderItem, Address } from "../../types/component-types/OrderFormData"


export const address = {
  streetAddress1: "",
  streetAddress2: "",
  townCity: "",
  state: "",
  zip: "",
} as Address;

export const OrderItemForm = {
  name: "",
  imageUrl: "",
  deliveryDate: "",
  cardMessage: "",
  recipFirst: "",
  recipLast: "",
  recipAddress: address,
  recipPhone: "",
  deliveryInstructions: "",
} as OrderItem;

export const FullOrderForm = {
  senderInfo: {
    senderId: 0,
    senderFirst: "",
    senderLast: "",
    senderName: "",
    senderPhone: "",
    senderEmail: "",
  },
  sortedOrder: [],
  orders: [],
  total: "",
  paymentIntent: ""
} as OrderForm
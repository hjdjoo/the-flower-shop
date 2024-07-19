import type { OrderFormData, OrderItem, Address, PriceTiers } from "../../types/component-types/OrderFormData"


export const address = {
  streetAddress1: "",
  streetAddress2: "",
  townCity: "",
  zip: "",
} as Address;

export const OrderItemForm = {
  name: "",
  imageUrl: "",
  priceTiers: {
    standardPrice: "",
    premiumPrice: "",
    deluxePrice: ""
  },
  deliveryDate: "",
  price: "",
  cardMessage: "",
  recipFirst: "",
  recipLast: "",
  recipAddress: address,
  recipPhone: "",
  deliveryFee: "8.95",
  deliveryInstructions: "",
} as OrderItem;

export const FullOrderForm = {
  senderId: undefined,
  senderFirst: "",
  senderLast: "",
  senderPhone: undefined,
  senderEmail: "",
  orderItems: [],
} as OrderFormData
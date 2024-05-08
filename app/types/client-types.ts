export interface FileData {
  encodedData: string | undefined,
  fileType: string | undefined
}

export interface ProductForm {
  name: string,
  categories: number[],
  description: string,
  standardPrice: number | string | undefined,
  premiumPrice: number | string | undefined,
  deluxePrice: number | string | undefined,
  imageUrl: string,
}

export interface ProductData {
  id: string,
  name: string,
  description: string,
  standard_price: number | string | undefined,
  premium_price: number | string | undefined,
  deluxe_price: number | string | undefined,
  image_url: string,
}

export interface ErrorMessage {
  severity: "error" | "warning" | "success" | undefined,
  message: string
}

export interface HomepageCategory {
  id: number,
  name: string
}

export interface WindowSize {
  width: number
  height: number
}
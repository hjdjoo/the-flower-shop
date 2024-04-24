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

export interface ErrorMessage {
  severity: "error" | "warning" | "success" | undefined,
  message: string
}
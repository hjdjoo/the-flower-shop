export interface FileData {
  encodedData: string | undefined,
  fileType: string | undefined
}

export interface ProductForm {
  name: string,
  categories: number[],
  description: string,
  standardPrice: number | null,
  premiumPrice: number | null,
  deluxePrice: number | null,
  imageUrl: string,
}

export interface ErrorMessage {
  severity: "error" | "warning" | "success" | undefined,
  message: string
}
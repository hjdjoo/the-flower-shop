export interface FileData {
  encodedData: string | undefined,
  fileType: string | undefined
}

export interface ProductData {
  name: string,
  categories: number[],
  description: string,
  standardPrice: number | undefined,
  premiumPrice: number | undefined,
  deluxePrice: number | undefined,
  imageUrl: string,
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

export interface BannerData {
  name: string,
  url: string
}
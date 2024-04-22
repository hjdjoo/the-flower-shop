export interface FileData {
  encodedData: string | undefined,
  fileType: string | undefined
}

export interface ProductForm {
  name: string,
  categories: string[],
  description: string,
  prices: number[],
  imageUrl: string,
}
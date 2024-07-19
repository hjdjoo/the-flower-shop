/**
 * 
 * @param price string: price for item, **in dollars**
 * @returns number: 
 */

export default function calculateTax(value: number | string) {

  if (!value) {
    throw new Error("Input a product price.")
  }

  const njSalesTax = 0.0625

  let inputPrice = typeof value === "string" ? parseFloat(value) : value;

  const tax100 = Math.floor((inputPrice) * njSalesTax * 100).toFixed(2)

  const tax = parseInt(tax100) / 100

  return tax;

}
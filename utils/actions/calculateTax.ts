
/**
 * 
 * @param price string: price for item
 * @param deliveryFee string: delivery fee calculated based on simple linear formula
 * @returns : {tax: string, total: string}
 */

export default function calculateTax(price: string | number, deliveryFee: string | number = 0) {

  if (!price) {
    throw new Error("Input a product price.")
  }

  const njSalesTax = 0.0625

  let inputPrice = typeof price === "string" ? parseFloat(price) : price;
  let inputDelFee = typeof deliveryFee === "string" ? parseFloat(deliveryFee) : deliveryFee;


  const tax100 = Math.floor((inputPrice + inputDelFee) * njSalesTax * 100).toFixed(2)

  const tax = parseInt(tax100) / 100

  const total = parseFloat((inputPrice + inputDelFee + tax).toFixed(2))

  return { tax: tax, total: total };

}
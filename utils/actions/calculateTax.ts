
/**
 * 
 * @param price string: price for item
 * @param deliveryFee string: delivery fee calculated based on simple linear formula
 * @returns : {tax: string, total: string}
 */

export default function calculateTax(price: string, deliveryFee: string) {

  const njSalesTax = 0.0625

  const tax100 = Math.floor((parseFloat(price) + parseFloat(deliveryFee)) * njSalesTax * 100).toFixed(2)

  const tax = parseInt(tax100) / 100

  const total = (parseFloat(price) + parseFloat(deliveryFee) + tax).toFixed(2).toString();

  return { tax: tax, total: total };

}
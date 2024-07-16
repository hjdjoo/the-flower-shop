/**
 * 
 * @param distance Distance in meters
 * @param time Time in seconds
 * @returns delivery fee as a num
 */
export default function calculateDelivery(distance: number, time: number) {

  if (typeof distance !== "number" || typeof time !== "number") {
    throw new Error("distance and time must be number types")
  }

  const baseFee = 8.95

  const miles = Math.ceil(distance / 1609);
  const mins = Math.ceil(time / 60);

  if (miles > 12 || mins > 18) {
    throw new Error("This may be outside of our typical delivery zone. Please call the shop for assistance.");
  }

  // price increases 1 dollar for every 2 miles on the route.
  let addFeeMiles = Math.floor(miles / 2);

  // nothing extra up to the first 5 minutes, then 1 dollar for every 3 minutes of local driving.
  let addFeeMins = mins < 5 ? 0 : Math.ceil(mins - 5 / 3);

  // return the lesser of the two.

  const deliveryFee = baseFee + Math.min(addFeeMiles, addFeeMins);

  return deliveryFee


}
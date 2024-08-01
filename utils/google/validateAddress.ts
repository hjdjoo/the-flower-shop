import { OrderItem } from "@/app/types/component-types/OrderFormData";

export default async function validateAddress(orderItem: OrderItem) {

  try {
    const { streetAddress1, streetAddress2, townCity, state, zip } = orderItem.recipAddress;
    const formatApt = streetAddress2.replace(/^[^0-9]*/g, '');

    const googData = await fetch(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            addressLines: [streetAddress1, formatApt, townCity, state, zip]
          }
        })
      });

    const res = await googData.json();

    let newStreetAddress1 = "";
    let newStreetAddress2 = "";
    if (res.result.address.addressComponents.length > 7) {
      newStreetAddress1 = res.result.address.postalAddress.addressLines[0].replace(/\s[^\s]*$/, '');
      newStreetAddress2 = res.result.address.addressComponents[2].componentName.text
    } else {
      newStreetAddress1 = res.result.address.postalAddress.addressLines[0];
    }
    const formattedAddress = {
      streetAddress1: newStreetAddress1,
      streetAddress2: newStreetAddress2,
      townCity: res.result.address.postalAddress.locality,
      state: res.result.address.postalAddress.administrativeArea,
      zip: res.result.address.postalAddress.postalCode,
    }
    console.log("validateAddress/res", res);
    console.log('Valid Address');

    return formattedAddress;
  }
  catch (e) {

    console.error('Error validating new address: ', e)
    throw new Error(`Couldn't validate address. ${e}`);

  }
  // setUpdatedItem({ ...updatedItem, recipAddress: formattedAddress })

}
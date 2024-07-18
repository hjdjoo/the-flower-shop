import { Address } from "@/app/types/component-types/OrderFormData";

export default function addressToString(address: Address) {

  const addressStr = Object.values(address).filter(line => {
    return line.length > 0;
  }).join(",")

  console.log(Object.values(address))

  console.log("addressToStr: addressStr: ", addressStr);

  return addressStr;

}
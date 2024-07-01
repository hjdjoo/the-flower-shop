export default function verifyDeliveryDate(date: string): { valid: boolean, message: string } {

  const today = new Date(Date.now());

  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();
  const todayYear = today.getFullYear();

  const currTime = today.getTime();
  // console.log('verifyDeliveryDate/currTime: ', currTime);

  const normalizedToday = Date.parse(`${todayYear}-${todayMonth}-${todayDate - 1} 23:59:59`)
  const deliveryDate = Date.parse(`${date} 00:00:01`);

  const deliveryDay = new Date(date).getDay();
  // console.log(deliveryDay);

  if (deliveryDay === 6) return { valid: false, message: "We're closed on Sundays." };
  if (deliveryDate < normalizedToday) return { valid: false, message: "We cannot halt the inexorable forward march of time!" };

  else return { valid: true, message: "success!" };
}
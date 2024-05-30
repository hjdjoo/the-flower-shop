export default function verifyDeliveryDate(date: string): boolean {

  const today = new Date(Date.now());

  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();
  const todayYear = today.getFullYear();

  const currTime = today.getTime();
  console.log('verifyDeliveryDate/currTime: ', currTime);

  const normalizedToday = Date.parse(`${todayYear}-${todayMonth}-${todayDate - 1} 23:59:59`)
  const deliveryDate = Date.parse(`${date} 00:00:01`);

  if (deliveryDate < normalizedToday) return false;
  else return true;
}
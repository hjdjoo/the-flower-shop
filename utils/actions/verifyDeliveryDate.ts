export default function verifyDeliveryDate(date: string): { valid: boolean, message: string } {

  const now = new Date(Date.now());

  const todayMonth = now.getMonth() + 1;
  const todayDay = now.getDate();
  const todayYear = now.getFullYear();

  const todayStr = `${todayYear}-${todayMonth}-${todayDay}`

  // const currTime = now.getTime();
  // console.log('verifyDeliveryDate/currTime: ', currTime);

  const normalizedToday = Date.parse(`${todayYear}-${todayMonth}-${todayDay - 1} 23:59:59`)
  const deliveryDate = Date.parse(`${date} 00:00:01`);

  const deliveryDay = new Date(date).getDay();
  // console.log(deliveryDay);

  if (deliveryDay === 6) return { valid: false, message: "We're closed on Sundays." };
  if (deliveryDate < normalizedToday) return { valid: false, message: "We cannot halt the inexorable forward march of time!" };
  // parse the given date and the normalized version of today's date. If the two return equal strings, then check the time and make sure it is placed before noon.
  console.log("selected date: ", date, "today's date: ", `${todayStr}`)
  console.log(Date.parse(`${date} 00:00:00`), Date.parse(`${todayStr} 00:00:00`))

  if (Date.parse(`${date} 00:00:00`) === Date.parse(`${todayStr} 00:00:00`)) {

    const tomorrow = Date.parse(todayStr) + (24 * 3600 * 1000)
    console.log(tomorrow);
    const noon = tomorrow - (12 * 3600 * 1000);
    if (Date.now() >= noon) {
      return { valid: false, message: "Same-day orders must be placed before noon. For any flower emergencies, please call our shop." };
    }
  }

  return { valid: true, message: "success!" };
}
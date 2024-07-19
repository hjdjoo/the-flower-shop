export default function getDayOfWeek(date: string) {

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const day = new Date(date).getDay();

  return days[day]

}
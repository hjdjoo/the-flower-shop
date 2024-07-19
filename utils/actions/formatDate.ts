/**
 * 
 * @param date string: yyyy-mm-dd format
 * @returns string: mm/dd/yyyy format
 */
export default function formatDate(date: string) {

  const splitDate = date.split("-");
  // [yyyy, mm, dd]

  [splitDate[0], splitDate[1], splitDate[2]] = [splitDate[1], splitDate[2], splitDate[0]];
  // [mm, dd, yyyy]

  const normalDate = splitDate.join("/");
  // mm/dd/yyyy

  return normalDate;

}
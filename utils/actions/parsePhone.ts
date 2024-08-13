
export const parsePhone = (phoneNumber: string): string | undefined => {
  // i: formatted phone
  // o: formatted phone
  // normalize phone number, then re-format.
  const normalized = phoneNumber.replace(/[(, )]|[-]|[\s]/g, "")
  const length = normalized.length;

  if (length < 4) {
    const areaCode = normalized.slice(0)
    return `${areaCode}`
  }
  if (length >= 4 && length < 7) {
    const areaCode = normalized.slice(0, 3)
    const firstThree = normalized.slice(3)
    return `(${areaCode}) ${firstThree}`
  }
  if (length >= 7 && length < 11) {
    const areaCode = normalized.slice(0, 3)
    const firstThree = normalized.slice(3, 6)
    const lastFour = normalized.slice(6)
    return `(${areaCode}) ${firstThree}-${lastFour}`
  }
  if (length >= 11) {
    const areaCode = normalized.slice(0, 3)
    const firstThree = normalized.slice(3, 6)
    const lastFour = normalized.slice(6, 10)
    return `(${areaCode}) ${firstThree}-${lastFour}`
  }
}
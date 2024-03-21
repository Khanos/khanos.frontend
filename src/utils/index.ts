/**
 * Pads a number with leading zeros
 * @param number - The number to pad
 * @param length - The length of the resulting string
 * @returns The padded number
 * @example
 * padNumber(1, 4) // '0001'
 * padNumber(123, 4) // '0123'
 * padNumber(1234, 4) // '1234'
 **/
export const padNumber = (number: number | string, length = 4) => {
  return number.toString().padStart(length, '0');
}
/**months to help format */
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * converts date to real date
 * @param date date to convert
 * @returns real date
 */
function convertDateToUTC(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

/**
 * format date string
 * @param date date string
 * @param format date format string
 * @returns date formatted string
 */
export const dateFormat = (date: string | Date, format: string) => {
  const d = convertDateToUTC(new Date(date));
  const month = `${d.getMonth() + 1}`;
  const day = `${d.getDate()}`;
  const year = d.getFullYear();

  return format
    .replace(/YYYY/g, year.toString())
    .replace(/YY/g, year.toString().substring(2, 2))
    .replace(/MMMM/g, months[d.getMonth()])
    .replace(/MMM/g, months[d.getMonth()].substring(0, 3))
    .replace(/MM/g, month.length === 1 ? `0${month}` : month)
    .replace(/M/g, month)
    .replace(/DD/g, day.length === 1 ? `0${day}` : day)
    .replace(/D/g, day);
};

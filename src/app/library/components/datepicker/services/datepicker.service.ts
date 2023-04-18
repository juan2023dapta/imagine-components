import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DatepickerService {
  /**available days */
  daysWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  /**available months */
  months = [
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
  convertDateToUTC(date: Date) {
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
  dateFormat(date: string | Date, format: string) {
    if (date) {
      const dateObject = new Date(date);
      const second = `${dateObject.getSeconds()}`;
      const minute = `${dateObject.getMinutes()}`;
      const hour = `${dateObject.getHours()}`;
      const month = `${dateObject.getMonth() + 1}`;
      const day = `${dateObject.getDate()}`;
      const year = dateObject.getFullYear();

      return format
        .replace(/YYYY/g, year.toString())
        .replace(/YY/g, year.toString().substring(2, 2))
        .replace(/MMMM/g, this.months[dateObject.getMonth()].toLowerCase())
        .replace(/MMM/g, this.months[dateObject.getMonth()].toLowerCase().substring(0, 3))
        .replace(/MM/g, month.length === 1 ? `0${month}` : month)
        .replace(/M/g, month)
        .replace(/DD/g, day.length === 1 ? `0${day}` : day)
        .replace(/D/g, day)
        .replace(/HH/g, hour.length === 1 ? `0${hour}` : hour)
        .replace(/mm/g, minute.length === 1 ? `0${minute}` : minute)
        .replace(/SS/g, second.length === 1 ? `0${second}` : second);
    } else {
      return '';
    }
  }
}

/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: main attendance init js
*/

const localeEn = {
    days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'mm/dd/yyyy',
    timeFormat: 'hh:ii aa',
    firstDay: 0
}
new AirDatepicker('#main-picker', {
    autoClose: false,
    dateFormat: 'dd/MM/yyyy',
    locale: localeEn,
});
new AirDatepicker('#modal-picker', {
    autoClose: false,
    dateFormat: 'dd/MM/yyyy',
    locale: localeEn,
});
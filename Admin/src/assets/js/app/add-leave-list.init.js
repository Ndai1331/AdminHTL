/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: Add Leave List init js
*/

document.addEventListener('DOMContentLoaded', function () {
    let leaveTypeChoice = document.getElementById('leaveType');
    if (leaveTypeChoice) {
        const choices = new Choices('#leaveType', {
            placeholderValue: 'Select Style',
            searchPlaceholderValue: 'Search...',
            removeItemButton: true,
            itemSelectText: 'Press to select',
        });
    }
});

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
new AirDatepicker('#fromDate-picker', {
    autoClose: false,
    dateFormat: 'dd/MM/yyyy',
    locale: localeEn,
});
new AirDatepicker('#toDate-picker', {
    autoClose: false,
    dateFormat: 'dd/MM/yyyy',
    locale: localeEn,
});
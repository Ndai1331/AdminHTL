/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: HR Attendance init js
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
new AirDatepicker('#basic-picker', {
  autoClose: false,
  dateFormat: 'dd/MM/yyyy',
  locale: localeEn,
});

// Clock functionality
let timerInterval = null;
const punchBtn = document.getElementById('punchBtn');

function updateTime() {
  const now = new Date();
  document.getElementById("hours").innerText = now.getHours().toString().padStart(2, '0');
  document.getElementById("minutes").innerText = now.getMinutes().toString().padStart(2, '0');
  document.getElementById("seconds").innerText = now.getSeconds().toString().padStart(2, '0');
}

function startClock() {
  updateTime(); // initial call
  timerInterval = setInterval(updateTime, 1000);
}

function stopClock() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Handle punch button click
punchBtn.addEventListener('click', function () {
  if (punchBtn.classList.contains('btn-danger')) {
    // Punching Out
    stopClock();
    punchBtn.classList.remove('btn-danger');
    punchBtn.classList.add('btn-success');
    punchBtn.innerHTML = '<i class="ri-play-fill"></i> Punch In';
  } else {
    // Punching In
    startClock();
    punchBtn.classList.remove('btn-success');
    punchBtn.classList.add('btn-danger');
    punchBtn.innerHTML = '<i class="ri-square-fill"></i> Punch Out';
  }
});

// Start clock by default
startClock();
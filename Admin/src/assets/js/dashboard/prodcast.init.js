/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: prodcast init js
*/

var swiper = new Swiper(".out-now", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  autoplay: {
    delay: 3000,
  },
});

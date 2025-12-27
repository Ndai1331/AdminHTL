/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: prodcast management init js
*/

var swiper = new Swiper(".music-list", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 25,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  autoplay: {
    delay: 1500,
    disableOnInteraction: false,
  },
  breakpoints: {
    768: {
      slidesPerView: 4,
    },
    1025: {
      slidesPerView: 5,
    },
    1441: {
      slidesPerView: 7,
    },
  },
});

/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: Auth init js
*/

document.body.classList.add('signin-page');

// Initialize password toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  initPasswordToggle();
});

function initPasswordToggle() {
  const toggles = document.querySelectorAll(".toggle-password");
  if (!toggles.length) return;

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      if (!targetId) return;

      // Try to find by ID first, then by name attribute
      let targetInput = document.getElementById(targetId);
      if (!targetInput) {
        targetInput = document.querySelector(`[name="${targetId}"]`);
      }
      if (!targetInput) {
        // Try case-insensitive name search as fallback
        targetInput = document.querySelector(`[name^="${targetId}" i], [name*="${targetId}" i]`);
      }
      if (!targetInput) return;

      const icon = this.querySelector("i");
      if (!icon) return;

      if (targetInput.type === "password") {
        targetInput.type = "text";
        icon.classList.replace("ri-eye-off-line", "ri-eye-line");
      } else {
        targetInput.type = "password";
        icon.classList.replace("ri-eye-line", "ri-eye-off-line");
      }
    });
  });
}
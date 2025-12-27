/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: Real Estate add property init js
*/

document.addEventListener('DOMContentLoaded', function () {
    let propertyTypeChoice = document.getElementById('propertyType');
    if (propertyTypeChoice) {
        const choices = new Choices('#propertyType', {
            placeholderValue: 'Select Style',
            searchPlaceholderValue: 'Search...',
            removeItemButton: true,
            itemSelectText: 'Press to select',
        });
    }
    let propertyStatusChoice = document.getElementById('propertyStatus');
    if (propertyStatusChoice) {
        const choices = new Choices('#propertyStatus', {
            placeholderValue: 'Select Style',
            searchPlaceholderValue: 'Search...',
            removeItemButton: true,
            itemSelectText: 'Press to select',
        });
    }
});

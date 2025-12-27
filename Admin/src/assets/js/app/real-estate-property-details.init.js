/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: real-estate-property-details init js
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
});

// Google Map
var map = new GMaps({
    el: '#basic_gmap',
    lat: -12.043333,
    lng: -77.028333
});
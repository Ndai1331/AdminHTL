/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: real-estate-clients init js
*/

document.addEventListener('DOMContentLoaded', function () {
    let clientStatusChoice = document.getElementById('clientStatus');
    if (clientStatusChoice) {
        const choices = new Choices('#clientStatus', {
            placeholderValue: 'Select Style',
            searchPlaceholderValue: 'Search...',
            removeItemButton: true,
            itemSelectText: 'Press to select',
        });
    }
    let clientTypeChoice = document.getElementById('clientType');
    if (clientTypeChoice) {
        const choices = new Choices('#clientType', {
            placeholderValue: 'Select Style',
            searchPlaceholderValue: 'Search...',
            removeItemButton: true,
            itemSelectText: 'Press to select',
        });
    }
});

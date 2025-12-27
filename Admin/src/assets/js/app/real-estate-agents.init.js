/*
Template Name: Menilo - Admin & Dashboard Template
Author: Pixeleyez
Website: https://pixeleyez.com/
File: real-estate-agents init js
*/

document.addEventListener('DOMContentLoaded', function () {
    let ActiveagentStatusChoice = document.getElementById('ActiveagentStatus');
    if (ActiveagentStatusChoice) {
        const choices = new Choices('#ActiveagentStatus', {
            placeholderValue: 'Select Style',
            searchPlaceholderValue: 'Search...',
            removeItemButton: true,
            itemSelectText: 'Press to select',
        });
    }
});

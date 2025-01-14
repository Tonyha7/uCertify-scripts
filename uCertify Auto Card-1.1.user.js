// ==UserScript==
// @name         Auto_Card
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enable and auto-click the "Correct" button on uCertify flash card pages
// @match        *.ucertify.com/app/?*get_flash_card*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function enableAndClickButton() {
        const correctButton = document.getElementById('correct');
        if (correctButton && correctButton.disabled) {
            correctButton.disabled = false;
            correctButton.click();
        }
    }

    const interval = setInterval(() => {
        enableAndClickButton();
    }, 500);

    setTimeout(() => {
        clearInterval(interval);
    }, 100000); // Stop after 100s
})();

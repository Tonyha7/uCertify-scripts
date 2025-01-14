// ==UserScript==
// @name         uCertify Helper
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Enjoy your study
// @match        *.ucertify.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let enableAutoCard = false;
    let enableMarkAsRead = false;

    function enableAndClickButton() {
        const correctButton = document.getElementById('correct');
        if (correctButton && correctButton.disabled) {
            correctButton.disabled = false;
            correctButton.click();
        }
    }

    function startAutoCard() {
        const interval = setInterval(() => {
            if (enableAutoCard) {
                enableAndClickButton();
            }
        }, 500);

        // Stop after 100 seconds
        setTimeout(() => {
            clearInterval(interval);
        }, 100000);
    }

    function clickMarkAsRead() {
        if (!enableMarkAsRead) return;

        const readingIndicators = document.querySelectorAll('.dropdown.reset_reading_time.pointer > div[data-bs-toggle="dropdown"]');
        readingIndicators.forEach(indicator => {
            if (!indicator.classList.contains('show')) {
                indicator.click();
            }
            const markAsReadLink = indicator.nextElementSibling?.querySelector('.dropdown-item.mark_read');
            if (markAsReadLink) {
                markAsReadLink.click();
            }
        });
    }

    function startMarkAsRead() {
        window.addEventListener('load', clickMarkAsRead);

        (function() {
            let originalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                let xhr = new originalXHR();
                let originalSend = xhr.send;
                xhr.send = function() {
                    this.addEventListener('load', function() {
                        clickMarkAsRead();
                    });
                    originalSend.apply(xhr, arguments);
                };
                return xhr;
            };
        })();

        setInterval(clickMarkAsRead, 500);
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.width = '200px';
        panel.style.height = '150px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '10000';
        panel.style.fontSize = '14px';
        panel.style.display = 'none';

        const autoCardToggle = document.createElement('label');
        autoCardToggle.innerHTML = `Auto Card: <input type="checkbox" ${enableAutoCard ? 'checked' : ''}>`;
        autoCardToggle.style.display = 'block';
        autoCardToggle.style.marginBottom = '5px';
        autoCardToggle.querySelector('input').addEventListener('change', (e) => {
            enableAutoCard = e.target.checked;
        });

        const markAsReadToggle = document.createElement('label');
        markAsReadToggle.innerHTML = `Mark as Read: <input type="checkbox" ${enableMarkAsRead ? 'checked' : ''}>`;
        markAsReadToggle.style.display = 'block';
        markAsReadToggle.querySelector('input').addEventListener('change', (e) => {
            enableMarkAsRead = e.target.checked;
        });

        panel.appendChild(autoCardToggle);
        panel.appendChild(markAsReadToggle);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        panel.appendChild(closeButton);
        document.body.appendChild(panel);

        const dragIcon = document.createElement('div');
        dragIcon.style.position = 'fixed';
        dragIcon.style.top = '10px';
        dragIcon.style.right = '10px';
        dragIcon.style.width = '40px';
        dragIcon.style.height = '40px';
        dragIcon.style.backgroundImage = 'url(https://rcdn.tonyha7.com/sliver__wolf_playing.jpg)';
        dragIcon.style.backgroundSize = 'cover';
        dragIcon.style.backgroundPosition = 'center';
        dragIcon.style.borderRadius = '50%';
        dragIcon.style.cursor = 'pointer';
        dragIcon.style.opacity = '0.5';
        dragIcon.style.zIndex = '10001';

        dragIcon.addEventListener('mouseover', () => {
            dragIcon.style.opacity = '1';
        });

        dragIcon.addEventListener('mouseout', () => {
            dragIcon.style.opacity = '0.5';
        });

        dragIcon.addEventListener('click', () => {
            if (panel.style.display === 'block') {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
            }
        });

        let isDragging = false;
        let offsetX, offsetY;

        dragIcon.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                dragIcon.style.top = `${y}px`;
                dragIcon.style.left = `${x}px`;
                panel.style.top = `${y}px`;
                panel.style.left = `${x + 50}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.body.appendChild(dragIcon);
    }

    // Init
    if (window.location.href.includes('get_flash_card')) {
        startAutoCard();
    }

    if (window.location.href.includes('func=ebook')) {
        startMarkAsRead();
    }

    createControlPanel();
})();

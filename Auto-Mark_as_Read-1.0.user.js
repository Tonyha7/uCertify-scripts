// ==UserScript==
// @name         Auto-Mark_as_Read
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically clicks "Mark as read" on uCertify ebooks
// @match        *.ucertify.com/app/*func=ebook*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function clickMarkAsRead() {
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
})();

/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/content/contentScript.ts ***!
  \**************************************/
(() => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === "clearJiraTop") {
            chrome.storage.local.get(["isClean"]).then((res) => {
                clearJiraTop({ isClean: message.isClean || res.isClean });
                sendResponse({ isClean: message.isClean || res.isClean });
            });
        }
        else if (message.action === "getProjectData") {
            let isProductExist = document.querySelector('a[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]');
            if (isProductExist) {
                let productId = isProductExist.childNodes[0].textContent;
                let productName = document.querySelector('h1[data-testid="issue.views.issue-base.foundation.summary.heading"]');
                sendResponse({ product: `${productId} ${productName.textContent}` });
            }
        }
        return true;
        function clearJiraTop({ isClean }) {
            let firstEle = document.querySelector('div[data-fullscreen-id="fullscreen-board-breadcrumbs"]');
            let nav = document.querySelector('div[data-fullscreen-id="fullscreen.page-container-v2.topnav"]');
            if (firstEle && nav) {
                let secondEle = firstEle.nextElementSibling;
                let thirdEle = secondEle.nextElementSibling;
                document.documentElement.style.cssText = `--topNavigationHeight: ${isClean ? 0 : 56}px; --leftSidebarWidth: 240px; --leftSidebarFlyoutWidth: 240px;`;
                nav.style.display = isClean ? "none" : "block";
                firstEle.style.display = isClean ? "none" : "block";
                secondEle.style.display = isClean ? "none" : "flex";
                thirdEle.style.marginTop = isClean ? "0" : "";
                chrome.storage.local.set({
                    isClean: isClean,
                });
            }
        }
    });
})();

/******/ })()
;
//# sourceMappingURL=contentScript.js.map
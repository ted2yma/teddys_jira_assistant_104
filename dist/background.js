/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./src/background/background.ts ***!
  \**************************************/
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && /^https/.test(tab.url)) {
        if (tab.url.includes("https://104corp.atlassian.net/jira")) {
            chrome.storage.local.get(["isClean"]).then((res) => {
                chrome.tabs.sendMessage(tabId, {
                    action: "clearJiraTop",
                    isClean: res.isClean,
                });
            });
        }
        else {
            console.log("you're not in.");
        }
    }
});

/******/ })()
;
//# sourceMappingURL=background.js.map
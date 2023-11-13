(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    
    switch (message.action) {
      case "clearJiraTop":
        clearJiraTop({ isClean: message.isClean });
        sendResponse({ isClean: message.isClean });
        return true;

      case "getProjectData":
        const product_raw = getProjectData();
        const product = product_raw.id ? `${product_raw.id} ${product_raw.name}` : ''
        sendResponse({ product });
        return true;

      default:
        break;
    }
  });
})();

function getProjectData(): { id: string|undefined, name: string|undefined } {
  let results: {id: string|undefined, name: string|undefined} = {id: undefined, name: undefined};
  let isProductExist = document.querySelector('a[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]') as HTMLElement;

  if (isProductExist) {
    let productId = isProductExist.childNodes[0].textContent;
    let productName = document.querySelector('h1[data-testid="issue.views.issue-base.foundation.summary.heading"]');

    results.id = productId;
    results.name = productName.textContent || undefined;
  }

  return results;
}

function clearJiraTop({ isClean }: { isClean: boolean }) {
  let firstEle = document.querySelector('div[data-fullscreen-id="fullscreen-board-breadcrumbs"]') as HTMLElement;
  let nav = document.querySelector('div[data-fullscreen-id="fullscreen.page-container-v2.topnav"]') as HTMLElement;

  if (firstEle && nav) {
    let secondEle = firstEle.nextElementSibling as HTMLElement;
    let thirdEle = secondEle.nextElementSibling as HTMLElement;

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
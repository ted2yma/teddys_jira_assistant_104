import { Box, Text } from "@chakra-ui/react";

function App() {
  return (
    <Box {...{
      className: `App`,
      p: 2
    }}>
      <Text>Thank you for using</Text>
      <Text>Teddys Jira Assistant</Text>
    </Box>
  );
}

export default App;

// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//   if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
//     if (tab.url.includes('https://104corp.atlassian.net')) {
      
//     } else {
//       console.log("you're not in.");
//     }
//   }
// });

// function clearJiraTop(){
//   let firstEle = document.querySelector('div[data-fullscreen-id="fullscreen-board-breadcrumbs"]');
//   let secondEle = firstEle.nextElementSibling;
//   let thirdEle = secondEle.nextElementSibling;
  
//   if (firstEle && secondEle && thirdEle) {
//       firstEle.innerHTML = '';
//       secondEle.innerHTML = '';
//       thirdEle.style.marginTop = 0;
//   }
// }

// "action": {
//   "default_popup": "popup.html",
//   "default_icon": {
//     "16": "images/icon16.png",
//     "48": "images/icon48.png",
//     "128": "images/icon128.png"
//   }
// },
// "icons": {
//   "16": "images/icon16.png",
//   "48": "images/icon48.png",
//   "128": "images/icon128.png"
// }
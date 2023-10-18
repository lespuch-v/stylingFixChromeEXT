chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

const practiceTest = 'https://etesty2.mdcr.cz/Test/TestPractise/';
const website = 'https://etesty2.mdcr.cz/Test/TestExam/';

chrome.action.onClicked.addListener(async (tab) => {
  // Checks if you're on one of those two websites (practiceTest or website).
  if (tab.url.startsWith(website) || tab.url.startsWith(practiceTest)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });

    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON';

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });
    if (nextState === 'ON') {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ['styles.css'],
        target: { tabId: tab.id },
      });
    } else if (nextState === 'OFF') {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ['styles.css'],
        target: { tabId: tab.id },
      });
    }
  }
});

// TODO: Add body FIX for the tests - White is to much
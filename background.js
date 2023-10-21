import { websites } from './src/modules/urlManager.js';
import { signalWordsDictionary } from './src/modules/signalWordsDictionary.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: 'OFF',
  });
});

// E-TEST-2 (Check)
chrome.action.onClicked.addListener(async (tab) => {
  // Checks if you're on one of those two websites (practiceTest or website).
  if (websites.some((website) => tab.url.startsWith(website))) {
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

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  });
});

// additional feature - count word and color code it randomly --- or not! Maybe there is another way

// Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getSignalWords') {
    sendResponse(signalWordsDictionary);
  }
});
let myWords = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle the message and optionally send a response
  if (message.greetings === 'hello') {
    sendResponse({ farewell: 'goodbye' });
  }
  console.log('Script finished!');
});

chrome.runtime.sendMessage({ type: 'getSignalWords' }, (response) => {
  myWords = response[0].Addition.en.words;
  document.addEventListener('DOMContentLoaded', wrapWordsWithHighlight);
});

// Function to recursively get all text nodes
function wrapWordsWithHighlight() {
  const words = ['and', 'a', 'the', 'no', 'yes', 'be', 'are', 'any', 'Otázka č. 1', 'Otázka', 'Otázky'];

  const regex = new RegExp(`\\b(${myWords.join('|')})\\b`, 'gi');

  function replaceTextWithHighlight(node) {
    const matches = node.textContent.match(regex);
    if (matches) {
      const span = document.createElement('span');
      span.innerHTML = node.textContent.replace(regex, '<span style="color: red!important">$1</span>');
      node.parentNode.replaceChild(span, node);
    }
  }

  function walkAndApply(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      replaceTextWithHighlight(node);
    } else {
      for (let child of node.childNodes) {
        walkAndApply(child);
      }
    }
  }

  walkAndApply(document.body);
}

function applyHighlightStyle() {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `.highlight { color: red!important; }`;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', wrapWordsWithHighlight);

// script.js

import { router } from './router.js'; // Router imported so you can use it to manipulate your SPA app here
const setState = router.setState;
let counter = 0;
let settingsElement = document.querySelector('[src="settings.svg"]');

function selectEntry(entryElement){
  setState(entryElement);
}

// Make sure you register your service worker here too

document.addEventListener('DOMContentLoaded', () => {
  fetch('https://cse110lab6.herokuapp.com/entries')
    .then(response => response.json())
    .then(entries => {
      entries.forEach(entry => {
        let newPost = document.createElement('journal-entry');
        newPost.entry = entry;
        document.querySelector('main').appendChild(newPost);

        newPost.addEventListener('click',() => {
          history.pushState("Entry" + entries.indexOf(entry),'Selected: Entry ' + entries.indexOf(entry), './#entry' + entries.indexOf(entry));
          selectEntry(newPost);
        });

      });
    });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

settingsElement.addEventListener('click', () => {
  history.pushState("Settings",'Selected: Settings','./#settings');
  selectEntry(settingsElement);
});

window.addEventListener('popstate', e => {
    selectEntry(e);
});
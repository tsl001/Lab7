// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
'https://cse110lab6.herokuapp.com/entries'
];

self.addEventListener('install', function(event) {
// Perform install steps

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {

event.respondWith(
    caches.match(event.request)
    .then(function(response) {
        // Cache hit - return response
        console.log("fetching")
        if (response) {
        console.log("Response received")
        return response;
        }

        return fetch(event.request).then(
            function(response) {
                // Check if we received a valid response
                if(!response || response.status !== 200 || response.type !== 'basic') {
                    console.log("Response received 200")
                    return response;
                }

                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                var responseToCache = response.clone();
                console.log("Response received 201")
                caches.open(CACHE_NAME)
                .then(function(cache) {
                    console.log("Response received 202")
                    cache.put(event.request, responseToCache);
                });


                return response;
            }
        );
    })
    );
});

self.addEventListener('activate', event => {
    console.log("Activated");
    event.waitUntil(clients.claim());
  });
  



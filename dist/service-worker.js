self.addEventListener("install", event => {
  console.log("Service Worker installing.");
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  console.log("Service Worker activating.");
});
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

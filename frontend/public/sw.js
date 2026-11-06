const CACHE_NAME = "khetbazaar-cache-v1";
const STATIC_ASSETS = [
  "/",
  "/crops",
  "/markets",
  "/farmers",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/favicon.ico",
  "/icons/icon-192x192.svg",
  "/icons/icon-512x512.svg",
];

// Install: Pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.warn("PWA Service Worker pre-cache warning:", err);
      })
  );
});

// Activate: Purge old cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Strategy based on request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or browser extension protocols
  if (request.method !== "GET" || !url.protocol.startsWith("http")) {
    return;
  }

  // Cache-first for images, fonts, and static chunks
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkRes) => {
          if (networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // Network-first for pages and API endpoints, fallback to cache
  event.respondWith(
    fetch(request)
      .then((networkRes) => {
        if (networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
        }
        return networkRes;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;

        // If user is navigating to a page offline and no cache match, return root cached page
        if (request.mode === "navigate") {
          const rootCached = await caches.match("/");
          if (rootCached) return rootCached;
        }

        return new Response("Offline — No network connection available", {
          status: 503,
          statusText: "Service Unavailable",
          headers: new Headers({ "Content-Type": "text/plain" }),
        });
      })
  );
});

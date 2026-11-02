
const CACHE_NAME = "haystack-creator-avatars";

// Temporarily hold responses until <img> confirms success
const pending = new Map();

// Deduplicate simultaneous requests
const inFlight = new Map();

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    url.hostname !== "yt3.ggpht.com" ||
    request.destination !== "image"
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1. Return cached image immediately
      const cached = await cache.match(request);
      if (cached) return cached;

      // 2. Avoid simultaneous duplicate requests
      let promise = inFlight.get(request.url);

      if (!promise) {
        promise = fetch(request);

        inFlight.set(request.url, promise);

        // Keep the response temporarily
        promise.then((response) => {
          pending.set(request.url, response.clone());
        }).catch(() => {});

        promise.finally(() => {
          inFlight.delete(request.url);
        }).catch(() => {});
      }

      return (await promise).clone();
    })()
  );
});

// React tells us when an image actually loaded
self.addEventListener("message", (event) => {
  if (event.data?.type !== "AVATAR_LOADED") return;

  const url = event.data.url;
  if (typeof url !== "string") return;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return;
  }

  if (parsed.hostname !== "yt3.ggpht.com") return;

  event.waitUntil(
    (async () => {
      const response = pending.get(url);
      if (!response) return;

      const cache = await caches.open(CACHE_NAME);

      // Cache only the confirmed-successful response
      await cache.put(url, response);

      pending.delete(url);
    })()
  );
});
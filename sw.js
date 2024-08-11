self.addEventListener("install", async (event) => {
    console.log('[Service Worker] install event life cycle!');
    self.skipWaiting();
    event.waitUntil(
        installStaticAssets()
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] activate event life cycle!');
    event.waitUntil(
        cacheCleanUp()
    );
    return self.clients.claim();
});

self.addEventListener('fetch', async (event) => {
    console.log('[Service Worker] fetch event life cycle!');

    event.respondWith(cacheFirst(event.request));
});

const CACHE_VERSION_KEY = 'sw-cache-v10';
async function installStaticAssets(){
    return caches.open(CACHE_VERSION_KEY).then((cache) => {
        cache.addAll([
            "https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.fluid.classless.min.css",
            "https://cdn.jsdelivr.net/npm/dexie@4.0.8/+esm",    
            "./",
            "./index.html",
            "./app.js",  
            "./helpers/database.js",
            "./helpers/install-sw.js",
            "./install-data/index.js",
            "./style.css",
            "./images/starwars_background.jpg",
            "./images/logo-site.png",
            "./images/favicon-16x16.png",
            "./images/favicon-32x32.png",
            "./images/favicon.ico",
        ])
    })
}

async function cacheCleanUp(){
    const cacheKeys = await caches.keys();
    const outdatedCache = (cacheKey)=>cacheKey !== CACHE_VERSION_KEY
    const purge = (cacheKey)=>caches.delete(cacheKey)
    cacheKeys.filter(outdatedCache).forEach(purge); 
}
async function cacheFirst(request){
    const cache = await caches.open(CACHE_VERSION_KEY);
    const response = await cache.match(request);
    if(response)
        return response;
    console.log('URL:',request.url);
    try {
        const networkResponse = await fetch(request);
        return networkResponse;
    } catch (error) {
        return new Response(`Network error happened: ${error}`, {
            status:408,
            headers:{"Content-Type":"text/plain"}
        });
    }
}
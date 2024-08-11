export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('../sw.js', { scope: "/" });
        } catch (error) {
            console.error('Failed to register service worker', error);
        }
    }
}
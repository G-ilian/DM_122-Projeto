export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        const sucess = ()=> console.log('Service Worker Registered');
        const failure = ()=> console.log('Service Worker Registration Failed');

        navigator.serviceWorker.register('./sw.js').then(sucess).catch(failure);
    }
}
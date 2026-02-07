// Register Service Worker
// Only register if served over HTTP/HTTPS (not file:// protocol)
if ('serviceWorker' in navigator && (location.protocol === 'http:' || location.protocol === 'https:')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
} else if (location.protocol === 'file:') {
  console.log('ServiceWorker not registered: file:// protocol not supported. Please use a web server (http/https).');
}

// PWA Install prompt
let deferredPrompt;
const installButton = document.getElementById('pwa-install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
  // Only prevent the mini-infobar if we have an install button to show
  if (installButton) {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show install button
    installButton.style.display = 'block';
  } else {
    // If no install button, allow the default banner to show
    deferredPrompt = e;
  }
});

// Handle install button click
if (installButton) {
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      deferredPrompt = null;
      installButton.style.display = 'none';
    }
  });
}

// Track if app is installed
window.addEventListener('appinstalled', () => {
  console.log('PWA was installed');
  if (installButton) {
    installButton.style.display = 'none';
  }
});

// Detect if running as PWA
function isPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         window.navigator.standalone === true;
}

if (isPWA()) {
  console.log('Running as PWA');
  document.body.classList.add('pwa-mode');
}

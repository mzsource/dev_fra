// Service Worker pour Disciple Vertueux PWA
const CACHE_NAME = 'disciple-vertueux-v1.0.1';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/script.js',
  './manifest.json',
  './data/dias_365.json',
  './images/cover_illustration_new.png',
  './images/cover_illustration.png',
  './images/january_header.png',
  './images/daily_accent_1.png',
  './images/daily_accent_2.png',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap',
  'https://fonts.gstatic.com/s/dancingscript/v25/If2cXTr6YS-zF4S-kcSWSVi_sxjsohD9F50Ruu7BMSo3Sup8.woff2'
];

// Instalar Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Mise en cache des fichiers');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('Service Worker: Algunos archivos no pudieron ser cacheados:', err);
          // Continuar aunque algunos archivos fallen
          return Promise.resolve();
        });
      })
      .then(() => {
        console.log('Service Worker: Installation complète');
        return self.skipWaiting();
      })
  );
});

// Activar Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker: Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complète');
      return self.clients.claim();
    })
  );
});

// Interceptar requests (estrategia Cache First)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // S'il est en cache, le retourner
        if (response) {
          return response;
        }
        
        // S'il n'est pas en cache, faire un fetch
        return fetch(event.request).then(response => {
          // Vérifier si c'est une réponse valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Cloner la réponse
          const responseToCache = response.clone();
          
          // Ajouter au cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Si tout échoue, afficher la page hors ligne personnalisée
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Manejar mensajes del cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notificaciones push (para recordatorios diarios)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'C\'est l\'heure de votre dévotionnel quotidien 🙏',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Lire Maintenant',
        icon: './icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Plus Tard',
        icon: './icons/icon-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Disciple Vertueux', options)
  );
});

// Manejar clicks en notificaciones
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    // Ouvrir l'application au jour actuel
    event.waitUntil(
      clients.openWindow('./#dia-' + new Date().getDate())
    );
  } else if (event.action === 'close') {
    // Seulement fermer la notification
    return;
  } else {
    // Clic sur la notification principale
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Sincronización en background
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Sincronizar datos del usuario (hábitos, anotaciones, etc.)
  return new Promise((resolve) => {
    console.log('Service Worker: Synchronisation en arrière-plan');
    resolve();
  });
}

// Logging para debugging
console.log('Service Worker: Chargé correctement');

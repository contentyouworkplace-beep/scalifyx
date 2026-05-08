// Service Worker for handling web push notifications
self.addEventListener('push', (event) => {
  const options = {
    badge: '/favicon.ico',
    tag: 'scalify-notification',
    requireInteraction: false,
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      options.title = payload.title || 'Scalify';
      options.body = payload.body || 'New notification';
      options.icon = '/favicon.ico';
      if (payload.data) {
        options.data = payload.data;
      }
    } catch {
      options.title = 'Scalify';
      options.body = event.data.text();
    }
  }

  event.waitUntil(self.registration.showNotification(options.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data?.link) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if window is already open
        for (let client of clientList) {
          if (client.url === event.notification.data.link && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not found
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.link);
        }
      })
    );
  }
});

self.addEventListener('push', function(event) {
  if (!event.data) return;

  let data = {};
  try { data = event.data.json(); } catch { data = { title: 'Scalify', body: event.data.text() }; }

  const options = {
    body: data.body || '',
    icon: '/icon.png',
    badge: '/icon.png',
    tag: data.tag || 'scalify-notification',
    data: data.data || {},
    vibrate: [200, 100, 200],
    actions: data.actions || [],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Scalify', options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCGyiEUvWbGjoGo8C6Vp_2afFUs8lQDfIw",
  authDomain: "fixpair-606c8.firebaseapp.com",
  projectId: "fixpair-606c8",
  storageBucket: "fixpair-606c8.firebasestorage.app",
  messagingSenderId: "827439833710",
  appId: "1:827439833710:web:a77dbd173624ce0cd3fc7f",
  measurementId: "G-633FNVWVTE"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    'Fixpair Consultation Alert';

  const body =
    payload.notification?.body ||
    payload.data?.message ||
    payload.data?.body ||
    'You have a new update';

  const icon =
    payload.notification?.icon ||
    payload.data?.callerAvatar ||
    payload.data?.image ||
    '/favicon.png';

  const notificationOptions = {
    body: body,
    icon: icon,
    badge: '/favicon.png',
    data: payload.data || {},
    tag:
      payload.data?.sessionId ||
      payload.data?.consultationId ||
      'fixpair-background-push',
    requireInteraction:
      payload.data?.type === 'incoming-call' ||
      payload.data?.type === 'call' ||
      false,
  };

  self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl =
    event.notification.data?.url ||
    (event.notification.data?.sessionId
      ? `/call?sessionId=${event.notification.data.sessionId}`
      : '/consultant/overview');

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/consultant') || client.url.includes('/call')) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

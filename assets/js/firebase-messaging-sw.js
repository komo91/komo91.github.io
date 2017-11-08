importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js')

firebase.initializeApp({
  'messagingSenderId': '416971531445'
})

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)

  // Customize notification here
  const notification = payload.data

  const notificationTitle = notification.title

  const notificationOptions = {
    body: notification.body,
    icon: notification.icon,
    badge: '/images/notification/badge.png',
    tag: 'exampleTag',
    vibrate: [150,100,150,100,200]
  }

  return self.registration.showNotification(notificationTitle,
      notificationOptions)
})

console.log('Service Worker Works');

self.addEventListener('push', e => {
    const data = e.data.json();
    console.log(data);
    console.log('Notification Received');
    self.registration.showNotification(data.title, {
        body: data.message,
        icon: '/css/Logo3.png'  // URL completa del ícono
    });
});

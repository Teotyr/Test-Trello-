const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    // [::1] IPv6 yerel ana bilgisayar adresidir.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 IPv4 için yerel ana bilgisayar olarak kabul edilir
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    // URL oluşturucu, SW'yi destekleyen tüm tarayıcılarda bulunur.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // PUBLIC_URL farklı bir kaynaktaysa hizmet çalışanımız çalışmaz
      // sayfamızın sunulduğu yerden. Bunun için bir CDN kullanılırsa bu olabilir.
      // varlıklara hizmet et; https://github.com/facebook/create-react-app/issues/2374 adresine bakın
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Bu localhost üzerinde çalışıyor. Bir servis çalışanının hala var olup olmadığını kontrol edelim.
        checkValidServiceWorker(swUrl, config);

        // geliştiricilere işaret ederek localhost'a bazı ek günlükler ekleyin.
        // servis çalışanı/PWA belgeleri.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            "This web app is being served cache-first by a service " +
              "worker. To learn more, visit https://bit.ly/CRA-PWA"
          );
        });
      } else {
        // localhost değil. Sadece servis çalışanını kaydedin
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Bu noktada, güncellenmiş önbelleğe alınmış içerik getirildi,
              // ancak önceki hizmet çalışanı daha yaşlı olana hizmet etmeye devam edecek
              // tüm istemci sekmeleri kapatılana kadar içerik.
              console.log(
                "New content is available and will be used when all " +
                  "tabs for this page are closed. See https://bit.ly/CRA-PWA."
              );

              // Geri aramayı yürüt
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log("Content is cached for offline use.");

              // Geri aramayı yürüt
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error("Error during service worker registration:", error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Servis çalışanının bulunup bulunmadığını kontrol edin. Sayfayı yeniden yükleyemezse.
  fetch(swUrl)
    .then((response) => {
      // Servis çalışanının var olduğundan ve gerçekten bir JS dosyası aldığımızdan emin olun.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // Servis çalışanı bulunamadı. Muhtemelen farklı bir uygulama. Sayfayı yenile.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Servis görevlisi bulundu. Normal olarak devam edin.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}

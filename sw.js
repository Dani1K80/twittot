importScripts('js/sw-utils.js');

console.log("entro en el SW");

//creo las constante de los nombres de nuestas caches

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//creo APP_SHELL de los archivos propios

const APP_SHELL = [

    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'

];

//creo APP_SHELL de los archivos externos

const APP_SHELL_INMUTABLE = [

    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'


];


/*INSTALACION DE NUESTRA CACHE*/

self.addEventListener('install', evt => {


    const cacheStatic = caches.open(STATIC_CACHE).then(cache => {

        cache.addAll(APP_SHELL);

    });


    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => {

        cache.addAll(APP_SHELL_INMUTABLE);

    });

    evt.waitUntil(Promise.all([cacheStatic, cacheInmutable]))

});

/* ACTIVO */

self.addEventListener('activate', e => {

    const deleteCache = caches.keys().then(keys => {

        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        })
    })

    e.waitUntil(deleteCache);


});

self.addEventListener('fetch', e => {

    const respuesta = caches.match(e.request)
        .then(res => {

            if (res) {
                return res
            } else {

                return fetch(e.request)
                    .then(newResp => {
                        return uploadCacheDynamic(DYNAMIC_CACHE, e.request, newResp)
                    })

            }

        });


    e.respondWith(respuesta);

});


function limpiarCache(cacheName, numeroItems) {


    caches.open(cacheName)
        .then(cache => {

            return cache.keys()
                .then(keys => {

                    if (keys.length > numeroItems) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numeroItems));
                    }
                });


        });
}




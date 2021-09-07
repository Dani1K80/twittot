function uploadCacheDynamic( nameCache, req, resp) {

    if(resp.ok){

        caches.open(nameCache).then(cache =>{

            cache.put(req, resp.clone());
            return resp.clone
        })
    }else{

        return resp
    }

}
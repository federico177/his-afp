## Task 4: Il Tunnel per il Database

### 1. Differenza tra Protocollo TCP ed HTTP
Un database relazionale come PostgreSQL non comunica in HTTP (livello applicativo), ma tramite un protocollo nativo basato su **TCP puro** (livello di trasporto). Per questo motivo, l'inoltro non è gestibile tramite i soliti blocchi `server` in `default.conf`.

L'inoltro è stato implementato aggiungendo il blocco **`stream`** nel file di configurazione radice di NGINX (`gateway/nginx.conf`):

```nginx
stream {
    server {
        listen 5432;
        proxy_pass db:5432;
    }
}
# Relazione Tecnica: Gestione del Traffico e "Cambio di Binario" delle API

## 1. Obiettivo e Contesto Aziendale
Per superare il problema del "Single Point of Failure" (SPOF) del backend durante le fasi di rilascio e aggiornamento del software HIS-AFP, l'architettura è stata evoluta integrando una strategia di **Blue-Green Deployment**. Questo approccio permette di testare ed eseguire il deployment di una nuova versione del software senza interrompere il lavoro dei medici e dei portali sanitari, azzerando i tempi di disservizio (*Zero-Downtime*).

---

## 2. Modifiche Infrastrutturali (Docker Compose)
Il servizio backend unico e generico è stato rimosso dal file `docker-compose.yml` e sdoppiato in due istanze parallele, indipendenti e isolate all'interno della rete protetta `backend-net`:

* **`sio-backend-blue`**: Rappresenta l'istanza di produzione corrente e stabile.
* **`sio-backend-green`**: Rappresenta la nuova istanza aggiornata, pronta a ricevere il traffico una volta verificata la stabilità.

Entrambi i servizi sono configurati con la variabile d'ambiente `DB_HOST: db`. Questo garantisce che entrambe le istanze puntino contemporaneamente allo **stesso identico database relazionale** (`sio-postgres`), rispettando il vincolo di non applicare modifiche strutturali o duplicazioni al livello dati.

---

## 3. Procedura Tecnica di Switch (Il "Cambio di Binario")
Inizialmente, l'infrastruttura è configurata per instradare tutto il traffico applicativo verso il motore Blue. All'interno del file unico di configurazione del Gateway (Nginx), le richieste dirette a `/api/` sono mappate come segue:

```nginx
location /api/ {
    rewrite ^/api/(.*)$ /$1 break;
    proxy_pass http://sio-backend-blue:3000; # Traffico sul binario Blue
}
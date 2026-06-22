# Relazione Tecnica: Migrazione Architetturale e Isolamento Rete HIS-AFP

## 1. Obiettivo della Migrazione
L'obiettivo di questo intervento è la transizione da un'architettura di rete "piatta" (dove tutti i servizi condividevano lo stesso spazio virtuale) a un'architettura **Multi-Tier segregata**. Questo cambiamento è fondamentale per garantire la conformità agli audit di sicurezza sanitari e proteggere i dati sensibili dei pazienti (GDPR / Accreditamento Regionale).

## 2. Analisi dell'Architettura (Prima e Dopo)

### Prima della Migrazione
Tutti i container (`fe-prod`, `fe-test`, `fe-sio`, `backend`, `db`) erano attestati sulla rete di default di Docker. 
* **Vulnerabilità:** In caso di compromissione di uno dei frontend (es. tramite una falla XSS o Remote Code Execution), un attaccante avrebbe potuto effettuare un attacco diretto o un movimento laterale verso il database (`sio-postgres`) sulla porta 5432.
* **Esposizione:** Il database esponeva la porta 5432 direttamente sull'host esterno, esponendosi a tentativi di brute force esterni a Docker.

### Dopo la Migrazione
L'infrastruttura è stata divisa in due reti isolate:
1. `frontend-net`: Dedicata esclusivamente alla distribuzione dei contenuti (i tre container di frontend).
2. `backend-net`: Rete protetta e isolata che ospita il logica di business (`sio-backend`) e la persistenza dei dati (`sio-postgres`).

Il container `sio-gateway` (Nginx) è l'**unico punto di controllo e di accesso (Reverse Proxy)** ed è configurato come ponte su entrambe le reti.

* **Hardening eseguito:** Rimossa la direttiva `ports` dal servizio `db`. Il database ora non è più raggiungibile dall'esterno dell'host.
* **Isolamento:** È tecnicamente impossibile per un processo nei container frontend vedere o pingare il database, poiché si trovano su segmenti di rete Docker (bridge) separati a livello di protocollo.

---

## 3. Guida ai Test di Validazione

Per verificare il corretto isolamento e il rispetto dei vincoli, eseguire i seguenti comandi:

### Test 1: Verifica Isolamento Frontend -> Database (Deve fallire)
Eseguire una risoluzione DNS del database partendo dal container di produzione. Il comando **deve restituire un errore** (es. *bad address*):
```bash
docker exec -it sio-fe-prod ping sio-postgres
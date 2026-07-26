## Task 3: Zero-Downtime Backend & Database Migration

### 1. Obiettivo e Architettura
Per evitare disservizi e blocchi operativi durante gli aggiornamenti del software, l'architettura del backend è stata evoluta secondo la strategia **Blue/Green Deployment**:
* **`sio-backend-blue`**: Rappresenta l'istanza attualmente attiva e in produzione.
* **`sio-backend-green`**: Rappresenta la nuova versione del codice pronta a subentrare.

Entrambe le istanze risiedono nella rete protetta `backend-net`, sono collegate allo stesso container di Database (`db`) e **non espongono alcuna porta** verso l'esterno.

---

### 2. Gestione dello Switch sul Gateway (NGINX)
Il passaggio del traffico da un'istanza all'altra è gestito dal Gateway (`sio-gateway`) tramite la definizione di un gruppo **`upstream`** all'interno del file di configurazione (`default.conf`):

```nginx
upstream sio_backend_servers {
    server sio-backend-blue:3000;
    # server sio-backend-green:3000; # Decommentare per passare a Green
}
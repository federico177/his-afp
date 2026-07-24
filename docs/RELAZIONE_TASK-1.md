# Relazione Tecnica: Modulo Gestione Personale Sanitario

## 1. Struttura dei File
Il modulo è stato organizzato seguendo la struttura preesistente del progetto:

* **`src/app/core/models/user.interface.ts`**: Contiene le interfacce per i dati dell'utente (`User`), dei ruoli e della risposta standard del server (`APIResponse`).
* **`src/app/core/models/user.service.ts`**: Il servizio che si occupa di fare le chiamate HTTP al server e di gestire lo stato degli utenti.
* **`src/app/features/gestione-personale/`**: La cartella della nuova pagina che contiene il file logico (`gestione-personale.ts`), il template grafico (`gestione-personale.html`) e il file di test (`gestione-personale.spec.ts`).

---

## 2. Logica e Scelte Tecniche

### A. Tipizzazione dei Dati
* I ruoli sono limitati rigidamente a tre opzioni tramite un tipo unione: `'DOC' | 'INF' | 'AMM'`.
* Tutte le chiamate HTTP e le risposte del server sono state tipizzate per evitare l'uso di dati generici non controllati.
* La gestione degli errori di rete usa la classe standard `HttpErrorResponse`.

### B. Gestione dello Stato con i Signals
Per rendere la pagina reattiva ed efficiente, è stata usata la tecnologia dei **Signals** di Angular:
* Il servizio memorizza l'elenco degli utenti in un Signal privato.
* Il componente legge questo elenco tramite una proprietà `computed` in sola lettura (`usersSignal`).
* Nella tabella HTML, i dati vengono mostrati usando il nuovo ciclo `@for (...; track user.id)`, che aggiorna lo schermo in tempo reale solo quando i dati cambiano davvero.

### C. Form Reattivo e Controllo dello Username
La registrazione dei collaboratori usa un **Reactive Form**:
* Il campo **Username** ha un controllo asincrono (`AsyncValidator`) che interroga il server in tempo reale per verificare se il nome è già stato scelto da un altro utente.
* Per evitare di inviare troppe chiamate al server mentre l'utente scrive, è stato inserito un tempo di attesa di 300 millisecondi (`timer`) e un sistema (`switchMap`) che annulla le vecchie verifiche se l'utente digita una nuova lettera.

### D. Routing e Caricamento Ottimizzato
La pagina è stata collegata al file delle rotte principali (`app.routes.ts`) tramite **Lazy Loading**. La pagina viene scaricata dal browser solo quando l'utente clicca effettivamente sul percorso `/gestione-personale`:

## 3. Accessibilità e Test
* **Accessibilità:** Tutte le etichette (`<label>`) del form sono collegate ai rispettivi campi di testo tramite l'attributo `for`, rispettando le regole di accessibilità per gli screen reader.
* **Test Unitari:** Il file `.spec.ts` configura un ambiente di test isolato che simula le risposte di rete, garantendo che il componente venga creato correttamente senza errori.
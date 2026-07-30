# 📄 Documentazione Task 2: Ricerca e Precompilazione Paziente

## 🎯 Obiettivo
Aggiungere una fase di ricerca prima di registrare un paziente. 

Serve a evitare di inserire duplicati nel sistema:
1. L'operatore cerca se il paziente esiste già.
2. Se esiste, lo seleziona e il form si compila da solo con i suoi dati.
3. Se non esiste, l'operatore può inserire un nuovo paziente da zero.

---

## 🧩 Moduli Creati e Modificati

### 1. `RicercaPazienteComponent` (Componente di ricerca)
* **Cosa fa:** Mostra la schermata per cercare il paziente.
* **Come funziona:**
  * Permette di cercare per **Codice Fiscale** oppure per **Nome, Cognome e Data di Nascita**.
  * Usa gli **Angular Signals** per gestire i risultati e lo stato di caricamento.
  * Invia al componente padre il paziente scelto oppure il segnale per crearne uno nuovo.

### 2. `AccettazionePz` (Form principale)
* **Cosa fa:** Riceve i dati dalla ricerca e gestisce il form finale.
* **Come funziona:**
  * Tiene nascosto il form di accettazione finché non si fa una ricerca.
  * Popola in automatico i campi del form con `.patchValue()` quando si seleziona un paziente trovato.

### 3. `PazientiService` (Servizio dati)
* **Cosa fa:** Si occupa di inviare le richieste HTTP e filtrare la lista dei pazienti.
* **Come funziona:** Cerca tra i dati archiviati senza fare distinzione tra maiuscole e minuscole.

---

## ✅ Punti Tecnici Rispettati
* **Zero `any`:** Tutto il codice TypeScript è tipizzato al 100%.
* **Nessun errore di compilazione:** Gestiti correttamente i tipi degli errori delle validazioni (`ValidationErrors`).
* **Grafica integrata:** Usati i componenti PrimeNG (`p-button`, `p-fieldset`, `p-datepicker`, `pInputText`) per mantenere lo stesso stile del progetto.
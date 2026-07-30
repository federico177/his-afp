import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { APIResponse } from '../models/APIResponse.model';
import { PazienteDTO, PatientAdmission, PatientAdmissionRes } from './Pazienti.model';

export interface SearchCriteria {
  codiceFiscale?: string;
  nome?: string;
  cognome?: string;
  dataNascita?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PazientiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000';

  public selectedPatientSignal = signal<PazienteDTO | null>(null);

  /**
   * Cerca nell'anagrafica / accessi esistenti in base al CF o al tris (Nome, Cognome, Data Nascita)
   */
  searchPatients(criteria: SearchCriteria): Observable<PazienteDTO[]> {
    return this.http.get<APIResponse<PazienteDTO[]>>(`${this.baseUrl}/admissions`).pipe(
      map((response: APIResponse<PazienteDTO[]>): PazienteDTO[] => {
        const admissions: PazienteDTO[] = response.data ?? [];
        return admissions.filter((paziente: PazienteDTO): boolean => {
          // 1. Ricerca per Codice Fiscale
          if (criteria.codiceFiscale && criteria.codiceFiscale.trim() !== '') {
            return paziente.codiceFiscale?.toUpperCase() === criteria.codiceFiscale.trim().toUpperCase();
          }
          // 2. Ricerca per Nome, Cognome e Data Nascita
          if (criteria.nome && criteria.cognome && criteria.dataNascita) {
            return (
              paziente.nome?.toLowerCase().includes(criteria.nome.trim().toLowerCase()) &&
              paziente.cognome?.toLowerCase().includes(criteria.cognome.trim().toLowerCase()) &&
              paziente.dataNascita === criteria.dataNascita
            );
          }
          return false;
        });
      })
    );
  }

  /**
   * Registra un nuovo accesso (POST /admissions)
   */
  createAdmission(payload: PatientAdmission): Observable<APIResponse<PatientAdmissionRes>> {
    const apiPayload = {
      nome: payload.anagrafica.nome,
      cognome: payload.anagrafica.cognome,
      dataNascita: payload.anagrafica.dataNascita,
      codiceFiscale: payload.anagrafica.codiceFiscale,
      sex: payload.anagrafica.sesso,
      patologiaCode: payload.sanitaria.patologia,
      codiceColore: payload.sanitaria.codiceColore,
      modalitaArrivoCode: payload.sanitaria.modArrivo,
      noteTriage: payload.sanitaria.noteTriage
    };

    return this.http.post<APIResponse<PatientAdmissionRes>>(`${this.baseUrl}/admissions`, apiPayload);
  }
}
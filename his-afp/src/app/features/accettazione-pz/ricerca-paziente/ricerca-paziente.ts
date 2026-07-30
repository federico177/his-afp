import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PazientiService, SearchCriteria } from '../../../core/Pazienti/pazienti.service';
import { PazienteDTO } from '../../../core/Pazienti/Pazienti.model';

import { InputText } from 'primeng/inputtext';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { Fieldset } from 'primeng/fieldset';

@Component({
  selector: 'app-ricerca-paziente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputText, Button, Message, DatePicker, Fieldset],
  templateUrl: './ricerca-paziente.html',
  styleUrls: ['./ricerca-paziente.scss']
})
export class RicercaPazienteComponent {
  public maxDate: Date = new Date();
  private readonly fb = inject(FormBuilder);
  private readonly pazientiService = inject(PazientiService);

  @Output() patientSelected = new EventEmitter<PazienteDTO>();
  @Output() createNewPatient = new EventEmitter<void>();

  public searchMode = signal<'CF' | 'ANAGRAFICA'>('CF');
  public searchResults = signal<PazienteDTO[]>([]);
  public isSearching = signal<boolean>(false);
  public hasSearched = signal<boolean>(false);

  public searchForm: FormGroup = this.fb.group({
    codiceFiscale: ['', [Validators.pattern(/^[A-Z0-9]{16}$/i)]],
    nome: [''],
    cognome: [''],
    dataNascita: ['']
  });

  public switchMode(mode: 'CF' | 'ANAGRAFICA'): void {
    this.searchMode.set(mode);
    this.searchResults.set([]);
    this.hasSearched.set(false);
    this.searchForm.reset();
  }

  public onSearch(): void {
    if (this.searchForm.invalid) return;

    this.isSearching.set(true);
    this.hasSearched.set(false);

    const formValues = this.searchForm.value;

    const criteria: SearchCriteria = {
      codiceFiscale: this.searchMode() === 'CF' ? formValues.codiceFiscale : undefined,
      nome: this.searchMode() === 'ANAGRAFICA' ? formValues.nome : undefined,
      cognome: this.searchMode() === 'ANAGRAFICA' ? formValues.cognome : undefined,
      dataNascita: this.searchMode() === 'ANAGRAFICA' ? formValues.dataNascita : undefined
    };

    this.pazientiService.searchPatients(criteria).subscribe({
      next: (results: PazienteDTO[]): void => {
        this.searchResults.set(results);
        this.isSearching.set(false);
        this.hasSearched.set(true);
      },
      error: (): void => {
        this.searchResults.set([]);
        this.isSearching.set(false);
        this.hasSearched.set(true);
      }
    });
  }

  public selectPatient(patient: PazienteDTO): void {
    this.patientSelected.emit(patient);
  }

  public startNewPatient(): void {
    this.createNewPatient.emit();
  }
}
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { GestioneRisorse } from '../../core/Risorse/gestione-risorse';
import { InputText } from 'primeng/inputtext';
import { FormBuilder, ReactiveFormsModule, Validators, ValidationErrors } from '@angular/forms';
import { Button } from 'primeng/button';
import { Message } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { Textarea } from 'primeng/textarea';
import { Fieldset } from 'primeng/fieldset';
import { PatientManager } from '../../core/Pazienti/patient-manager';
import { PatientAdmission, PazienteDTO } from '../../core/Pazienti/Pazienti.model';
import { RicercaPazienteComponent } from './ricerca-paziente/ricerca-paziente';
@Component({
  selector: 'his-accettazione-pz',
  imports: [
    InputText,
    ReactiveFormsModule,
    Button,
    Message,
    DatePicker,
    SelectModule,
    Textarea,
    Fieldset,
    RicercaPazienteComponent
  ],
  templateUrl: './accettazione-pz.html',
  styleUrl: './accettazione-pz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccettazionePz {
  gestioneRisorse = inject(GestioneRisorse);
  patientManager = inject(PatientManager);

  // Signal per gestire la visualizzazione del form (nascosto fino a dopo la ricerca)
  readonly showForm = signal<boolean>(false);
  readonly isExistingPatient = signal<boolean>(false);

  readonly maxDate = new Date();
  readonly sexOption = [
    {
      code: 'M',
      desc: 'Maschio',
    },
    {
      code: 'F',
      desc: 'Femmina',
    },
  ];

  readonly #fb = inject(FormBuilder);
  paziente = this.#fb.group({
    anagrafica: this.#fb.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      dataNascita: ['', [Validators.required]],
      codiceFiscale: [
        '',
        [Validators.required, Validators.pattern('[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]')],
      ],
      sesso: ['', [Validators.required]],
    }),
    sanitaria: this.#fb.group({
      patologia: ['', [Validators.required]],
      codiceColore: ['', [Validators.required]],
      modArrivo: ['', [Validators.required]],
      noteTriage: ['', [Validators.required, Validators.maxLength(500)]],
    }),
  });


  onPatientSelected(patient: PazienteDTO): void {
    this.isExistingPatient.set(true);
    this.showForm.set(true);

    // Converte la stringa data/ISO in un oggetto Date se necessario per il PrimeNG DatePicker
    const dataNascitaObj: Date | string = patient.dataNascita ? new Date(patient.dataNascita) : '';

    this.paziente.patchValue({
      anagrafica: {
        nome: patient.nome,
        cognome: patient.cognome,
        dataNascita: dataNascitaObj as unknown as string,
        codiceFiscale: patient.codiceFiscale,
        sesso: patient.sex || 'M',
      },
      sanitaria: {
        patologia: patient.patologiaCode || '',
        codiceColore: patient.coloreCode || '',
        modArrivo: patient.modalitaArrivoCode || '',
        noteTriage: '',
      },
    });
  }

  onCreateNewPatient(): void {
    this.isExistingPatient.set(false);
    this.showForm.set(true);
    this.paziente.reset();
  }

  checkFormControl(control: string): boolean | null | undefined {
    const fc = this.paziente.get(control);
    return fc?.invalid && (fc.touched || fc.dirty);
  }

  checkFormControlError(control: string, err: string): ValidationErrors | null {
    const fc = this.paziente.get(control);
    if (fc && fc.hasError(err)) {
      return fc.getError(err) as ValidationErrors;
    }
    return null;
  }

  onSubmit(): void {
    if (this.paziente.valid) {
      console.log(this.paziente.value);
      this.patientManager.admitPatient(this.paziente.value as PatientAdmission);
    } else {
      this.paziente.markAllAsTouched();
    }
  }
}
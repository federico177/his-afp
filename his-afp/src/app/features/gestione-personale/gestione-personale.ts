import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { UserService } from '../../core/models/user.service';
import { UserRole } from '../../core/models/user.interface';

@Component({
  selector: 'app-gestione-personale',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestione-personale.html',
  styleUrls: ['./gestione-personale.scss']
})
export class GestionePersonaleComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  protected userService = inject(UserService); 

  protected usersSignal = this.userService.users;

  protected roles: UserRole[] = ['DOC', 'INF', 'AMM'];

  protected staffForm = this.fb.group({
    username: [
      '', 
      [Validators.required, Validators.minLength(3)],
      [this.usernameUniqueValidator()]
    ],
    password: ['', [Validators.required, Validators.minLength(4)]],
    role: ['INF' as UserRole, [Validators.required]]
  });

  ngOnInit(): void {
    this.userService.loadAllUsers();
  }

  private usernameUniqueValidator() {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      return timer(300).pipe(
        switchMap(() => this.userService.checkUsernameAvailability(control.value)),
        map((isAvailable: boolean) => {
          return isAvailable ? null : { usernameTaken: true };
        }),
        catchError(() => of(null))
      );
    };
  }

  protected onSubmit(): void {
    if (this.staffForm.valid) {
      const formValue = this.staffForm.getRawValue();
      
      this.userService.createUser(formValue).subscribe({
        next: (res) => {
          if (res.status === 'success') {
            this.staffForm.reset({ role: 'INF' });
          }
        },
        error: (err) => console.error("Errore durante l'inserimento", err)
      });
    }
  }
}
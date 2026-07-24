import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GestionePersonaleComponent } from './gestione-personale';

describe('GestionePersonaleComponent', () => {
  let component: GestionePersonaleComponent;
  let fixture: ComponentFixture<GestionePersonaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionePersonaleComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionePersonaleComponent);
    component = fixture.componentInstance;
    
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
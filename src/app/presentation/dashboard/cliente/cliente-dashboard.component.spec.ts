import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteDashboardComponent } from './cliente-dashboard.component';
import { NavigationStart, NavigationEnd, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { ListarPropiedadesDisponiblesUseCase } from '@application/use-cases/propiedad/istar-propiedades-disponibles.usecase';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppTexts } from '@core/constants/app.texts';

const mockPropiedades = [{ id: 1, titulo: 'Propiedad demo' }];

const mockListarPropiedades = {
  execute: jest.fn(() => of(mockPropiedades))
};

const mockAuthSession = {
  getNombre: jest.fn(() => 'Cliente Demo')
};

const mockSnackBar = { open: jest.fn() };
const mockSesionService = {};

const mockRouterEvents$ = new Subject();
const mockRouter = {
  events: mockRouterEvents$.asObservable()
} as Partial<Router>;

describe('ClienteDashboardComponent', () => {
  let component: ClienteDashboardComponent;
  let fixture: ComponentFixture<ClienteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClienteDashboardComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter }
      ]
    });

    TestBed.overrideComponent(ClienteDashboardComponent, {
      set: {
        providers: [
          { provide: ListarPropiedadesDisponiblesUseCase, useValue: mockListarPropiedades },
          { provide: AuthStorageAdapter, useValue: mockAuthSession },
          { provide: SesionService, useValue: mockSesionService },
          { provide: MatSnackBar, useValue: mockSnackBar }
        ]
      }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(ClienteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el nombre desde AuthStorageAdapter', () => {
    expect(component.nombre).toBe('Cliente Demo');
  });

  it('debería reaccionar a NavigationStart y NavigationEnd', () => {
    mockRouterEvents$.next(new NavigationStart(1, '/loading'));
    expect(component.isGlobalLoading).toBe(true);

    mockRouterEvents$.next(new NavigationEnd(1, '/loading', '/loaded'));
    expect(component.isGlobalLoading).toBe(false);
  });

  it('debería cargar propiedades al iniciar y actualizar indicadores', async () => {
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.propiedades.length).toBeGreaterThan(0);
    expect(component.isCargandoPropiedades).toBe(false);
  });

  it('debería manejar errores al refrescar el listado de propiedades', async () => {
    mockListarPropiedades.execute.mockReturnValueOnce(throwError(() => new Error('Error')));
    component.refrescarListado();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      expect.stringContaining(AppTexts.ERROR_CHARGE_PROPERTYS),
      'Cerrar',
      expect.objectContaining({ duration: 3000 })
    );
    expect(component.isCargandoPropiedades).toBe(false);
  });
});

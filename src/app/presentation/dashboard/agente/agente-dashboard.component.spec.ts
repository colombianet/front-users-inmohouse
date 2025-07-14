import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgenteDashboardComponent } from './agente-dashboard.component';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { AgenteSyncService } from './services/agente-sync.service';
import { AgenteClientesService } from './services/agente-clientes.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

const mockAuthSession = { getNombre: jest.fn(() => 'Agente Demo') };
const mockSesionService = {};
const mockSyncService = {
  sincronizar: jest.fn(() => of({ clientes: [], propiedades: [] }))
};

const mockDialogRef = {
  afterClosed: jest.fn(() => of(true)),
  close: jest.fn(),
  componentInstance: {
    propiedadCreada: of(true),
    usuarioCreado: of(true),
    propiedades: [],
    push: jest.fn()
  }
};

const mockDialog = {
  open: jest.fn(() => mockDialogRef)
};

const mockClienteService = {
  eliminar: jest.fn((id: number, cb: () => void) => cb()),
  editar: jest.fn((cliente: any, cb: () => void) => cb()),
  abrirFormulario: jest.fn((cb: () => void) => cb())
};

const mockRouterEvents$ = new Subject();
const mockRouter = {
  events: mockRouterEvents$.asObservable()
} as Partial<Router>;

describe('AgenteDashboardComponent', () => {
  let component: AgenteDashboardComponent;
  let fixture: ComponentFixture<AgenteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AgenteDashboardComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        provideRouter([]),
        { provide: Router, useValue: mockRouter }
      ]
    });

    TestBed.overrideComponent(AgenteDashboardComponent, {
      set: {
        providers: [
          { provide: AgenteSyncService, useValue: mockSyncService },
          { provide: AgenteClientesService, useValue: mockClienteService },
          { provide: AuthStorageAdapter, useValue: mockAuthSession },
          { provide: SesionService, useValue: mockSesionService },
          { provide: MatDialog, useValue: mockDialog },
          { provide: MatSnackBar, useValue: {} }
        ]
      }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AgenteDashboardComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el nombre desde AuthStorageAdapter', () => {
    expect(component.nombre).toBe('Agente Demo');
  });

  it('debería reaccionar a eventos NavigationStart y NavigationEnd', () => {
    mockRouterEvents$.next(new NavigationStart(1, '/cargando'));
    expect(component.isGlobalLoading).toBe(true);

    mockRouterEvents$.next(new NavigationEnd(1, '/cargando', '/cargando'));
    expect(component.isGlobalLoading).toBe(false);
  });

  it('debería llamar a sincronizar al iniciar y llenar los arreglos', () => {
    expect(component.isCargandoClientes).toBe(false);
    expect(component.isCargandoPropiedades).toBe(false);
    expect(component.propiedades).toEqual([]);
    expect(component.dataSourceClientes.data).toEqual([]);
  });

  it('debería abrir el formulario para agregar cliente y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.abrirFormularioCliente();
    expect(mockClienteService.abrirFormulario).toHaveBeenCalledWith(expect.any(Function));
    expect(spy).toHaveBeenCalled();
  });

  it('debería editar un cliente y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    const dummyCliente = { id: 1, nombre: 'Demo', email: '', roles: [] };
    component.editarCliente(dummyCliente);
    expect(mockClienteService.editar).toHaveBeenCalledWith(dummyCliente, expect.any(Function));
    expect(spy).toHaveBeenCalled();
  });

  it('debería eliminar un cliente y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.eliminarCliente(5);
    expect(mockClienteService.eliminar).toHaveBeenCalledWith(5, expect.any(Function));
    expect(spy).toHaveBeenCalled();
  });
});

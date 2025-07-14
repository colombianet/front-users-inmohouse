import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { NavigationStart, NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { of, Subject } from 'rxjs';
import { Propiedad } from '@domain/models/propiedad.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthStorageAdapter } from '@infrastructure/adapters/auth-storage.adapter';
import { SesionService } from '@application/services/sesion.service';
import { AdminResumenService } from './services/admin-resumen.service';
import { AdminSyncService } from './services/admin-sync.service';
import { AdminPropiedadService } from './services/admin-propiedad.service';
import { AdminUsuarioService } from './services/admin-usuario.service';
import { EliminarPropiedadUseCase } from '@application/use-cases/propiedad/eliminar-propiedad.usecase';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

const mockUsuarios = [
  { id: 1, nombre: 'User Uno', email: 'uno@example.com', roles: ['CLIENTE'] },
  { id: 2, nombre: 'User Dos', email: 'dos@example.com', roles: ['ADMIN'] }
];

const mockPropiedades: Propiedad[] = [{
  id: 10,
  titulo: 'Propiedad Uno',
  descripcion: '',
  tipo: '',
  precio: 0,
  ubicacion: '',
  estado: ''
}];

const mockSyncService = {
  sincronizar: () => of({ usuarios: mockUsuarios, propiedades: mockPropiedades })
};

const mockResumenService = {
  generarResumen: jest.fn(() => [{ agente: 'Agente Uno', cantidad: 1 }])
};

const mockPropiedadService = {
  eliminarPropiedad: jest.fn((id, usecase, cb) => cb()),
  abrirFormularioEdicion: jest.fn((prop, cb) => cb()),
  abrirAsignarDialog: jest.fn((prop, cb) => cb()),
  desasignarConConfirmacion: jest.fn((prop, cb) => cb())
};

const mockUsuarioService = {
  abrirFormularioUsuario: jest.fn((cb) => cb()),
  editarUsuario: jest.fn((usuario, permiso, cb) => cb()),
  confirmarEliminarUsuario: jest.fn((usuario, permiso, cb) => cb())
};

const mockEliminarPropiedadUseCase = { execute: jest.fn() };
const mockDialogRef: any = {
  componentInstance: {},
  close: jest.fn()
};

const mockDialog = { open: jest.fn(() => mockDialogRef) };
const mockSnackBar = { open: jest.fn() };

const mockAuthSession = {
  getNombre: jest.fn(() => 'Admin Demo'),
  esAgente: jest.fn(() => false)
};

const mockRouterEvents$ = new Subject();
const mockRouter = {
  events: mockRouterEvents$.asObservable()
} as Partial<Router>;

const mockActivatedRoute = {};

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AdminDashboardComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        RouterModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthStorageAdapter, useValue: mockAuthSession },
        { provide: SesionService, useValue: {} },
        { provide: AdminSyncService, useValue: mockSyncService },
        { provide: AdminResumenService, useValue: mockResumenService },
        { provide: AdminPropiedadService, useValue: mockPropiedadService },
        { provide: AdminUsuarioService, useValue: mockUsuarioService },
        { provide: EliminarPropiedadUseCase, useValue: mockEliminarPropiedadUseCase },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    });

    TestBed.overrideComponent(AdminDashboardComponent, {
      set: {
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute }
        ]
      }
    });

    await TestBed.compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente y cargar datos iniciales', () => {
    expect(component).toBeTruthy();
    expect(component.nombre).toBe('Admin Demo');
    expect(component.propiedades.length).toBe(1);
    expect(component.usuarios.length).toBe(2);
    expect(component.resumenAgentes.length).toBe(1);
    expect(component.isCargandoPropiedades).toBe(false);
    expect(component.isCargandoUsuarios).toBe(false);
  });

  it('debería alternar el estado isGlobalLoading según eventos del router', () => {
    mockRouterEvents$.next(new NavigationStart(1, '/loading'));
    expect(component.isGlobalLoading).toBe(true);

    mockRouterEvents$.next(new NavigationEnd(1, '/loading', '/loaded'));
    expect(component.isGlobalLoading).toBe(false);
  });

  it('debería abrir el formulario de usuario y actualizar el estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.abrirFormularioUsuario();
    expect(mockUsuarioService.abrirFormularioUsuario).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('debería editar un usuario con permisos correctos y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.editarUsuario(mockUsuarios[0]);
    expect(mockUsuarioService.editarUsuario).toHaveBeenCalledWith(
      mockUsuarios[0],
      true,
      expect.any(Function)
    );
    expect(spy).toHaveBeenCalled();
  });

  it('debería confirmar la eliminación del usuario y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.eliminarUsuario(1);
    expect(mockUsuarioService.confirmarEliminarUsuario).toHaveBeenCalledWith(
      mockUsuarios[0],
      true,
      expect.any(Function)
    );
    expect(spy).toHaveBeenCalled();
  });

  it('debería eliminar propiedad desde la tabla y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.eliminarPropiedadDesdeTabla(10);
    expect(mockPropiedadService.eliminarPropiedad).toHaveBeenCalledWith(
      10,
      expect.any(Function),
      expect.any(Function)
    );
    expect(spy).toHaveBeenCalled();
  });

  it('debería editar una propiedad y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.editarPropiedad(mockPropiedades[0]);
    expect(mockPropiedadService.abrirFormularioEdicion).toHaveBeenCalledWith(
      mockPropiedades[0],
      expect.any(Function)
    );
    expect(spy).toHaveBeenCalled();
  });

  it('debería asignar propiedad desde la tabla y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.asignarPropiedadDesdeTabla(mockPropiedades[0]);
    expect(mockPropiedadService.abrirAsignarDialog).toHaveBeenCalledWith(
      mockPropiedades[0],
      expect.any(Function)
    );
    expect(spy).toHaveBeenCalled();
  });

  it('debería desasignar propiedad y actualizar estado', () => {
    const spy = jest.spyOn(component as any, 'actualizarEstado');
    component.desasignarPropiedad(mockPropiedades[0]);
    expect(mockPropiedadService.desasignarConConfirmacion).toHaveBeenCalledWith(
      mockPropiedades[0],
      expect.any(Function)
    );
    expect(spy).toHaveBeenCalled();
  });
});

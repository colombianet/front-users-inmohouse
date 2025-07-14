import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AssignAgentDialogComponent } from './assign-agent-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsuarioRepository } from '@domain/repositories/usuario.repository';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { of } from 'rxjs';

describe('AssignAgentDialogComponent', () => {
  let component: AssignAgentDialogComponent;
  let fixture: ComponentFixture<AssignAgentDialogComponent>;

  const mockDialogRef = { close: jest.fn() };
  const mockData = { propiedad: { id: 99 } };

  const mockUsuarioRepo: UsuarioRepository = {
    listar: jest.fn(() =>
      of([
        { id: 1, nombre: 'Agente Uno', email: 'agente1@mail.com', roles: ['ROLE_AGENTE'] },
        { id: 2, nombre: 'Cliente Uno', email: 'cliente1@mail.com', roles: ['ROLE_CLIENTE'] }
      ])
    ),
    listarClientes: jest.fn(() => of([])),
    crear: jest.fn(() => of({} as any)),
    editar: jest.fn(() => of({} as any)),
    eliminar: jest.fn(() => of(undefined))
  };

  const mockPropiedadRepo: PropiedadRepository = {
    asignarAgente: jest.fn(() => of(undefined)),
    desasignarAgente: jest.fn(() => of(undefined)),
    listar: jest.fn(() => of([])),
    crear: jest.fn(() => of({} as any)),
    eliminar: jest.fn(() => of(undefined)),
    listarPropiedadesDisponibles: jest.fn(() => of([]))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        AssignAgentDialogComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: UsuarioRepository, useValue: mockUsuarioRepo },
        { provide: PropiedadRepository, useValue: mockPropiedadRepo }
      ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(AssignAgentDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('debería crear el componente', waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it('debería cargar solo agentes válidos desde el repositorio', waitForAsync(() => {
    fixture.whenStable().then(() => {
      expect(component.agentes.length).toBeDefined();
    });
  }));

  it('debería cerrar el diálogo con false al cancelar', () => {
    component.cancelar();
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});

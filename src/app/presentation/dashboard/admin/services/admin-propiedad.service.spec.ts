import { TestBed } from '@angular/core/testing';
import { AdminPropiedadService } from './admin-propiedad.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PropiedadRepository } from '@domain/repositories/propiedad.repository';
import { of } from 'rxjs';

describe('AdminPropiedadService', () => {
  let service: AdminPropiedadService;
  const mockDialogRef = { afterClosed: jest.fn(() => of(true)), close: jest.fn() };
  const mockDialog = { open: jest.fn(() => mockDialogRef) };
  const mockSnackBar = { open: jest.fn() };
  const mockRepo = { desasignarAgente: jest.fn(() => of(undefined)) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminPropiedadService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: PropiedadRepository, useValue: mockRepo }
      ]
    });

    service = TestBed.inject(AdminPropiedadService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería abrir el formulario de edición y ejecutar callback si se confirma', () => {
    const callback = jest.fn();
    service.abrirFormularioEdicion({ id: 1 } as any, callback);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockDialogRef.afterClosed).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('debería confirmar eliminación y ejecutar función si se confirma', () => {
    const eliminarFn = jest.fn();
    service.confirmarEliminar(42, eliminarFn);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(eliminarFn).toHaveBeenCalledWith(42);
  });

  it('debería abrir diálogo para asignar agente y mostrar mensaje si se confirma', () => {
    const callback = jest.fn();
    service.abrirAsignarDialog({ id: 1 } as any, callback);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('debería cancelar desasignación si propiedad no tiene agente', () => {
    service.desasignarConConfirmacion({ id: 1 } as any, jest.fn());
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(mockDialog.open).not.toHaveBeenCalled();
  });

  it('debería confirmar desasignación y ejecutar callback', () => {
    const propiedad = { id: 7, agente: { nombre: 'Oscar' } };
    const callback = jest.fn();
    service.desasignarConConfirmacion(propiedad as any, callback);
    expect(mockRepo.desasignarAgente).toHaveBeenCalledWith(7);
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('debería confirmar eliminación vía caso de uso y ejecutar callback', () => {
    const callback = jest.fn();
    const eliminarUseCase = jest.fn(() => of(undefined));
    service.eliminarPropiedad(88, eliminarUseCase, callback);
    expect(eliminarUseCase).toHaveBeenCalledWith(88);
    expect(mockSnackBar.open).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });
});

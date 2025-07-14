import { TestBed } from '@angular/core/testing';
import { AdminUsuarioService } from './admin-usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EliminarUsuarioUseCase } from '@application/use-cases/usuario/eliminar-usuario.usecase';
import { AppTexts } from '@core/constants/app.texts';
import { of } from 'rxjs';

describe('AdminUsuarioService', () => {
  let service: AdminUsuarioService;
  const mockDialogRef = { afterClosed: jest.fn(() => of(true)), close: jest.fn() };
  const mockDialog = { open: jest.fn(() => mockDialogRef) };
  const mockSnackBar = { open: jest.fn() };
  const mockEliminarUseCase = { execute: jest.fn(() => of(undefined)) };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminUsuarioService,
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: EliminarUsuarioUseCase, useValue: mockEliminarUseCase }
      ]
    });

    service = TestBed.inject(AdminUsuarioService);
    jest.clearAllMocks();
  });

  it('debería crear el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('debería abrir el formulario de usuario y ejecutar callback si se confirma', () => {
    const callback = jest.fn();
    service.abrirFormularioUsuario(callback);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('no debería abrir el formulario si no puede editar', () => {
    const callback = jest.fn();
    service.editarUsuario({ id: 1 } as any, false, callback);
    expect(mockDialog.open).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('debería abrir el formulario de edición si puede editar y ejecutar callback', () => {
    const callback = jest.fn();
    service.editarUsuario({ id: 1 } as any, true, callback);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(callback).toHaveBeenCalled();
  });

  it('no debería abrir confirmación si no hay usuario o no puede eliminar', () => {
    const callback = jest.fn();
    service.confirmarEliminarUsuario(undefined as any, true, callback);
    service.confirmarEliminarUsuario({ id: 1 } as any, false, callback);
    expect(mockDialog.open).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('debería confirmar eliminación y ejecutar el caso de uso y callback', () => {
    const callback = jest.fn();
    service.confirmarEliminarUsuario({ id: 5 } as any, true, callback);
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockEliminarUseCase.execute).toHaveBeenCalledWith(5);
    expect(mockSnackBar.open).toHaveBeenCalledWith(
      AppTexts.DELETE_USER_SUCCESS,
      'Cerrar',
      expect.objectContaining({ duration: 3000 })
    );
    expect(callback).toHaveBeenCalled();
  });
});
